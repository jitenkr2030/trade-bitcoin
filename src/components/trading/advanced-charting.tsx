'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
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
  BarChart, 
  Bar,
  ReferenceLine,
  ReferenceArea
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Settings, 
  Download,
  Save,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  MousePointer,
  Type,
  Square,
  Circle,
  ArrowRight,
  Zap,
  BarChart3,
  Layers,
  Eye,
  EyeOff,
  Minus
} from 'lucide-react'

interface ChartDataPoint {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  timestamp: number
}

interface DrawingTool {
  type: 'trendline' | 'horizontal' | 'vertical' | 'rectangle' | 'circle' | 'text' | 'arrow'
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  color: string
  text?: string
  isVisible: boolean
}

interface TechnicalIndicator {
  id: string
  name: string
  type: 'overlay' | 'oscillator'
  parameters: Record<string, any>
  data: any[]
  isVisible: boolean
  color: string
}

interface AdvancedChartingProps {
  symbol: string
  data: ChartDataPoint[]
  onIndicatorChange?: (indicator: TechnicalIndicator) => void
  onDrawingChange?: (drawing: DrawingTool) => void
}

export function AdvancedCharting({ 
  symbol, 
  data, 
  onIndicatorChange,
  onDrawingChange 
}: AdvancedChartingProps) {
  const [chartType, setChartType] = useState<'line' | 'candlestick' | 'area' | 'bar'>('candlestick')
  const [timeframe, setTimeframe] = useState('1h')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedTool, setSelectedTool] = useState<'cursor' | 'trendline' | 'horizontal' | 'vertical' | 'rectangle' | 'circle' | 'text' | 'arrow'>('cursor')
  const [drawings, setDrawings] = useState<DrawingTool[]>([])
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<Partial<DrawingTool> | null>(null)
  const [showVolume, setShowVolume] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [crosshairVisible, setCrosshairVisible] = useState(true)
  
  const chartRef = useRef<HTMLDivElement>(null)

  const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w', '1M']
  const chartTypes = [
    { value: 'line', label: 'Line Chart', icon: TrendingUp },
    { value: 'candlestick', label: 'Candlestick', icon: BarChart3 },
    { value: 'area', label: 'Area Chart', icon: Activity },
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 }
  ]

  const drawingTools = [
    { value: 'cursor', label: 'Cursor', icon: MousePointer },
    { value: 'trendline', label: 'Trend Line', icon: ArrowRight },
    { value: 'horizontal', label: 'Horizontal Line', icon: Minus },
    { value: 'vertical', label: 'Vertical Line', icon: RotateCcw },
    { value: 'rectangle', label: 'Rectangle', icon: Square },
    { value: 'circle', label: 'Circle', icon: Circle },
    { value: 'text', label: 'Text', icon: Type },
    { value: 'arrow', label: 'Arrow', icon: ArrowRight }
  ]

  const availableIndicators = [
    { 
      name: 'Moving Average', 
      type: 'overlay' as const,
      parameters: { period: 20, type: 'SMA' },
      defaultColor: '#3b82f6'
    },
    { 
      name: 'Exponential MA', 
      type: 'overlay' as const,
      parameters: { period: 20 },
      defaultColor: '#ef4444'
    },
    { 
      name: 'Bollinger Bands', 
      type: 'overlay' as const,
      parameters: { period: 20, stdDev: 2 },
      defaultColor: '#8b5cf6'
    },
    { 
      name: 'RSI', 
      type: 'oscillator' as const,
      parameters: { period: 14 },
      defaultColor: '#f59e0b'
    },
    { 
      name: 'MACD', 
      type: 'oscillator' as const,
      parameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
      defaultColor: '#10b981'
    },
    { 
      name: 'Stochastic', 
      type: 'oscillator' as const,
      parameters: { kPeriod: 14, dPeriod: 3, slowing: 3 },
      defaultColor: '#f97316'
    }
  ]

  // Generate mock indicator data
  const generateIndicatorData = (indicator: TechnicalIndicator, baseData: ChartDataPoint[]) => {
    switch (indicator.name) {
      case 'Moving Average':
      case 'Exponential MA':
        return baseData.map((point, index) => ({
          ...point,
          value: point.close + (Math.random() - 0.5) * 100
        }))
      
      case 'Bollinger Bands':
        return baseData.map((point, index) => ({
          ...point,
          upper: point.close + 50 + Math.random() * 20,
          middle: point.close,
          lower: point.close - 50 - Math.random() * 20
        }))
      
      case 'RSI':
        return baseData.map((point, index) => ({
          ...point,
          value: 30 + Math.random() * 40
        }))
      
      case 'MACD':
        return baseData.map((point, index) => ({
          ...point,
          macd: (Math.random() - 0.5) * 10,
          signal: (Math.random() - 0.5) * 8,
          histogram: (Math.random() - 0.5) * 5
        }))
      
      case 'Stochastic':
        return baseData.map((point, index) => ({
          ...point,
          k: 20 + Math.random() * 60,
          d: 25 + Math.random() * 50
        }))
      
      default:
        return baseData
    }
  }

  const addIndicator = (indicatorTemplate: typeof availableIndicators[0]) => {
    const newIndicator: TechnicalIndicator = {
      id: Date.now().toString(),
      name: indicatorTemplate.name,
      type: indicatorTemplate.type,
      parameters: indicatorTemplate.parameters,
      data: [],
      isVisible: true,
      color: indicatorTemplate.defaultColor
    }
    
    newIndicator.data = generateIndicatorData(newIndicator, data)
    setIndicators(prev => [...prev, newIndicator])
    onIndicatorChange?.(newIndicator)
  }

  const removeIndicator = (id: string) => {
    setIndicators(prev => prev.filter(ind => ind.id !== id))
  }

  const toggleIndicatorVisibility = (id: string) => {
    setIndicators(prev => 
      prev.map(ind => 
        ind.id === id ? { ...ind, isVisible: !ind.isVisible } : ind
      )
    )
  }

  const startDrawing = (e: React.MouseEvent) => {
    if (selectedTool === 'cursor') return
    
    const rect = chartRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsDrawing(true)
    setCurrentDrawing({
      type: selectedTool,
      id: Date.now().toString(),
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      color: '#3b82f6',
      isVisible: true
    })
  }

  const updateDrawing = (e: React.MouseEvent) => {
    if (!isDrawing || !currentDrawing) return
    
    const rect = chartRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setCurrentDrawing(prev => ({
      ...prev,
      endX: x,
      endY: y
    }))
  }

  const endDrawing = () => {
    if (!isDrawing || !currentDrawing) return
    
    const newDrawing: DrawingTool = {
      type: currentDrawing.type!,
      id: currentDrawing.id!,
      startX: currentDrawing.startX!,
      startY: currentDrawing.startY!,
      endX: currentDrawing.endX!,
      endY: currentDrawing.endY!,
      color: currentDrawing.color!,
      isVisible: true
    }
    
    setDrawings(prev => [...prev, newDrawing])
    setIsDrawing(false)
    setCurrentDrawing(null)
    onDrawingChange?.(newDrawing)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) => index % 10 === 0 ? value : ''}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-green-600">
                        Price: {formatCurrency(data.close)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Volume: {formatNumber(data.volume / 1000000, 2)}M
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            {/* Overlay indicators */}
            {indicators.filter(ind => ind.type === 'overlay' && ind.isVisible).map(indicator => (
              <Line
                key={indicator.id}
                type="monotone"
                dataKey="value"
                data={indicator.data}
                stroke={indicator.color}
                strokeWidth={1.5}
                dot={false}
                name={indicator.name}
              />
            ))}
          </LineChart>
        )
      
      case 'area':
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) => index % 10 === 0 ? value : ''}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-green-600">
                        Price: {formatCurrency(data.close)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Volume: {formatNumber(data.volume / 1000000, 2)}M
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        )
      
      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) => index % 10 === 0 ? value : ''}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Open: <span className="font-medium">{formatCurrency(data.open)}</span></div>
                        <div>High: <span className="font-medium text-green-600">{formatCurrency(data.high)}</span></div>
                        <div>Low: <span className="font-medium text-red-600">{formatCurrency(data.low)}</span></div>
                        <div>Close: <span className="font-medium">{formatCurrency(data.close)}</span></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Volume: {formatNumber(data.volume / 1000000, 2)}M
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey={(data) => data.close >= data.open ? data.close - data.open : 0}
              fill="hsl(var(--green-600))"
              stackId="price"
            />
            <Bar
              dataKey={(data) => data.close < data.open ? data.open - data.close : 0}
              fill="hsl(var(--red-600))"
              stackId="price"
            />
          </BarChart>
        )
      
      case 'candlestick':
      default:
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) => index % 10 === 0 ? value : ''}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Open: <span className="font-medium">{formatCurrency(data.open)}</span></div>
                        <div>High: <span className="font-medium text-green-600">{formatCurrency(data.high)}</span></div>
                        <div>Low: <span className="font-medium text-red-600">{formatCurrency(data.low)}</span></div>
                        <div>Close: <span className="font-medium">{formatCurrency(data.close)}</span></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Volume: {formatNumber(data.volume / 1000000, 2)}M
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey={(data) => data.close >= data.open ? data.close - data.open : 0}
              fill="hsl(var(--green-600))"
              stackId="price"
            />
            <Bar
              dataKey={(data) => data.close < data.open ? data.open - data.close : 0}
              fill="hsl(var(--red-600))"
              stackId="price"
            />
          </BarChart>
        )
    }
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Chart Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{symbol}</h2>
          <p className="text-muted-foreground">Advanced Charting with Technical Analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Layout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Left Sidebar - Drawing Tools */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Drawing Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {drawingTools.map(tool => {
                const Icon = tool.icon
                return (
                  <Button
                    key={tool.value}
                    variant={selectedTool === tool.value ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedTool(tool.value as any)}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tool.label}
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Chart Area */}
        <div className="col-span-8">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframes.map(tf => (
                        <SelectItem key={tf} value={tf}>{tf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center gap-1">
                    {chartTypes.map(type => {
                      const Icon = type.icon
                      return (
                        <Button
                          key={type.value}
                          variant={chartType === type.value ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setChartType(type.value as any)}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      )
                    })}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-1">
                    <Switch
                      id="volume"
                      checked={showVolume}
                      onCheckedChange={setShowVolume}
                    />
                    <Label htmlFor="volume" className="text-xs">Volume</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Switch
                      id="grid"
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                    <Label htmlFor="grid" className="text-xs">Grid</Label>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                ref={chartRef}
                className="relative h-[600px] w-full"
                onMouseDown={startDrawing}
                onMouseMove={updateDrawing}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
              >
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
                
                {/* Drawings overlay */}
                <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
                  {drawings.filter(d => d.isVisible).map(drawing => {
                    if (drawing.type === 'trendline') {
                      return (
                        <line
                          key={drawing.id}
                          x1={drawing.startX}
                          y1={drawing.startY}
                          x2={drawing.endX}
                          y2={drawing.endY}
                          stroke={drawing.color}
                          strokeWidth={2}
                        />
                      )
                    }
                    if (drawing.type === 'horizontal') {
                      return (
                        <line
                          key={drawing.id}
                          x1={0}
                          y1={drawing.startY}
                          x2="100%"
                          y2={drawing.startY}
                          stroke={drawing.color}
                          strokeWidth={2}
                          strokeDasharray="5,5"
                        />
                      )
                    }
                    if (drawing.type === 'vertical') {
                      return (
                        <line
                          key={drawing.id}
                          x1={drawing.startX}
                          y1={0}
                          x2={drawing.startX}
                          y2="100%"
                          stroke={drawing.color}
                          strokeWidth={2}
                          strokeDasharray="5,5"
                        />
                      )
                    }
                    if (drawing.type === 'rectangle') {
                      return (
                        <rect
                          key={drawing.id}
                          x={Math.min(drawing.startX, drawing.endX)}
                          y={Math.min(drawing.startY, drawing.endY)}
                          width={Math.abs(drawing.endX - drawing.startX)}
                          height={Math.abs(drawing.endY - drawing.startY)}
                          stroke={drawing.color}
                          strokeWidth={2}
                          fill="none"
                        />
                      )
                    }
                    return null
                  })}
                  
                  {/* Current drawing in progress */}
                  {isDrawing && currentDrawing && (
                    <>
                      {currentDrawing.type === 'trendline' && (
                        <line
                          x1={currentDrawing.startX}
                          y1={currentDrawing.startY}
                          x2={currentDrawing.endX}
                          y2={currentDrawing.endY}
                          stroke={currentDrawing.color}
                          strokeWidth={2}
                        />
                      )}
                      {currentDrawing.type === 'horizontal' && (
                        <line
                          x1={0}
                          y1={currentDrawing.startY}
                          x2="100%"
                          y2={currentDrawing.startY}
                          stroke={currentDrawing.color}
                          strokeWidth={2}
                          strokeDasharray="5,5"
                        />
                      )}
                      {currentDrawing.type === 'vertical' && (
                        <line
                          x1={currentDrawing.startX}
                          y1={0}
                          x2={currentDrawing.startX}
                          y2="100%"
                          stroke={currentDrawing.color}
                          strokeWidth={2}
                          strokeDasharray="5,5"
                        />
                      )}
                    </>
                  )}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Indicators */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Indicators
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-medium">Add Indicator</Label>
                <Select onValueChange={(value) => {
                  const indicator = availableIndicators.find(ind => ind.name === value)
                  if (indicator) addIndicator(indicator)
                }}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select indicator" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableIndicators.map(indicator => (
                      <SelectItem key={indicator.name} value={indicator.name}>
                        {indicator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-medium">Active Indicators</Label>
                {indicators.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No indicators added</p>
                ) : (
                  <div className="space-y-2">
                    {indicators.map(indicator => (
                      <div key={indicator.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: indicator.color }}
                          />
                          <span className="text-sm font-medium">{indicator.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {indicator.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleIndicatorVisibility(indicator.id)}
                          >
                            {indicator.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeIndicator(indicator.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}