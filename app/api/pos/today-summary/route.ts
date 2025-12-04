import { createClient } from "@/lib/db/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split("T")[0]

    // Get today's orders
    const { data: orders, error: ordersError } = await supabase
      .from("sales_orders")
      .select("*")
      .gte("created_at", `${today}T00:00:00`)
      .lt("created_at", `${today}T23:59:59`)

    if (ordersError) throw ordersError

    const totalSales = orders.reduce((sum: number, order: any) => sum + order.total, 0)
    const totalQuantity = orders.reduce((sum: number, order: any) => sum + (order.items?.length || 1), 0)

    return NextResponse.json({
      data: {
        total_sales: totalSales,
        total_transactions: orders.length,
        total_quantity: totalQuantity,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 })
  }
}
