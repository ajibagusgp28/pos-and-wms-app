"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface PaymentModalProps {
  total: number
  onClose: () => void
  onConfirm: (method: string, amount: number) => void
}

export function PaymentModal({ total, onClose, onConfirm }: PaymentModalProps) {
  const [method, setMethod] = useState("cash")
  const [amount, setAmount] = useState(total.toString())
  const [loading, setLoading] = useState(false)

  const change = Number.parseInt(amount) - total

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm(method, Number.parseInt(amount))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-card-foreground">Payment</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-foreground">IDR {total.toLocaleString("id-ID")}</p>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Payment Method</label>
          <div className="space-y-2">
            {[
              { id: "cash", name: "Cash" },
              { id: "qris", name: "QRIS / E-Wallet" },
              { id: "bank_transfer", name: "Bank Transfer" },
            ].map((pm) => (
              <label
                key={pm.id}
                className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted"
              >
                <input
                  type="radio"
                  name="method"
                  value={pm.id}
                  checked={method === pm.id}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-foreground">{pm.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Amount */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Payment Amount</label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" min={total} />
          {change >= 0 && <p className="text-sm text-accent mt-2">Change: IDR {change.toLocaleString("id-ID")}</p>}
          {change < 0 && <p className="text-sm text-destructive mt-2">Insufficient payment</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading || change < 0} className="flex-1">
            {loading ? "Processing..." : "Complete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
