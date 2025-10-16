"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Filter,
  Search,
  ExternalLink,
  Clock,
  Star,
  Share2,
  Bookmark,
  Eye,
  MessageSquare,
  Hash,
  Globe,
  DollarSign,
  Bitcoin,
  Building,
  AlertTriangle,
  Info,
  Download,
  Settings,
  Maximize2,
  Minimize2
} from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  author: string
  source: string
  publishedAt: Date
  url?: string
  category: string
  tags: string[]
  sentiment: 'positive' | 'negative' | 'neutral'
  importance: 'low' | 'medium' | 'high'
  isBookmarked: boolean
  viewCount: number
  shareCount: number
  relatedAssets: string[]
  imageUrl?: string
}

interface NewsFeedData {
  articles: NewsArticle[]
  totalArticles: number
  positiveSentiment: number
  negativeSentiment: number
  neutralSentiment: number
  highImportance: number
  bookmarkedArticles: number
  lastUpdate: Date
  trendingTopics: string[]
}

interface NewsFeedProps {
  height?: number
  showControls?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  onFullscreen?: () => void
}

// Generate realistic news feed data
const generateNewsFeedData = (): NewsFeedData => {
  const articles: NewsArticle[] = []
  const sources = ['Bloomberg', 'Reuters', 'CoinDesk', 'CryptoSlate', 'The Block', 'Decrypt', 'Cointelegraph', 'Forbes Crypto']
  const categories = ['Market Analysis', 'Regulation', 'Technology', 'Adoption', 'DeFi', 'NFTs', 'Mining', 'Trading']
  const tags = ['Bitcoin', 'Ethereum', 'DeFi', 'NFT', 'Regulation', 'CBDC', 'Mining', 'Staking', 'Yield', 'Layer 2']
  const assets = ['BTC', 'ETH', 'BNB', 'SOL', 'ADA', 'DOT', 'MATIC', 'AVAX', 'LINK', 'UNI']
  const authors = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Lee', 'Lisa Brown', 'Tom Anderson', 'Amy Davis']
  
  const titles = [
    'Bitcoin Surges Past $45,000 as Institutional Adoption Accelerates',
    'Federal Reserve Signals Potential Rate Changes Impacting Crypto Markets',
    'Ethereum 2.0 Upgrade Shows Promising Results for Network Performance',
    'Major Bank Announces Crypto Custody Services Expansion',
    'DeFi Protocol Records All-Time High in Total Value Locked',
    'Regulatory Clarity Emerges in Key Markets Boosting Investor Confidence',
    'NFT Market Shows Signs of Recovery with Increased Trading Volume',
    'Mining Operations Shift Towards Renewable Energy Sources',
    'Cross-Chain Solutions Gain Traction in DeFi Ecosystem',
    'Central Bank Digital Currency Pilots Show Positive Results'
  ]
  
  const summaries = [
    'The cryptocurrency market shows strong momentum as institutional investors increase their allocations to digital assets.',
    'Recent regulatory developments have created a more favorable environment for cryptocurrency businesses and investors.',
    'Technological advancements continue to drive innovation in the blockchain and cryptocurrency space.',
    'Market analysts predict continued growth in the cryptocurrency sector based on current trends.',
    'The integration of traditional finance with cryptocurrency markets is accelerating at a rapid pace.',
    'New use cases for blockchain technology are emerging across various industries.',
    'Investor sentiment remains positive despite short-term market volatility.',
    'The cryptocurrency ecosystem continues to mature with improved infrastructure and services.'
  ]
  
  let bookmarkedCount = 0
  let positiveCount = 0
  let negativeCount = 0
  let neutralCount = 0
  let highImportanceCount = 0
  
  const now = new Date()
  
  // Generate articles for the last 24 hours
  for (let i = 0; i < 30; i++) {
    const publishedAt = new Date(now.getTime() - (i * 60 * 60 * 1000 + Math.random() * 60 * 60 * 1000)) // Random times over last 30 hours
    const sentiment = ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral'
    const importance = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
    const isBookmarked = Math.random() > 0.9 && bookmarkedCount < 3 // 10% chance, max 3 bookmarked
    
    if (sentiment === 'positive') positiveCount++
    else if (sentiment === 'negative') negativeCount++
    else neutralCount++
    
    if (importance === 'high') highImportanceCount++
    
    if (isBookmarked) bookmarkedCount++
    
    articles.push({
      id: `article_${i}_${Date.now()}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      summary: summaries[Math.floor(Math.random() * summaries.length)],
      content: `This is a detailed article about the cryptocurrency market. The content provides in-depth analysis and insights into current market trends, regulatory developments, and technological advancements. The article includes expert opinions, market data, and projections for the future of the cryptocurrency industry. Readers will find comprehensive coverage of the topic with supporting evidence and multiple perspectives from industry leaders and analysts.`,
      author: authors[Math.floor(Math.random() * authors.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      publishedAt,
      url: `https://example.com/news/${i}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      tags: tags.slice(0, Math.floor(Math.random() * 4) + 1),
      sentiment,
      importance,
      isBookmarked,
      viewCount: Math.floor(Math.random() * 10000) + 100,
      shareCount: Math.floor(Math.random() * 500) + 10,
      relatedAssets: assets.slice(0, Math.floor(Math.random() * 3) + 1),
      imageUrl: `https://picsum.photos/seed/news${i}/400/200.jpg`
    })
  }
  
  return {
    articles: articles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
    totalArticles: articles.length,
    positiveSentiment: positiveCount,
    negativeSentiment: negativeCount,
    neutralSentiment: neutralCount,
    highImportance: highImportanceCount,
    bookmarkedArticles: bookmarkedCount,
    lastUpdate: new Date(),
    trendingTopics: tags.slice(0, 8)
  }
}

export function NewsFeed({ 
  height = 600,
  showControls = true,
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutes
  onFullscreen
}: NewsFeedProps) {
  const [newsData, setNewsData] = useState<NewsFeedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterSentiment, setFilterSentiment] = useState<string>('all')
  const [filterImportance, setFilterImportance] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | 'week'>('24h')
  const [searchTerm, setSearchTerm] = useState('')
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      const data = generateNewsFeedData()
      setNewsData(data)
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
    const data = generateNewsFeedData()
    setNewsData(data)
    setIsLoading(false)
  }

  const toggleBookmark = (articleId: string) => {
    if (!newsData) return
    
    setNewsData(prev => {
      if (!prev) return prev
      
      const article = prev.articles.find(a => a.id === articleId)
      if (!article) return prev
      
      return {
        ...prev,
        articles: prev.articles.map(a => 
          a.id === articleId 
            ? { ...a, isBookmarked: !a.isBookmarked }
            : a
        ),
        bookmarkedArticles: article.isBookmarked 
          ? prev.bookmarkedArticles - 1 
          : prev.bookmarkedArticles + 1
      }
    })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    onFullscreen?.()
  }

  const getFilteredArticles = () => {
    if (!newsData) return []
    
    let filtered = newsData.articles
    
    // Time range filter
    const now = new Date()
    const rangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      'week': 7 * 24 * 60 * 60 * 1000
    }[timeRange]
    
    filtered = filtered.filter(article => 
      now.getTime() - article.publishedAt.getTime() <= rangeMs
    )
    
    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(article => article.category === filterCategory)
    }
    
    // Sentiment filter
    if (filterSentiment !== 'all') {
      filtered = filtered.filter(article => article.sentiment === filterSentiment)
    }
    
    // Importance filter
    if (filterImportance !== 'all') {
      filtered = filtered.filter(article => article.importance === filterImportance)
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    // Bookmarked only filter
    if (showBookmarkedOnly) {
      filtered = filtered.filter(article => article.isBookmarked)
    }
    
    return filtered
  }

  const exportToCSV = () => {
    if (!newsData) return
    
    const articles = getFilteredArticles()
    const headers = ['Title', 'Source', 'Author', 'Published', 'Category', 'Sentiment', 'Importance', 'Views', 'Shares']
    const csvContent = [
      headers.join(','),
      ...articles.map(article => [
        `"${article.title}"`,
        article.source,
        article.author,
        article.publishedAt.toLocaleString(),
        article.category,
        article.sentiment,
        article.importance,
        article.viewCount,
        article.shareCount
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crypto_news_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 border-green-200'
      case 'negative': return 'bg-red-100 text-red-800 border-red-200'
      case 'neutral': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-3 w-3" />
      case 'negative': return <TrendingDown className="h-3 w-3" />
      case 'neutral': return <Info className="h-3 w-3" />
      default: return <Info className="h-3 w-3" />
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (isLoading || !newsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Crypto News Feed
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

  const filteredArticles = getFilteredArticles()
  const uniqueCategories = [...new Set(newsData.articles.map(a => a.category))]

  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 m-0" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            <CardTitle>Crypto News Feed</CardTitle>
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
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4" />
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
            <span>Total Articles:</span>
            <Badge variant="secondary">{newsData.totalArticles}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Positive:</span>
            <Badge variant="outline" className="text-green-600">{newsData.positiveSentiment}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Negative:</span>
            <Badge variant="outline" className="text-red-600">{newsData.negativeSentiment}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>High Importance:</span>
            <Badge variant="destructive">{newsData.highImportance}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Bookmarked:</span>
            <Badge variant="outline">{newsData.bookmarkedArticles}</Badge>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          <span className="text-sm font-medium">Trending:</span>
          <div className="flex gap-2">
            {newsData.trendingTopics.map((topic, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4 mb-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as '1h' | '6h' | '24h' | 'week')}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="6h">6h</SelectItem>
                  <SelectItem value="24h">24h</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <Select value={filterSentiment} onValueChange={setFilterSentiment}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant={showBookmarkedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            >
              <Bookmark className={`h-4 w-4 mr-1 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
              Saved
            </Button>
          </div>
        </div>

        <ScrollArea className={`${height}px`}>
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className={`p-4 rounded-lg border ${
                  article.importance === 'high' ? 'bg-red-50 border-red-200' : 
                  article.importance === 'medium' ? 'bg-yellow-50 border-yellow-200' : 
                  'bg-white border-gray-200'
                } ${article.isBookmarked ? 'ring-2 ring-blue-400' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {article.source}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <Badge className={`text-xs ${getSentimentColor(article.sentiment)}`}>
                        {getSentimentIcon(article.sentiment)}
                        <span className="ml-1">{article.sentiment}</span>
                      </Badge>
                      <Badge className={`text-xs ${getImportanceColor(article.importance)}`}>
                        {article.importance}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(article.publishedAt)}
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-sm mb-2">{article.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <span>By:</span>
                        <span>{article.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.viewCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        <span>{article.shareCount}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {article.relatedAssets.map((asset, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {asset}
                        </Badge>
                      ))}
                      {article.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(article.id)}
                    >
                      <Bookmark className={`h-4 w-4 ${article.isBookmarked ? 'fill-current text-blue-500' : ''}`} />
                    </Button>
                    {article.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(article.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 text-xs text-muted-foreground">
          Showing {filteredArticles.length} of {newsData.totalArticles} articles • 
          Last updated: {newsData.lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}