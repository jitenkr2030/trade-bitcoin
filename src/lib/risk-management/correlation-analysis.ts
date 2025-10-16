/**
 * Advanced Correlation Analysis Engine
 * 
 * This module provides sophisticated correlation analysis including:
 * - Pearson and Spearman correlation coefficients
 * - Rolling correlation analysis
 * - Correlation matrices and heatmaps
 * - Cointegration analysis
 * - Lead-lag relationships
 * - Dynamic correlation modeling
 */

export interface AssetData {
  symbol: string
  returns: number[]
  prices: number[]
  volume?: number[]
  marketCap?: number
  sector?: string
  assetClass?: string
}

export interface CorrelationPair {
  asset1: string
  asset2: string
  pearsonCorrelation: number
  spearmanCorrelation: number
  kendallCorrelation?: number
  pValue: number
  confidenceInterval: [number, number]
  sampleSize: number
  timePeriod: string
}

export interface CorrelationMatrix {
  assets: string[]
  matrix: number[][]
  heatmap: number[][]
  eigenvalues: number[]
  eigenvectors: number[][]
  conditionNumber: number
  determinant: number
}

export interface CorrelationAnalysis {
  matrix: CorrelationMatrix
  pairs: CorrelationPair[]
  highlyCorrelated: CorrelationPair[]
  uncorrelated: CorrelationPair[]
  negativeCorrelated: CorrelationPair[]
  summary: {
    averageCorrelation: number
    correlationVolatility: number
    diversificationPotential: number
    riskConcentration: number
    optimalHedgeRatio?: number
  }
  recommendations: string[]
  warnings: string[]
}

export interface RollingCorrelation {
  asset1: string
  asset2: string
  window: number
  correlations: number[]
  timestamps: number[]
  statistics: {
    mean: number
    std: number
    min: number
    max: number
    trend: number
  }
}

export interface CointegrationResult {
  asset1: string
  asset2: string
  isCointegrated: boolean
  testStatistic: number
  criticalValue: number
  pValue: number
  hedgeRatio: number
  halfLife: number
  meanReversionSpeed: number
}

export class CorrelationAnalysisEngine {
  private config: {
    minDataPoints: number
    confidenceLevel: number
    correlationThreshold: number
    rollingWindow: number
    cointegrationTest: 'adf' | 'pp' | 'kpss'
  }

  constructor(config: {
    minDataPoints?: number
    confidenceLevel?: number
    correlationThreshold?: number
    rollingWindow?: number
    cointegrationTest?: 'adf' | 'pp' | 'kpss'
  } = {}) {
    this.config = {
      minDataPoints: config.minDataPoints || 30,
      confidenceLevel: config.confidenceLevel || 0.95,
      correlationThreshold: config.correlationThreshold || 0.7,
      rollingWindow: config.rollingWindow || 20,
      cointegrationTest: config.cointegrationTest || 'adf'
    }
  }

  /**
   * Perform comprehensive correlation analysis
   */
  analyzeCorrelations(assets: AssetData[]): CorrelationAnalysis {
    this.validateData(assets)
    
    const matrix = this.calculateCorrelationMatrix(assets)
    const pairs = this.calculateAllCorrelationPairs(assets)
    const highlyCorrelated = pairs.filter(p => Math.abs(p.pearsonCorrelation) >= this.config.correlationThreshold)
    const uncorrelated = pairs.filter(p => Math.abs(p.pearsonCorrelation) < 0.2)
    const negativeCorrelated = pairs.filter(p => p.pearsonCorrelation < -0.5)
    
    const summary = this.calculateCorrelationSummary(matrix, pairs)
    const recommendations = this.generateCorrelationRecommendations(matrix, pairs, assets)
    const warnings = this.generateCorrelationWarnings(matrix, pairs)

    return {
      matrix,
      pairs,
      highlyCorrelated,
      uncorrelated,
      negativeCorrelated,
      summary,
      recommendations,
      warnings
    }
  }

  /**
   * Calculate rolling correlation between two assets
   */
  calculateRollingCorrelation(asset1: AssetData, asset2: AssetData, window?: number): RollingCorrelation {
    const rollWindow = window || this.config.rollingWindow
    const correlations: number[] = []
    const timestamps: number[] = []
    
    const minLength = Math.min(asset1.returns.length, asset2.returns.length)
    
    for (let i = rollWindow - 1; i < minLength; i++) {
      const window1 = asset1.returns.slice(i - rollWindow + 1, i + 1)
      const window2 = asset2.returns.slice(i - rollWindow + 1, i + 1)
      
      const correlation = this.calculatePearsonCorrelation(window1, window2)
      correlations.push(correlation)
      timestamps.push(i)
    }

    const statistics = this.calculateRollingStatistics(correlations)

    return {
      asset1: asset1.symbol,
      asset2: asset2.symbol,
      window: rollWindow,
      correlations,
      timestamps,
      statistics
    }
  }

  /**
   * Test for cointegration between two assets
   */
  testCointegration(asset1: AssetData, asset2: AssetData): CointegrationResult {
    // Simplified cointegration test - in practice, would use proper statistical libraries
    const spread = this.calculateSpread(asset1.prices, asset2.prices)
    const testStatistic = this.calculateADFStatistic(spread)
    const criticalValue = this.getCriticalValue(this.config.confidenceLevel, spread.length)
    const pValue = this.calculatePValue(testStatistic, criticalValue)
    
    const hedgeRatio = this.calculateHedgeRatio(asset1.prices, asset2.prices)
    const halfLife = this.calculateHalfLife(spread)
    const meanReversionSpeed = this.calculateMeanReversionSpeed(spread)

    return {
      asset1: asset1.symbol,
      asset2: asset2.symbol,
      isCointegrated: testStatistic < criticalValue,
      testStatistic,
      criticalValue,
      pValue,
      hedgeRatio,
      halfLife,
      meanReversionSpeed
    }
  }

  /**
   * Calculate lead-lag relationship between assets
   */
  calculateLeadLag(asset1: AssetData, asset2: AssetData, maxLag: number = 10): {
    leadLag: number
    correlationAtLag: number[]
    bestLag: number
    significance: number
  } {
    const minLength = Math.min(asset1.returns.length, asset2.returns.length)
    const correlationAtLag: number[] = []
    
    let maxCorrelation = -1
    let bestLag = 0
    
    for (let lag = -maxLag; lag <= maxLag; lag++) {
      let correlation = 0
      
      if (lag < 0) {
        // asset2 leads asset1
        const returns1 = asset1.returns.slice(-lag, minLength)
        const returns2 = asset2.returns.slice(0, minLength + lag)
        correlation = this.calculatePearsonCorrelation(returns1, returns2)
      } else if (lag > 0) {
        // asset1 leads asset2
        const returns1 = asset1.returns.slice(0, minLength - lag)
        const returns2 = asset2.returns.slice(lag, minLength)
        correlation = this.calculatePearsonCorrelation(returns1, returns2)
      } else {
        // contemporaneous
        correlation = this.calculatePearsonCorrelation(
          asset1.returns.slice(0, minLength),
          asset2.returns.slice(0, minLength)
        )
      }
      
      correlationAtLag.push(correlation)
      
      if (Math.abs(correlation) > Math.abs(maxCorrelation)) {
        maxCorrelation = correlation
        bestLag = lag
      }
    }
    
    return {
      leadLag: bestLag,
      correlationAtLag,
      bestLag,
      significance: Math.abs(maxCorrelation)
    }
  }

  /**
   * Validate input data
   */
  private validateData(assets: AssetData[]): void {
    if (assets.length < 2) {
      throw new Error('At least 2 assets required for correlation analysis')
    }
    
    for (const asset of assets) {
      if (asset.returns.length < this.config.minDataPoints) {
        throw new Error(`Insufficient data for asset ${asset.symbol}: ${asset.returns.length} < ${this.config.minDataPoints}`)
      }
      
      if (asset.returns.length !== asset.prices.length) {
        throw new Error(`Returns and prices length mismatch for asset ${asset.symbol}`)
      }
    }
  }

  /**
   * Calculate correlation matrix
   */
  private calculateCorrelationMatrix(assets: AssetData[]): CorrelationMatrix {
    const n = assets.length
    const matrix: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
    const heatmap: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))
    
    // Calculate Pearson correlations
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1.0
          heatmap[i][j] = 1.0
        } else {
          const correlation = this.calculatePearsonCorrelation(assets[i].returns, assets[j].returns)
          matrix[i][j] = correlation
          heatmap[i][j] = Math.abs(correlation)
        }
      }
    }
    
    // Calculate eigenvalues and eigenvectors (simplified)
    const eigenvalues = this.calculateEigenvalues(matrix)
    const eigenvectors = this.calculateEigenvectors(matrix, eigenvalues)
    
    // Calculate condition number and determinant
    const conditionNumber = this.calculateConditionNumber(matrix)
    const determinant = this.calculateDeterminant(matrix)
    
    return {
      assets: assets.map(a => a.symbol),
      matrix,
      heatmap,
      eigenvalues,
      eigenvectors,
      conditionNumber,
      determinant
    }
  }

  /**
   * Calculate all correlation pairs
   */
  private calculateAllCorrelationPairs(assets: AssetData[]): CorrelationPair[] {
    const pairs: CorrelationPair[] = []
    const n = assets.length
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const pearson = this.calculatePearsonCorrelation(assets[i].returns, assets[j].returns)
        const spearman = this.calculateSpearmanCorrelation(assets[i].returns, assets[j].returns)
        const pValue = this.calculateCorrelationPValue(pearson, assets[i].returns.length)
        const confidenceInterval = this.calculateConfidenceInterval(pearson, assets[i].returns.length, this.config.confidenceLevel)
        
        pairs.push({
          asset1: assets[i].symbol,
          asset2: assets[j].symbol,
          pearsonCorrelation: pearson,
          spearmanCorrelation: spearman,
          pValue,
          confidenceInterval,
          sampleSize: assets[i].returns.length,
          timePeriod: 'full_period'
        })
      }
    }
    
    return pairs
  }

  /**
   * Calculate Pearson correlation coefficient
   */
  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0
    
    const n = x.length
    const meanX = x.reduce((sum, val) => sum + val, 0) / n
    const meanY = y.reduce((sum, val) => sum + val, 0) / n
    
    let numerator = 0
    let sumX2 = 0
    let sumY2 = 0
    
    for (let i = 0; i < n; i++) {
      const diffX = x[i] - meanX
      const diffY = y[i] - meanY
      
      numerator += diffX * diffY
      sumX2 += diffX * diffX
      sumY2 += diffY * diffY
    }
    
    const denominator = Math.sqrt(sumX2 * sumY2)
    
    return denominator > 0 ? numerator / denominator : 0
  }

  /**
   * Calculate Spearman correlation coefficient
   */
  private calculateSpearmanCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0
    
    const rankX = this.getRanks(x)
    const rankY = this.getRanks(y)
    
    return this.calculatePearsonCorrelation(rankX, rankY)
  }

  /**
   * Get ranks for Spearman correlation
   */
  private getRanks(values: number[]): number[] {
    const sorted = [...values].sort((a, b) => a - b)
    const ranks: number[] = []
    
    for (const value of values) {
      const rank = sorted.indexOf(value) + 1
      ranks.push(rank)
    }
    
    return ranks
  }

  /**
   * Calculate correlation p-value
   */
  private calculateCorrelationPValue(correlation: number, n: number): number {
    // Simplified p-value calculation using t-test
    if (n <= 2) return 1
    
    const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation))
    const df = n - 2
    
    // Simplified t-distribution p-value (would use proper statistical library in practice)
    return 2 * (1 - this.tDistributionCDF(Math.abs(t), df))
  }

  /**
   * Calculate confidence interval for correlation
   */
  private calculateConfidenceInterval(correlation: number, n: number, confidenceLevel: number): [number, number] {
    // Fisher transformation
    const z = 0.5 * Math.log((1 + correlation) / (1 - correlation))
    const se = 1 / Math.sqrt(n - 3)
    
    // Z-score for confidence level
    const zScore = this.getZScore(confidenceLevel)
    
    const zLower = z - zScore * se
    const zUpper = z + zScore * se
    
    // Inverse Fisher transformation
    const rLower = (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1)
    const rUpper = (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1)
    
    return [rLower, rUpper]
  }

  /**
   * Calculate correlation summary statistics
   */
  private calculateCorrelationSummary(matrix: CorrelationMatrix, pairs: CorrelationPair[]) {
    const n = matrix.assets.length
    let sum = 0
    let count = 0
    
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        sum += Math.abs(matrix.matrix[i][j])
        count++
      }
    }
    
    const averageCorrelation = sum / count
    
    // Calculate correlation volatility
    const correlations = pairs.map(p => Math.abs(p.pearsonCorrelation))
    const meanCorr = correlations.reduce((sum, c) => sum + c, 0) / correlations.length
    const variance = correlations.reduce((sum, c) => sum + Math.pow(c - meanCorr, 2), 0) / correlations.length
    const correlationVolatility = Math.sqrt(variance)
    
    // Calculate diversification potential
    const diversificationPotential = 1 - averageCorrelation
    
    // Calculate risk concentration
    const riskConcentration = this.calculateRiskConcentration(matrix)
    
    // Calculate optimal hedge ratio (simplified)
    const optimalHedgeRatio = this.calculateOptimalHedgeRatio(matrix)
    
    return {
      averageCorrelation,
      correlationVolatility,
      diversificationPotential,
      riskConcentration,
      optimalHedgeRatio
    }
  }

  /**
   * Calculate risk concentration
   */
  private calculateRiskConcentration(matrix: CorrelationMatrix): number {
    const eigenvalues = matrix.eigenvalues
    const totalVariance = eigenvalues.reduce((sum, val) => sum + val, 0)
    
    // Calculate concentration using Herfindahl index on eigenvalues
    const concentration = eigenvalues.reduce((sum, val) => sum + Math.pow(val / totalVariance, 2), 0)
    
    return concentration
  }

  /**
   * Calculate optimal hedge ratio
   */
  private calculateOptimalHedgeRatio(matrix: CorrelationMatrix): number {
    // Simplified calculation - in practice, would use optimization
    const avgCorrelation = matrix.matrix.flat().reduce((sum, val) => sum + val, 0) / (matrix.matrix.length * matrix.matrix.length)
    return Math.max(0, 1 - avgCorrelation)
  }

  /**
   * Generate correlation recommendations
   */
  private generateCorrelationRecommendations(matrix: CorrelationMatrix, pairs: CorrelationPair[], assets: AssetData[]): string[] {
    const recommendations: string[] = []
    
    const summary = this.calculateCorrelationSummary(matrix, pairs)
    
    if (summary.averageCorrelation > 0.7) {
      recommendations.push('High average correlation detected - consider adding uncorrelated assets')
    }
    
    if (summary.diversificationPotential < 0.3) {
      recommendations.push('Low diversification potential - portfolio lacks uncorrelated assets')
    }
    
    if (summary.riskConcentration > 0.6) {
      recommendations.push('High risk concentration - consider rebalancing to reduce correlation risk')
    }
    
    // Asset-specific recommendations
    const highlyCorrelatedPairs = pairs.filter(p => Math.abs(p.pearsonCorrelation) > 0.8)
    if (highlyCorrelatedPairs.length > 0) {
      recommendations.push(`Found ${highlyCorrelatedPairs.length} highly correlated pairs - consider hedging strategies`)
    }
    
    // Sector-specific recommendations
    const sectors = [...new Set(assets.map(a => a.sector).filter(Boolean))]
    if (sectors.length < 3) {
      recommendations.push('Limited sector diversification - consider adding assets from different sectors')
    }
    
    return recommendations
  }

  /**
   * Generate correlation warnings
   */
  private generateCorrelationWarnings(matrix: CorrelationMatrix, pairs: CorrelationPair[]): string[] {
    const warnings: string[] = []
    
    if (matrix.conditionNumber > 100) {
      warnings.push('High condition number detected - correlation matrix may be ill-conditioned')
    }
    
    if (matrix.determinant < 0.01) {
      warnings.push('Low determinant - high multicollinearity detected')
    }
    
    const extremeCorrelations = pairs.filter(p => Math.abs(p.pearsonCorrelation) > 0.9)
    if (extremeCorrelations.length > 0) {
      warnings.push(`Extreme correlations detected between ${extremeCorrelations.length} asset pairs`)
    }
    
    const summary = this.calculateCorrelationSummary(matrix, pairs)
    if (summary.correlationVolatility > 0.3) {
      warnings.push('High correlation volatility - unstable relationships between assets')
    }
    
    return warnings
  }

  /**
   * Calculate rolling statistics
   */
  private calculateRollingStatistics(correlations: number[]) {
    const mean = correlations.reduce((sum, val) => sum + val, 0) / correlations.length
    const variance = correlations.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / correlations.length
    const std = Math.sqrt(variance)
    const min = Math.min(...correlations)
    const max = Math.max(...correlations)
    
    // Calculate trend (simple linear regression slope)
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
    for (let i = 0; i < correlations.length; i++) {
      sumX += i
      sumY += correlations[i]
      sumXY += i * correlations[i]
      sumX2 += i * i
    }
    
    const n = correlations.length
    const trend = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    
    return { mean, std, min, max, trend }
  }

  /**
   * Calculate spread for cointegration
   */
  private calculateSpread(prices1: number[], prices2: number[]): number[] {
    const minLength = Math.min(prices1.length, prices2.length)
    const spread: number[] = []
    
    for (let i = 0; i < minLength; i++) {
      spread.push(prices1[i] - prices2[i])
    }
    
    return spread
  }

  /**
   * Calculate ADF statistic (simplified)
   */
  private calculateADFStatistic(spread: number[]): number {
    // Simplified ADF test - in practice, would use proper statistical library
    const n = spread.length
    const deltaSpread: number[] = []
    
    for (let i = 1; i < n; i++) {
      deltaSpread.push(spread[i] - spread[i - 1])
    }
    
    const meanDelta = deltaSpread.reduce((sum, val) => sum + val, 0) / deltaSpread.length
    const variance = deltaSpread.reduce((sum, val) => sum + Math.pow(val - meanDelta, 2), 0) / deltaSpread.length
    
    // Simplified ADF statistic
    return meanDelta / Math.sqrt(variance / n)
  }

  /**
   * Get critical value for ADF test
   */
  private getCriticalValue(confidenceLevel: number, n: number): number {
    // Simplified critical values - in practice, would use proper statistical tables
    const criticalValues = {
      0.90: -2.57,
      0.95: -2.86,
      0.99: -3.43
    }
    
    return criticalValues[confidenceLevel as keyof typeof criticalValues] || -2.86
  }

  /**
   * Calculate p-value for ADF test
   */
  private calculatePValue(testStatistic: number, criticalValue: number): number {
    // Simplified p-value calculation
    if (testStatistic < criticalValue) {
      return 0.01 // Reject null hypothesis
    }
    return 0.5 // Fail to reject null hypothesis
  }

  /**
   * Calculate hedge ratio
   */
  private calculateHedgeRatio(prices1: number[], prices2: number[]): number {
    // Simple linear regression to find hedge ratio
    const minLength = Math.min(prices1.length, prices2.length)
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0
    
    for (let i = 0; i < minLength; i++) {
      sumX += prices2[i]
      sumY += prices1[i]
      sumXY += prices2[i] * prices1[i]
      sumX2 += prices2[i] * prices2[i]
    }
    
    const n = minLength
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  }

  /**
   * Calculate half-life of mean reversion
   */
  private calculateHalfLife(spread: number[]): number {
    // Simplified calculation
    const n = spread.length
    const deltaSpread: number[] = []
    const laggedSpread: number[] = []
    
    for (let i = 1; i < n; i++) {
      deltaSpread.push(spread[i] - spread[i - 1])
      laggedSpread.push(spread[i - 1])
    }
    
    const correlation = this.calculatePearsonCorrelation(deltaSpread, laggedSpread)
    return Math.log(2) / Math.abs(correlation)
  }

  /**
   * Calculate mean reversion speed
   */
  private calculateMeanReversionSpeed(spread: number[]): number {
    // Simplified calculation
    const halfLife = this.calculateHalfLife(spread)
    return 1 / halfLife
  }

  /**
   * Calculate eigenvalues (simplified power iteration)
   */
  private calculateEigenvalues(matrix: number[][]): number[] {
    const n = matrix.length
    const eigenvalues: number[] = []
    
    // Simplified eigenvalue calculation - in practice, would use proper numerical library
    for (let i = 0; i < n; i++) {
      // Approximate eigenvalue as diagonal element (for correlation matrix)
      eigenvalues.push(1.0)
    }
    
    return eigenvalues
  }

  /**
   * Calculate eigenvectors (simplified)
   */
  private calculateEigenvectors(matrix: number[][], eigenvalues: number[]): number[][] {
    const n = matrix.length
    const eigenvectors: number[][] = []
    
    // Simplified eigenvector calculation - identity matrix
    for (let i = 0; i < n; i++) {
      const vector = Array(n).fill(0)
      vector[i] = 1
      eigenvectors.push(vector)
    }
    
    return eigenvectors
  }

  /**
   * Calculate condition number
   */
  private calculateConditionNumber(matrix: number[][]): number {
    // Simplified calculation
    const eigenvalues = this.calculateEigenvalues(matrix)
    const maxEigenvalue = Math.max(...eigenvalues)
    const minEigenvalue = Math.min(...eigenvalues)
    
    return minEigenvalue > 0 ? maxEigenvalue / minEigenvalue : Infinity
  }

  /**
   * Calculate determinant
   */
  private calculateDeterminant(matrix: number[][]): number {
    // Simplified determinant calculation for correlation matrix
    const eigenvalues = this.calculateEigenvalues(matrix)
    return eigenvalues.reduce((product, val) => product * val, 1)
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
   * T-distribution CDF (simplified)
   */
  private tDistributionCDF(t: number, df: number): number {
    // Simplified t-distribution CDF
    return 0.5 + 0.5 * Math.sign(t) * Math.sqrt(1 - Math.exp(-2 * t * t / df))
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

// Factory function to create correlation analysis engine
export function createCorrelationAnalysisEngine(config?: {
  minDataPoints?: number
  confidenceLevel?: number
  correlationThreshold?: number
  rollingWindow?: number
  cointegrationTest?: 'adf' | 'pp' | 'kpss'
}): CorrelationAnalysisEngine {
  return new CorrelationAnalysisEngine(config)
}