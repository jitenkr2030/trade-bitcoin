/**
 * Advanced Risk Parity Allocation Strategy
 * 
 * This module provides sophisticated risk parity portfolio construction including:
 * - Equal risk contribution allocation
 * - Hierarchical risk parity
 * - Risk budgeting optimization
 * - Dynamic risk parity
 * - Factor-based risk parity
 * - Risk parity with constraints
 */

export interface RiskParityConfig {
  approach: 'equal_risk' | 'hierarchical' | 'factor_based' | 'dynamic' | 'constrained'
  riskTarget: number
  rebalancingFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  lookbackPeriod: number // in days
  minWeight: number
  maxWeight: number
  riskFreeRate: number
  transactionCost: number
  useLeverage: boolean
  maxLeverage: number
  correlationMethod: 'pearson' | 'spearman' | 'kendall'
  volatilityMethod: 'historical' | 'ewma' | 'garch'
}

export interface AssetData {
  symbol: string
  currentPrice: number
  returns: number[]
  volatility: number
  expectedReturn?: number
  beta?: number
  assetClass: 'equity' | 'bond' | 'commodity' | 'currency' | 'crypto' | 'alternative'
  sector?: string
  region?: string
  liquidityScore?: number
  factorExposures?: Record<string, number>
  constraints?: {
    minWeight?: number
    maxWeight?: number
    maxConcentration?: number
  }
}

export interface RiskParityInput {
  assets: AssetData[]
  portfolioValue: number
  currentWeights: number[]
  riskBudget?: Record<string, number>
  marketConditions?: {
    regime: 'normal' | 'high_volatility' | 'low_volatility' | 'crisis'
    trend: 'bullish' | 'bearish' | 'sideways'
    correlationLevel: 'low' | 'medium' | 'high'
  }
  objectives?: {
    targetReturn?: number
    targetVolatility?: number
    maxDrawdown?: number
    sharpeRatio?: number
  }
}

export interface RiskParityResult {
  optimalWeights: number[]
  riskContributions: number[]
  riskBudget: Record<string, number>
  portfolioMetrics: {
    expectedReturn: number
    volatility: number
    sharpeRatio: number
    sortinoRatio: number
    maxDrawdown: number
    diversificationRatio: number
    concentrationRisk: number
  }
  riskDecomposition: {
    totalRisk: number
    marketRisk: number
    specificRisk: number
    factorRisk: Record<string, number>
  }
  allocationAnalysis: {
    riskEfficiency: number
    budgetAdherence: number
    turnover: number
    transactionCosts: number
    leverage: number
  }
  recommendations: string[]
  warnings: string[]
}

export interface RiskParityBacktest {
  period: {
    startDate: string
    endDate: string
  }
  performance: {
    cumulativeReturn: number
    annualizedReturn: number
    volatility: number
    sharpeRatio: number
    maxDrawdown: number
    calmarRatio: number
    informationRatio: number
  }
  riskParityVsBenchmark: {
    outperformance: number
    hitRate: number
    avgOutperformance: number
    maxOutperformance: number
    maxUnderperformance: number
  }
  rebalancing: {
    rebalanceCount: number
    avgTurnover: number
    totalTransactionCosts: number
  }
  riskMetrics: {
    avgRiskConcentration: number
    riskBudgetVolatility: number
    diversificationBenefit: number
  }
}

export class RiskParityEngine {
  private config: RiskParityConfig
  private correlationMatrix: number[][]
  private covarianceMatrix: number[][]

  constructor(config: RiskParityConfig) {
    this.config = config
  }

  /**
   * Calculate optimal risk parity allocation
   */
  calculateRiskParity(input: RiskParityInput): RiskParityResult {
    // Pre-calculate correlation and covariance matrices
    this.calculateMatrices(input.assets)
    
    // Calculate optimal weights based on approach
    let optimalWeights: number[]
    
    switch (this.config.approach) {
      case 'equal_risk':
        optimalWeights = this.calculateEqualRiskContribution(input)
        break
      case 'hierarchical':
        optimalWeights = this.calculateHierarchicalRiskParity(input)
        break
      case 'factor_based':
        optimalWeights = this.calculateFactorBasedRiskParity(input)
        break
      case 'dynamic':
        optimalWeights = this.calculateDynamicRiskParity(input)
        break
      case 'constrained':
        optimalWeights = this.calculateConstrainedRiskParity(input)
        break
      default:
        optimalWeights = this.calculateEqualRiskContribution(input)
    }
    
    // Apply constraints
    optimalWeights = this.applyConstraints(optimalWeights, input.assets)
    
    // Calculate risk contributions
    const riskContributions = this.calculateRiskContributions(optimalWeights, input.assets)
    
    // Calculate risk budget
    const riskBudget = this.calculateRiskBudget(riskContributions)
    
    // Calculate portfolio metrics
    const portfolioMetrics = this.calculatePortfolioMetrics(optimalWeights, input.assets)
    
    // Calculate risk decomposition
    const riskDecomposition = this.calculateRiskDecomposition(optimalWeights, input.assets)
    
    // Calculate allocation analysis
    const allocationAnalysis = this.calculateAllocationAnalysis(optimalWeights, input.currentWeights, input.assets)
    
    // Generate recommendations and warnings
    const recommendations = this.generateRecommendations(optimalWeights, input)
    const warnings = this.generateWarnings(optimalWeights, input)
    
    return {
      optimalWeights,
      riskContributions,
      riskBudget,
      portfolioMetrics,
      riskDecomposition,
      allocationAnalysis,
      recommendations,
      warnings
    }
  }

  /**
   * Backtest risk parity strategy
   */
  backtestStrategy(
    input: RiskParityInput,
    historicalData: Array<{
      date: string
      prices: Record<string, number>
      returns: Record<string, number>
    }>
  ): RiskParityBacktest {
    const startDate = historicalData[0].date
    const endDate = historicalData[historicalData.length - 1].date
    
    // Simulate portfolio performance
    const portfolioValues: number[] = []
    const weightsHistory: number[][] = []
    const returns: number[] = []
    
    let currentWeights = input.currentWeights
    let portfolioValue = input.portfolioValue
    
    for (let i = 0; i < historicalData.length; i++) {
      const dayData = historicalData[i]
      
      // Check if rebalancing is needed
      if (this.shouldRebalance(i, historicalData)) {
        // Update asset data with latest returns
        const updatedAssets = input.assets.map((asset, idx) => ({
          ...asset,
          returns: historicalData.slice(Math.max(0, i - this.config.lookbackPeriod), i + 1)
            .map(d => d.returns[asset.symbol] || 0)
        }))
        
        // Recalculate optimal weights
        const updatedInput: RiskParityInput = {
          ...input,
          assets: updatedAssets,
          currentWeights
        }
        
        const result = this.calculateRiskParity(updatedInput)
        currentWeights = result.optimalWeights
        weightsHistory.push([...currentWeights])
      }
      
      // Calculate portfolio return
      let portfolioReturn = 0
      for (let j = 0; j < input.assets.length; j++) {
        const assetReturn = dayData.returns[input.assets[j].symbol] || 0
        portfolioReturn += currentWeights[j] * assetReturn
      }
      
      returns.push(portfolioReturn)
      portfolioValue *= (1 + portfolioReturn)
      portfolioValues.push(portfolioValue)
    }
    
    // Calculate performance metrics
    const performance = this.calculateBacktestPerformance(returns, portfolioValues)
    
    // Calculate risk parity vs benchmark (simplified)
    const benchmarkReturns = returns.map(() => 0.0001) // Assume 0.01% daily benchmark return
    const riskParityVsBenchmark = this.calculateBenchmarkComparison(returns, benchmarkReturns)
    
    // Calculate rebalancing metrics
    const rebalancing = this.calculateRebalancingMetrics(weightsHistory, input.assets.length)
    
    // Calculate risk metrics
    const riskMetrics = this.calculateBacktestRiskMetrics(weightsHistory, input.assets.length)
    
    return {
      period: { startDate, endDate },
      performance,
      riskParityVsBenchmark,
      rebalancing,
      riskMetrics
    }
  }

  /**
   * Calculate equal risk contribution allocation
   */
  private calculateEqualRiskContribution(input: RiskParityInput): number[] {
    const n = input.assets.length
    const targetRiskContribution = 1 / n
    
    // Use iterative optimization to find equal risk contribution weights
    let weights = this.initializeWeights(input.assets, input.currentWeights)
    
    for (let iteration = 0; iteration < 100; iteration++) {
      const riskContributions = this.calculateRiskContributions(weights, input.assets)
      
      // Calculate adjustment factor
      const adjustments: number[] = []
      for (let i = 0; i < n; i++) {
        const adjustment = targetRiskContribution / riskContributions[i]
        adjustments.push(adjustment)
      }
      
      // Apply adjustments
      const newWeights = weights.map((w, i) => w * adjustments[i])
      
      // Normalize weights
      const sum = newWeights.reduce((a, b) => a + b, 0)
      weights = newWeights.map(w => w / sum)
      
      // Check convergence
      const maxDiff = Math.max(...riskContributions.map((rc, i) => Math.abs(rc - targetRiskContribution)))
      if (maxDiff < 0.001) break
    }
    
    return weights
  }

  /**
   * Calculate hierarchical risk parity allocation
   */
  private calculateHierarchicalRiskParity(input: RiskParityInput): number[] {
    // Group assets by hierarchy (sector, region, asset class)
    const groups = this.groupAssetsByHierarchy(input.assets)
    
    // Calculate weights for each group
    const groupWeights: number[] = []
    const assetWeights: number[][] = []
    
    for (const group of groups) {
      const groupInput: RiskParityInput = {
        ...input,
        assets: group.assets
      }
      
      const groupResult = this.calculateEqualRiskContribution(groupInput)
      assetWeights.push(groupResult)
      
      // Calculate group weight based on group risk
      const groupRisk = this.calculateGroupRisk(group.assets, groupResult)
      groupWeights.push(groupRisk)
    }
    
    // Normalize group weights
    const totalGroupRisk = groupWeights.reduce((a, b) => a + b, 0)
    const normalizedGroupWeights = groupWeights.map(w => w / totalGroupRisk)
    
    // Combine group and asset weights
    const finalWeights: number[] = []
    for (let i = 0; i < groups.length; i++) {
      for (let j = 0; j < assetWeights[i].length; j++) {
        finalWeights.push(normalizedGroupWeights[i] * assetWeights[i][j])
      }
    }
    
    return finalWeights
  }

  /**
   * Calculate factor-based risk parity allocation
   */
  private calculateFactorBasedRiskParity(input: RiskParityInput): number[] {
    const n = input.assets.length
    
    // Extract factor exposures
    const factorExposures = input.assets.map(asset => asset.factorExposures || {})
    const factors = [...new Set(factorExposures.flatMap(fe => Object.keys(fe)))]
    
    // Calculate factor covariance matrix (simplified)
    const factorCovariance = this.calculateFactorCovariance(input.assets, factors)
    
    // Calculate factor risk contributions
    const factorRiskContributions = this.calculateFactorRiskContributions(factorExposures, factorCovariance)
    
    // Target equal factor risk contribution
    const targetFactorRisk = 1 / factors.length
    
    // Optimize weights to achieve equal factor risk contribution
    let weights = this.initializeWeights(input.assets, input.currentWeights)
    
    for (let iteration = 0; iteration < 100; iteration++) {
      const currentFactorRisks = this.calculateCurrentFactorRisks(weights, factorExposures, factorCovariance)
      
      // Calculate adjustments
      const adjustments: number[] = []
      for (let i = 0; i < factors.length; i++) {
        const adjustment = targetFactorRisk / currentFactorRisks[i]
        adjustments.push(adjustment)
      }
      
      // Apply adjustments to weights (simplified)
      const newWeights = weights.map((w, i) => {
        let adjustment = 1
        for (let j = 0; j < factors.length; j++) {
          const exposure = factorExposures[i][factors[j]] || 0
          adjustment *= Math.pow(adjustments[j], exposure)
        }
        return w * adjustment
      })
      
      // Normalize weights
      const sum = newWeights.reduce((a, b) => a + b, 0)
      weights = newWeights.map(w => w / sum)
      
      // Check convergence
      const maxDiff = Math.max(...currentFactorRisks.map((fr, i) => Math.abs(fr - targetFactorRisk)))
      if (maxDiff < 0.001) break
    }
    
    return weights
  }

  /**
   * Calculate dynamic risk parity allocation
   */
  private calculateDynamicRiskParity(input: RiskParityInput): number[] {
    const { marketConditions } = input
    
    // Adjust risk parameters based on market conditions
    let riskMultiplier = 1.0
    let volatilityAdjustment = 1.0
    
    if (marketConditions) {
      switch (marketConditions.regime) {
        case 'high_volatility':
          riskMultiplier = 0.8
          volatilityAdjustment = 1.2
          break
        case 'low_volatility':
          riskMultiplier = 1.2
          volatilityAdjustment = 0.8
          break
        case 'crisis':
          riskMultiplier = 0.5
          volatilityAdjustment = 1.5
          break
      }
      
      switch (marketConditions.correlationLevel) {
        case 'high':
          riskMultiplier *= 0.9
          break
        case 'low':
          riskMultiplier *= 1.1
          break
      }
    }
    
    // Calculate base equal risk contribution weights
    const baseWeights = this.calculateEqualRiskContribution(input)
    
    // Apply dynamic adjustments
    const adjustedWeights = baseWeights.map((w, i) => {
      const asset = input.assets[i]
      let adjustment = riskMultiplier
      
      // Adjust based on asset volatility
      if (asset.volatility > 0.3) adjustment *= 0.8
      if (asset.volatility < 0.1) adjustment *= 1.2
      
      // Adjust based on asset class
      switch (asset.assetClass) {
        case 'bond':
          adjustment *= marketConditions?.regime === 'crisis' ? 1.3 : 1.0
          break
        case 'equity':
          adjustment *= marketConditions?.regime === 'crisis' ? 0.7 : 1.0
          break
        case 'crypto':
          adjustment *= marketConditions?.regime === 'high_volatility' ? 0.6 : 1.0
          break
      }
      
      return w * adjustment
    })
    
    // Normalize weights
    const sum = adjustedWeights.reduce((a, b) => a + b, 0)
    return adjustedWeights.map(w => w / sum)
  }

  /**
   * Calculate constrained risk parity allocation
   */
  private calculateConstrainedRiskParity(input: RiskParityInput): number[] {
    const n = input.assets.length
    
    // Start with equal risk contribution
    let weights = this.calculateEqualRiskContribution(input)
    
    // Apply constraints iteratively
    for (let iteration = 0; iteration < 50; iteration++) {
      let adjusted = false
      
      // Apply min/max weight constraints
      for (let i = 0; i < n; i++) {
        const asset = input.assets[i]
        const minWeight = asset.constraints?.minWeight || this.config.minWeight
        const maxWeight = asset.constraints?.maxWeight || this.config.maxWeight
        
        if (weights[i] < minWeight) {
          weights[i] = minWeight
          adjusted = true
        } else if (weights[i] > maxWeight) {
          weights[i] = maxWeight
          adjusted = true
        }
      }
      
      // Apply concentration constraints
      const maxConcentration = input.assets.reduce((max, asset) => 
        Math.max(max, asset.constraints?.maxConcentration || 0.3), 0.3
      )
      
      if (Math.max(...weights) > maxConcentration) {
        const maxWeight = Math.max(...weights)
        const adjustmentFactor = maxConcentration / maxWeight
        
        weights = weights.map(w => w * adjustmentFactor)
        adjusted = true
      }
      
      // Normalize if adjustments were made
      if (adjusted) {
        const sum = weights.reduce((a, b) => a + b, 0)
        weights = weights.map(w => w / sum)
      } else {
        break
      }
    }
    
    return weights
  }

  /**
   * Calculate correlation and covariance matrices
   */
  private calculateMatrices(assets: AssetData[]): void {
    const n = assets.length
    
    // Calculate correlation matrix
    this.correlationMatrix = Array(n).fill(0).map(() => Array(n).fill(0))
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          this.correlationMatrix[i][j] = 1.0
        } else {
          const correlation = this.calculateCorrelation(assets[i].returns, assets[j].returns)
          this.correlationMatrix[i][j] = correlation
        }
      }
    }
    
    // Calculate covariance matrix
    this.covarianceMatrix = Array(n).fill(0).map(() => Array(n).fill(0))
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.covarianceMatrix[i][j] = this.correlationMatrix[i][j] * 
                                      assets[i].volatility * assets[j].volatility
      }
    }
  }

  /**
   * Calculate correlation between two return series
   */
  private calculateCorrelation(returns1: number[], returns2: number[]): number {
    const minLength = Math.min(returns1.length, returns2.length)
    const r1 = returns1.slice(-minLength)
    const r2 = returns2.slice(-minLength)
    
    const mean1 = r1.reduce((sum, r) => sum + r, 0) / r1.length
    const mean2 = r2.reduce((sum, r) => sum + r, 0) / r2.length
    
    let numerator = 0
    let sum1 = 0
    let sum2 = 0
    
    for (let i = 0; i < r1.length; i++) {
      const diff1 = r1[i] - mean1
      const diff2 = r2[i] - mean2
      
      numerator += diff1 * diff2
      sum1 += diff1 * diff1
      sum2 += diff2 * diff2
    }
    
    const denominator = Math.sqrt(sum1 * sum2)
    return denominator > 0 ? numerator / denominator : 0
  }

  /**
   * Calculate risk contributions
   */
  private calculateRiskContributions(weights: number[], assets: AssetData[]): number[] {
    const n = assets.length
    const portfolioVariance = this.calculatePortfolioVariance(weights)
    
    const riskContributions: number[] = []
    
    for (let i = 0; i < n; i++) {
      let marginalRiskContribution = 0
      
      for (let j = 0; j < n; j++) {
        marginalRiskContribution += weights[j] * this.covarianceMatrix[i][j]
      }
      
      const riskContribution = weights[i] * marginalRiskContribution / Math.sqrt(portfolioVariance)
      riskContributions.push(riskContribution)
    }
    
    // Normalize risk contributions
    const totalRisk = Math.sqrt(portfolioVariance)
    return riskContributions.map(rc => rc / totalRisk)
  }

  /**
   * Calculate portfolio variance
   */
  private calculatePortfolioVariance(weights: number[]): number {
    let variance = 0
    
    for (let i = 0; i < weights.length; i++) {
      for (let j = 0; j < weights.length; j++) {
        variance += weights[i] * weights[j] * this.covarianceMatrix[i][j]
      }
    }
    
    return variance
  }

  /**
   * Calculate risk budget
   */
  private calculateRiskBudget(riskContributions: number[]): Record<string, number> {
    const totalRisk = riskContributions.reduce((sum, rc) => sum + rc, 0)
    const riskBudget: Record<string, number> = {}
    
    riskContributions.forEach((rc, index) => {
      riskBudget[`asset_${index}`] = rc / totalRisk
    })
    
    return riskBudget
  }

  /**
   * Calculate portfolio metrics
   */
  private calculatePortfolioMetrics(weights: number[], assets: AssetData[]): RiskParityResult['portfolioMetrics'] {
    const expectedReturn = weights.reduce((sum, w, i) => sum + w * (assets[i].expectedReturn || 0), 0)
    const volatility = Math.sqrt(this.calculatePortfolioVariance(weights))
    const sharpeRatio = volatility > 0 ? (expectedReturn - this.config.riskFreeRate) / volatility : 0
    
    // Calculate Sortino ratio (simplified)
    const downsideVolatility = volatility * 0.8
    const sortinoRatio = downsideVolatility > 0 ? (expectedReturn - this.config.riskFreeRate) / downsideVolatility : 0
    
    // Estimate maximum drawdown
    const maxDrawdown = volatility * 2.5 // Simplified estimate
    
    // Calculate diversification ratio
    const weightedVolatility = weights.reduce((sum, w, i) => sum + w * assets[i].volatility, 0)
    const diversificationRatio = weightedVolatility / volatility
    
    // Calculate concentration risk
    const concentrationRisk = Math.max(...weights) * 100
    
    return {
      expectedReturn,
      volatility,
      sharpeRatio,
      sortinoRatio,
      maxDrawdown,
      diversificationRatio,
      concentrationRisk
    }
  }

  /**
   * Calculate risk decomposition
   */
  private calculateRiskDecomposition(weights: number[], assets: AssetData[]): RiskParityResult['riskDecomposition'] {
    const totalRisk = Math.sqrt(this.calculatePortfolioVariance(weights))
    
    // Calculate market risk (simplified)
    const marketRisk = weights.reduce((sum, w, i) => {
      const beta = assets[i].beta || 1.0
      return sum + w * beta
    }, 0) * 0.6 // Assume 60% market risk
    
    // Calculate specific risk
    const specificRisk = totalRisk - marketRisk
    
    // Calculate factor risk (simplified)
    const factorRisk: Record<string, number> = {}
    const factors = ['equity', 'bond', 'commodity', 'currency']
    
    factors.forEach(factor => {
      const factorExposure = weights.reduce((sum, w, i) => {
        return sum + w * (assets[i].factorExposures?.[factor] || 0)
      }, 0)
      factorRisk[factor] = factorExposure * 0.1 // Simplified
    })
    
    return {
      totalRisk,
      marketRisk,
      specificRisk,
      factorRisk
    }
  }

  /**
   * Calculate allocation analysis
   */
  private calculateAllocationAnalysis(
    optimalWeights: number[],
    currentWeights: number[],
    assets: AssetData[]
  ): RiskParityResult['allocationAnalysis'] {
    // Calculate risk efficiency
    const riskContributions = this.calculateRiskContributions(optimalWeights, assets)
    const targetRisk = 1 / assets.length
    const riskEfficiency = 1 - Math.sqrt(
      riskContributions.reduce((sum, rc) => sum + Math.pow(rc - targetRisk, 2), 0) / assets.length
    )
    
    // Calculate budget adherence
    const budgetAdherence = riskEfficiency * 0.8 + 0.2 // Simplified
    
    // Calculate turnover
    const turnover = optimalWeights.reduce((sum, w, i) => sum + Math.abs(w - currentWeights[i]), 0) / 2
    
    // Calculate transaction costs
    const transactionCosts = turnover * this.config.transactionCost
    
    // Calculate leverage
    const leverage = this.config.useLeverage ? Math.min(optimalWeights.reduce((sum, w) => sum + w, 0), this.config.maxLeverage) : 1
    
    return {
      riskEfficiency,
      budgetAdherence,
      turnover,
      transactionCosts,
      leverage
    }
  }

  /**
   * Initialize weights
   */
  private initializeWeights(assets: AssetData[], currentWeights: number[]): number[] {
    if (currentWeights.length === assets.length) {
      return [...currentWeights]
    }
    
    // Equal weight initialization
    const equalWeight = 1 / assets.length
    return Array(assets.length).fill(equalWeight)
  }

  /**
   * Apply constraints to weights
   */
  private applyConstraints(weights: number[], assets: AssetData[]): number[] {
    const constrainedWeights = [...weights]
    
    // Apply min/max constraints
    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i]
      const minWeight = asset.constraints?.minWeight || this.config.minWeight
      const maxWeight = asset.constraints?.maxWeight || this.config.maxWeight
      
      constrainedWeights[i] = Math.max(minWeight, Math.min(maxWeight, constrainedWeights[i]))
    }
    
    // Normalize weights
    const sum = constrainedWeights.reduce((a, b) => a + b, 0)
    return constrainedWeights.map(w => w / sum)
  }

  /**
   * Group assets by hierarchy
   */
  private groupAssetsByHierarchy(assets: AssetData[]): Array<{ name: string; assets: AssetData[] }> {
    const groups = new Map<string, AssetData[]>()
    
    // Group by asset class and sector
    assets.forEach(asset => {
      const key = `${asset.assetClass}_${asset.sector || 'default'}`
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(asset)
    })
    
    return Array.from(groups.entries()).map(([name, assets]) => ({ name, assets }))
  }

  /**
   * Calculate group risk
   */
  private calculateGroupRisk(assets: AssetData[], weights: number[]): number {
    let groupRisk = 0
    
    for (let i = 0; i < assets.length; i++) {
      groupRisk += weights[i] * assets[i].volatility
    }
    
    return groupRisk
  }

  /**
   * Calculate factor covariance matrix
   */
  private calculateFactorCovariance(assets: AssetData[], factors: string[]): number[][] {
    const n = factors.length
    const factorCovariance = Array(n).fill(0).map(() => Array(n).fill(0))
    
    // Simplified factor covariance calculation
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          factorCovariance[i][j] = 0.04 // 20% annual factor volatility
        } else {
          factorCovariance[i][j] = 0.01 // Low correlation between factors
        }
      }
    }
    
    return factorCovariance
  }

  /**
   * Calculate factor risk contributions
   */
  private calculateFactorRiskContributions(
    factorExposures: Record<string, number>[],
    factorCovariance: number[][]
  ): number[] {
    const n = factorCovariance.length
    const factorRiskContributions: number[] = []
    
    for (let i = 0; i < n; i++) {
      let riskContribution = 0
      
      for (let j = 0; j < n; j++) {
        riskContribution += factorCovariance[i][j]
      }
      
      factorRiskContributions.push(riskContribution)
    }
    
    return factorRiskContributions
  }

  /**
   * Calculate current factor risks
   */
  private calculateCurrentFactorRisks(
    weights: number[],
    factorExposures: Record<string, number>[],
    factorCovariance: number[][]
  ): number[] {
    const n = factorCovariance.length
    const currentFactorRisks: number[] = []
    
    for (let i = 0; i < n; i++) {
      let factorRisk = 0
      
      for (let j = 0; j < weights.length; j++) {
        const exposure = factorExposures[j][Object.keys(factorExposures[j])[i]] || 0
        factorRisk += weights[j] * exposure
      }
      
      currentFactorRisks.push(factorRisk)
    }
    
    return currentFactorRisks
  }

  /**
   * Check if rebalancing is needed
   */
  private shouldRebalance(currentIndex: number, historicalData: any[]): boolean {
    const frequency = this.config.rebalancingFrequency
    
    switch (frequency) {
      case 'daily':
        return true
      case 'weekly':
        return currentIndex % 5 === 0
      case 'monthly':
        return currentIndex % 21 === 0
      case 'quarterly':
        return currentIndex % 63 === 0
      default:
        return false
    }
  }

  /**
   * Calculate backtest performance
   */
  private calculateBacktestPerformance(returns: number[], portfolioValues: number[]): RiskParityBacktest['performance'] {
    const totalReturn = (portfolioValues[portfolioValues.length - 1] / portfolioValues[0]) - 1
    const annualizedReturn = Math.pow(1 + totalReturn, 252 / returns.length) - 1
    
    const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
    const volatility = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length) * Math.sqrt(252)
    
    const sharpeRatio = volatility > 0 ? (annualizedReturn - this.config.riskFreeRate) / volatility : 0
    
    // Calculate max drawdown
    let peak = portfolioValues[0]
    let maxDrawdown = 0
    for (const value of portfolioValues) {
      if (value > peak) peak = value
      const drawdown = (peak - value) / peak
      if (drawdown > maxDrawdown) maxDrawdown = drawdown
    }
    
    const calmarRatio = maxDrawdown > 0 ? annualizedReturn / maxDrawdown : 0
    
    return {
      cumulativeReturn: totalReturn,
      annualizedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown,
      calmarRatio,
      informationRatio: 0 // Simplified
    }
  }

  /**
   * Calculate benchmark comparison
   */
  private calculateBenchmarkComparison(returns: number[], benchmarkReturns: number[]): RiskParityBacktest['riskParityVsBenchmark'] {
    const excessReturns = returns.map((r, i) => r - benchmarkReturns[i])
    const outperformance = excessReturns.reduce((sum, r) => sum + r, 0)
    
    const hitRate = excessReturns.filter(r => r > 0).length / excessReturns.length
    const avgOutperformance = excessReturns.filter(r => r > 0).reduce((sum, r) => sum + r, 0) / excessReturns.filter(r => r > 0).length
    const maxOutperformance = Math.max(...excessReturns)
    const maxUnderperformance = Math.min(...excessReturns)
    
    return {
      outperformance,
      hitRate,
      avgOutperformance,
      maxOutperformance,
      maxUnderperformance
    }
  }

  /**
   * Calculate rebalancing metrics
   */
  private calculateRebalancingMetrics(weightsHistory: number[][], numAssets: number): RiskParityBacktest['rebalancing'] {
    const rebalanceCount = weightsHistory.length
    
    let totalTurnover = 0
    for (let i = 1; i < weightsHistory.length; i++) {
      const turnover = weightsHistory[i].reduce((sum, w, j) => sum + Math.abs(w - weightsHistory[i - 1][j]), 0) / 2
      totalTurnover += turnover
    }
    
    const avgTurnover = rebalanceCount > 0 ? totalTurnover / rebalanceCount : 0
    const totalTransactionCosts = totalTurnover * this.config.transactionCost
    
    return {
      rebalanceCount,
      avgTurnover,
      totalTransactionCosts
    }
  }

  /**
   * Calculate backtest risk metrics
   */
  private calculateBacktestRiskMetrics(weightsHistory: number[][], numAssets: number): RiskParityBacktest['riskMetrics'] {
    // Calculate average risk concentration
    const avgRiskConcentration = weightsHistory.reduce((sum, weights) => {
      const maxWeight = Math.max(...weights)
      return sum + maxWeight
    }, 0) / weightsHistory.length
    
    // Calculate risk budget volatility (simplified)
    const riskBudgetVolatility = 0.05 // Simplified
    
    // Calculate diversification benefit
    const diversificationBenefit = 1 - avgRiskConcentration
    
    return {
      avgRiskConcentration,
      riskBudgetVolatility,
      diversificationBenefit
    }
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(weights: number[], input: RiskParityInput): string[] {
    const recommendations: string[] = []
    
    // Check for concentration
    const maxWeight = Math.max(...weights)
    if (maxWeight > 0.3) {
      recommendations.push('Consider diversifying away from concentrated positions')
    }
    
    // Check for small positions
    const smallPositions = weights.filter(w => w < 0.02).length
    if (smallPositions > 2) {
      recommendations.push('Consider eliminating very small positions to reduce complexity')
    }
    
    // Market condition recommendations
    if (input.marketConditions?.regime === 'high_volatility') {
      recommendations.push('Consider reducing overall portfolio risk in high volatility environment')
    }
    
    // Rebalancing recommendations
    if (this.config.rebalancingFrequency === 'daily') {
      recommendations.push('Consider reducing rebalancing frequency to lower transaction costs')
    }
    
    // Leverage recommendations
    if (this.config.useLeverage) {
      recommendations.push('Monitor leverage levels closely and maintain adequate liquidity')
    }
    
    return recommendations
  }

  /**
   * Generate warnings
   */
  private generateWarnings(weights: number[], input: RiskParityInput): string[] {
    const warnings: string[] = []
    
    // Check for extreme weights
    const extremeWeights = weights.filter(w => w > 0.4 || w < 0.01).length
    if (extremeWeights > 0) {
      warnings.push('Extreme weights detected - may increase portfolio risk')
    }
    
    // Check for correlation risk
    const avgCorrelation = this.calculateAverageCorrelation()
    if (avgCorrelation > 0.7) {
      warnings.push('High average correlation detected - diversification benefits may be limited')
    }
    
    // Check for liquidity issues
    const lowLiquidityAssets = input.assets.filter(asset => (asset.liquidityScore || 1) < 0.5).length
    if (lowLiquidityAssets > 0) {
      warnings.push('Low liquidity assets detected - may impact rebalancing ability')
    }
    
    // Check for constraint violations
    const constraintViolations = weights.filter((w, i) => {
      const asset = input.assets[i]
      const minWeight = asset.constraints?.minWeight || this.config.minWeight
      const maxWeight = asset.constraints?.maxWeight || this.config.maxWeight
      return w < minWeight || w > maxWeight
    }).length
    
    if (constraintViolations > 0) {
      warnings.push('Constraint violations detected - review allocation constraints')
    }
    
    return warnings
  }

  /**
   * Calculate average correlation
   */
  private calculateAverageCorrelation(): number {
    let sum = 0
    let count = 0
    
    for (let i = 0; i < this.correlationMatrix.length; i++) {
      for (let j = i + 1; j < this.correlationMatrix[i].length; j++) {
        sum += this.correlationMatrix[i][j]
        count++
      }
    }
    
    return count > 0 ? sum / count : 0
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<RiskParityConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): RiskParityConfig {
    return { ...this.config }
  }
}

// Factory function to create risk parity engine
export function createRiskParityEngine(config: RiskParityConfig): RiskParityEngine {
  return new RiskParityEngine(config)
}

// Default configuration
export const defaultRiskParityConfig: RiskParityConfig = {
  approach: 'equal_risk',
  riskTarget: 0.12,
  rebalancingFrequency: 'monthly',
  lookbackPeriod: 63,
  minWeight: 0.01,
  maxWeight: 0.4,
  riskFreeRate: 0.02,
  transactionCost: 0.001,
  useLeverage: false,
  maxLeverage: 2.0,
  correlationMethod: 'pearson',
  volatilityMethod: 'historical'
}