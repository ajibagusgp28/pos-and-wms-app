"use client"

import { useState, useCallback, useEffect } from "react"

interface Transaction {
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  tax: number
  total: number
  payment: number
  change: number
  timestamp: Date
}

const STORAGE_KEY = "pos_transactions"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setTransactions(
          parsed.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp),
          })),
        )
      }
    } catch (error) {
      console.error("Failed to load transactions:", error)
    }
  }, [])

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => {
      const updated = [...prev, transaction]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (error) {
        console.error("Failed to save transactions:", error)
      }
      return updated
    })
  }, [])

  return { transactions, addTransaction }
}
