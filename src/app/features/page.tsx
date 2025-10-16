import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Lightbulb,
  Settings,
  Activity,
  AlertTriangle,
  Eye,
  Clock,
  RefreshCw,
  Filter,
  Download,
  Upload,
  Heart,
  MessageSquare,
  Bell,
  Fingerprint,
  Key,
  Wifi,
  Server,
  Code,
  Monitor,
  PieChart,
  LineChart,
  CandlestickChart,
  Brain,
  Cpu,
  Network,
  Cloud,
  HardDrive,
  Usb,
  Bluetooth,
  Smartphone as Phone
} from 'lucide-react'
import Link from 'next/link'

export default function FeaturesPage() {
  const featureCategories = [
    {
      id: "trading",
      title: "Trading Features",
      icon: <TrendingUp className="h-6 w-6" />,
      description: "Advanced trading tools and execution capabilities",
      features: [
        {
          title: "Real-Time Trading",
          icon: <Zap className="h-8 w-8 text-yellow-600" />,
          description: "Execute trades in milliseconds with our ultra-low latency infrastructure.",
          benefits: ["0.1s execution time", "Direct exchange connections", "Real-time market data", "Advanced order types"],
          pricing: ["Starter", "Professional", "Enterprise"]
        },
        {
          title: "Advanced Order Types",
          icon: <Target className="h-8 w-8 text-blue-600" />,
          description: "Sophisticated order types for precise trading strategies and risk management.",
          benefits: ["Limit orders", "Stop orders", "Trailing stops", "OCO orders", "Fill or Kill"],
          pricing: ["Starter", "Professional", "Enterprise"]
        },
        {
          title: "Multi-Exchange Trading",
          icon: <Globe className="h-8 w-8 text-green-600" />,
          description: "Trade across 15+ major cryptocurrency exchanges from a single interface.",
          benefits: ["Unified interface", "Best execution pricing", "Arbitrage opportunities", "Liquidity aggregation"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "Mobile Trading",
          icon: <Phone className="h-8 w-8 text-purple-600" />,
          description: "Full-featured mobile apps for trading on the go with push notifications.",
          benefits: ["iOS & Android apps", "Real-time alerts", "Biometric security", "Offline mode"],
          pricing: ["Starter", "Professional", "Enterprise"]
        }
      ]
    },
    {
      id: "automation",
      title: "Automation & Bots",
      icon: <Bot className="h-6 w-6" />,
      description: "AI-powered trading automation and strategy implementation",
      features: [
        {
          title: "Trading Bots",
          icon: <Cpu className="h-8 w-8 text-orange-600" />,
          description: "Deploy sophisticated trading strategies with our automation engine.",
          benefits: ["Pre-built strategies", "Custom bot builder", "Backtesting", "Paper trading"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "Strategy Builder",
          icon: <Brain className="h-8 w-8 text-red-600" />,
          description: "Visual strategy builder with drag-and-drop interface for custom algorithms.",
          benefits: ["No-code interface", "Technical indicators", "Risk management", "Performance metrics"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "Backtesting Engine",
          icon: <RefreshCw className="h-8 w-8 text-indigo-600" />,
          description: "Test your strategies against historical data with comprehensive analytics.",
          benefits: ["Historical data", "Performance metrics", "Risk analysis", "Optimization tools"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "Smart Alerts",
          icon: <Bell className="h-8 w-8 text-pink-600" />,
          description: "Intelligent alerts based on market conditions, price movements, and technical indicators.",
          benefits: ["Custom triggers", "Multiple channels", "AI-powered insights", "Risk alerts"],
          pricing: ["Starter", "Professional", "Enterprise"]
        }
      ]
    },
    {
      id: "analytics",
      title: "Analytics & Insights",
      icon: <BarChart3 className="h-6 w-6" />,
      description: "Comprehensive market analysis and performance tracking",
      features: [
        {
          title: "Advanced Charting",
          icon: <LineChart className="h-8 w-8 text-teal-600" />,
          description: "Professional-grade charts with 100+ technical indicators and drawing tools.",
          benefits: ["Real-time charts", "Technical indicators", "Drawing tools", "Multiple timeframes"],
          pricing: ["Starter", "Professional", "Enterprise"]
        },
        {
          title: "Market Intelligence",
          icon: <Eye className="h-8 w-8 text-cyan-600" />,
          description: "AI-powered market analysis with sentiment tracking and predictive insights.",
          benefits: ["Market sentiment", "News analysis", "Price predictions", "Risk assessment"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "Portfolio Analytics",
          icon: <PieChart className="h-8 w-8 text-emerald-600" />,
          description: "Comprehensive portfolio performance tracking and risk analysis.",
          benefits: ["Performance metrics", "Risk analysis", "Asset allocation", "Tax reporting"],
          pricing: ["Starter", "Professional", "Enterprise"]
        },
        {
          title: "Custom Dashboards",
          icon: <Monitor className="h-8 w-8 text-violet-600" />,
          description: "Build custom dashboards with drag-and-drop widgets and real-time data.",
          benefits: ["Customizable layouts", "Real-time data", "Multiple widgets", "Sharing capabilities"],
          pricing: ["Professional", "Enterprise"]
        }
      ]
    },
    {
      id: "security",
      title: "Security & Compliance",
      icon: <Shield className="h-6 w-6" />,
      description: "Enterprise-grade security and regulatory compliance",
      features: [
        {
          title: "Two-Factor Authentication",
          icon: <Fingerprint className="h-8 w-8 text-blue-600" />,
          description: "Multi-layered authentication with TOTP, SMS, and hardware token support.",
          benefits: ["TOTP support", "SMS backup", "Hardware tokens", "Biometric options"],
          pricing: ["Starter", "Professional", "Enterprise"]
        },
        {
          title: "Device Management",
          icon: <Smartphone className="h-8 w-8 text-green-600" />,
          description: "Monitor and manage all devices accessing your account with real-time alerts.",
          benefits: ["Device tracking", "Session management", "Remote logout", "Suspicious activity alerts"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "Cold Storage",
          icon: <HardDrive className="h-8 w-8 text-purple-600" />,
          description: "98% of assets held in secure cold storage with multi-signature protection.",
          benefits: ["Cold storage", "Multi-signature", "Insurance coverage", "Regular audits"],
          pricing: ["Starter", "Professional", "Enterprise"]
        },
        {
          title: "Compliance Tools",
          icon: <Award className="h-8 w-8 text-orange-600" />,
          description: "Built-in compliance tools for regulatory requirements and reporting.",
          benefits: ["KYC/AML", "Tax reporting", "Audit trails", "Regulatory compliance"],
          pricing: ["Professional", "Enterprise"]
        }
      ]
    },
    {
      id: "api",
      title: "API & Integration",
      icon: <Code className="h-6 w-6" />,
      description: "Developer-friendly APIs and third-party integrations",
      features: [
        {
          title: "REST API",
          icon: <Server className="h-8 w-8 text-red-600" />,
          description: "Comprehensive RESTful API for trading, data, and account management.",
          benefits: ["Full trading capabilities", "Market data", "Account management", "Webhook support"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "WebSocket API",
          icon: <Wifi className="h-8 w-8 text-indigo-600" />,
          description: "Real-time WebSocket connections for live market data and order updates.",
          benefits: ["Real-time data", "Low latency", "Order updates", "Market depth"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "SDKs & Libraries",
          icon: <Download className="h-8 w-8 text-yellow-600" />,
          description: "Official SDKs for Python, JavaScript, Java, and other popular languages.",
          benefits: ["Python SDK", "JavaScript SDK", "Java SDK", "Code examples"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "Third-Party Integrations",
          icon: <Network className="h-8 w-8 text-pink-600" />,
          description: "Seamless integration with popular trading platforms and analytics tools.",
          benefits: ["TradingView", "Excel integration", "Custom indicators", "Plugin support"],
          pricing: ["Professional", "Enterprise"]
        }
      ]
    },
    {
      id: "infrastructure",
      title: "Infrastructure",
      icon: <Cloud className="h-6 w-6" />,
      description: "High-performance, reliable infrastructure for mission-critical trading",
      features: [
        {
          title: "Global Infrastructure",
          icon: <Globe className="h-8 w-8 text-blue-600" />,
          description: "Distributed global infrastructure with data centers in major financial hubs.",
          benefits: ["Low latency", "High availability", "Global coverage", "Redundancy"],
          pricing: ["Starter", "Professional", "Enterprise"]
        },
        {
          title: "High Availability",
          icon: <Activity className="h-8 w-8 text-green-600" />,
          description: "99.99% uptime with automatic failover and disaster recovery.",
          benefits: ["99.99% uptime", "Auto failover", "Disaster recovery", "Load balancing"],
          pricing: ["Starter", "Professional", "Enterprise"]
        },
        {
          title: "Scalability",
          icon: <RefreshCw className="h-8 w-8 text-purple-600" />,
          description: "Elastic scaling to handle high-volume trading and market volatility.",
          benefits: ["Auto scaling", "High throughput", "Low latency", "Resource optimization"],
          pricing: ["Professional", "Enterprise"]
        },
        {
          title: "Monitoring & Alerting",
          icon: <AlertTriangle className="h-8 w-8 text-orange-600" />,
          description: "Comprehensive monitoring with real-time alerts and performance metrics.",
          benefits: ["Real-time monitoring", "Performance metrics", "Custom alerts", "SLA monitoring"],
          pricing: ["Professional", "Enterprise"]
        }
      ]
    }
  ]

  const getPricingBadgeColor = (plans: string[]) => {
    if (plans.includes("Starter")) return "bg-green-100 text-green-800"
    if (plans.includes("Professional")) return "bg-blue-100 text-blue-800"
    return "bg-purple-100 text-purple-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Platform Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-orange-500"> Professional Trading</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore TradeBitcoin's comprehensive feature set designed to meet the needs of traders at every level. From advanced automation to enterprise-grade security, discover the tools that will elevate your trading experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                <Rocket className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                <ArrowRight className="h-5 w-5 mr-2" />
                Compare Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="trading" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-12">
              {featureCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center gap-2 p-3">
                  {category.icon}
                  <span className="text-xs font-medium">{category.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {featureCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{category.title}</h2>
                  <p className="text-lg text-gray-600">{category.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {category.features.map((feature, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            {feature.icon}
                            <div>
                              <CardTitle className="text-xl">{feature.title}</CardTitle>
                              <CardDescription className="text-base mt-2">
                                {feature.description}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={getPricingBadgeColor(feature.pricing)}
                          >
                            {feature.pricing[0]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">Key Benefits:</h4>
                          <div className="space-y-2">
                            {feature.benefits.map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
                                {benefit}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {feature.pricing.length > 1 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-xs text-gray-500 mb-2">Available in:</p>
                            <div className="flex flex-wrap gap-1">
                              {feature.pricing.map((plan) => (
                                <Badge key={plan} variant="secondary" className="text-xs">
                                  {plan}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Feature Comparison
            </h2>
            <p className="text-lg text-gray-600">
              See how our features stack up across different subscription plans
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Feature</h3>
                  {featureCategories.flatMap(cat => cat.features).slice(0, 8).map((feature, index) => (
                    <div key={index} className="text-sm text-gray-600">{feature.title}</div>
                  ))}
                </div>
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-green-600">Starter</h3>
                  <Badge variant="outline" className="bg-green-50 text-green-700">$29/mo</Badge>
                  {featureCategories.flatMap(cat => cat.features).slice(0, 8).map((feature, index) => (
                    <div key={index} className="text-sm">
                      {feature.pricing.includes("Starter") ? (
                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-blue-600">Professional</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">$99/mo</Badge>
                  {featureCategories.flatMap(cat => cat.features).slice(0, 8).map((feature, index) => (
                    <div key={index} className="text-sm">
                      {feature.pricing.includes("Professional") ? (
                        <CheckCircle className="h-4 w-4 text-blue-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center space-y-4">
                  <h3 className="font-semibold text-purple-600">Enterprise</h3>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">$299/mo</Badge>
                  {featureCategories.flatMap(cat => cat.features).slice(0, 8).map((feature, index) => (
                    <div key={index} className="text-sm">
                      <CheckCircle className="h-4 w-4 text-purple-500 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Detailed Pricing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Start your free trial today and explore all the powerful features TradeBitcoin has to offer
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-orange-600">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/product">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}