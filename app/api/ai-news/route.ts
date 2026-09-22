import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt: userQuery } = await req.json();

    // Exact variable name match with fetch header
    const apiKey =
      process.env.GROQ_API_KEY ||
      "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";

    const valtSystemPrompt = `You are VALT - a professional Forex/Trading Market Analyst with 15+ years institutional experience.

YOUR EXPERTISE:
- USD strength/weakness analysis
- Macro economic impact assessment
- Risk-reward evaluation for forex pairs
- Real-time news sentiment analysis
- Trading opportunity identification (SMC/ICT concepts)

ANALYZE THE FOLLOWING NEWS, EVENT, OR USER QUERY:
"${userQuery}"

RESPONSE FORMAT (CRITICAL - follow exactly):

## 📊 MARKET SENTIMENT & USD BIAS
[1 sentence: Is the market Bullish USD / Bearish USD / Mixed? Why?]

## 🎯 IMMEDIATE IMPACT ON MAJOR PAIRS
[For each HIGH impact news item / pair analyzed:
- EVENT NAME / PAIR → USD/JPY impact direction & magnitude
- EVENT NAME / PAIR → EUR/USD impact direction & magnitude
- Other critical pairs affected (Gold XAUUSD, BTCUSD, AUD/USD, USD/CHF, etc.)]

## 💡 TRADING SETUPS (Next 24-48 Hours)
[3-4 specific, actionable trade ideas:
1. PAIR (e.g., USD/JPY, XAUUSD): Entry Logic → Take Profit → Stop Loss
2. Next setup...
Include: Why this setup works, what catalyst, risk level]

## ⚠️ CRITICAL RISKS
[Top 3 specific risks traders should watch:
1. Risk description + impact if it happens
2. Next risk...
3. How to hedge]

## 📈 BEST TRADING HOURS (IST)
[When should traders be active in Indian Standard Time (IST)? Why? Session overlap impact?]

## 🔔 TRADER ACTION PLAN - RIGHT NOW
[Immediate steps:
- If long USD: Do X
- If short USD: Do Y
- If neutral: Wait for Z signal before entering]

## 📊 DATA SUMMARY
- Total HIGH impact events: [count]
- USD bias strength: [Strong/Moderate/Weak]
- Expected volatility level: [High/Medium/Low]
- Confidence in analysis: [High/Medium/Low]

TONE: Professional, direct, actionable.
LANGUAGE: Clean, professional English with technical precision.`;

    const groqModels = [
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "openai/gpt-oss-20b"
    ];

    let lastError = "";

    for (const model of groqModels) {
      try {
        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model,
              messages: [
                { role: "system", content: valtSystemPrompt },
                { role: "user", content: userQuery },
              ],
              temperature: 0.5,
              max_tokens: 2000,
            }),
          }
        );

        const data = await response.json();

         if (response.ok && data.choices?.[0]?.message?.content) {
  // Saare stars (*), hashtags (#), aur <br> tags ko saaf karke clean text bhejne ke liye:
  const cleanReply = data.choices[0].message.content
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#{1,6}\s?/g, "")
    .replace(/<br\s*\/?>/gi, "\n");

  return NextResponse.json({
    reply: cleanReply,
  });
}

        lastError = data.error?.message || `Model ${model} failed`;
      } catch (err: any) {
        lastError = err?.message || "Fetch failed";
      }
    }

    return NextResponse.json({
      reply: `⚠️ Groq Error: ${lastError}`,
    });
  } catch (error: any) {
    return NextResponse.json({
      reply: `⚠️ Server Error: ${error?.message || "Failed to process request"}`,
    });
  }
}