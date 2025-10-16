import { ExchangeAdapter, ExchangeCredentials, ExchangeConfig } from './types'
import { BinanceAdapter } from './binance-adapter'
import { CoinbaseAdapter } from './coinbase-adapter'
import { KrakenAdapter } from './kraken-adapter'
import { Exchange } from '@prisma/client'
import { db } from '@/lib/db'

export class ExchangeManager {
  private adapters: Map<string, ExchangeAdapter> = new Map()
  private exchangeConfigs: Map<string, ExchangeConfig> = new Map()

  constructor() {
    this.initializeExchangeConfigs()
  }

  private initializeExchangeConfigs(): void {
    // Initialize Binance config
    this.exchangeConfigs.set('binance', {
      name: 'binance',
      displayName: 'Binance',
      baseUrl: 'https://api.binance.com/api/v3',
      wsUrl: 'wss://stream.binance.com:9443',
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
        trailingStop: true
      },
      rateLimits: []
    })

    // Initialize Coinbase config
    this.exchangeConfigs.set('coinbase', {
      name: 'coinbase',
      displayName: 'Coinbase Pro',
      baseUrl: 'https://api.pro.coinbase.com',
      wsUrl: 'wss://ws-feed.pro.coinbase.com',
      features: {
        spot: true,
        margin: false,
        futures: false,
        spotTrading: true,
        marginTrading: false,
        futuresTrading: false,
        ocoOrders: false,
        stopOrders: true,
        takeProfitOrders: true,
        trailingStop: false
      },
      rateLimits: []
    })

    // Initialize Kraken config
    this.exchangeConfigs.set('kraken', {
      name: 'kraken',
      displayName: 'Kraken',
      baseUrl: 'https://api.kraken.com/0',
      wsUrl: 'wss://ws.kraken.com',
      features: {
        spot: true,
        margin: true,
        futures: false,
        spotTrading: true,
        marginTrading: true,
        futuresTrading: false,
        ocoOrders: false,
        stopOrders: true,
        takeProfitOrders: true,
        trailingStop: true
      },
      rateLimits: []
    })
  }

  async getAdapter(exchangeId: string): Promise<ExchangeAdapter> {
    // Check if adapter already exists
    if (this.adapters.has(exchangeId)) {
      return this.adapters.get(exchangeId)!
    }

    // Get exchange account from database
    const exchangeAccount = await db.exchangeAccount.findUnique({
      where: { id: exchangeId },
      include: {
        exchange: true,
        user: true
      }
    })

    if (!exchangeAccount) {
      throw new Error(`Exchange account not found: ${exchangeId}`)
    }

    // Create new adapter
    const adapter = this.createAdapter(exchangeAccount)
    
    // Initialize adapter
    await adapter.initialize()
    
    // Cache adapter
    this.adapters.set(exchangeId, adapter)

    return adapter
  }

  private createAdapter(exchangeAccount: any): ExchangeAdapter {
    const credentials: ExchangeCredentials = {
      apiKey: exchangeAccount.apiKey,
      apiSecret: exchangeAccount.apiSecret,
      passphrase: exchangeAccount.passphrase
    }

    switch (exchangeAccount.exchange.name) {
      case 'binance':
        return new BinanceAdapter(credentials)
      case 'coinbase':
        return new CoinbaseAdapter(credentials)
      case 'kraken':
        return new KrakenAdapter(credentials)
      default:
        throw new Error(`Unsupported exchange: ${exchangeAccount.exchange.name}`)
    }
  }

  async removeAdapter(exchangeId: string): Promise<void> {
    const adapter = this.adapters.get(exchangeId)
    if (adapter) {
      await adapter.close()
      this.adapters.delete(exchangeId)
    }
  }

  async closeAllAdapters(): Promise<void> {
    const closePromises = Array.from(this.adapters.values()).map(adapter => adapter.close())
    await Promise.all(closePromises)
    this.adapters.clear()
  }

  getAvailableExchanges(): ExchangeConfig[] {
    return Array.from(this.exchangeConfigs.values())
  }

  getExchangeConfig(exchangeName: string): ExchangeConfig | undefined {
    return this.exchangeConfigs.get(exchangeName)
  }

  async testConnection(exchangeId: string): Promise<boolean> {
    try {
      const adapter = await this.getAdapter(exchangeId)
      return await adapter.testConnection()
    } catch (error) {
      console.error(`Connection test failed for ${exchangeId}:`, error)
      return false
    }
  }

  async getAccountBalances(exchangeId: string): Promise<any[]> {
    const adapter = await this.getAdapter(exchangeId)
    return adapter.getAccount()
  }

  async createOrder(exchangeId: string, orderRequest: any): Promise<any> {
    const adapter = await this.getAdapter(exchangeId)
    return adapter.createOrder(orderRequest)
  }

  async getOpenOrders(exchangeId: string, symbol?: string): Promise<any[]> {
    const adapter = await this.getAdapter(exchangeId)
    return adapter.getOpenOrders(symbol)
  }

  async cancelOrder(exchangeId: string, orderId: string, symbol?: string): Promise<any> {
    const adapter = await this.getAdapter(exchangeId)
    return adapter.cancelOrder(orderId, symbol)
  }

  async getTicker(exchangeId: string, symbol: string): Promise<any> {
    const adapter = await this.getAdapter(exchangeId)
    return adapter.getTicker(symbol)
  }

  async getOrderBook(exchangeId: string, symbol: string, limit?: number): Promise<any> {
    const adapter = await this.getAdapter(exchangeId)
    return adapter.getOrderBook(symbol, limit)
  }

  async getMarketData(exchangeId: string, symbol: string): Promise<any> {
    const adapter = await this.getAdapter(exchangeId)
    const [ticker, orderBook] = await Promise.all([
      adapter.getTicker(symbol),
      adapter.getOrderBook(symbol, 10)
    ])

    return {
      ticker,
      orderBook,
      timestamp: Date.now()
    }
  }

  // WebSocket subscription management
  async subscribeToTicker(exchangeId: string, symbol: string, callback: (data: any) => void): Promise<void> {
    const adapter = await this.getAdapter(exchangeId)
    await adapter.subscribeTicker(symbol, callback)
  }

  async subscribeToOrderBook(exchangeId: string, symbol: string, callback: (data: any) => void): Promise<void> {
    const adapter = await this.getAdapter(exchangeId)
    await adapter.subscribeOrderBook(symbol, callback)
  }

  async subscribeToTrades(exchangeId: string, symbol: string, callback: (data: any) => void): Promise<void> {
    const adapter = await this.getAdapter(exchangeId)
    await adapter.subscribeTrades(symbol, callback)
  }

  async subscribeToUserData(exchangeId: string, callback: (data: any) => void): Promise<void> {
    const adapter = await this.getAdapter(exchangeId)
    await adapter.subscribeUserData(callback)
  }

  // Utility methods
  async getExchangeAccountsByUser(userId: string): Promise<any[]> {
    return db.exchangeAccount.findMany({
      where: { userId },
      include: {
        exchange: true
      }
    })
  }

  async createExchangeAccount(data: {
    userId: string
    exchangeId: string
    apiKey: string
    apiSecret: string
    passphrase?: string
    nickname?: string
  }): Promise<any> {
    // Test connection first
    const tempCredentials: ExchangeCredentials = {
      apiKey: data.apiKey,
      apiSecret: data.apiSecret,
      passphrase: data.passphrase
    }

    const exchange = await db.exchange.findUnique({
      where: { id: data.exchangeId }
    })

    if (!exchange) {
      throw new Error('Exchange not found')
    }

    // Create temporary adapter for testing
    let tempAdapter: ExchangeAdapter | null = null
    try {
      tempAdapter = this.createAdapter({
        ...data,
        exchange
      })
      await tempAdapter.initialize()
      const isConnected = await tempAdapter.testConnection()
      
      if (!isConnected) {
        throw new Error('Failed to connect to exchange with provided credentials')
      }

      // Create exchange account in database
      const exchangeAccount = await db.exchangeAccount.create({
        data: {
          userId: data.userId,
          exchangeId: data.exchangeId,
          apiKey: data.apiKey,
          apiSecret: data.apiSecret,
          passphrase: data.passphrase,
          nickname: data.nickname || `${exchange.name} Account`,
          status: 'ACTIVE',
          permissions: {
            trading: true,
            withdrawal: false // Disable withdrawals by default for security
          }
        },
        include: {
          exchange: true
        }
      })

      return exchangeAccount
    } finally {
      if (tempAdapter) {
        await tempAdapter.close()
      }
    }
  }

  async updateExchangeAccount(id: string, data: Partial<{
    apiKey: string
    apiSecret: string
    passphrase?: string
    nickname?: string
    status: string
  }>): Promise<any> {
    const existingAccount = await db.exchangeAccount.findUnique({
      where: { id },
      include: {
        exchange: true
      }
    })

    if (!existingAccount) {
      throw new Error('Exchange account not found')
    }

    // If credentials are being updated, test them first
    if (data.apiKey || data.apiSecret) {
      const tempCredentials: ExchangeCredentials = {
        apiKey: data.apiKey || existingAccount.apiKey,
        apiSecret: data.apiSecret || existingAccount.apiSecret,
        passphrase: data.passphrase || existingAccount.passphrase
      }

      let tempAdapter: ExchangeAdapter | null = null
      try {
        tempAdapter = this.createAdapter({
          ...existingAccount,
          ...data
        })
        await tempAdapter.initialize()
        const isConnected = await tempAdapter.testConnection()
        
        if (!isConnected) {
          throw new Error('Failed to connect to exchange with updated credentials')
        }
      } finally {
        if (tempAdapter) {
          await tempAdapter.close()
        }
      }

      // Remove existing adapter from cache
      this.adapters.delete(id)
    }

    // Update exchange account
    const updatedAccount = await db.exchangeAccount.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        exchange: true
      }
    })

    return updatedAccount
  }

  async deleteExchangeAccount(id: string): Promise<void> {
    // Remove adapter from cache
    await this.removeAdapter(id)
    
    // Delete from database
    await db.exchangeAccount.delete({
      where: { id }
    })
  }
}

// Singleton instance
export const exchangeManager = new ExchangeManager()