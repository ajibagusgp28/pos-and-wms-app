import { createClient } from "@/lib/db/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { product_id, warehouse_id, qty, cost_price, description } = await request.json()

    if (!product_id || !warehouse_id || !qty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Create movement record
    const { data: movement, error: movementError } = await supabase
      .from("stock_movements")
      .insert([
        {
          product_id,
          warehouse_id,
          movement_type: "IN",
          qty,
          description,
        },
      ])
      .select()

    if (movementError) throw movementError

    // Update stock balance
    const { data: balance } = await supabase
      .from("stock_balances")
      .select("*")
      .eq("product_id", product_id)
      .eq("warehouse_id", warehouse_id)
      .single()

    if (balance) {
      await supabase
        .from("stock_balances")
        .update({ qty: balance.qty + qty })
        .eq("id", balance.id)
    } else {
      await supabase.from("stock_balances").insert([
        {
          product_id,
          warehouse_id,
          qty,
        },
      ])
    }

    return NextResponse.json({ data: movement[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to record stock in" }, { status: 500 })
  }
}
