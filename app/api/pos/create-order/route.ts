import { createClient } from "@/lib/db/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const {
      cashier_id,
      warehouse_id,
      items,
      subtotal,
      tax,
      discount,
      total,
      payment_method,
      payment_amount,
      change,
      notes,
    } = await request.json()

    if (!cashier_id || !warehouse_id || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Create sales order
    const { data: order, error: orderError } = await supabase
      .from("sales_orders")
      .insert([
        {
          cashier_id,
          warehouse_id,
          subtotal,
          tax,
          discount,
          total,
          payment_method,
          payment_amount,
          change,
          notes,
        },
      ])
      .select()

    if (orderError) throw orderError

    // Create sales order items
    const orderItems = items.map((item: any) => ({
      sales_order_id: order[0].id,
      product_id: item.product_id,
      qty: item.qty,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }))

    const { error: itemsError } = await supabase.from("sales_order_items").insert(orderItems)

    if (itemsError) throw itemsError

    // Update stock movements
    for (const item of items) {
      await supabase.from("stock_movements").insert([
        {
          product_id: item.product_id,
          warehouse_id,
          movement_type: "OUT",
          qty: item.qty,
          reference_id: order[0].id,
          description: `Sale order ${order[0].id}`,
        },
      ])

      // Update stock balance
      const { data: balance } = await supabase
        .from("stock_balances")
        .select("*")
        .eq("product_id", item.product_id)
        .eq("warehouse_id", warehouse_id)
        .single()

      if (balance) {
        await supabase
          .from("stock_balances")
          .update({ qty: balance.qty - item.qty })
          .eq("id", balance.id)
      }
    }

    return NextResponse.json({ data: order[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
