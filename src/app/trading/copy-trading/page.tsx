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
  TrendingUp, 
  TrendingDown, 
  Users, 
  Copy, 
  Settings, 
  Play, 
  Pause, 
  Square, 
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
  Search
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface CopyTrader {
  id: string;
  name: string;
  avatar: string;
  username: string;
  verified: boolean;
  followers: number;
  totalCopiers: number;
  trades: number;
  winRate: number;
  profit: number;
  profitPercent: number;
  rank: number;
  badges: string[];
  strategy: string;
  riskLevel: 'low' | 'medium' | 'high';
  minCopyAmount: number;
  maxCopyAmount: number;
  successFee: number;
  performance: Array<{ date: string; value: number }>;
  stats: {
    avgTradeDuration: string;
    maxDrawdown: number;
    profitFactor: number;
    sharpeRatio: number;
  };
  recentTrades: Array<{
    pair: string;
    type: 'buy' | 'sell';
    profit: number;
    time: string;
    copied: boolean;
  }>;
  // Enhanced social features
  socialStats: {
    posts: number;
    likes: number;
    comments: number;
    shares: number;
    lastActive: string;
    responseRate: number;
  };
  tradingStyle: {
    preferredPairs: string[];
    timeframes: string[];
    indicators: string[];
    riskManagement: string;
  };
  community: {
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    communityScore: number;
  };
}

interface CopySettings {
  traderId: string;
  amount: number;
  riskMultiplier: number;
  maxPositions: number;
  stopLoss: number;
  takeProfit: number;
  copyType: 'fixed' | 'percentage';
  autoCopy: boolean;
  copyShorts: boolean;
  copyLeverage: boolean;
}

interface ActiveCopy {
  id: string;
  trader: CopyTrader;
  settings: CopySettings;
  startTime: Date;
  totalCopied: number;
  currentProfit: number;
  copiedTrades: number;
  status: 'active' | 'paused' | 'stopped';
  lastActivity: Date;
}

interface CopyTrade {
  id: string;
  originalTrade: {
    trader: CopyTrader;
    pair: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
    time: Date;
  };
  copiedTrade: {
    amount: number;
    price: number;
    time: Date;
    profit: number;
    status: 'open' | 'closed';
  };
  copySettings: CopySettings;
}

export default function CopyTradingPage() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTrader, setSelectedTrader] = useState<CopyTrader | null>(null);
  const [copySettings, setCopySettings] = useState<CopySettings | null>(null);
  const [activeCopies, setActiveCopies] = useState<ActiveCopy[]>([]);
  const [copyHistory, setCopyHistory] = useState<CopyTrade[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [realtimeUpdates, setRealtimeUpdates] = useState(true);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'trade' | 'profit' | 'loss' | 'milestone';
    message: string;
    timestamp: Date;
    read: boolean;
  }>>([]);

  // Enhanced trader data with social features
  const [traders, setTraders] = useState<CopyTrader[]>([
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      username: '@alextrader',
      verified: true,
      followers: 15234,
      totalCopiers: 3421,
      trades: 3421,
      winRate: 68.5,
      profit: 125430,
      profitPercent: 125.43,
      rank: 1,
      badges: ['Top Copy Trader', 'Consistent', 'Risk Master'],
      strategy: 'Swing Trading',
      riskLevel: 'medium',
      minCopyAmount: 100,
      maxCopyAmount: 50000,
      successFee: 10,
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 105000 },
        { date: 'Mar', value: 112000 },
        { date: 'Apr', value: 108000 },
        { date: 'May', value: 118000 },
        { date: 'Jun', value: 125430 },
      ],
      stats: {
        avgTradeDuration: '3.2 days',
        maxDrawdown: 12.5,
        profitFactor: 1.8,
        sharpeRatio: 2.1,
      },
      recentTrades: [
        { pair: 'BTC/USDT', type: 'buy', profit: 2340, time: '2h ago', copied: true },
        { pair: 'ETH/USDT', type: 'sell', profit: 1560, time: '5h ago', copied: true },
        { pair: 'SOL/USDT', type: 'buy', profit: 890, time: '1d ago', copied: false },
      ],
      // Enhanced social features
      socialStats: {
        posts: 342,
        likes: 15234,
        comments: 893,
        shares: 445,
        lastActive: '2 hours ago',
        responseRate: 94,
      },
      tradingStyle: {
        preferredPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT'],
        timeframes: ['4h', '1d', '1w'],
        indicators: ['RSI', 'MACD', 'Bollinger Bands'],
        riskManagement: 'Fixed 2% risk per trade'
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
      totalCopiers: 2156,
      trades: 2156,
      winRate: 72.3,
      profit: 98760,
      profitPercent: 98.76,
      rank: 2,
      badges: ['High Win Rate', 'Steady Growth'],
      strategy: 'Day Trading',
      riskLevel: 'low',
      minCopyAmount: 50,
      maxCopyAmount: 25000,
      successFee: 8,
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 102000 },
        { date: 'Mar', value: 108000 },
        { date: 'Apr', value: 105000 },
        { date: 'May', value: 112000 },
        { date: 'Jun', value: 98760 },
      ],
      stats: {
        avgTradeDuration: '4.5 hours',
        maxDrawdown: 8.2,
        profitFactor: 2.1,
        sharpeRatio: 2.4,
      },
      recentTrades: [
        { pair: 'BTC/USDT', type: 'sell', profit: 1890, time: '3h ago', copied: true },
        { pair: 'ADA/USDT', type: 'buy', profit: 560, time: '6h ago', copied: true },
      ],
      // Enhanced social features
      socialStats: {
        posts: 215,
        likes: 8932,
        comments: 567,
        shares: 234,
        lastActive: '3 hours ago',
        responseRate: 89,
      },
      tradingStyle: {
        preferredPairs: ['BTC/USDT', 'ADA/USDT', 'DOT/USDT'],
        timeframes: ['1h', '4h'],
        indicators: ['Stochastic', 'EMA', 'Volume Profile'],
        riskManagement: 'Dynamic risk based on volatility'
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
      totalCopiers: 987,
      trades: 1876,
      winRate: 64.2,
      profit: 76540,
      profitPercent: 76.54,
      rank: 3,
      badges: ['Rising Star'],
      strategy: 'Scalping',
      riskLevel: 'high',
      minCopyAmount: 25,
      maxCopyAmount: 10000,
      successFee: 15,
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 98000 },
        { date: 'Mar', value: 105000 },
        { date: 'Apr', value: 110000 },
        { date: 'May', value: 72000 },
        { date: 'Jun', value: 76540 },
      ],
      stats: {
        avgTradeDuration: '45 minutes',
        maxDrawdown: 18.7,
        profitFactor: 1.4,
        sharpeRatio: 1.6,
      },
      recentTrades: [
        { pair: 'BTC/USDT', type: 'buy', profit: 2340, time: '1h ago', copied: false },
        { pair: 'ETH/USDT', type: 'sell', profit: -120, time: '2h ago', copied: false },
      ],
      // Enhanced social features
      socialStats: {
        posts: 156,
        likes: 5678,
        comments: 234,
        shares: 89,
        lastActive: '1 hour ago',
        responseRate: 76,
      },
      tradingStyle: {
        preferredPairs: ['BTC/USDT', 'ETH/USDT', 'MATIC/USDT'],
        timeframes: ['5m', '15m', '1h'],
        indicators: ['MACD', 'RSI', 'Fibonacci'],
        riskManagement: 'Aggressive scalping with tight stops'
      },
      community: {
        isFollowing: false,
        followersCount: 5678,
        followingCount: 89,
        communityScore: 4.2,
      },
    },
  ]);

  useEffect(() => {
    // Mock active copies
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
    ]);

    // Mock copy history
    setCopyHistory([
      {
        id: '1',
        originalTrade: {
          trader: traders[0],
          pair: 'BTC/USDT',
          type: 'buy',
          amount: 0.5,
          price: 43000,
          time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        copiedTrade: {
          amount: 0.1,
          price: 43000,
          time: new Date(Date.now() - 2 * 60 * 60 * 1000),
          profit: 234,
          status: 'open',
        },
        copySettings: {
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
      },
    ]);

    // Mock notifications
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
    ]);

    // Simulate real-time updates
    if (realtimeUpdates) {
      const interval = setInterval(() => {
        // Simulate random trade updates
        const randomTrader = traders[Math.floor(Math.random() * traders.length)];
        const newNotification = {
          id: Date.now().toString(),
          type: 'trade' as const,
          message: `${randomTrader.name} is active - ${randomTrader.strategy} strategy`,
          timestamp: new Date(),
          read: false,
        };
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }
  }, [realtimeUpdates, traders]);

  const filteredTraders = traders.filter(trader => 
    trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trader.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartCopying = (trader: CopyTrader) => {
    setSelectedTrader(trader);
    setCopySettings({
      traderId: trader.id,
      amount: trader.minCopyAmount,
      riskMultiplier: 1.0,
      maxPositions: 3,
      stopLoss: 10,
      takeProfit: 20,
      copyType: 'fixed',
      autoCopy: true,
      copyShorts: true,
      copyLeverage: false,
    });
  };

  const handleConfirmCopy = () => {
    if (!selectedTrader || !copySettings) return;

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
    };

    setActiveCopies(prev => [...prev, newCopy]);
    setSelectedTrader(null);
    setCopySettings(null);
    setIsConfirming(false);
  };

  const handlePauseCopy = (copyId: string) => {
    setActiveCopies(prev => prev.map(copy => 
      copy.id === copyId 
        ? { ...copy, status: copy.status === 'active' ? 'paused' : 'active' }
        : copy
    ));
  };

  const handleStopCopy = (copyId: string) => {
    setActiveCopies(prev => prev.filter(copy => copy.id !== copyId));
  };

  // Enhanced social features handlers
  const handleFollowTrader = (traderId: string) => {
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
    ));
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const handleToggleRealtimeUpdates = () => {
    setRealtimeUpdates(prev => !prev);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trade': return <BarChart3 className="h-4 w-4" />;
      case 'profit': return <TrendingUp className="h-4 w-4" />;
      case 'loss': return <TrendingDown className="h-4 w-4" />;
      case 'milestone': return <Target className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'trade': return 'text-blue-600';
      case 'profit': return 'text-green-600';
      case 'loss': return 'text-red-600';
      case 'milestone': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'stopped': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Copy Trading</h1>
          <p className="text-muted-foreground">Automatically copy trades from top-performing traders</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search traders..."
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
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Active Copies
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <div className="relative">
              <Clock className="h-4 w-4" />
              {notifications.filter(n => !n.read).length > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTraders.map((trader) => (
              <Card key={trader.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={trader.avatar} />
                        <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{trader.name}</h3>
                          {trader.verified && <Badge variant="secondary">✓</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{trader.username}</p>
                      </div>
                    </div>
                    <Badge variant={trader.riskLevel === 'low' ? 'default' : trader.riskLevel === 'medium' ? 'secondary' : 'destructive'}>
                      {trader.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Copiers</p>
                      <p className="font-semibold">{trader.totalCopiers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="font-semibold">{trader.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Profit</p>
                      <p className={`font-semibold ${trader.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${trader.profit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Success Fee</p>
                      <p className="font-semibold">{trader.successFee}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Strategy</p>
                    <p className="font-medium">{trader.strategy}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Performance</p>
                    <div className="h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trader.performance}>
                          <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                          <Tooltip />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Max Drawdown</p>
                      <p className="font-medium">{trader.stats.maxDrawdown}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit Factor</p>
                      <p className="font-medium">{trader.stats.profitFactor}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {trader.badges.map((badge) => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  {/* Enhanced Social Features */}
                  <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t">
                    <div>
                      <p className="text-muted-foreground">Community Score</p>
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < Math.floor(trader.community.communityScore) 
                                  ? 'bg-yellow-400' 
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{trader.community.communityScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Response Rate</p>
                      <p className="font-medium">{trader.socialStats.responseRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{trader.community.followersCount.toLocaleString()} followers</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFollowTrader(trader.id)}
                      className="text-xs"
                    >
                      {trader.community.isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleStartCopying(trader)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Trades
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeCopies.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Active Copies</h3>
                <p className="text-muted-foreground mb-4">
                  Start copying traders to see your active copy trades here
                </p>
                <Button onClick={() => setActiveTab('discover')}>
                  Discover Traders
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeCopies.map((copy) => (
                <Card key={copy.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={copy.trader.avatar} />
                          <AvatarFallback>{copy.trader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{copy.trader.name}</h3>
                            {copy.trader.verified && <Badge variant="secondary">✓</Badge>}
                            <Badge variant={copy.status === 'active' ? 'default' : copy.status === 'paused' ? 'secondary' : 'destructive'}>
                              {copy.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Started {copy.startTime.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePauseCopy(copy.id)}
                        >
                          {copy.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleStopCopy(copy.id)}
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Copied Amount</p>
                        <p className="text-lg font-semibold">${copy.settings.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Profit</p>
                        <p className={`text-lg font-semibold ${copy.currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${copy.currentProfit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Copied Trades</p>
                        <p className="text-lg font-semibold">{copy.copiedTrades}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Risk Multiplier</p>
                        <p className="text-lg font-semibold">{copy.settings.riskMultiplier}x</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Stop Loss</p>
                        <p className="font-medium">{copy.settings.stopLoss}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Take Profit</p>
                        <p className="font-medium">{copy.settings.takeProfit}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Max Positions</p>
                        <p className="font-medium">{copy.settings.maxPositions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Activity</p>
                        <p className="font-medium">{copy.lastActivity.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Copy Trading History</CardTitle>
              <CardDescription>Track all your copied trades and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {copyHistory.map((copyTrade) => (
                  <div key={copyTrade.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={copyTrade.originalTrade.trader.avatar} />
                          <AvatarFallback>{copyTrade.originalTrade.trader.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{copyTrade.originalTrade.trader.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {copyTrade.originalTrade.pair} • {copyTrade.originalTrade.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${copyTrade.copiedTrade.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${copyTrade.copiedTrade.profit.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {copyTrade.copiedTrade.status.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Original Amount</p>
                        <p className="font-medium">{copyTrade.originalTrade.amount} {copyTrade.originalTrade.pair.split('/')[0]}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Copied Amount</p>
                        <p className="font-medium">{copyTrade.copiedTrade.amount} {copyTrade.originalTrade.pair.split('/')[0]}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Original Price</p>
                        <p className="font-medium">${copyTrade.originalTrade.price.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Copied Price</p>
                        <p className="font-medium">${copyTrade.copiedTrade.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Copied</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${activeCopies.reduce((sum, copy) => sum + copy.settings.amount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {activeCopies.length} active copies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${activeCopies.reduce((sum, copy) => sum + copy.currentProfit, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  From copy trading
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCopies.length}</div>
                <p className="text-xs text-muted-foreground">
                  Currently copying
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>How your copy trading portfolio is distributed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeCopies.map(copy => ({
                        name: copy.trader.name,
                        value: copy.settings.amount,
                        color: `hsl(${copy.trader.id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)`
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {activeCopies.map((copy, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${copy.trader.id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Real-time Notifications</h2>
              <p className="text-muted-foreground">Stay updated with trader activities and copy trade performance</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="realtime-updates"
                checked={realtimeUpdates}
                onCheckedChange={handleToggleRealtimeUpdates}
              />
              <Label htmlFor="realtime-updates">Real-time Updates</Label>
            </div>
          </div>

          <div className="grid gap-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                  <p className="text-muted-foreground">
                    Enable real-time updates to receive notifications about trader activities
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-colors ${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}
                  onClick={() => handleMarkNotificationRead(notification.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getNotificationColor(notification.type)} bg-opacity-10`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{notification.message}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.timestamp.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Copy Settings Modal */}
      {selectedTrader && copySettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Copy Trading Settings</CardTitle>
              <CardDescription>
                Configure how you want to copy trades from {selectedTrader.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Copy Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={copySettings.amount}
                    onChange={(e) => setCopySettings(prev => prev ? { ...prev, amount: Number(e.target.value) } : null)}
                    min={selectedTrader.minCopyAmount}
                    max={selectedTrader.maxCopyAmount}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Min: ${selectedTrader.minCopyAmount}, Max: ${selectedTrader.maxCopyAmount}
                  </p>
                </div>
                <div>
                  <Label htmlFor="riskMultiplier">Risk Multiplier</Label>
                  <Select value={copySettings.riskMultiplier.toString()} onValueChange={(value) => setCopySettings(prev => prev ? { ...prev, riskMultiplier: Number(value) } : null)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="0.75">0.75x</SelectItem>
                      <SelectItem value="1.0">1.0x</SelectItem>
                      <SelectItem value="1.25">1.25x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2.0">2.0x</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    value={copySettings.stopLoss}
                    onChange={(e) => setCopySettings(prev => prev ? { ...prev, stopLoss: Number(e.target.value) } : null)}
                    min={1}
                    max={50}
                  />
                </div>
                <div>
                  <Label htmlFor="takeProfit">Take Profit (%)</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    value={copySettings.takeProfit}
                    onChange={(e) => setCopySettings(prev => prev ? { ...prev, takeProfit: Number(e.target.value) } : null)}
                    min={1}
                    max={100}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxPositions">Max Positions</Label>
                <Input
                  id="maxPositions"
                  type="number"
                  value={copySettings.maxPositions}
                  onChange={(e) => setCopySettings(prev => prev ? { ...prev, maxPositions: Number(e.target.value) } : null)}
                  min={1}
                  max={20}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoCopy"
                    checked={copySettings.autoCopy}
                    onCheckedChange={(checked) => setCopySettings(prev => prev ? { ...prev, autoCopy: checked } : null)}
                  />
                  <Label htmlFor="autoCopy">Auto-copy new trades</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="copyShorts"
                    checked={copySettings.copyShorts}
                    onCheckedChange={(checked) => setCopySettings(prev => prev ? { ...prev, copyShorts: checked } : null)}
                  />
                  <Label htmlFor="copyShorts">Copy short positions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="copyLeverage"
                    checked={copySettings.copyLeverage}
                    onCheckedChange={(checked) => setCopySettings(prev => prev ? { ...prev, copyLeverage: checked } : null)}
                  />
                  <Label htmlFor="copyLeverage">Copy leverage settings</Label>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Success fee: {selectedTrader.successFee}% of profits will be paid to the trader.
                  You can stop copying at any time.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedTrader(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => setIsConfirming(true)}
                  disabled={isConfirming}
                >
                  {isConfirming ? 'Confirming...' : 'Start Copying'}
                </Button>
              </div>

              {isConfirming && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Are you sure you want to start copying {selectedTrader.name}'s trades with ${copySettings.amount}?
                    This will automatically execute trades based on their activity.
                  </AlertDescription>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" onClick={() => setIsConfirming(false)}>
                      No, Cancel
                    </Button>
                    <Button onClick={handleConfirmCopy}>
                      Yes, Start Copying
                    </Button>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}