'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react"

interface PortfolioAsset {
  id: string
  assetId: string
  asset: {
    id: string
    symbol: string
    name: string
    type: string
    category: string
  }
  amount: number
  avgPrice?: number
  value?: number
  costBasis?: number
  acquisitionDate?: Date
  targetAllocation?: number
  currentAllocation?: number
  dividends: Dividend[]
  stakingRewards: StakingReward[]
}

interface Dividend {
  id: string
  amount: number
  currency: string
  exDate: Date
  paymentDate?: Date
  taxWithheld?: number
  reinvested: boolean
}

interface StakingReward {
  id: string
  amount: number
  currency: string
  rewardType: string
  apr?: number
  stakingDuration?: number
}

interface DeFiPosition {
  id: string
  protocol: string
  positionType: string
  assets: any[]
  value: number
  apy?: number
  impermanentLoss?: number
  healthFactor?: number
  status: string
}

interface NFT {
  id: string
  tokenId: string
  contractAddress: string
  name?: string
  category: string
  value?: number
  purchasePrice?: number
  purchaseDate?: Date
  status: string
}

interface Props {
  portfolioId: string
}

export function PortfolioHoldings({ portfolioId }: Props) {
  const [assets, setAssets] = useState<PortfolioAsset[]>([])
  const [defiPositions, setDefiPositions] = useState<DeFiPosition[]>([])
  const [nfts, setNfts] = useState<NFT[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('value')
  const [filterType, setFilterType] = useState('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadHoldings()
  }, [portfolioId])

  const loadHoldings = async () => {
    setIsLoading(true)
    try {
      // Mock data - in real implementation, fetch from API
      const mockAssets: PortfolioAsset[] = [
        {
          id: '1',
          assetId: 'btc',
          asset: {
            id: 'btc',
            symbol: 'BTC',
            name: 'Bitcoin',
            type: 'CRYPTO',
            category: 'CRYPTO'
          },
          amount: 2.5,
          avgPrice: 43250,
          value: 108125,
          costBasis: 108125,
          acquisitionDate: new Date('2024-01-01'),
          targetAllocation: 40,
          currentAllocation: 42.5,
          dividends: [],
          stakingRewards: []
        },
        {
          id: '2',
          assetId: 'eth',
          asset: {
            id: 'eth',
            symbol: 'ETH',
            name: 'Ethereum',
            type: 'CRYPTO',
            category: 'CRYPTO'
          },
          amount: 15,
          avgPrice: 2240,
          value: 33600,
          costBasis: 33600,
          acquisitionDate: new Date('2024-01-15'),
          targetAllocation: 30,
          currentAllocation: 28.2,
          dividends: [],
          stakingRewards: []
        },
        {
          id: '3',
          assetId: 'sol',
          asset: {
            id: 'sol',
            symbol: 'SOL',
            name: 'Solana',
            type: 'CRYPTO',
            category: 'CRYPTO'
          },
          amount: 50,
          avgPrice: 98,
          value: 4900,
          costBasis: 4900,
          acquisitionDate: new Date('2024-02-01'),
          targetAllocation: 15,
          currentAllocation: 12.3,
          dividends: [],
          stakingRewards: []
        }
      ]

      const mockDefiPositions: DeFiPosition[] = [
        {
          id: '1',
          protocol: 'Aave',
          positionType: 'LENDING',
          assets: [{ symbol: 'USDC', amount: 10000 }],
          value: 10000,
          apy: 4.5,
          status: 'ACTIVE'
        },
        {
          id: '2',
          protocol: 'Uniswap',
          positionType: 'LIQUIDITY_POOL',
          assets: [{ symbol: 'ETH', amount: 5 }, { symbol: 'USDC', amount: 11200 }],
          value: 22400,
          apy: 12.3,
          impermanentLoss: -2.1,
          status: 'ACTIVE'
        }
      ]

      const mockNfts: NFT[] = [
        {
          id: '1',
          tokenId: '1234',
          contractAddress: '0x123...',
          name: 'CryptoPunk #1234',
          category: 'ART',
          value: 45000,
          purchasePrice: 35000,
          purchaseDate: new Date('2023-06-01'),
          status: 'HELD'
        }
      ]

      setAssets(mockAssets)
      setDefiPositions(mockDefiPositions)
      setNfts(mockNfts)
    } catch (error) {
      console.error('Error loading holdings:', error)
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

  const formatPercent = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'CRYPTO': return 'text-blue-600'
      case 'STOCK': return 'text-green-600'
      case 'BOND': return 'text-yellow-600'
      case 'ETF': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || asset.asset.type === filterType
    return matchesSearch && matchesType
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return (b.value || 0) - (a.value || 0)
      case 'allocation':
        return (b.currentAllocation || 0) - (a.currentAllocation || 0)
      case 'performance':
        const aPerf = ((a.value || 0) - (a.costBasis || 0)) / (a.costBasis || 1) * 100
        const bPerf = ((b.value || 0) - (b.costBasis || 0)) / (b.costBasis || 1) * 100
        return bPerf - aPerf
      default:
        return 0
    }
  })

  const getTotalValue = () => {
    const assetsValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0)
    const defiValue = defiPositions.reduce((sum, pos) => sum + pos.value, 0)
    const nftValue = nfts.reduce((sum, nft) => sum + (nft.value || 0), 0)
    return assetsValue + defiValue + nftValue
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Holdings</h2>
          <p className="text-muted-foreground">
            Detailed view of all assets, DeFi positions, and NFTs in your portfolio
          </p>
        </div>
        <Button variant="outline" onClick={loadHoldings} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalValue())}</div>
            <p className="text-xs text-muted-foreground">
              Across all holdings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assets</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">
              {assets.filter(a => (a.value || 0) > (a.costBasis || 0)).length} profitable
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DeFi Positions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defiPositions.length}</div>
            <p className="text-xs text-muted-foreground">
              {defiPositions.filter(p => p.status === 'ACTIVE').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFTs</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nfts.length}</div>
            <p className="text-xs text-muted-foreground">
              {nfts.filter(n => n.status === 'HELD').length} held
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="defi">DeFi Positions</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="value">By Value</SelectItem>
                <SelectItem value="allocation">By Allocation</SelectItem>
                <SelectItem value="performance">By Performance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CRYPTO">Crypto</SelectItem>
                <SelectItem value="STOCK">Stocks</SelectItem>
                <SelectItem value="BOND">Bonds</SelectItem>
                <SelectItem value="ETF">ETFs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assets List */}
          <div className="space-y-4">
            {sortedAssets.map((asset) => {
              const performance = ((asset.value || 0) - (asset.costBasis || 0)) / (asset.costBasis || 1) * 100
              const allocationDeviation = (asset.currentAllocation || 0) - (asset.targetAllocation || 0)

              return (
                <Card key={asset.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                              {asset.asset.symbol.substring(0, 3)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{asset.asset.symbol}</h3>
                              <Badge variant="outline" className={getAssetTypeColor(asset.asset.type)}>
                                {asset.asset.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{asset.asset.name}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(asset.value || 0)}</div>
                          <div className="text-sm text-muted-foreground">
                            {asset.amount} @ {formatCurrency(asset.avgPrice || 0)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${getChangeColor(performance)}`}>
                            {performance >= 0 ? '+' : ''}{performance.toFixed(2)}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency((asset.value || 0) - (asset.costBasis || 0))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPercent(asset.currentAllocation || 0)}</div>
                          <div className="text-sm text-muted-foreground">
                            Target: {formatPercent(asset.targetAllocation || 0)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {Math.abs(allocationDeviation) > 5 && (
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {asset.targetAllocation !== undefined && asset.currentAllocation !== undefined && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Allocation</span>
                          <span>{formatPercent(asset.currentAllocation)} / {formatPercent(asset.targetAllocation)}</span>
                        </div>
                        <Progress 
                          value={asset.currentAllocation} 
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Current</span>
                          <span>Target</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="defi" className="space-y-4">
          <div className="grid gap-4">
            {defiPositions.map((position) => (
              <Card key={position.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{position.protocol}</h3>
                            <Badge variant="outline">{position.positionType}</Badge>
                            <Badge variant={position.status === 'ACTIVE' ? 'default' : 'secondary'}>
                              {position.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {position.apy && `APY: ${position.apy}%`}
                            {position.impermanentLoss && ` • IL: ${position.impermanentLoss.toFixed(2)}%`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(position.value)}</div>
                        <div className="text-sm text-muted-foreground">Total Value</div>
                      </div>
                      {position.healthFactor && (
                        <div className="text-right">
                          <div className="font-semibold">{position.healthFactor.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Health Factor</div>
                        </div>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {position.assets && position.assets.length > 0 && (
                    <div className="mt-4">
                      <Separator className="mb-3" />
                      <div className="flex gap-4">
                        {position.assets.map((asset, index) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{asset.symbol}:</span> {asset.amount}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-4">
          <div className="grid gap-4">
            {nfts.map((nft) => (
              <Card key={nft.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{nft.name || `NFT #${nft.tokenId}`}</h3>
                            <Badge variant="outline">{nft.category}</Badge>
                            <Badge variant={nft.status === 'HELD' ? 'default' : 'secondary'}>
                              {nft.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {nft.contractAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(nft.value || 0)}</div>
                        <div className="text-sm text-muted-foreground">Current Value</div>
                      </div>
                      {nft.purchasePrice && (
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(nft.purchasePrice)}</div>
                          <div className="text-sm text-muted-foreground">Purchase Price</div>
                        </div>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {nft.purchaseDate && (
                    <div className="mt-4">
                      <Separator className="mb-3" />
                      <div className="text-sm text-muted-foreground">
                        Purchased: {nft.purchaseDate.toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}