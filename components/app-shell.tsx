"use client"

import { useState } from "react"
import { PosModule } from "@/components/pos/pos-module"
import { WmsModule } from "@/components/wms/wms-module"
import { Button } from "@/components/ui/button"

type Module = "pos" | "wms"

export function AppShell() {
  const [activeModule, setActiveModule] = useState<Module>("pos")

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Navigation Sidebar */}
      <div className="w-64 bg-card border-r border-border p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">POS & WMS</h1>
        <div className="flex flex-col gap-2">
          <Button
            onClick={() => setActiveModule("pos")}
            variant={activeModule === "pos" ? "default" : "outline"}
            className="justify-start"
          >
            Point of Sale
          </Button>
          <Button
            onClick={() => setActiveModule("wms")}
            variant={activeModule === "wms" ? "default" : "outline"}
            className="justify-start"
          >
            Warehouse Management
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeModule === "pos" && <PosModule />}
        {activeModule === "wms" && <WmsModule />}
      </div>
    </div>
  )
}
