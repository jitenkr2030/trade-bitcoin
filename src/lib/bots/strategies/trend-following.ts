import { BaseStrategy } from './base-strategy'
import { TechnicalIndicators } from './indicators'
import { BotContext, Signal, TrendFollowingStrategyConfig, StrategyError } from '../types'

interface Position {
  entryPrice: number
  entryTime: number
  side: 'BUY' | 'SELL'
  size: number
  stopLoss?: number
  takeProfit?: number
}

export class TrendFollowingStrategy extends BaseStrategy {
  private config!: TrendFollowingStrategyConfig
  private currentPosition: Position | null = null
  private lastSignal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD'
  private consecutiveLosses: number = 0
  private consecutiveWins: number = 0
  private totalTrades: number = 0
  private winningTrades: number = 0

  get name(): string {
    return 'Trend Following'
  }

  protected async onInitialize(): Promise<void> {
    this.config = this.config.parameters as TrendFollowingStrategyConfig
    
    if (!this.config.fastPeriod || this.config.fastPeriod <= 0) {
      throw new StrategyError('Invalid trend configuration: fast period must be positive')
    }

    if (!this.config.slowPeriod || this.config.slowPeriod <= 0) {
      throw new StrategyError('Invalid trend configuration: slow period must be positive')
    }

    if (this.config.fastPeriod >= this.config.slowPeriod) {
      throw new StrategyError('Fast period must be less than slow period')
    }

    if (!this.config.signalPeriod || this.config.signalPeriod <= 0) {
      throw new StrategyError('Invalid trend configuration: signal period must be positive')
    }

    if (!this.config.riskPerTrade || this.config.riskPerTrade <= 0 || this.config.riskPerTrade > 1) {
      throw new StrategyError('Invalid trend configuration: risk per trade must be between 0 and 1')
    }

    console.log(`Trend following strategy initialized with fast=${this.config.fastPeriod}, slow=${this.config.slowPeriod}`)
  }

  protected async onCleanup(): Promise<void> {
    this.currentPosition = null
    this.lastSignal = 'HOLD'
    this.consecutiveLosses = 0
    this.consecutiveWins = 0
  }

  async execute(context: BotContext): Promise<Signal> {
    this.validateContext(context)
    
    const data = context.marketData
    const currentPrice = context.currentPrice
    
    if (data.length < this.config.slowPeriod) {
      return this.createSignal('HOLD', 0, 0.3, 'Insufficient data for trend analysis')
    }

    // Calculate technical indicators
    const indicators = this.calculateTechnicalIndicators(context)
    
    // Determine trend direction and strength
    const trendAnalysis = this.analyzeTrend(data, indicators)
    
    // Check if we should exit current position
    if (this.currentPosition) {
      const exitSignal = this.checkExitConditions(context, currentPrice, indicators, trendAnalysis)
      if (exitSignal.type !== 'HOLD') {
        return exitSignal
      }
    }

    // Check if we should enter new position
    if (!this.currentPosition) {
      const entrySignal = this.checkEntryConditions(context, currentPrice, indicators, trendAnalysis)
      if (entrySignal.type !== 'HOLD') {
        return entrySignal
      }
    }

    // Return hold signal with trend information
    return this.createSignal(
      'HOLD',
      0.3,
      0.7,
      `Trend: ${trendAnalysis.direction} (${trendAnalysis.strength.toFixed(2)}), Position: ${this.currentPosition ? 'Open' : 'None'}`
    )
  }

  private analyzeTrend(data: MarketData[], indicators: Record<string, any>): {
    direction: 'BULLISH' | 'BEARISH' | 'SIDEWAYS'
    strength: number
    momentum: 'STRONG' | 'MODERATE' | 'WEAK'
  } {
    const recentData = data.slice(-50) // Last 50 candles
    const currentPrice = data[data.length - 1].close
    
    // Calculate trend using multiple indicators
    const sma20 = TechnicalIndicators.calculateSMA(recentData, 20)
    const sma50 = TechnicalIndicators.calculateSMA(recentData, 50)
    const currentSMA20 = sma20[sma20.length - 1]
    const currentSMA50 = sma50[sma50.length - 1]
    
    // MACD analysis
    const macd = TechnicalIndicators.calculateMACD(
      recentData,
      this.config.fastPeriod,
      this.config.slowPeriod,
      this.config.signalPeriod
    )
    const currentMACD = macd.macd[macd.macd.length - 1] || 0
    const currentSignal = macd.signal[macd.signal.length - 1] || 0
    const currentHistogram = macd.histogram[macd.histogram.length - 1] || 0
    
    // RSI for momentum
    const rsi = TechnicalIndicators.calculateRSI(recentData, 14)
    const currentRSI = rsi[rsi.length - 1] || 50
    
    // Determine trend direction
    let direction: 'BULLISH' | 'BEARISH' | 'SIDEWAYS' = 'SIDEWAYS'
    let strength = 0
    
    // Price vs SMAs
    const priceAboveSMA20 = currentPrice > currentSMA20
    const priceAboveSMA50 = currentPrice > currentSMA50
    const sma20AboveSMA50 = currentSMA20 > currentSMA50
    
    // MACD signals
    const macdBullish = currentMACD > currentSignal && currentHistogram > 0
    const macdBearish = currentMACD < currentSignal && currentHistogram < 0
    
    // Calculate trend strength
    const bullishSignals = [
      priceAboveSMA20,
      priceAboveSMA50,
      sma20AboveSMA50,
      macdBullish,
      currentRSI > 50
    ].filter(Boolean).length
    
    const bearishSignals = [
      !priceAboveSMA20,
      !priceAboveSMA50,
      !sma20AboveSMA50,
      macdBearish,
      currentRSI < 50
    ].filter(Boolean).length
    
    if (bullishSignals >= 4) {
      direction = 'BULLISH'
      strength = bullishSignals / 5
    } else if (bearishSignals >= 4) {
      direction = 'BEARISH'
      strength = bearishSignals / 5
    } else {
      direction = 'SIDEWAYS'
      strength = Math.abs(bullishSignals - bearishSignals) / 5
    }
    
    // Determine momentum strength
    let momentum: 'STRONG' | 'MODERATE' | 'WEAK' = 'MODERATE'
    const rsiStrength = Math.abs(currentRSI - 50) / 50
    const macdStrength = Math.abs(currentHistogram) / (Math.abs(currentMACD) + 0.0001)
    
    if (rsiStrength > 0.7 && macdStrength > 0.5) {
      momentum = 'STRONG'
    } else if (rsiStrength > 0.3 && macdStrength > 0.2) {
      momentum = 'MODERATE'
    } else {
      momentum = 'WEAK'
    }
    
    return { direction, strength, momentum }
  }

  private checkEntryConditions(
    context: BotContext,
    currentPrice: number,
    indicators: Record<string, any>,
    trendAnalysis: any
  ): Signal {
    // Don't enter if we have too many consecutive losses
    if (this.consecutiveLosses >= 3) {
      return this.createSignal('HOLD', 0, 0.8, 'Skipping entry due to consecutive losses')
    }

    const data = context.marketData
    const recentData = data.slice(-20)
    
    // Calculate MACD crossover signals
    const macd = TechnicalIndicators.calculateMACD(
      recentData,
      this.config.fastPeriod,
      this.config.slowPeriod,
      this.config.signalPeriod
    )
    
    if (macd.macd.length < 2 || macd.signal.length < 2) {
      return this.createSignal('HOLD', 0, 0.3, 'Insufficient MACD data')
    }
    
    const macdCrossover = this.detectMACDCrossover(macd)
    
    // Entry conditions based on trend and signals
    if (trendAnalysis.direction === 'BULLISH' && macdCrossover === 'BULLISH') {
      const positionSize = this.calculatePositionSize(
        context,
        this.config.riskPerTrade,
        currentPrice
      )
      
      if (positionSize > 0) {
        const stopLoss = this.calculateStopLoss(currentPrice, 'BUY', indicators)
        const takeProfit = this.calculateTakeProfit(currentPrice, 'BUY', indicators)
        
        return this.createSignal(
          'BUY',
          0.8,
          0.9,
          `Bullish trend with MACD crossover. Entry: ${currentPrice}, SL: ${stopLoss}, TP: ${takeProfit}`
        )
      }
    }
    
    if (trendAnalysis.direction === 'BEARISH' && macdCrossover === 'BEARISH') {
      const positionSize = this.calculatePositionSize(
        context,
        this.config.riskPerTrade,
        currentPrice
      )
      
      if (positionSize > 0) {
        const stopLoss = this.calculateStopLoss(currentPrice, 'SELL', indicators)
        const takeProfit = this.calculateTakeProfit(currentPrice, 'SELL', indicators)
        
        return this.createSignal(
          'SELL',
          0.8,
          0.9,
          `Bearish trend with MACD crossover. Entry: ${currentPrice}, SL: ${stopLoss}, TP: ${takeProfit}`
        )
      }
    }
    
    return this.createSignal('HOLD', 0.2, 0.6, 'No clear entry signal')
  }

  private checkExitConditions(
    context: BotContext,
    currentPrice: number,
    indicators: Record<string, any>,
    trendAnalysis: any
  ): Signal {
    if (!this.currentPosition) {
      return this.createSignal('HOLD', 0, 0, 'No position to exit')
    }

    const { entryPrice, side, stopLoss, takeProfit } = this.currentPosition
    const data = context.marketData
    const recentData = data.slice(-20)
    
    // Check stop loss
    if (stopLoss && this.shouldStopLoss(entryPrice, currentPrice, side, this.config.stopLoss || 2)) {
      return this.createSignal(
        side === 'BUY' ? 'SELL' : 'BUY',
        0.9,
        1,
        `Stop loss triggered at ${currentPrice}`
      )
    }
    
    // Check take profit
    if (takeProfit && this.shouldTakeProfit(entryPrice, currentPrice, side, this.config.takeProfit || 4)) {
      return this.createSignal(
        side === 'BUY' ? 'SELL' : 'BUY',
        0.9,
        1,
        `Take profit triggered at ${currentPrice}`
      )
    }
    
    // Check trend reversal
    const macd = TechnicalIndicators.calculateMACD(
      recentData,
      this.config.fastPeriod,
      this.config.slowPeriod,
      this.config.signalPeriod
    )
    
    if (macd.macd.length < 2 || macd.signal.length < 2) {
      return this.createSignal('HOLD', 0.3, 0.6, 'Insufficient data for exit analysis')
    }
    
    const macdCrossover = this.detectMACDCrossover(macd)
    
    // Exit on trend reversal against position
    if (side === 'BUY' && trendAnalysis.direction === 'BEARISH' && macdCrossover === 'BEARISH') {
      return this.createSignal(
        'SELL',
        0.7,
        0.8,
        `Trend reversal detected, exiting long position at ${currentPrice}`
      )
    }
    
    if (side === 'SELL' && trendAnalysis.direction === 'BULLISH' && macdCrossover === 'BULLISH') {
      return this.createSignal(
        'BUY',
        0.7,
        0.8,
        `Trend reversal detected, exiting short position at ${currentPrice}`
      )
    }
    
    // Calculate unrealized P&L
    const unrealizedPnL = this.calculateUnrealizedPnL(currentPrice)
    const unrealizedPnLPercent = (unrealizedPnL / (entryPrice * this.currentPosition.size)) * 100
    
    return this.createSignal(
      'HOLD',
      0.4,
      0.7,
      `Holding ${side} position. P&L: ${unrealizedPnLPercent.toFixed(2)}%`
    )
  }

  private detectMACDCrossover(macd: { macd: number[]; signal: number[]; histogram: number[] }): 'BULLISH' | 'BEARISH' | 'NONE' {
    if (macd.macd.length < 2 || macd.signal.length < 2) {
      return 'NONE'
    }
    
    const prevMACD = macd.macd[macd.macd.length - 2]
    const currMACD = macd.macd[macd.macd.length - 1]
    const prevSignal = macd.signal[macd.signal.length - 2]
    const currSignal = macd.signal[macd.signal.length - 1]
    
    // Bullish crossover: MACD crosses above signal line
    if (prevMACD <= prevSignal && currMACD > currSignal) {
      return 'BULLISH'
    }
    
    // Bearish crossover: MACD crosses below signal line
    if (prevMACD >= prevSignal && currMACD < currSignal) {
      return 'BEARISH'
    }
    
    return 'NONE'
  }

  private calculateStopLoss(currentPrice: number, side: 'BUY' | 'SELL', indicators: Record<string, any>): number {
    const stopLossPercent = this.config.stopLoss || 2
    
    if (side === 'BUY') {
      return currentPrice * (1 - stopLossPercent / 100)
    } else {
      return currentPrice * (1 + stopLossPercent / 100)
    }
  }

  private calculateTakeProfit(currentPrice: number, side: 'BUY' | 'SELL', indicators: Record<string, any>): number {
    const takeProfitPercent = this.config.takeProfit || 4
    
    if (side === 'BUY') {
      return currentPrice * (1 + takeProfitPercent / 100)
    } else {
      return currentPrice * (1 - takeProfitPercent / 100)
    }
  }

  private calculateUnrealizedPnL(currentPrice: number): number {
    if (!this.currentPosition) return 0
    
    const { entryPrice, side, size } = this.currentPosition
    
    if (side === 'BUY') {
      return (currentPrice - entryPrice) * size
    } else {
      return (entryPrice - currentPrice) * size
    }
  }

  // Position management methods
  private enterPosition(side: 'BUY' | 'SELL', price: number, size: number, stopLoss?: number, takeProfit?: number): void {
    this.currentPosition = {
      entryPrice: price,
      entryTime: Date.now(),
      side,
      size,
      stopLoss,
      takeProfit
    }
    
    this.totalTrades++
    console.log(`Entered ${side} position at ${price} with size ${size}`)
  }

  private exitPosition(price: number): void {
    if (!this.currentPosition) return
    
    const { entryPrice, side, size } = this.currentPosition
    const pnl = this.calculateUnrealizedPnL(price)
    
    if (pnl > 0) {
      this.consecutiveWins++
      this.consecutiveLosses = 0
      this.winningTrades++
    } else {
      this.consecutiveLosses++
      this.consecutiveWins = 0
    }
    
    console.log(`Exited ${side} position at ${price}. P&L: ${pnl.toFixed(2)}`)
    this.currentPosition = null
  }

  // Public methods for monitoring and management
  public getStrategyStatus(): {
    currentPosition: Position | null
    totalTrades: number
    winningTrades: number
    winRate: number
    consecutiveWins: number
    consecutiveLosses: number
    lastSignal: string
    unrealizedPnL: number
  } {
    const unrealizedPnL = this.currentPosition ? 
      this.calculateUnrealizedPnL(this.getCurrentPriceForStatus()) : 0
    
    return {
      currentPosition: this.currentPosition,
      totalTrades: this.totalTrades,
      winningTrades: this.winningTrades,
      winRate: this.totalTrades > 0 ? (this.winningTrades / this.totalTrades) * 100 : 0,
      consecutiveWins: this.consecutiveWins,
      consecutiveLosses: this.consecutiveLosses,
      lastSignal: this.lastSignal,
      unrealizedPnL
    }
  }

  private getCurrentPriceForStatus(): number {
    // This would normally come from context
    return this.currentPosition?.entryPrice || 0
  }

  public updateConfig(newConfig: Partial<TrendFollowingStrategyConfig>): void {
    if (newConfig.fastPeriod && newConfig.fastPeriod <= 0) {
      throw new StrategyError('Fast period must be positive')
    }

    if (newConfig.slowPeriod && newConfig.slowPeriod <= 0) {
      throw new StrategyError('Slow period must be positive')
    }

    if (newConfig.fastPeriod && newConfig.slowPeriod && newConfig.fastPeriod >= newConfig.slowPeriod) {
      throw new StrategyError('Fast period must be less than slow period')
    }

    if (newConfig.riskPerTrade && (newConfig.riskPerTrade <= 0 || newConfig.riskPerTrade > 1)) {
      throw new StrategyError('Risk per trade must be between 0 and 1')
    }

    this.config = { ...this.config, ...newConfig }
    console.log('Trend following strategy configuration updated')
  }

  public resetStrategy(): void {
    this.currentPosition = null
    this.lastSignal = 'HOLD'
    this.consecutiveLosses = 0
    this.consecutiveWins = 0
    this.totalTrades = 0
    this.winningTrades = 0
    
    console.log('Trend following strategy reset')
  }
}