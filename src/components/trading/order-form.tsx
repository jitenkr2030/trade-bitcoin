'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { OrderType, OrderSide } from '@prisma/client'
import { useMarketData } from '@/hooks/use-market-data'
import { Info } from 'lucide-react'

const orderFormSchema = z.object({
  symbol: z.string().min(1, 'Symbol is required'),
  side: z.enum(['BUY', 'SELL']),
  type: z.enum(['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT', 'TAKE_PROFIT', 'TAKE_PROFIT_LIMIT', 'OCO', 'TRAILING_STOP', 'ICEBERG', 'FILL_OR_KILL', 'IMMEDIATE_OR_CANCEL']),
  amount: z.string().min(1, 'Amount is required'),
  price: z.string().optional(),
  stopPrice: z.string().optional(),
  timeInForce: z.enum(['GTC', 'IOC', 'FOK']).optional(),
  leverage: z.string().optional(),
  // Advanced order types
  takeProfitPrice: z.string().optional(),
  stopLossPrice: z.string().optional(),
  trailingStopAmount: z.string().optional(),
  trailingStopPercent: z.string().optional(),
  ocoSecondaryPrice: z.string().optional(),
  ocoSecondaryType: z.enum(['LIMIT', 'STOP']).optional(),
  icebergVisibleQty: z.string().optional(),
  conditionalTriggerPrice: z.string().optional(),
  conditionalTriggerType: z.enum(['LAST_PRICE', 'MARK_PRICE', 'INDEX_PRICE']).optional()
})

type OrderFormData = z.infer<typeof orderFormSchema>

interface OrderFormProps {
  exchangeAccountId: string
  onSubmit: (data: OrderFormData) => Promise<void>
  availableBalance?: Record<string, number>
  currentPositions?: Record<string, number>
}

export function OrderForm({ exchangeAccountId, onSubmit, availableBalance = {}, currentPositions = {} }: OrderFormProps) {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { ticker } = useMarketData({
    exchangeAccountId,
    symbol: selectedSymbol,
    channels: ['ticker'],
    enabled: true
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      symbol: selectedSymbol,
      side: 'BUY',
      type: 'MARKET',
      amount: '',
      timeInForce: 'GTC'
    }
  })

  const watchedSide = watch('side')
  const watchedType = watch('type')
  const watchedAmount = watch('amount')

  const popularSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'SOLUSDT', 'DOTUSDT']

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

  const calculateEstimatedCost = () => {
    if (!watchedAmount || !ticker) return 0
    const amount = parseFloat(watchedAmount)
    const price = ticker.lastPrice || ticker.price || 0
    return amount * price
  }

  const getAvailableBalance = () => {
    const quoteAsset = selectedSymbol.replace('BTC', '').replace('ETH', '').replace('BNB', '').replace('ADA', '').replace('SOL', '').replace('DOT', '') || 'USDT'
    return availableBalance[quoteAsset] || 0
  }

  const getCurrentPosition = () => {
    const baseAsset = selectedSymbol.replace('USDT', '')
    return currentPositions[baseAsset] || 0
  }

  const onFormSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await onSubmit(data)
      setSuccess('Order placed successfully!')
      // Reset form
      setValue('amount', '')
      setValue('price', '')
      setValue('stopPrice', '')
      setValue('takeProfitPrice', '')
      setValue('stopLossPrice', '')
      setValue('trailingStopAmount', '')
      setValue('trailingStopPercent', '')
      setValue('ocoSecondaryPrice', '')
      setValue('icebergVisibleQty', '')
      setValue('conditionalTriggerPrice', '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
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

          {/* Current Price Display */}
          {ticker && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current Price</span>
                <span className="font-semibold">{formatCurrency(ticker.lastPrice || ticker.price || 0)}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-600">24h Change</span>
                <span className={`text-sm ${ticker.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {ticker.priceChangePercent >= 0 ? '+' : ''}{ticker.priceChangePercent?.toFixed(2)}%
                </span>
              </div>
            </div>
          )}

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
                BUY
              </Button>
              <Button
                type="button"
                variant={watchedSide === 'SELL' ? 'destructive' : 'outline'}
                onClick={() => setValue('side', 'SELL')}
                className="w-full"
              >
                SELL
              </Button>
            </div>
          </div>

          {/* Order Type */}
          <div>
            <Label htmlFor="type">Order Type</Label>
            <Select value={watchedType} onValueChange={(value) => setValue('type', value as OrderType)}>
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
                <SelectItem value="OCO">One-Cancels-Other (OCO)</SelectItem>
                <SelectItem value="TRAILING_STOP">Trailing Stop</SelectItem>
                <SelectItem value="ICEBERG">Iceberg Order</SelectItem>
                <SelectItem value="FILL_OR_KILL">Fill or Kill (FOK)</SelectItem>
                <SelectItem value="IMMEDIATE_OR_CANCEL">Immediate or Cancel (IOC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              placeholder="0.00000000"
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

          {/* Stop Price (for stop orders) */}
          {(watchedType === 'STOP' || watchedType === 'STOP_LIMIT') && (
            <div>
              <Label htmlFor="stopPrice">Stop Price</Label>
              <Input
                id="stopPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('stopPrice')}
              />
              {errors.stopPrice && (
                <p className="text-sm text-red-600 mt-1">{errors.stopPrice.message}</p>
              )}
            </div>
          )}

          {/* Time in Force */}
          <div>
            <Label htmlFor="timeInForce">Time in Force</Label>
            <Select value={watch('timeInForce')} onValueChange={(value) => setValue('timeInForce', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GTC">Good 'til Canceled</SelectItem>
                <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                <SelectItem value="FOK">Fill or Kill</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leverage (for margin trading) */}
          <div>
            <Label htmlFor="leverage">Leverage (Optional)</Label>
            <Input
              id="leverage"
              type="number"
              min="1"
              max="125"
              placeholder="1"
              {...register('leverage')}
            />
          </div>

          {/* Advanced Order Types Section */}
          {(watchedType === 'OCO' || watchedType === 'TRAILING_STOP' || watchedType === 'ICEBERG') && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Advanced Order Settings</h4>
              
              {/* OCO (One-Cancels-Other) Order Settings */}
              {watchedType === 'OCO' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="takeProfitPrice">Take Profit Price</Label>
                      <Input
                        id="takeProfitPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register('takeProfitPrice')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stopLossPrice">Stop Loss Price</Label>
                      <Input
                        id="stopLossPrice"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...register('stopLossPrice')}
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Info className="h-4 w-4 inline mr-1" />
                      OCO orders place two orders simultaneously. When one fills, the other is automatically canceled.
                    </p>
                  </div>
                </div>
              )}

              {/* Trailing Stop Order Settings */}
              {watchedType === 'TRAILING_STOP' && (
                <div className="space-y-4">
                  <div>
                    <Label>Trailing Stop Type</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        type="button"
                        variant={watch('trailingStopAmount') ? 'default' : 'outline'}
                        onClick={() => {
                          setValue('trailingStopAmount', '100')
                          setValue('trailingStopPercent', '')
                        }}
                        className="w-full"
                        size="sm"
                      >
                        Fixed Amount
                      </Button>
                      <Button
                        type="button"
                        variant={watch('trailingStopPercent') ? 'default' : 'outline'}
                        onClick={() => {
                          setValue('trailingStopPercent', '1')
                          setValue('trailingStopAmount', '')
                        }}
                        className="w-full"
                        size="sm"
                      >
                        Percentage
                      </Button>
                    </div>
                  </div>
                  
                  {watch('trailingStopAmount') && (
                    <div>
                      <Label htmlFor="trailingStopAmount">Trailing Amount ($)</Label>
                      <Input
                        id="trailingStopAmount"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        {...register('trailingStopAmount')}
                      />
                    </div>
                  )}
                  
                  {watch('trailingStopPercent') && (
                    <div>
                      <Label htmlFor="trailingStopPercent">Trailing Percentage (%)</Label>
                      <Input
                        id="trailingStopPercent"
                        type="number"
                        step="0.1"
                        placeholder="1.0"
                        {...register('trailingStopPercent')}
                      />
                    </div>
                  )}
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <Info className="h-4 w-4 inline mr-1" />
                      Trailing stop orders adjust automatically as the price moves in your favor, locking in profits.
                    </p>
                  </div>
                </div>
              )}

              {/* Iceberg Order Settings */}
              {watchedType === 'ICEBERG' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="icebergVisibleQty">Visible Quantity</Label>
                    <Input
                      id="icebergVisibleQty"
                      type="number"
                      step="0.00000001"
                      placeholder="0.10000000"
                      {...register('icebergVisibleQty')}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The maximum quantity visible in the order book at any time
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <Info className="h-4 w-4 inline mr-1" />
                      Iceberg orders break large orders into smaller chunks to minimize market impact and hide the full order size.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Balance and Position Info */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Available Balance:</span>
              <span>{formatNumber(getAvailableBalance(), 8)} {selectedSymbol.replace('BTC', '').replace('ETH', '').replace('BNB', '').replace('ADA', '').replace('SOL', '').replace('DOT', '') || 'USDT'}</span>
            </div>
            {watchedSide === 'SELL' && (
              <div className="flex justify-between text-sm">
                <span>Current Position:</span>
                <span>{formatNumber(getCurrentPosition(), 8)} {selectedSymbol.replace('USDT', '')}</span>
              </div>
            )}
            {watchedAmount && ticker && (
              <div className="flex justify-between text-sm font-medium">
                <span>Estimated Cost:</span>
                <span>{formatCurrency(calculateEstimatedCost())}</span>
              </div>
            )}
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
  )
}