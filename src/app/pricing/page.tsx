"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp, 
  Bot, 
  BarChart3,
  Crown,
  Rocket,
  ArrowRight,
  DollarSign,
  Calendar,
  Headphones,
  Database,
  Globe,
  Smartphone,
  Lock,
  Award,
  Cpu,
  Server,
  Wifi,
  CreditCard,
  PiggyBank,
  Gift,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')

  const pricingPlans = [
    {
      name: "Starter",
      price: { monthly: 29, annual: 290 },
      description: "Perfect for beginners and casual traders",
      icon: <Rocket className="h-8 w-8 text-blue-600" />,
      popular: false,
      cta: "Get Started",
      features: [
        { name: "Real-time market data", included: true },
        { name: "Basic trading interface", included: true },
        { name: "Portfolio tracking", included: true },
        { name: "Mobile trading app", included: true },
        { name: "Email support", included: true },
        { name: "1 trading bot", included: true },
        { name: "Basic charting", included: true },
        { name: "5 technical indicators", included: true },
        { name: "Advanced order types", included: false },
        { name: "API access", included: false },
        { name: "Backtesting", included: false },
        { name: "Custom bots", included: false },
        { name: "Priority support", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Multi-exchange trading", included: false }
      ],
      limits: {
        tradesPerMonth: "100",
        apiCallsPerMinute: "60",
        botInstances: "1",
        exchanges: "3"
      }
    },
    {
      name: "Professional",
      price: { monthly: 99, annual: 990 },
      description: "For serious traders and active investors",
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      popular: true,
      cta: "Start Free Trial",
      features: [
        { name: "Real-time market data", included: true },
        { name: "Advanced trading interface", included: true },
        { name: "Portfolio tracking", included: true },
        { name: "Mobile trading app", included: true },
        { name: "Priority support", included: true },
        { name: "5 trading bots", included: true },
        { name: "Advanced charting", included: true },
        { name: "50+ technical indicators", included: true },
        { name: "Advanced order types", included: true },
        { name: "API access", included: true },
        { name: "Backtesting", included: true },
        { name: "Custom bots", included: true },
        { name: "Priority support", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Multi-exchange trading", included: true }
      ],
      limits: {
        tradesPerMonth: "1,000",
        apiCallsPerMinute: "300",
        botInstances: "5",
        exchanges: "10"
      }
    },
    {
      name: "Enterprise",
      price: { monthly: 299, annual: 2990 },
      description: "For institutions and high-volume traders",
      icon: <Crown className="h-8 w-8 text-purple-600" />,
      popular: false,
      cta: "Contact Sales",
      features: [
        { name: "Real-time market data", included: true },
        { name: "Enterprise trading interface", included: true },
        { name: "Portfolio tracking", included: true },
        { name: "Mobile trading app", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "Unlimited trading bots", included: true },
        { name: "Professional charting", included: true },
        { name: "100+ technical indicators", included: true },
        { name: "All order types", included: true },
        { name: "Full API access", included: true },
        { name: "Advanced backtesting", included: true },
        { name: "Custom bot development", included: true },
        { name: "24/7 dedicated support", included: true },
        { name: "Enterprise analytics", included: true },
        { name: "15+ exchanges", included: true }
      ],
      limits: {
        tradesPerMonth: "Unlimited",
        apiCallsPerMinute: "1,000+",
        botInstances: "Unlimited",
        exchanges: "15+"
      }
    }
  ]

  const additionalServices = [
    {
      title: "API Add-on",
      price: "$49/month",
      description: "Enhanced API access for high-frequency trading",
      features: [
        "Increased rate limits",
        "WebSocket access",
        "Priority execution",
        "Dedicated support"
      ],
      icon: <Wifi className="h-8 w-8 text-blue-600" />
    },
    {
      title: "Market Data Pro",
      price: "$29/month",
      description: "Premium market data and analytics",
      features: [
        "Real-time news feed",
        "Sentiment analysis",
        "Advanced metrics",
        "Historical data"
      ],
      icon: <BarChart3 className="h-8 w-8 text-green-600" />
    },
    {
      title: "Security Plus",
      price: "$19/month",
      description: "Enhanced security features and protection",
      features: [
        "Advanced 2FA options",
        "Device management",
        "Activity monitoring",
        "Security reports"
      ],
      icon: <Shield className="h-8 w-8 text-purple-600" />
    }
  ]

  const enterpriseFeatures = [
    {
      title: "Custom Integrations",
      description: "Tailored solutions for your specific business needs",
      icon: <Database className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Dedicated Infrastructure",
      description: "Private cloud deployment with dedicated resources",
      icon: <Server className="h-6 w-6 text-green-600" />
    },
    {
      title: "White-Label Solution",
      description: "Brand the platform as your own with custom branding",
      icon: <Globe className="h-6 w-6 text-purple-600" />
    },
    {
      title: "Custom Development",
      description: "Bespoke features and functionality built to your specifications",
      icon: <Cpu className="h-6 w-6 text-orange-600" />
    },
    {
      title: "SLA Guarantee",
      description: "99.99% uptime SLA with financial guarantees",
      icon: <Award className="h-6 w-6 text-red-600" />
    },
    {
      title: "Account Management",
      description: "Dedicated account manager and priority support",
      icon: <Users className="h-6 w-6 text-indigo-600" />
    }
  ]

  const faqs = [
    {
      question: "Can I change my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start your trial."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit/debit cards, bank transfers, and cryptocurrency payments (BTC, ETH, USDT)."
    },
    {
      question: "Is there a commitment period?",
      answer: "Monthly plans have no commitment - you can cancel anytime. Annual plans offer a 20% discount and require a 12-month commitment."
    },
    {
      question: "Do you offer discounts for non-profits or educational institutions?",
      answer: "Yes, we offer special pricing for qualified non-profits and educational institutions. Contact our sales team for details."
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you when you approach your limits. You can either upgrade your plan or purchase additional capacity as needed."
    }
  ]

  const getPrice = (plan: typeof pricingPlans[0]) => {
    return billingCycle === 'annual' ? plan.price.annual / 12 : plan.price.monthly
  }

  const getAnnualSavings = (plan: typeof pricingPlans[0]) => {
    return plan.price.monthly * 12 - plan.price.annual
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your
            <span className="text-orange-500"> Trading Plan</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Select the perfect plan for your trading needs. From beginners to institutional traders, we have the right solution for everyone.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
            />
            <span className={`text-lg font-medium ${billingCycle === 'annual' ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {billingCycle === 'annual' && (
              <Badge className="bg-green-100 text-green-800">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`border-0 shadow-lg relative ${plan.popular ? 'ring-2 ring-orange-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white px-4 py-2">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${getPrice(plan)}</span>
                    <span className="text-gray-600">/month</span>
                    {billingCycle === 'annual' && (
                      <div className="text-sm text-green-600 mt-1">
                        Save ${getAnnualSavings(plan)}/year
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        {feature.included ? (
                          <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
                        ) : (
                          <div className="h-4 w-4 mr-3 rounded-full border border-gray-300" />
                        )}
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Plan Limits */}
                  <div className="pt-4 border-t space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Limits:</strong>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>Trades/Month: {plan.limits.tradesPerMonth}</div>
                      <div>API Calls/Min: {plan.limits.apiCallsPerMinute}</div>
                      <div>Bots: {plan.limits.botInstances}</div>
                      <div>Exchanges: {plan.limits.exchanges}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Additional Services
            </h2>
            <p className="text-lg text-gray-600">
              Enhance your trading experience with our premium add-ons
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {service.icon}
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription className="text-lg font-semibold text-orange-600">
                        {service.price}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {service.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Enterprise Solutions
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                For large organizations and high-volume traders requiring custom solutions, dedicated infrastructure, and enterprise-grade support.
              </p>
              
              <div className="space-y-6">
                {enterpriseFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    {feature.icon}
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link href="/contact">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                    Contact Sales Team
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-8">
              <div className="text-center">
                <Crown className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Custom Pricing
                </h3>
                <p className="text-gray-600 mb-4">
                  Enterprise solutions are tailored to your specific needs. Contact our sales team for a custom quote.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    Dedicated Account Manager
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Headphones className="h-4 w-4 mr-2" />
                    24/7 Priority Support
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    Custom SLA Guarantees
                  </div>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Custom Pricing
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of successful traders and choose the plan that's right for you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-orange-600">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}