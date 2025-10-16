'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Shield, 
  Zap,
  RefreshCw,
  Calendar,
  DollarSign,
  Percent,
  Download,
  FileText,
  Share2,
  Mail
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'

interface PerformanceMetrics {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalProfit: number
  totalLoss: number
  netProfit: number
  profitFactor: number
  maxDrawdown: number
  sharpeRatio: number
  sortinoRatio: number
  calmarRatio: number
  totalReturn: number
  annualizedReturn: number
  volatility: number
  bestTrade?: number
  worstTrade?: number
  avgWinningTrade?: number
  avgLosingTrade?: number
  avgTrade?: number
}

interface TimeSeriesData {
  date: string
  value: number
  returns?: number
  drawdown?: number
}

interface TradeAnalysis {
  symbol: string
  tradeCount: number
  totalVolume: number
  netProfit: number
  winRate: number
  avgProfit: number
  maxProfit: number
  maxLoss: number
  profitFactor: number
}

interface PerformanceAnalyticsProps {
  portfolioId?: string
  timeRange?: '24h' | '7d' | '30d' | '90d' | '1y' | 'all'
  onRefresh?: () => void
  isLoading?: boolean
}

interface BenchmarkData {
  name: string
  type: 'index' | 'etf' | 'competitor' | 'custom'
  symbol: string
  description: string
  data: TimeSeriesData[]
  metrics: PerformanceMetrics
}

interface AttributionData {
  category: string
  contribution: number
  allocation: number
  selection: number
  interaction: number
}

export function PerformanceAnalytics({ 
  portfolioId, 
  timeRange = '30d',
  onRefresh, 
  isLoading = false 
}: PerformanceAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)
  const [selectedMetric, setSelectedMetric] = useState('returns')
  const [selectedBenchmarks, setSelectedBenchmarks] = useState<string[]>(['SPY', 'BTC'])
  const [showAttribution, setShowAttribution] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')
  const [isExporting, setIsExporting] = useState(false)
  
  // Mock benchmark data
  const [benchmarks] = useState<BenchmarkData[]>([
    {
      name: 'S&P 500',
      type: 'index',
      symbol: 'SPY',
      description: 'US Large Cap Index',
      data: [
        { date: '2024-01-01', value: 10000, returns: 0, drawdown: 0 },
        { date: '2024-01-02', value: 10080, returns: 0.8, drawdown: 0 },
        { date: '2024-01-03', value: 10050, returns: -0.3, drawdown: 0.3 },
        { date: '2024-01-04', value: 10120, returns: 0.7, drawdown: 0 },
        { date: '2024-01-05', value: 10100, returns: -0.2, drawdown: 0.2 },
        { date: '2024-01-06', value: 10180, returns: 0.8, drawdown: 0 },
        { date: '2024-01-07', value: 10250, returns: 0.7, drawdown: 0 },
        { date: '2024-01-08', value: 10220, returns: -0.3, drawdown: 0.3 },
        { date: '2024-01-09', value: 10300, returns: 0.8, drawdown: 0 },
        { date: '2024-01-10', value: 10350, returns: 0.5, drawdown: 0 },
      ],
      metrics: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 350,
        profitFactor: 0,
        maxDrawdown: 3.2,
        sharpeRatio: 0.95,
        sortinoRatio: 1.2,
        calmarRatio: 0.8,
        totalReturn: 3.5,
        annualizedReturn: 4.2,
        volatility: 4.1,
        bestTrade: 0,
        worstTrade: 0,
        avgWinningTrade: 0,
        avgLosingTrade: 0,
        avgTrade: 0
      }
    },
    {
      name: 'Bitcoin',
      type: 'index',
      symbol: 'BTC',
      description: 'Bitcoin Price Index',
      data: [
        { date: '2024-01-01', value: 10000, returns: 0, drawdown: 0 },
        { date: '2024-01-02', value: 10400, returns: 4.0, drawdown: 0 },
        { date: '2024-01-03', value: 10200, returns: -1.9, drawdown: 1.9 },
        { date: '2024-01-04', value: 10800, returns: 5.9, drawdown: 0 },
        { date: '2024-01-05', value: 10600, returns: -1.9, drawdown: 1.9 },
        { date: '2024-01-06', value: 11200, returns: 5.7, drawdown: 0 },
        { date: '2024-01-07', value: 11500, returns: 2.7, drawdown: 0 },
        { date: '2024-01-08', value: 11300, returns: -1.7, drawdown: 1.7 },
        { date: '2024-01-09', value: 11800, returns: 4.4, drawdown: 0 },
        { date: '2024-01-10', value: 12000, returns: 1.7, drawdown: 0 },
      ],
      metrics: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 2000,
        profitFactor: 0,
        maxDrawdown: 8.5,
        sharpeRatio: 1.8,
        sortinoRatio: 2.1,
        calmarRatio: 1.4,
        totalReturn: 20.0,
        annualizedReturn: 24.0,
        volatility: 12.3,
        bestTrade: 0,
        worstTrade: 0,
        avgWinningTrade: 0,
        avgLosingTrade: 0,
        avgTrade: 0
      }
    },
    {
      name: 'Tech Giants ETF',
      type: 'etf',
      symbol: 'QQQ',
      description: 'Nasdaq 100 ETF',
      data: [
        { date: '2024-01-01', value: 10000, returns: 0, drawdown: 0 },
        { date: '2024-01-02', value: 10150, returns: 1.5, drawdown: 0 },
        { date: '2024-01-03', value: 10100, returns: -0.5, drawdown: 0.5 },
        { date: '2024-01-04', value: 10300, returns: 2.0, drawdown: 0 },
        { date: '2024-01-05', value: 10250, returns: -0.5, drawdown: 0.5 },
        { date: '2024-01-06', value: 10450, returns: 2.0, drawdown: 0 },
        { date: '2024-01-07', value: 10550, returns: 1.0, drawdown: 0 },
        { date: '2024-01-08', value: 10500, returns: -0.5, drawdown: 0.5 },
        { date: '2024-01-09', value: 10700, returns: 1.9, drawdown: 0 },
        { date: '2024-01-10', value: 10800, returns: 0.9, drawdown: 0 },
      ],
      metrics: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalProfit: 0,
        totalLoss: 0,
        netProfit: 800,
        profitFactor: 0,
        maxDrawdown: 4.8,
        sharpeRatio: 1.2,
        sortinoRatio: 1.5,
        calmarRatio: 1.0,
        totalReturn: 8.0,
        annualizedReturn: 9.6,
        volatility: 6.2,
        bestTrade: 0,
        worstTrade: 0,
        avgWinningTrade: 0,
        avgLosingTrade: 0,
        avgTrade: 0
      }
    }
  ])

  // Mock attribution data
  const [attributionData] = useState<AttributionData[]>([
    { category: 'Crypto', contribution: 8.5, allocation: 2.3, selection: 5.8, interaction: 0.4 },
    { category: 'Stocks', contribution: 4.2, allocation: 1.8, selection: 2.1, interaction: 0.3 },
    { category: 'DeFi', contribution: 2.1, allocation: 0.8, selection: 1.2, interaction: 0.1 },
    { category: 'NFTs', contribution: 0.4, allocation: -0.2, selection: 0.6, interaction: 0.0 }
  ])
  
  // Mock data - in real implementation this would come from API
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    totalTrades: 156,
    winningTrades: 89,
    losingTrades: 67,
    winRate: 57.05,
    totalProfit: 25430,
    totalLoss: 18920,
    netProfit: 6510,
    profitFactor: 1.34,
    maxDrawdown: 12.5,
    sharpeRatio: 1.85,
    sortinoRatio: 2.12,
    calmarRatio: 1.47,
    totalReturn: 15.2,
    annualizedReturn: 18.5,
    volatility: 8.3,
    bestTrade: 1250,
    worstTrade: -680,
    avgWinningTrade: 285.7,
    avgLosingTrade: -282.4,
    avgTrade: 41.7
  })

  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([
    { date: '2024-01-01', value: 10000, returns: 0, drawdown: 0 },
    { date: '2024-01-02', value: 10250, returns: 2.5, drawdown: 0 },
    { date: '2024-01-03', value: 10180, returns: -0.7, drawdown: 0.7 },
    { date: '2024-01-04', value: 10420, returns: 2.4, drawdown: 0 },
    { date: '2024-01-05', value: 10350, returns: -0.7, drawdown: 0.7 },
    { date: '2024-01-06', value: 10580, returns: 2.2, drawdown: 0 },
    { date: '2024-01-07', value: 10720, returns: 1.3, drawdown: 0 },
    { date: '2024-01-08', value: 10650, returns: -0.7, drawdown: 0.7 },
    { date: '2024-01-09', value: 10890, returns: 2.3, drawdown: 0 },
    { date: '2024-01-10', value: 11050, returns: 1.5, drawdown: 0 },
  ])

  const [tradeAnalysis, setTradeAnalysis] = useState<TradeAnalysis[]>([
    {
      symbol: 'BTCUSDT',
      tradeCount: 45,
      totalVolume: 125000,
      netProfit: 3200,
      winRate: 62.2,
      avgProfit: 71.1,
      maxProfit: 450,
      maxLoss: -280,
      profitFactor: 1.45
    },
    {
      symbol: 'ETHUSDT',
      tradeCount: 38,
      totalVolume: 95000,
      netProfit: 2100,
      winRate: 55.3,
      avgProfit: 55.3,
      maxProfit: 320,
      maxLoss: -190,
      profitFactor: 1.28
    },
    {
      symbol: 'SOLUSDT',
      tradeCount: 32,
      totalVolume: 64000,
      netProfit: 890,
      winRate: 53.1,
      avgProfit: 27.8,
      maxProfit: 180,
      maxLoss: -120,
      profitFactor: 1.18
    },
    {
      symbol: 'BNBUSDT',
      tradeCount: 28,
      totalVolume: 42000,
      netProfit: 320,
      winRate: 50.0,
      avgProfit: 11.4,
      maxProfit: 95,
      maxLoss: -85,
      profitFactor: 1.05
    }
  ])

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const formatPercent = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  const getMetricColor = (value: number, type: 'higher' | 'lower' = 'higher') => {
    if (type === 'higher') {
      return value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'
    } else {
      return value < 0 ? 'text-green-600' : value > 0 ? 'text-red-600' : 'text-gray-600'
    }
  }

  const getMetricIcon = (value: number, type: 'higher' | 'lower' = 'higher') => {
    if (type === 'higher') {
      return value > 0 ? <TrendingUp className="h-4 w-4" /> : value < 0 ? <TrendingDown className="h-4 w-4" /> : null
    } else {
      return value < 0 ? <TrendingUp className="h-4 w-4" /> : value > 0 ? <TrendingDown className="h-4 w-4" /> : null
    }
  }

  const assetAllocationData = tradeAnalysis.map(asset => ({
    name: asset.symbol,
    value: Math.abs(asset.netProfit),
    profit: asset.netProfit > 0
  }))

  const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6']

  const handleBenchmarkToggle = (symbol: string) => {
    setSelectedBenchmarks(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    )
  }

  const getBenchmarkData = (symbol: string) => {
    return benchmarks.find(b => b.symbol === symbol)
  }

  const comparisonData = timeSeriesData.map((point, index) => {
    const comparisonPoint: any = {
      date: point.date,
      Portfolio: point.value,
      returns: point.returns
    }
    
    selectedBenchmarks.forEach(symbol => {
      const benchmark = getBenchmarkData(symbol)
      if (benchmark && benchmark.data[index]) {
        comparisonPoint[symbol] = benchmark.data[index].value
      }
    })
    
    return comparisonPoint
  })

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate report data
      const reportData = {
        portfolio: {
          id: portfolioId,
          timeRange: selectedTimeRange,
          performance,
          benchmarks: selectedBenchmarks.map(symbol => getBenchmarkData(symbol)),
          attribution: attributionData,
          tradeAnalysis,
          generatedAt: new Date().toISOString()
        }
      }
      
      // In real implementation, this would generate actual files
      console.log('Exporting report:', reportData)
      
      // Show success message
      alert(`Report exported successfully as ${exportFormat.toUpperCase()}!`)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
      setShowExportOptions(false)
    }
  }

  const generateReportSummary = () => {
    const totalValue = timeSeriesData[timeSeriesData.length - 1]?.value || 0
    const totalReturn = performance.totalReturn
    const benchmarkComparison = selectedBenchmarks.map(symbol => {
      const benchmark = getBenchmarkData(symbol)
      return benchmark ? {
        symbol,
        name: benchmark.name,
        return: benchmark.metrics.totalReturn,
        outperformance: totalReturn - benchmark.metrics.totalReturn
      } : null
    }).filter(Boolean)

    return {
      totalValue,
      totalReturn,
      benchmarkComparison,
      keyMetrics: {
        sharpeRatio: performance.sharpeRatio,
        maxDrawdown: performance.maxDrawdown,
        winRate: performance.winRate,
        volatility: performance.volatility
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Detailed performance metrics and benchmark comparisons
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
              <SelectItem value="1y">1y</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant={showAttribution ? "default" : "outline"}
            onClick={() => setShowAttribution(!showAttribution)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Attribution
          </Button>
          <div className="relative">
            <Button 
              variant="outline" 
              onClick={() => setShowExportOptions(!showExportOptions)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {showExportOptions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                <div className="p-3 space-y-2">
                  <div className="text-sm font-medium">Export Format</div>
                  <div className="space-y-1">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="pdf"
                        checked={exportFormat === 'pdf'}
                        onChange={(e) => setExportFormat(e.target.value as 'pdf')}
                      />
                      <span className="text-sm">PDF Report</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="excel"
                        checked={exportFormat === 'excel'}
                        onChange={(e) => setExportFormat(e.target.value as 'excel')}
                      />
                      <span className="text-sm">Excel Workbook</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="csv"
                        checked={exportFormat === 'csv'}
                        onChange={(e) => setExportFormat(e.target.value as 'csv')}
                      />
                      <span className="text-sm">CSV Data</span>
                    </label>
                  </div>
                  <div className="pt-2 space-y-1">
                    <Button 
                      size="sm" 
                      className="w-full" 
                      onClick={handleExport}
                      disabled={isExporting}
                    >
                      {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Benchmark Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Benchmark Comparison</CardTitle>
          <CardDescription>Select benchmarks to compare against your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {benchmarks.map((benchmark) => (
              <Button
                key={benchmark.symbol}
                variant={selectedBenchmarks.includes(benchmark.symbol) ? "default" : "outline"}
                size="sm"
                onClick={() => handleBenchmarkToggle(benchmark.symbol)}
              >
                {benchmark.name} ({benchmark.symbol})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(performance.totalReturn)}`}>
              {formatPercent(performance.totalReturn)}
            </div>
            <div className="flex items-center gap-1 text-sm">
              {getMetricIcon(performance.totalReturn)}
              <span className={getMetricColor(performance.totalReturn)}>
                Annualized: {formatPercent(performance.annualizedReturn)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(performance.winRate)}</div>
            <div className="text-sm text-gray-600">
              {performance.winningTrades}W / {performance.losingTrades}L
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(performance.profitFactor)}</div>
            <div className="text-sm text-gray-600">
              {formatCurrency(performance.totalProfit)} / {formatCurrency(performance.totalLoss)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(performance.maxDrawdown, 'lower')}`}>
              {formatPercent(performance.maxDrawdown)}
            </div>
            <div className="text-sm text-gray-600">
              Risk metric
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Equity Curve with Benchmarks */}
        <Card>
          <CardHeader>
            <CardTitle>Equity Curve vs Benchmarks</CardTitle>
            <CardDescription>Portfolio performance compared to selected benchmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [formatCurrency(value), name]}
                />
                <Line 
                  type="monotone" 
                  dataKey="Portfolio" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={false}
                />
                {selectedBenchmarks.map((symbol, index) => (
                  <Line 
                    key={symbol}
                    type="monotone" 
                    dataKey={symbol} 
                    stroke={COLORS[index + 1]}
                    strokeWidth={2}
                    strokeDasharray="5,5"
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Relative Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Relative Performance</CardTitle>
            <CardDescription>Portfolio performance relative to benchmarks (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData.map((point, index) => ({
                date: point.date,
                ...selectedBenchmarks.reduce((acc, symbol) => {
                  const benchmark = getBenchmarkData(symbol)
                  if (benchmark && benchmark.data[index]) {
                    const portfolioReturn = point.returns || 0
                    const benchmarkReturn = benchmark.data[index].returns || 0
                    acc[symbol] = portfolioReturn - benchmarkReturn
                  }
                  return acc
                }, {} as any)
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tickFormatter={(value) => formatPercent(value)} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [formatPercent(value), 'Outperformance']}
                />
                {selectedBenchmarks.map((symbol, index) => (
                  <Bar 
                    key={symbol}
                    dataKey={symbol} 
                    fill={COLORS[index + 1]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Benchmark Metrics Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Benchmark Metrics Comparison</CardTitle>
            <CardDescription>Key performance metrics compared to benchmarks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-medium">Metric</div>
                <div className="font-medium">Portfolio vs Benchmarks</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Total Return</div>
                <div className="space-y-1">
                  <div className="font-medium">{formatPercent(performance.totalReturn)}</div>
                  {selectedBenchmarks.map(symbol => {
                    const benchmark = getBenchmarkData(symbol)
                    if (!benchmark) return null
                    const diff = performance.totalReturn - benchmark.metrics.totalReturn
                    return (
                      <div key={symbol} className="flex justify-between">
                        <span>{symbol}:</span>
                        <span className={getMetricColor(diff, 'higher')}>
                          {formatPercent(benchmark.metrics.totalReturn)} ({diff > 0 ? '+' : ''}{formatPercent(diff)})
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Sharpe Ratio</div>
                <div className="space-y-1">
                  <div className="font-medium">{formatNumber(performance.sharpeRatio)}</div>
                  {selectedBenchmarks.map(symbol => {
                    const benchmark = getBenchmarkData(symbol)
                    if (!benchmark) return null
                    const diff = performance.sharpeRatio - benchmark.metrics.sharpeRatio
                    return (
                      <div key={symbol} className="flex justify-between">
                        <span>{symbol}:</span>
                        <span className={getMetricColor(diff, 'higher')}>
                          {formatNumber(benchmark.metrics.sharpeRatio)} ({diff > 0 ? '+' : ''}{formatNumber(diff)})
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Max Drawdown</div>
                <div className="space-y-1">
                  <div className="font-medium">{formatPercent(performance.maxDrawdown)}</div>
                  {selectedBenchmarks.map(symbol => {
                    const benchmark = getBenchmarkData(symbol)
                    if (!benchmark) return null
                    const diff = performance.maxDrawdown - benchmark.metrics.maxDrawdown
                    return (
                      <div key={symbol} className="flex justify-between">
                        <span>{symbol}:</span>
                        <span className={getMetricColor(diff, 'lower')}>
                          {formatPercent(benchmark.metrics.maxDrawdown)} ({diff > 0 ? '+' : ''}{formatPercent(diff)})
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Attribution */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Attribution</CardTitle>
            <CardDescription>Breakdown of performance by asset category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attributionData.map((item) => (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.category}</span>
                    <span className={`text-sm font-medium ${getMetricColor(item.contribution)}`}>
                      {formatPercent(item.contribution)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>Allocation: {formatPercent(item.allocation)}</div>
                    <div>Selection: {formatPercent(item.selection)}</div>
                    <div>Interaction: {formatPercent(item.interaction)}</div>
                  </div>
                  <Progress 
                    value={Math.abs(item.contribution) * 10} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Risk Analysis</CardTitle>
          <CardDescription>Comprehensive risk metrics and correlation analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Risk Metrics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Risk Metrics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Value at Risk (95%)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-red-600">
                      {formatCurrency(-2500)}
                    </span>
                  </div>
                </div>
                <Progress value={75} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expected Shortfall</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-red-600">
                      {formatCurrency(-4200)}
                    </span>
                  </div>
                </div>
                <Progress value={85} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Beta (vs SPY)</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">
                      {formatNumber(1.2)}
                    </span>
                  </div>
                </div>
                <Progress value={60} className="h-2" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Information Ratio</span>
                  <div className="flex items-center gap-1">
                    {getMetricIcon(0.8)}
                    <span className={`text-sm font-medium ${getMetricColor(0.8)}`}>
                      {formatNumber(0.8)}
                    </span>
                  </div>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>

            {/* Correlation Matrix */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Correlation Matrix</h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Portfolio</TableHead>
                      <TableHead>SPY</TableHead>
                      <TableHead>BTC</TableHead>
                      <TableHead>QQQ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Portfolio</TableCell>
                      <TableCell>1.00</TableCell>
                      <TableCell>0.65</TableCell>
                      <TableCell>0.82</TableCell>
                      <TableCell>0.71</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">SPY</TableCell>
                      <TableCell>0.65</TableCell>
                      <TableCell>1.00</TableCell>
                      <TableCell>0.45</TableCell>
                      <TableCell>0.92</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">BTC</TableCell>
                      <TableCell>0.82</TableCell>
                      <TableCell>0.45</TableCell>
                      <TableCell>1.00</TableCell>
                      <TableCell>0.38</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">QQQ</TableCell>
                      <TableCell>0.71</TableCell>
                      <TableCell>0.92</TableCell>
                      <TableCell>0.38</TableCell>
                      <TableCell>1.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Outperformance</span>
              </div>
              <p className="text-sm text-gray-600">
                Portfolio outperformed {selectedBenchmarks.length} benchmarks with {formatPercent(performance.totalReturn)} total return
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm font-medium">Risk-Adjusted Returns</span>
              </div>
              <p className="text-sm text-gray-600">
                Strong risk-adjusted performance with Sharpe ratio of {formatNumber(performance.sharpeRatio)}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm font-medium">Diversification</span>
              </div>
              <p className="text-sm text-gray-600">
                Well-diversified across multiple asset classes with low correlation to traditional markets
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Summary of the performance report that will be exported</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Portfolio Overview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Portfolio Value:</span>
                    <span className="font-medium">{formatCurrency(generateReportSummary().totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Return:</span>
                    <span className={`font-medium ${getMetricColor(generateReportSummary().totalReturn)}`}>
                      {formatPercent(generateReportSummary().totalReturn)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Period:</span>
                    <span className="font-medium">{selectedTimeRange}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Benchmark Comparison</h3>
                <div className="space-y-2 text-sm">
                  {generateReportSummary().benchmarkComparison.map((benchmark) => (
                    benchmark && (
                      <div key={benchmark.symbol} className="flex justify-between">
                        <span>{benchmark.name}:</span>
                        <span className={`font-medium ${getMetricColor(benchmark.outperformance)}`}>
                          {formatPercent(benchmark.return)} ({benchmark.outperformance > 0 ? '+' : ''}{formatPercent(benchmark.outperformance)})
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm text-gray-600">
                    Report includes performance metrics, benchmark analysis, risk assessment, and attribution analysis
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
