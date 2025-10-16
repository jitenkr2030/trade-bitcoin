'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  RefreshCw, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Play,
  Pause,
  BarChart3,
  PieChart,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Calculator,
  Calendar,
  Zap
} from "lucide-react"

interface RebalanceSuggestion {
  assetId: string
  assetName: string
  currentAllocation: number
  targetAllocation: number
  deviation: number
  action: 'buy' | 'sell' | 'hold'
  amount: number
  value: number
  priority: 'high' | 'medium' | 'low'
}

interface RebalanceHistory {
  id: string
  date: Date
  triggerType: string
  deviation: number
  beforeValue: number
  afterValue: number
  status: string
  tradesCount: number
}

interface RebalanceConfig {
  enabled: boolean
  frequency: string
  threshold: number
  maxTrades: number
  autoExecute: boolean
  notificationEnabled: boolean
}

interface Props {
  portfolioId: string
}

export function PortfolioRebalancing({ portfolioId }: Props) {
  const [suggestions, setSuggestions] = useState<RebalanceSuggestion[]>([])
  const [history, setHistory] = useState<RebalanceHistory[]>([])
  const [config, setConfig] = useState<RebalanceConfig>({
    enabled: false,
    frequency: 'monthly',
    threshold: 5,
    maxTrades: 10,
    autoExecute: false,
    notificationEnabled: true
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isRebalancing, setIsRebalancing] = useState(false)

  useEffect(() => {
    loadRebalanceData()
  }, [portfolioId])

  const loadRebalanceData = async () => {
    try {
      // Mock rebalance suggestions
      const mockSuggestions: RebalanceSuggestion[] = [
        {
          assetId: 'btc',
          assetName: 'Bitcoin (BTC)',
          currentAllocation: 42.5,
          targetAllocation: 40,
          deviation: 2.5,
          action: 'sell',
          amount: 0.15,
          value: 6487.50,
          priority: 'medium'
        },
        {
          assetId: 'eth',
          assetName: 'Ethereum (ETH)',
          currentAllocation: 28.2,
          targetAllocation: 30,
          deviation: -1.8,
          action: 'buy',
          amount: 0.8,
          value: 1792.00,
          priority: 'medium'
        },
        {
          assetId: 'sol',
          assetName: 'Solana (SOL)',
          currentAllocation: 12.3,
          targetAllocation: 15,
          deviation: -2.7,
          action: 'buy',
          amount: 2.5,
          value: 245.00,
          priority: 'low'
        },
        {
          assetId: 'usdc',
          assetName: 'USD Coin (USDC)',
          currentAllocation: 8.5,
          targetAllocation: 10,
          deviation: -1.5,
          action: 'buy',
          amount: 1500,
          value: 1500.00,
          priority: 'low'
        }
      ]

      const mockHistory: RebalanceHistory[] = [
        {
          id: '1',
          date: new Date('2024-01-15'),
          triggerType: 'SCHEDULED',
          deviation: 8.2,
          beforeValue: 125430,
          afterValue: 125680,
          status: 'COMPLETED',
          tradesCount: 3
        },
        {
          id: '2',
          date: new Date('2023-12-15'),
          triggerType: 'THRESHOLD',
          deviation: 6.5,
          beforeValue: 118230,
          afterValue: 118450,
          status: 'COMPLETED',
          tradesCount: 2
        }
      ]

      setSuggestions(mockSuggestions)
      setHistory(mockHistory)
    } catch (error) {
      console.error('Error loading rebalance data:', error)
    }
  }

  const analyzeRebalance = async () => {
    setIsAnalyzing(true)
    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      loadRebalanceData()
    } catch (error) {
      console.error('Error analyzing rebalance:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const executeRebalance = async () => {
    setIsRebalancing(true)
    try {
      // Simulate rebalancing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Add to history
      const newHistory: RebalanceHistory = {
        id: Date.now().toString(),
        date: new Date(),
        triggerType: 'MANUAL',
        deviation: 8.5,
        beforeValue: 145670,
        afterValue: 145890,
        status: 'COMPLETED',
        tradesCount: suggestions.filter(s => s.action !== 'hold').length
      }
      
      setHistory(prev => [newHistory, ...prev])
      setSuggestions([]) // Clear suggestions after execution
    } catch (error) {
      console.error('Error executing rebalance:', error)
    } finally {
      setIsRebalancing(false)
    }
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatPercent = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-600'
      case 'sell': return 'text-red-600'
      case 'hold': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'buy': return <ArrowRight className="h-4 w-4" />
      case 'sell': return <ArrowLeft className="h-4 w-4" />
      case 'hold': return <Pause className="h-4 w-4" />
      default: return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getDeviations = () => {
    return suggestions.map(s => Math.abs(s.deviation))
  }

  const getMaxDeviation = () => {
    const deviations = getDeviations()
    return deviations.length > 0 ? Math.max(...deviations) : 0
  }

  const getAverageDeviation = () => {
    const deviations = getDeviations()
    return deviations.length > 0 ? deviations.reduce((a, b) => a + b, 0) / deviations.length : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Rebalancing</h2>
          <p className="text-muted-foreground">
            Automatically maintain your target asset allocation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={analyzeRebalance} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Calculator className="h-4 w-4 mr-2" />
            )}
            Analyze
          </Button>
          <Button 
            onClick={executeRebalance} 
            disabled={isRebalancing || suggestions.length === 0}
          >
            {isRebalancing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Execute Rebalance
          </Button>
        </div>
      </div>

      {/* Rebalance Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Deviation</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatPercent(getMaxDeviation())}
            </div>
            <p className="text-xs text-muted-foreground">
              From target allocation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deviation</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(getAverageDeviation())}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all assets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trades Needed</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {suggestions.filter(s => s.action !== 'hold').length}
            </div>
            <p className="text-xs text-muted-foreground">
              To rebalance portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto Rebalance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {config.enabled ? 'Active' : 'Disabled'}
            </div>
            <p className="text-xs text-muted-foreground">
              {config.frequency} frequency
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">Rebalance Suggestions</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Rebalance Analysis</CardTitle>
                  <CardDescription>
                    Recommended trades to maintain target allocation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.assetId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            suggestion.action === 'buy' ? 'bg-green-100' : 
                            suggestion.action === 'sell' ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            {getActionIcon(suggestion.action)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{suggestion.assetName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {suggestion.action === 'buy' ? 'Buy' : suggestion.action === 'sell' ? 'Sell' : 'Hold'} {suggestion.amount} {suggestion.action === 'hold' ? '(no action needed)' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Current</div>
                            <div className="font-semibold">{formatPercent(suggestion.currentAllocation)}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Target</div>
                            <div className="font-semibold">{formatPercent(suggestion.targetAllocation)}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${getActionColor(suggestion.action)}`}>
                              {formatPercent(suggestion.deviation)}
                            </div>
                            <div className="text-sm text-muted-foreground">Deviation</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatCurrency(suggestion.value)}</div>
                            <div className="text-sm text-muted-foreground">Value</div>
                          </div>
                          <Badge variant="outline" className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {getMaxDeviation() > config.threshold && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Rebalance Recommended:</strong> Current deviation ({formatPercent(getMaxDeviation())}) 
                    exceeds your threshold ({formatPercent(config.threshold)}). Consider executing the rebalance.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="text-lg font-semibold mb-2">Portfolio Balanced</h3>
                  <p className="text-gray-600 mb-4">
                    Your portfolio is well-balanced and within target allocation ranges
                  </p>
                  <Button variant="outline" onClick={analyzeRebalance}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Analyze Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rebalancing Configuration</CardTitle>
              <CardDescription>
                Configure automatic rebalancing settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-rebalance">Enable Automatic Rebalancing</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically rebalance portfolio based on your settings
                  </p>
                </div>
                <Switch
                  id="auto-rebalance"
                  checked={config.enabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
                />
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Rebalance Frequency</Label>
                  <Select value={config.frequency} onValueChange={(value) => setConfig(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold">Rebalance Threshold</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="threshold"
                      type="number"
                      value={config.threshold}
                      onChange={(e) => setConfig(prev => ({ ...prev, threshold: parseFloat(e.target.value) }))}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Trigger rebalance when deviation exceeds this threshold
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-trades">Maximum Trades per Rebalance</Label>
                  <Input
                    id="max-trades"
                    type="number"
                    value={config.maxTrades}
                    onChange={(e) => setConfig(prev => ({ ...prev, maxTrades: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auto-execute">Auto-execute Trades</Label>
                  <Switch
                    id="auto-execute"
                    checked={config.autoExecute}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoExecute: checked }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Automatically execute rebalance trades (requires API access)
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts when rebalancing is needed
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={config.notificationEnabled}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, notificationEnabled: checked }))}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => {}}>
                  <Settings className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={() => setConfig({
                  enabled: false,
                  frequency: 'monthly',
                  threshold: 5,
                  maxTrades: 10,
                  autoExecute: false,
                  notificationEnabled: true
                })}>
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rebalancing Strategies</CardTitle>
              <CardDescription>
                Different approaches to portfolio rebalancing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold">Threshold Rebalancing</h4>
                  <p className="text-sm text-muted-foreground">
                    Rebalance when asset allocations deviate from targets by a specified percentage
                  </p>
                  <Badge variant="outline">Recommended</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Calendar Rebalancing</h4>
                  <p className="text-sm text-muted-foreground">
                    Rebalance on a regular schedule regardless of market conditions
                  </p>
                  <Badge variant="outline">Simple</Badge>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Optimization Rebalancing</h4>
                  <p className="text-sm text-muted-foreground">
                    Use advanced algorithms to optimize for tax efficiency and costs
                  </p>
                  <Badge variant="outline">Advanced</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {history.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          record.status === 'COMPLETED' ? 'bg-green-100' : 
                          record.status === 'FAILED' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          {record.status === 'COMPLETED' ? 
                            <CheckCircle className="h-4 w-4 text-green-600" /> :
                            record.status === 'FAILED' ? 
                            <AlertTriangle className="h-4 w-4 text-red-600" /> :
                            <Clock className="h-4 w-4 text-yellow-600" />
                          }
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{record.triggerType}</h3>
                            <Badge variant={record.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {record.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {record.date.toLocaleDateString()} • {record.tradesCount} trades executed
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Deviation</div>
                        <div className="font-semibold">{formatPercent(record.deviation)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Before</div>
                        <div className="font-semibold">{formatCurrency(record.beforeValue)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">After</div>
                        <div className="font-semibold">{formatCurrency(record.afterValue)}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          record.afterValue > record.beforeValue ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(record.afterValue - record.beforeValue)}
                        </div>
                        <div className="text-sm text-muted-foreground">Change</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}