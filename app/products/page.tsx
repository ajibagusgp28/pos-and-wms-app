"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { ProductForm } from "@/components/products/product-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Trash2, Edit } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products/list")
      const data = await response.json()
      setProducts(data.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        fetchProducts()
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const filteredProducts = products.filter(
    (product: any) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Products</h1>
              <p className="text-muted-foreground mt-2">Manage your product catalog</p>
            </div>
            <Button onClick={() => setShowForm(true)} size="lg" className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Product
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Products Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No products found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">SKU</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Cost Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Selling Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product: any) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-foreground">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{product.category || "-"}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        IDR {(product.cost_price || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-accent">
                        IDR {product.selling_price.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowForm(true)
                          }}
                          className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Form Modal */}
          {showForm && (
            <ProductForm
              product={selectedProduct}
              onClose={() => {
                setShowForm(false)
                setSelectedProduct(null)
              }}
              onSuccess={() => {
                fetchProducts()
              }}
            />
          )}
        </div>
      </main>
    </div>
  )
}
