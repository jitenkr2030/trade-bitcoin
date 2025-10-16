"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Generate mock order book data
const generateOrderBookData = (): {
  price: number
  bidVolume: number
  askVolume: number
  totalBid: number
  totalAsk: number
}[] => {
  const data = [] as {
    price: number
    bidVolume: number
    askVolume: number
    totalBid: number
    totalAsk: number
  }[]
  const basePrice = 43250
  
  // Generate asks (selling orders above current price)
  for (let i = 10; i >= 1; i--) {
    const price = basePrice + i * 10
    const volume = Math.random() * 5 + 0.5
    data.push({
      price: price,
      bidVolume: 0,
      askVolume: volume,
      totalBid: 0,
      totalAsk: volume * (11 - i) // Cumulative volume
    })
  }
  
  // Current price
  data.push({
    price: basePrice,
    bidVolume: 0,
    askVolume: 0,
    totalBid: 0,
    totalAsk: 0
  })
  
  // Generate bids (buying orders below current price)
  let cumulativeBid = 0
  for (let i = 1; i <= 10; i++) {
    const price = basePrice - i * 10
    const volume = Math.random() * 5 + 0.5
    cumulativeBid += volume
    data.push({
      price: price,
      bidVolume: volume,
      askVolume: 0,
      totalBid: cumulativeBid,
      totalAsk: 0
    })
  }
  
  return data
}

export function OrderBookChart() {
  const [data, setData] = useState<{
    price: number
    bidVolume: number
    askVolume: number
    totalBid: number
    totalAsk: number
  }[]>([])

  useEffect(() => {
    setData(generateOrderBookData())
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(generateOrderBookData())
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            type="number"
            className="text-xs"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            dataKey="price"
            type="number"
            className="text-xs"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium">Price: ${label.toLocaleString()}</p>
                    {data.bidVolume > 0 && (
                      <p className="text-sm text-green-600">
                        Bid Volume: {data.bidVolume.toFixed(3)}
                      </p>
                    )}
                    {data.askVolume > 0 && (
                      <p className="text-sm text-red-600">
                        Ask Volume: {data.askVolume.toFixed(3)}
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="totalAsk"
            stackId="orderbook"
            fill="hsl(var(--red-600))"
            fillOpacity={0.8}
          />
          <Bar
            dataKey="totalBid"
            stackId="orderbook"
            fill="hsl(var(--green-600))"
            fillOpacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}