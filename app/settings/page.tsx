"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"

interface StoreSettings {
  store_name: string
  address: string
  tax_rate: number
  currency: string
  rounding_option: "nearest" | "up" | "down"
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "My Store",
    address: "",
    tax_rate: 10,
    currency: "IDR",
    rounding_option: "nearest",
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: name === "tax_rate" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // In a real app, this would save to the database
      await new Promise((resolve) => setTimeout(resolve, 500))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your store configuration</p>
          </div>

          {saved && (
            <div className="mb-6 bg-green-500/10 border border-green-600/30 rounded-lg p-4">
              <p className="text-sm font-medium text-green-700">Settings saved successfully!</p>
            </div>
          )}

          <div className="grid gap-8 max-w-2xl">
            {/* Store Information */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-6">Store Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Store Name</label>
                  <Input
                    name="store_name"
                    value={settings.store_name}
                    onChange={handleChange}
                    placeholder="e.g., My Retail Store"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, City, Country"
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Tax Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-6">Tax Configuration</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tax Rate (%)</label>
                    <Input
                      name="tax_rate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={settings.tax_rate}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
                    <Input
                      name="currency"
                      value={settings.currency}
                      onChange={handleChange}
                      placeholder="e.g., IDR, USD"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Rounding Option</label>
                  <select
                    name="rounding_option"
                    value={settings.rounding_option}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="nearest">Round to nearest</option>
                    <option value="up">Always round up</option>
                    <option value="down">Always round down</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Warehouse Settings */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-6">Warehouse Management</h2>
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-3">Available Warehouses</h3>
                  <div className="space-y-2">
                    {["Main Warehouse", "Branch A", "Branch B"].map((warehouse, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 bg-card rounded border border-border"
                      >
                        <span className="text-sm text-foreground">{warehouse}</span>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Add New Warehouse
                </Button>
              </div>
            </div>

            {/* User Roles & Permissions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h2 className="text-lg font-semibold text-card-foreground mb-6">User Roles & Permissions</h2>
              <div className="space-y-3">
                {[
                  { role: "Super Admin", perms: "Full access to all features" },
                  { role: "Store Manager", perms: "View analytics, manage products, view inventory" },
                  { role: "Cashier", perms: "POS operations, view daily summary" },
                  { role: "Warehouse Staff", perms: "Stock in/out, transfers, inventory" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.role}</p>
                      <p className="text-sm text-muted-foreground">{item.perms}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={loading} size="lg" className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
