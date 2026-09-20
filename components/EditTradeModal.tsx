"use client";

import React, { useState } from "react";
import { X, Save, Sparkles, Image as ImageIcon } from "lucide-react";

interface Trade {
  id: string;
  ticket_id?: string;
  symbol: string;
  trade_type: "BUY" | "SELL";
  volume: number;
  open_price: number;
  close_price?: number;
  profit?: number;
  open_time: string;
  strategy?: string;
  emotion?: string;
  notes?: string;
  chart_url?: string;
}

interface EditTradeModalProps {
  trade: Trade;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: Partial<Trade>) => void;
}

export default function EditTradeModal({
  trade,
  isOpen,
  onClose,
  onSave,
}: EditTradeModalProps) {
  const [strategy, setStrategy] = useState(trade.strategy || "SMC Order Block");
  const [emotion, setEmotion] = useState(trade.emotion || "Disciplined / Planned");
  const [notes, setNotes] = useState(trade.notes || "");
  const [chartUrl, setChartUrl] = useState(trade.chart_url || "");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    onSave({
      id: trade.id,
      strategy,
      emotion,
      notes,
      chart_url: chartUrl,
    });

    setSaving(false);
    onClose();
  };

  const isProfit = (trade.profit || 0) >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <span className="text-xs font-mono text-neutral-500">
              Ticket #{trade.ticket_id || "MANUAL"}
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className={trade.trade_type === "BUY" ? "text-emerald-400" : "text-rose-400"}>
                {trade.trade_type}
              </span>{" "}
              {trade.symbol} ({trade.volume} Lots)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Read-Only MT5 Synced Summary */}
        <div className="grid grid-cols-3 gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/60 text-center font-mono text-xs">
          <div>
            <span className="text-neutral-500 block text-[10px]">Entry Price</span>
            <span className="text-white font-semibold">{trade.open_price}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px]">Exit Price</span>
            <span className="text-white font-semibold">{trade.close_price || "OPEN"}</span>
          </div>
          <div>
            <span className="text-neutral-500 block text-[10px]">Net PnL</span>
            <span className={`font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
              {isProfit ? `+$${trade.profit}` : `-$${Math.abs(trade.profit || 0)}`}
            </span>
          </div>
        </div>

        {/* Editable Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">
              Setup / Strategy Logic
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="SMC Order Block">SMC Order Block / FVG</option>
              <option value="Break & Retest">Break & Retest</option>
              <option value="Liquidity Sweep">Liquidity Sweep</option>
              <option value="Trendline Bounce">Trendline Bounce</option>
              <option value="News Scalp">News Momentum / Scalp</option>
              <option value="Custom Setup">Custom Setup</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">
              Psychology & Emotion at Entry
            </label>
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Disciplined / Planned">Disciplined / Followed Plan</option>
              <option value="FOMO Entry">FOMO / Chasing Move</option>
              <option value="Revenge Trade">Revenge Trade</option>
              <option value="Hesitant / Late Entry">Hesitant / Late Execution</option>
              <option value="Over-Leveraged">Over-Leveraged / High Risk</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">
              Execution Notes & Flaws
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why did you take this trade? Did you manage stop loss properly?"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1 flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5 text-emerald-400" /> Chart Screenshot URL
            </label>
            <input
              type="url"
              value={chartUrl}
              onChange={(e) => setChartUrl(e.target.value)}
              placeholder="https://www.tradingview.com/x/..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Save className="h-4 w-4" />
              {saving ? "Updating..." : "Save Journal Notes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}