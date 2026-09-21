import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    // 1. Cookies se current logged-in user retrieve karein
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Auth Verification Failed:", userError?.message);
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in to save trades." },
        { status: 401 }
      );
    }

    const body = await req.json();

    // 2. Insert payload using Service Role (or direct query) with verified user.id
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const payload = {
      user_id: user.id, // Verified from cookies!
      symbol: body.symbol ? body.symbol.toUpperCase() : "XAUUSD",
      trade_type: body.trade_type || "BUY",
      volume: Number(body.volume) || 0.1,
      open_price: body.open_price ? Number(body.open_price) : null,
      close_price: body.close_price ? Number(body.close_price) : null,
      profit: Number(body.profit) || 0,
      strategy: body.strategy || null,
      psychology: body.psychology || null,
      notes: body.notes || null,
      ticket_id: "MANUAL",
      created_at: body.created_at || new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("trades")
      .insert([payload])
      .select();

    if (error) {
      console.error("Database Insert Error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("API Exception:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}