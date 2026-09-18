import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, module, tradesHistory } = await req.json();

    const apiKey = (
      process.env.GEMINI_API_KEY ||
      "AQ.Ab8RN6J5l1x1H5vu5pxNbMRcE_tjsUgu54rGEQOZLWettYhig"
    ).trim();

    // 1. Strict Short & Concise System Prompt
    let systemPrompt = "";
    if (module === "analytics") {
      systemPrompt = `You are an Elite Forex & Trade Analytics AI Mentor.
RULES FOR RESPONSE:
- Keep the response VERY CONCISE and crisp (maximum 150-200 words).
- Do NOT write long essays or huge introductions.
- Give maximum 3-4 key bullet points with direct actionable advice.
- Analyze the user's trades concisely: ${JSON.stringify(tradesHistory)}`;
    } else if (module === "psychology") {
      systemPrompt = `You are a Trading Psychology Specialist (Mark Douglas mindset). Keep response short, crisp, under 150 words. Focus on discipline & emotions. Trader Data: ${JSON.stringify(tradesHistory)}`;
    } else if (module === "fundamentals") {
      systemPrompt = `You are a Forex Fundamental Specialist. Keep answer concise and direct under 150 words. Explain NFP, CPI, and XAUUSD dynamics.`;
    }

    const fullPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

    // 2. Stable Gemini Endpoint Call
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

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

    return NextResponse.json({ reply: aiReply });
  } catch (error: any) {
    console.error("AI Route Internal Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}