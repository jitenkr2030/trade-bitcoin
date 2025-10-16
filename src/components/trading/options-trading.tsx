'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  DollarSign,
  Percent,
  BarChart3,
  Calculator,
  Info,
  Zap,
  Target,
  Clock,
  Activity
} from 'lucide-react'
import { OrderType, OrderSide } from '@prisma/client'

type OptionsOrderType = Extract<OrderType, 'MARKET' | 'LIMIT'>;

const optionsOrderSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  optionType: z.enum(['CALL', 'PUT']),
  strategy: z.enum(['SINGLE', 'STRADDLE', 'STRANGLE', 'BUTTERFLY', 'IRON_CONDOR', 'COVERED_CALL', 'PROTECTIVE_PUT']),
  strikePrice: z.string().min(1, 'Strike price is required'),
  expirationDate: z.string().min(1, 'Expiration date is required'),
  side: z.enum(['BUY', 'SELL']),
  type: z.enum(['MARKET', 'LIMIT']),
  amount: z.string().min(1, 'Number of contracts is required'),
  price: z.string().optional(),
  timeInForce: z.enum(['GTC', 'IOC', 'FOK']).optional(),
  takeProfit: z.string().optional(),
  stopLoss: z.string().optional()
})

type OptionsOrderFormData = z.infer<typeof optionsOrderSchema>

interface OptionChain {
  strikePrice: number
  callBid: number
  callAsk: number
  callVolume: number
  callOpenInterest: number
  putBid: number
  putAsk: number
  putVolume: number
  putOpenInterest: number
  impliedVolatility: number
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
}

interface OptionPosition {
  symbol: string
  optionType: 'CALL' | 'PUT'
  strikePrice: number
  expirationDate: string
  side: 'LONG' | 'SHORT'
  size: number
  entryPrice: number
  currentPrice: number
  unrealizedPnl: number
  impliedVolatility: number
  delta: number
  gamma: number
  theta: number
  vega: number
  daysToExpiration: number
}

interface OptionsGreeks {
  delta: number
  gamma: number
  theta: number
  vega: number
  rho: number
  impliedVolatility: number
}

interface OptionsTradingProps {
  exchangeAccountId: string
  onSubmit: (data: OptionsOrderFormData) => Promise<void>
  availableBalance?: Record<string, number>
}

export function OptionsTrading({ 
  exchangeAccountId, 
  onSubmit, 
  availableBalance = {} 
}: OptionsTradingProps) {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [positions, setPositions] = useState<OptionPosition[]>([])
  const [optionChain, setOptionChain] = useState<OptionChain[]>([])
  const [underlyingPrice, setUnderlyingPrice] = useState<number>(43250)
  const [selectedExpiration, setSelectedExpiration] = useState<string>('2024-12-20')
  const [portfolioGreeks, setPortfolioGreeks] = useState<OptionsGreeks>({
    delta: 0,
    gamma: 0,
    theta: 0,
    vega: 0,
    rho: 0,
    impliedVolatility: 0
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<OptionsOrderFormData>({
    resolver: zodResolver(optionsOrderSchema),
    defaultValues: {
      symbol: selectedSymbol,
      optionType: 'CALL',
      strategy: 'SINGLE',
      side: 'BUY',
      type: 'MARKET',
      amount: '1',
      timeInForce: 'GTC'
    }
  })

  const watchedOptionType = watch('optionType')
  const watchedStrategy = watch('strategy')
  const watchedSide = watch('side')
  const watchedType = watch('type')
  const watchedAmount = watch('amount')
  const watchedStrikePrice = watch('strikePrice')

  const popularSymbols = ['BTC', 'ETH', 'BNB', 'ADA', 'SOL', 'DOT']
  const expirationDates = [
    '2024-12-20',
    '2024-12-27',
    '2025-01-03',
    '2025-01-17',
    '2025-01-31',
    '2025-02-28',
    '2025-03-28'
  ]

  const strategies = [
    { value: 'SINGLE', label: 'Single Option', description: 'Buy or sell a single option contract' },
    { value: 'STRADDLE', label: 'Straddle', description: 'Buy call and put at same strike' },
    { value: 'STRANGLE', label: 'Strangle', description: 'Buy out-of-the-money call and put' },
    { value: 'BUTTERFLY', label: 'Butterfly', description: 'Limited risk, limited reward strategy' },
    { value: 'IRON_CONDOR', label: 'Iron Condor', description: 'Income strategy with defined risk' },
    { value: 'COVERED_CALL', label: 'Covered Call', description: 'Own underlying, sell call option' },
    { value: 'PROTECTIVE_PUT', label: 'Protective Put', description: 'Own underlying, buy put option' }
  ]

  useEffect(() => {
    // Simulate loading positions and option chain data
    loadPositions()
    loadOptionChain()
    loadPortfolioGreeks()
  }, [exchangeAccountId, selectedSymbol, selectedExpiration])

  const loadPositions = async () => {
    // Simulate API call
    const mockPositions: OptionPosition[] = [
      {
        symbol: 'BTC',
        optionType: 'CALL',
        strikePrice: 45000,
        expirationDate: '2024-12-20',
        side: 'LONG',
        size: 1,
        entryPrice: 1200,
        currentPrice: 1350,
        unrealizedPnl: 150,
        impliedVolatility: 0.65,
        delta: 0.58,
        gamma: 0.002,
        theta: -0.15,
        vega: 0.25,
        daysToExpiration: 15
      }
    ]
    setPositions(mockPositions)
  }

  const loadOptionChain = async () => {
    // Simulate API call - generate option chain data
    const chain: OptionChain[] = []
    const strikes = [40000, 41000, 42000, 43000, 44000, 45000, 46000, 47000, 48000]
    
    strikes.forEach(strike => {
      const moneyness = underlyingPrice / strike
      const baseIV = 0.65 + Math.abs(1 - moneyness) * 0.2
      
      chain.push({
        strikePrice: strike,
        callBid: Math.max(0, underlyingPrice - strike + Math.random() * 200 - 100),
        callAsk: Math.max(0, underlyingPrice - strike + Math.random() * 200 - 50),
        callVolume: Math.floor(Math.random() * 1000),
        callOpenInterest: Math.floor(Math.random() * 5000),
        putBid: Math.max(0, strike - underlyingPrice + Math.random() * 200 - 100),
        putAsk: Math.max(0, strike - underlyingPrice + Math.random() * 200 - 50),
        putVolume: Math.floor(Math.random() * 1000),
        putOpenInterest: Math.floor(Math.random() * 5000),
        impliedVolatility: baseIV + (Math.random() - 0.5) * 0.1,
        delta: moneyness > 1 ? 0.8 + (Math.random() - 0.5) * 0.2 : 0.2 + (Math.random() - 0.5) * 0.2,
        gamma: 0.002 + Math.random() * 0.003,
        theta: -0.1 - Math.random() * 0.1,
        vega: 0.2 + Math.random() * 0.1,
        rho: 0.05 + Math.random() * 0.05
      })
    })
    
    setOptionChain(chain.sort((a, b) => a.strikePrice - b.strikePrice))
  }

  const loadPortfolioGreeks = async () => {
    // Simulate API call
    setPortfolioGreeks({
      delta: 0.58,
      gamma: 0.002,
      theta: -0.15,
      vega: 0.25,
      rho: 0.12,
      impliedVolatility: 0.65
    })
  }

  const formatNumber = (num: number, decimals: number = 8) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatPercent = (num: number) => {
    return `${(num * 100).toFixed(2)}%`
  }

  const calculateEstimatedCost = () => {
    if (!watchedAmount || !watchedStrikePrice) return 0
    const amount = parseFloat(watchedAmount)
    const strike = parseFloat(watchedStrikePrice)
    
    // Simple calculation - in reality this would use Black-Scholes or similar model
    const optionPrice = Math.abs(underlyingPrice - strike) * 0.1 + Math.random() * 500
    return amount * optionPrice * 100 // Options are typically for 100 shares
  }

  const calculateDaysToExpiration = (expirationDate: string) => {
    const exp = new Date(expirationDate)
    const now = new Date()
    const diffTime = exp.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getMoneyness = (strike: number) => {
    if (watchedOptionType === 'CALL') {
      if (strike < underlyingPrice) return 'ITM'
      if (strike === underlyingPrice) return 'ATM'
      return 'OTM'
    } else {
      if (strike > underlyingPrice) return 'ITM'
      if (strike === underlyingPrice) return 'ATM'
      return 'OTM'
    }
  }

  const getMoneynessColor = (moneyness: string) => {
    switch (moneyness) {
      case 'ITM': return 'text-green-600'
      case 'ATM': return 'text-yellow-600'
      case 'OTM': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const onFormSubmit = async (data: OptionsOrderFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await onSubmit(data)
      setSuccess('Options order placed successfully!')
      setValue('amount', '1')
      setValue('price', '')
      setValue('takeProfit', '')
      setValue('stopLoss', '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place options order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Greeks Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Portfolio Greeks
          </CardTitle>
          <CardDescription>
            Risk metrics for your options portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div>
              <p className="text-sm text-gray-600">Delta</p>
              <p className={`text-lg font-semibold ${portfolioGreeks.delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioGreeks.delta.toFixed(3)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Gamma</p>
              <p className="text-lg font-semibold">{portfolioGreeks.gamma.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Theta</p>
              <p className={`text-lg font-semibold ${portfolioGreeks.theta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {portfolioGreeks.theta.toFixed(3)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Vega</p>
              <p className="text-lg font-semibold">{portfolioGreeks.vega.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rho</p>
              <p className="text-lg font-semibold">{portfolioGreeks.rho.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">IV</p>
              <p className="text-lg font-semibold">{formatPercent(portfolioGreeks.impliedVolatility)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Underlying Price Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Underlying Asset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Symbol</p>
              <p className="text-lg font-semibold">{selectedSymbol}USDT</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-lg font-semibold">{formatCurrency(underlyingPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">24h Change</p>
              <p className="text-lg font-semibold text-green-600">+2.5%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Volume</p>
              <p className="text-lg font-semibold">1.2B</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trading Tabs */}
      <Tabs defaultValue="order" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="order">Place Order</TabsTrigger>
          <TabsTrigger value="chain">Option Chain</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
        </TabsList>

        <TabsContent value="order" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Options Order</CardTitle>
              <CardDescription>
                Trade options with various strategies and risk management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                {/* Symbol Selection */}
                <div>
                  <Label htmlFor="symbol">Underlying Asset</Label>
                  <Select 
                    value={selectedSymbol} 
                    onValueChange={(value) => {
                      setSelectedSymbol(value)
                      setValue('symbol', value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {popularSymbols.map(symbol => (
                        <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Option Type */}
                <div>
                  <Label htmlFor="optionType">Option Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button
                      type="button"
                      variant={watchedOptionType === 'CALL' ? 'default' : 'outline'}
                      onClick={() => setValue('optionType', 'CALL')}
                      className="w-full"
                    >
                      CALL
                    </Button>
                    <Button
                      type="button"
                      variant={watchedOptionType === 'PUT' ? 'destructive' : 'outline'}
                      onClick={() => setValue('optionType', 'PUT')}
                      className="w-full"
                    >
                      PUT
                    </Button>
                  </div>
                </div>

                {/* Strategy Selection */}
                <div>
                  <Label htmlFor="strategy">Strategy</Label>
                  <Select value={watchedStrategy} onValueChange={(value) => setValue('strategy', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.map(strategy => (
                        <SelectItem key={strategy.value} value={strategy.value}>
                          <div>
                            <div className="font-medium">{strategy.label}</div>
                            <div className="text-xs text-gray-600">{strategy.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Strike Price */}
                <div>
                  <Label htmlFor="strikePrice">Strike Price</Label>
                  <Input
                    id="strikePrice"
                    type="number"
                    step="100"
                    placeholder="43000"
                    {...register('strikePrice')}
                  />
                  {errors.strikePrice && (
                    <p className="text-sm text-red-600 mt-1">{errors.strikePrice.message}</p>
                  )}
                </div>

                {/* Expiration Date */}
                <div>
                  <Label htmlFor="expirationDate">Expiration Date</Label>
                  <Select 
                    value={selectedExpiration} 
                    onValueChange={(value) => {
                      setSelectedExpiration(value)
                      setValue('expirationDate', value)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expirationDates.map(date => (
                        <SelectItem key={date} value={date}>
                          {date} ({calculateDaysToExpiration(date)} days)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Order Side */}
                <div>
                  <Label htmlFor="side">Order Side</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Button
                      type="button"
                      variant={watchedSide === 'BUY' ? 'default' : 'outline'}
                      onClick={() => setValue('side', 'BUY')}
                      className="w-full"
                    >
                      BUY (Long)
                    </Button>
                    <Button
                      type="button"
                      variant={watchedSide === 'SELL' ? 'destructive' : 'outline'}
                      onClick={() => setValue('side', 'SELL')}
                      className="w-full"
                    >
                      SELL (Short)
                    </Button>
                  </div>
                </div>

                {/* Order Type */}
                <div>
                  <Label htmlFor="type">Order Type</Label>
                  <Select value={watchedType} onValueChange={(value) => setValue('type', value as OptionsOrderType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKET">Market Order</SelectItem>
                      <SelectItem value="LIMIT">Limit Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Number of Contracts */}
                <div>
                  <Label htmlFor="amount">Number of Contracts</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="1"
                    {...register('amount')}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
                  )}
                </div>

                {/* Price (for limit orders) */}
                {watchedType === 'LIMIT' && (
                  <div>
                    <Label htmlFor="price">Price (per contract)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('price')}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                    )}
                  </div>
                )}

                {/* Take Profit and Stop Loss */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="takeProfit">Take Profit</Label>
                    <Input
                      id="takeProfit"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('takeProfit')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stopLoss">Stop Loss</Label>
                    <Input
                      id="stopLoss"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...register('stopLoss')}
                    />
                  </div>
                </div>

                {/* Cost Info */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimated Cost:</span>
                    <span className="font-medium">{formatCurrency(calculateEstimatedCost())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Days to Expiration:</span>
                    <span className="font-medium">{calculateDaysToExpiration(selectedExpiration)}</span>
                  </div>
                  {watchedStrikePrice && (
                    <div className="flex justify-between text-sm">
                      <span>Moneyness:</span>
                      <span className={`font-medium ${getMoneynessColor(getMoneyness(parseFloat(watchedStrikePrice)))}`}>
                        {getMoneyness(parseFloat(watchedStrikePrice))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Available Balance:</span>
                    <span>{formatCurrency(availableBalance['USDT'] || 0)}</span>
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isValid || isSubmitting}
                  variant={watchedSide === 'BUY' ? 'default' : 'destructive'}
                >
                  {isSubmitting ? 'Placing Order...' : `Place ${watchedSide} Order`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Option Chain</CardTitle>
              <CardDescription>
                Available options contracts with pricing and Greeks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Strike</th>
                      <th className="text-left p-2">Call Bid</th>
                      <th className="text-left p-2">Call Ask</th>
                      <th className="text-left p-2">Call Vol</th>
                      <th className="text-left p-2">Call OI</th>
                      <th className="text-left p-2">IV</th>
                      <th className="text-left p-2">Delta</th>
                      <th className="text-left p-2">Gamma</th>
                      <th className="text-left p-2">Put Bid</th>
                      <th className="text-left p-2">Put Ask</th>
                      <th className="text-left p-2">Put Vol</th>
                      <th className="text-left p-2">Put OI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {optionChain.map((option, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{formatCurrency(option.strikePrice)}</td>
                        <td className="p-2 text-green-600">{formatCurrency(option.callBid)}</td>
                        <td className="p-2 text-red-600">{formatCurrency(option.callAsk)}</td>
                        <td className="p-2">{option.callVolume.toLocaleString()}</td>
                        <td className="p-2">{option.callOpenInterest.toLocaleString()}</td>
                        <td className="p-2">{formatPercent(option.impliedVolatility)}</td>
                        <td className="p-2">{option.delta.toFixed(3)}</td>
                        <td className="p-2">{option.gamma.toFixed(3)}</td>
                        <td className="p-2 text-green-600">{formatCurrency(option.putBid)}</td>
                        <td className="p-2 text-red-600">{formatCurrency(option.putAsk)}</td>
                        <td className="p-2">{option.putVolume.toLocaleString()}</td>
                        <td className="p-2">{option.putOpenInterest.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Option Positions</CardTitle>
              <CardDescription>
                Current options positions and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No option positions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map((position, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{position.symbol} {position.optionType} {formatCurrency(position.strikePrice)}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant={position.side === 'LONG' ? 'default' : 'destructive'}>
                              {position.side}
                            </Badge>
                            <Badge variant="outline">
                              {position.expirationDate} ({position.daysToExpiration}d)
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(position.unrealizedPnl)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {position.size} contract{position.size !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Entry Price</p>
                          <p className="font-medium">{formatCurrency(position.entryPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current Price</p>
                          <p className="font-medium">{formatCurrency(position.currentPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Implied Vol</p>
                          <p className="font-medium">{formatPercent(position.impliedVolatility)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Delta</p>
                          <p className="font-medium">{position.delta.toFixed(3)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                        <div>
                          <p className="text-gray-600">Gamma</p>
                          <p className="font-medium">{position.gamma.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Theta</p>
                          <p className="font-medium">{position.theta.toFixed(3)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Vega</p>
                          <p className="font-medium">{position.vega.toFixed(3)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}