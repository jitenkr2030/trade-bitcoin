"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { 
  Store, 
  Star, 
  Download, 
  Eye, 
  Heart, 
  Share2, 
  Filter,
  Search,
  TrendingUp,
  Users,
  Bot,
  Brain,
  Zap,
  BarChart3,
  DollarSign,
  CheckCircle,
  Clock,
  Play,
  Plus,
  Crown,
  Activity
} from "lucide-react"
import { useState } from "react"

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSort, setSelectedSort] = useState("popular")

  const marketplaceItems = [
    {
      id: "1",
      name: "AI Market Predictor Pro",
      description: "Advanced AI-powered market prediction algorithm with 85% accuracy",
      type: "STRATEGY",
      price: 99.99,
      currency: "USD",
      rating: 4.8,
      reviews: 234,
      downloads: 1523,
      isFeatured: true,
      seller: "AI Trading Labs",
      category: "ai-strategies",
      tags: ["AI", "Machine Learning", "Prediction"],
      preview: {
        winRate: 85.2,
        totalReturn: 156.7,
        sharpeRatio: 2.34,
        maxDrawdown: -8.9
      }
    },
    {
      id: "2",
      name: "Arbitrage Master Bot",
      description: "Multi-exchange arbitrage bot with real-time price monitoring",
      type: "BOT",
      price: 149.99,
      currency: "USD",
      rating: 4.9,
      reviews: 189,
      downloads: 892,
      isFeatured: true,
      seller: "QuantTech Solutions",
      category: "arbitrage",
      tags: ["Arbitrage", "Multi-exchange", "Real-time"],
      preview: {
        winRate: 92.1,
        totalReturn: 89.4,
        sharpeRatio: 3.12,
        maxDrawdown: -2.1
      }
    },
    {
      id: "3",
      name: "RSI Scalper Elite",
      description: "Professional RSI-based scalping strategy for high-frequency trading",
      type: "STRATEGY",
      price: 49.99,
      currency: "USD",
      rating: 4.6,
      reviews: 156,
      downloads: 2341,
      isFeatured: false,
      seller: "ProTrader Inc",
      category: "scalping",
      tags: ["RSI", "Scalping", "High-frequency"],
      preview: {
        winRate: 78.3,
        totalReturn: 67.8,
        sharpeRatio: 1.89,
        maxDrawdown: -12.3
      }
    },
    {
      id: "4",
      name: "Portfolio Optimizer",
      description: "AI-driven portfolio optimization and rebalancing tool",
      type: "INDICATOR",
      price: 79.99,
      currency: "USD",
      rating: 4.7,
      reviews: 98,
      downloads: 567,
      isFeatured: false,
      seller: "WealthTech AI",
      category: "portfolio",
      tags: ["Portfolio", "Optimization", "AI"],
      preview: {
        winRate: 82.1,
        totalReturn: 45.6,
        sharpeRatio: 2.15,
        maxDrawdown: -6.7
      }
    },
    {
      id: "5",
      name: "Crypto Signal Pro",
      description: "Premium cryptocurrency trading signals with technical analysis",
      type: "SIGNAL",
      price: 29.99,
      currency: "USD",
      rating: 4.4,
      reviews: 445,
      downloads: 3456,
      isFeatured: false,
      seller: "CryptoSignals Pro",
      category: "signals",
      tags: ["Crypto", "Signals", "Technical Analysis"],
      preview: {
        winRate: 73.8,
        totalReturn: 89.2,
        sharpeRatio: 1.67,
        maxDrawdown: -15.2
      }
    },
    {
      id: "6",
      name: "Advanced Trading Course",
      description: "Complete trading course covering strategies, risk management, and psychology",
      type: "COURSE",
      price: 199.99,
      currency: "USD",
      rating: 4.9,
      reviews: 567,
      downloads: 1234,
      isFeatured: true,
      seller: "Trading Academy",
      category: "education",
      tags: ["Course", "Education", "Trading"],
      preview: {
        duration: "12 hours",
        lessons: 45,
        students: 2341,
        rating: 4.9
      }
    }
  ]

  const topTraders = [
    {
      id: "1",
      name: "Alex Chen",
      avatar: "AC",
      totalReturn: 234.7,
      winRate: 78.9,
      followers: 1234,
      copiedBy: 892,
      riskLevel: "Medium",
      strategy: "Swing Trading",
      monthlyFee: 29.99,
      isVerified: true,
      performance: [12.3, 8.7, 15.2, 9.8, 11.4, 13.7]
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "SJ",
      totalReturn: 189.4,
      winRate: 82.3,
      followers: 987,
      copiedBy: 654,
      riskLevel: "Low",
      strategy: "Value Investing",
      monthlyFee: 19.99,
      isVerified: true,
      performance: [8.9, 12.1, 7.8, 14.2, 9.6, 11.3]
    },
    {
      id: "3",
      name: "Mike Rodriguez",
      avatar: "MR",
      totalReturn: 312.8,
      winRate: 75.6,
      followers: 2156,
      copiedBy: 1456,
      riskLevel: "High",
      strategy: "Day Trading",
      monthlyFee: 49.99,
      isVerified: true,
      performance: [15.7, 22.3, 8.9, 18.4, 25.1, 16.8]
    }
  ]

  const categories = [
    { id: "all", name: "All Categories", icon: Store },
    { id: "ai-strategies", name: "AI Strategies", icon: Brain },
    { id: "arbitrage", name: "Arbitrage", icon: Zap },
    { id: "scalping", name: "Scalping", icon: TrendingUp },
    { id: "portfolio", name: "Portfolio", icon: BarChart3 },
    { id: "signals", name: "Signals", icon: Activity },
    { id: "education", name: "Education", icon: Users }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "STRATEGY":
        return <BarChart3 className="h-4 w-4" />
      case "BOT":
        return <Bot className="h-4 w-4" />
      case "INDICATOR":
        return <TrendingUp className="h-4 w-4" />
      case "SIGNAL":
        return <Activity className="h-4 w-4" />
      case "COURSE":
        return <Users className="h-4 w-4" />
      default:
        return <Store className="h-4 w-4" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "STRATEGY":
        return <Badge variant="outline">Strategy</Badge>
      case "BOT":
        return <Badge className="bg-blue-100 text-blue-800">Bot</Badge>
      case "INDICATOR":
        return <Badge className="bg-green-100 text-green-800">Indicator</Badge>
      case "SIGNAL":
        return <Badge className="bg-orange-100 text-orange-800">Signal</Badge>
      case "COURSE":
        return <Badge className="bg-purple-100 text-purple-800">Course</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "High":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Discover trading strategies, bots, and copy top traders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Sell Your Strategy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>List Your Strategy</DialogTitle>
                <DialogDescription>
                  Share your trading strategy with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="strategyName">Strategy Name</Label>
                    <Input id="strategyName" placeholder="My Awesome Strategy" />
                  </div>
                  <div>
                    <Label htmlFor="strategyType">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STRATEGY">Strategy</SelectItem>
                        <SelectItem value="BOT">Bot</SelectItem>
                        <SelectItem value="INDICATOR">Indicator</SelectItem>
                        <SelectItem value="SIGNAL">Signal</SelectItem>
                        <SelectItem value="COURSE">Course</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe your strategy..." rows={3} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" type="number" placeholder="99.99" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>List Strategy</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search strategies, bots, traders..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="strategies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="strategies">Strategies & Bots</TabsTrigger>
          <TabsTrigger value="copy-trading">Copy Trading</TabsTrigger>
          <TabsTrigger value="top-sellers">Top Sellers</TabsTrigger>
          <TabsTrigger value="my-purchases">My Purchases</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          {/* Featured Items */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {marketplaceItems.filter(item => item.isFeatured).map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200 bg-blue-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="text-xs">by {item.seller}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      {getTypeBadge(item.type)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Win Rate</span>
                      <span className="font-medium text-green-600">{item.preview.winRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Return</span>
                      <span className="font-medium text-green-600">+{item.preview.totalReturn}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sharpe Ratio</span>
                      <span className="font-medium">{item.preview.sharpeRatio}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-xs text-muted-foreground">({item.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Download className="h-3 w-3" />
                      <span>{item.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">${item.price}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Get
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* All Items */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {marketplaceItems.filter(item => !item.isFeatured).map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <CardDescription className="text-xs">by {item.seller}</CardDescription>
                      </div>
                    </div>
                    {getTypeBadge(item.type)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Win Rate</span>
                      <span className="font-medium text-green-600">{item.preview.winRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Return</span>
                      <span className="font-medium text-green-600">+{item.preview.totalReturn}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sharpe Ratio</span>
                      <span className="font-medium">{item.preview.sharpeRatio}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-xs text-muted-foreground">({item.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Download className="h-3 w-3" />
                      <span>{item.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">${item.price}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Get
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="copy-trading" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            {topTraders.map((trader) => (
              <Card key={trader.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold">{trader.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{trader.name}</CardTitle>
                          {trader.isVerified && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <CardDescription>{trader.strategy}</CardDescription>
                      </div>
                    </div>
                    {getRiskBadge(trader.riskLevel)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+{trader.totalReturn}%</div>
                      <div className="text-xs text-muted-foreground">Total Return</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{trader.winRate}%</div>
                      <div className="text-xs text-muted-foreground">Win Rate</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Followers</span>
                      <span className="font-medium">{trader.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Copied by</span>
                      <span className="font-medium">{trader.copiedBy.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Fee</span>
                      <span className="font-medium">${trader.monthlyFee}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium mb-2">Performance (Last 6 months)</div>
                    <div className="flex gap-1">
                      {trader.performance.map((return_, index) => (
                        <div key={index} className="flex-1">
                          <div 
                            className={`h-8 rounded text-xs flex items-center justify-center text-white font-medium ${
                              return_ >= 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          >
                            {return_ >= 0 ? '+' : ''}{return_}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Copy Trader
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top-sellers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "AI Trading Labs", sales: 15234, revenue: 456780, rating: 4.8, items: 12 },
              { name: "QuantTech Solutions", sales: 8923, revenue: 234567, rating: 4.9, items: 8 },
              { name: "ProTrader Inc", sales: 6789, revenue: 189234, rating: 4.6, items: 15 },
              { name: "WealthTech AI", sales: 4567, revenue: 123456, rating: 4.7, items: 6 },
            ].map((seller, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Store className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-lg">{seller.name}</CardTitle>
                  <CardDescription>Top Seller #{index + 1}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Sales:</span>
                      <span className="font-medium ml-1">{seller.sales.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium ml-1">${seller.revenue.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="font-medium ml-1">{seller.rating}/5</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Items:</span>
                      <span className="font-medium ml-1">{seller.items}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Purchases</CardTitle>
              <CardDescription>Your purchased strategies and subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "AI Market Predictor Pro",
                    type: "STRATEGY",
                    purchaseDate: "2024-06-15",
                    price: 99.99,
                    status: "ACTIVE",
                    downloads: 5
                  },
                  {
                    name: "Arbitrage Master Bot",
                    type: "BOT",
                    purchaseDate: "2024-05-20",
                    price: 149.99,
                    status: "ACTIVE",
                    downloads: 12
                  },
                  {
                    name: "Crypto Signal Pro",
                    type: "SIGNAL",
                    purchaseDate: "2024-04-10",
                    price: 29.99,
                    status: "EXPIRED",
                    downloads: 8
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Purchased on {new Date(item.purchaseDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${item.price}</div>
                      <div className="text-sm text-muted-foreground">{item.downloads} downloads</div>
                      <Badge variant={item.status === "ACTIVE" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}