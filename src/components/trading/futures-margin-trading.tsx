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
  Zap
} from 'lucide-react'
import { OrderType, OrderSide } from '@prisma/client'

const futuresOrderSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  side: z.enum(['BUY', 'SELL']),
  type: z.enum(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT', 'TRAILING_STOP']),
  amount: z.string().min(1, 'Amount is required'),
  price: z.string().optional(),
  stopPrice: z.string().optional(),
  leverage: z.string().min(1, 'Leverage is required'),
  marginMode: z.enum(['ISOLATED', 'CROSS']),
  positionMode: z.enum(['HEDGE', 'ONE_WAY']),
  reduceOnly: z.boolean().default(false),
  timeInForce: z.enum(['GTC', 'IOC', 'FOK']).optional().nullable(),
  takeProfit: z.string().optional(),
  stopLoss: z.string().optional()
})

type FuturesOrderFormData = z.infer<typeof futuresOrderSchema>

interface FuturesPosition {
  symbol: string
  side: 'LONG' | 'SHORT'
  size: number
  entryPrice: number
  markPrice: number
  liquidationPrice: number
  leverage: number
  margin: number
  unrealizedPnl: number
  roe: number
  marginMode: 'ISOLATED' | 'CROSS'
}

interface MarginAccount {
  totalWalletBalance: number
  availableBalance: number
  totalUnrealizedProfit: number
  totalMarginBalance: number
  totalInitialMargin: number
  totalMaintenanceMargin: number
  totalPositionInitialMargin: number
  totalPositionMaintenanceMargin: number
  totalOpenOrderInitialMargin: number
  crossWalletBalance: number
  crossUnrealizedPnl: number
  maxWithdrawAmount: number
}

interface FuturesMarginTradingProps {
  exchangeAccountId: string
  onSubmit: (data: FuturesOrderFormData) => Promise<void>
  availableBalance?: Record<string, number>
}

export function FuturesMarginTrading({ 
  exchangeAccountId, 
  onSubmit, 
  availableBalance = {} 
}: FuturesMarginTradingProps) {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [positions, setPositions] = useState<FuturesPosition[]>([])
  const [marginAccount, setMarginAccount] = useState<MarginAccount | null>(null)
  const [fundingRate, setFundingRate] = useState<number>(0)
  const [estimatedFunding, setEstimatedFunding] = useState<number>(0)
  const [markPrice, setMarkPrice] = useState<number>(0)
  const [indexPrice, setIndexPrice] = useState<number>(0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<FuturesOrderFormData>({
    defaultValues: {
      symbol: selectedSymbol,
      side: 'BUY',
      type: 'MARKET',
      amount: '',
      leverage: '10',
      marginMode: 'ISOLATED',
      positionMode: 'ONE_WAY',
      reduceOnly: false,
      timeInForce: 'GTC'
    }
  })

  const watchedSide = watch('side')
  const watchedType = watch('type')
  const watchedAmount = watch('amount')
  const watchedLeverage = watch('leverage')
  const watchedMarginMode = watch('marginMode')

  const popularSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT']
  const leverageOptions = [1, 2, 5, 10, 20, 25, 50, 75, 100, 125]

  useEffect(() => {
    // Simulate loading positions and margin account data
    loadPositions()
    loadMarginAccount()
    loadFundingInfo()
  }, [exchangeAccountId])

  const loadPositions = async () => {
    // Simulate API call
    const mockPositions: FuturesPosition[] = [
      {
        symbol: 'BTCUSDT',
        side: 'LONG',
        size: 0.1,
        entryPrice: 43000,
        markPrice: 43250,
        liquidationPrice: 38500,
        leverage: 10,
        margin: 430,
        unrealizedPnl: 25,
        roe: 5.81,
        marginMode: 'ISOLATED'
      }
    ]
    setPositions(mockPositions)
  }

  const loadMarginAccount = async () => {
    // Simulate API call
    const mockMarginAccount: MarginAccount = {
      totalWalletBalance: 10000,
      availableBalance: 8500,
      totalUnrealizedProfit: 25,
      totalMarginBalance: 10025,
      totalInitialMargin: 430,
      totalMaintenanceMargin: 215,
      totalPositionInitialMargin: 430,
      totalPositionMaintenanceMargin: 215,
      totalOpenOrderInitialMargin: 0,
      crossWalletBalance: 9570,
      crossUnrealizedPnl: 25,
      maxWithdrawAmount: 8500
    }
    setMarginAccount(mockMarginAccount)
  }

  const loadFundingInfo = async () => {
    // Simulate API call
    setFundingRate(0.0001) // 0.01%
    setEstimatedFunding(0.43)
    setMarkPrice(43250)
    setIndexPrice(43245)
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
    return `${(num * 100).toFixed(4)}%`
  }

  const calculateEstimatedCost = () => {
    if (!watchedAmount || !markPrice) return 0
    const amount = parseFloat(watchedAmount)
    const leverage = parseFloat(watchedLeverage || '1')
    return (amount * markPrice) / leverage
  }

  const calculateLiquidationPrice = () => {
    if (!watchedAmount || !markPrice) return 0
    const amount = parseFloat(watchedAmount)
    const leverage = parseFloat(watchedLeverage || '1')
    const maintenanceMarginRate = 0.004 // 0.4%
    
    if (watchedSide === 'BUY') {
      return markPrice * (1 - (1 / leverage) + maintenanceMarginRate)
    } else {
      return markPrice * (1 + (1 / leverage) - maintenanceMarginRate)
    }
  }

  const calculateMarginRatio = () => {
    if (!marginAccount) return 0
    return marginAccount.totalMaintenanceMargin / marginAccount.totalMarginBalance
  }

  const onFormSubmit = async (data: FuturesOrderFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await onSubmit(data)
      setSuccess('Futures order placed successfully!')
      setValue('amount', '')
      setValue('price', '')
      setValue('stopPrice', '')
      setValue('takeProfit', '')
      setValue('stopLoss', '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place futures order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Margin Account Overview */}
      {marginAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Margin Account Overview
            </CardTitle>
            <CardDescription>
              Cross and isolated margin balances and risk metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Balance</p>
                <p className="text-lg font-semibold">{formatCurrency(marginAccount.totalWalletBalance)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-lg font-semibold text-green-600">{formatCurrency(marginAccount.availableBalance)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Unrealized PnL</p>
                <p className={`text-lg font-semibold ${marginAccount.totalUnrealizedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(marginAccount.totalUnrealizedProfit)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Margin Ratio</p>
                <div className="space-y-1">
                  <p className="text-lg font-semibold">{formatPercent(calculateMarginRatio())}</p>
                  <Progress value={calculateMarginRatio() * 100} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funding Rate Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Funding Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Funding Rate</p>
              <p className={`text-lg font-semibold ${fundingRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(fundingRate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Funding</p>
              <p className="text-lg font-semibold">{formatCurrency(estimatedFunding)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mark Price</p>
              <p className="text-lg font-semibold">{formatCurrency(markPrice)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Index Price</p>
              <p className="text-lg font-semibold">{formatCurrency(indexPrice)}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <Info className="h-4 w-4 inline mr-1" />
              Next funding in: 3h 45m 22s
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Trading Tabs */}
      <Tabs defaultValue="order" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="order">Place Order</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="order" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Futures Order</CardTitle>
              <CardDescription>
                Place leveraged futures orders with margin trading
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                {/* Symbol Selection */}
                <div>
                  <Label htmlFor="symbol">Trading Pair</Label>
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
                  <Select value={watchedType} onValueChange={(value) => setValue('type', value as "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TAKE_PROFIT" | "TAKE_PROFIT_LIMIT" | "TRAILING_STOP")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MARKET">Market Order</SelectItem>
                      <SelectItem value="LIMIT">Limit Order</SelectItem>
                      <SelectItem value="STOP">Stop Order</SelectItem>
                      <SelectItem value="STOP_LIMIT">Stop Limit</SelectItem>
                      <SelectItem value="TAKE_PROFIT">Take Profit</SelectItem>
                      <SelectItem value="TAKE_PROFIT_LIMIT">Take Profit Limit</SelectItem>
                      <SelectItem value="TRAILING_STOP">Trailing Stop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div>
                  <Label htmlFor="amount">Amount (Contracts)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.001"
                    placeholder="0.000"
                    {...register('amount')}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
                  )}
                </div>

                {/* Price (for limit orders) */}
                {(watchedType === 'LIMIT' || watchedType === 'STOP_LIMIT' || watchedType === 'TAKE_PROFIT_LIMIT') && (
                  <div>
                    <Label htmlFor="price">Price</Label>
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

                {/* Leverage */}
                <div>
                  <Label htmlFor="leverage">Leverage</Label>
                  <Select value={watchedLeverage} onValueChange={(value) => setValue('leverage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {leverageOptions.map(lev => (
                        <SelectItem key={lev} value={lev.toString()}>{lev}x</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Margin Mode */}
                <div>
                  <Label htmlFor="marginMode">Margin Mode</Label>
                  <Select value={watchedMarginMode} onValueChange={(value) => setValue('marginMode', value as 'ISOLATED' | 'CROSS')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ISOLATED">Isolated</SelectItem>
                      <SelectItem value="CROSS">Cross</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Position Mode */}
                <div>
                  <Label htmlFor="positionMode">Position Mode</Label>
                  <Select value={watch('positionMode')} onValueChange={(value) => setValue('positionMode', value as 'HEDGE' | 'ONE_WAY')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_WAY">One-way</SelectItem>
                      <SelectItem value="HEDGE">Hedge Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reduce Only */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reduceOnly"
                    checked={watch('reduceOnly')}
                    onCheckedChange={(checked) => setValue('reduceOnly', checked)}
                  />
                  <Label htmlFor="reduceOnly">Reduce Only (Close Position)</Label>
                </div>

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

                {/* Cost and Liquidation Info */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimated Cost:</span>
                    <span className="font-medium">{formatCurrency(calculateEstimatedCost())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Liquidation Price:</span>
                    <span className="font-medium text-red-600">{formatCurrency(calculateLiquidationPrice())}</span>
                  </div>
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

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Open Positions</CardTitle>
              <CardDescription>
                Current futures positions and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {positions.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-8 w-8 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No open positions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {positions.map((position, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{position.symbol}</h3>
                          <Badge variant={position.side === 'LONG' ? 'default' : 'destructive'}>
                            {position.side}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${position.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(position.unrealizedPnl)}
                          </p>
                          <p className="text-sm text-gray-600">
                            ROE: {formatPercent(position.roe)}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Size</p>
                          <p className="font-medium">{formatNumber(position.size, 3)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Entry Price</p>
                          <p className="font-medium">{formatCurrency(position.entryPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Mark Price</p>
                          <p className="font-medium">{formatCurrency(position.markPrice)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Liquidation Price</p>
                          <p className="font-medium text-red-600">{formatCurrency(position.liquidationPrice)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Profit/Loss Calculator
              </CardTitle>
              <CardDescription>
                Calculate potential profit/loss and liquidation prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Entry Price</Label>
                    <Input type="number" placeholder="43000" />
                  </div>
                  <div>
                    <Label>Exit Price</Label>
                    <Input type="number" placeholder="44000" />
                  </div>
                  <div>
                    <Label>Position Size</Label>
                    <Input type="number" placeholder="0.1" />
                  </div>
                  <div>
                    <Label>Leverage</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="10x" />
                      </SelectTrigger>
                      <SelectContent>
                        {leverageOptions.map(lev => (
                          <SelectItem key={lev} value={lev.toString()}>{lev}x</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Potential Profit</p>
                      <p className="font-medium text-green-600">+{formatCurrency(100)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Potential Loss</p>
                      <p className="font-medium text-red-600">-{formatCurrency(430)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ROI</p>
                      <p className="font-medium text-green-600">+{formatPercent(0.2325)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Liquidation Price</p>
                      <p className="font-medium text-red-600">{formatCurrency(38500)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}