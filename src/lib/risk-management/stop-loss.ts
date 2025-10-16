/**
 * Advanced Stop-Loss Automation System
 * 
 * This module provides sophisticated stop-loss mechanisms including:
 * - Dynamic trailing stops
 * - Volatility-based stops
 * - Technical indicator stops
 * - Time-based stops
 * - Portfolio-level stops
 */

export interface StopLossConfig {
  type: 'fixed' | 'trailing' | 'volatility_based' | 'atr_based' | 'technical' | 'time_based' | 'portfolio'
  initialStopLoss: number
  trailingDistance?: number
  volatilityMultiplier?: number
  atrPeriod?: number
  atrMultiplier?: number
  technicalIndicator?: 'supertrend' | 'parabolic_sar' | 'bollinger_bands' | 'support_resistance'
  maxTimeHeld?: number // in hours
  portfolioStopLoss?: number
  breakevenTrigger?: number
  partialTakeProfit?: {
    levels: Array<{ percentage: number; size: number }>
  }
}

export interface StopLossInput {
  entryPrice: number
  currentPrice: number
  positionSize: number
  positionType: 'long' | 'short'
  volatility: number
  atr?: number
  technicalIndicators?: Record<string, number>
  timeHeld: number // in hours
  portfolioValue: number
  unrealizedPnL: number
  marketConditions?: 'trending' | 'ranging' | 'volatile' | 'low_volatility'
}

export interface StopLossResult {
  shouldExit: boolean
  stopPrice: number
  stopType: string
  reason: string
  confidence: number
  adjustedStopLoss?: number
  partialExit?: {
    shouldExit: boolean
    exitSize: number
    reason: string
  }
  warnings: string[]
}

export interface StopLossOrder {
  id: string
  positionId: string
  symbol: string
  stopPrice: number
  orderType: 'stop_market' | 'stop_limit'
  limitPrice?: number
  status: 'active' | 'triggered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
  triggeredAt?: Date
}

export class StopLossAutomationEngine {
  private config: StopLossConfig
  private activeStops: Map<string, StopLossOrder> = new Map()
  private stopHistory: StopLossOrder[] = []

  constructor(config: StopLossConfig) {
    this.config = config
  }

  /**
   * Calculate stop-loss price and determine if position should be exited
   */
  calculateStopLoss(input: StopLossInput): StopLossResult {
    const baseResult = this.getBaseStopLoss(input)
    const adjustedResult = this.applyStopLossAdjustments(baseResult, input)
    
    return {
      ...adjustedResult,
      stopType: this.config.type,
      confidence: this.calculateConfidence(adjustedResult, input),
      partialExit: this.calculatePartialExit(adjustedResult, input),
      warnings: this.getWarnings(adjustedResult, input)
    }
  }

  /**
   * Get base stop-loss price using the configured algorithm
   */
  private getBaseStopLoss(input: StopLossInput): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    switch (this.config.type) {
      case 'fixed':
        return this.fixedStopLoss(input)
      case 'trailing':
        return this.trailingStopLoss(input)
      case 'volatility_based':
        return this.volatilityBasedStopLoss(input)
      case 'atr_based':
        return this.atrBasedStopLoss(input)
      case 'technical':
        return this.technicalStopLoss(input)
      case 'time_based':
        return this.timeBasedStopLoss(input)
      case 'portfolio':
        return this.portfolioStopLoss(input)
      default:
        throw new Error(`Unknown stop-loss type: ${this.config.type}`)
    }
  }

  /**
   * Fixed Stop-Loss
   * Simple percentage-based stop-loss
   */
  private fixedStopLoss(input: StopLossInput): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    const stopLossPercentage = this.config.initialStopLoss
    const stopPrice = input.positionType === 'long' 
      ? input.entryPrice * (1 - stopLossPercentage / 100)
      : input.entryPrice * (1 + stopLossPercentage / 100)
    
    const shouldExit = input.positionType === 'long' 
      ? input.currentPrice <= stopPrice
      : input.currentPrice >= stopPrice

    return {
      shouldExit,
      stopPrice,
      reason: `Fixed ${stopLossPercentage}% stop-loss triggered`
    }
  }

  /**
   * Trailing Stop-Loss
   * Adjusts stop-loss price as price moves in favor
   */
  private trailingStopLoss(input: StopLossInput): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    const trailingDistance = this.config.trailingDistance || this.config.initialStopLoss
    const highestPrice = Math.max(input.entryPrice, input.currentPrice)
    const lowestPrice = Math.min(input.entryPrice, input.currentPrice)
    
    let stopPrice: number
    
    if (input.positionType === 'long') {
      stopPrice = highestPrice * (1 - trailingDistance / 100)
      const shouldExit = input.currentPrice <= stopPrice
      
      return {
        shouldExit,
        stopPrice,
        reason: `Trailing stop-loss triggered at ${trailingDistance}% below highest price`
      }
    } else {
      stopPrice = lowestPrice * (1 + trailingDistance / 100)
      const shouldExit = input.currentPrice >= stopPrice
      
      return {
        shouldExit,
        stopPrice,
        reason: `Trailing stop-loss triggered at ${trailingDistance}% above lowest price`
      }
    }
  }

  /**
   * Volatility-Based Stop-Loss
   * Adjusts stop-loss based on market volatility
   */
  private volatilityBasedStopLoss(input: StopLossInput): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    const volatilityMultiplier = this.config.volatilityMultiplier || 2.0
    const volatilityStopDistance = input.volatility * volatilityMultiplier
    
    const stopPrice = input.positionType === 'long'
      ? input.entryPrice - volatilityStopDistance
      : input.entryPrice + volatilityStopDistance
    
    const shouldExit = input.positionType === 'long'
      ? input.currentPrice <= stopPrice
      : input.currentPrice >= stopPrice

    return {
      shouldExit,
      stopPrice,
      reason: `Volatility-based stop-loss triggered (${volatilityMultiplier}x volatility)`
    }
  }

  /**
   * ATR-Based Stop-Loss
   * Uses Average True Range for stop-loss calculation
   */
  private atrBasedStopLoss(input: StopLossInput): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    if (!input.atr) {
      throw new Error('ATR value required for ATR-based stop-loss')
    }

    const atrMultiplier = this.config.atrMultiplier || 2.0
    const atrStopDistance = input.atr * atrMultiplier
    
    const stopPrice = input.positionType === 'long'
      ? input.entryPrice - atrStopDistance
      : input.entryPrice + atrStopDistance
    
    const shouldExit = input.positionType === 'long'
      ? input.currentPrice <= stopPrice
      : input.currentPrice >= stopPrice

    return {
      shouldExit,
      stopPrice,
      reason: `ATR-based stop-loss triggered (${atrMultiplier}x ATR)`
    }
  }

  /**
   * Technical Indicator Stop-Loss
   * Uses technical indicators for stop-loss calculation
   */
  private technicalStopLoss(input: StopLossInput): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    if (!input.technicalIndicators) {
      throw new Error('Technical indicators required for technical stop-loss')
    }

    let stopPrice: number
    let reason: string

    switch (this.config.technicalIndicator) {
      case 'supertrend':
        const supertrend = input.technicalIndicators.supertrend
        stopPrice = supertrend
        reason = 'Supertrend indicator stop-loss'
        break
      
      case 'parabolic_sar':
        const sar = input.technicalIndicators.parabolic_sar
        stopPrice = sar
        reason = 'Parabolic SAR stop-loss'
        break
      
      case 'bollinger_bands':
        const bbLower = input.technicalIndicators.bb_lower
        const bbUpper = input.technicalIndicators.bb_upper
        stopPrice = input.positionType === 'long' ? bbLower : bbUpper
        reason = 'Bollinger Bands stop-loss'
        break
      
      case 'support_resistance':
        const support = input.technicalIndicators.support
        const resistance = input.technicalIndicators.resistance
        stopPrice = input.positionType === 'long' ? support : resistance
        reason = 'Support/Resistance stop-loss'
        break
      
      default:
        throw new Error(`Unknown technical indicator: ${this.config.technicalIndicator}`)
    }

    const shouldExit = input.positionType === 'long'
      ? input.currentPrice <= stopPrice
      : input.currentPrice >= stopPrice

    return {
      shouldExit,
      stopPrice,
      reason
    }
  }

  /**
   * Time-Based Stop-Loss
   * Exits position after maximum time held
   */
  private timeBasedStopLoss(input: StopLossInput): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    const maxTimeHeld = this.config.maxTimeHeld || 24 // Default 24 hours
    const shouldExit = input.timeHeld >= maxTimeHeld

    return {
      shouldExit,
      stopPrice: input.currentPrice, // Market exit
      reason: `Time-based stop-loss: Position held for ${input.timeHeld} hours (max: ${maxTimeHeld})`
    }
  }

  /**
   * Portfolio-Level Stop-Loss
   * Exits position based on portfolio performance
   */
  private portfolioStopLoss(input: StopLossInput): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    const portfolioStopLoss = this.config.portfolioStopLoss || 10
    const portfolioLossPercentage = (input.unrealizedPnL / input.portfolioValue) * 100
    
    const shouldExit = portfolioLossPercentage <= -portfolioStopLoss

    return {
      shouldExit,
      stopPrice: input.currentPrice, // Market exit
      reason: `Portfolio stop-loss: ${portfolioLossPercentage.toFixed(2)}% loss (max: ${portfolioStopLoss}%)`
    }
  }

  /**
   * Apply stop-loss adjustments
   */
  private applyStopLossAdjustments(
    baseResult: Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'>,
    input: StopLossInput
  ): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    let adjustedResult = { ...baseResult }

    // Apply breakeven adjustment
    if (this.config.breakevenTrigger) {
      adjustedResult = this.applyBreakevenAdjustment(adjustedResult, input)
    }

    // Apply market condition adjustments
    if (input.marketConditions) {
      adjustedResult = this.applyMarketConditionAdjustments(adjustedResult, input.marketConditions)
    }

    // Apply volatility adjustment
    adjustedResult = this.applyVolatilityAdjustment(adjustedResult, input.volatility)

    return adjustedResult
  }

  /**
   * Apply breakeven adjustment
   */
  private applyBreakevenAdjustment(
    result: Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'>,
    input: StopLossInput
  ): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    const breakevenTrigger = this.config.breakevenTrigger || 2 // Default 2%
    const profitPercentage = ((input.currentPrice - input.entryPrice) / input.entryPrice) * 100
    
    if (input.positionType === 'long' && profitPercentage >= breakevenTrigger) {
      return {
        ...result,
        stopPrice: input.entryPrice,
        adjustedStopLoss: input.entryPrice,
        reason: `${result.reason} (Breakeven triggered at ${breakevenTrigger}%)`
      }
    }
    
    if (input.positionType === 'short' && profitPercentage <= -breakevenTrigger) {
      return {
        ...result,
        stopPrice: input.entryPrice,
        adjustedStopLoss: input.entryPrice,
        reason: `${result.reason} (Breakeven triggered at ${breakevenTrigger}%)`
      }
    }
    
    return result
  }

  /**
   * Apply market condition adjustments
   */
  private applyMarketConditionAdjustments(
    result: Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'>,
    conditions: string
  ): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    const adjustment = {
      'trending': 1.1,
      'ranging': 0.9,
      'volatile': 1.2,
      'low_volatility': 0.8
    }[conditions] || 1.0

    const adjustedStopPrice = input.positionType === 'long'
      ? result.stopPrice * adjustment
      : result.stopPrice / adjustment

    return {
      ...result,
      stopPrice: adjustedStopPrice,
      reason: `${result.reason} (Market condition: ${conditions})`
    }
  }

  /**
   * Apply volatility adjustment
   */
  private applyVolatilityAdjustment(
    result: Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'>,
    volatility: number
  ): Omit<StopLossResult, 'stopType' | 'confidence' | 'partialExit' | 'warnings'> {
    if (volatility > 30) {
      // High volatility - widen stops
      const adjustmentFactor = 1 + (volatility - 30) / 100
      const adjustedStopPrice = input.positionType === 'long'
        ? result.stopPrice / adjustmentFactor
        : result.stopPrice * adjustmentFactor

      return {
        ...result,
        stopPrice: adjustedStopPrice,
        reason: `${result.reason} (High volatility adjustment)`
      }
    }
    
    return result
  }

  /**
   * Calculate confidence level
   */
  private calculateConfidence(result: StopLossResult, input: StopLossInput): number {
    let confidence = 0.8 // Base confidence

    // Adjust based on volatility
    if (input.volatility > 30) confidence -= 0.2
    if (input.volatility < 10) confidence += 0.1

    // Adjust based on market conditions
    if (input.marketConditions === 'trending') confidence += 0.1
    if (input.marketConditions === 'volatile') confidence -= 0.1

    // Adjust based on time held
    if (input.timeHeld > 48) confidence -= 0.1

    return Math.max(0.1, Math.min(1.0, confidence))
  }

  /**
   * Calculate partial exit
   */
  private calculatePartialExit(result: StopLossResult, input: StopLossInput): StopLossResult['partialExit'] {
    if (!this.config.partialTakeProfit) {
      return undefined
    }

    const profitPercentage = ((input.currentPrice - input.entryPrice) / input.entryPrice) * 100
    
    for (const level of this.config.partialTakeProfit.levels) {
      if (Math.abs(profitPercentage) >= level.percentage) {
        return {
          shouldExit: true,
          exitSize: level.size,
          reason: `Partial take-profit at ${level.percentage}% profit`
        }
      }
    }

    return undefined
  }

  /**
   * Get warnings
   */
  private getWarnings(result: StopLossResult, input: StopLossInput): string[] {
    const warnings: string[] = []
    
    if (input.volatility > 40) {
      warnings.push('Extreme volatility - stop-loss may be unreliable')
    }
    
    if (input.timeHeld > 72) {
      warnings.push('Position held for extended period')
    }
    
    if (result.confidence < 0.5) {
      warnings.push('Low confidence in stop-loss calculation')
    }
    
    return warnings
  }

  /**
   * Create stop-loss order
   */
  createStopLossOrder(positionId: string, symbol: string, stopPrice: number, orderType: 'stop_market' | 'stop_limit' = 'stop_market', limitPrice?: number): StopLossOrder {
    const order: StopLossOrder = {
      id: `stop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      positionId,
      symbol,
      stopPrice,
      orderType,
      limitPrice,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.activeStops.set(order.id, order)
    return order
  }

  /**
   * Update stop-loss order
   */
  updateStopLossOrder(orderId: string, newStopPrice: number): void {
    const order = this.activeStops.get(orderId)
    if (order) {
      order.stopPrice = newStopPrice
      order.updatedAt = new Date()
      this.activeStops.set(orderId, order)
    }
  }

  /**
   * Cancel stop-loss order
   */
  cancelStopLossOrder(orderId: string): void {
    const order = this.activeStops.get(orderId)
    if (order) {
      order.status = 'cancelled'
      order.updatedAt = new Date()
      this.stopHistory.push(order)
      this.activeStops.delete(orderId)
    }
  }

  /**
   * Get active stop-loss orders
   */
  getActiveStopLossOrders(): StopLossOrder[] {
    return Array.from(this.activeStops.values())
  }

  /**
   * Get stop-loss history
   */
  getStopLossHistory(): StopLossOrder[] {
    return [...this.stopHistory]
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<StopLossConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): StopLossConfig {
    return { ...this.config }
  }
}

// Factory function to create stop-loss automation engine
export function createStopLossAutomationEngine(config: StopLossConfig): StopLossAutomationEngine {
  return new StopLossAutomationEngine(config)
}

// Default configuration
export const defaultStopLossConfig: StopLossConfig = {
  type: 'trailing',
  initialStopLoss: 2,
  trailingDistance: 1.5,
  volatilityMultiplier: 2.0,
  atrPeriod: 14,
  atrMultiplier: 2.0,
  technicalIndicator: 'supertrend',
  maxTimeHeld: 72,
  portfolioStopLoss: 5,
  breakevenTrigger: 2,
  partialTakeProfit: {
    levels: [
      { percentage: 1, size: 0.25 },
      { percentage: 2, size: 0.25 },
      { percentage: 3, size: 0.25 }
    ]
  }
}