"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInventory } from "@/lib/hooks/use-inventory"
import { MOCK_PRODUCTS } from "@/lib/data/mock-data"

export function StockSummary() {
  const { inventory } = useInventory()

  const totalItems = Object.values(inventory).reduce((sum, qty) => sum + qty, 0)
  const lowStockProducts = MOCK_PRODUCTS.filter((p) => (inventory[p.id] || p.stock) < 10)

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Stock Items</p>
            <p className="text-3xl font-bold">{totalItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total SKUs</p>
            <p className="text-3xl font-bold">{MOCK_PRODUCTS.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Low Stock Items</p>
            <p className="text-3xl font-bold text-destructive">{lowStockProducts.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock List */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-4 font-semibold text-sm bg-muted p-3 rounded-md">
              <div>Product</div>
              <div className="text-right">SKU</div>
              <div className="text-right">Current Stock</div>
              <div className="text-right">Min Level</div>
              <div className="text-right">Status</div>
            </div>

            {MOCK_PRODUCTS.map((product) => {
              const currentStock = inventory[product.id] ?? product.stock
              const isLowStock = currentStock < 10

              return (
                <div
                  key={product.id}
                  className="grid grid-cols-5 gap-4 p-3 border border-border rounded-md items-center"
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-right text-sm text-muted-foreground">{product.id}</div>
                  <div className="text-right font-semibold">{currentStock}</div>
                  <div className="text-right text-sm">10</div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        isLowStock ? "bg-destructive text-destructive-foreground" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {isLowStock ? "Low Stock" : "OK"}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
