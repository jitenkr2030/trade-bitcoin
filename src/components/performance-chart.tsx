"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

const data = [
  { date: "Jan", value: 100000, returns: 0, drawdown: 0 },
  { date: "Feb", value: 105200, returns: 5.2, drawdown: -2.1 },
  { date: "Mar", value: 103400, returns: 3.4, drawdown: -8.4 },
  { date: "Apr", value: 112100, returns: 12.1, drawdown: -1.8 },
  { date: "May", value: 108500, returns: 8.5, drawdown: -5.2 },
  { date: "Jun", value: 115600, returns: 15.6, drawdown: -3.1 },
  { date: "Jul", value: 125430, returns: 25.4, drawdown: -2.3 },
]

export function PerformanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="date" 
            className="text-xs"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            className="text-xs"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length > 0 && payload[0]) {
                const firstPayload = payload[0];
                if (firstPayload && firstPayload.value !== undefined && firstPayload.payload) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-green-600">
                        Value: ${firstPayload.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Returns: {firstPayload.payload.returns}%
                      </p>
                    </div>
                  )
                }
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.1}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}