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
  Calendar as CalendarIcon,
  Calculator,
  TrendingDown as TrendDownIcon2,
  BarChart2,
  PieChart as PieChartIcon,
  Sliders,
  Save,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter, BarChart, Bar } from 'recharts';

interface DCAOrder {
  id: string;
  sequence: number;
  amount: number;
  price: number;
  status: 'pending' | 'executed' | 'skipped';
  timestamp: string;
  executedPrice?: number;
  profit?: number;
  profitPercent?: number;
}

interface DCABot {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'completed';
  symbol: string;
  description: string;
  config: {
    totalInvestment: number;
    orderCount: number;
    orderInterval: number;
    intervalType: 'hours' | 'days' | 'weeks';
    investmentType: 'fixed' | 'percentage';
    fixedAmount?: number;
    percentageAmount?: number;
    minPrice?: number;
    maxPrice?: number;
    takeProfit: number;
    stopLoss: number;
    rebalance: boolean;
    autoRestart: boolean;
    sentimentIntegration: boolean;
    strategy: 'basic' | 'aggressive' | 'conservative' | 'hybrid';
  };
  performance: {
    totalInvested: number;
    currentValue: number;
    totalProfit: number;
    profitPercent: number;
    avgBuyPrice: number;
    currentPrice: number;
    ordersExecuted: number;
    ordersRemaining: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  stats: {
    uptime: string;
    lastOrder: string;
    nextOrder: string;
    totalOrders: number;
    executedOrders: number;
    skippedOrders: number;
    avgOrderSize: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  orders: DCAOrder[];
  currentMarketData: {
    price: number;
    change24h: number;
    volume24h: number;
    high24h: number;
    low24h: number;
  };
}

interface DCATemplate {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  config: {
    totalInvestment: number;
    orderCount: number;
    orderInterval: number;
    intervalType: 'hours' | 'days' | 'weeks';
    investmentType: 'fixed' | 'percentage';
    takeProfit: number;
    stopLoss: number;
    strategy: 'basic' | 'aggressive' | 'conservative' | 'hybrid';
  };
  tags: string[];
  popularity: number;
  rating: number;
  downloads: number;
  creator: string;
  expectedReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface DCAProjection {
  scenario: string;
  projectedReturn: number;
  projectedProfit: number;
  confidence: number;
  timeframe: string;
  assumptions: string[];
}

export default function DCAConfiguratorPage() {
  const [activeTab, setActiveTab] = useState('configurator');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBot, setSelectedBot] = useState<DCABot | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [configData, setConfigData] = useState({
    totalInvestment: 10000,
    orderCount: 12,
    orderInterval: 1,
    intervalType: 'weeks' as 'hours' | 'days' | 'weeks',
    investmentType: 'fixed' as 'fixed' | 'percentage',
    fixedAmount: 833.33,
    percentageAmount: 8.33,
    takeProfit: 15,
    stopLoss: 8,
    strategy: 'basic' as 'basic' | 'aggressive' | 'conservative' | 'hybrid',
    sentimentIntegration: false,
    autoRestart: false
  });

  // Mock data for demonstration
  const [dcaBots, setDcaBots] = useState<DCABot[]>([
    {
      id: '1',
      name: 'BTC Weekly DCA',
      status: 'running',
      symbol: 'BTC/USDT',
      description: 'Weekly dollar-cost averaging for Bitcoin with sentiment integration',
      config: {
        totalInvestment: 10000,
        orderCount: 12,
        orderInterval: 1,
        intervalType: 'weeks',
        investmentType: 'fixed',
        fixedAmount: 833.33,
        takeProfit: 15,
        stopLoss: 8,
        rebalance: true,
        autoRestart: true,
        sentimentIntegration: true,
        strategy: 'hybrid'
      },
      performance: {
        totalInvested: 7500,
        currentValue: 8235,
        totalProfit: 735,
        profitPercent: 9.8,
        avgBuyPrice: 41850,
        currentPrice: 43250,
        ordersExecuted: 9,
        ordersRemaining: 3,
        winRate: 88.9,
        sharpeRatio: 2.1,
        maxDrawdown: 5.2
      },
      stats: {
        uptime: '9 weeks 2 days',
        lastOrder: '2 days ago',
        nextOrder: '5 days',
        totalOrders: 12,
        executedOrders: 9,
        skippedOrders: 0,
        avgOrderSize: 833.33,
        cpuUsage: 8,
        memoryUsage: 32
      },
      orders: [
        { id: '1', sequence: 1, amount: 833.33, price: 41200, status: 'executed', timestamp: '9 weeks ago', executedPrice: 41200, profit: 2050, profitPercent: 4.98 },
        { id: '2', sequence: 2, amount: 833.33, price: 41800, status: 'executed', timestamp: '8 weeks ago', executedPrice: 41800, profit: 1450, profitPercent: 3.47 },
        { id: '3', sequence: 3, amount: 833.33, price: 42500, status: 'executed', timestamp: '7 weeks ago', executedPrice: 42500, profit: 750, profitPercent: 1.76 },
        { id: '4', sequence: 4, amount: 833.33, price: 41500, status: 'executed', timestamp: '6 weeks ago', executedPrice: 41500, profit: 1750, profitPercent: 4.22 },
        { id: '5', sequence: 5, amount: 833.33, price: 42200, status: 'executed', timestamp: '5 weeks ago', executedPrice: 42200, profit: 1050, profitPercent: 2.49 },
        { id: '6', sequence: 6, amount: 833.33, price: 42800, status: 'executed', timestamp: '4 weeks ago', executedPrice: 42800, profit: 450, profitPercent: 1.05 },
        { id: '7', sequence: 7, amount: 833.33, price: 42000, status: 'executed', timestamp: '3 weeks ago', executedPrice: 42000, profit: 1250, profitPercent: 2.98 },
        { id: '8', sequence: 8, amount: 833.33, price: 41600, status: 'executed', timestamp: '2 weeks ago', executedPrice: 41600, profit: 1650, profitPercent: 3.97 },
        { id: '9', sequence: 9, amount: 833.33, price: 41900, status: 'executed', timestamp: '2 days ago', executedPrice: 41900, profit: 1350, profitPercent: 3.22 },
        { id: '10', sequence: 10, amount: 833.33, price: 0, status: 'pending', timestamp: '' },
        { id: '11', sequence: 11, amount: 833.33, price: 0, status: 'pending', timestamp: '' },
        { id: '12', sequence: 12, amount: 833.33, price: 0, status: 'pending', timestamp: '' }
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
      name: 'ETH Daily DCA',
      status: 'paused',
      symbol: 'ETH/USDT',
      description: 'Daily dollar-cost averaging for Ethereum with conservative strategy',
      config: {
        totalInvestment: 5000,
        orderCount: 30,
        orderInterval: 1,
        intervalType: 'days',
        investmentType: 'fixed',
        fixedAmount: 166.67,
        takeProfit: 12,
        stopLoss: 6,
        rebalance: false,
        autoRestart: false,
        sentimentIntegration: false,
        strategy: 'conservative'
      },
      performance: {
        totalInvested: 3500,
        currentValue: 3685,
        totalProfit: 185,
        profitPercent: 5.3,
        avgBuyPrice: 2180,
        currentPrice: 2240,
        ordersExecuted: 21,
        ordersRemaining: 9,
        winRate: 85.7,
        sharpeRatio: 1.8,
        maxDrawdown: 3.8
      },
      stats: {
        uptime: '21 days',
        lastOrder: '1 day ago',
        nextOrder: '23 hours',
        totalOrders: 30,
        executedOrders: 21,
        skippedOrders: 0,
        avgOrderSize: 166.67,
        cpuUsage: 6,
        memoryUsage: 28
      },
      orders: [],
      currentMarketData: {
        price: 2240,
        change24h: 3.1,
        volume24h: 1850000000,
        high24h: 2310,
        low24h: 2150
      }
    }
  ]);

  const [dcaTemplates, setDcaTemplates] = useState<DCATemplate[]>([
    {
      id: '1',
      name: 'Conservative Monthly DCA',
      category: 'Conservative',
      difficulty: 'beginner',
      description: 'Low-risk monthly DCA strategy for long-term investors',
      config: {
        totalInvestment: 12000,
        orderCount: 12,
        orderInterval: 1,
        intervalType: 'weeks',
        investmentType: 'fixed',
        takeProfit: 20,
        stopLoss: 10,
        strategy: 'conservative'
      },
      tags: ['Long-term', 'Low Risk', 'Monthly'],
      popularity: 92,
      rating: 4.7,
      downloads: 2341,
      creator: 'DCA Master',
      expectedReturn: 8.5,
      riskLevel: 'low'
    },
    {
      id: '2',
      name: 'Aggressive Weekly DCA',
      category: 'Aggressive',
      difficulty: 'advanced',
      description: 'High-frequency weekly DCA for maximum market exposure',
      config: {
        totalInvestment: 15000,
        orderCount: 52,
        orderInterval: 1,
        intervalType: 'weeks',
        investmentType: 'fixed',
        takeProfit: 15,
        stopLoss: 5,
        strategy: 'aggressive'
      },
      tags: ['High Frequency', 'Aggressive', 'Weekly'],
      popularity: 76,
      rating: 4.3,
      downloads: 1456,
      creator: 'Crypto DCA Pro',
      expectedReturn: 12.3,
      riskLevel: 'high'
    },
    {
      id: '3',
      name: 'Smart Sentiment DCA',
      category: 'Smart',
      difficulty: 'intermediate',
      description: 'AI-powered DCA with market sentiment analysis',
      config: {
        totalInvestment: 10000,
        orderCount: 24,
        orderInterval: 2,
        intervalType: 'weeks',
        investmentType: 'percentage',
        takeProfit: 18,
        stopLoss: 7,
        strategy: 'hybrid'
      },
      tags: ['AI', 'Sentiment', 'Smart'],
      popularity: 88,
      rating: 4.6,
      downloads: 1876,
      creator: 'Smart DCA Labs',
      expectedReturn: 10.8,
      riskLevel: 'medium'
    }
  ]);

  const [projections, setProjections] = useState<DCAProjection[]>([
    {
      scenario: 'Conservative',
      projectedReturn: 8.5,
      projectedProfit: 850,
      confidence: 85,
      timeframe: '12 months',
      assumptions: ['Market grows 5-10% annually', 'Low volatility', 'Regular execution']
    },
    {
      scenario: 'Moderate',
      projectedReturn: 12.3,
      projectedProfit: 1230,
      confidence: 70,
      timeframe: '12 months',
      assumptions: ['Market grows 10-15% annually', 'Moderate volatility', 'Some timing optimization']
    },
    {
      scenario: 'Aggressive',
      projectedReturn: 18.7,
      projectedProfit: 1870,
      confidence: 55,
      timeframe: '12 months',
      assumptions: ['Market grows 15-25% annually', 'High volatility', 'Active management']
    }
  ]);

  const filteredBots = dcaBots.filter(bot => 
    bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bot.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTemplates = dcaTemplates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'stopped': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return 'default';
      case 'paused': return 'secondary';
      case 'stopped': return 'destructive';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'conservative': return 'text-green-600';
      case 'basic': return 'text-blue-600';
      case 'hybrid': return 'text-purple-600';
      case 'aggressive': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const calculateOrderAmount = () => {
    if (configData.investmentType === 'fixed') {
      return configData.fixedAmount;
    } else {
      return (configData.totalInvestment * configData.percentageAmount!) / 100;
    }
  };

  const calculateTotalDuration = () => {
    const totalDuration = configData.orderCount * configData.orderInterval;
    switch (configData.intervalType) {
      case 'hours': return `${totalDuration} hours`;
      case 'days': return `${totalDuration} days (${(totalDuration / 7).toFixed(1)} weeks)`;
      case 'weeks': return `${totalDuration} weeks (${(totalDuration / 4.33).toFixed(1)} months)`;
      default: return `${totalDuration} ${configData.intervalType}`;
    }
  };

  const renderDCAVisualization = (bot: DCABot) => {
    const orders = bot.orders.filter(order => order.status === 'executed');
    const avgPrice = bot.performance.avgBuyPrice;
    const currentPrice = bot.performance.currentPrice;
    
    const chartData = orders.map((order, index) => ({
      order: index + 1,
      buyPrice: order.executedPrice!,
      currentPrice: currentPrice,
      profit: order.profit!,
      profitPercent: order.profitPercent!
    }));

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">${avgPrice.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Average Buy Price</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${currentPrice.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Current Price</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${bot.performance.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${bot.performance.totalProfit.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Profit</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Price vs Average Buy Price</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="order" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="buyPrice" stroke="#8884d8" name="Buy Price" />
                <Line type="monotone" dataKey="currentPrice" stroke="#82ca9d" name="Current Price" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit per Order</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="order" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="profit" fill="#8884d8" name="Profit ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">DCA Bot Configurator</h1>
          <p className="text-muted-foreground">
            Advanced dollar-cost averaging bot configuration and management
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
            New DCA Bot
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="configurator" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Configurator
          </TabsTrigger>
          <TabsTrigger value="bots" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            My Bots
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Projections
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configurator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DCA Configuration</CardTitle>
              <CardDescription>
                Configure your dollar-cost averaging strategy with advanced options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="totalInvestment">Total Investment ($)</Label>
                    <Input
                      id="totalInvestment"
                      type="number"
                      value={configData.totalInvestment}
                      onChange={(e) => setConfigData(prev => ({ ...prev, totalInvestment: Number(e.target.value) }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="orderCount">Number of Orders</Label>
                    <Input
                      id="orderCount"
                      type="number"
                      value={configData.orderCount}
                      onChange={(e) => setConfigData(prev => ({ ...prev, orderCount: Number(e.target.value) }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="orderInterval">Interval</Label>
                      <Input
                        id="orderInterval"
                        type="number"
                        value={configData.orderInterval}
                        onChange={(e) => setConfigData(prev => ({ ...prev, orderInterval: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="intervalType">Type</Label>
                      <Select value={configData.intervalType} onValueChange={(value) => setConfigData(prev => ({ ...prev, intervalType: value as any }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="investmentType">Investment Type</Label>
                    <Select value={configData.investmentType} onValueChange={(value) => setConfigData(prev => ({ ...prev, investmentType: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">Percentage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {configData.investmentType === 'fixed' ? (
                    <div>
                      <Label htmlFor="fixedAmount">Fixed Amount per Order ($)</Label>
                      <Input
                        id="fixedAmount"
                        type="number"
                        value={configData.fixedAmount}
                        onChange={(e) => setConfigData(prev => ({ ...prev, fixedAmount: Number(e.target.value) }))}
                      />
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="percentageAmount">Percentage per Order (%)</Label>
                      <Input
                        id="percentageAmount"
                        type="number"
                        value={configData.percentageAmount}
                        onChange={(e) => setConfigData(prev => ({ ...prev, percentageAmount: Number(e.target.value) }))}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="strategy">Strategy</Label>
                    <Select value={configData.strategy} onValueChange={(value) => setConfigData(prev => ({ ...prev, strategy: value as any }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="takeProfit">Take Profit (%)</Label>
                      <Input
                        id="takeProfit"
                        type="number"
                        value={configData.takeProfit}
                        onChange={(e) => setConfigData(prev => ({ ...prev, takeProfit: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                      <Input
                        id="stopLoss"
                        type="number"
                        value={configData.stopLoss}
                        onChange={(e) => setConfigData(prev => ({ ...prev, stopLoss: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sentimentIntegration">Sentiment Integration</Label>
                      <Switch
                        id="sentimentIntegration"
                        checked={configData.sentimentIntegration}
                        onCheckedChange={(checked) => setConfigData(prev => ({ ...prev, sentimentIntegration: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoRestart">Auto Restart</Label>
                      <Switch
                        id="autoRestart"
                        checked={configData.autoRestart}
                        onCheckedChange={(checked) => setConfigData(prev => ({ ...prev, autoRestart: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Configuration Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Investment:</span>
                        <span className="font-semibold">${configData.totalInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Amount:</span>
                        <span className="font-semibold">${calculateOrderAmount().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Number of Orders:</span>
                        <span className="font-semibold">{configData.orderCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Duration:</span>
                        <span className="font-semibold">{calculateTotalDuration()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Strategy:</span>
                        <Badge variant="outline" className={getStrategyColor(configData.strategy)}>
                          {configData.strategy.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Take Profit:</span>
                        <span className="font-semibold">{configData.takeProfit}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stop Loss:</span>
                        <span className="font-semibold">{configData.stopLoss}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sentiment Integration:</span>
                        <Badge variant={configData.sentimentIntegration ? 'default' : 'secondary'}>
                          {configData.sentimentIntegration ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline">
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Advanced Options
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
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
                    <Repeat className="h-4 w-4" />
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
                      <p className="text-muted-foreground">Profit %</p>
                      <p className={`font-semibold ${bot.performance.profitPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {bot.performance.profitPercent.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Orders Executed</p>
                      <p className="font-semibold">{bot.performance.ordersExecuted}/{bot.config.orderCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Buy Price</p>
                      <p className="font-semibold">${bot.performance.avgBuyPrice.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Strategy</span>
                      <Badge variant="outline" className={getStrategyColor(bot.config.strategy)}>
                        {bot.config.strategy.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Next Order</span>
                      <span className="font-semibold">{bot.stats.nextOrder}</span>
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
                      <p className="text-muted-foreground">Total Investment</p>
                      <p className="font-semibold">${template.config.totalInvestment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Orders</p>
                      <p className="font-semibold">{template.config.orderCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expected Return</p>
                      <p className="font-semibold text-green-600">{template.expectedReturn}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risk Level</p>
                      <Badge variant={template.riskLevel === 'low' ? 'default' : template.riskLevel === 'medium' ? 'outline' : 'destructive'}>
                        {template.riskLevel.toUpperCase()}
                      </Badge>
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

        <TabsContent value="projections" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {projections.map((projection, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{projection.scenario} Scenario</h3>
                    <Badge variant={projection.confidence >= 80 ? 'default' : projection.confidence >= 60 ? 'outline' : 'secondary'}>
                      {projection.confidence}% Confidence
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+{projection.projectedReturn}%</div>
                    <div className="text-sm text-muted-foreground">Expected Return</div>
                    <div className="text-lg font-semibold">${projection.projectedProfit.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Projected Profit</div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Assumptions:</h4>
                    <ul className="text-sm space-y-1">
                      {projection.assumptions.map((assumption, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span>{assumption}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Timeframe: {projection.timeframe}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {selectedBot ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedBot.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedBot.symbol}</p>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedBot(null)}>
                      Back to List
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderDCAVisualization(selectedBot)}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>DCA Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={[
                      { month: 'Jan', profit: 120, efficiency: 85 },
                      { month: 'Feb', profit: 180, efficiency: 88 },
                      { month: 'Mar', profit: 220, efficiency: 91 },
                      { month: 'Apr', profit: 195, efficiency: 89 },
                      { month: 'May', profit: 280, efficiency: 92 },
                      { month: 'Jun', profit: 320, efficiency: 94 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="profit" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strategy Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Conservative</span>
                      <div className="flex items-center gap-2">
                        <Progress value={35} className="h-2 w-20" />
                        <span className="text-sm">35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Basic</span>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="h-2 w-20" />
                        <span className="text-sm">30%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Hybrid</span>
                      <div className="flex items-center gap-2">
                        <Progress value={25} className="h-2 w-20" />
                        <span className="text-sm">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Aggressive</span>
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
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">$2,340</div>
                      <div className="text-sm text-muted-foreground">Total Profit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">87.3%</div>
                      <div className="text-sm text-muted-foreground">Avg Efficiency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">156</div>
                      <div className="text-sm text-muted-foreground">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">9.8%</div>
                      <div className="text-sm text-muted-foreground">Avg Return</div>
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
                      <span className="text-sm font-semibold">8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Memory Usage</span>
                      <span className="text-sm font-semibold">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Order Success Rate</span>
                      <span className="text-sm font-semibold">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">API Response</span>
                      <span className="text-sm font-semibold">125ms</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}