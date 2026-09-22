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
        height: "500",
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
        height: "500",
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
    <div className="p-2 sm:p-6 space-y-4 sm:space-y-8 bg-black min-h-screen text-zinc-100 max-w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-black border border-zinc-900 p-3 sm:p-4 rounded-xl gap-3 sm:gap-4 shadow-2xl">
        <div>
          <h1 className="text-base sm:text-xl font-bold tracking-wide text-zinc-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Macro Economic Wire & VALT Terminal
          </h1>
          <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1">
            Real-Time Institutional Forex, Crypto & Economic Feed
          </p>
        </div>
        <div className="text-[10px] sm:text-xs text-zinc-400 bg-black px-2.5 py-1 rounded-lg border border-zinc-900 self-start sm:self-auto">
          Live Feed Active
        </div>
      </div>

      {/* Market Live Price Ticker */}
      <div className="w-full bg-black border border-zinc-900 rounded-xl overflow-hidden p-1 sm:p-2 shadow-xl">
        <div className="tradingview-widget-container bg-black" ref={tickerRef}>
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>

      {/* Grid Layout: Economic Calendar & Live News Wire */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Economic Calendar Section (Mobile Slide Fixed) */}
        <div className="lg:col-span-8 bg-black border border-zinc-900 rounded-xl p-3 sm:p-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5 sm:gap-2">
              📅 LIVE TRADINGVIEW ECONOMIC CALENDAR
            </h2>
            <span className="text-[10px] sm:text-xs text-zinc-500">Global Markets</span>
          </div>
          {/* Scroll container for mobile touch compatibility */}
          <div className="w-full overflow-x-auto rounded-lg -webkit-overflow-scrolling-touch">
            <div
              className="w-full min-w-[280px] sm:min-w-full overflow-hidden rounded-lg tradingview-widget-container bg-black"
              ref={calendarRef}
            >
              <div className="tradingview-widget-container__widget"></div>
            </div>
          </div>
        </div>

        {/* Live News Wire Section */}
        <div className="lg:col-span-4 bg-black border border-zinc-900 rounded-xl p-3 sm:p-4 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-2">
            <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-amber-400 uppercase flex items-center gap-1.5 sm:gap-2">
              📰 LATEST BREAKING NEWS & WIRE
            </h2>
            <span className="text-[10px] sm:text-xs text-zinc-500">Real-Time Feed</span>
          </div>
          <div className="w-full overflow-x-auto rounded-lg -webkit-overflow-scrolling-touch">
            <div
              className="w-full min-w-[280px] sm:min-w-full overflow-hidden rounded-lg tradingview-widget-container bg-black"
              ref={newsRef}
            >
              <div className="tradingview-widget-container__widget"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Bottom AI Terminal Chatbox */}
      <div className="w-full bg-black border border-zinc-900 rounded-xl p-3 sm:p-5 shadow-2xl space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-900 pb-2.5 sm:pb-3 gap-2">
          <h2 className="text-xs sm:text-base font-semibold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
            🤖 VALT MACRO AI PREDICTOR
          </h2>
          <span className="text-[10px] sm:text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 sm:py-1 rounded-md font-mono">
            VOLT NEWS TERMINAL AI ACTIVE
          </span>
        </div>

        {/* Chat Log with Height Adjusted for Mobile */}
        <div className="h-[420px] sm:h-[600px] overflow-y-auto space-y-3 sm:space-y-4 p-3 sm:p-5 bg-zinc-950/90 border border-zinc-900 rounded-xl text-xs sm:text-sm scrollbar-thin scrollbar-thumb-zinc-800">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[80%] p-3 sm:p-4 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
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
            <div className="text-[11px] sm:text-xs text-cyan-400 animate-pulse p-1 sm:p-2 font-mono">
              VALT AI is analyzing macro news & trade setups...
            </div>
          )}
        </div>

        {/* Responsive Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 pt-1 sm:pt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Poochho: 'Aaj Gold par CPI ka impact?'"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all disabled:opacity-50 shadow-md shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}