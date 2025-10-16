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
  Bot, 
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
  Share2,
  Users,
  Brain,
  Activity,
  Layers,
  Grid3X3,
  Repeat,
  ArrowLeftRight,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  ShoppingCart,
  Eye,
  MessageSquare,
  Globe,
  Newspaper
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';

interface TradingBot {
  id: string;
  name: string;
  type: 'grid' | 'dca' | 'arbitrage' | 'momentum' | 'mean-reversion' | 'ml-based' | 'sentiment';
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
    maxPositions: number;
    stopLoss: number;
    takeProfit: number;
  };
  stats: {
    uptime: string;
    lastTrade: string;
    nextExecution: string;
    cpuUsage: number;
    memoryUsage: number;
  };
  strategy: {
    indicators: string[];
    conditions: Array<{
      type: string;
      parameter: string;
      operator: string;
      value: string;
    }>;
    actions: Array<{
      type: 'buy' | 'sell' | 'hold';
      conditions: string[];
    }>;
  };
  backtestResults?: {
    startDate: string;
    endDate: string;
    initialCapital: number;
    finalCapital: number;
    totalReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    trades: number;
    winRate: number;
  };
}

interface StrategyTemplate {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  tags: string[];
  popularity: number;
  rating: number;
  downloads: number;
  creator: string;
  preview: string;
}

interface BotMarketplaceItem {
  id: string;
  name: string;
  type: 'grid' | 'dca' | 'arbitrage' | 'momentum' | 'ml-based';
  price: number;
  rating: number;
  reviews: number;
  sales: number;
  creator: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  description: string;
  features: string[];
  performance: {
    avgReturn: number;
    maxDrawdown: number;
    winRate: number;
  };
  tags: string[];
}

export default function TradingBotsPage() {
  const [activeTab, setActiveTab] = useState('my-bots');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedBot, setSelectedBot] = useState<TradingBot | null>(null);
  const [isCreatingBot, setIsCreatingBot] = useState(false);
  const [isBacktesting, setIsBacktesting] = useState(false);

  // Mock data for demonstration
  const [myBots, setMyBots] = useState<TradingBot[]>([
    {
      id: '1',
      name: 'BTC Grid Master',
      type: 'grid',
      status: 'running',
      description: 'Advanced grid trading bot for Bitcoin with dynamic grid spacing',
      creator: {
        name: 'You',
        avatar: '/avatars/user.jpg',
        verified: true,
      },
      performance: {
        totalProfit: 2340,
        profitPercent: 23.4,
        winRate: 68.5,
        totalTrades: 156,
        sharpeRatio: 1.8,
        maxDrawdown: 8.2,
        avgTradeDuration: '2.3 hours',
      },
      config: {
        symbol: 'BTC/USDT',
        timeframe: '5m',
        riskLevel: 'medium',
        investment: 10000,
        maxPositions: 10,
        stopLoss: 5,
        takeProfit: 3,
      },
      stats: {
        uptime: '7 days 12 hours',
        lastTrade: '5 minutes ago',
        nextExecution: '2 minutes',
        cpuUsage: 12,
        memoryUsage: 45,
      },
      strategy: {
        indicators: ['RSI', 'BB', 'MACD'],
        conditions: [
          { type: 'indicator', parameter: 'RSI', operator: '<', value: '30' },
          { type: 'price', parameter: 'close', operator: '>', value: 'lower_band' },
        ],
        actions: [
          { type: 'buy', conditions: ['rsi_oversold', 'price_at_support'] },
          { type: 'sell', conditions: ['rsi_overbought', 'price_at_resistance'] },
        ],
      },
    },
    {
      id: '2',
      name: 'ETH DCA Accumulator',
      type: 'dca',
      status: 'paused',
      description: 'Dollar-cost averaging bot for Ethereum with market sentiment integration',
      creator: {
        name: 'You',
        avatar: '/avatars/user.jpg',
        verified: true,
      },
      performance: {
        totalProfit: 1890,
        profitPercent: 18.9,
        winRate: 72.3,
        totalTrades: 89,
        sharpeRatio: 2.1,
        maxDrawdown: 5.8,
        avgTradeDuration: '1.2 days',
      },
      config: {
        symbol: 'ETH/USDT',
        timeframe: '1h',
        riskLevel: 'low',
        investment: 5000,
        maxPositions: 5,
        stopLoss: 8,
        takeProfit: 15,
      },
      stats: {
        uptime: '14 days 3 hours',
        lastTrade: '2 hours ago',
        nextExecution: '6 hours',
        cpuUsage: 8,
        memoryUsage: 32,
      },
      strategy: {
        indicators: ['SMA', 'Sentiment'],
        conditions: [
          { type: 'time', parameter: 'interval', operator: '=', value: '24h' },
          { type: 'sentiment', parameter: 'score', operator: '<', value: '-0.5' },
        ],
        actions: [
          { type: 'buy', conditions: ['time_interval', 'negative_sentiment'] },
          { type: 'hold', conditions: ['neutral_sentiment'] },
        ],
      },
    },
  ]);

  const [strategyTemplates, setStrategyTemplates] = useState<StrategyTemplate[]>([
    {
      id: '1',
      name: 'RSI Divergence Hunter',
      category: 'Momentum',
      difficulty: 'intermediate',
      description: 'Identifies RSI divergences for trend reversal signals',
      tags: ['RSI', 'Divergence', 'Momentum'],
      popularity: 85,
      rating: 4.5,
      downloads: 1234,
      creator: 'CryptoSignals',
      preview: 'Uses RSI divergence detection combined with volume confirmation...',
    },
    {
      id: '2',
      name: 'Bollinger Bands Squeeze',
      category: 'Volatility',
      difficulty: 'beginner',
      description: 'Trades Bollinger Bands squeeze patterns for breakout opportunities',
      tags: ['Bollinger Bands', 'Volatility', 'Breakout'],
      popularity: 92,
      rating: 4.7,
      downloads: 2156,
      creator: 'BotMaster',
      preview: 'Detects low volatility periods and anticipates breakout moves...',
    },
    {
      id: '3',
      name: 'ML Price Prediction',
      category: 'Machine Learning',
      difficulty: 'advanced',
      description: 'LSTM-based price prediction with sentiment analysis',
      tags: ['LSTM', 'Machine Learning', 'Sentiment'],
      popularity: 78,
      rating: 4.2,
      downloads: 567,
      creator: 'AICryptoLabs',
      preview: 'Advanced neural network for price prediction with multi-factor analysis...',
    },
  ]);

  const [marketplaceBots, setMarketplaceBots] = useState<BotMarketplaceItem[]>([
    {
      id: '1',
      name: 'Quantum Grid Pro',
      type: 'grid',
      price: 99,
      rating: 4.8,
      reviews: 234,
      sales: 1523,
      creator: {
        name: 'Quantum Trading',
        avatar: '/avatars/quantum.jpg',
        verified: true,
      },
      description: 'Professional grid trading bot with AI optimization',
      features: ['AI Grid Optimization', 'Dynamic Spacing', 'Risk Management', 'Multi-Exchange'],
      performance: {
        avgReturn: 25.4,
        maxDrawdown: 8.2,
        winRate: 71.2,
      },
      tags: ['Grid', 'AI', 'Professional'],
    },
    {
      id: '2',
      name: 'Sentiment Trader X',
      type: 'ml-based',
      price: 149,
      rating: 4.6,
      reviews: 189,
      sales: 892,
      creator: {
        name: 'Sentiment AI',
        avatar: '/avatars/sentiment.jpg',
        verified: true,
      },
      description: 'Advanced sentiment analysis trading bot with ML integration',
      features: ['Sentiment Analysis', 'ML Predictions', 'News Integration', 'Social Media'],
      performance: {
        avgReturn: 32.1,
        maxDrawdown: 12.5,
        winRate: 68.9,
      },
      tags: ['Sentiment', 'ML', 'AI'],
    },
  ]);

  const filteredBots = myBots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = strategyTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMarketplace = marketplaceBots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBotAction = (botId: string, action: 'start' | 'pause' | 'stop') => {
    setMyBots(prev => prev.map(bot => {
      if (bot.id === botId) {
        let newStatus: TradingBot['status'] = bot.status;
        if (action === 'start') newStatus = 'running';
        else if (action === 'pause') newStatus = 'paused';
        else if (action === 'stop') newStatus = 'stopped';
        return { ...bot, status: newStatus };
      }
      return bot;
    }));
  };

  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case 'grid': return <Grid3X3 className="h-4 w-4" />;
      case 'dca': return <Repeat className="h-4 w-4" />;
      case 'arbitrage': return <ArrowLeftRight className="h-4 w-4" />;
      case 'ml-based': return <Brain className="h-4 w-4" />;
      case 'sentiment': return <BarChart3 className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'stopped': return 'text-red-600';
      case 'backtesting': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-yellow-600';
      case 'advanced': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trading Bots</h1>
          <p className="text-muted-foreground">
            Automated trading strategies and bot management
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bots, strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="dca">DCA</SelectItem>
              <SelectItem value="arbitrage">Arbitrage</SelectItem>
              <SelectItem value="ml-based">ML</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreatingBot(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Bot
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="my-bots" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            My Bots
          </TabsTrigger>
          <TabsTrigger value="strategy-builder" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Strategy Builder
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Marketplace
          </TabsTrigger>
          <TabsTrigger value="backtesting" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            Backtesting
          </TabsTrigger>
          <TabsTrigger value="ml-integration" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            ML Integration
          </TabsTrigger>
          <TabsTrigger value="sentiment-strategies" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Sentiment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-bots" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBots.map((bot) => (
              <Card key={bot.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getBotTypeIcon(bot.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{bot.name}</h3>
                          <Badge variant={bot.status === 'running' ? 'default' : bot.status === 'paused' ? 'secondary' : 'destructive'}>
                            {bot.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{bot.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBotAction(bot.id, bot.status === 'running' ? 'pause' : 'start')}
                      >
                        {bot.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBotAction(bot.id, 'stop')}
                      >
                        <Square className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{bot.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Profit</p>
                      <p className={`font-semibold ${bot.performance.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${bot.performance.totalProfit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{bot.performance.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trades</p>
                      <p className="font-semibold">{bot.performance.totalTrades}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sharpe Ratio</p>
                      <p className="font-semibold">{bot.performance.sharpeRatio}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>CPU: {bot.stats.cpuUsage}%</span>
                      <span>Memory: {bot.stats.memoryUsage}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Progress value={bot.stats.cpuUsage} className="h-2" />
                      <Progress value={bot.stats.memoryUsage} className="h-2" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="strategy-builder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visual Strategy Builder</CardTitle>
              <CardDescription>
                Create custom trading strategies with our drag-and-drop interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Strategy Components */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Indicators</h3>
                  <div className="space-y-2">
                    {['RSI', 'MACD', 'Bollinger Bands', 'Moving Average', 'Stochastic', 'Williams %R'].map((indicator) => (
                      <div key={indicator} className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <LineChartIcon className="h-4 w-4" />
                          <span className="text-sm">{indicator}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategy Canvas */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Strategy Canvas</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[400px] bg-gray-50">
                    <div className="text-center text-gray-500">
                      <Layers className="h-12 w-12 mx-auto mb-4" />
                      <p>Drag components here to build your strategy</p>
                      <p className="text-sm mt-2">Connect indicators to create trading logic</p>
                    </div>
                  </div>
                </div>

                {/* Strategy Logic */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Logic Builder</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">IF</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">RSI &lt; 30</div>
                        <div className="text-sm">AND</div>
                        <div className="text-sm">Price &gt; Lower Band</div>
                      </div>
                    </div>
                    <div className="p-3 border rounded bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">THEN</span>
                      </div>
                      <div className="text-sm">BUY 0.1 BTC</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>Backtest Strategy</Button>
                <Button variant="outline">Save Strategy</Button>
                <Button variant="outline">Export Code</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </div>
                    <Badge variant={template.difficulty === 'beginner' ? 'default' : template.difficulty === 'intermediate' ? 'secondary' : 'destructive'}>
                      {template.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{template.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Downloads</p>
                      <p className="font-semibold">{template.downloads.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-1" />
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMarketplace.map((bot) => (
              <Card key={bot.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={bot.creator.avatar} />
                        <AvatarFallback>{bot.creator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{bot.name}</h3>
                          {bot.creator.verified && <Badge variant="secondary">✓</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{bot.creator.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${bot.price}</p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">{bot.rating}</span>
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-muted-foreground">({bot.reviews})</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{bot.description}</p>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {bot.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Avg Return</p>
                      <p className="font-semibold text-green-600">{bot.performance.avgReturn}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max DD</p>
                      <p className="font-semibold text-red-600">{bot.performance.maxDrawdown}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{bot.performance.winRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{bot.sales} sales</p>
                    <Button>Purchase</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="backtesting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backtesting Engine</CardTitle>
              <CardDescription>
                Test your strategies against historical data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Backtest Configuration */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="symbol">Symbol</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select symbol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                          <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                          <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1m">1 Minute</SelectItem>
                          <SelectItem value="5m">5 Minutes</SelectItem>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="1d">1 Day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label htmlFor="initialCapital">Initial Capital ($)</Label>
                      <Input type="number" placeholder="10000" />
                    </div>
                  </div>
                </div>

                {/* Backtest Results */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Results</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Return</p>
                        <p className="text-lg font-semibold text-green-600">+45.2%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sharpe Ratio</p>
                        <p className="text-lg font-semibold">2.34</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Drawdown</p>
                        <p className="text-lg font-semibold text-red-600">-12.8%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-semibold">68.5%</p>
                      </div>
                    </div>
                    
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { date: 'Jan', value: 10000 },
                          { date: 'Feb', value: 10500 },
                          { date: 'Mar', value: 11200 },
                          { date: 'Apr', value: 10800 },
                          { date: 'May', value: 12500 },
                          { date: 'Jun', value: 14520 },
                        ]}>
                          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                          <Tooltip />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Trade Analysis */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Trade Analysis</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Total Trades:</span>
                        <span className="font-semibold">234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Winning Trades:</span>
                        <span className="font-semibold text-green-600">160</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Losing Trades:</span>
                        <span className="font-semibold text-red-600">74</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Win:</span>
                        <span className="font-semibold">$234</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Loss:</span>
                        <span className="font-semibold">-$156</span>
                      </div>
                    </div>
                    
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Wins', value: 160, color: '#10b981' },
                              { name: 'Losses', value: 74, color: '#ef4444' },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={50}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setIsBacktesting(true)}>
                  {isBacktesting ? 'Running Backtest...' : 'Run Backtest'}
                </Button>
                <Button variant="outline">Save Results</Button>
                <Button variant="outline">Export Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ml-integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Machine Learning Integration</CardTitle>
              <CardDescription>
                Advanced AI models for trading predictions and strategy optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Brain className="h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">ML Model Management</h3>
                            <p className="text-sm text-muted-foreground">Train, deploy, and monitor AI models</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage your machine learning models with comprehensive training and deployment tools.
                      </p>
                      <Button className="w-full">
                        <Brain className="h-4 w-4 mr-2" />
                        Manage Models
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Prediction Engine</h3>
                            <p className="text-sm text-muted-foreground">Real-time trading predictions</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get real-time trading signals and predictions from your trained ML models.
                      </p>
                      <Button className="w-full">
                        <Target className="h-4 w-4 mr-2" />
                        View Predictions
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Activity className="h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Model Monitoring</h3>
                            <p className="text-sm text-muted-foreground">Performance tracking</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Monitor model performance, accuracy, and system health in real-time.
                      </p>
                      <Button className="w-full">
                        <Activity className="h-4 w-4 mr-2" />
                        Monitor Models
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">3</div>
                        <div className="text-sm text-muted-foreground">Active Models</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">87.3%</div>
                        <div className="text-sm text-muted-foreground">Avg Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">156</div>
                        <div className="text-sm text-muted-foreground">Predictions Today</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">2.34</div>
                        <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment-strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sentiment-Based Strategies</CardTitle>
              <CardDescription>
                Trading strategies powered by market sentiment and social media analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MessageSquare className="h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Strategy Management</h3>
                            <p className="text-sm text-muted-foreground">Create and manage sentiment strategies</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Build and deploy trading strategies based on market sentiment analysis.
                      </p>
                      <Button className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Manage Strategies
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">Data Sources</h3>
                            <p className="text-sm text-muted-foreground">Configure sentiment data sources</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Manage and configure various sources for sentiment data collection.
                      </p>
                      <Button className="w-full">
                        <Globe className="h-4 w-4 mr-2" />
                        Configure Sources
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Newspaper className="h-4 w-4" />
                          <div>
                            <h3 className="font-semibold">News & Alerts</h3>
                            <p className="text-sm text-muted-foreground">Real-time news sentiment tracking</p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Monitor breaking news and sentiment alerts for trading opportunities.
                      </p>
                      <Button className="w-full">
                        <Newspaper className="h-4 w-4 mr-2" />
                        View News Feed
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Sentiment Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}