"use client";

import React, { useState, useEffect } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Maximize2, 
  AlertCircle 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// Dotted Horizontal Bar Component
const DottedBar = ({ value, max = 100, color = "emerald" }: { value: number; max?: number; color?: "emerald" | "rose" }) => {
  const dotsCount = 45;
  const filledDots = Math.min(dotsCount, Math.round((Math.abs(value) / (max || 1)) * dotsCount));

  return (
    <div className="flex items-center gap-[2px] w-full my-1 overflow-hidden">
      {Array.from({ length: dotsCount }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-[3px] rounded-full transition-all ${
            i < filledDots
              ? color === "emerald"
                ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"
                : "bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.5)]"
              : "bg-neutral-800"
          }`}
        />
      ))}
    </div>
  );
};

export const dynamic = 'force-dynamic';

export default function OverviewPage() {
  const [activeRiskTab, setActiveRiskTab] = useState<"TODAY" | "THIS WEEK">("TODAY");

  // Real-time calculated state from Supabase
  const [stats, setStats] = useState({
    grossPnl: 0,
    winRate: 0,
    avgPnl: 0,
    profitFactor: 0,
    totalTrades: 0,
    wins: 0,
    losses: 0,
  });

  useEffect(() => {
    async function calculateOverviewStats() {
      const { data: trades, error } = await supabase.from("trades").select("pnl");

      if (error || !trades || trades.length === 0) {
        setStats({
          grossPnl: 0,
          winRate: 0,
          avgPnl: 0,
          profitFactor: 0,
          totalTrades: 0,
          wins: 0,
          losses: 0,
        });
        return;
      }

      const totalTrades = trades.length;
      let grossPnl = 0;
      let totalGain = 0;
      let totalLoss = 0;
      let wins = 0;
      let losses = 0;

      trades.forEach((t) => {
        const val = Number(t.pnl) || 0;
        grossPnl += val;
        if (val > 0) {
          totalGain += val;
          wins++;
        } else if (val < 0) {
          totalLoss += Math.abs(val);
          losses++;
        }
      });

      const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(2) : "0.00";
      const avgPnl = totalTrades > 0 ? (grossPnl / totalTrades).toFixed(2) : "0.00";
      const profitFactor = totalLoss === 0 ? (totalGain > 0 ? totalGain.toFixed(2) : "0.00") : (totalGain / totalLoss).toFixed(2);

      setStats({
        grossPnl,
        winRate: Number(winRate),
        avgPnl: Number(avgPnl),
        profitFactor: Number(profitFactor),
        totalTrades,
        wins,
        losses,
      });
    }

    calculateOverviewStats();
  }, []);

  return (
    <div className="space-y-4 w-full text-slate-200 bg-black min-h-screen p-2 sm:p-4 font-sans">
      
      {/* 1. TOP KPI STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-[#0B0B0B] border border-neutral-800/80 p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">PnL Gross $</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-bold ${stats.grossPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              ${stats.grossPnl.toFixed(2)}
            </span>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">0.00%</span>
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Profit Factor</span>
          <span className="text-xl font-bold text-white mt-1">{stats.profitFactor.toFixed(2)}</span>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Avg PnL $</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-white">${stats.avgPnl.toFixed(2)}</span>
            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">0.00%</span>
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 p-3.5 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Win Rate</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold text-emerald-400">{stats.winRate.toFixed(2)}% <span className="text-xs text-neutral-400 font-mono">{stats.wins}</span></span>
            <span className="text-xs font-bold text-rose-400 font-mono">{stats.losses} <span className="text-rose-400">{stats.totalTrades > 0 ? (100 - stats.winRate).toFixed(2) : "0.00"}%</span></span>
          </div>
        </div>
      </div>

      {/* 2. CHARTS & AI COACH SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Account Performance</span>
            <Maximize2 className="w-3.5 h-3.5 text-neutral-500 cursor-pointer hover:text-white" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div><span className="text-[9px] text-neutral-500 block">Avg PnL $</span><span className="font-bold text-white">${stats.avgPnl.toFixed(2)}</span></div>
            <div><span className="text-[9px] text-neutral-500 block">Avg PnL %</span><span className="font-bold text-white">0.00%</span></div>
            <div><span className="text-[9px] text-neutral-500 block">Win %</span><span className="font-bold text-emerald-400">{stats.winRate.toFixed(2)}%</span></div>
          </div>
          <div className="h-44 bg-black/40 border border-neutral-800/60 rounded-lg flex items-center justify-center text-neutral-600 text-xs font-mono">
            [ No Trade Data Available ]
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Daily PnL</span>
            <span className="text-[10px] font-mono text-neutral-500">AVG: $0.00</span>
          </div>
          <div className="h-44 md:h-52 bg-black/40 border border-neutral-800/60 rounded-lg flex items-center justify-center text-neutral-600 text-xs font-mono">
            [ No Executions Recorded ]
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3 md:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Cypher Coach</span>
            <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
            No active trade logs found. Add executions in your Trade Journal to start receiving performance insights.
          </p>
          <div className="grid grid-cols-2 gap-2 text-center font-mono">
            <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800">
              <span className="text-white text-sm font-bold block">$0.00</span>
              <span className="text-[9px] text-neutral-500 uppercase">Week P&L</span>
            </div>
            <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800">
              <span className="text-white text-sm font-bold block">{stats.totalTrades}</span>
              <span className="text-[9px] text-neutral-500 uppercase">Trades</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MONTHLY CALENDAR & RISK HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        <div className="lg:col-span-2 bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Monthly Calendar</span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <button className="text-neutral-500 hover:text-white"><ChevronsLeft className="w-3.5 h-3.5" /></button>
              <button className="text-neutral-500 hover:text-white"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <span className="font-bold text-white">September, 2026</span>
              <span className="text-neutral-400 font-bold bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">$0.00</span>
              <button className="text-neutral-500 hover:text-white"><ChevronRight className="w-3.5 h-3.5" /></button>
              <button className="text-neutral-500 hover:text-white"><ChevronsRight className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[10px]">
                {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                  <div key={d} className="text-neutral-500 font-bold py-1">{d}</div>
                ))}
                
                {Array.from({ length: 30 }).map((_, idx) => (
                  <div key={idx} className="h-12 sm:h-16 bg-neutral-900/20 rounded p-1 text-left text-neutral-600 border border-neutral-800/40">
                    <span>{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Risk Health Overview</span>
            <AlertCircle className="w-3.5 h-3.5 text-emerald-500" />
          </div>

          <div className="flex items-center justify-around py-2">
            <div className="text-center">
              <span className="text-xs text-neutral-400 block font-mono">Risk Score</span>
              <span className="text-2xl font-black text-emerald-500">0 / 100</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30 block mt-1">OPTIMAL</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <span className="text-[9px] text-neutral-500 block">Drawdown</span>
                <span className="text-white font-bold">0.00%</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded border border-neutral-800">
                <span className="text-[9px] text-neutral-500 block">Position Size</span>
                <span className="text-white font-bold">N/A <span className="text-[8px] text-neutral-500">PLAN: 1.00%</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. OPEN POSITIONS & MFE/MAE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">MFE / MAE</span>
            <div className="flex gap-2 text-[10px] font-mono">
              <span className="text-neutral-400">Avg: <strong className="text-white">$0.00</strong></span>
              <span className="text-neutral-400">Max: <strong className="text-white">$0.00</strong></span>
            </div>
          </div>
          <div className="h-36 bg-black/40 border border-neutral-800/60 rounded-lg flex items-center justify-center text-neutral-600 text-xs font-mono">
            [ MAE Scatter Plot Matrix ]
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Open Positions</span>
            <div className="text-right font-mono">
              <span className="text-[9px] text-neutral-500 block uppercase">Total Unrealized PnL</span>
              <span className="text-sm font-bold text-white">$0.00</span>
            </div>
          </div>

          <div className="py-8 text-center font-mono text-xs text-neutral-600">
            No Open Positions
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3 md:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 block border-b border-neutral-800/60 pb-2">Entry Price Range</span>
          <div className="py-8 text-center font-mono text-xs text-neutral-600">
            No Entry Data Recorded
          </div>
        </div>
      </div>

      {/* 5. RISK STATUS, PERFORMANCE & HOURLY BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800/60 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">Current Risk Status</span>
            <div className="flex bg-neutral-900 rounded p-0.5 border border-neutral-800 text-[10px] font-mono">
              <button 
                onClick={() => setActiveRiskTab("TODAY")} 
                className={`px-2 py-0.5 rounded ${activeRiskTab === "TODAY" ? "bg-neutral-800 text-white font-bold" : "text-neutral-500"}`}
              >
                TODAY
              </button>
              <button 
                onClick={() => setActiveRiskTab("THIS WEEK")} 
                className={`px-2 py-0.5 rounded ${activeRiskTab === "THIS WEEK" ? "bg-neutral-800 text-white font-bold" : "text-neutral-500"}`}
              >
                THIS WEEK
              </button>
            </div>
          </div>

          <div className="text-center py-2 font-mono">
            <span className="text-2xl font-black text-white block">$0.00</span>
            <span className="text-[9px] text-neutral-500 uppercase">Today's PnL</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-neutral-900/50 p-2 rounded border border-neutral-800">
              <span className="text-[9px] text-neutral-500 block">Win Rate</span>
              <span className="text-emerald-400 font-bold">{stats.winRate.toFixed(2)}%</span>
            </div>
            <div className="bg-neutral-900/50 p-2 rounded border border-neutral-800">
              <span className="text-[9px] text-neutral-500 block">Current Drawdown</span>
              <span className="text-white font-bold">0.00%</span>
            </div>
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 block border-b border-neutral-800/60 pb-2">Weekly Performance</span>
          <div className="py-8 text-center font-mono text-xs text-neutral-600">
            No Executions This Week
          </div>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-2 md:col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 block border-b border-neutral-800/60 pb-2">Hourly Breakdown</span>
          <div className="py-8 text-center font-mono text-xs text-neutral-600">
            No Executions Recorded
          </div>
        </div>
      </div>

    </div>
  );
}