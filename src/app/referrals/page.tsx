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
  Gift, 
  Copy, 
  Share, 
  TrendingUp, 
  DollarSign, 
  Star,
  Award,
  Calendar,
  CheckCircle,
  ExternalLink,
  QrCode,
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
  PiggyBank
} from 'lucide-react'

interface ReferralStats {
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  pendingEarnings: number
  conversionRate: number
  referralLink: string
  referralCode: string
}

interface ReferralTier {
  name: string
  level: number
  referralsRequired: number
  commissionRate: number
  benefits: string[]
  current: boolean
}

interface ReferralActivity {
  id: string
  type: 'signup' | 'deposit' | 'trade' | 'earn'
  user: string
  amount: number
  date: string
  status: 'completed' | 'pending'
}

interface Reward {
  id: string
  name: string
  description: string
  type: 'cash' | 'bonus' | 'feature' | 'merchandise'
  value: number
  requiredReferrals: number
  claimed: boolean
}

const referralStats: ReferralStats = {
  totalReferrals: 24,
  activeReferrals: 18,
  totalEarnings: 2840,
  pendingEarnings: 320,
  conversionRate: 75,
  referralLink: 'https://tradebitcoin.com/ref/johnsmith123',
  referralCode: 'JOHNSMITH123'
}

const referralTiers: ReferralTier[] = [
  {
    name: 'Bronze',
    level: 1,
    referralsRequired: 0,
    commissionRate: 10,
    benefits: ['10% commission on trading fees', 'Basic referral dashboard', 'Email support'],
    current: true
  },
  {
    name: 'Silver',
    level: 2,
    referralsRequired: 10,
    commissionRate: 15,
    benefits: ['15% commission on trading fees', 'Advanced analytics', 'Priority support', 'Monthly reports'],
    current: false
  },
  {
    name: 'Gold',
    level: 3,
    referralsRequired: 25,
    commissionRate: 20,
    benefits: ['20% commission on trading fees', 'Premium analytics', 'Dedicated account manager', 'Custom referral materials'],
    current: false
  },
  {
    name: 'Platinum',
    level: 4,
    referralsRequired: 50,
    commissionRate: 25,
    benefits: ['25% commission on trading fees', 'VIP support', 'Exclusive events', 'Custom commission structure'],
    current: false
  },
  {
    name: 'Diamond',
    level: 5,
    referralsRequired: 100,
    commissionRate: 30,
    benefits: ['30% commission on trading fees', 'White-glove service', 'Revenue sharing', 'Partnership opportunities'],
    current: false
  }
]

const referralActivities: ReferralActivity[] = [
  {
    id: '1',
    type: 'signup',
    user: 'Alice Johnson',
    amount: 0,
    date: '2024-01-15T10:30:00Z',
    status: 'completed'
  },
  {
    id: '2',
    type: 'deposit',
    user: 'Bob Smith',
    amount: 1000,
    date: '2024-01-14T15:45:00Z',
    status: 'completed'
  },
  {
    id: '3',
    type: 'trade',
    user: 'Charlie Brown',
    amount: 50,
    date: '2024-01-13T09:20:00Z',
    status: 'completed'
  },
  {
    id: '4',
    type: 'earn',
    user: 'Diana Prince',
    amount: 25,
    date: '2024-01-12T14:15:00Z',
    status: 'pending'
  },
  {
    id: '5',
    type: 'signup',
    user: 'Eve Wilson',
    amount: 0,
    date: '2024-01-11T16:30:00Z',
    status: 'completed'
  }
]

const rewards: Reward[] = [
  {
    id: '1',
    name: '$50 Cash Bonus',
    description: 'Get $50 cash bonus when you refer 5 active traders',
    type: 'cash',
    value: 50,
    requiredReferrals: 5,
    claimed: true
  },
  {
    id: '2',
    name: 'Trading Fee Credits',
    description: 'Receive $100 in trading fee credits for 10 referrals',
    type: 'bonus',
    value: 100,
    requiredReferrals: 10,
    claimed: false
  },
  {
    id: '3',
    name: 'Premium Features Access',
    description: 'Unlock premium trading features for 1 month',
    type: 'feature',
    value: 0,
    requiredReferrals: 15,
    claimed: false
  },
  {
    id: '4',
    name: 'TradeBitcoin Merchandise',
    description: 'Exclusive TradeBitcoin branded merchandise pack',
    type: 'merchandise',
    value: 75,
    requiredReferrals: 20,
    claimed: false
  },
  {
    id: '5',
    name: '$500 Cash Bonus',
    description: 'Earn $500 cash bonus for 25 successful referrals',
    type: 'cash',
    value: 500,
    requiredReferrals: 25,
    claimed: false
  }
]

export default function ReferralsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentTier = referralTiers.find(tier => tier.current)
  const nextTier = referralTiers.find(tier => tier.level === (currentTier?.level || 0) + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Referral Program</h1>
              <p className="text-xl md:text-2xl mb-8">
                Earn rewards by referring friends to TradeBitcoin. Get up to 30% commission on trading fees and exclusive bonuses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Start Referring
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  <Gift className="w-5 h-5 mr-2" />
                  View Rewards
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Your Earnings</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Earned</span>
                      <Badge variant="secondary">${referralStats.totalEarnings}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending</span>
                      <Badge variant="outline">${referralStats.pendingEarnings}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Referrals</span>
                      <Badge variant="secondary">{referralStats.activeReferrals}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Current Tier</span>
                      <Badge variant="outline">{currentTier?.name}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Referral Link Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Referral Link</h2>
              <p className="text-lg text-gray-600">
                Share this link with friends and start earning commissions
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Referral Link & Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Referral Link</label>
                  <div className="flex gap-2">
                    <Input 
                      value={referralStats.referralLink} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(referralStats.referralLink)}
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Referral Code</label>
                  <div className="flex gap-2">
                    <Input 
                      value={referralStats.referralCode} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(referralStats.referralCode)}
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share on Social Media
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tiers">Referral Tiers</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-orange-600" />
                      <Badge variant="secondary">+12%</Badge>
                    </div>
                    <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
                    <div className="text-sm text-gray-600">Total Referrals</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <Activity className="w-8 h-8 text-green-600" />
                      <Badge variant="secondary">+8%</Badge>
                    </div>
                    <div className="text-2xl font-bold">{referralStats.activeReferrals}</div>
                    <div className="text-sm text-gray-600">Active Referrals</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <DollarSign className="w-8 h-8 text-blue-600" />
                      <Badge variant="secondary">+15%</Badge>
                    </div>
                    <div className="text-2xl font-bold">${referralStats.totalEarnings}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <PiggyBank className="w-8 h-8 text-purple-600" />
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="text-2xl font-bold">${referralStats.pendingEarnings}</div>
                    <div className="text-sm text-gray-600">Pending Earnings</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Rate</CardTitle>
                    <CardDescription>
                      Percentage of referred users who become active traders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-orange-600">{referralStats.conversionRate}%</div>
                      <div className="text-sm text-gray-600">Above average</div>
                    </div>
                    <Progress value={referralStats.conversionRate} className="h-3" />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>0%</span>
                      <span>Industry avg: 60%</span>
                      <span>100%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Current Progress</CardTitle>
                    <CardDescription>
                      Your progress towards the next referral tier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {nextTier && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{currentTier?.name} → {nextTier.name}</span>
                          <Badge variant="outline">{nextTier.commissionRate}% commission</Badge>
                        </div>
                        <Progress 
                          value={(referralStats.totalReferrals / nextTier.referralsRequired) * 100} 
                          className="h-3"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{referralStats.totalReferrals} referrals</span>
                          <span>{nextTier.referralsRequired} required</span>
                        </div>
                        <div className="text-center">
                          <span className="text-lg font-semibold">
                            {nextTier.referralsRequired - referralStats.totalReferrals} more referrals needed
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tiers Tab */}
            <TabsContent value="tiers" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Referral Tiers</h2>
                <p className="text-lg text-gray-600">
                  Unlock higher commission rates and exclusive benefits as you refer more users
                </p>
              </div>

              <div className="space-y-4">
                {referralTiers.map(tier => (
                  <Card key={tier.name} className={`${tier.current ? 'border-orange-500 border-2' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                            tier.current ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {tier.level === 1 && <Crown className="w-8 h-8" />}
                            {tier.level === 2 && <Star className="w-8 h-8" />}
                            {tier.level === 3 && <Award className="w-8 h-8" />}
                            {tier.level === 4 && <GiftIcon className="w-8 h-8" />}
                            {tier.level === 5 && <Target className="w-8 h-8" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                              {tier.name} Tier
                              {tier.current && <Badge variant="secondary">Current</Badge>}
                            </h3>
                            <p className="text-gray-600">{tier.commissionRate}% commission rate</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{tier.referralsRequired} referrals</div>
                          <div className="text-sm text-gray-600">required</div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Benefits:</h4>
                        <ul className="space-y-2">
                          {tier.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Referral Activity</h2>
                <p className="text-lg text-gray-600">
                  Track your referral activities and earnings in real-time
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest referral activities and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {referralActivities.map(activity => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'signup' ? 'bg-blue-100 text-blue-600' :
                            activity.type === 'deposit' ? 'bg-green-100 text-green-600' :
                            activity.type === 'trade' ? 'bg-orange-100 text-orange-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {activity.type === 'signup' && <UserPlus className="w-5 h-5" />}
                            {activity.type === 'deposit' && <CreditCard className="w-5 h-5" />}
                            {activity.type === 'trade' && <BarChart3 className="w-5 h-5" />}
                            {activity.type === 'earn' && <DollarSign className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-medium">{activity.user}</div>
                            <div className="text-sm text-gray-600 capitalize">{activity.type}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {activity.amount > 0 ? `$${activity.amount}` : '-'}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={activity.status === 'completed' ? 'default' : 'secondary'}
                              className={
                                activity.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'
                              }
                            >
                              {activity.status}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {new Date(activity.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Referral Rewards</h2>
                <p className="text-lg text-gray-600">
                  Earn exclusive rewards as you reach referral milestones
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map(reward => (
                  <Card key={reward.id} className={`${reward.claimed ? 'border-green-500 border-2' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                        {reward.claimed && <Badge variant="secondary">Claimed</Badge>}
                      </div>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Type:</span>
                          <Badge variant="outline">{reward.type}</Badge>
                        </div>
                        
                        {reward.value > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Value:</span>
                            <span className="font-semibold">${reward.value}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Required:</span>
                          <span className="font-medium">{reward.requiredReferrals} referrals</span>
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            className="w-full"
                            disabled={!reward.claimed && referralStats.totalReferrals < reward.requiredReferrals}
                            variant={reward.claimed ? "secondary" : "default"}
                          >
                            {reward.claimed ? 'Claimed' : 
                             referralStats.totalReferrals >= reward.requiredReferrals ? 'Claim Reward' : 
                             `${reward.requiredReferrals - referralStats.totalReferrals} more needed`}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Earning Today!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who are earning passive income through our referral program. No limits, no restrictions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              <UserPlus className="w-5 h-5 mr-2" />
              Start Referring Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <Gift className="w-5 h-5 mr-2" />
              Learn More About Rewards
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}