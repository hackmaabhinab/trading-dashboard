import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, module, userId = "default_user_abhinav" } = body;

    let tradesHistory = body.tradesHistory;
    if (!tradesHistory) {
      const { data: dbTrades, error: dbError } = await db
        .from("trades")
        .select("*")
        .eq("userId", userId);

      if (!dbError && dbTrades) {
        tradesHistory = dbTrades;
      } else {
        tradesHistory = [];
      }
    }

    const apiKey = (
      process.env.GEMINI_API_KEY ||
      "AQ.Ab8RN6J5l1x1H5vu5pxNbMRcE_tjsUgu54rGEQOZLWettYhig"
    ).trim();

    // 1. Updated Prompt Condition (Supports both 'analytics' & 'journal')
    let systemPrompt = `You are VOLT AI, an Elite Forex & Trade Analytics AI Mentor.
RULES FOR RESPONSE:
- Be direct, concise, and professional (maximum 100-150 words).
- Focus on Win Rate, Risk:Reward (R:R), Trading Psychology, and Execution Discipline.
- Always analyze trades like a top institutional Forex trader.
- Do NOT write long non-trading generic essays or ask about personal life/relationships.
- Give maximum 3-4 key bullet points with direct actionable trading advice.
- Here is the user's trading journal history: ${JSON.stringify(tradesHistory)}`;

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

    // 2. Stable Gemini Endpoint Call
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Response Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Gemini API Call Failed" },
        { status: response.status }
      );
    }

    const aiReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, AI could not generate a response.";

    return NextResponse.json({ reply: aiReply, syncedWithDb: true });
  } catch (error: any) {
    console.error("AI Route Internal Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}