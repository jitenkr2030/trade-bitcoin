'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Share, 
  Star,
  Award,
  Calendar,
  CheckCircle,
  ExternalLink,
  Link,
  Target,
  BarChart3,
  Crown,
  GiftIcon,
  CopyIcon,
  Share2,
  UserPlus,
  Activity,
  CreditCard,
  PiggyBank,
  Globe,
  Mail,
  MessageSquare,
  FileText,
  Download,
  Calculator,
  PieChart,
  LineChart,
  Rocket,
  Shield,
  Headphones,
  Zap
} from 'lucide-react'

interface AffiliateStats {
  totalEarnings: number
  monthlyEarnings: number
  activeReferrals: number
  conversionRate: number
  averageCommission: number
  affiliateLink: string
  affiliateId: string
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond'
}

interface CommissionStructure {
  tier: string
  revenueShare: number
  cpa: number
  hybrid: boolean
  requirements: string[]
  benefits: string[]
}

interface MarketingMaterial {
  id: string
  name: string
  type: 'banner' | 'landing' | 'email' | 'social' | 'video'
  description: string
  downloads: number
  size: string
  format: string
}

interface Payout {
  id: string
  amount: number
  method: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  transactionId?: string
}

interface AffiliateResource {
  id: string
  title: string
  description: string
  type: 'guide' | 'template' | 'tool' | 'webinar'
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

const affiliateStats: AffiliateStats = {
  totalEarnings: 15420,
  monthlyEarnings: 2840,
  activeReferrals: 156,
  conversionRate: 12.5,
  averageCommission: 85,
  affiliateLink: 'https://tradebitcoin.com/affiliate/johnsmith',
  affiliateId: 'TB-AFF-12345',
  tier: 'Gold'
}

const commissionStructures: CommissionStructure[] = [
  {
    tier: 'Bronze',
    revenueShare: 25,
    cpa: 50,
    hybrid: true,
    requirements: ['0-50 active traders', 'Basic verification'],
    benefits: ['25% revenue share', '$50 CPA', 'Standard support', 'Basic analytics']
  },
  {
    tier: 'Silver',
    revenueShare: 35,
    cpa: 100,
    hybrid: true,
    requirements: ['51-200 active traders', '3 months activity'],
    benefits: ['35% revenue share', '$100 CPA', 'Priority support', 'Advanced analytics', 'Monthly reports']
  },
  {
    tier: 'Gold',
    revenueShare: 45,
    cpa: 200,
    hybrid: true,
    requirements: ['201-500 active traders', '6 months activity'],
    benefits: ['45% revenue share', '$200 CPA', 'Dedicated manager', 'Premium analytics', 'Custom creatives', 'Quarterly bonuses']
  },
  {
    tier: 'Platinum',
    revenueShare: 55,
    cpa: 350,
    hybrid: true,
    requirements: ['501-1000 active traders', '12 months activity'],
    benefits: ['55% revenue share', '$350 CPA', 'VIP support', 'White-glove service', 'Custom commission structure', 'Exclusive events']
  },
  {
    tier: 'Diamond',
    revenueShare: 65,
    cpa: 500,
    hybrid: true,
    requirements: ['1000+ active traders', '18 months activity'],
    benefits: ['65% revenue share', '$500 CPA', '24/7 VIP support', 'Revenue sharing', 'Partnership opportunities', 'Custom solutions']
  }
]

const marketingMaterials: MarketingMaterial[] = [
  {
    id: '1',
    name: 'Homepage Banner 728x90',
    type: 'banner',
    description: 'Standard leaderboard banner for website headers',
    downloads: 1234,
    size: '45KB',
    format: 'PNG, JPG'
  },
  {
    id: '2',
    name: 'Landing Page Template',
    type: 'landing',
    description: 'High-converting landing page template for TradeBitcoin',
    downloads: 856,
    size: '2.1MB',
    format: 'HTML, CSS'
  },
  {
    id: '3',
    name: 'Email Campaign Kit',
    type: 'email',
    description: 'Complete email marketing campaign with templates and graphics',
    downloads: 567,
    size: '1.8MB',
    format: 'ZIP'
  },
  {
    id: '4',
    name: 'Social Media Pack',
    type: 'social',
    description: 'Social media graphics and posts for all platforms',
    downloads: 2341,
    size: '3.2MB',
    format: 'ZIP'
  },
  {
    id: '5',
    name: 'Promotional Video',
    type: 'video',
    description: '30-second promotional video for TradeBitcoin',
    downloads: 789,
    size: '15.4MB',
    format: 'MP4'
  }
]

const payouts: Payout[] = [
  {
    id: '1',
    amount: 2840,
    method: 'Bitcoin',
    status: 'completed',
    date: '2024-01-15T10:00:00Z',
    transactionId: 'tx123456789'
  },
  {
    id: '2',
    amount: 2650,
    method: 'Bank Transfer',
    status: 'completed',
    date: '2023-12-15T10:00:00Z',
    transactionId: 'bt987654321'
  },
  {
    id: '3',
    amount: 2980,
    method: 'PayPal',
    status: 'pending',
    date: '2024-02-15T10:00:00Z'
  }
]

const affiliateResources: AffiliateResource[] = [
  {
    id: '1',
    title: 'Affiliate Marketing Guide',
    description: 'Complete guide to successful affiliate marketing for cryptocurrency platforms',
    type: 'guide',
    category: 'Marketing',
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: 'Landing Page Templates',
    description: 'Pre-built landing page templates optimized for conversions',
    type: 'template',
    category: 'Design',
    difficulty: 'Intermediate'
  },
  {
    id: '3',
    title: 'ROI Calculator',
    description: 'Calculate your potential earnings and ROI as an affiliate',
    type: 'tool',
    category: 'Analytics',
    difficulty: 'Beginner'
  },
  {
    id: '4',
    title: 'Advanced SEO Strategies',
    description: 'Learn advanced SEO techniques to drive more traffic',
    type: 'webinar',
    category: 'Marketing',
    difficulty: 'Advanced'
  }
]

export default function AffiliatePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentCommission = commissionStructures.find(struct => struct.tier === affiliateStats.tier)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Affiliate Program</h1>
              <p className="text-xl md:text-2xl mb-8">
                Partner with TradeBitcoin and earn up to 65% revenue share. Join thousands of successful affiliates worldwide.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Rocket className="w-5 h-5 mr-2" />
                  Apply Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Earnings
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Top Performer</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Current Tier</span>
                      <Badge variant="secondary">{affiliateStats.tier}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Earnings</span>
                      <Badge variant="secondary">${affiliateStats.monthlyEarnings}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Traders</span>
                      <Badge variant="secondary">{affiliateStats.activeReferrals}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission Rate</span>
                      <Badge variant="secondary">{currentCommission?.revenueShare}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Structure */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Commission Structure</h2>
            <p className="text-lg text-gray-600">
              Earn more as you grow. Our tiered structure rewards top performers with higher commissions.
            </p>
          </div>

          <div className="space-y-4">
            {commissionStructures.map(structure => (
              <Card key={structure.tier} className={`${structure.tier === affiliateStats.tier ? 'border-orange-500 border-2' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        structure.tier === affiliateStats.tier ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {structure.tier === 'Bronze' && <Crown className="w-8 h-8" />}
                        {structure.tier === 'Silver' && <Star className="w-8 h-8" />}
                        {structure.tier === 'Gold' && <Award className="w-8 h-8" />}
                        {structure.tier === 'Platinum' && <GiftIcon className="w-8 h-8" />}
                        {structure.tier === 'Diamond' && <Target className="w-8 h-8" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          {structure.tier} Tier
                          {structure.tier === affiliateStats.tier && <Badge variant="secondary">Current</Badge>}
                        </h3>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>{structure.revenueShare}% Revenue Share</span>
                          <span>${structure.cpa} CPA</span>
                          <span>{structure.hybrid ? 'Hybrid' : 'Rev Share Only'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">Up to ${structure.revenueShare > 50 ? '10,000+' : '5,000+'}/month</div>
                      <div className="text-sm text-gray-600">potential earnings</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {structure.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Benefits:</h4>
                      <ul className="space-y-2">
                        {structure.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="materials">Marketing</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-green-600" />
                      <Badge variant="secondary">+15%</Badge>
                    </div>
                    <div className="text-2xl font-bold">${affiliateStats.totalEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                      <Badge variant="secondary">+8%</Badge>
                    </div>
                    <div className="text-2xl font-bold">${affiliateStats.monthlyEarnings.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Monthly Earnings</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-orange-600" />
                      <Badge variant="secondary">+12%</Badge>
                    </div>
                    <div className="text-2xl font-bold">{affiliateStats.activeReferrals}</div>
                    <div className="text-sm text-gray-600">Active Traders</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                      <Badge variant="secondary">Excellent</Badge>
                    </div>
                    <div className="text-2xl font-bold">{affiliateStats.conversionRate}%</div>
                    <div className="text-sm text-gray-600">Conversion Rate</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Affiliate Link</CardTitle>
                    <CardDescription>
                      Share this link to start earning commissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        value={affiliateStats.affiliateLink} 
                        readOnly 
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        onClick={() => copyToClipboard(affiliateStats.affiliateLink)}
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        value={affiliateStats.affiliateId} 
                        readOnly 
                        placeholder="Affiliate ID"
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-orange-600 hover:bg-orange-700">
                        <Globe className="w-4 h-4 mr-2" />
                        Share on Social Media
                      </Button>
                      <Button variant="outline">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Campaign
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Earnings Calculator</CardTitle>
                    <CardDescription>
                      Estimate your potential earnings as an affiliate
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Monthly Referrals</label>
                      <Input type="number" placeholder="50" defaultValue="50" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Average Deposit</label>
                      <Input type="number" placeholder="1000" defaultValue="1000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Commission Rate</label>
                      <Input type="number" placeholder="45" defaultValue="45" />
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-lg font-semibold">Estimated Monthly: $2,250</div>
                      <div className="text-sm text-gray-600">Estimated Yearly: $27,000</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Marketing Tab */}
            <TabsContent value="materials" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Marketing Materials</h2>
                <p className="text-lg text-gray-600">
                  Access professionally designed marketing materials to boost your conversions
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketingMaterials.map(material => (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{material.type}</Badge>
                        <Badge variant="secondary">{material.downloads} downloads</Badge>
                      </div>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <CardDescription>{material.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Size: {material.size}</span>
                          <span>Format: {material.format}</span>
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Performance Analytics</h2>
                <p className="text-lg text-gray-600">
                  Track your affiliate performance with detailed analytics and insights
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5" />
                      Earnings Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <LineChart className="w-16 h-16 text-orange-600" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="font-semibold">${affiliateStats.monthlyEarnings}</div>
                        <div className="text-sm text-gray-600">This Month</div>
                      </div>
                      <div>
                        <div className="font-semibold">${Math.round(affiliateStats.monthlyEarnings * 0.85)}</div>
                        <div className="text-sm text-gray-600">Last Month</div>
                      </div>
                      <div>
                        <div className="font-semibold text-green-600">+15%</div>
                        <div className="text-sm text-gray-600">Growth</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5" />
                      Traffic Sources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                      <PieChart className="w-16 h-16 text-blue-600" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          Direct Traffic
                        </span>
                        <span>45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          Social Media
                        </span>
                        <span>30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                          Email Marketing
                        </span>
                        <span>15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                          Other
                        </span>
                        <span>10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payouts Tab */}
            <TabsContent value="payouts" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Payout History</h2>
                <p className="text-lg text-gray-600">
                  Track your earnings and payout history
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Payouts</CardTitle>
                  <CardDescription>
                    Your latest payout transactions and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payouts.map(payout => (
                      <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            payout.status === 'completed' ? 'bg-green-100 text-green-600' :
                            payout.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium">${payout.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">{payout.method}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={payout.status === 'completed' ? 'default' : 'secondary'}
                              className={
                                payout.status === 'completed' ? 'bg-green-600' :
                                payout.status === 'pending' ? 'bg-yellow-600' : 'bg-red-600'
                              }
                            >
                              {payout.status}
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-600">
                            {new Date(payout.date).toLocaleDateString()}
                          </span>
                          {payout.transactionId && (
                            <div className="text-xs text-gray-500">
                              ID: {payout.transactionId}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Affiliate Resources</h2>
                <p className="text-lg text-gray-600">
                  Access guides, templates, and tools to maximize your affiliate success
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {affiliateResources.map(resource => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Badge variant="secondary">{resource.difficulty}</Badge>
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{resource.category}</span>
                        <Button variant="outline" size="sm">
                          {resource.type === 'guide' && <FileText className="w-4 h-4 mr-1" />}
                          {resource.type === 'template' && <Download className="w-4 h-4 mr-1" />}
                          {resource.type === 'tool' && <Calculator className="w-4 h-4 mr-1" />}
                          {resource.type === 'webinar' && <MessageSquare className="w-4 h-4 mr-1" />}
                          Access
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Join Our Affiliate Program?</h2>
            <p className="text-lg text-gray-600">
              Discover the benefits of partnering with TradeBitcoin
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle className="mb-4">High Commissions</CardTitle>
                <CardDescription>
                  Earn up to 65% revenue share with competitive CPA rates and hybrid commission models
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="mb-4">Reliable Tracking</CardTitle>
                <CardDescription>
                  Advanced tracking technology ensures accurate commission calculation and timely payments
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="mb-4">Dedicated Support</CardTitle>
                <CardDescription>
                  Get personalized support from dedicated affiliate managers and marketing experts
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our affiliate program today and start earning generous commissions by promoting TradeBitcoin.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              <Rocket className="w-5 h-5 mr-2" />
              Apply Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Your Earnings
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}