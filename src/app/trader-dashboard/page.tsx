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
  Bot, 
  BarChart3, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Target,
  Shield,
  Zap,
  Play,
  Pause,
  Settings,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit
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

interface TradingStrategy {
  id: string
  name: string
  description: string
  strategy: string
  status: string
  totalPnL: number
  winRate: number
  totalTrades: number
  symbol: string
  timeframe: string
}

interface Trade {
  id: string
  symbol: string
  side: string
  amount: string
  price: string
  pnl: string
  time: string
}

export default function TraderDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [bots, setBots] = useState<TradingStrategy[]>([])
  const [recentTrades, setRecentTrades] = useState<Trade[]>([])
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
      setBots([
        {
          id: "1",
          name: "EMA Crossover",
          description: "Trend-following strategy",
          strategy: "EMA_CROSSOVER",
          status: "RUNNING",
          totalPnL: 342.50,
          winRate: 79.2,
          totalTrades: 24,
          symbol: "BTC/USD",
          timeframe: "15m"
        },
        {
          id: "2",
          name: "RSI Scalper",
          description: "High-frequency trading",
          strategy: "RSI_SCALPER",
          status: "RUNNING",
          totalPnL: 156.80,
          winRate: 68.7,
          totalTrades: 67,
          symbol: "ETH/USD",
          timeframe: "5m"
        },
        {
          id: "3",
          name: "Arbitrage Bot",
          description: "Multi-exchange arbitrage",
          strategy: "ARBITRAGE",
          status: "PAUSED",
          totalPnL: 1247.30,
          winRate: 85.4,
          totalTrades: 156,
          symbol: "Multi",
          timeframe: "1m"
        }
      ])

      setRecentTrades([
        { id: "1", symbol: "BTC/USD", side: "Buy", amount: "0.125", price: "$43,250", pnl: "+$125.50", time: "2 min ago" },
        { id: "2", symbol: "ETH/USD", side: "Sell", amount: "2.5", price: "$2,180", pnl: "+$45.20", time: "15 min ago" },
        { id: "3", symbol: "AAPL", side: "Buy", amount: "10", price: "$175.20", pnl: "-$12.40", time: "1 hour ago" },
        { id: "4", symbol: "EUR/USD", side: "Sell", amount: "1000", price: "$1.0850", pnl: "+$8.50", time: "2 hours ago" }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const toggleBotStatus = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId 
        ? { ...bot, status: bot.status === 'RUNNING' ? 'PAUSED' : 'RUNNING' }
        : bot
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardNav user={user!} dashboardType="trader" />

      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Trader'}!</h1>
            <p className="text-muted-foreground">
              Here's your trading overview and bot performance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Bot
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
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125,430.50</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's P&L</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+$2,847.32</div>
              <p className="text-xs text-muted-foreground">
                +2.3% daily return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2/3</div>
              <p className="text-xs text-muted-foreground">
                Running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73.2%</div>
              <p className="text-xs text-muted-foreground">
                347 wins / 127 losses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="bots" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bots">Trading Strategies</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
          </TabsList>

          <TabsContent value="bots" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bots.map((bot) => (
                <Card key={bot.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{bot.name}</CardTitle>
                      <Badge 
                        variant={bot.status === 'RUNNING' ? 'outline' : 'secondary'}
                        className="gap-1"
                      >
                        {bot.status === 'RUNNING' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {bot.status}
                      </Badge>
                    </div>
                    <CardDescription>{bot.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Symbol</div>
                        <div className="font-medium">{bot.symbol}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Timeframe</div>
                        <div className="font-medium">{bot.timeframe}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total P&L:</span>
                        <span className={`font-medium ${bot.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${bot.totalPnL.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Win Rate:</span>
                        <span className="font-medium">{bot.winRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Trades:</span>
                        <span className="font-medium">{bot.totalTrades}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleBotStatus(bot.id)}
                        className="flex-1"
                      >
                        {bot.status === 'RUNNING' ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </>
                        )}
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

          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>Your latest trading activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTrades.map((trade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${trade.side === 'Buy' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <div className="font-medium">{trade.symbol}</div>
                          <div className="text-sm text-muted-foreground">{trade.side} {trade.amount}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{trade.price}</div>
                        <div className={`text-sm ${trade.pnl.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.pnl}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{trade.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key trading indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sharpe Ratio</span>
                      <span className="font-medium">2.34</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Max Drawdown</span>
                      <span className="font-medium text-red-600">-12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Profit Factor</span>
                      <span className="font-medium text-green-600">1.87</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg. Trade Duration</span>
                      <span className="font-medium">2.4h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strategy Performance</CardTitle>
                  <CardDescription>Breakdown by strategy type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>EMA Crossover</span>
                        <span className="font-medium">+15.2%</span>
                      </div>
                      <Progress value={75} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>RSI Scalper</span>
                        <span className="font-medium">+22.8%</span>
                      </div>
                      <Progress value={90} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Arbitrage</span>
                        <span className="font-medium">+8.4%</span>
                      </div>
                      <Progress value={42} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="markets" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { symbol: "BTC/USD", price: "$43,250.00", change: "+2.5%", volume: "2.1B" },
                { symbol: "ETH/USD", price: "$2,180.50", change: "+1.8%", volume: "1.5B" },
                { symbol: "AAPL", price: "$175.20", change: "-0.5%", volume: "45.2M" },
                { symbol: "EUR/USD", price: "$1.0850", change: "+0.1%", volume: "89.3M" },
              ].map((market, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{market.symbol}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">{market.price}</div>
                      <div className={`text-sm ${market.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {market.change}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Vol: {market.volume}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}