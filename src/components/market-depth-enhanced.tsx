"use client"

import { useState, useEffect, useRef } from "react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Eye,
  Settings,
  Maximize2,
  Minimize2,
  Zap,
  Layers,
  Activity,
  Target,
  Thermometer
} from "lucide-react"
import { Level2MarketDataService, Level2Data, MarketDepthAnalysis } from "@/lib/market-data/level2-service"

interface MarketDepthEnhancedProps {
  symbol?: string
  exchangeAccountId?: string
  height?: number
  showControls?: boolean
  onFullscreen?: () => void
}

interface AreaChartData {
  x: number
  y: number
  value: number
}

export function MarketDepthEnhanced({ 
  symbol = 'BTCUSDT', 
  exchangeAccountId,
  height = 600,
  showControls = true,
  onFullscreen
}: MarketDepthEnhancedProps) {
  const [marketData, setMarketData] = useState<Level2Data | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'depth' | 'ladder' | 'heatmap' | 'analysis'>('depth')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const [depthLevels, setDepthLevels] = useState(50)
  const [updateFrequency, setUpdateFrequency] = useState(1000)
  const level2Service = useRef<Level2MarketDataService>(new Level2MarketDataService())

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await level2Service.current.getAggregatedLevel2Data(symbol)
        setMarketData(data)
        
        // Set initial price range
        if (data.bids.length > 0 && data.asks.length > 0) {
          const minPrice = Math.min(...data.bids.map(b => b.price), ...data.asks.map(a => a.price))
          const maxPrice = Math.max(...data.bids.map(b => b.price), ...data.asks.map(a => a.price))
          const range = maxPrice - minPrice
          setPriceRange([
            minPrice - range * 0.1,
            maxPrice + range * 0.1
          ])
        }
      } catch (error) {
        console.error('Failed to load market depth data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Set up real-time updates
    level2Service.current.subscribeLevel2(
      symbol,
      (data) => {
        setMarketData(data)
      },
      undefined,
      updateFrequency
    )

    return () => {
      // Since subscribeLevel2 returns Promise<void>, we don't need to unsubscribe
      // The service should handle cleanup internally
    }
  }, [symbol, updateFrequency])

  const handleRefresh = () => {
    setIsLoading(true)
    level2Service.current.getAggregatedLevel2Data(symbol)
      .then(data => {
        setMarketData(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Failed to refresh market depth data:', error)
        setIsLoading(false)
      })
  }

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => direction === 'in' ? Math.min(prev * 1.2, 5) : Math.max(prev / 1.2, 0.5))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    onFullscreen?.()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value: number, decimals: number = 4) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
  }

  const generateAreaChartData = (data: Level2Data): AreaChartData[] => {
    const areaChartData: AreaChartData[] = []
    const { bids, asks } = data
    
    // Create a grid for the heatmap
    const priceStep = (priceRange[1] - priceRange[0]) / 50
    const quantityStep = Math.max(...bids.map(b => b.quantity), ...asks.map(a => a.quantity)) / 20

    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 20; j++) {
        const price = priceRange[0] + (i * priceStep)
        const quantity = j * quantityStep
        
        // Calculate liquidity at this price/quantity level
        const bidLiquidity = bids
          .filter(bid => Math.abs(bid.price - price) <= priceStep / 2)
          .reduce((sum, bid) => sum + bid.quantity, 0)
        
        const askLiquidity = asks
          .filter(ask => Math.abs(ask.price - price) <= priceStep / 2)
          .reduce((sum, ask) => sum + ask.quantity, 0)
        
        const totalLiquidity = bidLiquidity + askLiquidity
        
        if (totalLiquidity > 0) {
          areaChartData.push({
            x: i,
            y: j,
            value: totalLiquidity
          })
        }
      }
    }

    return areaChartData
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">Price: {formatCurrency(label)}</p>
          {data.totalBidQuantity > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-green-600">
                Bid Volume: {formatNumber(data.totalBidQuantity)}
              </p>
              {data.bidOrderCount > 0 && (
                <p className="text-xs text-green-500">
                  Orders: {data.bidOrderCount}
                </p>
              )}
              {data.cumulativeBid > 0 && (
                <p className="text-xs text-green-700">
                  Cumulative: {formatNumber(data.cumulativeBid)}
                </p>
              )}
            </div>
          )}
          {data.totalAskQuantity > 0 && (
            <div className="space-y-1 mt-2">
              <p className="text-sm text-red-600">
                Ask Volume: {formatNumber(data.totalAskQuantity)}
              </p>
              {data.askOrderCount > 0 && (
                <p className="text-xs text-red-500">
                  Orders: {data.askOrderCount}
                </p>
              )}
              {data.cumulativeAsk > 0 && (
                <p className="text-xs text-red-700">
                  Cumulative: {formatNumber(data.cumulativeAsk)}
                </p>
              )}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const AnalysisPanel = ({ analysis }: { analysis: MarketDepthAnalysis }) => (
    <div className="space-y-4">
      {/* Market Pressure */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.max(0, analysis.orderFlowImbalance * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Buy Pressure</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            analysis.marketPressure === 'bullish' ? 'text-green-600' :
            analysis.marketPressure === 'bearish' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {analysis.marketPressure.toUpperCase()}
          </div>
          <div className="text-sm text-gray-600">Market Pressure</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {Math.max(0, -analysis.orderFlowImbalance * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Sell Pressure</div>
        </div>
      </div>

      {/* Support & Resistance Levels */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-green-600 mb-2">Support Levels</h4>
          <div className="space-y-1">
            {analysis.supportLevels.slice(0, 3).map((level, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{formatCurrency(level.price)}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{(level.strength * 100).toFixed(0)}%</Badge>
                  <Badge variant="secondary">{formatNumber(level.volume)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-red-600 mb-2">Resistance Levels</h4>
          <div className="space-y-1">
            {analysis.resistanceLevels.slice(0, 3).map((level, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{formatCurrency(level.price)}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{(level.strength * 100).toFixed(0)}%</Badge>
                  <Badge variant="secondary">{formatNumber(level.volume)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Liquidity Zones */}
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Thermometer className="h-4 w-4" />
          Liquidity Zones
        </h4>
        <div className="space-y-2">
          {analysis.liquidityZones.slice(0, 3).map((zone, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  {formatCurrency(zone.priceRange.min)} - {formatCurrency(zone.priceRange.max)}
                </span>
                <Badge variant="outline">{formatNumber(zone.totalVolume)}</Badge>
              </div>
              <div className="text-xs text-gray-600">
                {zone.orderCount} orders • {zone.type} • Density: {zone.density.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Large Orders */}
      <div>
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Target className="h-4 w-4" />
          Large Orders Detected
        </h4>
        <div className="text-sm text-gray-600">
          Order flow analysis shows {analysis.orderFlowImbalance > 0 ? 'buying' : 'selling'} pressure
        </div>
      </div>
    </div>
  )

  if (isLoading || !marketData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Enhanced Market Depth
            <Badge variant="outline">{symbol}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[600px]">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 m-0" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <CardTitle>Enhanced Market Depth</CardTitle>
            <Badge variant="outline">{symbol}</Badge>
            <Badge variant={marketData.marketDepth.marketPressure === 'bullish' ? 'default' : 
                          marketData.marketDepth.marketPressure === 'bearish' ? 'destructive' : 'secondary'}>
              {marketData.marketDepth.marketPressure}
            </Badge>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom('out')}
                disabled={zoomLevel <= 0.5}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom('in')}
                disabled={zoomLevel >= 5}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Spread:</span>
            <Badge variant="secondary">{formatCurrency(marketData.spread)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Mid Price:</span>
            <Badge variant="secondary">{formatCurrency(marketData.midPrice)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Bid/Ask Ratio:</span>
            <Badge variant={marketData.bidAskRatio > 1 ? "default" : "destructive"}>
              {marketData.bidAskRatio.toFixed(3)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Total Depth:</span>
            <Badge variant="outline">
              {formatNumber(marketData.totalBidVolume + marketData.totalAskVolume)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Update: {updateFrequency}ms</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="depth">Depth Chart</TabsTrigger>
            <TabsTrigger value="ladder">Order Ladder</TabsTrigger>
            <TabsTrigger value="heatmap">Liquidity Heatmap</TabsTrigger>
            <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="depth" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span>Depth Levels:</span>
                <Slider
                  value={[depthLevels]}
                  onValueChange={(value) => setDepthLevels(value[0])}
                  max={200}
                  min={10}
                  step={10}
                  className="w-32"
                />
                <span className="text-sm">{depthLevels}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Update Freq:</span>
                <Select value={updateFrequency.toString()} onValueChange={(value) => setUpdateFrequency(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500">500ms</SelectItem>
                    <SelectItem value="1000">1s</SelectItem>
                    <SelectItem value="2000">2s</SelectItem>
                    <SelectItem value="5000">5s</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div style={{ height: `${height * zoomLevel}px` }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.priceLevels.slice(0, depthLevels)}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="price" 
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    domain={['dataMin', 'dataMax']}
                  />
                  <YAxis 
                    className="text-xs"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="cumulativeAsk"
                    stackId="1"
                    stroke="hsl(var(--red-600))"
                    fill="hsl(var(--red-600))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeBid"
                    stackId="2"
                    stroke="hsl(var(--green-600))"
                    fill="hsl(var(--green-600))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="ladder" className="space-y-4">
            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {/* Bids */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Bids (Buy Orders)
                </h4>
                {marketData.bids
                  .slice(0, 20)
                  .map((bid, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div className="text-sm">
                        <div className="font-medium">{formatCurrency(bid.price)}</div>
                        <div className="text-xs text-green-600">
                          {bid.orderCount} orders • {bid.exchange}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {formatNumber(bid.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Asks */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Asks (Sell Orders)
                </h4>
                {marketData.asks
                  .slice(0, 20)
                  .map((ask, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <div className="text-sm">
                        <div className="font-medium">{formatCurrency(ask.price)}</div>
                        <div className="text-xs text-red-600">
                          {ask.orderCount} orders • {ask.exchange}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">
                          {formatNumber(ask.quantity)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-4">
            <div style={{ height: `${height * zoomLevel}px` }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={generateAreaChartData(marketData)}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="x"
                    type="number"
                    domain={[0, 49]}
                    tickCount={6}
                  />
                  <YAxis 
                    dataKey="y"
                    type="number"
                    domain={[0, 19]}
                    tickCount={4}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatNumber(value), 'Liquidity']}
                    labelFormatter={(value: number) => `Price: ${formatCurrency(priceRange[0] + (value * (priceRange[1] - priceRange[0]) / 50))}`}
                  />
                  <Area 
                    dataKey="value"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm text-gray-600 text-center">
              <Thermometer className="h-4 w-4 inline mr-1" />
              Liquidity Heatmap - Brighter areas indicate higher liquidity concentrations
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <AnalysisPanel analysis={marketData.marketDepth} />
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>Last updated: {new Date(marketData.timestamp).toLocaleTimeString()}</span>
          <div className="flex items-center gap-4">
            <span>Levels: {marketData.bids.length + marketData.asks.length}</span>
            <span>Exchanges: {Array.from(new Set([...marketData.bids.map(b => b.exchange), ...marketData.asks.map(a => a.exchange)])).length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}