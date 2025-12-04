"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { ProductSearch } from "@/components/pos/product-search"
import { Cart } from "@/components/pos/cart"
import { PaymentModal } from "@/components/pos/payment-modal"
import { Button } from "@/components/ui/button"
import type { CartItem } from "@/lib/types"
import { CheckCircle } from "lucide-react"

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [transactionComplete, setTransactionComplete] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleAddProduct = (product: any) => {
    const existingItem = cart.find((item) => item.product_id === product.id)

    if (existingItem) {
      const newQty = existingItem.qty + 1
      handleUpdateQty(product.id, newQty)
    } else {
      const newItem: CartItem = {
        product_id: product.id,
        product_name: product.name,
        sku: product.sku,
        qty: 1,
        unit_price: product.selling_price,
        total_price: product.selling_price,
      }
      setCart([...cart, newItem])
    }
  }

  const handleUpdateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId)
      return
    }

    setCart(
      cart.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              qty,
              total_price: item.unit_price * qty,
            }
          : item,
      ),
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCart(cart.filter((item) => item.product_id !== productId))
  }

  const handleCompletePayment = async (method: string, amount: number) => {
    try {
      const response = await fetch("/api/pos/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cashier_id: "current-user-id", // Replace with actual user
          warehouse_id: "default-warehouse",
          items: cart,
          subtotal,
          tax,
          discount: 0,
          total,
          payment_method: method,
          payment_amount: amount,
          change: amount - total,
        }),
      })

      if (response.ok) {
        setTransactionComplete(true)
        setCart([])
        setShowPayment(false)
        setTimeout(() => setTransactionComplete(false), 3000)
      }
    } catch (error) {
      console.error("Error completing transaction:", error)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">POS - Cashier</h1>

          {/* Success Message */}
          {transactionComplete && (
            <div className="mb-6 bg-accent/10 border border-accent rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">Transaction completed successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left: Product Search */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">Search & Add Products</h2>
                <ProductSearch onSelect={handleAddProduct} />
              </div>

              {/* Quick Categories */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-card-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline">Electronics</Button>
                  <Button variant="outline">Accessories</Button>
                  <Button variant="outline">Software</Button>
                  <Button variant="outline">Services</Button>
                </div>
              </div>
            </div>

            {/* Right: Cart */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Cart items={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemoveItem} />

                {/* Checkout Button */}
                <Button
                  onClick={() => setShowPayment(true)}
                  disabled={cart.length === 0}
                  size="lg"
                  className="w-full mt-6"
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal total={total} onClose={() => setShowPayment(false)} onConfirm={handleCompletePayment} />
      )}
    </div>
  )
}
