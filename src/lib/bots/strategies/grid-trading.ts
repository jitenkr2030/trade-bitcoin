import { BaseStrategy } from './base-strategy'
import { BotContext, Signal, GridStrategyConfig, StrategyError } from '../types'

interface GridOrder {
  price: number
  amount: number
  side: 'BUY' | 'SELL'
  filled: boolean
  orderId?: string
}

export class GridTradingStrategy extends BaseStrategy {
  private gridOrders: GridOrder[] = []
  private lastRebalanceTime: number = 0
  private config!: GridStrategyConfig

  get name(): string {
    return 'Grid Trading'
  }

  protected async onInitialize(): Promise<void> {
    this.config = this.config.parameters as GridStrategyConfig
    
    if (!this.config.upperPrice || !this.config.lowerPrice || !this.config.gridLevels || !this.config.orderAmount) {
      throw new StrategyError('Invalid grid configuration: missing required parameters')
    }

    if (this.config.upperPrice <= this.config.lowerPrice) {
      throw new StrategyError('Upper price must be greater than lower price')
    }

    if (this.config.gridLevels < 2) {
      throw new StrategyError('Grid levels must be at least 2')
    }

    this.initializeGrid()
  }

  protected async onCleanup(): Promise<void> {
    this.gridOrders = []
    this.lastRebalanceTime = 0
  }

  async execute(context: BotContext): Promise<Signal> {
    this.validateContext(context)
    
    const currentPrice = context.currentPrice
    const rebalanceThreshold = this.config.rebalanceThreshold || 0.05 // 5% default

    // Check if we need to rebalance the grid
    if (this.shouldRebalanceGrid(currentPrice, rebalanceThreshold)) {
      this.rebalanceGrid(context, currentPrice)
      this.lastRebalanceTime = Date.now()
    }

    // Check for grid order execution opportunities
    const signal = this.checkGridOpportunities(context, currentPrice)
    
    if (signal.type !== 'HOLD') {
      return signal
    }

    // Check if price is outside grid range
    if (currentPrice > this.config.upperPrice || currentPrice < this.config.lowerPrice) {
      return this.createSignal(
        'HOLD',
        0,
        1,
        `Price ${currentPrice} is outside grid range (${this.config.lowerPrice} - ${this.config.upperPrice})`
      )
    }

    return this.createSignal(
      'HOLD',
      0.3,
      0.8,
      `Grid active: ${this.gridOrders.filter(o => !o.filled).length} pending orders`
    )
  }

  private initializeGrid(): void {
    this.gridOrders = []
    
    const priceRange = this.config.upperPrice - this.config.lowerPrice
    const gridSpacing = priceRange / (this.config.gridLevels - 1)

    // Create grid orders
    for (let i = 0; i < this.config.gridLevels; i++) {
      const price = this.config.lowerPrice + (i * gridSpacing)
      
      // Alternate buy and sell orders
      const side = i % 2 === 0 ? 'BUY' : 'SELL'
      
      this.gridOrders.push({
        price,
        amount: this.config.orderAmount,
        side,
        filled: false
      })
    }

    console.log(`Grid initialized with ${this.gridOrders.length} orders from ${this.config.lowerPrice} to ${this.config.upperPrice}`)
  }

  private shouldRebalanceGrid(currentPrice: number, threshold: number): boolean {
    const timeSinceLastRebalance = Date.now() - this.lastRebalanceTime
    const minRebalanceInterval = 5 * 60 * 1000 // 5 minutes minimum
    
    if (timeSinceLastRebalance < minRebalanceInterval) {
      return false
    }

    // Check if price has moved significantly from grid center
    const gridCenter = (this.config.upperPrice + this.config.lowerPrice) / 2
    const priceDeviation = Math.abs(currentPrice - gridCenter) / gridCenter
    
    return priceDeviation > threshold
  }

  private rebalanceGrid(context: BotContext, currentPrice: number): void {
    console.log(`Rebalancing grid at price ${currentPrice}`)
    
    // Calculate new grid range based on current price
    const priceRange = this.config.upperPrice - this.config.lowerPrice
    const newUpperPrice = currentPrice + (priceRange / 2)
    const newLowerPrice = currentPrice - (priceRange / 2)
    
    // Update grid configuration
    this.config.upperPrice = newUpperPrice
    this.config.lowerPrice = newLowerPrice
    
    // Cancel all pending orders and reinitialize grid
    this.gridOrders = []
    this.initializeGrid()
    
    console.log(`Grid rebalanced: new range ${this.config.lowerPrice} - ${this.config.upperPrice}`)
  }

  private checkGridOpportunities(context: BotContext, currentPrice: number): Signal {
    const buyOrders = this.gridOrders.filter(o => o.side === 'BUY' && !o.filled)
    const sellOrders = this.gridOrders.filter(o => o.side === 'SELL' && !o.filled)

    // Check for buy opportunities (price near or below grid buy levels)
    for (const order of buyOrders) {
      const priceTolerance = 0.001 // 0.1% tolerance
      
      if (currentPrice <= order.price * (1 + priceTolerance)) {
        // Calculate position size based on risk management
        const positionSize = this.calculatePositionSize(
          context,
          this.config.orderAmount / context.bot.risk.maxPositionSize,
          order.price
        )

        if (positionSize > 0) {
          order.filled = true
          return this.createSignal(
            'BUY',
            0.7,
            0.9,
            `Grid buy signal at ${order.price} (current: ${currentPrice})`
          )
        }
      }
    }

    // Check for sell opportunities (price near or above grid sell levels)
    for (const order of sellOrders) {
      const priceTolerance = 0.001 // 0.1% tolerance
      
      if (currentPrice >= order.price * (1 - priceTolerance)) {
        // Check if we have position to sell
        const baseAsset = this.getBaseAsset(context.bot.market.symbol)
        const availablePosition = context.positions[baseAsset] || 0
        
        if (availablePosition >= order.amount) {
          order.filled = true
          return this.createSignal(
            'SELL',
            0.7,
            0.9,
            `Grid sell signal at ${order.price} (current: ${currentPrice})`
          )
        }
      }
    }

    return this.createSignal('HOLD', 0, 0, 'No grid opportunities')
  }

  private getGridEfficiency(): number {
    const filledOrders = this.gridOrders.filter(o => o.filled).length
    const totalOrders = this.gridOrders.length
    return totalOrders > 0 ? filledOrders / totalOrders : 0
  }

  private getGridProfitLoss(context: BotContext): number {
    // Simplified P&L calculation based on filled orders
    let realizedPnL = 0
    let unrealizedPnL = 0
    
    for (const order of this.gridOrders) {
      if (order.filled) {
        if (order.side === 'BUY') {
          unrealizedPnL -= order.price * order.amount
        } else {
          unrealizedPnL += order.price * order.amount
        }
      }
    }
    
    return realizedPnL + unrealizedPnL
  }

  // Public methods for monitoring and management
  public getGridStatus(): {
    totalOrders: number
    filledOrders: number
    pendingOrders: number
    efficiency: number
    estimatedPnL: number
    gridRange: { lower: number; upper: number }
  } {
    return {
      totalOrders: this.gridOrders.length,
      filledOrders: this.gridOrders.filter(o => o.filled).length,
      pendingOrders: this.gridOrders.filter(o => !o.filled).length,
      efficiency: this.getGridEfficiency(),
      estimatedPnL: this.getGridProfitLoss(this.getContextForPnL()),
      gridRange: {
        lower: this.config.lowerPrice,
        upper: this.config.upperPrice
      }
    }
  }

  private getContextForPnL(): BotContext {
    // This would normally be passed from the execute method
    // For now, return a minimal context for P&L calculation
    return {
      bot: this.config as any,
      marketData: [],
      currentPrice: (this.config.upperPrice + this.config.lowerPrice) / 2,
      balance: {},
      positions: {},
      orders: [],
      trades: [],
      timestamp: Date.now()
    }
  }

  public updateGridConfig(newConfig: Partial<GridStrategyConfig>): void {
    if (newConfig.upperPrice && newConfig.lowerPrice && newConfig.upperPrice <= newConfig.lowerPrice) {
      throw new StrategyError('Upper price must be greater than lower price')
    }

    if (newConfig.gridLevels && newConfig.gridLevels < 2) {
      throw new StrategyError('Grid levels must be at least 2')
    }

    this.config = { ...this.config, ...newConfig }
    this.initializeGrid()
    
    console.log('Grid configuration updated and reinitialized')
  }

  public resetGrid(): void {
    this.gridOrders = []
    this.lastRebalanceTime = 0
    this.initializeGrid()
    
    console.log('Grid reset and reinitialized')
  }
}