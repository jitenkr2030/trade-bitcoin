/**
 * Advanced Risk Management System
 * 
 * Comprehensive risk management suite for trading bots and portfolios
 */

// Position Sizing
export {
  PositionSizingEngine,
  PositionSizingConfig,
  PositionSizingInput,
  PositionSizingResult,
  createPositionSizingEngine,
  defaultPositionSizingConfig
} from './position-sizing'

// Stop Loss Automation
export {
  StopLossAutomationEngine,
  StopLossConfig,
  StopLossInput,
  StopLossResult,
  StopLossOrder,
  createStopLossAutomationEngine,
  defaultStopLossConfig
} from './stop-loss'

// Portfolio Risk Metrics
export {
  PortfolioRiskCalculator,
  PortfolioData,
  RiskMetrics,
  RiskAnalysis,
  createPortfolioRiskCalculator
} from './portfolio-metrics'

// Correlation Analysis
export {
  CorrelationAnalysisEngine,
  AssetData,
  CorrelationPair,
  CorrelationMatrix,
  CorrelationAnalysis,
  RollingCorrelation,
  CointegrationResult,
  createCorrelationAnalysisEngine
} from './correlation-analysis'

// Stress Testing
export {
  StressTestingEngine,
  StressTestScenario,
  StressTestParameters,
  StressTestInput,
  StressTestResult,
  StressTestReport,
  createStressTestingEngine
} from './stress-testing'

// Monte Carlo Simulation
export {
  MonteCarloEngine,
  MonteCarloConfig,
  AssetParameters,
  SimulationInput,
  SimulationResult,
  ScenarioAnalysis,
  createMonteCarloEngine,
  defaultMonteCarloConfig
} from './monte-carlo'

// Risk Parity
export {
  RiskParityEngine,
  RiskParityConfig,
  RiskParityInput,
  RiskParityResult,
  RiskParityBacktest,
  createRiskParityEngine,
  defaultRiskParityConfig
} from './risk-parity'

// Main Risk Management System
export class AdvancedRiskManagementSystem {
  private positionSizing: any
  private stopLoss: any
  private portfolioMetrics: any
  private correlationAnalysis: any
  private stressTesting: any
  private monteCarlo: any
  private riskParity: any

  constructor(config?: {
    positionSizing?: any
    stopLoss?: any
    portfolioMetrics?: any
    correlationAnalysis?: any
    stressTesting?: any
    monteCarlo?: any
    riskParity?: any
  }) {
    this.positionSizing = config?.positionSizing || createPositionSizingEngine(defaultPositionSizingConfig)
    this.stopLoss = config?.stopLoss || createStopLossAutomationEngine(defaultStopLossConfig)
    this.portfolioMetrics = config?.portfolioMetrics || createPortfolioRiskCalculator()
    this.correlationAnalysis = config?.correlationAnalysis || createCorrelationAnalysisEngine()
    this.stressTesting = config?.stressTesting || createStressTestingEngine()
    this.monteCarlo = config?.monteCarlo || createMonteCarloEngine(defaultMonteCarloConfig)
    this.riskParity = config?.riskParity || createRiskParityEngine(defaultRiskParityConfig)
  }

  /**
   * Get position sizing engine
   */
  getPositionSizingEngine() {
    return this.positionSizing
  }

  /**
   * Get stop-loss automation engine
   */
  getStopLossEngine() {
    return this.stopLoss
  }

  /**
   * Get portfolio risk calculator
   */
  getPortfolioRiskCalculator() {
    return this.portfolioMetrics
  }

  /**
   * Get correlation analysis engine
   */
  getCorrelationAnalysisEngine() {
    return this.correlationAnalysis
  }

  /**
   * Get stress testing engine
   */
  getStressTestingEngine() {
    return this.stressTesting
  }

  /**
   * Get Monte Carlo simulation engine
   */
  getMonteCarloEngine() {
    return this.monteCarlo
  }

  /**
   * Get risk parity engine
   */
  getRiskParityEngine() {
    return this.riskParity
  }

  /**
   * Run comprehensive risk analysis
   */
  async runComprehensiveRiskAnalysis(portfolioData: any) {
    const results = {
      positionSizing: {},
      stopLoss: {},
      portfolioMetrics: {},
      correlationAnalysis: {},
      stressTesting: {},
      monteCarlo: {},
      riskParity: {},
      summary: {
        overallRiskScore: 0,
        riskLevel: 'low' as 'low' | 'medium' | 'high' | 'extreme',
        recommendations: [] as string[],
        warnings: [] as string[]
      }
    }

    try {
      // Portfolio risk metrics
      results.portfolioMetrics = this.portfolioMetrics.calculateRiskMetrics(portfolioData)
      
      // Correlation analysis
      results.correlationAnalysis = this.correlationAnalysis.analyzeCorrelations(portfolioData.assets || [])
      
      // Stress testing
      results.stressTesting = this.stressTesting.runStressTests(portfolioData)
      
      // Risk parity allocation
      results.riskParity = this.riskParity.calculateRiskParity(portfolioData)
      
      // Calculate overall risk score
      results.summary.overallRiskScore = this.calculateOverallRiskScore(results)
      results.summary.riskLevel = this.assessOverallRiskLevel(results.summary.overallRiskScore)
      results.summary.recommendations = this.generateOverallRecommendations(results)
      results.summary.warnings = this.generateOverallWarnings(results)
      
    } catch (error) {
      console.error('Error in comprehensive risk analysis:', error)
      results.summary.warnings.push('Error in risk analysis - some results may be incomplete')
    }

    return results
  }

  /**
   * Calculate overall risk score
   */
  private calculateOverallRiskScore(results: any): number {
    let score = 0
    
    // Portfolio metrics contribution (30%)
    if (results.portfolioMetrics?.riskScore) {
      score += results.portfolioMetrics.riskScore * 0.3
    }
    
    // Stress testing contribution (25%)
    if (results.stressTesting?.summary?.resilienceScore) {
      score += (100 - results.stressTesting.summary.resilienceScore) * 0.25
    }
    
    // Correlation analysis contribution (20%)
    if (results.correlationAnalysis?.summary?.averageCorrelation) {
      score += results.correlationAnalysis.summary.averageCorrelation * 100 * 0.2
    }
    
    // Risk parity contribution (15%)
    if (results.riskParity?.portfolioMetrics?.volatility) {
      score += results.riskParity.portfolioMetrics.volatility * 100 * 0.15
    }
    
    // Concentration risk contribution (10%)
    if (results.portfolioMetrics?.metrics?.concentrationRisk) {
      score += results.portfolioMetrics.metrics.concentrationRisk * 0.1
    }
    
    return Math.min(100, Math.max(0, score))
  }

  /**
   * Assess overall risk level
   */
  private assessOverallRiskLevel(score: number): 'low' | 'medium' | 'high' | 'extreme' {
    if (score < 25) return 'low'
    if (score < 50) return 'medium'
    if (score < 75) return 'high'
    return 'extreme'
  }

  /**
   * Generate overall recommendations
   */
  private generateOverallRecommendations(results: any): string[] {
    const recommendations: string[] = []
    
    // Portfolio metrics recommendations
    if (results.portfolioMetrics?.recommendations) {
      recommendations.push(...results.portfolioMetrics.recommendations)
    }
    
    // Correlation analysis recommendations
    if (results.correlationAnalysis?.recommendations) {
      recommendations.push(...results.correlationAnalysis.recommendations)
    }
    
    // Stress testing recommendations
    if (results.stressTesting?.portfolioResilience?.recommendations) {
      recommendations.push(...results.stressTesting.portfolioResilience.recommendations)
    }
    
    // Risk parity recommendations
    if (results.riskParity?.recommendations) {
      recommendations.push(...results.riskParity.recommendations)
    }
    
    // Remove duplicates and limit to top recommendations
    const uniqueRecommendations = [...new Set(recommendations)]
    return uniqueRecommendations.slice(0, 10)
  }

  /**
   * Generate overall warnings
   */
  private generateOverallWarnings(results: any): string[] {
    const warnings: string[] = []
    
    // Portfolio metrics warnings
    if (results.portfolioMetrics?.warnings) {
      warnings.push(...results.portfolioMetrics.warnings)
    }
    
    // Correlation analysis warnings
    if (results.correlationAnalysis?.warnings) {
      warnings.push(...results.correlationAnalysis.warnings)
    }
    
    // Stress testing warnings
    if (results.stressTesting?.scenarios) {
      const criticalScenarios = results.stressTesting.scenarios.filter((s: any) => 
        s.resilience.resilienceRating === 'critical'
      )
      if (criticalScenarios.length > 0) {
        warnings.push(`${criticalScenarios.length} critical stress test scenarios detected`)
      }
    }
    
    // Risk parity warnings
    if (results.riskParity?.warnings) {
      warnings.push(...results.riskParity.warnings)
    }
    
    // Remove duplicates and limit to top warnings
    const uniqueWarnings = [...new Set(warnings)]
    return uniqueWarnings.slice(0, 10)
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: any) {
    if (newConfig.positionSizing) {
      this.positionSizing.updateConfig(newConfig.positionSizing)
    }
    if (newConfig.stopLoss) {
      this.stopLoss.updateConfig(newConfig.stopLoss)
    }
    if (newConfig.portfolioMetrics) {
      this.portfolioMetrics.updateConfig(newConfig.portfolioMetrics)
    }
    if (newConfig.correlationAnalysis) {
      this.correlationAnalysis.updateConfig(newConfig.correlationAnalysis)
    }
    if (newConfig.stressTesting) {
      this.stressTesting.updateConfig(newConfig.stressTesting)
    }
    if (newConfig.monteCarlo) {
      this.monteCarlo.updateConfig(newConfig.monteCarlo)
    }
    if (newConfig.riskParity) {
      this.riskParity.updateConfig(newConfig.riskParity)
    }
  }
}

// Factory function to create advanced risk management system
export function createAdvancedRiskManagementSystem(config?: any): AdvancedRiskManagementSystem {
  return new AdvancedRiskManagementSystem(config)
}