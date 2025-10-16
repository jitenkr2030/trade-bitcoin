import { Server as SocketIOServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import { exchangeManager } from '@/lib/exchanges/manager'
import { db } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface MarketDataSubscription {
  userId: string
  exchangeAccountId: string
  symbol: string
  channels: string[]
  socketId: string
}

interface MarketDataMessage {
  type: 'ticker' | 'orderbook' | 'trades' | 'candlesticks'
  symbol: string
  exchangeAccountId: string
  data: any
  timestamp: number
}

export class MarketDataWebSocket {
  private io: SocketIOServer
  private subscriptions: Map<string, MarketDataSubscription[]> = new Map()
  private exchangeConnections: Map<string, any> = new Map()

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling']
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers(): void {
    this.io.use(async (socket, next) => {
      try {
        // Authenticate the connection using the session
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
          return next(new Error('Authentication required'))
        }
        
        // Attach user info to socket
        socket.data.userId = session.user.id
        socket.data.userRole = session.user.role
        next()
      } catch (error) {
        next(new Error('Authentication failed'))
      }
    })

    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id} (User: ${socket.data.userId})`)

      // Handle market data subscription
      socket.on('subscribe-market-data', async (data) => {
        try {
          await this.handleSubscription(socket, data)
        } catch (error) {
          socket.emit('error', { message: error.message })
        }
      })

      // Handle market data unsubscription
      socket.on('unsubscribe-market-data', async (data) => {
        try {
          await this.handleUnsubscription(socket, data)
        } catch (error) {
          socket.emit('error', { message: error.message })
        }
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`)
        this.handleDisconnection(socket)
      })

      // Send initial connection confirmation
      socket.emit('connected', { message: 'Connected to market data stream' })
    })
  }

  private async handleSubscription(socket: any, data: {
    exchangeAccountId: string
    symbol: string
    channels: string[]
  }): Promise<void> {
    const { exchangeAccountId, symbol, channels } = data
    const userId = socket.data.userId

    // Verify user owns the exchange account
    const exchangeAccount = await db.exchangeAccount.findFirst({
      where: {
        id: exchangeAccountId,
        userId
      }
    })

    if (!exchangeAccount) {
      throw new Error('Exchange account not found or access denied')
    }

    // Create subscription key
    const subscriptionKey = `${exchangeAccountId}-${symbol}`

    // Initialize subscription array if not exists
    if (!this.subscriptions.has(subscriptionKey)) {
      this.subscriptions.set(subscriptionKey, [])
    }

    // Add subscription
    const subscription: MarketDataSubscription = {
      userId,
      exchangeAccountId,
      symbol,
      channels,
      socketId: socket.id
    }

    this.subscriptions.get(subscriptionKey)!.push(subscription)

    // If this is the first subscription for this key, establish exchange connection
    if (this.subscriptions.get(subscriptionKey)!.length === 1) {
      await this.establishExchangeConnection(exchangeAccountId, symbol, channels)
    }

    // Send confirmation
    socket.emit('subscribed', {
      exchangeAccountId,
      symbol,
      channels,
      message: 'Successfully subscribed to market data'
    })

    console.log(`Subscription added: ${subscriptionKey} for user ${userId}`)
  }

  private async handleUnsubscription(socket: any, data: {
    exchangeAccountId: string
    symbol: string
    channels?: string[]
  }): Promise<void> {
    const { exchangeAccountId, symbol, channels } = data
    const userId = socket.data.userId

    const subscriptionKey = `${exchangeAccountId}-${symbol}`

    // Remove subscription
    const subscriptions = this.subscriptions.get(subscriptionKey) || []
    const filteredSubscriptions = subscriptions.filter(sub => 
      !(sub.userId === userId && sub.socketId === socket.id)
    )

    if (filteredSubscriptions.length === 0) {
      this.subscriptions.delete(subscriptionKey)
      await this.closeExchangeConnection(exchangeAccountId, symbol)
    } else {
      this.subscriptions.set(subscriptionKey, filteredSubscriptions)
    }

    // Send confirmation
    socket.emit('unsubscribed', {
      exchangeAccountId,
      symbol,
      channels,
      message: 'Successfully unsubscribed from market data'
    })

    console.log(`Subscription removed: ${subscriptionKey} for user ${userId}`)
  }

  private handleDisconnection(socket: any): void {
    const userId = socket.data.userId
    const socketId = socket.id

    // Remove all subscriptions for this socket
    for (const [subscriptionKey, subscriptions] of this.subscriptions.entries()) {
      const filteredSubscriptions = subscriptions.filter(sub => 
        !(sub.userId === userId && sub.socketId === socketId)
      )

      if (filteredSubscriptions.length === 0) {
        this.subscriptions.delete(subscriptionKey)
        const [exchangeAccountId, symbol] = subscriptionKey.split('-')
        this.closeExchangeConnection(exchangeAccountId, symbol)
      } else {
        this.subscriptions.set(subscriptionKey, filteredSubscriptions)
      }
    }
  }

  private async establishExchangeConnection(
    exchangeAccountId: string, 
    symbol: string, 
    channels: string[]
  ): Promise<void> {
    try {
      const connectionKey = `${exchangeAccountId}-${symbol}`

      if (this.exchangeConnections.has(connectionKey)) {
        return // Connection already exists
      }

      // Get exchange adapter
      const adapter = await exchangeManager.getAdapter(exchangeAccountId)

      // Set up channel subscriptions
      const connectionPromises: Promise<void>[] = []

      if (channels.includes('ticker')) {
        connectionPromises.push(this.setupTickerStream(adapter, exchangeAccountId, symbol))
      }

      if (channels.includes('orderbook')) {
        connectionPromises.push(this.setupOrderBookStream(adapter, exchangeAccountId, symbol))
      }

      if (channels.includes('trades')) {
        connectionPromises.push(this.setupTradesStream(adapter, exchangeAccountId, symbol))
      }

      if (channels.includes('candlesticks')) {
        connectionPromises.push(this.setupCandlesticksStream(adapter, exchangeAccountId, symbol))
      }

      await Promise.all(connectionPromises)

      // Store connection info
      this.exchangeConnections.set(connectionKey, {
        adapter,
        channels,
        establishedAt: Date.now()
      })

      console.log(`Exchange connection established: ${connectionKey}`)
    } catch (error) {
      console.error(`Failed to establish exchange connection: ${exchangeAccountId}-${symbol}`, error)
      throw error
    }
  }

  private async closeExchangeConnection(exchangeAccountId: string, symbol: string): Promise<void> {
    const connectionKey = `${exchangeAccountId}-${symbol}`
    const connection = this.exchangeConnections.get(connectionKey)

    if (connection) {
      // Close WebSocket connections through the adapter
      try {
        await connection.adapter.close()
      } catch (error) {
        console.error(`Error closing exchange connection: ${connectionKey}`, error)
      }

      this.exchangeConnections.delete(connectionKey)
      console.log(`Exchange connection closed: ${connectionKey}`)
    }
  }

  private async setupTickerStream(
    adapter: any, 
    exchangeAccountId: string, 
    symbol: string
  ): Promise<void> {
    await adapter.subscribeTicker(symbol, (ticker: any) => {
      const message: MarketDataMessage = {
        type: 'ticker',
        symbol,
        exchangeAccountId,
        data: ticker,
        timestamp: Date.now()
      }

      this.broadcastToSubscribers(exchangeAccountId, symbol, 'ticker', message)
    })
  }

  private async setupOrderBookStream(
    adapter: any, 
    exchangeAccountId: string, 
    symbol: string
  ): Promise<void> {
    await adapter.subscribeOrderBook(symbol, (orderBook: any) => {
      const message: MarketDataMessage = {
        type: 'orderbook',
        symbol,
        exchangeAccountId,
        data: orderBook,
        timestamp: Date.now()
      }

      this.broadcastToSubscribers(exchangeAccountId, symbol, 'orderbook', message)
    })
  }

  private async setupTradesStream(
    adapter: any, 
    exchangeAccountId: string, 
    symbol: string
  ): Promise<void> {
    await adapter.subscribeTrades(symbol, (trades: any[]) => {
      const message: MarketDataMessage = {
        type: 'trades',
        symbol,
        exchangeAccountId,
        data: trades,
        timestamp: Date.now()
      }

      this.broadcastToSubscribers(exchangeAccountId, symbol, 'trades', message)
    })
  }

  private async setupCandlesticksStream(
    adapter: any, 
    exchangeAccountId: string, 
    symbol: string
  ): Promise<void> {
    // For candlesticks, we'll poll at intervals since not all exchanges support real-time candlestick streams
    const pollInterval = 60000 // 1 minute
    
    const pollCandlesticks = async () => {
      try {
        const candlesticks = await adapter.getCandlesticks(symbol, '1m', 100)
        const message: MarketDataMessage = {
          type: 'candlesticks',
          symbol,
          exchangeAccountId,
          data: candlesticks,
          timestamp: Date.now()
        }

        this.broadcastToSubscribers(exchangeAccountId, symbol, 'candlesticks', message)
      } catch (error) {
        console.error(`Error polling candlesticks for ${symbol}:`, error)
      }
    }

    // Initial poll
    await pollCandlesticks()

    // Set up interval polling
    const interval = setInterval(pollCandlesticks, pollInterval)

    // Store interval for cleanup
    const connectionKey = `${exchangeAccountId}-${symbol}`
    const connection = this.exchangeConnections.get(connectionKey)
    if (connection) {
      connection.candlesticksInterval = interval
    }
  }

  private broadcastToSubscribers(
    exchangeAccountId: string, 
    symbol: string, 
    channel: string, 
    message: MarketDataMessage
  ): void {
    const subscriptionKey = `${exchangeAccountId}-${symbol}`
    const subscriptions = this.subscriptions.get(subscriptionKey) || []

    subscriptions.forEach(subscription => {
      if (subscription.channels.includes(channel)) {
        const socket = this.io.sockets.sockets.get(subscription.socketId)
        if (socket && socket.connected) {
          socket.emit('market-data', message)
        }
      }
    })
  }

  // Public methods for external use
  getActiveSubscriptions(): MarketDataSubscription[] {
    const allSubscriptions: MarketDataSubscription[] = []
    for (const subscriptions of this.subscriptions.values()) {
      allSubscriptions.push(...subscriptions)
    }
    return allSubscriptions
  }

  getExchangeConnectionCount(): number {
    return this.exchangeConnections.size
  }

  async shutdown(): Promise<void> {
    // Close all exchange connections
    const closePromises = Array.from(this.exchangeConnections.keys()).map(key => {
      const [exchangeAccountId, symbol] = key.split('-')
      return this.closeExchangeConnection(exchangeAccountId, symbol)
    })

    await Promise.all(closePromises)

    // Clear all subscriptions
    this.subscriptions.clear()

    // Close Socket.IO server
    this.io.close()

    console.log('Market data WebSocket server shutdown complete')
  }
}

// Singleton instance
let marketDataWebSocket: MarketDataWebSocket | null = null

export function initializeMarketDataWebSocket(httpServer: HTTPServer): MarketDataWebSocket {
  if (!marketDataWebSocket) {
    marketDataWebSocket = new MarketDataWebSocket(httpServer)
  }
  return marketDataWebSocket
}

export function getMarketDataWebSocket(): MarketDataWebSocket | null {
  return marketDataWebSocket
}