"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Plus, X, Image as ImageIcon, ExternalLink, Calendar, Clock, DollarSign } from "lucide-react";
import { useDashboardData } from '@/hooks/useDashboardData';

export interface Trade {
  id?: string;
  trade_id: string;
  trade_date: string;
  trade_time: string;
  pair: string;
  type: "BUY" | "SELL";
  setup: string;
  session: "ASIA" | "LONDON" | "NEW YORK";
  lot_size: number;
  rr: number;
  entry_price: number;
  exit_price: number;
  stop_loss: number;
  take_profit: number;
  pnl: number;
  notes: string;
  image_url?: string;
  created_at?: string;
}

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Complete Journal Form State
  const [formData, setFormData] = useState<Partial<Trade>>({
    trade_date: new Date().toISOString().split("T")[0],
    trade_time: "09:30",
    pair: "XAUUSD",
    type: "BUY",
    setup: "FVG + Liquidity Sweep",
    session: "NEW YORK",
    lot_size: 1.00,
    rr: 2.50,
    entry_price: 2512.40,
    exit_price: 2528.00,
    stop_loss: 2505.00,
    take_profit: 2535.00,
    pnl: 420.00,
    notes: "Followed 15m order flow. Waited for London sweep before NY open entry.",
    image_url: "",
  });

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    const { data, error } = await supabase.from("trades").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setTrades(data);
      if (data.length > 0 && !selectedTrade) setSelectedTrade(data[0]);
    }
  };

  const handleSaveTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    const trade_id = `TRD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTrade = { ...formData, trade_id };

    const { error } = await supabase.from("trades").insert([newTrade]);
    if (!error) {
      setShowModal(false);
      fetchTrades();
    }
  };

  const filteredTrades = trades.filter(
    (t) =>
      t.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.setup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.trade_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-black min-h-screen text-slate-200 font-sans space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div>
          <h1 className="text-lg font-bold tracking-wider text-white">TRADE JOURNAL</h1>
          <p className="text-xs text-neutral-500">SMC/ICT Execution Logs & Dynamic Performance Analysis</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
        >
          <Plus className="w-4 h-4" /> New Execution
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-2 bg-[#0B0B0B] border border-neutral-800/80 p-2 rounded-xl text-xs">
        <Search className="w-4 h-4 text-neutral-500 ml-1" />
        <input
          type="text"
          placeholder="Search by Pair, Setup, or ID..."
          className="bg-transparent text-white focus:outline-none w-full font-mono text-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Journal Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Trades Table List */}
        <div className="lg:col-span-2 bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-3 space-y-2 overflow-x-auto">
          {filteredTrades.length === 0 ? (
            <div className="py-12 text-center text-neutral-600 font-mono text-xs">
              No executions logged yet. Click "+ New Execution" to record your trades.
            </div>
          ) : (
            <table className="w-full text-left font-mono text-xs min-w-[550px]">
              <thead>
                <tr className="text-neutral-500 text-[10px] border-b border-neutral-800/80 uppercase">
                  <th className="py-2.5 px-2">Date/Time</th>
                  <th>ID / Pair</th>
                  <th>Type</th>
                  <th>Session</th>
                  <th>Setup</th>
                  <th>R:R</th>
                  <th className="text-right px-2">PNL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/80">
                {filteredTrades.map((t) => (
                  <tr
                    key={t.trade_id}
                    onClick={() => setSelectedTrade(t)}
                    className={`cursor-pointer transition-colors hover:bg-neutral-900/60 ${
                      selectedTrade?.trade_id === t.trade_id ? "bg-neutral-900/90 border-l-2 border-emerald-500" : ""
                    }`}
                  >
                    <td className="py-3 px-2 text-neutral-400 text-[10px]">
                      <div>{t.trade_date}</div>
                      <div className="text-neutral-600">{t.trade_time}</div>
                    </td>
                    <td>
                      <span className="text-neutral-500 block text-[10px]">{t.trade_id}</span>
                      <span className="text-white font-bold">{t.pair}</span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          t.type === "BUY" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="text-neutral-400 text-[10px] uppercase">{t.session}</td>
                    <td className="text-neutral-300 font-sans text-xs">{t.setup}</td>
                    <td className="text-neutral-400">1:{t.rr}</td>
                    <td className={`text-right px-2 font-bold ${t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {t.pnl >= 0 ? `+$${t.pnl.toFixed(2)}` : `-$${Math.abs(t.pnl).toFixed(2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Selected Trade Detailed Inspector */}
        {selectedTrade ? (
          <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-start border-b border-neutral-800/80 pb-3">
              <div>
                <span className="text-[10px] text-neutral-500 block font-mono">{selectedTrade.trade_id} • {selectedTrade.trade_date} ({selectedTrade.trade_time})</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {selectedTrade.pair} 
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${selectedTrade.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {selectedTrade.type}
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <span className={`text-base font-bold font-mono block ${selectedTrade.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {selectedTrade.pnl >= 0 ? `+$${selectedTrade.pnl.toFixed(2)}` : `-$${Math.abs(selectedTrade.pnl).toFixed(2)}`}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">1:{selectedTrade.rr} RR</span>
              </div>
            </div>

            {/* Price Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-[9px] text-neutral-500 uppercase block">Entry Price</span>
                <span className="text-white font-bold">{selectedTrade.entry_price || "--"}</span>
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-[9px] text-neutral-500 uppercase block">Exit Price</span>
                <span className="text-white font-bold">{selectedTrade.exit_price || "--"}</span>
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-[9px] text-rose-400/80 uppercase block">Stop Loss</span>
                <span className="text-neutral-300 font-bold">{selectedTrade.stop_loss || "--"}</span>
              </div>
              <div className="bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800/80">
                <span className="text-[9px] text-emerald-400/80 uppercase block">Take Profit</span>
                <span className="text-neutral-300 font-bold">{selectedTrade.take_profit || "--"}</span>
              </div>
            </div>

            {/* Extra Info */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-neutral-400 text-[11px]">
                <span>Session:</span> <strong className="text-white">{selectedTrade.session}</strong>
              </div>
              <div className="flex justify-between text-neutral-400 text-[11px]">
                <span>Lot Size:</span> <strong className="text-white">{selectedTrade.lot_size} Lots</strong>
              </div>
              <div className="flex justify-between text-neutral-400 text-[11px]">
                <span>Setup Tag:</span> <strong className="text-emerald-400 font-sans">{selectedTrade.setup}</strong>
              </div>
            </div>

            {/* Notes Section */}
            {selectedTrade.notes && (
              <div className="bg-neutral-900/40 border border-neutral-800/60 p-3 rounded-lg space-y-1">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block font-mono">Execution Notes</span>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">{selectedTrade.notes}</p>
              </div>
            )}

            {/* Chart Screenshot Proof */}
            <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-4 text-center overflow-hidden">
              {selectedTrade.image_url ? (
                <img src={selectedTrade.image_url} alt="Execution Chart" className="w-full h-auto rounded border border-neutral-800" />
              ) : (
                <div className="py-6 flex flex-col items-center gap-1 text-neutral-600 font-mono text-xs">
                  <ImageIcon className="w-6 h-6 text-neutral-700" />
                  <span>No Chart Screenshot Uploaded</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#0B0B0B] border border-neutral-800/80 rounded-xl p-8 text-center text-neutral-600 font-mono text-xs flex flex-col items-center justify-center">
            Select an execution to inspect detailed metrics
          </div>
        )}
      </div>

      {/* Complete Add Execution Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleSaveTrade} className="bg-[#0B0B0B] border border-neutral-800 p-5 rounded-xl space-y-3 w-full max-w-lg text-xs">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <h2 className="text-sm font-bold text-white tracking-wider">LOG NEW EXECUTION</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">DATE</label>
                <input
                  type="date"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.trade_date}
                  onChange={(e) => setFormData({ ...formData, trade_date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">TIME</label>
                <input
                  type="time"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.trade_time}
                  onChange={(e) => setFormData({ ...formData, trade_time: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">PAIR</label>
                <input
                  type="text"
                  placeholder="XAUUSD"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.pair}
                  onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">TYPE</label>
                <select
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "BUY" | "SELL" })}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">SESSION</label>
                <select
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value as "ASIA" | "LONDON" | "NEW YORK" })}
                >
                  <option value="NEW YORK">NEW YORK</option>
                  <option value="LONDON">LONDON</option>
                  <option value="ASIA">ASIA</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">SETUP TAG</label>
                <input
                  type="text"
                  placeholder="Order Block / FVG"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white"
                  value={formData.setup}
                  onChange={(e) => setFormData({ ...formData, setup: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">LOT SIZE</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.lot_size}
                  onChange={(e) => setFormData({ ...formData, lot_size: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">NET PNL ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="420.00"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.pnl}
                  onChange={(e) => setFormData({ ...formData, pnl: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">ENTRY</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.entry_price}
                  onChange={(e) => setFormData({ ...formData, entry_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">EXIT</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.exit_price}
                  onChange={(e) => setFormData({ ...formData, exit_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">STOP LOSS</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.stop_loss}
                  onChange={(e) => setFormData({ ...formData, stop_loss: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1 font-mono">TAKE PROFIT</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                  value={formData.take_profit}
                  onChange={(e) => setFormData({ ...formData, take_profit: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1 font-mono">CHART IMAGE URL (OPTIONAL)</label>
              <input
                type="text"
                placeholder="https://tradingview.com/x/..."
                className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-mono"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1 font-mono">EXECUTION NOTES & PSYCHOLOGY</label>
              <textarea
                rows={2}
                placeholder="Psychology during trade, plan execution details..."
                className="w-full bg-neutral-900 border border-neutral-800 p-2 rounded text-white font-sans"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-1/2 bg-neutral-800 hover:bg-neutral-700 py-2 rounded-lg text-white font-bold font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-black py-2 rounded-lg font-bold font-mono"
              >
                Save Execution Log
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}