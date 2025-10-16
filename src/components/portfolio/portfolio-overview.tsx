'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, RefreshCw, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'

interface PortfolioAsset {
  id: string
  asset: string
  amount: number
  avgPrice?: number
  value: number
  change24h?: number
  changePercent24h?: number
}

interface Portfolio {
  id: string
  name: string
  description?: string
  type: 'TRADING' | 'INVESTMENT' | 'SIMULATION'
  totalValue: number
  dailyChange?: number
  dailyChangePercent?: number
  totalReturn?: number
  totalReturnPercent?: number
  createdAt: Date
  updatedAt: Date
  assets: PortfolioAsset[]
}

interface PortfolioOverviewProps {
  portfolios?: Portfolio[]
  onCreatePortfolio?: () => void
  onRefresh?: () => void
  isLoading?: boolean
}

export function PortfolioOverview({ 
  portfolios = [], 
  onCreatePortfolio, 
  onRefresh, 
  isLoading = false 
}: PortfolioOverviewProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('')
  const [timeRange, setTimeRange] = useState('24h')
  
  const { data: session } = useSession()

  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      setSelectedPortfolio(portfolios[0].id)
    }
  }, [portfolios, selectedPortfolio])

  const selectedPortfolioData = portfolios.find(p => p.id === selectedPortfolio)

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

  const formatPercent = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    if (change < 0) return <TrendingDown className="h-4 w-4" />
    return null
  }

  const getPortfolioTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      'TRADING': 'default',
      'INVESTMENT': 'secondary',
      'SIMULATION': 'outline'
    }
    return <Badge variant={variants[type] || 'default'}>{type}</Badge>
  }

  const calculateAssetAllocation = () => {
    if (!selectedPortfolioData) return []
    
    const total = selectedPortfolioData.totalValue
    return selectedPortfolioData.assets.map(asset => ({
      ...asset,
      percentage: total > 0 ? (asset.value / total) * 100 : 0
    }))
  }

  const assetAllocation = calculateAssetAllocation()

  const getTopPerformers = () => {
    if (!selectedPortfolioData) return []
    
    return [...selectedPortfolioData.assets]
      .sort((a, b) => (b.changePercent24h || 0) - (a.changePercent24h || 0))
      .slice(0, 5)
  }

  const getWorstPerformers = () => {
    if (!selectedPortfolioData) return []
    
    return [...selectedPortfolioData.assets]
      .sort((a, b) => (a.changePercent24h || 0) - (b.changePercent24h || 0))
      .slice(0, 5)
  }

  if (portfolios.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Portfolios</h3>
            <p className="text-gray-600 mb-4">
              Create your first portfolio to start tracking your investments
            </p>
            <Button onClick={onCreatePortfolio}>
              <Plus className="h-4 w-4 mr-2" />
              Create Portfolio
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Portfolio:</label>
          <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map(portfolio => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="1y">1y</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={onCreatePortfolio}>
            <Plus className="h-4 w-4 mr-2" />
            New Portfolio
          </Button>
        </div>
      </div>

      {selectedPortfolioData && (
        <>
          {/* Portfolio Summary */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(selectedPortfolioData.totalValue)}</div>
                <div className="flex items-center gap-1 text-sm">
                  {getChangeIcon(selectedPortfolioData.dailyChange || 0)}
                  <span className={getChangeColor(selectedPortfolioData.dailyChange || 0)}>
                    {formatCurrency(selectedPortfolioData.dailyChange || 0)} ({formatPercent(selectedPortfolioData.dailyChangePercent || 0)})
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Return</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getChangeColor(selectedPortfolioData.totalReturn || 0)}`}>
                  {formatCurrency(selectedPortfolioData.totalReturn || 0)}
                </div>
                <div className={`text-sm ${getChangeColor(selectedPortfolioData.totalReturnPercent || 0)}`}>
                  {formatPercent(selectedPortfolioData.totalReturnPercent || 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Assets</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedPortfolioData.assets.length}</div>
                <p className="text-xs text-muted-foreground">
                  Unique assets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Type</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {getPortfolioTypeBadge(selectedPortfolioData.type)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Created {formatDistanceToNow(selectedPortfolioData.createdAt, { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Asset Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
                <CardDescription>Portfolio distribution by asset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assetAllocation.map((asset, index) => (
                    <div key={asset.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{asset.asset}</span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(asset.value)}</div>
                          <div className="text-sm text-gray-500">{formatPercent(asset.percentage)}</div>
                        </div>
                      </div>
                      <Progress value={asset.percentage} className="h-2" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{formatNumber(asset.amount)} {asset.asset}</span>
                        {asset.avgPrice && (
                          <span>Avg: {formatCurrency(asset.avgPrice)}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Asset Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Asset Performance</CardTitle>
                <CardDescription>24h performance by asset</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Top Performers */}
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">Top Performers</h4>
                    <div className="space-y-2">
                      {getTopPerformers().map((asset, index) => (
                        <div key={asset.id} className="flex justify-between items-center">
                          <span className="font-medium">{asset.asset}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{formatCurrency(asset.value)}</span>
                            <Badge variant="outline" className="text-green-600">
                              {formatPercent(asset.changePercent24h || 0)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Worst Performers */}
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Worst Performers</h4>
                    <div className="space-y-2">
                      {getWorstPerformers().map((asset, index) => (
                        <div key={asset.id} className="flex justify-between items-center">
                          <span className="font-medium">{asset.asset}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{formatCurrency(asset.value)}</span>
                            <Badge variant="outline" className="text-red-600">
                              {formatPercent(asset.changePercent24h || 0)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Asset Table */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Details</CardTitle>
              <CardDescription>Complete breakdown of portfolio holdings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Avg Price</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Allocation</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead>24h %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPortfolioData.assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.asset}</TableCell>
                        <TableCell>{formatNumber(asset.amount)}</TableCell>
                        <TableCell>
                          {asset.avgPrice ? formatCurrency(asset.avgPrice) : '-'}
                        </TableCell>
                        <TableCell>{formatCurrency(asset.value)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={assetAllocation.find(a => a.id === asset.id)?.percentage || 0} 
                              className="w-16 h-2" 
                            />
                            <span className="text-sm">
                              {formatPercent(assetAllocation.find(a => a.id === asset.id)?.percentage || 0)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className={getChangeColor(asset.change24h || 0)}>
                          {asset.change24h ? formatCurrency(asset.change24h) : '-'}
                        </TableCell>
                        <TableCell className={getChangeColor(asset.changePercent24h || 0)}>
                          {asset.changePercent24h ? formatPercent(asset.changePercent24h) : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}