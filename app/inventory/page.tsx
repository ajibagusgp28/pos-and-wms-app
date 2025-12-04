"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { StockForm } from "@/components/wms/stock-form"
import { Button } from "@/components/ui/button"
import { Plus, AlertCircle, TrendingDown } from "lucide-react"

interface StockBalance {
  id: string
  product_id: string
  warehouse_id: string
  qty: number
  product?: {
    sku: string
    name: string
    selling_price: number
  }
}

export default function InventoryPage() {
  const [stocks, setStocks] = useState<StockBalance[]>([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<"in" | "out" | "transfer">("in")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/inventory/summary")
      const data = await response.json()
      setStocks(data.data || [])
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFormOpen = (type: "in" | "out" | "transfer") => {
    setFormType(type)
    setShowForm(true)
  }

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.product?.name.toLowerCase().includes(search.toLowerCase()) ||
      stock.product?.sku.toLowerCase().includes(search.toLowerCase()),
  )

  const lowStockCount = stocks.filter((s) => s.qty < 50).length
  const totalValue = stocks.reduce((sum, s) => sum + s.qty * (s.product?.selling_price || 0), 0)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
              <p className="text-muted-foreground mt-2">Manage your warehouse stock</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Button onClick={() => handleFormOpen("in")} size="lg" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Stock In
            </Button>
            <Button
              onClick={() => handleFormOpen("out")}
              size="lg"
              variant="outline"
              className="flex items-center gap-2"
            >
              <TrendingDown className="w-5 h-5" />
              Stock Out
            </Button>
            <Button
              onClick={() => handleFormOpen("transfer")}
              size="lg"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Transfer
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Total Products</p>
              <p className="text-2xl font-bold text-foreground">{stocks.length}</p>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Low Stock Alert</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-destructive">{lowStockCount}</p>
                {lowStockCount > 0 && <AlertCircle className="w-4 h-4 text-destructive" />}
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <p className="text-sm text-muted-foreground mb-1">Inventory Value</p>
              <p className="text-2xl font-bold text-accent">IDR {totalValue.toLocaleString("id-ID")}</p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Stock Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading inventory...</div>
            ) : filteredStocks.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No stock records found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Warehouse</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Inventory Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock) => (
                    <tr key={stock.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{stock.product?.sku}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{stock.product?.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{stock.warehouse_id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{stock.qty}</td>
                      <td className="px-6 py-4 text-sm">
                        {stock.qty === 0 ? (
                          <span className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs font-medium">
                            Out of Stock
                          </span>
                        ) : stock.qty < 50 ? (
                          <span className="px-2 py-1 bg-yellow-500/10 text-yellow-700 rounded text-xs font-medium">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-500/10 text-green-700 rounded text-xs font-medium">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-accent">
                        IDR {(stock.qty * (stock.product?.selling_price || 0)).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Stock Form Modal */}
      {showForm && (
        <StockForm
          type={formType}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            fetchInventory()
          }}
        />
      )}
    </div>
  )
}
