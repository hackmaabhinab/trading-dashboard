'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export default function OverviewPage() {
  const [isGeminiDrawerOpen, setIsGeminiDrawerOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste Abhinav! Main aapka Institutional Trading AI Assistant hoon. XAUUSD (Gold) SMC/ICT structure, COT data, ya Risk Management par kya analysis chahiye?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg = inputMessage;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInputMessage('');

    // Simulated Gemini AI Response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Aapne pucha: "${userMsg}". Current market analysis ke mutabiq XAUUSD 4H Order Block par rejection le raha hai. Key Liquidity Levels sweep hone par high probability trade set-up ban sakta hai.`
        }
      ]);
    }, 800);
  };

  return (
    <div className="space-y-6 relative min-h-[85vh]">
      
      {/* Top Header & Gemini AI Trigger Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-blue-950/40 via-[#0B0F17] to-[#0B0F17] p-6 rounded-2xl border border-blue-900/30">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 flex items-center gap-2">
            Overview <span className="text-blue-500 text-sm px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 font-medium">Live Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, trader. Here is your institutional market summary.</p>
        </div>

        {/* Gemini AI Open Drawer Button */}
        <button
          onClick={() => setIsGeminiDrawerOpen(true)}
          className="flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/20 active:scale-95 transition-all cursor-pointer border border-blue-400/30"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-amber-300" />
          <span>Ask Gemini AI</span>
        </button>
      </div>

      {/* Main Dashboard Cards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0B0F17] p-6 rounded-2xl border border-blue-900/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-sm font-medium">
            <span>XAUUSD Bias</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">BULLISH SMC</p>
          <p className="text-xs text-slate-500">4H Order Block Holding Strong</p>
        </div>

        <div className="bg-[#0B0F17] p-6 rounded-2xl border border-blue-900/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-sm font-medium">
            <span>Win Rate</span>
            <Zap className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">68.4%</p>
          <p className="text-xs text-slate-500">Based on last 25 trades</p>
        </div>

        <div className="bg-[#0B0F17] p-6 rounded-2xl border border-blue-900/30 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-sm font-medium">
            <span>Account Risk</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">1.0% / Trade</p>
          <p className="text-xs text-slate-500">Strict ICT Risk Parameters</p>
        </div>
      </div>

      {/* GEMINI AI SLIDING DRAWER OVERLAY */}
      {isGeminiDrawerOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          {/* Backdrop Blur */}
          <div 
            onClick={() => setIsGeminiDrawerOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Sliding Drawer Container */}
          <div className="relative w-full max-w-md bg-[#0B0F17] border-l border-blue-900/40 h-full flex flex-col justify-between shadow-2xl z-[10001] animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-blue-900/30 flex items-center justify-between bg-[#070A10]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                    Gemini AI Assistant
                  </h2>
                  <p className="text-[11px] text-slate-400">Institutional Market Intelligence</p>
                </div>
              </div>

              <button
                onClick={() => setIsGeminiDrawerOpen(false)}
                className="p-2 rounded-xl bg-blue-950/50 border border-blue-900/50 text-slate-400 hover:text-white active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-2 border-b border-blue-900/20 bg-[#080C14] flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
              <button 
                onClick={() => setInputMessage('Analyze XAUUSD 4H Order Block')}
                className="px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-300 hover:bg-blue-900/50 transition-colors"
              >
                📊 Gold OB Analysis
              </button>
              <button 
                onClick={() => setInputMessage('Calculate 1% Risk Lot Size')}
                className="px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-300 hover:bg-blue-900/50 transition-colors"
              >
                🧮 Risk Lot Calc
              </button>
              <button 
                onClick={() => setInputMessage('COT Report Insights')}
                className="px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-800/40 text-blue-300 hover:bg-blue-900/50 transition-colors"
              >
                🌐 COT Report
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                        : 'bg-[#0F1623] border border-blue-900/30 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Input Footer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-blue-900/30 bg-[#070A10] flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Gemini AI anything..."
                className="flex-1 bg-[#0F1623] border border-blue-900/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white active:scale-95 transition-all cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}