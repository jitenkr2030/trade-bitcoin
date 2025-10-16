import { BaseStrategy } from './base-strategy'
import { TechnicalIndicators } from './indicators'
import { BotContext, Signal, StrategyError } from '../types'

interface SentimentData {
  source: string
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  score: number // -1 to 1
  confidence: number // 0 to 1
  timestamp: number
  weight: number
}

interface SentimentConfig {
  newsWeight: number
  socialWeight: number
  onchainWeight: number
  technicalWeight: number
  sentimentThreshold: number
  confidenceThreshold: number
  lookbackWindow: number
  riskPerTrade: number
  stopLoss: number
  takeProfit: number
}

interface SentimentPosition {
  entryPrice: number
  entryTime: number
  side: 'BUY' | 'SELL'
  size: number
  sentimentScore: number
  confidence: number
  stopLoss?: number
  takeProfit?: number
}

export class SentimentBasedStrategy extends BaseStrategy {
  private config!: SentimentConfig
  private currentPosition: SentimentPosition | null = null
  private sentimentHistory: SentimentData[] = []
  private lastSentimentUpdate: number = 0
  private totalTrades: number = 0
  private winningTrades: number = 0
  private consecutiveLosses: number = 0

  get name(): string {
    return 'Sentiment Based'
  }

  protected async onInitialize(): Promise<void> {
    this.config = this.config.parameters as SentimentConfig
    
    if (!this.config.sentimentThreshold || this.config.sentimentThreshold <= 0) {
      throw new StrategyError('Invalid sentiment configuration: sentiment threshold must be positive')
    }

    if (!this.config.confidenceThreshold || this.config.confidenceThreshold <= 0 || this.config.confidenceThreshold > 1) {
      throw new StrategyError('Invalid sentiment configuration: confidence threshold must be between 0 and 1')
    }

    if (!this.config.riskPerTrade || this.config.riskPerTrade <= 0 || this.config.riskPerTrade > 1) {
      throw new StrategyError('Invalid sentiment configuration: risk per trade must be between 0 and 1')
    }

    // Validate weights sum to 1
    const totalWeight = this.config.newsWeight + this.config.socialWeight + 
                       this.config.onchainWeight + this.config.technicalWeight
    
    if (Math.abs(totalWeight - 1) > 0.01) {
      throw new StrategyError('Invalid sentiment configuration: weights must sum to 1')
    }

    console.log(`Sentiment-based strategy initialized with threshold=${this.config.sentimentThreshold}`)
  }

  protected async onCleanup(): Promise<void> {
    this.currentPosition = null
    this.sentimentHistory = []
    this.lastSentimentUpdate = 0
    this.consecutiveLosses = 0
  }

  async execute(context: BotContext): Promise<Signal> {
    this.validateContext(context)
    
    const currentPrice = context.currentPrice
    
    // Update sentiment data
    await this.updateSentimentData(context)
    
    // Calculate current sentiment score
    const sentimentAnalysis = this.calculateSentimentScore()
    
    // Check if we should exit current position
    if (this.currentPosition) {
      const exitSignal = this.checkExitConditions(context, currentPrice, sentimentAnalysis)
      if (exitSignal.type !== 'HOLD') {
        return exitSignal
      }
    }
    
    // Check if we should enter new position
    if (!this.currentPosition) {
      const entrySignal = this.checkEntryConditions(context, currentPrice, sentimentAnalysis)
      if (entrySignal.type !== 'HOLD') {
        return entrySignal
      }
    }
    
    // Return hold signal with sentiment information
    return this.createSignal(
      'HOLD',
      Math.abs(sentimentAnalysis.score) * 0.5,
      sentimentAnalysis.confidence,
      `Sentiment: ${sentimentAnalysis.direction} (${sentimentAnalysis.score.toFixed(3)}), Confidence: ${(sentimentAnalysis.confidence * 100).toFixed(1)}%`
    )
  }

  private async updateSentimentData(context: BotContext): Promise<void> {
    const currentTime = Date.now()
    
    // Update sentiment data every 5 minutes
    if (currentTime - this.lastSentimentUpdate < 300000) {
      return
    }
    
    this.lastSentimentUpdate = currentTime
    
    try {
      // Collect sentiment from various sources
      const sentimentPromises = [
        this.collectNewsSentiment(context),
        this.collectSocialSentiment(context),
        this.collectOnchainSentiment(context),
        this.collectTechnicalSentiment(context)
      ]
      
      const sentimentResults = await Promise.allSettled(sentimentPromises)
      
      // Process and store sentiment data
      sentimentResults.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          this.sentimentHistory.push(result.value)
        }
      })
      
      // Clean old sentiment data
      const cutoffTime = currentTime - (this.config.lookbackWindow * 24 * 60 * 60 * 1000) // Convert days to milliseconds
      this.sentimentHistory = this.sentimentHistory.filter(data => data.timestamp > cutoffTime)
      
    } catch (error) {
      console.error('Error updating sentiment data:', error)
    }
  }

  private async collectNewsSentiment(context: BotContext): Promise<SentimentData | null> {
    try {
      // Simulate news sentiment analysis
      // In reality, this would call news APIs or analyze news articles
      const newsScore = this.generateRandomSentiment() // Replace with actual news analysis
      const confidence = 0.7 + Math.random() * 0.3
      
      return {
        source: 'news',
        sentiment: newsScore > 0 ? 'BULLISH' : newsScore < 0 ? 'BEARISH' : 'NEUTRAL',
        score: newsScore,
        confidence,
        timestamp: Date.now(),
        weight: this.config.newsWeight
      }
    } catch (error) {
      console.error('Error collecting news sentiment:', error)
      return null
    }
  }

  private async collectSocialSentiment(context: BotContext): Promise<SentimentData | null> {
    try {
      // Simulate social media sentiment analysis
      // In reality, this would analyze Twitter, Reddit, Telegram, etc.
      const socialScore = this.generateRandomSentiment() // Replace with actual social analysis
      const confidence = 0.6 + Math.random() * 0.4
      
      return {
        source: 'social',
        sentiment: socialScore > 0 ? 'BULLISH' : socialScore < 0 ? 'BEARISH' : 'NEUTRAL',
        score: socialScore,
        confidence,
        timestamp: Date.now(),
        weight: this.config.socialWeight
      }
    } catch (error) {
      console.error('Error collecting social sentiment:', error)
      return null
    }
  }

  private async collectOnchainSentiment(context: BotContext): Promise<SentimentData | null> {
    try {
      // Simulate on-chain sentiment analysis
      // In reality, this would analyze blockchain data, transaction volumes, etc.
      const onchainScore = this.generateRandomSentiment() // Replace with actual on-chain analysis
      const confidence = 0.8 + Math.random() * 0.2
      
      return {
        source: 'onchain',
        sentiment: onchainScore > 0 ? 'BULLISH' : onchainScore < 0 ? 'BEARISH' : 'NEUTRAL',
        score: onchainScore,
        confidence,
        timestamp: Date.now(),
        weight: this.config.onchainWeight
      }
    } catch (error) {
      console.error('Error collecting onchain sentiment:', error)
      return null
    }
  }

  private async collectTechnicalSentiment(context: BotContext): Promise<SentimentData | null> {
    try {
      // Analyze technical indicators for sentiment
      const data = context.marketData
      if (data.length < 50) {
        return null
      }
      
      const indicators = this.calculateTechnicalIndicators(context)
      const technicalScore = this.calculateTechnicalSentimentScore(indicators)
      const confidence = 0.9
      
      return {
        source: 'technical',
        sentiment: technicalScore > 0 ? 'BULLISH' : technicalScore < 0 ? 'BEARISH' : 'NEUTRAL',
        score: technicalScore,
        confidence,
        timestamp: Date.now(),
        weight: this.config.technicalWeight
      }
    } catch (error) {
      console.error('Error collecting technical sentiment:', error)
      return null
    }
  }

  private calculateTechnicalSentimentScore(indicators: Record<string, any>): number {
    let score = 0
    
    // RSI sentiment
    const rsi = indicators.rsi || 50
    if (rsi > 70) score -= 0.3 // Overbought
    else if (rsi < 30) score += 0.3 // Oversold
    else if (rsi > 50) score += 0.1 // Slightly bullish
    else score -= 0.1 // Slightly bearish
    
    // MACD sentiment
    if (indicators.macd_histogram > 0) score += 0.2
    else if (indicators.macd_histogram < 0) score -= 0.2
    
    // Moving average sentiment
    if (indicators.sma_20 && indicators.sma_50) {
      if (indicators.sma_20 > indicators.sma_50) score += 0.2
      else score -= 0.2
    }
    
    // Bollinger Bands sentiment
    if (indicators.bb_upper && indicators.bb_lower && indicators.bb_middle) {
      const currentPrice = this.getCurrentPriceForTechnical()
      const bbPosition = (currentPrice - indicators.bb_lower) / (indicators.bb_upper - indicators.bb_lower)
      
      if (bbPosition > 0.8) score -= 0.2 // Near upper band
      else if (bbPosition < 0.2) score += 0.2 // Near lower band
    }
    
    return Math.max(-1, Math.min(1, score))
  }

  private getCurrentPriceForTechnical(): number {
    // This would normally come from context
    return 0 // Placeholder
  }

  private generateRandomSentiment(): number {
    // Replace with actual sentiment analysis
    return (Math.random() - 0.5) * 2 // Random value between -1 and 1
  }

  private calculateSentimentScore(): {
    score: number
    confidence: number
    direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
    weightedSentiments: SentimentData[]
  } {
    if (this.sentimentHistory.length === 0) {
      return {
        score: 0,
        confidence: 0,
        direction: 'NEUTRAL',
        weightedSentiments: []
      }
    }
    
    // Calculate weighted sentiment score
    let totalWeight = 0
    let weightedSum = 0
    const weightedSentiments: SentimentData[] = []
    
    // Group by source and take the most recent
    const latestBySource = new Map<string, SentimentData>()
    
    for (const sentiment of this.sentimentHistory) {
      const existing = latestBySource.get(sentiment.source)
      if (!existing || sentiment.timestamp > existing.timestamp) {
        latestBySource.set(sentiment.source, sentiment)
      }
    }
    
    // Calculate weighted average
    for (const sentiment of latestBySource.values()) {
      const weight = sentiment.weight
      const weightedScore = sentiment.score * weight
      const weightedConfidence = sentiment.confidence * weight
      
      weightedSum += weightedScore
      totalWeight += weight
      
      weightedSentiments.push({
        ...sentiment,
        score: weightedScore,
        confidence: weightedConfidence
      })
    }
    
    const score = totalWeight > 0 ? weightedSum / totalWeight : 0
    const confidence = weightedSentiments.reduce((sum, s) => sum + s.confidence, 0) / weightedSentiments.length
    
    let direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
    if (score > this.config.sentimentThreshold) {
      direction = 'BULLISH'
    } else if (score < -this.config.sentimentThreshold) {
      direction = 'BEARISH'
    } else {
      direction = 'NEUTRAL'
    }
    
    return {
      score,
      confidence,
      direction,
      weightedSentiments
    }
  }

  private checkEntryConditions(
    context: BotContext,
    currentPrice: number,
    sentimentAnalysis: any
  ): Signal {
    // Don't enter if we have too many consecutive losses
    if (this.consecutiveLosses >= 3) {
      return this.createSignal('HOLD', 0, 0.8, 'Skipping entry due to consecutive losses')
    }
    
    const { score, confidence, direction } = sentimentAnalysis
    
    // Check if sentiment meets threshold and confidence requirements
    if (confidence < this.config.confidenceThreshold) {
      return this.createSignal('HOLD', 0, 0.5, `Insufficient confidence: ${(confidence * 100).toFixed(1)}%`)
    }
    
    if (Math.abs(score) < this.config.sentimentThreshold) {
      return this.createSignal('HOLD', 0, 0.3, `Sentiment below threshold: ${score.toFixed(3)}`)
    }
    
    // Calculate position size
    const positionSize = this.calculatePositionSize(
      context,
      this.config.riskPerTrade,
      currentPrice
    )
    
    if (positionSize <= 0) {
      return this.createSignal('HOLD', 0, 0.4, 'Insufficient balance for position')
    }
    
    // Calculate stop loss and take profit
    const stopLoss = this.calculateStopLoss(currentPrice, direction, context)
    const takeProfit = this.calculateTakeProfit(currentPrice, direction, context)
    
    if (direction === 'BULLISH') {
      return this.createSignal(
        'BUY',
        Math.min(1, Math.abs(score)),
        confidence,
        `Bullish sentiment detected. Score: ${score.toFixed(3)}, Confidence: ${(confidence * 100).toFixed(1)}%. SL: ${stopLoss.toFixed(2)}, TP: ${takeProfit.toFixed(2)}`
      )
    } else if (direction === 'BEARISH') {
      return this.createSignal(
        'SELL',
        Math.min(1, Math.abs(score)),
        confidence,
        `Bearish sentiment detected. Score: ${score.toFixed(3)}, Confidence: ${(confidence * 100).toFixed(1)}%. SL: ${stopLoss.toFixed(2)}, TP: ${takeProfit.toFixed(2)}`
      )
    }
    
    return this.createSignal('HOLD', 0, 0.3, 'No clear sentiment signal')
  }

  private checkExitConditions(
    context: BotContext,
    currentPrice: number,
    sentimentAnalysis: any
  ): Signal {
    if (!this.currentPosition) {
      return this.createSignal('HOLD', 0, 0, 'No position to exit')
    }
    
    const { entryPrice, side, stopLoss, takeProfit, sentimentScore: entrySentiment } = this.currentPosition
    const { score: currentSentiment, confidence, direction } = sentimentAnalysis
    
    // Check stop loss
    if (stopLoss && this.shouldStopLoss(entryPrice, currentPrice, side, this.config.stopLoss)) {
      return this.createSignal(
        side === 'BUY' ? 'SELL' : 'BUY',
        0.9,
        1,
        `Stop loss triggered at ${currentPrice.toFixed(2)}`
      )
    }
    
    // Check take profit
    if (takeProfit && this.shouldTakeProfit(entryPrice, currentPrice, side, this.config.takeProfit)) {
      return this.createSignal(
        side === 'BUY' ? 'SELL' : 'BUY',
        0.9,
        1,
        `Take profit triggered at ${currentPrice.toFixed(2)}`
      )
    }
    
    // Check for sentiment reversal
    const sentimentReversal = this.isSentimentReversal(entrySentiment, currentSentiment, side)
    
    if (sentimentReversal && confidence > this.config.confidenceThreshold) {
      return this.createSignal(
        side === 'BUY' ? 'SELL' : 'BUY',
        0.7,
        confidence,
        `Sentiment reversal detected. Entry: ${entrySentiment.toFixed(3)}, Current: ${currentSentiment.toFixed(3)}`
      )
    }
    
    // Check for weakening sentiment
    const sentimentWeakening = this.isSentimentWeakening(entrySentiment, currentSentiment, side)
    
    if (sentimentWeakening) {
      const unrealizedPnL = this.calculateUnrealizedPnL(currentPrice)
      
      // Exit with small profit to avoid losses
      if (unrealizedPnL > 0) {
        return this.createSignal(
          side === 'BUY' ? 'SELL' : 'BUY',
          0.6,
          0.8,
          `Sentiment weakening, exiting with profit. P&L: ${unrealizedPnL.toFixed(2)}`
        )
      }
    }
    
    // Calculate unrealized P&L
    const unrealizedPnL = this.calculateUnrealizedPnL(currentPrice)
    const unrealizedPnLPercent = (unrealizedPnL / (entryPrice * this.currentPosition.size)) * 100
    
    return this.createSignal(
      'HOLD',
      0.4,
      0.7,
      `Holding ${side} position. P&L: ${unrealizedPnLPercent.toFixed(2)}%, Sentiment: ${direction} (${currentSentiment.toFixed(3)})`
    )
  }

  private isSentimentReversal(entrySentiment: number, currentSentiment: number, side: 'BUY' | 'SELL'): boolean {
    const sentimentChange = currentSentiment - entrySentiment
    const reversalThreshold = 0.5
    
    if (side === 'BUY') {
      return entrySentiment > 0 && currentSentiment < -reversalThreshold
    } else {
      return entrySentiment < 0 && currentSentiment > reversalThreshold
    }
  }

  private isSentimentWeakening(entrySentiment: number, currentSentiment: number, side: 'BUY' | 'SELL'): boolean {
    const sentimentChange = currentSentiment - entrySentiment
    const weakeningThreshold = 0.3
    
    if (side === 'BUY') {
      return sentimentChange < -weakeningThreshold
    } else {
      return sentimentChange > weakeningThreshold
    }
  }

  private calculateStopLoss(currentPrice: number, direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL', context: BotContext): number {
    const stopLossPercent = this.config.stopLoss
    
    if (direction === 'BULLISH') {
      return currentPrice * (1 - stopLossPercent / 100)
    } else {
      return currentPrice * (1 + stopLossPercent / 100)
    }
  }

  private calculateTakeProfit(currentPrice: number, direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL', context: BotContext): number {
    const takeProfitPercent = this.config.takeProfit
    
    if (direction === 'BULLISH') {
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
  private enterPosition(
    side: 'BUY' | 'SELL',
    price: number,
    size: number,
    sentimentScore: number,
    confidence: number,
    stopLoss?: number,
    takeProfit?: number
  ): void {
    this.currentPosition = {
      entryPrice: price,
      entryTime: Date.now(),
      side,
      size,
      sentimentScore,
      confidence,
      stopLoss,
      takeProfit
    }
    
    this.totalTrades++
    console.log(`Entered ${side} position at ${price} with size ${size}. Sentiment: ${sentimentScore.toFixed(3)}`)
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

  // Public methods for monitoring and management
  public getStrategyStatus(): {
    currentPosition: SentimentPosition | null
    totalTrades: number
    winningTrades: number
    winRate: number
    consecutiveLosses: number
    currentSentiment: {
      score: number
      confidence: number
      direction: string
    }
    sentimentHistory: {
      total: number
      sources: string[]
      latestUpdate: number
    }
    unrealizedPnL: number
  } {
    const sentimentAnalysis = this.calculateSentimentScore()
    const unrealizedPnL = this.currentPosition ? 
      this.calculateUnrealizedPnL(this.getCurrentPriceForStatus()) : 0
    
    const sources = [...new Set(this.sentimentHistory.map(s => s.source))]
    
    return {
      currentPosition: this.currentPosition,
      totalTrades: this.totalTrades,
      winningTrades: this.winningTrades,
      winRate: this.totalTrades > 0 ? (this.winningTrades / this.totalTrades) * 100 : 0,
      consecutiveLosses: this.consecutiveLosses,
      currentSentiment: {
        score: sentimentAnalysis.score,
        confidence: sentimentAnalysis.confidence,
        direction: sentimentAnalysis.direction
      },
      sentimentHistory: {
        total: this.sentimentHistory.length,
        sources,
        latestUpdate: this.lastSentimentUpdate
      },
      unrealizedPnL
    }
  }

  private getCurrentPriceForStatus(): number {
    // This would normally come from context
    return this.currentPosition?.entryPrice || 0
  }

  public updateConfig(newConfig: Partial<SentimentConfig>): void {
    if (newConfig.sentimentThreshold && newConfig.sentimentThreshold <= 0) {
      throw new StrategyError('Sentiment threshold must be positive')
    }

    if (newConfig.confidenceThreshold && (newConfig.confidenceThreshold <= 0 || newConfig.confidenceThreshold > 1)) {
      throw new StrategyError('Confidence threshold must be between 0 and 1')
    }

    if (newConfig.riskPerTrade && (newConfig.riskPerTrade <= 0 || newConfig.riskPerTrade > 1)) {
      throw new StrategyError('Risk per trade must be between 0 and 1')
    }

    // Validate weights sum to 1
    const totalWeight = (newConfig.newsWeight || this.config.newsWeight) + 
                       (newConfig.socialWeight || this.config.socialWeight) + 
                       (newConfig.onchainWeight || this.config.onchainWeight) + 
                       (newConfig.technicalWeight || this.config.technicalWeight)
    
    if (Math.abs(totalWeight - 1) > 0.01) {
      throw new StrategyError('Weights must sum to 1')
    }

    this.config = { ...this.config, ...newConfig }
    console.log('Sentiment-based strategy configuration updated')
  }

  public resetStrategy(): void {
    this.currentPosition = null
    this.sentimentHistory = []
    this.lastSentimentUpdate = 0
    this.totalTrades = 0
    this.winningTrades = 0
    this.consecutiveLosses = 0
    
    console.log('Sentiment-based strategy reset')
  }

  public getSentimentBreakdown(): {
    news: { score: number; confidence: number; count: number }
    social: { score: number; confidence: number; count: number }
    onchain: { score: number; confidence: number; count: number }
    technical: { score: number; confidence: number; count: number }
  } {
    const breakdown = {
      news: { score: 0, confidence: 0, count: 0 },
      social: { score: 0, confidence: 0, count: 0 },
      onchain: { score: 0, confidence: 0, count: 0 },
      technical: { score: 0, confidence: 0, count: 0 }
    }
    
    for (const sentiment of this.sentimentHistory) {
      const source = sentiment.source.toLowerCase()
      if (source.includes('news') && breakdown.news.count < 10) {
        breakdown.news.score += sentiment.score
        breakdown.news.confidence += sentiment.confidence
        breakdown.news.count++
      } else if (source.includes('social') && breakdown.social.count < 10) {
        breakdown.social.score += sentiment.score
        breakdown.social.confidence += sentiment.confidence
        breakdown.social.count++
      } else if (source.includes('onchain') && breakdown.onchain.count < 10) {
        breakdown.onchain.score += sentiment.score
        breakdown.onchain.confidence += sentiment.confidence
        breakdown.onchain.count++
      } else if (source.includes('technical') && breakdown.technical.count < 10) {
        breakdown.technical.score += sentiment.score
        breakdown.technical.confidence += sentiment.confidence
        breakdown.technical.count++
      }
    }
    
    // Calculate averages
    Object.keys(breakdown).forEach(key => {
      const source = breakdown[key as keyof typeof breakdown]
      if (source.count > 0) {
        source.score /= source.count
        source.confidence /= source.count
      }
    })
    
    return breakdown
  }
}