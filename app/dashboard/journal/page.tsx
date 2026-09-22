"use client";

import React, { useState, useEffect, useRef } from "react";
import EditTradeModal from "@/components/EditTradeModal";
import { 
  Edit2, RefreshCw, PlusCircle, X, Calendar, Clock, 
  ChevronLeft, ChevronRight, Trash2, BookOpen, Check, ChevronDown, Filter
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useConfirm } from "@/app/dashboard/layout";

const supabase = createClient();

const TRADE_TYPE_OPTIONS = [
  "BUY",
  "SELL",
  "BUY LIMIT",
  "SELL LIMIT",
  "BUY STOP",
  "SELL STOP"
];

const PSYCHOLOGY_OPTIONS = [
  "Disciplined / Planned",
  "FOMO Entry",
  "Revenge Trade",
  "Early Exit",
  "Over-leveraged",
  "Greed / Late Take Profit"
];

export default function JournalPage() {
  const { confirm, showAlert } = useConfirm();

  const [trades, setTrades] = useState<any[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterStyle, setFilterStyle] = useState("ALL");
  const [filterBreakeven, setFilterBreakeven] = useState("ALL");
  const [filterLearning, setFilterLearning] = useState("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  // Custom Filter Popover States
  const [isFilterFromDateOpen, setIsFilterFromDateOpen] = useState(false);
  const [isFilterToDateOpen, setIsFilterToDateOpen] = useState(false);
  const [isFilterStyleOpen, setIsFilterStyleOpen] = useState(false);
  const [isFilterBreakevenOpen, setIsFilterBreakevenOpen] = useState(false);
  const [isFilterLearningOpen, setIsFilterLearningOpen] = useState(false);
  
  const [filterFromDateView, setFilterFromDateView] = useState<Date>(new Date());
  const [filterToDateView, setFilterToDateView] = useState<Date>(new Date());

  // Manual Trade Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Custom Date/Time State
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const [exitDate, setExitDate] = useState<Date>(new Date());
  const [activePicker, setActivePicker] = useState<"entry" | "exit" | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  // Form Fields
  const [symbol, setSymbol] = useState("XAUUSD");
  const [tradeType, setTradeType] = useState("BUY");
  const [isTradeTypeDropdownOpen, setIsTradeTypeDropdownOpen] = useState(false);
  const [volume, setVolume] = useState("0.10");
  const [openPrice, setOpenPrice] = useState("");
  const [closePrice, setClosePrice] = useState("");

  // SL, TP & R:R States
  const [stopLoss, setStopLoss] = useState("");
  const [takeProfit, setTakeProfit] = useState("");
  const [riskReward, setRiskReward] = useState("");

  const [profit, setProfit] = useState("");
  const [strategy, setStrategy] = useState("SMC / ICT");
  
  // New Fields: Trade Style & Breakeven
  const [tradeStyle, setTradeStyle] = useState("Intraday");
  const [isBreakeven, setIsBreakeven] = useState(false);

  // Multi-select Psychology State
  const [selectedPsychologies, setSelectedPsychologies] = useState<string[]>(["Disciplined / Planned"]);
  const [isPsychologyDropdownOpen, setIsPsychologyDropdownOpen] = useState(false);
  
  const [isLearningTrade, setIsLearningTrade] = useState(false);
  const [notes, setNotes] = useState("");

  const psychDropdownRef = useRef<HTMLDivElement>(null);
  const tradeTypeDropdownRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Auto-calculate Risk to Reward Ratio
  useEffect(() => {
    const entry = parseFloat(openPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(takeProfit);

    if (entry && sl && tp) {
      const risk = Math.abs(entry - sl);
      const reward = Math.abs(tp - entry);

      if (risk > 0) {
        const ratio = (reward / risk).toFixed(2);
        setRiskReward(`1:${ratio}`);
      }
    }
  }, [openPrice, stopLoss, takeProfit]);

  // Click outside listener for closing dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (psychDropdownRef.current && !psychDropdownRef.current.contains(event.target as Node)) {
        setIsPsychologyDropdownOpen(false);
      }
      if (tradeTypeDropdownRef.current && !tradeTypeDropdownRef.current.contains(event.target as Node)) {
        setIsTradeTypeDropdownOpen(false);
      }
      if (filterBarRef.current && !filterBarRef.current.contains(event.target as Node)) {
        closeAllFilterDropdowns();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeAllFilterDropdowns = () => {
    setIsFilterFromDateOpen(false);
    setIsFilterToDateOpen(false);
    setIsFilterStyleOpen(false);
    setIsFilterBreakevenOpen(false);
    setIsFilterLearningOpen(false);
  };

  // Set default live datetime whenever modal is opened
  useEffect(() => {
    if (isManualModalOpen) {
      const now = new Date();
      setEntryDate(now);
      setExitDate(now);
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
        showAlert({ title: "SUCCESS", message: "Trade updated successfully!", isSuccess: true });
      }
    } catch (err) {
      console.error("Failed to save trade:", err);
    }
  };

  const handleDeleteTrade = (tradeId: string) => {
    confirm({
      title: "DELETE TRADE",
      message: "Kya aap is trade ko delete karna chahte hain?",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from("trades")
            .delete()
            .eq("id", tradeId);

          if (error) {
            showAlert({ title: "DELETE ERROR", message: error.message });
            return;
          }

          setTrades((prev) => prev.filter((t) => t.id !== tradeId));
          showAlert({ title: "SUCCESS", message: "Trade deleted successfully!", isSuccess: true });
        } catch (err: any) {
          console.error("Delete exception:", err);
          showAlert({ title: "ERROR", message: "Trade delete karne mein problem aayi." });
        }
      }
    });
  };

  const togglePsychologyOption = (option: string) => {
    setSelectedPsychologies((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleAddManualTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const psychologyString = selectedPsychologies.length > 0 
      ? selectedPsychologies.join(", ") 
      : "Disciplined / Planned";

    try {
      const response = await fetch("/api/trades/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          trade_type: tradeType,
          volume: Number(volume),
          open_price: openPrice ? Number(openPrice) : null,
          close_price: closePrice ? Number(closePrice) : null,
          stop_loss: stopLoss ? Number(stopLoss) : null,
          take_profit: takeProfit ? Number(takeProfit) : null,
          risk_reward: riskReward,
          profit: Number(profit),
          strategy,
          trade_style: tradeStyle,
          is_breakeven: isBreakeven,
          psychology: psychologyString,
          is_learning_trade: isLearningTrade,
          notes,
          entry_at: entryDate.toISOString(),
          exit_at: exitDate.toISOString(),
          created_at: entryDate.toISOString(),
        }),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        showAlert({ title: "SUCCESS", message: "Trade saved successfully!", isSuccess: true });
        setIsManualModalOpen(false);
        setProfit("");
        setOpenPrice("");
        setClosePrice("");
        setStopLoss("");
        setTakeProfit("");
        setRiskReward("");
        setNotes("");
        setTradeStyle("Intraday");
        setIsBreakeven(false);
        setIsLearningTrade(false);
        setSelectedPsychologies(["Disciplined / Planned"]);
        await fetchTrades();
      } else {
        showAlert({ title: "SAVE ERROR", message: json.error || "Error saving trade" });
      }
    } catch (err: any) {
      showAlert({ title: "ERROR", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Calendar Helpers
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const targetDate = activePicker === "entry" ? entryDate : exitDate;
    const newD = new Date(targetDate);
    newD.setFullYear(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (activePicker === "entry") setEntryDate(newD);
    else setExitDate(newD);
  };

  const handleTimeChange = (type: "hours" | "minutes", value: number) => {
    const targetDate = activePicker === "entry" ? entryDate : exitDate;
    const newD = new Date(targetDate);
    if (type === "hours") newD.setHours(value);
    if (type === "minutes") newD.setMinutes(value);
    if (activePicker === "entry") setEntryDate(newD);
    else setExitDate(newD);
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const clearFilters = () => {
    setFilterStyle("ALL");
    setFilterBreakeven("ALL");
    setFilterLearning("ALL");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  // FILTER LOGIC
  const filteredTrades = trades.filter((trade) => {
    if (filterStyle !== "ALL" && trade.trade_style !== filterStyle) return false;
    
    if (filterBreakeven === "YES" && !trade.is_breakeven) return false;
    if (filterBreakeven === "NO" && trade.is_breakeven) return false;
    
    if (filterLearning === "YES" && !trade.is_learning_trade) return false;
    if (filterLearning === "NO" && trade.is_learning_trade) return false;

    if (filterDateFrom) {
      const tradeDate = new Date(trade.entry_at || trade.created_at).setHours(0,0,0,0);
      const fromDate = new Date(filterDateFrom).setHours(0,0,0,0);
      if (tradeDate < fromDate) return false;
    }

    if (filterDateTo) {
      const tradeDate = new Date(trade.entry_at || trade.created_at).setHours(0,0,0,0);
      const toDate = new Date(filterDateTo).setHours(0,0,0,0);
      if (tradeDate > toDate) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 w-full space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.3)] tracking-wider">
            VALT Trade Journal
          </h1>
          <p className="text-xs text-neutral-400 mt-1 font-bold">
            Manual Trade Logging & Institutional Psychology Insights
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            disabled
            className="opacity-70 cursor-not-allowed bg-neutral-900/90 text-neutral-400 border border-neutral-800 px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            Auto MT5 Sync (Coming Soon)
          </button>

          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)]"
          >
            <PlusCircle className="h-4 w-4" /> Log Manual Trade
          </button>

          <button
            onClick={fetchTrades}
            className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-neutral-300 p-2.5 rounded-xl text-xs hover:text-white hover:border-emerald-500/50 transition-all"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* FUTURESTIC FILTER BAR SECTION */}
      <div ref={filterBarRef} className="bg-[#0B0B0B] border border-neutral-800/80 rounded-2xl p-4 shadow-[0_0_25px_rgba(16,185,129,0.05)] space-y-4">
        {/* Header & Clear Button */}
        <div className="flex items-center justify-between border-b border-neutral-800/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Filter className="h-4 w-4 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold uppercase text-emerald-400 tracking-widest">
                Advanced Filters
              </h3>
              <p className="text-[10px] text-neutral-500 font-extrabold">
                Institutional Trade Filters
              </p>
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold transition-all uppercase tracking-wider flex items-center gap-1.5 hover:scale-105 active:scale-95"
          >
            <X className="h-3.5 w-3.5" /> Clear Filters
          </button>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative">
          
          {/* 1. CUSTOM FROM DATE PICKER */}
          <div className="relative">
            <label className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-emerald-400" /> From Date
            </label>
            <button
              type="button"
              onClick={() => {
                closeAllFilterDropdowns();
                setIsFilterFromDateOpen(!isFilterFromDateOpen);
              }}
              className={`w-full bg-neutral-900 border ${filterDateFrom ? "border-emerald-500/60 text-emerald-400" : "border-neutral-800 text-neutral-400"} rounded-xl p-2.5 text-xs font-extrabold text-left flex items-center justify-between transition-all hover:border-emerald-500/50 shadow-inner`}
            >
              <span>{filterDateFrom || "Select Date"}</span>
              <Calendar className="h-3.5 w-3.5 text-neutral-500" />
            </button>

            {isFilterFromDateOpen && (
              <div className="absolute left-0 top-full mt-2 z-50 w-64 bg-[#0E0E0E] border border-emerald-500/40 rounded-2xl p-3.5 shadow-[0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-extrabold text-emerald-400 tracking-wider uppercase">
                    {filterFromDateView.toLocaleString("en-US", { month: "short", year: "numeric" })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFilterFromDateView(new Date(filterFromDateView.getFullYear(), filterFromDateView.getMonth() - 1, 1))}
                      className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterFromDateView(new Date(filterFromDateView.getFullYear(), filterFromDateView.getMonth() + 1, 1))}
                      className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="text-neutral-500 font-bold py-1">{d}</div>
                  ))}
                  {Array.from({ length: firstDayOfMonth(filterFromDateView.getFullYear(), filterFromDateView.getMonth()) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth(filterFromDateView.getFullYear(), filterFromDateView.getMonth()) }).map((_, i) => {
                    const day = i + 1;
                    const formattedDate = `${filterFromDateView.getFullYear()}-${String(filterFromDateView.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = filterDateFrom === formattedDate;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setFilterDateFrom(formattedDate);
                          setIsFilterFromDateOpen(false);
                        }}
                        className={`py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                            : "hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. CUSTOM TO DATE PICKER */}
          <div className="relative">
            <label className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar className="h-3 w-3 text-emerald-400" /> To Date
            </label>
            <button
              type="button"
              onClick={() => {
                closeAllFilterDropdowns();
                setIsFilterToDateOpen(!isFilterToDateOpen);
              }}
              className={`w-full bg-neutral-900 border ${filterDateTo ? "border-emerald-500/60 text-emerald-400" : "border-neutral-800 text-neutral-400"} rounded-xl p-2.5 text-xs font-extrabold text-left flex items-center justify-between transition-all hover:border-emerald-500/50 shadow-inner`}
            >
              <span>{filterDateTo || "Select Date"}</span>
              <Calendar className="h-3.5 w-3.5 text-neutral-500" />
            </button>

            {isFilterToDateOpen && (
              <div className="absolute left-0 top-full mt-2 z-50 w-64 bg-[#0E0E0E] border border-emerald-500/40 rounded-2xl p-3.5 shadow-[0_0_30px_rgba(0,0,0,0.9)] backdrop-blur-xl space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span className="text-xs font-extrabold text-emerald-400 tracking-wider uppercase">
                    {filterToDateView.toLocaleString("en-US", { month: "short", year: "numeric" })}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setFilterToDateView(new Date(filterToDateView.getFullYear(), filterToDateView.getMonth() - 1, 1))}
                      className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterToDateView(new Date(filterToDateView.getFullYear(), filterToDateView.getMonth() + 1, 1))}
                      className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="text-neutral-500 font-bold py-1">{d}</div>
                  ))}
                  {Array.from({ length: firstDayOfMonth(filterToDateView.getFullYear(), filterToDateView.getMonth()) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth(filterToDateView.getFullYear(), filterToDateView.getMonth()) }).map((_, i) => {
                    const day = i + 1;
                    const formattedDate = `${filterToDateView.getFullYear()}-${String(filterToDateView.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isSelected = filterDateTo === formattedDate;

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          setFilterDateTo(formattedDate);
                          setIsFilterToDateOpen(false);
                        }}
                        className={`py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          isSelected
                            ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                            : "hover:bg-neutral-800 text-neutral-300 hover:text-emerald-400"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. CUSTOM TRADE STYLE DROPDOWN */}
          <div className="relative">
            <label className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mb-1">
              Trade Style
            </label>
            <button
              type="button"
              onClick={() => {
                closeAllFilterDropdowns();
                setIsFilterStyleOpen(!isFilterStyleOpen);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-extrabold text-emerald-400 text-left flex items-center justify-between transition-all hover:border-emerald-500/50 shadow-inner"
            >
              <span>{filterStyle === "ALL" ? "⚡ All Styles" : filterStyle}</span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </button>

            {isFilterStyleOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0E0E0E] border border-emerald-500/40 rounded-2xl p-1.5 shadow-[0_0_25px_rgba(0,0,0,0.9)] space-y-1 backdrop-blur-xl">
                {[
                  { label: "⚡ All Styles", val: "ALL" },
                  { label: "Scalp", val: "Scalp" },
                  { label: "Intraday", val: "Intraday" },
                  { label: "Swing", val: "Swing" }
                ].map((item) => (
                  <div
                    key={item.val}
                    onClick={() => {
                      setFilterStyle(item.val);
                      setIsFilterStyleOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center justify-between ${
                      filterStyle === item.val
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "hover:bg-neutral-800 text-neutral-300 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {filterStyle === item.val && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4. CUSTOM BREAKEVEN DROPDOWN */}
          <div className="relative">
            <label className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mb-1">
              Breakeven
            </label>
            <button
              type="button"
              onClick={() => {
                closeAllFilterDropdowns();
                setIsFilterBreakevenOpen(!isFilterBreakevenOpen);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-extrabold text-cyan-400 text-left flex items-center justify-between transition-all hover:border-cyan-500/50 shadow-inner"
            >
              <span>
                {filterBreakeven === "ALL" ? "All Trades" : filterBreakeven === "YES" ? "Yes (BE Only)" : "No (Non BE)"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </button>

            {isFilterBreakevenOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0E0E0E] border border-cyan-500/40 rounded-2xl p-1.5 shadow-[0_0_25px_rgba(0,0,0,0.9)] space-y-1 backdrop-blur-xl">
                {[
                  { label: "All Trades", val: "ALL" },
                  { label: "Yes (BE Only)", val: "YES" },
                  { label: "No (Non BE)", val: "NO" }
                ].map((item) => (
                  <div
                    key={item.val}
                    onClick={() => {
                      setFilterBreakeven(item.val);
                      setIsFilterBreakevenOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center justify-between ${
                      filterBreakeven === item.val
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "hover:bg-neutral-800 text-neutral-300 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {filterBreakeven === item.val && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. CUSTOM LEARNING TAG DROPDOWN */}
          <div className="relative">
            <label className="block text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider mb-1">
              Learning Tag
            </label>
            <button
              type="button"
              onClick={() => {
                closeAllFilterDropdowns();
                setIsFilterLearningOpen(!isFilterLearningOpen);
              }}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs font-extrabold text-amber-400 text-left flex items-center justify-between transition-all hover:border-amber-500/50 shadow-inner"
            >
              <span>
                {filterLearning === "ALL" ? "All Trades" : filterLearning === "YES" ? "Yes (Learning)" : "No (Standard)"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
            </button>

            {isFilterLearningOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#0E0E0E] border border-amber-500/40 rounded-2xl p-1.5 shadow-[0_0_25px_rgba(0,0,0,0.9)] space-y-1 backdrop-blur-xl">
                {[
                  { label: "All Trades", val: "ALL" },
                  { label: "Yes (Learning)", val: "YES" },
                  { label: "No (Standard)", val: "NO" }
                ].map((item) => (
                  <div
                    key={item.val}
                    onClick={() => {
                      setFilterLearning(item.val);
                      setIsFilterLearningOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all flex items-center justify-between ${
                      filterLearning === item.val
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "hover:bg-neutral-800 text-neutral-300 hover:text-white"
                    }`}
                  >
                    <span>{item.label}</span>
                    {filterLearning === item.val && <Check className="h-3.5 w-3.5 text-amber-400" />}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Trades Table */}
      <div className="border border-neutral-800/80 bg-[#0B0B0B] rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/5">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-neutral-900/90 text-neutral-300 border-b border-neutral-800 uppercase text-[10px] font-extrabold tracking-wider">
              <tr>
                <th className="p-4">Ticket / Pair</th>
                <th className="p-4">Type / Style</th>
                <th className="p-4">Volume</th>
                <th className="p-4">R : R</th>
                <th className="p-4">PnL</th>
                <th className="p-4">Strategy</th>
                <th className="p-4">Psychology</th>
                <th className="p-4 text-center">Tags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-bold">
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-neutral-500 font-bold">
                    Fetching trades...
                  </td>
                </tr>
              ) : filteredTrades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-neutral-500 font-bold">
                    No trades match current filters.
                  </td>
                </tr>
              ) : (
                filteredTrades.map((trade) => {
                  const isLearning = trade.is_learning_trade === true || trade.is_learning_trade === "true";
                  const isBE = trade.is_breakeven === true || trade.is_breakeven === "true";
                  
                  return (
                    <tr key={trade.id} className="hover:bg-neutral-900/50 transition-colors group">
                      <td className="p-4">
                        <div className="font-extrabold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {trade.symbol}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-extrabold">
                          #{trade.ticket_id || "MANUAL"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider ${
                              trade.trade_type?.startsWith("BUY")
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                            }`}
                          >
                            {trade.trade_type}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-extrabold uppercase border border-neutral-700 bg-neutral-900 px-1.5 py-0.5 rounded">
                            {trade.trade_style || "Intraday"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-200 font-extrabold">{trade.volume} Lots</td>
                      <td className="p-4 text-neutral-300 font-extrabold">
                        {trade.risk_reward ? (
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-md text-[11px] font-extrabold">
                            {trade.risk_reward}
                          </span>
                        ) : (
                          <span className="text-neutral-600 text-[11px] font-normal">-</span>
                        )}
                      </td>
                      <td className="p-4 font-extrabold text-sm">
                        <span className={Number(trade.profit || 0) >= 0 ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]" : "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.2)]"}>
                          {Number(trade.profit || 0) >= 0 ? `+$${trade.profit}` : `-$${Math.abs(Number(trade.profit))}`}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400">
                        {trade.strategy ? (
                          <span className="bg-neutral-800/90 text-neutral-200 px-2.5 py-1 rounded-md text-[10px] font-extrabold border border-neutral-700/50">
                            {trade.strategy}
                          </span>
                        ) : (
                          <span className="text-neutral-600 text-[10px] italic font-normal">Not Tagged</span>
                        )}
                      </td>
                      <td className="p-4 text-neutral-300">
                        {trade.psychology || trade.emotion ? (
                          <span className="text-neutral-200 text-[11px] font-bold max-w-[150px] block truncate" title={trade.psychology || trade.emotion}>
                            {trade.psychology || trade.emotion}
                          </span>
                        ) : (
                          <span className="text-neutral-600 text-[10px] italic font-normal">-</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col gap-1 items-center justify-center">
                          {isBE && (
                            <span className="inline-flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md text-[9px] font-extrabold shadow-[0_0_8px_rgba(6,182,212,0.15)] uppercase">
                              <Check className="h-2.5 w-2.5" /> BE
                            </span>
                          )}
                          {isLearning && (
                            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md text-[9px] font-extrabold shadow-[0_0_8px_rgba(245,158,11,0.15)] uppercase">
                              <BookOpen className="h-2.5 w-2.5" /> LRN
                            </span>
                          )}
                          {!isBE && !isLearning && (
                            <span className="text-neutral-600 text-[10px] font-bold">-</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Trade Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-[#0B0B0B] border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-[0_0_35px_rgba(16,185,129,0.15)] relative my-8 font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                <PlusCircle className="h-4 w-4" /> Log Manual Trade
              </h2>
              <button 
                onClick={() => setIsManualModalOpen(false)} 
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualTrade} className="space-y-4">
              {/* Entry & Exit Date Time Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                <div>
                  <label className="block text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider mb-1">
                    Entry Date & Time
                  </label>
                  <div
                    onClick={() => setActivePicker(activePicker === "entry" ? null : "entry")}
                    className="w-full bg-neutral-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all shadow-inner group"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] text-emerald-400 font-bold">
                        {formatDateDisplay(entryDate)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider mb-1">
                    Exit Date & Time
                  </label>
                  <div
                    onClick={() => setActivePicker(activePicker === "exit" ? null : "exit")}
                    className="w-full bg-neutral-900 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition-all shadow-inner group"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[11px] text-emerald-400 font-bold">
                        {formatDateDisplay(exitDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date Picker Popup */}
                {activePicker && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0E0E0E] border border-emerald-500/40 rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.9)] space-y-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="text-xs font-extrabold text-white uppercase tracking-wider">
                        {viewDate.toLocaleString("en-US", { month: "long", year: "numeric" })} ({activePicker.toUpperCase()})
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

                    <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                        <div key={d} className="text-neutral-500 font-bold py-1">
                          {d}
                        </div>
                      ))}

                      {Array.from({ length: firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                        <div key={`empty-${i}`} />
                      ))}

                      {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                        const dayNum = i + 1;
                        const currTarget = activePicker === "entry" ? entryDate : exitDate;
                        const isSelected =
                          currTarget.getDate() === dayNum &&
                          currTarget.getMonth() === viewDate.getMonth() &&
                          currTarget.getFullYear() === viewDate.getFullYear();

                        return (
                          <button
                            key={dayNum}
                            type="button"
                            onClick={() => handleDateSelect(dayNum)}
                            className={`py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                              isSelected
                                ? "bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                : "hover:bg-neutral-800 text-neutral-300"
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 font-extrabold flex items-center gap-1">
                        <Clock className="h-3 w-3 text-emerald-400" /> Time (24h)
                      </span>
                      <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
                        <input
                          type="number"
                          min={0}
                          max={23}
                          value={(activePicker === "entry" ? entryDate : exitDate).getHours()}
                          onChange={(e) => handleTimeChange("hours", Math.max(0, Math.min(23, Number(e.target.value))))}
                          className="w-10 bg-black text-center text-xs text-emerald-400 font-extrabold rounded p-1 outline-none border border-neutral-800 focus:border-emerald-500"
                        />
                        <span className="text-neutral-500 font-extrabold">:</span>
                        <input
                          type="number"
                          min={0}
                          max={59}
                          value={(activePicker === "entry" ? entryDate : exitDate).getMinutes()}
                          onChange={(e) => handleTimeChange("minutes", Math.max(0, Math.min(59, Number(e.target.value))))}
                          className="w-10 bg-black text-center text-xs text-emerald-400 font-extrabold rounded p-1 outline-none border border-neutral-800 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePicker(null)}
                      className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-xs py-1.5 rounded-lg hover:bg-emerald-500 hover:text-black transition-all"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Symbol & Custom Trade Type Dropdown */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Symbol / Pair</label>
                  <input
                    type="text"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white uppercase focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="relative" ref={tradeTypeDropdownRef}>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Trade Type</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTradeTypeDropdownOpen(!isTradeTypeDropdownOpen);
                      setIsPsychologyDropdownOpen(false);
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-left text-white focus:border-emerald-500 flex items-center justify-between"
                  >
                    <span className={tradeType.startsWith("BUY") ? "text-emerald-400" : "text-rose-400"}>
                      {tradeType}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                  </button>

                  {isTradeTypeDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#0E0E0E] border border-emerald-500/40 rounded-xl p-1.5 shadow-2xl space-y-1">
                      {TRADE_TYPE_OPTIONS.map((opt) => (
                        <div
                          key={opt}
                          onClick={() => {
                            setTradeType(opt);
                            setIsTradeTypeDropdownOpen(false);
                          }}
                          className={`px-3 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all flex items-center justify-between ${
                            tradeType === opt
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "hover:bg-neutral-800 text-neutral-200"
                          }`}
                        >
                          <span className={opt.startsWith("BUY") ? "text-emerald-400" : "text-rose-400"}>
                            {opt}
                          </span>
                          {tradeType === opt && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Trade Style Glowing Buttons */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-extrabold text-emerald-400 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                  ⚡ Trade Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["Scalp", "Intraday", "Swing"].map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setTradeStyle(style)}
                      className={`py-2 rounded-xl text-xs font-mono font-extrabold border transition-all uppercase tracking-widest ${
                        tradeStyle === style
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-[1.02]"
                          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume & Profit */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Volume (Lots)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Profit / Loss ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 150 or -50"
                    value={profit}
                    onChange={(e) => setProfit(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Open & Close Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Open Price</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="2650.50"
                    value={openPrice}
                    onChange={(e) => setOpenPrice(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Close Price</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="2662.10"
                    value={closePrice}
                    onChange={(e) => setClosePrice(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Stop Loss (SL), Take Profit (TP) & Risk:Reward */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Stop Loss (SL)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="2640.00"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Take Profit (TP)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="2680.00"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Risk : Reward</label>
                  <input
                    type="text"
                    placeholder="1:2.5"
                    value={riskReward}
                    onChange={(e) => setRiskReward(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-emerald-400 rounded-lg p-2.5 text-xs font-extrabold focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Strategy & Multi-Select Psychology Dropdown */}
              <div className="grid grid-cols-2 gap-3 relative">
                <div>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Strategy</label>
                  <input
                    type="text"
                    value={strategy}
                    onChange={(e) => setStrategy(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="relative" ref={psychDropdownRef}>
                  <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Psychology Tags</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPsychologyDropdownOpen(!isPsychologyDropdownOpen);
                      setIsTradeTypeDropdownOpen(false);
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-left text-white focus:border-emerald-500 flex items-center justify-between truncate"
                  >
                    <span className="truncate">
                      {selectedPsychologies.length > 0
                        ? `${selectedPsychologies.length} Selected`
                        : "Select Issues"}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 text-neutral-400 shrink-0 ml-1" />
                  </button>

                  {isPsychologyDropdownOpen && (
                    <div className="absolute right-0 left-0 bottom-full mb-1 z-50 bg-[#0E0E0E] border border-emerald-500/40 rounded-xl p-2 shadow-2xl space-y-1 max-h-56 overflow-y-auto">
                      <div className="text-[10px] text-neutral-400 font-extrabold px-2 py-1 border-b border-neutral-800 uppercase">
                        Select Psychological Issues
                      </div>
                      {PSYCHOLOGY_OPTIONS.map((opt) => {
                        const isChecked = selectedPsychologies.includes(opt);
                        return (
                          <div
                            key={opt}
                            onClick={() => togglePsychologyOption(opt)}
                            className={`px-2.5 py-2 rounded-lg text-xs font-extrabold cursor-pointer transition-all flex items-center justify-between ${
                              isChecked
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "hover:bg-neutral-800 text-neutral-300"
                            }`}
                          >
                            <span>{opt}</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="accent-emerald-500 h-3.5 w-3.5 rounded cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Glowing Mark Tags */}
              <div className="space-y-2.5 pt-2">
                {/* Breakeven Toggle */}
                <div 
                  onClick={() => setIsBreakeven(!isBreakeven)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none shadow-[0_0_12px_rgba(0,0,0,0.6)] ${
                    isBreakeven 
                      ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.01]" 
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-cyan-500/30 hover:text-cyan-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Check className={`h-4 w-4 ${isBreakeven ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" : "text-neutral-500"}`} />
                    <span className={`text-xs font-extrabold uppercase tracking-widest ${isBreakeven ? "drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" : ""}`}>
                      MARK AS BREAKEVEN
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isBreakeven} 
                    onChange={() => {}} 
                    className="accent-cyan-500 h-4 w-4 cursor-pointer"
                  />
                </div>

                {/* Learning Trade Toggle */}
                <div 
                  onClick={() => setIsLearningTrade(!isLearningTrade)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between select-none shadow-[0_0_12px_rgba(0,0,0,0.6)] ${
                    isLearningTrade 
                      ? "bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)] scale-[1.01]" 
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className={`h-4 w-4 ${isLearningTrade ? "text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" : "text-neutral-500"}`} />
                    <span className={`text-xs font-extrabold uppercase tracking-widest ${isLearningTrade ? "drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]" : ""}`}>
                      MARK AS LEARNING TRADE
                    </span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isLearningTrade} 
                    onChange={() => {}} 
                    className="accent-amber-500 h-4 w-4 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-neutral-200 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Order block entry at 15m TF..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs font-extrabold text-white focus:border-emerald-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-2 uppercase tracking-wider"
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