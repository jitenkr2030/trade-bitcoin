"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Cryptocurrency", value: 45, performance: 12.3, color: "#3b82f6" },
  { name: "Stocks", value: 30, performance: 8.7, color: "#10b981" },
  { name: "Forex", value: 15, performance: 5.2, color: "#f59e0b" },
  { name: "ETFs", value: 10, performance: 3.8, color: "#8b5cf6" },
]

export function AssetPerformanceChart() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border rounded-lg p-2 shadow-lg">
                    <p className="text-sm font-medium">{payload[0].name}</p>
                    <p className="text-sm">{payload[0].value}% allocation</p>
                    <p className="text-xs text-green-600">
                      +{payload[0].payload.performance}% return
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}