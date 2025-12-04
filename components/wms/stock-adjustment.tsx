"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useInventory } from "@/lib/hooks/use-inventory"
import { MOCK_PRODUCTS } from "@/lib/data/mock-data"

interface AdjustmentItem {
  productId: string
  reason: string
  quantity: number
  adjustmentType: "add" | "subtract"
}

export function StockAdjustment() {
  const [items, setItems] = useState<AdjustmentItem[]>([])
  const { adjustStock } = useInventory()

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: MOCK_PRODUCTS[0].id,
        reason: "Inventory Count",
        quantity: 1,
        adjustmentType: "subtract",
      },
    ])
  }

  const updateItem = (index: number, field: keyof AdjustmentItem, value: any) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("Please add at least one adjustment")
      return
    }

    items.forEach((item) => {
      const adjustment = item.adjustmentType === "add" ? item.quantity : -item.quantity
      adjustStock(item.productId, adjustment)
    })

    alert(`Stock adjustments completed! ${items.length} item${items.length !== 1 ? "s" : ""} adjusted.`)
    setItems([])
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Stock Adjustments</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Adjust inventory for count discrepancies, damages, or other reasons
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No adjustments added yet</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">Product</label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(idx, "productId", e.target.value)}
                        className="w-full border border-input rounded-md px-3 py-2 bg-background"
                      >
                        {MOCK_PRODUCTS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Type</label>
                      <select
                        value={item.adjustmentType}
                        onChange={(e) => updateItem(idx, "adjustmentType", e.target.value)}
                        className="w-full border border-input rounded-md px-3 py-2 bg-background"
                      >
                        <option value="add">Add Stock</option>
                        <option value="subtract">Remove Stock</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium block mb-1">Quantity</label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, "quantity", Math.max(1, Number.parseInt(e.target.value) || 1))}
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Reason</label>
                      <Input
                        value={item.reason}
                        onChange={(e) => updateItem(idx, "reason", e.target.value)}
                        placeholder="e.g., Damage, Inventory Count"
                      />
                    </div>
                  </div>

                  <Button onClick={() => removeItem(idx)} variant="destructive" size="sm" className="w-full">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Button onClick={addItem} variant="outline" className="w-full bg-transparent">
            Add Adjustment
          </Button>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <Button onClick={handleSubmit} className="w-full" size="lg">
          Submit Adjustments ({items.length})
        </Button>
      )}
    </div>
  )
}
