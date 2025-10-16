import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, TrendingUp, Users, Globe, Award, Target } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "CEO & Founder",
      bio: "Former quantitative trader with 15+ years experience in financial markets and cryptocurrency trading.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      bio: "Blockchain architect and software engineer with expertise in distributed systems and high-frequency trading.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Mike Rodriguez",
      role: "Head of Trading",
      bio: "Professional trader specializing in algorithmic trading strategies and risk management.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Emily Davis",
      role: "Lead Security Engineer",
      bio: "Cybersecurity expert focused on protecting digital assets and ensuring platform integrity.",
      image: "/api/placeholder/150/150"
    }
  ]

  const milestones = [
    {
      year: "2020",
      title: "Founded",
      description: "TradeBitcoin was established with a vision to democratize professional Bitcoin trading tools."
    },
    {
      year: "2021",
      title: "Platform Launch",
      description: "Released our first trading platform with basic automated trading capabilities."
    },
    {
      year: "2022",
      title: "Multi-Exchange Integration",
      description: "Expanded support to major cryptocurrency exchanges, providing unified trading experience."
    },
    {
      year: "2023",
      title: "AI-Powered Analytics",
      description: "Introduced advanced AI algorithms for market analysis and trading strategy optimization."
    },
    {
      year: "2024",
      title: "Enterprise Solutions",
      description: "Launched enterprise-grade features and white-label solutions for institutional clients."
    }
  ]

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Security First",
      description: "Bank-grade encryption and multi-layer security protocols to protect your assets and data."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Innovation",
      description: "Continuously pushing the boundaries of trading technology and market analysis."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Community Driven",
      description: "Built by traders, for traders. Our community shapes our product development."
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: "Global Access",
      description: "Providing access to professional trading tools to traders worldwide."
    },
    {
      icon: <Award className="h-8 w-8 text-yellow-600" />,
      title: "Excellence",
      description: "Committed to delivering the highest quality trading experience and customer support."
    },
    {
      icon: <Target className="h-8 w-8 text-red-600" />,
      title: "Results Focused",
      description: "Our success is measured by the success of our traders and their profitability."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            About TradeBitcoin
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Empowering Traders with
            <span className="text-orange-500"> Advanced Technology</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're building the future of Bitcoin trading by combining cutting-edge technology with deep market expertise. Our mission is to provide professional-grade trading tools to everyone, from beginners to institutional traders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Join Our Community
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                At TradeBitcoin, we believe that everyone should have access to professional trading tools and insights. Our mission is to democratize Bitcoin trading by providing enterprise-grade technology to traders of all levels.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We're committed to creating a platform that combines powerful automation, real-time analytics, and intuitive design to help traders make informed decisions and maximize their potential in the cryptocurrency markets.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">50K+</div>
                  <div className="text-sm text-gray-600">Active Traders</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">$50B+</div>
                  <div className="text-sm text-gray-600">Monthly Volume</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {values.slice(0, 4).map((value, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-2">
                      {value.icon}
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide our decisions and shape our company culture
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600">
              Key milestones in our mission to revolutionize Bitcoin trading
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-orange-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 pr-8">
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <Badge variant="outline" className="w-fit mb-2">
                          {milestone.year}
                        </Badge>
                        <CardTitle className="text-xl">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {milestone.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600">
              The experts behind TradeBitcoin's innovative trading platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-orange-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Become part of the growing community of successful traders on TradeBitcoin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" variant="secondary" className="text-orange-600">
                Get Started Today
              </Button>
            </Link>
            <Link href="/contact">
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