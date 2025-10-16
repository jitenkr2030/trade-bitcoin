import { BaseStrategy } from './base-strategy'
import { BotContext, Signal, ArbitrageStrategyConfig, StrategyError } from '../types'
import { exchangeManager } from '@/lib/exchanges/manager'

interface ArbitrageOpportunity {
  buyExchange: string
  sellExchange: string
  buyPrice: number
  sellPrice: number
  priceDifference: number
  profitPercent: number
  volume: number
  estimatedProfit: number
  fees: number
  netProfit: number
  timestamp: number
}

interface ArbitragePosition {
  id: string
  buyExchange: string
  sellExchange: string
  buyOrderId?: string
  sellOrderId?: string
  buyPrice: number
  sellPrice: number
  amount: number
  status: 'PENDING' | 'PARTIALLY_FILLED' | 'FILLED' | 'FAILED' | 'CANCELLED'
  filledAmount: number
  estimatedProfit: number
  startTime: number
  endTime?: number
}

export class ArbitrageStrategy extends BaseStrategy {
  private config!: ArbitrageStrategyConfig
  private activePositions: Map<string, ArbitragePosition> = new Map()
  private lastScanTime: number = 0
  private scanInterval: number = 5000 // 5 seconds
  private totalTrades: number = 0
  private successfulTrades: number = 0
  private totalProfit: number = 0
  private failedTrades: number = 0

  get name(): string {
    return 'Arbitrage'
  }

  protected async onInitialize(): Promise<void> {
    this.config = this.config.parameters as ArbitrageStrategyConfig
    
    if (!this.config.exchanges || this.config.exchanges.length < 2) {
      throw new StrategyError('Invalid arbitrage configuration: at least 2 exchanges required')
    }

    if (!this.config.minProfit || this.config.minProfit <= 0) {
      throw new StrategyError('Invalid arbitrage configuration: minimum profit must be positive')
    }

    if (!this.config.maxSlippage || this.config.maxSlippage <= 0) {
      throw new StrategyError('Invalid arbitrage configuration: maximum slippage must be positive')
    }

    if (!this.config.orderAmount || this.config.orderAmount <= 0) {
      throw new StrategyError('Invalid arbitrage configuration: order amount must be positive')
    }

    // Validate exchange connections
    await this.validateExchangeConnections()
    
    console.log(`Arbitrage strategy initialized with ${this.config.exchanges.length} exchanges`)
  }

  protected async onCleanup(): Promise<void> {
    // Cancel all active positions
    await this.cancelAllPositions()
    this.activePositions.clear()
    this.lastScanTime = 0
  }

  async execute(context: BotContext): Promise<Signal> {
    this.validateContext(context)
    
    const currentTime = Date.now()
    
    // Check if we should scan for opportunities
    if (currentTime - this.lastScanTime < this.scanInterval) {
      return this.createSignal('HOLD', 0.2, 0.6, 'Waiting for next scan cycle')
    }
    
    this.lastScanTime = currentTime
    
    // Monitor and update existing positions
    await this.updateExistingPositions()
    
    // Scan for new arbitrage opportunities
    const opportunities = await this.scanArbitrageOpportunities(context)
    
    // Execute the best opportunity if found
    if (opportunities.length > 0) {
      const bestOpportunity = opportunities[0] // Best opportunity is first
      const executionSignal = await this.executeArbitrageOpportunity(bestOpportunity, context)
      
      if (executionSignal.type !== 'HOLD') {
        return executionSignal
      }
    }
    
    // Return status signal
    const activePositionsCount = this.activePositions.size
    const statusMessage = activePositionsCount > 0 
      ? `Monitoring ${activePositionsCount} active arbitrage positions`
      : `Scanning for opportunities across ${this.config.exchanges.length} exchanges`
    
    return this.createSignal(
      'HOLD',
      0.3,
      0.7,
      statusMessage
    )
  }

  private async validateExchangeConnections(): Promise<void> {
    for (const exchangeId of this.config.exchanges) {
      try {
        const isConnected = await exchangeManager.testConnection(exchangeId)
        if (!isConnected) {
          throw new StrategyError(`Cannot connect to exchange: ${exchangeId}`)
        }
      } catch (error) {
        throw new StrategyError(`Exchange connection failed for ${exchangeId}: ${error.message}`)
      }
    }
  }

  private async scanArbitrageOpportunities(context: BotContext): Promise<ArbitrageOpportunity[]> {
    const opportunities: ArbitrageOpportunity[] = []
    const symbol = context.bot.market.symbol
    
    try {
      // Get tickers from all exchanges
      const tickerPromises = this.config.exchanges.map(async (exchangeId) => {
        try {
          const ticker = await exchangeManager.getTicker(exchangeId, symbol)
          return { exchangeId, ticker }
        } catch (error) {
          console.warn(`Failed to get ticker from ${exchangeId}:`, error)
          return null
        }
      })
      
      const tickerResults = await Promise.all(tickerPromises)
      const validTickers = tickerResults.filter(result => result !== null) as any[]
      
      // Compare prices between all exchange pairs
      for (let i = 0; i < validTickers.length; i++) {
        for (let j = i + 1; j < validTickers.length; j++) {
          const exchange1 = validTickers[i]
          const exchange2 = validTickers[j]
          
          // Check both directions
          const opportunity1 = this.createArbitrageOpportunity(
            exchange1.exchangeId,
            exchange2.exchangeId,
            exchange1.ticker.bid,
            exchange2.ticker.ask,
            symbol,
            context
          )
          
          const opportunity2 = this.createArbitrageOpportunity(
            exchange2.exchangeId,
            exchange1.exchangeId,
            exchange2.ticker.bid,
            exchange1.ticker.ask,
            symbol,
            context
          )
          
          if (opportunity1 && opportunity1.netProfit > 0) {
            opportunities.push(opportunity1)
          }
          
          if (opportunity2 && opportunity2.netProfit > 0) {
            opportunities.push(opportunity2)
          }
        }
      }
      
      // Sort by net profit (descending)
      opportunities.sort((a, b) => b.netProfit - a.netProfit)
      
    } catch (error) {
      console.error('Error scanning arbitrage opportunities:', error)
    }
    
    return opportunities
  }

  private createArbitrageOpportunity(
    buyExchange: string,
    sellExchange: string,
    buyPrice: number,
    sellPrice: number,
    symbol: string,
    context: BotContext
  ): ArbitrageOpportunity | null {
    if (buyPrice <= 0 || sellPrice <= 0) {
      return null
    }
    
    const priceDifference = sellPrice - buyPrice
    const profitPercent = (priceDifference / buyPrice) * 100
    
    // Check if profit meets minimum threshold
    if (profitPercent < this.config.minProfit) {
      return null
    }
    
    // Calculate fees (estimated 0.1% per exchange)
    const feeRate = 0.001
    const fees = (buyPrice + sellPrice) * feeRate
    const netProfit = priceDifference - fees
    
    // Check if net profit is positive
    if (netProfit <= 0) {
      return null
    }
    
    // Calculate maximum volume based on available balances
    const volume = Math.min(
      this.config.orderAmount,
      this.calculateMaxVolume(buyExchange, sellExchange, buyPrice, context)
    )
    
    if (volume <= 0) {
      return null
    }
    
    const estimatedProfit = netProfit * volume
    
    return {
      buyExchange,
      sellExchange,
      buyPrice,
      sellPrice,
      priceDifference,
      profitPercent,
      volume,
      estimatedProfit,
      fees,
      netProfit,
      timestamp: Date.now()
    }
  }

  private calculateMaxVolume(
    buyExchange: string,
    sellExchange: string,
    buyPrice: number,
    context: BotContext
  ): number {
    // This is a simplified calculation
    // In reality, you'd need to check actual balances on both exchanges
    
    const quoteAsset = this.getQuoteAsset(context.bot.market.symbol)
    const availableBalance = context.balance[quoteAsset] || 0
    
    // Calculate maximum volume considering balance and risk
    const maxVolumeByBalance = availableBalance / buyPrice
    const maxVolumeByRisk = this.config.orderAmount
    
    return Math.min(maxVolumeByBalance, maxVolumeByRisk)
  }

  private async executeArbitrageOpportunity(
    opportunity: ArbitrageOpportunity,
    context: BotContext
  ): Promise<Signal> {
    const positionId = `arb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      // Create arbitrage position
      const position: ArbitragePosition = {
        id: positionId,
        buyExchange: opportunity.buyExchange,
        sellExchange: opportunity.sellExchange,
        buyPrice: opportunity.buyPrice,
        sellPrice: opportunity.sellPrice,
        amount: opportunity.volume,
        status: 'PENDING',
        filledAmount: 0,
        estimatedProfit: opportunity.estimatedProfit,
        startTime: Date.now()
      }
      
      this.activePositions.set(positionId, position)
      
      // Execute buy order
      const buyOrder = await this.executeBuyOrder(opportunity, context)
      position.buyOrderId = buyOrder.orderId
      
      // Execute sell order
      const sellOrder = await this.executeSellOrder(opportunity, context)
      position.sellOrderId = sellOrder.orderId
      
      // Update position status
      position.status = 'PARTIALLY_FILLED'
      
      this.totalTrades++
      
      console.log(`Arbitrage position opened: ${positionId}`)
      console.log(`Buy: ${opportunity.volume} at ${opportunity.buyPrice} on ${opportunity.buyExchange}`)
      console.log(`Sell: ${opportunity.volume} at ${opportunity.sellPrice} on ${opportunity.sellExchange}`)
      console.log(`Estimated profit: ${opportunity.estimatedProfit}`)
      
      return this.createSignal(
        'BUY', // Representing the arbitrage execution
        0.9,
        0.95,
        `Arbitrage opportunity executed: ${opportunity.profitPercent.toFixed(3)}% profit, estimated ${opportunity.estimatedProfit.toFixed(2)}`
      )
      
    } catch (error) {
      console.error(`Failed to execute arbitrage opportunity:`, error)
      
      // Clean up failed position
      this.activePositions.delete(positionId)
      this.failedTrades++
      
      return this.createSignal(
        'HOLD',
        0,
        0.3,
        `Arbitrage execution failed: ${error.message}`
      )
    }
  }

  private async executeBuyOrder(opportunity: ArbitrageOpportunity, context: BotContext): Promise<any> {
    const orderRequest = {
      symbol: context.bot.market.symbol,
      side: 'BUY' as const,
      type: 'LIMIT' as const,
      amount: opportunity.volume,
      price: opportunity.buyPrice * (1 + this.config.maxSlippage), // Allow some slippage
      timeInForce: 'GTC' as const
    }
    
    return await exchangeManager.createOrder(opportunity.buyExchange, orderRequest)
  }

  private async executeSellOrder(opportunity: ArbitrageOpportunity, context: BotContext): Promise<any> {
    const orderRequest = {
      symbol: context.bot.market.symbol,
      side: 'SELL' as const,
      type: 'LIMIT' as const,
      amount: opportunity.volume,
      price: opportunity.sellPrice * (1 - this.config.maxSlippage), // Allow some slippage
      timeInForce: 'GTC' as const
    }
    
    return await exchangeManager.createOrder(opportunity.sellExchange, orderRequest)
  }

  private async updateExistingPositions(): Promise<void> {
    const updatePromises = Array.from(this.activePositions.values()).map(async (position) => {
      await this.updatePositionStatus(position)
    })
    
    await Promise.all(updatePromises)
    
    // Clean up completed or failed positions
    for (const [positionId, position] of this.activePositions.entries()) {
      if (position.status === 'FILLED' || position.status === 'FAILED' || position.status === 'CANCELLED') {
        if (position.status === 'FILLED') {
          this.successfulTrades++
          this.totalProfit += position.estimatedProfit
        }
        
        // Remove position after some time for logging
        if (Date.now() - (position.endTime || position.startTime) > 60000) { // 1 minute
          this.activePositions.delete(positionId)
        }
      }
    }
  }

  private async updatePositionStatus(position: ArbitragePosition): Promise<void> {
    try {
      // Check buy order status
      if (position.buyOrderId) {
        const buyOrders = await exchangeManager.getOpenOrders(position.buyExchange, position.buyOrderId)
        const buyOrderExists = buyOrders.some(order => order.orderId === position.buyOrderId)
        
        if (!buyOrderExists) {
          // Buy order is filled or cancelled
          position.filledAmount = position.amount // Assume full fill for simplicity
        }
      }
      
      // Check sell order status
      if (position.sellOrderId) {
        const sellOrders = await exchangeManager.getOpenOrders(position.sellExchange, position.sellOrderId)
        const sellOrderExists = sellOrders.some(order => order.orderId === position.sellOrderId)
        
        if (!sellOrderExists) {
          // Sell order is filled or cancelled
          if (position.filledAmount === position.amount) {
            position.status = 'FILLED'
            position.endTime = Date.now()
          }
        }
      }
      
      // Timeout check
      if (Date.now() - position.startTime > 300000) { // 5 minutes timeout
        position.status = 'CANCELLED'
        position.endTime = Date.now()
        await this.cancelPositionOrders(position)
      }
      
    } catch (error) {
      console.error(`Error updating position ${position.id}:`, error)
      position.status = 'FAILED'
      position.endTime = Date.now()
    }
  }

  private async cancelPositionOrders(position: ArbitragePosition): Promise<void> {
    try {
      if (position.buyOrderId) {
        await exchangeManager.cancelOrder(position.buyExchange, position.buyOrderId)
      }
      
      if (position.sellOrderId) {
        await exchangeManager.cancelOrder(position.sellExchange, position.sellOrderId)
      }
    } catch (error) {
      console.warn(`Error cancelling orders for position ${position.id}:`, error)
    }
  }

  private async cancelAllPositions(): Promise<void> {
    const cancelPromises = Array.from(this.activePositions.values()).map(async (position) => {
      await this.cancelPositionOrders(position)
      position.status = 'CANCELLED'
      position.endTime = Date.now()
    })
    
    await Promise.all(cancelPromises)
  }

  // Public methods for monitoring and management
  public getStrategyStatus(): {
    activePositions: number
    totalTrades: number
    successfulTrades: number
    failedTrades: number
    successRate: number
    totalProfit: number
    averageProfit: number
    exchanges: string[]
    lastScanTime: number
  } {
    return {
      activePositions: this.activePositions.size,
      totalTrades: this.totalTrades,
      successfulTrades: this.successfulTrades,
      failedTrades: this.failedTrades,
      successRate: this.totalTrades > 0 ? (this.successfulTrades / this.totalTrades) * 100 : 0,
      totalProfit: this.totalProfit,
      averageProfit: this.successfulTrades > 0 ? this.totalProfit / this.successfulTrades : 0,
      exchanges: this.config.exchanges,
      lastScanTime: this.lastScanTime
    }
  }

  public getActivePositions(): ArbitragePosition[] {
    return Array.from(this.activePositions.values())
  }

  public updateConfig(newConfig: Partial<ArbitrageStrategyConfig>): void {
    if (newConfig.exchanges && newConfig.exchanges.length < 2) {
      throw new StrategyError('At least 2 exchanges required')
    }

    if (newConfig.minProfit && newConfig.minProfit <= 0) {
      throw new StrategyError('Minimum profit must be positive')
    }

    if (newConfig.maxSlippage && newConfig.maxSlippage <= 0) {
      throw new StrategyError('Maximum slippage must be positive')
    }

    if (newConfig.orderAmount && newConfig.orderAmount <= 0) {
      throw new StrategyError('Order amount must be positive')
    }

    this.config = { ...this.config, ...newConfig }
    console.log('Arbitrage strategy configuration updated')
  }

  public resetStrategy(): void {
    this.activePositions.clear()
    this.lastScanTime = 0
    this.totalTrades = 0
    this.successfulTrades = 0
    this.totalProfit = 0
    this.failedTrades = 0
    
    console.log('Arbitrage strategy reset')
  }

  public async pauseStrategy(): Promise<void> {
    await this.cancelAllPositions()
    console.log('Arbitrage strategy paused')
  }

  public resumeStrategy(): void {
    this.lastScanTime = 0
    console.log('Arbitrage strategy resumed')
  }
}