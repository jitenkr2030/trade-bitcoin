import { ExchangeAdapter, OrderBook, Ticker } from '../exchanges/types'
import { AdvancedOrdersService } from '../exchanges/advanced-orders'

export interface Level2Data {
  symbol: string
  exchange: string
  bids: Level2Bid[]
  asks: Level2Ask[]
  timestamp: number
  spread: number
  midPrice: number
  totalBidVolume: number
  totalAskVolume: number
  bidAskRatio: number
  priceLevels: PriceLevel[]
  marketDepth: MarketDepthAnalysis
}

export interface Level2Bid {
  price: number
  quantity: number
  orderCount: number
  exchange: string
  timestamp: number
}

export interface Level2Ask {
  price: number
  quantity: number
  orderCount: number
  exchange: string
  timestamp: number
}

export interface PriceLevel {
  price: number
  totalBidQuantity: number
  totalAskQuantity: number
  bidOrderCount: number
  askOrderCount: number
  bidExchanges: string[]
  askExchanges: string[]
  cumulativeBid: number
  cumulativeAsk: number
}

export interface MarketDepthAnalysis {
  supportLevels: SupportResistanceLevel[]
  resistanceLevels: SupportResistanceLevel[]
  liquidityZones: LiquidityZone[]
  orderFlowImbalance: number
  marketPressure: 'bullish' | 'bearish' | 'neutral'
  volumeProfile: VolumeProfilePoint[]
  impliedVolatility?: number
}

export interface SupportResistanceLevel {
  price: number
  strength: number // 0-1
  type: 'support' | 'resistance'
  confidence: number // 0-1
  volume: number
}

export interface LiquidityZone {
  priceRange: { min: number; max: number }
  totalVolume: number
  orderCount: number
  type: 'bid' | 'ask' | 'both'
  density: number // orders per price unit
}

export interface VolumeProfilePoint {
  price: number
  volume: number
  buyVolume: number
  sellVolume: number
  timestamp: number
}

export class Level2MarketDataService {
  private exchanges: Map<string, ExchangeAdapter> = new Map()
  private dataCache: Map<string, Level2Data> = new Map()
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map()
  private subscribers: Map<string, Set<(data: Level2Data) => void>> = new Map()
  private advancedOrdersService: AdvancedOrdersService

  constructor() {
    this.advancedOrdersService = new AdvancedOrdersService(null as any) // Will be set when exchanges are added
  }

  /**
   * Add an exchange to the Level 2 data service
   */
  addExchange(name: string, adapter: ExchangeAdapter): void {
    this.exchanges.set(name, adapter)
    if (this.exchanges.size === 1) {
      this.advancedOrdersService = new AdvancedOrdersService(adapter)
    }
  }

  /**
   * Subscribe to Level 2 data for a symbol
   */
  async subscribeLevel2(
    symbol: string,
    callback: (data: Level2Data) => void,
    exchanges?: string[],
    updateInterval: number = 1000
  ): Promise<void> {
    const key = `${symbol}-${exchanges?.join(',') || 'all'}`
    
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    
    this.subscribers.get(key)!.add(callback)

    // Start real-time updates if not already running
    if (!this.updateIntervals.has(key)) {
      await this.startLevel2Updates(symbol, exchanges, updateInterval)
    }

    // Send initial data
    const initialData = await this.getAggregatedLevel2Data(symbol, exchanges)
    callback(initialData)
  }

  /**
   * Unsubscribe from Level 2 data
   */
  unsubscribeLevel2(
    symbol: string,
    callback: (data: Level2Data) => void,
    exchanges?: string[]
  ): void {
    const key = `${symbol}-${exchanges?.join(',') || 'all'}`
    
    if (this.subscribers.has(key)) {
      this.subscribers.get(key)!.delete(callback)
      
      // Stop updates if no more subscribers
      if (this.subscribers.get(key)!.size === 0) {
        this.stopLevel2Updates(key)
      }
    }
  }

  /**
   * Get aggregated Level 2 data from multiple exchanges
   */
  async getAggregatedLevel2Data(
    symbol: string,
    exchanges?: string[]
  ): Promise<Level2Data> {
    const targetExchanges = exchanges || Array.from(this.exchanges.keys())
    const orderBooks: OrderBook[] = []

    // Fetch order books from all exchanges
    for (const exchangeName of targetExchanges) {
      const adapter = this.exchanges.get(exchangeName)
      if (adapter) {
        try {
          const orderBook = await adapter.getOrderBook(symbol, 100) // Get 100 levels
          orderBooks.push({
            ...orderBook,
            exchange: exchangeName
          } as OrderBook & { exchange: string })
        } catch (error) {
          console.warn(`Failed to fetch order book from ${exchangeName}:`, error)
        }
      }
    }

    // Aggregate and analyze the data
    return this.aggregateOrderBooks(symbol, orderBooks)
  }

  /**
   * Get market depth analysis
   */
  async getMarketDepthAnalysis(
    symbol: string,
    exchanges?: string[]
  ): Promise<MarketDepthAnalysis> {
    const level2Data = await this.getAggregatedLevel2Data(symbol, exchanges)
    return this.analyzeMarketDepth(level2Data)
  }

  /**
   * Get liquidity heatmap data
   */
  async getLiquidityHeatmap(
    symbol: string,
    priceRange?: { min: number; max: number },
    exchanges?: string[]
  ): Promise<{ price: number; liquidity: number; type: 'bid' | 'ask' }[]> {
    const level2Data = await this.getAggregatedLevel2Data(symbol, exchanges)
    return this.generateLiquidityHeatmap(level2Data, priceRange)
  }

  /**
   * Get order flow data
   */
  async getOrderFlow(
    symbol: string,
    timeframe: string = '1m',
    exchanges?: string[]
  ): Promise<{
    buyPressure: number
    sellPressure: number
    netFlow: number
    largeOrders: Array<{ price: number; quantity: number; side: 'buy' | 'sell'; timestamp: number }>
  }> {
    const level2Data = await this.getAggregatedLevel2Data(symbol, exchanges)
    return this.analyzeOrderFlow(level2Data, timeframe)
  }

  // Private methods
  private async startLevel2Updates(
    symbol: string,
    exchanges?: string[],
    updateInterval: number = 1000
  ): Promise<void> {
    const key = `${symbol}-${exchanges?.join(',') || 'all'}`
    
    const updateData = async () => {
      try {
        const data = await this.getAggregatedLevel2Data(symbol, exchanges)
        this.dataCache.set(key, data)
        
        // Notify subscribers
        if (this.subscribers.has(key)) {
          this.subscribers.get(key)!.forEach(callback => {
            try {
              callback(data)
            } catch (error) {
              console.error('Error in Level 2 data callback:', error)
            }
          })
        }
      } catch (error) {
        console.error('Error updating Level 2 data:', error)
      }
    }

    // Initial update
    await updateData()

    // Set up interval for updates
    const interval = setInterval(updateData, updateInterval)
    this.updateIntervals.set(key, interval)
  }

  private stopLevel2Updates(key: string): void {
    if (this.updateIntervals.has(key)) {
      clearInterval(this.updateIntervals.get(key)!)
      this.updateIntervals.delete(key)
    }
  }

  private aggregateOrderBooks(symbol: string, orderBooks: (OrderBook & { exchange: string })[]): Level2Data {
    const allBids: Level2Bid[] = []
    const allAsks: Level2Ask[] = []
    const timestamp = Date.now()

    // Process all order books
    for (const orderBook of orderBooks) {
      // Process bids
      for (const [price, quantity] of orderBook.bids) {
        allBids.push({
          price: this.parseNumber(price),
          quantity: this.parseNumber(quantity),
          orderCount: Math.floor(Math.random() * 20) + 1, // Simulated order count
          exchange: orderBook.exchange,
          timestamp
        })
      }

      // Process asks
      for (const [price, quantity] of orderBook.asks) {
        allAsks.push({
          price: this.parseNumber(price),
          quantity: this.parseNumber(quantity),
          orderCount: Math.floor(Math.random() * 20) + 1, // Simulated order count
          exchange: orderBook.exchange,
          timestamp
        })
      }
    }

    // Sort and aggregate by price levels
    const aggregatedBids = this.aggregateByPrice(allBids, 'desc')
    const aggregatedAsks = this.aggregateByPrice(allAsks, 'asc')

    // Calculate metrics
    const bestBid = aggregatedBids[0]?.price || 0
    const bestAsk = aggregatedAsks[0]?.price || 0
    const spread = bestAsk - bestBid
    const midPrice = (bestBid + bestAsk) / 2
    const totalBidVolume = aggregatedBids.reduce((sum, bid) => sum + bid.quantity, 0)
    const totalAskVolume = aggregatedAsks.reduce((sum, ask) => sum + ask.quantity, 0)
    const bidAskRatio = totalAskVolume > 0 ? totalBidVolume / totalAskVolume : 0

    // Create price levels
    const priceLevels = this.createPriceLevels(aggregatedBids, aggregatedAsks)

    // Analyze market depth
    const marketDepth = this.analyzeMarketDepth({
      symbol,
      exchange: 'aggregated',
      bids: aggregatedBids,
      asks: aggregatedAsks,
      timestamp,
      spread,
      midPrice,
      totalBidVolume,
      totalAskVolume,
      bidAskRatio,
      priceLevels,
      marketDepth: {} as MarketDepthAnalysis
    })

    return {
      symbol,
      exchange: 'aggregated',
      bids: aggregatedBids,
      asks: aggregatedAsks,
      timestamp,
      spread,
      midPrice,
      totalBidVolume,
      totalAskVolume,
      bidAskRatio,
      priceLevels,
      marketDepth
    }
  }

  private aggregateByPrice(
    orders: Level2Bid[] | Level2Ask[],
    sortOrder: 'asc' | 'desc'
  ): (Level2Bid | Level2Ask)[] {
    const priceMap = new Map<number, Level2Bid | Level2Ask>()

    for (const order of orders) {
      const existing = priceMap.get(order.price)
      if (existing) {
        existing.quantity += order.quantity
        existing.orderCount += order.orderCount
        // Keep the most recent timestamp
        existing.timestamp = Math.max(existing.timestamp, order.timestamp)
      } else {
        priceMap.set(order.price, { ...order })
      }
    }

    return Array.from(priceMap.values())
      .sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price)
  }

  private createPriceLevels(bids: Level2Bid[], asks: Level2Ask[]): PriceLevel[] {
    const priceMap = new Map<number, PriceLevel>()
    let cumulativeBid = 0
    let cumulativeAsk = 0

    // Process bids
    for (const bid of bids) {
      cumulativeBid += bid.quantity
      if (!priceMap.has(bid.price)) {
        priceMap.set(bid.price, {
          price: bid.price,
          totalBidQuantity: 0,
          totalAskQuantity: 0,
          bidOrderCount: 0,
          askOrderCount: 0,
          bidExchanges: [],
          askExchanges: [],
          cumulativeBid: 0,
          cumulativeAsk: 0
        })
      }
      const level = priceMap.get(bid.price)!
      level.totalBidQuantity += bid.quantity
      level.bidOrderCount += bid.orderCount
      if (!level.bidExchanges.includes(bid.exchange)) {
        level.bidExchanges.push(bid.exchange)
      }
      level.cumulativeBid = cumulativeBid
    }

    // Process asks
    for (const ask of asks) {
      cumulativeAsk += ask.quantity
      if (!priceMap.has(ask.price)) {
        priceMap.set(ask.price, {
          price: ask.price,
          totalBidQuantity: 0,
          totalAskQuantity: 0,
          bidOrderCount: 0,
          askOrderCount: 0,
          bidExchanges: [],
          askExchanges: [],
          cumulativeBid: 0,
          cumulativeAsk: 0
        })
      }
      const level = priceMap.get(ask.price)!
      level.totalAskQuantity += ask.quantity
      level.askOrderCount += ask.orderCount
      if (!level.askExchanges.includes(ask.exchange)) {
        level.askExchanges.push(ask.exchange)
      }
      level.cumulativeAsk = cumulativeAsk
    }

    return Array.from(priceMap.values()).sort((a, b) => a.price - b.price)
  }

  private analyzeMarketDepth(level2Data: Level2Data): MarketDepthAnalysis {
    const { bids, asks, midPrice } = level2Data

    // Find support and resistance levels
    const supportLevels = this.findSupportResistanceLevels(bids, 'support', midPrice)
    const resistanceLevels = this.findSupportResistanceLevels(asks, 'resistance', midPrice)

    // Find liquidity zones
    const liquidityZones = this.findLiquidityZones(bids, asks)

    // Calculate order flow imbalance
    const orderFlowImbalance = this.calculateOrderFlowImbalance(bids, asks)

    // Determine market pressure
    const marketPressure = this.determineMarketPressure(orderFlowImbalance)

    // Generate volume profile
    const volumeProfile = this.generateVolumeProfile(bids, asks)

    return {
      supportLevels,
      resistanceLevels,
      liquidityZones,
      orderFlowImbalance,
      marketPressure,
      volumeProfile
    }
  }

  private findSupportResistanceLevels(
    orders: Level2Bid[] | Level2Ask[],
    type: 'support' | 'resistance',
    midPrice: number
  ): SupportResistanceLevel[] {
    const levels: SupportResistanceLevel[] = []
    const sortedOrders = [...orders].sort((a, b) => b.quantity - a.quantity) // Sort by quantity

    // Take top 5 levels by quantity
    for (let i = 0; i < Math.min(5, sortedOrders.length); i++) {
      const order = sortedOrders[i]
      const distance = Math.abs(order.price - midPrice) / midPrice
      const strength = Math.min(1, order.quantity / 100) // Normalize strength
      const confidence = Math.max(0, 1 - distance) // Closer to mid price = higher confidence

      levels.push({
        price: order.price,
        strength,
        type,
        confidence,
        volume: order.quantity
      })
    }

    return levels.sort((a, b) => b.strength - a.strength)
  }

  private findLiquidityZones(bids: Level2Bid[], asks: Level2Ask[]): LiquidityZone[] {
    const zones: LiquidityZone[] = []
    const priceStep = 0.01; // 1% price zones

    // Group orders into price zones
    const bidZones = this.groupOrdersIntoZones(bids, priceStep);
    const askZones = this.groupOrdersIntoZones(asks, priceStep);

    // Find high liquidity zones
    [...bidZones, ...askZones].forEach(zone => {
      if (zone.totalVolume > 10) { // Threshold for significant liquidity
        zones.push({
          priceRange: zone.priceRange,
          totalVolume: zone.totalVolume,
          orderCount: zone.orderCount,
          type: zone.type,
          density: zone.totalVolume / (zone.priceRange.max - zone.priceRange.min)
        })
      }
    })

    return zones.sort((a, b) => b.totalVolume - a.totalVolume)
  }

  private groupOrdersIntoZones(
    orders: Level2Bid[] | Level2Ask[],
    step: number
  ): Array<{
    priceRange: { min: number; max: number }
    totalVolume: number
    orderCount: number
    type: 'bid' | 'ask'
  }> {
    const zones = new Map<string, {
      priceRange: { min: number; max: number }
      totalVolume: number
      orderCount: number
      type: 'bid' | 'ask'
    }>()

    const type = 'quantity' in orders[0] && orders[0].exchange ? 
      (orders[0].exchange.includes('bid') ? 'bid' : 'ask') : 'bid'

    for (const order of orders) {
      const zoneKey = Math.floor(order.price / step).toString()
      
      if (!zones.has(zoneKey)) {
        zones.set(zoneKey, {
          priceRange: {
            min: Math.floor(order.price / step) * step,
            max: Math.ceil(order.price / step) * step
          },
          totalVolume: 0,
          orderCount: 0,
          type
        })
      }

      const zone = zones.get(zoneKey)!
      zone.totalVolume += order.quantity
      zone.orderCount += order.orderCount
    }

    return Array.from(zones.values())
  }

  private calculateOrderFlowImbalance(bids: Level2Bid[], asks: Level2Ask[]): number {
    const totalBidVolume = bids.reduce((sum, bid) => sum + bid.quantity, 0)
    const totalAskVolume = asks.reduce((sum, ask) => sum + ask.quantity, 0)
    
    if (totalBidVolume + totalAskVolume === 0) return 0
    
    return (totalBidVolume - totalAskVolume) / (totalBidVolume + totalAskVolume)
  }

  private determineMarketPressure(imbalance: number): 'bullish' | 'bearish' | 'neutral' {
    if (imbalance > 0.1) return 'bullish'
    if (imbalance < -0.1) return 'bearish'
    return 'neutral'
  }

  private generateVolumeProfile(bids: Level2Bid[], asks: Level2Ask[]): VolumeProfilePoint[] {
    const profile: VolumeProfilePoint[] = []
    const priceMap = new Map<number, VolumeProfilePoint>()

    // Process bids
    for (const bid of bids) {
      if (!priceMap.has(bid.price)) {
        priceMap.set(bid.price, {
          price: bid.price,
          volume: 0,
          buyVolume: 0,
          sellVolume: 0,
          timestamp: bid.timestamp
        })
      }
      const point = priceMap.get(bid.price)!
      point.volume += bid.quantity
      point.buyVolume += bid.quantity
    }

    // Process asks
    for (const ask of asks) {
      if (!priceMap.has(ask.price)) {
        priceMap.set(ask.price, {
          price: ask.price,
          volume: 0,
          buyVolume: 0,
          sellVolume: 0,
          timestamp: ask.timestamp
        })
      }
      const point = priceMap.get(ask.price)!
      point.volume += ask.quantity
      point.sellVolume += ask.quantity
    }

    return Array.from(priceMap.values()).sort((a, b) => a.price - b.price)
  }

  private generateLiquidityHeatmap(
    level2Data: Level2Data,
    priceRange?: { min: number; max: number }
  ): { price: number; liquidity: number; type: 'bid' | 'ask' }[] {
    const heatmap: { price: number; liquidity: number; type: 'bid' | 'ask' }[] = []
    const { bids, asks } = level2Data

    const minPrice = priceRange?.min || Math.min(...bids.map(b => b.price), ...asks.map(a => a.price))
    const maxPrice = priceRange?.max || Math.max(...bids.map(b => b.price), ...asks.map(a => a.price))
    const step = (maxPrice - minPrice) / 100 // 100 data points

    // Generate heatmap data
    for (let price = minPrice; price <= maxPrice; price += step) {
      // Calculate bid liquidity at this price
      const bidLiquidity = bids
        .filter(bid => Math.abs(bid.price - price) <= step / 2)
        .reduce((sum, bid) => sum + bid.quantity, 0)

      // Calculate ask liquidity at this price
      const askLiquidity = asks
        .filter(ask => Math.abs(ask.price - price) <= step / 2)
        .reduce((sum, ask) => sum + ask.quantity, 0)

      if (bidLiquidity > 0) {
        heatmap.push({ price, liquidity: bidLiquidity, type: 'bid' })
      }

      if (askLiquidity > 0) {
        heatmap.push({ price, liquidity: askLiquidity, type: 'ask' })
      }
    }

    return heatmap
  }

  private analyzeOrderFlow(
    level2Data: Level2Data,
    timeframe: string
  ): {
    buyPressure: number
    sellPressure: number
    netFlow: number
    largeOrders: Array<{ price: number; quantity: number; side: 'buy' | 'sell'; timestamp: number }>
  } {
    const { bids, asks } = level2Data
    
    // Calculate pressure based on order sizes and distribution
    const avgBidSize = bids.reduce((sum, bid) => sum + bid.quantity, 0) / bids.length
    const avgAskSize = asks.reduce((sum, ask) => sum + ask.quantity, 0) / asks.length
    
    const buyPressure = avgBidSize / (avgBidSize + avgAskSize)
    const sellPressure = avgAskSize / (avgBidSize + avgAskSize)
    const netFlow = buyPressure - sellPressure

    // Identify large orders (top 10% by size)
    const largeOrders = []
    const allOrders = [
      ...bids.map(bid => ({ ...bid, side: 'buy' as const })),
      ...asks.map(ask => ({ ...ask, side: 'sell' as const }))
    ]
    
    const sizeThreshold = Math.max(
      ...allOrders.map(order => order.quantity)
    ) * 0.9 // Top 10%

    for (const order of allOrders) {
      if (order.quantity >= sizeThreshold) {
        largeOrders.push({
          price: order.price,
          quantity: order.quantity,
          side: order.side,
          timestamp: order.timestamp
        })
      }
    }

    return {
      buyPressure,
      sellPressure,
      netFlow,
      largeOrders
    }
  }

  private parseNumber(value: any): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') return parseFloat(value)
    return 0
  }
}