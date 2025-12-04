"use client"

import { useState, useCallback, useEffect } from "react"
import { MOCK_PRODUCTS } from "@/lib/data/mock-data"

const STORAGE_KEY = "wms_inventory"

type Inventory = Record<string, number>

export function useInventory() {
  const [inventory, setInventory] = useState<Inventory>({})

  // Initialize inventory from localStorage or use defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setInventory(JSON.parse(stored))
      } else {
        // Initialize with mock data
        const initial: Inventory = {}
        MOCK_PRODUCTS.forEach((product) => {
          initial[product.id] = product.stock
        })
        setInventory(initial)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      }
    } catch (error) {
      console.error("Failed to load inventory:", error)
    }
  }, [])

  const addStock = useCallback((productId: string, quantity: number) => {
    setInventory((prev) => {
      const updated = {
        ...prev,
        [productId]: (prev[productId] || 0) + quantity,
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error("Failed to save inventory:", error)
      }
      return updated
    })
  }, [])

  const adjustStock = useCallback((productId: string, adjustment: number) => {
    setInventory((prev) => {
      const updated = {
        ...prev,
        [productId]: Math.max(0, (prev[productId] || 0) + adjustment),
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error("Failed to save inventory:", error)
      }
      return updated
    })
  }, [])

  return { inventory, addStock, adjustStock }
}
