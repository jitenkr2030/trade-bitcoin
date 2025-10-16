"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bot, 
  Cpu, 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Play,
  Pause,
  Settings,
  Code,
  Database,
  RefreshCw,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  LineChart,
  PieChart,
  ArrowRight,
  Star,
  Users,
  Award,
  Lightbulb,
  Grid,
  Waves,
  GitBranch,
  TrendingDown,
  Minus,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default function TradingBotsPage() {
  const [selectedBot, setSelectedBot] = useState<string | null>(null)

  const botTypes = [
    {
      id: "grid",
      name: "Grid Trading Bot",
      icon: <Grid className="h-8 w-8 text-blue-600" />,
      description: "Automated grid trading strategy that profits from market volatility",
      difficulty: "Beginner",
      profitability: "Medium",
      risk: "Low",
      minInvestment: "$500",
      bestFor: "Sideways markets",
      features: [
        "Automated buy/sell grid orders",
        "Customizable grid spacing",
        "Take-profit and stop-loss",
        "Real-time performance tracking"
      ],
      strategy: "Places buy and sell orders at regular intervals above and below a set price point, profiting from price fluctuations within a range."
    },
    {
      id: "dca",
      name: "DCA Bot",
      icon: <Minus className="h-8 w-8 text-green-600" />,
      description: "Dollar Cost Averaging strategy for long-term investment",
      difficulty: "Beginner",
      profitability: "Long-term",
      risk: "Very Low",
      minInvestment: "$100",
      bestFor: "Long-term holding",
      features: [
        "Regular interval purchases",
        "Fixed amount investing",
        "Portfolio diversification",
        "Automated rebalancing"
      ],
      strategy: "Invests a fixed amount at regular intervals, reducing the impact of volatility and lowering average cost over time."
    },
    {
      id: "martingale",
      name: "Martingale Bot",
      icon: <Plus className="h-8 w-8 text-red-600" />,
      description: "Progressive betting strategy that doubles down on losses",
      difficulty: "Advanced",
      profitability: "High",
      risk: "Very High",
      minInvestment: "$1,000",
      bestFor: "Experienced traders",
      features: [
        "Progressive position sizing",
        "Loss recovery mechanism",
        "Risk management controls",
        "Customizable multiplier"
      ],
      strategy: "Doubles the investment amount after each loss, aiming to recover all losses with a single win. High risk, high reward."
    },
    {
      id: "arbitrage",
      name: "Arbitrage Bot",
      icon: <GitBranch className="h-8 w-8 text-purple-600" />,
      description: "Exploits price differences across multiple exchanges",
      difficulty: "Expert",
      profitability: "High",
      risk: "Low",
      minInvestment: "$5,000",
      bestFor: "High-frequency trading",
      features: [
        "Multi-exchange monitoring",
        "Instant arbitrage detection",
        "Automated execution",
        "Risk-free profits"
      ],
      strategy: "Simultaneously buys and sells the same asset on different exchanges to profit from price differences."
    },
    {
      id: "market-making",
      name: "Market Making Bot",
      icon: <Waves className="h-8 w-8 text-orange-600" />,
      description: "Provides liquidity by placing both buy and sell orders",
      difficulty: "Expert",
      profitability: "Medium",
      risk: "Medium",
      minInvestment: "$10,000",
      bestFor: "High-volume trading",
      features: [
        "Spread optimization",
        "Inventory management",
        "Real-time adjustments",
        "Volume-based pricing"
      ],
      strategy: "Places both buy and sell orders around the current market price to profit from the bid-ask spread."
    },
    {
      id: "trend-following",
      name: "Trend Following Bot",
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
      description: "Follows market trends using technical indicators",
      difficulty: "Intermediate",
      profitability: "High",
      risk: "Medium",
      minInvestment: "$1,000",
      bestFor: "Trending markets",
      features: [
        "Technical analysis",
        "Trend detection",
        "Momentum indicators",
        "Dynamic position sizing"
      ],
      strategy: "Identifies and follows market trends using moving averages, RSI, and other technical indicators."
    },
    {
      id: "mean-reversion",
      name: "Mean Reversion Bot",
      icon: <Activity className="h-8 w-8 text-teal-600" />,
      description: "Profits from price returning to historical averages",
      difficulty: "Intermediate",
      profitability: "Medium",
      risk: "Medium",
      minInvestment: "$500",
      bestFor: "Range-bound markets",
      features: [
        "Statistical analysis",
        "Bollinger bands",
        "Mean deviation",
        "Reversal signals"
      ],
      strategy: "Bets that prices will revert to their historical mean, buying when prices are low and selling when high."
    },
    {
      id: "custom",
      name: "Custom Strategy Bot",
      icon: <Code className="h-8 w-8 text-pink-600" />,
      description: "Build your own trading strategies with our visual editor",
      difficulty: "Expert",
      profitability: "Variable",
      risk: "Variable",
      minInvestment: "$100",
      bestFor: "Advanced strategies",
      features: [
        "Visual strategy builder",
        "Custom indicators",
        "Backtesting engine",
        "Risk management rules"
      ],
      strategy: "Create completely custom trading strategies using our drag-and-drop interface or code editor."
    }
  ]

  const performanceMetrics = [
    {
      metric: "Success Rate",
      value: "78%",
      description: "Average success rate across all bot types"
    },
    {
      metric: "Avg. Monthly Return",
      value: "12-25%",
      description: "Typical monthly returns for active bots"
    },
    {
      metric: "Active Bots",
      value: "15,000+",
      description: "Bots currently running on our platform"
    },
    {
      metric: "Total Volume",
      value: "$2.5B+",
      description: "Monthly trading volume from bots"
    }
  ]

  const gettingStarted = [
    {
      step: 1,
      title: "Choose Your Strategy",
      description: "Select from our pre-built bots or create your own custom strategy",
      icon: <Target className="h-8 w-8 text-blue-600" />
    },
    {
      step: 2,
      title: "Configure Parameters",
      description: "Set your investment amount, risk tolerance, and trading preferences",
      icon: <Settings className="h-8 w-8 text-green-600" />
    },
    {
      step: 3,
      title: "Backtest Strategy",
      description: "Test your strategy against historical data to optimize performance",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />
    },
    {
      step: 4,
      title: "Deploy & Monitor",
      description: "Launch your bot and monitor performance in real-time",
      icon: <Play className="h-8 w-8 text-orange-600" />
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-700"
      case "Intermediate": return "bg-yellow-100 text-yellow-700"
      case "Advanced": return "bg-orange-100 text-orange-700"
      case "Expert": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Very Low": return "bg-green-100 text-green-700"
      case "Low": return "bg-blue-100 text-blue-700"
      case "Medium": return "bg-yellow-100 text-yellow-700"
      case "High": return "bg-orange-100 text-orange-700"
      case "Very High": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Automated Trading
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Intelligent Trading
            <span className="text-orange-500"> Bots</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Harness the power of AI and automation with our sophisticated trading bots. From grid trading to arbitrage, deploy strategies that work 24/7 to maximize your trading potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Bot className="h-5 w-5 mr-2" />
                Start Trading
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                <ArrowRight className="h-5 w-5 mr-2" />
                View Pricing
              </Button>
            </Link>
          </div>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.metric}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started with automated trading in just a few simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {gettingStarted.map((step, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold">{step.step}</span>
                    </div>
                  </div>
                  {step.icon}
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bot Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trading Bot Strategies
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our proven strategies or build your own
            </p>
          </div>
          
          <Tabs defaultValue="beginner" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="beginner">Beginner</TabsTrigger>
              <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="expert">Expert</TabsTrigger>
            </TabsList>
            
            <TabsContent value="beginner">
              <div className="grid md:grid-cols-2 gap-8">
                {botTypes.filter(bot => bot.difficulty === "Beginner").map((bot) => (
                  <BotCard key={bot.id} bot={bot} getDifficultyColor={getDifficultyColor} getRiskColor={getRiskColor} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="intermediate">
              <div className="grid md:grid-cols-2 gap-8">
                {botTypes.filter(bot => bot.difficulty === "Intermediate").map((bot) => (
                  <BotCard key={bot.id} bot={bot} getDifficultyColor={getDifficultyColor} getRiskColor={getRiskColor} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="advanced">
              <div className="grid md:grid-cols-2 gap-8">
                {botTypes.filter(bot => bot.difficulty === "Advanced").map((bot) => (
                  <BotCard key={bot.id} bot={bot} getDifficultyColor={getDifficultyColor} getRiskColor={getRiskColor} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="expert">
              <div className="grid md:grid-cols-2 gap-8">
                {botTypes.filter(bot => bot.difficulty === "Expert").map((bot) => (
                  <BotCard key={bot.id} bot={bot} getDifficultyColor={getDifficultyColor} getRiskColor={getRiskColor} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Powerful Bot Features
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our trading platform provides everything you need to create, test, and deploy successful trading strategies with confidence.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Brain className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">AI-Powered Analytics</h3>
                    <p className="text-gray-600">Advanced machine learning algorithms analyze market conditions and optimize bot performance in real-time.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Shield className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Risk Management</h3>
                    <p className="text-gray-600">Comprehensive risk controls including stop-loss, take-profit, and position sizing to protect your capital.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <BarChart3 className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Backtesting Engine</h3>
                    <p className="text-gray-600">Test your strategies against years of historical data to optimize performance before deploying real capital.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Zap className="h-6 w-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-Time Monitoring</h3>
                    <p className="text-gray-600">Monitor your bots 24/7 with real-time performance metrics, alerts, and mobile notifications.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-100 to-blue-100 rounded-lg p-8">
              <div className="text-center">
                <Cpu className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Strategy Builder
                </h3>
                <p className="text-gray-600 mb-4">
                  Create custom trading strategies with our visual drag-and-drop interface. No coding required!
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Visual Strategy Editor
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Technical Indicators
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Risk Management Rules
                  </div>
                </div>
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Try Strategy Builder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              See how our users are succeeding with automated trading
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sarah Chen</h3>
                    <p className="text-sm text-gray-600">Grid Trading Bot</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The grid bot has transformed my trading. I'm seeing consistent 15% monthly returns with minimal effort."
                </p>
                <div className="flex items-center text-sm text-green-600">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="font-semibold">+15% Monthly Return</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mike Rodriguez</h3>
                    <p className="text-sm text-gray-600">Arbitrage Bot</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Arbitrage trading has been a game-changer. Risk-free profits while I sleep. Absolutely incredible!"
                </p>
                <div className="flex items-center text-sm text-blue-600">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="font-semibold">$50K Monthly Profit</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Emily Watson</h3>
                    <p className="text-sm text-gray-600">Custom Strategy</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Building my own strategy was easy with the visual editor. Now I have a bot that perfectly matches my trading style."
                </p>
                <div className="flex items-center text-sm text-purple-600">
                  <Star className="h-4 w-4 mr-1" />
                  <span className="font-semibold">22% Monthly Return</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Automate Your Trading?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of traders who are already profiting from our automated trading bots
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-orange-600">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Bot Card Component
function BotCard({ bot, getDifficultyColor, getRiskColor }: {
  bot: any,
  getDifficultyColor: (difficulty: string) => string,
  getRiskColor: (risk: string) => string
}) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex items-center space-x-3">
          {bot.icon}
          <div>
            <CardTitle className="text-xl">{bot.name}</CardTitle>
            <CardDescription>{bot.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={getDifficultyColor(bot.difficulty)}>
              {bot.difficulty}
            </Badge>
            <Badge variant="outline" className={getRiskColor(bot.risk)}>
              {bot.risk} Risk
            </Badge>
            <Badge variant="outline">
              {bot.minInvestment}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Best for:</span>
              <div className="font-medium">{bot.bestFor}</div>
            </div>
            <div>
              <span className="text-gray-500">Profitability:</span>
              <div className="font-medium">{bot.profitability}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Strategy:</h4>
            <p className="text-sm text-gray-600">{bot.strategy}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
            <div className="space-y-1">
              {bot.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
          
          <Button className="w-full bg-orange-500 hover:bg-orange-600">
            Try This Bot
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}