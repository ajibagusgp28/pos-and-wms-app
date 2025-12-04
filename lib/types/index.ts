export type UserRole = "super_admin" | "manager" | "cashier" | "warehouse_staff"

export interface User {
  id: string
  email: string
  role: UserRole
  warehouse_id?: string
  created_at: string
  updated_at: string
}

export interface Warehouse {
  id: string
  warehouse_name: string
  location?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  category?: string
  cost_price?: number
  selling_price: number
  barcode?: string
  created_at: string
  updated_at: string
}

export interface StockMovement {
  id: string
  created_at: string
  product_id: string
  warehouse_id: string
  movement_type: "IN" | "OUT" | "TRANSFER" | "ADJUST"
  qty: number
  reference_id?: string
  description?: string
  product?: Product
  warehouse?: Warehouse
}

export interface StockBalance {
  id: string
  product_id: string
  warehouse_id: string
  qty: number
  updated_at: string
  product?: Product
}

export interface SalesOrder {
  id: string
  created_at: string
  cashier_id: string
  warehouse_id: string
  subtotal: number
  tax: number
  discount: number
  total: number
  payment_method: "cash" | "qris" | "bank_transfer"
  payment_amount: number
  change: number
  notes?: string
  items?: SalesOrderItem[]
}

export interface SalesOrderItem {
  id: string
  sales_order_id: string
  product_id: string
  qty: number
  unit_price: number
  total_price: number
  created_at: string
  product?: Product
}

export interface StoreSettings {
  id: string
  store_name: string
  address?: string
  tax_rate: number
  currency: string
  rounding_option: "nearest" | "up" | "down"
  created_at: string
  updated_at: string
}

export interface CartItem {
  product_id: string
  product_name: string
  sku: string
  qty: number
  unit_price: number
  total_price: number
}
