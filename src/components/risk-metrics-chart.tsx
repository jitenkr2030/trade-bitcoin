"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"

// Generate mock risk metrics data
const generateRiskMetricsData = () => {
  return [
    { name: "Equity Risk", value: 35, color: "#3b82f6" },
    { name: "Market Risk", value: 25, color: "#ef4444" },
    { name: "Leverage Risk", value: 20, color: "#f59e0b" },
    { name: "Liquidity Risk", value: 15, color: "#8b5cf6" },
    { name: "Counterparty Risk", value: 5, color: "#10b981" }
  ]
}

const generateRiskTimelineData = (): Array<{
  date: string
  portfolioValue: number
  var: number
  sharpeRatio: number
  maxDrawdown: number
}> => {
  const data: Array<{
    date: string
    portfolioValue: number
    var: number
    sharpeRatio: number
    maxDrawdown: number
  }> = []
  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString(),
      portfolioValue: 100000 + Math.random() * 50000,
      var: Math.random() * 10000 + 5000,
      sharpeRatio: Math.random() * 2 + 1,
      maxDrawdown: Math.random() * 20
    })
  }
  return data
}

export function RiskMetricsChart() {
  const [riskData, setRiskData] = useState<any[]>([])
  const [timelineData, setTimelineData] = useState<any[]>([])

  useEffect(() => {
    setRiskData(generateRiskMetricsData())
    setTimelineData(generateRiskTimelineData())
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRiskData(generateRiskMetricsData())
      setTimelineData(generateRiskTimelineData())
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <h4 className="text-sm font-medium mb-3">Risk Distribution</h4>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="text-sm font-medium">{payload[0].name}</p>
                        <p className="text-sm">{payload[0].value}%</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">VaR Trend</h4>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timelineData.slice(-10)}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date"
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value, index) => index % 2 === 0 ? value.split('/')[1] : ''}
              />
              <YAxis 
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm text-red-600">
                          VaR: ${payload[0].payload.var.toLocaleString()}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar
                dataKey="var"
                fill="hsl(var(--red-600))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}