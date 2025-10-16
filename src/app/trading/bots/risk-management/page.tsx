'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  Activity,
  Target,
  Zap,
  Calendar,
  Clock,
  Award,
  Settings,
  Plus,
  Minus,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Save,
  RefreshCw,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  Lock,
  Unlock,
  Gauge,
  Thermometer,
  Zap as ZapIcon,
  ShieldAlert,
  TrendingDown as TrendingDownIcon
} from 'lucide-react'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  ScatterChart,
  Scatter,
  Legend
} from 'recharts'

interface RiskRule {
  id: string
  name: string
  type: 'position_size' | 'stop_loss' | 'take_profit' | 'drawdown' | 'volatility' | 'correlation' | 'exposure'
  status: 'active' | 'inactive' | 'triggered'
  description: string
  config: {
    threshold: number
    action: 'warn' | 'reduce' | 'close' | 'stop'
    timeframe: string
    symbol?: string
    maxPositions?: number
    maxExposure?: number
  }
  lastTriggered?: string
  triggerCount: number
}

interface RiskMetrics {
  portfolio: {
    totalValue: number
    totalExposure: number
    cashBalance: number
    marginUsed: number
    marginAvailable: number
    marginLevel: number
  }
  positions: {
    totalPositions: number
    longPositions: number
    shortPositions: number
    largestPosition: number
    averagePositionSize: number
    concentrationRisk: number
  }
  performance: {
    dailyPnL: number
    weeklyPnL: number
    monthlyPnL: number
    totalReturn: number
    sharpeRatio: number
    maxDrawdown: number
    currentDrawdown: number
  }
  risk: {
    var95: number
    var99: number
    expectedShortfall: number
    beta: number
    volatility: number
    correlationMatrix: { [key: string]: number }
  }
}

interface RiskAlert {
  id: string
  type: 'warning' | 'critical' | 'info'
  title: string
  message: string
  timestamp: string
  severity: 'low' | 'medium' | 'high'
  resolved: boolean
  action: string
}

const mockRiskRules: RiskRule[] = [
  {
    id: '1',
    name: 'Max Position Size',
    type: 'position_size',
    status: 'active',
    description: 'Limit individual position size to 10% of portfolio',
    config: {
      threshold: 10,
      action: 'warn',
      timeframe: 'realtime',
      maxPositions: 5,
      maxExposure: 50000
    },
    triggerCount: 3,
    lastTriggered: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Portfolio Drawdown Limit',
    type: 'drawdown',
    status: 'active',
    description: 'Stop trading if portfolio drawdown exceeds 15%',
    config: {
      threshold: 15,
      action: 'stop',
      timeframe: 'daily'
    },
    triggerCount: 0
  },
  {
    id: '3',
    name: 'Daily Loss Limit',
    type: 'stop_loss',
    status: 'active',
    description: 'Stop trading if daily loss exceeds 5%',
    config: {
      threshold: 5,
      action: 'stop',
      timeframe: 'daily'
    },
    triggerCount: 1,
    lastTriggered: '2024-01-14T09:15:00Z'
  },
  {
    id: '4',
    name: 'Volatility Filter',
    type: 'volatility',
    status: 'inactive',
    description: 'Reduce position size during high volatility periods',
    config: {
      threshold: 30,
      action: 'reduce',
      timeframe: 'hourly'
    },
    triggerCount: 0
  },
  {
    id: '5',
    name: 'Correlation Limit',
    type: 'correlation',
    status: 'active',
    description: 'Limit exposure to highly correlated assets',
    config: {
      threshold: 0.8,
      action: 'warn',
      timeframe: 'daily'
    },
    triggerCount: 2,
    lastTriggered: '2024-01-13T16:45:00Z'
  }
]

const mockRiskMetrics: RiskMetrics = {
  portfolio: {
    totalValue: 125000,
    totalExposure: 87500,
    cashBalance: 37500,
    marginUsed: 25000,
    marginAvailable: 100000,
    marginLevel: 500
  },
  positions: {
    totalPositions: 8,
    longPositions: 5,
    shortPositions: 3,
    largestPosition: 15000,
    averagePositionSize: 10937.5,
    concentrationRisk: 12
  },
  performance: {
    dailyPnL: 1250,
    weeklyPnL: 4800,
    monthlyPnL: 15200,
    totalReturn: 25.2,
    sharpeRatio: 2.1,
    maxDrawdown: -8.5,
    currentDrawdown: -2.1
  },
  risk: {
    var95: -4500,
    var99: -7200,
    expectedShortfall: -5800,
    beta: 0.85,
    volatility: 18.2,
    correlationMatrix: {
      'BTC/USD': 1.0,
      'ETH/USD': 0.72,
      'SOL/USD': 0.68,
      'BNB/USD': 0.65
    }
  }
}

const mockRiskAlerts: RiskAlert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'High Volatility Detected',
    message: 'BTC volatility exceeded 30% threshold. Consider reducing position sizes.',
    timestamp: '2024-01-15T14:30:00Z',
    severity: 'medium',
    resolved: false,
    action: 'Position sizes automatically reduced by 20%'
  },
  {
    id: '2',
    type: 'critical',
    title: 'Margin Level Low',
    message: 'Margin level dropped below 150%. Close positions or add funds.',
    timestamp: '2024-01-15T12:15:00Z',
    severity: 'high',
    resolved: true,
    action: 'Added $10,000 to margin account'
  },
  {
    id: '3',
    type: 'info',
    title: 'Daily Profit Target Reached',
    message: 'Daily profit target of $1,000 has been achieved.',
    timestamp: '2024-01-15T10:45:00Z',
    severity: 'low',
    resolved: true,
    action: 'Trading continues as normal'
  }
]

const riskLevelData = [
  { name: 'Low', value: 25, color: '#10b981' },
  { name: 'Medium', value: 45, color: '#f59e0b' },
  { name: 'High', value: 30, color: '#ef4444' }
]

const drawdownData = [
  { date: 'Jan 1', drawdown: 0, portfolio: 100000 },
  { date: 'Jan 2', drawdown: -2.1, portfolio: 97900 },
  { date: 'Jan 3', drawdown: -4.8, portfolio: 95200 },
  { date: 'Jan 4', drawdown: -8.5, portfolio: 91500 },
  { date: 'Jan 5', drawdown: -6.2, portfolio: 93800 },
  { date: 'Jan 6', drawdown: -3.1, portfolio: 96900 },
  { date: 'Jan 7', drawdown: -1.2, portfolio: 98800 },
  { date: 'Jan 8', drawdown: -2.1, portfolio: 97900 },
  { date: 'Jan 9', drawdown: 0, portfolio: 100000 },
  { date: 'Jan 10', drawdown: 1.2, portfolio: 101200 },
  { date: 'Jan 11', drawdown: 2.8, portfolio: 102800 },
  { date: 'Jan 12', drawdown: 1.5, portfolio: 101500 },
  { date: 'Jan 13', drawdown: 0.8, portfolio: 100800 },
  { date: 'Jan 14', drawdown: -0.5, portfolio: 99500 },
  { date: 'Jan 15', drawdown: -2.1, portfolio: 97900 }
]

export default function RiskManagementPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRule, setSelectedRule] = useState<RiskRule | null>(null)
  const [isEditingRule, setIsEditingRule] = useState(false)
  const [riskLevel, setRiskLevel] = useState(65)
  const [autoTrading, setAutoTrading] = useState(true)
  const [emergencyMode, setEmergencyMode] = useState(false)

  const getRiskLevelColor = (level: number) => {
    if (level < 30) return 'text-green-600'
    if (level < 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getRiskLevelBg = (level: number) => {
    if (level < 30) return 'bg-green-100'
    if (level < 70) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      case 'info': return 'border-blue-200 bg-blue-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const handleRuleToggle = (ruleId: string, active: boolean) => {
    // In a real app, this would update the backend
    console.log(`Toggling rule ${ruleId} to ${active}`)
  }

  const handleEmergencyStop = () => {
    setEmergencyMode(true)
    setAutoTrading(false)
    // In a real app, this would immediately stop all trading
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Risk Management</h1>
          <p className="text-muted-foreground">
            Advanced risk controls and portfolio protection
          </p>
        </div>
        <div className="flex gap-2">
          {emergencyMode ? (
            <Button variant="destructive" onClick={() => setEmergencyMode(false)}>
              <Unlock className="h-4 w-4 mr-2" />
              Disable Emergency Mode
            </Button>
          ) : (
            <Button variant="outline" onClick={handleEmergencyStop}>
              <ShieldAlert className="h-4 w-4 mr-2" />
              Emergency Stop
            </Button>
          )}
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Overall Risk Level */}
        <Card className={emergencyMode ? 'border-red-200 bg-red-50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Risk Level
              {emergencyMode && <Badge variant="destructive">EMERGENCY</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskLevelColor(riskLevel)}`}>
                {riskLevel}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Risk</div>
            </div>
            <Progress value={riskLevel} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Health */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Portfolio Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Value</p>
                <p className="font-semibold">{formatCurrency(mockRiskMetrics.portfolio.totalValue)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Daily P&L</p>
                <p className={`font-semibold ${getPerformanceColor(mockRiskMetrics.performance.dailyPnL)}`}>
                  {formatCurrency(mockRiskMetrics.performance.dailyPnL)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Exposure</p>
                <p className="font-semibold">{formatCurrency(mockRiskMetrics.portfolio.totalExposure)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Margin Level</p>
                <p className="font-semibold">{mockRiskMetrics.portfolio.marginLevel}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Rules */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Active Rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {mockRiskRules.filter(rule => rule.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Triggered</p>
                <p className="font-semibold text-yellow-600">
                  {mockRiskRules.filter(rule => rule.status === 'triggered').length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Inactive</p>
                <p className="font-semibold text-gray-600">
                  {mockRiskRules.filter(rule => rule.status === 'inactive').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {mockRiskAlerts.filter(alert => !alert.resolved).length}
              </div>
              <div className="text-sm text-muted-foreground">Unresolved</div>
            </div>
            <div className="space-y-2">
              {mockRiskAlerts.slice(0, 2).map(alert => (
                <div key={alert.id} className="flex items-center gap-2 text-xs">
                  {getAlertIcon(alert.type)}
                  <span className="truncate">{alert.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Risk Rules</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Risk Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Portfolio Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Risk Metrics</CardTitle>
                <CardDescription>Current risk exposure metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Value at Risk (95%)', value: mockRiskMetrics.risk.var95, suffix: '$', color: 'text-red-600' },
                  { label: 'Value at Risk (99%)', value: mockRiskMetrics.risk.var99, suffix: '$', color: 'text-red-600' },
                  { label: 'Expected Shortfall', value: mockRiskMetrics.risk.expectedShortfall, suffix: '$', color: 'text-red-600' },
                  { label: 'Portfolio Beta', value: mockRiskMetrics.risk.beta, suffix: '', color: 'text-blue-600' },
                  { label: 'Volatility', value: mockRiskMetrics.risk.volatility, suffix: '%', color: 'text-yellow-600' },
                  { label: 'Max Drawdown', value: mockRiskMetrics.performance.maxDrawdown, suffix: '%', color: 'text-red-600' }
                ].map(metric => (
                  <div key={metric.label} className="flex justify-between items-center">
                    <span className="text-sm">{metric.label}</span>
                    <span className={`font-semibold ${metric.color}`}>
                      {metric.suffix === '$' ? formatCurrency(Math.abs(metric.value)) : metric.value.toFixed(2)}{metric.suffix}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Position Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Position Analysis</CardTitle>
                <CardDescription>Current position breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Positions</p>
                    <p className="font-semibold">{mockRiskMetrics.positions.totalPositions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Long Positions</p>
                    <p className="font-semibold text-green-600">{mockRiskMetrics.positions.longPositions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Short Positions</p>
                    <p className="font-semibold text-red-600">{mockRiskMetrics.positions.shortPositions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Largest Position</p>
                    <p className="font-semibold">{formatCurrency(mockRiskMetrics.positions.largestPosition)}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Concentration Risk</span>
                    <span className="font-semibold">{mockRiskMetrics.positions.concentrationRisk}%</span>
                  </div>
                  <Progress value={mockRiskMetrics.positions.concentrationRisk} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Portfolio Exposure</span>
                    <span className="font-semibold">
                      {((mockRiskMetrics.portfolio.totalExposure / mockRiskMetrics.portfolio.totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(mockRiskMetrics.portfolio.totalExposure / mockRiskMetrics.portfolio.totalValue) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Drawdown Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Drawdown Analysis</CardTitle>
              <CardDescription>Historical drawdown and recovery periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={drawdownData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="drawdown"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      stroke="#ef4444"
                      name="Drawdown %"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="portfolio"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Portfolio Value"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          {/* Risk Rules List */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Management Rules</CardTitle>
              <CardDescription>Configure automated risk controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRiskRules.map(rule => (
                  <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.status === 'active'}
                          onCheckedChange={(checked) => handleRuleToggle(rule.id, checked)}
                        />
                        <div>
                          <h3 className="font-semibold">{rule.name}</h3>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                          {rule.status}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRule(rule)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Threshold:</span>
                        <span className="ml-1 font-semibold">{rule.config.threshold}{rule.type === 'position_size' || rule.type === 'drawdown' || rule.type === 'stop_loss' || rule.type === 'volatility' ? '%' : ''}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Action:</span>
                        <span className="ml-1 font-semibold">{rule.config.action}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span className="ml-1 font-semibold">{rule.config.timeframe}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Triggers:</span>
                        <span className="ml-1 font-semibold">{rule.triggerCount}</span>
                      </div>
                    </div>

                    {rule.lastTriggered && (
                      <div className="text-xs text-muted-foreground">
                        Last triggered: {new Date(rule.lastTriggered).toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add New Rule */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Risk Rule</CardTitle>
              <CardDescription>Create custom risk management rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input id="rule-name" placeholder="Enter rule name" />
                </div>
                <div>
                  <Label htmlFor="rule-type">Rule Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rule type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="position_size">Position Size</SelectItem>
                      <SelectItem value="stop_loss">Stop Loss</SelectItem>
                      <SelectItem value="take_profit">Take Profit</SelectItem>
                      <SelectItem value="drawdown">Drawdown</SelectItem>
                      <SelectItem value="volatility">Volatility</SelectItem>
                      <SelectItem value="correlation">Correlation</SelectItem>
                      <SelectItem value="exposure">Exposure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="threshold">Threshold</Label>
                  <Input id="threshold" type="number" placeholder="Enter threshold" />
                </div>
                <div>
                  <Label htmlFor="action">Action</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="reduce">Reduce Position</SelectItem>
                      <SelectItem value="close">Close Position</SelectItem>
                      <SelectItem value="stop">Stop Trading</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-4">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Active Risk Alerts</CardTitle>
              <CardDescription>Current risk warnings and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRiskAlerts.filter(alert => !alert.resolved).map(alert => (
                  <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h3 className="font-semibold">{alert.title}</h3>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            <span>Severity: {alert.severity}</span>
                            <span>Action: {alert.action}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert History */}
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Recent risk alerts and their resolution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRiskAlerts.map(alert => (
                  <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)} ${alert.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <h3 className="font-semibold">{alert.title}</h3>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            <span>Severity: {alert.severity}</span>
                            <span>Action: {alert.action}</span>
                            {alert.resolved && <span className="text-green-600">✓ Resolved</span>}
                          </div>
                        </div>
                      </div>
                      {alert.resolved && <CheckCircle className="h-5 w-5 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Risk Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Portfolio risk breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskLevelData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {riskLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Risk Metrics Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics Trend</CardTitle>
                <CardDescription>Historical risk metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={drawdownData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="drawdown"
                        stroke="#ef4444"
                        strokeWidth={2}
                        name="Drawdown %"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Correlation Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
              <CardDescription>Correlation between different assets in portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2 text-left font-semibold">Asset</th>
                      {Object.keys(mockRiskMetrics.risk.correlationMatrix).map(asset => (
                        <th key={asset} className="border p-2 text-center font-semibold">{asset}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(mockRiskMetrics.risk.correlationMatrix).map(([asset, correlations]) => (
                      <tr key={asset}>
                        <td className="border p-2 font-semibold">{asset}</td>
                        {Object.entries(mockRiskMetrics.risk.correlationMatrix).map(([targetAsset, correlation]) => (
                          <td key={targetAsset} className="border p-2 text-center">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              correlation > 0.7 ? 'bg-red-100 text-red-800' :
                              correlation > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                              correlation > -0.4 ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {correlation.toFixed(2)}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Risk Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Management Settings</CardTitle>
              <CardDescription>Global risk management preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Trading */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Auto Trading</h3>
                  <p className="text-sm text-muted-foreground">Enable automated trading execution</p>
                </div>
                <Switch
                  checked={autoTrading}
                  onCheckedChange={setAutoTrading}
                  disabled={emergencyMode}
                />
              </div>

              {/* Risk Level Target */}
              <div className="space-y-2">
                <Label>Risk Level Target: {riskLevel}%</Label>
                <Slider
                  value={[riskLevel]}
                  onValueChange={(value) => setRiskLevel(value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Moderate</span>
                  <span>Aggressive</span>
                </div>
              </div>

              {/* Position Sizing */}
              <div className="space-y-4">
                <h3 className="font-semibold">Position Sizing</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="max-position-size">Max Position Size (% of portfolio)</Label>
                    <Input id="max-position-size" type="number" defaultValue="10" />
                  </div>
                  <div>
                    <Label htmlFor="max-total-exposure">Max Total Exposure (% of portfolio)</Label>
                    <Input id="max-total-exposure" type="number" defaultValue="70" />
                  </div>
                </div>
              </div>

              {/* Stop Loss Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Stop Loss Settings</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="daily-loss-limit">Daily Loss Limit (%)</Label>
                    <Input id="daily-loss-limit" type="number" defaultValue="5" />
                  </div>
                  <div>
                    <Label htmlFor="weekly-loss-limit">Weekly Loss Limit (%)</Label>
                    <Input id="weekly-loss-limit" type="number" defaultValue="10" />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Notification Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Email Notifications</span>
                      <p className="text-xs text-muted-foreground">Receive risk alerts via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">SMS Notifications</span>
                      <p className="text-xs text-muted-foreground">Receive critical alerts via SMS</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Push Notifications</span>
                      <p className="text-xs text-muted-foreground">Receive alerts on mobile devices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
                <Button variant="outline">Reset to Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}