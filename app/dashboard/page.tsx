"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { calculateOverviewMetrics, Trade } from "@/lib/analytics";
import {
  Zap,
  Calendar,
  ShieldAlert,
  Lock,
  RefreshCw,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  FileText
} from "lucide-react";

const supabase = createClient();

export default function OverviewPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // Selected Day Modal State & Supabase Notes State
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  const [dailyNotes, setDailyNotes] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch Trades and User-Specific Daily Notes
  const fetchTradesAndNotes = async () => {
    setLoading(true);
    try {
      // Get Logged-in User
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }

      // 1. Fetch Trades
      const { data: tradesData, error: tradesError } = await supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: true });

      if (tradesError) throw tradesError;
      setTrades(tradesData || []);

      // 2. Fetch Daily Notes ONLY for Logged-In User
      if (user) {
        const { data: notesData, error: notesError } = await supabase
          .from("daily_notes")
          .select("*")
          .eq("user_id", user.id);

        if (!notesError && notesData) {
          const notesMap: Record<string, string> = {};
          notesData.forEach((row: { date: string; note: string }) => {
            notesMap[row.date] = row.note;
          });
          setDailyNotes(notesMap);
        }
      }
    } catch (err) {
      console.error("Error fetching overview data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTradesAndNotes();
  }, []);

  // Save/Update Daily Note in Supabase linked with user_id
  const handleNoteChange = async (dateStr: string, noteText: string) => {
    setDailyNotes((prev) => ({ ...prev, [dateStr]: noteText }));

    if (!userId) {
      console.warn("User not authenticated to save notes.");
      return;
    }

    setSavingNote(true);

    try {
      const { error } = await supabase.from("daily_notes").upsert(
        {
          user_id: userId,
          date: dateStr,
          note: noteText,
          updated_at: new Date().toISOString()
        },
        { onConflict: "user_id, date" }
      );

      if (error) console.error("Error saving user note to Supabase:", error);
    } catch (err) {
      console.error("Failed to sync user note:", err);
    } finally {
      setSavingNote(false);
    }
  };

  const metrics = calculateOverviewMetrics(trades);

  // Month Calendar Calculations
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const mondayStartOffset = (firstDayIndex + 6) % 7;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const getTradeDateStr = (t: any) => {
    const rawDate = t.entry_at || t.created_at || t.date;
    if (!rawDate) return null;
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const currentMonthTrades = trades.filter((t) => {
    const rawDate = (t as any).entry_at || (t as any).created_at;
    if (!rawDate) return false;
    const date = new Date(rawDate);
    return date.getFullYear() === year && date.getMonth() === month;
  });

  const monthlyPnl = currentMonthTrades.reduce((acc, t) => acc + (Number(t.profit) || 0), 0);
  const monthlyTradesCount = currentMonthTrades.length;
  const monthlyWins = currentMonthTrades.filter((t) => (Number(t.profit) || 0) > 0).length;
  const monthlyWinRate = monthlyTradesCount > 0 
    ? ((monthlyWins / monthlyTradesCount) * 100).toFixed(1) 
    : "0.0";
  const avgWeeklyPnl = (monthlyPnl / 4).toFixed(2);

  const dailyTradesMap: Record<string, any[]> = {};
  trades.forEach((t) => {
    const dateStr = getTradeDateStr(t);
    if (!dateStr) return;
    if (!dailyTradesMap[dateStr]) {
      dailyTradesMap[dateStr] = [];
    }
    dailyTradesMap[dateStr].push(t);
  });

  const selectedDayTrades = selectedDayStr ? dailyTradesMap[selectedDayStr] || [] : [];
  const dayTotalTrades = selectedDayTrades.length;
  const dayPnl = selectedDayTrades.reduce((acc, t) => acc + (Number(t.profit) || 0), 0);
  const dayWins = selectedDayTrades.filter((t) => (Number(t.profit) || 0) > 0).length;
  const dayLosses = selectedDayTrades.filter((t) => (Number(t.profit) || 0) < 0).length;
  const dayWinRate = dayTotalTrades > 0 ? ((dayWins / dayTotalTrades) * 100).toFixed(1) : "0.0";

  let bestTrade = selectedDayTrades.length > 0 ? selectedDayTrades[0] : null;
  let worstTrade = selectedDayTrades.length > 0 ? selectedDayTrades[0] : null;

  selectedDayTrades.forEach((t) => {
    const p = Number(t.profit) || 0;
    if (bestTrade && p > (Number(bestTrade.profit) || 0)) bestTrade = t;
    if (worstTrade && p < (Number(worstTrade.profit) || 0)) worstTrade = t;
  });

  const formatFullDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatTradeTime = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + 
           d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 p-4 md:p-6 space-y-6 font-sans">
      {/* Header */}
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
            onClick={fetchTradesAndNotes}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs px-3 py-2 rounded-lg border border-zinc-800 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-400" : ""}`} />
            Sync Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Net Gross PnL</span>
          <div className={`text-xl font-bold font-mono ${metrics.netPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {metrics.netPnl >= 0 ? `+$${metrics.netPnl}` : `-$${Math.abs(metrics.netPnl)}`}
          </div>
          <div className="text-[10px] text-zinc-500">Live Journal Sum</div>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Profit Factor</span>
          <div className="text-xl font-bold font-mono text-cyan-400">{metrics.profitFactor}</div>
          <div className="text-[10px] text-zinc-500">Gross Win / Gross Loss</div>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Win Rate</span>
          <div className="text-xl font-bold font-mono text-amber-400">{metrics.winRate}%</div>
          <div className="text-[10px] text-zinc-500">
            {metrics.winsCount}W / {metrics.lossesCount}L ({trades.length} Total)
          </div>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Avg Trade PnL</span>
          <div className={`text-xl font-bold font-mono ${metrics.avgPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {metrics.avgPnl >= 0 ? `+$${metrics.avgPnl}` : `-$${Math.abs(metrics.avgPnl)}`}
          </div>
          <div className="text-[10px] text-zinc-500">Per Executed Trade</div>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Total Volume</span>
          <div className="text-xl font-bold font-mono text-purple-400">
            {metrics.totalVolume} <span className="text-xs text-zinc-500">Lots</span>
          </div>
          <div className="text-[10px] text-zinc-500">Cumulative Execution</div>
        </div>

        <div className="bg-[#121216] border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
          <span className="text-zinc-400 text-xs font-medium">Risk Health</span>
          <div className={`text-xl font-bold font-mono ${metrics.riskHealthScore >= 70 ? "text-emerald-400" : metrics.riskHealthScore >= 40 ? "text-amber-400" : "text-rose-400"}`}>
            {metrics.riskHealthScore}/100
          </div>
          <div className="text-[10px] text-zinc-500">Automated Risk Metric</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0e0e12] border border-zinc-800/90 rounded-2xl p-5 space-y-5 shadow-xl">
            
            {/* Calendar Nav */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-wide">Trading Calendar</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedMonth(new Date(year, month - 1, 1))}
                  className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-zinc-200 font-mono min-w-[130px] text-center">
                  {monthNames[month]} {year}
                </span>
                <button
                  onClick={() => setSelectedMonth(new Date(year, month + 1, 1))}
                  className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedMonth(new Date())}
                  className="text-xs bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-3 py-1.5 rounded-lg text-zinc-300 font-semibold ml-1 cursor-pointer"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Calendar Header Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#131318] p-3 rounded-xl border border-zinc-800/80 text-xs font-mono">
              <div className="border-r border-zinc-800/80 pr-2">
                <span className="text-[10px] text-zinc-500 font-sans uppercase block">MONTH</span>
                <span className="font-bold text-white text-sm">{monthNames[month]}</span>
              </div>
              <div className="border-r border-zinc-800/80 pr-2">
                <span className="text-[10px] text-zinc-500 font-sans uppercase block">MONTHLY P&L</span>
                <span className={`font-bold text-sm ${monthlyPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {monthlyPnl >= 0 ? `+$${monthlyPnl.toFixed(2)}` : `-$${Math.abs(monthlyPnl).toFixed(2)}`}
                </span>
              </div>
              <div className="border-r border-zinc-800/80 pr-2">
                <span className="text-[10px] text-zinc-500 font-sans uppercase block">AVG WEEKLY P&L</span>
                <span className={`font-bold text-sm ${Number(avgWeeklyPnl) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {Number(avgWeeklyPnl) >= 0 ? `+$${avgWeeklyPnl}` : `-$${Math.abs(Number(avgWeeklyPnl))}`}
                </span>
              </div>
              <div className="border-r border-zinc-800/80 pr-2">
                <span className="text-[10px] text-zinc-500 font-sans uppercase block">TRADES</span>
                <span className="font-bold text-white text-sm">{monthlyTradesCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 font-sans uppercase block">WIN RATE</span>
                <span className="font-bold text-amber-400 text-sm">{monthlyWinRate}%</span>
              </div>
            </div>

            {/* Week Labels */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-zinc-500 uppercase font-mono tracking-wider">
              {dayLabels.map((lbl) => (
                <div key={lbl}>{lbl}</div>
              ))}
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: mondayStartOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="h-20 rounded-xl bg-zinc-900/20 border border-zinc-900/40 opacity-30" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                const dayTradesList = dailyTradesMap[dateKey] || [];
                
                const cellDayLabel = dayLabels[(mondayStartOffset + i) % 7];
                const count = dayTradesList.length;
                const totalDayPnl = dayTradesList.reduce((acc, t) => acc + (Number(t.profit) || 0), 0);

                const hasTrades = count > 0;
                const isProfit = hasTrades && totalDayPnl >= 0;
                const hasNote = Boolean(dailyNotes[dateKey]?.trim());

                return (
                  <div
                    key={dayNum}
                    onClick={() => setSelectedDayStr(dateKey)}
                    className={`h-20 rounded-xl p-2.5 flex flex-col justify-between border transition-all cursor-pointer hover:scale-[1.02] ${
                      hasTrades
                        ? isProfit
                          ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-400 shadow-[inset_0_0_12px_rgba(16,185,129,0.1)] hover:border-emerald-400"
                          : "bg-rose-950/20 border-rose-500/40 text-rose-400 shadow-[inset_0_0_12px_rgba(244,63,94,0.1)] hover:border-rose-400"
                        : "bg-[#121216] border-zinc-800/60 hover:border-zinc-600 text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center justify-between pointer-events-none">
                      <span className="text-xs font-bold font-mono text-white">{dayNum}</span>
                      <div className="flex items-center gap-1">
                        {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Daily Note Added" />}
                        <span className="text-[9px] font-mono text-zinc-600 uppercase">{cellDayLabel}</span>
                      </div>
                    </div>

                    {hasTrades ? (
                      <div className="space-y-0.5 pointer-events-none">
                        <div className="text-xs font-extrabold font-mono tracking-tight">
                          {isProfit ? `+$${totalDayPnl.toFixed(2)}` : `-$${Math.abs(totalDayPnl).toFixed(2)}`}
                        </div>
                        <div className="text-[9px] text-zinc-400 font-mono flex items-center gap-1">
                          <span>📈</span> {count} {count === 1 ? "trade" : "trades"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-zinc-700 font-mono pointer-events-none">—</span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-emerald-950/40 via-[#121216] to-[#121216] border border-emerald-500/40 rounded-xl p-5 space-y-3 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.2)]">
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

            <p className="text-xs text-zinc-300 leading-relaxed italic bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
              "{metrics.valtAiInsight}"
            </p>

            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Behavioral Risk Tag:</span>
              <span className="font-semibold text-emerald-400">Disciplined Execution</span>
            </div>
          </div>

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

      {/* DAY DETAIL MODAL */}
      {selectedDayStr && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#121216] border border-zinc-800/90 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-6 p-6 relative">
            
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
              <h2 className="text-lg font-bold text-white font-sans">
                {formatFullDate(selectedDayStr)}
              </h2>
              <button
                onClick={() => setSelectedDayStr(null)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  DAY STATISTICS
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-0.5">Daily P&L</span>
                    <span className={`text-xl font-bold font-mono ${dayPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {dayPnl >= 0 ? `+$${dayPnl.toFixed(2)}` : `-$${Math.abs(dayPnl).toFixed(2)}`}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-0.5">Total Trades</span>
                    <span className="text-xl font-bold font-mono text-white">{dayTotalTrades}</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-0.5">Win Rate</span>
                    <span className="text-xl font-bold font-mono text-white">{dayWinRate}%</span>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-0.5">Wins / Losses</span>
                    <span className="text-xl font-bold font-mono">
                      <span className="text-emerald-400">{dayWins}W</span>
                      <span className="text-zinc-500"> / </span>
                      <span className="text-rose-400">{dayLosses}L</span>
                    </span>
                  </div>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-0.5">Best Trade</span>
                    <div className={`text-sm font-bold font-mono ${bestTrade && Number(bestTrade.profit) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {bestTrade ? (Number(bestTrade.profit) >= 0 ? `+$${Number(bestTrade.profit).toFixed(2)}` : `-$${Math.abs(Number(bestTrade.profit)).toFixed(2)}`) : "$0.00"}
                    </div>
                    <span className="text-[10px] text-zinc-500 block truncate">
                      {bestTrade ? (bestTrade.symbol || "XAUUSD") : "N/A"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-0.5">Worst Trade</span>
                    <div className={`text-sm font-bold font-mono ${worstTrade && Number(worstTrade.profit) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {worstTrade ? (Number(worstTrade.profit) >= 0 ? `+$${Number(worstTrade.profit).toFixed(2)}` : `-$${Math.abs(Number(worstTrade.profit)).toFixed(2)}`) : "$0.00"}
                    </div>
                    <span className="text-[10px] text-zinc-500 block truncate">
                      {worstTrade ? (worstTrade.symbol || "XAUUSD") : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                  TRADES
                </span>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {selectedDayTrades.length === 0 ? (
                    <div className="bg-[#18181e] border border-zinc-800 rounded-xl p-4 text-center text-xs text-zinc-500">
                      No trades logged on this date.
                    </div>
                  ) : (
                    selectedDayTrades.map((t: any, idx: number) => {
                      const tradePnl = Number(t.profit) || 0;
                      const isWin = tradePnl >= 0;
                      const isLong = (t.type || t.side || "BUY").toUpperCase().includes("BUY") || (t.type || "").toUpperCase() === "LONG";

                      return (
                        <div
                          key={t.id || idx}
                          className="bg-[#18181e] border border-zinc-800/80 rounded-xl p-3 flex items-center justify-between hover:border-zinc-700 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs font-mono ${
                              isLong ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            }`}>
                              {isLong ? "L" : "S"}
                            </div>

                            <div>
                              <div className="text-xs font-bold text-white font-mono">
                                {t.symbol || "XAUUSD.Qraw"}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                Open: {formatTradeTime(t.entry_at || t.created_at)}
                                {t.exit_at && ` → Close: ${formatTradeTime(t.exit_at)}`}
                              </div>
                            </div>
                          </div>

                          <div className={`text-sm font-bold font-mono ${isWin ? "text-emerald-400" : "text-rose-400"}`}>
                            {isWin ? `+$${tradePnl.toFixed(2)}` : `-$${Math.abs(tradePnl).toFixed(2)}`}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* DAILY NOTE (USER-SPECIFIC) */}
            <div className="space-y-2 border-t border-zinc-800/80 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-zinc-400" />
                  <span>DAILY NOTE</span>
                </div>
                {savingNote && (
                  <span className="text-[10px] text-emerald-400 font-mono animate-pulse">
                    Saving to your account...
                  </span>
                )}
              </div>
              <textarea
                value={dailyNotes[selectedDayStr] || ""}
                onChange={(e) => handleNoteChange(selectedDayStr, e.target.value)}
                placeholder="Add notes about your trading day... (e.g., market conditions, emotions, lessons learned)"
                className="w-full bg-[#16161c] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all resize-none h-20 font-sans"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}