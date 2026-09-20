import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { secret, ticket_id, symbol, trade_type, volume, open_price, close_price, profit, user_id } = body;

    // 1. Secret Token Security Check
    if (secret !== "VALT_MT5_7839X") {
      return NextResponse.json({ error: "Unauthorized Secret Token" }, { status: 401 });
    }

    if (!ticket_id || !symbol) {
      return NextResponse.json({ error: "Missing required trade fields" }, { status: 400 });
    }

    // 2. Fallback Target User Fetch
    let targetUserId = user_id;

    if (!targetUserId) {
      const { data: existingTrade } = await supabase
        .from("trades")
        .select("user_id")
        .limit(1);
        
      targetUserId = existingTrade?.[0]?.user_id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "No target user ID found in system" }, { status: 400 });
    }

    // 3. Upsert Trade Record
    const payload = {
      ticket_id: String(ticket_id),
      symbol: String(symbol),
      trade_type: String(trade_type),
      volume: parseFloat(volume),
      open_price: parseFloat(open_price),
      close_price: close_price ? parseFloat(close_price) : null,
      profit: profit ? parseFloat(profit) : 0,
      open_time: new Date().toISOString(),
      user_id: targetUserId
    };

    const { data, error } = await supabase
      .from("trades")
      .upsert(payload, { onConflict: "ticket_id" })
      .select();

    if (error) {
      console.error("Supabase Sync Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Trade synced successfully!", trade: data }, { status: 200 });

  } catch (err: any) {
    console.error("API Exception:", err.message);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}