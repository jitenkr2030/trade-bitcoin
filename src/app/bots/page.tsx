"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { 
  Bot, 
  Plus, 
  Play, 
  Pause, 
  Square, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Brain,
  BarChart3,
  RefreshCw,
  Edit,
  Trash2,
  Copy
} from "lucide-react"
import { useState } from "react"

export default function BotsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const bots = [
    {
      id: "1",
      name: "EMA Crossover Bot",
      strategy: "EMA_CROSSOVER",
      strategyType: "TECHNICAL_ANALYSIS",
      status: "RUNNING",
      symbol: "BTC/USD",
      timeframe: "15m",
      totalPnL: 3425.50,
      dailyPnL: 125.30,
      winRate: 73.2,
      totalTrades: 247,
      currentInvestment: 10000,
      maxInvestment: 15000,
      createdAt: "2024-01-15",
      lastRun: "2 minutes ago"
    },
    {
      id: "2",
      name: "RSI Scalper",
      strategy: "RSI_SCALPER",
      strategyType: "TECHNICAL_ANALYSIS",
      status: "RUNNING",
      symbol: "ETH/USD",
      timeframe: "5m",
      totalPnL: 1847.32,
      dailyPnL: 67.80,
      winRate: 68.7,
      totalTrades: 523,
      currentInvestment: 5000,
      maxInvestment: 8000,
      createdAt: "2024-01-20",
      lastRun: "1 minute ago"
    },
    {
      id: "3",
      name: "AI Market Predictor",
      strategy: "CUSTOM",
      strategyType: "MACHINE_LEARNING",
      status: "PAUSED",
      symbol: "Multiple",
      timeframe: "1h",
      totalPnL: 5234.67,
      dailyPnL: 0,
      winRate: 76.5,
      totalTrades: 89,
      currentInvestment: 20000,
      maxInvestment: 25000,
      createdAt: "2024-02-01",
      lastRun: "2 hours ago"
    },
    {
      id: "4",
      name: "Arbitrage Hunter",
      strategy: "ARBITRAGE",
      strategyType: "ARBITRAGE",
      status: "ERROR",
      symbol: "Multi-exchange",
      timeframe: "Real-time",
      totalPnL: 847.90,
      dailyPnL: -23.40,
      winRate: 92.1,
      totalTrades: 38,
      currentInvestment: 15000,
      maxInvestment: 20000,
      createdAt: "2024-02-10",
      lastRun: "30 minutes ago"
    }
  ]

  const strategies = [
    { value: "EMA_CROSSOVER", label: "EMA Crossover", type: "TECHNICAL_ANALYSIS", description: "Trade based on EMA crossover signals" },
    { value: "RSI_SCALPER", label: "RSI Scalper", type: "TECHNICAL_ANALYSIS", description: "Scalp trades using RSI oversold/overbought levels" },
    { value: "BOLLINGER_BANDS", label: "Bollinger Bands", type: "TECHNICAL_ANALYSIS", description: "Trade Bollinger Bands breakouts and reversals" },
    { value: "MACD", label: "MACD Strategy", type: "TECHNICAL_ANALYSIS", description: "MACD divergence and crossover trading" },
    { value: "ARBITRAGE", label: "Arbitrage", type: "ARBITRAGE", description: "Exploit price differences between exchanges" },
    { value: "GRID_TRADING", label: "Grid Trading", type: "TECHNICAL_ANALYSIS", description: "Place buy/sell orders in a grid pattern" },
    { value: "DCA", label: "Dollar Cost Averaging", type: "TECHNICAL_ANALYSIS", description: "Average into positions over time" },
    { value: "MARTINGALE", label: "Martingale", type: "TECHNICAL_ANALYSIS", description: "Double position size on losses" },
    { value: "CUSTOM", label: "Custom AI Strategy", type: "MACHINE_LEARNING", description: "AI-powered market prediction" }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "PAUSED":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "ERROR":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RUNNING":
        return <Badge className="bg-green-100 text-green-800">Running</Badge>
      case "PAUSED":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
      case "ERROR":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default:
        return <Badge variant="secondary">Stopped</Badge>
    }
  }

  const getStrategyTypeIcon = (type: string) => {
    switch (type) {
      case "TECHNICAL_ANALYSIS":
        return <BarChart3 className="h-4 w-4" />
      case "MACHINE_LEARNING":
        return <Brain className="h-4 w-4" />
      case "ARBITRAGE":
        return <Zap className="h-4 w-4" />
      default:
        return <Bot className="h-4 w-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Bots</h1>
          <p className="text-muted-foreground">
            Manage your automated trading strategies and bots
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Bot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Trading Bot</DialogTitle>
                <DialogDescription>
                  Configure a new trading bot with your preferred strategy
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="botName">Bot Name</Label>
                    <Input id="botName" placeholder="My Trading Bot" />
                  </div>
                  <div>
                    <Label htmlFor="strategy">Strategy</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {strategies.map((strategy) => (
                          <SelectItem key={strategy.value} value={strategy.value}>
                            {strategy.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="symbol">Trading Pair</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select symbol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BTC/USD">BTC/USD</SelectItem>
                        <SelectItem value="ETH/USD">ETH/USD</SelectItem>
                        <SelectItem value="AAPL">AAPL</SelectItem>
                        <SelectItem value="EUR/USD">EUR/USD</SelectItem>
                        <SelectItem value="MULTIPLE">Multiple Pairs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeframe">Timeframe</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">1 minute</SelectItem>
                        <SelectItem value="5m">5 minutes</SelectItem>
                        <SelectItem value="15m">15 minutes</SelectItem>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="4h">4 hours</SelectItem>
                        <SelectItem value="1d">1 day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="investment">Investment Amount</Label>
                    <Input id="investment" placeholder="10000" type="number" />
                  </div>
                  <div>
                    <Label htmlFor="maxInvestment">Max Investment</Label>
                    <Input id="maxInvestment" placeholder="15000" type="number" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" placeholder="Bot description and purpose" />
                </div>

                <div className="space-y-3">
                  <Label>Bot Settings</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="paperTrading" defaultChecked />
                    <Label htmlFor="paperTrading">Start with paper trading</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="stopLoss" defaultChecked />
                    <Label htmlFor="stopLoss">Enable stop loss</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" defaultChecked />
                    <Label htmlFor="notifications">Enable notifications</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Bot
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bots</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bots.length}</div>
            <p className="text-xs text-muted-foreground">
              {bots.filter(b => b.status === "RUNNING").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +${bots.reduce((sum, bot) => sum + bot.totalPnL, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All time profit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's P&L</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +${bots.reduce((sum, bot) => sum + bot.dailyPnL, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Daily performance
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(bots.reduce((sum, bot) => sum + bot.winRate, 0) / bots.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all bots
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Bots</TabsTrigger>
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4">
            {bots.map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {getStrategyTypeIcon(bot.strategyType)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{bot.name}</CardTitle>
                        <CardDescription>
                          {bot.symbol} • {bot.timeframe} • {bot.strategy.replace(/_/g, ' ')}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(bot.status)}
                      {getStatusBadge(bot.status)}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total P&L</div>
                      <div className={`text-lg font-semibold ${bot.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {bot.totalPnL >= 0 ? '+' : ''}${bot.totalPnL.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Today's P&L</div>
                      <div className={`text-lg font-semibold ${bot.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {bot.dailyPnL >= 0 ? '+' : ''}${bot.dailyPnL.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                      <div className="text-lg font-semibold">{bot.winRate.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Trades</div>
                      <div className="text-lg font-semibold">{bot.totalTrades}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Investment Usage</span>
                      <span>${bot.currentInvestment.toLocaleString()} / ${bot.maxInvestment.toLocaleString()}</span>
                    </div>
                    <Progress value={(bot.currentInvestment / bot.maxInvestment) * 100} />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Last run: {bot.lastRun}
                    </div>
                    <div className="flex gap-2">
                      {bot.status === "RUNNING" ? (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Square className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {strategies.map((strategy) => (
              <Card key={strategy.value} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStrategyTypeIcon(strategy.type)}
                      <CardTitle className="text-lg">{strategy.label}</CardTitle>
                    </div>
                    <Badge variant="outline">{strategy.type.replace(/_/g, ' ')}</Badge>
                  </div>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Ready to deploy
                    </div>
                    <Button size="sm">
                      Use Strategy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bot Templates</CardTitle>
              <CardDescription>Pre-configured bot templates for quick deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Conservative Trader</div>
                      <div className="text-sm text-muted-foreground">Low risk, steady returns</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>• EMA Crossover strategy</div>
                    <div>• 1% risk per trade</div>
                    <div>• Multiple asset classes</div>
                    <div>• Stop loss enabled</div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Use Template
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Aggressive Scalper</div>
                      <div className="text-sm text-muted-foreground">High frequency, high returns</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>• RSI scalping strategy</div>
                    <div>• 5-minute timeframe</div>
                    <div>• High leverage</div>
                    <div>• Quick entries/exits</div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Use Template
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="h-5 w-5" />
                    <div>
                      <div className="font-medium">AI Portfolio Manager</div>
                      <div className="text-sm text-muted-foreground">Machine learning powered</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>• AI market prediction</div>
                    <div>• Dynamic position sizing</div>
                    <div>• Multi-asset analysis</div>
                    <div>• Adaptive strategies</div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Use Template
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="h-5 w-5" />
                    <div>
                      <div className="font-medium">Arbitrage Master</div>
                      <div className="text-sm text-muted-foreground">Cross-exchange arbitrage</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>• Multi-exchange monitoring</div>
                    <div>• Price difference detection</div>
                    <div>• Risk-free trades</div>
                    <div>• High frequency execution</div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Use Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Bot Performance Overview</CardTitle>
                <CardDescription>Collective performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">72.6%</div>
                    <div className="text-xs text-muted-foreground">Avg Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">2.34</div>
                    <div className="text-xs text-muted-foreground">Profit Factor</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">897</div>
                    <div className="text-xs text-muted-foreground">Total Trades</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+$11,355</div>
                    <div className="text-xs text-muted-foreground">Total P&L</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
                <CardDescription>Performance by strategy type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { strategy: "EMA Crossover", pnl: 3425, winRate: 73.2, trades: 247 },
                  { strategy: "RSI Scalper", pnl: 1847, winRate: 68.7, trades: 523 },
                  { strategy: "AI Predictor", pnl: 5234, winRate: 76.5, trades: 89 },
                  { strategy: "Arbitrage", pnl: 847, winRate: 92.1, trades: 38 },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{item.strategy}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.trades} trades • {item.winRate.toFixed(1)}% win rate
                      </div>
                    </div>
                    <div className={`text-right ${item.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <div className="font-semibold">
                        {item.pnl >= 0 ? '+' : ''}${item.pnl.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}