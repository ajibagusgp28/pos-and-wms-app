"use client"

import { useState } from "react"
import { StockIn } from "@/components/wms/stock-in"
import { StockAdjustment } from "@/components/wms/stock-adjustment"
import { StockSummary } from "@/components/wms/stock-summary"
import { Button } from "@/components/ui/button"

type WmsView = "summary" | "stock-in" | "adjustment"

export function WmsModule() {
  const [view, setView] = useState<WmsView>("summary")

  return (
    <div className="flex flex-col h-full">
      {/* Subnavigation */}
      <div className="border-b border-border p-4 flex gap-2">
        <Button onClick={() => setView("summary")} variant={view === "summary" ? "default" : "outline"} size="sm">
          Stock Summary
        </Button>
        <Button onClick={() => setView("stock-in")} variant={view === "stock-in" ? "default" : "outline"} size="sm">
          Stock In
        </Button>
        <Button onClick={() => setView("adjustment")} variant={view === "adjustment" ? "default" : "outline"} size="sm">
          Stock Adjustment
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === "summary" && <StockSummary />}
        {view === "stock-in" && <StockIn />}
        {view === "adjustment" && <StockAdjustment />}
      </div>
    </div>
  )
}
