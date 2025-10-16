import { BaseStrategy } from './base-strategy'
import { TechnicalIndicators } from './indicators'
import { BotContext, Signal, StrategyError } from '../types'
import { exchangeManager } from '@/lib/exchanges/manager'

interface MarketMakerOrder {
  id: string
  exchangeId: string
  side: 'BUY' | 'SELL'
  price: number
  amount: number
  orderId?: string
  status: 'PENDING' | 'OPEN' | 'FILLED' | 'CANCELLED'
  filledAmount: number
  createdAt: number
  updatedAt: number
}

interface MarketMakerConfig {
  spreadPercent: number
  orderSize: number
  maxOrders: number
  minSpread: number
  maxSpread: number
  inventoryTarget: number
  rebalanceThreshold: number
  volatilityWindow: number
  riskLimit: number
}

interface InventoryPosition {
  baseAsset: string
  quoteAsset: string
  baseAmount: number
  quoteAmount: number
  baseValue: number
  quoteValue: number
  totalValue: number
  targetRatio: number
  currentRatio: number
}

export class MarketMakingStrategy extends BaseStrategy {
  private config!: MarketMakerConfig
  private buyOrders: MarketMakerOrder[] = []
  private sellOrders: MarketMakerOrder[] = []
  private lastRebalanceTime: number = 0
  private lastOrderUpdate: number = 0
  private totalTrades: number = 0
  private totalProfit: number = 0
  private feesPaid: number = 0
  private inventoryPosition: InventoryPosition | null = null

  get name(): string {
    return 'Market Making'
  }

  protected async onInitialize(): Promise<void> {
    this.config = this.config.parameters as MarketMakerConfig
    
    if (!this.config.spreadPercent || this.config.spreadPercent <= 0) {
      throw new StrategyError('Invalid market making configuration: spread percent must be positive')
    }

    if (!this.config.orderSize || this.config.orderSize <= 0) {
      throw new StrategyError('Invalid market making configuration: order size must be positive')
    }

    if (!this.config.maxOrders || this.config.maxOrders <= 0) {
      throw new StrategyError('Invalid market making configuration: max orders must be positive')
    }

    if (!this.config.inventoryTarget || this.config.inventoryTarget < 0 || this.config.inventoryTarget > 1) {
      throw new StrategyError('Invalid market making configuration: inventory target must be between 0 and 1')
    }

    if (!this.config.riskLimit || this.config.riskLimit <= 0) {
      throw new StrategyError('Invalid market making configuration: risk limit must be positive')
    }

    console.log(`Market making strategy initialized with spread=${this.config.spreadPercent}%, orders=${this.config.maxOrders}`)
  }

  protected async onCleanup(): Promise<void> {
    await this.cancelAllOrders()
    this.buyOrders = []
    this.sellOrders = []
    this.inventoryPosition = null
  }

  async execute(context: BotContext): Promise<Signal> {
    this.validateContext(context)
    
    const currentTime = Date.now()
    const currentPrice = context.currentPrice
    
    // Update inventory position
    this.updateInventoryPosition(context)
    
    // Check risk limits
    if (this.isRiskLimitExceeded(context)) {
      return this.createSignal('HOLD', 0, 0.3, 'Risk limit exceeded, pausing market making')
    }
    
    // Update existing orders
    if (currentTime - this.lastOrderUpdate > 1000) { // Update orders every second
      await this.updateExistingOrders(context)
      this.lastOrderUpdate = currentTime
    }
    
    // Rebalance orders if needed
    if (currentTime - this.lastRebalanceTime > 5000) { // Rebalance every 5 seconds
      await this.rebalanceOrders(context, currentPrice)
      this.lastRebalanceTime = currentTime
    }
    
    // Calculate current metrics
    const metrics = this.calculateMarketMakingMetrics(context, currentPrice)
    
    return this.createSignal(
      'HOLD',
      0.4,
      0.8,
      `Market making active: ${this.buyOrders.length} buy orders, ${this.sellOrders.length} sell orders, spread: ${metrics.currentSpread.toFixed(2)}%`
    )
  }

  private updateInventoryPosition(context: BotContext): void {
    const symbol = context.bot.market.symbol
    const baseAsset = this.getBaseAsset(symbol)
    const quoteAsset = this.getQuoteAsset(symbol)
    const currentPrice = context.currentPrice
    
    const baseAmount = context.positions[baseAsset] || 0
    const quoteAmount = context.balance[quoteAsset] || 0
    
    const baseValue = baseAmount * currentPrice
    const quoteValue = quoteAmount
    const totalValue = baseValue + quoteValue
    
    const currentRatio = totalValue > 0 ? baseValue / totalValue : 0
    
    this.inventoryPosition = {
      baseAsset,
      quoteAsset,
      baseAmount,
      quoteAmount,
      baseValue,
      quoteValue,
      totalValue,
      targetRatio: this.config.inventoryTarget,
      currentRatio
    }
  }

  private isRiskLimitExceeded(context: BotContext): boolean {
    if (!this.inventoryPosition) return false
    
    const totalValue = this.inventoryPosition.totalValue
    const riskAmount = totalValue * this.config.riskLimit
    
    // Check if inventory imbalance exceeds risk limit
    const ratioDeviation = Math.abs(this.inventoryPosition.currentRatio - this.inventoryPosition.targetRatio)
    
    return ratioDeviation > this.config.riskLimit
  }

  private async updateExistingOrders(context: BotContext): Promise<void> {
    const exchangeId = context.bot.market.exchangeAccountId
    
    try {
      // Get current open orders from exchange
      const openOrders = await exchangeManager.getOpenOrders(exchangeId, context.bot.market.symbol)
      
      // Update local order status
      this.updateOrderStatus(this.buyOrders, openOrders)
      this.updateOrderStatus(this.sellOrders, openOrders)
      
      // Remove filled or cancelled orders
      this.buyOrders = this.buyOrders.filter(order => order.status !== 'FILLED' && order.status !== 'CANCELLED')
      this.sellOrders = this.sellOrders.filter(order => order.status !== 'FILLED' && order.status !== 'CANCELLED')
      
    } catch (error) {
      console.error('Error updating existing orders:', error)
    }
  }

  private updateOrderStatus(orders: MarketMakerOrder[], exchangeOrders: any[]): void {
    for (const order of orders) {
      const exchangeOrder = exchangeOrders.find(eo => eo.orderId === order.orderId)
      
      if (!exchangeOrder) {
        // Order not found on exchange, assume it's filled or cancelled
        if (order.status === 'OPEN') {
          order.status = 'FILLED'
          order.filledAmount = order.amount
        }
      } else {
        // Update order status based on exchange data
        order.status = 'OPEN'
        order.filledAmount = exchangeOrder.filledAmount || 0
        
        if (order.filledAmount >= order.amount) {
          order.status = 'FILLED'
        }
      }
      
      order.updatedAt = Date.now()
    }
  }

  private async rebalanceOrders(context: BotContext, currentPrice: number): Promise<void> {
    const exchangeId = context.bot.market.exchangeAccountId
    const symbol = context.bot.market.symbol
    
    // Calculate optimal spread and order prices
    const spreadAnalysis = this.analyzeSpread(context, currentPrice)
    const optimalSpread = this.calculateOptimalSpread(spreadAnalysis)
    
    // Calculate order prices
    const buyPrice = currentPrice * (1 - optimalSpread / 2)
    const sellPrice = currentPrice * (1 + optimalSpread / 2)
    
    // Adjust orders based on inventory position
    const inventoryAdjustment = this.calculateInventoryAdjustment()
    const adjustedBuyPrice = buyPrice * (1 - inventoryAdjustment)
    const adjustedSellPrice = sellPrice * (1 + inventoryAdjustment)
    
    // Cancel orders that are too far from optimal prices
    await this.cancelOutOfRangeOrders(exchangeId, adjustedBuyPrice, adjustedSellPrice)
    
    // Create new orders if needed
    await this.createMissingOrders(context, adjustedBuyPrice, adjustedSellPrice)
    
    // Ensure we don't exceed maximum order count
    await this.enforceOrderLimit(exchangeId)
  }

  private analyzeSpread(context: BotContext, currentPrice: number): {
    volatility: number
    volume: number
    orderBookImbalance: number
    recentTrades: number
  } {
    const data = context.marketData
    const recentData = data.slice(-this.config.volatilityWindow)
    
    // Calculate volatility
    const volatility = this.calculateVolatility(recentData)
    
    // Calculate volume (simplified)
    const volume = recentData.reduce((sum, candle) => sum + candle.volume, 0) / recentData.length
    
    // Calculate order book imbalance (simplified)
    const orderBookImbalance = this.calculateOrderBookImbalance(context)
    
    // Calculate recent trades frequency
    const recentTrades = context.trades.length
    
    return {
      volatility,
      volume,
      orderBookImbalance,
      recentTrades
    }
  }

  private calculateVolatility(data: MarketData[]): number {
    if (data.length < 2) return 0
    
    const returns: number[] = []
    for (let i = 1; i < data.length; i++) {
      const returnRate = (data[i].close - data[i - 1].close) / data[i - 1].close
      returns.push(returnRate)
    }
    
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length
    
    return Math.sqrt(variance) * Math.sqrt(365 * 24 * 60) // Annualized volatility
  }

  private calculateOrderBookImbalance(context: BotContext): number {
    // Simplified order book imbalance calculation
    // In reality, you'd get this from the exchange order book
    return 0 // Neutral for now
  }

  private calculateOptimalSpread(spreadAnalysis: any): number {
    const { volatility, volume, orderBookImbalance, recentTrades } = spreadAnalysis
    
    // Base spread from configuration
    let spread = this.config.spreadPercent
    
    // Adjust for volatility (higher volatility = wider spread)
    spread += volatility * 100
    
    // Adjust for volume (higher volume = tighter spread)
    spread *= Math.max(0.5, 1 - (volume / 10000))
    
    // Adjust for order book imbalance
    spread *= (1 + Math.abs(orderBookImbalance) * 0.5)
    
    // Adjust for trading activity
    spread *= Math.max(0.5, 1 - (recentTrades / 100))
    
    // Ensure spread is within bounds
    spread = Math.max(this.config.minSpread, Math.min(this.config.maxSpread, spread))
    
    return spread / 100 // Convert to decimal
  }

  private calculateInventoryAdjustment(): number {
    if (!this.inventoryPosition) return 0
    
    const ratioDeviation = this.inventoryPosition.currentRatio - this.inventoryPosition.targetRatio
    
    // If we have too much base asset, adjust prices to sell more
    // If we have too little base asset, adjust prices to buy more
    return ratioDeviation * 0.1 // 10% adjustment per unit of ratio deviation
  }

  private async cancelOutOfRangeOrders(exchangeId: string, buyPrice: number, sellPrice: number): Promise<void> {
    const priceTolerance = 0.001 // 0.1% tolerance
    
    // Cancel buy orders that are too high
    for (const order of this.buyOrders) {
      if (order.price > buyPrice * (1 + priceTolerance)) {
        await this.cancelOrder(order, exchangeId)
      }
    }
    
    // Cancel sell orders that are too low
    for (const order of this.sellOrders) {
      if (order.price < sellPrice * (1 - priceTolerance)) {
        await this.cancelOrder(order, exchangeId)
      }
    }
  }

  private async cancelOrder(order: MarketMakerOrder, exchangeId: string): Promise<void> {
    try {
      if (order.orderId && order.status === 'OPEN') {
        await exchangeManager.cancelOrder(exchangeId, order.orderId)
      }
      order.status = 'CANCELLED'
      order.updatedAt = Date.now()
    } catch (error) {
      console.error(`Error cancelling order ${order.id}:`, error)
    }
  }

  private async createMissingOrders(context: BotContext, buyPrice: number, sellPrice: number): Promise<void> {
    const exchangeId = context.bot.market.exchangeAccountId
    const symbol = context.bot.market.symbol
    
    // Calculate number of orders to create
    const buyOrdersNeeded = Math.max(0, this.config.maxOrders - this.buyOrders.length)
    const sellOrdersNeeded = Math.max(0, this.config.maxOrders - this.sellOrders.length)
    
    // Create buy orders
    for (let i = 0; i < buyOrdersNeeded; i++) {
      await this.createBuyOrder(exchangeId, symbol, buyPrice, context)
    }
    
    // Create sell orders
    for (let i = 0; i < sellOrdersNeeded; i++) {
      await this.createSellOrder(exchangeId, symbol, sellPrice, context)
    }
  }

  private async createBuyOrder(exchangeId: string, symbol: string, price: number, context: BotContext): Promise<void> {
    try {
      const orderRequest = {
        symbol,
        side: 'BUY' as const,
        type: 'LIMIT' as const,
        amount: this.config.orderSize,
        price,
        timeInForce: 'GTC' as const
      }
      
      const order = await exchangeManager.createOrder(exchangeId, orderRequest)
      
      const marketMakerOrder: MarketMakerOrder = {
        id: `buy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        exchangeId,
        side: 'BUY',
        price,
        amount: this.config.orderSize,
        orderId: order.orderId,
        status: 'OPEN',
        filledAmount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      this.buyOrders.push(marketMakerOrder)
      
    } catch (error) {
      console.error('Error creating buy order:', error)
    }
  }

  private async createSellOrder(exchangeId: string, symbol: string, price: number, context: BotContext): Promise<void> {
    try {
      const orderRequest = {
        symbol,
        side: 'SELL' as const,
        type: 'LIMIT' as const,
        amount: this.config.orderSize,
        price,
        timeInForce: 'GTC' as const
      }
      
      const order = await exchangeManager.createOrder(exchangeId, orderRequest)
      
      const marketMakerOrder: MarketMakerOrder = {
        id: `sell_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        exchangeId,
        side: 'SELL',
        price,
        amount: this.config.orderSize,
        orderId: order.orderId,
        status: 'OPEN',
        filledAmount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
      
      this.sellOrders.push(marketMakerOrder)
      
    } catch (error) {
      console.error('Error creating sell order:', error)
    }
  }

  private async enforceOrderLimit(exchangeId: string): Promise<void> {
    // Cancel oldest orders if we exceed the limit
    while (this.buyOrders.length > this.config.maxOrders) {
      const oldestOrder = this.buyOrders.shift()
      if (oldestOrder) {
        await this.cancelOrder(oldestOrder, exchangeId)
      }
    }
    
    while (this.sellOrders.length > this.config.maxOrders) {
      const oldestOrder = this.sellOrders.shift()
      if (oldestOrder) {
        await this.cancelOrder(oldestOrder, exchangeId)
      }
    }
  }

  private async cancelAllOrders(): Promise<void> {
    const allOrders = [...this.buyOrders, ...this.sellOrders]
    const cancelPromises = allOrders.map(order => this.cancelOrder(order, order.exchangeId))
    
    await Promise.all(cancelPromises)
    
    this.buyOrders = []
    this.sellOrders = []
  }

  private calculateMarketMakingMetrics(context: BotContext, currentPrice: number): {
    currentSpread: number
    totalOrders: number
    openOrders: number
    filledOrders: number
    estimatedProfit: number
    inventoryRatio: number
  } {
    const bestBuy = this.buyOrders.length > 0 ? Math.max(...this.buyOrders.map(o => o.price)) : 0
    const bestSell = this.sellOrders.length > 0 ? Math.min(...this.sellOrders.map(o => o.price)) : 0
    
    const currentSpread = bestBuy > 0 && bestSell > 0 ? ((bestSell - bestBuy) / currentPrice) * 100 : 0
    
    const openOrders = this.buyOrders.filter(o => o.status === 'OPEN').length + 
                     this.sellOrders.filter(o => o.status === 'OPEN').length
    
    const filledOrders = this.buyOrders.filter(o => o.status === 'FILLED').length + 
                       this.sellOrders.filter(o => o.status === 'FILLED').length
    
    const inventoryRatio = this.inventoryPosition ? this.inventoryPosition.currentRatio : 0
    
    // Estimate profit from filled orders (simplified)
    const estimatedProfit = this.totalProfit
    
    return {
      currentSpread,
      totalOrders: this.buyOrders.length + this.sellOrders.length,
      openOrders,
      filledOrders,
      estimatedProfit,
      inventoryRatio
    }
  }

  // Public methods for monitoring and management
  public getStrategyStatus(): {
    buyOrders: number
    sellOrders: number
    totalOrders: number
    totalTrades: number
    totalProfit: number
    feesPaid: number
    inventoryPosition: InventoryPosition | null
    currentSpread: number
    riskStatus: 'NORMAL' | 'WARNING' | 'CRITICAL'
  } {
    const riskStatus = this.isRiskLimitExceeded(this.getContextForRiskCheck()) ? 'CRITICAL' : 
                      (this.inventoryPosition && Math.abs(this.inventoryPosition.currentRatio - this.inventoryPosition.targetRatio) > 0.1) ? 'WARNING' : 'NORMAL'
    
    return {
      buyOrders: this.buyOrders.length,
      sellOrders: this.sellOrders.length,
      totalOrders: this.buyOrders.length + this.sellOrders.length,
      totalTrades: this.totalTrades,
      totalProfit: this.totalProfit,
      feesPaid: this.feesPaid,
      inventoryPosition: this.inventoryPosition,
      currentSpread: this.calculateCurrentSpread(),
      riskStatus
    }
  }

  private calculateCurrentSpread(): number {
    if (this.buyOrders.length === 0 || this.sellOrders.length === 0) return 0
    
    const bestBuy = Math.max(...this.buyOrders.map(o => o.price))
    const bestSell = Math.min(...this.sellOrders.map(o => o.price))
    const midPrice = (bestBuy + bestSell) / 2
    
    return ((bestSell - bestBuy) / midPrice) * 100
  }

  private getContextForRiskCheck(): BotContext {
    // This would normally come from the execute method
    // For now, return a minimal context
    return {
      bot: this.config as any,
      marketData: [],
      currentPrice: 0,
      balance: {},
      positions: {},
      orders: [],
      trades: [],
      timestamp: Date.now()
    }
  }

  public updateConfig(newConfig: Partial<MarketMakerConfig>): void {
    if (newConfig.spreadPercent && newConfig.spreadPercent <= 0) {
      throw new StrategyError('Spread percent must be positive')
    }

    if (newConfig.orderSize && newConfig.orderSize <= 0) {
      throw new StrategyError('Order size must be positive')
    }

    if (newConfig.maxOrders && newConfig.maxOrders <= 0) {
      throw new StrategyError('Max orders must be positive')
    }

    if (newConfig.inventoryTarget && (newConfig.inventoryTarget < 0 || newConfig.inventoryTarget > 1)) {
      throw new StrategyError('Inventory target must be between 0 and 1')
    }

    if (newConfig.riskLimit && newConfig.riskLimit <= 0) {
      throw new StrategyError('Risk limit must be positive')
    }

    this.config = { ...this.config, ...newConfig }
    console.log('Market making strategy configuration updated')
  }

  public resetStrategy(): void {
    this.buyOrders = []
    this.sellOrders = []
    this.lastRebalanceTime = 0
    this.lastOrderUpdate = 0
    this.totalTrades = 0
    this.totalProfit = 0
    this.feesPaid = 0
    this.inventoryPosition = null
    
    console.log('Market making strategy reset')
  }

  public async pauseStrategy(): Promise<void> {
    await this.cancelAllOrders()
    console.log('Market making strategy paused')
  }

  public resumeStrategy(): void {
    this.lastRebalanceTime = 0
    this.lastOrderUpdate = 0
    console.log('Market making strategy resumed')
  }
}