import { NextResponse } from "next/server";

type TradeRecord = Record<string, unknown>;
type HistoryMessage = { role: "user" | "assistant"; content: string };
type AnalysisMode = "trade_review" | "risk_check" | "psychology_coach" | "performance_edge";

const ANALYSIS_MODES: AnalysisMode[] = [
  "trade_review",
  "risk_check",
  "psychology_coach",
  "performance_edge",
];

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toText(value: unknown, maxLength = 240): string | undefined {
  if (typeof value !== "string") return undefined;
  const text = value.trim().slice(0, maxLength);
  return text || undefined;
}

function groupedPerformance(trades: TradeRecord[], keyFor: (trade: TradeRecord) => string | undefined) {
  const groups = new Map<string, { trades: number; wins: number; losses: number; netPnl: number; pnlCount: number }>();

  for (const trade of trades) {
    const key = keyFor(trade);
    const pnl = toNumber(trade.profit);
    if (!key || pnl === null) continue;
    const group = groups.get(key) ?? { trades: 0, wins: 0, losses: 0, netPnl: 0, pnlCount: 0 };
    group.trades += 1;
    group.pnlCount += 1;
    group.netPnl += pnl;
    if (pnl > 0) group.wins += 1;
    if (pnl < 0) group.losses += 1;
    groups.set(key, group);
  }

  return [...groups.entries()]
    .map(([name, stats]) => ({
      name,
      ...stats,
      winRate: stats.pnlCount ? Number(((stats.wins / stats.pnlCount) * 100).toFixed(1)) : null,
      netPnl: Number(stats.netPnl.toFixed(2)),
    }))
    .sort((left, right) => Math.abs(right.netPnl) - Math.abs(left.netPnl))
    .slice(0, 8);
}

function compactTrade(trade: TradeRecord) {
  return {
    date: toText(trade.entry_at) ?? toText(trade.created_at),
    symbol: toText(trade.symbol, 40),
    direction: toText(trade.trade_type) ?? toText(trade.type) ?? toText(trade.side),
    profit: toNumber(trade.profit),
    volume: toNumber(trade.volume),
    strategy: toText(trade.strategy, 80),
    riskReward: toText(trade.risk_reward, 30),
    stopLoss: toNumber(trade.stop_loss),
    takeProfit: toNumber(trade.take_profit),
    entryPrice: toNumber(trade.open_price) ?? toNumber(trade.entry_price),
    exitPrice: toNumber(trade.close_price) ?? toNumber(trade.exit_price),
    psychology: toText(trade.psychology) ?? toText(trade.emotion),
    notes: toText(trade.notes, 360),
  };
}

function getAnalysisMode(value: unknown): AnalysisMode | undefined {
  return typeof value === "string" && ANALYSIS_MODES.includes(value as AnalysisMode)
    ? (value as AnalysisMode)
    : undefined;
}

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "VAULT AI is not configured on the website server. Add GROQ_API_KEY to the server environment." },
        { status: 503 },
      );
    }

    const body = (await req.json()) as {
      message?: unknown;
      module?: unknown;
      mode?: unknown;
      tradesHistory?: unknown;
      history?: unknown;
    };
    const message = toText(body.message, 2000);
    if (!message) return NextResponse.json({ error: "Enter a question for VAULT AI." }, { status: 400 });

    const trades = Array.isArray(body.tradesHistory)
      ? body.tradesHistory.filter((trade): trade is TradeRecord => typeof trade === "object" && trade !== null && !Array.isArray(trade))
      : [];
    if (trades.length === 0) {
      return NextResponse.json({ reply: "I don’t have any journal trades to review yet. Add trades to your journal, then ask me for a review or risk check." });
    }

    const recordedPnls = trades.map((trade) => toNumber(trade.profit)).filter((pnl): pnl is number => pnl !== null);
    const wins = recordedPnls.filter((pnl) => pnl > 0);
    const losses = recordedPnls.filter((pnl) => pnl < 0);
    const breakeven = recordedPnls.filter((pnl) => pnl === 0);
    const grossProfit = wins.reduce((total, pnl) => total + pnl, 0);
    const grossLoss = Math.abs(losses.reduce((total, pnl) => total + pnl, 0));
    const pnlCoverage = recordedPnls.length;
    const byPsychology = groupedPerformance(trades, (trade) => toText(trade.psychology) ?? toText(trade.emotion));
    const byStrategy = groupedPerformance(trades, (trade) => toText(trade.strategy, 80));
    const bySymbol = groupedPerformance(trades, (trade) => toText(trade.symbol, 40));
    const byDirection = groupedPerformance(trades, (trade) => toText(trade.trade_type) ?? toText(trade.type) ?? toText(trade.side));

    const datedTrades = [...trades].sort((left, right) => {
      const leftDate = Date.parse(String(left.entry_at ?? left.created_at ?? "")) || 0;
      const rightDate = Date.parse(String(right.entry_at ?? right.created_at ?? "")) || 0;
      return rightDate - leftDate;
    });
    const recentTrades = datedTrades.slice(0, 60).map(compactTrade);
    const journalCoverage = {
      stopLoss: trades.filter((trade) => toNumber(trade.stop_loss) !== null).length,
      takeProfit: trades.filter((trade) => toNumber(trade.take_profit) !== null).length,
      riskReward: trades.filter((trade) => Boolean(toText(trade.risk_reward, 30))).length,
      psychologyOrEmotion: trades.filter((trade) => Boolean(toText(trade.psychology) ?? toText(trade.emotion))).length,
      notes: trades.filter((trade) => Boolean(toText(trade.notes))).length,
    };
    const snapshot = {
      totalTrades: trades.length,
      tradesWithRecordedPnl: pnlCoverage,
      missingPnl: trades.length - pnlCoverage,
      wins: wins.length,
      losses: losses.length,
      breakeven: breakeven.length,
      winRatePercent: pnlCoverage ? Number(((wins.length / pnlCoverage) * 100).toFixed(1)) : null,
      netPnl: Number(recordedPnls.reduce((total, pnl) => total + pnl, 0).toFixed(2)),
      grossProfit: Number(grossProfit.toFixed(2)),
      grossLoss: Number(grossLoss.toFixed(2)),
      profitFactor: grossLoss > 0 ? Number((grossProfit / grossLoss).toFixed(2)) : null,
      averageWin: wins.length ? Number((grossProfit / wins.length).toFixed(2)) : null,
      averageLoss: losses.length ? Number((grossLoss / losses.length).toFixed(2)) : null,
      journalCoverage,
      byStrategy,
      bySymbol,
      byDirection,
      byPsychology,
      recentTrades,
    };

    const requestedMode = getAnalysisMode(body.mode);
    const history: HistoryMessage[] = Array.isArray(body.history)
      ? body.history
          .slice(-8)
          .filter((entry): entry is { role: string; content: string } => typeof entry === "object" && entry !== null && "role" in entry && "content" in entry && typeof entry.content === "string")
          .filter((entry) => (entry.role === "user" || entry.role === "assistant") && entry.content.trim())
          .map((entry) => ({ role: entry.role as "user" | "assistant", content: entry.content.slice(0, 1200) }))
      : [];

    const systemPrompt = `You are VAULT AI, the user's trading-journal coach inside the Analytics chat. Use the supplied journal snapshot and trade records as the source of truth.

Choose the requested mode ${requestedMode ? `(${requestedMode})` : "from the user's latest message"}:
- trade_review: review logged trades, execution, setup and outcome.
- risk_check: assess only risk information actually recorded; identify missing controls and what the journal cannot verify.
- psychology_coach: look for patterns in explicitly logged psychology/emotion tags and notes. Do not diagnose or guess a mental state from P&L alone.
- performance_edge: compare the supplied strategy, symbol, direction, and psychology aggregates.
- If the user asks for general help or a follow-up, answer naturally using the same full journal context.

Accuracy rules:
- The snapshot aggregates the entire supplied journal. Recent trade records are a 60-trade detail sample; do not claim those 60 are the entire history when totalTrades is higher.
- Only state numbers present in the snapshot or directly calculable from the supplied trade records. P&L uses the user's account currency, which is not provided; do not add a currency symbol.
- If a field is missing, say it is not recorded. Never invent stop-loss discipline, position risk percent, account exposure, risk-to-reward, adverse-move loss, or cause of a drawdown. Realized P&L alone cannot establish those values.
- Do not make buy/sell calls, price targets, guarantees, or present a small sample as a reliable edge. With fewer than 10 trades, label pattern conclusions as preliminary.
- When the data is insufficient, still help: explain what is verifiable and ask for only the specific journal fields needed to go further.

Formatting rules:
- Reply in the language used by the user (including Hindi/Hinglish when used).
- Use concise Markdown headings and bullet points. No tables, pipe-delimited rows, HTML, or <br> tags.
- Start with a clear one-line takeaway, then use only the sections that fit the question. Keep the answer focused and practical.

FULL JOURNAL SNAPSHOT (aggregated across the supplied history):
${JSON.stringify(snapshot)}`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message },
        ],
      }),
    });

    const groqResult = await groqResponse.json().catch(() => null) as {
      choices?: Array<{ message?: { content?: string | null } }>;
      error?: { message?: string };
    } | null;
    if (!groqResponse.ok) {
      throw new Error(`Groq API HTTP ${groqResponse.status}: ${groqResult?.error?.message || "The AI provider rejected the request."}`);
    }
    const reply = groqResult?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error("Groq API returned an empty response.");
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("VAULT AI Error:", error);
    const providerMessage = error instanceof Error ? error.message : "Unknown AI provider error";
    const safeDetails = providerMessage
      .replace(/gsk_[\w-]{20,}/g, "[redacted API key]")
      .replace(/AIza[\w-]{20,}/g, "[redacted API key]")
      .replace(/https?:\/\/[^\s"']+/g, "[provider URL]")
      .slice(0, 400);
    return NextResponse.json(
      { error: "VAULT AI could not generate a response.", details: safeDetails },
      { status: 500 },
    );
  }
}
