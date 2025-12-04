"use client"

import { useState } from "react"
import { Cashier } from "@/components/pos/cashier"
import { TransactionList } from "@/components/pos/transaction-list"
import { Button } from "@/components/ui/button"

type PosView = "cashier" | "transactions"

export function PosModule() {
  const [view, setView] = useState<PosView>("cashier")

  return (
    <div className="flex flex-col h-full">
      {/* Subnavigation */}
      <div className="border-b border-border p-4 flex gap-2">
        <Button onClick={() => setView("cashier")} variant={view === "cashier" ? "default" : "outline"} size="sm">
          Cashier
        </Button>
        <Button
          onClick={() => setView("transactions")}
          variant={view === "transactions" ? "default" : "outline"}
          size="sm"
        >
          Transaction List
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === "cashier" && <Cashier />}
        {view === "transactions" && <TransactionList />}
      </div>
    </div>
  )
}
