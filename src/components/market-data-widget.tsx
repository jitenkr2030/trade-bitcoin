'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMarketData } from '@/hooks/use-market-data'
import { TrendingUp, TrendingDown, Minus, Activity, Clock } from 'lucide-react'

interface MarketDataWidgetProps {
  exchangeAccountId: string
  symbol: string
  channels?: ('ticker' | 'orderbook' | 'trades' | 'candlesticks')[]
  showOrderBook?: boolean
  showTrades?: boolean
  showCandlesticks?: boolean
}

export function MarketDataWidget({
  exchangeAccountId,
  symbol,
  channels = ['ticker'],
  showOrderBook = false,
  showTrades = false,
  showCandlesticks = false
}: MarketDataWidgetProps) {
  const {
    ticker,
    orderBook,
    trades,
    candlesticks,
    isConnected,
    error,
    lastUpdate
  } = useMarketData({
    exchangeAccountId,
    symbol,
    channels,
    enabled: true
  })

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const formatCurrency = (num: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatPercent = (num: number) => {
    return `${num >= 0 ? '+' : ''}${formatNumber(num, 2)}%`
  }

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    if (change < 0) return <TrendingDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Connection Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        {lastUpdate && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>

      {/* Ticker Information */}
      {ticker && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="text-xl font-bold">{symbol}</span>
              <Badge variant={ticker.priceChange24h >= 0 ? 'default' : 'destructive'}>
                {formatPercent(ticker.priceChangePercent || 0)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(ticker.lastPrice || ticker.price || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">24h Change</p>
                <p className={`text-lg font-semibold flex items-center ${getPriceChangeColor(ticker.priceChange24h || 0)}`}>
                  {getPriceChangeIcon(ticker.priceChange24h || 0)}
                  {formatCurrency(ticker.priceChange24h || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">24h High</p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(ticker.high24h || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">24h Low</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(ticker.low24h || 0)}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Volume 24h</p>
                <p className="font-medium">
                  {formatNumber(ticker.volume || 0, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Quote Volume</p>
                <p className="font-medium">
                  {formatCurrency(ticker.quoteVolume || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trades Count</p>
                <p className="font-medium">
                  {formatNumber(ticker.tradesCount || 0, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Book */}
      {showOrderBook && orderBook && (
        <Card>
          <CardHeader>
            <CardTitle>Order Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Bids */}
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Bids</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {orderBook.bids?.slice(0, 10).map(([price, quantity]: [number, number], index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-green-600">{formatCurrency(price)}</span>
                      <span>{formatNumber(quantity, 4)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Asks */}
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Asks</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {orderBook.asks?.slice(0, 10).map(([price, quantity]: [number, number], index: number) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-red-600">{formatCurrency(price)}</span>
                      <span>{formatNumber(quantity, 4)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Spread */}
            {orderBook.bids?.[0] && orderBook.asks?.[0] && (
              <div className="mt-4 p-2 bg-gray-100 rounded">
                <p className="text-sm text-center">
                  Spread: {formatCurrency(orderBook.asks[0][0] - orderBook.bids[0][0])}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Trades */}
      {showTrades && trades && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {trades.slice(0, 20).map((trade, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{formatCurrency(trade.price)}</span>
                  <span className={trade.side === 'BUY' ? 'text-green-600' : 'text-red-600'}>
                    {trade.side}
                  </span>
                  <span>{formatNumber(trade.amount, 4)}</span>
                  <span className="text-gray-500">
                    {new Date(trade.timestamp || trade.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candlesticks */}
      {showCandlesticks && candlesticks && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Candlesticks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {candlesticks.slice(-20).map((candle, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-medium">
                    {new Date(candle.timestamp).toLocaleString()}
                  </span>
                  <span className={candle.close >= candle.open ? 'text-green-600' : 'text-red-600'}>
                    O: {formatCurrency(candle.open)}
                  </span>
                  <span className={candle.close >= candle.open ? 'text-green-600' : 'text-red-600'}>
                    C: {formatCurrency(candle.close)}
                  </span>
                  <span className="text-blue-600">
                    H: {formatCurrency(candle.high)}
                  </span>
                  <span className="text-purple-600">
                    L: {formatCurrency(candle.low)}
                  </span>
                  <span>
                    V: {formatNumber(candle.volume, 0)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}