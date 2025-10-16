"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Search,
  Star,
  Clock,
  BarChart3,
  LineChart,
  CandlestickChart,
  AreaChart,
  RefreshCw,
  Filter,
  Plus,
  DollarSign,
  Bitcoin,
  Globe,
  Briefcase,
  Gem,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react"
import { useState, useEffect } from "react"
import { RealTimePriceChart } from "@/components/realtime-price-chart"
import { MarketDepthChart } from "@/components/market-depth-chart"
import { VolumeChart } from "@/components/volume-chart"

export default function MarketsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")
  const [selectedChartType, setSelectedChartType] = useState("candlestick")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock real-time price data
  const [marketData, setMarketData] = useState([
    { symbol: "BTC/USD", name: "Bitcoin", price: 43250.00, change: 2.5, changePercent: 2.5, volume: "2.1B", high24h: 44120, low24h: 42180, marketCap: "847.3B" },
    { symbol: "ETH/USD", name: "Ethereum", price: 2180.50, change: 1.8, changePercent: 1.8, volume: "1.5B", high24h: 2230, low24h: 2120, marketCap: "262.1B" },
    { symbol: "AAPL", name: "Apple Inc.", price: 175.20, change: -0.5, changePercent: -0.5, volume: "45.2M", high24h: 177.80, low24h: 174.10, marketCap: "2.71T" },
    { symbol: "EUR/USD", name: "Euro/US Dollar", price: 1.0850, change: 0.1, changePercent: 0.1, volume: "89.3M", high24h: 1.0890, low24h: 1.0820, marketCap: "N/A" },
    { symbol: "SOL/USD", name: "Solana", price: 98.45, change: 5.2, changePercent: 5.2, volume: "2.8B", high24h: 102.30, low24h: 92.10, marketCap: "42.1B" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: 3.1, changePercent: 3.1, volume: "67.8M", high24h: 252.30, low24h: 239.80, marketCap: "789.2B" },
    { symbol: "GBP/USD", name: "British Pound/US Dollar", price: 1.2740, change: -0.2, changePercent: -0.2, volume: "34.5M", high24h: 1.2780, low24h: 1.2710, marketCap: "N/A" },
    { symbol: "ADA/USD", name: "Cardano", price: 0.4850, change: 8.7, changePercent: 8.7, volume: "1.2B", high24h: 0.5120, low24h: 0.4420, marketCap: "17.2B" }
  ])

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => prev.map(item => ({
        ...item,
        price: item.price * (1 + (Math.random() - 0.5) * 0.001),
        change: item.change + (Math.random() - 0.5) * 0.1,
        changePercent: item.changePercent + (Math.random() - 0.5) * 0.1
      })))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const categories = [
    { id: "all", name: "All Markets", icon: Globe },
    { id: "crypto", name: "Cryptocurrency", icon: Bitcoin },
    { id: "stocks", name: "Stocks", icon: Briefcase },
    { id: "forex", name: "Forex", icon: DollarSign },
    { id: "commodities", name: "Commodities", icon: Gem }
  ]

  const chartTypes = [
    { id: "line", name: "Line Chart", icon: LineChart },
    { id: "candlestick", name: "Candlestick", icon: CandlestickChart },
    { id: "area", name: "Area Chart", icon: AreaChart }
  ]

  const timeframes = [
    { id: "1m", name: "1m" },
    { id: "5m", name: "5m" },
    { id: "15m", name: "15m" },
    { id: "1h", name: "1h" },
    { id: "4h", name: "4h" },
    { id: "1d", name: "1d" },
    { id: "1w", name: "1w" }
  ]

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-400"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Markets</h1>
          <p className="text-muted-foreground">
            Real-time market data and price charts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Watchlist
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.18T</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3.2%</span> 24h change
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$89.3B</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> vs yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
            <Bitcoin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52.3%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-0.8%</span> 24h change
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              Across all exchanges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search markets, pairs, symbols..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>BTC/USD - Bitcoin</CardTitle>
                  <CardDescription>Real-time price chart</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {getChangeIcon(2.5)}
                    <span className={`text-lg font-bold ${getChangeColor(2.5)}`}>
                      ${43250.00}
                    </span>
                    <span className={`text-sm ${getChangeColor(2.5)}`}>
                      ({2.5 >= 0 ? '+' : ''}{2.5}%)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {timeframes.map((timeframe) => (
                    <Button
                      key={timeframe.id}
                      variant={selectedTimeframe === timeframe.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeframe(timeframe.id)}
                    >
                      {timeframe.name}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  {chartTypes.map((type) => (
                    <Button
                      key={type.id}
                      variant={selectedChartType === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedChartType(type.id)}
                    >
                      <type.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <RealTimePriceChart type={selectedChartType} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Depth</CardTitle>
                <CardDescription>Order book depth and liquidity</CardDescription>
              </CardHeader>
              <CardContent>
                <MarketDepthChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volume Analysis</CardTitle>
                <CardDescription>Trading volume over time</CardDescription>
              </CardHeader>
              <CardContent>
                <VolumeChart />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market List */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Real-time market prices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {marketData.map((market, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold">{market.symbol.substring(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{market.symbol}</div>
                        <div className="text-xs text-muted-foreground">{market.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${market.price.toLocaleString()}</div>
                      <div className={`text-sm flex items-center gap-1 ${getChangeColor(market.change)}`}>
                        {getChangeIcon(market.change)}
                        {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Vol: {market.volume}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Movers</CardTitle>
              <CardDescription>Biggest gainers and losers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData
                  .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
                  .slice(0, 5)
                  .map((market, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold">{market.symbol.substring(0, 2)}</span>
                        </div>
                        <div>
                          <div className="font-medium">{market.symbol}</div>
                          <div className="text-xs text-muted-foreground">{market.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${market.price.toLocaleString()}</div>
                        <div className={`text-sm flex items-center gap-1 ${getChangeColor(market.change)}`}>
                          {getChangeIcon(market.change)}
                          {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Market Info */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical Analysis</TabsTrigger>
          <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          <TabsTrigger value="news">News & Sentiment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Market Cap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$847.3B</div>
                <div className="text-xs text-muted-foreground">Rank #1</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">24h Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2.1B</div>
                <div className="text-xs text-muted-foreground">+12.5%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Circulating Supply</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">19.6M</div>
                <div className="text-xs text-muted-foreground">BTC</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">All Time High</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$69,000</div>
                <div className="text-xs text-muted-foreground">Nov 2021</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Technical Indicators</CardTitle>
                <CardDescription>Key technical analysis metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">BUY</div>
                    <div className="text-xs text-muted-foreground">RSI (14)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">BUY</div>
                    <div className="text-xs text-muted-foreground">MACD</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">NEUTRAL</div>
                    <div className="text-xs text-muted-foreground">Stochastic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">BUY</div>
                    <div className="text-xs text-muted-foreground">Moving Average</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Support & Resistance</CardTitle>
                <CardDescription>Key price levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resistance 3</span>
                  <span className="font-medium text-red-600">$45,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resistance 2</span>
                  <span className="font-medium text-red-600">$44,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Resistance 1</span>
                  <span className="font-medium text-red-600">$43,800</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Current Price</span>
                  <span className="font-medium">$43,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Support 1</span>
                  <span className="font-medium text-green-600">$42,800</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Support 2</span>
                  <span className="font-medium text-green-600">$42,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Support 3</span>
                  <span className="font-medium text-green-600">$41,500</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fundamentals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fundamental Analysis</CardTitle>
              <CardDescription>Key fundamental metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Market Cap</span>
                    <span className="font-medium">$847.3B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Volume/Market Cap</span>
                    <span className="font-medium">0.0248</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Market Cap Dominance</span>
                    <span className="font-medium">52.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">All Time High</span>
                    <span className="font-medium">$69,000</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Circulating Supply</span>
                    <span className="font-medium">19.6M BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Supply</span>
                    <span className="font-medium">21M BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Max Supply</span>
                    <span className="font-medium">21M BTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Inflation Rate</span>
                    <span className="font-medium">1.7%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market News & Sentiment</CardTitle>
              <CardDescription>Latest news and market sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Bitcoin ETF Inflows Reach Record High</div>
                    <Badge className="bg-green-100 text-green-800">Bullish</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Institutional investors continue to pour capital into Bitcoin ETFs, with weekly inflows exceeding $2 billion...
                  </div>
                  <div className="text-xs text-muted-foreground">2 hours ago</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Fed Signals Potential Rate Cuts</div>
                    <Badge className="bg-green-100 text-green-800">Bullish</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Federal Reserve officials indicate that interest rate cuts may be on the horizon, potentially boosting risk assets...
                  </div>
                  <div className="text-xs text-muted-foreground">4 hours ago</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Crypto Exchange Volumes Surge 40%</div>
                    <Badge className="bg-green-100 text-green-800">Bullish</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Major cryptocurrency exchanges report 40% increase in trading volumes as market volatility attracts traders...
                  </div>
                  <div className="text-xs text-muted-foreground">6 hours ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}