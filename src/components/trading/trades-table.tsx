'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { OrderSide } from '@prisma/client'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

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

interface TradesTableProps {
  trades: Trade[]
  onRefreshTrades?: () => Promise<void>
  isLoading?: boolean
  showFilters?: boolean
  showBotInfo?: boolean
}

export function TradesTable({ 
  trades, 
  onRefreshTrades, 
  isLoading = false,
  showFilters = true,
  showBotInfo = false
}: TradesTableProps) {
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>(trades)
  const [filters, setFilters] = useState({
    symbol: '',
    side: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    let filtered = trades

    if (filters.symbol) {
      filtered = filtered.filter(trade => 
        trade.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
      )
    }

    if (filters.side) {
      filtered = filtered.filter(trade => trade.side === filters.side)
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom)
      filtered = filtered.filter(trade => trade.createdAt >= fromDate)
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(trade => trade.createdAt <= toDate)
    }

    setFilteredTrades(filtered)
  }, [trades, filters])

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

  const getSideBadge = (side: OrderSide) => {
    const icon = side === OrderSide.BUY ? 
      <TrendingUp className="h-3 w-3" /> : 
      <TrendingDown className="h-3 w-3" />
    
    return (
      <Badge variant={side === OrderSide.BUY ? 'default' : 'destructive'} className="flex items-center gap-1">
        {icon}
        {side}
      </Badge>
    )
  }

  const calculateTotalValue = (trade: Trade) => {
    return trade.amount * trade.price
  }

  const getUniqueSymbols = () => {
    return Array.from(new Set(trades.map(trade => trade.symbol)))
  }

  const getTradeStatistics = () => {
    if (filteredTrades.length === 0) return null

    const buyTrades = filteredTrades.filter(t => t.side === OrderSide.BUY)
    const sellTrades = filteredTrades.filter(t => t.side === OrderSide.SELL)
    
    const totalVolume = filteredTrades.reduce((sum, trade) => sum + calculateTotalValue(trade), 0)
    const buyVolume = buyTrades.reduce((sum, trade) => sum + calculateTotalValue(trade), 0)
    const sellVolume = sellTrades.reduce((sum, trade) => sum + calculateTotalValue(trade), 0)
    
    const totalFees = filteredTrades.reduce((sum, trade) => sum + (trade.fee || 0), 0)

    return {
      totalTrades: filteredTrades.length,
      buyTrades: buyTrades.length,
      sellTrades: sellTrades.length,
      totalVolume,
      buyVolume,
      sellVolume,
      totalFees
    }
  }

  const stats = getTradeStatistics()

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Trade History</CardTitle>
          {onRefreshTrades && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshTrades}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Input
                placeholder="Filter by symbol..."
                value={filters.symbol}
                onChange={(e) => setFilters(prev => ({ ...prev, symbol: e.target.value }))}
              />
            </div>
            <Select value={filters.side} onValueChange={(value) => setFilters(prev => ({ ...prev, side: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Sides" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sides</SelectItem>
                <SelectItem value={OrderSide.BUY}>Buy</SelectItem>
                <SelectItem value={OrderSide.SELL}>Sell</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Input
                type="date"
                placeholder="From date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            <div>
              <Input
                type="date"
                placeholder="To date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Trade Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-semibold">{stats.totalTrades}</div>
              <div className="text-xs text-gray-600">Total Trades</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-semibold text-green-600">{stats.buyTrades}</div>
              <div className="text-xs text-gray-600">Buy Trades</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="text-lg font-semibold text-red-600">{stats.sellTrades}</div>
              <div className="text-xs text-gray-600">Sell Trades</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-lg font-semibold text-blue-600">{formatCurrency(stats.totalVolume)}</div>
              <div className="text-xs text-gray-600">Total Volume</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="text-lg font-semibold text-purple-600">{formatCurrency(stats.buyVolume)}</div>
              <div className="text-xs text-gray-600">Buy Volume</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="text-lg font-semibold text-orange-600">{formatCurrency(stats.sellVolume)}</div>
              <div className="text-xs text-gray-600">Sell Volume</div>
            </div>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                {showBotInfo && <TableHead>Bot</TableHead>}
                <TableHead>Exchange</TableHead>
                <TableHead>Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showBotInfo ? 9 : 8} className="text-center py-8 text-gray-500">
                    {trades.length === 0 ? 'No trades found' : 'No trades match the filters'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="text-sm">
                      <div className="flex flex-col">
                        <span>{new Date(trade.createdAt).toLocaleDateString()}</span>
                        <span className="text-gray-500">{new Date(trade.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{trade.symbol}</TableCell>
                    <TableCell>{getSideBadge(trade.side)}</TableCell>
                    <TableCell>{formatNumber(trade.amount)}</TableCell>
                    <TableCell>{formatCurrency(trade.price)}</TableCell>
                    <TableCell>{formatCurrency(calculateTotalValue(trade))}</TableCell>
                    {showBotInfo && (
                      <TableCell>
                        {trade.bot ? (
                          <Badge variant="outline">{trade.bot.name}</Badge>
                        ) : (
                          <span className="text-gray-400">Manual</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge variant="outline">
                        {trade.exchangeAccount?.exchange.displayName || trade.exchangeAccount?.exchange.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {trade.fee ? (
                        <div className="text-sm">
                          <div>{formatNumber(trade.fee, 4)}</div>
                          <div className="text-gray-500">{trade.feeCurrency}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredTrades.length > 0 && (
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <span>Showing {filteredTrades.length} of {trades.length} trades</span>
            {stats && (
              <span>Total Fees: {formatCurrency(stats.totalFees)}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}