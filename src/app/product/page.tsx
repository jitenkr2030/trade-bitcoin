import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Bot, 
  Users, 
  Globe, 
  Smartphone,
  Database,
  Lock,
  Rocket,
  Star,
  Play,
  ArrowRight,
  CheckCircle,
  Target,
  Award,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

export default function ProductPage() {
  const productHighlights = [
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Real-Time Trading",
      description: "Execute trades in milliseconds with our ultra-low latency infrastructure and direct exchange connections.",
      features: ["0.1s average execution time", "Direct exchange APIs", "Real-time market data", "Advanced order types"]
    },
    {
      icon: <Bot className="h-8 w-8 text-green-600" />,
      title: "Automated Trading Bots",
      description: "Deploy sophisticated trading strategies with our AI-powered automation engine and customizable bots.",
      features: ["Pre-built strategies", "Custom bot builder", "Backtesting engine", "Risk management"]
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Enterprise Security",
      description: "Bank-grade security with multi-layer protection, encryption, and compliance frameworks.",
      features: ["256-bit encryption", "2FA authentication", "Cold storage", "SOC 2 compliant"]
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Advanced Analytics",
      description: "Comprehensive market analysis with professional-grade charts, indicators, and insights.",
      features: ["Technical indicators", "Market sentiment", "Performance metrics", "Custom dashboards"]
    }
  ]

  const keyFeatures = [
    {
      title: "Multi-Exchange Trading",
      description: "Trade across multiple exchanges from a single unified interface with aggregated liquidity and best execution pricing.",
      icon: <Globe className="h-12 w-12 text-blue-600" />
    },
    {
      title: "Portfolio Management",
      description: "Comprehensive portfolio tracking with real-time valuation, performance analysis, and risk assessment tools.",
      icon: <Database className="h-12 w-12 text-green-600" />
    },
    {
      title: "Mobile Trading",
      description: "Full-featured mobile apps for iOS and Android, allowing you to trade and monitor positions on the go.",
      icon: <Smartphone className="h-12 w-12 text-purple-600" />
    },
    {
      title: "API Access",
      description: "RESTful and WebSocket APIs for algorithmic trading, with comprehensive documentation and SDKs.",
      icon: <Lock className="h-12 w-12 text-orange-600" />
    },
    {
      title: "Risk Management",
      description: "Advanced risk controls including stop-loss, take-profit, position sizing, and exposure limits.",
      icon: <Target className="h-12 w-12 text-red-600" />
    },
    {
      title: "Market Intelligence",
      description: "AI-powered market analysis, news aggregation, and sentiment tracking for informed decision making.",
      icon: <Lightbulb className="h-12 w-12 text-yellow-600" />
    }
  ]

  const technicalSpecs = [
    {
      category: "Performance",
      specs: [
        { label: "Order Execution", value: "0.1ms average" },
        { label: "API Response Time", value: "<50ms" },
        { label: "Uptime", value: "99.99%" },
        { label: "Data Latency", value: "<1ms" }
      ]
    },
    {
      category: "Security",
      specs: [
        { label: "Encryption", value: "AES-256" },
        { label: "Authentication", value: "2FA, OAuth 2.0" },
        { label: "Compliance", value: "SOC 2, GDPR" },
        { label: "Audit", value: "Quarterly" }
      ]
    },
    {
      category: "Integration",
      specs: [
        { label: "Exchanges", value: "15+ supported" },
        { label: "APIs", value: "REST, WebSocket, FIX" },
        { label: "SDKs", value: "Python, JS, Java" },
        { label: "Webhooks", value: "Real-time events" }
      ]
    },
    {
      category: "Scalability",
      specs: [
        { label: "Concurrent Users", value: "100,000+" },
        { label: "Orders/Second", value: "10,000+" },
        { label: "Data Points", value: "1M+" },
        { label: "Bot Instances", value: "Unlimited" }
      ]
    }
  ]

  const useCases = [
    {
      title: "Day Traders",
      description: "High-frequency trading with advanced charting, real-time alerts, and rapid order execution.",
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      benefits: ["Real-time market data", "Advanced charting", "Quick order execution", "Risk management tools"]
    },
    {
      title: "Algorithmic Traders",
      description: "Build and deploy sophisticated trading strategies with our powerful automation framework.",
      icon: <Bot className="h-8 w-8 text-green-600" />,
      benefits: ["Strategy backtesting", "Custom bot development", "API integration", "Performance analytics"]
    },
    {
      title: "Portfolio Managers",
      description: "Comprehensive portfolio management with multi-asset tracking and performance optimization.",
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      benefits: ["Multi-exchange tracking", "Performance metrics", "Risk analysis", "Reporting tools"]
    },
    {
      title: "Institutional Traders",
      description: "Enterprise-grade solution with advanced features for high-volume trading and compliance.",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      benefits: ["High liquidity access", "Compliance tools", "Custom integrations", "Dedicated support"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Professional Trading Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            TradeBitcoin
            <span className="text-orange-500"> Platform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the power of professional cryptocurrency trading with our comprehensive platform designed for traders of all levels. From advanced automation to real-time analytics, TradeBitcoin provides everything you need to succeed in the digital asset markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Rocket className="h-5 w-5 mr-2" />
                Start Trading Now
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                <ArrowRight className="h-5 w-5 mr-2" />
                View Plans
              </Button>
            </Link>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1 text-green-500" />
              Bank-Grade Security
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-blue-500" />
              SOC 2 Compliant
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-purple-500" />
              50K+ Active Traders
            </div>
            <div className="flex items-center">
              <Award className="h-4 w-4 mr-1 text-yellow-500" />
              Industry Leading
            </div>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Highlights
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the key features that make TradeBitcoin the preferred choice for professional cryptocurrency traders worldwide.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {productHighlights.map((highlight, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {highlight.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{highlight.title}</CardTitle>
                      <CardDescription className="text-base">
                        {highlight.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {highlight.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Feature Set
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for successful cryptocurrency trading in one powerful platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600">
              Built with cutting-edge technology for maximum performance and reliability
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalSpecs.map((spec, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg text-center">{spec.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {spec.specs.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {item.value}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Every Trader
            </h2>
            <p className="text-lg text-gray-600">
              Whether you're a day trader or institutional investor, TradeBitcoin has the tools you need
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {useCase.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{useCase.title}</CardTitle>
                      <CardDescription className="text-base">
                        {useCase.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <Star className="h-3 w-3 mr-2 text-yellow-500 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Seamless Integration
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                TradeBitcoin integrates with your existing tools and workflows. Connect with popular trading platforms, analytics tools, and custom applications through our comprehensive API ecosystem.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">RESTful and WebSocket APIs</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">SDKs for Python, JavaScript, and Java</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Webhook support for real-time events</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Third-party integrations (TradingView, etc.)</span>
                </div>
              </div>
              <Link href="/api">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Explore API Documentation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-blue-100 rounded-lg p-8">
              <div className="text-center">
                <Database className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Developer Friendly
                </h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive documentation, code examples, and a supportive developer community make integration seamless.
                </p>
                <Badge variant="outline" className="mb-2">
                  99.9% API Uptime
                </Badge>
                <Badge variant="outline" className="ml-2">
                  {"<50ms Response"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Elevate Your Trading?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of professional traders who trust TradeBitcoin for their cryptocurrency trading needs
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