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
  Cpu,
  Database,
  Settings,
  Play,
  Pause,
  Square,
  RefreshCw,
  ArrowRightLeft,
  Coins,
  Timer,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
  Minus,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  AlertCircle,
  Info,
  DollarSign as DollarIcon,
  Grid,
  Maximize,
  Minimize,
  Move,
  Plus as PlusIcon,
  Minus as MinusIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter, BarChart, Bar } from 'recharts';

interface GridLevel {
  id: string;
  price: number;
  type: 'buy' | 'sell';
  status: 'active' | 'filled' | 'pending' | 'cancelled';
  quantity: number;
  filledQuantity: number;
  timestamp: string;
  profit?: number;
  loss?: number;
}

interface GridBot {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  symbol: string;
  description: string;
  config: {
    upperPrice: number;
    lowerPrice: number;
    gridLevels: number;
    totalInvestment: number;
    investmentPerGrid: number;
    gridSpacing: number;
    spacingType: 'fixed' | 'percentage';
    takeProfit: number;
    stopLoss: number;
    rebalance: boolean;
    dynamicGrid: boolean;
  };
  performance: {
    totalProfit: number;
    profitPercent: number;
    totalTrades: number;
    winRate: number;
    avgTradeDuration: string;
    maxDrawdown: number;
    sharpeRatio: number;
    currentPrice: number;
    gridEfficiency: number;
  };
  stats: {
    uptime: string;
    lastTrade: string;
    activeGrids: number;
    filledGrids: number;
    totalGrids: number;
    buyOrders: number;
    sellOrders: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  gridLevels: GridLevel[];
  currentMarketData: {
    price: number;
    change24h: number;
    volume24h: number;
    high24h: number;
    low24h: number;
  };
}

interface GridTemplate {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  config: {
    upperPrice: number;
    lowerPrice: number;
    gridLevels: number;
    spacingType: 'fixed' | 'percentage';
    takeProfit: number;
    stopLoss: number;
  };
  tags: string[];
  popularity: number;
  rating: number;
  downloads: number;
  creator: string;
}

export default function GridVisualizerPage() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBot, setSelectedBot] = useState<GridBot | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(43250.00);

  // Mock data for demonstration
  const [gridBots, setGridBots] = useState<GridBot[]>([
    {
      id: '1',
      name: 'BTC Grid Master Pro',
      status: 'running',
      symbol: 'BTC/USDT',
      description: 'Advanced grid trading bot for Bitcoin with dynamic grid spacing',
      config: {
        upperPrice: 45000,
        lowerPrice: 40000,
        gridLevels: 20,
        totalInvestment: 10000,
        investmentPerGrid: 500,
        gridSpacing: 250,
        spacingType: 'fixed',
        takeProfit: 2.5,
        stopLoss: 5.0,
        rebalance: true,
        dynamicGrid: true
      },
      performance: {
        totalProfit: 2340,
        profitPercent: 23.4,
        totalTrades: 156,
        winRate: 68.5,
        avgTradeDuration: '2.3 hours',
        maxDrawdown: 8.2,
        sharpeRatio: 1.8,
        currentPrice: 43250,
        gridEfficiency: 87.3
      },
      stats: {
        uptime: '7 days 12 hours',
        lastTrade: '5 minutes ago',
        activeGrids: 12,
        filledGrids: 44,
        totalGrids: 20,
        buyOrders: 78,
        sellOrders: 78,
        cpuUsage: 12,
        memoryUsage: 45
      },
      gridLevels: [
        { id: '1', price: 40000, type: 'buy', status: 'filled', quantity: 0.0125, filledQuantity: 0.0125, timestamp: '2 days ago' },
        { id: '2', price: 40250, type: 'buy', status: 'filled', quantity: 0.0124, filledQuantity: 0.0124, timestamp: '1 day ago' },
        { id: '3', price: 40500, type: 'buy', status: 'filled', quantity: 0.0123, filledQuantity: 0.0123, timestamp: '18 hours ago' },
        { id: '4', price: 40750, type: 'buy', status: 'filled', quantity: 0.0123, filledQuantity: 0.0123, timestamp: '12 hours ago' },
        { id: '5', price: 41000, type: 'buy', status: 'filled', quantity: 0.0122, filledQuantity: 0.0122, timestamp: '8 hours ago' },
        { id: '6', price: 41250, type: 'buy', status: 'filled', quantity: 0.0121, filledQuantity: 0.0121, timestamp: '6 hours ago' },
        { id: '7', price: 41500, type: 'buy', status: 'filled', quantity: 0.0120, filledQuantity: 0.0120, timestamp: '4 hours ago' },
        { id: '8', price: 41750, type: 'buy', status: 'filled', quantity: 0.0120, filledQuantity: 0.0120, timestamp: '3 hours ago' },
        { id: '9', price: 42000, type: 'buy', status: 'filled', quantity: 0.0119, filledQuantity: 0.0119, timestamp: '2 hours ago' },
        { id: '10', price: 42250, type: 'buy', status: 'filled', quantity: 0.0118, filledQuantity: 0.0118, timestamp: '1 hour ago' },
        { id: '11', price: 42500, type: 'buy', status: 'active', quantity: 0.0118, filledQuantity: 0, timestamp: '' },
        { id: '12', price: 42750, type: 'buy', status: 'active', quantity: 0.0117, filledQuantity: 0, timestamp: '' },
        { id: '13', price: 43000, type: 'buy', status: 'active', quantity: 0.0116, filledQuantity: 0, timestamp: '' },
        { id: '14', price: 43250, type: 'buy', status: 'active', quantity: 0.0116, filledQuantity: 0, timestamp: '' },
        { id: '15', price: 43500, type: 'sell', status: 'active', quantity: 0.0115, filledQuantity: 0, timestamp: '' },
        { id: '16', price: 43750, type: 'sell', status: 'active', quantity: 0.0114, filledQuantity: 0, timestamp: '' },
        { id: '17', price: 44000, type: 'sell', status: 'active', quantity: 0.0114, filledQuantity: 0, timestamp: '' },
        { id: '18', price: 44250, type: 'sell', status: 'active', quantity: 0.0113, filledQuantity: 0, timestamp: '' },
        { id: '19', price: 44500, type: 'sell', status: 'active', quantity: 0.0112, filledQuantity: 0, timestamp: '' },
        { id: '20', price: 44750, type: 'sell', status: 'active', quantity: 0.0112, filledQuantity: 0, timestamp: '' }
      ],
      currentMarketData: {
        price: 43250,
        change24h: 2.3,
        volume24h: 2850000000,
        high24h: 44200,
        low24h: 42100
      }
    },
    {
      id: '2',
      name: 'ETH Grid Trader',
      status: 'paused',
      symbol: 'ETH/USDT',
      description: 'Ethereum grid trading with percentage-based spacing',
      config: {
        upperPrice: 2500,
        lowerPrice: 2000,
        gridLevels: 15,
        totalInvestment: 5000,
        investmentPerGrid: 333.33,
        gridSpacing: 2.5,
        spacingType: 'percentage',
        takeProfit: 3.0,
        stopLoss: 6.0,
        rebalance: false,
        dynamicGrid: false
      },
      performance: {
        totalProfit: 890,
        profitPercent: 17.8,
        totalTrades: 89,
        winRate: 72.3,
        avgTradeDuration: '3.1 hours',
        maxDrawdown: 5.8,
        sharpeRatio: 2.1,
        currentPrice: 2240,
        gridEfficiency: 82.1
      },
      stats: {
        uptime: '5 days 3 hours',
        lastTrade: '2 hours ago',
        activeGrids: 8,
        filledGrids: 27,
        totalGrids: 15,
        buyOrders: 45,
        sellOrders: 44,
        cpuUsage: 8,
        memoryUsage: 32
      },
      gridLevels: [],
      currentMarketData: {
        price: 2240,
        change24h: 3.1,
        volume24h: 1850000000,
        high24h: 2310,
        low24h: 2150
      }
    }
  ]);

  const [gridTemplates, setGridTemplates] = useState<GridTemplate[]>([
    {
      id: '1',
      name: 'Conservative BTC Grid',
      category: 'Conservative',
      difficulty: 'beginner',
      description: 'Low-risk grid trading for Bitcoin with wide spacing',
      config: {
        upperPrice: 50000,
        lowerPrice: 35000,
        gridLevels: 15,
        spacingType: 'fixed',
        takeProfit: 2.0,
        stopLoss: 8.0
      },
      tags: ['BTC', 'Low Risk', 'Conservative'],
      popularity: 85,
      rating: 4.5,
      downloads: 1234,
      creator: 'GridMaster'
    },
    {
      id: '2',
      name: 'Aggressive ETH Grid',
      category: 'Aggressive',
      difficulty: 'advanced',
      description: 'High-frequency grid trading for Ethereum with tight spacing',
      config: {
        upperPrice: 3000,
        lowerPrice: 1500,
        gridLevels: 30,
        spacingType: 'percentage',
        takeProfit: 1.5,
        stopLoss: 3.0
      },
      tags: ['ETH', 'High Frequency', 'Aggressive'],
      popularity: 72,
      rating: 4.2,
      downloads: 856,
      creator: 'CryptoGrids'
    },
    {
      id: '3',
      name: 'Dynamic Altcoin Grid',
      category: 'Dynamic',
      difficulty: 'intermediate',
      description: 'Adaptive grid trading for altcoins with market-based spacing',
      config: {
        upperPrice: 100,
        lowerPrice: 50,
        gridLevels: 20,
        spacingType: 'percentage',
        takeProfit: 2.5,
        stopLoss: 5.0
      },
      tags: ['Altcoins', 'Dynamic', 'Adaptive'],
      popularity: 68,
      rating: 4.0,
      downloads: 645,
      creator: 'AdaptiveTrader'
    }
  ]);

  const filteredBots = gridBots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = gridTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'stopped': return 'text-red-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return 'default';
      case 'paused': return 'secondary';
      case 'stopped': return 'destructive';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getGridLevelColor = (status: string, type: string) => {
    if (status === 'filled') return type === 'buy' ? 'bg-green-500' : 'bg-red-500';
    if (status === 'active') return type === 'buy' ? 'bg-blue-500' : 'bg-orange-500';
    return 'bg-gray-300';
  };

  const handlePriceUpdate = (newPrice: number) => {
    setCurrentPrice(newPrice);
  };

  const renderGridVisualization = (bot: GridBot) => {
    const gridHeight = 400;
    const priceRange = bot.config.upperPrice - bot.config.lowerPrice;
    const currentPricePosition = ((bot.currentMarketData.price - bot.config.lowerPrice) / priceRange) * gridHeight;

    return (
      <div className="relative w-full h-[400px] border rounded-lg overflow-hidden bg-gray-50">
        {/* Price levels */}
        {bot.gridLevels.map((level, index) => {
          const position = gridHeight - ((level.price - bot.config.lowerPrice) / priceRange) * gridHeight;
          return (
            <div
              key={level.id}
              className={`absolute left-0 right-0 h-0.5 ${getGridLevelColor(level.status, level.type)}`}
              style={{ top: `${position}px` }}
            >
              <div className="absolute left-2 top-0 transform -translate-y-1/2 text-xs font-medium">
                ${level.price.toLocaleString()}
              </div>
              <div className="absolute right-2 top-0 transform -translate-y-1/2">
                <Badge variant={level.status === 'filled' ? 'default' : 'outline'} className="text-xs">
                  {level.type.toUpperCase()}
                </Badge>
              </div>
            </div>
          );
        })}

        {/* Current price line */}
        <div
          className="absolute left-0 right-0 h-0.5 bg-purple-600 z-10"
          style={{ top: `${currentPricePosition}px` }}
        >
          <div className="absolute left-2 top-0 transform -translate-y-1/2 text-xs font-bold text-purple-600">
            Current: ${bot.currentMarketData.price.toLocaleString()}
          </div>
        </div>

        {/* Price labels */}
        <div className="absolute left-2 top-2 text-xs font-bold">
          ${bot.config.upperPrice.toLocaleString()}
        </div>
        <div className="absolute left-2 bottom-2 text-xs font-bold">
          ${bot.config.lowerPrice.toLocaleString()}
        </div>

        {/* Grid info overlay */}
        <div className="absolute top-2 right-2 bg-white/90 p-2 rounded text-xs">
          <div>Total Grids: {bot.config.gridLevels}</div>
          <div>Active: {bot.stats.activeGrids}</div>
          <div>Filled: {bot.stats.filledGrids}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Grid Trading Visualizer</h1>
          <p className="text-muted-foreground">
            Visual grid trading interface with real-time price monitoring and order management
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Grid Bot
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visualizer" className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Visualizer
          </TabsTrigger>
          <TabsTrigger value="bots" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            My Bots
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualizer" className="space-y-4">
          {selectedBot ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedBot.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedBot.symbol}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadge(selectedBot.status)}>
                        {selectedBot.status.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBot(null)}>
                        Back to List
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Grid Visualization */}
                  <div>
                    <h4 className="font-semibold mb-2">Grid Visualization</h4>
                    {renderGridVisualization(selectedBot)}
                  </div>

                  {/* Market Data */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">${selectedBot.currentMarketData.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Current Price</div>
                          <div className={`text-xs ${selectedBot.currentMarketData.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedBot.currentMarketData.change24h >= 0 ? '+' : ''}{selectedBot.currentMarketData.change24h}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">${selectedBot.currentMarketData.high24h.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">24h High</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">${selectedBot.currentMarketData.low24h.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">24h Low</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">${(selectedBot.currentMarketData.volume24h / 1000000).toFixed(1)}M</div>
                          <div className="text-sm text-muted-foreground">24h Volume</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">${selectedBot.performance.totalProfit.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Total Profit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedBot.performance.winRate.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedBot.stats.activeGrids}</div>
                      <div className="text-sm text-muted-foreground">Active Grids</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedBot.performance.gridEfficiency.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Grid Efficiency</div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex gap-2">
                    <Button variant={selectedBot.status === 'running' ? 'destructive' : 'default'}>
                      {selectedBot.status === 'running' ? 'Stop Bot' : 'Start Bot'}
                    </Button>
                    <Button variant="outline">Edit Grid</Button>
                    <Button variant="outline">Rebalance</Button>
                    <Button variant="outline">Export Data</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBots.map((bot) => (
                <Card key={bot.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{bot.name}</h3>
                          <Badge variant={getStatusBadge(bot.status)}>
                            {bot.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{bot.symbol}</p>
                      </div>
                      <Grid3X3 className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{bot.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Profit</p>
                        <p className="font-semibold text-green-600">${bot.performance.totalProfit.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Win Rate</p>
                        <p className="font-semibold">{bot.performance.winRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Grid Levels</p>
                        <p className="font-semibold">{bot.config.gridLevels}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Grids</p>
                        <p className="font-semibold">{bot.stats.activeGrids}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price Range</span>
                        <span>${bot.config.lowerPrice.toLocaleString()} - ${bot.config.upperPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Grid Spacing</span>
                        <span>{bot.config.spacingType === 'fixed' ? '$' : ''}{bot.config.gridSpacing}{bot.config.spacingType === 'percentage' ? '%' : ''}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => setSelectedBot(bot)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Visualize Grid
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBots.map((bot) => (
              <Card key={bot.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{bot.name}</h3>
                        <Badge variant={getStatusBadge(bot.status)}>
                          {bot.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{bot.symbol}</p>
                    </div>
                    <Grid3X3 className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{bot.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Profit</p>
                      <p className="font-semibold text-green-600">${bot.performance.totalProfit.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{bot.performance.winRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Grid Levels</p>
                      <p className="font-semibold">{bot.config.gridLevels}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Grid Efficiency</p>
                      <p className="font-semibold">{bot.performance.gridEfficiency.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Investment</span>
                      <span>${bot.config.totalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span>{bot.stats.uptime}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedBot(bot)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button variant={bot.status === 'running' ? 'destructive' : 'default'} size="sm">
                      {bot.status === 'running' ? 'Stop' : 'Start'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                    <Badge variant={template.difficulty === 'beginner' ? 'default' : template.difficulty === 'intermediate' ? 'outline' : 'destructive'}>
                      {template.difficulty.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Grid Levels</p>
                      <p className="font-semibold">{template.config.gridLevels}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spacing Type</p>
                      <p className="font-semibold">{template.config.spacingType}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Take Profit</p>
                      <p className="font-semibold">{template.config.takeProfit}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stop Loss</p>
                      <p className="font-semibold">{template.config.stopLoss}%</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{template.rating}</span>
                      <span className="text-muted-foreground">({template.downloads})</span>
                    </div>
                    <span className="text-muted-foreground">by {template.creator}</span>
                  </div>

                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Grid Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={[
                    { time: '00:00', profit: 120, efficiency: 85 },
                    { time: '04:00', profit: 135, efficiency: 87 },
                    { time: '08:00', profit: 180, efficiency: 89 },
                    { time: '12:00', profit: 220, efficiency: 91 },
                    { time: '16:00', profit: 195, efficiency: 88 },
                    { time: '20:00', profit: 240, efficiency: 92 },
                    { time: '24:00', profit: 280, efficiency: 90 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="profit" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grid Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$2,340</div>
                    <div className="text-sm text-muted-foreground">Total Profit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">68.5%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">87.3%</div>
                    <div className="text-sm text-muted-foreground">Grid Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">156</div>
                    <div className="text-sm text-muted-foreground">Total Trades</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grid Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Buy Orders Filled</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="h-2 w-20" />
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sell Orders Filled</span>
                    <div className="flex items-center gap-2">
                      <Progress value={58} className="h-2 w-20" />
                      <span className="text-sm">58%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Grids</span>
                    <div className="flex items-center gap-2">
                      <Progress value={40} className="h-2 w-20" />
                      <span className="text-sm">40%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-semibold">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-semibold">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Network Latency</span>
                    <span className="text-sm font-semibold">35ms</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Order Execution</span>
                    <span className="text-sm font-semibold">98%</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}