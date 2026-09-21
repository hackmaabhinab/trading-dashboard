"use client";

import React, { useEffect, useState } from "react";
// 1. Updated Import: Using SSR-compatible client helper
import { createClient } from "@/utils/supabase/client";
import { calculateOverviewMetrics, Trade } from "@/lib/analytics";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Award,
  Zap,
  Calendar,
  Clock,
  ShieldAlert,
  BarChart2,
  Lock,
  RefreshCw,
  Layers
} from "lucide-react";

// Initialize SSR Client
const supabase = createClient();

export default function OverviewPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  const fetchTrades = async () => {
    setLoading(true);
    try {
      // Automatic Cookie session ke through current user ka authenticated trades fetch karega
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTrades(data || []);
    } catch (err) {
      console.error("Error fetching journal trades for overview:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const metrics = calculateOverviewMetrics(trades);

  // Month Navigation for Monthly Calendar
  const daysInMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 p-4 md:p-6 space-y-6 font-sans">
      {/* Top Header / Branding */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold border border-emerald-500/20">
              VALT TERMINAL
            </span>
            <span className="text-zinc-500 text-xs">• Dynamic Journal Sync Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Institutional Performance Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTrades}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-lg border border-zinc-800 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            Sync Data
          </button>
        </div>
      </div>

      {/* KPI Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {/* Net PnL */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Net Gross PnL</span>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.netPnl >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {metrics.netPnl >= 0 ? `+$${metrics.netPnl}` : `-$${Math.abs(metrics.netPnl)}`}
          </div>
          <div className="text-[10px] text-zinc-500">Live Journal Sum</div>
        </div>

        {/* Profit Factor */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Profit Factor</span>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {metrics.profitFactor}
          </div>
          <div className="text-[10px] text-zinc-500">Gross Win / Gross Loss</div>
        </div>

        {/* Win Rate */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Win Rate</span>
          <div className="text-xl font-bold font-mono text-amber-400">
            {metrics.winRate}%
          </div>
          <div className="text-[10px] text-zinc-500">
            {metrics.winsCount}W / {metrics.lossesCount}L ({trades.length} Total)
          </div>
        </div>

        {/* Avg PnL */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Avg Trade PnL</span>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.avgPnl >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {metrics.avgPnl >= 0 ? `+$${metrics.avgPnl}` : `-$${Math.abs(metrics.avgPnl)}`}
          </div>
          <div className="text-[10px] text-zinc-500">Per Executed Trade</div>
        </div>

        {/* Total Volume */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Total Volume</span>
          <div className="text-xl font-bold font-mono text-purple-400">
            {metrics.totalVolume} <span className="text-xs text-zinc-500">Lots</span>
          </div>
          <div className="text-[10px] text-zinc-500">Cumulative Execution</div>
        </div>

        {/* Health Score */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Risk Health</span>
          <div
            className={`text-xl font-bold font-mono ${
              metrics.riskHealthScore >= 70
                ? "text-emerald-400"
                : metrics.riskHealthScore >= 40
                ? "text-amber-400"
                : "text-rose-400"
            }`}
          >
            {metrics.riskHealthScore}/100
          </div>
          <div className="text-[10px] text-zinc-500">Automated Risk Metric</div>
        </div>
      </div>

      {/* Main Grid: Performance + VALT AI + Risk Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Account Performance Chart & Monthly Calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Performance Curve */}
          <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Account Performance Curve</h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">
                Cumulative Equity Growth
              </span>
            </div>

            <div className="h-48 w-full flex items-end gap-1.5 pt-6 pb-2 border-b border-zinc-800">
              {metrics.accountPerformanceChart.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 font-mono">
                  No trades logged in Journal. Equity curve will render dynamically here.
                </div>
              ) : (
                metrics.accountPerformanceChart.map((pt, idx) => {
                  const maxPnl = Math.max(
                    ...metrics.accountPerformanceChart.map((p) => Math.abs(p.pnl)),
                    100
                  );
                  const heightPercent = Math.min(
                    100,
                    Math.max(15, (Math.abs(pt.pnl) / maxPnl) * 100)
                  );
                  const isPositive = pt.pnl >= 0;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-8 hidden group-hover:flex bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-200 px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                        {pt.time}: ${pt.pnl}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all ${
                          isPositive ? "bg-emerald-500/80 hover:bg-emerald-400" : "bg-rose-500/80 hover:bg-rose-400"
                        }`}
                      />
                      <span className="text-[9px] text-zinc-500 truncate w-full text-center">
                        {pt.time}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Monthly Calendar */}
          <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">
                  Monthly Calendar ({monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()})
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setSelectedMonth(
                      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1)
                    )
                  }
                  className="px-2 py-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs rounded text-zinc-300"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setSelectedMonth(
                      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1)
                    )
                  }
                  className="px-2 py-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-xs rounded text-zinc-300"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-zinc-500 border-b border-zinc-800/60 pb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {/* Empty offset days */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-14 rounded bg-zinc-900/30 opacity-20" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const monthStr = String(selectedMonth.getMonth() + 1).padStart(2, "0");
                const dayStr = String(dayNum).padStart(2, "0");
                const dateKey = `${selectedMonth.getFullYear()}-${monthStr}-${dayStr}`;
                const dayPnl = metrics.monthlyCalendar[dateKey];

                return (
                  <div
                    key={dayNum}
                    className={`h-14 rounded-lg p-1.5 flex flex-col justify-between border text-left transition-all ${
                      dayPnl !== undefined
                        ? dayPnl >= 0
                          ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400"
                          : "bg-rose-950/30 border-rose-500/30 text-rose-400"
                        : "bg-zinc-900/40 border-zinc-800/50 text-zinc-500"
                    }`}
                  >
                    <span className="text-[10px] font-mono text-zinc-400">{dayNum}</span>
                    {dayPnl !== undefined && (
                      <span className="text-[11px] font-bold font-mono truncate">
                        {dayPnl >= 0 ? `+$${dayPnl}` : `-$${Math.abs(dayPnl)}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): VALT AI + Risk Overview + Plan Tracker */}
        <div className="space-y-6">
          {/* VAULT AI Execution Assistant */}
          <div className="bg-gradient-to-b from-emerald-950/30 via-[#121216] to-[#121216] border border-emerald-500/30 rounded-xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-emerald-400 tracking-wider">
                  VALT AI EXECUTION
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                REAL-TIME INSIGHT
              </span>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
              "{metrics.valtAiInsight}"
            </p>

            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Behavioral Risk Tag:</span>
              <span className="font-semibold text-emerald-400">Disciplined Execution</span>
            </div>
          </div>

          {/* Risk Health Overview */}
          <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Risk Health Overview</h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {metrics.riskHealthScore}/100
              </span>
            </div>

            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${metrics.riskHealthScore}%` }}
                className={`h-full transition-all ${
                  metrics.riskHealthScore >= 70
                    ? "bg-emerald-400"
                    : metrics.riskHealthScore >= 40
                    ? "bg-amber-400"
                    : "bg-rose-500"
                }`}
              />
            </div>

            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span>Gross Profit:</span>
                <span className="text-emerald-400 font-mono">+${metrics.grossProfit}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/60">
                <span>Gross Loss:</span>
                <span className="text-rose-400 font-mono">-${metrics.grossLoss}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Consecutive Losses Warning:</span>
                <span className="text-zinc-300 font-mono">Low Risk</span>
              </div>
            </div>
          </div>

          {/* Plan Tracker (COMING SOON) */}
          <div className="bg-[#121216]/60 border border-zinc-800/80 rounded-xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Trading Plan Tracker</h3>
              </div>
              <span className="flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 font-semibold font-mono">
                <Lock className="w-3 h-3" /> COMING SOON
              </span>
            </div>

            <div className="text-xs text-zinc-500 py-4 text-center space-y-1">
              <p>Automated Rule Compliance & Daily Drawdown Monitoring.</p>
              <p className="text-[10px] text-zinc-600">Feature unlock in next VALT version release.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Breakdown Section: Strategy Performance, Hourly & Weekly Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strategy Breakdown */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Strategy Performance</h3>
          </div>

          <div className="space-y-2 pt-2">
            {Object.keys(metrics.strategyPerformance).length === 0 ? (
              <p className="text-xs text-zinc-600 italic">No strategy tags logged yet.</p>
            ) : (
              Object.entries(metrics.strategyPerformance).map(([strat, pnl]) => (
                <div key={strat} className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-medium">{strat}</span>
                  <span
                    className={`font-mono font-bold ${
                      pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {pnl >= 0 ? `+$${pnl.toFixed(2)}` : `-$${Math.abs(pnl).toFixed(2)}`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Weekly Distribution</h3>
          </div>

          <div className="grid grid-cols-7 gap-1 pt-4 h-24 items-end border-b border-zinc-800 pb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName, idx) => {
              const val = metrics.weeklyPerformance[idx];
              const maxVal = Math.max(...metrics.weeklyPerformance.map((v) => Math.abs(v)), 10);
              const height = Math.min(100, Math.max(10, (Math.abs(val) / maxVal) * 100));

              return (
                <div key={dayName} className="flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-t ${
                      val >= 0 ? "bg-emerald-500/70" : "bg-rose-500/70"
                    }`}
                  />
                  <span className="text-[9px] text-zinc-500">{dayName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Hourly Execution Distribution</h3>
          </div>

          <div className="flex items-end gap-1 pt-4 h-24 border-b border-zinc-800 pb-2 overflow-x-auto">
            {metrics.hourlyPerformance.map((val, hour) => {
              const maxVal = Math.max(...metrics.hourlyPerformance.map((v) => Math.abs(v)), 10);
              const height = Math.min(100, Math.max(10, (Math.abs(val) / maxVal) * 100));

              return (
                <div key={hour} className="flex-1 min-w-[8px] flex flex-col items-center h-full justify-end">
                  <div
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-t ${
                      val >= 0 ? "bg-cyan-500/70" : "bg-rose-500/70"
                    }`}
                  />
                  <span className="text-[8px] text-zinc-600">{hour}h</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}