"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function OverviewPage() {
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

      if (error || !trades || trades.length === 0) return;

      const totalTrades = trades.length;
      let grossPnl = 0;
      let totalGain = 0;
      let totalLoss = 0;
      let wins = 0;
      let losses = 0;

      trades.forEach((t) => {
        const val = Number(t.pnl);
        grossPnl += val;
        if (val > 0) {
          totalGain += val;
          wins++;
        } else if (val < 0) {
          totalLoss += Math.abs(val);
          losses++;
        }
      });

      const winRate = ((wins / totalTrades) * 100).toFixed(2);
      const avgPnl = (grossPnl / totalTrades).toFixed(2);
      const profitFactor = totalLoss === 0 ? totalGain.toFixed(2) : (totalGain / totalLoss).toFixed(2);

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
    <div className="p-4 bg-black min-h-screen text-slate-200 font-sans space-y-4">
      {/* Top KPI Bar - Dynamically Computed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-[#0B0B0B] border border-neutral-800/80 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">PnL Gross $</span>
          <span className={`text-xl font-bold ${stats.grossPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            ${stats.grossPnl.toFixed(2)}
          </span>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Profit Factor</span>
          <span className="text-xl font-bold text-white">{stats.profitFactor}</span>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Avg PnL $</span>
          <span className="text-xl font-bold text-white">${stats.avgPnl}</span>
        </div>

        <div className="bg-[#0B0B0B] border border-neutral-800/80 p-3.5 rounded-xl">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Win Rate</span>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xl font-bold text-emerald-400">{stats.winRate}%</span>
            <span className="text-xs text-neutral-400 font-mono">{stats.wins}W / {stats.losses}L</span>
          </div>
        </div>
      </div>
    </div>
  );
}