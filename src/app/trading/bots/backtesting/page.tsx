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
  Square,
  Play, 
  Pause, 
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
  ArrowLeft
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

interface BacktestConfig {
  id: string;
  name: string;
  symbol: string;
  timeframe: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  strategy: {
    type: string;
    indicators: string[];
    parameters: Record<string, any>;
  };
  riskManagement: {
    maxPositionSize: number;
    stopLoss: number;
    takeProfit: number;
    maxDrawdown: number;
  };
}

interface BacktestResult {
  id: string;
  config: BacktestConfig;
  performance: {
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    calmarRatio: number;
    winRate: number;
    profitFactor: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    avgWin: number;
    avgLoss: number;
    largestWin: number;
    largestLoss: number;
    avgTradeDuration: string;
  };
  equity: Array<{ date: string; value: number; benchmark?: number }>;
  trades: Array<{
    id: string;
    symbol: string;
    type: 'buy' | 'sell';
    entryTime: string;
    exitTime?: string;
    entryPrice: number;
    exitPrice?: number;
    quantity: number;
    profit?: number;
    profitPercent?: number;
    status: 'open' | 'closed';
    duration?: string;
  }>;
  drawdown: Array<{ date: string; value: number }>;
  monthlyReturns: Array<{ month: string; return: number }>;
  metrics: {
    beta: number;
    alpha: number;
    informationRatio: number;
    treynorRatio: number;
    var95: number;
    var99: number;
    expectedShortfall: number;
  };
  executionStats: {
    totalExecutionTime: number;
    avgExecutionTime: number;
    dataPointsProcessed: number;
    memoryUsed: number;
    cpuUsage: number;
  };
}

interface OptimizationResult {
  id: string;
  parameters: Record<string, any>;
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
  rank: number;
}

export default function BacktestingEnginePage() {
  const [activeTab, setActiveTab] = useState('config');
  const [selectedConfig, setSelectedConfig] = useState<BacktestConfig | null>(null);
  const [backtestResults, setBacktestResults] = useState<BacktestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);

  // Mock configuration
  const [configs, setConfigs] = useState<BacktestConfig[]>([
    {
      id: '1',
      name: 'BTC Momentum Strategy',
      symbol: 'BTCUSDT',
      timeframe: '1h',
      startDate: '2023-01-01',
      endDate: '2024-01-01',
      initialCapital: 10000,
      strategy: {
        type: 'momentum',
        indicators: ['RSI', 'MACD', 'SMA'],
        parameters: {
          rsiPeriod: 14,
          rsiOverbought: 70,
          rsiOversold: 30,
          macdFast: 12,
          macdSlow: 26,
          macdSignal: 9,
          smaPeriod: 50,
        },
      },
      riskManagement: {
        maxPositionSize: 0.1,
        stopLoss: 2,
        takeProfit: 4,
        maxDrawdown: 20,
      },
    },
  ]);

  // Mock results
  const [mockResults] = useState<BacktestResult>({
    id: '1',
    config: configs[0],
    performance: {
      totalReturn: 45.2,
      annualizedReturn: 52.1,
      sharpeRatio: 1.85,
      sortinoRatio: 2.34,
      maxDrawdown: 12.8,
      calmarRatio: 4.07,
      winRate: 68.5,
      profitFactor: 2.15,
      totalTrades: 234,
      winningTrades: 160,
      losingTrades: 74,
      avgWin: 234.50,
      avgLoss: 156.20,
      largestWin: 1250.00,
      largestLoss: 450.00,
      avgTradeDuration: '8.5 hours',
    },
    equity: [
      { date: '2023-01-01', value: 10000, benchmark: 10000 },
      { date: '2023-02-01', value: 10500, benchmark: 10200 },
      { date: '2023-03-01', value: 11200, benchmark: 10500 },
      { date: '2023-04-01', value: 10800, benchmark: 9800 },
      { date: '2023-05-01', value: 12500, benchmark: 11500 },
      { date: '2023-06-01', value: 13200, benchmark: 12000 },
      { date: '2023-07-01', value: 12800, benchmark: 11800 },
      { date: '2023-08-01', value: 14200, benchmark: 13000 },
      { date: '2023-09-01', value: 13800, benchmark: 12500 },
      { date: '2023-10-01', value: 15200, benchmark: 14000 },
      { date: '2023-11-01', value: 14800, benchmark: 13500 },
      { date: '2023-12-01', value: 14520, benchmark: 13200 },
    ],
    trades: [
      {
        id: '1',
        symbol: 'BTCUSDT',
        type: 'buy',
        entryTime: '2023-01-02 10:00',
        exitTime: '2023-01-02 18:30',
        entryPrice: 16500,
        exitPrice: 16800,
        quantity: 0.1,
        profit: 30,
        profitPercent: 1.82,
        status: 'closed',
        duration: '8.5 hours',
      },
      {
        id: '2',
        symbol: 'BTCUSDT',
        type: 'sell',
        entryTime: '2023-01-03 14:00',
        exitTime: '2023-01-03 16:45',
        entryPrice: 16900,
        exitPrice: 16700,
        quantity: 0.08,
        profit: 16,
        profitPercent: 0.94,
        status: 'closed',
        duration: '2.75 hours',
      },
    ],
    drawdown: [
      { date: '2023-01-01', value: 0 },
      { date: '2023-01-15', value: -2.5 },
      { date: '2023-02-01', value: -5.2 },
      { date: '2023-02-15', value: -8.1 },
      { date: '2023-03-01', value: -3.2 },
      { date: '2023-03-15', value: -1.8 },
      { date: '2023-04-01', value: -12.8 },
      { date: '2023-04-15', value: -8.5 },
      { date: '2023-05-01', value: -2.1 },
      { date: '2023-05-15', value: -0.5 },
    ],
    monthlyReturns: [
      { month: 'Jan', return: 5.2 },
      { month: 'Feb', return: 6.8 },
      { month: 'Mar', return: -3.6 },
      { month: 'Apr', return: 15.7 },
      { month: 'May', return: 5.6 },
      { month: 'Jun', return: 5.6 },
      { month: 'Jul', return: -3.0 },
      { month: 'Aug', return: 10.9 },
      { month: 'Sep', return: -2.8 },
      { month: 'Oct', return: 10.1 },
      { month: 'Nov', return: -2.6 },
      { month: 'Dec', return: -1.9 },
    ],
    metrics: {
      beta: 0.85,
      alpha: 0.15,
      informationRatio: 1.2,
      treynorRatio: 0.45,
      var95: 5.2,
      var99: 8.7,
      expectedShortfall: 12.3,
    },
    executionStats: {
      totalExecutionTime: 45.2,
      avgExecutionTime: 0.19,
      dataPointsProcessed: 8760,
      memoryUsed: 256,
      cpuUsage: 45,
    },
  });

  useEffect(() => {
    setBacktestResults([mockResults]);
  }, []);

  const handleRunBacktest = async () => {
    if (!selectedConfig) return;
    
    setIsRunning(true);
    setProgress(0);
    
    // Simulate backtest execution
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
  };

  const handleOptimizeStrategy = async () => {
    if (!selectedConfig) return;
    
    setIsRunning(true);
    setProgress(0);
    
    // Simulate optimization
    setTimeout(() => {
      const mockOptimization: OptimizationResult[] = [
        {
          id: '1',
          parameters: { rsiPeriod: 14, stopLoss: 2, takeProfit: 4 },
          performance: { totalReturn: 45.2, sharpeRatio: 1.85, maxDrawdown: 12.8, winRate: 68.5 },
          rank: 1,
        },
        {
          id: '2',
          parameters: { rsiPeriod: 12, stopLoss: 1.5, takeProfit: 3 },
          performance: { totalReturn: 42.8, sharpeRatio: 1.72, maxDrawdown: 11.2, winRate: 65.3 },
          rank: 2,
        },
        {
          id: '3',
          parameters: { rsiPeriod: 16, stopLoss: 2.5, takeProfit: 5 },
          performance: { totalReturn: 38.9, sharpeRatio: 1.58, maxDrawdown: 14.5, winRate: 71.2 },
          rank: 3,
        },
      ];
      
      setOptimizationResults(mockOptimization);
      setIsRunning(false);
      setProgress(100);
    }, 3000);
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
          <h1 className="text-3xl font-bold">Backtesting Engine</h1>
          <p className="text-muted-foreground">
            Advanced strategy testing with comprehensive analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={() => handleRunBacktest()} disabled={isRunning || !selectedConfig}>
            {isRunning ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Run Backtest
          </Button>
          <Button variant="outline" onClick={() => handleOptimizeStrategy()} disabled={isRunning || !selectedConfig}>
            <Sliders className="h-4 w-4 mr-2" />
            Optimize
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Running backtest...</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Strategy Configuration</CardTitle>
                <CardDescription>Configure your backtest parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="configSelect">Select Configuration</Label>
                    <Select value={selectedConfig?.id || ''} onValueChange={(value) => {
                      const config = configs.find(c => c.id === value);
                      setSelectedConfig(config || null);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select configuration" />
                      </SelectTrigger>
                      <SelectContent>
                        {configs.map(config => (
                          <SelectItem key={config.id} value={config.id}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedConfig && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="symbol">Symbol</Label>
                          <Input value={selectedConfig.symbol} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="timeframe">Timeframe</Label>
                          <Input value={selectedConfig.timeframe} readOnly />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input type="date" value={selectedConfig.startDate} readOnly />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date</Label>
                          <Input type="date" value={selectedConfig.endDate} readOnly />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="initialCapital">Initial Capital ($)</Label>
                        <Input type="number" value={selectedConfig.initialCapital} readOnly />
                      </div>

                      <div>
                        <Label>Strategy Type</Label>
                        <Input value={selectedConfig.strategy.type} readOnly />
                      </div>

                      <div>
                        <Label>Indicators</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedConfig.strategy.indicators.map(indicator => (
                            <Badge key={indicator} variant="outline">{indicator}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
                <CardDescription>Configure risk parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedConfig && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="maxPositionSize">Max Position Size (%)</Label>
                      <Input type="number" value={selectedConfig.riskManagement.maxPositionSize * 100} readOnly />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                        <Input type="number" value={selectedConfig.riskManagement.stopLoss} readOnly />
                      </div>
                      <div>
                        <Label htmlFor="takeProfit">Take Profit (%)</Label>
                        <Input type="number" value={selectedConfig.riskManagement.takeProfit} readOnly />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="maxDrawdown">Max Drawdown (%)</Label>
                      <Input type="number" value={selectedConfig.riskManagement.maxDrawdown} readOnly />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {backtestResults.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Return</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(backtestResults[0].performance.totalReturn)}`}>
                        {backtestResults[0].performance.totalReturn > 0 ? '+' : ''}{backtestResults[0].performance.totalReturn}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Annualized Return</p>
                      <p className={`text-lg font-semibold ${getPerformanceColor(backtestResults[0].performance.annualizedReturn)}`}>
                        {backtestResults[0].performance.annualizedReturn > 0 ? '+' : ''}{backtestResults[0].performance.annualizedReturn}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sharpe Ratio</p>
                      <p className="text-lg font-semibold">{backtestResults[0].performance.sharpeRatio}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Max Drawdown</p>
                      <p className="text-lg font-semibold text-red-600">
                        -{backtestResults[0].performance.maxDrawdown}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Win Rate</p>
                      <p className="text-lg font-semibold">{backtestResults[0].performance.winRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Profit Factor</p>
                      <p className="text-lg font-semibold">{backtestResults[0].performance.profitFactor}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Equity Curve</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={backtestResults[0].equity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" fill="#8884d8" fillOpacity={0.3} stroke="#8884d8" />
                        <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" strokeDasharray="5 5" />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          {backtestResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>Detailed trade execution history</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {backtestResults[0].trades.map((trade) => (
                      <div key={trade.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge variant={trade.type === 'buy' ? 'default' : 'secondary'}>
                              {trade.type.toUpperCase()}
                            </Badge>
                            <div>
                              <p className="font-medium">{trade.symbol}</p>
                              <p className="text-sm text-muted-foreground">{trade.entryTime}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{trade.quantity} @ ${trade.entryPrice}</p>
                            {trade.exitPrice && (
                              <p className={`text-sm ${getPerformanceColor(trade.profit || 0)}`}>
                                {trade.profit && trade.profit > 0 ? '+' : ''}{trade.profit?.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {backtestResults.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Drawdown Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={backtestResults[0].drawdown}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={backtestResults[0].monthlyReturns}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="return" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Beta</p>
                      <p className="font-semibold">{backtestResults[0].metrics.beta}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Alpha</p>
                      <p className={`font-semibold ${getPerformanceColor(backtestResults[0].metrics.alpha)}`}>
                        {backtestResults[0].metrics.alpha > 0 ? '+' : ''}{backtestResults[0].metrics.alpha}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Information Ratio</p>
                      <p className="font-semibold">{backtestResults[0].metrics.informationRatio}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Treynor Ratio</p>
                      <p className="font-semibold">{backtestResults[0].metrics.treynorRatio}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">VaR (95%)</p>
                      <p className="font-semibold text-red-600">{backtestResults[0].metrics.var95}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">VaR (99%)</p>
                      <p className="font-semibold text-red-600">{backtestResults[0].metrics.var99}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Execution Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Execution Time</p>
                      <p className="font-semibold">{backtestResults[0].executionStats.totalExecutionTime}s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg Execution Time</p>
                      <p className="font-semibold">{backtestResults[0].executionStats.avgExecutionTime}s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Data Points</p>
                      <p className="font-semibold">{backtestResults[0].executionStats.dataPointsProcessed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Memory Used</p>
                      <p className="font-semibold">{backtestResults[0].executionStats.memoryUsed}MB</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          {optimizationResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Optimization Results</CardTitle>
                <CardDescription>Parameter optimization results ranked by performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationResults.map((result) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">#{result.rank}</Badge>
                          <h4 className="font-semibold">Parameter Set {result.id}</h4>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Return</p>
                            <p className={`font-semibold ${getPerformanceColor(result.performance.totalReturn)}`}>
                              {result.performance.totalReturn > 0 ? '+' : ''}{result.performance.totalReturn}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sharpe</p>
                            <p className="font-semibold">{result.performance.sharpeRatio}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Max DD</p>
                            <p className="font-semibold text-red-600">-{result.performance.maxDrawdown}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Win Rate</p>
                            <p className="font-semibold">{result.performance.winRate}%</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {Object.entries(result.parameters).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-muted-foreground">{key}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}