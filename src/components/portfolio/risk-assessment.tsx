'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Target,
  RefreshCw,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Database,
  Eye,
  CheckCircle,
  Clock
} from "lucide-react"

interface RiskMetrics {
  volatility: number
  maxDrawdown: number
  sharpeRatio: number
  sortinoRatio: number
  beta: number
  alpha: number
  var: number // Value at Risk
  expectedShortfall: number
  diversificationScore: number
  concentrationRisk: number
}

interface CorrelationMatrix {
  asset1: string;
  asset2: string;
  correlation: number;
}

interface RiskRecommendation {
  type: 'warning' | 'suggestion' | 'action'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  impact: string
  solution: string
}

interface StressTestResult {
  scenario: string
  impact: number
  probability: string
  description: string
}

interface Props {
  portfolioId: string
}

export function RiskAssessment({ portfolioId }: Props) {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [correlations, setCorrelations] = useState<CorrelationMatrix[]>([])
  const [recommendations, setRecommendations] = useState<RiskRecommendation[]>([])
  const [stressTests, setStressTests] = useState<StressTestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadRiskAssessment()
  }, [portfolioId])

  const loadRiskAssessment = async () => {
    setIsLoading(true)
    try {
      // Mock risk metrics
      const mockRiskMetrics: RiskMetrics = {
        volatility: 18.5,
        maxDrawdown: -12.3,
        sharpeRatio: 1.8,
        sortinoRatio: 2.1,
        beta: 1.2,
        alpha: 3.4,
        var: -8.5,
        expectedShortfall: -12.1,
        diversificationScore: 72,
        concentrationRisk: 28
      }

      const mockCorrelations: CorrelationMatrix[] = [
        { asset1: 'BTC', asset2: 'ETH', correlation: 0.85 },
        { asset1: 'BTC', asset2: 'SOL', correlation: 0.72 },
        { asset1: 'ETH', asset2: 'SOL', correlation: 0.68 },
        { asset1: 'BTC', asset2: 'USDC', correlation: -0.15 },
        { asset1: 'ETH', asset2: 'USDC', correlation: -0.12 }
      ]

      const mockRecommendations: RiskRecommendation[] = [
        {
          type: 'warning',
          priority: 'high',
          title: 'High Correlation Risk',
          description: 'Your portfolio has high correlation between major crypto assets',
          impact: 'Increased volatility and reduced diversification benefits',
          solution: 'Consider adding uncorrelated assets like stablecoins or traditional assets'
        },
        {
          type: 'suggestion',
          priority: 'medium',
          title: 'Suboptimal Risk-Adjusted Returns',
          description: 'Sharpe ratio could be improved with better asset allocation',
          impact: 'Lower risk-adjusted returns than optimal',
          solution: 'Rebalance portfolio to optimize risk-adjusted returns'
        },
        {
          type: 'action',
          priority: 'critical',
          title: 'Concentration Risk',
          description: 'Single asset represents over 40% of portfolio value',
          impact: 'High exposure to single asset risk',
          solution: 'Diversify by reducing position size or adding complementary assets'
        }
      ]

      const mockStressTests: StressTestResult[] = [
        {
          scenario: 'Market Crash (-30%)',
          impact: -25.4,
          probability: '5%',
          description: 'Severe market downturn affecting all risk assets'
        },
        {
          scenario: 'Crypto Winter (-50%)',
          impact: -42.8,
          probability: '2%',
          description: 'Extended bear market in cryptocurrency'
        },
        {
          scenario: 'Interest Rate Hike (+2%)',
          impact: -8.2,
          probability: '15%',
          description: 'Central bank interest rate increases'
        },
        {
          scenario: 'Exchange Failure',
          impact: -15.6,
          probability: '1%',
          description: 'Major exchange insolvency or hack'
        }
      ]

      setRiskMetrics(mockRiskMetrics)
      setCorrelations(mockCorrelations)
      setRecommendations(mockRecommendations)
      setStressTests(mockStressTests)
    } catch (error) {
      console.error('Error loading risk assessment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPercent = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const getRiskLevel = (value: number, thresholds: { low: number; medium: number; high: number }) => {
    if (Math.abs(value) <= thresholds.low) return { level: 'low', color: 'text-green-600' }
    if (Math.abs(value) <= thresholds.medium) return { level: 'medium', color: 'text-yellow-600' }
    return { level: 'high', color: 'text-red-600' }
  }

  const getCorrelationColor = (correlation: number) => {
    const abs = Math.abs(correlation)
    if (abs >= 0.8) return 'text-red-600'
    if (abs >= 0.6) return 'text-yellow-600'
    if (abs >= 0.4) return 'text-orange-600'
    return 'text-green-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <Clock className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Risk Assessment</h2>
          <p className="text-muted-foreground">
            Comprehensive risk analysis and portfolio health assessment
          </p>
        </div>
        <Button variant="outline" onClick={loadRiskAssessment} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Analysis
        </Button>
      </div>

      {/* Risk Score Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Medium</div>
            <Progress value={65} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              65/100 risk level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volatility</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(riskMetrics?.volatility || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Annualized volatility
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatPercent(riskMetrics?.maxDrawdown || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Worst historical loss
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{riskMetrics?.sharpeRatio?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              Risk-adjusted return
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">Risk Metrics</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
                <CardDescription>Key risk indicators for your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Volatility (Annual)</span>
                  <span className="font-semibold">{formatPercent(riskMetrics?.volatility || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maximum Drawdown</span>
                  <span className="font-semibold text-red-600">{formatPercent(riskMetrics?.maxDrawdown || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sharpe Ratio</span>
                  <span className="font-semibold text-green-600">{riskMetrics?.sharpeRatio?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sortino Ratio</span>
                  <span className="font-semibold text-green-600">{riskMetrics?.sortinoRatio?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Beta (vs Market)</span>
                  <span className="font-semibold">{riskMetrics?.beta?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Alpha (Excess Return)</span>
                  <span className="font-semibold text-green-600">{formatPercent(riskMetrics?.alpha || 0)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span>Value at Risk (95%)</span>
                  <span className="font-semibold text-red-600">{formatPercent(riskMetrics?.var || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Expected Shortfall</span>
                  <span className="font-semibold text-red-600">{formatPercent(riskMetrics?.expectedShortfall || 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Health</CardTitle>
                <CardDescription>Diversification and concentration metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Diversification Score</span>
                    <span>{riskMetrics?.diversificationScore || 0}%</span>
                  </div>
                  <Progress value={riskMetrics?.diversificationScore || 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher is better (target: &gt;70%)
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Concentration Risk</span>
                    <span>{riskMetrics?.concentrationRisk || 0}%</span>
                  </div>
                  <Progress value={riskMetrics?.concentrationRisk || 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower is better (target: &lt;20%)
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {correlations.filter(c => Math.abs(c.correlation) < 0.3).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Low Correlations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {correlations.filter(c => Math.abs(c.correlation) > 0.7).length}
                    </div>
                    <div className="text-sm text-muted-foreground">High Correlations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Level Indicators */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Assessment</CardTitle>
              <CardDescription>Current risk levels across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Market Risk</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Medium</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Moderate exposure to market volatility
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Concentration Risk</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">High</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    High concentration in few assets
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Liquidity Risk</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Low</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Good liquidity across holdings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
              <CardDescription>How your assets move in relation to each other</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correlations.map((corr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{corr.asset1}</span>
                        <span className="text-gray-400">vs</span>
                        <span className="font-medium">{corr.asset2}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`font-semibold ${getCorrelationColor(corr.correlation)}`}>
                        {corr.correlation.toFixed(3)}
                      </div>
                      <div className="w-20">
                        <Progress 
                          value={Math.abs(corr.correlation) * 100} 
                          className="h-2" 
                        />
                      </div>
                      <Badge variant="outline" className={getCorrelationColor(corr.correlation)}>
                        {Math.abs(corr.correlation) >= 0.8 ? 'High' :
                         Math.abs(corr.correlation) >= 0.6 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Correlation Analysis</CardTitle>
              <CardDescription>Key insights about portfolio correlations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High Correlation Detected:</strong> BTC and ETH show 85% correlation, 
                    indicating limited diversification benefits between these major holdings.
                  </AlertDescription>
                </Alert>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">Benefits of Low Correlation</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Reduced portfolio volatility</li>
                      <li>• Better risk-adjusted returns</li>
                      <li>• Improved diversification</li>
                      <li>• Enhanced downside protection</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Risks of High Correlation</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Amplified market movements</li>
                      <li>• Reduced diversification benefits</li>
                      <li>• Increased concentration risk</li>
                      <li>• Higher portfolio volatility</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${getPriorityColor(rec.priority)}`}>
                      {getPriorityIcon(rec.priority)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{rec.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(rec.priority)}>
                          {rec.priority}
                        </Badge>
                        <Badge variant={rec.type === 'warning' ? 'destructive' : rec.type === 'action' ? 'default' : 'secondary'}>
                          {rec.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.description}
                      </p>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Impact</h4>
                          <p className="text-sm text-muted-foreground">{rec.impact}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Solution</h4>
                          <p className="text-sm text-muted-foreground">{rec.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stress Testing Results</CardTitle>
              <CardDescription>Portfolio performance under various market scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stressTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold">{test.scenario}</h4>
                        <p className="text-sm text-muted-foreground">{test.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`font-semibold ${test.impact < -15 ? 'text-red-600' : test.impact < -5 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {formatPercent(test.impact)}
                        </div>
                        <div className="text-sm text-muted-foreground">Portfolio Impact</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{test.probability}</div>
                        <div className="text-sm text-muted-foreground">Probability</div>
                      </div>
                      <Badge variant={test.impact < -15 ? 'destructive' : test.impact < -5 ? 'outline' : 'default'}>
                        {test.impact < -15 ? 'Severe' : test.impact < -5 ? 'Moderate' : 'Mild'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Mitigation Strategies</CardTitle>
              <CardDescription>Recommended actions to improve portfolio resilience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Defensive Strategies</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Increase stablecoin allocation to 15-20%</li>
                    <li>• Add uncorrelated assets (real estate, commodities)</li>
                    <li>• Implement stop-loss orders on volatile positions</li>
                    <li>• Maintain cash reserves for opportunities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Proactive Measures</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Regular portfolio rebalancing</li>
                    <li>• Diversify across different sectors</li>
                    <li>• Monitor correlation changes regularly</li>
                    <li>• Set up automated risk alerts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}