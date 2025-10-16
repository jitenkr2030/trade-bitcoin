'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  Trophy, 
  Star, 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Share2,
  Copy,
  Square,
  Settings,
  Play,
  Pause,
  DollarSign,
  Percent,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Shield,
  Zap,
  Activity,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Twitter,
  Globe,
  Bitcoin,
  Eye,
  Bell,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Comprehensive interfaces for the dashboard
interface TraderProfile {
  id: string
  name: string
  avatar: string
  username: string
  verified: boolean
  followers: number
  following: number
  trades: number
  winRate: number
  profit: number
  profitPercent: number
  rank: number
  badges: string[]
  strategy: string
  riskLevel: 'low' | 'medium' | 'high'
  performance: Array<{ date: string; value: number }>
  recentTrades: Array<{
    pair: string
    type: 'buy' | 'sell'
    profit: number
    time: string
  }>
  socialStats: {
    posts: number
    likes: number
    comments: number
    shares: number
    lastActive: string
    responseRate: number
  }
  community: {
    isFollowing: boolean
    followersCount: number
    followingCount: number
    communityScore: number
  }
}

interface Post {
  id: string
  author: TraderProfile
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  tags: string[]
  isLiked: boolean
  commentsList: Array<{
    id: string
    author: TraderProfile
    content: string
    timestamp: string
    likes: number
  }>
  type: 'trade_update' | 'analysis' | 'discussion' | 'achievement' | 'market_insight'
  tradeData?: {
    pair: string
    type: 'buy' | 'sell'
    entry: number
    target?: number
    stop?: number
    profit?: number
    status: 'open' | 'closed'
  }
  media?: {
    type: 'chart' | 'image'
    url: string
    caption: string
  }
  engagement: {
    reach: number
    impressions: number
    ctr: number
  }
}

interface LeaderboardEntry {
  rank: number
  trader: TraderProfile
  weeklyChange: number
  monthlyChange: number
  totalTrades: number
  avgProfit: number
  consistency: number
  riskScore: number
  socialEngagement: number
  copyTradingScore: number
  streak: number
  achievements: string[]
}

interface CopySettings {
  traderId: string
  amount: number
  riskMultiplier: number
  maxPositions: number
  stopLoss: number
  takeProfit: number
  copyType: 'fixed' | 'percentage'
  autoCopy: boolean
  copyShorts: boolean
  copyLeverage: boolean
}

interface ActiveCopy {
  id: string
  trader: TraderProfile
  settings: CopySettings
  startTime: Date
  totalCopied: number
  currentProfit: number
  copiedTrades: number
  status: 'active' | 'paused' | 'stopped'
  lastActivity: Date
}

interface SentimentData {
  symbol: string
  name: string
  overallSentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
  socialVolume: number
  newsVolume: number
  marketCap: number
  priceChange24h: number
  mentions: number
  trending: boolean
}

interface MarketAlert {
  id: string
  type: 'sentiment' | 'price' | 'volume' | 'social'
  severity: 'low' | 'medium' | 'high'
  message: string
  asset: string
  timestamp: Date
  value: number
}

interface DashboardStats {
  totalTraders: number
  activeCopiers: number
  totalVolume: number
  avgSentiment: number
  marketTrend: 'bullish' | 'bearish' | 'neutral'
  topGainer: string
  topLoser: string
}

export default function SocialTradingDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedTrader, setSelectedTrader] = useState<TraderProfile | null>(null)
  const [copySettings, setCopySettings] = useState<CopySettings | null>(null)
  const [activeCopies, setActiveCopies] = useState<ActiveCopy[]>([])
  const [realtimeUpdates, setRealtimeUpdates] = useState(true)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: 'trade' | 'profit' | 'loss' | 'milestone' | 'sentiment'
    message: string
    timestamp: Date
    read: boolean
  }>>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [marketAlerts, setMarketAlerts] = useState<MarketAlert[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Initialize comprehensive data
  const [traders, setTraders] = useState<TraderProfile[]>([
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      username: '@alextrader',
      verified: true,
      followers: 15234,
      following: 456,
      trades: 3421,
      winRate: 68.5,
      profit: 125430,
      profitPercent: 125.43,
      rank: 1,
      badges: ['Top Trader', 'Consistent', 'Risk Master'],
      strategy: 'Swing Trading',
      riskLevel: 'medium',
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 105000 },
        { date: 'Mar', value: 112000 },
        { date: 'Apr', value: 108000 },
        { date: 'May', value: 118000 },
        { date: 'Jun', value: 125430 },
      ],
      recentTrades: [
        { pair: 'BTC/USDT', type: 'buy', profit: 2340, time: '2h ago' },
        { pair: 'ETH/USDT', type: 'sell', profit: 1560, time: '5h ago' },
        { pair: 'SOL/USDT', type: 'buy', profit: 890, time: '1d ago' },
      ],
      socialStats: {
        posts: 342,
        likes: 15234,
        comments: 893,
        shares: 445,
        lastActive: '2 hours ago',
        responseRate: 94,
      },
      community: {
        isFollowing: false,
        followersCount: 15234,
        followingCount: 234,
        communityScore: 4.8,
      },
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      username: '@sarahj',
      verified: true,
      followers: 8932,
      following: 234,
      trades: 2156,
      winRate: 72.3,
      profit: 98760,
      profitPercent: 98.76,
      rank: 2,
      badges: ['High Win Rate', 'Steady Growth'],
      strategy: 'Day Trading',
      riskLevel: 'low',
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 102000 },
        { date: 'Mar', value: 108000 },
        { date: 'Apr', value: 105000 },
        { date: 'May', value: 112000 },
        { date: 'Jun', value: 98760 },
      ],
      recentTrades: [
        { pair: 'BTC/USDT', type: 'sell', profit: 1890, time: '3h ago' },
        { pair: 'ADA/USDT', type: 'buy', profit: 560, time: '6h ago' },
      ],
      socialStats: {
        posts: 215,
        likes: 8932,
        comments: 567,
        shares: 234,
        lastActive: '3 hours ago',
        responseRate: 89,
      },
      community: {
        isFollowing: false,
        followersCount: 8932,
        followingCount: 156,
        communityScore: 4.6,
      },
    },
    {
      id: '3',
      name: 'Mike Wilson',
      avatar: '/avatars/mike.jpg',
      username: '@mikew',
      verified: false,
      followers: 5678,
      following: 123,
      trades: 1876,
      winRate: 64.2,
      profit: 76540,
      profitPercent: 76.54,
      rank: 3,
      badges: ['Rising Star'],
      strategy: 'Scalping',
      riskLevel: 'high',
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 98000 },
        { date: 'Mar', value: 105000 },
        { date: 'Apr', value: 110000 },
        { date: 'May', value: 72000 },
        { date: 'Jun', value: 76540 },
      ],
      recentTrades: [
        { pair: 'BTC/USDT', type: 'buy', profit: 2340, time: '1h ago' },
        { pair: 'ETH/USDT', type: 'sell', profit: -120, time: '2h ago' },
      ],
      socialStats: {
        posts: 156,
        likes: 5678,
        comments: 234,
        shares: 89,
        lastActive: '1 hour ago',
        responseRate: 76,
      },
      community: {
        isFollowing: false,
        followersCount: 5678,
        followingCount: 89,
        communityScore: 4.2,
      },
    },
  ])

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: traders[0],
      content: 'Just closed a massive BTC long position! The market is showing strong bullish momentum. Key resistance at $52,000 broken with high volume. Looking for continuation to $55,000. #Bitcoin #Bullish',
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      shares: 12,
      tags: ['Bitcoin', 'Bullish'],
      isLiked: false,
      type: 'trade_update',
      tradeData: {
        pair: 'BTC/USDT',
        type: 'buy',
        entry: 51000,
        target: 55000,
        stop: 49500,
        profit: 2340,
        status: 'closed'
      },
      engagement: {
        reach: 15234,
        impressions: 28456,
        ctr: 12.5
      },
      commentsList: [
        {
          id: '1',
          author: traders[1],
          content: 'Great analysis! I agree with your target. The volume confirmation is key.',
          timestamp: '1 hour ago',
          likes: 12,
        },
      ],
    },
    {
      id: '2',
      author: traders[1],
      content: 'Day trading strategy update: Focused on ETH pairs today. Caught a nice 3.2% gain on ETH/USDT breakout. Risk management is crucial - always use stop losses! #DayTrading #Ethereum',
      timestamp: '4 hours ago',
      likes: 156,
      comments: 23,
      shares: 8,
      tags: ['DayTrading', 'Ethereum'],
      isLiked: true,
      type: 'analysis',
      media: {
        type: 'chart',
        url: '/charts/eth-breakout.png',
        caption: 'ETH/USDT 4h chart showing breakout pattern'
      },
      engagement: {
        reach: 8932,
        impressions: 15678,
        ctr: 9.8
      },
      commentsList: [],
    },
    {
      id: '3',
      author: traders[2],
      content: '🎉 Just hit 1000 consecutive profitable trades! This milestone represents years of discipline and continuous learning. Remember, consistency beats perfection in trading. #Milestone #TradingJourney',
      timestamp: '6 hours ago',
      likes: 567,
      comments: 89,
      shares: 34,
      tags: ['Milestone', 'TradingJourney'],
      isLiked: false,
      type: 'achievement',
      engagement: {
        reach: 23456,
        impressions: 45678,
        ctr: 15.2
      },
      commentsList: [
        {
          id: '2',
          author: traders[0],
          content: 'Incredible achievement! Your discipline is inspiring to all of us.',
          timestamp: '5 hours ago',
          likes: 45,
        },
        {
          id: '3',
          author: traders[1],
          content: 'Congratulations! That\'s an amazing streak. What\'s your secret?',
          timestamp: '4 hours ago',
          likes: 23,
        },
      ],
    },
  ])

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      trader: traders[0],
      weeklyChange: 12.5,
      monthlyChange: 25.4,
      totalTrades: 3421,
      avgProfit: 36.7,
      consistency: 87.5,
      riskScore: 7.2,
      socialEngagement: 92.3,
      copyTradingScore: 95.8,
      streak: 15,
      achievements: ['Top Performer', 'Risk Master', 'Social Star', 'Consistency King'],
    },
    {
      rank: 2,
      trader: traders[1],
      weeklyChange: 8.3,
      monthlyChange: 18.2,
      totalTrades: 2156,
      avgProfit: 45.8,
      consistency: 91.2,
      riskScore: 4.8,
      socialEngagement: 78.5,
      copyTradingScore: 88.4,
      streak: 8,
      achievements: ['High Win Rate', 'Steady Growth', 'Community Leader'],
    },
    {
      rank: 3,
      trader: traders[2],
      weeklyChange: -2.1,
      monthlyChange: 15.6,
      totalTrades: 1876,
      avgProfit: 40.8,
      consistency: 76.8,
      riskScore: 8.9,
      socialEngagement: 65.2,
      copyTradingScore: 72.1,
      streak: 3,
      achievements: ['Rising Star', 'Volume King'],
    },
  ])

  const [sentimentData, setSentimentData] = useState<SentimentData[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      overallSentiment: 'positive',
      sentimentScore: 65.4,
      socialVolume: 45678,
      newsVolume: 1234,
      marketCap: 890000000000,
      priceChange24h: 3.2,
      mentions: 23456,
      trending: true
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      overallSentiment: 'neutral',
      sentimentScore: 12.3,
      socialVolume: 34567,
      newsVolume: 987,
      marketCap: 345000000000,
      priceChange24h: -1.2,
      mentions: 18765,
      trending: false
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      overallSentiment: 'positive',
      sentimentScore: 78.9,
      socialVolume: 23456,
      newsVolume: 654,
      marketCap: 123000000000,
      priceChange24h: 8.7,
      mentions: 9876,
      trending: true
    },
  ])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    // Initialize dashboard stats
    setDashboardStats({
      totalTraders: traders.length,
      activeCopiers: 2341,
      totalVolume: 45600000,
      avgSentiment: 45.6,
      marketTrend: 'bullish',
      topGainer: 'SOL',
      topLoser: 'ADA'
    })

    // Initialize active copies
    setActiveCopies([
      {
        id: '1',
        trader: traders[0],
        settings: {
          traderId: '1',
          amount: 1000,
          riskMultiplier: 1.0,
          maxPositions: 5,
          stopLoss: 10,
          takeProfit: 20,
          copyType: 'fixed',
          autoCopy: true,
          copyShorts: true,
          copyLeverage: false,
        },
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        totalCopied: 12540,
        currentProfit: 2340,
        copiedTrades: 23,
        status: 'active',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ])

    // Initialize market alerts
    setMarketAlerts([
      {
        id: '1',
        type: 'sentiment',
        severity: 'high',
        message: 'BTC sentiment spike detected - 85% positive',
        asset: 'BTC',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        value: 85
      },
      {
        id: '2',
        type: 'volume',
        severity: 'medium',
        message: 'Unusual volume detected for SOL',
        asset: 'SOL',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        value: 2340000
      },
    ])

    // Initialize notifications
    setNotifications([
      {
        id: '1',
        type: 'trade',
        message: 'Alex Chen just opened a BTC/USDT long position',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
      },
      {
        id: '2',
        type: 'profit',
        message: 'Your copy trade from Sarah Johnson made +$156 profit',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
      },
      {
        id: '3',
        type: 'sentiment',
        message: 'Market sentiment turning bullish for BTC',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true,
      },
    ])

    // Simulate real-time updates
    if (realtimeUpdates) {
      const interval = setInterval(() => {
        // Simulate random updates
        const randomTrader = traders[Math.floor(Math.random() * traders.length)]
        const newNotification = {
          id: Date.now().toString(),
          type: 'trade' as const,
          message: `${randomTrader.name} is active - ${randomTrader.strategy} strategy`,
          timestamp: new Date(),
          read: false,
        }
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [status, router, traders, realtimeUpdates])

  const filteredTraders = traders.filter(trader => 
    trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trader.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || post.tags.includes(filter)
    return matchesSearch && matchesFilter
  })

  const handleFollow = (traderId: string) => {
    setTraders(prev => prev.map(trader => 
      trader.id === traderId 
        ? { 
            ...trader, 
            community: { 
              ...trader.community, 
              isFollowing: !trader.community.isFollowing,
              followersCount: trader.community.isFollowing 
                ? trader.community.followersCount - 1 
                : trader.community.followersCount + 1
            } 
          }
        : trader
    ))
  }

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ))
  }

  const handleStartCopying = (trader: TraderProfile) => {
    setSelectedTrader(trader)
    setCopySettings({
      traderId: trader.id,
      amount: 100,
      riskMultiplier: 1.0,
      maxPositions: 3,
      stopLoss: 10,
      takeProfit: 20,
      copyType: 'fixed',
      autoCopy: true,
      copyShorts: true,
      copyLeverage: false,
    })
  }

  const handleConfirmCopy = () => {
    if (!selectedTrader || !copySettings) return

    const newCopy: ActiveCopy = {
      id: Date.now().toString(),
      trader: selectedTrader,
      settings: copySettings,
      startTime: new Date(),
      totalCopied: 0,
      currentProfit: 0,
      copiedTrades: 0,
      status: 'active',
      lastActivity: new Date(),
    }

    setActiveCopies(prev => [...prev, newCopy])
    setSelectedTrader(null)
    setCopySettings(null)
  }

  const getSentimentColor = (sentiment: string | number) => {
    if (typeof sentiment === 'number') {
      if (sentiment > 50) return 'text-green-600'
      if (sentiment < 30) return 'text-red-600'
      return 'text-yellow-600'
    }
    
    switch (sentiment) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      case 'neutral': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getSentimentIcon = (sentiment: string | number) => {
    if (typeof sentiment === 'number') {
      if (sentiment > 50) return <ThumbsUp className="h-4 w-4" />
      if (sentiment < 30) return <ThumbsDown className="h-4 w-4" />
      return <Meh className="h-4 w-4" />
    }
    
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4" />
      case 'negative': return <ThumbsDown className="h-4 w-4" />
      case 'neutral': return <Meh className="h-4 w-4" />
      default: return <Meh className="h-4 w-4" />
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade': return <BarChart3 className="h-4 w-4" />
      case 'profit': return <TrendingUp className="h-4 w-4" />
      case 'loss': return <TrendingDown className="h-4 w-4" />
      case 'milestone': return <Trophy className="h-4 w-4" />
      case 'sentiment': return <Activity className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'trade': return 'text-blue-600'
      case 'profit': return 'text-green-600'
      case 'loss': return 'text-red-600'
      case 'milestone': return 'text-purple-600'
      case 'sentiment': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`
    }
    return `$${value.toFixed(2)}`
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(Math.floor(value))
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Social Trading Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive trading platform with social features, copy trading, and sentiment analysis
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search traders, posts, or assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Bitcoin">Bitcoin</SelectItem>
              <SelectItem value="Ethereum">Ethereum</SelectItem>
              <SelectItem value="DayTrading">Day Trading</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Traders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(dashboardStats.totalTraders)}</div>
              <p className="text-xs text-muted-foreground">Active this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Copiers</CardTitle>
              <Copy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(dashboardStats.activeCopiers)}</div>
              <p className="text-xs text-muted-foreground">Copy trading users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalVolume)}</div>
              <p className="text-xs text-muted-foreground">24h trading volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getSentimentColor(dashboardStats.avgSentiment)}`}>
                {dashboardStats.avgSentiment.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Market sentiment score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Trend</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${dashboardStats.marketTrend === 'bullish' ? 'text-green-600' : dashboardStats.marketTrend === 'bearish' ? 'text-red-600' : 'text-yellow-600'}`}>
                {dashboardStats.marketTrend.charAt(0).toUpperCase() + dashboardStats.marketTrend.slice(1)}
              </div>
              <p className="text-xs text-muted-foreground">Current market direction</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Gainer</CardTitle>
              <Bitcoin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardStats.topGainer}</div>
              <p className="text-xs text-muted-foreground">24h performance</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="copy-trading">Copy Trading</TabsTrigger>
          <TabsTrigger value="social-feed">Social Feed</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Active Copy Trades */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Copy className="h-5 w-5" />
                  Active Copy Trades
                </CardTitle>
                <CardDescription>Your current copy trading positions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {activeCopies.map((copy) => (
                      <div key={copy.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={copy.trader.avatar} />
                            <AvatarFallback>{copy.trader.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{copy.trader.name}</div>
                            <div className="text-sm text-muted-foreground">{copy.trader.strategy}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${copy.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${copy.currentProfit.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">{copy.copiedTrades} trades</div>
                        </div>
                      </div>
                    ))}
                    {activeCopies.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No active copy trades. Start copying top traders!
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Market Sentiment Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Market Sentiment
                </CardTitle>
                <CardDescription>Real-time sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {sentimentData.map((asset) => (
                      <div key={asset.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getSentimentIcon(asset.overallSentiment)}
                            <span className="font-medium">{asset.symbol}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{asset.name}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-medium ${getSentimentColor(asset.sentimentScore)}`}>
                            {asset.sentimentScore.toFixed(1)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Recent Social Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Social Activity
              </CardTitle>
              <CardDescription>Latest posts from top traders</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.author.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {getPostTypeLabel(post.type)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                        </div>
                        <p className="text-sm mt-1">{post.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <button
                            onClick={() => handleLikePost(post.id)}
                            className="flex items-center gap-1 hover:text-foreground"
                          >
                            <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            {post.likes}
                          </button>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="h-4 w-4" />
                            {post.shares}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Traders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leaderboard.length}</div>
                <p className="text-xs text-muted-foreground">Active this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Monthly Return</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {((leaderboard.reduce((sum, entry) => sum + entry.monthlyChange, 0) / leaderboard.length)).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Across all traders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Consistency</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((leaderboard.reduce((sum, entry) => sum + entry.consistency, 0) / leaderboard.length)).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Performance stability</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Social Engagement</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((leaderboard.reduce((sum, entry) => sum + entry.socialEngagement, 0) / leaderboard.length)).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Community interaction</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trader Leaderboard</CardTitle>
              <CardDescription>Top-performing traders ranked by multiple metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {leaderboard.map((entry) => (
                    <div key={entry.rank} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Trophy className={`h-5 w-5 ${entry.rank === 1 ? 'text-yellow-500' : entry.rank === 2 ? 'text-gray-400' : entry.rank === 3 ? 'text-orange-600' : 'text-muted-foreground'}`} />
                          <span className="font-bold">#{entry.rank}</span>
                        </div>
                        <Avatar>
                          <AvatarImage src={entry.trader.avatar} />
                          <AvatarFallback>{entry.trader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{entry.trader.name}</span>
                            {entry.trader.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground">{entry.trader.strategy}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                        <div>
                          <div className="font-medium">{entry.monthlyChange.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Monthly</div>
                        </div>
                        <div>
                          <div className="font-medium">{entry.consistency.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Consistency</div>
                        </div>
                        <div>
                          <div className="font-medium">{entry.copyTradingScore.toFixed(1)}</div>
                          <div className="text-xs text-muted-foreground">Copy Score</div>
                        </div>
                        <div>
                          <div className="font-medium">{entry.trader.winRate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Copy Trading Tab */}
        <TabsContent value="copy-trading" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Copies</CardTitle>
                <Copy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCopies.length}</div>
                <p className="text-xs text-muted-foreground">Currently copying</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Copied</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${activeCopies.reduce((sum, copy) => sum + copy.totalCopied, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total volume copied</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Copy Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${activeCopies.reduce((sum, copy) => sum + copy.currentProfit, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total profit from copies</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Available Traders */}
            <Card>
              <CardHeader>
                <CardTitle>Top Traders to Copy</CardTitle>
                <CardDescription>Discover and copy successful traders</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {traders.map((trader) => (
                      <div key={trader.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={trader.avatar} />
                            <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{trader.name}</span>
                              {trader.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                            </div>
                            <div className="text-sm text-muted-foreground">{trader.strategy}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{trader.riskLevel} risk</Badge>
                              <Badge variant="outline">{trader.winRate.toFixed(1)}% win rate</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-green-600">+{trader.profitPercent.toFixed(1)}%</div>
                          <div className="text-sm text-muted-foreground">{trader.followers} followers</div>
                          <Button
                            size="sm"
                            onClick={() => handleStartCopying(trader)}
                            className="mt-2"
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Active Copy Positions */}
            <Card>
              <CardHeader>
                <CardTitle>Your Copy Positions</CardTitle>
                <CardDescription>Manage your active copy trading positions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {activeCopies.map((copy) => (
                      <div key={copy.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={copy.trader.avatar} />
                              <AvatarFallback>{copy.trader.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{copy.trader.name}</div>
                              <div className="text-sm text-muted-foreground">{copy.trader.strategy}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={copy.status === 'active' ? 'default' : copy.status === 'paused' ? 'secondary' : 'destructive'}>
                              {copy.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Amount</div>
                            <div className="font-medium">${copy.settings.amount}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Profit/Loss</div>
                            <div className={`font-medium ${copy.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${copy.currentProfit.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Copied Trades</div>
                            <div className="font-medium">{copy.copiedTrades}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Risk Multiplier</div>
                            <div className="font-medium">{copy.settings.riskMultiplier}x</div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActiveCopies(prev => prev.map(c => 
                                c.id === copy.id 
                                  ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
                                  : c
                              ))
                            }}
                          >
                            {copy.status === 'active' ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                            {copy.status === 'active' ? 'Pause' : 'Resume'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setActiveCopies(prev => prev.filter(c => c.id !== copy.id))}
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        </div>
                      </div>
                    ))}
                    {activeCopies.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No active copy positions. Start copying traders to see them here.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Social Feed Tab */}
        <TabsContent value="social-feed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Feed</CardTitle>
              <CardDescription>Latest updates and insights from the trading community</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[800px]">
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.author.name}</span>
                              {post.author.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                              <span className="text-sm text-muted-foreground">@{post.author.username}</span>
                              <span className="text-sm text-muted-foreground">• {post.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getPostTypeLabel(post.type)}
                              </Badge>
                              {post.tradeData && (
                                <Badge variant={post.tradeData.status === 'closed' ? 'default' : 'secondary'}>
                                  {post.tradeData.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="mt-3 text-sm leading-relaxed">{post.content}</p>
                          
                          {post.tradeData && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <div className="text-sm font-medium mb-2">Trade Details</div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Pair:</span>
                                  <span className="ml-1 font-medium">{post.tradeData.pair}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Type:</span>
                                  <span className={`ml-1 font-medium ${post.tradeData.type === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                                    {post.tradeData.type.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Entry:</span>
                                  <span className="ml-1 font-medium">${post.tradeData.entry.toLocaleString()}</span>
                                </div>
                                {post.tradeData.profit && (
                                  <div>
                                    <span className="text-muted-foreground">Profit:</span>
                                    <span className={`ml-1 font-medium ${post.tradeData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      ${post.tradeData.profit.toLocaleString()}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 mt-4 text-sm">
                            <button
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center gap-1 hover:text-foreground transition-colors ${
                                post.isLiked ? 'text-red-500' : 'text-muted-foreground'
                              }`}
                            >
                              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                              {post.likes}
                            </button>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Share2 className="h-4 w-4" />
                              {post.shares}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Eye className="h-4 w-4" />
                              {formatNumber(post.engagement.reach)}
                            </div>
                          </div>
                          
                          {post.commentsList.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <Separator />
                              {post.commentsList.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.author.avatar} />
                                    <AvatarFallback className="text-xs">{comment.author.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{comment.author.name}</span>
                                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-sm mt-1">{comment.content}</p>
                                    <button className="text-xs text-muted-foreground hover:text-foreground mt-1">
                                      <Heart className="h-3 w-3 inline mr-1" />
                                      {comment.likes}
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sentiment Tab */}
        <TabsContent value="sentiment" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getSentimentColor(dashboardStats?.avgSentiment || 0)}`}>
                  {(dashboardStats?.avgSentiment || 0).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">Market sentiment score</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Social Volume</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(sentimentData.reduce((sum, asset) => sum + asset.socialVolume, 0))}
                </div>
                <p className="text-xs text-muted-foreground">Total social mentions</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trending Assets</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {sentimentData.filter(asset => asset.trending).length}
                </div>
                <p className="text-xs text-muted-foreground">Assets trending now</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Asset Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Sentiment Analysis</CardTitle>
                <CardDescription>Real-time sentiment scores for major cryptocurrencies</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {sentimentData.map((asset) => (
                      <div key={asset.symbol} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {getSentimentIcon(asset.overallSentiment)}
                              <span className="font-medium">{asset.symbol}</span>
                              {asset.trending && <Badge variant="secondary">Trending</Badge>}
                            </div>
                            <span className="text-sm text-muted-foreground">{asset.name}</span>
                          </div>
                          <div className={`text-lg font-bold ${getSentimentColor(asset.sentimentScore)}`}>
                            {asset.sentimentScore.toFixed(1)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Social Volume</div>
                            <div className="font-medium">{formatNumber(asset.socialVolume)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">News Volume</div>
                            <div className="font-medium">{formatNumber(asset.newsVolume)}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">24h Change</div>
                            <div className={`font-medium ${asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Mentions</div>
                            <div className="font-medium">{formatNumber(asset.mentions)}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="text-xs text-muted-foreground mb-1">Sentiment Distribution</div>
                          <div className="flex gap-2">
                            <div className="flex-1 bg-green-100 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${Math.max(0, asset.sentimentScore)}%` }}
                              />
                            </div>
                            <div className="flex-1 bg-red-100 rounded-full h-2">
                              <div 
                                className="bg-red-500 h-2 rounded-full" 
                                style={{ width: `${Math.max(0, 100 - asset.sentimentScore)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Market Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Market Alerts</CardTitle>
                <CardDescription>Real-time alerts based on sentiment and market data</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {marketAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={`h-4 w-4 ${
                              alert.severity === 'high' ? 'text-red-500' : 
                              alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                            }`} />
                            <span className="font-medium">{alert.asset}</span>
                            <Badge variant={
                              alert.severity === 'high' ? 'destructive' : 
                              alert.severity === 'medium' ? 'default' : 'secondary'
                            }>
                              {alert.severity}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {alert.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Type: {alert.type} • Value: {alert.value.toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {marketAlerts.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No active market alerts
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Real-time Notifications
              </CardTitle>
              <CardDescription>Stay updated with trading activities and market events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Switch
                    id="realtime-updates"
                    checked={realtimeUpdates}
                    onCheckedChange={setRealtimeUpdates}
                  />
                  <Label htmlFor="realtime-updates">Real-time updates</Label>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                >
                  Mark all as read
                </Button>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg ${notification.read ? 'bg-muted/30' : 'bg-blue-50 border-blue-200'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm">{notification.message}</p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No notifications
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function for post type labels
function getPostTypeLabel(type: string) {
  switch (type) {
    case 'trade_update': return 'Trade Update'
    case 'analysis': return 'Analysis'
    case 'achievement': return 'Achievement'
    case 'market_insight': return 'Market Insight'
    default: return 'Discussion'
  }
}