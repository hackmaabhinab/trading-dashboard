"use client";

import React, { useEffect, useRef, useState } from "react";

export default function LiveMarketNewsPage() {
  const tickerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);

  // Chatbox State
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "Namaste Abhinav! Main VALT Macro AI Assistant hoon. Aane wale CPI, NFP, ya Fed Interest Rate data ka Gold (XAUUSD), BTC, ya Forex pairs par kya impact hoga, poochhiye!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Ticker Widget Script
    if (tickerRef.current && !tickerRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: "FOREXCOM:XAUUSD", title: "Gold" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "TVC:US10Y", title: "US 10Y Yield" },
          { proName: "FX_IDC:DXY", title: "US Dollar Index" },
          { proName: "FX:USDCHF", title: "USD/CHF" },
          { proName: "FX:AUDUSD", title: "AUD/USD" },
          { proName: "FX:USDCAD", title: "USD/CAD" },
          { proName: "FX:NZDUSD", title: "NZD/USD" },
        ],
        showSymbolLogo: true,
        isTransparent: false,
        displayMode: "adaptive",
        colorTheme: "dark",
        locale: "en",
      });
      tickerRef.current.appendChild(script);
    }

    // 2. Economic Calendar Widget Script
    if (calendarRef.current && !calendarRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: "dark",
        isTransparent: false,
        width: "100%",
        height: "550",
        locale: "en",
        importanceFilter: "-1,0,1",
        currencyFilter: "USD,EUR,GBP,JPY,CAD,AUD",
      });
      calendarRef.current.appendChild(script);
    }

    // 3. TradingView Latest Real-Time News Feed
    if (newsRef.current && !newsRef.current.querySelector("script")) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        feedMode: "all_symbols",
        colorTheme: "dark",
        isTransparent: false,
        displayMode: "regular",
        width: "100%",
        height: "550",
        locale: "en",
      });
      newsRef.current.appendChild(script);
    }
  }, []);

  // AI Chatbox Message Send Handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/ai-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Analysis complete. Keep an eye on institutional liquidity.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, response fetch nahi ho paya. Please check your API key configuration.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-black min-h-screen text-zinc-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-black border border-zinc-900 p-4 rounded-xl gap-4 shadow-2xl">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-zinc-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Macro Economic Wire & VALT Terminal
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-Time Institutional Forex, Crypto & Economic Feed
          </p>
        </div>
        <div className="text-xs text-zinc-400 bg-black px-3 py-1.5 rounded-lg border border-zinc-900">
          Live Feed Active
        </div>
      </div>

      {/* Market Live Price Ticker */}
      <div className="w-full bg-black border border-zinc-900 rounded-xl overflow-hidden p-2 shadow-xl">
        <div className="tradingview-widget-container bg-black" ref={tickerRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>

      {/* Grid Layout: Economic Calendar (Left) & Live News Wire (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Economic Calendar Section */}
        <div className="lg:col-span-8 bg-black border border-zinc-900 rounded-xl p-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
            <h2 className="text-sm font-semibold tracking-wider text-emerald-400 uppercase flex items-center gap-2">
              📅 LIVE TRADINGVIEW ECONOMIC CALENDAR
            </h2>
            <span className="text-xs text-zinc-500">Global Markets</span>
          </div>
          <div
            className="w-full overflow-hidden rounded-lg tradingview-widget-container bg-black"
            ref={calendarRef}
          >
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </div>

        {/* Live News Wire Section */}
        <div className="lg:col-span-4 bg-black border border-zinc-900 rounded-xl p-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-3">
            <h2 className="text-sm font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-2">
              📰 LATEST BREAKING NEWS & WIRE
            </h2>
            <span className="text-xs text-zinc-500">Real-Time Feed</span>
          </div>
          <div
            className="w-full overflow-hidden rounded-lg tradingview-widget-container bg-black"
            ref={newsRef}
          >
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </div>
      </div>

      {/* Full-Width / Taller Bottom AI Terminal Chatbox */}
      <div className="w-full bg-black border border-zinc-900 rounded-xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <h2 className="text-sm md:text-base font-semibold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
            🤖 VALT MACRO AI PREDICTOR (REAL-TIME DATA & NEWS ANALYSIS)
          </h2>
          <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-md font-mono">
            VOLT NEWS TERMINAL AI ACTIVE
          </span>
        </div>

        {/* Extended Height Chat Log */}
        <div className="h-[600px] overflow-y-auto space-y-4 p-5 bg-zinc-950/90 border border-zinc-900 rounded-xl text-sm scrollbar-thin scrollbar-thumb-zinc-800">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-cyan-600 text-white rounded-br-none shadow-lg"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-bl-none shadow-md"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-xs text-cyan-400 animate-pulse p-2 font-mono">
              VALT AI is analyzing macro news & trade setups...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-3 pt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Poochho: 'Aaj USD/JPY aur Gold par CPI news ka kya impact hoga?'"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-3 text-xs md:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs md:text-sm font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 shadow-md"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}