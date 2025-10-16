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
import { TrendingUp, TrendingDown, Users, MessageSquare, Trophy, Star, Search, Filter, Heart, MessageCircle, Share2, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TraderProfile {
  id: string;
  name: string;
  avatar: string;
  username: string;
  verified: boolean;
  followers: number;
  following: number;
  trades: number;
  winRate: number;
  profit: number;
  profitPercent: number;
  rank: number;
  badges: string[];
  strategy: string;
  riskLevel: 'low' | 'medium' | 'high';
  performance: Array<{ date: string; value: number }>;
  recentTrades: Array<{
    pair: string;
    type: 'buy' | 'sell';
    profit: number;
    time: string;
  }>;
}

interface Post {
  id: string;
  author: TraderProfile;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  isLiked: boolean;
  commentsList: Array<{
    id: string;
    author: TraderProfile;
    content: string;
    timestamp: string;
    likes: number;
  }>;
  // Enhanced social features
  type: 'trade_update' | 'analysis' | 'discussion' | 'achievement' | 'market_insight';
  tradeData?: {
    pair: string;
    type: 'buy' | 'sell';
    entry: number;
    target?: number;
    stop?: number;
    profit?: number;
    status: 'open' | 'closed';
  };
  media?: {
    type: 'chart' | 'image';
    url: string;
    caption: string;
  };
  engagement: {
    reach: number;
    impressions: number;
    ctr: number;
  };
}

interface LeaderboardEntry {
  rank: number;
  trader: TraderProfile;
  weeklyChange: number;
  monthlyChange: number;
  totalTrades: number;
  avgProfit: number;
  // Enhanced metrics
  consistency: number;
  riskScore: number;
  socialEngagement: number;
  copyTradingScore: number;
  streak: number;
  achievements: string[];
}

export default function SocialTradingPage() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTrader, setSelectedTrader] = useState<TraderProfile | null>(null);

  // Mock data for demonstration
  const [traders, setTraders] = useState<TraderProfile[]>([
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      username: '@alextrader',
      verified: true,
      followers: 15234,
      following: 456,
      trades: 3421,
      winRate: 68.5,
      profit: 125430,
      profitPercent: 125.43,
      rank: 1,
      badges: ['Top Trader', 'Consistent', 'Risk Master'],
      strategy: 'Swing Trading',
      riskLevel: 'medium',
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 105000 },
        { date: 'Mar', value: 112000 },
        { date: 'Apr', value: 108000 },
        { date: 'May', value: 118000 },
        { date: 'Jun', value: 125430 },
      ],
      recentTrades: [
        { pair: 'BTC/USDT', type: 'buy', profit: 2340, time: '2h ago' },
        { pair: 'ETH/USDT', type: 'sell', profit: 1560, time: '5h ago' },
        { pair: 'SOL/USDT', type: 'buy', profit: 890, time: '1d ago' },
      ],
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      username: '@sarahj',
      verified: true,
      followers: 8932,
      following: 234,
      trades: 2156,
      winRate: 72.3,
      profit: 98760,
      profitPercent: 98.76,
      rank: 2,
      badges: ['High Win Rate', 'Steady Growth'],
      strategy: 'Day Trading',
      riskLevel: 'low',
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 102000 },
        { date: 'Mar', value: 108000 },
        { date: 'Apr', value: 105000 },
        { date: 'May', value: 112000 },
        { date: 'Jun', value: 98760 },
      ],
      recentTrades: [
        { pair: 'BTC/USDT', type: 'sell', profit: 1890, time: '3h ago' },
        { pair: 'ADA/USDT', type: 'buy', profit: 560, time: '6h ago' },
      ],
    },
    {
      id: '3',
      name: 'Mike Wilson',
      avatar: '/avatars/mike.jpg',
      username: '@mikew',
      verified: false,
      followers: 5678,
      following: 123,
      trades: 1876,
      winRate: 64.2,
      profit: 76540,
      profitPercent: 76.54,
      rank: 3,
      badges: ['Rising Star'],
      strategy: 'Scalping',
      riskLevel: 'high',
      performance: [
        { date: 'Jan', value: 100000 },
        { date: 'Feb', value: 98000 },
        { date: 'Mar', value: 105000 },
        { date: 'Apr', value: 110000 },
        { date: 'May', value: 72000 },
        { date: 'Jun', value: 76540 },
      ],
      recentTrades: [
        { pair: 'BTC/USDT', type: 'buy', profit: 2340, time: '1h ago' },
        { pair: 'ETH/USDT', type: 'sell', profit: -120, time: '2h ago' },
      ],
    },
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: traders[0],
      content: 'Just closed a massive BTC long position! The market is showing strong bullish momentum. Key resistance at $52,000 broken with high volume. Looking for continuation to $55,000. #Bitcoin #Bullish',
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      shares: 12,
      tags: ['Bitcoin', 'Bullish'],
      isLiked: false,
      type: 'trade_update',
      tradeData: {
        pair: 'BTC/USDT',
        type: 'buy',
        entry: 51000,
        target: 55000,
        stop: 49500,
        profit: 2340,
        status: 'closed'
      },
      engagement: {
        reach: 15234,
        impressions: 28456,
        ctr: 12.5
      },
      commentsList: [
        {
          id: '1',
          author: traders[1],
          content: 'Great analysis! I agree with your target. The volume confirmation is key.',
          timestamp: '1 hour ago',
          likes: 12,
        },
      ],
    },
    {
      id: '2',
      author: traders[1],
      content: 'Day trading strategy update: Focused on ETH pairs today. Caught a nice 3.2% gain on ETH/USDT breakout. Risk management is crucial - always use stop losses! #DayTrading #Ethereum',
      timestamp: '4 hours ago',
      likes: 156,
      comments: 23,
      shares: 8,
      tags: ['DayTrading', 'Ethereum'],
      isLiked: true,
      type: 'analysis',
      media: {
        type: 'chart',
        url: '/charts/eth-breakout.png',
        caption: 'ETH/USDT 4h chart showing breakout pattern'
      },
      engagement: {
        reach: 8932,
        impressions: 15678,
        ctr: 9.8
      },
      commentsList: [],
    },
    {
      id: '3',
      author: traders[2],
      content: '🎉 Just hit 1000 consecutive profitable trades! This milestone represents years of discipline and continuous learning. Remember, consistency beats perfection in trading. #Milestone #TradingJourney',
      timestamp: '6 hours ago',
      likes: 567,
      comments: 89,
      shares: 34,
      tags: ['Milestone', 'TradingJourney'],
      isLiked: false,
      type: 'achievement',
      engagement: {
        reach: 23456,
        impressions: 45678,
        ctr: 15.2
      },
      commentsList: [
        {
          id: '2',
          author: traders[0],
          content: 'Incredible achievement! Your discipline is inspiring to all of us.',
          timestamp: '5 hours ago',
          likes: 45,
        },
        {
          id: '3',
          author: traders[1],
          content: 'Congratulations! That\'s an amazing streak. What\'s your secret?',
          timestamp: '4 hours ago',
          likes: 23,
        },
      ],
    },
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      trader: traders[0],
      weeklyChange: 12.5,
      monthlyChange: 25.4,
      totalTrades: 3421,
      avgProfit: 36.7,
      consistency: 87.5,
      riskScore: 7.2,
      socialEngagement: 92.3,
      copyTradingScore: 95.8,
      streak: 15,
      achievements: ['Top Performer', 'Risk Master', 'Social Star', 'Consistency King'],
    },
    {
      rank: 2,
      trader: traders[1],
      weeklyChange: 8.3,
      monthlyChange: 18.2,
      totalTrades: 2156,
      avgProfit: 45.8,
      consistency: 91.2,
      riskScore: 4.8,
      socialEngagement: 78.5,
      copyTradingScore: 88.4,
      streak: 8,
      achievements: ['High Win Rate', 'Steady Growth', 'Community Leader'],
    },
    {
      rank: 3,
      trader: traders[2],
      weeklyChange: -2.1,
      monthlyChange: 15.6,
      totalTrades: 1876,
      avgProfit: 40.8,
      consistency: 76.8,
      riskScore: 8.9,
      socialEngagement: 65.2,
      copyTradingScore: 72.1,
      streak: 3,
      achievements: ['Rising Star', 'Volume King'],
    },
  ]);

  const filteredTraders = traders.filter(trader => 
    trader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trader.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || post.tags.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const handleFollow = (traderId: string) => {
    setTraders(prev => prev.map(trader => 
      trader.id === traderId 
        ? { ...trader, followers: trader.followers + 1 }
        : trader
    ));
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'trade_update': return <TrendingUp className="h-4 w-4" />;
      case 'analysis': return <BarChart3 className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      case 'market_insight': return <Star className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'trade_update': return 'text-green-600 bg-green-100 border-green-200';
      case 'analysis': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'achievement': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'market_insight': return 'text-purple-600 bg-purple-100 border-purple-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'trade_update': return 'Trade Update';
      case 'analysis': return 'Analysis';
      case 'achievement': return 'Achievement';
      case 'market_insight': return 'Market Insight';
      default: return 'Discussion';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Social Trading</h1>
          <p className="text-muted-foreground">Connect, learn, and trade with the community</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search traders or posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Bitcoin">Bitcoin</SelectItem>
              <SelectItem value="Ethereum">Ethereum</SelectItem>
              <SelectItem value="DayTrading">Day Trading</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="traders" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Top Traders
          </TabsTrigger>
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="discussions" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          {/* Leaderboard Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Traders</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leaderboard.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Monthly Return</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {((leaderboard.reduce((sum, entry) => sum + entry.monthlyChange, 0) / leaderboard.length)).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all traders
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Consistency</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((leaderboard.reduce((sum, entry) => sum + entry.consistency, 0) / leaderboard.length)).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Performance stability
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(leaderboard.reduce((sum, entry) => sum + entry.totalTrades * 1000, 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  Trading volume
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Trader Leaderboard</CardTitle>
              <CardDescription>Top performing traders this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry) => (
                  <div key={entry.trader.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {entry.rank}
                      </div>
                      <Avatar>
                        <AvatarImage src={entry.trader.avatar} />
                        <AvatarFallback>{entry.trader.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{entry.trader.name}</h3>
                          {entry.trader.verified && <Badge variant="secondary">✓</Badge>}
                          {entry.streak > 0 && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              🔥 {entry.streak}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.trader.username}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {entry.achievements.slice(0, 2).map((achievement) => (
                            <Badge key={achievement} variant="outline" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">Monthly Change</p>
                        <p className={`text-lg font-semibold ${entry.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.monthlyChange >= 0 ? '+' : ''}{entry.monthlyChange}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Win Rate</p>
                        <p className="text-lg font-semibold">{entry.trader.winRate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Consistency</p>
                        <p className="text-lg font-semibold">{entry.consistency}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Risk Score</p>
                        <p className={`text-lg font-semibold ${
                          entry.riskScore <= 5 ? 'text-green-600' :
                          entry.riskScore <= 7.5 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {entry.riskScore}/10
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Social Score</p>
                        <p className="text-lg font-semibold">{entry.socialEngagement}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Copy Score</p>
                        <p className="text-lg font-semibold">{entry.copyTradingScore}%</p>
                      </div>
                      <Button onClick={() => handleFollow(entry.trader.id)}>
                        Follow
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traders" className="space-y-4">
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
                      <p className="text-muted-foreground">Followers</p>
                      <p className="font-semibold">{trader.followers.toLocaleString()}</p>
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
                      <p className="text-muted-foreground">Trades</p>
                      <p className="font-semibold">{trader.trades.toLocaleString()}</p>
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

                  <div className="flex flex-wrap gap-1">
                    {trader.badges.map((badge) => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleFollow(trader.id)}
                  >
                    Follow Trader
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feed" className="space-y-4">
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{post.author.name}</h3>
                          {post.author.verified && <Badge variant="secondary">✓</Badge>}
                          <Badge variant="outline">#{post.author.rank}</Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPostTypeColor(post.type)}`}
                          >
                            {getPostTypeIcon(post.type)}
                            <span className="ml-1">{getPostTypeLabel(post.type)}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Follow
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Trade Data Display */}
                  {post.tradeData && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{post.tradeData.pair}</h4>
                        <Badge 
                          variant={post.tradeData.type === 'buy' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {post.tradeData.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Entry</p>
                          <p className="font-medium">${post.tradeData.entry.toLocaleString()}</p>
                        </div>
                        {post.tradeData.target && (
                          <div>
                            <p className="text-muted-foreground">Target</p>
                            <p className="font-medium text-green-600">${post.tradeData.target.toLocaleString()}</p>
                          </div>
                        )}
                        {post.tradeData.stop && (
                          <div>
                            <p className="text-muted-foreground">Stop</p>
                            <p className="font-medium text-red-600">${post.tradeData.stop.toLocaleString()}</p>
                          </div>
                        )}
                        {post.tradeData.profit && (
                          <div>
                            <p className="text-muted-foreground">Profit</p>
                            <p className={`font-medium ${post.tradeData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${post.tradeData.profit.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Media Display */}
                  {post.media && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getPostTypeIcon(post.type)}
                        <span className="text-sm font-medium">{post.media.caption}</span>
                      </div>
                      <div className="bg-white p-8 rounded text-center text-muted-foreground">
                        {post.media.type === 'chart' ? '📊 Chart Preview' : '🖼️ Image Preview'}
                      </div>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed">{post.content}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Engagement Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center text-sm bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{post.engagement.reach.toLocaleString()}</p>
                      <p className="text-muted-foreground">Reach</p>
                    </div>
                    <div>
                      <p className="font-medium">{post.engagement.impressions.toLocaleString()}</p>
                      <p className="text-muted-foreground">Impressions</p>
                    </div>
                    <div>
                      <p className="font-medium">{post.engagement.ctr}%</p>
                      <p className="text-muted-foreground">CTR</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                        className={post.isLiked ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        {post.shares}
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      Copy Trade
                    </Button>
                  </div>

                  {post.commentsList.length > 0 && (
                    <div className="space-y-3">
                      <Separator />
                      <h4 className="text-sm font-medium">Comments</h4>
                      {post.commentsList.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-medium">{comment.author.name}</h5>
                              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{comment.content}</p>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Heart className="h-3 w-3 mr-1" />
                              {comment.likes}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Discussions</CardTitle>
              <CardDescription>Join conversations about market analysis and strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Start a new discussion..." className="flex-1" />
                  <Button>Post</Button>
                </div>
                
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={traders[0].avatar} />
                          <AvatarFallback>{traders[0].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">Bitcoin Technical Analysis</h4>
                          <p className="text-sm text-muted-foreground">Started by {traders[0].name} • 2 hours ago</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Hot</Badge>
                    </div>
                    <p className="text-sm mb-3">Discussion about Bitcoin's current technical setup and potential price movements...</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>234 replies</span>
                      <span>1.2k views</span>
                      <span>45 participants</span>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={traders[1].avatar} />
                          <AvatarFallback>{traders[1].name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">Risk Management Strategies</h4>
                          <p className="text-sm text-muted-foreground">Started by {traders[1].name} • 5 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mb-3">Sharing best practices for managing risk in volatile crypto markets...</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>89 replies</span>
                      <span>567 views</span>
                      <span>23 participants</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}