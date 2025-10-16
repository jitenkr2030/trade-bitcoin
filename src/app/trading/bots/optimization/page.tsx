'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Download, 
  Upload,
  Save,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Brain,
  Activity,
  Award,
  Clock,
  DollarSign,
  Percent,
  Filter,
  Search,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Layers,
  GitBranch,
  Shuffle,
  Grid3X3,
  Gauge,
  Thermometer,
  Zap as ZapIcon,
  Shield,
  Trophy,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  PieChart,
  ScatterChart,
  BarChart
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
  ScatterChart as RechartsScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart
} from 'recharts'

interface OptimizationParameter {
  name: string
  type: 'number' | 'select' | 'boolean'
  min?: number
  max?: number
  step?: number
  defaultValue: any
  options?: string[]
  description: string
}

interface OptimizationStrategy {
  id: string
  name: string
  description: string
  parameters: OptimizationParameter[]
  currentValues: { [key: string]: any }
  performance: {
    return: number
    sharpe: number
    winRate: number
    maxDrawdown: number
    profitFactor: number
  }
}

interface OptimizationJob {
  id: string
  strategyId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  method: 'grid_search' | 'random_search' | 'genetic' | 'bayesian' | 'particle_swarm'
  parameters: string[]
  iterations: number
  completedIterations: number
  startTime: string
  endTime?: string
  bestResult?: {
    parameters: { [key: string]: any }
    performance: {
      return: number
      sharpe: number
      winRate: number
      maxDrawdown: number
      profitFactor: number
    }
  }
  results: Array<{
    parameters: { [key: string]: any }
    performance: {
      return: number
      sharpe: number
      winRate: number
      maxDrawdown: number
      profitFactor: number
    }
    iteration: number
  }>
}

interface OptimizationMetric {
  name: string
  weight: number
  maximize: boolean
  description: string
}

const mockStrategies: OptimizationStrategy[] = [
  {
    id: '1',
    name: 'RSI Momentum Strategy',
    description: 'RSI-based momentum trading with dynamic parameters',
    parameters: [
      {
        name: 'rsi_period',
        type: 'number',
        min: 5,
        max: 30,
        step: 1,
        defaultValue: 14,
        description: 'RSI calculation period'
      },
      {
        name: 'overbought_level',
        type: 'number',
        min: 60,
        max: 90,
        step: 1,
        defaultValue: 70,
        description: 'Overbought threshold level'
      },
      {
        name: 'oversold_level',
        type: 'number',
        min: 10,
        max: 40,
        step: 1,
        defaultValue: 30,
        description: 'Oversold threshold level'
      },
      {
        name: 'position_size',
        type: 'number',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 2,
        description: 'Position size as percentage of capital'
      },
      {
        name: 'stop_loss',
        type: 'number',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 3,
        description: 'Stop loss percentage'
      },
      {
        name: 'take_profit',
        type: 'number',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 6,
        description: 'Take profit percentage'
      }
    ],
    currentValues: {
      rsi_period: 14,
      overbought_level: 70,
      oversold_level: 30,
      position_size: 2,
      stop_loss: 3,
      take_profit: 6
    },
    performance: {
      return: 18.5,
      sharpe: 1.8,
      winRate: 65.2,
      maxDrawdown: -12.3,
      profitFactor: 2.1
    }
  },
  {
    id: '2',
    name: 'Bollinger Bands Strategy',
    description: 'Bollinger Bands mean reversion with volatility adjustment',
    parameters: [
      {
        name: 'bb_period',
        type: 'number',
        min: 10,
        max: 50,
        step: 1,
        defaultValue: 20,
        description: 'Bollinger Bands period'
      },
      {
        name: 'bb_stddev',
        type: 'number',
        min: 1,
        max: 3,
        step: 0.1,
        defaultValue: 2,
        description: 'Standard deviations for bands'
      },
      {
        name: 'rsi_filter',
        type: 'boolean',
        defaultValue: true,
        description: 'Enable RSI filter'
      },
      {
        name: 'volume_filter',
        type: 'boolean',
        defaultValue: false,
        description: 'Enable volume filter'
      }
    ],
    currentValues: {
      bb_period: 20,
      bb_stddev: 2,
      rsi_filter: true,
      volume_filter: false
    },
    performance: {
      return: 22.3,
      sharpe: 2.1,
      winRate: 68.5,
      maxDrawdown: -8.5,
      profitFactor: 2.4
    }
  }
]

const mockOptimizationJobs: OptimizationJob[] = [
  {
    id: '1',
    strategyId: '1',
    status: 'completed',
    method: 'genetic',
    parameters: ['rsi_period', 'overbought_level', 'oversold_level', 'position_size'],
    iterations: 100,
    completedIterations: 100,
    startTime: '2024-01-15T10:00:00Z',
    endTime: '2024-01-15T14:30:00Z',
    bestResult: {
      parameters: {
        rsi_period: 12,
        overbought_level: 75,
        oversold_level: 25,
        position_size: 3.5
      },
      performance: {
        return: 28.5,
        sharpe: 2.8,
        winRate: 72.3,
        maxDrawdown: -9.2,
        profitFactor: 3.1
      }
    },
    results: [
      {
        parameters: { rsi_period: 12, overbought_level: 75, oversold_level: 25, position_size: 3.5 },
        performance: { return: 28.5, sharpe: 2.8, winRate: 72.3, maxDrawdown: -9.2, profitFactor: 3.1 },
        iteration: 85
      },
      {
        parameters: { rsi_period: 14, overbought_level: 70, oversold_level: 30, position_size: 2 },
        performance: { return: 18.5, sharpe: 1.8, winRate: 65.2, maxDrawdown: -12.3, profitFactor: 2.1 },
        iteration: 1
      }
    ]
  },
  {
    id: '2',
    strategyId: '1',
    status: 'running',
    method: 'bayesian',
    parameters: ['rsi_period', 'overbought_level', 'oversold_level'],
    iterations: 50,
    completedIterations: 32,
    startTime: '2024-01-15T15:00:00Z',
    results: []
  }
]

const optimizationMethods = [
  { value: 'grid_search', label: 'Grid Search', description: 'Exhaustive search over parameter space' },
  { value: 'random_search', label: 'Random Search', description: 'Random sampling of parameter combinations' },
  { value: 'genetic', label: 'Genetic Algorithm', description: 'Evolutionary optimization approach' },
  { value: 'bayesian', label: 'Bayesian Optimization', description: 'Probabilistic model-based optimization' },
  { value: 'particle_swarm', label: 'Particle Swarm', description: 'Swarm intelligence optimization' }
]

const defaultMetrics: OptimizationMetric[] = [
  { name: 'Return', weight: 0.3, maximize: true, description: 'Total return percentage' },
  { name: 'Sharpe Ratio', weight: 0.3, maximize: true, description: 'Risk-adjusted returns' },
  { name: 'Win Rate', weight: 0.2, maximize: true, description: 'Percentage of winning trades' },
  { name: 'Max Drawdown', weight: 0.2, maximize: false, description: 'Maximum portfolio drawdown' }
]

export default function OptimizationPage() {
  const [selectedStrategy, setSelectedStrategy] = useState<OptimizationStrategy>(mockStrategies[0])
  const [optimizationJobs, setOptimizationJobs] = useState<OptimizationJob[]>(mockOptimizationJobs)
  const [selectedMethod, setSelectedMethod] = useState('genetic')
  const [selectedParameters, setSelectedParameters] = useState<string[]>(['rsi_period', 'overbought_level', 'oversold_level'])
  const [iterations, setIterations] = useState(100)
  const [metrics, setMetrics] = useState<OptimizationMetric[]>(defaultMetrics)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [currentJob, setCurrentJob] = useState<OptimizationJob | null>(null)
  const [activeTab, setActiveTab] = useState('strategies')

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'grid_search': return <Grid3X3 className="h-4 w-4" />
      case 'random_search': return <Shuffle className="h-4 w-4" />
      case 'genetic': return <Brain className="h-4 w-4" />
      case 'bayesian': return <Target className="h-4 w-4" />
      case 'particle_swarm': return <ZapIcon className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'running': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getPerformanceColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const handleParameterToggle = (paramName: string) => {
    setSelectedParameters(prev => 
      prev.includes(paramName) 
        ? prev.filter(p => p !== paramName)
        : [...prev, paramName]
    )
  }

  const startOptimization = () => {
    if (selectedParameters.length === 0) {
      alert('Please select at least one parameter to optimize')
      return
    }

    const newJob: OptimizationJob = {
      id: Date.now().toString(),
      strategyId: selectedStrategy.id,
      status: 'running',
      method: selectedMethod as any,
      parameters: selectedParameters,
      iterations,
      completedIterations: 0,
      startTime: new Date().toISOString(),
      results: []
    }

    setOptimizationJobs(prev => [newJob, ...prev])
    setCurrentJob(newJob)
    setIsOptimizing(true)

    // Simulate optimization progress
    const progressInterval = setInterval(() => {
      setOptimizationJobs(prev => prev.map(job => {
        if (job.id === newJob.id && job.status === 'running') {
          const completed = Math.min(job.completedIterations + 1, iterations)
          const updatedJob = { ...job, completedIterations: completed }
          
          if (completed >= iterations) {
            updatedJob.status = 'completed'
            updatedJob.endTime = new Date().toISOString()
            updatedJob.bestResult = {
              parameters: {
                rsi_period: Math.floor(Math.random() * 20) + 10,
                overbought_level: Math.floor(Math.random() * 20) + 65,
                oversold_level: Math.floor(Math.random() * 15) + 20,
                position_size: Math.random() * 5 + 1
              },
              performance: {
                return: Math.random() * 20 + 20,
                sharpe: Math.random() * 1.5 + 2,
                winRate: Math.random() * 15 + 65,
                maxDrawdown: -(Math.random() * 8 + 5),
                profitFactor: Math.random() * 1.5 + 2
              }
            }
            clearInterval(progressInterval)
            setIsOptimizing(false)
          }
          
          return updatedJob
        }
        return job
      }))
    }, 1000)
  }

  const stopOptimization = () => {
    setIsOptimizing(false)
    if (currentJob) {
      setOptimizationJobs(prev => prev.map(job => 
        job.id === currentJob.id 
          ? { ...job, status: 'failed', endTime: new Date().toISOString() }
          : job
      ))
    }
  }

  const calculateObjectiveScore = (performance: any) => {
    return metrics.reduce((score, metric) => {
      const value = performance[metric.name.toLowerCase().replace(' ', '_')]
      const normalizedValue = metric.maximize ? value : -value
      return score + (normalizedValue * metric.weight)
    }, 0)
  }

  const optimizationProgress = currentJob ? (currentJob.completedIterations / currentJob.iterations) * 100 : 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Strategy Optimization</h1>
          <p className="text-muted-foreground">
            Advanced parameter optimization for trading strategies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Strategy
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{optimizationJobs.length}</div>
                <div className="text-sm text-muted-foreground">Total Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {optimizationJobs.filter(job => job.status === 'running').length}
                </div>
                <div className="text-sm text-muted-foreground">Running</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">
                  {optimizationJobs.filter(job => job.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {optimizationJobs.reduce((sum, job) => sum + (job.results?.length || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Results</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strategies">Strategies</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-6">
          {/* Strategy Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Strategy to Optimize</CardTitle>
              <CardDescription>Choose a trading strategy and configure its parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {mockStrategies.map(strategy => (
                  <Card 
                    key={strategy.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedStrategy.id === strategy.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedStrategy(strategy)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{strategy.name}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Return</p>
                          <p className={`font-semibold ${getPerformanceColor(strategy.performance.return)}`}>
                            {formatPercent(strategy.performance.return)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sharpe</p>
                          <p className="font-semibold">{strategy.performance.sharpe}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Win Rate</p>
                          <p className="font-semibold">{strategy.performance.winRate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max DD</p>
                          <p className={`font-semibold ${getPerformanceColor(strategy.performance.maxDrawdown)}`}>
                            {formatPercent(strategy.performance.maxDrawdown)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategy Parameters */}
          <Card>
            <CardHeader>
              <CardTitle>Strategy Parameters</CardTitle>
              <CardDescription>Current parameter values and optimization settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedStrategy.parameters.map(param => (
                    <div key={param.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">{param.name}</Label>
                          <p className="text-xs text-muted-foreground">{param.description}</p>
                        </div>
                        <Switch
                          checked={selectedParameters.includes(param.name)}
                          onCheckedChange={() => handleParameterToggle(param.name)}
                        />
                      </div>
                      
                      {param.type === 'number' && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{param.min}</span>
                            <span>Current: {selectedStrategy.currentValues[param.name]}</span>
                            <span>{param.max}</span>
                          </div>
                          <Slider
                            value={[selectedStrategy.currentValues[param.name]]}
                            onValueChange={(value) => {
                              setSelectedStrategy(prev => ({
                                ...prev,
                                currentValues: {
                                  ...prev.currentValues,
                                  [param.name]: value[0]
                                }
                              }))
                            }}
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            className="w-full"
                          />
                        </div>
                      )}
                      
                      {param.type === 'boolean' && (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={selectedStrategy.currentValues[param.name]}
                            onCheckedChange={(checked) => {
                              setSelectedStrategy(prev => ({
                                ...prev,
                                currentValues: {
                                  ...prev.currentValues,
                                  [param.name]: checked
                                }
                              }))
                            }}
                          />
                          <span className="text-sm">
                            {selectedStrategy.currentValues[param.name] ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      )}
                      
                      {selectedParameters.includes(param.name) && (
                        <Badge variant="secondary" className="text-xs">
                          Will be optimized
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Optimization Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Configuration</CardTitle>
              <CardDescription>Configure optimization method and parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Optimization Method */}
              <div>
                <Label className="text-sm font-medium">Optimization Method</Label>
                <div className="grid gap-4 md:grid-cols-2 mt-2">
                  {optimizationMethods.map(method => (
                    <Card 
                      key={method.value}
                      className={`cursor-pointer transition-colors ${
                        selectedMethod === method.value ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedMethod(method.value)}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-3">
                          {getMethodIcon(method.value)}
                          <div>
                            <h3 className="font-medium">{method.label}</h3>
                            <p className="text-xs text-muted-foreground">{method.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Optimization Settings */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="iterations">Iterations</Label>
                  <Input 
                    id="iterations"
                    type="number" 
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value) || 100)}
                    min={10}
                    max={1000}
                  />
                </div>
                <div>
                  <Label htmlFor="parallel-jobs">Parallel Jobs</Label>
                  <Select defaultValue="4">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optimization Metrics */}
              <div>
                <Label className="text-sm font-medium">Optimization Metrics</Label>
                <div className="space-y-3 mt-2">
                  {metrics.map((metric, index) => (
                    <div key={metric.name} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <span className="font-medium">{metric.name}</span>
                        <p className="text-xs text-muted-foreground">{metric.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={metric.maximize ? 'default' : 'secondary'}>
                          {metric.maximize ? 'Maximize' : 'Minimize'}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newMetrics = [...metrics]
                              newMetrics[index].weight = Math.max(0, newMetrics[index].weight - 0.1)
                              setMetrics(newMetrics)
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{metric.weight.toFixed(1)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newMetrics = [...metrics]
                              newMetrics[index].weight = Math.min(1, newMetrics[index].weight + 0.1)
                              setMetrics(newMetrics)
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Optimization */}
              <div className="flex gap-2">
                <Button 
                  onClick={startOptimization} 
                  disabled={isOptimizing || selectedParameters.length === 0}
                  className="flex-1"
                >
                  {isOptimizing ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Optimization
                    </>
                  )}
                </Button>
                {isOptimizing && (
                  <Button variant="outline" onClick={stopOptimization}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>

              {/* Progress */}
              {isOptimizing && currentJob && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{currentJob.completedIterations} / {currentJob.iterations}</span>
                  </div>
                  <Progress value={optimizationProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Method: {optimizationMethods.find(m => m.value === currentJob.method)?.label}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {/* Optimization Jobs */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Jobs</CardTitle>
              <CardDescription>History of optimization runs and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationJobs.map(job => {
                  const strategy = mockStrategies.find(s => s.id === job.strategyId)
                  return (
                    <div key={job.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getMethodIcon(job.method)}
                          <div>
                            <h3 className="font-semibold">{strategy?.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {optimizationMethods.find(m => m.value === job.method)?.label} • {job.parameters.length} parameters
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {job.completedIterations} / {job.iterations}
                          </span>
                        </div>
                      </div>

                      {job.bestResult && (
                        <div className="grid gap-4 md:grid-cols-5 text-sm">
                          <div>
                            <p className="text-muted-foreground">Return</p>
                            <p className={`font-semibold ${getPerformanceColor(job.bestResult.performance.return)}`}>
                              {formatPercent(job.bestResult.performance.return)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sharpe</p>
                            <p className="font-semibold">{job.bestResult.performance.sharpe}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Win Rate</p>
                            <p className="font-semibold">{job.bestResult.performance.winRate}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Max DD</p>
                            <p className={`font-semibold ${getPerformanceColor(job.bestResult.performance.maxDrawdown)}`}>
                              {formatPercent(job.bestResult.performance.maxDrawdown)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Profit Factor</p>
                            <p className="font-semibold">{job.bestResult.performance.profitFactor}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Started: {new Date(job.startTime).toLocaleString()}
                          {job.endTime && ` • Ended: ${new Date(job.endTime).toLocaleString()}`}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Save className="h-3 w-3 mr-1" />
                            Save Results
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Optimization Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Parameter Sensitivity */}
            <Card>
              <CardHeader>
                <CardTitle>Parameter Sensitivity</CardTitle>
                <CardDescription>Impact of parameter changes on performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={[
                      { parameter: 'RSI Period', impact: 0.8 },
                      { parameter: 'Overbought', impact: 0.6 },
                      { parameter: 'Oversold', impact: 0.5 },
                      { parameter: 'Position Size', impact: 0.9 },
                      { parameter: 'Square Loss', impact: 0.4 },
                      { parameter: 'Take Profit', impact: 0.3 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="parameter" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="impact" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Progress</CardTitle>
                <CardDescription>Performance improvement over iterations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={[
                      { iteration: 1, score: 1.2 },
                      { iteration: 10, score: 1.8 },
                      { iteration: 20, score: 2.1 },
                      { iteration: 30, score: 2.4 },
                      { iteration: 40, score: 2.7 },
                      { iteration: 50, score: 2.9 },
                      { iteration: 60, score: 3.1 },
                      { iteration: 70, score: 3.2 },
                      { iteration: 80, score: 3.3 },
                      { iteration: 90, score: 3.4 },
                      { iteration: 100, score: 3.5 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="iteration" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Parameter Correlation */}
            <Card>
              <CardHeader>
                <CardTitle>Parameter Correlation</CardTitle>
                <CardDescription>Correlation between parameters and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsScatterChart data={[
                      { x: 12, y: 28.5, z: 3.5 },
                      { x: 14, y: 18.5, z: 2.0 },
                      { x: 16, y: 22.3, z: 2.5 },
                      { x: 18, y: 25.1, z: 3.0 },
                      { x: 20, y: 20.8, z: 2.2 },
                      { x: 22, y: 24.7, z: 2.8 },
                      { x: 24, y: 27.2, z: 3.2 },
                      { x: 26, y: 23.5, z: 2.6 },
                      { x: 28, y: 26.8, z: 3.1 },
                      { x: 30, y: 21.9, z: 2.4 }
                    ]}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="RSI Period" />
                      <YAxis type="number" dataKey="y" name="Return %" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter fill="#8884d8" />
                    </RechartsScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Distribution of optimization results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { return: 10, count: 2 },
                      { return: 15, count: 8 },
                      { return: 20, count: 15 },
                      { return: 25, count: 25 },
                      { return: 30, count: 20 },
                      { return: 35, count: 12 },
                      { return: 40, count: 6 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="return" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}