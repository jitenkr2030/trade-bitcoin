import { MarketData } from '../types'

export interface IndicatorResult {
  value: number
  signal?: 'BUY' | 'SELL' | 'HOLD'
  metadata?: Record<string, any>
}

export class TechnicalIndicators {
  static calculateSMA(data: MarketData[], period: number): number[] {
    if (data.length < period) return []
    
    const sma: number[] = []
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0)
      sma.push(sum / period)
    }
    return sma
  }

  static calculateEMA(data: MarketData[], period: number): number[] {
    if (data.length < period) return []
    
    const ema: number[] = []
    const multiplier = 2 / (period + 1)
    
    // Start with SMA for first value
    const firstSMA = data.slice(0, period).reduce((acc, candle) => acc + candle.close, 0) / period
    ema.push(firstSMA)
    
    for (let i = period; i < data.length; i++) {
      const emaValue = (data[i].close - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]
      ema.push(emaValue)
    }
    return ema
  }

  static calculateRSI(data: MarketData[], period: number = 14): number[] {
    if (data.length < period + 1) return []
    
    const rsi: number[] = []
    const gains: number[] = []
    const losses: number[] = []
    
    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close
      gains.push(change > 0 ? change : 0)
      losses.push(change < 0 ? Math.abs(change) : 0)
    }
    
    for (let i = period - 1; i < gains.length; i++) {
      const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
      const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period
      
      if (avgLoss === 0) {
        rsi.push(100)
      } else {
        const rs = avgGain / avgLoss
        rsi.push(100 - (100 / (1 + rs)))
      }
    }
    
    return rsi
  }

  static calculateMACD(
    data: MarketData[], 
    fastPeriod: number = 12, 
    slowPeriod: number = 26, 
    signalPeriod: number = 9
  ): { macd: number[]; signal: number[]; histogram: number[] } {
    if (data.length < slowPeriod) {
      return { macd: [], signal: [], histogram: [] }
    }
    
    const fastEMA = this.calculateEMA(data, fastPeriod)
    const slowEMA = this.calculateEMA(data, slowPeriod)
    
    const macd: number[] = []
    for (let i = 0; i < fastEMA.length; i++) {
      macd.push(fastEMA[i] - slowEMA[i + (slowPeriod - fastPeriod)])
    }
    
    const signal = this.calculateEMAFromValues(macd, signalPeriod)
    const histogram: number[] = []
    
    for (let i = 0; i < macd.length; i++) {
      if (i < signalPeriod - 1) {
        histogram.push(0)
      } else {
        histogram.push(macd[i] - signal[i - (signalPeriod - 1)])
      }
    }
    
    return { macd, signal, histogram }
  }

  static calculateEMAFromValues(values: number[], period: number): number[] {
    if (values.length < period) return []
    
    const ema: number[] = []
    const multiplier = 2 / (period + 1)
    
    // Start with SMA for first value
    const firstSMA = values.slice(0, period).reduce((acc, val) => acc + val, 0) / period
    ema.push(firstSMA)
    
    for (let i = period; i < values.length; i++) {
      const emaValue = (values[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]
      ema.push(emaValue)
    }
    return ema
  }

  static calculateBollingerBands(
    data: MarketData[], 
    period: number = 20, 
    standardDeviations: number = 2
  ): { upper: number[]; middle: number[]; lower: number[] } {
    if (data.length < period) {
      return { upper: [], middle: [], lower: [] }
    }
    
    const sma = this.calculateSMA(data, period)
    const upper: number[] = []
    const middle: number[] = []
    const lower: number[] = []
    
    for (let i = period - 1; i < data.length; i++) {
      const slice = data.slice(i - period + 1, i + 1)
      const mean = sma[i - (period - 1)]
      
      const variance = slice.reduce((acc, candle) => {
        return acc + Math.pow(candle.close - mean, 2)
      }, 0) / period
      
      const stdDev = Math.sqrt(variance)
      
      upper.push(mean + (stdDev * standardDeviations))
      middle.push(mean)
      lower.push(mean - (stdDev * standardDeviations))
    }
    
    return { upper, middle, lower }
  }

  static calculateATR(data: MarketData[], period: number = 14): number[] {
    if (data.length < period + 1) return []
    
    const tr: number[] = []
    for (let i = 1; i < data.length; i++) {
      const high = data[i].high
      const low = data[i].low
      const prevClose = data[i - 1].close
      
      const tr1 = high - low
      const tr2 = Math.abs(high - prevClose)
      const tr3 = Math.abs(low - prevClose)
      
      tr.push(Math.max(tr1, tr2, tr3))
    }
    
    const atr: number[] = []
    let atrValue = tr.slice(0, period).reduce((a, b) => a + b, 0) / period
    atr.push(atrValue)
    
    for (let i = period; i < tr.length; i++) {
      atrValue = (atrValue * (period - 1) + tr[i]) / period
      atr.push(atrValue)
    }
    
    return atr
  }

  static calculateStochastic(
    data: MarketData[], 
    kPeriod: number = 14, 
    dPeriod: number = 3
  ): { k: number[]; d: number[] } {
    if (data.length < kPeriod) {
      return { k: [], d: [] }
    }
    
    const k: number[] = []
    
    for (let i = kPeriod - 1; i < data.length; i++) {
      const slice = data.slice(i - kPeriod + 1, i + 1)
      const highest = Math.max(...slice.map(candle => candle.high))
      const lowest = Math.min(...slice.map(candle => candle.low))
      
      const kValue = ((data[i].close - lowest) / (highest - lowest)) * 100
      k.push(kValue)
    }
    
    const d = this.calculateSMAFromValues(k, dPeriod)
    
    return { k, d }
  }

  static calculateSMAFromValues(values: number[], period: number): number[] {
    if (values.length < period) return []
    
    const sma: number[] = []
    for (let i = period - 1; i < values.length; i++) {
      const sum = values.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0)
      sma.push(sum / period)
    }
    return sma
  }

  static calculateVWAP(data: MarketData[]): number[] {
    if (data.length === 0) return []
    
    const vwap: number[] = []
    let cumulativeVolume = 0
    let cumulativeVolumePrice = 0
    
    for (let i = 0; i < data.length; i++) {
      const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3
      const volume = data[i].volume
      
      cumulativeVolume += volume
      cumulativeVolumePrice += typicalPrice * volume
      
      vwap.push(cumulativeVolumePrice / cumulativeVolume)
    }
    
    return vwap
  }

  static detectCrossover(fastLine: number[], slowLine: number[]): ('BUY' | 'SELL' | 'HOLD')[] {
    if (fastLine.length < 2 || slowLine.length < 2) {
      return Array(Math.max(fastLine.length, slowLine.length)).fill('HOLD')
    }
    
    const signals: ('BUY' | 'SELL' | 'HOLD')[] = []
    
    for (let i = 1; i < Math.min(fastLine.length, slowLine.length); i++) {
      const prevFast = fastLine[i - 1]
      const currFast = fastLine[i]
      const prevSlow = slowLine[i - 1]
      const currSlow = slowLine[i]
      
      if (prevFast <= prevSlow && currFast > currSlow) {
        signals.push('BUY')
      } else if (prevFast >= prevSlow && currFast < currSlow) {
        signals.push('SELL')
      } else {
        signals.push('HOLD')
      }
    }
    
    return signals
  }

  static calculateVolatility(data: MarketData[], period: number = 20): number[] {
    if (data.length < period) return []
    
    const volatility: number[] = []
    const returns: number[] = []
    
    for (let i = 1; i < data.length; i++) {
      const returnRate = Math.log(data[i].close / data[i - 1].close)
      returns.push(returnRate)
    }
    
    for (let i = period - 1; i < returns.length; i++) {
      const slice = returns.slice(i - period + 1, i + 1)
      const mean = slice.reduce((a, b) => a + b, 0) / period
      const variance = slice.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period
      const stdDev = Math.sqrt(variance)
      const annualizedVolatility = stdDev * Math.sqrt(365) // Annualized
      volatility.push(annualizedVolatility)
    }
    
    return volatility
  }
}