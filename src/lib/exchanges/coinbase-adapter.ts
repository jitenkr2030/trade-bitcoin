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

export interface CoinbaseCredentials extends ExchangeCredentials {
  apiKey: string
  secret: string
  passphrase: string
}

export interface CoinbaseConfig extends ExchangeConfig {
  baseUrl: string
  sandbox: boolean
}

export class CoinbaseAdapter extends BaseExchangeAdapter {
  exchangeName = 'Coinbase'
  config: CoinbaseConfig = {
    baseUrl: 'https://api.pro.coinbase.com',
    sandbox: false,
    features: {
      spot: true,
      margin: false,
      futures: false,
      websocket: true,
      historicalData: true,
      oco: false,
      testNet: true
    }
  }

  constructor(credentials: CoinbaseCredentials) {
    super(credentials)
    if (credentials.sandbox) {
      this.config.baseUrl = 'https://api-public.sandbox.pro.coinbase.com'
      this.config.sandbox = true
    }
  }

  async initialize(): Promise<void> {
    try {
      // Test connection by getting server time
      const serverTime = await this.getServerTime()
      console.log('Coinbase adapter initialized successfully')
    } catch (error) {
      throw new Error(`Failed to initialize Coinbase adapter: ${error.message}`)
    }
  }

  async close(): Promise<void> {
    console.log('Coinbase adapter closed')
  }

  // Market Data Methods
  async getTicker(symbol: string): Promise<Ticker> {
    this.validateSymbol(symbol)
    const formattedSymbol = this.formatSymbol(symbol)
    
    const response = await this.makeRequest({
      method: 'GET',
      url: `/products/${formattedSymbol}/ticker`
    })

    return this.parseTicker(response)
  }

  async getTickers(): Promise<Ticker[]> {
    const products = await this.makeRequest({
      method: 'GET',
      url: '/products'
    })

    const tickers: Ticker[] = []
    for (const product of products) {
      if (product.status === 'online') {
        try {
          const ticker = await this.getTicker(product.id)
          tickers.push(ticker)
        } catch (error) {
          // Skip products that fail to load
          continue
        }
      }
    }
    
    return tickers
  }

  async getOrderBook(symbol: string, limit: number = 100): Promise<OrderBook> {
    this.validateSymbol(symbol)
    const formattedSymbol = this.formatSymbol(symbol)
    
    const level = limit <= 50 ? 1 : limit <= 200 ? 2 : 3
    const response = await this.makeRequest({
      method: 'GET',
      url: `/products/${formattedSymbol}/book`,
      params: { level }
    })

    return {
      symbol: formattedSymbol,
      bids: response.bids.map(([price, quantity, numOrders]: [string, string, string]) => ({
        price: this.parseNumber(price),
        quantity: this.parseNumber(quantity)
      })),
      asks: response.asks.map(([price, quantity, numOrders]: [string, string, string]) => ({
        price: this.parseNumber(price),
        quantity: this.parseNumber(quantity)
      })),
      timestamp: Date.now()
    }
  }

  async getCandlesticks(symbol: string, interval: string, limit: number = 300): Promise<Candlestick[]> {
    this.validateSymbol(symbol)
    const formattedSymbol = this.formatSymbol(symbol)
    
    const granularity = this.mapIntervalToGranularity(interval)
    const response = await this.makeRequest({
      method: 'GET',
      url: `/products/${formattedSymbol}/candles`,
      params: {
        granularity,
        limit: Math.min(limit, 300) // Coinbase max limit is 300
      }
    })

    // Coinbase returns candles in reverse chronological order
    return response.reverse().map((candle: any[]) => ({
      timestamp: candle[0] * 1000, // Convert to milliseconds
      low: this.parseNumber(candle[1]),
      high: this.parseNumber(candle[2]),
      open: this.parseNumber(candle[3]),
      close: this.parseNumber(candle[4]),
      volume: this.parseNumber(candle[5])
    }))
  }

  // Account Methods
  async getAccount(): Promise<Balance[]> {
    const accounts = await this.makeSignedRequest({
      method: 'GET',
      url: '/accounts'
    })

    return accounts
      .filter((account: any) => parseFloat(account.balance) > 0)
      .map((account: any) => ({
        asset: account.currency,
        free: this.parseNumber(account.available),
        locked: this.parseNumber(account.hold),
        total: this.parseNumber(account.balance)
      }))
  }

  async getAssetBalance(asset: string): Promise<Balance> {
    const accounts = await this.getAccount()
    const balance = accounts.find(b => b.asset === asset.toUpperCase())
    
    if (!balance) {
      throw new Error(`Asset ${asset} not found in account`)
    }
    
    return balance
  }

  // Order Methods
  async createOrder(order: CreateOrderRequest): Promise<CreateOrderResponse> {
    this.validateOrderRequest(order)
    const formattedSymbol = this.formatSymbol(order.symbol)
    
    const orderData: any = {
      product_id: formattedSymbol,
      side: order.side.toLowerCase(),
      type: this.mapOrderType(order.type),
      size: order.amount.toString()
    }

    if (order.price) {
      orderData.price = order.price.toString()
    }

    if (order.clientOrderId) {
      orderData.client_oid = order.clientOrderId
    }

    if (order.stopPrice) {
      orderData.stop_price = order.stopPrice.toString()
    }

    if (order.timeInForce) {
      orderData.time_in_force = order.timeInForce
    }

    const response = await this.makeSignedRequest({
      method: 'POST',
      url: '/orders',
      data: orderData
    })

    return this.parseOrderResponse(response)
  }

  async getOrder(orderId: string, symbol?: string): Promise<Order> {
    const response = await this.makeSignedRequest({
      method: 'GET',
      url: `/orders/${orderId}`
    })

    return this.parseOrder(response)
  }

  async getOrders(symbol?: string, limit?: number): Promise<Order[]> {
    const params: any = {
      status: 'all'
    }
    
    if (symbol) {
      params.product_id = this.formatSymbol(symbol)
    }
    
    const response = await this.makeSignedRequest({
      method: 'GET',
      url: '/orders',
      params
    })

    return response.map((order: any) => this.parseOrder(order))
  }

  async getOpenOrders(symbol?: string): Promise<Order[]> {
    const params: any = {
      status: 'open'
    }
    
    if (symbol) {
      params.product_id = this.formatSymbol(symbol)
    }
    
    const response = await this.makeSignedRequest({
      method: 'GET',
      url: '/orders',
      params
    })

    return response.map((order: any) => this.parseOrder(order))
  }

  async cancelOrder(orderId: string, symbol?: string): Promise<Order> {
    const response = await this.makeSignedRequest({
      method: 'DELETE',
      url: `/orders/${orderId}`
    })

    return this.parseOrder(response)
  }

  async cancelAllOrders(symbol?: string): Promise<Order[]> {
    const params: any = {}
    if (symbol) {
      params.product_id = this.formatSymbol(symbol)
    }

    const response = await this.makeSignedRequest({
      method: 'DELETE',
      url: '/orders',
      params
    })

    return response.map((order: any) => this.parseOrder(order))
  }

  // Trade Methods
  async getTrades(symbol?: string, limit?: number): Promise<Trade[]> {
    const formattedSymbol = symbol ? this.formatSymbol(symbol) : 'BTC-USD'
    const response = await this.makeRequest({
      method: 'GET',
      url: `/products/${formattedSymbol}/trades`,
      params: { limit: Math.min(limit || 100, 1000) }
    })

    return response.map((trade: any) => this.parseTrade(trade))
  }

  async getMyTrades(symbol?: string, limit?: number): Promise<Trade[]> {
    const params: any = {}
    if (symbol) {
      params.product_id = this.formatSymbol(symbol)
    }
    
    const response = await this.makeSignedRequest({
      method: 'GET',
      url: '/fills',
      params
    })

    return response.map((trade: any) => this.parseTrade(trade))
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
      url: '/time'
    })
    return response.data.epoch * 1000 // Convert to milliseconds
  }

  // Authentication and Request Signing
  protected async signRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const credentials = this.credentials as CoinbaseCredentials
    const timestamp = Math.floor(Date.now() / 1000) // Coinbase uses seconds
    
    // Create message to sign
    const method = config.method?.toUpperCase() || 'GET'
    const path = config.url?.replace(this.config.baseUrl, '') || '/'
    const body = config.data ? JSON.stringify(config.data) : ''
    
    const message = `${timestamp}${method}${path}${body}`
    
    // Create signature
    const signature = crypto
      .createHmac('sha256', credentials.secret)
      .update(message)
      .digest('base64')

    // Add headers
    config.headers = config.headers || {}
    config.headers['CB-ACCESS-KEY'] = credentials.apiKey
    config.headers['CB-ACCESS-SIGN'] = signature
    config.headers['CB-ACCESS-TIMESTAMP'] = timestamp.toString()
    config.headers['CB-ACCESS-PASSPHRASE'] = credentials.passphrase
    config.headers['Content-Type'] = 'application/json'

    return config
  }

  // Parsing Methods
  private parseTicker(data: any): Ticker {
    return {
      symbol: data.product_id,
      price: this.parseNumber(data.price),
      bid: this.parseNumber(data.bid),
      ask: this.parseNumber(data.ask),
      high: this.parseNumber(data.high_24h),
      low: this.parseNumber(data.low_24h),
      volume: this.parseNumber(data.volume_24h),
      quoteVolume: this.parseNumber(data.volume_30d),
      open: this.parseNumber(data.open_24h),
      timestamp: data.time ? new Date(data.time).getTime() : Date.now(),
      count: 0 // Coinbase doesn't provide trade count in ticker
    }
  }

  private parseOrderResponse(data: any): CreateOrderResponse {
    return {
      orderId: data.id,
      clientOrderId: data.client_oid,
      symbol: data.product_id,
      status: this.mapOrderStatus(data.status),
      side: data.side as OrderSide,
      type: data.type as OrderType,
      amount: this.parseNumber(data.size),
      filledAmount: this.parseNumber(data.filled_size),
      price: data.price ? this.parseNumber(data.price) : undefined,
      stopPrice: data.stop_price ? this.parseNumber(data.stop_price) : undefined,
      timestamp: new Date(data.created_at).getTime()
    }
  }

  private parseOrder(data: any): Order {
    return {
      id: data.id,
      clientOrderId: data.client_oid,
      exchangeOrderId: data.id,
      symbol: data.product_id,
      status: this.mapOrderStatus(data.status),
      side: data.side as OrderSide,
      type: data.type as OrderType,
      amount: this.parseNumber(data.size),
      filledAmount: this.parseNumber(data.filled_size),
      price: data.price ? this.parseNumber(data.price) : undefined,
      stopPrice: data.stop_price ? this.parseNumber(data.stop_price) : undefined,
      fee: data.fill_fees ? this.parseNumber(data.fill_fees) : undefined,
      feeCurrency: data.fee_currency,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.done_at || data.created_at),
      executedAt: data.done_at ? new Date(data.done_at) : undefined
    }
  }

  private parseTrade(data: any): Trade {
    return {
      id: data.trade_id.toString(),
      exchangeTradeId: data.trade_id.toString(),
      symbol: data.product_id,
      side: data.side as OrderSide,
      amount: this.parseNumber(data.size),
      price: this.parseNumber(data.price),
      fee: data.fee ? this.parseNumber(data.fee) : undefined,
      feeCurrency: data.fee_currency,
      createdAt: new Date(data.created_at)
    }
  }

  // Mapping Methods
  private mapOrderType(type: OrderType): string {
    const typeMap: Record<OrderType, string> = {
      [OrderType.MARKET]: 'market',
      [OrderType.LIMIT]: 'limit',
      [OrderType.STOP]: 'stop',
      [OrderType.STOP_LIMIT]: 'stop limit',
      [OrderType.TAKE_PROFIT]: 'limit', // Coinbase doesn't have pure take profit
      [OrderType.TAKE_PROFIT_LIMIT]: 'limit',
      [OrderType.TRAILING_STOP]: 'stop' // Coinbase doesn't have trailing stop
    }
    return typeMap[type] || 'limit'
  }

  private mapOrderStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'pending': OrderStatus.PENDING,
      'open': OrderStatus.OPEN,
      'active': OrderStatus.OPEN,
      'done': OrderStatus.FILLED,
      'settled': OrderStatus.FILLED,
      'canceled': OrderStatus.CANCELLED,
      'rejected': OrderStatus.REJECTED
    }
    return statusMap[status] || OrderStatus.OPEN
  }

  private mapIntervalToGranularity(interval: string): number {
    const intervalMap: Record<string, number> = {
      '1m': 60,
      '5m': 300,
      '15m': 900,
      '1h': 3600,
      '6h': 21600,
      '1d': 86400
    }
    
    const granularity = intervalMap[interval]
    if (!granularity) {
      throw new Error(`Invalid interval: ${interval}. Valid intervals: ${Object.keys(intervalMap).join(', ')}`)
    }
    
    return granularity
  }

  protected formatSymbol(symbol: string): string {
    // Coinbase uses format like 'BTC-USD'
    return symbol.toUpperCase().replace('/', '-')
  }
}