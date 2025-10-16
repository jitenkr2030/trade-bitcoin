import { BaseStrategy } from './base-strategy'
import { TechnicalIndicators } from './indicators'
import { BotContext, Signal, MeanReversionStrategyConfig, StrategyError } from '../types'

interface MeanReversionPosition {
  entryPrice: number
  entryTime: number
  side: 'BUY' | 'SELL'
  size: number
  targetPrice: number
  stopLoss?: number
  reason: string
}

export class MeanReversionStrategy extends BaseStrategy {
  private config!: MeanReversionStrategyConfig
  private currentPosition: MeanReversionPosition | null = null
  private meanPrice: number = 0
  private upperBand: number = 0
  private lowerBand: number = 0
  private lastRebalanceTime: number = 0
  private totalTrades: number = 0
  private winningTrades: number = 0
  private consecutiveLosses: number = 0

  get name(): string {
    return 'Mean Reversion'
  }

  protected async onInitialize(): Promise<void> {
    this.config = this.config.parameters as MeanReversionStrategyConfig
    
    if (!this.config.period || this.config.period <= 0) {
      throw new StrategyError('Invalid mean reversion configuration: period must be positive')
    }

    if (!this.config.standardDeviations || this.config.standardDeviations <= 0) {
      throw new StrategyError('Invalid mean reversion configuration: standard deviations must be positive')
    }

    if (!this.config.entryThreshold || this.config.entryThreshold <= 0) {
      throw new StrategyError('Invalid mean reversion configuration: entry threshold must be positive')
    }

    if (!this.config.exitThreshold || this.config.exitThreshold <= 0) {
      throw new StrategyError('Invalid mean reversion configuration: exit threshold must be positive')
    }

    if (!this.config.riskPerTrade || this.config.riskPerTrade <= 0 || this.config.riskPerTrade > 1) {
      throw new StrategyError('Invalid mean reversion configuration: risk per trade must be between 0 and 1')
    }

    console.log(`Mean reversion strategy initialized with period=${this.config.period}, stdDevs=${this.config.standardDeviations}`)
  }

  protected async onCleanup(): Promise<void> {
    this.currentPosition = null
    this.meanPrice = 0
    this.upperBand = 0
    this.lowerBand = 0
    this.lastRebalanceTime = 0
    this.consecutiveLosses = 0
  }

  async execute(context: BotContext): Promise<Signal> {
    this.validateContext(context)
    
    const data = context.marketData
    const currentPrice = context.currentPrice
    
    if (data.length < this.config.period) {
      return this.createSignal('HOLD', 0, 0.3, 'Insufficient data for mean reversion analysis')
    }

    // Calculate Bollinger Bands and other indicators
    const indicators = this.calculateTechnicalIndicators(context)
    this.updateBollingerBands(data)
    
    // Check if we should exit current position
    if (this.currentPosition) {
      const exitSignal = this.checkExitConditions(context, currentPrice, indicators)
      if (exitSignal.type !== 'HOLD') {
        return exitSignal
      }
    }

    // Check if we should enter new position
    if (!this.currentPosition) {
      const entrySignal = this.checkEntryConditions(context, currentPrice, indicators)
      if (entrySignal.type !== 'HOLD') {
        return entrySignal
      }
    }

    // Calculate how far price is from mean
    const deviationFromMean = (currentPrice - this.meanPrice) / this.meanPrice
    const zScore = (currentPrice - this.meanPrice) / ((this.upperBand - this.lowerBand) / (2 * this.config.standardDeviations))
    
    // Determine signal strength based on deviation
    const strength = Math.min(1, Math.abs(zScore) / 2)
    const confidence = Math.max(0.3, 1 - Math.abs(deviationFromMean))
    
    return this.createSignal(
      'HOLD',
      strength * 0.4,
      confidence,
      `Price deviation: ${(deviationFromMean * 100).toFixed(2)}% from mean, Z-score: ${zScore.toFixed(2)}`
    )
  }

  private updateBollingerBands(data: MarketData[]): void {
    const bb = TechnicalIndicators.calculateBollingerBands(
      data,
      this.config.period,
      this.config.standardDeviations
    )
    
    if (bb.upper.length > 0 && bb.middle.length > 0 && bb.lower.length > 0) {
      this.meanPrice = bb.middle[bb.middle.length - 1]
      this.upperBand = bb.upper[bb.upper.length - 1]
      this.lowerBand = bb.lower[bb.lower.length - 1]
    }
  }

  private checkEntryConditions(
    context: BotContext,
    currentPrice: number,
    indicators: Record<string, any>
  ): Signal {
    // Don't enter if we have too many consecutive losses
    if (this.consecutiveLosses >= 3) {
      return this.createSignal('HOLD', 0, 0.8, 'Skipping entry due to consecutive losses')
    }

    const zScore = this.calculateZScore(currentPrice)
    const rsi = indicators.rsi || 50
    
    // Check for oversold conditions (buy opportunity)
    if (zScore <= -this.config.entryThreshold && rsi < 30) {
      const positionSize = this.calculatePositionSize(
        context,
        this.config.riskPerTrade,
        currentPrice
      )
      
      if (positionSize > 0) {
        const stopLoss = this.calculateStopLoss(currentPrice, 'BUY', indicators)
        const targetPrice = this.meanPrice // Target is the mean price
        
        return this.createSignal(
          'BUY',
          0.8,
          0.9,
          `Oversold condition detected. Z-score: ${zScore.toFixed(2)}, RSI: ${rsi.toFixed(1)}. Target: ${targetPrice.toFixed(2)}`
        )
      }
    }
    
    // Check for overbought conditions (sell opportunity)
    if (zScore >= this.config.entryThreshold && rsi > 70) {
      const positionSize = this.calculatePositionSize(
        context,
        this.config.riskPerTrade,
        currentPrice
      )
      
      if (positionSize > 0) {
        const stopLoss = this.calculateStopLoss(currentPrice, 'SELL', indicators)
        const targetPrice = this.meanPrice // Target is the mean price
        
        return this.createSignal(
          'SELL',
          0.8,
          0.9,
          `Overbought condition detected. Z-score: ${zScore.toFixed(2)}, RSI: ${rsi.toFixed(1)}. Target: ${targetPrice.toFixed(2)}`
        )
      }
    }
    
    return this.createSignal('HOLD', 0.2, 0.6, 'No mean reversion opportunity')
  }

  private checkExitConditions(
    context: BotContext,
    currentPrice: number,
    indicators: Record<string, any>
  ): Signal {
    if (!this.currentPosition) {
      return this.createSignal('HOLD', 0, 0, 'No position to exit')
    }

    const { entryPrice, side, targetPrice, stopLoss } = this.currentPosition
    const zScore = this.calculateZScore(currentPrice)
    
    // Check stop loss
    if (stopLoss && this.shouldStopLoss(entryPrice, currentPrice, side, 3)) {
      return this.createSignal(
        side === 'BUY' ? 'SELL' : 'BUY',
        0.9,
        1,
        `Stop loss triggered at ${currentPrice.toFixed(2)}`
      )
    }
    
    // Check if price reached target (mean reversion)
    if (side === 'BUY' && currentPrice >= targetPrice) {
      return this.createSignal(
        'SELL',
        0.8,
        0.95,
        `Target reached: price reverted to mean at ${currentPrice.toFixed(2)}`
      )
    }
    
    if (side === 'SELL' && currentPrice <= targetPrice) {
      return this.createSignal(
        'BUY',
        0.8,
        0.95,
        `Target reached: price reverted to mean at ${currentPrice.toFixed(2)}`
      )
    }
    
    // Early exit if price is moving against position and z-score is normalizing
    const zScoreNormalized = Math.abs(zScore) < this.config.exitThreshold
    
    if (zScoreNormalized) {
      const unrealizedPnL = this.calculateUnrealizedPnL(currentPrice)
      
      // Exit with small profit or minimal loss
      if (unrealizedPnL > 0 || Math.abs(unrealizedPnL) < (entryPrice * 0.01)) {
        return this.createSignal(
          side === 'BUY' ? 'SELL' : 'BUY',
          0.6,
          0.8,
          `Early exit: Z-score normalized at ${zScore.toFixed(2)}. P&L: ${unrealizedPnL.toFixed(2)}`
        )
      }
    }
    
    // Check for trend continuation against position (exit early)
    const trendStrength = this.calculateTrendStrength(context.marketData.slice(-20))
    
    if (side === 'BUY' && trendStrength < -0.5) {
      return this.createSignal(
        'SELL',
        0.7,
        0.8,
        `Early exit: Strong downtrend detected against long position`
      )
    }
    
    if (side === 'SELL' && trendStrength > 0.5) {
      return this.createSignal(
        'BUY',
        0.7,
        0.8,
        `Early exit: Strong uptrend detected against short position`
      )
    }
    
    // Calculate unrealized P&L
    const unrealizedPnL = this.calculateUnrealizedPnL(currentPrice)
    const unrealizedPnLPercent = (unrealizedPnL / (entryPrice * this.currentPosition.size)) * 100
    
    return this.createSignal(
      'HOLD',
      0.4,
      0.7,
      `Holding ${side} position. P&L: ${unrealizedPnLPercent.toFixed(2)}%, Z-score: ${zScore.toFixed(2)}`
    )
  }

  private calculateZScore(currentPrice: number): number {
    const bandWidth = (this.upperBand - this.lowerBand) / (2 * this.config.standardDeviations)
    if (bandWidth === 0) return 0
    
    return (currentPrice - this.meanPrice) / bandWidth
  }

  private calculateTrendStrength(data: MarketData[]): number {
    if (data.length < 10) return 0
    
    const sma10 = TechnicalIndicators.calculateSMA(data, 10)
    const currentPrice = data[data.length - 1].close
    const sma10Current = sma10[sma10.length - 1]
    
    // Simple trend strength based on price vs SMA
    return (currentPrice - sma10Current) / sma10Current
  }

  private calculateStopLoss(currentPrice: number, side: 'BUY' | 'SELL', indicators: Record<string, any>): number {
    const atr = indicators.atr || (currentPrice * 0.02) // Default to 2% if ATR not available
    const stopLossMultiplier = 2 // 2x ATR for stop loss
    
    if (side === 'BUY') {
      return currentPrice - (atr * stopLossMultiplier)
    } else {
      return currentPrice + (atr * stopLossMultiplier)
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
  private enterPosition(
    side: 'BUY' | 'SELL', 
    price: number, 
    size: number, 
    targetPrice: number, 
    stopLoss?: number,
    reason: string = ''
  ): void {
    this.currentPosition = {
      entryPrice: price,
      entryTime: Date.now(),
      side,
      size,
      targetPrice,
      stopLoss,
      reason
    }
    
    this.totalTrades++
    console.log(`Entered ${side} position at ${price} with size ${size}. Reason: ${reason}`)
  }

  private exitPosition(price: number, reason: string = ''): void {
    if (!this.currentPosition) return
    
    const { entryPrice, side, size } = this.currentPosition
    const pnl = this.calculateUnrealizedPnL(price)
    
    if (pnl > 0) {
      this.winningTrades++
      this.consecutiveLosses = 0
    } else {
      this.consecutiveLosses++
    }
    
    console.log(`Exited ${side} position at ${price}. P&L: ${pnl.toFixed(2)}. Reason: ${reason}`)
    this.currentPosition = null
  }

  // Additional analysis methods
  private calculateVolatility(data: MarketData[]): number {
    const volatility = TechnicalIndicators.calculateVolatility(data, this.config.period)
    return volatility[volatility.length - 1] || 0
  }

  private isPriceExtreme(currentPrice: number): boolean {
    const zScore = this.calculateZScore(currentPrice)
    return Math.abs(zScore) > this.config.standardDeviations
  }

  private getReversionProbability(currentPrice: number): number {
    const zScore = this.calculateZScore(currentPrice)
    
    // Simple probability based on Z-score
    // Higher Z-score = higher probability of reversion
    if (Math.abs(zScore) > 3) return 0.95
    if (Math.abs(zScore) > 2) return 0.85
    if (Math.abs(zScore) > 1) return 0.70
    if (Math.abs(zScore) > 0.5) return 0.55
    
    return 0.5
  }

  // Public methods for monitoring and management
  public getStrategyStatus(): {
    currentPosition: MeanReversionPosition | null
    meanPrice: number
    upperBand: number
    lowerBand: number
    totalTrades: number
    winningTrades: number
    winRate: number
    consecutiveLosses: number
    currentZScore: number
    reversionProbability: number
    unrealizedPnL: number
  } {
    const currentPrice = this.getCurrentPriceForStatus()
    const currentZScore = this.calculateZScore(currentPrice)
    const reversionProbability = this.getReversionProbability(currentPrice)
    const unrealizedPnL = this.currentPosition ? 
      this.calculateUnrealizedPnL(currentPrice) : 0
    
    return {
      currentPosition: this.currentPosition,
      meanPrice: this.meanPrice,
      upperBand: this.upperBand,
      lowerBand: this.lowerBand,
      totalTrades: this.totalTrades,
      winningTrades: this.winningTrades,
      winRate: this.totalTrades > 0 ? (this.winningTrades / this.totalTrades) * 100 : 0,
      consecutiveLosses: this.consecutiveLosses,
      currentZScore,
      reversionProbability,
      unrealizedPnL
    }
  }

  private getCurrentPriceForStatus(): number {
    // This would normally come from context
    return this.meanPrice || 0
  }

  public updateConfig(newConfig: Partial<MeanReversionStrategyConfig>): void {
    if (newConfig.period && newConfig.period <= 0) {
      throw new StrategyError('Period must be positive')
    }

    if (newConfig.standardDeviations && newConfig.standardDeviations <= 0) {
      throw new StrategyError('Standard deviations must be positive')
    }

    if (newConfig.entryThreshold && newConfig.entryThreshold <= 0) {
      throw new StrategyError('Entry threshold must be positive')
    }

    if (newConfig.exitThreshold && newConfig.exitThreshold <= 0) {
      throw new StrategyError('Exit threshold must be positive')
    }

    if (newConfig.riskPerTrade && (newConfig.riskPerTrade <= 0 || newConfig.riskPerTrade > 1)) {
      throw new StrategyError('Risk per trade must be between 0 and 1')
    }

    this.config = { ...this.config, ...newConfig }
    console.log('Mean reversion strategy configuration updated')
  }

  public resetStrategy(): void {
    this.currentPosition = null
    this.meanPrice = 0
    this.upperBand = 0
    this.lowerBand = 0
    this.lastRebalanceTime = 0
    this.totalTrades = 0
    this.winningTrades = 0
    this.consecutiveLosses = 0
    
    console.log('Mean reversion strategy reset')
  }

  public getMarketRegime(): 'MEAN_REVERTING' | 'TRENDING' | 'SIDEWAYS' {
    const recentData = this.getRecentDataForAnalysis()
    if (recentData.length < 20) return 'SIDEWAYS'
    
    // Calculate price momentum and volatility
    const returns: number[] = []
    for (let i = 1; i < recentData.length; i++) {
      returns.push((recentData[i].close - recentData[i - 1].close) / recentData[i - 1].close)
    }
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length
    const volatility = Math.sqrt(returns.reduce((acc, ret) => acc + Math.pow(ret - avgReturn, 2), 0) / returns.length)
    
    // Simple regime detection
    if (Math.abs(avgReturn) > volatility * 0.5) {
      return avgReturn > 0 ? 'TRENDING' : 'TRENDING'
    } else if (volatility > 0.02) {
      return 'MEAN_REVERTING'
    } else {
      return 'SIDEWAYS'
    }
  }

  private getRecentDataForAnalysis(): MarketData[] {
    // This would normally come from context
    // For now, return empty array
    return []
  }
}