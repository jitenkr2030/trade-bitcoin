"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Star,
  Calendar,
  DollarSign,
  Target,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Eye,
  MessageSquare,
  Download,
  Settings,
  Maximize2,
  Minimize2
} from "lucide-react"

interface TradeEntry {
  id: string
  date: Date
  symbol: string
  assetName: string
  direction: 'long' | 'short'
  entryPrice: number
  exitPrice?: number
  quantity: number
  positionSize: number
  fees: number
  pnl?: number
  pnlPercentage?: number
  status: 'open' | 'closed' | 'cancelled'
  strategy: string
  timeframe: string
  confidence: number
  notes: string
  tags: string[]
  screenshots?: string[]
  emotionalState: 'confident' | 'nervous' | 'excited' | 'disappointed' | 'neutral'
  lessonsLearned?: string
  rating: number
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

interface TradeJournalStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnl: number
  averageWin: number
  averageLoss: number
  profitFactor: number
  largestWin: number
  largestLoss: number
  averageHoldTime: number
  bestStrategy: string
  worstStrategy: string
}

interface TradeJournalProps {
  height?: number
  showControls?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
  onFullscreen?: () => void
}

// Generate realistic trade journal data
const generateTradeJournalData = (): {
  entries: TradeEntry[]
  stats: TradeJournalStats
} => {
  const entries: TradeEntry[] = []
  const strategies = ['Trend Following', 'Mean Reversion', 'Breakout', 'Scalping', 'Swing Trading', 'Position Trading', 'Arbitrage']
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w']
  const assets = [
    { symbol: 'BTCUSDT', name: 'Bitcoin' },
    { symbol: 'ETHUSDT', name: 'Ethereum' },
    { symbol: 'BNBUSDT', name: 'Binance Coin' },
    { symbol: 'SOLUSDT', name: 'Solana' },
    { symbol: 'ADAUSDT', name: 'Cardano' },
    { symbol: 'DOTUSDT', name: 'Polkadot' }
  ]
  const emotionalStates: Array<'confident' | 'nervous' | 'excited' | 'disappointed' | 'neutral'> = ['confident', 'nervous', 'excited', 'disappointed', 'neutral']
  const tags = ['technical', 'fundamental', 'news', 'sentiment', 'breakout', 'support', 'resistance', 'trend', 'range', 'momentum']
  
  let totalPnl = 0
  let winningTrades = 0
  let losingTrades = 0
  let totalWins = 0
  let totalLosses = 0
  let largestWin = 0
  let largestLoss = 0
  
  const now = new Date()
  
  // Generate trade entries for the last 30 days
  for (let i = 0; i < 50; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000 + Math.random() * 24 * 60 * 60 * 1000))
    const asset = assets[Math.floor(Math.random() * assets.length)]
    const direction = Math.random() > 0.5 ? 'long' : 'short'
    const entryPrice = asset.symbol === 'BTCUSDT' ? 43000 + (Math.random() - 0.5) * 5000 :
                     asset.symbol === 'ETHUSDT' ? 2500 + (Math.random() - 0.5) * 500 :
                     100 + (Math.random() - 0.5) * 50
    const quantity = Math.random() * 2 + 0.1
    const positionSize = entryPrice * quantity
    const fees = positionSize * 0.001
    const status = Math.random() > 0.2 ? 'closed' : 'open'
    
    let exitPrice, pnl, pnlPercentage
    if (status === 'closed') {
      const priceChange = (Math.random() - 0.5) * (entryPrice * 0.1) // ±10% change
      exitPrice = direction === 'long' ? entryPrice + priceChange : entryPrice - priceChange
      pnl = direction === 'long' ? 
        (exitPrice - entryPrice) * quantity - fees : 
        (entryPrice - exitPrice) * quantity - fees
      pnlPercentage = (pnl / positionSize) * 100
      
      totalPnl += pnl
      if (pnl > 0) {
        winningTrades++
        totalWins += pnl
        largestWin = Math.max(largestWin, pnl)
      } else {
        losingTrades++
        totalLosses += Math.abs(pnl)
        largestLoss = Math.max(largestLoss, Math.abs(pnl))
      }
    }
    
    const confidence = Math.floor(Math.random() * 5) + 1
    const emotionalState = emotionalStates[Math.floor(Math.random() * emotionalStates.length)]
    const strategy = strategies[Math.floor(Math.random() * strategies.length)]
    const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)]
    const rating = Math.floor(Math.random() * 5) + 1
    const isFavorite = Math.random() > 0.9
    
    entries.push({
      id: `trade_${i}`,
      date,
      symbol: asset.symbol,
      assetName: asset.name,
      direction,
      entryPrice: Number(entryPrice.toFixed(2)),
      exitPrice: exitPrice ? Number(exitPrice.toFixed(2)) : undefined,
      quantity: Number(quantity.toFixed(6)),
      positionSize: Number(positionSize.toFixed(2)),
      fees: Number(fees.toFixed(2)),
      pnl: pnl ? Number(pnl.toFixed(2)) : undefined,
      pnlPercentage: pnlPercentage ? Number(pnlPercentage.toFixed(2)) : undefined,
      status,
      strategy,
      timeframe,
      confidence,
      notes: `Trade analysis for ${asset.name}. ${direction === 'long' ? 'Bullish' : 'Bearish'} setup with ${confidence}/5 confidence.`,
      tags: tags.slice(0, Math.floor(Math.random() * 4) + 1),
      emotionalState,
      lessonsLearned: status === 'closed' ? 
        `Key learnings from this trade: ${pnl && pnl > 0 ? 'Successful execution of strategy' : 'Areas for improvement identified'}` : 
        undefined,
      rating,
      isFavorite,
      createdAt: date,
      updatedAt: new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000)
    })
  }
  
  const stats: TradeJournalStats = {
    totalTrades: entries.length,
    winningTrades,
    losingTrades,
    winRate: winningTrades > 0 ? (winningTrades / (winningTrades + losingTrades)) * 100 : 0,
    totalPnl: Number(totalPnl.toFixed(2)),
    averageWin: winningTrades > 0 ? Number((totalWins / winningTrades).toFixed(2)) : 0,
    averageLoss: losingTrades > 0 ? Number((totalLosses / losingTrades).toFixed(2)) : 0,
    profitFactor: totalLosses > 0 ? Number((totalWins / totalLosses).toFixed(2)) : 0,
    largestWin: Number(largestWin.toFixed(2)),
    largestLoss: Number(largestLoss.toFixed(2)),
    averageHoldTime: 2.5, // days
    bestStrategy: strategies[Math.floor(Math.random() * strategies.length)],
    worstStrategy: strategies[Math.floor(Math.random() * strategies.length)]
  }
  
  return {
    entries: entries.sort((a, b) => b.date.getTime() - a.date.getTime()),
    stats
  }
}

export function TradeJournal({ 
  height = 600,
  showControls = true,
  autoRefresh = true,
  refreshInterval = 300000, // 5 minutes
  onFullscreen
}: TradeJournalProps) {
  const [journalData, setJournalData] = useState<{
    entries: TradeEntry[]
    stats: TradeJournalStats
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterDirection, setFilterDirection] = useState<string>('all')
  const [filterStrategy, setFilterStrategy] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<TradeEntry | null>(null)

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      const data = generateTradeJournalData()
      setJournalData(data)
      setIsLoading(false)
    }

    loadData()
    
    if (autoRefresh) {
      const interval = setInterval(loadData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval])

  const handleRefresh = () => {
    setIsLoading(true)
    const data = generateTradeJournalData()
    setJournalData(data)
    setIsLoading(false)
  }

  const toggleFavorite = (entryId: string) => {
    if (!journalData) return
    
    setJournalData(prev => {
      if (!prev) return prev
      
      return {
        ...prev,
        entries: prev.entries.map(entry => 
          entry.id === entryId 
            ? { ...entry, isFavorite: !entry.isFavorite }
            : entry
        )
      }
    })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    onFullscreen?.()
  }

  const getFilteredEntries = () => {
    if (!journalData) return []
    
    let filtered = journalData.entries
    
    // Time range filter
    const now = new Date()
    const rangeMs = {
      'week': 7 * 24 * 60 * 60 * 1000,
      'month': 30 * 24 * 60 * 60 * 1000,
      'quarter': 90 * 24 * 60 * 60 * 1000,
      'year': 365 * 24 * 60 * 60 * 1000
    }[timeRange]
    
    filtered = filtered.filter(entry => 
      now.getTime() - entry.date.getTime() <= rangeMs
    )
    
    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(entry => entry.status === filterStatus)
    }
    
    // Direction filter
    if (filterDirection !== 'all') {
      filtered = filtered.filter(entry => entry.direction === filterDirection)
    }
    
    // Strategy filter
    if (filterStrategy !== 'all') {
      filtered = filtered.filter(entry => entry.strategy === filterStrategy)
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.notes.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Favorites only filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(entry => entry.isFavorite)
    }
    
    return filtered
  }

  const exportToCSV = () => {
    if (!journalData) return
    
    const entries = getFilteredEntries()
    const headers = ['Date', 'Symbol', 'Direction', 'Entry Price', 'Exit Price', 'Quantity', 'P&L', 'P&L %', 'Strategy', 'Status', 'Rating']
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        entry.date.toLocaleDateString(),
        entry.symbol,
        entry.direction,
        entry.entryPrice,
        entry.exitPrice || '',
        entry.quantity,
        entry.pnl || '',
        entry.pnlPercentage ? `${entry.pnlPercentage}%` : '',
        entry.strategy,
        entry.status,
        entry.rating
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trade_journal_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'closed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDirectionColor = (direction: string) => {
    return direction === 'long' ? 'text-green-600' : 'text-red-600'
  }

  const getDirectionIcon = (direction: string) => {
    return direction === 'long' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
  }

  const getEmotionalStateColor = (state: string) => {
    switch (state) {
      case 'confident': return 'text-green-600'
      case 'excited': return 'text-blue-600'
      case 'nervous': return 'text-yellow-600'
      case 'disappointed': return 'text-red-600'
      case 'neutral': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value: number, decimals: number = 6) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
  }

  if (isLoading || !journalData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Trade Journal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[600px]">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredEntries = getFilteredEntries()
  const uniqueStrategies = [...new Set(journalData.entries.map(e => e.strategy))]

  return (
    <Card className={isFullscreen ? "fixed inset-0 z-50 m-0" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <CardTitle>Trade Journal</CardTitle>
          </div>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Total Trades:</span>
            <Badge variant="secondary">{journalData.stats.totalTrades}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Win Rate:</span>
            <Badge variant="outline" className="text-green-600">{journalData.stats.winRate.toFixed(1)}%</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Total P&L:</span>
            <Badge variant={journalData.stats.totalPnl >= 0 ? "default" : "destructive"}>
              {formatCurrency(journalData.stats.totalPnl)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Profit Factor:</span>
            <Badge variant="outline">{journalData.stats.profitFactor.toFixed(2)}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="journal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="journal">Trade Journal</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="journal" className="space-y-4">
            <div className="space-y-4 mb-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Search trades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <Select value={timeRange} onValueChange={(value) => setTimeRange(value as 'week' | 'month' | 'quarter' | 'year')}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={filterDirection} onValueChange={setFilterDirection}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  variant={showFavoritesOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                >
                  <Star className={`h-4 w-4 mr-1 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                  Favorites
                </Button>
              </div>
            </div>

            <ScrollArea className={`${height}px`}>
              <div className="space-y-3">
                {filteredEntries.map((entry) => (
                  <Card key={entry.id} className={`cursor-pointer transition-colors ${
                    selectedEntry?.id === entry.id ? 'ring-2 ring-blue-400' : ''
                  }`} onClick={() => setSelectedEntry(entry)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {entry.symbol}
                            </Badge>
                            <Badge className={`text-xs ${getDirectionColor(entry.direction)}`}>
                              {getDirectionIcon(entry.direction)}
                              <span className="ml-1">{entry.direction.toUpperCase()}</span>
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(entry.status)}`}>
                              {entry.status}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {entry.date.toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <div className="flex items-center gap-1">
                              <span>Entry:</span>
                              <span className="font-medium">{formatCurrency(entry.entryPrice)}</span>
                            </div>
                            {entry.exitPrice && (
                              <div className="flex items-center gap-1">
                                <span>Exit:</span>
                                <span className="font-medium">{formatCurrency(entry.exitPrice)}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <span>Size:</span>
                              <span>{formatNumber(entry.quantity)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Strategy:</span>
                              <span>{entry.strategy}</span>
                            </div>
                          </div>
                          
                          {entry.pnl !== undefined && (
                            <div className="flex items-center gap-4 text-sm">
                              <div className={`font-medium ${entry.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                P&L: {formatCurrency(entry.pnl)}
                              </div>
                              <div className={`font-medium ${entry.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ({entry.pnlPercentage?.toFixed(2)}%)
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2">
                            {entry.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < entry.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(entry.id)
                            }}
                          >
                            <Star className={`h-4 w-4 ${entry.isFavorite ? 'fill-current text-yellow-500' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            <div className="mt-4 text-xs text-muted-foreground">
              Showing {filteredEntries.length} of {journalData.stats.totalTrades} trades • 
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Win Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {journalData.stats.winRate.toFixed(1)}%
                  </div>
                  <Progress value={journalData.stats.winRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total P&L</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${journalData.stats.totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(journalData.stats.totalPnl)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Profit Factor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {journalData.stats.profitFactor.toFixed(2)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Avg Hold Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {journalData.stats.averageHoldTime} days
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Average Win:</span>
                      <span className="text-green-600">{formatCurrency(journalData.stats.averageWin)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Loss:</span>
                      <span className="text-red-600">{formatCurrency(journalData.stats.averageLoss)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Largest Win:</span>
                      <span className="text-green-600">{formatCurrency(journalData.stats.largestWin)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Largest Loss:</span>
                      <span className="text-red-600">{formatCurrency(journalData.stats.largestLoss)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Strategy Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Best Strategy:</span>
                      <span className="text-green-600">{journalData.stats.bestStrategy}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Worst Strategy:</span>
                      <span className="text-red-600">{journalData.stats.worstStrategy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}