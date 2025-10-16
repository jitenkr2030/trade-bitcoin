"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Eye,
  Settings,
  Maximize2,
  Minimize2
} from "lucide-react"

interface OrderBookLevel {
  price: number
  bidVolume: number
  askVolume: number
  totalBid: number
  totalAsk: number
  bidCount?: number
  askCount?: number
}

interface MarketDepthData {
  levels: OrderBookLevel[]
  spread: number
  midPrice: number
  totalBidVolume: number
  totalAskVolume: number
  bidAskRatio: number
  lastUpdate: Date
}

interface MarketDepthChartProps {
  symbol?: string
  exchangeAccountId?: string
  height?: number
  showControls?: boolean
  onFullscreen?: () => void
}

// Generate realistic market depth data
const generateMarketDepthData = (symbol: string = 'BTCUSDT'): MarketDepthData => {
  const basePrice = symbol === 'BTCUSDT' ? 43250 : symbol === 'ETHUSDT' ? 2500 : 100
  const levels: OrderBookLevel[] = []
  let cumulativeBid = 0
  let cumulativeAsk = 0
  
  // Generate asks (selling orders above current price)
  for (let i = 15; i >= 1; i--) {
    const price = basePrice + i * (basePrice * 0.001) // 0.1% intervals
    const volume = Math.random() * 2.5 + 0.1 // Random volume between 0.1 and 2.6
    const orderCount = Math.floor(Math.random() * 20) + 1 // 1-20 orders
    cumulativeAsk += volume
    
    levels.push({
      price: Number(price.toFixed(2)),
      bidVolume: 0,
      askVolume: Number(volume.toFixed(4)),
      totalBid: 0,
      totalAsk: Number(cumulativeAsk.toFixed(4)),
      askCount: orderCount
    })
  }
  
  // Current price level
  levels.push({
    price: Number(basePrice.toFixed(2)),
    bidVolume: 0,
    askVolume: 0,
    totalBid: 0,
    totalAsk: 0
  })
  
  // Generate bids (buying orders below current price)
  for (let i = 1; i <= 15; i++) {
    const price = basePrice - i * (basePrice * 0.001)
    const volume = Math.random() * 2.5 + 0.1
    const orderCount = Math.floor(Math.random() * 20) + 1
    cumulativeBid += volume
    
    levels.push({
      price: Number(price.toFixed(2)),
      bidVolume: Number(volume.toFixed(4)),
      askVolume: 0,
      totalBid: Number(cumulativeBid.toFixed(4)),
      totalAsk: 0,
      bidCount: orderCount
    })
  }
  
  // Calculate spread and other metrics
  const bestBid = levels.find(l => l.bidVolume > 0)?.price || basePrice - 0.1
  const bestAsk = levels.find(l => l.askVolume > 0)?.price || basePrice + 0.1
  const spread = bestAsk - bestBid
  const midPrice = (bestBid + bestAsk) / 2
  
  return {
    levels: levels.sort((a, b) => a.price - b.price),
    spread: Number(spread.toFixed(2)),
    midPrice: Number(midPrice.toFixed(2)),
    totalBidVolume: Number(cumulativeBid.toFixed(4)),
    totalAskVolume: Number(cumulativeAsk.toFixed(4)),
    bidAskRatio: Number((cumulativeBid / cumulativeAsk).toFixed(3)),
    lastUpdate: new Date()
  }
}

export function MarketDepthChart({ 
  symbol = 'BTCUSDT', 
  exchangeAccountId,
  height = 400,
  showControls = true,
  onFullscreen
}: MarketDepthChartProps) {
  const [marketData, setMarketData] = useState<MarketDepthData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'depth' | 'ladder'>('depth')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      const data = generateMarketDepthData(symbol)
      setMarketData(data)
      setIsLoading(false)
    }

    loadData()
    
    // Simulate real-time updates
    const interval = setInterval(loadData, 3000)
    
    return () => clearInterval(interval)
  }, [symbol])

  const handleRefresh = () => {
    setIsLoading(true)
    const data = generateMarketDepthData(symbol)
    setMarketData(data)
    setIsLoading(false)
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium mb-2">Price: {formatCurrency(label)}</p>
          {data.bidVolume > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-green-600">
                Bid Volume: {formatNumber(data.bidVolume)}
              </p>
              {data.bidCount && (
                <p className="text-xs text-green-500">
                  Orders: {data.bidCount}
                </p>
              )}
              {data.totalBid > 0 && (
                <p className="text-xs text-green-700">
                  Cumulative: {formatNumber(data.totalBid)}
                </p>
              )}
            </div>
          )}
          {data.askVolume > 0 && (
            <div className="space-y-1 mt-2">
              <p className="text-sm text-red-600">
                Ask Volume: {formatNumber(data.askVolume)}
              </p>
              {data.askCount && (
                <p className="text-xs text-red-500">
                  Orders: {data.askCount}
                </p>
              )}
              {data.totalAsk > 0 && (
                <p className="text-xs text-red-700">
                  Cumulative: {formatNumber(data.totalAsk)}
                </p>
              )}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  if (isLoading || !marketData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Depth
            <Badge variant="outline">{symbol}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
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
            <CardTitle>Market Depth</CardTitle>
            <Badge variant="outline">{symbol}</Badge>
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
              {marketData.bidAskRatio}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Total Bid:</span>
            <Badge variant="outline">{formatNumber(marketData.totalBidVolume)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Total Ask:</span>
            <Badge variant="outline">{formatNumber(marketData.totalAskVolume)}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'depth' | 'ladder')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="depth">Depth Chart</TabsTrigger>
            <TabsTrigger value="ladder">Order Ladder</TabsTrigger>
          </TabsList>

          <TabsContent value="depth" className="space-y-4">
            <div style={{ height: `${height * zoomLevel}px` }} className="w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.levels}>
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
                    dataKey="totalAsk"
                    stackId="1"
                    stroke="hsl(var(--red-600))"
                    fill="hsl(var(--red-600))"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalBid"
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
                {marketData.levels
                  .filter(level => level.bidVolume > 0)
                  .sort((a, b) => b.price - a.price)
                  .slice(0, 10)
                  .map((level, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div className="text-sm">
                        <div className="font-medium">{formatCurrency(level.price)}</div>
                        <div className="text-xs text-green-600">
                          {level.bidCount} orders
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {formatNumber(level.bidVolume)}
                        </div>
                        <div className="text-xs text-green-700">
                          {formatNumber(level.totalBid)}
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
                {marketData.levels
                  .filter(level => level.askVolume > 0)
                  .sort((a, b) => a.price - b.price)
                  .slice(0, 10)
                  .map((level, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <div className="text-sm">
                        <div className="font-medium">{formatCurrency(level.price)}</div>
                        <div className="text-xs text-red-600">
                          {level.askCount} orders
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-red-600">
                          {formatNumber(level.askVolume)}
                        </div>
                        <div className="text-xs text-red-700">
                          {formatNumber(level.totalAsk)}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-muted-foreground">
          Last updated: {marketData.lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}