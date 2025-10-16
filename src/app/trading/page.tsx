"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { OrderForm } from "@/components/trading/order-form"
import { OrdersTable } from "@/components/trading/orders-table"
import { TradesTable } from "@/components/trading/trades-table"
import { MarketDataWidget } from "@/components/market-data-widget"
import { FuturesMarginTrading } from "@/components/trading/futures-margin-trading"
import { OptionsTrading } from "@/components/trading/options-trading"
import { AdvancedCharting } from "@/components/trading/advanced-charting"
import { MarketDepthEnhanced } from "@/components/market-depth-enhanced"
import { TimeSalesDisplay } from "@/components/trading/time-sales-display"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
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
  Newspaper,
  BookOpen,
  Users,
  Copy,
  Bot
} from "lucide-react"
import { OrderType, OrderSide, OrderStatus } from "@prisma/client"

interface ExchangeAccount {
  id: string
  nickname: string
  exchange: {
    name: string
    displayName: string
  }
}

interface Order {
  id: string
  clientOrderId?: string
  exchangeOrderId?: string
  symbol: string
  status: OrderStatus
  side: OrderSide
  type: OrderType
  amount: number
  price?: number
  stopPrice?: number
  executedAmount: number
  executedPrice?: number
  fee?: number
  feeCurrency?: string
  createdAt: Date
  updatedAt: Date
  exchangeAccount?: {
    exchange: {
      name: string
      displayName: string
    }
  }
}

interface Trade {
  id: string
  tradeId?: string
  orderId?: string
  symbol: string
  side: OrderSide
  amount: number
  price: number
  fee?: number
  feeCurrency?: string
  createdAt: Date
  exchangeAccount?: {
    exchange: {
      name: string
      displayName: string
    }
  }
  bot?: {
    name: string
  }
}

interface Balance {
  asset: string
  free: number
  locked: number
  total: number
}

export default function TradingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isMobile = useMobileDetection()
  
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [exchangeAccounts, setExchangeAccounts] = useState<ExchangeAccount[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [balances, setBalances] = useState<Balance[]>([])
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Redirect mobile users to mobile interface
  useEffect(() => {
    if (isMobile && typeof window !== 'undefined') {
      router.push('/mobile')
    }
  }, [isMobile, router])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      loadExchangeAccounts()
    }
  }, [status, router])

  useEffect(() => {
    if (selectedAccount) {
      loadOrders()
      loadTrades()
      loadBalances()
    }
  }, [selectedAccount])
  
  // Show loading state while checking mobile detection
  if (typeof window === 'undefined') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If mobile, don't render desktop content (redirect will happen)
  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Redirecting to mobile interface...</p>
        </div>
      </div>
    )
  }

  const loadExchangeAccounts = async () => {
    try {
      const response = await fetch('/api/exchanges?action=accounts')
      if (response.ok) {
        const data = await response.json()
        setExchangeAccounts(data.accounts)
        if (data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0].id)
        }
      }
    } catch (err) {
      setError('Failed to load exchange accounts')
    }
  }

  const loadOrders = async () => {
    if (!selectedAccount) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/trading?action=orders&accountId=${selectedAccount}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (err) {
      setError('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrades = async () => {
    if (!selectedAccount) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/trading?action=trades&accountId=${selectedAccount}`)
      if (response.ok) {
        const data = await response.json()
        setTrades(data.trades || [])
      }
    } catch (err) {
      setError('Failed to load trades')
    } finally {
      setIsLoading(false)
    }
  }

  const loadBalances = async () => {
    if (!selectedAccount) return
    
    try {
      const response = await fetch(`/api/trading?action=balances&accountId=${selectedAccount}`)
      if (response.ok) {
        const data = await response.json()
        setBalances(data.balances || [])
      }
    } catch (err) {
      setError('Failed to load balances')
    }
  }

  const handlePlaceOrder = async (orderData: any) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'create-order',
          accountId: selectedAccount,
          ...orderData
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess('Order placed successfully!')
        loadOrders() // Refresh orders
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to place order')
      }
    } catch (err) {
      setError('Failed to place order')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/trading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'cancel-order',
          accountId: selectedAccount,
          orderId
        })
      })

      if (response.ok) {
        loadOrders() // Refresh orders
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to cancel order')
      }
    } catch (err) {
      setError('Failed to cancel order')
    } finally {
      setIsLoading(false)
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

  const getTotalBalance = () => {
    // Simple calculation - in reality this would need proper conversion rates
    const usdtBalance = balances.find(b => b.asset === 'USDT')?.total || 0
    const btcBalance = balances.find(b => b.asset === 'BTC')?.total || 0
    const ethBalance = balances.find(b => b.asset === 'ETH')?.total || 0
    
    // Use approximate prices for conversion
    const btcPrice = 43000
    const ethPrice = 2500
    
    return usdtBalance + (btcBalance * btcPrice) + (ethBalance * ethPrice)
  }

  const getAvailableBalance = () => {
    const balanceObj: Record<string, number> = {}
    balances.forEach(balance => {
      balanceObj[balance.asset] = balance.free
    })
    return balanceObj
  }

  const getCurrentPositions = () => {
    const positions: Record<string, number> = {}
    balances.forEach(balance => {
      if (balance.total > 0 && balance.asset !== 'USDT') {
        positions[balance.asset] = balance.total
      }
    })
    return positions
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Terminal</h1>
          <p className="text-muted-foreground">
            Advanced trading with real-time market data and order management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => loadOrders()}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => router.push('/watchlist')}>
            <Star className="h-4 w-4 mr-2" />
            Watchlist
          </Button>
          <Button variant="outline" onClick={() => router.push('/economic-calendar')}>
            <Calendar className="h-4 w-4 mr-2" />
            Economic Calendar
          </Button>
          <Button variant="outline" onClick={() => router.push('/news-feed')}>
            <Newspaper className="h-4 w-4 mr-2" />
            News Feed
          </Button>
          <Button variant="outline" onClick={() => router.push('/sentiment-analysis')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Sentiment Analysis
          </Button>
          <Button variant="outline" onClick={() => router.push('/trade-journal')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Trade Journal
          </Button>
          <Button variant="outline" onClick={() => router.push('/trading/social')}>
            <Users className="h-4 w-4 mr-2" />
            Social Trading
          </Button>
          <Button variant="outline" onClick={() => router.push('/trading/copy-trading')}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Trading
          </Button>
          <Button variant="outline" onClick={() => router.push('/trading/bots')}>
            <Bot className="h-4 w-4 mr-2" />
            Trading Bots
          </Button>
          <Button variant="outline" onClick={() => router.push('/alerts')}>
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" onClick={() => router.push('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

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

      {/* Exchange Account Selection */}
      {exchangeAccounts.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-lg font-semibold mb-2">No Exchange Accounts</h3>
              <p className="text-gray-600 mb-4">
                Connect an exchange account to start trading
              </p>
              <Button onClick={() => router.push('/exchanges')}>
                <Plus className="h-4 w-4 mr-2" />
                Connect Exchange
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Account Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(getTotalBalance())}</div>
                <p className="text-xs text-muted-foreground">
                  Across all assets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Orders</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter(o => {
                    const activeStatuses: OrderStatus[] = [OrderStatus.OPEN, OrderStatus.PARTIALLY_FILLED];
                    return activeStatuses.includes(o.status);
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Trades</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {trades.filter(t => {
                    const today = new Date().toDateString()
                    return new Date(t.createdAt).toDateString() === today
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed trades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {balances.filter(b => b.total > 0).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Assets with balance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Account Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Exchange Account:</label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exchangeAccounts.map(account => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.nickname} ({account.exchange.displayName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Trading Interface */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Order Form & Market Data */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trading Type Tabs */}
              <Tabs defaultValue="spot" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="spot">Spot Trading</TabsTrigger>
                  <TabsTrigger value="futures">Futures Trading</TabsTrigger>
                  <TabsTrigger value="options">Options Trading</TabsTrigger>
                </TabsList>

                <TabsContent value="spot" className="space-y-4">
                  {/* Order Form */}
                  <OrderForm
                    exchangeAccountId={selectedAccount}
                    onSubmit={handlePlaceOrder}
                    availableBalance={getAvailableBalance()}
                    currentPositions={getCurrentPositions()}
                  />
                </TabsContent>

                <TabsContent value="futures" className="space-y-4">
                  {/* Futures Trading */}
                  <FuturesMarginTrading
                    exchangeAccountId={selectedAccount}
                    onSubmit={handlePlaceOrder}
                    availableBalance={getAvailableBalance()}
                  />
                </TabsContent>

                <TabsContent value="options" className="space-y-4">
                  {/* Options Trading */}
                  <OptionsTrading
                    exchangeAccountId={selectedAccount}
                    onSubmit={handlePlaceOrder}
                    availableBalance={getAvailableBalance()}
                  />
                </TabsContent>
              </Tabs>

              {/* Market Data Widget */}
              <MarketDataWidget
                exchangeAccountId={selectedAccount}
                symbol={selectedSymbol}
                channels={['ticker', 'orderbook', 'trades']}
                showOrderBook={true}
                showTrades={true}
              />
            </div>

            {/* Right Column - Charting & Orders */}
            <div className="lg:col-span-2 space-y-6">
              {/* Charting Section */}
              <Tabs defaultValue="advanced" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="advanced">Advanced Chart</TabsTrigger>
                  <TabsTrigger value="depth">Market Depth</TabsTrigger>
                  <TabsTrigger value="timesales">Time & Sales</TabsTrigger>
                  <TabsTrigger value="orders">Orders & Trades</TabsTrigger>
                </TabsList>

                <TabsContent value="advanced" className="space-y-4">
                  <AdvancedCharting
                    symbol={selectedSymbol}
                    data={[]} // This would be populated with real data
                    onIndicatorChange={(indicator) => console.log('Indicator changed:', indicator)}
                    onDrawingChange={(drawing) => console.log('Drawing changed:', drawing)}
                  />
                </TabsContent>

                <TabsContent value="depth" className="space-y-4">
                  <MarketDepthEnhanced
                    symbol={selectedSymbol}
                    exchangeAccountId={selectedAccount}
                    height={400}
                    showControls={true}
                  />
                </TabsContent>

                <TabsContent value="timesales" className="space-y-4">
                  <TimeSalesDisplay
                    symbol={selectedSymbol}
                    exchangeAccountId={selectedAccount}
                    height={400}
                    showControls={true}
                    autoRefresh={true}
                  />
                </TabsContent>

                <TabsContent value="orders" className="space-y-4">
                  <Tabs defaultValue="orders" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="trades">Trade History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="orders" className="space-y-4">
                      <OrdersTable
                        orders={orders}
                        onCancelOrder={handleCancelOrder}
                        onRefreshOrders={loadOrders}
                        isLoading={isLoading}
                      />
                    </TabsContent>

                    <TabsContent value="trades" className="space-y-4">
                      <TradesTable
                        trades={trades}
                        onRefreshTrades={loadTrades}
                        isLoading={isLoading}
                        showBotInfo={true}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </div>
  )
}