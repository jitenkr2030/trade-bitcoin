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
  Wallet,
  Coins,
  TrendingDown as TrendDownIcon,
  TrendingUp as TrendUpIcon,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  Award,
  Star,
  Zap as Bolt,
  Grid3X3,
  Repeat,
  ArrowLeftRight,
  Bot
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

interface PaperTradingAccount {
  id: string;
  name: string;
  initialBalance: number;
  currentBalance: number;
  totalProfit: number;
  profitPercent: number;
  currency: string;
  createdAt: string;
  lastActivity: string;
  status: 'active' | 'inactive' | 'reset';
  tradingBots: string[];
  performance: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    avgWin: number;
    avgLoss: number;
    largestWin: number;
    largestLoss: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  balances: Array<{
    asset: string;
    free: number;
    locked: number;
    total: number;
    valueInUSD: number;
  }>;
  positions: Array<{
    id: string;
    symbol: string;
    type: 'long' | 'short';
    quantity: number;
    entryPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercent: number;
    margin: number;
    leverage: number;
    liquidationPrice: number;
    createdAt: string;
  }>;
  orders: Array<{
    id: string;
    symbol: string;
    type: 'market' | 'limit' | 'stop' | 'stop_limit';
    side: 'buy' | 'sell';
    quantity: number;
    price?: number;
    stopPrice?: number;
    status: 'open' | 'filled' | 'cancelled' | 'expired';
    createdAt: string;
    filledAt?: string;
    filledPrice?: number;
    filledQuantity?: number;
  }>;
  trades: Array<{
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    price: number;
    fee: number;
    feeCurrency: string;
    createdAt: string;
    pnl?: number;
    pnlPercent?: number;
  }>;
}

interface PaperTradingBot {
  id: string;
  name: string;
  type: 'grid' | 'dca' | 'momentum' | 'mean-reversion' | 'arbitrage';
  status: 'running' | 'paused' | 'stopped';
  accountId: string;
  strategy: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
  performance: {
    totalProfit: number;
    profitPercent: number;
    totalTrades: number;
    winRate: number;
    sharpeRatio: number;
    maxDrawdown: number;
    uptime: string;
  };
  config: {
    symbol: string;
    timeframe: string;
    investment: number;
    maxPositions: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  lastActivity: string;
  nextExecution: string;
}

interface Competition {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  prizePool: number;
  participants: number;
  status: 'upcoming' | 'active' | 'completed';
  rules: string[];
  leaderboard: Array<{
    rank: number;
    accountId: string;
    accountName: string;
    profit: number;
    profitPercent: number;
    trades: number;
    winRate: number;
  }>;
}

export default function PaperTradingPage() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [selectedAccount, setSelectedAccount] = useState<PaperTradingAccount | null>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isTrading, setIsTrading] = useState(false);

  // Mock data for demonstration
  const [accounts, setAccounts] = useState<PaperTradingAccount[]>([
    {
      id: '1',
      name: 'Main Paper Account',
      initialBalance: 100000,
      currentBalance: 125430,
      totalProfit: 25430,
      profitPercent: 25.43,
      currency: 'USD',
      createdAt: '2024-01-01',
      lastActivity: '2024-01-15 14:30',
      status: 'active',
      tradingBots: ['1', '2'],
      performance: {
        totalTrades: 156,
        winningTrades: 108,
        losingTrades: 48,
        winRate: 69.2,
        avgWin: 234.50,
        avgLoss: 156.20,
        largestWin: 1250.00,
        largestLoss: 450.00,
        sharpeRatio: 1.85,
        maxDrawdown: 12.8,
      },
      balances: [
        { asset: 'USD', free: 25000, locked: 0, total: 25000, valueInUSD: 25000 },
        { asset: 'BTC', free: 1.5, locked: 0.5, total: 2.0, valueInUSD: 86000 },
        { asset: 'ETH', free: 5.2, locked: 1.8, total: 7.0, valueInUSD: 14300 },
        { asset: 'SOL', free: 120, locked: 30, total: 150, valueInUSD: 2130 },
      ],
      positions: [
        {
          id: '1',
          symbol: 'BTC/USDT',
          type: 'long',
          quantity: 0.5,
          entryPrice: 42000,
          currentPrice: 43000,
          pnl: 500,
          pnlPercent: 1.19,
          margin: 10000,
          leverage: 2,
          liquidationPrice: 38000,
          createdAt: '2024-01-15 10:00',
        },
        {
          id: '2',
          symbol: 'ETH/USDT',
          type: 'short',
          quantity: 2.0,
          entryPrice: 2100,
          currentPrice: 2050,
          pnl: 100,
          pnlPercent: 2.38,
          margin: 2000,
          leverage: 3,
          liquidationPrice: 2300,
          createdAt: '2024-01-15 12:00',
        },
      ],
      orders: [
        {
          id: '1',
          symbol: 'BTC/USDT',
          type: 'limit',
          side: 'buy',
          quantity: 0.1,
          price: 41500,
          status: 'open',
          createdAt: '2024-01-15 14:00',
        },
        {
          id: '2',
          symbol: 'ETH/USDT',
          type: 'stop',
          side: 'sell',
          quantity: 1.0,
          stopPrice: 2000,
          status: 'open',
          createdAt: '2024-01-15 14:15',
        },
      ],
      trades: [
        {
          id: '1',
          symbol: 'BTC/USDT',
          side: 'buy',
          quantity: 0.2,
          price: 41800,
          fee: 8.36,
          feeCurrency: 'USDT',
          createdAt: '2024-01-15 09:00',
          pnl: 200,
          pnlPercent: 0.48,
        },
        {
          id: '2',
          symbol: 'ETH/USDT',
          side: 'sell',
          quantity: 1.5,
          price: 2120,
          fee: 6.36,
          feeCurrency: 'USDT',
          createdAt: '2024-01-15 11:00',
          pnl: 180,
          pnlPercent: 0.85,
        },
      ],
    },
  ]);

  const [bots, setBots] = useState<PaperTradingBot[]>([
    {
      id: '1',
      name: 'BTC Grid Bot',
      type: 'grid',
      status: 'running',
      accountId: '1',
      strategy: {
        name: 'Grid Trading Strategy',
        description: 'Automated grid trading for Bitcoin',
        parameters: {
          gridSpacing: 500,
          gridLevels: 10,
          investment: 10000,
        },
      },
      performance: {
        totalProfit: 2340,
        profitPercent: 23.4,
        totalTrades: 45,
        winRate: 71.1,
        sharpeRatio: 1.92,
        maxDrawdown: 8.5,
        uptime: '7 days 12 hours',
      },
      config: {
        symbol: 'BTC/USDT',
        timeframe: '5m',
        investment: 10000,
        maxPositions: 5,
        riskLevel: 'medium',
      },
      lastActivity: '5 minutes ago',
      nextExecution: '2 minutes',
    },
    {
      id: '2',
      name: 'ETH DCA Bot',
      type: 'dca',
      status: 'paused',
      accountId: '1',
      strategy: {
        name: 'Dollar Cost Averaging',
        description: 'Regular ETH purchases regardless of price',
        parameters: {
          interval: '24h',
          amount: 100,
          maxPositions: 10,
        },
      },
      performance: {
        totalProfit: 890,
        profitPercent: 8.9,
        totalTrades: 12,
        winRate: 83.3,
        sharpeRatio: 2.15,
        maxDrawdown: 3.2,
        uptime: '14 days 3 hours',
      },
      config: {
        symbol: 'ETH/USDT',
        timeframe: '1h',
        investment: 5000,
        maxPositions: 10,
        riskLevel: 'low',
      },
      lastActivity: '2 hours ago',
      nextExecution: '22 hours',
    },
  ]);

  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: '1',
      name: 'January Trading Championship',
      description: 'Compete with traders worldwide in this month-long paper trading competition',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      prizePool: 50000,
      participants: 1250,
      status: 'active',
      rules: [
        'Start with $100,000 virtual balance',
        'No leverage limits',
        'All major cryptocurrencies available',
        'Real-time market data',
        'Daily performance tracking',
      ],
      leaderboard: [
        { rank: 1, accountId: 'user123', accountName: 'CryptoMaster', profit: 45200, profitPercent: 45.2, trades: 89, winRate: 72.3 },
        { rank: 2, accountId: 'user456', accountName: 'TradingPro', profit: 38900, profitPercent: 38.9, trades: 156, winRate: 68.5 },
        { rank: 3, accountId: 'user789', accountName: 'BotWhisperer', profit: 34500, profitPercent: 34.5, trades: 234, winRate: 71.2 },
      ],
    },
  ]);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  const handleCreateAccount = () => {
    const newAccount: PaperTradingAccount = {
      id: Date.now().toString(),
      name: 'New Paper Account',
      initialBalance: 100000,
      currentBalance: 100000,
      totalProfit: 0,
      profitPercent: 0,
      currency: 'USD',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'active',
      tradingBots: [],
      performance: {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        avgWin: 0,
        avgLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
      },
      balances: [
        { asset: 'USD', free: 100000, locked: 0, total: 100000, valueInUSD: 100000 },
      ],
      positions: [],
      orders: [],
      trades: [],
    };
    setAccounts(prev => [...prev, newAccount]);
    setIsCreatingAccount(false);
  };

  const handleResetAccount = (accountId: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { 
            ...account, 
            currentBalance: account.initialBalance,
            totalProfit: 0,
            profitPercent: 0,
            status: 'reset',
            performance: {
              totalTrades: 0,
              winningTrades: 0,
              losingTrades: 0,
              winRate: 0,
              avgWin: 0,
              avgLoss: 0,
              largestWin: 0,
              largestLoss: 0,
              sharpeRatio: 0,
              maxDrawdown: 0,
            },
            balances: [
              { asset: 'USD', free: account.initialBalance, locked: 0, total: account.initialBalance, valueInUSD: account.initialBalance },
            ],
            positions: [],
            orders: [],
            trades: [],
          }
        : account
    ));
  };

  const getBotTypeIcon = (type: string) => {
    switch (type) {
      case 'grid': return <Grid3X3 className="h-4 w-4" />;
      case 'dca': return <Repeat className="h-4 w-4" />;
      case 'arbitrage': return <ArrowLeftRight className="h-4 w-4" />;
      case 'momentum': return <TrendingUp className="h-4 w-4" />;
      case 'mean-reversion': return <TrendingDown className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'running':
        return 'text-green-600';
      case 'paused':
        return 'text-yellow-600';
      case 'stopped':
      case 'inactive':
        return 'text-red-600';
      case 'reset':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Paper Trading</h1>
          <p className="text-muted-foreground">
            Practice trading with virtual funds and test your strategies risk-free
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => setIsCreatingAccount(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Account
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="bots">Bots</TabsTrigger>
          <TabsTrigger value="competitions">Competitions</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Card key={account.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{account.name}</h3>
                        <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                          {account.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(account.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Balance</p>
                      <p className="text-lg font-semibold">${account.currentBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Profit</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(account.totalProfit)}`}>
                        {account.totalProfit > 0 ? '+' : ''}${account.totalProfit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit %</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(account.profitPercent)}`}>
                        {account.profitPercent > 0 ? '+' : ''}{account.profitPercent}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="text-lg font-semibold">{account.performance.winRate}%</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Trades: {account.performance.totalTrades}</span>
                      <span>Sharpe: {account.performance.sharpeRatio}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Max DD: {account.performance.maxDrawdown}%</span>
                      <span>Bots: {account.tradingBots.length}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedAccount(account)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResetAccount(account.id)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trading" className="space-y-4">
          {selectedAccount && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Overview</CardTitle>
                    <CardDescription>{selectedAccount.name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Balance</p>
                        <p className="text-2xl font-bold">${selectedAccount.currentBalance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Profit</p>
                        <p className={`text-2xl font-bold ${getPerformanceColor(selectedAccount.totalProfit)}`}>
                          {selectedAccount.totalProfit > 0 ? '+' : ''}${selectedAccount.totalProfit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-2xl font-bold">{selectedAccount.performance.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max Drawdown</p>
                        <p className="text-2xl font-bold text-red-600">
                          -{selectedAccount.performance.maxDrawdown}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Positions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAccount.positions.map((position) => (
                        <div key={position.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge variant={position.type === 'long' ? 'default' : 'secondary'}>
                                {position.type.toUpperCase()}
                              </Badge>
                              <div>
                                <p className="font-medium">{position.symbol}</p>
                                <p className="text-sm text-muted-foreground">
                                  {position.quantity} @ ${position.entryPrice}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-semibold ${getPerformanceColor(position.pnl)}`}>
                                {position.pnl > 0 ? '+' : ''}${position.pnl.toFixed(2)}
                              </p>
                              <p className={`text-sm ${getPerformanceColor(position.pnlPercent)}`}>
                                {position.pnlPercent > 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                            <span>Current: ${position.currentPrice}</span>
                            <span>Leverage: {position.leverage}x</span>
                            <span>Liq Price: ${position.liquidationPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Trades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-2">
                        {selectedAccount.trades.map((trade) => (
                          <div key={trade.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant={trade.side === 'buy' ? 'default' : 'secondary'}>
                                  {trade.side.toUpperCase()}
                                </Badge>
                                <div>
                                  <p className="font-medium">{trade.symbol}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {trade.quantity} @ ${trade.price}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                {trade.pnl !== undefined && (
                                  <>
                                    <p className={`font-semibold ${getPerformanceColor(trade.pnl)}`}>
                                      {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                                    </p>
                                    <p className={`text-sm ${getPerformanceColor(trade.pnlPercent ?? 0)}`}>
                                      {trade.pnlPercent && trade.pnlPercent > 0 ? '+' : ''}{trade.pnlPercent?.toFixed(2)}%
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedAccount.balances.map((balance) => (
                        <div key={balance.asset} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4" />
                            <span className="font-medium">{balance.asset}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${balance.valueInUSD.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {balance.total} {balance.asset}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full" onClick={() => setIsTrading(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Trade
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Export History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {bots.map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getBotTypeIcon(bot.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{bot.name}</h3>
                          <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                            {bot.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{bot.type.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        {bot.status === 'running' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{bot.strategy.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Profit</p>
                      <p className={`font-semibold ${getPerformanceColor(bot.performance.totalProfit)}`}>
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

                  <div className="text-xs text-muted-foreground">
                    <p>Symbol: {bot.config.symbol}</p>
                    <p>Investment: ${bot.config.investment.toLocaleString()}</p>
                    <p>Next execution: {bot.nextExecution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="competitions" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {competitions.map((competition) => (
              <Card key={competition.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{competition.name}</h3>
                        <Badge variant={competition.status === 'active' ? 'default' : 'secondary'}>
                          {competition.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{competition.description}</p>
                    </div>
                    <Award className="h-5 w-5 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Prize Pool</p>
                      <p className="text-lg font-semibold">${competition.prizePool.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Participants</p>
                      <p className="text-lg font-semibold">{competition.participants.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date(competition.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{new Date(competition.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Top Performers</h4>
                    <div className="space-y-2">
                      {competition.leaderboard.slice(0, 3).map((entrant) => (
                        <div key={entrant.rank} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">#{entrant.rank}</Badge>
                            <span className="font-medium">{entrant.accountName}</span>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${getPerformanceColor(entrant.profit)}`}>
                              {entrant.profit > 0 ? '+' : ''}${entrant.profit.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {entrant.winRate}% win rate
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Star className="h-4 w-4 mr-2" />
                    Join Competition
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}