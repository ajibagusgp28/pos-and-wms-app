"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface ProductFormProps {
  product?: any
  onClose: () => void
  onSuccess: () => void
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sku: product?.sku || "",
    name: product?.name || "",
    category: product?.category || "",
    cost_price: product?.cost_price || "",
    selling_price: product?.selling_price || "",
    barcode: product?.barcode || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = product ? `/api/products/${product.id}` : "/api/products/create"
      const method = product ? "PUT" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-card-foreground">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">SKU</label>
            <Input name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g., SKU001" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Product Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Laptop" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <Input name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Electronics" />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Selling Price</label>
              <Input
                name="selling_price"
                type="number"
                value={formData.selling_price}
                onChange={handleChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Barcode</label>
            <Input name="barcode" value={formData.barcode} onChange={handleChange} placeholder="e.g., 123456789" />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving..." : product ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
