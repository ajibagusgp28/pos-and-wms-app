"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

interface Product {
  id: string
  sku: string
  name: string
  selling_price: number
}

interface ProductSearchProps {
  onSelect: (product: Product) => void
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/list")
        const data = await response.json()
        setProducts(data.data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }
    fetchProducts()
  }, [])

  const handleSearch = (value: string) => {
    setSearch(value)
    if (value.length > 0) {
      const filtered = products.filter(
        (p) => p.name.toLowerCase().includes(value.toLowerCase()) || p.sku.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filtered.slice(0, 8))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelect = (product: Product) => {
    onSelect(product)
    setSearch("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => search && setShowSuggestions(true)}
          placeholder="Search by name or SKU..."
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
        />
        {search && (
          <button
            onClick={() => {
              setSearch("")
              setSuggestions([])
              setShowSuggestions(false)
            }}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
          {suggestions.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
            >
              <p className="font-medium text-foreground">{product.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{product.sku}</p>
                <p className="text-sm font-semibold text-accent">IDR {product.selling_price.toLocaleString("id-ID")}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
