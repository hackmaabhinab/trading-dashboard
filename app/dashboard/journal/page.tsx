"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Filter, Trash2 } from "lucide-react";

interface TradeLog {
  id?: number;
  pair: string;
  lot_size: number;
  entry_price?: number;
  stop_loss?: number;
  take_profit?: number;
  risk_percent: number;
  rr: number;
  outcome: "WIN" | "LOSS" | "BE";
  emotion: string;
  setup: string;
  notes: string;
  created_at?: string;
}

export default function JournalPage() {
  const [logs, setLogs] = useState<TradeLog[]>([]);
  const [pair, setPair] = useState("XAUUSD");
  const [lotSize, setLotSize] = useState("0.10");
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [riskPercent, setRiskPercent] = useState("1.0");
  const [rr, setRr] = useState("3.0");
  const [outcome, setOutcome] = useState<"WIN" | "LOSS" | "BE">("WIN");
  const [emotion, setEmotion] = useState("Disciplined");
  const [setup, setSetup] = useState("SMC Order Block");
  const [notes, setNotes] = useState("");

  const [activeFilter, setActiveFilter] = useState<"ALL" | "WIN" | "LOSS" | "BE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Load existing data
  useEffect(() => {
    const savedLogs = localStorage.getItem("trade_journal_logs");
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (err) {
        console.error("Failed to parse local logs:", err);
      }
    }

    // Supabase Sync
    supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setLogs(data);
          localStorage.setItem("trade_journal_logs", JSON.stringify(data));
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTradePayload = {
      pair: pair.trim() || "XAUUSD",
      lot_size: parseFloat(lotSize) || 0.01,
      entry_price: entryPrice ? parseFloat(entryPrice) : undefined,
      stop_loss: stopLoss ? parseFloat(stopLoss) : undefined,
      take_profit: takeProfit ? parseFloat(takeProfit) : undefined,
      risk_percent: parseFloat(riskPercent) || 1.0,
      rr: parseFloat(rr) || 1.0,
      outcome,
      emotion,
      setup: setup.trim() || "General",
      notes: notes.trim(),
    };

    // 1. Immediate UI State Update
    const updatedLogs = [newTradePayload as TradeLog, ...logs];
    setLogs(updatedLogs);

    // 2. Immediate LocalStorage Save
    localStorage.setItem("trade_journal_logs", JSON.stringify(updatedLogs));

    // Reset notes
    setNotes("");

    // 3. Supabase Background Sync
    try {
      const { error } = await supabase.from("trades").insert([newTradePayload]);
      if (error) console.error("Database Insert Error:", error.message);
    } catch (err: unknown) {
      console.error("Database Connection Exception:", err);
    }
  };

  const handleDelete = async (indexToDelete: number, logId?: number) => {
    if (!confirm("Are you sure you want to delete this log?")) return;

    // 1. UI aur LocalStorage se instant delete
    const updatedLogs = logs.filter((_, idx) => idx !== indexToDelete);
    setLogs(updatedLogs);
    localStorage.setItem("trade_journal_logs", JSON.stringify(updatedLogs));

    // 2. Database se delete agar ID available ho
    if (logId) {
      try {
        const { error } = await supabase.from("trades").delete().eq("id", logId);
        if (error) console.error("Database Delete Error:", error.message);
      } catch (err: unknown) {
        console.error("Database Delete Exception:", err);
      }
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = activeFilter === "ALL" || log.outcome === activeFilter;
    const matchesSearch =
      log.pair.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.setup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.notes.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-8 bg-[#070A10] min-h-screen text-slate-100">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trade Journal</h1>
        <p className="text-slate-400 text-sm">Execution entry & institutional trade management</p>
      </div>

      <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="text-blue-500 font-semibold text-sm">⊕ New Execution Entry</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">PAIR</label>
              <input
                type="text"
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">LOT SIZE</label>
              <input
                type="number"
                step="0.01"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">SETUP TYPE</label>
              <input
                type="text"
                value={setup}
                onChange={(e) => setSetup(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">OUTCOME</label>
              <select
                value={outcome}
                onChange={(e) => setOutcome(e.target.value as "WIN" | "LOSS" | "BE")}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="WIN">WIN</option>
                <option value="LOSS">LOSS</option>
                <option value="BE">BE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">RISK %</label>
              <input
                type="number"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">R:R RATIO</label>
              <input
                type="number"
                step="0.1"
                value={rr}
                onChange={(e) => setRr(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">EMOTION STATE</label>
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Disciplined">Disciplined</option>
                <option value="Calm">Calm</option>
                <option value="Greedy">Greedy</option>
                <option value="Fearful">Fearful</option>
                <option value="FOMO">FOMO</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">ENTRY PRICE</label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full flex-1">
              <label className="block text-xs font-semibold text-slate-400 mb-1">CONFLUENCES / NOTES</label>
              <input
                type="text"
                placeholder="Enter confluences or trade notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto self-end bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Log Execution
            </button>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0B0F17] border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search pair or setup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070A10] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            {(["ALL", "WIN", "LOSS", "BE"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeFilter === type
                    ? "bg-blue-600 text-white"
                    : "bg-[#070A10] text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-[#070A10] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">PAIR</th>
                <th className="py-3 px-4">LOT</th>
                <th className="py-3 px-4">SETUP</th>
                <th className="py-3 px-4">RISK</th>
                <th className="py-3 px-4">R:R</th>
                <th className="py-3 px-4">EMOTION</th>
                <th className="py-3 px-4">OUTCOME</th>
                <th className="py-3 px-4">NOTES</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-6 text-center text-slate-500">
                    No trade logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-slate-900/50">
                    <td className="py-3 px-4 font-bold text-white">{log.pair}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">{log.lot_size}</td>
                    <td className="py-3 px-4 text-blue-400">{log.setup}</td>
                    <td className="py-3 px-4">{log.risk_percent}%</td>
                    <td className="py-3 px-4 font-semibold">{log.rr}</td>
                    <td className="py-3 px-4 text-xs font-medium text-slate-400">{log.emotion}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          log.outcome === "WIN"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : log.outcome === "LOSS"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                        }`}
                      >
                        {log.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{log.notes || "-"}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(index, log.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                        title="Delete trade entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}