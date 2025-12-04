import { createClient } from "@/lib/db/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const warehouse_id = searchParams.get("warehouse_id")

    let query = supabase.from("stock_balances").select("*, product:product_id(*)")

    if (warehouse_id) {
      query = query.eq("warehouse_id", warehouse_id)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory summary" }, { status: 500 })
  }
}
