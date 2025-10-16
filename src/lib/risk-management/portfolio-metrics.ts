/**
 * Advanced Portfolio Risk Metrics Calculator
 * 
 * This module provides comprehensive portfolio risk analysis including:
 * - Value at Risk (VaR) calculations
 * - Expected Shortfall (CVaR)
 * - Beta and Alpha calculations
 * - Sharpe and Sortino ratios
 * - Maximum drawdown analysis
 * - Risk-adjusted performance metrics
 */

export interface PortfolioPosition {
  symbol: string
  quantity: number
  entryPrice: number
  currentPrice: number
  weight: number
  volatility: number
  beta?: number
  expectedReturn?: number
}

export interface PortfolioData {
  positions: PortfolioPosition[]
  totalValue: number
  cashBalance: number
  benchmarkReturns?: number[]
  portfolioReturns?: number[]
  riskFreeRate: number
  timeHorizon: number // in days
}

export interface RiskMetrics {
  // Basic Risk Metrics
  volatility: number
  annualizedVolatility: number
  maxDrawdown: number
  currentDrawdown: number
  averageDrawdown: number
  
  // Value at Risk Metrics
  var95: number
  var99: number
  expectedShortfall: number
  conditionalVar: number
  
  // Risk-Adjusted Performance
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number
  informationRatio: number
  treynorRatio: number
  
  // Portfolio Metrics
  beta: number
  alpha: number
  rSquared: number
  trackingError: number
  
  // Diversification Metrics
  diversificationRatio: number
  concentrationRisk: number
  effectiveNumberOfAssets: number
  herfindahlIndex: number
  
  // Stress Metrics
  worstDay: number
  bestDay: number
  daysToRecover: number
  painIndex: number
  ulcerIndex: number
}

export interface RiskAnalysis {
  metrics: RiskMetrics
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  riskScore: number
  recommendations: string[]
  warnings: string[]
  riskDecomposition: {
    marketRisk: number
    specificRisk: number
    correlationRisk: number
    liquidityRisk: number
  }
}

export class PortfolioRiskCalculator {
  private config: {
    confidenceLevel: number
    timeHorizon: number
    riskFreeRate: number
    benchmarkSymbol?: string
  }

  constructor(config: {
    confidenceLevel?: number
    timeHorizon?: number
    riskFreeRate?: number
    benchmarkSymbol?: string
  } = {}) {
    this.config = {
      confidenceLevel: config.confidenceLevel || 0.95,
      timeHorizon: config.timeHorizon || 252, // 1 year trading days
      riskFreeRate: config.riskFreeRate || 0.02,
      benchmarkSymbol: config.benchmarkSymbol
    }
  }

  /**
   * Calculate comprehensive portfolio risk metrics
   */
  calculateRiskMetrics(portfolio: PortfolioData): RiskAnalysis {
    const metrics = this.calculateAllMetrics(portfolio)
    const riskLevel = this.assessRiskLevel(metrics)
    const riskScore = this.calculateRiskScore(metrics)
    const recommendations = this.generateRecommendations(metrics, portfolio)
    const warnings = this.generateWarnings(metrics)
    const riskDecomposition = this.decomposeRisk(metrics, portfolio)

    return {
      metrics,
      riskLevel,
      riskScore,
      recommendations,
      warnings,
      riskDecomposition
    }
  }

  /**
   * Calculate all risk metrics
   */
  private calculateAllMetrics(portfolio: PortfolioData): RiskMetrics {
    const returns = portfolio.portfolioReturns || this.calculatePortfolioReturns(portfolio)
    const benchmarkReturns = portfolio.benchmarkReturns || []
    
    return {
      // Basic Risk Metrics
      volatility: this.calculateVolatility(returns),
      annualizedVolatility: this.calculateAnnualizedVolatility(returns),
      maxDrawdown: this.calculateMaxDrawdown(returns),
      currentDrawdown: this.calculateCurrentDrawdown(returns),
      averageDrawdown: this.calculateAverageDrawdown(returns),
      
      // Value at Risk Metrics
      var95: this.calculateVaR(returns, 0.95),
      var99: this.calculateVaR(returns, 0.99),
      expectedShortfall: this.calculateExpectedShortfall(returns, 0.95),
      conditionalVar: this.calculateConditionalVaR(returns, 0.95),
      
      // Risk-Adjusted Performance
      sharpeRatio: this.calculateSharpeRatio(returns, portfolio.riskFreeRate),
      sortinoRatio: this.calculateSortinoRatio(returns, portfolio.riskFreeRate),
      calmarRatio: this.calculateCalmarRatio(returns),
      informationRatio: this.calculateInformationRatio(returns, benchmarkReturns),
      treynorRatio: this.calculateTreynorRatio(returns, portfolio.riskFreeRate, this.calculatePortfolioBeta(portfolio)),
      
      // Portfolio Metrics
      beta: this.calculatePortfolioBeta(portfolio),
      alpha: this.calculatePortfolioAlpha(portfolio, returns, benchmarkReturns),
      rSquared: this.calculateRSquared(returns, benchmarkReturns),
      trackingError: this.calculateTrackingError(returns, benchmarkReturns),
      
      // Diversification Metrics
      diversificationRatio: this.calculateDiversificationRatio(portfolio),
      concentrationRisk: this.calculateConcentrationRisk(portfolio),
      effectiveNumberOfAssets: this.calculateEffectiveNumberOfAssets(portfolio),
      herfindahlIndex: this.calculateHerfindahlIndex(portfolio),
      
      // Stress Metrics
      worstDay: this.calculateWorstDay(returns),
      bestDay: this.calculateBestDay(returns),
      daysToRecover: this.calculateDaysToRecover(returns),
      painIndex: this.calculatePainIndex(returns),
      ulcerIndex: this.calculateUlcerIndex(returns)
    }
  }

  /**
   * Calculate portfolio returns
   */
  private calculatePortfolioReturns(portfolio: PortfolioData): number[] {
    // Simplified calculation - in practice, this would use historical price data
    const returns: number[] = []
    const totalValue = portfolio.totalValue
    
    // Generate sample returns based on position weights and volatilities
    for (let i = 0; i < 252; i++) { // 1 year of daily returns
      let portfolioReturn = 0
      
      for (const position of portfolio.positions) {
        // Simulate return based on position volatility and weight
        const positionReturn = this.generateRandomReturn(position.volatility / Math.sqrt(252))
        portfolioReturn += positionReturn * position.weight
      }
      
      returns.push(portfolioReturn)
    }
    
    return returns
  }

  /**
   * Generate random return based on volatility
   */
  private generateRandomReturn(volatility: number): number {
    // Box-Muller transform for normal distribution
    const u1 = Math.random()
    const u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    
    return z * volatility
  }

  /**
   * Calculate volatility
   */
  private calculateVolatility(returns: number[]): number {
    if (returns.length < 2) return 0
    
    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1)
    
    return Math.sqrt(variance)
  }

  /**
   * Calculate annualized volatility
   */
  private calculateAnnualizedVolatility(returns: number[]): number {
    const dailyVolatility = this.calculateVolatility(returns)
    return dailyVolatility * Math.sqrt(252)
  }

  /**
   * Calculate maximum drawdown
   */
  private calculateMaxDrawdown(returns: number[]): number {
    if (returns.length === 0) return 0
    
    let peak = 1
    let maxDrawdown = 0
    let cumulative = 1
    
    for (const ret of returns) {
      cumulative *= (1 + ret)
      if (cumulative > peak) {
        peak = cumulative
      }
      const drawdown = (peak - cumulative) / peak
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    }
    
    return maxDrawdown
  }

  /**
   * Calculate current drawdown
   */
  private calculateCurrentDrawdown(returns: number[]): number {
    if (returns.length === 0) return 0
    
    let peak = 1
    let cumulative = 1
    
    for (const ret of returns) {
      cumulative *= (1 + ret)
      if (cumulative > peak) {
        peak = cumulative
      }
    }
    
    return (peak - cumulative) / peak
  }

  /**
   * Calculate average drawdown
   */
  private calculateAverageDrawdown(returns: number[]): number {
    if (returns.length === 0) return 0
    
    let peak = 1
    let cumulative = 1
    const drawdowns: number[] = []
    
    for (const ret of returns) {
      cumulative *= (1 + ret)
      if (cumulative > peak) {
        peak = cumulative
      }
      const drawdown = (peak - cumulative) / peak
      if (drawdown > 0) {
        drawdowns.push(drawdown)
      }
    }
    
    return drawdowns.length > 0 ? drawdowns.reduce((sum, d) => sum + d, 0) / drawdowns.length : 0
  }

  /**
   * Calculate Value at Risk (VaR)
   */
  private calculateVaR(returns: number[], confidenceLevel: number): number {
    if (returns.length === 0) return 0
    
    const sortedReturns = [...returns].sort((a, b) => a - b)
    const index = Math.floor((1 - confidenceLevel) * sortedReturns.length)
    
    return sortedReturns[index] || 0
  }

  /**
   * Calculate Expected Shortfall (CVaR)
   */
  private calculateExpectedShortfall(returns: number[], confidenceLevel: number): number {
    if (returns.length === 0) return 0
    
    const varValue = this.calculateVaR(returns, confidenceLevel)
    const tailReturns = returns.filter(r => r <= varValue)
    
    return tailReturns.length > 0 ? tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length : 0
  }

  /**
   * Calculate Conditional VaR
   */
  private calculateConditionalVaR(returns: number[], confidenceLevel: number): number {
    return this.calculateExpectedShortfall(returns, confidenceLevel)
  }

  /**
   * Calculate Sharpe Ratio
   */
  private calculateSharpeRatio(returns: number[], riskFreeRate: number): number {
    if (returns.length === 0) return 0
    
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const volatility = this.calculateVolatility(returns)
    const excessReturn = meanReturn - (riskFreeRate / 252)
    
    return volatility > 0 ? excessReturn / volatility : 0
  }

  /**
   * Calculate Sortino Ratio
   */
  private calculateSortinoRatio(returns: number[], riskFreeRate: number): number {
    if (returns.length === 0) return 0
    
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const excessReturn = meanReturn - (riskFreeRate / 252)
    
    const negativeReturns = returns.filter(r => r < 0)
    const downsideDeviation = negativeReturns.length > 0 
      ? Math.sqrt(negativeReturns.reduce((sum, r) => sum + r * r, 0) / negativeReturns.length)
      : 0
    
    return downsideDeviation > 0 ? excessReturn / downsideDeviation : 0
  }

  /**
   * Calculate Calmar Ratio
   */
  private calculateCalmarRatio(returns: number[]): number {
    if (returns.length === 0) return 0
    
    const totalReturn = returns.reduce((product, r) => product * (1 + r), 1) - 1
    const maxDrawdown = this.calculateMaxDrawdown(returns)
    
    return maxDrawdown > 0 ? totalReturn / maxDrawdown : 0
  }

  /**
   * Calculate Information Ratio
   */
  private calculateInformationRatio(returns: number[], benchmarkReturns: number[]): number {
    if (returns.length === 0 || benchmarkReturns.length === 0 || returns.length !== benchmarkReturns.length) {
      return 0
    }
    
    const excessReturns = returns.map((r, i) => r - benchmarkReturns[i])
    const meanExcessReturn = excessReturns.reduce((sum, r) => sum + r, 0) / excessReturns.length
    const trackingError = this.calculateVolatility(excessReturns)
    
    return trackingError > 0 ? meanExcessReturn / trackingError : 0
  }

  /**
   * Calculate Treynor Ratio
   */
  private calculateTreynorRatio(returns: number[], riskFreeRate: number, beta: number): number {
    if (returns.length === 0 || beta === 0) return 0
    
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const excessReturn = meanReturn - (riskFreeRate / 252)
    
    return excessReturn / beta
  }

  /**
   * Calculate portfolio beta
   */
  private calculatePortfolioBeta(portfolio: PortfolioData): number {
    if (portfolio.positions.length === 0) return 0
    
    let weightedBeta = 0
    for (const position of portfolio.positions) {
      const beta = position.beta || 1.0 // Default to 1 if not provided
      weightedBeta += beta * position.weight
    }
    
    return weightedBeta
  }

  /**
   * Calculate portfolio alpha
   */
  private calculatePortfolioAlpha(portfolio: PortfolioData, returns: number[], benchmarkReturns: number[]): number {
    if (returns.length === 0 || benchmarkReturns.length === 0 || returns.length !== benchmarkReturns.length) {
      return 0
    }
    
    const portfolioReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const benchmarkReturn = benchmarkReturns.reduce((sum, r) => sum + r, 0) / benchmarkReturns.length
    const beta = this.calculatePortfolioBeta(portfolio)
    
    return portfolioReturn - (portfolio.riskFreeRate / 252 + beta * (benchmarkReturn - portfolio.riskFreeRate / 252))
  }

  /**
   * Calculate R-squared
   */
  private calculateRSquared(returns: number[], benchmarkReturns: number[]): number {
    if (returns.length === 0 || benchmarkReturns.length === 0 || returns.length !== benchmarkReturns.length) {
      return 0
    }
    
    const portfolioMean = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const benchmarkMean = benchmarkReturns.reduce((sum, r) => sum + r, 0) / benchmarkReturns.length
    
    let covariance = 0
    let portfolioVariance = 0
    let benchmarkVariance = 0
    
    for (let i = 0; i < returns.length; i++) {
      const portfolioDeviation = returns[i] - portfolioMean
      const benchmarkDeviation = benchmarkReturns[i] - benchmarkMean
      
      covariance += portfolioDeviation * benchmarkDeviation
      portfolioVariance += portfolioDeviation * portfolioDeviation
      benchmarkVariance += benchmarkDeviation * benchmarkDeviation
    }
    
    const correlation = covariance / Math.sqrt(portfolioVariance * benchmarkVariance)
    return correlation * correlation
  }

  /**
   * Calculate tracking error
   */
  private calculateTrackingError(returns: number[], benchmarkReturns: number[]): number {
    if (returns.length === 0 || benchmarkReturns.length === 0 || returns.length !== benchmarkReturns.length) {
      return 0
    }
    
    const excessReturns = returns.map((r, i) => r - benchmarkReturns[i])
    return this.calculateVolatility(excessReturns)
  }

  /**
   * Calculate diversification ratio
   */
  private calculateDiversificationRatio(portfolio: PortfolioData): number {
    if (portfolio.positions.length === 0) return 0
    
    const weightedVolatility = portfolio.positions.reduce((sum, pos) => sum + pos.weight * pos.volatility, 0)
    const portfolioVolatility = this.calculatePortfolioVolatility(portfolio)
    
    return weightedVolatility > 0 ? weightedVolatility / portfolioVolatility : 1
  }

  /**
   * Calculate portfolio volatility
   */
  private calculatePortfolioVolatility(portfolio: PortfolioData): number {
    if (portfolio.positions.length === 0) return 0
    
    // Simplified calculation assuming equal correlation
    const avgCorrelation = 0.5
    let portfolioVariance = 0
    
    for (let i = 0; i < portfolio.positions.length; i++) {
      for (let j = 0; j < portfolio.positions.length; j++) {
        const posI = portfolio.positions[i]
        const posJ = portfolio.positions[j]
        
        const correlation = i === j ? 1 : avgCorrelation
        portfolioVariance += posI.weight * posJ.weight * posI.volatility * posJ.volatility * correlation
      }
    }
    
    return Math.sqrt(portfolioVariance)
  }

  /**
   * Calculate concentration risk
   */
  private calculateConcentrationRisk(portfolio: PortfolioData): number {
    if (portfolio.positions.length === 0) return 0
    
    const maxWeight = Math.max(...portfolio.positions.map(p => p.weight))
    return maxWeight * 100 // Convert to percentage
  }

  /**
   * Calculate effective number of assets
   */
  private calculateEffectiveNumberOfAssets(portfolio: PortfolioData): number {
    if (portfolio.positions.length === 0) return 0
    
    const herfindahl = this.calculateHerfindahlIndex(portfolio)
    return 1 / herfindahl
  }

  /**
   * Calculate Herfindahl-Hirschman Index
   */
  private calculateHerfindahlIndex(portfolio: PortfolioData): number {
    if (portfolio.positions.length === 0) return 0
    
    return portfolio.positions.reduce((sum, pos) => sum + pos.weight * pos.weight, 0)
  }

  /**
   * Calculate worst day
   */
  private calculateWorstDay(returns: number[]): number {
    if (returns.length === 0) return 0
    return Math.min(...returns)
  }

  /**
   * Calculate best day
   */
  private calculateBestDay(returns: number[]): number {
    if (returns.length === 0) return 0
    return Math.max(...returns)
  }

  /**
   * Calculate days to recover
   */
  private calculateDaysToRecover(returns: number[]): number {
    if (returns.length === 0) return 0
    
    let peak = 1
    let cumulative = 1
    let maxDrawdownDays = 0
    let currentDrawdownDays = 0
    
    for (const ret of returns) {
      cumulative *= (1 + ret)
      
      if (cumulative > peak) {
        peak = cumulative
        currentDrawdownDays = 0
      } else {
        currentDrawdownDays++
        if (currentDrawdownDays > maxDrawdownDays) {
          maxDrawdownDays = currentDrawdownDays
        }
      }
    }
    
    return maxDrawdownDays
  }

  /**
   * Calculate pain index
   */
  private calculatePainIndex(returns: number[]): number {
    if (returns.length === 0) return 0
    
    let cumulative = 1
    let peak = 1
    let painSum = 0
    
    for (const ret of returns) {
      cumulative *= (1 + ret)
      
      if (cumulative > peak) {
        peak = cumulative
      }
      
      const drawdown = (peak - cumulative) / peak
      painSum += drawdown
    }
    
    return painSum / returns.length
  }

  /**
   * Calculate ulcer index
   */
  private calculateUlcerIndex(returns: number[]): number {
    if (returns.length === 0) return 0
    
    let cumulative = 1
    let peak = 1
    let ulcerSum = 0
    
    for (const ret of returns) {
      cumulative *= (1 + ret)
      
      if (cumulative > peak) {
        peak = cumulative
      }
      
      const drawdown = (peak - cumulative) / peak
      ulcerSum += drawdown * drawdown
    }
    
    return Math.sqrt(ulcerSum / returns.length)
  }

  /**
   * Assess risk level
   */
  private assessRiskLevel(metrics: RiskMetrics): 'low' | 'medium' | 'high' | 'extreme' {
    const volatilityScore = Math.min(metrics.annualizedVolatility / 0.2, 1) * 0.3
    const drawdownScore = Math.min(metrics.maxDrawdown / 0.3, 1) * 0.3
    const varScore = Math.min(Math.abs(metrics.var95) / 0.05, 1) * 0.2
    const sharpeScore = Math.max(0, (1 - metrics.sharpeRatio) / 2) * 0.2
    
    const totalScore = volatilityScore + drawdownScore + varScore + sharpeScore
    
    if (totalScore < 0.25) return 'low'
    if (totalScore < 0.5) return 'medium'
    if (totalScore < 0.75) return 'high'
    return 'extreme'
  }

  /**
   * Calculate risk score
   */
  private calculateRiskScore(metrics: RiskMetrics): number {
    const volatilityScore = Math.min(metrics.annualizedVolatility / 0.3, 1) * 30
    const drawdownScore = Math.min(metrics.maxDrawdown / 0.4, 1) * 25
    const varScore = Math.min(Math.abs(metrics.var95) / 0.08, 1) * 20
    const concentrationScore = Math.min(metrics.concentrationRisk / 50, 1) * 15
    const sharpeScore = Math.max(0, (1 - metrics.sharpeRatio) / 3) * 10
    
    return Math.min(100, volatilityScore + drawdownScore + varScore + concentrationScore + sharpeScore)
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(metrics: RiskMetrics, portfolio: PortfolioData): string[] {
    const recommendations: string[] = []
    
    if (metrics.annualizedVolatility > 0.25) {
      recommendations.push('Consider reducing portfolio volatility through diversification')
    }
    
    if (metrics.maxDrawdown > 0.2) {
      recommendations.push('Implement stricter stop-loss rules to limit drawdowns')
    }
    
    if (metrics.sharpeRatio < 1) {
      recommendations.push('Improve risk-adjusted returns by optimizing asset allocation')
    }
    
    if (metrics.concentrationRisk > 30) {
      recommendations.push('Reduce concentration risk by diversifying across more assets')
    }
    
    if (metrics.diversificationRatio < 1.2) {
      recommendations.push('Improve diversification by adding uncorrelated assets')
    }
    
    if (metrics.beta > 1.2) {
      recommendations.push('Reduce market exposure through hedging or defensive assets')
    }
    
    return recommendations
  }

  /**
   * Generate warnings
   */
  private generateWarnings(metrics: RiskMetrics): string[] {
    const warnings: string[] = []
    
    if (metrics.annualizedVolatility > 0.4) {
      warnings.push('Extreme volatility detected - portfolio at high risk')
    }
    
    if (metrics.maxDrawdown > 0.3) {
      warnings.push('Severe drawdown risk - consider immediate risk reduction')
    }
    
    if (metrics.var95 < -0.1) {
      warnings.push('High Value at Risk - potential for significant losses')
    }
    
    if (metrics.concentrationRisk > 50) {
      warnings.push('Extreme concentration risk - single asset dominates portfolio')
    }
    
    if (metrics.sharpeRatio < 0.5) {
      warnings.push('Poor risk-adjusted performance - strategy may need review')
    }
    
    return warnings
  }

  /**
   * Decompose risk
   */
  private decomposeRisk(metrics: RiskMetrics, portfolio: PortfolioData) {
    const marketRisk = Math.abs(metrics.beta) * 0.6
    const specificRisk = (1 - metrics.rSquared) * 0.3
    const correlationRisk = Math.max(0, (1 - metrics.diversificationRatio) / 2) * 0.05
    const liquidityRisk = 0.05 // Simplified assumption
    
    return {
      marketRisk,
      specificRisk,
      correlationRisk,
      liquidityRisk
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config }
  }
}

// Factory function to create portfolio risk calculator
export function createPortfolioRiskCalculator(config?: {
  confidenceLevel?: number
  timeHorizon?: number
  riskFreeRate?: number
  benchmarkSymbol?: string
}): PortfolioRiskCalculator {
  return new PortfolioRiskCalculator(config)
}