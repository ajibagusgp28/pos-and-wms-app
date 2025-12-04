"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, Plus } from "lucide-react"
import { useTransactions } from "@/lib/hooks/use-transactions"
import { MOCK_PRODUCTS } from "@/lib/data/mock-data"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export function Cashier() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentAmount, setPaymentAmount] = useState("")
  const { addTransaction } = useTransactions()

  const addToCart = useCallback((productId: string) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId)
    if (!product) return

    setCart((prev) => {
      const existing = prev.find((item) => item.id === productId)
      if (existing) {
        return prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        },
      ]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId)
        return
      }
      setCart((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
    },
    [removeFromCart],
  )

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleCheckout = useCallback(() => {
    if (cart.length === 0 || !paymentAmount) return

    const payment = Number.parseFloat(paymentAmount)
    if (payment < total) {
      alert("Payment amount is insufficient")
      return
    }

    addTransaction({
      items: cart,
      subtotal,
      tax,
      total,
      payment,
      change: payment - total,
      timestamp: new Date(),
    })

    // Reset
    setCart([])
    setPaymentAmount("")
    alert("Transaction completed successfully!")
  }, [cart, paymentAmount, subtotal, tax, total, addTransaction])

  return (
    <div className="flex h-full gap-6 p-6">
      {/* Products Grid */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addToCart(product.id)}
            >
              <CardContent className="p-4 text-center">
                <p className="font-semibold truncate">{product.name}</p>
                <p className="text-lg font-bold text-primary mt-2">${product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart and Payment */}
      <div className="w-96 flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Cart is empty</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-2 p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        −
                      </Button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => removeFromCart(item.id)} className="ml-1">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-lg">${total.toFixed(2)}</span>
            </div>

            <Input
              type="number"
              placeholder="Payment Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="mt-4"
            />

            {paymentAmount && (
              <div className="pt-2 border-t border-border">
                <div className="flex justify-between text-sm mb-3">
                  <span>Change:</span>
                  <span className="font-semibold">
                    ${Math.max(0, Number.parseFloat(paymentAmount) - total).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            <Button onClick={handleCheckout} disabled={cart.length === 0 || !paymentAmount} className="w-full mt-4">
              Complete Sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
