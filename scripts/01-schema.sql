-- Create all necessary tables for the POS and WMS system

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'cashier', -- super_admin, manager, cashier, warehouse_staff
  warehouse_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Warehouses table
CREATE TABLE IF NOT EXISTS public.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_name TEXT NOT NULL,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  cost_price DECIMAL(12, 2),
  selling_price DECIMAL(12, 2) NOT NULL,
  barcode TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stock movements table
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  movement_type TEXT NOT NULL, -- IN, OUT, TRANSFER, ADJUST
  qty DECIMAL(12, 2) NOT NULL,
  reference_id TEXT, -- sales_order_id, purchase_order_id, etc.
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stock balances (materialized view table)
CREATE TABLE IF NOT EXISTS public.stock_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  qty DECIMAL(12, 2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, warehouse_id)
);

-- Sales orders table
CREATE TABLE IF NOT EXISTS public.sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  cashier_id UUID NOT NULL REFERENCES users(id),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id),
  subtotal DECIMAL(12, 2),
  tax DECIMAL(12, 2),
  discount DECIMAL(12, 2) DEFAULT 0,
  total DECIMAL(12, 2),
  payment_method TEXT, -- cash, qris, bank_transfer
  payment_amount DECIMAL(12, 2),
  change DECIMAL(12, 2),
  notes TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sales order items table
CREATE TABLE IF NOT EXISTS public.sales_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_order_id UUID NOT NULL REFERENCES sales_orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  qty DECIMAL(12, 2) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  total_price DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT DEFAULT 'My Store',
  address TEXT,
  tax_rate DECIMAL(5, 2) DEFAULT 10,
  currency TEXT DEFAULT 'IDR',
  rounding_option TEXT DEFAULT 'nearest', -- nearest, up, down
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX idx_stock_movements_warehouse ON public.stock_movements(warehouse_id);
CREATE INDEX idx_stock_movements_created_at ON public.stock_movements(created_at);
CREATE INDEX idx_sales_orders_cashier ON public.sales_orders(cashier_id);
CREATE INDEX idx_sales_orders_created_at ON public.sales_orders(created_at);
CREATE INDEX idx_sales_order_items_sales_order ON public.sales_order_items(sales_order_id);
CREATE INDEX idx_stock_balances_product ON public.stock_balances(product_id);
