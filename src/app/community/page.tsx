'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Search, 
  Heart, 
  Share, 
  Bookmark,
  Calendar,
  MapPin,
  Award,
  Star,
  Eye,
  MessageCircle,
  ThumbsUp
} from 'lucide-react'

interface ForumPost {
  id: string
  title: string
  content: string
  author: {
    name: string
    avatar: string
    level: string
    joinDate: string
  }
  category: string
  tags: string[]
  likes: number
  comments: number
  views: number
  createdAt: string
  isPinned: boolean
  isHot: boolean
}

interface CommunityEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: 'online' | 'offline'
  attendees: number
  maxAttendees: number
  image: string
}

interface CommunityMember {
  id: string
  name: string
  avatar: string
  role: string
  level: string
  joinDate: string
  posts: number
  reputation: number
  badges: string[]
}

const forumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Best strategies for trading Bitcoin in 2024',
    content: 'I\'ve been trading Bitcoin for the past year and wanted to share some strategies that have been working well for me. What are your thoughts on these approaches?',
    author: {
      name: 'Alex Thompson',
      avatar: '/api/placeholder/40/40',
      level: 'Expert Trader',
      joinDate: '2023-01-15'
    },
    category: 'Trading Strategies',
    tags: ['bitcoin', 'trading', 'strategies', '2024'],
    likes: 245,
    comments: 89,
    views: 1520,
    createdAt: '2024-01-15T10:30:00Z',
    isPinned: true,
    isHot: true
  },
  {
    id: '2',
    title: 'Understanding technical analysis: A beginner\'s guide',
    content: 'New to trading? Here\'s a comprehensive guide to understanding technical analysis fundamentals that every trader should know.',
    author: {
      name: 'Sarah Chen',
      avatar: '/api/placeholder/40/40',
      level: 'Mentor',
      joinDate: '2022-06-20'
    },
    category: 'Education',
    tags: ['technical-analysis', 'beginners', 'education'],
    likes: 189,
    comments: 67,
    views: 2340,
    createdAt: '2024-01-14T15:45:00Z',
    isPinned: false,
    isHot: true
  },
  {
    id: '3',
    title: 'Risk management techniques for volatile markets',
    content: 'With the current market volatility, I\'d like to discuss effective risk management techniques. What stop-loss strategies do you use?',
    author: {
      name: 'Mike Johnson',
      avatar: '/api/placeholder/40/40',
      level: 'Professional Trader',
      joinDate: '2021-11-10'
    },
    category: 'Risk Management',
    tags: ['risk-management', 'volatility', 'stop-loss'],
    likes: 156,
    comments: 45,
    views: 980,
    createdAt: '2024-01-13T09:20:00Z',
    isPinned: false,
    isHot: false
  },
  {
    id: '4',
    title: 'TradeBitcoin API tutorial: Building your first trading bot',
    content: 'Step-by-step tutorial on how to build a simple trading bot using the TradeBitcoin API. Includes code examples and best practices.',
    author: {
      name: 'Emma Davis',
      avatar: '/api/placeholder/40/40',
      level: 'Developer',
      joinDate: '2023-03-05'
    },
    category: 'API & Development',
    tags: ['api', 'trading-bot', 'tutorial', 'development'],
    likes: 298,
    comments: 123,
    views: 3450,
    createdAt: '2024-01-12T14:15:00Z',
    isPinned: true,
    isHot: true
  },
  {
    id: '5',
    title: 'Market analysis: Bitcoin price predictions for Q1 2024',
    content: 'Based on current market trends and technical indicators, here\'s my analysis of where Bitcoin might be heading in the first quarter of 2024.',
    author: {
      name: 'David Wilson',
      avatar: '/api/placeholder/40/40',
      level: 'Market Analyst',
      joinDate: '2022-09-12'
    },
    category: 'Market Analysis',
    tags: ['bitcoin', 'price-prediction', 'market-analysis', 'q1-2024'],
    likes: 178,
    comments: 92,
    views: 2100,
    createdAt: '2024-01-11T16:30:00Z',
    isPinned: false,
    isHot: false
  }
]

const communityEvents: CommunityEvent[] = [
  {
    id: '1',
    title: 'Weekly Trading Workshop',
    description: 'Join our weekly workshop where we discuss trading strategies, market analysis, and answer your questions.',
    date: '2024-01-20',
    time: '19:00 UTC',
    location: 'Zoom Meeting',
    type: 'online',
    attendees: 245,
    maxAttendees: 500,
    image: '/api/placeholder/400/200'
  },
  {
    id: '2',
    title: 'Bitcoin Conference 2024',
    description: 'Annual Bitcoin conference bringing together traders, developers, and enthusiasts from around the world.',
    date: '2024-03-15',
    time: '09:00 UTC',
    location: 'San Francisco, CA',
    type: 'offline',
    attendees: 1200,
    maxAttendees: 2000,
    image: '/api/placeholder/400/200'
  },
  {
    id: '3',
    title: 'API Developer Meetup',
    description: 'Monthly meetup for developers building with the TradeBitcoin API. Share your projects and get feedback.',
    date: '2024-01-25',
    time: '18:00 UTC',
    location: 'Discord Server',
    type: 'online',
    attendees: 89,
    maxAttendees: 200,
    image: '/api/placeholder/400/200'
  }
]

const communityMembers: CommunityMember[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    avatar: '/api/placeholder/60/60',
    role: 'Community Leader',
    level: 'Expert Trader',
    joinDate: '2023-01-15',
    posts: 156,
    reputation: 2840,
    badges: ['Top Contributor', 'Mentor', 'Trading Expert']
  },
  {
    id: '2',
    name: 'Sarah Chen',
    avatar: '/api/placeholder/60/60',
    role: 'Mentor',
    level: 'Professional Trader',
    joinDate: '2022-06-20',
    posts: 234,
    reputation: 3120,
    badges: ['Education Expert', 'Top Contributor', 'Community Helper']
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: '/api/placeholder/60/60',
    role: 'Active Member',
    level: 'Advanced Trader',
    joinDate: '2021-11-10',
    posts: 89,
    reputation: 1560,
    badges: ['Risk Management Expert', 'Active Trader']
  },
  {
    id: '4',
    name: 'Emma Davis',
    avatar: '/api/placeholder/60/60',
    role: 'Developer',
    level: 'API Expert',
    joinDate: '2023-03-05',
    posts: 67,
    reputation: 1890,
    badges: ['API Expert', 'Developer', 'Tutorial Creator']
  }
]

export default function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('forum')

  const categories = ['all', 'Trading Strategies', 'Education', 'Risk Management', 'API & Development', 'Market Analysis']

  const filteredPosts = forumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Join Our Community</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with thousands of traders, developers, and cryptocurrency enthusiasts. Share knowledge, learn from experts, and grow together.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Discussion
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">25,000+</div>
                <div className="text-gray-600">Active Members</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <MessageSquare className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">15,000+</div>
                <div className="text-gray-600">Discussions</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Daily Posts</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900">50+</div>
                <div className="text-gray-600">Expert Mentors</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="forum">Forum</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>

            {/* Forum Tab */}
            <TabsContent value="forum" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search discussions..."
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

              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {post.isPinned && <Badge variant="secondary">Pinned</Badge>}
                                {post.isHot && <Badge variant="destructive">Hot</Badge>}
                                <Badge variant="outline">{post.category}</Badge>
                              </div>
                              <h3 className="text-lg font-semibold mb-2 hover:text-orange-600 cursor-pointer">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {post.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-4 h-4" />
                                  {post.comments}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="w-4 h-4" />
                                  {post.likes}
                                </span>
                                <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Bookmark className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.author.name}</span>
                              <Badge variant="outline" className="text-xs">{post.author.level}</Badge>
                            </div>
                            <div className="flex gap-2">
                              {post.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline">
                  Load More Discussions
                </Button>
              </div>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityEvents.map(event => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 relative">
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={event.type === 'online' ? 'default' : 'secondary'}>
                          {event.type === 'online' ? 'Online' : 'Offline'}
                        </Badge>
                        <Badge variant="outline">
                          {event.attendees}/{event.maxAttendees} attending
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                          Register Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {communityMembers.map(member => (
                  <Card key={member.id} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <Avatar className="w-20 h-20 mx-auto mb-4">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold mb-1">{member.name}</h3>
                      <Badge variant="outline" className="mb-2">{member.role}</Badge>
                      <p className="text-sm text-gray-600 mb-3">{member.level}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <div className="font-semibold">{member.posts}</div>
                          <div className="text-gray-500">Posts</div>
                        </div>
                        <div>
                          <div className="font-semibold">{member.reputation}</div>
                          <div className="text-gray-500">Reputation</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.badges.slice(0, 2).map(badge => (
                          <Badge key={badge} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                        {member.badges.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{member.badges.length - 2}
                          </Badge>
                        )}
                      </div>

                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="outline">
                  View All Members
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join the Conversation?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Become part of our growing community of traders and developers. Share your knowledge and learn from others.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
              <Users className="w-5 h-5 mr-2" />
              Sign Up Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
              <MessageSquare className="w-5 h-5 mr-2" />
              Browse Discussions
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}