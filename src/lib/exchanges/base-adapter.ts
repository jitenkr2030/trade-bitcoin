import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { 
  ExchangeAdapter, 
  ExchangeConfig, 
  ExchangeCredentials, 
  ExchangeError, 
  AuthenticationError, 
  RateLimitError, 
  InsufficientFundsError, 
  OrderNotFoundError,
  NetworkError,
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  Trade,
  Ticker,
  OrderBook,
  Candlestick,
  Balance
} from './types'

export abstract class BaseExchangeAdapter implements ExchangeAdapter {
  abstract exchangeName: string
  abstract config: ExchangeConfig
  protected credentials: ExchangeCredentials
  protected httpClient: AxiosInstance
  protected rateLimiter: Map<string, { count: number; resetTime: number }> = new Map()

  constructor(credentials: ExchangeCredentials) {
    this.credentials = credentials
    this.httpClient = axios.create({
      baseURL: this.config.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'TradeBitcoin/1.0.0'
      }
    })

    // Add request interceptor for rate limiting
    this.httpClient.interceptors.request.use(
      async (config) => {
        await this.checkRateLimit(config.url || '')
        return config
      },
      (error) => Promise.reject(error)
    )

    // Add response interceptor for error handling
    this.httpClient.interceptors.response.use(
      (response) => response,
      (error) => this.handleApiError(error)
    )
  }

  abstract initialize(): Promise<void>
  abstract close(): Promise<void>
  
  // Abstract methods to be implemented by specific exchange adapters
  abstract getTicker(symbol: string): Promise<Ticker>
  abstract getTickers(): Promise<Ticker[]>
  abstract getOrderBook(symbol: string, limit?: number): Promise<OrderBook>
  abstract getCandlesticks(symbol: string, interval: string, limit?: number): Promise<Candlestick[]>
  abstract getAccount(): Promise<Balance[]>
  abstract getAssetBalance(asset: string): Promise<Balance>
  abstract createOrder(order: CreateOrderRequest): Promise<CreateOrderResponse>
  abstract getOrder(orderId: string, symbol?: string): Promise<Order>
  abstract getOrders(symbol?: string, limit?: number): Promise<Order[]>
  abstract getOpenOrders(symbol?: string): Promise<Order[]>
  abstract cancelOrder(orderId: string, symbol?: string): Promise<Order>
  abstract cancelAllOrders(symbol?: string): Promise<Order[]>
  abstract getTrades(symbol?: string, limit?: number): Promise<Trade[]>
  abstract getMyTrades(symbol?: string, limit?: number): Promise<Trade[]>
  abstract subscribeTicker(symbol: string, callback: (ticker: Ticker) => void): Promise<void>
  abstract subscribeOrderBook(symbol: string, callback: (orderBook: OrderBook) => void): Promise<void>
  abstract subscribeTrades(symbol: string, callback: (trades: Trade[]) => void): Promise<void>
  abstract subscribeUserData(callback: (data: any) => void): Promise<void>
  abstract testConnection(): Promise<boolean>
  abstract getServerTime(): Promise<number>

  // Utility methods
  isSupportedFeature(feature: keyof typeof this.config.features): boolean {
    return this.config.features[feature]
  }

  protected async makeRequest<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.httpClient.request(config)
      return response.data
    } catch (error) {
      throw this.handleApiError(error)
    }
  }

  protected async makeSignedRequest<T>(config: AxiosRequestConfig): Promise<T> {
    // Add authentication headers
    const signedConfig = await this.signRequest(config)
    return this.makeRequest<T>(signedConfig)
  }

  protected abstract signRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig>

  private handleApiError(error: any): never {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          throw new AuthenticationError(data.message || 'Authentication failed')
        case 429:
          throw new RateLimitError(data.message || 'Rate limit exceeded')
        case 400:
          if (data.code === -2010 || data.message?.includes('insufficient')) {
            throw new InsufficientFundsError(data.message || 'Insufficient funds')
          }
          if (data.code === -2011 || data.message?.includes('order')) {
            throw new OrderNotFoundError(data.message || 'Order not found')
          }
          throw new ExchangeError(data.message || 'Bad request', data.code, status)
        case 404:
          throw new OrderNotFoundError(data.message || 'Resource not found')
        case 500:
        case 502:
        case 503:
        case 504:
          throw new NetworkError(data.message || 'Exchange server error')
        default:
          throw new ExchangeError(data.message || 'Unknown error', data.code, status)
      }
    } else if (error.request) {
      throw new NetworkError('Network error: No response received')
    } else {
      throw new ExchangeError(error.message || 'Unknown error')
    }
  }

  private async checkRateLimit(url: string): Promise<void> {
    const now = Date.now()
    const key = `${this.exchangeName}-${url.split('/')[1] || 'default'}`
    
    let limit = this.rateLimiter.get(key)
    
    if (!limit || now > limit.resetTime) {
      // Reset rate limit
      this.rateLimiter.set(key, {
        count: 1,
        resetTime: now + 60000 // 1 minute window
      })
      return
    }
    
    if (limit.count >= 1200) { // Default rate limit
      const waitTime = limit.resetTime - now
      throw new RateLimitError(`Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000)} seconds`)
    }
    
    limit.count++
  }

  protected generateSignature(data: string, secret: string): string {
    // This will be overridden by specific exchange implementations
    return data
  }

  protected formatSymbol(symbol: string): string {
    // Most exchanges use uppercase symbols
    return symbol.toUpperCase()
  }

  protected parseNumber(value: any): number {
    if (typeof value === 'number') return value
    if (typeof value === 'string') return parseFloat(value)
    return 0
  }

  protected parseTimestamp(timestamp: any): number {
    if (typeof timestamp === 'number') return timestamp
    if (typeof timestamp === 'string') {
      // Try parsing as ISO string or timestamp
      if (timestamp.includes('T')) {
        return new Date(timestamp).getTime()
      }
      return parseInt(timestamp)
    }
    return Date.now()
  }

  // Common validation methods
  protected validateSymbol(symbol: string): void {
    if (!symbol || typeof symbol !== 'string') {
      throw new ExchangeError('Invalid symbol')
    }
  }

  protected validateOrderRequest(order: CreateOrderRequest): void {
    if (!order.symbol || !order.side || !order.type || !order.amount) {
      throw new ExchangeError('Missing required order fields')
    }
    
    if (order.amount <= 0) {
      throw new ExchangeError('Amount must be positive')
    }
    
    if (order.price !== undefined && order.price <= 0) {
      throw new ExchangeError('Price must be positive')
    }
  }

  // Helper method to retry failed requests
  protected async retryRequest<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error
        }
        
        if (error instanceof RateLimitError || error instanceof NetworkError) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
        } else {
          throw error
        }
      }
    }
    
    throw new ExchangeError('Max retries exceeded')
  }
}