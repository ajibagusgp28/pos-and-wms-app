"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react"

interface StockMovement {
  id: string
  created_at: string
  product?: { sku: string; name: string }
  movement_type: "IN" | "OUT" | "TRANSFER" | "ADJUST"
  qty: number
  description?: string
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMovements()
  }, [])

  const fetchMovements = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/inventory/movements")
      const data = await response.json()
      setMovements(data.data || [])
    } catch (error) {
      console.error("Error fetching movements:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <ArrowUp className="w-4 h-4 text-green-600" />
      case "OUT":
        return <ArrowDown className="w-4 h-4 text-destructive" />
      case "TRANSFER":
        return <ArrowRight className="w-4 h-4 text-blue-600" />
      default:
        return <ArrowRight className="w-4 h-4 text-muted-foreground" />
    }
  }

  const filteredMovements = movements.filter(
    (m) =>
      m.product?.name.toLowerCase().includes(search.toLowerCase()) ||
      m.product?.sku.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Stock Movements</h1>
            <p className="text-muted-foreground mt-2">View all inventory transactions</p>
          </div>

          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading movements...</div>
            ) : filteredMovements.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No movements found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(movement.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm flex items-center gap-2">
                        {getMovementIcon(movement.movement_type)}
                        <span className="font-medium">{movement.movement_type}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{movement.product?.sku}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{movement.product?.name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">{movement.qty}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{movement.description || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
