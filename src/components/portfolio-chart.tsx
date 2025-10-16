"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { date: "Jan", value: 100000 },
  { date: "Feb", value: 105000 },
  { date: "Mar", value: 98000 },
  { date: "Apr", value: 112000 },
  { date: "May", value: 108000 },
  { date: "Jun", value: 115000 },
  { date: "Jul", value: 125430 },
]

export function PortfolioChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
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
                if (firstPayload && firstPayload.value !== undefined) {
                  return (
                    <div className="bg-background border rounded-lg p-2 shadow-lg">
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-sm text-green-600">
                        ${firstPayload.value.toLocaleString()}
                      </p>
                    </div>
                  )
                }
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}