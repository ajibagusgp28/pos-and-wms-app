"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface StockFormProps {
  type: "in" | "out" | "transfer"
  onClose: () => void
  onSuccess: () => void
}

export function StockForm({ type, onClose, onSuccess }: StockFormProps) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    qty: "",
    description: "",
    cost_price: "",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products/list")
      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint =
        type === "in"
          ? "/api/inventory/stock-in"
          : type === "out"
            ? "/api/inventory/stock-out"
            : "/api/inventory/transfer"

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          qty: Number.parseInt(formData.qty),
        }),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error("Error processing stock operation:", error)
    } finally {
      setLoading(false)
    }
  }

  const titles: Record<string, string> = {
    in: "Stock In (Goods Received)",
    out: "Stock Out (Goods Issued)",
    transfer: "Stock Transfer",
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-card-foreground">{titles[type]}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Product</label>
            <select
              name="product_id"
              value={formData.product_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            >
              <option value="">Select a product</option>
              {products.map((product: any) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Warehouse</label>
            <select
              name="warehouse_id"
              value={formData.warehouse_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            >
              <option value="">Select warehouse</option>
              <option value="warehouse-1">Main Warehouse</option>
              <option value="warehouse-2">Branch A</option>
              <option value="warehouse-3">Branch B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Quantity</label>
            <Input name="qty" type="number" value={formData.qty} onChange={handleChange} placeholder="0" required />
          </div>

          {type === "in" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Cost Price</label>
              <Input
                name="cost_price"
                type="number"
                value={formData.cost_price}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {type === "out" ? "Reason" : "Description"}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={type === "out" ? "e.g., Damage, Lost, Transfer" : "e.g., Purchase order #123"}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
