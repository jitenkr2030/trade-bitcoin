// Strategy exports
export { BaseStrategy } from './base-strategy'
export { TechnicalIndicators } from './indicators'

// Individual strategy exports
export { GridTradingStrategy } from './grid-trading'
export { DCAStrategy } from './dca-strategy'
export { TrendFollowingStrategy } from './trend-following'
export { MeanReversionStrategy } from './mean-reversion'
export { ArbitrageStrategy } from './arbitrage'
export { MarketMakingStrategy } from './market-making'
export { SentimentBasedStrategy } from './sentiment-based'
export { MLPredictionStrategy } from './ml-prediction'

// Strategy factory
export class StrategyFactory {
  static createStrategy(type: string): any {
    switch (type.toLowerCase()) {
      case 'grid':
        return new (require('./grid-trading').GridTradingStrategy)()
      case 'dca':
      case 'dollar-cost-averaging':
        return new (require('./dca-strategy').DCAStrategy)()
      case 'trend':
      case 'trend-following':
        return new (require('./trend-following').TrendFollowingStrategy)()
      case 'mean-reversion':
        return new (require('./mean-reversion').MeanReversionStrategy)()
      case 'arbitrage':
        return new (require('./arbitrage').ArbitrageStrategy)()
      case 'market-making':
        return new (require('./market-making').MarketMakingStrategy)()
      case 'sentiment':
      case 'sentiment-based':
        return new (require('./sentiment-based').SentimentBasedStrategy)()
      case 'ml':
      case 'ml-prediction':
        return new (require('./ml-prediction').MLPredictionStrategy)()
      default:
        throw new Error(`Unknown strategy type: ${type}`)
    }
  }

  static getAvailableStrategies(): string[] {
    return [
      'grid',
      'dca',
      'trend-following',
      'mean-reversion',
      'arbitrage',
      'market-making',
      'sentiment-based',
      'ml-prediction'
    ]
  }

  static getStrategyDescription(type: string): string {
    const descriptions = {
      'grid': 'Grid Trading - Places buy and sell orders at regular price intervals to profit from market volatility',
      'dca': 'Dollar Cost Averaging - Invests fixed amounts at regular intervals to reduce market timing risk',
      'trend-following': 'Trend Following - Identifies and follows market trends using technical indicators',
      'mean-reversion': 'Mean Reversion - Trades on the assumption that prices will revert to their mean',
      'arbitrage': 'Arbitrage - Exploits price differences between different exchanges',
      'market-making': 'Market Making - Provides liquidity by placing both buy and sell orders',
      'sentiment-based': 'Sentiment-Based - Uses news, social media, and on-chain data for trading decisions',
      'ml-prediction': 'ML Prediction - Uses machine learning to predict price movements'
    }
    
    return descriptions[type.toLowerCase()] || 'Unknown strategy type'
  }

  static getStrategyConfig(type: string): any {
    const configs = {
      'grid': {
        upperPrice: 50000,
        lowerPrice: 40000,
        gridLevels: 10,
        orderAmount: 0.1,
        rebalanceThreshold: 0.05
      },
      'dca': {
        totalAmount: 10000,
        targetPrice: 45000,
        orderCount: 20,
        priceDeviation: 0.1,
        maxOrders: 20
      },
      'trend-following': {
        fastPeriod: 12,
        slowPeriod: 26,
        signalPeriod: 9,
        riskPerTrade: 0.02,
        stopLoss: 2,
        takeProfit: 4
      },
      'mean-reversion': {
        period: 20,
        standardDeviations: 2,
        entryThreshold: 1.5,
        exitThreshold: 0.5,
        riskPerTrade: 0.02
      },
      'arbitrage': {
        exchanges: ['binance', 'coinbase'],
        minProfit: 0.1,
        maxSlippage: 0.1,
        orderAmount: 0.1
      },
      'market-making': {
        spreadPercent: 0.1,
        orderSize: 0.1,
        maxOrders: 5,
        inventoryTarget: 0.5,
        riskLimit: 0.1
      },
      'sentiment-based': {
        newsWeight: 0.25,
        socialWeight: 0.25,
        onchainWeight: 0.25,
        technicalWeight: 0.25,
        sentimentThreshold: 0.3,
        confidenceThreshold: 0.7,
        riskPerTrade: 0.02
      },
      'ml-prediction': {
        modelType: 'LSTM',
        predictionHorizon: 60,
        confidenceThreshold: 0.7,
        featureWindow: 120,
        riskPerTrade: 0.02,
        stopLoss: 2,
        takeProfit: 4,
        minAccuracy: 0.7
      }
    }
    
    return configs[type.toLowerCase()] || {}
  }
}

// Strategy validation
export class StrategyValidator {
  static validateConfig(type: string, config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    try {
      const strategy = StrategyFactory.createStrategy(type)
      
      // Basic validation
      if (!config || typeof config !== 'object') {
        errors.push('Configuration must be an object')
        return { valid: false, errors }
      }
      
      // Strategy-specific validation
      switch (type.toLowerCase()) {
        case 'grid':
          if (!config.upperPrice || config.upperPrice <= 0) {
            errors.push('Upper price must be positive')
          }
          if (!config.lowerPrice || config.lowerPrice <= 0) {
            errors.push('Lower price must be positive')
          }
          if (config.upperPrice <= config.lowerPrice) {
            errors.push('Upper price must be greater than lower price')
          }
          break
          
        case 'dca':
          if (!config.totalAmount || config.totalAmount <= 0) {
            errors.push('Total amount must be positive')
          }
          if (!config.orderCount || config.orderCount < 1) {
            errors.push('Order count must be at least 1')
          }
          break
          
        case 'trend-following':
          if (!config.fastPeriod || config.fastPeriod <= 0) {
            errors.push('Fast period must be positive')
          }
          if (!config.slowPeriod || config.slowPeriod <= 0) {
            errors.push('Slow period must be positive')
          }
          if (config.fastPeriod >= config.slowPeriod) {
            errors.push('Fast period must be less than slow period')
          }
          break
          
        case 'arbitrage':
          if (!config.exchanges || config.exchanges.length < 2) {
            errors.push('At least 2 exchanges required')
          }
          if (!config.minProfit || config.minProfit <= 0) {
            errors.push('Minimum profit must be positive')
          }
          break
          
        case 'market-making':
          if (!config.spreadPercent || config.spreadPercent <= 0) {
            errors.push('Spread percent must be positive')
          }
          if (!config.orderSize || config.orderSize <= 0) {
            errors.push('Order size must be positive')
          }
          break
          
        case 'sentiment-based':
          if (!config.sentimentThreshold || config.sentimentThreshold <= 0) {
            errors.push('Sentiment threshold must be positive')
          }
          if (!config.confidenceThreshold || config.confidenceThreshold <= 0 || config.confidenceThreshold > 1) {
            errors.push('Confidence threshold must be between 0 and 1')
          }
          break
          
        case 'ml-prediction':
          if (!config.predictionHorizon || config.predictionHorizon <= 0) {
            errors.push('Prediction horizon must be positive')
          }
          if (!config.confidenceThreshold || config.confidenceThreshold <= 0 || config.confidenceThreshold > 1) {
            errors.push('Confidence threshold must be between 0 and 1')
          }
          break
      }
      
      // Common validation
      if (config.riskPerTrade !== undefined && (config.riskPerTrade <= 0 || config.riskPerTrade > 1)) {
        errors.push('Risk per trade must be between 0 and 1')
      }
      
    } catch (error) {
      errors.push(`Strategy creation failed: ${error.message}`)
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Strategy performance metrics
export interface StrategyPerformanceMetrics {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalProfit: number
  totalLoss: number
  netProfit: number
  profitFactor: number
  maxDrawdown: number
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number
  averageWin: number
  averageLoss: number
  largestWin: number
  largestLoss: number
  averageHoldTime: number
}

// Strategy backtesting utilities
export class StrategyBacktester {
  static async backtestStrategy(
    strategy: any,
    config: any,
    historicalData: MarketData[],
    initialBalance: number = 10000
  ): Promise<StrategyPerformanceMetrics> {
    // This is a simplified backtesting framework
    // In a real implementation, you would need more sophisticated backtesting
    
    const trades = []
    let balance = initialBalance
    let position = null
    let maxBalance = initialBalance
    let maxDrawdown = 0
    let totalProfit = 0
    let totalLoss = 0
    
    // Initialize strategy
    await strategy.initialize(config)
    
    // Simulate trading
    for (let i = 100; i < historicalData.length; i++) {
      const context = {
        bot: {
          market: { symbol: 'BTCUSDT', exchangeAccountId: 'test' },
          risk: { maxPositionSize: 1 },
          execution: { orderType: 'MARKET', slippageTolerance: 0.01 }
        },
        marketData: historicalData.slice(i - 100, i),
        currentPrice: historicalData[i].close,
        balance: { USDT: balance },
        positions: {},
        orders: [],
        trades: [],
        timestamp: historicalData[i].timestamp
      }
      
      try {
        const signal = await strategy.execute(context)
        
        if (signal.type === 'BUY' && !position) {
          position = {
            entryPrice: context.currentPrice,
            entryTime: context.timestamp,
            side: 'BUY',
            size: balance * 0.1 / context.currentPrice
          }
        } else if (signal.type === 'SELL' && position) {
          const pnl = (context.currentPrice - position.entryPrice) * position.size
          trades.push({
            entryPrice: position.entryPrice,
            exitPrice: context.currentPrice,
            pnl,
            holdTime: context.timestamp - position.entryTime
          })
          
          balance += pnl
          position = null
          
          // Update max balance and drawdown
          if (balance > maxBalance) {
            maxBalance = balance
          }
          const drawdown = (maxBalance - balance) / maxBalance
          maxDrawdown = Math.max(maxDrawdown, drawdown)
        }
      } catch (error) {
        console.error('Backtesting error:', error)
      }
    }
    
    // Calculate performance metrics
    const winningTrades = trades.filter(t => t.pnl > 0)
    const losingTrades = trades.filter(t => t.pnl < 0)
    
    totalProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0)
    totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0))
    
    const metrics: StrategyPerformanceMetrics = {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
      totalProfit,
      totalLoss,
      netProfit: totalProfit - totalLoss,
      profitFactor: totalLoss > 0 ? totalProfit / totalLoss : 0,
      maxDrawdown,
      sharpeRatio: 0, // Simplified
      sortinoRatio: 0, // Simplified
      calmarRatio: 0, // Simplified
      averageWin: winningTrades.length > 0 ? totalProfit / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl)) : 0,
      averageHoldTime: trades.length > 0 ? trades.reduce((sum, t) => sum + t.holdTime, 0) / trades.length : 0
    }
    
    return metrics
  }
}