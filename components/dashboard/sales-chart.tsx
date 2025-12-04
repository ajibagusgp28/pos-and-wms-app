"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { day: "Mon", sales: 4000, transactions: 24 },
  { day: "Tue", sales: 3000, transactions: 18 },
  { day: "Wed", sales: 2000, transactions: 14 },
  { day: "Thu", sales: 2780, transactions: 20 },
  { day: "Fri", sales: 1890, transactions: 16 },
  { day: "Sat", sales: 2390, transactions: 22 },
  { day: "Sun", sales: 3490, transactions: 28 },
]

export function SalesChart() {
  return (
    <div className="bg-card rounded-lg p-6">
      <h3 className="font-semibold text-card-foreground mb-4">Sales Trend (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="day" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--background)",
              border: `1px solid var(--border)`,
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="var(--primary)" strokeWidth={2} />
          <Line type="monotone" dataKey="transactions" stroke="var(--accent)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
