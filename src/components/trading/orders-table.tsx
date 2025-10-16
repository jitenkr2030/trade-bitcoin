'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { OrderType, OrderSide, OrderStatus } from '@prisma/client'
import { X, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react'

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

interface OrdersTableProps {
  orders: Order[]
  onCancelOrder: (orderId: string) => Promise<void>
  onRefreshOrders?: () => Promise<void>
  isLoading?: boolean
  showFilters?: boolean
}

export function OrdersTable({ 
  orders, 
  onCancelOrder, 
  onRefreshOrders, 
  isLoading = false,
  showFilters = true 
}: OrdersTableProps) {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders)
  const [filters, setFilters] = useState({
    symbol: '',
    status: '',
    side: '',
    type: ''
  })

  useEffect(() => {
    let filtered = orders

    if (filters.symbol) {
      filtered = filtered.filter(order => 
        order.symbol.toLowerCase().includes(filters.symbol.toLowerCase())
      )
    }

    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status)
    }

    if (filters.side) {
      filtered = filtered.filter(order => order.side === filters.side)
    }

    if (filters.type) {
      filtered = filtered.filter(order => order.type === filters.type)
    }

    setFilteredOrders(filtered)
  }, [orders, filters])

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

  const getStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      [OrderStatus.PENDING]: 'secondary',
      [OrderStatus.OPEN]: 'default',
      [OrderStatus.PARTIALLY_FILLED]: 'outline',
      [OrderStatus.FILLED]: 'default',
      [OrderStatus.CANCELLED]: 'secondary',
      [OrderStatus.EXPIRED]: 'secondary',
      [OrderStatus.REJECTED]: 'destructive'
    }

    const icons = {
      [OrderStatus.PENDING]: <Clock className="h-3 w-3" />,
      [OrderStatus.OPEN]: <AlertCircle className="h-3 w-3" />,
      [OrderStatus.PARTIALLY_FILLED]: <Clock className="h-3 w-3" />,
      [OrderStatus.FILLED]: <CheckCircle className="h-3 w-3" />,
      [OrderStatus.CANCELLED]: <X className="h-3 w-3" />,
      [OrderStatus.EXPIRED]: <X className="h-3 w-3" />,
      [OrderStatus.REJECTED]: <X className="h-3 w-3" />
    }

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {icons[status]}
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getSideBadge = (side: OrderSide) => {
    return (
      <Badge variant={side === OrderSide.BUY ? 'default' : 'destructive'}>
        {side}
      </Badge>
    )
  }

  const isCancellable = (status: OrderStatus) => {
    const cancellableStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.OPEN, OrderStatus.PARTIALLY_FILLED];
    return cancellableStatuses.includes(status);
  }

  const getFillPercentage = (order: Order) => {
    if (order.amount === 0) return 0
    return (order.executedAmount / order.amount) * 100
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Orders</CardTitle>
          {onRefreshOrders && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefreshOrders}
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
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {Object.values(OrderStatus).map(status => (
                  <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.side} onValueChange={(value) => setFilters(prev => ({ ...prev, side: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Sides" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sides</SelectItem>
                {Object.values(OrderSide).map(side => (
                  <SelectItem key={side} value={side}>{side}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {Object.values(OrderType).map(type => (
                  <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Filled</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    {orders.length === 0 ? 'No orders found' : 'No orders match the filters'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.symbol}</TableCell>
                    <TableCell>{getSideBadge(order.side)}</TableCell>
                    <TableCell>{order.type.replace('_', ' ')}</TableCell>
                    <TableCell>{formatNumber(order.amount)}</TableCell>
                    <TableCell>
                      {order.price ? formatCurrency(order.price) : 'Market'}
                      {order.stopPrice && (
                        <div className="text-xs text-gray-500">
                          Stop: {formatCurrency(order.stopPrice)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${getFillPercentage(order)}%` }}
                          />
                        </div>
                        <span className="text-xs">
                          {formatNumber(order.executedAmount)}/{formatNumber(order.amount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.exchangeAccount?.exchange.displayName || order.exchangeAccount?.exchange.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDistanceToNow(order.createdAt, { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {isCancellable(order.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCancelOrder(order.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {filteredOrders.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </CardContent>
    </Card>
  )
}