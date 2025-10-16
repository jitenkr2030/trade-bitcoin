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
  LineChart as LineChartIcon,
  PieChart,
  ShoppingCart,
  Eye,
  Cpu,
  Database,
  Settings,
  Square,
  Play,
  Pause,
  RefreshCw,
  Coins,
  Timer,
  TrendingUp as TrendUpIcon,
  TrendingDown as TrendDownIcon,
  Minus,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  AlertCircle,
  Info,
  DollarSign as DollarIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter, BarChart, Bar } from 'recharts';

interface ArbitrageOpportunity {
  id: string;
  pair: string;
  type: 'exchange' | 'triangular' | 'statistical';
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  spread: number;
  spreadPercent: number;
  volume: number;
  estimatedProfit: number;
  profitPercent: number;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: string;
  status: 'active' | 'expired' | 'executed';
  executionTime: number;
  fees: {
    buyFee: number;
    sellFee: number;
    networkFee: number;
    totalFee: number;
  };
  liquidity: {
    buyLiquidity: number;
    sellLiquidity: number;
    score: number;
  };
}

interface ArbitrageBot {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'error';
  type: 'exchange' | 'triangular' | 'statistical';
  description: string;
  config: {
    minSpread: number;
    maxInvestment: number;
    maxPositions: number;
    exchanges: string[];
    pairs: string[];
    riskLevel: 'low' | 'medium' | 'high';
    autoExecute: boolean;
    maxSlippage: number;
  };
  performance: {
    totalProfit: number;
    profitPercent: number;
    totalTrades: number;
    successRate: number;
    avgExecutionTime: number;
    maxDrawdown: number;
    sharpeRatio: number;
  };
  stats: {
    uptime: string;
    lastOpportunity: string;
    opportunitiesFound: number;
    opportunitiesExecuted: number;
    avgSpread: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  alerts: {
    enabled: boolean;
    minSpread: number;
    maxRisk: string;
    notifications: string[];
  };
}

interface ExchangePair {
  exchange: string;
  pair: string;
  price: number;
  volume24h: number;
  change24h: number;
  lastUpdate: string;
  fee: number;
}

interface ArbitrageHistory {
  id: string;
  pair: string;
  type: string;
  buyExchange: string;
  sellExchange: string;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  profitPercent: number;
  executionTime: number;
  status: 'success' | 'failed' | 'partial';
  timestamp: string;
  fees: number;
  netProfit: number;
}

export default function ArbitragePage() {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBot, setSelectedBot] = useState<ArbitrageBot | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Mock data for demonstration
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<ArbitrageOpportunity[]>([
    {
      id: '1',
      pair: 'BTC/USDT',
      type: 'exchange',
      buyExchange: 'Binance',
      sellExchange: 'Coinbase',
      buyPrice: 43250.00,
      sellPrice: 43320.00,
      spread: 70.00,
      spreadPercent: 0.162,
      volume: 2.5,
      estimatedProfit: 175.00,
      profitPercent: 0.162,
      riskLevel: 'low',
      timestamp: '2 minutes ago',
      status: 'active',
      executionTime: 450,
      fees: {
        buyFee: 0.10,
        sellFee: 0.25,
        networkFee: 5.00,
        totalFee: 5.35
      },
      liquidity: {
        buyLiquidity: 1250000,
        sellLiquidity: 980000,
        score: 0.87
      }
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      type: 'triangular',
      buyExchange: 'Kraken',
      sellExchange: 'Binance',
      buyPrice: 2240.00,
      sellPrice: 2250.00,
      spread: 10.00,
      spreadPercent: 0.446,
      volume: 15.0,
      estimatedProfit: 150.00,
      profitPercent: 0.446,
      riskLevel: 'medium',
      timestamp: '5 minutes ago',
      status: 'active',
      executionTime: 680,
      fees: {
        buyFee: 0.20,
        sellFee: 0.10,
        networkFee: 2.50,
        totalFee: 2.80
      },
      liquidity: {
        buyLiquidity: 850000,
        sellLiquidity: 1200000,
        score: 0.92
      }
    },
    {
      id: '3',
      pair: 'SOL/USDT',
      type: 'statistical',
      buyExchange: 'FTX',
      sellExchange: 'Huobi',
      buyPrice: 98.50,
      sellPrice: 99.20,
      spread: 0.70,
      spreadPercent: 0.711,
      volume: 50.0,
      estimatedProfit: 35.00,
      profitPercent: 0.711,
      riskLevel: 'high',
      timestamp: '8 minutes ago',
      status: 'expired',
      executionTime: 320,
      fees: {
        buyFee: 0.15,
        sellFee: 0.20,
        networkFee: 1.00,
        totalFee: 1.35
      },
      liquidity: {
        buyLiquidity: 450000,
        sellLiquidity: 380000,
        score: 0.73
      }
    }
  ]);

  const [arbitrageBots, setArbitrageBots] = useState<ArbitrageBot[]>([
    {
      id: '1',
      name: 'BTC/USDT Arbitrage Master',
      status: 'running',
      type: 'exchange',
      description: 'Advanced arbitrage bot for Bitcoin trading across major exchanges',
      config: {
        minSpread: 0.05,
        maxInvestment: 50000,
        maxPositions: 5,
        exchanges: ['Binance', 'Coinbase', 'Kraken', 'FTX'],
        pairs: ['BTC/USDT', 'BTC/USD'],
        riskLevel: 'medium',
        autoExecute: true,
        maxSlippage: 0.02
      },
      performance: {
        totalProfit: 2850,
        profitPercent: 5.7,
        totalTrades: 156,
        successRate: 94.2,
        avgExecutionTime: 420,
        maxDrawdown: 2.1,
        sharpeRatio: 3.2
      },
      stats: {
        uptime: '7 days 14 hours',
        lastOpportunity: '3 minutes ago',
        opportunitiesFound: 1247,
        opportunitiesExecuted: 156,
        avgSpread: 0.087,
        cpuUsage: 15,
        memoryUsage: 45
      },
      alerts: {
        enabled: true,
        minSpread: 0.1,
        maxRisk: 'medium',
        notifications: ['email', 'telegram', 'webhook']
      }
    },
    {
      id: '2',
      name: 'Multi-Coin Triangular Arbitrage',
      status: 'paused',
      type: 'triangular',
      description: 'Triangular arbitrage across multiple cryptocurrency pairs',
      config: {
        minSpread: 0.1,
        maxInvestment: 25000,
        maxPositions: 3,
        exchanges: ['Binance', 'Kraken', 'Huobi'],
        pairs: ['BTC/USDT', 'ETH/USDT', 'ETH/BTC'],
        riskLevel: 'low',
        autoExecute: false,
        maxSlippage: 0.03
      },
      performance: {
        totalProfit: 1240,
        profitPercent: 4.96,
        totalTrades: 89,
        successRate: 91.0,
        avgExecutionTime: 680,
        maxDrawdown: 1.8,
        sharpeRatio: 2.8
      },
      stats: {
        uptime: '5 days 8 hours',
        lastOpportunity: '2 hours ago',
        opportunitiesFound: 456,
        opportunitiesExecuted: 89,
        avgSpread: 0.124,
        cpuUsage: 22,
        memoryUsage: 38
      },
      alerts: {
        enabled: true,
        minSpread: 0.15,
        maxRisk: 'low',
        notifications: ['email', 'telegram']
      }
    }
  ]);

  const [exchangePairs, setExchangePairs] = useState<ExchangePair[]>([
    { exchange: 'Binance', pair: 'BTC/USDT', price: 43250.00, volume24h: 2850000000, change24h: 2.3, lastUpdate: '1s ago', fee: 0.10 },
    { exchange: 'Coinbase', pair: 'BTC/USDT', price: 43320.00, volume24h: 1980000000, change24h: 2.4, lastUpdate: '2s ago', fee: 0.25 },
    { exchange: 'Kraken', pair: 'BTC/USDT', price: 43280.00, volume24h: 1450000000, change24h: 2.2, lastUpdate: '1s ago', fee: 0.20 },
    { exchange: 'FTX', pair: 'BTC/USDT', price: 43210.00, volume24h: 980000000, change24h: 2.1, lastUpdate: '3s ago', fee: 0.15 },
    { exchange: 'Binance', pair: 'ETH/USDT', price: 2240.00, volume24h: 1850000000, change24h: 3.1, lastUpdate: '1s ago', fee: 0.10 },
    { exchange: 'Kraken', pair: 'ETH/USDT', price: 2245.00, volume24h: 1200000000, change24h: 3.2, lastUpdate: '2s ago', fee: 0.20 },
    { exchange: 'Huobi', pair: 'ETH/USDT', price: 2238.00, volume24h: 950000000, change24h: 3.0, lastUpdate: '1s ago', fee: 0.18 }
  ]);

  const [arbitrageHistory, setArbitrageHistory] = useState<ArbitrageHistory[]>([
    {
      id: '1',
      pair: 'BTC/USDT',
      type: 'exchange',
      buyExchange: 'Binance',
      sellExchange: 'Coinbase',
      buyPrice: 43150.00,
      sellPrice: 43220.00,
      profit: 70.00,
      profitPercent: 0.162,
      executionTime: 425,
      status: 'success',
      timestamp: '1 hour ago',
      fees: 5.35,
      netProfit: 64.65
    },
    {
      id: '2',
      pair: 'ETH/USDT',
      type: 'triangular',
      buyExchange: 'Kraken',
      sellExchange: 'Binance',
      buyPrice: 2235.00,
      sellPrice: 2245.00,
      profit: 10.00,
      profitPercent: 0.447,
      executionTime: 695,
      status: 'success',
      timestamp: '2 hours ago',
      fees: 2.80,
      netProfit: 7.20
    },
    {
      id: '3',
      pair: 'SOL/USDT',
      type: 'statistical',
      buyExchange: 'FTX',
      sellExchange: 'Huobi',
      buyPrice: 97.80,
      sellPrice: 98.50,
      profit: 0.70,
      profitPercent: 0.716,
      executionTime: 315,
      status: 'partial',
      timestamp: '3 hours ago',
      fees: 1.35,
      netProfit: -0.65
    }
  ]);

  const filteredOpportunities = arbitrageOpportunities.filter(opp => 
    opp.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.buyExchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.sellExchange.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOpportunityTypeIcon = (type: string) => {
    switch (type) {
      case 'exchange': return <ArrowLeftRight className="h-4 w-4" />;
      case 'triangular': return <ArrowLeftRight className="h-4 w-4" />;
      case 'statistical': return <BarChart3 className="h-4 w-4" />;
      default: return <ArrowLeftRight className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'running': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'stopped': return 'text-red-600';
      case 'expired': return 'text-gray-600';
      case 'executed': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'running': return 'default';
      case 'paused': return 'secondary';
      case 'stopped': return 'destructive';
      case 'expired': return 'outline';
      case 'executed': return 'default';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'outline';
      case 'high': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleScanOpportunities = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const handleExecuteOpportunity = (opportunityId: string) => {
    setArbitrageOpportunities(prev => prev.map(opp => {
      if (opp.id === opportunityId) {
        return { ...opp, status: 'executed' as const };
      }
      return opp;
    }));
  };

  const profitData = [
    { time: '00:00', profit: 120 },
    { time: '04:00', profit: 85 },
    { time: '08:00', profit: 200 },
    { time: '12:00', profit: 180 },
    { time: '16:00', profit: 250 },
    { time: '20:00', profit: 190 },
    { time: '24:00', profit: 285 }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Arbitrage Trading</h1>
          <p className="text-muted-foreground">
            Automated arbitrage opportunities and cross-exchange trading strategies
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={handleScanOpportunities} disabled={isScanning}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Scan Opportunities'}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Bot
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Opportunities
          </TabsTrigger>
          <TabsTrigger value="bots" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Bots
          </TabsTrigger>
          <TabsTrigger value="exchanges" className="flex items-center gap-2">
            <ArrowLeftRight className="h-4 w-4" />
            Exchanges
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities" className="space-y-4">
          <div className="grid gap-4">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getOpportunityTypeIcon(opportunity.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{opportunity.pair}</h3>
                          <Badge variant={getStatusBadge(opportunity.status)}>
                            {opportunity.status.toUpperCase()}
                          </Badge>
                          <Badge variant={getRiskBadge(opportunity.riskLevel)}>
                            {opportunity.riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {opportunity.buyExchange} → {opportunity.sellExchange} • {opportunity.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          +${opportunity.estimatedProfit.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {opportunity.profitPercent.toFixed(3)}%
                        </div>
                      </div>
                      {opportunity.status === 'active' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleExecuteOpportunity(opportunity.id)}
                        >
                          Execute
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Buy Price</p>
                      <p className="font-semibold">${opportunity.buyPrice.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{opportunity.buyExchange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Sell Price</p>
                      <p className="font-semibold">${opportunity.sellPrice.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{opportunity.sellExchange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Spread</p>
                      <p className="font-semibold text-green-600">
                        ${opportunity.spread.toFixed(2)} ({opportunity.spreadPercent.toFixed(3)}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="font-semibold">{opportunity.volume} {opportunity.pair.split('/')[0]}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Execution Time</p>
                      <p className="font-semibold">{opportunity.executionTime}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Liquidity Score</p>
                      <div className="flex items-center gap-2">
                        <Progress value={opportunity.liquidity.score * 100} className="h-2 flex-1" />
                        <span className="text-sm">{(opportunity.liquidity.score * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Fees</p>
                      <p className="font-semibold">${opportunity.fees.totalFee.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Detected: {opportunity.timestamp}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {arbitrageBots.map((bot) => (
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
                      <p className="text-sm text-muted-foreground">{bot.type.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
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
                      <p className="text-muted-foreground">Success Rate</p>
                      <p className="font-semibold">{bot.performance.successRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Opportunities Found</p>
                      <p className="font-semibold">{bot.stats.opportunitiesFound.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Executed</p>
                      <p className="font-semibold">{bot.stats.opportunitiesExecuted.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Auto Execute</span>
                      <Switch checked={bot.config.autoExecute} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Risk Level</span>
                      <Badge variant={getRiskBadge(bot.config.riskLevel)}>
                        {bot.config.riskLevel.toUpperCase()}
                      </Badge>
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

        <TabsContent value="exchanges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exchange Prices</CardTitle>
              <CardDescription>
                Real-time price comparison across different exchanges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exchangePairs.map((pair, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-semibold">{pair.exchange}</h4>
                        <p className="text-sm text-muted-foreground">{pair.pair}</p>
                      </div>
                      <div>
                        <p className="font-semibold">${pair.price.toLocaleString()}</p>
                        <p className={`text-sm ${pair.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Volume: ${(pair.volume24h / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-muted-foreground">Fee: {pair.fee}%</p>
                      <p className="text-xs text-muted-foreground">{pair.lastUpdate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {arbitrageHistory.map((trade) => (
              <Card key={trade.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{trade.pair}</h3>
                      <p className="text-sm text-muted-foreground">
                        {trade.buyExchange} → {trade.sellExchange} • {trade.type.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={trade.status === 'success' ? 'default' : trade.status === 'partial' ? 'outline' : 'destructive'}>
                        {trade.status.toUpperCase()}
                      </Badge>
                      <div className="text-right">
                        <div className={`font-semibold ${trade.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trade.netProfit >= 0 ? '+' : ''}${trade.netProfit.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {trade.profitPercent.toFixed(3)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Buy Price</p>
                      <p className="font-semibold">${trade.buyPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sell Price</p>
                      <p className="font-semibold">${trade.sellPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Execution Time</p>
                      <p className="font-semibold">{trade.executionTime}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fees</p>
                      <p className="font-semibold">${trade.fees.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>Executed: {trade.timestamp}</p>
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
                <CardTitle>Profit Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={profitData}>
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
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$2,850</div>
                    <div className="text-sm text-muted-foreground">Total Profit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">94.2%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">420ms</div>
                    <div className="text-sm text-muted-foreground">Avg Execution</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">3.2</div>
                    <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opportunity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Exchange Arbitrage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="h-2 w-20" />
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Triangular Arbitrage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={25} className="h-2 w-20" />
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Statistical Arbitrage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={10} className="h-2 w-20" />
                      <span className="text-sm">10%</span>
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
                    <span className="text-sm font-semibold">18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-semibold">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Network Latency</span>
                    <span className="text-sm font-semibold">45ms</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">API Response Time</span>
                    <span className="text-sm font-semibold">120ms</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedBot && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Bot Details - {selectedBot.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Bot Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span>{selectedBot.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={getStatusBadge(selectedBot.status)}>
                      {selectedBot.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Execute:</span>
                    <Switch checked={selectedBot.config.autoExecute} />
                  </div>
                  <div className="flex justify-between">
                    <span>Min Spread:</span>
                    <span>{selectedBot.config.minSpread}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Profit:</span>
                    <span>${selectedBot.performance.totalProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit %:</span>
                    <span>{selectedBot.performance.profitPercent.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span>{selectedBot.performance.successRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sharpe Ratio:</span>
                    <span>{selectedBot.performance.sharpeRatio}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Configuration</h4>
              <div className="grid gap-4 md:grid-cols-2 text-sm">
                <div>
                  <p><strong>Max Investment:</strong> ${selectedBot.config.maxInvestment.toLocaleString()}</p>
                  <p><strong>Max Positions:</strong> {selectedBot.config.maxPositions}</p>
                  <p><strong>Risk Level:</strong> {selectedBot.config.riskLevel.toUpperCase()}</p>
                  <p><strong>Max Slippage:</strong> {selectedBot.config.maxSlippage}%</p>
                </div>
                <div>
                  <p><strong>Exchanges:</strong></p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedBot.config.exchanges.map((exchange, index) => (
                      <Badge key={index} variant="outline">{exchange}</Badge>
                    ))}
                  </div>
                  <p className="mt-2"><strong>Trading Pairs:</strong></p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedBot.config.pairs.map((pair, index) => (
                      <Badge key={index} variant="outline">{pair}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Statistics</h4>
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div>
                  <p><strong>Uptime:</strong> {selectedBot.stats.uptime}</p>
                  <p><strong>Last Opportunity:</strong> {selectedBot.stats.lastOpportunity}</p>
                </div>
                <div>
                  <p><strong>Opportunities Found:</strong> {selectedBot.stats.opportunitiesFound.toLocaleString()}</p>
                  <p><strong>Opportunities Executed:</strong> {selectedBot.stats.opportunitiesExecuted.toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>Avg Spread:</strong> {selectedBot.stats.avgSpread}%</p>
                  <p><strong>Avg Execution Time:</strong> {selectedBot.performance.avgExecutionTime}ms</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}