"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useInventory } from "@/lib/hooks/use-inventory"
import { MOCK_PRODUCTS } from "@/lib/data/mock-data"
import { Trash2 } from "lucide-react"

interface StockInItem {
  productId: string
  quantity: number
  referenceNo: string
}

export function StockIn() {
  const [items, setItems] = useState<StockInItem[]>([])
  const [referenceNo, setReferenceNo] = useState("")
  const { addStock } = useInventory()

  const addItem = (productId: string) => {
    setItems((prev) => [...prev, { productId, quantity: 1, referenceNo }])
  }

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((_, i) => i !== index))
      return
    }
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity } : item)))
  }

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!referenceNo || items.length === 0) {
      alert("Please fill in reference number and add items")
      return
    }

    items.forEach((item) => {
      addStock(item.productId, item.quantity)
    })

    alert(`Stock In completed! ${items.length} items received.`)
    setItems([])
    setReferenceNo("")
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Reference Number */}
      <Card>
        <CardHeader>
          <CardTitle>Stock In Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Reference Number (PO, GRN, etc.)</label>
              <Input
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                placeholder="e.g., PO-2024-001"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Items */}
      <Card>
        <CardHeader>
          <CardTitle>Add Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {MOCK_PRODUCTS.map((product) => (
              <Button
                key={product.id}
                onClick={() => addItem(product.id)}
                variant="outline"
                className="h-auto p-3 flex flex-col items-start justify-start text-left"
              >
                <p className="font-semibold truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground">Add to Stock In</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Items to Receive</span>
            <span className="text-lg text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} • {totalItems} units
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No items added yet</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, idx) => {
                const product = MOCK_PRODUCTS.find((p) => p.id === item.productId)
                return (
                  <div key={idx} className="flex gap-3 items-center p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{product?.name}</p>
                      <p className="text-xs text-muted-foreground">{item.productId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(idx, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        −
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(idx, Number.parseInt(e.target.value) || 1)}
                        className="w-12 h-6 text-center p-0"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        +
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => removeItem(idx)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button onClick={handleSubmit} disabled={items.length === 0 || !referenceNo} className="w-full" size="lg">
        Complete Stock In
      </Button>
    </div>
  )
}
