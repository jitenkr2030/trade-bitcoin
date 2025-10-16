import { Strategy, BotContext, Signal, BotStrategy, StrategyError } from '../types'
import { TechnicalIndicators } from './indicators'

export abstract class BaseStrategy implements Strategy {
  protected config: BotStrategy
  protected isInitialized: boolean = false

  abstract get name(): string

  async initialize(config: BotStrategy): Promise<void> {
    this.config = config
    this.isInitialized = true
    await this.onInitialize()
  }

  abstract execute(context: BotContext): Promise<Signal>

  async cleanup(): Promise<void> {
    this.isInitialized = false
    await this.onCleanup()
  }

  protected abstract onInitialize(): Promise<void>
  protected abstract onCleanup(): Promise<void>

  protected validateContext(context: BotContext): void {
    if (!this.isInitialized) {
      throw new StrategyError('Strategy not initialized')
    }

    if (!context.marketData || context.marketData.length === 0) {
      throw new StrategyError('No market data available')
    }

    if (!context.currentPrice || context.currentPrice <= 0) {
      throw new StrategyError('Invalid current price')
    }
  }

  protected calculateTechnicalIndicators(context: BotContext): Record<string, number> {
    const indicators: Record<string, number> = {}
    const data = context.marketData

    if (this.config.indicators) {
      for (const indicatorConfig of this.config.indicators) {
        try {
          switch (indicatorConfig.name.toLowerCase()) {
            case 'sma':
              const sma = TechnicalIndicators.calculateSMA(data, indicatorConfig.parameters.period || 20)
              indicators[`sma_${indicatorConfig.parameters.period}`] = sma[sma.length - 1] || 0
              break
            case 'ema':
              const ema = TechnicalIndicators.calculateEMA(data, indicatorConfig.parameters.period || 20)
              indicators[`ema_${indicatorConfig.parameters.period}`] = ema[ema.length - 1] || 0
              break
            case 'rsi':
              const rsi = TechnicalIndicators.calculateRSI(data, indicatorConfig.parameters.period || 14)
              indicators.rsi = rsi[rsi.length - 1] || 50
              break
            case 'macd':
              const macd = TechnicalIndicators.calculateMACD(
                data,
                indicatorConfig.parameters.fastPeriod || 12,
                indicatorConfig.parameters.slowPeriod || 26,
                indicatorConfig.parameters.signalPeriod || 9
              )
              indicators.macd = macd.macd[macd.macd.length - 1] || 0
              indicators.macd_signal = macd.signal[macd.signal.length - 1] || 0
              indicators.macd_histogram = macd.histogram[macd.histogram.length - 1] || 0
              break
            case 'bollinger':
              const bb = TechnicalIndicators.calculateBollingerBands(
                data,
                indicatorConfig.parameters.period || 20,
                indicatorConfig.parameters.standardDeviations || 2
              )
              indicators.bb_upper = bb.upper[bb.upper.length - 1] || 0
              indicators.bb_middle = bb.middle[bb.middle.length - 1] || 0
              indicators.bb_lower = bb.lower[bb.lower.length - 1] || 0
              break
            case 'atr':
              const atr = TechnicalIndicators.calculateATR(data, indicatorConfig.parameters.period || 14)
              indicators.atr = atr[atr.length - 1] || 0
              break
            case 'stochastic':
              const stoch = TechnicalIndicators.calculateStochastic(
                data,
                indicatorConfig.parameters.kPeriod || 14,
                indicatorConfig.parameters.dPeriod || 3
              )
              indicators.stoch_k = stoch.k[stoch.k.length - 1] || 50
              indicators.stoch_d = stoch.d[stoch.d.length - 1] || 50
              break
            case 'vwap':
              const vwap = TechnicalIndicators.calculateVWAP(data)
              indicators.vwap = vwap[vwap.length - 1] || context.currentPrice
              break
          }
        } catch (error) {
          console.warn(`Error calculating indicator ${indicatorConfig.name}:`, error)
        }
      }
    }

    return indicators
  }

  protected evaluateConditions(context: BotContext, indicators: Record<string, number>): boolean {
    if (!this.config.conditions) {
      return true
    }

    return this.evaluateConditionGroup(this.config.conditions, indicators)
  }

  private evaluateConditionGroup(conditionGroup: any, indicators: Record<string, number>): boolean {
    const conditions = conditionGroup.conditions || []
    
    if (conditionGroup.type === 'AND') {
      return conditions.every((condition: any) => this.evaluateCondition(condition, indicators))
    } else if (conditionGroup.type === 'OR') {
      return conditions.some((condition: any) => this.evaluateCondition(condition, indicators))
    } else if (conditionGroup.type === 'NOT') {
      return !conditions.every((condition: any) => this.evaluateCondition(condition, indicators))
    }
    
    return false
  }

  private evaluateCondition(condition: any, indicators: Record<string, number>): boolean {
    const indicatorValue = indicators[condition.indicator]
    if (indicatorValue === undefined) {
      return false
    }

    switch (condition.operator) {
      case 'GREATER_THAN':
        return indicatorValue > condition.value
      case 'LESS_THAN':
        return indicatorValue < condition.value
      case 'EQUALS':
        return Math.abs(indicatorValue - condition.value) < 0.0001
      case 'CROSS_ABOVE':
        // This would require historical data, simplified for now
        return indicatorValue > condition.value
      case 'CROSS_BELOW':
        // This would require historical data, simplified for now
        return indicatorValue < condition.value
      default:
        return false
    }
  }

  protected createSignal(
    type: 'BUY' | 'SELL' | 'HOLD',
    strength: number = 0.5,
    confidence: number = 0.5,
    reason: string = ''
  ): Signal {
    return {
      type,
      strength: Math.max(0, Math.min(1, strength)),
      confidence: Math.max(0, Math.min(1, confidence)),
      reason,
      timestamp: Date.now()
    }
  }

  protected calculatePositionSize(
    context: BotContext,
    riskAmount: number,
    price: number
  ): number {
    const availableBalance = context.balance[this.getQuoteAsset(context.bot.market.symbol)] || 0
    const maxPositionSize = (availableBalance * riskAmount) / price
    
    // Apply additional risk limits from bot config
    const riskConfig = context.bot.risk
    const maxRiskPerTrade = riskConfig.riskPerTrade || 0.02 // 2% default
    const portfolioValue = this.calculatePortfolioValue(context)
    const maxRiskAmount = portfolioValue * maxRiskPerTrade
    
    return Math.min(maxPositionSize, maxRiskAmount / price)
  }

  protected calculatePortfolioValue(context: BotContext): number {
    let totalValue = 0
    
    // Add cash balance
    const quoteAsset = this.getQuoteAsset(context.bot.market.symbol)
    totalValue += context.balance[quoteAsset] || 0
    
    // Add position values
    for (const [asset, amount] of Object.entries(context.positions)) {
      if (amount > 0) {
        // Simplified: use current price for all assets
        totalValue += amount * context.currentPrice
      }
    }
    
    return totalValue
  }

  protected getBaseAsset(symbol: string): string {
    // Common crypto pairs
    if (symbol.endsWith('USDT') || symbol.endsWith('USD') || symbol.endsWith('USDC')) {
      return symbol.replace(/USDT|USD|USDC$/, '')
    }
    return symbol.slice(0, 3) // Fallback
  }

  protected getQuoteAsset(symbol: string): string {
    // Common crypto pairs
    if (symbol.endsWith('USDT')) return 'USDT'
    if (symbol.endsWith('USD')) return 'USD'
    if (symbol.endsWith('USDC')) return 'USDC'
    return symbol.slice(3) // Fallback
  }

  protected isOverbought(indicators: Record<string, number>): boolean {
    return (indicators.rsi || 50) > 70 || (indicators.stoch_k || 50) > 80
  }

  protected isOversold(indicators: Record<string, number>): boolean {
    return (indicators.rsi || 50) < 30 || (indicators.stoch_k || 50) < 20
  }

  protected isUptrend(data: MarketData[]): boolean {
    if (data.length < 20) return false
    
    const recentData = data.slice(-20)
    const sma20 = TechnicalIndicators.calculateSMA(recentData, 20)
    const currentPrice = data[data.length - 1].close
    
    return currentPrice > sma20[sma20.length - 1]
  }

  protected isDowntrend(data: MarketData[]): boolean {
    if (data.length < 20) return false
    
    const recentData = data.slice(-20)
    const sma20 = TechnicalIndicators.calculateSMA(recentData, 20)
    const currentPrice = data[data.length - 1].close
    
    return currentPrice < sma20[sma20.length - 1]
  }

  protected calculateVolatility(data: MarketData[]): number {
    const volatility = TechnicalIndicators.calculateVolatility(data, 20)
    return volatility[volatility.length - 1] || 0
  }

  protected shouldTakeProfit(
    entryPrice: number,
    currentPrice: number,
    side: 'BUY' | 'SELL',
    takeProfitPercent: number
  ): boolean {
    if (side === 'BUY') {
      const profitPercent = ((currentPrice - entryPrice) / entryPrice) * 100
      return profitPercent >= takeProfitPercent
    } else {
      const profitPercent = ((entryPrice - currentPrice) / entryPrice) * 100
      return profitPercent >= takeProfitPercent
    }
  }

  protected shouldStopLoss(
    entryPrice: number,
    currentPrice: number,
    side: 'BUY' | 'SELL',
    stopLossPercent: number
  ): boolean {
    if (side === 'BUY') {
      const lossPercent = ((entryPrice - currentPrice) / entryPrice) * 100
      return lossPercent >= stopLossPercent
    } else {
      const lossPercent = ((currentPrice - entryPrice) / entryPrice) * 100
      return lossPercent >= stopLossPercent
    }
  }
}