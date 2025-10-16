'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar, 
  Search, 
  TrendingUp, 
  ExternalLink, 
  Share, 
  Bookmark,
  Eye,
  Clock,
  User,
  Tag,
  Filter,
  ArrowRight,
  Newspaper,
  Bell
} from 'lucide-react'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: {
    name: string
    avatar: string
    role: string
  }
  category: string
  tags: string[]
  publishedAt: string
  readTime: number
  views: number
  isFeatured: boolean
  isBreaking: boolean
  imageUrl: string
}

interface PressRelease {
  id: string
  title: string
  summary: string
  publishedAt: string
  source: string
  isOfficial: boolean
}

interface Update {
  id: string
  title: string
  description: string
  type: 'feature' | 'improvement' | 'bugfix' | 'security'
  version: string
  publishedAt: string
  impact: 'low' | 'medium' | 'high'
}

const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'TradeBitcoin Reaches 1 Million Active Users Milestone',
    excerpt: 'We are excited to announce that TradeBitcoin has surpassed 1 million active users, marking a significant milestone in our journey to revolutionize cryptocurrency trading.',
    content: 'We are thrilled to share that TradeBitcoin has reached a major milestone with over 1 million active users on our platform. This achievement represents the trust and confidence our users have placed in us...',
    author: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      role: 'CEO'
    },
    category: 'Company News',
    tags: ['milestone', 'growth', 'users', 'achievement'],
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 3,
    views: 15420,
    isFeatured: true,
    isBreaking: false,
    imageUrl: '/api/placeholder/800/400'
  },
  {
    id: '2',
    title: 'New Advanced Trading Tools Released for Professional Traders',
    excerpt: 'Introducing our latest suite of advanced trading tools designed specifically for professional traders, including enhanced charting, advanced order types, and real-time analytics.',
    content: 'Today we\'re excited to launch our new advanced trading tools package, built specifically for professional traders who demand more sophisticated features and capabilities...',
    author: {
      name: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      role: 'Product Manager'
    },
    category: 'Product Updates',
    tags: ['trading-tools', 'professional', 'features', 'release'],
    publishedAt: '2024-01-14T14:30:00Z',
    readTime: 5,
    views: 8930,
    isFeatured: true,
    isBreaking: false,
    imageUrl: '/api/placeholder/800/400'
  },
  {
    id: '3',
    title: 'Breaking: TradeBitcoin Partners with Major Financial Institution',
    excerpt: 'In a groundbreaking development, TradeBitcoin announces strategic partnership with leading financial institution to bridge traditional and cryptocurrency markets.',
    content: 'We are excited to announce a strategic partnership with one of the world\'s leading financial institutions. This collaboration will help bridge the gap between traditional finance and cryptocurrency markets...',
    author: {
      name: 'David Wilson',
      avatar: '/api/placeholder/40/40',
      role: 'Business Development'
    },
    category: 'Partnerships',
    tags: ['partnership', 'financial-institution', 'breaking-news', 'collaboration'],
    publishedAt: '2024-01-13T09:15:00Z',
    readTime: 4,
    views: 12560,
    isFeatured: false,
    isBreaking: true,
    imageUrl: '/api/placeholder/800/400'
  },
  {
    id: '4',
    title: 'Security Update: Enhanced Two-Factor Authentication Now Available',
    excerpt: 'We\'ve implemented enhanced security measures including new two-factor authentication options to better protect user accounts and funds.',
    content: 'Security is our top priority at TradeBitcoin. We\'re pleased to announce the rollout of enhanced two-factor authentication (2FA) options, including support for hardware security keys...',
    author: {
      name: 'Emma Davis',
      avatar: '/api/placeholder/40/40',
      role: 'Security Lead'
    },
    category: 'Security',
    tags: ['security', '2fa', 'authentication', 'safety'],
    publishedAt: '2024-01-12T16:45:00Z',
    readTime: 3,
    views: 6780,
    isFeatured: false,
    isBreaking: false,
    imageUrl: '/api/placeholder/800/400'
  },
  {
    id: '5',
    title: 'Market Analysis: Bitcoin Performance in Q4 2023 and Outlook for 2024',
    excerpt: 'Our market analysts provide comprehensive analysis of Bitcoin\'s performance in Q4 2023 and share insights on what to expect in 2024.',
    content: 'As we close out 2023, our market analysis team has compiled a comprehensive review of Bitcoin\'s performance and what traders should expect in the coming year...',
    author: {
      name: 'Alex Thompson',
      avatar: '/api/placeholder/40/40',
      role: 'Market Analyst'
    },
    category: 'Market Analysis',
    tags: ['bitcoin', 'market-analysis', 'q4-2023', 'outlook', '2024'],
    publishedAt: '2024-01-11T11:20:00Z',
    readTime: 6,
    views: 9450,
    isFeatured: false,
    isBreaking: false,
    imageUrl: '/api/placeholder/800/400'
  }
]

const pressReleases: PressRelease[] = [
  {
    id: '1',
    title: 'TradeBitcoin Secures $50M Series B Funding',
    summary: 'TradeBitcoin announces successful Series B funding round, raising $50 million to accelerate product development and global expansion.',
    publishedAt: '2024-01-10T08:00:00Z',
    source: 'TradeBitcoin Official',
    isOfficial: true
  },
  {
    id: '2',
    title: 'Launch of TradeBitcoin Mobile App 2.0',
    summary: 'Completely redesigned mobile app with enhanced features, improved performance, and new trading capabilities.',
    publishedAt: '2024-01-08T12:00:00Z',
    source: 'TradeBitcoin Official',
    isOfficial: true
  },
  {
    id: '3',
    title: 'TradeBitcoin Receives Regulatory Approval in New Markets',
    summary: 'Regulatory approvals obtained in 5 new countries, expanding our global footprint and user base.',
    publishedAt: '2024-01-05T14:30:00Z',
    source: 'TradeBitcoin Official',
    isOfficial: true
  }
]

const updates: Update[] = [
  {
    id: '1',
    title: 'Advanced Charting Tools',
    description: 'Added new technical indicators, drawing tools, and customizable chart layouts for professional traders.',
    type: 'feature',
    version: '2.5.0',
    publishedAt: '2024-01-15T10:00:00Z',
    impact: 'high'
  },
  {
    id: '2',
    title: 'Performance Improvements',
    description: 'Optimized trading engine for faster order execution and reduced latency.',
    type: 'improvement',
    version: '2.4.8',
    publishedAt: '2024-01-14T15:30:00Z',
    impact: 'medium'
  },
  {
    id: '3',
    title: 'Fixed Mobile App Login Issues',
    description: 'Resolved authentication problems affecting some mobile users.',
    type: 'bugfix',
    version: '2.4.7',
    publishedAt: '2024-01-13T09:00:00Z',
    impact: 'high'
  },
  {
    id: '4',
    title: 'Enhanced Security Protocols',
    description: 'Implemented additional security measures to protect against emerging threats.',
    type: 'security',
    version: '2.4.6',
    publishedAt: '2024-01-12T16:00:00Z',
    impact: 'high'
  }
]

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('articles')

  const categories = ['all', 'Company News', 'Product Updates', 'Partnerships', 'Security', 'Market Analysis']

  const filteredArticles = newsArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">News & Updates</h1>
              <p className="text-xl md:text-2xl mb-8">
                Stay informed with the latest news, product updates, and announcements from TradeBitcoin.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                  <Bell className="w-5 h-5 mr-2" />
                  Subscribe to Updates
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                  <Newspaper className="w-5 h-5 mr-2" />
                  News Feed
                </Button>
              </div>
            </div>
            <div className="lg:w-1/3">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Latest Updates</CardTitle>
                </CardHeader>
                <CardContent className="text-white">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">System operational</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Last updated: 2 minutes ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm">5 new articles this week</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Article</h2>
            <p className="text-lg text-gray-600">
              Don't miss our most important news and announcements
            </p>
          </div>

          {newsArticles.filter(article => article.isFeatured)[0] && (
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-orange-400 to-orange-600 relative">
                    <Newspaper className="absolute inset-0 m-auto w-24 h-24 text-white/20" />
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">Featured</Badge>
                    <Badge variant="outline">{newsArticles[0].category}</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{newsArticles[0].title}</h3>
                  <p className="text-gray-600 mb-6">{newsArticles[0].excerpt}</p>
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{newsArticles[0].author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(newsArticles[0].publishedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{newsArticles[0].readTime} min read</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                      Read Article
                    </Button>
                    <Button variant="outline">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="press">Press Releases</TabsTrigger>
              <TabsTrigger value="updates">Product Updates</TabsTrigger>
            </TabsList>

            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 relative">
                      {article.isBreaking && (
                        <Badge className="absolute top-4 left-4 bg-red-600 hover:bg-red-700">
                          Breaking
                        </Badge>
                      )}
                      <Newspaper className="absolute inset-0 m-auto w-16 h-16 text-white/20" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{article.category}</Badge>
                        <Badge variant="secondary">
                          {article.readTime} min read
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{article.views.toLocaleString()}</span>
                        </div>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={article.author.avatar} alt={article.author.name} />
                            <AvatarFallback className="text-xs">
                              {article.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{article.author.name}</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline">
                  Load More Articles
                </Button>
              </div>
            </TabsContent>

            {/* Press Releases Tab */}
            <TabsContent value="press" className="space-y-6">
              <div className="space-y-4">
                {pressReleases.map(release => (
                  <Card key={release.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {release.isOfficial && (
                              <Badge variant="default">Official</Badge>
                            )}
                            <Badge variant="outline">Press Release</Badge>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{release.title}</h3>
                          <p className="text-gray-600 mb-4">{release.summary}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(release.publishedAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{release.source}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Product Updates Tab */}
            <TabsContent value="updates" className="space-y-6">
              <div className="space-y-4">
                {updates.map(update => (
                  <Card key={update.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={
                                update.type === 'feature' ? 'default' :
                                update.type === 'improvement' ? 'secondary' :
                                update.type === 'bugfix' ? 'destructive' : 'outline'
                              }
                              className={
                                update.type === 'security' ? 'bg-red-600 hover:bg-red-700' : ''
                              }
                            >
                              {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
                            </Badge>
                            <Badge 
                              variant={
                                update.impact === 'high' ? 'destructive' :
                                update.impact === 'medium' ? 'default' : 'secondary'
                              }
                            >
                              {update.impact.charAt(0).toUpperCase() + update.impact.slice(1)} Impact
                            </Badge>
                            <Badge variant="outline">v{update.version}</Badge>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{update.title}</h3>
                          <p className="text-gray-600 mb-4">{update.description}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(update.publishedAt).toLocaleDateString()}</span>
                          </div>
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

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-gray-600 mb-8">
              Subscribe to our newsletter and never miss important updates, news, and announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address" 
                className="flex-1"
              />
              <Button className="bg-orange-600 hover:bg-orange-700">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Want to Write for Us?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            We're always looking for talented writers and industry experts to contribute to our news and analysis.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
            Become a Contributor
          </Button>
        </div>
      </section>
    </div>
  )
}