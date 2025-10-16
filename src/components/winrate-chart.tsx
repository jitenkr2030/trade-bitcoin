"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { asset: "Crypto", winRate: 75.2, trades: 234 },
  { asset: "Stocks", winRate: 68.4, trades: 156 },
  { asset: "Forex", winRate: 71.1, trades: 67 },
  { asset: "ETFs", winRate: 82.3, trades: 17 },
]

export function WinRateChart() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="asset" 
            className="text-xs"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            className="text-xs"
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border rounded-lg p-2 shadow-lg">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-sm text-green-600">
                      Win Rate: {payload[0].value}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Trades: {payload[0].payload.trades}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="winRate"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}