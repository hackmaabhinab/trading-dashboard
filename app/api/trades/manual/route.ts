import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role key allows admin API execution bypass
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      user_id,
      symbol,
      trade_type,
      volume,
      open_price,
      close_price,
      profit,
      strategy,
      psychology,
      notes,
      created_at,
    } = body;

    const payload: Record<string, any> = {
      symbol: symbol ? symbol.toUpperCase() : "XAUUSD",
      trade_type: trade_type || "BUY",
      volume: Number(volume) || 0.1,
      open_price: open_price ? Number(open_price) : null,
      close_price: close_price ? Number(close_price) : null,
      profit: Number(profit) || 0,
      strategy: strategy || null,
      psychology: psychology || null,
      notes: notes || null,
      ticket_id: "MANUAL",
      created_at: created_at || new Date().toISOString(),
    };

    if (user_id) {
      payload.user_id = user_id;
    }

    const { data, error } = await supabaseAdmin
      .from("trades")
      .insert([payload])
      .select();

    if (error) {
      console.error("Supabase Execution Error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Server API Exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}