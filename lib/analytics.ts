export interface Trade {
  id?: string;
  ticket_id?: string;
  symbol: string;
  trade_type: string; // 'BUY' | 'SELL'
  volume: string | number;
  open_price?: string | number;
  close_price?: string | number;
  profit: string | number;
  strategy?: string;
  psychology?: string;
  created_at: string;
}

export function calculateOverviewMetrics(trades: Trade[]) {
  const parsedTrades = trades.map((t) => ({
    ...t,
    pnl: parseFloat(String(t.profit)) || 0,
    vol: parseFloat(String(t.volume)) || 0,
    date: new Date(t.created_at),
  }));

  const totalTrades = parsedTrades.length;
  if (totalTrades === 0) {
    return {
      netPnl: 0,
      grossProfit: 0,
      grossLoss: 0,
      winRate: 0,
      profitFactor: 0,
      avgPnl: 0,
      totalVolume: 0,
      winsCount: 0,
      lossesCount: 0,
      riskHealthScore: 100,
      accountPerformanceChart: [],
      monthlyCalendar: {},
      hourlyPerformance: Array(24).fill(0),
      weeklyPerformance: Array(7).fill(0),
      strategyPerformance: {} as Record<string, number>,
      monthlySummary: {} as Record<string, number>,
      valtAiInsight: "Log trades in your Journal to activate VALT AI Real-Time Behavioral Analysis.",
    };
  }

  let netPnl = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let winsCount = 0;
  let lossesCount = 0;
  let totalVolume = 0;

  const monthlyCalendar: Record<string, number> = {};
  const hourlyPerformance = Array(24).fill(0);
  const weeklyPerformance = Array(7).fill(0); // 0=Sun, 1=Mon...
  const strategyPerformance: Record<string, number> = {};
  const monthlySummary: Record<string, number> = {};

  // Sort trades by date ascending
  parsedTrades.sort((a, b) => a.date.getTime() - b.date.getTime());

  let runningBalance = 0;
  const accountPerformanceChart: { time: string; pnl: number }[] = [];

  parsedTrades.forEach((t) => {
    const pnl = t.pnl;
    netPnl += pnl;
    runningBalance += pnl;
    totalVolume += t.vol;

    if (pnl > 0) {
      grossProfit += pnl;
      winsCount++;
    } else if (pnl < 0) {
      grossLoss += Math.abs(pnl);
      lossesCount++;
    }

    // Performance Chart Point
    accountPerformanceChart.push({
      time: t.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      pnl: parseFloat(runningBalance.toFixed(2)),
    });

    // Calendar key: YYYY-MM-DD
    const dateKey = t.date.toISOString().split("T")[0];
    monthlyCalendar[dateKey] = (monthlyCalendar[dateKey] || 0) + pnl;

    // Hourly Breakdown
    const hour = t.date.getHours();
    hourlyPerformance[hour] += pnl;

    // Weekly Breakdown
    const day = t.date.getDay();
    weeklyPerformance[day] += pnl;

    // Strategy Breakdown
    const strat = t.strategy || "Unassigned";
    strategyPerformance[strat] = (strategyPerformance[strat] || 0) + pnl;

    // Monthly Breakdown
    const monthKey = t.date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    monthlySummary[monthKey] = (monthlySummary[monthKey] || 0) + pnl;
  });

  const winRate = totalTrades > 0 ? (winsCount / totalTrades) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99.9 : 0;
  const avgPnl = totalTrades > 0 ? netPnl / totalTrades : 0;

  // Dynamic Risk Health Engine
  let riskHealthScore = 100;
  if (winRate < 40) riskHealthScore -= 20;
  if (profitFactor < 1.2) riskHealthScore -= 25;
  if (grossLoss > grossProfit) riskHealthScore -= 30;
  if (riskHealthScore < 10) riskHealthScore = 15;

  // Dynamic VALT AI Behavioral Insight
  let valtAiInsight = "";
  if (profitFactor >= 2.0 && winRate >= 50) {
    valtAiInsight = `Excellent execution! Your Win Rate is ${winRate.toFixed(1)}% with a strong Profit Factor of ${profitFactor.toFixed(2)}. Your edge is robust.`;
  } else if (netPnl < 0) {
    valtAiInsight = `Caution advised. Net PnL is in drawdown ($${netPnl.toFixed(2)}). Review trade sizing and stick closely to your strategy parameters.`;
  } else {
    valtAiInsight = `Steady performance. Win Rate sits at ${winRate.toFixed(1)}%. Focus on eliminating low-probability trades to improve Profit Factor (${profitFactor.toFixed(2)}).`;
  }

  return {
    netPnl: parseFloat(netPnl.toFixed(2)),
    grossProfit: parseFloat(grossProfit.toFixed(2)),
    grossLoss: parseFloat(grossLoss.toFixed(2)),
    winRate: parseFloat(winRate.toFixed(1)),
    profitFactor: parseFloat(profitFactor.toFixed(2)),
    avgPnl: parseFloat(avgPnl.toFixed(2)),
    totalVolume: parseFloat(totalVolume.toFixed(2)),
    winsCount,
    lossesCount,
    riskHealthScore,
    accountPerformanceChart,
    monthlyCalendar,
    hourlyPerformance,
    weeklyPerformance,
    strategyPerformance,
    monthlySummary,
    valtAiInsight,
  };
}