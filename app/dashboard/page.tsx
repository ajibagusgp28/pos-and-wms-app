"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { PaymentBreakdown } from "@/components/dashboard/payment-breakdown"
import { TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back! Here's your business overview.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Sales Today"
              value="IDR 2,450,000"
              icon={<DollarSign className="w-6 h-6" />}
              trend="↑ 12% from yesterday"
            />
            <StatsCard
              title="Transactions"
              value="145"
              icon={<ShoppingCart className="w-6 h-6" />}
              trend="↑ 8% from yesterday"
            />
            <StatsCard
              title="Stock In"
              value="234 items"
              icon={<Package className="w-6 h-6" />}
              trend="12 products received"
            />
            <StatsCard title="Revenue" value="IDR 45.2M" icon={<TrendingUp className="w-6 h-6" />} trend="This month" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SalesChart />
            </div>
            <div>
              <PaymentBreakdown />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-card rounded-lg p-6 border border-border">
            <h3 className="font-semibold text-card-foreground mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded">
                  <div>
                    <p className="font-medium text-foreground">Transaction #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Today at {10 + i}:30 AM</p>
                  </div>
                  <p className="font-semibold text-accent">IDR {(245000 * i).toLocaleString("id-ID")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
