import { 
  BotConfig, 
  BotContext, 
  Signal, 
  BotExecution, 
  BotPerformance,
  BotEngine,
  Strategy,
  BotError,
  StrategyError,
  ExecutionError,
  RiskLimitError,
  ConfigurationError
} from './types'
import { exchangeManager } from '@/lib/exchanges/manager'
import { db } from '@/lib/db'
import { BotStatus, OrderType, OrderSide, ExecutionStatus } from '@prisma/client'
import { StrategyFactory } from './strategies'

export class BitcoinTradingEngine implements BotEngine {
  private runningBots: Map<string, BotConfig> = new Map()
  private strategies: Map<string, Strategy> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private marketDataCache: Map<string, any[]> = new Map()

  constructor() {
    this.initializeStrategies()
  }

  private initializeStrategies(): void {
    // Initialize all available strategies
    const availableStrategies = StrategyFactory.getAvailableStrategies()
    
    for (const strategyType of availableStrategies) {
      try {
        const strategy = StrategyFactory.createStrategy(strategyType)
        this.strategies.set(strategyType, strategy)
        console.log(`Initialized strategy: ${strategyType}`)
      } catch (error) {
        console.error(`Failed to initialize strategy ${strategyType}:`, error)
      }
    }
  }

  async startBot(botId: string): Promise<void> {
    try {
      // Get bot from database
      const bot = await db.tradingBot.findUnique({
        where: { id: botId },
        include: {
          user: true,
          exchangeAccount: {
            include: {
              exchange: true
            }
          }
        }
      })

      if (!bot) {
        throw new ConfigurationError(`Bot not found: ${botId}`, botId)
      }

      if (bot.status === BotStatus.RUNNING) {
        throw new ConfigurationError(`Bot is already running: ${botId}`, botId)
      }

      // Parse bot configuration
      const config: BotConfig = {
        id: bot.id,
        name: bot.name,
        description: bot.description || undefined,
        type: bot.type,
        strategy: bot.strategy,
        market: {
          symbol: bot.strategy.symbol || 'BTCUSDT',
          exchangeAccountId: bot.exchangeAccountId!
        },
        risk: bot.config.risk || {},
        execution: bot.config.execution || {
          orderType: OrderType.MARKET,
          timeInForce: 'GTC',
          slippageTolerance: 0.01,
          retryAttempts: 3,
          cooldownPeriod: 5000
        },
        status: BotStatus.RUNNING,
        createdAt: bot.createdAt,
        updatedAt: bot.updatedAt
      }

      // Validate configuration
      this.validateBotConfig(config)

      // Initialize strategy
      let strategy: Strategy
      try {
        strategy = StrategyFactory.createStrategy(config.strategy.type)
        await strategy.initialize(config.strategy)
      } catch (error) {
        throw new ConfigurationError(`Failed to initialize strategy ${config.strategy.type}: ${error.message}`, botId)
      }

      // Store bot in memory
      this.runningBots.set(botId, config)

      // Start bot execution loop
      await this.startBotExecution(botId, config, strategy)

      // Update bot status in database
      await db.tradingBot.update({
        where: { id: botId },
        data: {
          status: BotStatus.RUNNING,
          startedAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Log execution
      await this.logExecution(botId, 'START', { config }, ExecutionStatus.SUCCESS)

      console.log(`Bot started: ${botId}`)
    } catch (error) {
      await this.logExecution(botId, 'START', { error: error.message }, ExecutionStatus.FAILED)
      throw error
    }
  }

  async stopBot(botId: string): Promise<void> {
    try {
      const bot = this.runningBots.get(botId)
      if (!bot) {
        throw new ConfigurationError(`Bot is not running: ${botId}`, botId)
      }

      // Stop execution interval
      const interval = this.intervals.get(botId)
      if (interval) {
        clearInterval(interval)
        this.intervals.delete(botId)
      }

      // Cleanup strategy
      try {
        const strategy = StrategyFactory.createStrategy(bot.strategy.type)
        await strategy.cleanup()
      } catch (error) {
        console.error(`Error cleaning up strategy for bot ${botId}:`, error)
      }

      // Remove from running bots
      this.runningBots.delete(botId)

      // Update bot status in database
      await db.tradingBot.update({
        where: { id: botId },
        data: {
          status: BotStatus.STOPPED,
          stoppedAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Log execution
      await this.logExecution(botId, 'STOP', {}, ExecutionStatus.SUCCESS)

      console.log(`Bot stopped: ${botId}`)
    } catch (error) {
      await this.logExecution(botId, 'STOP', { error: error.message }, ExecutionStatus.FAILED)
      throw error
    }
  }

  async pauseBot(botId: string): Promise<void> {
    try {
      const bot = this.runningBots.get(botId)
      if (!bot) {
        throw new ConfigurationError(`Bot is not running: ${botId}`, botId)
      }

      // Stop execution interval
      const interval = this.intervals.get(botId)
      if (interval) {
        clearInterval(interval)
        this.intervals.delete(botId)
      }

      // Update bot status in database
      await db.tradingBot.update({
        where: { id: botId },
        data: {
          status: BotStatus.PAUSED,
          updatedAt: new Date()
        }
      })

      // Log execution
      await this.logExecution(botId, 'PAUSE', {}, ExecutionStatus.SUCCESS)

      console.log(`Bot paused: ${botId}`)
    } catch (error) {
      await this.logExecution(botId, 'PAUSE', { error: error.message }, ExecutionStatus.FAILED)
      throw error
    }
  }

  async resumeBot(botId: string): Promise<void> {
    try {
      // Get bot from database
      const bot = await db.tradingBot.findUnique({
        where: { id: botId }
      })

      if (!bot) {
        throw new ConfigurationError(`Bot not found: ${botId}`, botId)
      }

      if (bot.status !== BotStatus.PAUSED) {
        throw new ConfigurationError(`Bot is not paused: ${botId}`, botId)
      }

      // Get bot config from running bots or recreate it
      let config = this.runningBots.get(botId)
      if (!config) {
        config = {
          id: bot.id,
          name: bot.name,
          description: bot.description || undefined,
          type: bot.type,
          strategy: bot.strategy,
          market: {
            symbol: bot.strategy.symbol || 'BTCUSDT',
            exchangeAccountId: bot.exchangeAccountId!
          },
          risk: bot.config.risk || {},
          execution: bot.config.execution || {
            orderType: OrderType.MARKET,
            timeInForce: 'GTC',
            slippageTolerance: 0.01,
            retryAttempts: 3,
            cooldownPeriod: 5000
          },
          status: BotStatus.RUNNING,
          createdAt: bot.createdAt,
          updatedAt: bot.updatedAt
        }
        this.runningBots.set(botId, config)
      }

      // Get strategy
      let strategy: Strategy
      try {
        strategy = StrategyFactory.createStrategy(config.strategy.type)
        await strategy.initialize(config.strategy)
      } catch (error) {
        throw new ConfigurationError(`Failed to initialize strategy ${config.strategy.type}: ${error.message}`, botId)
      }

      // Start execution loop
      await this.startBotExecution(botId, config, strategy)

      // Update bot status in database
      await db.tradingBot.update({
        where: { id: botId },
        data: {
          status: BotStatus.RUNNING,
          updatedAt: new Date()
        }
      })

      // Log execution
      await this.logExecution(botId, 'RESUME', {}, ExecutionStatus.SUCCESS)

      console.log(`Bot resumed: ${botId}`)
    } catch (error) {
      await this.logExecution(botId, 'RESUME', { error: error.message }, ExecutionStatus.FAILED)
      throw error
    }
  }

  async getBotStatus(botId: string): Promise<BotStatus> {
    const bot = await db.tradingBot.findUnique({
      where: { id: botId },
      select: { status: true }
    })

    if (!bot) {
      throw new ConfigurationError(`Bot not found: ${botId}`, botId)
    }

    return bot.status
  }

  async getBotPerformance(botId: string): Promise<BotPerformance> {
    const trades = await db.trade.findMany({
      where: { botId },
      orderBy: { createdAt: 'asc' }
    })

    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        sortinoRatio: 0,
        calmarRatio: 0,
        totalReturn: 0,
        annualizedReturn: 0,
        volatility: 0
      }
    }

    // Calculate performance metrics
    const profits = trades.map(trade => {
      const entryPrice = trade.price
      const exitPrice = trade.price // This would need to be calculated from trade pairs
      const amount = trade.amount
      const fee = trade.fee || 0
      
      return (exitPrice - entryPrice) * amount - fee
    })

    const winningTrades = profits.filter(p => p > 0)
    const losingTrades = profits.filter(p => p < 0)
    
    const totalProfit = winningTrades.reduce((sum, p) => sum + p, 0)
    const totalLoss = Math.abs(losingTrades.reduce((sum, p) => sum + p, 0))
    const netProfit = totalProfit - totalLoss
    
    const winRate = winningTrades.length / trades.length
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0
    
    // Calculate drawdown (simplified)
    let maxDrawdown = 0
    let peak = 0
    let cumulative = 0
    
    for (const profit of profits) {
      cumulative += profit
      if (cumulative > peak) {
        peak = cumulative
      }
      const drawdown = (peak - cumulative) / peak
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    }

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      totalProfit,
      totalLoss,
      netProfit,
      profitFactor,
      maxDrawdown,
      sharpeRatio: 0, // Would need more data for proper calculation
      sortinoRatio: 0,
      calmarRatio: 0,
      totalReturn: netProfit,
      annualizedReturn: 0,
      volatility: 0
    }
  }

  async getBotExecutions(botId: string): Promise<BotExecution[]> {
    const executions = await db.botExecution.findMany({
      where: { botId },
      orderBy: { createdAt: 'desc' }
    })

    return executions.map(exec => ({
      id: exec.id,
      botId: exec.botId,
      action: exec.action as any,
      status: exec.status as any,
      details: exec.details,
      error: exec.error || undefined,
      timestamp: exec.createdAt
    }))
  }

  async updateBotConfig(botId: string, config: Partial<BotConfig>): Promise<void> {
    const bot = await db.tradingBot.findUnique({
      where: { id: botId }
    })

    if (!bot) {
      throw new ConfigurationError(`Bot not found: ${botId}`, botId)
    }

    // Update bot configuration
    await db.tradingBot.update({
      where: { id: botId },
      data: {
        strategy: config.strategy ? { ...bot.strategy, ...config.strategy } : bot.strategy,
        config: config.execution || config.risk ? { 
          ...bot.config, 
          risk: config.risk || bot.config.risk,
          execution: config.execution || bot.config.execution
        } : bot.config,
        updatedAt: new Date()
      }
    })

    // If bot is running, restart it with new configuration
    if (this.runningBots.has(botId)) {
      await this.stopBot(botId)
      await this.startBot(botId)
    }

    console.log(`Bot configuration updated: ${botId}`)
  }

  private async startBotExecution(botId: string, config: BotConfig, strategy: Strategy): Promise<void> {
    const interval = setInterval(async () => {
      try {
        await this.executeBotIteration(botId, config, strategy)
      } catch (error) {
        console.error(`Bot execution error (${botId}):`, error)
        await this.logExecution(botId, 'TRADE', { error: error.message }, ExecutionStatus.FAILED)
      }
    }, config.execution.cooldownPeriod || 5000)

    this.intervals.set(botId, interval)
  }

  private async executeBotIteration(botId: string, config: BotConfig, strategy: Strategy): Promise<void> {
    // Get current market data
    const marketData = await this.getMarketData(config.market.exchangeAccountId, config.market.symbol)
    
    // Get account balance
    const balances = await exchangeManager.getAccountBalances(config.market.exchangeAccountId)
    const balance = balances.reduce((acc, b) => {
      acc[b.asset] = b.free
      return acc
    }, {} as Record<string, number>)

    // Get current price
    const currentPrice = marketData[marketData.length - 1]?.close || 0

    // Create bot context
    const context: BotContext = {
      bot: config,
      marketData: marketData.map(d => ({
        symbol: d.symbol,
        timestamp: d.timestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
        volume: d.volume
      })),
      currentPrice,
      balance,
      positions: {}, // Would need to fetch from exchange
      orders: [], // Would need to fetch from exchange
      trades: [], // Would need to fetch from database
      timestamp: Date.now()
    }

    // Execute strategy
    const signal = await strategy.execute(context)

    // Process signal
    if (signal.type !== 'HOLD') {
      await this.processSignal(botId, signal, context)
    }
  }

  private async processSignal(botId: string, signal: Signal, context: BotContext): Promise<void> {
    if (signal.type === 'BUY') {
      await this.executeBuyOrder(botId, signal, context)
    } else if (signal.type === 'SELL') {
      await this.executeSellOrder(botId, signal, context)
    }
  }

  private async executeBuyOrder(botId: string, signal: Signal, context: BotContext): Promise<void> {
    const config = context.bot
    const risk = config.risk
    const execution = config.execution

    // Calculate order size based on risk management
    const orderAmount = this.calculateOrderSize(signal, context, risk)

    if (orderAmount <= 0) {
      throw new RiskLimitError('Insufficient balance or risk limits exceeded', botId)
    }

    // Create order
    const orderRequest = {
      symbol: config.market.symbol,
      side: OrderSide.BUY,
      type: execution.orderType,
      amount: orderAmount,
      price: signal.type === 'BUY' ? context.currentPrice * (1 + execution.slippageTolerance) : undefined,
      timeInForce: execution.timeInForce
    }

    // Execute order with retries
    const order = await this.executeWithRetry(
      () => exchangeManager.createOrder(config.market.exchangeAccountId, orderRequest),
      execution.retryAttempts
    )

    // Log trade
    await this.logExecution(botId, 'TRADE', {
      signal,
      order,
      amount: orderAmount,
      price: context.currentPrice
    }, ExecutionStatus.SUCCESS)

    console.log(`Buy order executed for bot ${botId}: ${orderAmount} ${config.market.symbol}`)
  }

  private async executeSellOrder(botId: string, signal: Signal, context: BotContext): Promise<void> {
    const config = context.bot
    const risk = config.risk
    const execution = config.execution

    // Calculate order size (position size)
    const orderAmount = this.calculatePositionSize(signal, context, risk)

    if (orderAmount <= 0) {
      throw new RiskLimitError('No position to sell or risk limits exceeded', botId)
    }

    // Create order
    const orderRequest = {
      symbol: config.market.symbol,
      side: OrderSide.SELL,
      type: execution.orderType,
      amount: orderAmount,
      price: signal.type === 'SELL' ? context.currentPrice * (1 - execution.slippageTolerance) : undefined,
      timeInForce: execution.timeInForce
    }

    // Execute order with retries
    const order = await this.executeWithRetry(
      () => exchangeManager.createOrder(config.market.exchangeAccountId, orderRequest),
      execution.retryAttempts
    )

    // Log trade
    await this.logExecution(botId, 'TRADE', {
      signal,
      order,
      amount: orderAmount,
      price: context.currentPrice
    }, ExecutionStatus.SUCCESS)

    console.log(`Sell order executed for bot ${botId}: ${orderAmount} ${config.market.symbol}`)
  }

  private calculateOrderSize(signal: Signal, context: BotContext, risk: any): number {
    // Simple risk-based position sizing
    const availableBalance = context.balance['USDT'] || 0
    const riskAmount = availableBalance * (risk.riskPerTrade || 0.02) // 2% risk per trade
    const orderAmount = riskAmount / context.currentPrice

    return Math.min(orderAmount, risk.maxPositionSize || availableBalance)
  }

  private calculatePositionSize(signal: Signal, context: BotContext, risk: any): number {
    // Calculate position size based on current holdings
    const asset = context.bot.market.symbol.replace('USDT', '')
    const currentPosition = context.balance[asset] || 0
    
    return Math.min(currentPosition, risk.maxPositionSize || currentPosition)
  }

  private async getMarketData(exchangeAccountId: string, symbol: string): Promise<any[]> {
    const cacheKey = `${exchangeAccountId}-${symbol}`
    
    // Check cache first
    if (this.marketDataCache.has(cacheKey)) {
      const cached = this.marketDataCache.get(cacheKey)!
      if (cached.length > 0) {
        return cached
      }
    }

    try {
      // Get market data from exchange
      const adapter = await exchangeManager.getAdapter(exchangeAccountId)
      const candlesticks = await adapter.getCandlesticks(symbol, '1m', 100)

      // Cache the data
      this.marketDataCache.set(cacheKey, candlesticks)

      return candlesticks
    } catch (error) {
      console.error('Error fetching market data:', error)
      return []
    }
  }

  private async executeWithRetry<T>(fn: () => Promise<T>, maxRetries: number): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    throw new Error('Max retries exceeded')
  }

  private async logExecution(botId: string, action: string, details: any, status: ExecutionStatus): Promise<void> {
    await db.botExecution.create({
      data: {
        botId,
        action,
        details,
        status,
        error: status === ExecutionStatus.FAILED ? details.error : null
      }
    })
  }

  private validateBotConfig(config: BotConfig): void {
    if (!config.market.symbol) {
      throw new ConfigurationError('Market symbol is required', config.id)
    }

    if (!config.market.exchangeAccountId) {
      throw new ConfigurationError('Exchange account ID is required', config.id)
    }

    if (!config.strategy.type) {
      throw new ConfigurationError('Strategy type is required', config.id)
    }

    // Check if strategy type is supported
    const availableStrategies = StrategyFactory.getAvailableStrategies()
    if (!availableStrategies.includes(config.strategy.type.toLowerCase())) {
      throw new ConfigurationError(`Unsupported strategy type: ${config.strategy.type}`, config.id)
    }

    if (!config.risk.maxPositionSize || config.risk.maxPositionSize <= 0) {
      throw new ConfigurationError('Invalid max position size', config.id)
    }

    if (config.risk.riskPerTrade && (config.risk.riskPerTrade <= 0 || config.risk.riskPerTrade > 1)) {
      throw new ConfigurationError('Risk per trade must be between 0 and 1', config.id)
    }

    // Validate strategy-specific configuration
    const validation = StrategyFactory.createStrategy(config.strategy.type)
    // Note: Strategy validation would be implemented here
  }

  // Get available strategies
  getAvailableStrategies(): string[] {
    return StrategyFactory.getAvailableStrategies()
  }

  // Get strategy description
  getStrategyDescription(type: string): string {
    return StrategyFactory.getStrategyDescription(type)
  }

  // Get default strategy configuration
  getStrategyConfig(type: string): any {
    return StrategyFactory.getStrategyConfig(type)
  }

  // Validate strategy configuration
  validateStrategyConfig(type: string, config: any): { valid: boolean; errors: string[] } {
    return StrategyFactory.validateConfig(type, config)
  }

  // Cleanup method
  async shutdown(): Promise<void> {
    // Stop all running bots
    const stopPromises = Array.from(this.runningBots.keys()).map(botId => 
      this.stopBot(botId).catch(error => {
        console.error(`Error stopping bot ${botId}:`, error)
      })
    )

    await Promise.all(stopPromises)
    console.log('Bot engine shutdown complete')
  }
}

// Singleton instance
export const botEngine = new BitcoinTradingEngine()