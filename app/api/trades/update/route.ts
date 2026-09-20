import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Client Config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, strategy, emotion, notes, chart_url } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Trade ID is required" },
        { status: 400 }
      );
    }

    // Supabase DB Update
    const { data, error } = await supabase
      .from("trades")
      .update({
        strategy,
        emotion,
        notes,
        chart_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase Update Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: "Trade journal updated successfully!", trade: data[0] },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}