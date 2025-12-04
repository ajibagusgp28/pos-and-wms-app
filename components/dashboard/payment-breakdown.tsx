"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Cash", value: 40, fill: "var(--chart-1)" },
  { name: "QRIS", value: 30, fill: "var(--chart-2)" },
  { name: "Bank Transfer", value: 30, fill: "var(--chart-3)" },
]

export function PaymentBreakdown() {
  return (
    <div className="bg-card rounded-lg p-6">
      <h3 className="font-semibold text-card-foreground mb-4">Payment Methods</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
