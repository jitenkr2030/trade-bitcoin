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

export interface BinanceCredentials extends ExchangeCredentials {
  apiKey: string
  secret: string
}

export interface BinanceConfig extends ExchangeConfig {
  baseUrl: string
  testNet: boolean
}

export class BinanceAdapter extends BaseExchangeAdapter {
  exchangeName = 'Binance'
  config: BinanceConfig = {
    baseUrl: 'https://api.binance.com',
    testNet: false,
    features: {
      spot: true,
      margin: true,
      futures: true,
      spotTrading: true,
      marginTrading: true,
      futuresTrading: true,
      ocoOrders: true,
      stopOrders: true,
      takeProfitOrders: true,
      trailingStop: true,
      // Advanced features
      icebergOrders: true,
      fillOrKill: true,
      immediateOrCancel: true,
      postOnly: false,
      reduceOnly: true,
      conditionalOrders: true,
      triggerOrders: true,
      advancedOrderTypes: true
    }
  }

  constructor(credentials: BinanceCredentials) {
    super(credentials)
    if (credentials.testNet) {
      this.config.baseUrl = 'https://testnet.binance.vision'
      this.config.testNet = true
    }
  }

  async initialize(): Promise<void> {
    try {
      // Test connection and get server time
      const serverTime = await this.getServerTime()
      const localTime = Date.now()
      const timeDiff = Math.abs(serverTime - localTime)
      
      if (timeDiff > 1000) {
        console.warn(`Time difference with Binance server: ${timeDiff}ms`)
      }
      
      console.log('Binance adapter initialized successfully')
    } catch (error) {
      throw new Error(`Failed to initialize Binance adapter: ${error.message}`)
    }
  }

  async close(): Promise<void> {
    // Clean up any resources if needed
    console.log('Binance adapter closed')
  }

  // Market Data Methods
  async getTicker(symbol: string): Promise<Ticker> {
    this.validateSymbol(symbol)
    const formattedSymbol = this.formatSymbol(symbol)
    
    const response = await this.makeRequest({
      method: 'GET',
      url: '/api/v3/ticker/24hr',
      params: { symbol: formattedSymbol }
    })

    return this.parseTicker(response)
  }

  async getTickers(): Promise<Ticker[]> {
    const response = await this.makeRequest({
      method: 'GET',
      url: '/api/v3/ticker/24hr'
    })

    return response.map((ticker: any) => this.parseTicker(ticker))
  }

  async getOrderBook(symbol: string, limit: number = 100): Promise<OrderBook> {
    this.validateSymbol(symbol)
    const formattedSymbol = this.formatSymbol(symbol)
    
    const response = await this.makeRequest({
      method: 'GET',
      url: '/api/v3/depth',
      params: { 
        symbol: formattedSymbol,
        limit: Math.min(limit, 5000) // Binance max limit is 5000
      }
    })

    return {
      symbol: formattedSymbol,
      bids: response.bids.map(([price, quantity]: [string, string]) => ({
        price: this.parseNumber(price),
        quantity: this.parseNumber(quantity)
      })),
      asks: response.asks.map(([price, quantity]: [string, string]) => ({
        price: this.parseNumber(price),
        quantity: this.parseNumber(quantity)
      })),
      timestamp: Date.now()
    }
  }

  async getCandlesticks(symbol: string, interval: string, limit: number = 500): Promise<Candlestick[]> {
    this.validateSymbol(symbol)
    const formattedSymbol = this.formatSymbol(symbol)
    
    const response = await this.makeRequest({
      method: 'GET',
      url: '/api/v3/klines',
      params: {
        symbol: formattedSymbol,
        interval: this.validateInterval(interval),
        limit: Math.min(limit, 1000) // Binance max limit is 1000
      }
    })

    return response.map((kline: any[]) => ({
      timestamp: kline[0],
      open: this.parseNumber(kline[1]),
      high: this.parseNumber(kline[2]),
      low: this.parseNumber(kline[3]),
      close: this.parseNumber(kline[4]),
      volume: this.parseNumber(kline[5]),
      closeTime: kline[6],
      quoteVolume: this.parseNumber(kline[7]),
      trades: kline[8],
      buyBaseVolume: this.parseNumber(kline[9]),
      buyQuoteVolume: this.parseNumber(kline[10]),
      ignored: kline[11]
    }))
  }

  // Account Methods
  async getAccount(): Promise<Balance[]> {
    const response = await this.makeSignedRequest({
      method: 'GET',
      url: '/api/v3/account'
    })

    return response.balances.map((balance: any) => ({
      asset: balance.asset,
      free: this.parseNumber(balance.free),
      locked: this.parseNumber(balance.locked),
      total: this.parseNumber(balance.free) + this.parseNumber(balance.locked)
    }))
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
    const formattedSymbol = this.formatSymbol(order.symbol)
    
    // Handle advanced order types
    if (order.type === OrderType.OCO) {
      return await this.createOCOOrder(order)
    }
    
    if (order.icebergQty) {
      return await this.createIcebergOrder(order)
    }
    
    if (order.type === OrderType.TRAILING_STOP) {
      return await this.createTrailingStopOrder(order)
    }
    
    const params: any = {
      symbol: formattedSymbol,
      side: order.side.toUpperCase(),
      type: this.mapOrderType(order.type),
      quantity: order.amount.toString()
    }

    if (order.price) {
      params.price = order.price.toString()
    }

    if (order.type === OrderType.STOP || order.type === OrderType.TAKE_PROFIT) {
      if (!order.stopPrice) {
        throw new Error('stopPrice is required for STOP and TAKE_PROFIT orders')
      }
      params.stopPrice = order.stopPrice.toString()
    }

    if (order.type === OrderType.STOP_LIMIT || order.type === OrderType.TAKE_PROFIT_LIMIT) {
      if (!order.stopPrice) {
        throw new Error('stopPrice is required for STOP_LIMIT and TAKE_PROFIT_LIMIT orders')
      }
      params.stopPrice = order.stopPrice.toString()
      if (!order.price) {
        throw new Error('price is required for STOP_LIMIT and TAKE_PROFIT_LIMIT orders')
      }
    }

    // Add optional parameters
    if (order.timeInForce) {
      params.timeInForce = order.timeInForce
    }
    if (order.clientOrderId) {
      params.newClientOrderId = order.clientOrderId
    }

    const response = await this.makeSignedRequest({
      method: 'POST',
      url: '/api/v3/order',
      data: params
    })

    return this.parseOrderResponse(response)
  }

  // Advanced Order Methods
  private async createOCOOrder(order: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (!order.stopLossPrice || !order.takeProfitPrice) {
      throw new Error('OCO orders require both stopLossPrice and takeProfitPrice')
    }

    const params: any = {
      symbol: this.formatSymbol(order.symbol),
      side: order.side.toUpperCase(),
      quantity: order.amount.toString(),
      price: order.price?.toString() || order.takeProfitPrice.toString(),
      stopPrice: order.stopLossPrice.toString(),
      stopLimitPrice: order.stopLossPrice.toString(),
      stopLimitTimeInForce: order.timeInForce || 'GTC'
    }

    const response = await this.makeSignedRequest({
      method: 'POST',
      url: '/api/v3/order/oco',
      data: params
    })

    // Return the primary order response
    return this.parseOrderResponse(response.orders[0])
  }

  private async createIcebergOrder(order: CreateOrderRequest): Promise<CreateOrderResponse> {
    if (!order.icebergQty) {
      throw new Error('Iceberg orders require icebergQty parameter')
    }

    const params: any = {
      symbol: this.formatSymbol(order.symbol),
      side: order.side.toUpperCase(),
      type: 'LIMIT',
      quantity: order.amount.toString(),
      price: order.price?.toString(),
      timeInForce: order.timeInForce || 'GTC',
      icebergQty: order.icebergQty.toString()
    }

    const response = await this.makeSignedRequest({
      method: 'POST',
      url: '/api/v3/order',
      data: params
    })

    return this.parseOrderResponse(response)
  }

  private async createTrailingStopOrder(order: CreateOrderRequest): Promise<CreateOrderResponse> {
    const params: any = {
      symbol: this.formatSymbol(order.symbol),
      side: order.side.toUpperCase(),
      type: 'TRAILING_STOP_MARKET',
      quantity: order.amount.toString(),
      timeInForce: order.timeInForce || 'GTC'
    }

    if (order.trailingStopAmount) {
      params.callbackRate = order.trailingStopAmount.toString()
    }

    if (order.trailingStopPercent) {
      params.callbackRate = order.trailingStopPercent.toString()
    }

    const response = await this.makeSignedRequest({
      method: 'POST',
      url: '/api/v3/order',
      data: params
    })

    return this.parseOrderResponse(response)
  }

  async getOrder(orderId: string, symbol?: string): Promise<Order> {
    const params: any = { orderId }
    if (symbol) {
      params.symbol = this.formatSymbol(symbol)
    }

    const response = await this.makeSignedRequest({
      method: 'GET',
      url: '/api/v3/order',
      params
    })

    return this.parseOrder(response)
  }

  async getOrders(symbol?: string, limit?: number): Promise<Order[]> {
    const params: any = {}
    if (symbol) {
      params.symbol = this.formatSymbol(symbol)
    }
    if (limit) {
      params.limit = Math.min(limit, 1000)
    }

    const response = await this.makeSignedRequest({
      method: 'GET',
      url: '/api/v3/allOrders',
      params
    })

    return response.map((order: any) => this.parseOrder(order))
  }

  async getOpenOrders(symbol?: string): Promise<Order[]> {
    const params: any = {}
    if (symbol) {
      params.symbol = this.formatSymbol(symbol)
    }

    const response = await this.makeSignedRequest({
      method: 'GET',
      url: '/api/v3/openOrders',
      params
    })

    return response.map((order: any) => this.parseOrder(order))
  }

  async cancelOrder(orderId: string, symbol?: string): Promise<Order> {
    const params: any = { orderId }
    if (symbol) {
      params.symbol = this.formatSymbol(symbol)
    }

    const response = await this.makeSignedRequest({
      method: 'DELETE',
      url: '/api/v3/order',
      params
    })

    return this.parseOrder(response)
  }

  async cancelAllOrders(symbol?: string): Promise<Order[]> {
    const params: any = {}
    if (symbol) {
      params.symbol = this.formatSymbol(symbol)
    }

    const response = await this.makeSignedRequest({
      method: 'DELETE',
      url: '/api/v3/openOrders',
      params
    })

    return response.map((order: any) => this.parseOrder(order))
  }

  // Trade Methods
  async getTrades(symbol?: string, limit?: number): Promise<Trade[]> {
    const params: any = {}
    if (symbol) {
      params.symbol = this.formatSymbol(symbol)
    }
    if (limit) {
      params.limit = Math.min(limit, 1000)
    }

    const response = await this.makeRequest({
      method: 'GET',
      url: '/api/v3/trades',
      params
    })

    return response.map((trade: any) => this.parseTrade(trade))
  }

  async getMyTrades(symbol?: string, limit?: number): Promise<Trade[]> {
    const params: any = {}
    if (symbol) {
      params.symbol = this.formatSymbol(symbol)
    }
    if (limit) {
      params.limit = Math.min(limit, 1000)
    }

    const response = await this.makeSignedRequest({
      method: 'GET',
      url: '/api/v3/myTrades',
      params
    })

    return response.map((trade: any) => this.parseTrade(trade))
  }

  // WebSocket Methods (to be implemented)
  async subscribeTicker(symbol: string, callback: (ticker: Ticker) => void): Promise<void> {
    // Implementation will be added with WebSocket support
    throw new Error('WebSocket subscriptions not yet implemented')
  }

  async subscribeOrderBook(symbol: string, callback: (orderBook: OrderBook) => void): Promise<void> {
    // Implementation will be added with WebSocket support
    throw new Error('WebSocket subscriptions not yet implemented')
  }

  async subscribeTrades(symbol: string, callback: (trades: Trade[]) => void): Promise<void> {
    // Implementation will be added with WebSocket support
    throw new Error('WebSocket subscriptions not yet implemented')
  }

  async subscribeUserData(callback: (data: any) => void): Promise<void> {
    // Implementation will be added with WebSocket support
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
      url: '/api/v3/time'
    })
    return response.serverTime
  }

  // Authentication and Request Signing
  protected async signRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const credentials = this.credentials as BinanceCredentials
    const timestamp = Date.now()
    
    // Add timestamp to params or data
    if (config.method === 'GET') {
      config.params = config.params || {}
      config.params.timestamp = timestamp
    } else {
      config.data = config.data || {}
      config.data.timestamp = timestamp
    }

    // Create query string
    const queryString = new URLSearchParams(
      config.method === 'GET' ? config.params : config.data
    ).toString()

    // Create signature
    const signature = crypto
      .createHmac('sha256', credentials.secret)
      .update(queryString)
      .digest('hex')

    // Add signature and API key
    if (config.method === 'GET') {
      config.params.signature = signature
    } else {
      config.data.signature = signature
    }

    config.headers = config.headers || {}
    config.headers['X-MBX-APIKEY'] = credentials.apiKey

    return config
  }

  // Parsing Methods
  private parseTicker(data: any): Ticker {
    return {
      symbol: data.symbol,
      price: this.parseNumber(data.lastPrice),
      bid: this.parseNumber(data.bidPrice),
      ask: this.parseNumber(data.askPrice),
      high: this.parseNumber(data.highPrice),
      low: this.parseNumber(data.lowPrice),
      volume: this.parseNumber(data.volume),
      quoteVolume: this.parseNumber(data.quoteVolume),
      open: this.parseNumber(data.openPrice),
      close: this.parseNumber(data.prevClosePrice),
      timestamp: data.closeTime,
      count: data.count
    }
  }

  private parseOrderResponse(data: any): CreateOrderResponse {
    return {
      orderId: data.orderId.toString(),
      clientOrderId: data.clientOrderId,
      symbol: data.symbol,
      status: this.mapOrderStatus(data.status),
      side: data.side.toLowerCase() as OrderSide,
      type: data.type.toLowerCase() as OrderType,
      amount: this.parseNumber(data.origQty),
      filledAmount: this.parseNumber(data.executedQty),
      price: this.parseNumber(data.price),
      stopPrice: data.stopPrice ? this.parseNumber(data.stopPrice) : undefined,
      timestamp: data.transactTime
    }
  }

  private parseOrder(data: any): Order {
    return {
      id: data.orderId.toString(),
      clientOrderId: data.clientOrderId,
      exchangeOrderId: data.orderId.toString(),
      symbol: data.symbol,
      status: this.mapOrderStatus(data.status),
      side: data.side.toLowerCase() as OrderSide,
      type: data.type.toLowerCase() as OrderType,
      amount: this.parseNumber(data.origQty),
      filledAmount: this.parseNumber(data.executedQty),
      price: data.price ? this.parseNumber(data.price) : undefined,
      stopPrice: data.stopPrice ? this.parseNumber(data.stopPrice) : undefined,
      fee: data.commission ? this.parseNumber(data.commission) : undefined,
      feeCurrency: data.commissionAsset,
      createdAt: new Date(data.time),
      updatedAt: new Date(data.updateTime),
      executedAt: data.transactTime ? new Date(data.transactTime) : undefined
    }
  }

  private parseTrade(data: any): Trade {
    return {
      id: data.id.toString(),
      exchangeTradeId: data.id.toString(),
      symbol: data.symbol,
      side: data.isBuyer ? 'buy' : 'sell' as OrderSide,
      amount: this.parseNumber(data.qty),
      price: this.parseNumber(data.price),
      fee: data.commission ? this.parseNumber(data.commission) : undefined,
      feeCurrency: data.commissionAsset,
      createdAt: new Date(data.time)
    }
  }

  // Mapping Methods
  private mapOrderType(type: OrderType): string {
    const typeMap: Record<OrderType, string> = {
      [OrderType.MARKET]: 'MARKET',
      [OrderType.LIMIT]: 'LIMIT',
      [OrderType.STOP]: 'STOP_LOSS',
      [OrderType.STOP_LOSS_LIMIT]: 'STOP_LOSS_LIMIT',
      [OrderType.TAKE_PROFIT]: 'TAKE_PROFIT',
      [OrderType.TAKE_PROFIT_LIMIT]: 'TAKE_PROFIT_LIMIT',
      [OrderType.TRAILING_STOP]: 'TRAILING_STOP_MARKET',
      [OrderType.OCO]: 'OCO'
    }
    return typeMap[type] || 'LIMIT'
  }

  private mapOrderStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'NEW': OrderStatus.OPEN,
      'PARTIALLY_FILLED': OrderStatus.PARTIALLY_FILLED,
      'FILLED': OrderStatus.FILLED,
      'CANCELED': OrderStatus.CANCELLED,
      'PENDING_CANCEL': OrderStatus.CANCELLED,
      'REJECTED': OrderStatus.REJECTED,
      'EXPIRED': OrderStatus.EXPIRED
    }
    return statusMap[status] || OrderStatus.OPEN
  }

  private validateInterval(interval: string): string {
    const validIntervals = [
      '1m', '3m', '5m', '15m', '30m',
      '1h', '2h', '4h', '6h', '8h', '12h',
      '1d', '3d', '1w', '1M'
    ]
    
    if (!validIntervals.includes(interval)) {
      throw new Error(`Invalid interval: ${interval}. Valid intervals: ${validIntervals.join(', ')}`)
    }
    
    return interval
  }
}