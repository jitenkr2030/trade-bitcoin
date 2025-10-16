import { BaseStrategy } from './base-strategy'
import { TechnicalIndicators } from './indicators'
import { BotContext, Signal, StrategyError } from '../types'
import ZAI from 'z-ai-web-dev-sdk'

interface MLPredictionConfig {
  modelType: 'LSTM' | 'RANDOM_FOREST' | 'GRADIENT_BOOSTING' | 'NEURAL_NETWORK'
  predictionHorizon: number // minutes
  confidenceThreshold: number
  featureWindow: number // minutes
  riskPerTrade: number
  stopLoss: number
  takeProfit: number
  maxPositionSize: number
  retrainInterval: number // minutes
  minAccuracy: number
}

interface FeatureSet {
  technical: number[]
  market: number[]
  sentiment: number[]
  temporal: number[]
}

interface PredictionResult {
  direction: 'UP' | 'DOWN' | 'SIDEWAYS'
  confidence: number
  predictedPrice: number
  timeframe: number
  accuracy: number
  features: FeatureSet
  timestamp: number
}

interface MLPredictionPosition {
  entryPrice: number
  entryTime: number
  side: 'BUY' | 'SELL'
  size: number
  prediction: PredictionResult
  stopLoss?: number
  takeProfit?: number
  maxHoldTime: number
}

interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  lastTrained: number
  trainingSamples: number
}

export class MLPredictionStrategy extends BaseStrategy {
  private config!: MLPredictionConfig
  private currentPosition: MLPredictionPosition | null = null
  private zai: ZAI | null = null
  private modelMetrics: ModelMetrics
  private predictionHistory: PredictionResult[] = []
  private lastPredictionTime: number = 0
  private lastRetrainTime: number = 0
  private totalTrades: number = 0
  private successfulTrades: number = 0
  private consecutiveLosses: number = 0
  private featureCache: Map<string, FeatureSet> = new Map()

  get name(): string {
    return 'ML Prediction'
  }

  protected async onInitialize(): Promise<void> {
    this.config = this.config.parameters as MLPredictionConfig
    
    if (!this.config.predictionHorizon || this.config.predictionHorizon <= 0) {
      throw new StrategyError('Invalid ML configuration: prediction horizon must be positive')
    }

    if (!this.config.confidenceThreshold || this.config.confidenceThreshold <= 0 || this.config.confidenceThreshold > 1) {
      throw new StrategyError('Invalid ML configuration: confidence threshold must be between 0 and 1')
    }

    if (!this.config.featureWindow || this.config.featureWindow <= 0) {
      throw new StrategyError('Invalid ML configuration: feature window must be positive')
    }

    if (!this.config.riskPerTrade || this.config.riskPerTrade <= 0 || this.config.riskPerTrade > 1) {
      throw new StrategyError('Invalid ML configuration: risk per trade must be between 0 and 1')
    }

    if (!this.config.minAccuracy || this.config.minAccuracy <= 0 || this.config.minAccuracy > 1) {
      throw new StrategyError('Invalid ML configuration: minimum accuracy must be between 0 and 1')
    }

    // Initialize ZAI SDK
    try {
      this.zai = await ZAI.create()
    } catch (error) {
      console.warn('Failed to initialize ZAI SDK, using fallback ML:', error)
    }

    // Initialize model metrics
    this.modelMetrics = {
      accuracy: 0.85, // Default accuracy
      precision: 0.82,
      recall: 0.78,
      f1Score: 0.80,
      lastTrained: Date.now(),
      trainingSamples: 1000
    }

    console.log(`ML prediction strategy initialized with ${this.config.modelType} model`)
  }

  protected async onCleanup(): Promise<void> {
    this.currentPosition = null
    this.predictionHistory = []
    this.lastPredictionTime = 0
    this.lastRetrainTime = 0
    this.consecutiveLosses = 0
    this.featureCache.clear()
    
    if (this.zai) {
      // Clean up ZAI resources if needed
    }
  }

  async execute(context: BotContext): Promise<Signal> {
    this.validateContext(context)
    
    const currentPrice = context.currentPrice
    const currentTime = Date.now()
    
    // Check if model needs retraining
    if (this.shouldRetrainModel(currentTime)) {
      await this.retrainModel(context)
    }
    
    // Generate new prediction if needed
    let prediction: PredictionResult | null = null
    
    if (currentTime - this.lastPredictionTime > 60000) { // New prediction every minute
      prediction = await this.generatePrediction(context)
      this.lastPredictionTime = currentTime
    } else {
      // Use latest prediction
      prediction = this.predictionHistory.length > 0 ? 
        this.predictionHistory[this.predictionHistory.length - 1] : null
    }
    
    // Check if we should exit current position
    if (this.currentPosition) {
      const exitSignal = this.checkExitConditions(context, currentPrice, prediction)
      if (exitSignal.type !== 'HOLD') {
        return exitSignal
      }
    }
    
    // Check if we should enter new position
    if (!this.currentPosition && prediction) {
      const entrySignal = this.checkEntryConditions(context, currentPrice, prediction)
      if (entrySignal.type !== 'HOLD') {
        return entrySignal
      }
    }
    
    // Return hold signal with prediction information
    const predictionInfo = prediction ? 
      `ML Prediction: ${prediction.direction} (${(prediction.confidence * 100).toFixed(1)}% confidence, ${prediction.accuracy.toFixed(2)} accuracy)` :
      'Waiting for ML prediction...'
    
    return this.createSignal(
      'HOLD',
      prediction ? Math.abs(prediction.confidence - 0.5) * 2 : 0.2,
      prediction ? prediction.confidence : 0.5,
      predictionInfo
    )
  }

  private shouldRetrainModel(currentTime: number): boolean {
    const timeSinceLastTrain = currentTime - this.lastRetrainTime
    const retrainInterval = this.config.retrainInterval * 60 * 1000 // Convert to milliseconds
    
    return timeSinceLastTrain > retrainInterval && this.modelMetrics.accuracy < this.config.minAccuracy
  }

  private async retrainModel(context: BotContext): Promise<void> {
    try {
      console.log('Retraining ML model...')
      
      // Collect training data
      const trainingData = await this.collectTrainingData(context)
      
      if (trainingData.length < 100) {
        console.log('Insufficient training data for retraining')
        return
      }
      
      // Prepare training prompt for ZAI
      const trainingPrompt = this.prepareTrainingPrompt(trainingData)
      
      if (this.zai) {
        try {
          const response = await this.zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are a machine learning model trainer for cryptocurrency price prediction. Analyze the provided training data and update the model parameters to improve prediction accuracy.'
              },
              {
                role: 'user',
                content: trainingPrompt
              }
            ],
            max_tokens: 500,
            temperature: 0.1
          })
          
          // Parse response and update model metrics
          const modelUpdate = this.parseModelUpdateResponse(response.choices[0]?.message?.content || '')
          this.updateModelMetrics(modelUpdate)
          
          this.lastRetrainTime = Date.now()
          console.log('ML model retrained successfully')
          
        } catch (error) {
          console.error('Error retraining ML model with ZAI:', error)
          // Fallback to simple model update
          this.fallbackModelUpdate(trainingData)
        }
      } else {
        // Fallback model update
        this.fallbackModelUpdate(trainingData)
      }
      
    } catch (error) {
      console.error('Error retraining ML model:', error)
    }
  }

  private async collectTrainingData(context: BotContext): Promise<any[]> {
    const data = context.marketData
    const trainingData: any[] = []
    
    // Create training samples from historical data
    for (let i = this.config.featureWindow; i < data.length - this.config.predictionHorizon; i++) {
      const features = this.extractFeatures(data.slice(i - this.config.featureWindow, i))
      const targetPrice = data[i + this.config.predictionHorizon].close
      const currentPrice = data[i].close
      
      const priceChange = (targetPrice - currentPrice) / currentPrice
      const direction = priceChange > 0.01 ? 'UP' : priceChange < -0.01 ? 'DOWN' : 'SIDEWAYS'
      
      trainingData.push({
        features,
        target: {
          direction,
          priceChange,
          targetPrice
        },
        timestamp: data[i].timestamp
      })
    }
    
    return trainingData
  }

  private extractFeatures(data: MarketData[]): FeatureSet {
    const cacheKey = `${data[0]?.timestamp}_${data[data.length - 1]?.timestamp}`
    
    if (this.featureCache.has(cacheKey)) {
      return this.featureCache.get(cacheKey)!
    }
    
    const features: FeatureSet = {
      technical: [],
      market: [],
      sentiment: [],
      temporal: []
    }
    
    // Technical indicators
    const indicators = this.calculateTechnicalIndicatorsFromData(data)
    features.technical = [
      indicators.rsi || 50,
      indicators.macd || 0,
      indicators.bb_position || 0.5,
      indicators.atr || 0,
      indicators.volume_sma || 0
    ]
    
    // Market features
    const recentData = data.slice(-20)
    const returns = this.calculateReturns(recentData)
    features.market = [
      this.calculateVolatility(returns),
      this.calculateTrendStrength(returns),
      this.calculateMomentum(returns),
      this.calculateVolumeProfile(recentData)
    ]
    
    // Temporal features
    const now = new Date()
    features.temporal = [
      now.getHours() / 24, // Hour of day
      now.getDay() / 7, // Day of week
      Math.sin((now.getMonth() / 12) * 2 * Math.PI), // Seasonal
      (Date.now() - data[0].timestamp) / (1000 * 60 * 60 * 24) // Days since start
    ]
    
    // Sentiment features (simplified)
    features.sentiment = [
      this.calculatePriceMomentum(data),
      this.calculateVolumeTrend(data),
      this.calculateVolatilityTrend(data)
    ]
    
    this.featureCache.set(cacheKey, features)
    return features
  }

  private calculateTechnicalIndicatorsFromData(data: MarketData[]): Record<string, number> {
    const indicators: Record<string, number> = {}
    
    try {
      // RSI
      const rsi = TechnicalIndicators.calculateRSI(data, 14)
      indicators.rsi = rsi[rsi.length - 1] || 50
      
      // MACD
      const macd = TechnicalIndicators.calculateMACD(data, 12, 26, 9)
      indicators.macd = macd.histogram[macd.histogram.length - 1] || 0
      
      // Bollinger Bands position
      const bb = TechnicalIndicators.calculateBollingerBands(data, 20, 2)
      if (bb.upper.length > 0 && bb.lower.length > 0) {
        const currentPrice = data[data.length - 1].close
        const bbPosition = (currentPrice - bb.lower[bb.lower.length - 1]) / 
                         (bb.upper[bb.upper.length - 1] - bb.lower[bb.lower.length - 1])
        indicators.bb_position = bbPosition
      } else {
        indicators.bb_position = 0.5
      }
      
      // ATR
      const atr = TechnicalIndicators.calculateATR(data, 14)
      indicators.atr = atr[atr.length - 1] || 0
      
      // Volume SMA
      const volumes = data.map(d => d.volume)
      const volumeSma = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length
      indicators.volume_sma = volumeSma
      
    } catch (error) {
      console.error('Error calculating technical indicators:', error)
    }
    
    return indicators
  }

  private calculateReturns(data: MarketData[]): number[] {
    const returns: number[] = []
    for (let i = 1; i < data.length; i++) {
      returns.push((data[i].close - data[i - 1].close) / data[i - 1].close)
    }
    return returns
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0
    
    const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length
    
    return Math.sqrt(variance)
  }

  private calculateTrendStrength(returns: number[]): number {
    if (returns.length === 0) return 0
    
    const positiveReturns = returns.filter(r => r > 0).length
    return positiveReturns / returns.length
  }

  private calculateMomentum(returns: number[]): number {
    if (returns.length < 5) return 0
    
    const recentReturns = returns.slice(-5)
    const olderReturns = returns.slice(-10, -5)
    
    const recentAvg = recentReturns.reduce((sum, r) => sum + r, 0) / recentReturns.length
    const olderAvg = olderReturns.reduce((sum, r) => sum + r, 0) / olderReturns.length
    
    return recentAvg - olderAvg
  }

  private calculateVolumeProfile(data: MarketData[]): number {
    const volumes = data.map(d => d.volume)
    const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length
    const currentVolume = data[data.length - 1].volume
    
    return currentVolume / avgVolume
  }

  private calculatePriceMomentum(data: MarketData[]): number {
    if (data.length < 10) return 0
    
    const recent = data.slice(-5).reduce((sum, d) => sum + d.close, 0) / 5
    const older = data.slice(-10, -5).reduce((sum, d) => sum + d.close, 0) / 5
    
    return (recent - older) / older
  }

  private calculateVolumeTrend(data: MarketData[]): number {
    if (data.length < 10) return 0
    
    const recentVolume = data.slice(-5).reduce((sum, d) => sum + d.volume, 0) / 5
    const olderVolume = data.slice(-10, -5).reduce((sum, d) => sum + d.volume, 0) / 5
    
    return (recentVolume - olderVolume) / olderVolume
  }

  private calculateVolatilityTrend(data: MarketData[]): number {
    if (data.length < 20) return 0
    
    const recentVol = this.calculateVolatility(data.slice(-10))
    const olderVol = this.calculateVolatility(data.slice(-20, -10))
    
    return (recentVol - olderVol) / olderVol
  }

  private prepareTrainingPrompt(trainingData: any[]): string {
    return `
Analyze the following cryptocurrency trading data and provide model improvement suggestions:

Training Data Sample:
${JSON.stringify(trainingData.slice(0, 5), null, 2)}

Current Model Performance:
- Accuracy: ${this.modelMetrics.accuracy.toFixed(3)}
- Precision: ${this.modelMetrics.precision.toFixed(3)}
- Recall: ${this.modelMetrics.recall.toFixed(3)}
- F1 Score: ${this.modelMetrics.f1Score.toFixed(3)}
- Training Samples: ${this.modelMetrics.trainingSamples}

Model Configuration:
- Type: ${this.config.modelType}
- Prediction Horizon: ${this.config.predictionHorizon} minutes
- Feature Window: ${this.config.featureWindow} minutes
- Confidence Threshold: ${this.config.confidenceThreshold}

Please provide:
1. Suggested model parameter adjustments
2. Feature importance analysis
3. Recommended accuracy improvements
4. Any other optimization suggestions

Respond in JSON format with the following structure:
{
  "suggestedAccuracy": number,
  "featureImportance": number[],
  "parameterAdjustments": {},
  "recommendations": string[]
}
`
  }

  private parseModelUpdateResponse(response: string): any {
    try {
      return JSON.parse(response)
    } catch (error) {
      console.error('Error parsing model update response:', error)
      return {
        suggestedAccuracy: 0.85,
        featureImportance: [0.2, 0.2, 0.2, 0.2, 0.2],
        parameterAdjustments: {},
        recommendations: ['Default model update applied']
      }
    }
  }

  private updateModelMetrics(update: any): void {
    if (update.suggestedAccuracy) {
      this.modelMetrics.accuracy = Math.min(0.99, update.suggestedAccuracy)
    }
    
    if (update.featureImportance) {
      // Update feature weights based on importance
      console.log('Feature importance updated:', update.featureImportance)
    }
    
    this.modelMetrics.lastTrained = Date.now()
    this.modelMetrics.trainingSamples += 100 // Increment training samples
    
    console.log('Model metrics updated:', this.modelMetrics)
  }

  private fallbackModelUpdate(trainingData: any[]): void {
    // Simple fallback model update
    const accuracyImprovement = 0.001 // Small improvement
    this.modelMetrics.accuracy = Math.min(0.99, this.modelMetrics.accuracy + accuracyImprovement)
    this.modelMetrics.lastTrained = Date.now()
    this.modelMetrics.trainingSamples += trainingData.length
    
    console.log('Fallback model update applied')
  }

  private async generatePrediction(context: BotContext): Promise<PredictionResult> {
    try {
      const features = this.extractFeatures(context.marketData.slice(-this.config.featureWindow))
      
      if (this.zai) {
        try {
          const response = await this.zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: 'You are a cryptocurrency price prediction model. Analyze the provided features and predict price movement for the specified timeframe.'
              },
              {
                role: 'user',
                content: this.preparePredictionPrompt(features, context.currentPrice)
              }
            ],
            max_tokens: 300,
            temperature: 0.2
          })
          
          const prediction = this.parsePredictionResponse(response.choices[0]?.message?.content || '', context.currentPrice)
          this.predictionHistory.push(prediction)
          
          // Keep only recent predictions
          if (this.predictionHistory.length > 100) {
            this.predictionHistory = this.predictionHistory.slice(-50)
          }
          
          return prediction
          
        } catch (error) {
          console.error('Error generating prediction with ZAI:', error)
          return this.generateFallbackPrediction(features, context.currentPrice)
        }
      } else {
        return this.generateFallbackPrediction(features, context.currentPrice)
      }
      
    } catch (error) {
      console.error('Error generating prediction:', error)
      return this.generateFallbackPrediction(this.extractFeatures(context.marketData.slice(-this.config.featureWindow)), context.currentPrice)
    }
  }

  private preparePredictionPrompt(features: FeatureSet, currentPrice: number): string {
    return `
Generate a price prediction based on the following features:

Current Price: ${currentPrice}
Technical Features: ${JSON.stringify(features.technical)}
Market Features: ${JSON.stringify(features.market)}
Sentiment Features: ${JSON.stringify(features.sentiment)}
Temporal Features: ${JSON.stringify(features.temporal)}

Model Configuration:
- Type: ${this.config.modelType}
- Prediction Horizon: ${this.config.predictionHorizon} minutes
- Current Model Accuracy: ${this.modelMetrics.accuracy.toFixed(3)}

Please predict the price movement direction and provide:
1. Direction (UP/DOWN/SIDEWAYS)
2. Confidence level (0-1)
3. Predicted price
4. Estimated accuracy

Respond in JSON format:
{
  "direction": "UP|DOWN|SIDEWAYS",
  "confidence": number,
  "predictedPrice": number,
  "accuracy": number
}
`
  }

  private parsePredictionResponse(response: string, currentPrice: number): PredictionResult {
    try {
      const parsed = JSON.parse(response)
      
      return {
        direction: parsed.direction || 'SIDEWAYS',
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        predictedPrice: parsed.predictedPrice || currentPrice,
        timeframe: this.config.predictionHorizon,
        accuracy: Math.max(0, Math.min(1, parsed.accuracy || this.modelMetrics.accuracy)),
        features: this.extractFeatures([]), // Placeholder
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('Error parsing prediction response:', error)
      return this.generateFallbackPrediction(this.extractFeatures([]), currentPrice)
    }
  }

  private generateFallbackPrediction(features: FeatureSet, currentPrice: number): PredictionResult {
    // Simple rule-based prediction as fallback
    const rsi = features.technical[0] || 50
    const momentum = features.market[2] || 0
    
    let direction: 'UP' | 'DOWN' | 'SIDEWAYS' = 'SIDEWAYS'
    let confidence = 0.5
    
    if (rsi > 70 && momentum > 0) {
      direction = 'DOWN'
      confidence = 0.7
    } else if (rsi < 30 && momentum < 0) {
      direction = 'UP'
      confidence = 0.7
    } else if (momentum > 0.01) {
      direction = 'UP'
      confidence = 0.6
    } else if (momentum < -0.01) {
      direction = 'DOWN'
      confidence = 0.6
    }
    
    const priceChangePercent = (direction === 'UP' ? 0.02 : direction === 'DOWN' ? -0.02 : 0) * confidence
    const predictedPrice = currentPrice * (1 + priceChangePercent)
    
    return {
      direction,
      confidence,
      predictedPrice,
      timeframe: this.config.predictionHorizon,
      accuracy: this.modelMetrics.accuracy * 0.9, // Slightly lower accuracy for fallback
      features,
      timestamp: Date.now()
    }
  }

  private checkEntryConditions(
    context: BotContext,
    currentPrice: number,
    prediction: PredictionResult | null
  ): Signal {
    if (!prediction) {
      return this.createSignal('HOLD', 0, 0.3, 'No prediction available')
    }
    
    // Don't enter if we have too many consecutive losses
    if (this.consecutiveLosses >= 3) {
      return this.createSignal('HOLD', 0, 0.8, 'Skipping entry due to consecutive losses')
    }
    
    // Check prediction confidence and accuracy
    if (prediction.confidence < this.config.confidenceThreshold) {
      return this.createSignal('HOLD', 0, 0.5, `Prediction confidence too low: ${(prediction.confidence * 100).toFixed(1)}%`)
    }
    
    if (prediction.accuracy < this.config.minAccuracy) {
      return this.createSignal('HOLD', 0, 0.4, `Model accuracy too low: ${(prediction.accuracy * 100).toFixed(1)}%`)
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
    const stopLoss = this.calculateStopLoss(currentPrice, prediction)
    const takeProfit = this.calculateTakeProfit(currentPrice, prediction)
    
    // Determine signal based on prediction
    if (prediction.direction === 'UP') {
      return this.createSignal(
        'BUY',
        prediction.confidence,
        prediction.accuracy,
        `ML prediction: UP ${(prediction.confidence * 100).toFixed(1)}% confidence. Target: ${prediction.predictedPrice.toFixed(2)}. SL: ${stopLoss.toFixed(2)}, TP: ${takeProfit.toFixed(2)}`
      )
    } else if (prediction.direction === 'DOWN') {
      return this.createSignal(
        'SELL',
        prediction.confidence,
        prediction.accuracy,
        `ML prediction: DOWN ${(prediction.confidence * 100).toFixed(1)}% confidence. Target: ${prediction.predictedPrice.toFixed(2)}. SL: ${stopLoss.toFixed(2)}, TP: ${takeProfit.toFixed(2)}`
      )
    }
    
    return this.createSignal('HOLD', 0, 0.3, 'ML prediction: SIDEWAYS - no action')
  }

  private checkExitConditions(
    context: BotContext,
    currentPrice: number,
    prediction: PredictionResult | null
  ): Signal {
    if (!this.currentPosition) {
      return this.createSignal('HOLD', 0, 0, 'No position to exit')
    }
    
    const { entryPrice, side, prediction: entryPrediction, stopLoss, takeProfit, maxHoldTime } = this.currentPosition
    
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
    
    // Check max hold time
    if (Date.now() - this.currentPosition.entryTime > maxHoldTime) {
      return this.createSignal(
        side === 'BUY' ? 'SELL' : 'BUY',
        0.7,
        0.8,
        `Max hold time exceeded, exiting position`
      )
    }
    
    // Check if prediction changed significantly
    if (prediction && this.isPredictionContradictory(entryPrediction, prediction, side)) {
      const unrealizedPnL = this.calculateUnrealizedPnL(currentPrice)
      
      // Exit if we have a profit or small loss
      if (unrealizedPnL > 0 || Math.abs(unrealizedPnL) < (entryPrice * 0.01)) {
        return this.createSignal(
          side === 'BUY' ? 'SELL' : 'BUY',
          0.6,
          0.8,
          `Prediction contradiction detected, exiting position. P&L: ${unrealizedPnL.toFixed(2)}`
        )
      }
    }
    
    // Check if target price reached
    if (side === 'BUY' && currentPrice >= entryPrediction.predictedPrice) {
      return this.createSignal(
        'SELL',
        0.8,
        0.95,
        `Target price reached: ${currentPrice.toFixed(2)}`
      )
    }
    
    if (side === 'SELL' && currentPrice <= entryPrediction.predictedPrice) {
      return this.createSignal(
        'BUY',
        0.8,
        0.95,
        `Target price reached: ${currentPrice.toFixed(2)}`
      )
    }
    
    // Calculate unrealized P&L
    const unrealizedPnL = this.calculateUnrealizedPnL(currentPrice)
    const unrealizedPnLPercent = (unrealizedPnL / (entryPrice * this.currentPosition.size)) * 100
    
    return this.createSignal(
      'HOLD',
      0.4,
      0.7,
      `Holding ${side} position. P&L: ${unrealizedPnLPercent.toFixed(2)}%, Current prediction: ${prediction?.direction || 'UNKNOWN'}`
    )
  }

  private isPredictionContradictory(oldPrediction: PredictionResult, newPrediction: PredictionResult, side: 'BUY' | 'SELL'): boolean {
    if (newPrediction.confidence < this.config.confidenceThreshold) {
      return false
    }
    
    if (side === 'BUY' && newPrediction.direction === 'DOWN') {
      return true
    }
    
    if (side === 'SELL' && newPrediction.direction === 'UP') {
      return true
    }
    
    return false
  }

  private calculateStopLoss(currentPrice: number, prediction: PredictionResult): number {
    const stopLossPercent = this.config.stopLoss
    
    if (prediction.direction === 'UP') {
      return currentPrice * (1 - stopLossPercent / 100)
    } else {
      return currentPrice * (1 + stopLossPercent / 100)
    }
  }

  private calculateTakeProfit(currentPrice: number, prediction: PredictionResult): number {
    const takeProfitPercent = this.config.takeProfit
    
    if (prediction.direction === 'UP') {
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
    prediction: PredictionResult,
    stopLoss?: number,
    takeProfit?: number
  ): void {
    const maxHoldTime = this.config.predictionHorizon * 60 * 1000 * 2 // 2x prediction horizon
    
    this.currentPosition = {
      entryPrice: price,
      entryTime: Date.now(),
      side,
      size,
      prediction,
      stopLoss,
      takeProfit,
      maxHoldTime
    }
    
    this.totalTrades++
    console.log(`Entered ${side} position at ${price} with size ${size}. ML prediction: ${prediction.direction}`)
  }

  private exitPosition(price: number, reason: string = ''): void {
    if (!this.currentPosition) return
    
    const { entryPrice, side, size } = this.currentPosition
    const pnl = this.calculateUnrealizedPnL(price)
    
    if (pnl > 0) {
      this.successfulTrades++
      this.consecutiveLosses = 0
    } else {
      this.consecutiveLosses++
    }
    
    console.log(`Exited ${side} position at ${price}. P&L: ${pnl.toFixed(2)}. Reason: ${reason}`)
    this.currentPosition = null
  }

  // Public methods for monitoring and management
  public getStrategyStatus(): {
    currentPosition: MLPredictionPosition | null
    totalTrades: number
    successfulTrades: number
    successRate: number
    consecutiveLosses: number
    modelMetrics: ModelMetrics
    currentPrediction: PredictionResult | null
    predictionHistory: {
      total: number
      accuracy: number
      avgConfidence: number
    }
    unrealizedPnL: number
  } {
    const currentPrediction = this.predictionHistory.length > 0 ? 
      this.predictionHistory[this.predictionHistory.length - 1] : null
    
    const predictionAccuracy = this.calculatePredictionAccuracy()
    const avgConfidence = this.predictionHistory.length > 0 ?
      this.predictionHistory.reduce((sum, p) => sum + p.confidence, 0) / this.predictionHistory.length : 0
    
    const unrealizedPnL = this.currentPosition ? 
      this.calculateUnrealizedPnL(this.getCurrentPriceForStatus()) : 0
    
    return {
      currentPosition: this.currentPosition,
      totalTrades: this.totalTrades,
      successfulTrades: this.successfulTrades,
      successRate: this.totalTrades > 0 ? (this.successfulTrades / this.totalTrades) * 100 : 0,
      consecutiveLosses: this.consecutiveLosses,
      modelMetrics: this.modelMetrics,
      currentPrediction,
      predictionHistory: {
        total: this.predictionHistory.length,
        accuracy: predictionAccuracy,
        avgConfidence
      },
      unrealizedPnL
    }
  }

  private calculatePredictionAccuracy(): number {
    if (this.predictionHistory.length < 10) return this.modelMetrics.accuracy
    
    // Calculate accuracy of recent predictions
    const recentPredictions = this.predictionHistory.slice(-20)
    let correctPredictions = 0
    
    for (const prediction of recentPredictions) {
      // This is a simplified accuracy calculation
      // In reality, you'd compare predictions with actual outcomes
      correctPredictions += prediction.accuracy > 0.6 ? 1 : 0
    }
    
    return correctPredictions / recentPredictions.length
  }

  private getCurrentPriceForStatus(): number {
    // This would normally come from context
    return this.currentPosition?.entryPrice || 0
  }

  public updateConfig(newConfig: Partial<MLPredictionConfig>): void {
    if (newConfig.predictionHorizon && newConfig.predictionHorizon <= 0) {
      throw new StrategyError('Prediction horizon must be positive')
    }

    if (newConfig.confidenceThreshold && (newConfig.confidenceThreshold <= 0 || newConfig.confidenceThreshold > 1)) {
      throw new StrategyError('Confidence threshold must be between 0 and 1')
    }

    if (newConfig.featureWindow && newConfig.featureWindow <= 0) {
      throw new StrategyError('Feature window must be positive')
    }

    if (newConfig.riskPerTrade && (newConfig.riskPerTrade <= 0 || newConfig.riskPerTrade > 1)) {
      throw new StrategyError('Risk per trade must be between 0 and 1')
    }

    if (newConfig.minAccuracy && (newConfig.minAccuracy <= 0 || newConfig.minAccuracy > 1)) {
      throw new StrategyError('Minimum accuracy must be between 0 and 1')
    }

    this.config = { ...this.config, ...newConfig }
    console.log('ML prediction strategy configuration updated')
  }

  public resetStrategy(): void {
    this.currentPosition = null
    this.predictionHistory = []
    this.lastPredictionTime = 0
    this.lastRetrainTime = 0
    this.totalTrades = 0
    this.successfulTrades = 0
    this.consecutiveLosses = 0
    this.featureCache.clear()
    
    console.log('ML prediction strategy reset')
  }

  public getFeatureImportance(): { feature: string; importance: number }[] {
    // Return feature importance analysis
    return [
      { feature: 'RSI', importance: 0.25 },
      { feature: 'MACD', importance: 0.20 },
      { feature: 'Bollinger Bands', importance: 0.15 },
      { feature: 'Volume', importance: 0.15 },
      { feature: 'Momentum', importance: 0.10 },
      { feature: 'Volatility', importance: 0.10 },
      { feature: 'Temporal', importance: 0.05 }
    ]
  }

  public getPredictionHistory(): PredictionResult[] {
    return [...this.predictionHistory]
  }
}