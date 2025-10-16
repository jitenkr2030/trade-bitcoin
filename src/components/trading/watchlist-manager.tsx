'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Star, 
  Plus, 
  Trash2, 
  Edit, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Percent,
  BarChart3,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Minus,
  RefreshCw,
  Settings,
  FolderOpen,
  FolderPlus
} from 'lucide-react'

interface WatchlistItem {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  changePercent24h: number
  volume24h: number
  marketCap: number
  lastUpdated: Date
  isFavorite: boolean
  notes?: string
  alerts: {
    priceAbove?: number
    priceBelow?: number
    volumeSpike?: number
  }
}

interface Watchlist {
  id: string
  name: string
  description?: string
  isPublic: boolean
  isDefault: boolean
  items: WatchlistItem[]
  createdAt: Date
  updatedAt: Date
}

interface WatchlistManagerProps {
  exchangeAccountId: string
  onSymbolSelect?: (symbol: string) => void
}

export function WatchlistManager({ exchangeAccountId, onSymbolSelect }: WatchlistManagerProps) {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [activeWatchlist, setActiveWatchlist] = useState<string>('default')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('change')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isCreatingList, setIsCreatingList] = useState(false)
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])

  const popularSymbols = [
    { symbol: 'BTCUSDT', name: 'Bitcoin' },
    { symbol: 'ETHUSDT', name: 'Ethereum' },
    { symbol: 'BNBUSDT', name: 'Binance Coin' },
    { symbol: 'ADAUSDT', name: 'Cardano' },
    { symbol: 'SOLUSDT', name: 'Solana' },
    { symbol: 'DOTUSDT', name: 'Polkadot' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin' },
    { symbol: 'AVAXUSDT', name: 'Avalanche' },
    { symbol: 'MATICUSDT', name: 'Polygon' },
    { symbol: 'LINKUSDT', name: 'Chainlink' }
  ]

  useEffect(() => {
    loadWatchlists()
  }, [exchangeAccountId])

  const loadWatchlists = async () => {
    // Simulate API call
    const mockWatchlists: Watchlist[] = [
      {
        id: 'default',
        name: 'Default Watchlist',
        description: 'My main trading watchlist',
        isPublic: false,
        isDefault: true,
        items: [
          {
            id: '1',
            symbol: 'BTCUSDT',
            name: 'Bitcoin',
            price: 43250,
            change24h: 1080,
            changePercent24h: 2.56,
            volume24h: 28500000000,
            marketCap: 847000000000,
            lastUpdated: new Date(),
            isFavorite: true,
            notes: 'Primary trading pair',
            alerts: { priceAbove: 45000, priceBelow: 40000 }
          },
          {
            id: '2',
            symbol: 'ETHUSDT',
            name: 'Ethereum',
            price: 2450,
            change24h: -85,
            changePercent24h: -3.35,
            volume24h: 15600000000,
            marketCap: 294000000000,
            lastUpdated: new Date(),
            isFavorite: true,
            notes: 'DeFi ecosystem leader',
            alerts: { priceAbove: 2600, priceBelow: 2300 }
          },
          {
            id: '3',
            symbol: 'SOLUSDT',
            name: 'Solana',
            price: 98.50,
            change24h: 5.25,
            changePercent24h: 5.63,
            volume24h: 2100000000,
            marketCap: 42000000000,
            lastUpdated: new Date(),
            isFavorite: false,
            alerts: { priceAbove: 110, priceBelow: 85 }
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'defi',
        name: 'DeFi Tokens',
        description: 'Decentralized Finance tokens',
        isPublic: false,
        isDefault: false,
        items: [
          {
            id: '4',
            symbol: 'UNIUSDT',
            name: 'Uniswap',
            price: 7.25,
            change24h: 0.15,
            changePercent24h: 2.11,
            volume24h: 320000000,
            marketCap: 5400000000,
            lastUpdated: new Date(),
            isFavorite: false,
            alerts: { priceAbove: 8, priceBelow: 6 }
          },
          {
            id: '5',
            symbol: 'AAVEUSDT',
            name: 'Aave',
            price: 145.80,
            change24h: -2.30,
            changePercent24h: -1.55,
            volume24h: 180000000,
            marketCap: 2100000000,
            lastUpdated: new Date(),
            isFavorite: false,
            alerts: { priceAbove: 160, priceBelow: 130 }
          }
        ],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date()
      }
    ]

    setWatchlists(mockWatchlists)
    setActiveWatchlist('default')
  }

  const createWatchlist = (name: string, description?: string, isPublic: boolean = false) => {
    const newList: Watchlist = {
      id: Date.now().toString(),
      name,
      description,
      isPublic,
      isDefault: false,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setWatchlists(prev => [...prev, newList])
    setActiveWatchlist(newList.id)
    setIsCreatingList(false)
  }

  const deleteWatchlist = (id: string) => {
    if (id === 'default') return // Don't allow deleting default watchlist
    setWatchlists(prev => prev.filter(list => list.id !== id))
    if (activeWatchlist === id) {
      setActiveWatchlist('default')
    }
  }

  const addToWatchlist = (symbols: string[]) => {
    if (!activeWatchlist) return

    const currentList = watchlists.find(list => list.id === activeWatchlist)
    if (!currentList) return

    const newItems = symbols
      .filter(symbol => !currentList.items.some(item => item.symbol === symbol))
      .map(symbol => {
        const symbolInfo = popularSymbols.find(s => s.symbol === symbol)
        return {
          id: Date.now().toString() + Math.random(),
          symbol,
          name: symbolInfo?.name || symbol,
          price: Math.random() * 1000 + 100,
          change24h: (Math.random() - 0.5) * 100,
          changePercent24h: (Math.random() - 0.5) * 10,
          volume24h: Math.random() * 1000000000,
          marketCap: Math.random() * 10000000000,
          lastUpdated: new Date(),
          isFavorite: false,
          alerts: {}
        }
      })

    setWatchlists(prev =>
      prev.map(list =>
        list.id === activeWatchlist
          ? { ...list, items: [...list.items, ...newItems], updatedAt: new Date() }
          : list
      )
    )

    setIsAddingItem(false)
    setSelectedSymbols([])
  }

  const removeFromWatchlist = (itemId: string) => {
    setWatchlists(prev =>
      prev.map(list =>
        list.id === activeWatchlist
          ? { ...list, items: list.items.filter(item => item.id !== itemId), updatedAt: new Date() }
          : list
      )
    )
  }

  const toggleFavorite = (itemId: string) => {
    setWatchlists(prev =>
      prev.map(list =>
        list.id === activeWatchlist
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
              ),
              updatedAt: new Date()
            }
          : list
      )
    )
  }

  const updateNotes = (itemId: string, notes: string) => {
    setWatchlists(prev =>
      prev.map(list =>
        list.id === activeWatchlist
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId ? { ...item, notes } : item
              ),
              updatedAt: new Date()
            }
          : list
      )
    )
  }

  const getCurrentWatchlist = () => {
    return watchlists.find(list => list.id === activeWatchlist)
  }

  const getFilteredAndSortedItems = () => {
    const currentList = getCurrentWatchlist()
    if (!currentList) return []

    let filtered = currentList.items.filter(item =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      let aValue: number | string
      let bValue: number | string

      switch (sortBy) {
        case 'symbol':
          aValue = a.symbol
          bValue = b.symbol
          break
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'change':
          aValue = a.changePercent24h
          bValue = b.changePercent24h
          break
        case 'volume':
          aValue = a.volume24h
          bValue = b.volume24h
          break
        default:
          aValue = a.symbol
          bValue = b.symbol
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number)
    })

    return filtered
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(decimals)}B`
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(decimals)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(decimals)}K`
    }
    return num.toFixed(decimals)
  }

  const formatPercent = (num: number) => {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Watchlist Manager</h2>
          <p className="text-muted-foreground">
            Organize and monitor your favorite trading pairs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsAddingItem(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Symbols
          </Button>
          <Button variant="outline" onClick={() => setIsCreatingList(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New List
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Watchlist Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {watchlists.map(list => (
          <Button
            key={list.id}
            variant={activeWatchlist === list.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveWatchlist(list.id)}
            className="flex-shrink-0"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            {list.name}
            {list.isDefault && <Badge variant="secondary" className="ml-2">Default</Badge>}
            {!list.isDefault && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteWatchlist(list.id)
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </Button>
        ))}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search symbols or names..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="symbol">Symbol</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="change">Change %</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? <MoveUp className="h-4 w-4" /> : <MoveDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Watchlist Items */}
      <Card>
        <CardHeader>
          <CardTitle>
            {getCurrentWatchlist()?.name}
            {getCurrentWatchlist()?.description && (
              <CardDescription>{getCurrentWatchlist()?.description}</CardDescription>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {getFilteredAndSortedItems().length === 0 ? (
            <div className="text-center py-8">
              <Star className="h-8 w-8 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No items in watchlist</p>
              <Button className="mt-4" onClick={() => setIsAddingItem(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Symbols
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {getFilteredAndSortedItems().map(item => (
                <div key={item.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(item.id)}
                      >
                        <Star className={`h-4 w-4 ${item.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold cursor-pointer hover:text-blue-600" 
                              onClick={() => onSymbolSelect?.(item.symbol)}>
                            {item.symbol}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {item.name}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Vol: {formatNumber(item.volume24h)}</span>
                          <span>MCap: {formatNumber(item.marketCap)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(item.price)}</p>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(item.change24h)}
                          <span className={`text-sm ${getChangeColor(item.change24h)}`}>
                            {formatPercent(item.changePercent24h)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {item.alerts.priceAbove && (
                          <Badge variant="outline" className="text-xs">
                            Alert: ${item.alerts.priceAbove}
                          </Badge>
                        )}
                        {item.alerts.priceBelow && (
                          <Badge variant="outline" className="text-xs">
                            Alert: ${item.alerts.priceBelow}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWatchlist(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <p className="text-sm text-blue-800">{item.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Watchlist Dialog */}
      <Dialog open={isCreatingList} onOpenChange={setIsCreatingList}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Watchlist</DialogTitle>
            <DialogDescription>
              Create a new watchlist to organize your trading symbols
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="listName">List Name</Label>
              <Input id="listName" placeholder="My Watchlist" />
            </div>
            <div>
              <Label htmlFor="listDescription">Description (Optional)</Label>
              <Input id="listDescription" placeholder="Description of this watchlist" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreatingList(false)}>
                Cancel
              </Button>
              <Button onClick={() => createWatchlist('New Watchlist', 'My custom watchlist')}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Symbols Dialog */}
      <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Symbols to Watchlist</DialogTitle>
            <DialogDescription>
              Select symbols to add to your current watchlist
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {popularSymbols.map(symbol => (
                <div key={symbol.symbol} className="flex items-center gap-2 p-2 border rounded">
                  <input
                    type="checkbox"
                    id={symbol.symbol}
                    checked={selectedSymbols.includes(symbol.symbol)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSymbols(prev => [...prev, symbol.symbol])
                      } else {
                        setSelectedSymbols(prev => prev.filter(s => s !== symbol.symbol))
                      }
                    }}
                  />
                  <label htmlFor={symbol.symbol} className="flex-1 cursor-pointer">
                    <div className="font-medium">{symbol.symbol}</div>
                    <div className="text-xs text-gray-600">{symbol.name}</div>
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {selectedSymbols.length} symbol{selectedSymbols.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => addToWatchlist(selectedSymbols)}
                  disabled={selectedSymbols.length === 0}
                >
                  Add to Watchlist
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}