"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, Calendar, Clock, ChevronLeft, ChevronRight, 
  BookOpen, Check, ChevronDown, Save 
} from "lucide-react";

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

interface EditTradeModalProps {
  trade: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTrade: any) => Promise<void>;
}

export default function EditTradeModal({ trade, isOpen, onClose, onSave }: EditTradeModalProps) {
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [symbol, setSymbol] = useState("");
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
  
  // Trade Style & Breakeven States
  const [tradeStyle, setTradeStyle] = useState("Intraday");
  const [isBreakeven, setIsBreakeven] = useState(false);

  // Multi-select Psychology State
  const [selectedPsychologies, setSelectedPsychologies] = useState<string[]>([]);
  const [isPsychologyDropdownOpen, setIsPsychologyDropdownOpen] = useState(false);
  
  const [isLearningTrade, setIsLearningTrade] = useState(false);
  const [notes, setNotes] = useState("");

  // Date States
  const [entryDate, setEntryDate] = useState<Date>(new Date());
  const [exitDate, setExitDate] = useState<Date>(new Date());
  const [activePicker, setActivePicker] = useState<"entry" | "exit" | null>(null);
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const psychDropdownRef = useRef<HTMLDivElement>(null);
  const tradeTypeDropdownRef = useRef<HTMLDivElement>(null);

  // Load trade details on open
  useEffect(() => {
    if (trade) {
      setSymbol(trade.symbol || "XAUUSD");
      setTradeType(trade.trade_type || "BUY");
      setVolume(trade.volume ? String(trade.volume) : "0.10");
      setOpenPrice(trade.open_price ? String(trade.open_price) : "");
      setClosePrice(trade.close_price ? String(trade.close_price) : "");
      
      // Load SL, TP, and R:R from trade data
      setStopLoss(trade.stop_loss ? String(trade.stop_loss) : "");
      setTakeProfit(trade.take_profit ? String(trade.take_profit) : "");
      setRiskReward(trade.risk_reward || "");

      setProfit(trade.profit ? String(trade.profit) : "0");
      setStrategy(trade.strategy || "SMC / ICT");
      setTradeStyle(trade.trade_style || "Intraday");
      setIsBreakeven(Boolean(trade.is_breakeven));
      setIsLearningTrade(Boolean(trade.is_learning_trade));
      setNotes(trade.notes || "");

      // Parse Psychology String to Array
      if (trade.psychology) {
        const parsed = trade.psychology.split(",").map((s: string) => s.trim());
        setSelectedPsychologies(parsed);
      } else {
        setSelectedPsychologies(["Disciplined / Planned"]);
      }

      // Parse Dates
      const eDate = trade.entry_at || trade.created_at ? new Date(trade.entry_at || trade.created_at) : new Date();
      const xDate = trade.exit_at ? new Date(trade.exit_at) : eDate;
      setEntryDate(eDate);
      setExitDate(xDate);
      setViewDate(eDate);
    }
  }, [trade]);

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

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (psychDropdownRef.current && !psychDropdownRef.current.contains(event.target as Node)) {
        setIsPsychologyDropdownOpen(false);
      }
      if (tradeTypeDropdownRef.current && !tradeTypeDropdownRef.current.contains(event.target as Node)) {
        setIsTradeTypeDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !trade) return null;

  const togglePsychologyOption = (option: string) => {
    setSelectedPsychologies((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const psychologyString = selectedPsychologies.length > 0 
      ? selectedPsychologies.join(", ") 
      : "Disciplined / Planned";

    const updatedData = {
      ...trade,
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
    };

    await onSave(updatedData);
    setSubmitting(false);
    onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#0B0B0B] border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.2)] relative my-8 font-mono">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
            <Save className="h-4 w-4" /> Edit Trade Details
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Symbol & Trade Type */}
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

          {/* Strategy & Psychology Tags */}
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
            {submitting ? "Updating Trade..." : "Update Trade"}
          </button>
        </form>
      </div>
    </div>
  );
}