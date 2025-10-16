'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

interface MarketDataMessage {
  type: 'ticker' | 'orderbook' | 'trades' | 'candlesticks'
  symbol: string
  exchangeAccountId: string
  data: any
  timestamp: number
}

interface UseMarketDataOptions {
  exchangeAccountId: string
  symbol: string
  channels: ('ticker' | 'orderbook' | 'trades' | 'candlesticks')[]
  enabled?: boolean
}

interface UseMarketDataReturn {
  ticker: any | null
  orderBook: any | null
  trades: any[] | null
  candlesticks: any[] | null
  isConnected: boolean
  error: string | null
  lastUpdate: number | null
  subscribe: () => void
  unsubscribe: () => void
}

export function useMarketData(
  options: UseMarketDataOptions
): UseMarketDataReturn {
  const { exchangeAccountId, symbol, channels, enabled = true } = options
  
  const [ticker, setTicker] = useState<any | null>(null)
  const [orderBook, setOrderBook] = useState<any | null>(null)
  const [trades, setTrades] = useState<any[] | null>(null)
  const [candlesticks, setCandlesticks] = useState<any[] | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const isSubscribedRef = useRef(false)

  const handleMessage = useCallback((message: MarketDataMessage) => {
    setLastUpdate(message.timestamp)

    switch (message.type) {
      case 'ticker':
        setTicker(message.data)
        break
      case 'orderbook':
        setOrderBook(message.data)
        break
      case 'trades':
        setTrades(prev => {
          const newTrades = Array.isArray(message.data) ? message.data : [message.data]
          if (!prev) return newTrades
          // Keep only last 100 trades
          return [...newTrades, ...prev].slice(0, 100)
        })
        break
      case 'candlesticks':
        setCandlesticks(message.data)
        break
    }
  }, [])

  const subscribe = useCallback(() => {
    if (!socketRef.current || !enabled || isSubscribedRef.current) return

    socketRef.current.emit('subscribe-market-data', {
      exchangeAccountId,
      symbol,
      channels
    })

    isSubscribedRef.current = true
    setError(null)
  }, [exchangeAccountId, symbol, channels, enabled])

  const unsubscribe = useCallback(() => {
    if (!socketRef.current || !isSubscribedRef.current) return

    socketRef.current.emit('unsubscribe-market-data', {
      exchangeAccountId,
      symbol,
      channels
    })

    isSubscribedRef.current = false
  }, [exchangeAccountId, symbol, channels])

  useEffect(() => {
    if (!enabled) {
      unsubscribe()
      return
    }

    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    const socket = socketRef.current

    // Connection events
    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
      subscribe()
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      isSubscribedRef.current = false
    })

    socket.on('connected', (data) => {
      console.log('Connected to market data stream:', data.message)
    })

    socket.on('subscribed', (data) => {
      console.log('Subscribed to market data:', data.message)
    })

    socket.on('unsubscribed', (data) => {
      console.log('Unsubscribed from market data:', data.message)
    })

    socket.on('market-data', handleMessage)

    socket.on('error', (error) => {
      console.error('Market data socket error:', error)
      setError(error.message)
    })

    // Cleanup on unmount
    return () => {
      unsubscribe()
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [enabled, subscribe, unsubscribe, handleMessage])

  // Auto-resubscribe when options change
  useEffect(() => {
    if (isConnected && enabled) {
      unsubscribe()
      subscribe()
    }
  }, [exchangeAccountId, symbol, channels, isConnected, enabled, subscribe, unsubscribe])

  return {
    ticker,
    orderBook,
    trades,
    candlesticks,
    isConnected,
    error,
    lastUpdate,
    subscribe,
    unsubscribe
  }
}

// Hook for multiple symbols
interface UseMultiMarketDataOptions {
  exchangeAccountId: string
  symbols: string[]
  channels: ('ticker' | 'orderbook' | 'trades' | 'candlesticks')[]
  enabled?: boolean
}

interface UseMultiMarketDataReturn {
  data: Record<string, {
    ticker: any | null
    orderBook: any | null
    trades: any[] | null
    candlesticks: any[] | null
    lastUpdate: number | null
  }>
  isConnected: boolean
  error: string | null
}

export function useMultiMarketData(
  options: UseMultiMarketDataOptions
): UseMultiMarketDataReturn {
  const { exchangeAccountId, symbols, channels, enabled = true } = options
  
  const [data, setData] = useState<Record<string, any>>({})
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const socketRef = useRef<Socket | null>(null)
  const subscriptionsRef = useRef<Set<string>>(new Set())

  const handleMessage = useCallback((message: MarketDataMessage) => {
    setData(prev => ({
      ...prev,
      [message.symbol]: {
        ...prev[message.symbol],
        [message.type]: message.data,
        lastUpdate: message.timestamp
      }
    }))
  }, [])

  useEffect(() => {
    if (!enabled) {
      return
    }

    // Initialize data structure
    const initialData: Record<string, any> = {}
    symbols.forEach(symbol => {
      initialData[symbol] = {
        ticker: null,
        orderBook: null,
        trades: null,
        candlesticks: null,
        lastUpdate: null
      }
    })
    setData(initialData)

    // Initialize socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
      
      // Subscribe to all symbols
      symbols.forEach(symbol => {
        socket.emit('subscribe-market-data', {
          exchangeAccountId,
          symbol,
          channels
        })
        subscriptionsRef.current.add(symbol)
      })
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      subscriptionsRef.current.clear()
    })

    socket.on('market-data', handleMessage)

    socket.on('error', (error) => {
      console.error('Market data socket error:', error)
      setError(error.message)
    })

    return () => {
      // Unsubscribe from all symbols
      subscriptionsRef.current.forEach(symbol => {
        socket.emit('unsubscribe-market-data', {
          exchangeAccountId,
          symbol,
          channels
        })
      })
      
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [exchangeAccountId, symbols, channels, enabled, handleMessage])

  return {
    data,
    isConnected,
    error
  }
}