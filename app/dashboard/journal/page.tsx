"use client";

import React, { useState, useEffect } from "react";
import EditTradeModal from "@/components/EditTradeModal";
import { Edit2, RefreshCw, PlusCircle, X, Calendar, Clock, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function JournalPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Manual Trade Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Custom Aesthetic Date/Time State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // Form Fields
  const [symbol, setSymbol] = useState("XAUUSD");
  const [tradeType, setTradeType] = useState("BUY");
  const [volume, setVolume] = useState("0.10");
  const [openPrice, setOpenPrice] = useState("");
  const [closePrice, setClosePrice] = useState("");
  const [profit, setProfit] = useState("");
  const [strategy, setStrategy] = useState("SMC / ICT");
  const [psychology, setPsychology] = useState("Disciplined / Planned");
  const [notes, setNotes] = useState("");

  // Set default live datetime whenever modal is opened
  useEffect(() => {
    if (isManualModalOpen) {
      const now = new Date();
      setSelectedDate(now);
      setViewDate(now);
    }
  }, [isManualModalOpen]);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      let query = supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: false });

      if (user) {
        query = query.or(`user_id.eq.${user.id},user_id.is.null`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching trades:", error.message);
        return;
      }

      if (data) {
        setTrades(data);
      }
    } catch (err) {
      console.error("Fetch Exception:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleSaveTrade = async (updatedData: any) => {
    try {
      const res = await fetch("/api/trades/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setTrades((prev) =>
          prev.map((t) => (t.id === updatedData.id ? { ...t, ...updatedData } : t))
        );
      }
    } catch (err) {
      console.error("Failed to save trade:", err);
    }
  };

  // Delete Trade Handler
  const handleDeleteTrade = async (tradeId: string) => {
    const confirmDelete = window.confirm("Kya aap is trade ko delete karna chahte hain?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("trades")
        .delete()
        .eq("id", tradeId);

      if (error) {
        alert(`Delete error: ${error.message}`);
        return;
      }

      // Optimistic UI update
      setTrades((prev) => prev.filter((t) => t.id !== tradeId));
    } catch (err: any) {
      console.error("Delete exception:", err);
      alert("Trade delete karne mein problem aayi.");
    }
  };

  const handleAddManualTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch("/api/trades/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: session?.user?.id || null,
          symbol,
          trade_type: tradeType,
          volume: Number(volume),
          open_price: openPrice ? Number(openPrice) : null,
          close_price: closePrice ? Number(closePrice) : null,
          profit: Number(profit),
          strategy,
          psychology,
          notes,
          created_at: selectedDate.toISOString(),
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setIsManualModalOpen(false);
        setProfit("");
        setOpenPrice("");
        setClosePrice("");
        setNotes("");
        await fetchTrades();
      } else {
        alert(json.error || "Trade save karne mein error aaya.");
      }
    } catch (err: any) {
      console.error("Client Submission Exception:", err);
      alert("Network error: Server response nahi mila.");
    } finally {
      setSubmitting(false);
    }
  };

  // Custom Calendar Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const newD = new Date(selectedDate);
    newD.setFullYear(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDate(newD);
  };

  const handleTimeChange = (type: "hours" | "minutes", value: number) => {
    const newD = new Date(selectedDate);
    if (type === "hours") newD.setHours(value);
    if (type === "minutes") newD.setMinutes(value);
    setSelectedDate(newD);
  };

  const formattedDisplayDate = selectedDate.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-6xl mx-auto space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">VALT Trade Journal</h1>
          <p className="text-xs text-neutral-400 mt-1">Manual Trade Logging & Psychology Insights</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            disabled
            className="opacity-70 cursor-not-allowed bg-neutral-900 text-neutral-400 border border-neutral-800 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            Auto MT5 Sync (Coming Soon)
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-3.5 py-2 rounded-lg text-xs transition-all shadow-lg shadow-emerald-500/10"
          >
            <PlusCircle className="h-4 w-4" /> Log Manual Trade
          </button>

          <button
            onClick={fetchTrades}
            className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-neutral-300 px-3 py-2 rounded-lg text-xs hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Trades Table */}
      <div className="border border-neutral-800 bg-[#0B0B0B] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800 uppercase text-[10px]">
            <tr>
              <th className="p-3">Ticket / Pair</th>
              <th className="p-3">Type</th>
              <th className="p-3">Volume</th>
              <th className="p-3">Price (Open/Close)</th>
              <th className="p-3">PnL</th>
              <th className="p-3">Strategy</th>
              <th className="p-3">Psychology</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-neutral-500">
                  Fetching trades...
                </td>
              </tr>
            ) : trades.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-neutral-500">
                  No trades logged yet. Click <span className="text-emerald-400 font-bold">"Log Manual Trade"</span> to add your first trade.
                </td>
              </tr>
            ) : (
              trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{trade.symbol}</div>
                    <div className="text-[10px] text-neutral-500">#{trade.ticket_id || "MANUAL"}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trade.trade_type === "BUY"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {trade.trade_type}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-300">{trade.volume} Lots</td>
                  <td className="p-3 text-neutral-300">
                    {trade.open_price} &rarr; {trade.close_price || "N/A"}
                  </td>
                  <td className="p-3 font-bold">
                    <span className={Number(trade.profit || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}>
                      {Number(trade.profit || 0) >= 0 ? `+$${trade.profit}` : `-$${Math.abs(Number(trade.profit))}`}
                    </span>
                  </td>
                  <td className="p-3 text-neutral-400">
                    {trade.strategy ? (
                      <span className="bg-neutral-800 text-neutral-200 px-2 py-1 rounded text-[10px]">
                        {trade.strategy}
                      </span>
                    ) : (
                      <span className="text-neutral-600 text-[10px] italic">Not Tagged</span>
                    )}
                  </td>
                  <td className="p-3 text-neutral-400">
                    {trade.psychology || trade.emotion ? (
                      <span className="text-neutral-300 text-[10px]">{trade.psychology || trade.emotion}</span>
                    ) : (
                      <span className="text-neutral-600 text-[10px] italic">-</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedTrade(trade)}
                        className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black p-2 rounded-lg transition-all"
                        title="Edit Trade"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTrade(trade.id)}
                        className="bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-all"
                        title="Delete Trade"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Trade Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <h2 className="text-sm font-bold text-emerald-400 uppercase flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Log Manual Trade
              </h2>
              <button 
                onClick={() => setIsManualModalOpen(false)} 
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualTrade} className="space-y-3">
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">
                    Trade Date & Time
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      setSelectedDate(now);
                      setViewDate(now);
                    }}
                    className="text-[10px] text-neutral-400 hover:text-emerald-400 underline transition-colors"
                  >
                    Reset to Now
                  </button>
                </div>

                <div
                  onClick={() => setShowPicker(!showPicker)}
                  className="w-full bg-neutral-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all shadow-inner group"
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-xs text-emerald-400 font-mono font-medium">
                      {formattedDisplayDate}
                    </span>
                  </div>
                  <Clock className="h-3.5 w-3.5 text-neutral-500 group-hover:text-emerald-400 transition-colors" />
                </div>

                {showPicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0E0E0E] border border-emerald-500/30 rounded-xl p-4 shadow-2xl space-y-4 backdrop-blur-xl animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        {viewDate.toLocaleString("en-US", { month: "long", year: "numeric" })}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px]">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div key={d} className="text-neutral-500 font-semibold py-1">
                          {d}
                        </div>
                      ))}

                      {Array.from({ length: firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}

                      {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                        const dayNum = i + 1;
                        const isSelected =
                          selectedDate.getDate() === dayNum &&
                          selectedDate.getMonth() === viewDate.getMonth() &&
                          selectedDate.getFullYear() === viewDate.getFullYear();

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => handleDateSelect(dayNum)}
                            className={`py-1.5 rounded-lg text-xs transition-all ${
                              isSelected
                                ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20"
                                : "hover:bg-neutral-800 text-neutral-300"
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-neutral-800 pt-3 flex items-center justify-between font-mono">
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-emerald-400" /> Time (24h)
                      </span>
                      <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
                        <input
                          type="number"
                          min={0}
                          max={23}
                          value={selectedDate.getHours()}
                          onChange={(e) => handleTimeChange("hours", Math.max(0, Math.min(23, Number(e.target.value))))}
                          className="w-10 bg-black text-center text-xs text-emerald-400 font-bold rounded p-1 outline-none border border-neutral-800 focus:border-emerald-500"
                        />
                        <span className="text-neutral-500 font-bold">:</span>
                        <input
                          type="number"
                          min={0}
                          max={59}
                          value={selectedDate.getMinutes()}
                          onChange={(e) => handleTimeChange("minutes", Math.max(0, Math.min(59, Number(e.target.value))))}
                          className="w-10 bg-black text-center text-xs text-emerald-400 font-bold rounded p-1 outline-none border border-neutral-800 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPicker(false)}
                      className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs py-1.5 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Symbol / Pair</label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white uppercase focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Trade Type</label>
                  <select
                    value={tradeType}
                    onChange={(e) => setTradeType(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Volume (Lots)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Profit / Loss ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 150 or -50"
                    value={profit}
                    onChange={(e) => setProfit(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Open Price</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="2650.50"
                    value={openPrice}
                    onChange={(e) => setOpenPrice(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Close Price</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="2662.10"
                    value={closePrice}
                    onChange={(e) => setClosePrice(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Strategy</label>
                  <input
                    type="text"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1">Psychology Tag</label>
                  <select
                    value={psychology}
                    onChange={(e) => setPsychology(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="Disciplined / Planned">Disciplined / Planned</option>
                    <option value="FOMO Entry">FOMO Entry</option>
                    <option value="Revenge Trade">Revenge Trade</option>
                    <option value="Early Exit">Early Exit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Order block entry at 15m TF..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-500/10 mt-2"
              >
                {submitting ? "Saving Trade..." : "Save Trade to Journal"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal Component */}
      {selectedTrade && (
        <EditTradeModal
          trade={selectedTrade}
          isOpen={!!selectedTrade}
          onClose={() => setSelectedTrade(null)}
          onSave={handleSaveTrade}
        />
      )}
    </div>
  );
}