import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Server-side Supabase for Caching (Admin access needed for edge routes usually, 
// or pass user token from frontend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "VAULT AI is not configured on the website server. Add GROQ_API_KEY to the server environment." },
        { status: 503 }
      );
    }

    const { message, module, tradesHistory, userId } = await req.json();

    if (!tradesHistory || tradesHistory.length === 0) {
      return NextResponse.json({ 
        reply: "No trades found. Please log some trades in your journal first before requesting AI analysis." 
      });
    }

    const currentTradeCount = tradesHistory.length;
    const today = new Date().toISOString().split("T")[0];

    // ==========================================
    // 1. CACHING MECHANISM (Efficient Token Usage)
    // ==========================================
    if (userId && module === "analytics") {
      const { data: cached } = await supabase
        .from("ai_analysis")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .single();

      // Agar aaj ka cache exist karta hai aur trade count same hai, toh direct return karo
      if (cached && cached.trade_count === currentTradeCount) {
        return NextResponse.json({ reply: cached.analysis });
      }
    }

    // ==========================================
    // 2. DATA PROCESSING (For AI Context)
    // ==========================================
    const winningTrades = tradesHistory.filter((t: any) => Number(t.profit) > 0);
    const losingTrades = tradesHistory.filter((t: any) => Number(t.profit) <= 0);
    const totalProfit = winningTrades.reduce((acc: number, t: any) => acc + Number(t.profit), 0);
    const totalLoss = losingTrades.reduce((acc: number, t: any) => acc + Math.abs(Number(t.profit)), 0);
    
    const winRate = ((winningTrades.length / currentTradeCount) * 100).toFixed(1);
    const avgProfit = winningTrades.length > 0 ? (totalProfit / winningTrades.length).toFixed(2) : 0;
    const avgLoss = losingTrades.length > 0 ? (totalLoss / losingTrades.length).toFixed(2) : 0;

    // Filter last 30 trades to keep token usage low
    const recentTrades = tradesHistory.slice(0, 30).map((t: any) => ({
      symbol: t.symbol,
      type: t.type || t.side,
      profit: t.profit,
      notes: t.notes || "",
      date: t.created_at || t.entry_at
    }));

    // ==========================================
    // 3. AI PROMPT ENGINEERING (Analysis Types)
    // ==========================================
    const systemPrompt = `
      You are VAULT AI, an elite institutional trading coach. The user is asking: "${message}"
      
      User's Overall Performance:
      - Total Trades: ${currentTradeCount}
      - Win Rate: ${winRate}%
      - Avg Profit: $${avgProfit} | Avg Loss: $${avgLoss}
      
      Recent Trades Context:
      ${JSON.stringify(recentTrades)}

      Based on the user's prompt, provide a highly actionable, data-backed response. 
      Format the response using clean Markdown with emojis. Choose the most relevant framework from below based on the query:

      1. PERFORMANCE ANALYSIS: Highlight strengths, worst performing assets/strategies, and win rate.
      2. RISK ANALYSIS: Compare Avg Loss vs Avg Profit, highlight R:R ratios, and give strict action steps.
      3. PSYCHOLOGY/EMOTION: Identify tilt, revenge trading patterns (e.g., losses leading to more losses), or overtrading.
      4. STRATEGY-WISE: Break down which setups (SMC, ICT, Order Blocks, etc.) are working and which are draining the account.
      5. TIME-BASED: Analyze which time sessions yield the best results.

      Structure the response clearly. Do not use generic greetings. Be direct, authoritative, and helpful. Use headings, bullet points, and highlight critical warnings.
    `;

    // ==========================================
    // 4. GENERATE CONTENT
    // ==========================================
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "system", content: systemPrompt }],
      }),
    });
    const groqResult = await groqResponse.json().catch(() => null) as {
      choices?: Array<{ message?: { content?: string | null } }>;
      error?: { message?: string };
    } | null;
    if (!groqResponse.ok) {
      throw new Error(`Groq API HTTP ${groqResponse.status}: ${groqResult?.error?.message || "The AI provider rejected the request."}`);
    }
    const text = groqResult?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Groq API returned an empty response.");

    // ==========================================
    // 5. UPDATE CACHE IN DB (If userId is available)
    // ==========================================
    if (userId) {
      await supabase.from("ai_analysis").upsert(
        {
          user_id: userId,
          date: today,
          trade_count: currentTradeCount,
          analysis: text,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id, date' }
      );
    }

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("VAULT AI Error:", error);
    const providerMessage = error instanceof Error ? error.message : "Unknown AI provider error";
    const safeDetails = providerMessage
      .replace(/AIza[\w-]{20,}/g, "[redacted API key]")
      .replace(/(x-goog-api-key\s*[:=]\s*)[^\s,;]+/gi, "$1[redacted]")
      .replace(/https?:\/\/[^\s"']+/g, "[provider URL]")
      .slice(0, 400);
    return NextResponse.json(
      {
        error: "VAULT AI could not generate a response.",
        details: safeDetails,
      },
      { status: 500 }
    );
  }
}
