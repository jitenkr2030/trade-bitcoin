'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Activity,
  Target,
  Shield,
  Zap,
  Calendar,
  Clock,
  Award,
  Download,
  Share2,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  BarChart,
  PieChart,
  LineChart
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart,
  Area,
  AreaChart,
  ScatterChart,
  Scatter
} from 'recharts'

interface BotPerformance {
  id: string
  name: string
  type: 'grid' | 'dca' | 'arbitrage' | 'momentum' | 'mean-reversion' | 'ml-based' | 'sentiment'
  status: 'running' | 'paused' | 'stopped'
  creator: string
  duration: string
  performance: {
    totalReturn: number
    annualizedReturn: number
    winRate: number
    profitFactor: number
    sharpeRatio: number
    sortinoRatio: number
    maxDrawdown: number
    calmarRatio: number
    beta: number
    alpha: number
    informationRatio: number
  }
  trading: {
    totalTrades: number
    winningTrades: number
    losingTrades: number
    avgWin: number
    avgLoss: number
    largestWin: number
    largestLoss: number
    avgTradeDuration: string
    profitFactor: number
  }
  risk: {
    volatility: number
    var95: number
    var99: number
    expectedShortfall: number
    beta: number
    correlation: number
  }
  monthlyReturns: { month: string; return: number }[]
  drawdownData: { date: string; drawdown: number }[]
  equityCurve: { date: string; value: number }[]
  tradesDistribution: { range: string; count: number }[]
}

const mockBots: BotPerformance[] = [
  {
    id: '1',
    name: 'BTC Grid Master',
    type: 'grid',
    status: 'running',
    creator: 'You',
    duration: '6 months',
    performance: {
      totalReturn: 45.2,
      annualizedReturn: 89.5,
      winRate: 68.5,
      profitFactor: 2.34,
      sharpeRatio: 2.1,
      sortinoRatio: 2.8,
      maxDrawdown: -12.8,
      calmarRatio: 7.0,
      beta: 0.85,
      alpha: 15.2,
      informationRatio: 1.8
    },
    trading: {
      totalTrades: 234,
      winningTrades: 160,
      losingTrades: 74,
      avgWin: 234,
      avgLoss: -156,
      largestWin: 1200,
      largestLoss: -450,
      avgTradeDuration: '2.3 hours',
      profitFactor: 2.34
    },
    risk: {
      volatility: 18.5,
      var95: -8.2,
      var99: -12.5,
      expectedShortfall: -10.8,
      beta: 0.85,
      correlation: 0.72
    },
    monthlyReturns: [
      { month: 'Jan', return: 5.2 },
      { month: 'Feb', return: 8.1 },
      { month: 'Mar', return: -2.3 },
      { month: 'Apr', return: 12.4 },
      { month: 'May', return: 15.8 },
      { month: 'Jun', return: 3.2 }
    ],
    drawdownData: [
      { date: 'Jan', drawdown: -2.1 },
      { date: 'Feb', drawdown: -5.8 },
      { date: 'Mar', drawdown: -12.8 },
      { date: 'Apr', drawdown: -8.2 },
      { date: 'May', drawdown: -3.1 },
      { date: 'Jun', drawdown: -1.2 }
    ],
    equityCurve: [
      { date: 'Jan', value: 10000 },
      { date: 'Feb', value: 10520 },
      { date: 'Mar', value: 11372 },
      { date: 'Apr', value: 11110 },
      { date: 'May', value: 12488 },
      { date: 'Jun', value: 14520 }
    ],
    tradesDistribution: [
      { range: '-$500 to -$200', count: 12 },
      { range: '-$200 to $0', count: 62 },
      { range: '$0 to $200', count: 98 },
      { range: '$200 to $500', count: 45 },
      { range: '$500+', count: 17 }
    ]
  },
  {
    id: '2',
    name: 'ETH DCA Accumulator',
    type: 'dca',
    status: 'running',
    creator: 'You',
    duration: '4 months',
    performance: {
      totalReturn: 32.8,
      annualizedReturn: 78.2,
      winRate: 72.3,
      profitFactor: 2.89,
      sharpeRatio: 1.9,
      sortinoRatio: 2.4,
      maxDrawdown: -8.5,
      calmarRatio: 9.2,
      beta: 0.92,
      alpha: 12.8,
      informationRatio: 1.5
    },
    trading: {
      totalTrades: 89,
      winningTrades: 64,
      losingTrades: 25,
      avgWin: 456,
      avgLoss: -234,
      largestWin: 2100,
      largestLoss: -680,
      avgTradeDuration: '1.2 days',
      profitFactor: 2.89
    },
    risk: {
      volatility: 15.2,
      var95: -6.8,
      var99: -9.2,
      expectedShortfall: -8.1,
      beta: 0.92,
      correlation: 0.68
    },
    monthlyReturns: [
      { month: 'Mar', return: 8.5 },
      { month: 'Apr', return: 12.2 },
      { month: 'May', return: 6.8 },
      { month: 'Jun', return: 3.1 }
    ],
    drawdownData: [
      { date: 'Mar', drawdown: -3.2 },
      { date: 'Apr', drawdown: -6.1 },
      { date: 'May', drawdown: -8.5 },
      { date: 'Jun', drawdown: -2.8 }
    ],
    equityCurve: [
      { date: 'Mar', value: 10000 },
      { date: 'Apr', value: 10850 },
      { date: 'May', value: 12172 },
      { date: 'Jun', value: 12998 }
    ],
    tradesDistribution: [
      { range: '-$500 to -$200', count: 8 },
      { range: '-$200 to $0', count: 17 },
      { range: '$0 to $200', count: 32 },
      { range: '$200 to $500', count: 24 },
      { range: '$500+', count: 8 }
    ]
  },
  {
    id: '3',
    name: 'Market Arbitrage Pro',
    type: 'arbitrage',
    status: 'paused',
    creator: 'CryptoArb',
    duration: '3 months',
    performance: {
      totalReturn: 18.5,
      annualizedReturn: 62.3,
      winRate: 89.2,
      profitFactor: 4.12,
      sharpeRatio: 3.2,
      sortinoRatio: 4.1,
      maxDrawdown: -3.2,
      calmarRatio: 19.5,
      beta: 0.15,
      alpha: 8.5,
      informationRatio: 2.8
    },
    trading: {
      totalTrades: 456,
      winningTrades: 407,
      losingTrades: 49,
      avgWin: 45,
      avgLoss: -89,
      largestWin: 234,
      largestLoss: -156,
      avgTradeDuration: '5 minutes',
      profitFactor: 4.12
    },
    risk: {
      volatility: 8.5,
      var95: -2.1,
      var99: -3.2,
      expectedShortfall: -2.8,
      beta: 0.15,
      correlation: 0.12
    },
    monthlyReturns: [
      { month: 'Apr', return: 5.8 },
      { month: 'May', return: 7.2 },
      { month: 'Jun', return: 4.2 }
    ],
    drawdownData: [
      { date: 'Apr', drawdown: -1.2 },
      { date: 'May', drawdown: -2.8 },
      { date: 'Jun', drawdown: -3.2 }
    ],
    equityCurve: [
      { date: 'Apr', value: 10000 },
      { date: 'May', value: 10580 },
      { date: 'Jun', value: 11342 }
    ],
    tradesDistribution: [
      { range: '-$200 to $0', count: 49 },
      { range: '$0 to $200', count: 385 },
      { range: '$200 to $500', count: 22 }
    ]
  }
]

export default function PerformanceComparisonPage() {
  const [selectedBots, setSelectedBots] = useState<string[]>(['1', '2'])
  const [timeframe, setTimeframe] = useState('6m')
  const [metric, setMetric] = useState('return')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [benchmark, setBenchmark] = useState('btc')

  const availableBots = mockBots.filter(bot => !selectedBots.includes(bot.id))
  const comparisonData = mockBots.filter(bot => selectedBots.includes(bot.id))

  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case 'grid': return '⊞'
      case 'dca': return '↻'
      case 'arbitrage': return '⇄'
      case 'ml-based': return '🧠'
      case 'sentiment': return '📊'
      default: return '🤖'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'paused': return 'bg-yellow-500'
      case 'stopped': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const radarData = [
    { metric: 'Return', fullMark: 100 },
    { metric: 'Win Rate', fullMark: 100 },
    { metric: 'Sharpe', fullMark: 5 },
    { metric: 'Profit Factor', fullMark: 5 },
    { metric: 'Stability', fullMark: 100 },
    { metric: 'Risk Adj', fullMark: 100 }
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance Comparison</h1>
          <p className="text-muted-foreground">
            Compare trading bot performance across multiple metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={benchmark} onValueChange={setBenchmark}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="btc">BTC</SelectItem>
              <SelectItem value="eth">ETH</SelectItem>
              <SelectItem value="spy">SPY</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Bot Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Select Bots to Compare
          </CardTitle>
          <CardDescription>
            Choose up to 5 trading bots to compare their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Selected Bots */}
            <div>
              <Label className="text-sm font-medium">Selected Bots ({selectedBots.length}/5)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {comparisonData.map(bot => (
                  <div key={bot.id} className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                    <span className="text-sm">{getBotTypeIcon(bot.type)} {bot.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedBots(prev => prev.filter(id => id !== bot.id))}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {selectedBots.length < 5 && availableBots.length > 0 && (
                  <Select onValueChange={(value) => setSelectedBots(prev => [...prev, value])}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Add bot to compare" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBots.map(bot => (
                        <SelectItem key={bot.id} value={bot.id}>
                          {getBotTypeIcon(bot.type)} {bot.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced Metrics
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Comparison
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      {comparisonData.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {comparisonData.map(bot => (
            <Card key={bot.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(bot.status)}`} />
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {getBotTypeIcon(bot.type)} {bot.type.toUpperCase()} • {bot.creator}
                    </CardDescription>
                  </div>
                  <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                    {bot.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Return</p>
                    <p className={`font-semibold ${getPerformanceColor(bot.performance.totalReturn)}`}>
                      {formatPercent(bot.performance.totalReturn)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Win Rate</p>
                    <p className="font-semibold">{bot.performance.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sharpe Ratio</p>
                    <p className="font-semibold">{bot.performance.sharpeRatio}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Drawdown</p>
                    <p className={`font-semibold ${getPerformanceColor(bot.performance.maxDrawdown)}`}>
                      {formatPercent(bot.performance.maxDrawdown)}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Duration: {bot.duration}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detailed Comparison */}
      {comparisonData.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="trading">Trading Stats</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Metrics Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Total Return', key: 'totalReturn', suffix: '%' },
                    { label: 'Annualized Return', key: 'annualizedReturn', suffix: '%' },
                    { label: 'Win Rate', key: 'winRate', suffix: '%' },
                    { label: 'Profit Factor', key: 'profitFactor', suffix: '' },
                    { label: 'Sharpe Ratio', key: 'sharpeRatio', suffix: '' },
                    { label: 'Max Drawdown', key: 'maxDrawdown', suffix: '%' }
                  ].map(metric => (
                    <div key={metric.key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <div className="flex gap-4">
                          {comparisonData.map(bot => (
                            <span key={bot.id} className={`text-sm font-semibold ${getPerformanceColor(bot.performance[metric.key as keyof typeof bot.performance] as number)}`}>
                              {(bot.performance[metric.key as keyof typeof bot.performance] as number).toFixed(2)}{metric.suffix}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {comparisonData.map(bot => (
                          <div key={bot.id} className="flex items-center gap-2">
                            <span className="text-xs w-16">{bot.name}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${bot.performance[metric.key as keyof typeof bot.performance] as number >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ 
                                  width: `${Math.min(Math.abs(bot.performance[metric.key as keyof typeof bot.performance] as number) * 2, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Equity Curve Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Equity Curve Comparison</CardTitle>
                <CardDescription>Portfolio value over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={comparisonData[0]?.equityCurve || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {comparisonData.map((bot, index) => (
                        <Line 
                          key={bot.id}
                          type="monotone" 
                          dataKey="value" 
                          data={bot.equityCurve}
                          stroke={['#8884d8', '#82ca9d', '#ffc658'][index]}
                          name={bot.name}
                          strokeWidth={2}
                        />
                      ))}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Monthly Returns Heatmap */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
                <CardDescription>Monthly performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-8 gap-2 text-xs">
                    <div></div>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map(month => (
                      <div key={month} className="text-center font-medium">{month}</div>
                    ))}
                  </div>
                  {comparisonData.map(bot => (
                    <div key={bot.id} className="grid grid-cols-8 gap-2">
                      <div className="text-xs font-medium flex items-center">{bot.name}</div>
                      {bot.monthlyReturns.map((monthData, index) => (
                        <div 
                          key={index}
                          className={`text-xs text-center p-2 rounded ${
                            monthData.return >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {formatPercent(monthData.return)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Drawdown Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Drawdown Analysis</CardTitle>
                <CardDescription>Maximum drawdown periods comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={comparisonData[0]?.drawdownData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {comparisonData.map((bot, index) => (
                        <Area 
                          key={bot.id}
                          type="monotone" 
                          dataKey="drawdown" 
                          data={bot.drawdownData}
                          stackId="1"
                          stroke={['#ff7300', '#00ff00', '#0088fe'][index]}
                          fill={['#ff7300', '#00ff00', '#0088fe'][index]}
                          fillOpacity={0.6}
                          name={bot.name}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            {/* Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics Comparison</CardTitle>
                <CardDescription>Risk-adjusted performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Volatility', key: 'volatility', suffix: '%' },
                    { label: 'VaR (95%)', key: 'var95', suffix: '%' },
                    { label: 'VaR (99%)', key: 'var99', suffix: '%' },
                    { label: 'Expected Shortfall', key: 'expectedShortfall', suffix: '%' },
                    { label: 'Beta', key: 'beta', suffix: '' },
                    { label: 'Correlation', key: 'correlation', suffix: '' }
                  ].map(metric => (
                    <div key={metric.key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <div className="flex gap-4">
                          {comparisonData.map(bot => (
                            <span key={bot.id} className="text-sm font-semibold">
                              {(bot.risk[metric.key as keyof typeof bot.risk] as number).toFixed(2)}{metric.suffix}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {comparisonData.map(bot => (
                          <div key={bot.id} className="flex items-center gap-2">
                            <span className="text-xs w-16">{bot.name}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-blue-500"
                                style={{ 
                                  width: `${Math.abs(bot.risk[metric.key as keyof typeof bot.risk] as number) * 5}%` 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk-Return Scatter */}
            <Card>
              <CardHeader>
                <CardTitle>Risk vs Return</CardTitle>
                <CardDescription>Risk-adjusted returns comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="risk" name="Risk" unit="%" />
                      <YAxis type="number" dataKey="return" name="Return" unit="%" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      {comparisonData.map((bot, index) => ({
                        x: bot.risk.volatility,
                        y: bot.performance.totalReturn,
                        z: 100,
                        name: bot.name
                      })).map((point, index) => (
                        <Scatter 
                          key={index}
                          data={[point]}
                          fill={['#8884d8', '#82ca9d', '#ffc658'][index]}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            {/* Trading Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Statistics</CardTitle>
                <CardDescription>Detailed trading performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Total Trades', key: 'totalTrades', suffix: '' },
                    { label: 'Winning Trades', key: 'winningTrades', suffix: '' },
                    { label: 'Losing Trades', key: 'losingTrades', suffix: '' },
                    { label: 'Average Win', key: 'avgWin', suffix: '$' },
                    { label: 'Average Loss', key: 'avgLoss', suffix: '$' },
                    { label: 'Largest Win', key: 'largestWin', suffix: '$' },
                    { label: 'Largest Loss', key: 'largestLoss', suffix: '$' },
                    { label: 'Average Trade Duration', key: 'avgTradeDuration', suffix: '' }
                  ].map(metric => (
                    <div key={metric.key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <div className="flex gap-4">
                          {comparisonData.map(bot => (
                            <span key={bot.id} className="text-sm font-semibold">
                              {metric.suffix === '$' ? formatCurrency(bot.trading[metric.key as keyof typeof bot.trading] as number) : (bot.trading[metric.key as keyof typeof bot.trading] as number)}{metric.suffix}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Trade Distribution</CardTitle>
                <CardDescription>Profit/loss distribution of trades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={comparisonData[0]?.tradesDistribution || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {comparisonData.map((bot, index) => (
                        <Bar 
                          key={bot.id}
                          dataKey="count" 
                          fill={['#8884d8', '#82ca9d', '#ffc658'][index]}
                          name={bot.name}
                        />
                      ))}
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            {/* Advanced Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Advanced Performance Metrics</CardTitle>
                <CardDescription>Professional-grade performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'Sortino Ratio', key: 'sortinoRatio', suffix: '' },
                    { label: 'Calmar Ratio', key: 'calmarRatio', suffix: '' },
                    { label: 'Alpha', key: 'alpha', suffix: '%' },
                    { label: 'Information Ratio', key: 'informationRatio', suffix: '' },
                    { label: 'Beta', key: 'beta', suffix: '' },
                    { label: 'Profit Factor', key: 'profitFactor', suffix: '' }
                  ].map(metric => (
                    <div key={metric.key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <div className="flex gap-4">
                          {comparisonData.map(bot => (
                            <span key={bot.id} className="text-sm font-semibold">
                              {(bot.performance[metric.key as keyof typeof bot.performance] as number).toFixed(2)}{metric.suffix}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        {comparisonData.map(bot => (
                          <div key={bot.id} className="flex items-center gap-2">
                            <span className="text-xs w-16">{bot.name}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full bg-purple-500"
                                style={{ 
                                  width: `${Math.min(Math.abs(bot.performance[metric.key as keyof typeof bot.performance] as number) * 20, 100)}%` 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>Multi-dimensional performance comparison</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis />
                      <Legend />
                      {comparisonData.map((bot, index) => (
                        <Radar 
                          key={bot.id}
                          name={bot.name}
                          dataKey="fullMark"
                          stroke={['#8884d8', '#82ca9d', '#ffc658'][index]}
                          fill={['#8884d8', '#82ca9d', '#ffc658'][index]}
                          fillOpacity={0.1}
                        />
                      ))}
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {comparisonData.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Bots Selected</h3>
            <p className="text-muted-foreground text-center mb-4">
              Select trading bots to compare their performance metrics
            </p>
            <Button onClick={() => setSelectedBots(['1', '2'])}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sample Bots
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}