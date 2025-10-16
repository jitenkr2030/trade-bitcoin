"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Bot, 
  Activity,
  ArrowUpRight,
  Users,
  Target
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Portfolio Value",
      value: "$125,430",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "Last 30 days"
    },
    {
      title: "Active Strategies",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Bot,
      description: "Running strategies"
    },
    {
      title: "Monthly P&L",
      value: "$15,230",
      change: "+24.7%",
      trend: "up",
      icon: TrendingUp,
      description: "This month"
    },
    {
      title: "Win Rate",
      value: "78.4%",
      change: "+3.2%",
      trend: "up",
      icon: Target,
      description: "All time"
    }
  ]

  const recentActivity = [
    {
      type: "trade",
      title: "BTC/USD Buy Order",
      description: "Purchased 0.5 BTC at $43,250",
      time: "2 minutes ago",
      status: "completed"
    },
    {
      type: "bot",
      title: "EMA Crossover Bot",
      description: "Started new trading session",
      time: "1 hour ago",
      status: "running"
    },
    {
      type: "alert",
      title: "Price Alert",
      description: "ETH reached $2,500 target",
      time: "3 hours ago",
      status: "triggered"
    },
    {
      type: "trade",
      title: "Portfolio Rebalance",
      description: "Auto-rebalanced crypto allocation",
      time: "5 hours ago",
      status: "completed"
    }
  ]

  const topPerformers = [
    {
      name: "AI Strategy Bot",
      performance: "+28.3%",
      trades: 156,
      status: "active"
    },
    {
      name: "Arbitrage Scanner",
      performance: "+18.6%",
      trades: 89,
      status: "active"
    },
    {
      name: "RSI Scalper",
      performance: "+15.2%",
      trades: 234,
      status: "active"
    },
    {
      name: "Grid Trading",
      performance: "+12.1%",
      trades: 67,
      status: "paused"
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to TradeBitcoin!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your trading portfolio today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Live
          </Badge>
          <Button>
            View Reports
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>
                <span>• {stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest trading activities and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20">
                      <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{activity.title}</h4>
                        <Badge variant={
                          activity.status === "completed" ? "default" :
                          activity.status === "running" ? "secondary" :
                          activity.status === "triggered" ? "outline" : "destructive"
                        }>
                          {activity.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>
                Your best performing trading strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((bot, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">{bot.name}</h4>
                      <p className="text-sm text-muted-foreground">{bot.trades} trades</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">{bot.performance}</div>
                      <Badge 
                        variant={bot.status === "active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {bot.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you might want to perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/bots">
              <Button variant="outline" className="h-20 flex-col">
                <Bot className="w-6 h-6 mb-2" />
                <span className="text-sm">New Bot</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-20 flex-col">
              <DollarSign className="w-6 h-6 mb-2" />
              <span className="text-sm">Deposit</span>
            </Button>
            <Link href="/analytics">
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span className="text-sm">Analytics</span>
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline" className="h-20 flex-col">
                <Users className="w-6 h-6 mb-2" />
                <span className="text-sm">Community</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}