import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Shield, AlertTriangle, CheckCircle, Clock, DollarSign, Users, Globe, Download } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  const termsSections = [
    {
      title: "Acceptance of Terms",
      icon: <FileText className="h-6 w-6 text-blue-600" />,
      content: [
        {
          subtitle: "Agreement",
          description: "By accessing and using TradeBitcoin's services, you agree to be bound by these Terms of Service and all applicable laws and regulations."
        },
        {
          subtitle: "Age Restriction",
          description: "You must be at least 18 years of age to use our services. By using TradeBitcoin, you confirm that you meet this age requirement."
        },
        {
          subtitle: "Modifications",
          description: "We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms."
        }
      ]
    },
    {
      title: "Services Description",
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      content: [
        {
          subtitle: "Trading Platform",
          description: "TradeBitcoin provides a cryptocurrency trading platform that allows users to buy, sell, and trade Bitcoin and other cryptocurrencies."
        },
        {
          subtitle: "Automated Trading",
          description: "We offer automated trading bots and strategies that can execute trades based on predefined parameters and market conditions."
        },
        {
          subtitle: "Analytics and Tools",
          description: "Our platform includes market analysis tools, portfolio tracking, and performance analytics to help users make informed trading decisions."
        },
        {
          subtitle: "API Access",
          description: "We provide API access for developers to integrate with our platform and build custom trading applications."
        }
      ]
    },
    {
      title: "User Responsibilities",
      icon: <Users className="h-6 w-6 text-purple-600" />,
      content: [
        {
          subtitle: "Account Security",
          description: "You are responsible for maintaining the security of your account, including your password and two-factor authentication settings."
        },
        {
          subtitle: "Accurate Information",
          description: "You must provide accurate and complete information when creating your account and keep this information updated."
        },
        {
          subtitle: "Compliance",
          description: "You agree to comply with all applicable laws and regulations regarding cryptocurrency trading in your jurisdiction."
        },
        {
          subtitle: "Prohibited Activities",
          description: "You may not use our services for illegal activities, market manipulation, money laundering, or any fraudulent purposes."
        }
      ]
    },
    {
      title: "Fees and Payments",
      icon: <DollarSign className="h-6 w-6 text-orange-600" />,
      content: [
        {
          subtitle: "Trading Fees",
          description: "We charge fees for executed trades, which vary based on your subscription plan and trading volume. Fee schedules are available in your account."
        },
        {
          subtitle: "Subscription Plans",
          description: "We offer various subscription plans with different features and pricing. Fees are billed monthly or annually as selected."
        },
        {
          subtitle: "Payment Methods",
          description: "We accept various payment methods including credit cards, bank transfers, and cryptocurrency payments."
        },
        {
          subtitle: "Refunds",
          description: "Refunds are available within 30 days of purchase for annual subscriptions, subject to our refund policy terms."
        }
      ]
    },
    {
      title: "Risk Disclosure",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
      content: [
        {
          subtitle: "Market Risk",
          description: "Cryptocurrency trading involves substantial risk, including the potential loss of principal. Market volatility can significantly impact your investments."
        },
        {
          subtitle: "Technical Risk",
          description: "Technical issues, system failures, or connectivity problems may affect your ability to trade or access your account."
        },
        {
          subtitle: "Regulatory Risk",
          description: "Changes in regulations or government actions may affect the legality and availability of cryptocurrency trading in your jurisdiction."
        },
        {
          subtitle: "Security Risk",
          description: "Despite our security measures, no system is completely secure. There is always a risk of unauthorized access or cyber attacks."
        }
      ]
    },
    {
      title: "Limitation of Liability",
      icon: <Shield className="h-6 w-6 text-indigo-600" />,
      content: [
        {
          subtitle: "No Warranty",
          description: "Our services are provided 'as is' without any warranties, express or implied, including warranties of merchantability or fitness for a particular purpose."
        },
        {
          subtitle: "Liability Cap",
          description: "Our liability is limited to the fees you paid us in the 12 months preceding the event giving rise to the claim."
        },
        {
          subtitle: "No Consequential Damages",
          description: "We are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services."
        },
        {
          subtitle: "Force Majeure",
          description: "We are not responsible for failures or delays due to circumstances beyond our reasonable control, including natural disasters or government actions."
        }
      ]
    },
    {
      title: "Intellectual Property",
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      content: [
        {
          subtitle: "Platform Ownership",
          description: "TradeBitcoin and all related intellectual property are owned by us or our licensors and are protected by copyright and other laws."
        },
        {
          subtitle: "User Content",
          description: "You retain ownership of content you create, but grant us a license to use, display, and distribute it to provide our services."
        },
        {
          subtitle: "Trademarks",
          description: "All trademarks, service marks, and trade names used on our platform are the property of their respective owners."
        },
        {
          subtitle: "Restrictions",
          description: "You may not copy, modify, distribute, or create derivative works of our platform without our express written permission."
        }
      ]
    },
    {
      title: "Termination",
      icon: <Clock className="h-6 w-6 text-gray-600" />,
      content: [
        {
          subtitle: "Termination by User",
          description: "You may terminate your account at any time by contacting our support team or through your account settings."
        },
        {
          subtitle: "Termination by Us",
          description: "We may terminate or suspend your account for violations of these terms, fraudulent activity, or at our discretion."
        },
        {
          subtitle: "Effect of Termination",
          description: "Upon termination, your right to use our services ceases immediately, and we may delete your data subject to legal requirements."
        },
        {
          subtitle: "Survival",
          description: "Certain provisions of these terms, including liability limitations and intellectual property rights, survive termination."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Terms of Service
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Terms of
            <span className="text-orange-500"> Service</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Please read these terms carefully before using TradeBitcoin's services. Your use of our platform constitutes acceptance of these terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </Button>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Legal Team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Last Updated: November 15, 2024</span>
            </div>
            <Badge variant="outline">Version 3.0</Badge>
          </div>
        </div>
      </section>

      {/* Terms Sections */}
      <div className="py-16">
        {termsSections.map((section, index) => (
          <section key={index} className={`py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-start space-x-4 mb-8">
                <div className="flex-shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {section.content.map((item, itemIndex) => (
                  <Card key={itemIndex} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">{item.subtitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {item.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Important Notice Section */}
      <section className="py-16 bg-orange-50 border-t border-b border-orange-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Important Notice
            </h2>
          </div>
          <Card className="border-2 border-orange-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-orange-800">Risk Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base text-gray-700">
                <p className="mb-4">
                  Cryptocurrency trading carries significant risk and is not suitable for all investors. The value of cryptocurrencies can be extremely volatile and may be affected by various factors including changes in regulation, market sentiment, and technological developments.
                </p>
                <p className="mb-4">
                  You should carefully consider your investment objectives, level of experience, and risk appetite before deciding to trade cryptocurrencies. Never invest money that you cannot afford to lose.
                </p>
                <p>
                  TradeBitcoin provides tools and services for informational purposes only. Past performance is not indicative of future results. We strongly recommend consulting with a qualified financial advisor before making any investment decisions.
                </p>
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Governing Law Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Governing Law and Dispute Resolution
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  These Terms of Service and your use of TradeBitcoin's services shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Any disputes arising from these terms shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. Class action waivers and individual arbitration provisions apply.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Have Legal Questions?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Our legal team is available to answer any questions about our Terms of Service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-orange-600">
                Contact Legal Team
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Download className="h-5 w-5 mr-2" />
              Download Full Terms
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}