"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail, 
  Download, 
  ExternalLink,
  Settings,
  Shield,
  TrendingUp,
  Bot,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      faqs: [
        {
          question: "How do I create a TradeBitcoin account?",
          answer: "Creating an account is simple! Click the 'Sign Up' button on our homepage, fill in your email address, create a strong password, and verify your email. You'll then have access to our basic trading features."
        },
        {
          question: "What documents do I need for verification?",
          answer: "For full account verification, you'll need a government-issued ID (passport, driver's license, or national ID) and proof of address (utility bill, bank statement, or tax document). Verification helps us comply with KYC regulations."
        },
        {
          question: "How do I deposit funds into my account?",
          answer: "You can deposit funds via bank transfer, credit/debit card, or cryptocurrency transfer. Go to your wallet section, select 'Deposit', choose your preferred method, and follow the instructions. Processing times vary by method."
        },
        {
          question: "Which cryptocurrencies can I trade?",
          answer: "TradeBitcoin supports Bitcoin (BTC), Ethereum (ETH), and other major cryptocurrencies. We regularly add new assets based on market demand and regulatory compliance. Check our markets page for the latest list."
        }
      ]
    },
    {
      title: "Trading & Features",
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      faqs: [
        {
          question: "How do I place a trade?",
          answer: "Navigate to the trading interface, select your trading pair, enter the amount you want to trade, choose your order type (market, limit, stop-loss), and click 'Buy' or 'Sell'. Review the details and confirm your trade."
        },
        {
          question: "What are trading bots and how do they work?",
          answer: "Trading bots are automated programs that execute trades based on predefined strategies. You can configure parameters like entry/exit points, risk management rules, and technical indicators. Bots monitor markets 24/7 and execute trades when conditions are met."
        },
        {
          question: "How do I set up stop-loss orders?",
          answer: "In the trading interface, select 'Stop-Loss' as your order type. Set your stop price (the price at which the order triggers) and limit price (the price at which the order executes). This helps limit potential losses on your positions."
        },
        {
          question: "Can I use leverage on TradeBitcoin?",
          answer: "Yes, we offer leveraged trading for eligible users. Leverage ratios vary by asset and user verification level. Be aware that leverage amplifies both gains and losses, so use it responsibly."
        }
      ]
    },
    {
      title: "Security & Account",
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      faqs: [
        {
          question: "How do I enable two-factor authentication (2FA)?",
          answer: "Go to Settings > Security > Two-Factor Authentication. Download an authenticator app (Google Authenticator, Authy), scan the QR code, and enter the verification code. Keep your backup codes safe in case you lose access to your device."
        },
        {
          question: "What should I do if I suspect unauthorized access?",
          answer: "Immediately change your password, enable 2FA if not already enabled, and contact our support team. Review your account activity for any suspicious transactions and consider freezing your account temporarily."
        },
        {
          question: "How secure is my cryptocurrency on TradeBitcoin?",
          answer: "We use industry-standard security measures including cold storage for the majority of assets, multi-signature wallets, encryption, and regular security audits. However, we recommend not keeping more cryptocurrency on exchanges than necessary for active trading."
        },
        {
          question: "Can I whitelist withdrawal addresses?",
          answer: "Yes, you can whitelist withdrawal addresses in your security settings. This adds an extra layer of protection by only allowing withdrawals to pre-approved addresses. Changes to whitelisted addresses may have a holding period for security."
        }
      ]
    },
    {
      title: "Fees & Limits",
      icon: <FileText className="h-6 w-6 text-orange-600" />,
      faqs: [
        {
          question: "What are the trading fees on TradeBitcoin?",
          answer: "Trading fees vary based on your subscription plan and 30-day trading volume. Starter plan: 0.25% taker, 0.15% maker. Professional plan: 0.20% taker, 0.10% maker. Enterprise plan: 0.15% taker, 0.05% maker. Higher volume traders receive lower fees."
        },
        {
          question: "Are there deposit or withdrawal fees?",
          answer: "Cryptocurrency deposits are free. Withdrawal fees vary by cryptocurrency and network conditions. Bank transfers may have fees depending on your bank and location. Check our fee schedule for current rates."
        },
        {
          question: "What are my daily trading limits?",
          answer: "Limits depend on your verification level and subscription plan. Basic accounts: $10,000/day. Verified accounts: $100,000/day. Professional/Enterprise: Higher limits available. These limits help protect your account and comply with regulations."
        },
        {
          question: "How do subscription plans work?",
          answer: "We offer three tiers: Starter ($29/month), Professional ($99/month), and Enterprise ($299/month). Each plan includes different features, trading limits, and fee structures. You can upgrade or downgrade at any time."
        }
      ]
    },
    {
      title: "Technical Issues",
      icon: <Settings className="h-6 w-6 text-red-600" />,
      faqs: [
        {
          question: "Why is my trade taking so long to execute?",
          answer: "Trade execution time depends on market conditions, network congestion, and order type. Market orders typically execute instantly, while limit orders execute only when market conditions match your price. Check our status page for any system issues."
        },
        {
          question: "What should I do if the platform is not loading?",
          answer: "First, check your internet connection and try refreshing the page. Clear your browser cache and cookies, or try a different browser. Check our status page for any known issues. If problems persist, contact our support team."
        },
        {
          question: "How do I connect TradingView to TradeBitcoin?",
          answer: "Go to Settings > API Keys, generate a new API key with appropriate permissions, then use these credentials in TradingView's exchange connection settings. Enable only the permissions you need for security."
        },
        {
          question: "Why am I seeing 'Insufficient Balance' errors?",
          answer: "This error occurs when you don't have enough funds for the intended trade, including fees. Check your available balance, not just total balance. Some funds may be reserved for open orders or pending withdrawals."
        }
      ]
    },
    {
      title: "API & Integration",
      icon: <Bot className="h-6 w-6 text-indigo-600" />,
      faqs: [
        {
          question: "How do I get API access?",
          answer: "API access is available for Professional and Enterprise plan users. Go to Settings > API Keys, generate your keys, and set appropriate permissions. Keep your API keys secure and never share them publicly."
        },
        {
          question: "What are the API rate limits?",
          answer: "API rate limits depend on your subscription plan. Starter: 60 requests/minute. Professional: 300 requests/minute. Enterprise: 1000+ requests/minute. WebSocket connections have separate limits for real-time data."
        },
        {
          question: "Can I use trading bots with the API?",
          answer: "Yes, our API supports bot trading. Ensure your bot handles errors gracefully, respects rate limits, and implements proper risk management. We provide SDKs for Python, JavaScript, and other popular languages."
        },
        {
          question: "How do I handle API authentication?",
          answer: "Use HMAC-SHA256 authentication with your API key and secret. Include the API key in the request header and sign each request with your secret key. Refer to our API documentation for detailed implementation examples."
        }
      ]
    }
  ]

  const quickActions = [
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: <Video className="h-8 w-8 text-red-600" />,
      action: "Watch Videos",
      link: "/tutorials"
    },
    {
      title: "User Guides",
      description: "Comprehensive written guides",
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      action: "Read Guides",
      link: "/guides"
    },
    {
      title: "API Documentation",
      description: "Technical API reference",
      icon: <FileText className="h-8 w-8 text-purple-600" />,
      action: "View Docs",
      link: "/docs/api"
    },
    {
      title: "Community Forum",
      description: "Connect with other traders",
      icon: <Users className="h-8 w-8 text-green-600" />,
      action: "Join Forum",
      link: "/community"
    }
  ]

  const contactOptions = [
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: <MessageCircle className="h-6 w-6 text-blue-600" />,
      availability: "Available 24/7",
      action: "Start Chat",
      link: "/chat"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message",
      icon: <Mail className="h-6 w-6 text-green-600" />,
      availability: "Response within 24h",
      action: "Send Email",
      link: "mailto:support@tradebitcoin.com"
    },
    {
      title: "Phone Support",
      description: "Speak with a support agent",
      icon: <Phone className="h-6 w-6 text-purple-600" />,
      availability: "Mon-Fri 9AM-6PM EST",
      action: "Call Now",
      link: "tel:+15551234567"
    },
    {
      title: "Community Help",
      description: "Get help from other users",
      icon: <Users className="h-6 w-6 text-orange-600" />,
      availability: "Always available",
      action: "Join Community",
      link: "/community"
    }
  ]

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Help Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            How Can We
            <span className="text-orange-500"> Help You?</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find answers to common questions, access our knowledge base, or get in touch with our support team for personalized assistance.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help articles, FAQs, and topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {quickActions.map((action, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {action.icon}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Link href={action.link}>
                    <Button variant="outline" className="w-full">
                      {action.action}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions about TradeBitcoin
            </p>
          </div>

          {searchQuery && (
            <div className="mb-8 text-center">
              <p className="text-gray-600">
                Search results for: <span className="font-semibold">"{searchQuery}"</span>
              </p>
            </div>
          )}

          <div className="space-y-12">
            {filteredFaqs.map((category, index) => (
              <div key={index}>
                <div className="flex items-center space-x-3 mb-6">
                  {category.icon}
                  <h3 className="text-2xl font-bold text-gray-900">{category.title}</h3>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any results matching your search. Try different keywords or browse our FAQ categories.
              </p>
              <Button onClick={() => setSearchQuery('')} variant="outline">
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600">
              Our support team is here to help you with any questions or issues
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactOptions.map((option, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {option.icon}
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {option.availability}
                  </div>
                  <Link href={option.link}>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      {option.action}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              System Status
            </h2>
            <p className="text-lg text-gray-600">
              Check the current status of our services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Trading Platform</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Operational
                </Badge>
                <p className="text-sm text-gray-600 mt-2">All systems normal</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">API Services</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Operational
                </Badge>
                <p className="text-sm text-gray-600 mt-2">Normal response times</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-lg">Withdrawals</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Operational
                </Badge>
                <p className="text-sm text-gray-600 mt-2">Processing normally</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/status">
              <Button variant="outline" className="mr-4">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Detailed Status
              </Button>
            </Link>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Subscribe to Updates
            </Button>
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
            Join thousands of traders who trust TradeBitcoin for their cryptocurrency trading needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-orange-600">
                Get Started Today
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