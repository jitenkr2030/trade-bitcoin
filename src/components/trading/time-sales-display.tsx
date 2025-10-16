"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Clock,
  BarChart3,
  Filter,
  Download,
  Settings,
  Eye,
  Maximize2,
  Minimize2
} from "lucide-react"

interface TradeData {
  id: string
  timestamp: Date
  price: number
  amount: number
  total: number
  side: 'buy' | 'sell'
  exchange?: string
  maker: boolean
  tradeId?: string
}

interface TimeSalesData {
  trades: TradeData[]
  totalVolume: number
  totalTrades: number
  averagePrice: number
  highPrice: number
  lowPrice: number
  buyVolume: number
  sellVolume: number
  lastUpdate: Date
}

interface TimeSalesDisplayProps {
  symbol?: string
  exchangeAccountId?: string
  height?: number
  showControls?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  onFullscreen?: () => void
}

// Generate realistic time & sales data
const generateTimeSalesData = (symbol: string = 'BTCUSDT'): TimeSalesData => {
  const basePrice = symbol === 'BTCUSDT' ? 43250 : symbol === 'ETHUSDT' ? 2500 : 100
  const trades: TradeData[] = []
  let totalVolume = 0
  let buyVolume = 0
  let sellVolume = 0
  let highPrice = basePrice
  let lowPrice = basePrice
  let totalPriceSum = 0
  
  const now = new Date()
  
  // Generate trades for the last few minutes
  for (let i = 0; i < 50; i++) {
    const timestamp = new Date(now.getTime() - (i * 2000 + Math.random() * 2000)) // Random times over last ~100 seconds
    const priceVariation = (Math.random() - 0.5) * (basePrice * 0.002) // ±0.1% variation
    const price = basePrice + priceVariation
    const amount = Math.random() * 0.5 + 0.01 // 0.01 to 0.51 units
    const total = price * amount
    const side = Math.random() > 0.5 ? 'buy' : 'sell'
    const maker = Math.random() > 0.3 // 70% maker, 30% taker
    
    trades.push({
      id: `trade_${i}_${timestamp.getTime()}`,
      timestamp,
      price: Number(price.toFixed(2)),
      amount: Number(amount.toFixed(6)),
      total: Number(total.toFixed(2)),
      side,
      maker,
      tradeId: `${Math.floor(Math.random() * 1000000)}`
    })
    
    totalVolume += amount
    totalPriceSum += price
    highPrice = Math.max(highPrice, price)
    lowPrice = Math.min(lowPrice, price)
    
    if (side === 'buy') {
      buyVolume += amount
    } else {
      sellVolume += amount
    }
  }
  
  return {
    trades: trades.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    totalVolume: Number(totalVolume.toFixed(6)),
    totalTrades: trades.length,
    averagePrice: Number((totalPriceSum / trades.length).toFixed(2)),
    highPrice: Number(highPrice.toFixed(2)),
    lowPrice: Number(lowPrice.toFixed(2)),
    buyVolume: Number(buyVolume.toFixed(6)),
    sellVolume: Number(sellVolume.toFixed(6)),
    lastUpdate: new Date()
  }
}

export function TimeSalesDisplay({ 
  symbol = 'BTCUSDT', 
  exchangeAccountId,
  height = 400,
  showControls = true,
  autoRefresh = true,
  refreshInterval = 3000,
  onFullscreen
}: TimeSalesDisplayProps) {
  const [timeSalesData, setTimeSalesData] = useState<TimeSalesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterSide, setFilterSide] = useState<'all' | 'buy' | 'sell'>('all')
  const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m' | '1h'>('5m')
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      const data = generateTimeSalesData(symbol)
      setTimeSalesData(data)
      setIsLoading(false)
    }

    loadData()
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [symbol, autoRefresh, refreshInterval])

  const handleRefresh = () => {
    setIsLoading(true)
    const data = generateTimeSalesData(symbol)
    setTimeSalesData(data)
    setIsLoading(false)
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

  const formatNumber = (value: number, decimals: number = 6) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getFilteredTrades = () => {
    if (!timeSalesData) return []
    
    let filtered = timeSalesData.trades
    
    if (filterSide !== 'all') {
      filtered = filtered.filter(trade => trade.side === filterSide)
    }
    
    // Apply time range filter
    const now = new Date()
    const rangeMs = {
      '1m': 60 * 1000,
      '5m': 5 * 60 * 1000,
      '15m': 15 * 60 * 1000,
      '1h': 60 * 60 * 1000
    }[timeRange]
    
    filtered = filtered.filter(trade => 
      now.getTime() - trade.timestamp.getTime() <= rangeMs
    )
    
    return filtered
  }

  const exportToCSV = () => {
    if (!timeSalesData) return
    
    const trades = getFilteredTrades()
    const headers = ['Time', 'Price', 'Amount', 'Total', 'Side', 'Type', 'Trade ID']
    const csvContent = [
      headers.join(','),
      ...trades.map(trade => [
        formatTime(trade.timestamp),
        trade.price,
        trade.amount,
        trade.total,
        trade.side,
        trade.maker ? 'Maker' : 'Taker',
        trade.tradeId
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${symbol}_time_sales_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading || !timeSalesData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Time & Sales
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

  const filteredTrades = getFilteredTrades()

  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 m-0" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <CardTitle>Time & Sales</CardTitle>
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
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4" />
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
            <span>Total Volume:</span>
            <Badge variant="secondary">{formatNumber(timeSalesData.totalVolume)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Trades:</span>
            <Badge variant="secondary">{timeSalesData.totalTrades}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Avg Price:</span>
            <Badge variant="secondary">{formatCurrency(timeSalesData.averagePrice)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>High:</span>
            <Badge variant="outline" className="text-green-600">{formatCurrency(timeSalesData.highPrice)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Low:</span>
            <Badge variant="outline" className="text-red-600">{formatCurrency(timeSalesData.lowPrice)}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Buy/Sell:</span>
            <Badge variant="outline" className="text-green-600">{formatNumber(timeSalesData.buyVolume)}</Badge>
            <span>/</span>
            <Badge variant="outline" className="text-red-600">{formatNumber(timeSalesData.sellVolume)}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filter:</span>
            <Select value={filterSide} onValueChange={(value) => setFilterSide(value as 'all' | 'buy' | 'sell')}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Time:</span>
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as '1m' | '5m' | '15m' | '1h')}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1m</SelectItem>
                <SelectItem value="5m">5m</SelectItem>
                <SelectItem value="15m">15m</SelectItem>
                <SelectItem value="1h">1h</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className={`${height}px`}>
          <div className="space-y-1">
            {filteredTrades.map((trade) => (
              <div
                key={trade.id}
                className={`flex items-center justify-between p-2 rounded-lg border ${
                  trade.side === 'buy' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-xs text-muted-foreground min-w-[60px]">
                    {formatTime(trade.timestamp)}
                  </div>
                  <div className={`font-medium min-w-[80px] ${
                    trade.side === 'buy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(trade.price)}
                  </div>
                  <div className="text-sm min-w-[70px]">
                    {formatNumber(trade.amount)}
                  </div>
                  <div className="text-sm font-medium min-w-[80px]">
                    {formatCurrency(trade.total)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={trade.side === 'buy' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {trade.side === 'buy' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {trade.side.toUpperCase()}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={`text-xs ${
                      trade.maker ? 'text-blue-600' : 'text-orange-600'
                    }`}
                  >
                    {trade.maker ? 'Maker' : 'Taker'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 text-xs text-muted-foreground">
          Showing {filteredTrades.length} of {timeSalesData.totalTrades} trades • 
          Last updated: {timeSalesData.lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}