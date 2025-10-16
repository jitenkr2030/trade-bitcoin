// Order types
export enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP = 'STOP',
  STOP_MARKET = 'STOP_MARKET',
  STOP_LIMIT = 'STOP_LIMIT',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TAKE_PROFIT_MARKET = 'TAKE_PROFIT_MARKET',
  TRAILING_STOP = 'TRAILING_STOP',
  ICEBERG = 'ICEBERG',
  OCO = 'OCO',
  CONDITIONAL = 'CONDITIONAL'
}

export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum OrderStatus {
  NEW = 'NEW',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FILLED = 'FILLED',
  CANCELED = 'CANCELED',
  PENDING_CANCEL = 'PENDING_CANCEL',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

// Exchange-specific types
export interface ExchangeCredentials {
  apiKey: string
  apiSecret: string
  passphrase?: string // For exchanges like KuCoin
}

export interface ExchangeConfig {
  name: string
  displayName: string
  baseUrl: string
  wsUrl?: string
  features: ExchangeFeatures
  rateLimits: RateLimit[]
}

export interface ExchangeFeatures {
  spot: boolean
  margin: boolean
  futures: boolean
  spotTrading: boolean
  marginTrading: boolean
  futuresTrading: boolean
  ocoOrders: boolean
  stopOrders: boolean
  takeProfitOrders: boolean
  trailingStop: boolean
  // Advanced features
  icebergOrders: boolean
  fillOrKill: boolean
  immediateOrCancel: boolean
  postOnly: boolean
  reduceOnly: boolean
  conditionalOrders: boolean
  triggerOrders: boolean
  advancedOrderTypes: boolean
}

export interface RateLimit {
  rateLimitType: 'REQUEST_WEIGHT' | 'ORDERS' | 'REQUESTS'
  interval: 'SECOND' | 'MINUTE' | 'HOUR' | 'DAY'
  intervalNum: number
  limit: number
}

export interface MarketData {
  symbol: string
  price: number
  bid: number
  ask: number
  volume24h: number
  change24h: number
  high24h: number
  low24h: number
  timestamp: number
}

export interface OrderBook {
  symbol: string
  bids: [number, number][] // [price, quantity]
  asks: [number, number][] // [price, quantity]
  timestamp: number
}

export interface Ticker {
  symbol: string
  price: number
  volume: number
  quoteVolume: number
  lastPrice: number
  bidPrice: number
  askPrice: number
  high24h: number
  low24h: number
  open24h: number
  close24h: number
  timestamp: number
}

export interface Balance {
  asset: string
  free: number
  locked: number
  total: number
}

export interface CreateOrderRequest {
  symbol: string
  side: OrderSide
  type: OrderType
  amount: number
  price?: number
  stopPrice?: number
  icebergQty?: number
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
  leverage?: number
  // Advanced order types
  takeProfitPrice?: number
  stopLossPrice?: number
  trailingStopAmount?: number
  trailingStopPercent?: number
  ocoSecondaryPrice?: number
  ocoSecondaryType?: 'LIMIT' | 'STOP'
  icebergVisibleQty?: number
  conditionalTriggerPrice?: number
  conditionalTriggerType?: 'LAST_PRICE' | 'MARK_PRICE' | 'INDEX_PRICE'
}

export interface CreateOrderResponse {
  orderId: string
  clientOrderId?: string
  symbol: string
  status: OrderStatus
  side: OrderSide
  type: OrderType
  amount: number
  price?: number
  stopPrice?: number
  icebergQty?: number
  timeInForce?: string
  executedAmount: number
  executedPrice?: number
  createdAt: Date
  updatedAt: Date
  // Advanced order fields
  takeProfitPrice?: number
  stopLossPrice?: number
  trailingStopAmount?: number
  trailingStopPercent?: number
  ocoSecondaryOrderId?: string
  ocoSecondaryPrice?: number
  ocoSecondaryType?: 'LIMIT' | 'STOP'
  icebergVisibleQty?: number
  conditionalTriggerPrice?: number
  conditionalTriggerType?: 'LAST_PRICE' | 'MARK_PRICE' | 'INDEX_PRICE'
}

export interface Order {
  orderId: string
  clientOrderId?: string
  symbol: string
  status: OrderStatus
  side: OrderSide
  type: OrderType
  amount: number
  price?: number
  stopPrice?: number
  icebergQty?: number
  timeInForce?: string
  executedAmount: number
  executedPrice?: number
  fee?: number
  feeCurrency?: string
  createdAt: Date
  updatedAt: Date
  // Advanced order fields
  takeProfitPrice?: number
  stopLossPrice?: number
  trailingStopAmount?: number
  trailingStopPercent?: number
  ocoSecondaryOrderId?: string
  ocoSecondaryPrice?: number
  ocoSecondaryType?: 'LIMIT' | 'STOP'
  icebergVisibleQty?: number
  conditionalTriggerPrice?: number
  conditionalTriggerType?: 'LAST_PRICE' | 'MARK_PRICE' | 'INDEX_PRICE'
}

export interface Trade {
  tradeId: string
  orderId?: string
  symbol: string
  side: OrderSide
  amount: number
  price: number
  fee?: number
  feeCurrency?: string
  createdAt: Date
}

export interface Candlestick {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
  quoteVolume?: number
  tradesCount?: number
}

export interface ExchangeInterface {
  // Market Data
  getTicker(symbol: string): Promise<Ticker>
  getTickers(): Promise<Ticker[]>
  getOrderBook(symbol: string, limit?: number): Promise<OrderBook>
  getCandlesticks(symbol: string, interval: string, limit?: number): Promise<Candlestick[]>
  
  // Account
  getAccount(): Promise<Balance[]>
  getAssetBalance(asset: string): Promise<Balance>
  
  // Trading
  createOrder(order: CreateOrderRequest): Promise<CreateOrderResponse>
  getOrder(orderId: string, symbol?: string): Promise<Order>
  getOrders(symbol?: string, limit?: number): Promise<Order[]>
  getOpenOrders(symbol?: string): Promise<Order[]>
  cancelOrder(orderId: string, symbol?: string): Promise<Order>
  cancelAllOrders(symbol?: string): Promise<Order[]>
  
  // Trade History
  getTrades(symbol?: string, limit?: number): Promise<Trade[]>
  getMyTrades(symbol?: string, limit?: number): Promise<Trade[]>
  
  // WebSocket
  subscribeTicker(symbol: string, callback: (ticker: Ticker) => void): Promise<void>
  subscribeOrderBook(symbol: string, callback: (orderBook: OrderBook) => void): Promise<void>
  subscribeTrades(symbol: string, callback: (trades: Trade[]) => void): Promise<void>
  subscribeUserData(callback: (data: any) => void): Promise<void>
  
  // Utility
  testConnection(): Promise<boolean>
  getServerTime(): Promise<number>
}

export interface ExchangeAdapter extends ExchangeInterface {
  exchangeName: string
  config: ExchangeConfig
  credentials: ExchangeCredentials
  
  // Exchange-specific methods
  initialize(): Promise<void>
  close(): Promise<void>
  isSupportedFeature(feature: keyof ExchangeFeatures): boolean
}

// Error types
export class ExchangeError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'ExchangeError'
  }
}

export class AuthenticationError extends ExchangeError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR', 401)
    this.name = 'AuthenticationError'
  }
}

export class RateLimitError extends ExchangeError {
  constructor(message: string) {
    super(message, 'RATE_LIMIT_ERROR', 429)
    this.name = 'RateLimitError'
  }
}

export class InsufficientFundsError extends ExchangeError {
  constructor(message: string) {
    super(message, 'INSUFFICIENT_FUNDS', 400)
    this.name = 'InsufficientFundsError'
  }
}

export class OrderNotFoundError extends ExchangeError {
  constructor(message: string) {
    super(message, 'ORDER_NOT_FOUND', 404)
    this.name = 'OrderNotFoundError'
  }
}

export class NetworkError extends ExchangeError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 0)
    this.name = 'NetworkError'
  }
}