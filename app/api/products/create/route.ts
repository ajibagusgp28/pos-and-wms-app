import { createClient } from "@/lib/db/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { sku, name, category, cost_price, selling_price, barcode } = await request.json()

    if (!sku || !name || !selling_price) {
      return NextResponse.json({ error: "SKU, name, and selling_price are required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          sku,
          name,
          category,
          cost_price,
          selling_price,
          barcode,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ data: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
