'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
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
  FileText,
  Database,
  Cpu,
  Activity,
  RefreshCw,
  Save,
  Share2,
  Filter,
  Sliders,
  ArrowLeft,
  ShoppingCart,
  Star,
  Heart,
  Eye,
  Award,
  Crown,
  Users,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
  Grid3X3,
  Repeat,
  ArrowLeftRight,
  Bot,
  Brain,
  Zap as Bolt,
  Shield as ShieldIcon,
  Check,
  X,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Gift,
  Tag,
  Package,
  Layers,
  Code,
  BarChart2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  ScatterChart, 
  Scatter,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts';

interface MarketplaceBot {
  id: string;
  name: string;
  type: 'grid' | 'dca' | 'arbitrage' | 'momentum' | 'mean-reversion' | 'ml-based' | 'sentiment' | 'scalping';
  category: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  price: number;
  currency: string;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  sales: number;
  downloads: number;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    botsCreated: number;
    totalSales: number;
    joinDate: string;
  };
  description: string;
  shortDescription: string;
  features: string[];
  performance: {
    avgReturn: number;
    maxDrawdown: number;
    winRate: number;
    sharpeRatio: number;
    profitFactor: number;
    totalTrades: number;
    uptime: string;
  };
  backtestResults?: {
    period: string;
    initialCapital: number;
    finalCapital: number;
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  requirements: {
    minCapital: number;
    exchanges: string[];
    timeframe: string[];
    supportedPairs: string[];
  };
  tags: string[];
  screenshots: string[];
  videoDemo?: string;
  documentation: string;
  support: {
    responseTime: string;
    available: boolean;
    community: boolean;
  };
  license: {
    type: 'perpetual' | 'subscription' | 'rental';
    duration?: string;
    updates: boolean;
    sourceCode: boolean;
  };
  version: string;
  lastUpdated: string;
  compatibility: {
    platforms: string[];
    apiVersion: string;
  };
  isFeatured: boolean;
  isTrending: boolean;
  isNew: boolean;
  isOnSale: boolean;
  purchased: boolean;
  inWishlist: boolean;
}

interface Review {
  id: string;
  botId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
  verified: boolean;
  response?: {
    content: string;
    createdAt: string;
  };
}

import { LucideIcon } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  botCount: number;
}

interface Creator {
  id: string;
  name: string;
  avatar: string;
  verified: boolean;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  botsCreated: number;
  totalSales: number;
  averageRating: number;
  joinDate: string;
  description: string;
  specialties: string[];
}

export default function BotMarketplacePage() {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [selectedBot, setSelectedBot] = useState<MarketplaceBot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Mock data for demonstration
  const [categories] = useState<Category[]>([
    { id: 'all', name: 'All Bots', description: 'Browse all available trading bots', icon: Bot, botCount: 156 },
    { id: 'grid', name: 'Grid Trading', description: 'Automated grid trading strategies', icon: Grid3X3, botCount: 32 },
    { id: 'dca', name: 'DCA Bots', description: 'Dollar-cost averaging automation', icon: Repeat, botCount: 28 },
    { id: 'arbitrage', name: 'Arbitrage', description: 'Cross-exchange arbitrage strategies', icon: ArrowLeftRight, botCount: 15 },
    { id: 'momentum', name: 'Momentum', description: 'Trend-following strategies', icon: TrendUpIcon, botCount: 41 },
    { id: 'ml-based', name: 'Machine Learning', description: 'AI-powered trading algorithms', icon: Brain, botCount: 22 },
    { id: 'sentiment', name: 'Sentiment', description: 'News and social sentiment analysis', icon: BarChart3, botCount: 18 },
  ]);

  const [bots, setBots] = useState<MarketplaceBot[]>([
    {
      id: '1',
      name: 'Quantum Grid Pro',
      type: 'grid',
      category: 'professional',
      price: 299,
      currency: 'USD',
      originalPrice: 399,
      discount: 25,
      rating: 4.8,
      reviews: 234,
      sales: 1523,
      downloads: 8920,
      creator: {
        id: 'creator1',
        name: 'Quantum Trading Labs',
        avatar: '/avatars/quantum.jpg',
        verified: true,
        level: 'platinum',
        botsCreated: 12,
        totalSales: 45600,
        joinDate: '2022-01-15',
      },
      description: 'Professional-grade grid trading bot with advanced AI optimization and multi-exchange support. Features dynamic grid spacing, risk management, and real-time performance analytics.',
      shortDescription: 'Advanced AI-powered grid trading with multi-exchange support',
      features: [
        'AI Grid Optimization',
        'Dynamic Spacing Algorithm',
        'Multi-Exchange Support',
        'Advanced Risk Management',
        'Real-time Analytics',
        'Backtesting Engine',
        '24/7 Monitoring',
        'Mobile App Control'
      ],
      performance: {
        avgReturn: 25.4,
        maxDrawdown: 8.2,
        winRate: 71.2,
        sharpeRatio: 2.1,
        profitFactor: 2.3,
        totalTrades: 892,
        uptime: '99.9%',
      },
      backtestResults: {
        period: '2023-2024',
        initialCapital: 10000,
        finalCapital: 12540,
        totalReturn: 25.4,
        maxDrawdown: 8.2,
        sharpeRatio: 2.1,
      },
      requirements: {
        minCapital: 1000,
        exchanges: ['Binance', 'Coinbase', 'Kraken', 'FTX'],
        timeframe: ['1m', '5m', '15m', '1h', '4h'],
        supportedPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'ADA/USDT'],
      },
      tags: ['Grid', 'AI', 'Professional', 'Multi-Exchange', 'Advanced'],
      screenshots: ['/screenshots/grid1.jpg', '/screenshots/grid2.jpg', '/screenshots/grid3.jpg'],
      videoDemo: 'https://example.com/demo/quantum-grid',
      documentation: 'https://docs.quantumtrading.com',
      support: {
        responseTime: '< 2 hours',
        available: true,
        community: true,
      },
      license: {
        type: 'perpetual',
        updates: true,
        sourceCode: false,
      },
      version: '2.5.1',
      lastUpdated: '2024-01-10',
      compatibility: {
        platforms: ['Web', 'Desktop', 'Mobile'],
        apiVersion: 'v2.0',
      },
      isFeatured: true,
      isTrending: true,
      isNew: false,
      isOnSale: true,
      purchased: false,
      inWishlist: false,
    },
    {
      id: '2',
      name: 'Sentiment Trader X',
      type: 'sentiment',
      category: 'advanced',
      price: 199,
      currency: 'USD',
      rating: 4.6,
      reviews: 189,
      sales: 892,
      downloads: 5430,
      creator: {
        id: 'creator2',
        name: 'Sentient AI',
        avatar: '/avatars/sentient.jpg',
        verified: true,
        level: 'gold',
        botsCreated: 8,
        totalSales: 23400,
        joinDate: '2022-06-20',
      },
      description: 'Advanced sentiment analysis trading bot that processes news, social media, and market sentiment to make informed trading decisions. Features natural language processing and machine learning.',
      shortDescription: 'AI-powered sentiment analysis with news and social media integration',
      features: [
        'Real-time News Analysis',
        'Social Media Sentiment',
        'Natural Language Processing',
        'Machine Learning Models',
        'Multi-source Data Aggregation',
        'Risk Management',
        'Customizable Sentiment Thresholds',
        'Alert System'
      ],
      performance: {
        avgReturn: 32.1,
        maxDrawdown: 12.5,
        winRate: 68.9,
        sharpeRatio: 1.8,
        profitFactor: 2.1,
        totalTrades: 456,
        uptime: '99.5%',
      },
      requirements: {
        minCapital: 500,
        exchanges: ['Binance', 'Coinbase', 'Kraken'],
        timeframe: ['5m', '15m', '1h', '4h', '1d'],
        supportedPairs: ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT'],
      },
      tags: ['Sentiment', 'AI', 'NLP', 'News', 'Social Media'],
      screenshots: ['/screenshots/sentiment1.jpg', '/screenshots/sentiment2.jpg'],
      documentation: 'https://docs.sentientai.com',
      support: {
        responseTime: '< 4 hours',
        available: true,
        community: true,
      },
      license: {
        type: 'subscription',
        duration: 'monthly',
        updates: true,
        sourceCode: false,
      },
      version: '1.8.2',
      lastUpdated: '2024-01-08',
      compatibility: {
        platforms: ['Web', 'Desktop'],
        apiVersion: 'v2.0',
      },
      isFeatured: true,
      isTrending: false,
      isNew: true,
      isOnSale: false,
      purchased: false,
      inWishlist: false,
    },
    {
      id: '3',
      name: 'Arbitrage Master',
      type: 'arbitrage',
      category: 'advanced',
      price: 499,
      currency: 'USD',
      rating: 4.9,
      reviews: 156,
      sales: 445,
      downloads: 2100,
      creator: {
        id: 'creator3',
        name: 'Arbitrage Pro',
        avatar: '/avatars/arbitrage.jpg',
        verified: true,
        level: 'platinum',
        botsCreated: 5,
        totalSales: 89000,
        joinDate: '2021-11-10',
      },
      description: 'Professional arbitrage trading bot that identifies and executes price differences across multiple exchanges. Features advanced risk management and high-frequency trading capabilities.',
      shortDescription: 'Multi-exchange arbitrage with high-frequency trading',
      features: [
        'Multi-Exchange Arbitrage',
        'High-Frequency Trading',
        'Advanced Risk Management',
        'Real-time Price Monitoring',
        'Automated Execution',
        'Latency Optimization',
        'Customizable Pairs',
        'Performance Analytics'
      ],
      performance: {
        avgReturn: 15.2,
        maxDrawdown: 3.2,
        winRate: 89.5,
        sharpeRatio: 3.2,
        profitFactor: 4.1,
        totalTrades: 2341,
        uptime: '99.99%',
      },
      requirements: {
        minCapital: 5000,
        exchanges: ['Binance', 'Coinbase', 'Kraken', 'FTX', 'Huobi', 'OKX'],
        timeframe: ['1s', '5s', '15s', '1m'],
        supportedPairs: ['BTC/USDT', 'ETH/USDT', 'LTC/USDT', 'BCH/USDT'],
      },
      tags: ['Arbitrage', 'HFT', 'Multi-Exchange', 'Professional', 'Low Risk'],
      screenshots: ['/screenshots/arbitrage1.jpg', '/screenshots/arbitrage2.jpg'],
      documentation: 'https://docs.arbitragepro.com',
      support: {
        responseTime: '< 1 hour',
        available: true,
        community: false,
      },
      license: {
        type: 'perpetual',
        updates: true,
        sourceCode: true,
      },
      version: '3.0.0',
      lastUpdated: '2024-01-12',
      compatibility: {
        platforms: ['Desktop', 'Server'],
        apiVersion: 'v2.0',
      },
      isFeatured: true,
      isTrending: true,
      isNew: false,
      isOnSale: false,
      purchased: false,
      inWishlist: false,
    },
  ]);

  const [reviews] = useState<Review[]>([
    {
      id: '1',
      botId: '1',
      userId: 'user1',
      userName: 'CryptoTrader123',
      userAvatar: '/avatars/user1.jpg',
      rating: 5,
      title: 'Excellent grid trading bot',
      content: 'This bot has significantly improved my trading results. The AI optimization works great and the support team is very responsive.',
      helpful: 23,
      createdAt: '2024-01-10',
      verified: true,
    },
    {
      id: '2',
      botId: '1',
      userId: 'user2',
      userName: 'TradingPro',
      userAvatar: '/avatars/user2.jpg',
      rating: 4,
      title: 'Good but expensive',
      content: 'Solid performance and features, but the price is quite high. Would recommend for serious traders only.',
      helpful: 15,
      createdAt: '2024-01-08',
      verified: true,
    },
  ]);

  const [topCreators] = useState<Creator[]>([
    {
      id: 'creator1',
      name: 'Quantum Trading Labs',
      avatar: '/avatars/quantum.jpg',
      verified: true,
      level: 'platinum',
      botsCreated: 12,
      totalSales: 45600,
      averageRating: 4.7,
      joinDate: '2022-01-15',
      description: 'Leading provider of AI-powered trading solutions with focus on grid and momentum strategies.',
      specialties: ['Grid Trading', 'AI', 'Machine Learning', 'Multi-Exchange'],
    },
    {
      id: 'creator2',
      name: 'Sentient AI',
      avatar: '/avatars/sentient.jpg',
      verified: true,
      level: 'gold',
      botsCreated: 8,
      totalSales: 23400,
      averageRating: 4.5,
      joinDate: '2022-06-20',
      description: 'Specializing in sentiment analysis and natural language processing for cryptocurrency trading.',
      specialties: ['Sentiment Analysis', 'NLP', 'News Analysis', 'Social Media'],
    },
  ]);

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || bot.type === categoryFilter;
    const matchesPrice = priceFilter === 'all' || 
                         (priceFilter === 'free' && bot.price === 0) ||
                         (priceFilter === 'paid' && bot.price > 0) ||
                         (priceFilter === 'premium' && bot.price >= 100);
    const matchesRating = ratingFilter === 'all' || bot.rating >= parseFloat(ratingFilter);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  const sortedBots = [...filteredBots].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.sales - a.sales;
      case 'rating':
        return b.rating - a.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      default:
        return 0;
    }
  });

  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case 'grid': return <Grid3X3 className="h-4 w-4" />;
      case 'dca': return <Repeat className="h-4 w-4" />;
      case 'arbitrage': return <ArrowLeftRight className="h-4 w-4" />;
      case 'momentum': return <TrendUpIcon className="h-4 w-4" />;
      case 'ml-based': return <Brain className="h-4 w-4" />;
      case 'sentiment': return <BarChart3 className="h-4 w-4" />;
      case 'scalping': return <Bolt className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-orange-600';
      case 'professional': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getCreatorLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'text-orange-600';
      case 'silver': return 'text-gray-400';
      case 'gold': return 'text-yellow-600';
      case 'platinum': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const handlePurchase = (bot: MarketplaceBot) => {
    setIsPurchasing(true);
    // Simulate purchase process
    setTimeout(() => {
      setBots(prev => prev.map(b => 
        b.id === bot.id ? { ...b, purchased: true } : b
      ));
      setIsPurchasing(false);
      setSelectedBot(null);
    }, 2000);
  };

  const handleToggleWishlist = (botId: string) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId ? { ...bot, inWishlist: !bot.inWishlist } : bot
    ));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bot Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and purchase professional trading bots from top creators
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Sell Your Bot
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="creators">Top Creators</TabsTrigger>
          <TabsTrigger value="my-bots">My Bots</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-4">
          {/* Featured Bots */}
          <div className="grid gap-6 lg:grid-cols-3">
            {bots.filter(bot => bot.isFeatured).slice(0, 3).map((bot) => (
              <Card key={bot.id} className="border-2 border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-yellow-600" />
                      <Badge variant="secondary">FEATURED</Badge>
                    </div>
                    {bot.isOnSale && (
                      <Badge variant="destructive">-{bot.discount}% OFF</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {getBotTypeIcon(bot.type)}
                    <div>
                      <h3 className="font-semibold">{bot.name}</h3>
                      <p className="text-sm text-muted-foreground">{bot.creator.name}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{bot.shortDescription}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{bot.rating}</span>
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-muted-foreground">({bot.reviews})</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sales</p>
                      <p className="font-semibold">{bot.sales.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {bot.isOnSale && bot.originalPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">${bot.price}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${bot.originalPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">${bot.price}</span>
                      )}
                      <p className="text-xs text-muted-foreground">{bot.license.type}</p>
                    </div>
                    <Button onClick={() => setSelectedBot(bot)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search bots..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="grid">Grid Trading</SelectItem>
                    <SelectItem value="dca">DCA Bots</SelectItem>
                    <SelectItem value="arbitrage">Arbitrage</SelectItem>
                    <SelectItem value="momentum">Momentum</SelectItem>
                    <SelectItem value="ml-based">Machine Learning</SelectItem>
                    <SelectItem value="sentiment">Sentiment</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="premium">Premium ($100+)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Bot Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedBots.map((bot) => (
              <Card key={bot.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getBotTypeIcon(bot.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{bot.name}</h3>
                          {bot.isNew && <Badge variant="secondary">NEW</Badge>}
                          {bot.isTrending && <Badge variant="default">TRENDING</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{bot.creator.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleWishlist(bot.id)}
                      >
                        <Heart className={`h-4 w-4 ${bot.inWishlist ? 'fill-current text-red-500' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{bot.shortDescription}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {bot.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{bot.rating}</span>
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-muted-foreground">({bot.reviews})</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sales</p>
                      <p className="font-semibold">{bot.sales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Return</p>
                      <p className="font-semibold text-green-600">{bot.performance.avgReturn}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{bot.performance.winRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {bot.isOnSale && bot.originalPrice ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">${bot.price}</span>
                          <span className="text-sm text-muted-foreground line-through">
                            ${bot.originalPrice}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold">${bot.price}</span>
                      )}
                      <p className="text-xs text-muted-foreground">{bot.license.type}</p>
                    </div>
                    <Button onClick={() => setSelectedBot(bot)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <category.icon className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.botCount} bots</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  <Button className="w-full">
                    Browse {category.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creators" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {topCreators.map((creator) => (
              <Card key={creator.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{creator.name}</h3>
                        {creator.verified && <Badge variant="secondary">✓</Badge>}
                        <Badge variant={creator.level === 'platinum' ? 'default' : 'secondary'}>
                          {creator.level.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Member since {new Date(creator.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{creator.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Bots Created</p>
                      <p className="font-semibold">{creator.botsCreated}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Sales</p>
                      <p className="font-semibold">${creator.totalSales.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{creator.averageRating}</span>
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {creator.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-bots" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Purchased Bots Yet</h3>
              <p className="text-muted-foreground mb-4">
                Browse the marketplace to find and purchase trading bots
              </p>
              <Button onClick={() => setActiveTab('marketplace')}>
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bot Details Modal */}
      {selectedBot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    {getBotTypeIcon(selectedBot.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">{selectedBot.name}</h2>
                        {selectedBot.isFeatured && <Badge variant="secondary">FEATURED</Badge>}
                        {selectedBot.isNew && <Badge variant="secondary">NEW</Badge>}
                        {selectedBot.isTrending && <Badge variant="default">TRENDING</Badge>}
                      </div>
                      <p className="text-muted-foreground">by {selectedBot.creator.name}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => setSelectedBot(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedBot.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <div className="grid gap-2">
                      {selectedBot.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-muted-foreground">Average Return</p>
                        <p className="text-lg font-semibold text-green-600">{selectedBot.performance.avgReturn}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-semibold">{selectedBot.performance.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Drawdown</p>
                        <p className="text-lg font-semibold text-red-600">{selectedBot.performance.maxDrawdown}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sharpe Ratio</p>
                        <p className="text-lg font-semibold">{selectedBot.performance.sharpeRatio}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Min Capital</p>
                        <p className="font-medium">${selectedBot.requirements.minCapital.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Supported Exchanges</p>
                        <p className="font-medium">{selectedBot.requirements.exchanges.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Timeframes</p>
                        <p className="font-medium">{selectedBot.requirements.timeframe.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Supported Pairs</p>
                        <p className="font-medium">{selectedBot.requirements.supportedPairs.join(', ')}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Reviews</h3>
                    <div className="space-y-3">
                      {reviews.filter(r => r.botId === selectedBot.id).map((review) => (
                        <div key={review.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={review.userAvatar} />
                                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{review.userName}</span>
                              {review.verified && <Badge variant="secondary" className="text-xs">✓</Badge>}
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <h4 className="font-medium text-sm">{review.title}</h4>
                          <p className="text-sm text-muted-foreground">{review.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {review.helpful}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    {selectedBot.isOnSale && selectedBot.originalPrice ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-bold">${selectedBot.price}</span>
                          <span className="text-lg text-muted-foreground line-through">
                            ${selectedBot.originalPrice}
                          </span>
                          <Badge variant="destructive">Save {selectedBot.discount}%</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{selectedBot.license.type}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-3xl font-bold">${selectedBot.price}</span>
                        <p className="text-sm text-muted-foreground">{selectedBot.license.type}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full" 
                      onClick={() => handlePurchase(selectedBot)}
                      disabled={selectedBot.purchased || isPurchasing}
                    >
                      {selectedBot.purchased ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Purchased
                        </>
                      ) : isPurchasing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Purchase Now
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleToggleWishlist(selectedBot.id)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${selectedBot.inWishlist ? 'fill-current text-red-500' : ''}`} />
                      {selectedBot.inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Creator Info</h3>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedBot.creator.avatar} />
                        <AvatarFallback>{selectedBot.creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{selectedBot.creator.name}</span>
                          {selectedBot.creator.verified && <Badge variant="secondary">✓</Badge>}
                          <Badge variant={selectedBot.creator.level === 'platinum' ? 'default' : 'secondary'}>
                            {selectedBot.creator.level.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedBot.creator.botsCreated} bots • ${selectedBot.creator.totalSales.toLocaleString()} sales
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">License Details</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{selectedBot.license.type}</span>
                      </div>
                      {selectedBot.license.duration && (
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">{selectedBot.license.duration}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Updates:</span>
                        <span className="font-medium">{selectedBot.license.updates ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Source Code:</span>
                        <span className="font-medium">{selectedBot.license.sourceCode ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Support</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Response Time:</span>
                        <span className="font-medium">{selectedBot.support.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available:</span>
                        <span className="font-medium">{selectedBot.support.available ? 'Yes' : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Community:</span>
                        <span className="font-medium">{selectedBot.support.community ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}