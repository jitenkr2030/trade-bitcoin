/**
 * Advanced Stress Testing Framework
 * 
 * This module provides comprehensive stress testing capabilities including:
 * - Historical scenario analysis
 * - Hypothetical stress scenarios
 * - Monte Carlo stress testing
 * - Factor-based stress testing
 * - Reverse stress testing
 * - Portfolio resilience assessment
 */

export interface StressTestScenario {
  id: string
  name: string
  description: string
  type: 'historical' | 'hypothetical' | 'factor_based' | 'monte_carlo' | 'reverse'
  severity: 'mild' | 'moderate' | 'severe' | 'extreme'
  probability: number
  parameters: StressTestParameters
  expectedImpact: {
    marketImpact: number
    volatilityImpact: number
    correlationImpact: number
    liquidityImpact: number
  }
}

export interface StressTestParameters {
  marketShock?: number
  volatilityShock?: number
  correlationShock?: number
  liquidityShock?: number
  interestRateShock?: number
  currencyShock?: number
  commodityShock?: number
  creditSpreadShock?: number
  factorShocks?: Record<string, number>
  customShocks?: Record<string, number>
  duration?: number // in days
  recoveryTime?: number // in days
}

export interface StressTestInput {
  portfolio: {
    positions: Array<{
      symbol: string
      quantity: number
      currentPrice: number
      weight: number
      beta?: number
      duration?: number
      volatility: number
      assetClass: 'equity' | 'bond' | 'commodity' | 'currency' | 'crypto'
      sector?: string
      region?: string
    }>
    totalValue: number
    cashBalance: number
    leverage: number
  }
  marketConditions: {
    currentVolatility: number
    currentCorrelation: number
    currentLiquidity: number
    interestRate: number
    currencyRates?: Record<string, number>
  }
  baseline: {
    expectedReturn: number
    volatility: number
    maxDrawdown: number
    sharpeRatio: number
  }
}

export interface StressTestResult {
  scenario: StressTestScenario
  portfolioImpact: {
    valueChange: number
    percentageChange: number
    newPortfolioValue: number
    maxDrawdown: number
    recoveryTime: number
  }
  positionImpacts: Array<{
    symbol: string
    valueChange: number
    percentageChange: number
    riskContribution: number
  }>
  riskMetrics: {
    newVolatility: number
    newBeta: number
    newSharpeRatio: number
    newSortinoRatio: number
    var95: number
    var99: number
    expectedShortfall: number
  }
  resilience: {
    resilienceScore: number
    resilienceRating: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
    criticalPositions: string[]
    mitigationStrategies: string[]
  }
  warnings: string[]
  recommendations: string[]
}

export interface StressTestReport {
  scenarios: StressTestResult[]
  summary: {
    worstCase: StressTestResult
    averageImpact: {
      valueChange: number
      percentageChange: number
      maxDrawdown: number
    }
    resilienceScore: number
    riskFactors: Array<{
      factor: string
      impact: number
      probability: number
      riskScore: number
    }>
  }
  portfolioResilience: {
    overallRating: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
}

export class StressTestingEngine {
  private config: {
    scenarios: StressTestScenario[]
    confidenceLevel: number
    timeHorizon: number
    riskFreeRate: number
    simulationRuns: number
  }

  constructor(config: {
    scenarios?: StressTestScenario[]
    confidenceLevel?: number
    timeHorizon?: number
    riskFreeRate?: number
    simulationRuns?: number
  } = {}) {
    this.config = {
      scenarios: config.scenarios || this.getDefaultScenarios(),
      confidenceLevel: config.confidenceLevel || 0.95,
      timeHorizon: config.timeHorizon || 252,
      riskFreeRate: config.riskFreeRate || 0.02,
      simulationRuns: config.simulationRuns || 10000
    }
  }

  /**
   * Run comprehensive stress testing
   */
  runStressTests(input: StressTestInput): StressTestReport {
    const results: StressTestResult[] = []
    
    for (const scenario of this.config.scenarios) {
      const result = this.runSingleStressTest(input, scenario)
      results.push(result)
    }
    
    const summary = this.calculateSummary(results)
    const portfolioResilience = this.assessPortfolioResilience(results)
    
    return {
      scenarios: results,
      summary,
      portfolioResilience
    }
  }

  /**
   * Run a single stress test scenario
   */
  runSingleStressTest(input: StressTestInput, scenario: StressTestScenario): StressTestResult {
    const portfolioImpact = this.calculatePortfolioImpact(input, scenario)
    const positionImpacts = this.calculatePositionImpacts(input, scenario)
    const riskMetrics = this.calculateStressedRiskMetrics(input, scenario)
    const resilience = this.assessResilience(input, scenario, portfolioImpact)
    const warnings = this.generateStressWarnings(input, scenario, portfolioImpact)
    const recommendations = this.generateStressRecommendations(input, scenario, portfolioImpact)

    return {
      scenario,
      portfolioImpact,
      positionImpacts,
      riskMetrics,
      resilience,
      warnings,
      recommendations
    }
  }

  /**
   * Create custom stress test scenario
   */
  createCustomScenario(params: {
    name: string
    description: string
    severity: 'mild' | 'moderate' | 'severe' | 'extreme'
    probability: number
    parameters: StressTestParameters
  }): StressTestScenario {
    const expectedImpact = this.calculateExpectedImpact(params.parameters)
    
    return {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: params.name,
      description: params.description,
      type: 'hypothetical',
      severity: params.severity,
      probability: params.probability,
      parameters: params.parameters,
      expectedImpact
    }
  }

  /**
   * Calculate portfolio impact under stress scenario
   */
  private calculatePortfolioImpact(input: StressTestInput, scenario: StressTestScenario): StressTestResult['portfolioImpact'] {
    const { portfolio, marketConditions } = input
    const { parameters } = scenario
    
    let totalImpact = 0
    
    for (const position of portfolio.positions) {
      const positionImpact = this.calculatePositionImpact(position, parameters, marketConditions)
      totalImpact += positionImpact * position.quantity * position.currentPrice
    }
    
    const percentageChange = (totalImpact / portfolio.totalValue) * 100
    const newPortfolioValue = portfolio.totalValue + totalImpact
    
    // Calculate maximum drawdown under stress
    const maxDrawdown = this.calculateStressedMaxDrawdown(input, scenario)
    
    // Estimate recovery time
    const recoveryTime = this.estimateRecoveryTime(input, scenario, percentageChange)
    
    return {
      valueChange: totalImpact,
      percentageChange,
      newPortfolioValue,
      maxDrawdown,
      recoveryTime
    }
  }

  /**
   * Calculate individual position impact
   */
  private calculatePositionImpact(
    position: StressTestInput['portfolio']['positions'][0],
    parameters: StressTestParameters,
    marketConditions: StressTestInput['marketConditions']
  ): number {
    let impact = 0
    
    // Apply market shock based on asset class
    if (parameters.marketShock) {
      const beta = position.beta || 1.0
      impact += parameters.marketShock * beta
    }
    
    // Apply volatility shock
    if (parameters.volatilityShock) {
      const volatilityMultiplier = 1 + (parameters.volatilityShock / 100)
      impact *= volatilityMultiplier
    }
    
    // Apply asset-class specific shocks
    switch (position.assetClass) {
      case 'equity':
        if (parameters.marketShock) impact += parameters.marketShock
        break
      case 'bond':
        if (parameters.interestRateShock && position.duration) {
          impact -= parameters.interestRateShock * position.duration
        }
        break
      case 'commodity':
        if (parameters.commodityShock) impact += parameters.commodityShock
        break
      case 'currency':
        if (parameters.currencyShock) impact += parameters.currencyShock
        break
      case 'crypto':
        if (parameters.marketShock) impact += parameters.marketShock * 1.5 // Higher sensitivity
        break
    }
    
    // Apply sector-specific shocks
    if (parameters.factorShocks && position.sector) {
      const sectorShock = parameters.factorShocks[position.sector] || 0
      impact += sectorShock
    }
    
    // Apply region-specific shocks
    if (parameters.factorShocks && position.region) {
      const regionShock = parameters.factorShocks[position.region] || 0
      impact += regionShock
    }
    
    return impact / 100 // Convert percentage to decimal
  }

  /**
   * Calculate position impacts for all positions
   */
  private calculatePositionImpacts(input: StressTestInput, scenario: StressTestScenario): StressTestResult['positionImpacts'] {
    const { portfolio, marketConditions } = input
    const { parameters } = scenario
    
    return portfolio.positions.map(position => {
      const impactPercent = this.calculatePositionImpact(position, parameters, marketConditions)
      const valueChange = impactPercent * position.quantity * position.currentPrice
      const riskContribution = Math.abs(valueChange) / portfolio.totalValue
      
      return {
        symbol: position.symbol,
        valueChange,
        percentageChange: impactPercent * 100,
        riskContribution
      }
    })
  }

  /**
   * Calculate stressed risk metrics
   */
  private calculateStressedRiskMetrics(input: StressTestInput, scenario: StressTestScenario): StressTestResult['riskMetrics'] {
    const { portfolio, baseline, marketConditions } = input
    const { parameters } = scenario
    
    // Calculate new volatility
    const volatilityShock = parameters.volatilityShock || 0
    const newVolatility = baseline.volatility * (1 + volatilityShock / 100)
    
    // Calculate new beta
    const marketShock = parameters.marketShock || 0
    const newBeta = portfolio.positions.reduce((sum, pos) => {
      const beta = pos.beta || 1.0
      return sum + beta * pos.weight
    }, 0)
    
    // Calculate new Sharpe ratio
    const expectedReturnShock = marketShock * 0.5 // Simplified relationship
    const newExpectedReturn = baseline.expectedReturn + expectedReturnShock / 100
    const newSharpeRatio = newVolatility > 0 ? (newExpectedReturn - this.config.riskFreeRate) / newVolatility : 0
    
    // Calculate new Sortino ratio
    const downsideVolatility = newVolatility * 0.8 // Simplified
    const newSortinoRatio = downsideVolatility > 0 ? (newExpectedReturn - this.config.riskFreeRate) / downsideVolatility : 0
    
    // Calculate VaR under stress
    const var95 = this.calculateStressedVaR(input, scenario, 0.95)
    const var99 = this.calculateStressedVaR(input, scenario, 0.99)
    const expectedShortfall = this.calculateStressedExpectedShortfall(input, scenario, 0.95)
    
    return {
      newVolatility,
      newBeta,
      newSharpeRatio,
      newSortinoRatio,
      var95,
      var99,
      expectedShortfall
    }
  }

  /**
   * Calculate stressed VaR
   */
  private calculateStressedVaR(input: StressTestInput, scenario: StressTestScenario, confidenceLevel: number): number {
    const { portfolio, baseline } = input
    const { parameters } = scenario
    
    // Simplified VaR calculation under stress
    const volatilityMultiplier = 1 + (parameters.volatilityShock || 0) / 100
    const stressedVolatility = baseline.volatility * volatilityMultiplier
    
    const zScore = this.getZScore(confidenceLevel)
    const varValue = zScore * stressedVolatility
    
    return -varValue // VaR is typically reported as negative
  }

  /**
   * Calculate stressed expected shortfall
   */
  private calculateStressedExpectedShortfall(input: StressTestInput, scenario: StressTestScenario, confidenceLevel: number): number {
    const varValue = this.calculateStressedVaR(input, scenario, confidenceLevel)
    
    // Simplified expected shortfall (typically 1.2-1.5x VaR)
    return varValue * 1.3
  }

  /**
   * Calculate stressed maximum drawdown
   */
  private calculateStressedMaxDrawdown(input: StressTestInput, scenario: StressTestScenario): number {
    const { baseline } = input
    const { parameters } = scenario
    
    // Estimate maximum drawdown under stress
    const marketShock = Math.abs(parameters.marketShock || 0)
    const volatilityShock = Math.abs(parameters.volatilityShock || 0)
    
    const stressedDrawdown = baseline.maxDrawdown + (marketShock * 0.5) + (volatilityShock * 0.3)
    
    return Math.min(stressedDrawdown, 0.95) // Cap at 95%
  }

  /**
   * Estimate recovery time
   */
  private estimateRecoveryTime(input: StressTestInput, scenario: StressTestScenario, percentageChange: number): number {
    const { parameters } = scenario
    
    // Base recovery time depends on severity of impact
    let baseRecoveryTime = Math.abs(percentageChange) * 2 // days
    
    // Adjust for scenario parameters
    if (parameters.liquidityShock) {
      baseRecoveryTime *= (1 + parameters.liquidityShock / 100)
    }
    
    if (parameters.duration) {
      baseRecoveryTime = Math.max(baseRecoveryTime, parameters.duration)
    }
    
    return Math.min(baseRecoveryTime, 365) // Cap at 1 year
  }

  /**
   * Assess resilience under stress scenario
   */
  private assessResilience(
    input: StressTestInput,
    scenario: StressTestScenario,
    portfolioImpact: StressTestResult['portfolioImpact']
  ): StressTestResult['resilience'] {
    const { portfolio } = input
    const { percentageChange, maxDrawdown } = portfolioImpact
    
    // Calculate resilience score (0-100)
    let resilienceScore = 100
    
    // Deduct for losses
    resilienceScore -= Math.abs(percentageChange) * 2
    
    // Deduct for drawdown
    resilienceScore -= maxDrawdown * 100
    
    // Deduct for leverage
    resilienceScore -= portfolio.leverage * 10
    
    // Ensure score is within bounds
    resilienceScore = Math.max(0, Math.min(100, resilienceScore))
    
    // Determine resilience rating
    let resilienceRating: StressTestResult['resilience']['resilienceRating'] = 'excellent'
    if (resilienceScore < 20) resilienceRating = 'critical'
    else if (resilienceScore < 40) resilienceRating = 'poor'
    else if (resilienceScore < 60) resilienceRating = 'fair'
    else if (resilienceScore < 80) resilienceRating = 'good'
    
    // Identify critical positions
    const criticalPositions = portfolio.positions
      .filter(pos => pos.weight > 0.1) // Positions > 10%
      .map(pos => pos.symbol)
    
    // Generate mitigation strategies
    const mitigationStrategies = this.generateMitigationStrategies(input, scenario, portfolioImpact)
    
    return {
      resilienceScore,
      resilienceRating,
      criticalPositions,
      mitigationStrategies
    }
  }

  /**
   * Generate mitigation strategies
   */
  private generateMitigationStrategies(
    input: StressTestInput,
    scenario: StressTestScenario,
    portfolioImpact: StressTestResult['portfolioImpact']
  ): string[] {
    const strategies: string[] = []
    
    if (portfolioImpact.percentageChange < -10) {
      strategies.push('Implement defensive hedging strategies')
      strategies.push('Reduce position sizes in high-risk assets')
    }
    
    if (portfolioImpact.maxDrawdown > 0.3) {
      strategies.push('Establish stricter stop-loss limits')
      strategies.push('Increase cash allocation')
    }
    
    if (input.portfolio.leverage > 1.5) {
      strategies.push('Reduce leverage to limit downside risk')
      strategies.push('Consider deleveraging strategies')
    }
    
    if (scenario.severity === 'extreme') {
      strategies.push('Prepare contingency plans for extreme scenarios')
      strategies.push('Maintain higher liquidity reserves')
    }
    
    return strategies
  }

  /**
   * Generate stress warnings
   */
  private generateStressWarnings(
    input: StressTestInput,
    scenario: StressTestScenario,
    portfolioImpact: StressTestResult['portfolioImpact']
  ): string[] {
    const warnings: string[] = []
    
    if (portfolioImpact.percentageChange < -20) {
      warnings.push('Severe portfolio value loss under this scenario')
    }
    
    if (portfolioImpact.maxDrawdown > 0.4) {
      warnings.push('Extreme drawdown risk - portfolio may not recover')
    }
    
    if (portfolioImpact.recoveryTime > 180) {
      warnings.push('Extended recovery period expected')
    }
    
    if (scenario.probability > 0.1 && portfolioImpact.percentageChange < -15) {
      warnings.push('High probability scenario with significant impact')
    }
    
    return warnings
  }

  /**
   * Generate stress recommendations
   */
  private generateStressRecommendations(
    input: StressTestInput,
    scenario: StressTestScenario,
    portfolioImpact: StressTestResult['portfolioImpact']
  ): string[] {
    const recommendations: string[] = []
    
    if (portfolioImpact.percentageChange < -5) {
      recommendations.push('Consider rebalancing portfolio to reduce risk exposure')
    }
    
    if (scenario.type === 'historical' && portfolioImpact.percentageChange < -10) {
      recommendations.push('Learn from historical patterns and adjust strategy accordingly')
    }
    
    if (input.portfolio.leverage > 1) {
      recommendations.push('Review and potentially reduce leverage usage')
    }
    
    if (scenario.severity === 'severe' || scenario.severity === 'extreme') {
      recommendations.push('Establish crisis management protocols')
      recommendations.push('Maintain adequate liquidity buffers')
    }
    
    return recommendations
  }

  /**
   * Calculate stress test summary
   */
  private calculateSummary(results: StressTestResult[]): StressTestReport['summary'] {
    const worstCase = results.reduce((worst, current) => 
      current.portfolioImpact.percentageChange < worst.portfolioImpact.percentageChange ? current : worst
    )
    
    const averageImpact = {
      valueChange: results.reduce((sum, r) => sum + r.portfolioImpact.valueChange, 0) / results.length,
      percentageChange: results.reduce((sum, r) => sum + r.portfolioImpact.percentageChange, 0) / results.length,
      maxDrawdown: results.reduce((sum, r) => sum + r.portfolioImpact.maxDrawdown, 0) / results.length
    }
    
    const resilienceScore = results.reduce((sum, r) => sum + r.resilience.resilienceScore, 0) / results.length
    
    const riskFactors = this.calculateRiskFactors(results)
    
    return {
      worstCase,
      averageImpact,
      resilienceScore,
      riskFactors
    }
  }

  /**
   * Calculate risk factors
   */
  private calculateRiskFactors(results: StressTestResult[]): StressTestReport['summary']['riskFactors'] {
    const factors = ['market', 'volatility', 'liquidity', 'interest_rate', 'credit']
    
    return factors.map(factor => {
      const impact = results.reduce((sum, r) => {
        const shock = r.scenario.parameters[`${factor}Shock` as keyof StressTestParameters] || 0
        return sum + Math.abs(shock)
      }, 0) / results.length
      
      const probability = results.reduce((sum, r) => sum + r.scenario.probability, 0) / results.length
      const riskScore = impact * probability
      
      return {
        factor,
        impact,
        probability,
        riskScore
      }
    })
  }

  /**
   * Assess overall portfolio resilience
   */
  private assessPortfolioResilience(results: StressTestResult[]): StressTestReport['portfolioResilience'] {
    const avgResilienceScore = results.reduce((sum, r) => sum + r.resilience.resilienceScore, 0) / results.length
    
    let overallRating: StressTestReport['portfolioResilience']['overallRating'] = 'excellent'
    if (avgResilienceScore < 20) overallRating = 'critical'
    else if (avgResilienceScore < 40) overallRating = 'poor'
    else if (avgResilienceScore < 60) overallRating = 'fair'
    else if (avgResilienceScore < 80) overallRating = 'good'
    
    const strengths: string[] = []
    const weaknesses: string[] = []
    
    if (avgResilienceScore > 70) {
      strengths.push('Strong portfolio resilience across most scenarios')
    }
    
    if (results.some(r => r.portfolioImpact.percentageChange < -20)) {
      weaknesses.push('Vulnerable to extreme market scenarios')
    }
    
    if (results.some(r => r.portfolioImpact.maxDrawdown > 0.3)) {
      weaknesses.push('High drawdown risk under stress')
    }
    
    const recommendations = this.generateOverallRecommendations(results)
    
    return {
      overallRating,
      strengths,
      weaknesses,
      recommendations
    }
  }

  /**
   * Generate overall recommendations
   */
  private generateOverallRecommendations(results: StressTestResult[]): string[] {
    const recommendations: string[] = []
    
    const avgImpact = results.reduce((sum, r) => sum + r.portfolioImpact.percentageChange, 0) / results.length
    const maxDrawdown = Math.max(...results.map(r => r.portfolioImpact.maxDrawdown))
    
    if (avgImpact < -10) {
      recommendations.push('Implement comprehensive risk management strategy')
    }
    
    if (maxDrawdown > 0.25) {
      recommendations.push('Establish strict drawdown control mechanisms')
    }
    
    if (results.some(r => r.resilience.resilienceRating === 'critical')) {
      recommendations.push('Immediate portfolio restructuring required')
    }
    
    recommendations.push('Regular stress testing recommended (quarterly)')
    recommendations.push('Maintain diversified asset allocation')
    
    return recommendations
  }

  /**
   * Calculate expected impact from parameters
   */
  private calculateExpectedImpact(parameters: StressTestParameters): StressTestScenario['expectedImpact'] {
    return {
      marketImpact: Math.abs(parameters.marketShock || 0),
      volatilityImpact: Math.abs(parameters.volatilityShock || 0),
      correlationImpact: Math.abs(parameters.correlationShock || 0),
      liquidityImpact: Math.abs(parameters.liquidityShock || 0)
    }
  }

  /**
   * Get Z-score for confidence level
   */
  private getZScore(confidenceLevel: number): number {
    const zScores = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576
    }
    
    return zScores[confidenceLevel as keyof typeof zScores] || 1.96
  }

  /**
   * Get default stress test scenarios
   */
  private getDefaultScenarios(): StressTestScenario[] {
    return [
      {
        id: '2008_financial_crisis',
        name: '2008 Financial Crisis',
        description: 'Global financial market crash similar to 2008',
        type: 'historical',
        severity: 'extreme',
        probability: 0.01,
        parameters: {
          marketShock: -40,
          volatilityShock: 150,
          correlationShock: 50,
          liquidityShock: -30,
          interestRateShock: -2,
          creditSpreadShock: 300,
          duration: 180
        },
        expectedImpact: {
          marketImpact: 40,
          volatilityImpact: 150,
          correlationImpact: 50,
          liquidityImpact: 30
        }
      },
      {
        id: 'crypto_winter',
        name: 'Crypto Winter',
        description: 'Extended bear market in cryptocurrency',
        type: 'historical',
        severity: 'severe',
        probability: 0.05,
        parameters: {
          marketShock: -70,
          volatilityShock: 200,
          correlationShock: 30,
          liquidityShock: -50,
          duration: 365
        },
        expectedImpact: {
          marketImpact: 70,
          volatilityImpact: 200,
          correlationImpact: 30,
          liquidityImpact: 50
        }
      },
      {
        id: 'interest_rate_hike',
        name: 'Interest Rate Hike',
        description: 'Aggressive central bank interest rate increases',
        type: 'hypothetical',
        severity: 'moderate',
        probability: 0.15,
        parameters: {
          interestRateShock: 3,
          marketShock: -15,
          volatilityShock: 50,
          duration: 90
        },
        expectedImpact: {
          marketImpact: 15,
          volatilityImpact: 50,
          correlationImpact: 20,
          liquidityImpact: 10
        }
      },
      {
        id: 'liquidity_crisis',
        name: 'Liquidity Crisis',
        description: 'Market liquidity freeze and funding stress',
        type: 'hypothetical',
        severity: 'severe',
        probability: 0.03,
        parameters: {
          liquidityShock: -60,
          marketShock: -25,
          volatilityShock: 100,
          correlationShock: 40,
          duration: 60
        },
        expectedImpact: {
          marketImpact: 25,
          volatilityImpact: 100,
          correlationImpact: 40,
          liquidityImpact: 60
        }
      }
    ]
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

// Factory function to create stress testing engine
export function createStressTestingEngine(config?: {
  scenarios?: StressTestScenario[]
  confidenceLevel?: number
  timeHorizon?: number
  riskFreeRate?: number
  simulationRuns?: number
}): StressTestingEngine {
  return new StressTestingEngine(config)
}