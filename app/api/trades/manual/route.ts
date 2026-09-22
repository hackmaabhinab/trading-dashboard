import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const {
      symbol,
      trade_type,
      volume,
      open_price,
      close_price,
      stop_loss,
      take_profit,
      risk_reward,
      profit,
      strategy,
      psychology,
      is_learning_trade,
      notes,
      entry_at,
      exit_at,
    } = body;

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.from("trades").insert([
      {
        user_id: user?.id || null,
        symbol,
        trade_type,
        volume,
        open_price: open_price ? Number(open_price) : null,
        close_price: close_price ? Number(close_price) : null,
        stop_loss: stop_loss ? Number(stop_loss) : null,
        take_profit: take_profit ? Number(take_profit) : null,
        risk_reward,
        profit: Number(profit),
        strategy,
        psychology,
        is_learning_trade: Boolean(is_learning_trade),
        notes,
        entry_at,
        exit_at,
      },
    ]).select();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}