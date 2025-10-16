import { BaseExchangeAdapter } from './base-adapter'
import { 
  ExchangeAdapter, 
  ExchangeConfig, 
  ExchangeCredentials, 
  CreateOrderRequest, 
  CreateOrderResponse,
  Order,
  Trade,
  Ticker,
  OrderBook,
  Candlestick,
  Balance,
  OrderSide,
  OrderType,
  OrderStatus
} from './types'
import crypto from 'crypto'

export interface KrakenCredentials extends ExchangeCredentials {
  apiKey: string
  secret: string
}

export interface KrakenConfig extends ExchangeConfig {
  baseUrl: string
  version: string
}

export class KrakenAdapter extends BaseExchangeAdapter {
  exchangeName = 'Kraken'
  config: KrakenConfig = {
    baseUrl: 'https://api.kraken.com',
    version: '0',
    features: {
      spot: true,
      margin: true,
      futures: false,
      websocket: true,
      historicalData: true,
      oco: false,
      testNet: false
    }
  }

  constructor(credentials: KrakenCredentials) {
    super(credentials)
  }

  async initialize(): Promise<void> {
    try {
      // Test connection by getting server time
      const serverTime = await this.getServerTime()
      console.log('Kraken adapter initialized successfully')
    } catch (error) {
      throw new Error(`Failed to initialize Kraken adapter: ${error.message}`)
    }
  }

  async close(): Promise<void> {
    console.log('Kraken adapter closed')
  }

  // Market Data Methods
  async getTicker(symbol: string): Promise<Ticker> {
    this.validateSymbol(symbol)
    const krakenSymbol = this.formatSymbol(symbol)
    
    const response = await this.makeRequest({
      method: 'GET',
      url: `/${this.config.version}/public/Ticker`,
      params: { pair: krakenSymbol }
    })

    const result = response.result
    const pairKey = Object.keys(result)[0]
    const tickerData = result[pairKey]

    return this.parseTicker(tickerData, pairKey)
  }

  async getTickers(): Promise<Ticker[]> {
    const response = await this.makeRequest({
      method: 'GET',
      url: `/${this.config.version}/public/AssetPairs`
    })

    const tickers: Ticker[] = []
    const pairs = Object.values(response.result).filter((pair: any) => 
      pair.wsname && !pair.name.endsWith('.d') // Exclude dark pools
    ) as any[]

    // Get tickers for a subset of popular pairs to avoid rate limiting
    const popularPairs = pairs.slice(0, 20)
    for (const pair of popularPairs) {
      try {
        const ticker = await this.getTicker(pair.altname || pair.wsname)
        tickers.push(ticker)
      } catch (error) {
        // Skip pairs that fail to load
        continue
      }
    }
    
    return tickers
  }

  async getOrderBook(symbol: string, limit: number = 100): Promise<OrderBook> {
    this.validateSymbol(symbol)
    const krakenSymbol = this.formatSymbol(symbol)
    
    const count = Math.min(limit, 500) // Kraken max limit is 500
    const response = await this.makeRequest({
      method: 'GET',
      url: `/${this.config.version}/public/Depth`,
      params: { 
        pair: krakenSymbol,
        count
      }
    })

    const result = response.result
    const pairKey = Object.keys(result)[0]
    const orderBookData = result[pairKey]

    return {
      symbol: krakenSymbol,
      bids: orderBookData.bids.map(([price, quantity, timestamp]: [string, string, string]) => ({
        price: this.parseNumber(price),
        quantity: this.parseNumber(quantity)
      })),
      asks: orderBookData.asks.map(([price, quantity, timestamp]: [string, string, string]) => ({
        price: this.parseNumber(price),
        quantity: this.parseNumber(quantity)
      })),
      timestamp: Date.now()
    }
  }

  async getCandlesticks(symbol: string, interval: string, limit: number = 720): Promise<Candlestick[]> {
    this.validateSymbol(symbol)
    const krakenSymbol = this.formatSymbol(symbol)
    
    const krakenInterval = this.mapIntervalToKrakenInterval(interval)
    const response = await this.makeRequest({
      method: 'GET',
      url: `/${this.config.version}/public/OHLC`,
      params: {
        pair: krakenSymbol,
        interval: krakenInterval,
        since: Date.now() - (limit * this.getIntervalDuration(krakenInterval))
      }
    })

    const result = response.result
    const pairKey = Object.keys(result)[0]
    const ohlcData = result[pairKey]

    return ohlcData.map((candle: any[]) => ({
      timestamp: parseInt(candle[0]) * 1000, // Convert to milliseconds
      open: this.parseNumber(candle[1]),
      high: this.parseNumber(candle[2]),
      low: this.parseNumber(candle[3]),
      close: this.parseNumber(candle[4]),
      volume: this.parseNumber(candle[6]),
      closeTime: parseInt(candle[0]) * 1000 + this.getIntervalDuration(krakenInterval),
      quoteVolume: this.parseNumber(candle[7]),
      trades: parseInt(candle[8]),
      vwap: this.parseNumber(candle[10])
    }))
  }

  // Account Methods
  async getAccount(): Promise<Balance[]> {
    const response = await this.makeSignedRequest({
      method: 'POST',
      url: `/${this.config.version}/private/Balance`
    })

    const balances: Balance[] = []
    for (const [asset, balance] of Object.entries(response.result)) {
      const balanceNum = this.parseNumber(balance)
      if (balanceNum > 0) {
        balances.push({
          asset: asset.replace('X', '').replace('Z', ''), // Remove Kraken prefixes
          free: balanceNum,
          locked: 0, // Kraken doesn't separate free/locked in this endpoint
          total: balanceNum
        })
      }
    }

    return balances
  }

  async getAssetBalance(asset: string): Promise<Balance> {
    const balances = await this.getAccount()
    const balance = balances.find(b => b.asset === asset.toUpperCase())
    
    if (!balance) {
      throw new Error(`Asset ${asset} not found in account`)
    }
    
    return balance
  }

  // Order Methods
  async createOrder(order: CreateOrderRequest): Promise<CreateOrderResponse> {
    this.validateOrderRequest(order)
    const krakenSymbol = this.formatSymbol(order.symbol)
    
    const orderData: any = {
      pair: krakenSymbol,
      type: order.side.toLowerCase(),
      ordertype: this.mapOrderType(order.type),
      volume: order.amount.toString()
    }

    if (order.price) {
      orderData.price = order.price.toString()
    }

    if (order.clientOrderId) {
      orderData.userref = order.clientOrderId
    }

    if (order.leverage) {
      orderData.leverage = order.leverage.toString()
    }

    if (order.timeInForce) {
      orderData.timeinforce = order.timeInForce
    }

    const response = await this.makeSignedRequest({
      method: 'POST',
      url: `/${this.config.version}/private/AddOrder`,
      data: orderData
    })

    return this.parseOrderResponse(response.result)
  }

  async getOrder(orderId: string, symbol?: string): Promise<Order> {
    const params: any = { txid: orderId }
    
    const response = await this.makeSignedRequest({
      method: 'POST',
      url: `/${this.config.version}/private/QueryOrders`,
      data: params
    })

    const orderData = response.result[orderId]
    if (!orderData) {
      throw new Error(`Order ${orderId} not found`)
    }

    return this.parseOrder(orderData, orderId)
  }

  async getOrders(symbol?: string, limit?: number): Promise<Order[]> {
    const params: any = { 
      trades: false,
      start: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60) // Last 30 days
    }
    
    if (limit) {
      params.limit = limit
    }

    const response = await this.makeSignedRequest({
      method: 'POST',
      url: `/${this.config.version}/private/ClosedOrders`,
      data: params
    })

    const orders: Order[] = []
    for (const [orderId, orderData] of Object.entries(response.result.closed || {})) {
      orders.push(this.parseOrder(orderData as any, orderId))
    }

    return orders
  }

  async getOpenOrders(symbol?: string): Promise<Order[]> {
    const params: any = { trades: false }
    
    const response = await this.makeSignedRequest({
      method: 'POST',
      url: `/${this.config.version}/private/OpenOrders`,
      data: params
    })

    const orders: Order[] = []
    for (const [orderId, orderData] of Object.entries(response.result.open || {})) {
      orders.push(this.parseOrder(orderData as any, orderId))
    }

    return orders
  }

  async cancelOrder(orderId: string, symbol?: string): Promise<Order> {
    const response = await this.makeSignedRequest({
      method: 'POST',
      url: `/${this.config.version}/private/CancelOrder`,
      data: { txid: orderId }
    })

    return this.parseOrderResponse(response.result)
  }

  async cancelAllOrders(symbol?: string): Promise<Order[]> {
    const openOrders = await this.getOpenOrders(symbol)
    const cancelledOrders: Order[] = []

    for (const order of openOrders) {
      try {
        const cancelledOrder = await this.cancelOrder(order.id)
        cancelledOrders.push(cancelledOrder)
      } catch (error) {
        // Continue with other orders if one fails
        continue
      }
    }

    return cancelledOrders
  }

  // Trade Methods
  async getTrades(symbol?: string, limit?: number): Promise<Trade[]> {
    const krakenSymbol = symbol ? this.formatSymbol(symbol) : 'XXBTZUSD'
    const response = await this.makeRequest({
      method: 'GET',
      url: `/${this.config.version}/public/Trades`,
      params: { 
        pair: krakenSymbol,
        since: Date.now() - (24 * 60 * 60 * 1000) // Last 24 hours
      }
    })

    const result = response.result
    const pairKey = Object.keys(result)[0]
    const trades = result[pairKey]

    return trades.slice(0, limit || 100).map((trade: any[]) => this.parseTrade(trade))
  }

  async getMyTrades(symbol?: string, limit?: number): Promise<Trade[]> {
    const params: any = { 
      trades: true,
      start: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60) // Last 30 days
    }
    
    if (symbol) {
      params.pair = this.formatSymbol(symbol)
    }
    
    if (limit) {
      params.limit = limit
    }

    const response = await this.makeSignedRequest({
      method: 'POST',
      url: `/${this.config.version}/private/TradesHistory`,
      data: params
    })

    const trades: Trade[] = []
    for (const [tradeId, tradeData] of Object.entries(response.result.trades || {})) {
      trades.push(this.parseTrade(tradeData as any, tradeId))
    }

    return trades
  }

  // WebSocket Methods (to be implemented)
  async subscribeTicker(symbol: string, callback: (ticker: Ticker) => void): Promise<void> {
    throw new Error('WebSocket subscriptions not yet implemented')
  }

  async subscribeOrderBook(symbol: string, callback: (orderBook: OrderBook) => void): Promise<void> {
    throw new Error('WebSocket subscriptions not yet implemented')
  }

  async subscribeTrades(symbol: string, callback: (trades: Trade[]) => void): Promise<void> {
    throw new Error('WebSocket subscriptions not yet implemented')
  }

  async subscribeUserData(callback: (data: any) => void): Promise<void> {
    throw new Error('WebSocket subscriptions not yet implemented')
  }

  // Utility Methods
  async testConnection(): Promise<boolean> {
    try {
      await this.getServerTime()
      return true
    } catch (error) {
      return false
    }
  }

  async getServerTime(): Promise<number> {
    const response = await this.makeRequest({
      method: 'GET',
      url: `/${this.config.version}/public/Time`
    })
    return response.result.unixtime * 1000 // Convert to milliseconds
  }

  // Authentication and Request Signing
  protected async signRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const credentials = this.credentials as KrakenCredentials
    const path = config.url?.replace(this.config.baseUrl, '') || '/'
    const nonce = Date.now().toString()
    
    // Create message to sign
    const message = nonce + this.getPostData(config.data || {})
    
    // Create signature
    const signature = crypto
      .createHmac('sha512', credentials.secret)
      .update(path + crypto.createHash('sha256').update(nonce + message).digest('binary'))
      .digest('base64')

    // Add headers and data
    config.headers = config.headers || {}
    config.headers['API-Key'] = credentials.apiKey
    config.headers['API-Sign'] = signature
    
    if (config.method === 'POST') {
      config.data = config.data || {}
      config.data.nonce = nonce
    }

    return config
  }

  // Helper Methods
  private getPostData(data: any): string {
    return Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('&')
  }

  private getIntervalDuration(interval: number): number {
    return interval * 60 * 1000 // Convert minutes to milliseconds
  }

  // Parsing Methods
  private parseTicker(data: any, pairKey: string): Ticker {
    return {
      symbol: pairKey,
      price: this.parseNumber(data.c[0]), // Last trade price
      bid: this.parseNumber(data.b[0]),
      ask: this.parseNumber(data.a[0]),
      high: this.parseNumber(data.h[1]),
      low: this.parseNumber(data.l[1]),
      volume: this.parseNumber(data.v[1]),
      quoteVolume: this.parseNumber(data.q[1]),
      open: this.parseNumber(data.o),
      timestamp: Date.now(),
      count: parseInt(data.t[1]) || 0
    }
  }

  private parseOrderResponse(data: any): CreateOrderResponse {
    return {
      orderId: data.txid?.[0] || data.descr?.order,
      clientOrderId: data.userref?.toString(),
      symbol: data.descr?.pair,
      status: OrderStatus.OPEN, // Kraken doesn't return status in add order response
      side: data.descr?.type as OrderSide,
      type: data.descr?.ordertype as OrderType,
      amount: this.parseNumber(data.vol),
      filledAmount: this.parseNumber(data.cost) / this.parseNumber(data.price),
      price: data.descr?.price ? this.parseNumber(data.descr.price) : undefined,
      stopPrice: data.descr?.price2 ? this.parseNumber(data.descr.price2) : undefined,
      timestamp: Date.now()
    }
  }

  private parseOrder(data: any, orderId: string): Order {
    return {
      id: orderId,
      clientOrderId: data.userref?.toString(),
      exchangeOrderId: orderId,
      symbol: data.descr?.pair,
      status: this.mapOrderStatus(data.status),
      side: data.descr?.type as OrderSide,
      type: data.descr?.ordertype as OrderType,
      amount: this.parseNumber(data.vol),
      filledAmount: this.parseNumber(data.vol_exec),
      price: data.descr?.price ? this.parseNumber(data.descr.price) : undefined,
      stopPrice: data.descr?.price2 ? this.parseNumber(data.descr.price2) : undefined,
      fee: data.fee ? this.parseNumber(data.fee) : undefined,
      feeCurrency: data.fee_currency,
      createdAt: new Date(data.opentm * 1000),
      updatedAt: new Date(data.closetm * 1000),
      executedAt: data.closetm ? new Date(data.closetm * 1000) : undefined
    }
  }

  private parseTrade(data: any, tradeId?: string): Trade {
    return {
      id: tradeId || data.ordertxid,
      exchangeTradeId: tradeId || data.ordertxid,
      symbol: data.pair,
      side: data.type as OrderSide,
      amount: this.parseNumber(data.vol),
      price: this.parseNumber(data.price),
      fee: data.fee ? this.parseNumber(data.fee) : undefined,
      feeCurrency: data.fee_currency,
      createdAt: new Date(data.time * 1000)
    }
  }

  // Mapping Methods
  private mapOrderType(type: OrderType): string {
    const typeMap: Record<OrderType, string> = {
      [OrderType.MARKET]: 'market',
      [OrderType.LIMIT]: 'limit',
      [OrderType.STOP]: 'stop-loss',
      [OrderType.STOP_LIMIT]: 'stop-loss-limit',
      [OrderType.TAKE_PROFIT]: 'take-profit',
      [OrderType.TAKE_PROFIT_LIMIT]: 'take-profit-limit',
      [OrderType.TRAILING_STOP]: 'trailing-stop'
    }
    return typeMap[type] || 'limit'
  }

  private mapOrderStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'pending': OrderStatus.PENDING,
      'open': OrderStatus.OPEN,
      'closed': OrderStatus.FILLED,
      'canceled': OrderStatus.CANCELLED,
      'expired': OrderStatus.EXPIRED
    }
    return statusMap[status] || OrderStatus.OPEN
  }

  private mapIntervalToKrakenInterval(interval: string): number {
    const intervalMap: Record<string, number> = {
      '1m': 1,
      '5m': 5,
      '15m': 15,
      '30m': 30,
      '1h': 60,
      '4h': 240,
      '1d': 1440,
      '1w': 10080,
      '2w': 21600
    }
    
    const krakenInterval = intervalMap[interval]
    if (!krakenInterval) {
      throw new Error(`Invalid interval: ${interval}. Valid intervals: ${Object.keys(intervalMap).join(', ')}`)
    }
    
    return krakenInterval
  }

  protected formatSymbol(symbol: string): string {
    // Kraken uses specific symbol formats
    const symbolMap: Record<string, string> = {
      'BTCUSD': 'XXBTZUSD',
      'ETHUSD': 'XETHZUSD',
      'LTCUSD': 'XLTCZUSD',
      'XRPUSD': 'XXRPZUSD',
      'BTCUSDT': 'XXBTUSDT',
      'ETHUSDT': 'XETHUSDT',
      'EURUSD': 'ZEURUSD',
      'GBPUSD': 'ZGBPUSD'
    }
    
    const upperSymbol = symbol.toUpperCase()
    return symbolMap[upperSymbol] || upperSymbol
  }
}