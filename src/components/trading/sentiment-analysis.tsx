"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  MessageSquare,
  Twitter,
  Globe,
  DollarSign,
  Bitcoin,
  Users,
  Eye,
  Star,
  AlertTriangle,
  Info,
  Download,
  Settings,
  Maximize2,
  Minimize2,
  ThumbsUp,
  ThumbsDown,
  Meh
} from "lucide-react"

interface SentimentData {
  source: string
  positive: number
  negative: number
  neutral: number
  score: number
  volume: number
  change: number
  timestamp: Date
}

interface AssetSentiment {
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

interface SentimentTrend {
  timestamp: Date
  sentiment: number
  volume: number
  price: number
}

interface NewsArticle {
  id: string
  title: string
  content: string
  source: string
  author: string
  publishedAt: Date
  url: string
  sentiment: {
    score: number
    magnitude: number
    classification: 'positive' | 'negative' | 'neutral'
  }
  keywords: string[]
  assets: string[]
  relevance: number
}

interface SentimentAlert {
  id: string
  type: 'spike' | 'trend_change' | 'extreme'
  severity: 'low' | 'medium' | 'high'
  message: string
  asset: string
  timestamp: Date
  sentimentChange: number
}

interface SocialMediaPost {
  id: string
  platform: string
  content: string
  author: string
  sentiment: 'positive' | 'negative' | 'neutral'
  engagement: number
  timestamp: Date
  asset: string
}

interface SentimentAnalysisProps {
  height?: number
  showControls?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  onFullscreen?: () => void
}

// Generate realistic sentiment analysis data
const generateSentimentAnalysisData = (): {
  sources: SentimentData[]
  assets: AssetSentiment[]
  trends: SentimentTrend[]
  socialPosts: SocialMediaPost[]
  newsArticles: NewsArticle[]
  sentimentAlerts: SentimentAlert[]
  overallSentiment: number
  marketFearGreed: number
} => {
  const sources = ['Twitter', 'Reddit', 'Telegram', 'Discord', 'News Articles', 'Trading View']
  const assets = [
    { symbol: 'BTC', name: 'Bitcoin' },
    { symbol: 'ETH', name: 'Ethereum' },
    { symbol: 'BNB', name: 'Binance Coin' },
    { symbol: 'SOL', name: 'Solana' },
    { symbol: 'ADA', name: 'Cardano' },
    { symbol: 'DOT', name: 'Polkadot' },
    { symbol: 'MATIC', name: 'Polygon' },
    { symbol: 'AVAX', name: 'Avalanche' }
  ]
  
  const sourceData: SentimentData[] = sources.map(source => ({
    source,
    positive: Math.random() * 60 + 20,
    negative: Math.random() * 30 + 10,
    neutral: Math.random() * 20 + 10,
    score: (Math.random() - 0.5) * 100,
    volume: Math.random() * 10000 + 1000,
    change: (Math.random() - 0.5) * 20,
    timestamp: new Date()
  }))
  
  const assetData: AssetSentiment[] = assets.map(asset => {
    const sentimentScore = (Math.random() - 0.5) * 100
    const overallSentiment = sentimentScore > 20 ? 'positive' : sentimentScore < -20 ? 'negative' : 'neutral'
    
    return {
      symbol: asset.symbol,
      name: asset.name,
      overallSentiment,
      sentimentScore,
      socialVolume: Math.random() * 50000 + 5000,
      newsVolume: Math.random() * 1000 + 100,
      marketCap: Math.random() * 500000000000 + 10000000000,
      priceChange24h: (Math.random() - 0.5) * 20,
      mentions: Math.random() * 10000 + 1000,
      trending: Math.random() > 0.7
    }
  })
  
  const trends: SentimentTrend[] = []
  const now = new Date()
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    trends.push({
      timestamp,
      sentiment: (Math.random() - 0.5) * 100,
      volume: Math.random() * 10000 + 1000,
      price: 43000 + (Math.random() - 0.5) * 5000
    })
  }
  
  const socialPosts: SocialMediaPost[] = []
  const platforms = ['Twitter', 'Reddit', 'Telegram', 'Discord']
  const sentiments = ['positive', 'negative', 'neutral'] as const
  const contents = [
    'Bitcoin is looking strong today! The technical indicators are showing bullish signals.',
    'I\'m concerned about the recent market volatility. Might be time to take some profits.',
    'Ethereum 2.0 is making great progress. The future looks bright for DeFi.',
    'Market sentiment seems neutral right now. Waiting for clearer signals.',
    'Just bought more BTC at these levels. Long-term bullish on crypto.',
    'The regulatory environment is becoming more favorable for crypto adoption.',
    'Seeing some resistance at current levels. Might consolidate before next move.',
    'DeFi protocols are showing strong growth metrics. Innovation continues!'
  ]
  
  for (let i = 0; i < 20; i++) {
    const timestamp = new Date(now.getTime() - (i * 30 * 60 * 1000 + Math.random() * 30 * 60 * 1000))
    socialPosts.push({
      id: `post_${i}`,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      content: contents[Math.floor(Math.random() * contents.length)],
      author: `user_${Math.floor(Math.random() * 10000)}`,
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
      engagement: Math.floor(Math.random() * 1000) + 10,
      timestamp,
      asset: assets[Math.floor(Math.random() * assets.length)].symbol
    })
  }

  // Generate news articles
  const newsArticles: NewsArticle[] = []
  const newsSources = ['CoinDesk', 'CoinTelegraph', 'Bloomberg', 'Reuters', 'CryptoSlate', 'The Block']
  const newsTitles = [
    'Bitcoin Surges Past $50,000 as Institutional Adoption Accelerates',
    'Ethereum Gas Fees Drop 90% Following Latest Network Upgrade',
    'Regulatory Clarity Boosts Crypto Market Confidence',
    'Major Bank Announces Bitcoin Custody Services',
    'DeFi Protocol Records All-Time High in Total Value Locked',
    'Central Banks Explore Digital Currency Partnerships',
    'Crypto Exchange Launches New Institutional Trading Platform',
    'Blockchain Technology Adopted by Supply Chain Giants'
  ]

  for (let i = 0; i < 15; i++) {
    const sentimentScore = (Math.random() - 0.5) * 100
    const classification = sentimentScore > 20 ? 'positive' : sentimentScore < -20 ? 'negative' : 'neutral'
    
    newsArticles.push({
      id: `news_${i}`,
      title: newsTitles[Math.floor(Math.random() * newsTitles.length)],
      content: 'Breaking news in the cryptocurrency market...',
      source: newsSources[Math.floor(Math.random() * newsSources.length)],
      author: `Author_${Math.floor(Math.random() * 100)}`,
      publishedAt: new Date(now.getTime() - (i * 60 * 60 * 1000 + Math.random() * 60 * 60 * 1000)),
      url: `https://example.com/news/${i}`,
      sentiment: {
        score: sentimentScore,
        magnitude: Math.random() * 10 + 1,
        classification
      },
      keywords: ['bitcoin', 'ethereum', 'crypto', 'blockchain', 'defi'],
      assets: assets.slice(0, Math.floor(Math.random() * 3) + 1).map(a => a.symbol),
      relevance: Math.random() * 100
    })
  }

  // Generate sentiment alerts
  const sentimentAlerts: SentimentAlert[] = []
  const alertTypes = ['spike', 'trend_change', 'extreme'] as const
  const severities = ['low', 'medium', 'high'] as const
  
  for (let i = 0; i < 5; i++) {
    sentimentAlerts.push({
      id: `alert_${i}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: 'Significant sentiment change detected',
      asset: assets[Math.floor(Math.random() * assets.length)].symbol,
      timestamp: new Date(now.getTime() - (i * 60 * 60 * 1000)),
      sentimentChange: (Math.random() - 0.5) * 50
    })
  }
  
  return {
    sources: sourceData,
    assets: assetData,
    trends,
    socialPosts: socialPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    newsArticles: newsArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
    sentimentAlerts: sentimentAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    overallSentiment: (Math.random() - 0.5) * 100,
    marketFearGreed: Math.random() * 100
  }
}

export function SentimentAnalysis({ 
  height = 600,
  showControls = true,
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutes
  onFullscreen
}: SentimentAnalysisProps) {
  const [sentimentData, setSentimentData] = useState<{
    sources: SentimentData[]
    assets: AssetSentiment[]
    trends: SentimentTrend[]
    socialPosts: SocialMediaPost[]
    newsArticles: NewsArticle[]
    sentimentAlerts: SentimentAlert[]
    overallSentiment: number
    marketFearGreed: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAsset, setSelectedAsset] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | 'week'>('24h')
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      const data = generateSentimentAnalysisData()
      setSentimentData(data)
      setIsLoading(false)
    }

    loadData()
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const handleRefresh = () => {
    setIsLoading(true)
    const data = generateSentimentAnalysisData()
    setSentimentData(data)
    setIsLoading(false)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    onFullscreen?.()
  }

  const getSentimentColor = (sentiment: string | number) => {
    if (typeof sentiment === 'number') {
      if (sentiment > 20) return 'text-green-600'
      if (sentiment < -20) return 'text-red-600'
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
      if (sentiment > 20) return <ThumbsUp className="h-4 w-4" />
      if (sentiment < -20) return <ThumbsDown className="h-4 w-4" />
      return <Meh className="h-4 w-4" />
    }
    
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="h-4 w-4" />
      case 'negative': return <ThumbsDown className="h-4 w-4" />
      case 'neutral': return <Meh className="h-4 w-4" />
      default: return <Meh className="h-4 w-4" />
    }
  }

  const getFearGreedColor = (score: number) => {
    if (score > 75) return 'text-red-600'
    if (score > 50) return 'text-yellow-600'
    if (score > 25) return 'text-green-600'
    return 'text-blue-600'
  }

  const getFearGreedLabel = (score: number) => {
    if (score > 75) return 'Extreme Greed'
    if (score > 50) return 'Greed'
    if (score > 25) return 'Neutral'
    return 'Fear'
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

  if (isLoading || !sentimentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[600px]">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredAssets = selectedAsset === 'all' 
    ? sentimentData.assets 
    : sentimentData.assets.filter(asset => asset.symbol === selectedAsset)

  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 m-0" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle>Sentiment Analysis</CardTitle>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Overall Sentiment:</span>
            <Badge variant="outline" className={getSentimentColor(sentimentData.overallSentiment)}>
              {getSentimentIcon(sentimentData.overallSentiment)}
              <span className="ml-1">
                {sentimentData.overallSentiment > 20 ? 'Positive' : 
                 sentimentData.overallSentiment < -20 ? 'Negative' : 'Neutral'}
              </span>
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Fear & Greed Index:</span>
            <Badge variant="outline" className={getFearGreedColor(sentimentData.marketFearGreed)}>
              {sentimentData.marketFearGreed.toFixed(0)} - {getFearGreedLabel(sentimentData.marketFearGreed)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Assets Tracked:</span>
            <Badge variant="secondary">{sentimentData.assets.length}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Overall Sentiment */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Overall Market Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    {getSentimentIcon(sentimentData.overallSentiment)}
                    <div className="flex-1">
                      <div className="text-2xl font-bold">
                        {sentimentData.overallSentiment > 0 ? '+' : ''}{sentimentData.overallSentiment.toFixed(1)}
                      </div>
                      <Progress 
                        value={(sentimentData.overallSentiment + 100) / 2} 
                        className="mt-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fear & Greed */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Fear & Greed Index</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="text-2xl font-bold">
                        {sentimentData.marketFearGreed.toFixed(0)}
                      </div>
                      <Progress 
                        value={sentimentData.marketFearGreed} 
                        className="mt-2"
                      />
                      <div className="text-xs text-muted-foreground mt-1">
                        {getFearGreedLabel(sentimentData.marketFearGreed)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Volume */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Social Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    <div className="flex-1">
                      <div className="text-2xl font-bold">
                        {formatNumber(sentimentData.assets.reduce((sum, asset) => sum + asset.socialVolume, 0))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        24h mentions
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Source Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sentiment by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sentimentData.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-20 text-sm">{source.source}</div>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-2 bg-green-200 rounded">
                            <div 
                              className="h-2 bg-green-600 rounded" 
                              style={{ width: `${source.positive}%` }}
                            />
                          </div>
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-2 bg-gray-600 rounded" 
                              style={{ width: `${source.neutral}%` }}
                            />
                          </div>
                          <div className="w-16 h-2 bg-red-200 rounded">
                            <div 
                              className="h-2 bg-red-600 rounded" 
                              style={{ width: `${source.negative}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="text-green-600">{source.positive.toFixed(0)}%</span>
                        <span className="text-gray-600"> / {source.neutral.toFixed(0)}%</span>
                        <span className="text-red-600"> / {source.negative.toFixed(0)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assets</SelectItem>
                  {sentimentData.assets.map(asset => (
                    <SelectItem key={asset.symbol} value={asset.symbol}>
                      {asset.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredAssets.map((asset) => (
                <Card key={asset.symbol}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-bold">{asset.symbol}</div>
                          <div className="text-sm text-muted-foreground">{asset.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSentimentIcon(asset.overallSentiment)}
                          <div className={`font-medium ${getSentimentColor(asset.overallSentiment)}`}>
                            {asset.sentimentScore > 0 ? '+' : ''}{asset.sentimentScore.toFixed(1)}
                          </div>
                        </div>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{formatNumber(asset.socialVolume)}</span>
                          </div>
                          <div className="text-muted-foreground">mentions</div>
                        </div>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>{formatCurrency(asset.marketCap)}</span>
                          </div>
                          <div className="text-muted-foreground">market cap</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {asset.trending && (
                          <Badge variant="destructive" className="text-xs">
                            Trending
                          </Badge>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <ScrollArea className={`${height}px`}>
              <div className="space-y-3">
                {sentimentData.socialPosts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {post.platform}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {post.asset}
                            </Badge>
                            <Badge className={`text-xs ${getSentimentColor(post.sentiment)}`}>
                              {getSentimentIcon(post.sentiment)}
                              <span className="ml-1">{post.sentiment}</span>
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {post.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                          <p className="text-sm mb-2">{post.content}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span>By:</span>
                              <span>{post.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{post.engagement}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="news" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Latest News & Sentiment Analysis
                </CardTitle>
                <CardDescription>
                  Real-time news articles with AI-powered sentiment analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentimentData.newsArticles.map((article) => (
                    <div key={article.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{article.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{article.source}</span>
                            <span>•</span>
                            <span>{article.author}</span>
                            <span>•</span>
                            <span>{article.publishedAt.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={article.sentiment.classification === 'positive' ? 'default' : 
                                       article.sentiment.classification === 'negative' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {article.sentiment.classification.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Score: {article.sentiment.score.toFixed(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Magnitude: {article.sentiment.magnitude.toFixed(1)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {article.assets.map((asset) => (
                              <Badge key={asset} variant="secondary" className="text-xs">
                                {asset}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {article.relevance.toFixed(0)}% relevant
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            Read More
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.content}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Sentiment Alerts
                </CardTitle>
                <CardDescription>
                  Real-time alerts for significant sentiment changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sentimentData.sentimentAlerts.map((alert) => (
                    <div key={alert.id} className={`border rounded-lg p-4 ${
                      alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                      alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={alert.severity === 'high' ? 'destructive' : 
                                     alert.severity === 'medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {alert.type.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {alert.asset}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span>Sentiment Change:</span>
                        <span className={`font-medium ${
                          alert.sentimentChange > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {alert.sentimentChange > 0 ? '+' : ''}{alert.sentimentChange.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Sentiment Trends (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sentimentData.trends.slice(-12).map((trend, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="w-20">{trend.timestamp.toLocaleTimeString()}</div>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="w-32">
                          <div className="flex items-center gap-1">
                            {getSentimentIcon(trend.sentiment)}
                            <span className={getSentimentColor(trend.sentiment)}>
                              {trend.sentiment > 0 ? '+' : ''}{trend.sentiment.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <Progress 
                            value={(trend.sentiment + 100) / 2} 
                            className="h-2"
                          />
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        {formatNumber(trend.volume)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}