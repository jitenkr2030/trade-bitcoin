"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Clock,
  Wallet,
  Target,
  Activity,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Settings,
  Star,
  Eye,
  TrendingDown as TrendDown,
  Building2,
  Bitcoin,
  DollarSign as DollarIcon
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardNav } from "@/components/dashboard-nav"
import Link from "next/link"

interface User {
  id: string
  name: string
  email: string
  role: string
  plan: string
}

interface Portfolio {
  id: string
  name: string
  totalValue: number
  dailyChange: number
  dailyChangePercent: number
  currency: string
}

interface Asset {
  id: string
  symbol: string
  name: string
  assetType: string
  quantity: number
  currentPrice: number
  value: number
  allocation: number
  dailyChange: number
  dailyChangePercent: number
}

interface CopyTrade {
  id: string
  traderName: string
  traderAvatar: string
  allocation: number
  copiedPnL: number
  copiedTrades: number
  status: string
}

export default function InvestorDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [copyTrades, setCopyTrades] = useState<CopyTrade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user session from cookie
    const userSession = document.cookie
      .split('; ')
      .find(row => row.startsWith('user-session='))
      ?.split('=')[1]

    if (userSession) {
      try {
        const userData = JSON.parse(decodeURIComponent(userSession))
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user session:', error)
      }
    }

    // Mock data for demonstration
    setTimeout(() => {
      setPortfolios([
        {
          id: "1",
          name: "Growth Portfolio",
          totalValue: 125430.50,
          dailyChange: 2847.32,
          dailyChangePercent: 2.3,
          currency: "USD"
        },
        {
          id: "2",
          name: "Conservative Portfolio",
          totalValue: 75200.00,
          dailyChange: 450.80,
          dailyChangePercent: 0.6,
          currency: "USD"
        }
      ])

      setAssets([
        {
          id: "1",
          symbol: "BTC",
          name: "Bitcoin",
          assetType: "CRYPTO",
          quantity: 2.5,
          currentPrice: 43250,
          value: 108125,
          allocation: 45,
          dailyChange: 1250,
          dailyChangePercent: 2.5
        },
        {
          id: "2",
          symbol: "ETH",
          name: "Ethereum",
          assetType: "CRYPTO",
          quantity: 15,
          currentPrice: 2180,
          value: 32700,
          allocation: 30,
          dailyChange: 420,
          dailyChangePercent: 1.8
        },
        {
          id: "3",
          symbol: "AAPL",
          name: "Apple Inc.",
          assetType: "STOCK",
          quantity: 100,
          currentPrice: 175.20,
          value: 17520,
          allocation: 15,
          dailyChange: -120,
          dailyChangePercent: -0.5
        },
        {
          id: "4",
          symbol: "EURUSD",
          name: "EUR/USD",
          assetType: "FOREX",
          quantity: 10000,
          currentPrice: 1.0850,
          value: 10850,
          allocation: 10,
          dailyChange: 15,
          dailyChangePercent: 0.1
        }
      ])

      setCopyTrades([
        {
          id: "1",
          traderName: "Sarah Chen",
          traderAvatar: "SC",
          allocation: 20,
          copiedPnL: 3240,
          copiedTrades: 156,
          status: "ACTIVE"
        },
        {
          id: "2",
          traderName: "Marcus Rodriguez",
          traderAvatar: "MR",
          allocation: 15,
          copiedPnL: 1890,
          copiedTrades: 89,
          status: "ACTIVE"
        },
        {
          id: "3",
          traderName: "Emily Watson",
          traderAvatar: "EW",
          allocation: 10,
          copiedPnL: 980,
          copiedTrades: 67,
          status: "PAUSED"
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const totalPortfolioValue = portfolios.reduce((sum, portfolio) => sum + portfolio.totalValue, 0)
  const totalDailyChange = portfolios.reduce((sum, portfolio) => sum + portfolio.dailyChange, 0)
  const totalDailyChangePercent = (totalDailyChange / totalPortfolioValue) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardNav user={user!} dashboardType="investor" />

      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Investor'}!</h1>
            <p className="text-muted-foreground">
              Here's your portfolio overview and investment performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Portfolio
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</div>
              <p className={`text-xs ${totalDailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalDailyChange >= 0 ? '+' : ''}{totalDailyChange.toLocaleString()} ({totalDailyChangePercent.toFixed(2)}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Return</CardTitle>
              {totalDailyChange >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalDailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalDailyChange >= 0 ? '+' : ''}${totalDailyChange.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalDailyChangePercent.toFixed(2)}% daily return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Copy Trades</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{copyTrades.filter(ct => ct.status === 'ACTIVE').length}</div>
              <p className="text-xs text-muted-foreground">
                Following top traders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Diversity</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                Asset classes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="portfolios" className="space-y-4">
          <TabsList>
            <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
            <TabsTrigger value="assets">Asset Allocation</TabsTrigger>
            <TabsTrigger value="copy-trading">Copy Trading</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolios" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {portfolios.map((portfolio) => (
                <Card key={portfolio.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{portfolio.name}</CardTitle>
                      <Badge variant="outline">
                        {portfolio.currency}
                      </Badge>
                    </div>
                    <CardDescription>
                      Portfolio performance overview
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Value</span>
                        <span className="font-medium">${portfolio.totalValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Today's Change</span>
                        <span className={`font-medium ${portfolio.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.dailyChange >= 0 ? '+' : ''}${portfolio.dailyChange.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Daily Return</span>
                        <span className={`font-medium ${portfolio.dailyChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.dailyChangePercent >= 0 ? '+' : ''}{portfolio.dailyChangePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Your current portfolio distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                            {asset.assetType === 'CRYPTO' && <Bitcoin className="w-4 h-4" />}
                            {asset.assetType === 'STOCK' && <Building2 className="w-4 h-4" />}
                            {asset.assetType === 'FOREX' && <DollarIcon className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-medium">{asset.symbol}</div>
                            <div className="text-sm text-muted-foreground">{asset.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${asset.value.toLocaleString()}</div>
                          <div className={`text-sm ${asset.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {asset.dailyChange >= 0 ? '+' : ''}{asset.dailyChangePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>{asset.allocation}% allocation</span>
                        <span className="text-muted-foreground">{asset.quantity} units</span>
                      </div>
                      <Progress value={asset.allocation} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="copy-trading" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {copyTrades.map((copyTrade) => (
                <Card key={copyTrade.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {copyTrade.traderAvatar}
                        </div>
                        <div>
                          <CardTitle className="text-base">{copyTrade.traderName}</CardTitle>
                          <CardDescription>Top Trader</CardDescription>
                        </div>
                      </div>
                      <Badge 
                        variant={copyTrade.status === 'ACTIVE' ? 'outline' : 'secondary'}
                        className="gap-1"
                      >
                        {copyTrade.status === 'ACTIVE' ? (
                          <Activity className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {copyTrade.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Allocation</div>
                        <div className="font-medium">{copyTrade.allocation}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Copied P&L</div>
                        <div className={`font-medium ${copyTrade.copiedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${copyTrade.copiedPnL.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Trades Copied:</span>
                        <span className="font-medium">{copyTrade.copiedTrades}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg. per Trade:</span>
                        <span className="font-medium">
                          ${(copyTrade.copiedPnL / copyTrade.copiedTrades).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key investment indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Return</span>
                      <span className="font-medium text-green-600">+24.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Annualized Return</span>
                      <span className="font-medium text-green-600">+18.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Volatility</span>
                      <span className="font-medium">12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sharpe Ratio</span>
                      <span className="font-medium">1.46</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Max Drawdown</span>
                      <span className="font-medium text-red-600">-8.3%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>Portfolio risk metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cryptocurrency Risk</span>
                        <span className="font-medium">High</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stock Market Risk</span>
                        <span className="font-medium">Medium</span>
                      </div>
                      <Progress value={50} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Forex Risk</span>
                        <span className="font-medium">Low</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Risk Score</span>
                      <Badge variant="outline">Medium</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}