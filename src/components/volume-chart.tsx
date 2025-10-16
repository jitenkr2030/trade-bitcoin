"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Generate mock volume data
const generateVolumeData = (): Array<{
  time: string
  volume: number
  buys: number
  sells: number
}> => {
  const data: Array<{
    time: string
    volume: number
    buys: number
    sells: number
  }> = []
  const intervals = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
  
  for (let i = 0; i < intervals.length; i++) {
    data.push({
      time: intervals[i],
      volume: Math.random() * 50000000 + 10000000,
      buys: Math.random() * 30000000 + 5000000,
      sells: Math.random() * 20000000 + 5000000
    })
  }
  
  return data
}

export function VolumeChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData(generateVolumeData())
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(generateVolumeData())
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
            tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-blue-600">
                      Total Volume: ${(data.volume / 1000000).toFixed(2)}M
                    </p>
                    <p className="text-xs text-green-600">
                      Buys: ${(data.buys / 1000000).toFixed(2)}M
                    </p>
                    <p className="text-xs text-red-600">
                      Sells: ${(data.sells / 1000000).toFixed(2)}M
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="buys"
            stackId="volume"
            fill="hsl(var(--green-600))"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="sells"
            stackId="volume"
            fill="hsl(var(--red-600))"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}