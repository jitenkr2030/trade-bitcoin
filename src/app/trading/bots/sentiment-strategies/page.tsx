'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
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
  Search,
  Plus,
  Download,
  Upload,
  Share2,
  Users,
  Activity,
  Layers,
  Grid3X3,
  Repeat,
  ArrowLeftRight,
  PieChart,
  ShoppingCart,
  Eye,
  MessageSquare,
  Twitter,
  Globe,
  Newspaper,
  Hash,
  Heart,
  ThumbsDown,
  Meh,
  Frown,
  Smile,
  Star,
  Filter,
  RefreshCw,
  Settings
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar } from 'recharts';

interface SentimentSource {
  id: string;
  name: string;
  type: 'twitter' | 'reddit' | 'news' | 'telegram' | 'discord';
  status: 'active' | 'inactive' | 'error';
  lastUpdate: string;
  sentimentScore: number;
  volume: number;
  influence: number;
  description: string;
}

interface SentimentStrategy {
  id: string;
  name: string;
  type: 'news-based' | 'social-media' | 'market-sentiment' | 'hybrid';
  status: 'running' | 'paused' | 'stopped' | 'backtesting';
  description: string;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  performance: {
    totalProfit: number;
    profitPercent: number;
    winRate: number;
    totalTrades: number;
    sharpeRatio: number;
    maxDrawdown: number;
    avgTradeDuration: string;
  };
  config: {
    symbol: string;
    timeframe: string;
    riskLevel: 'low' | 'medium' | 'high';
    investment: number;
    sentimentThreshold: number;
    sources: string[];
  };
  sentimentIndicators: {
    overallScore: number;
    newsSentiment: number;
    socialSentiment: number;
    marketSentiment: number;
    trend: 'bullish' | 'bearish' | 'neutral';
  };
}

interface SentimentAlert {
  id: string;
  type: 'news-break' | 'social-trend' | 'sentiment-shift' | 'volume-spike';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  source: string;
  sentimentScore: number;
  timestamp: string;
  affectedAssets: string[];
  actionTaken?: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number;
  timestamp: string;
  url: string;
  summary: string;
  impact: 'low' | 'medium' | 'high';
}

export default function SentimentStrategiesPage() {
  const [activeTab, setActiveTab] = useState('strategies');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<SentimentStrategy | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock data for demonstration
  const [sentimentSources, setSentimentSources] = useState<SentimentSource[]>([
    {
      id: '1',
      name: 'Twitter Crypto',
      type: 'twitter',
      status: 'active',
      lastUpdate: '2 minutes ago',
      sentimentScore: 0.67,
      volume: 15420,
      influence: 0.85,
      description: 'Real-time Twitter sentiment analysis for cryptocurrency discussions'
    },
    {
      id: '2',
      name: 'Reddit Crypto',
      type: 'reddit',
      status: 'active',
      lastUpdate: '5 minutes ago',
      sentimentScore: 0.72,
      volume: 8750,
      influence: 0.78,
      description: 'Reddit sentiment tracking across major cryptocurrency subreddits'
    },
    {
      id: '3',
      name: 'Crypto News API',
      type: 'news',
      status: 'active',
      lastUpdate: '1 minute ago',
      sentimentScore: 0.58,
      volume: 342,
      influence: 0.92,
      description: 'News sentiment analysis from major crypto news outlets'
    },
    {
      id: '4',
      name: 'Telegram Signals',
      type: 'telegram',
      status: 'inactive',
      lastUpdate: '1 hour ago',
      sentimentScore: 0.45,
      volume: 2340,
      influence: 0.65,
      description: 'Sentiment analysis from major crypto trading groups'
    }
  ]);

  const [sentimentStrategies, setSentimentStrategies] = useState<SentimentStrategy[]>([
    {
      id: '1',
      name: 'News Momentum Trader',
      type: 'news-based',
      status: 'running',
      description: 'Trades based on breaking news sentiment and market impact analysis',
      creator: {
        name: 'You',
        avatar: '/avatars/user.jpg',
        verified: true,
      },
      performance: {
        totalProfit: 3450,
        profitPercent: 34.5,
        winRate: 73.2,
        totalTrades: 89,
        sharpeRatio: 2.1,
        maxDrawdown: 8.7,
        avgTradeDuration: '4.2 hours',
      },
      config: {
        symbol: 'BTC/USDT',
        timeframe: '15m',
        riskLevel: 'medium',
        investment: 10000,
        sentimentThreshold: 0.6,
        sources: ['Crypto News API', 'Twitter Crypto']
      },
      sentimentIndicators: {
        overallScore: 0.67,
        newsSentiment: 0.72,
        socialSentiment: 0.65,
        marketSentiment: 0.64,
        trend: 'bullish'
      }
    },
    {
      id: '2',
      name: 'Social Media Sentiment',
      type: 'social-media',
      status: 'paused',
      description: 'Analyzes social media trends and sentiment for trading opportunities',
      creator: {
        name: 'You',
        avatar: '/avatars/user.jpg',
        verified: true,
      },
      performance: {
        totalProfit: 2180,
        profitPercent: 21.8,
        winRate: 68.9,
        totalTrades: 134,
        sharpeRatio: 1.8,
        maxDrawdown: 12.3,
        avgTradeDuration: '2.1 hours',
      },
      config: {
        symbol: 'ETH/USDT',
        timeframe: '30m',
        riskLevel: 'low',
        investment: 5000,
        sentimentThreshold: 0.55,
        sources: ['Twitter Crypto', 'Reddit Crypto']
      },
      sentimentIndicators: {
        overallScore: 0.58,
        newsSentiment: 0.52,
        socialSentiment: 0.64,
        marketSentiment: 0.58,
        trend: 'neutral'
      }
    }
  ]);

  const [sentimentAlerts, setSentimentAlerts] = useState<SentimentAlert[]>([
    {
      id: '1',
      type: 'news-break',
      severity: 'high',
      title: 'Major Exchange Listing Announcement',
      description: 'Coinbase announces listing of new altcoin, causing significant market movement',
      source: 'Crypto News API',
      sentimentScore: 0.89,
      timestamp: '10 minutes ago',
      affectedAssets: ['BTC', 'ETH', 'SOL'],
      actionTaken: 'Position opened on SOL'
    },
    {
      id: '2',
      type: 'social-trend',
      severity: 'medium',
      title: 'Twitter Sentiment Shift',
      description: 'Significant increase in bullish sentiment on Twitter for Bitcoin',
      source: 'Twitter Crypto',
      sentimentScore: 0.76,
      timestamp: '25 minutes ago',
      affectedAssets: ['BTC']
    },
    {
      id: '3',
      type: 'sentiment-shift',
      severity: 'critical',
      title: 'Market Sentiment Reversal',
      description: 'Overall market sentiment shifting from bearish to bullish across multiple sources',
      source: 'Combined Analysis',
      sentimentScore: 0.68,
      timestamp: '1 hour ago',
      affectedAssets: ['BTC', 'ETH', 'BNB', 'ADA']
    }
  ]);

  const [newsItems, setNewsItems] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Bitcoin ETF Approval Expected Next Week',
      source: 'Bloomberg',
      sentiment: 'positive',
      score: 0.87,
      timestamp: '15 minutes ago',
      url: '#',
      summary: 'Sources indicate that SEC approval for Bitcoin ETF is imminent',
      impact: 'high'
    },
    {
      id: '2',
      title: 'Ethereum Gas Fees Spike Due to NFT Minting',
      source: 'CoinDesk',
      sentiment: 'negative',
      score: 0.32,
      timestamp: '45 minutes ago',
      url: '#',
      summary: 'Network congestion causes gas fees to reach 6-month high',
      impact: 'medium'
    },
    {
      id: '3',
      title: 'DeFi Protocol Shows Strong Growth',
      source: 'The Block',
      sentiment: 'positive',
      score: 0.78,
      timestamp: '1 hour ago',
      url: '#',
      summary: 'Total Value Locked in DeFi protocols reaches new all-time high',
      impact: 'medium'
    }
  ]);

  const filteredStrategies = sentimentStrategies.filter(strategy => 
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'reddit': return <MessageSquare className="h-4 w-4" />;
      case 'news': return <Newspaper className="h-4 w-4" />;
      case 'telegram': return <MessageSquare className="h-4 w-4" />;
      case 'discord': return <MessageSquare className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (score: number) => {
    if (score >= 0.6) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentIcon = (score: number) => {
    if (score >= 0.6) return <Smile className="h-4 w-4" />;
    if (score >= 0.4) return <Meh className="h-4 w-4" />;
    return <Frown className="h-4 w-4" />;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const handleAnalyzeSentiment = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const sentimentData = [
    { time: '00:00', score: 0.45, volume: 1200 },
    { time: '04:00', score: 0.52, volume: 800 },
    { time: '08:00', score: 0.67, volume: 2500 },
    { time: '12:00', score: 0.73, volume: 3200 },
    { time: '16:00', score: 0.68, volume: 2800 },
    { time: '20:00', score: 0.71, volume: 2100 },
    { time: '24:00', score: 0.64, volume: 1500 }
  ];

  const sourceDistribution = [
    { name: 'Twitter', value: 45, color: '#1DA1F2' },
    { name: 'Reddit', value: 25, color: '#FF4500' },
    { name: 'News', value: 20, color: '#00D4AA' },
    { name: 'Telegram', value: 10, color: '#0088CC' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sentiment-Based Strategies</h1>
          <p className="text-muted-foreground">
            Trading strategies powered by market sentiment and social media analysis
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={handleAnalyzeSentiment} disabled={isAnalyzing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Sentiment'}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Strategy
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Strategies
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Sources
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            News Feed
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStrategies.map((strategy) => (
              <Card key={strategy.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{strategy.name}</h3>
                        <Badge variant={strategy.status === 'running' ? 'default' : strategy.status === 'paused' ? 'secondary' : 'destructive'}>
                          {strategy.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{strategy.type.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getSentimentIcon(strategy.sentimentIndicators.overallScore)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sentiment Score</p>
                      <p className={`font-semibold ${getSentimentColor(strategy.sentimentIndicators.overallScore)}`}>
                        {(strategy.sentimentIndicators.overallScore * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{strategy.performance.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Profit</p>
                      <p className="font-semibold">${strategy.performance.totalProfit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sharpe Ratio</p>
                      <p className="font-semibold">{strategy.performance.sharpeRatio}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Market Trend</span>
                      <Badge variant={strategy.sentimentIndicators.trend === 'bullish' ? 'default' : strategy.sentimentIndicators.trend === 'bearish' ? 'destructive' : 'secondary'}>
                        {strategy.sentimentIndicators.trend.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedStrategy(strategy)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button variant="default" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {sentimentSources.map((source) => (
              <Card key={source.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getSourceIcon(source.type)}
                      <div>
                        <h3 className="font-semibold">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">{source.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
                      {source.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{source.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sentiment Score</p>
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(source.sentimentScore)}
                        <p className={`font-semibold ${getSentimentColor(source.sentimentScore)}`}>
                          {(source.sentimentScore * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Volume</p>
                      <p className="font-semibold">{source.volume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Influence</p>
                      <div className="flex items-center gap-2">
                        <Progress value={source.influence * 100} className="h-2 flex-1" />
                        <span className="text-sm">{(source.influence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Update</p>
                      <p className="font-semibold">{source.lastUpdate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant={source.status === 'active' ? 'destructive' : 'default'} size="sm">
                      {source.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-4">
            {sentimentAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.source} • {alert.timestamp}</p>
                    </div>
                    <Badge variant={getSeverityBadge(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{alert.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(alert.sentimentScore)}
                      <span className={`font-semibold ${getSentimentColor(alert.sentimentScore)}`}>
                        Sentiment: {(alert.sentimentScore * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {alert.affectedAssets.map((asset, index) => (
                        <Badge key={index} variant="outline">{asset}</Badge>
                      ))}
                    </div>
                  </div>

                  {alert.actionTaken && (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Action Taken:</strong> {alert.actionTaken}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <div className="space-y-4">
            {newsItems.map((news) => (
              <Card key={news.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{news.title}</h3>
                      <p className="text-sm text-muted-foreground">{news.source} • {news.timestamp}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSentimentIcon(news.score)}
                      <Badge variant={news.sentiment === 'positive' ? 'default' : news.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                        {news.sentiment.toUpperCase()}
                      </Badge>
                      <Badge variant={news.impact === 'high' ? 'destructive' : news.impact === 'medium' ? 'outline' : 'secondary'}>
                        {news.impact.toUpperCase()} IMPACT
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{news.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Sentiment Score:</span>
                      <span className={`font-semibold ${getSentimentColor(news.score)}`}>
                        {(news.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      Read Full Article
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={sourceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {sourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume vs Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsBarChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Real-time Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">68.7%</div>
                    <div className="text-sm text-muted-foreground">Overall Sentiment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12,450</div>
                    <div className="text-sm text-muted-foreground">Mentions/Hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">4</div>
                    <div className="text-sm text-muted-foreground">Active Sources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">87.3%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedStrategy && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Strategy Details - {selectedStrategy.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Strategy Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{selectedStrategy.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={selectedStrategy.status === 'running' ? 'default' : selectedStrategy.status === 'paused' ? 'secondary' : 'destructive'}>
                      {selectedStrategy.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Symbol:</span>
                    <span>{selectedStrategy.config.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeframe:</span>
                    <span>{selectedStrategy.config.timeframe}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Profit:</span>
                    <span>${selectedStrategy.performance.totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit %:</span>
                    <span>{selectedStrategy.performance.profitPercent.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Win Rate:</span>
                    <span>{selectedStrategy.performance.winRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sharpe Ratio:</span>
                    <span>{selectedStrategy.performance.sharpeRatio}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Sentiment Indicators</h4>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${getSentimentColor(selectedStrategy.sentimentIndicators.overallScore)}`}>
                    {(selectedStrategy.sentimentIndicators.overallScore * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getSentimentColor(selectedStrategy.sentimentIndicators.newsSentiment)}`}>
                    {(selectedStrategy.sentimentIndicators.newsSentiment * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">News Sentiment</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getSentimentColor(selectedStrategy.sentimentIndicators.socialSentiment)}`}>
                    {(selectedStrategy.sentimentIndicators.socialSentiment * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Social Sentiment</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getSentimentColor(selectedStrategy.sentimentIndicators.marketSentiment)}`}>
                    {(selectedStrategy.sentimentIndicators.marketSentiment * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Market Sentiment</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Configuration</h4>
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <p><strong>Risk Level:</strong> {selectedStrategy.config.riskLevel.toUpperCase()}</p>
                  <p><strong>Investment:</strong> ${selectedStrategy.config.investment.toLocaleString()}</p>
                  <p><strong>Sentiment Threshold:</strong> {(selectedStrategy.config.sentimentThreshold * 100).toFixed(1)}%</p>
                </div>
                <div>
                  <p><strong>Data Sources:</strong></p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedStrategy.config.sources.map((source, index) => (
                      <Badge key={index} variant="outline">{source}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}