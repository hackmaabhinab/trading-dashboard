"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Award, Target, Zap, Activity } from "lucide-react";

interface Trade {
  id?: number;
  pair: string;
  lot_size: number;
  risk_percent: number;
  rr: number;
  outcome: "WIN" | "LOSS" | "BE";
  setup: string;
  emotion: string;
  created_at?: string;
}

export default function OverviewPage() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setTrades(data);
      } else {
        const saved = localStorage.getItem("trade_journal_logs");
        if (saved) setTrades(JSON.parse(saved));
      }
    };

    fetchOverviewData();
  }, []);

  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.outcome === "WIN").length;
  const losses = trades.filter((t) => t.outcome === "LOSS").length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : "0";
  const avgRR =
    totalTrades > 0
      ? (trades.reduce((acc, curr) => acc + (Number(curr.rr) || 0), 0) / totalTrades).toFixed(2)
      : "0.0";

  const netR = trades.reduce((acc, curr) => {
    if (curr.outcome === "WIN") return acc + (Number(curr.rr) || 1);
    if (curr.outcome === "LOSS") return acc - 1;
    return acc;
  }, 0);

  return (
    <div className="p-6 space-y-8 bg-[#070A10] min-h-screen text-slate-100">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Performance Overview</h1>
        <p className="text-slate-400 text-sm">Real-time statistics derived from your trade journal</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>TOTAL EXECUTIONS</span>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalTrades}</div>
          <p className="text-xs text-slate-500">{wins} Wins / {losses} Losses</p>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>WIN RATE</span>
            <Award className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{winRate}%</div>
          <p className="text-xs text-slate-500">Based on evaluated trades</p>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>AVERAGE R:R</span>
            <Target className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">1:{avgRR}</div>
          <p className="text-xs text-slate-500">Target reward ratio average</p>
        </div>

        <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>NET R GAIN</span>
            <Zap className="h-4 w-4 text-purple-500" />
          </div>
          <div className={`text-2xl font-extrabold ${netR >= 0 ? "text-purple-400" : "text-rose-400"}`}>
            {netR >= 0 ? `+${netR.toFixed(1)}R` : `${netR.toFixed(1)}R`}
          </div>
          <p className="text-xs text-slate-500">Cumulative risk-adjusted return</p>
        </div>
      </div>

      {/* Recent Executions Table */}
      <div className="bg-[#0B0F17] border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-base font-semibold text-white">Recent Journal Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-[#070A10] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">PAIR</th>
                <th className="py-3 px-4">LOT</th>
                <th className="py-3 px-4">SETUP</th>
                <th className="py-3 px-4">R:R</th>
                <th className="py-3 px-4">EMOTION</th>
                <th className="py-3 px-4">OUTCOME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trades.slice(0, 5).map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="py-3 px-4 font-bold text-white">{t.pair}</td>
                  <td className="py-3 px-4 font-mono">{t.lot_size}</td>
                  <td className="py-3 px-4 text-blue-400">{t.setup}</td>
                  <td className="py-3 px-4 font-semibold">{t.rr}</td>
                  <td className="py-3 px-4 text-xs text-slate-400">{t.emotion}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold ${
                        t.outcome === "WIN"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : t.outcome === "LOSS"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}
                    >
                      {t.outcome}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}