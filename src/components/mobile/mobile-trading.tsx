"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Shield,
  AlertTriangle,
  RefreshCw,
  Settings,
  Plus,
  DollarSign,
  Percent,
  BarChart3,
  Eye,
  Wallet,
  Star,
  Bell,
  Calendar,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Zap
} from "lucide-react"
import { OrderType, OrderSide, OrderStatus } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface MobileOrderFormProps {
  symbol: string
  onPlaceOrder: (orderData: any) => Promise<void>
  availableBalance?: Record<string, number>
  currentPrice?: number
}

function MobileOrderForm({ symbol, onPlaceOrder, availableBalance = {}, currentPrice }: MobileOrderFormProps) {
  const [orderType, setOrderType] = useState<OrderType>(OrderType.MARKET)
  const [orderSide, setOrderSide] = useState<OrderSide>(OrderSide.BUY)
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const popularAmounts = ['0.001', '0.01', '0.1', '1', '10']

  const handlePlaceOrder = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }

    if (orderType === OrderType.LIMIT && (!price || parseFloat(price) <= 0)) {
      setError('Please enter a valid price')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await onPlaceOrder({
        symbol,
        side: orderSide,
        type: orderType,
        amount: parseFloat(amount),
        price: orderType === OrderType.LIMIT ? parseFloat(price) : undefined
      })
      setSuccess('Order placed successfully!')
      setAmount('')
      setPrice('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatNumber = (num: number, decimals: number = 8) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const getEstimatedCost = () => {
    if (!amount || !currentPrice) return 0
    const amountNum = parseFloat(amount)
    return amountNum * currentPrice
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Quick Trade</CardTitle>
          <Badge variant="outline">{symbol}</Badge>
        </div>
        {currentPrice && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Price</span>
            <span className="font-semibold">{formatCurrency(currentPrice)}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Side Selection */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={orderSide === OrderSide.BUY ? 'default' : 'outline'}
            onClick={() => setOrderSide(OrderSide.BUY)}
            className="w-full h-12"
            size="lg"
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            BUY
          </Button>
          <Button
            variant={orderSide === OrderSide.SELL ? 'destructive' : 'outline'}
            onClick={() => setOrderSide(OrderSide.SELL)}
            className="w-full h-12"
            size="lg"
          >
            <ArrowDownRight className="h-4 w-4 mr-1" />
            SELL
          </Button>
        </div>

        {/* Order Type Selection */}
        <div>
          <Label className="text-sm font-medium">Order Type</Label>
          <Select value={orderType} onValueChange={(value) => setOrderType(value as OrderType)}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderType.MARKET}>Market</SelectItem>
              <SelectItem value={OrderType.LIMIT}>Limit</SelectItem>
              <SelectItem value={OrderType.STOP}>Stop</SelectItem>
              <SelectItem value={OrderType.OCO}>OCO</SelectItem>
              <SelectItem value={OrderType.TRAILING_STOP}>Trailing Stop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div>
          <Label className="text-sm font-medium">Amount</Label>
          <Input
            type="number"
            step="0.00000001"
            placeholder="0.00000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-10"
          />
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-5 gap-1 mt-2">
            {popularAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt)}
                className="text-xs h-8"
              >
                {amt}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Input (for limit orders) */}
        {orderType === OrderType.LIMIT && (
          <div>
            <Label className="text-sm font-medium">Price</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-10"
            />
          </div>
        )}

        {/* Advanced Options Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full justify-between"
        >
          <span>Advanced Options</span>
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">Time in Force</Label>
              <Select defaultValue="GTC">
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GTC">Good 'til Canceled</SelectItem>
                  <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                  <SelectItem value="FOK">Fill or Kill</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {orderType === OrderType.TRAILING_STOP && (
              <div>
                <Label className="text-sm font-medium">Trailing Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="1.0"
                  className="h-9"
                />
              </div>
            )}
          </div>
        )}

        {/* Estimated Cost */}
        {amount && currentPrice && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated Cost</span>
              <span className="font-semibold">{formatCurrency(getEstimatedCost())}</span>
            </div>
          </div>
        )}

        {/* Balance Info */}
        {Object.keys(availableBalance).length > 0 && (
          <div className="text-xs text-gray-600">
            Available: {formatNumber(availableBalance['USDT'] || 0, 4)} USDT
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Place Order Button */}
        <Button
          onClick={handlePlaceOrder}
          disabled={isSubmitting || !amount}
          className="w-full h-12"
          size="lg"
          variant={orderSide === OrderSide.BUY ? 'default' : 'destructive'}
        >
          {isSubmitting ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {orderSide === OrderSide.BUY ? 'Buy' : 'Sell'} {symbol}
        </Button>
      </CardContent>
    </Card>
  )
}

interface MobileMarketDataProps {
  symbol: string
  data?: {
    price: number
    change24h: number
    changePercent24h: number
    volume24h: number
    high24h: number
    low24h: number
  }
}

function MobileMarketData({ symbol, data }: MobileMarketDataProps) {
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

  if (!data) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="text-center">
            <Activity className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p className="text-sm">Loading market data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          {symbol}
          <Badge variant={data.changePercent24h >= 0 ? 'default' : 'destructive'}>
            {data.changePercent24h >= 0 ? '+' : ''}{data.changePercent24h.toFixed(2)}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatCurrency(data.price)}</div>
            <div className={`text-sm ${data.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.change24h >= 0 ? '+' : ''}{formatCurrency(data.change24h)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-gray-600">24h High</div>
              <div className="font-semibold">{formatCurrency(data.high24h)}</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-gray-600">24h Low</div>
              <div className="font-semibold">{formatCurrency(data.low24h)}</div>
            </div>
          </div>
          
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-gray-600">24h Volume</div>
            <div className="font-semibold">{formatNumber(data.volume24h, 0)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MobileOrdersListProps {
  orders: any[]
  onCancelOrder: (orderId: string) => void
}

function MobileOrdersList({ orders, onCancelOrder }: MobileOrdersListProps) {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatNumber = (num: number, decimals: number = 8) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const openOrders = orders.filter(order => 
    [OrderStatus.OPEN, OrderStatus.PARTIALLY_FILLED].includes(order.status)
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Open Orders
          <Badge variant="outline">{openOrders.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {openOrders.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Timer className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-600">No open orders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {openOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={order.side === OrderSide.BUY ? 'default' : 'destructive'}>
                      {order.side}
                    </Badge>
                    <span className="text-sm font-medium">{order.symbol}</span>
                  </div>
                  <Badge variant="outline">{order.type}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Amount:</span>
                    <span className="ml-1 font-medium">{formatNumber(order.amount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <span className="ml-1 font-medium">
                      {order.price ? formatCurrency(order.price) : 'Market'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Filled:</span>
                    <span className="ml-1 font-medium">
                      {formatNumber(order.executedAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-1 font-medium">{order.status}</span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancelOrder(order.id)}
                  className="w-full mt-2"
                >
                  Cancel Order
                </Button>
              </div>
            ))}
            
            {openOrders.length > 5 && (
              <div className="text-center">
                <Button variant="ghost" size="sm">
                  View All Orders ({openOrders.length})
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MobileTrading() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [marketData, setMarketData] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const popularSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT']

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    loadMarketData()
    loadOrders()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      loadMarketData()
    }, 5000)

    return () => clearInterval(interval)
  }, [status, router, selectedSymbol])

  const loadMarketData = async () => {
    try {
      // Simulate market data - in real app, this would fetch from API
      const mockData = {
        price: 43250 + Math.random() * 1000 - 500,
        change24h: (Math.random() - 0.5) * 2000,
        changePercent24h: (Math.random() - 0.5) * 10,
        volume24h: 1000000 + Math.random() * 500000,
        high24h: 44000 + Math.random() * 1000,
        low24h: 42000 + Math.random() * 1000
      }
      setMarketData(mockData)
    } catch (error) {
      console.error('Failed to load market data:', error)
    }
  }

  const loadOrders = async () => {
    try {
      // Simulate orders - in real app, this would fetch from API
      const mockOrders = [
        {
          id: '1',
          symbol: 'BTCUSDT',
          side: OrderSide.BUY,
          type: OrderType.LIMIT,
          amount: 0.1,
          price: 43000,
          status: OrderStatus.OPEN,
          executedAmount: 0
        }
      ]
      setOrders(mockOrders)
    } catch (error) {
      console.error('Failed to load orders:', error)
    }
  }

  const handlePlaceOrder = async (orderData: any) => {
    setIsLoading(true)
    try {
      // Simulate order placement - in real app, this would call API
      await new Promise(resolve => setTimeout(resolve, 1000))
      loadOrders()
    } catch (error) {
      throw new Error('Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    try {
      // Simulate order cancellation - in real app, this would call API
      await new Promise(resolve => setTimeout(resolve, 500))
      loadOrders()
    } catch (error) {
      console.error('Failed to cancel order:', error)
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Trading</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {popularSymbols.map(symbol => (
                  <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Side Menu */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setShowMenu(false)}>
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowMenu(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Portfolio
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Watchlist
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Economic Calendar
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Wallet className="h-4 w-4 mr-2" />
                  Wallet
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4 pb-20">
        <Tabs defaultValue="trade" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="trade">Trade</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
          </TabsList>

          <TabsContent value="trade" className="space-y-4">
            <MobileMarketData symbol={selectedSymbol} data={marketData} />
            <MobileOrderForm
              symbol={selectedSymbol}
              onPlaceOrder={handlePlaceOrder}
              currentPrice={marketData?.price}
              availableBalance={{ USDT: 10000 }}
            />
          </TabsContent>

          <TabsContent value="orders">
            <MobileOrdersList orders={orders} onCancelOrder={handleCancelOrder} />
          </TabsContent>

          <TabsContent value="markets">
            <Card>
              <CardHeader>
                <CardTitle>Popular Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularSymbols.map((symbol) => (
                    <div
                      key={symbol}
                      className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setSelectedSymbol(symbol)
                        // Switch to trade tab
                        const tradeTab = document.querySelector('[value="trade"]') as HTMLElement
                        if (tradeTab) tradeTab.click()
                      }}
                    >
                      <div>
                        <div className="font-medium">{symbol}</div>
                        <div className="text-sm text-gray-600">
                          {symbol.replace('USDT', '')}/USDT
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${Math.floor(Math.random() * 50000 + 10000).toLocaleString()}
                        </div>
                        <div className={`text-sm ${
                          Math.random() > 0.5 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {Math.random() > 0.5 ? '+' : ''}{(Math.random() * 10 - 5).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Button variant="ghost" size="sm" className="flex-col h-16">
            <Zap className="h-5 w-5 mb-1" />
            <span className="text-xs">Trade</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-16">
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="text-xs">Portfolio</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-16">
            <Star className="h-5 w-5 mb-1" />
            <span className="text-xs">Watchlist</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-16">
            <Settings className="h-5 w-5 mb-1" />
            <span className="text-xs">More</span>
          </Button>
        </div>
      </div>
    </div>
  )
}