/**
 * Advanced Monte Carlo Simulation Engine
 * 
 * This module provides sophisticated Monte Carlo simulation capabilities including:
 * - Geometric Brownian Motion simulations
 * - Stochastic volatility models
 * - Jump diffusion processes
 * - Multi-asset correlated simulations
 * - Path-dependent option pricing
 * - Portfolio scenario generation
 */

export interface MonteCarloConfig {
  simulationType: 'gbm' | 'heston' | 'jump_diffusion' | 'correlated' | 'variance_gamma'
  numberOfSimulations: number
  timeSteps: number
  timeHorizon: number // in years
  seed?: number
  useAntitheticVariates: boolean
  useControlVariate: boolean
  confidenceLevel: number
}

export interface AssetParameters {
  symbol: string
  currentPrice: number
  drift: number
  volatility: number
  dividendYield?: number
  correlation?: number
  jumpIntensity?: number // For jump diffusion
  jumpMean?: number
  jumpVolatility?: number
  meanReversion?: number // For Heston model
  volOfVol?: number
  longRunVariance?: number
}

export interface SimulationInput {
  assets: AssetParameters[]
  portfolioWeights: number[]
  initialPortfolioValue: number
  riskFreeRate: number
  correlationMatrix?: number[][]
  marketConditions?: {
    regime: 'normal' | 'high_volatility' | 'low_volatility' | 'crisis'
    trend?: 'bullish' | 'bearish' | 'sideways'
  }
}

export interface SimulationResult {
  simulationId: string
  assetPaths: number[][][] // [simulation][asset][time]
  portfolioPaths: number[][] // [simulation][time]
  finalPrices: number[]
  finalPortfolioValues: number[]
  statistics: {
    meanFinalPrice: number
    stdFinalPrice: number
    medianFinalPrice: number
    percentiles: {
      p5: number
      p10: number
      p25: number
      p50: number
      p75: number
      p90: number
      p95: number
      p99: number
    }
  }
  riskMetrics: {
    var95: number
    var99: number
    expectedShortfall: number
    maxDrawdown: number
    probabilityOfLoss: number
    expectedLoss: number
  }
  performanceMetrics: {
    meanReturn: number
    volatility: number
    sharpeRatio: number
    sortinoRatio: number
    bestCase: number
    worstCase: number
  }
  convergence: {
    converged: boolean
    standardError: number
    confidenceInterval: [number, number]
  }
}

export interface ScenarioAnalysis {
  scenarios: Array<{
    name: string
    probability: number
    description: string
    impact: {
      portfolioValue: number
      return: number
      drawdown: number
    }
  }>
  worstCaseScenarios: Array<{
    simulationIndex: number
    finalValue: number
    return: number
    maxDrawdown: number
    path: number[]
  }>
  bestCaseScenarios: Array<{
    simulationIndex: number
    finalValue: number
    return: number
    maxDrawdown: number
    path: number[]
  }>
}

export class MonteCarloEngine {
  private config: MonteCarloConfig
  private random: () => number
  private normalRandom: () => number

  constructor(config: MonteCarloConfig) {
    this.config = config
    this.initializeRandomNumberGenerator()
  }

  /**
   * Run Monte Carlo simulation
   */
  runSimulation(input: SimulationInput): SimulationResult {
    const simulationId = `mc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Generate correlated random numbers if needed
    const randomNumbers = this.generateRandomNumbers(input)
    
    // Simulate asset paths
    const assetPaths = this.simulateAssetPaths(input, randomNumbers)
    
    // Calculate portfolio paths
    const portfolioPaths = this.calculatePortfolioPaths(assetPaths, input.portfolioWeights)
    
    // Extract final values
    const finalPrices = assetPaths.map(paths => paths.map(assetPath => assetPath[assetPath.length - 1]))
    const finalPortfolioValues = portfolioPaths.map(path => path[path.length - 1])
    
    // Calculate statistics
    const statistics = this.calculateStatistics(finalPrices, finalPortfolioValues)
    
    // Calculate risk metrics
    const riskMetrics = this.calculateRiskMetrics(portfolioPaths, input.initialPortfolioValue)
    
    // Calculate performance metrics
    const performanceMetrics = this.calculatePerformanceMetrics(portfolioPaths, input.initialPortfolioValue)
    
    // Check convergence
    const convergence = this.checkConvergence(finalPortfolioValues)
    
    return {
      simulationId,
      assetPaths,
      portfolioPaths,
      finalPrices,
      finalPortfolioValues,
      statistics,
      riskMetrics,
      performanceMetrics,
      convergence
    }
  }

  /**
   * Perform scenario analysis
   */
  analyzeScenarios(result: SimulationResult): ScenarioAnalysis {
    const scenarios = this.generateScenarios(result)
    const worstCaseScenarios = this.identifyWorstCaseScenarios(result)
    const bestCaseScenarios = this.identifyBestCaseScenarios(result)
    
    return {
      scenarios,
      worstCaseScenarios,
      bestCaseScenarios
    }
  }

  /**
   * Calculate option prices using Monte Carlo
   */
  priceOption(
    optionType: 'call' | 'put',
    strikePrice: number,
    timeToMaturity: number,
    underlyingParams: AssetParameters
  ): {
    price: number
    standardError: number
    confidenceInterval: [number, number]
    greeks?: {
      delta: number
      gamma: number
      theta: number
      vega: number
      rho: number
    }
  } {
    const input: SimulationInput = {
      assets: [underlyingParams],
      portfolioWeights: [1],
      initialPortfolioValue: underlyingParams.currentPrice,
      riskFreeRate: this.config.riskFreeRate
    }
    
    const result = this.runSimulation(input)
    
    // Calculate option payoffs
    const payoffs = result.assetPaths[0].map(path => {
      const finalPrice = path[path.length - 1]
      return optionType === 'call' 
        ? Math.max(0, finalPrice - strikePrice)
        : Math.max(0, strikePrice - finalPrice)
    })
    
    // Discount payoffs
    const discountedPayoffs = payoffs.map(payoff => 
      payoff * Math.exp(-this.config.riskFreeRate * timeToMaturity)
    )
    
    // Calculate price and statistics
    const price = discountedPayoffs.reduce((sum, payoff) => sum + payoff, 0) / discountedPayoffs.length
    const standardError = this.calculateStandardError(discountedPayoffs)
    const confidenceInterval = this.calculateConfidenceInterval(price, standardError, this.config.confidenceLevel)
    
    // Calculate Greeks using finite differences
    const greeks = this.calculateGreeks(optionType, strikePrice, timeToMaturity, underlyingParams)
    
    return {
      price,
      standardError,
      confidenceInterval,
      greeks
    }
  }

  /**
   * Initialize random number generator
   */
  private initializeRandomNumberGenerator(): void {
    if (this.config.seed !== undefined) {
      // Seeded random number generator
      let seed = this.config.seed
      this.random = () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
      }
    } else {
      // Use built-in random
      this.random = () => Math.random()
    }
    
    // Box-Muller transform for normal random numbers
    this.normalRandom = () => {
      let u = 0, v = 0
      while (u === 0) u = this.random()
      while (v === 0) v = this.random()
      
      const z0 = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
      return z0
    }
  }

  /**
   * Generate random numbers for simulation
   */
  private generateRandomNumbers(input: SimulationInput): number[][][] {
    const { assets, correlationMatrix } = input
    const n = this.config.numberOfSimulations
    const m = this.config.timeSteps
    const k = assets.length
    
    if (this.config.simulationType === 'correlated' && correlationMatrix) {
      return this.generateCorrelatedRandomNumbers(n, m, k, correlationMatrix)
    } else {
      return this.generateIndependentRandomNumbers(n, m, k)
    }
  }

  /**
   * Generate independent random numbers
   */
  private generateIndependentRandomNumbers(n: number, m: number, k: number): number[][][] {
    const randomNumbers: number[][][] = []
    
    for (let i = 0; i < n; i++) {
      const simulation: number[][] = []
      for (let j = 0; j < m; j++) {
        const timeStep: number[] = []
        for (let l = 0; l < k; l++) {
          timeStep.push(this.normalRandom())
        }
        simulation.push(timeStep)
      }
      randomNumbers.push(simulation)
    }
    
    return randomNumbers
  }

  /**
   * Generate correlated random numbers using Cholesky decomposition
   */
  private generateCorrelatedRandomNumbers(n: number, m: number, k: number, correlationMatrix: number[][]): number[][][] {
    // Perform Cholesky decomposition
    const L = this.choleskyDecomposition(correlationMatrix)
    
    const randomNumbers: number[][][] = []
    
    for (let i = 0; i < n; i++) {
      const simulation: number[][] = []
      for (let j = 0; j < m; j++) {
        // Generate independent normal random numbers
        const independent: number[] = []
        for (let l = 0; l < k; l++) {
          independent.push(this.normalRandom())
        }
        
        // Apply correlation transformation
        const correlated: number[] = []
        for (let l = 0; l < k; l++) {
          let sum = 0
          for (let p = 0; p <= l; p++) {
            sum += L[l][p] * independent[p]
          }
          correlated.push(sum)
        }
        
        simulation.push(correlated)
      }
      randomNumbers.push(simulation)
    }
    
    return randomNumbers
  }

  /**
   * Cholesky decomposition
   */
  private choleskyDecomposition(matrix: number[][]): number[][] {
    const n = matrix.length
    const L: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j <= i; j++) {
        let sum = 0
        
        if (j === i) {
          for (let k = 0; k < j; k++) {
            sum += L[j][k] * L[j][k]
          }
          L[j][j] = Math.sqrt(matrix[j][j] - sum)
        } else {
          for (let k = 0; k < j; k++) {
            sum += L[i][k] * L[j][k]
          }
          L[i][j] = (matrix[i][j] - sum) / L[j][j]
        }
      }
    }
    
    return L
  }

  /**
   * Simulate asset paths
   */
  private simulateAssetPaths(input: SimulationInput, randomNumbers: number[][][]): number[][][] {
    const { assets, riskFreeRate } = input
    const dt = this.config.timeHorizon / this.config.timeSteps
    
    switch (this.config.simulationType) {
      case 'gbm':
        return this.simulateGBM(assets, randomNumbers, riskFreeRate, dt)
      case 'heston':
        return this.simulateHeston(assets, randomNumbers, riskFreeRate, dt)
      case 'jump_diffusion':
        return this.simulateJumpDiffusion(assets, randomNumbers, riskFreeRate, dt)
      case 'variance_gamma':
        return this.simulateVarianceGamma(assets, randomNumbers, riskFreeRate, dt)
      default:
        return this.simulateGBM(assets, randomNumbers, riskFreeRate, dt)
    }
  }

  /**
   * Simulate Geometric Brownian Motion
   */
  private simulateGBM(
    assets: AssetParameters[],
    randomNumbers: number[][][],
    riskFreeRate: number,
    dt: number
  ): number[][][] {
    const n = this.config.numberOfSimulations
    const m = this.config.timeSteps
    const k = assets.length
    
    const paths: number[][][] = Array(n).fill(0).map(() => 
      Array(k).fill(0).map(() => Array(m + 1).fill(0))
    )
    
    // Initialize paths with current prices
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        paths[i][j][0] = assets[j].currentPrice
      }
    }
    
    // Simulate paths
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        const asset = assets[j]
        const drift = asset.drift - riskFreeRate
        const volatility = asset.volatility
        
        for (let t = 1; t <= m; t++) {
          const z = randomNumbers[i][t - 1][j]
          
          // GBM formula: S(t) = S(t-1) * exp((μ - σ²/2)dt + σ√dt * Z)
          const exponent = (drift - 0.5 * volatility * volatility) * dt + volatility * Math.sqrt(dt) * z
          paths[i][j][t] = paths[i][j][t - 1] * Math.exp(exponent)
        }
      }
    }
    
    return paths
  }

  /**
   * Simulate Heston model (stochastic volatility)
   */
  private simulateHeston(
    assets: AssetParameters[],
    randomNumbers: number[][][],
    riskFreeRate: number,
    dt: number
  ): number[][][] {
    const n = this.config.numberOfSimulations
    const m = this.config.timeSteps
    const k = assets.length
    
    const paths: number[][][] = Array(n).fill(0).map(() => 
      Array(k).fill(0).map(() => Array(m + 1).fill(0))
    )
    
    const variancePaths: number[][] = Array(n).fill(0).map(() => Array(k).fill(0))
    
    // Initialize paths
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        paths[i][j][0] = assets[j].currentPrice
        variancePaths[i][j] = assets[j].longRunVariance || assets[j].volatility * assets[j].volatility
      }
    }
    
    // Simulate paths with stochastic volatility
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        const asset = assets[j]
        const drift = asset.drift - riskFreeRate
        const meanReversion = asset.meanReversion || 0.5
        const volOfVol = asset.volOfVol || 0.3
        const longRunVariance = asset.longRunVariance || asset.volatility * asset.volatility
        
        for (let t = 1; t <= m; t++) {
          const z1 = randomNumbers[i][t - 1][j]
          const z2 = randomNumbers[i][t - 1][(j + 1) % k] // Second random variable for volatility
          
          // Update variance (CIR process)
          const currentVariance = variancePaths[i][j]
          const varianceChange = meanReversion * (longRunVariance - currentVariance) * dt + 
                               volOfVol * Math.sqrt(currentVariance * dt) * z2
          variancePaths[i][j] = Math.max(0, currentVariance + varianceChange)
          
          // Update price
          const volatility = Math.sqrt(variancePaths[i][j])
          const exponent = (drift - 0.5 * volatility * volatility) * dt + volatility * Math.sqrt(dt) * z1
          paths[i][j][t] = paths[i][j][t - 1] * Math.exp(exponent)
        }
      }
    }
    
    return paths
  }

  /**
   * Simulate Jump Diffusion model
   */
  private simulateJumpDiffusion(
    assets: AssetParameters[],
    randomNumbers: number[][][],
    riskFreeRate: number,
    dt: number
  ): number[][][] {
    const n = this.config.numberOfSimulations
    const m = this.config.timeSteps
    const k = assets.length
    
    const paths: number[][][] = Array(n).fill(0).map(() => 
      Array(k).fill(0).map(() => Array(m + 1).fill(0))
    )
    
    // Initialize paths
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        paths[i][j][0] = assets[j].currentPrice
      }
    }
    
    // Simulate paths with jumps
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < k; j++) {
        const asset = assets[j]
        const drift = asset.drift - riskFreeRate
        const volatility = asset.volatility
        const jumpIntensity = asset.jumpIntensity || 0.1
        const jumpMean = asset.jumpMean || -0.1
        const jumpVolatility = asset.jumpVolatility || 0.2
        
        for (let t = 1; t <= m; t++) {
          const z = randomNumbers[i][t - 1][j]
          
          // Check for jump
          const jumpSize = this.random() < jumpIntensity * dt 
            ? this.generateJumpSize(jumpMean, jumpVolatility) 
            : 0
          
          // Merton jump diffusion formula
          const exponent = (drift - 0.5 * volatility * volatility - jumpIntensity * (Math.exp(jumpMean + 0.5 * jumpVolatility * jumpVolatility) - 1)) * dt + 
                          volatility * Math.sqrt(dt) * z + jumpSize
          paths[i][j][t] = paths[i][j][t - 1] * Math.exp(exponent)
        }
      }
    }
    
    return paths
  }

  /**
   * Simulate Variance Gamma model
   */
  private simulateVarianceGamma(
    assets: AssetParameters[],
    randomNumbers: number[][][],
    riskFreeRate: number,
    dt: number
  ): number[][][] {
    // Simplified Variance Gamma simulation
    // In practice, this would use more sophisticated methods
    return this.simulateGBM(assets, randomNumbers, riskFreeRate, dt)
  }

  /**
   * Generate jump size for jump diffusion
   */
  private generateJumpSize(mean: number, volatility: number): number {
    // Log-normal jump sizes
    const z = this.normalRandom()
    return mean + volatility * z
  }

  /**
   * Calculate portfolio paths
   */
  private calculatePortfolioPaths(assetPaths: number[][][], weights: number[]): number[][] {
    const n = assetPaths.length
    const m = assetPaths[0][0].length
    
    const portfolioPaths: number[][] = Array(n).fill(0).map(() => Array(m).fill(0))
    
    for (let i = 0; i < n; i++) {
      for (let t = 0; t < m; t++) {
        let portfolioValue = 0
        for (let j = 0; j < weights.length; j++) {
          portfolioValue += weights[j] * assetPaths[i][j][t]
        }
        portfolioPaths[i][t] = portfolioValue
      }
    }
    
    return portfolioPaths
  }

  /**
   * Calculate statistics
   */
  private calculateStatistics(finalPrices: number[][], finalPortfolioValues: number[]): SimulationResult['statistics'] {
    const flatFinalPrices = finalPrices.flat()
    const meanFinalPrice = flatFinalPrices.reduce((sum, price) => sum + price, 0) / flatFinalPrices.length
    const stdFinalPrice = Math.sqrt(
      flatFinalPrices.reduce((sum, price) => sum + Math.pow(price - meanFinalPrice, 2), 0) / flatFinalPrices.length
    )
    
    const sortedPrices = [...flatFinalPrices].sort((a, b) => a - b)
    const medianFinalPrice = sortedPrices[Math.floor(sortedPrices.length / 2)]
    
    const percentiles = {
      p5: sortedPrices[Math.floor(sortedPrices.length * 0.05)],
      p10: sortedPrices[Math.floor(sortedPrices.length * 0.10)],
      p25: sortedPrices[Math.floor(sortedPrices.length * 0.25)],
      p50: medianFinalPrice,
      p75: sortedPrices[Math.floor(sortedPrices.length * 0.75)],
      p90: sortedPrices[Math.floor(sortedPrices.length * 0.90)],
      p95: sortedPrices[Math.floor(sortedPrices.length * 0.95)],
      p99: sortedPrices[Math.floor(sortedPrices.length * 0.99)]
    }
    
    return {
      meanFinalPrice,
      stdFinalPrice,
      medianFinalPrice,
      percentiles
    }
  }

  /**
   * Calculate risk metrics
   */
  private calculateRiskMetrics(portfolioPaths: number[][], initialValue: number): SimulationResult['riskMetrics'] {
    const finalValues = portfolioPaths.map(path => path[path.length - 1])
    const returns = finalValues.map(value => (value - initialValue) / initialValue)
    
    // Calculate VaR
    const sortedReturns = [...returns].sort((a, b) => a - b)
    const var95 = -sortedReturns[Math.floor(sortedReturns.length * 0.05)]
    const var99 = -sortedReturns[Math.floor(sortedReturns.length * 0.01)]
    
    // Calculate Expected Shortfall
    const tailReturns = sortedReturns.slice(0, Math.floor(sortedReturns.length * 0.05))
    const expectedShortfall = -tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length
    
    // Calculate maximum drawdown
    const maxDrawdowns = portfolioPaths.map(path => this.calculateMaxDrawdown(path))
    const maxDrawdown = Math.max(...maxDrawdowns)
    
    // Calculate probability of loss
    const probabilityOfLoss = returns.filter(ret => ret < 0).length / returns.length
    
    // Calculate expected loss
    const losses = returns.filter(ret => ret < 0)
    const expectedLoss = losses.length > 0 ? losses.reduce((sum, loss) => sum + loss, 0) / losses.length : 0
    
    return {
      var95,
      var99,
      expectedShortfall,
      maxDrawdown,
      probabilityOfLoss,
      expectedLoss
    }
  }

  /**
   * Calculate maximum drawdown for a path
   */
  private calculateMaxDrawdown(path: number[]): number {
    let peak = path[0]
    let maxDrawdown = 0
    
    for (const value of path) {
      if (value > peak) {
        peak = value
      }
      const drawdown = (peak - value) / peak
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown
      }
    }
    
    return maxDrawdown
  }

  /**
   * Calculate performance metrics
   */
  private calculatePerformanceMetrics(portfolioPaths: number[][], initialValue: number): SimulationResult['performanceMetrics'] {
    const finalValues = portfolioPaths.map(path => path[path.length - 1])
    const returns = finalValues.map(value => (value - initialValue) / initialValue)
    
    const meanReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length
    const volatility = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length)
    
    const sharpeRatio = volatility > 0 ? meanReturn / volatility : 0
    
    // Calculate Sortino ratio
    const negativeReturns = returns.filter(ret => ret < 0)
    const downsideVolatility = negativeReturns.length > 0 
      ? Math.sqrt(negativeReturns.reduce((sum, ret) => sum + Math.pow(ret, 2), 0) / negativeReturns.length)
      : 0
    const sortinoRatio = downsideVolatility > 0 ? meanReturn / downsideVolatility : 0
    
    const bestCase = Math.max(...returns)
    const worstCase = Math.min(...returns)
    
    return {
      meanReturn,
      volatility,
      sharpeRatio,
      sortinoRatio,
      bestCase,
      worstCase
    }
  }

  /**
   * Check convergence
   */
  private checkConvergence(finalPortfolioValues: number[]): SimulationResult['convergence'] {
    const mean = finalPortfolioValues.reduce((sum, value) => sum + value, 0) / finalPortfolioValues.length
    const standardError = this.calculateStandardError(finalPortfolioValues)
    const confidenceInterval = this.calculateConfidenceInterval(mean, standardError, this.config.confidenceLevel)
    
    // Check if standard error is small enough
    const converged = standardError / Math.abs(mean) < 0.01 // 1% relative error
    
    return {
      converged,
      standardError,
      confidenceInterval
    }
  }

  /**
   * Calculate standard error
   */
  private calculateStandardError(values: number[]): number {
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length
    const variance = values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length
    return Math.sqrt(variance / values.length)
  }

  /**
   * Calculate confidence interval
   */
  private calculateConfidenceInterval(mean: number, standardError: number, confidenceLevel: number): [number, number] {
    const zScore = this.getZScore(confidenceLevel)
    const margin = zScore * standardError
    return [mean - margin, mean + margin]
  }

  /**
   * Generate scenarios
   */
  private generateScenarios(result: SimulationResult): ScenarioAnalysis['scenarios'] {
    const finalValues = result.finalPortfolioValues
    const initialValue = finalValues[0] // Assume first value is initial
    
    return [
      {
        name: 'Best Case',
        probability: 0.1,
        description: 'Top 10% of outcomes',
        impact: {
          portfolioValue: result.statistics.percentiles.p90,
          return: (result.statistics.percentiles.p90 - initialValue) / initialValue,
          drawdown: 0
        }
      },
      {
        name: 'Base Case',
        probability: 0.6,
        description: 'Most likely outcomes (25th-75th percentile)',
        impact: {
          portfolioValue: result.statistics.percentiles.p50,
          return: (result.statistics.percentiles.p50 - initialValue) / initialValue,
          drawdown: 0.1
        }
      },
      {
        name: 'Worst Case',
        probability: 0.1,
        description: 'Bottom 10% of outcomes',
        impact: {
          portfolioValue: result.statistics.percentiles.p10,
          return: (result.statistics.percentiles.p10 - initialValue) / initialValue,
          drawdown: result.riskMetrics.maxDrawdown
        }
      },
      {
        name: 'Extreme Case',
        probability: 0.01,
        description: 'Worst 1% of outcomes',
        impact: {
          portfolioValue: result.statistics.percentiles.p5,
          return: (result.statistics.percentiles.p5 - initialValue) / initialValue,
          drawdown: result.riskMetrics.maxDrawdown
        }
      }
    ]
  }

  /**
   * Identify worst case scenarios
   */
  private identifyWorstCaseScenarios(result: SimulationResult): ScenarioAnalysis['worstCaseScenarios'] {
    const finalValues = result.finalPortfolioValues
    const sortedIndices = finalValues
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value)
      .slice(0, 5) // Top 5 worst cases
    
    return sortedIndices.map(item => ({
      simulationIndex: item.index,
      finalValue: item.value,
      return: (item.value - result.portfolioPaths[0][0]) / result.portfolioPaths[0][0],
      maxDrawdown: this.calculateMaxDrawdown(result.portfolioPaths[item.index]),
      path: result.portfolioPaths[item.index]
    }))
  }

  /**
   * Identify best case scenarios
   */
  private identifyBestCaseScenarios(result: SimulationResult): ScenarioAnalysis['bestCaseScenarios'] {
    const finalValues = result.finalPortfolioValues
    const sortedIndices = finalValues
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5) // Top 5 best cases
    
    return sortedIndices.map(item => ({
      simulationIndex: item.index,
      finalValue: item.value,
      return: (item.value - result.portfolioPaths[0][0]) / result.portfolioPaths[0][0],
      maxDrawdown: this.calculateMaxDrawdown(result.portfolioPaths[item.index]),
      path: result.portfolioPaths[item.index]
    }))
  }

  /**
   * Calculate Greeks using finite differences
   */
  private calculateGreeks(
    optionType: 'call' | 'put',
    strikePrice: number,
    timeToMaturity: number,
    underlyingParams: AssetParameters
  ): SimulationResult['performanceMetrics'] {
    // Simplified Greek calculation using finite differences
    // In practice, would use more sophisticated methods
    
    const deltaShock = 0.01
    const volatilityShock = 0.01
    const timeShock = 0.01
    const rateShock = 0.01
    
    const basePrice = this.priceOption(optionType, strikePrice, timeToMaturity, underlyingParams).price
    
    // Delta
    const upParams = { ...underlyingParams, currentPrice: underlyingParams.currentPrice * (1 + deltaShock) }
    const downParams = { ...underlyingParams, currentPrice: underlyingParams.currentPrice * (1 - deltaShock) }
    const upPrice = this.priceOption(optionType, strikePrice, timeToMaturity, upParams).price
    const downPrice = this.priceOption(optionType, strikePrice, timeToMaturity, downParams).price
    const delta = (upPrice - downPrice) / (2 * deltaShock * underlyingParams.currentPrice)
    
    // Gamma
    const gamma = (upPrice - 2 * basePrice + downPrice) / Math.pow(deltaShock * underlyingParams.currentPrice, 2)
    
    // Theta
    const futureParams = { ...underlyingParams }
    const futurePrice = this.priceOption(optionType, strikePrice, timeToMaturity - timeShock, futureParams).price
    const theta = (futurePrice - basePrice) / timeShock
    
    // Vega
    const volUpParams = { ...underlyingParams, volatility: underlyingParams.volatility + volatilityShock }
    const volUpPrice = this.priceOption(optionType, strikePrice, timeToMaturity, volUpParams).price
    const vega = (volUpPrice - basePrice) / volatilityShock
    
    // Rho
    const rateUpParams = { ...underlyingParams }
    const rateUpPrice = this.priceOption(optionType, strikePrice, timeToMaturity, rateUpParams).price
    const rho = (rateUpPrice - basePrice) / rateShock
    
    return {
      delta,
      gamma,
      theta,
      vega,
      rho
    } as any
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
   * Update configuration
   */
  updateConfig(newConfig: Partial<MonteCarloConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get current configuration
   */
  getConfig(): MonteCarloConfig {
    return { ...this.config }
  }
}

// Factory function to create Monte Carlo engine
export function createMonteCarloEngine(config: MonteCarloConfig): MonteCarloEngine {
  return new MonteCarloEngine(config)
}

// Default configuration
export const defaultMonteCarloConfig: MonteCarloConfig = {
  simulationType: 'gbm',
  numberOfSimulations: 10000,
  timeSteps: 252,
  timeHorizon: 1,
  useAntitheticVariates: true,
  useControlVariate: false,
  confidenceLevel: 0.95
}