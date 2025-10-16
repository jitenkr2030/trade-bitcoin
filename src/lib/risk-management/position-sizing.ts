/**
 * Advanced Position Sizing Algorithms for Trading Bots
 * 
 * This module provides sophisticated position sizing algorithms that go beyond
 * basic percentage-based sizing to include volatility-adjusted, Kelly criterion,
 * and risk parity approaches.
 */

export interface PositionSizingConfig {
  algorithm: 'fixed_percentage' | 'kelly_criterion' | 'volatility_adjusted' | 'risk_parity' | 'optimal_f'
  maxPositionSize: number
  maxPortfolioRisk: number
  maxDailyRisk: number
  volatilityWindow: number
  riskFreeRate: number
  confidenceLevel: number
}

export interface PositionSizingInput {
  accountBalance: number
  currentPrice: number
  volatility: number
  expectedReturn: number
  winRate: number
  avgWin: number
  avgLoss: number
  correlation?: number
  portfolioVolatility?: number
  marketConditions?: 'trending' | 'ranging' | 'volatile' | 'low_volatility'
}

export interface PositionSizingResult {
  positionSize: number
  positionValue: number
  riskAmount: number
  riskPercentage: number
  leverage: number
  confidence: number
  algorithm: string
  adjustments: string[]
  warnings: string[]
}

export class PositionSizingEngine {
  private config: PositionSizingConfig

  constructor(config: PositionSizingConfig) {
    this.config = config
  }

  /**
   * Calculate optimal position size using the configured algorithm
   */
  calculatePositionSize(input: PositionSizingInput): PositionSizingResult {
    const baseResult = this.getBasePositionSize(input)
    const adjustedResult = this.applyRiskAdjustments(baseResult, input)
    
    return {
      ...adjustedResult,
      algorithm: this.config.algorithm,
      adjustments: this.getAdjustments(adjustedResult, input),
      warnings: this.getWarnings(adjustedResult, input)
    }
  }

  /**
   * Get base position size using the selected algorithm
   */
  private getBasePositionSize(input: PositionSizingInput): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    switch (this.config.algorithm) {
      case 'fixed_percentage':
        return this.fixedPercentageSizing(input)
      case 'kelly_criterion':
        return this.kellyCriterionSizing(input)
      case 'volatility_adjusted':
        return this.volatilityAdjustedSizing(input)
      case 'risk_parity':
        return this.riskParitySizing(input)
      case 'optimal_f':
        return this.optimalFSizing(input)
      default:
        throw new Error(`Unknown position sizing algorithm: ${this.config.algorithm}`)
    }
  }

  /**
   * Fixed Percentage Position Sizing
   * Risk a fixed percentage of account balance per trade
   */
  private fixedPercentageSizing(input: PositionSizingInput): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    const riskPercentage = Math.min(this.config.maxPortfolioRisk, this.config.maxDailyRisk)
    const riskAmount = input.accountBalance * (riskPercentage / 100)
    const positionValue = riskAmount / 0.02 // Assuming 2% stop loss
    const positionSize = positionValue / input.currentPrice
    const leverage = positionValue / input.accountBalance

    return {
      positionSize,
      positionValue,
      riskAmount,
      riskPercentage,
      leverage,
      confidence: 0.8
    }
  }

  /**
   * Kelly Criterion Position Sizing
   * Maximizes long-term growth rate based on win rate and payoff ratio
   */
  private kellyCriterionSizing(input: PositionSizingInput): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    const winRate = input.winRate || 0.5
    const avgWin = input.avgWin || 1
    const avgLoss = input.avgLoss || 1
    
    // Kelly formula: f = (bp - q) / b
    // where b = avgWin / avgLoss, p = winRate, q = 1 - winRate
    const b = avgWin / avgLoss
    const kellyFraction = (b * winRate - (1 - winRate)) / b
    
    // Apply fractional Kelly (usually 25-50% of full Kelly)
    const fractionalKelly = Math.max(0, kellyFraction * 0.25)
    
    const riskPercentage = Math.min(fractionalKelly * 100, this.config.maxPortfolioRisk)
    const riskAmount = input.accountBalance * (riskPercentage / 100)
    const positionValue = riskAmount / 0.02
    const positionSize = positionValue / input.currentPrice
    const leverage = positionValue / input.accountBalance

    return {
      positionSize,
      positionValue,
      riskAmount,
      riskPercentage,
      leverage,
      confidence: Math.min(kellyFraction, 1)
    }
  }

  /**
   * Volatility-Adjusted Position Sizing
   * Adjusts position size based on market volatility
   */
  private volatilityAdjustedSizing(input: PositionSizingInput): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    const baseRiskPercentage = this.config.maxPortfolioRisk
    const volatilityFactor = this.calculateVolatilityFactor(input.volatility)
    const adjustedRiskPercentage = baseRiskPercentage * volatilityFactor
    
    const riskAmount = input.accountBalance * (adjustedRiskPercentage / 100)
    const positionValue = riskAmount / 0.02
    const positionSize = positionValue / input.currentPrice
    const leverage = positionValue / input.accountBalance

    return {
      positionSize,
      positionValue,
      riskAmount,
      riskPercentage: adjustedRiskPercentage,
      leverage,
      confidence: volatilityFactor
    }
  }

  /**
   * Risk Parity Position Sizing
   * Allocates capital based on risk contribution rather than value
   */
  private riskParitySizing(input: PositionSizingInput): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    const portfolioVolatility = input.portfolioVolatility || input.volatility
    const assetVolatility = input.volatility
    const correlation = input.correlation || 0.5
    
    // Calculate risk contribution
    const riskContribution = (assetVolatility * Math.sqrt(1 - correlation)) / portfolioVolatility
    
    // Target equal risk contribution
    const targetRiskContribution = 1 / (1 + (correlation || 0.5))
    const adjustmentFactor = targetRiskContribution / riskContribution
    
    const baseRiskPercentage = this.config.maxPortfolioRisk
    const adjustedRiskPercentage = baseRiskPercentage * adjustmentFactor
    
    const riskAmount = input.accountBalance * (adjustedRiskPercentage / 100)
    const positionValue = riskAmount / 0.02
    const positionSize = positionValue / input.currentPrice
    const leverage = positionValue / input.accountBalance

    return {
      positionSize,
      positionValue,
      riskAmount,
      riskPercentage: adjustedRiskPercentage,
      leverage,
      confidence: adjustmentFactor
    }
  }

  /**
   * Optimal F Position Sizing
   * Based on Ralph Vince's Optimal F formula for maximum geometric growth
   */
  private optimalFSizing(input: PositionSizingInput): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    // Simplified Optimal F calculation
    // In practice, this would require historical trade data
    const winRate = input.winRate || 0.5
    const avgWin = input.avgWin || 1.02
    const avgLoss = input.avgLoss || 0.98
    
    // Estimate optimal f
    const worstLoss = 0.1 // Assume 10% worst case loss
    const optimalF = this.estimateOptimalF(winRate, avgWin, avgLoss, worstLoss)
    
    const riskPercentage = Math.min(optimalF * 100, this.config.maxPortfolioRisk)
    const riskAmount = input.accountBalance * (riskPercentage / 100)
    const positionValue = riskAmount / 0.02
    const positionSize = positionValue / input.currentPrice
    const leverage = positionValue / input.accountBalance

    return {
      positionSize,
      positionValue,
      riskAmount,
      riskPercentage,
      leverage,
      confidence: optimalF
    }
  }

  /**
   * Apply risk adjustments to base position size
   */
  private applyRiskAdjustments(
    baseResult: Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'>,
    input: PositionSizingInput
  ): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    let adjustedResult = { ...baseResult }

    // Apply market condition adjustments
    if (input.marketConditions) {
      adjustedResult = this.applyMarketConditionAdjustments(adjustedResult, input.marketConditions)
    }

    // Apply daily risk limits
    adjustedResult = this.applyDailyRiskLimits(adjustedResult, input.accountBalance)

    // Apply maximum position size limits
    adjustedResult = this.applyMaxPositionSizeLimits(adjustedResult, input.accountBalance)

    // Apply correlation adjustments
    if (input.correlation) {
      adjustedResult = this.applyCorrelationAdjustments(adjustedResult, input.correlation)
    }

    return adjustedResult
  }

  /**
   * Calculate volatility adjustment factor
   */
  private calculateVolatilityFactor(volatility: number): number {
    // Normalize volatility (assuming annual volatility)
    const normalizedVol = volatility / 100
    
    // Inverse relationship: higher volatility = smaller position
    if (normalizedVol < 0.1) return 1.2 // Low volatility, can increase size
    if (normalizedVol < 0.2) return 1.0 // Normal volatility
    if (normalizedVol < 0.3) return 0.8 // High volatility, reduce size
    if (normalizedVol < 0.5) return 0.6 // Very high volatility
    return 0.4 // Extreme volatility
  }

  /**
   * Estimate Optimal F value
   */
  private estimateOptimalF(winRate: number, avgWin: number, avgLoss: number, worstLoss: number): number {
    // Simplified estimation - in practice, this would use historical data
    const expectedValue = (winRate * avgWin) - ((1 - winRate) * avgLoss)
    
    if (expectedValue <= 0) return 0
    
    // Conservative estimate
    const conservativeF = expectedValue / worstLoss * 0.25
    
    return Math.min(conservativeF, 0.1) // Max 10% of capital
  }

  /**
   * Apply market condition adjustments
   */
  private applyMarketConditionAdjustments(
    result: Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'>,
    conditions: string
  ): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    const adjustment = {
      'trending': 1.1,
      'ranging': 0.9,
      'volatile': 0.7,
      'low_volatility': 1.2
    }[conditions] || 1.0

    return {
      ...result,
      positionSize: result.positionSize * adjustment,
      positionValue: result.positionValue * adjustment,
      riskAmount: result.riskAmount * adjustment,
      leverage: result.leverage * adjustment
    }
  }

  /**
   * Apply daily risk limits
   */
  private applyDailyRiskLimits(
    result: Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'>,
    accountBalance: number
  ): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    const maxDailyRiskAmount = accountBalance * (this.config.maxDailyRisk / 100)
    
    if (result.riskAmount > maxDailyRiskAmount) {
      const adjustmentFactor = maxDailyRiskAmount / result.riskAmount
      
      return {
        ...result,
        positionSize: result.positionSize * adjustmentFactor,
        positionValue: result.positionValue * adjustmentFactor,
        riskAmount: maxDailyRiskAmount,
        riskPercentage: this.config.maxDailyRisk,
        leverage: result.leverage * adjustmentFactor
      }
    }
    
    return result
  }

  /**
   * Apply maximum position size limits
   */
  private applyMaxPositionSizeLimits(
    result: Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'>,
    accountBalance: number
  ): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    const maxPositionValue = accountBalance * (this.config.maxPositionSize / 100)
    
    if (result.positionValue > maxPositionValue) {
      const adjustmentFactor = maxPositionValue / result.positionValue
      
      return {
        ...result,
        positionSize: result.positionSize * adjustmentFactor,
        positionValue: maxPositionValue,
        riskAmount: result.riskAmount * adjustmentFactor,
        riskPercentage: result.riskPercentage * adjustmentFactor,
        leverage: result.leverage * adjustmentFactor
      }
    }
    
    return result
  }

  /**
   * Apply correlation adjustments
   */
  private applyCorrelationAdjustments(
    result: Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'>,
    correlation: number
  ): Omit<PositionSizingResult, 'algorithm' | 'adjustments' | 'warnings'> {
    // High correlation means more risk, so reduce position size
    let adjustmentFactor = 1.0
    
    if (Math.abs(correlation) > 0.8) {
      adjustmentFactor = 0.6
    } else if (Math.abs(correlation) > 0.6) {
      adjustmentFactor = 0.8
    } else if (Math.abs(correlation) < 0.2) {
      adjustmentFactor = 1.1 // Low correlation allows slightly larger positions
    }

    return {
      ...result,
      positionSize: result.positionSize * adjustmentFactor,
      positionValue: result.positionValue * adjustmentFactor,
      riskAmount: result.riskAmount * adjustmentFactor,
      riskPercentage: result.riskPercentage * adjustmentFactor,
      leverage: result.leverage * adjustmentFactor
    }
  }

  /**
   * Get adjustments made to position size
   */
  private getAdjustments(result: PositionSizingResult, input: PositionSizingInput): string[] {
    const adjustments: string[] = []
    
    if (input.marketConditions) {
      adjustments.push(`Market condition: ${input.marketConditions}`)
    }
    
    if (input.correlation && Math.abs(input.correlation) > 0.6) {
      adjustments.push(`High correlation adjustment: ${input.correlation.toFixed(2)}`)
    }
    
    if (result.leverage > 1) {
      adjustments.push(`Leverage applied: ${result.leverage.toFixed(2)}x`)
    }
    
    return adjustments
  }

  /**
   * Get warnings for the position size
   */
  private getWarnings(result: PositionSizingResult, input: PositionSizingInput): string[] {
    const warnings: string[] = []
    
    if (result.leverage > 2) {
      warnings.push('High leverage detected')
    }
    
    if (result.riskPercentage > this.config.maxPortfolioRisk * 0.8) {
      warnings.push('Approaching maximum portfolio risk limit')
    }
    
    if (input.volatility > 30) {
      warnings.push('High volatility environment')
    }
    
    if (result.confidence < 0.5) {
      warnings.push('Low confidence in position size calculation')
    }
    
    return warnings
  }

  /**
   * Get position sizing recommendations
   */
  getRecommendations(input: PositionSizingInput): string[] {
    const recommendations: string[] = []
    
    if (input.volatility > 25) {
      recommendations.push('Consider reducing position size due to high volatility')
    }
    
    if (input.winRate < 0.4) {
      recommendations.push('Low win rate detected - consider smaller position sizes')
    }
    
    if (input.avgWin / input.avgLoss < 1.5) {
      recommendations.push('Low reward-to-risk ratio - review strategy')
    }
    
    if (input.marketConditions === 'volatile') {
      recommendations.push('Volatile market conditions - use caution with position sizing')
    }
    
    return recommendations
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PositionSizingConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): PositionSizingConfig {
    return { ...this.config }
  }
}

// Factory function to create position sizing engine
export function createPositionSizingEngine(config: PositionSizingConfig): PositionSizingEngine {
  return new PositionSizingEngine(config)
}

// Default configuration
export const defaultPositionSizingConfig: PositionSizingConfig = {
  algorithm: 'volatility_adjusted',
  maxPositionSize: 10,
  maxPortfolioRisk: 2,
  maxDailyRisk: 5,
  volatilityWindow: 20,
  riskFreeRate: 0.02,
  confidenceLevel: 0.95
}