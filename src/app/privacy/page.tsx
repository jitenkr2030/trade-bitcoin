import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, Eye, Lock, Database, Globe, FileText, Calendar, Download } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  const privacySections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-6 w-6 text-blue-600" />,
      content: [
        {
          subtitle: "Personal Information",
          description: "When you create an account, we collect your name, email address, and phone number. For business accounts, we may collect additional business information."
        },
        {
          subtitle: "Trading Data",
          description: "We collect information about your trading activities, including transaction history, portfolio data, and trading preferences to provide our services."
        },
        {
          subtitle: "Technical Information",
          description: "We automatically collect device information, IP addresses, browser type, and usage data to improve our platform and ensure security."
        },
        {
          subtitle: "Communications",
          description: "We record your communications with our support team and may collect feedback through surveys and user interactions."
        }
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="h-6 w-6 text-green-600" />,
      content: [
        {
          subtitle: "Service Provision",
          description: "To provide, maintain, and improve our trading platform, including executing trades, generating analytics, and managing your portfolio."
        },
        {
          subtitle: "Security and Fraud Prevention",
          description: "To protect your account, prevent fraud, and ensure the security of our platform and all users' assets."
        },
        {
          subtitle: "Communication",
          description: "To send you important account notifications, security alerts, and respond to your support inquiries."
        },
        {
          subtitle: "Marketing",
          description: "With your consent, we may send you promotional materials about our services and features. You can opt out at any time."
        }
      ]
    },
    {
      title: "Data Protection and Security",
      icon: <Lock className="h-6 w-6 text-purple-600" />,
      content: [
        {
          subtitle: "Encryption",
          description: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption standards."
        },
        {
          subtitle: "Access Controls",
          description: "We implement strict access controls and authentication mechanisms to ensure only authorized personnel can access your data."
        },
        {
          subtitle: "Regular Audits",
          description: "We conduct regular security audits and vulnerability assessments to maintain the highest security standards."
        },
        {
          subtitle: "Compliance",
          description: "We comply with GDPR, CCPA, and other relevant data protection regulations to ensure your privacy rights are protected."
        }
      ]
    },
    {
      title: "Data Sharing and Third Parties",
      icon: <Globe className="h-6 w-6 text-orange-600" />,
      content: [
        {
          subtitle: "Exchange Partners",
          description: "We share necessary trading information with cryptocurrency exchanges to execute trades on your behalf."
        },
        {
          subtitle: "Service Providers",
          description: "We work with trusted third-party service providers for hosting, analytics, and customer support, all under strict confidentiality agreements."
        },
        {
          subtitle: "Legal Requirements",
          description: "We may disclose your information if required by law, regulation, or to protect our rights, safety, or property."
        },
        {
          subtitle: "Business Transfers",
          description: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction."
        }
      ]
    },
    {
      title: "Your Privacy Rights",
      icon: <Shield className="h-6 w-6 text-red-600" />,
      content: [
        {
          subtitle: "Access and Portability",
          description: "You have the right to access, export, and request a copy of your personal data in a machine-readable format."
        },
        {
          subtitle: "Correction and Deletion",
          description: "You can request correction of inaccurate personal data or deletion of your data, subject to legal obligations."
        },
        {
          subtitle: "Opt-Out",
          description: "You can opt out of marketing communications and certain data collection activities through your account settings."
        },
        {
          subtitle: "Complaints",
          description: "You have the right to file complaints with data protection authorities if you believe your privacy rights have been violated."
        }
      ]
    },
    {
      title: "International Data Transfers",
      icon: <Globe className="h-6 w-6 text-blue-600" />,
      content: [
        {
          subtitle: "Global Operations",
          description: "TradeBitcoin operates globally, and your data may be transferred and processed in different countries to provide our services."
        },
        {
          subtitle: "Adequate Protection",
          description: "We ensure appropriate safeguards are in place for international data transfers, including standard contractual clauses and other legal mechanisms."
        },
        {
          subtitle: "Compliance",
          description: "All international data transfers comply with applicable data protection laws and regulations."
        }
      ]
    }
  ]

  const cookiePolicy = {
    title: "Cookie Policy",
    icon: <FileText className="h-6 w-6 text-yellow-600" />,
    content: [
      {
        subtitle: "Essential Cookies",
        description: "Necessary for the website to function properly, including authentication, security, and session management."
      },
      {
        subtitle: "Analytics Cookies",
        description: "Help us understand how visitors interact with our website to improve user experience and platform performance."
      },
      {
        subtitle: "Functional Cookies",
        description: "Remember your preferences and settings to provide a personalized experience across your sessions."
      },
      {
        subtitle: "Marketing Cookies",
        description: "Used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns."
      }
    ]
  }

  const dataRetention = {
    title: "Data Retention",
    icon: <Calendar className="h-6 w-6 text-indigo-600" />,
    content: [
      {
        subtitle: "Account Data",
        description: "We retain your account data while your account is active and for a reasonable period after account closure as required by law."
      },
      {
        subtitle: "Trading Data",
        description: "Trading history and transaction records are retained for 7 years to comply with financial regulations and tax requirements."
      },
      {
        subtitle: "Analytics Data",
        description: "Usage analytics and performance data are retained for 2 years to improve our services and platform functionality."
      },
      {
        subtitle: "Marketing Data",
        description: "Marketing preferences and communication history are retained until you request deletion or close your account."
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Privacy Policy
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Privacy is Our
            <span className="text-orange-500"> Priority</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            At TradeBitcoin, we are committed to protecting your personal information and ensuring your privacy. This policy explains how we collect, use, and safeguard your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
              <Download className="h-5 w-5 mr-2" />
              Download PDF
            </Button>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Privacy Team
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
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Last Updated: November 15, 2024</span>
            </div>
            <Badge variant="outline">Version 2.1</Badge>
          </div>
        </div>
      </section>

      {/* Privacy Sections */}
      <div className="py-16">
        {privacySections.map((section, index) => (
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

      {/* Cookie Policy Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-4 mb-8">
            <div className="flex-shrink-0">
              {cookiePolicy.icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {cookiePolicy.title}
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {cookiePolicy.content.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg">
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

      {/* Data Retention Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-4 mb-8">
            <div className="flex-shrink-0">
              {dataRetention.icon}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {dataRetention.title}
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {dataRetention.content.map((item, index) => (
              <Card key={index} className="border-0 shadow-lg">
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

      {/* Contact Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Questions About Your Privacy?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Our privacy team is here to help you understand your rights and how we protect your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-orange-600">
                Contact Privacy Team
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Download className="h-5 w-5 mr-2" />
              Download Full Policy
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}