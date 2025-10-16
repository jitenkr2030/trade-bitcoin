"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PortfolioOverview } from "@/components/portfolio/portfolio-overview"
import { PerformanceAnalytics } from "@/components/portfolio/performance-analytics"
import { PortfolioHoldings } from "@/components/portfolio/portfolio-holdings"
import { TaxReporting } from "@/components/portfolio/tax-reporting"
import { RiskAssessment } from "@/components/portfolio/risk-assessment"
import { PortfolioRebalancing } from "@/components/portfolio/portfolio-rebalancing"
import { InvestmentGoals } from "@/components/portfolio/investment-goals"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Activity,
  Target,
  RefreshCw,
  Plus,
  Settings,
  Download,
  AlertTriangle
} from "lucide-react"

interface PortfolioAsset {
  id: string
  asset: string
  amount: number
  avgPrice?: number
  value: number
  change24h?: number
  changePercent24h?: number
}

interface Portfolio {
  id: string
  name: string
  description?: string
  type: 'TRADING' | 'INVESTMENT' | 'SIMULATION'
  totalValue: number
  dailyChange?: number
  dailyChangePercent?: number
  totalReturn?: number
  totalReturnPercent?: number
  createdAt: Date
  updatedAt: Date
  assets: PortfolioAsset[]
}

export default function PortfolioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      loadPortfolios()
    }
  }, [status, router])

  const loadPortfolios = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Mock data - in real implementation this would fetch from API
      const mockPortfolios: Portfolio[] = [
        {
          id: '1',
          name: 'Main Trading Portfolio',
          description: 'Active trading portfolio for cryptocurrency and stocks',
          type: 'TRADING',
          totalValue: 125430.50,
          dailyChange: 2847.32,
          dailyChangePercent: 2.3,
          totalReturn: 23850.75,
          totalReturnPercent: 23.8,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          assets: [
            {
              id: '1',
              asset: 'BTC',
              amount: 0.5,
              value: 21500,
              change24h: 500,
              changePercent24h: 2.3
            },
            {
              id: '2',
              asset: 'ETH',
              amount: 5,
              value: 12500,
              change24h: 300,
              changePercent24h: 2.5
            }
          ]
        },
        {
          id: '2',
          name: 'Long-term Investments',
          description: 'Buy and hold investment strategy',
          type: 'INVESTMENT',
          totalValue: 45230.80,
          dailyChange: 520.15,
          dailyChangePercent: 1.2,
          totalReturn: 8234.67,
          totalReturnPercent: 22.3,
          createdAt: new Date('2023-06-01'),
          updatedAt: new Date(),
          assets: [
            {
              id: '3',
              asset: 'AAPL',
              amount: 50,
              value: 8500,
              change24h: 120,
              changePercent24h: 1.4
            },
            {
              id: '4',
              asset: 'GOOGL',
              amount: 10,
              value: 1400,
              change24h: 25,
              changePercent24h: 1.8
            }
          ]
        },
        {
          id: '3',
          name: 'Paper Trading',
          description: 'Simulation portfolio for testing strategies',
          type: 'SIMULATION',
          totalValue: 10000.00,
          dailyChange: 150.25,
          dailyChangePercent: 1.5,
          totalReturn: 2340.50,
          totalReturnPercent: 30.6,
          createdAt: new Date('2024-03-01'),
          updatedAt: new Date(),
          assets: [
            {
              id: '5',
              asset: 'BTC',
              amount: 0.1,
              value: 4300,
              change24h: 100,
              changePercent24h: 2.3
            },
            {
              id: '6',
              asset: 'SOL',
              amount: 20,
              value: 3200,
              change24h: 80,
              changePercent24h: 2.6
            }
          ]
        }
      ]

      setPortfolios(mockPortfolios)
      if (mockPortfolios.length > 0 && !selectedPortfolio) {
        setSelectedPortfolio(mockPortfolios[0].id)
      }
    } catch (err) {
      setError('Failed to load portfolios')
    } finally {
      setIsLoading(false)
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

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    if (change < 0) return <TrendingDown className="h-4 w-4" />
    return null
  }

  const getTotalPortfolioValue = () => {
    return portfolios.reduce((sum, portfolio) => sum + portfolio.totalValue, 0)
  }

  const getTotalDailyChange = () => {
    return portfolios.reduce((sum, portfolio) => sum + (portfolio.dailyChange || 0), 0)
  }

  const getTotalDailyChangePercent = () => {
    const totalValue = getTotalPortfolioValue()
    const totalChange = getTotalDailyChange()
    return totalValue > 0 ? (totalChange / totalValue) * 100 : 0
  }

  const getTotalReturn = () => {
    return portfolios.reduce((sum, portfolio) => sum + (portfolio.totalReturn || 0), 0)
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your investments and performance across all markets
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={loadPortfolios} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push('/portfolio/create')}>
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Portfolio Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalPortfolioValue())}</div>
            <div className="flex items-center gap-1 text-sm">
              {getChangeIcon(getTotalDailyChange())}
              <span className={getChangeColor(getTotalDailyChange())}>
                {formatCurrency(getTotalDailyChange())} ({formatPercent(getTotalDailyChangePercent())})
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getChangeColor(getTotalDailyChange())}`}>
              {formatCurrency(getTotalDailyChange())}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all portfolios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Return</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getChangeColor(getTotalReturn())}`}>
              {formatCurrency(getTotalReturn())}
            </div>
            <p className="text-xs text-muted-foreground">
              Since inception
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Portfolios</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolios.length}</div>
            <p className="text-xs text-muted-foreground">
              {portfolios.filter(p => p.type === 'TRADING').length} trading, {portfolios.filter(p => p.type === 'INVESTMENT').length} investment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Cards */}
      {portfolios.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {portfolios.map((portfolio) => (
            <Card 
              key={portfolio.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedPortfolio === portfolio.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedPortfolio(portfolio.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                  <Badge variant={
                    portfolio.type === 'TRADING' ? 'default' : 
                    portfolio.type === 'INVESTMENT' ? 'secondary' : 'outline'
                  }>
                    {portfolio.type}
                  </Badge>
                </div>
                {portfolio.description && (
                  <CardDescription className="text-sm">
                    {portfolio.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Value</span>
                    <span className="font-semibold">{formatCurrency(portfolio.totalValue)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today's Change</span>
                    <div className="flex items-center gap-1">
                      {getChangeIcon(portfolio.dailyChange || 0)}
                      <span className={`text-sm font-medium ${getChangeColor(portfolio.dailyChange || 0)}`}>
                        {formatCurrency(portfolio.dailyChange || 0)} ({formatPercent(portfolio.dailyChangePercent || 0)})
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Return</span>
                    <div className="flex items-center gap-1">
                      {getChangeIcon(portfolio.totalReturn || 0)}
                      <span className={`text-sm font-medium ${getChangeColor(portfolio.totalReturn || 0)}`}>
                        {formatCurrency(portfolio.totalReturn || 0)} ({formatPercent(portfolio.totalReturnPercent || 0)})
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* No Portfolios State */}
      {portfolios.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-lg font-semibold mb-2">No Portfolios Found</h3>
              <p className="text-gray-600 mb-4">
                Create your first portfolio to start tracking your investments and performance
              </p>
              <Button onClick={() => router.push('/portfolio/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Portfolio View */}
      {selectedPortfolio && portfolios.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="performance">Analytics</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="rebalancing">Rebalance</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <PortfolioOverview
              portfolios={portfolios}
              onCreatePortfolio={() => router.push('/portfolio/create')}
              onRefresh={loadPortfolios}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="holdings" className="space-y-4">
            <PortfolioHoldings portfolioId={selectedPortfolio} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformanceAnalytics
              portfolioId={selectedPortfolio}
              onRefresh={loadPortfolios}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="tax" className="space-y-4">
            <TaxReporting portfolioId={selectedPortfolio} />
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <RiskAssessment portfolioId={selectedPortfolio} />
          </TabsContent>

          <TabsContent value="rebalancing" className="space-y-4">
            <PortfolioRebalancing portfolioId={selectedPortfolio} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <InvestmentGoals portfolioId={selectedPortfolio} />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Recent transactions and trading activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-8 w-8 mx-auto mb-2" />
                  <p>Transaction history will be displayed here</p>
                  <p className="text-sm">This feature is coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}