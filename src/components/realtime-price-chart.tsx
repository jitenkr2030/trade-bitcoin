"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"

// Generate mock price data
const generatePriceData = (type: string): Array<{
  time: string
  price?: number
  open?: number
  high?: number
  low?: number
  close?: number
  volume: number
}> => {
  const data: Array<{
    time: string
    price?: number
    open?: number
    high?: number
    low?: number
    close?: number
    volume: number
  }> = []
  let basePrice = 43000
  
  for (let i = 0; i < 50; i++) {
    basePrice += (Math.random() - 0.5) * 200
    const timestamp = new Date(Date.now() - (49 - i) * 60000).toLocaleTimeString()
    
    if (type === "candlestick") {
      data.push({
        time: timestamp,
        open: basePrice,
        high: basePrice + Math.random() * 100,
        low: basePrice - Math.random() * 100,
        close: basePrice + (Math.random() - 0.5) * 150,
        volume: Math.random() * 1000000
      })
    } else {
      data.push({
        time: timestamp,
        price: basePrice,
        volume: Math.random() * 1000000
      })
    }
  }
  
  return data
}

export function RealTimePriceChart({ type }: { type: string }) {
  const [data, setData] = useState<Array<{
    time: string
    price?: number
    open?: number
    high?: number
    low?: number
    close?: number
    volume: number
  }>>([])
  const [currentPrice, setCurrentPrice] = useState(43250)

  useEffect(() => {
    // Initial data
    setData(generatePriceData(type))
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)]
        const lastDataPoint = prevData[prevData.length - 1]
        const lastPrice = lastDataPoint?.price || lastDataPoint?.close || 43250
        const newPrice = lastPrice + (Math.random() - 0.5) * 50
        const timestamp = new Date().toLocaleTimeString()
        
        setCurrentPrice(newPrice)
        
        if (type === "candlestick") {
          newData.push({
            time: timestamp,
            open: lastPrice,
            high: Math.max(lastPrice, newPrice) + Math.random() * 20,
            low: Math.min(lastPrice, newPrice) - Math.random() * 20,
            close: newPrice,
            volume: Math.random() * 1000000
          })
        } else {
          newData.push({
            time: timestamp,
            price: newPrice,
            volume: Math.random() * 1000000
          })
        }
        
        return newData
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [type])

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) => index % 10 === 0 ? value : ''}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-green-600">
                        Price: ${payload[0]?.value?.toLocaleString() || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Volume: ${(payload[0]?.payload?.volume / 1000000 || 0).toFixed(2)}M
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        )
      
      case "area":
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) => index % 10 === 0 ? value : ''}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-green-600">
                        Price: ${payload[0]?.value?.toLocaleString() || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Volume: ${(payload[0]?.payload?.volume / 1000000 || 0).toFixed(2)}M
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        )
      
      case "candlestick":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value, index) => index % 10 === 0 ? value : ''}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Open: <span className="font-medium">${data.open.toLocaleString()}</span></div>
                        <div>High: <span className="font-medium text-green-600">${data.high.toLocaleString()}</span></div>
                        <div>Low: <span className="font-medium text-red-600">${data.low.toLocaleString()}</span></div>
                        <div>Close: <span className="font-medium">${data.close.toLocaleString()}</span></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Volume: ${(data.volume / 1000000).toFixed(2)}M
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey={(data) => data.close > data.open ? data.close - data.open : 0}
              fill="hsl(var(--green-600))"
              stackId="price"
            />
            <Bar
              dataKey={(data) => data.close <= data.open ? data.open - data.close : 0}
              fill="hsl(var(--red-600))"
              stackId="price"
            />
          </BarChart>
        )
      
      default:
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              className="text-xs"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )
    }
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}