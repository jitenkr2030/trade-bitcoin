'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Bot, 
  Users, 
  DollarSign, 
  Crown,
  Star,
  CheckCircle,
  Play,
  ChevronDown,
  Sparkles,
  Target,
  Globe,
  Lock,
  Rocket,
  Award,
  Heart,
  MessageSquare,
  TrendingDown,
  Activity,
  Database,
  Code,
  Smartphone,
  Monitor,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('bots')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">TradeBitcoin</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="#demo" className="text-gray-300 hover:text-white transition-colors">Demo</Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Reviews</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Sign In
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 animate-float">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400 text-sm font-semibold">+2.4%</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">BTC 24h</div>
            </CardContent>
          </Card>
        </div>

        <div className="absolute bottom-20 left-20 animate-float delay-500">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-semibold">$43,250</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">Current Price</div>
            </CardContent>
          </Card>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-600/10 border border-blue-600/30 rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">AI-Powered Trading Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Trade Bitcoin with
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Superhuman Intelligence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of cryptocurrency trading with advanced AI analytics, 
              automated trading bots, and real-time market insights that give you the edge.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto group">
                Start Trading Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto border-gray-600 hover:border-gray-500">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Bank-Level Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span>150K+ Active Traders</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-400" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gray-800 text-gray-300">
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Professional-grade trading tools designed for both beginners and institutional traders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <Bot className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-white text-xl">AI Trading Bots</CardTitle>
                <CardDescription className="text-gray-400">
                  Deploy intelligent trading strategies powered by machine learning algorithms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Grid Trading
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    DCA Strategies
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Arbitrage Bots
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-green-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                </div>
                <CardTitle className="text-white text-xl">Advanced Analytics</CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time market data and sophisticated analysis tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Technical Indicators
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Market Depth
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Sentiment Analysis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <CardTitle className="text-white text-xl">Enterprise Security</CardTitle>
                <CardDescription className="text-gray-400">
                  Bank-level security with advanced encryption and protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    2FA Authentication
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Cold Storage
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Audit Logs
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-yellow-500 transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-600/30 transition-colors">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                <CardTitle className="text-white text-xl">Lightning Fast</CardTitle>
                <CardDescription className="text-gray-400">
                  Execute trades in milliseconds with optimized infrastructure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Sub-second Execution
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Real-time Data
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                    Global Servers
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gray-800 text-gray-300">
              Live Demo
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Experience the Platform
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore our powerful trading tools and features through this interactive demo
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800 p-1">
                <TabsTrigger value="bots" className="data-[state=active]:bg-blue-600">
                  Trading Bots
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="data-[state=active]:bg-blue-600">
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="social" className="data-[state=active]:bg-blue-600">
                  Social Trading
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bots" className="mt-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center">
                      <Bot className="mr-3 h-6 w-6 text-blue-400" />
                      AI-Powered Trading Bots
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-lg">
                      Deploy automated trading strategies with our advanced bot marketplace
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-3">Strategy Types</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                              <div className="flex items-center">
                                <Target className="h-5 w-5 text-green-400 mr-3" />
                                <span className="text-gray-300">Grid Trading</span>
                              </div>
                              <Badge variant="secondary" className="bg-green-600/20 text-green-400">
                                Popular
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                              <div className="flex items-center">
                                <TrendingDown className="h-5 w-5 text-blue-400 mr-3" />
                                <span className="text-gray-300">DCA Strategy</span>
                              </div>
                              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                                Stable
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                              <div className="flex items-center">
                                <Activity className="h-5 w-5 text-purple-400 mr-3" />
                                <span className="text-gray-300">Arbitrage</span>
                              </div>
                              <Badge variant="secondary" className="bg-purple-600/20 text-purple-400">
                                Advanced
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-3">Key Features</h4>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Backtesting Engine</div>
                                <div className="text-gray-400 text-sm">Test strategies with historical data</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Risk Management</div>
                                <div className="text-gray-400 text-sm">Advanced stop-loss and take-profit</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Performance Analytics</div>
                                <div className="text-gray-400 text-sm">Detailed metrics and reporting</div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center">
                      <BarChart3 className="mr-3 h-6 w-6 text-green-400" />
                      Advanced Market Analytics
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-lg">
                      Comprehensive market analysis tools for informed decision making
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-3">Charting Tools</h4>
                          <div className="space-y-3">
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <Monitor className="h-5 w-5 text-blue-400 mr-3" />
                              <span className="text-gray-300">Real-time Price Charts</span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <Activity className="h-5 w-5 text-green-400 mr-3" />
                              <span className="text-gray-300">50+ Technical Indicators</span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <Database className="h-5 w-5 text-purple-400 mr-3" />
                              <span className="text-gray-300">Market Depth Analysis</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-3">Market Intelligence</h4>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Order Book Analysis</div>
                                <div className="text-gray-400 text-sm">Real-time liquidity tracking</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Price Alerts</div>
                                <div className="text-gray-400 text-sm">Custom notifications</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Market Sentiment</div>
                                <div className="text-gray-400 text-sm">AI-driven sentiment analysis</div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="mt-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center">
                      <DollarSign className="mr-3 h-6 w-6 text-yellow-400" />
                      Portfolio Management
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-lg">
                      Track and optimize your cryptocurrency portfolio performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-3">Tracking & Analysis</h4>
                          <div className="space-y-3">
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <TrendingUp className="h-5 w-5 text-green-400 mr-3" />
                              <span className="text-gray-300">Real-time Balance</span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <BarChart3 className="h-5 w-5 text-blue-400 mr-3" />
                              <span className="text-gray-300">P&L Analysis</span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <Target className="h-5 w-5 text-purple-400 mr-3" />
                              <span className="text-gray-300">Asset Allocation</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-3">Optimization Tools</h4>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Rebalancing Assistant</div>
                                <div className="text-gray-400 text-sm">Automated portfolio optimization</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Risk Assessment</div>
                                <div className="text-gray-400 text-sm">Advanced risk metrics</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Tax Reporting</div>
                                <div className="text-gray-400 text-sm">Automated tax calculations</div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="mt-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center">
                      <Users className="mr-3 h-6 w-6 text-purple-400" />
                      Social Trading
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-lg">
                      Connect with traders and share strategies in our community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-3">Community Features</h4>
                          <div className="space-y-3">
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <Users className="h-5 w-5 text-blue-400 mr-3" />
                              <span className="text-gray-300">Trader Profiles</span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <MessageSquare className="h-5 w-5 text-green-400 mr-3" />
                              <span className="text-gray-300">Strategy Sharing</span>
                            </div>
                            <div className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                              <Award className="h-5 w-5 text-purple-400 mr-3" />
                              <span className="text-gray-300">Performance Rankings</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-3">Copy Trading</h4>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Follow Top Traders</div>
                                <div className="text-gray-400 text-sm">Copy successful strategies</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Auto-copy Trades</div>
                                <div className="text-gray-400 text-sm">Automated position copying</div>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5" />
                              <div>
                                <div className="text-white font-medium">Risk Controls</div>
                                <div className="text-gray-400 text-sm">Customizable risk parameters</div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                $2.5B+
              </div>
              <div className="text-gray-300 text-lg">Trading Volume</div>
              <div className="text-gray-500 text-sm mt-1">Monthly</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform">
                150K+
              </div>
              <div className="text-gray-300 text-lg">Active Traders</div>
              <div className="text-gray-500 text-sm mt-1">Worldwide</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                99.9%
              </div>
              <div className="text-gray-300 text-lg">Uptime</div>
              <div className="text-gray-500 text-sm mt-1">SLA Guaranteed</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2 group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-gray-300 text-lg">Support</div>
              <div className="text-gray-500 text-sm mt-1">Expert Team</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gray-800 text-gray-300">
              Trader Success Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Traders Say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of successful traders who have transformed their trading experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gray-800/50 border-gray-700 hover:border-blue-500 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "TradeBitcoin has completely transformed my trading strategy. The AI bots have increased my profitability by 40% in just 3 months."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">JD</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">John Davis</div>
                    <div className="text-gray-400 text-sm">Professional Trader</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-green-500 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "The analytics tools are incredible. Real-time market data and advanced charting have given me insights I never had before."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">SM</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Sarah Martinez</div>
                    <div className="text-gray-400 text-sm">Day Trader</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-500 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-6 italic">
                  "As an institutional trader, I need reliability and speed. TradeBitcoin delivers both with exceptional security and support."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">MR</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Michael Rodriguez</div>
                    <div className="text-gray-400 text-sm">Institutional Trader</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gray-800 text-gray-300">
              Simple, Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your Trading Plan
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From beginners to institutional traders, we have the right solution for everyone
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <Card className="bg-gray-800/50 border-gray-700 relative hover:border-blue-500 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">$</span>
                  </div>
                </div>
                <CardTitle className="text-white text-2xl">Starter</CardTitle>
                <CardDescription className="text-gray-400">
                  Perfect for beginners and casual traders
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Real-time market data
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Basic trading interface
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Portfolio tracking
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    1 trading bot
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Mobile trading app
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Email support
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-gray-600 hover:border-gray-500">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="bg-gray-800/50 border-orange-500 relative ring-2 ring-orange-500 hover:ring-orange-400 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white px-4 py-2">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-white text-2xl">Professional</CardTitle>
                <CardDescription className="text-gray-400">
                  For serious traders and active investors
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$99</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Everything in Starter
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    5 trading bots
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Advanced charting
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    API access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Backtesting engine
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Priority support
                  </li>
                </ul>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gray-800/50 border-gray-700 relative hover:border-purple-500 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-white text-2xl">Enterprise</CardTitle>
                <CardDescription className="text-gray-400">
                  For institutions and high-volume traders
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">$299</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Everything in Professional
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Unlimited trading bots
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Full API access
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    Custom bot development
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    24/7 dedicated support
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mr-3" />
                    15+ exchanges
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-gray-600 hover:border-gray-500">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">
              All plans include a 14-day free trial • No credit card required
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Save 20% with annual billing
              </Badge>
              <Link href="/pricing" className="text-blue-400 hover:text-blue-300 underline">
                View detailed pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 bg-gray-800 text-gray-300">
              Ready to Get Started?
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join Thousands of Successful Traders
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Start your free 14-day trial today. No credit card required. Cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto group">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto border-gray-600 hover:border-gray-500">
                Schedule Demo
              </Button>
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span>14-Day Free Trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-blue-400" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-400" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl">TradeBitcoin</span>
              </div>
              <p className="text-gray-400 text-sm">
                Advanced cryptocurrency trading platform powered by AI and machine learning.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 TradeBitcoin. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <MessageSquare className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}