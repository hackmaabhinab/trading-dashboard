"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Bot, Send, Sparkles, RefreshCw, BarChart2, Brain, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useDashboardData } from '@/hooks/useDashboardData';

interface Message {
  id: string;
  sender: "user" | "volt";
  text: string;
  time: string;
}

type ModeType = "journal" | "psychology" | "fundamentals";

export default function AnalyticsPage() {
  const [activeMode, setActiveMode] = useState<ModeType>("journal");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tradesHistory, setTradesHistory] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dynamic quick prompts based on active mode
  const getQuickPrompts = () => {
    if (activeMode === "journal") {
      return [
        { label: "Why Am I Losing?", sub: "Find patterns in losing trades" },
        { label: "Where's My Edge?", sub: "Which setups give highest R:R?" },
        { label: "Am I Following Plan?", sub: "Check session & execution discipline" },
        { label: "How Do I Improve?", sub: "Actionable roadmap for lot sizing" },
      ];
    } else if (activeMode === "psychology") {
      return [
        { label: "Fix FOMO & Overtrading", sub: "Control emotions after win/loss streaks" },
        { label: "Revenge Trading Loop", sub: "How to stop chasing losses immediately" },
        { label: "Execution Fear", sub: "Why do I hesitate to take valid setups?" },
        { label: "Disciplined Mindset", sub: "Daily mental routine before session" },
      ];
    } else {
      return [
        { label: "XAUUSD Macro Drivers", sub: "How US Yields & DXY affect Gold" },
        { label: "COT Report Breakdown", sub: "Institutional positioning analysis" },
        { label: "Interest Rate Differentials", sub: "Impact on FX pair trends" },
        { label: "NFP & Inflation Strategy", sub: "How to navigate high-impact news" },
      ];
    }
  };

  useEffect(() => {
    fetchJournalTrades();
  }, []);

  useEffect(() => {
    // Clear chat on mode switch
    setMessages([]);
  }, [activeMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const fetchJournalTrades = async () => {
    const { data } = await supabase.from("trades").select("*").order("created_at", { ascending: false });
    if (data) setTradesHistory(data);
  };

  const handleSendMessage = async (customText?: string) => {
    const queryText = customText || inputMessage;
    if (!queryText.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          module: activeMode, // Sends active mode to API
          tradesHistory: activeMode === "journal" ? tradesHistory : [],
        }),
      });

      const data = await res.json();

      const voltMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "volt",
        text: data.reply || "Unable to fetch analysis from VOLT Terminal.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, voltMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "volt",
        text: "Error connecting to VOLT AI Core. Check network or API key.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-neutral-200 font-sans overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-neutral-900 bg-[#0B0B0B] p-3 hidden md:flex flex-col justify-between shrink-0 h-full">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 py-1 border-b border-neutral-900 pb-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wider font-mono">VOLT AI</h2>
              <p className="text-[10px] text-neutral-500 font-mono">Trader Performance Mentor</p>
            </div>
          </div>

          {/* AI Mode Tabs Selection */}
          <div className="space-y-1.5">
            <span className="text-[9px] text-neutral-600 font-mono uppercase px-2">AI Modules</span>
            
            {/* Journal Analysis Tab */}
            <button
              onClick={() => setActiveMode("journal")}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-mono transition-all ${
                activeMode === "journal"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                  : "bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:text-white"
              }`}
            >
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              <span className="truncate">Journal Analysis</span>
            </button>

            {/* Trading Psychology Tab */}
            <button
              onClick={() => setActiveMode("psychology")}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-mono transition-all ${
                activeMode === "psychology"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                  : "bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:text-white"
              }`}
            >
              <Brain className="w-4 h-4 text-emerald-400" />
              <span className="truncate">Trading Psychology</span>
            </button>

            {/* Market Fundamentals Tab */}
            <button
              onClick={() => setActiveMode("fundamentals")}
              className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-mono transition-all ${
                activeMode === "fundamentals"
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold"
                  : "bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:border-neutral-800 hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="truncate">Forex & Yields Macro</span>
            </button>
          </div>
        </div>

        {/* Journal Sync Status Footer */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-3 font-mono text-[10px]">
          <span className="text-neutral-500 block mb-1">JOURNAL SYNCED:</span>
          <div className="flex justify-between items-center text-emerald-400 font-bold">
            <span>{tradesHistory.length} Trades Active</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Full-Height Chat Viewport */}
      <div className="flex-1 flex flex-col h-full bg-black relative overflow-hidden">
        {/* Top Header */}
        <div className="h-12 border-b border-neutral-900 bg-[#0B0B0B]/80 backdrop-blur-md px-4 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tracking-wider uppercase">
              VOLT AI — {activeMode}
            </span>
            <span className="text-[10px] text-neutral-500">v3.6-Flash</span>
          </div>
          <button
            onClick={() => setMessages([])}
            className="text-neutral-500 hover:text-white flex items-center gap-1 text-[10px] transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset View
          </button>
        </div>

        {/* Scrollable Center Viewport */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center space-y-8 max-w-xl mx-auto text-center w-full">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  {activeMode === "journal" && <BarChart2 className="w-10 h-10" />}
                  {activeMode === "psychology" && <Brain className="w-10 h-10" />}
                  {activeMode === "fundamentals" && <Globe className="w-10 h-10" />}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-black border border-emerald-500/40 rounded-full p-1 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold text-white tracking-wide font-mono mb-1">
                  {activeMode === "journal" && "Analyze Journal & Execution Flaws"}
                  {activeMode === "psychology" && "Master Trading Mindset & Discipline"}
                  {activeMode === "fundamentals" && "Forex, Treasury Yields & Gold Macro AI"}
                </h2>
                <p className="text-xs text-neutral-500 max-w-md">
                  {activeMode === "journal" && "VOLT inspects win-rate, R:R leakage, and trade errors."}
                  {activeMode === "psychology" && "Trained to solve FOMO, revenge trading, and emotional bias."}
                  {activeMode === "fundamentals" && "Expert insight on DXY, US10Y Yields, XAUUSD, and COT macro drivers."}
                </p>
              </div>

              {/* Dynamic Quick Prompts Grid */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                {getQuickPrompts().map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(`${p.label} - ${p.sub}`)}
                    className="p-3 bg-[#0B0B0B] border border-neutral-800/80 hover:border-emerald-500/50 hover:bg-neutral-900/60 rounded-xl text-left transition-all group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 font-mono block">
                      {p.label}
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate font-sans">{p.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full space-y-4 my-0">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "volt" && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl p-4 text-xs font-sans leading-relaxed ${
                      m.sender === "user"
                        ? "bg-neutral-900 border border-neutral-800 text-white font-mono"
                        : "bg-[#0E0E0E] border border-neutral-800/80 text-neutral-300 italic shadow-lg"
                    }`}
                  >
                    {m.sender === "volt" ? (
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-2 not-italic uppercase">
                          VOLT AI ({activeMode})
                        </span>
                        
                        <div className="space-y-2 text-xs leading-6 text-neutral-300 italic font-sans [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&_strong]:text-emerald-400 [&_strong]:not-italic [&_strong]:font-bold">
                          <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <p>{m.text}</p>
                    )}
                    <span className="text-[9px] font-mono text-neutral-600 block text-right mt-2 not-italic">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start max-w-3xl mx-auto w-full">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#0E0E0E] border border-neutral-800/80 rounded-xl p-3.5 text-xs font-mono text-neutral-500 flex items-center gap-2 italic">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                    VOLT is processing market insights...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Field */}
        <div className="p-4 border-t border-neutral-900 bg-[#0B0B0B] shrink-0">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              placeholder={
                activeMode === "journal"
                  ? "Ask about win-rate, losses, or setups..."
                  : activeMode === "psychology"
                  ? "Ask about FOMO, discipline, or handling losses..."
                  : "Ask about Forex, Yields, DXY, COT reports, or Gold..."
              }
              className="w-full bg-[#121212] border border-neutral-800 focus:border-emerald-500/60 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-600 focus:outline-none font-mono pr-12 transition-all shadow-inner"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              className="absolute right-2 p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black disabled:opacity-30 transition-all font-bold"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}