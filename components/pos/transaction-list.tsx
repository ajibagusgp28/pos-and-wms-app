"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransactions } from "@/lib/hooks/use-transactions"

export function TransactionList() {
  const { transactions } = useTransactions()

  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)
  const totalTransactions = transactions.length

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-3xl font-bold">{totalTransactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Average Transaction</p>
            <p className="text-3xl font-bold">
              ${totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : "0.00"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions yet</p>
          ) : (
            <div className="space-y-4">
              {[...transactions].reverse().map((transaction, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Transaction #{totalTransactions - idx}</p>
                      <p className="text-xs text-muted-foreground">{transaction.timestamp.toLocaleString()}</p>
                    </div>
                    <p className="text-lg font-bold">${transaction.total.toFixed(2)}</p>
                  </div>

                  <div className="bg-muted p-3 rounded-md space-y-1">
                    {transaction.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span>Subtotal: ${transaction.subtotal.toFixed(2)}</span>
                    <span>Tax: ${transaction.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Payment: ${transaction.payment.toFixed(2)}</span>
                    <span>Change: ${transaction.change.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
