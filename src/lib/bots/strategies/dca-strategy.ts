import { BaseStrategy } from './base-strategy'
import { BotContext, Signal, DCAStrategyConfig, StrategyError } from '../types'

interface DCAOrder {
  targetPrice: number
  orderAmount: number
  executed: boolean
  executedPrice?: number
  executedAt?: Date
  orderIndex: number
}

export class DCAStrategy extends BaseStrategy {
  private dcaOrders: DCAOrder[] = []
  private totalInvested: number = 0
  private totalAcquired: number = 0
  private averagePrice: number = 0
  private config!: DCAStrategyConfig
  private lastOrderTime: number = 0
  private strategyStartTime: number = 0

  get name(): string {
    return 'Dollar Cost Averaging'
  }

  protected async onInitialize(): Promise<void> {
    this.config = this.config.parameters as DCAStrategyConfig
    this.strategyStartTime = Date.now()
    
    if (!this.config.totalAmount || this.config.totalAmount <= 0) {
      throw new StrategyError('Invalid DCA configuration: total amount must be positive')
    }

    if (!this.config.targetPrice || this.config.targetPrice <= 0) {
      throw new StrategyError('Invalid DCA configuration: target price must be positive')
    }

    if (!this.config.orderCount || this.config.orderCount < 1) {
      throw new StrategyError('Invalid DCA configuration: order count must be at least 1')
    }

    if (!this.config.priceDeviation || this.config.priceDeviation <= 0) {
      throw new StrategyError('Invalid DCA configuration: price deviation must be positive')
    }

    this.initializeDCAPlan()
  }

  protected async onCleanup(): Promise<void> {
    this.dcaOrders = []
    this.totalInvested = 0
    this.totalAcquired = 0
    this.averagePrice = 0
    this.lastOrderTime = 0
    this.strategyStartTime = 0
  }

  async execute(context: BotContext): Promise<Signal> {
    this.validateContext(context)
    
    const currentPrice = context.currentPrice
    const quoteAsset = this.getQuoteAsset(context.bot.market.symbol)
    const availableBalance = context.balance[quoteAsset] || 0

    // Check if DCA plan is completed
    if (this.isDCACompleted()) {
      return this.createSignal(
        'HOLD',
        0,
        1,
        'DCA plan completed. All orders executed.'
      )
    }

    // Check if we have enough balance for next order
    const nextOrder = this.getNextPendingOrder()
    if (!nextOrder) {
      return this.createSignal(
        'HOLD',
        0,
        1,
        'No pending DCA orders'
      )
    }

    if (availableBalance < nextOrder.orderAmount) {
      return this.createSignal(
        'HOLD',
        0,
        0.5,
        `Insufficient balance for next DCA order. Need: ${nextOrder.orderAmount}, Available: ${availableBalance}`
      )
    }

    // Check if we should execute the next order
    const shouldExecute = this.shouldExecuteOrder(currentPrice, nextOrder)
    
    if (shouldExecute) {
      return this.executeDCAOrder(context, nextOrder, currentPrice)
    }

    // Calculate how close we are to target price
    const priceDistance = Math.abs(currentPrice - this.config.targetPrice) / this.config.targetPrice
    const strength = Math.max(0, 1 - (priceDistance / this.config.priceDeviation))
    
    return this.createSignal(
      'HOLD',
      strength * 0.6,
      0.8,
      `Waiting for price opportunity. Current: ${currentPrice}, Target: ${nextOrder.targetPrice}, Distance: ${(priceDistance * 100).toFixed(2)}%`
    )
  }

  private initializeDCAPlan(): void {
    this.dcaOrders = []
    
    // Calculate order amounts (equal distribution by default)
    const orderAmount = this.config.totalAmount / this.config.orderCount
    
    // Generate DCA orders with price targets
    for (let i = 0; i < this.config.orderCount; i++) {
      // Calculate target price with deviation
      const deviationMultiplier = this.calculateDeviationMultiplier(i)
      const targetPrice = this.config.targetPrice * (1 + (this.config.priceDeviation * deviationMultiplier))
      
      this.dcaOrders.push({
        targetPrice,
        orderAmount,
        executed: false,
        orderIndex: i
      })
    }

    // Sort orders by target price (buy low to high)
    this.dcaOrders.sort((a, b) => a.targetPrice - b.targetPrice)

    console.log(`DCA plan initialized with ${this.dcaOrders.length} orders`)
    console.log(`Price range: ${this.dcaOrders[0].targetPrice} - ${this.dcaOrders[this.dcaOrders.length - 1].targetPrice}`)
  }

  private calculateDeviationMultiplier(orderIndex: number): number {
    // Create a distribution around the target price
    // For even number of orders: symmetric around target
    // For odd number of orders: one at target, others symmetric
    
    if (this.config.orderCount === 1) {
      return 0
    }
    
    const centerIndex = (this.config.orderCount - 1) / 2
    const normalizedIndex = orderIndex - centerIndex
    const maxDeviation = this.config.orderCount / 2
    
    return (normalizedIndex / maxDeviation) * 0.5 // Scale to ±50% of max deviation
  }

  private isDCACompleted(): boolean {
    return this.dcaOrders.every(order => order.executed) || 
           this.dcaOrders.length >= (this.config.maxOrders || this.config.orderCount)
  }

  private getNextPendingOrder(): DCAOrder | undefined {
    return this.dcaOrders.find(order => !order.executed)
  }

  private shouldExecuteOrder(currentPrice: number, order: DCAOrder): boolean {
    const minOrderInterval = 5 * 60 * 1000 // 5 minutes between orders
    const timeSinceLastOrder = Date.now() - this.lastOrderTime
    
    if (timeSinceLastOrder < minOrderInterval) {
      return false
    }

    // Execute if current price is at or better than target price
    if (order.targetPrice >= this.config.targetPrice) {
      // For orders above target price (buying higher), execute if current price <= target
      return currentPrice <= order.targetPrice
    } else {
      // For orders below target price (buying lower), execute if current price >= target
      return currentPrice >= order.targetPrice
    }
  }

  private executeDCAOrder(context: BotContext, order: DCAOrder, currentPrice: number): Signal {
    // Calculate actual position size considering available balance
    const quoteAsset = this.getQuoteAsset(context.bot.market.symbol)
    const availableBalance = context.balance[quoteAsset] || 0
    const actualAmount = Math.min(order.orderAmount, availableBalance)
    
    if (actualAmount <= 0) {
      return this.createSignal('HOLD', 0, 0, 'Insufficient balance for DCA order')
    }

    // Mark order as executed
    order.executed = true
    order.executedPrice = currentPrice
    order.executedAt = new Date()
    
    // Update totals
    this.totalInvested += actualAmount
    const acquiredAmount = actualAmount / currentPrice
    this.totalAcquired += acquiredAmount
    this.averagePrice = this.totalInvested / this.totalAcquired
    this.lastOrderTime = Date.now()

    console.log(`DCA order executed: ${actualAmount} at ${currentPrice}`)
    console.log(`Total invested: ${this.totalInvested}, Total acquired: ${this.totalAcquired}, Average price: ${this.averagePrice}`)

    return this.createSignal(
      'BUY',
      0.8,
      0.95,
      `DCA buy order executed: ${actualAmount.toFixed(2)} at ${currentPrice.toFixed(2)} (Order ${order.orderIndex + 1}/${this.config.orderCount})`
    )
  }

  // Public methods for monitoring and management
  public getDCAStatus(): {
    totalOrders: number
    executedOrders: number
    pendingOrders: number
    totalInvested: number
    totalAcquired: number
    averagePrice: number
    currentPrice: number
    profitLoss: number
    profitLossPercent: number
    completionPercentage: number
    estimatedTimeToComplete: string
  } {
    const executedOrders = this.dcaOrders.filter(o => o.executed).length
    const completionPercentage = (executedOrders / this.config.orderCount) * 100
    
    // Estimate time to complete based on execution rate
    const timeElapsed = Date.now() - this.strategyStartTime
    const avgTimePerOrder = executedOrders > 0 ? timeElapsed / executedOrders : 0
    const remainingOrders = this.config.orderCount - executedOrders
    const estimatedTimeRemaining = avgTimePerOrder * remainingOrders
    
    // Calculate current P&L
    const currentPrice = this.getCurrentPriceForPnL()
    const currentValue = this.totalAcquired * currentPrice
    const profitLoss = currentValue - this.totalInvested
    const profitLossPercent = this.totalInvested > 0 ? (profitLoss / this.totalInvested) * 100 : 0

    return {
      totalOrders: this.config.orderCount,
      executedOrders,
      pendingOrders: this.config.orderCount - executedOrders,
      totalInvested: this.totalInvested,
      totalAcquired: this.totalAcquired,
      averagePrice: this.averagePrice,
      currentPrice,
      profitLoss,
      profitLossPercent,
      completionPercentage,
      estimatedTimeToComplete: this.formatTimeRemaining(estimatedTimeRemaining)
    }
  }

  private getCurrentPriceForPnL(): number {
    // This would normally be passed from context
    // For now, use the average of executed order prices
    const executedOrders = this.dcaOrders.filter(o => o.executed && o.executedPrice)
    if (executedOrders.length === 0) return this.config.targetPrice
    
    const sum = executedOrders.reduce((acc, order) => acc + (order.executedPrice || 0), 0)
    return sum / executedOrders.length
  }

  private formatTimeRemaining(milliseconds: number): string {
    if (milliseconds <= 0) return 'Unknown'
    
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24))
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  public updateDCAConfig(newConfig: Partial<DCAStrategyConfig>): void {
    if (newConfig.totalAmount && newConfig.totalAmount <= 0) {
      throw new StrategyError('Total amount must be positive')
    }

    if (newConfig.targetPrice && newConfig.targetPrice <= 0) {
      throw new StrategyError('Target price must be positive')
    }

    if (newConfig.orderCount && newConfig.orderCount < 1) {
      throw new StrategyError('Order count must be at least 1')
    }

    if (newConfig.priceDeviation && newConfig.priceDeviation <= 0) {
      throw new StrategyError('Price deviation must be positive')
    }

    // Reset and reinitialize with new config
    this.config = { ...this.config, ...newConfig }
    this.resetDCA()
    
    console.log('DCA configuration updated and reinitialized')
  }

  public resetDCA(): void {
    this.dcaOrders = []
    this.totalInvested = 0
    this.totalAcquired = 0
    this.averagePrice = 0
    this.lastOrderTime = 0
    this.strategyStartTime = Date.now()
    
    this.initializeDCAPlan()
    
    console.log('DCA strategy reset and reinitialized')
  }

  public pauseDCA(): void {
    console.log('DCA strategy paused')
    // Strategy will continue to return HOLD signals
  }

  public resumeDCA(): void {
    console.log('DCA strategy resumed')
    this.lastOrderTime = Date.now() // Reset order timer
  }
}