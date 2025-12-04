"use client"

import type { CartItem } from "@/lib/types"
import { Trash2, Plus, Minus } from "lucide-react"

interface CartProps {
  items: CartItem[]
  onUpdateQty: (productId: string, qty: number) => void
  onRemove: (productId: string) => void
}

export function Cart({ items, onUpdateQty, onRemove }: CartProps) {
  const subtotal = items.reduce((sum) => sum + items.reduce((s, item) => s + item.total_price, 0), 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Shopping Cart</h3>

      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-6">
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No items in cart</p>
        ) : (
          items.map((item) => (
            <div key={item.product_id} className="bg-muted rounded p-3 flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQty(item.product_id, item.qty - 1)}
                  className="p-1 hover:bg-card rounded text-muted-foreground hover:text-foreground"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                <button
                  onClick={() => onUpdateQty(item.product_id, item.qty + 1)}
                  className="p-1 hover:bg-card rounded text-muted-foreground hover:text-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => onRemove(item.product_id)}
                className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium text-foreground">IDR {subtotal.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span className="font-medium text-foreground">IDR {tax.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between text-lg font-bold bg-accent/10 -mx-4 -mb-4 px-4 py-2 rounded-b">
          <span className="text-foreground">Total</span>
          <span className="text-accent">IDR {total.toLocaleString("id-ID")}</span>
        </div>
      </div>
    </div>
  )
}
