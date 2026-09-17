'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Bot, Send, TrendingUp, Award, Activity, BrainCircuit } from 'lucide-react';

export default function AnalyticsPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello Trader! Main aapka AI Execution Assistant hoon. Aap apne overall win rate, ICT setup performance, ya Risk-to-Reward optimization ke baare mein mujhse sawaal pooch sakte hain.',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchTrades = async () => {
      const { data } = await supabase.from('trades').select('*');
      if (data) setTrades(data);
    };
    fetchTrades();
  }, []);

  // Performance Calculations
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.outcome === 'WIN').length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : '0';
  const totalRR = trades.reduce((acc, curr) => {
    return curr.outcome === 'WIN' ? acc + (curr.rr_ratio || 0) : acc - 1;
  }, 0);

  // AI Chat Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setIsTyping(true);

    // AI Response Simulation based on logged trade data
    setTimeout(() => {
      let response = '';
      const lower = userText.toLowerCase();

      if (lower.includes('win rate') || lower.includes('performance')) {
        response = `Aapka current win rate ${winRate}% hai total ${totalTrades} trades me. Total Net RR generated: ${totalRR.toFixed(1)}R.`;
      } else if (lower.includes('setup') || lower.includes('ict') || lower.includes('smc')) {
        response = `Data ke mutabiq aapke maximum winning trades Order Block aur FVG setups par depend hain. Risk-to-Reward Ratio ko 1:3 par maintain rakhna long-term edge deta hai.`;
      } else if (lower.includes('loss') || lower.includes('risk')) {
        response = `Losses ko control karne ke liye per-trade risk 1% se upar mat le jayein. Consistently stop loss hit hone par Market Structure Shift (MSS) ka confirmation zaroor lein.`;
      } else {
        response = `Aapke message "${userText}" ke basis par: Operational disciplined bane rahein. Rules ke mutabiq hi trade execute karein.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Analytics & AI Assistant</h2>
        <p className="text-slate-400 text-sm mt-1">Institutional metrics breakdown & AI strategy consultant</p>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0B0F17] border border-blue-900/30 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Total Executions</p>
            <h3 className="text-2xl font-black text-slate-100 mt-1">{totalTrades}</h3>
          </div>
          <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl text-blue-400">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B0F17] border border-blue-900/30 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Win Rate</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{winRate}%</h3>
          </div>
          <div className="p-3 bg-emerald-600/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B0F17] border border-blue-900/30 p-6 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">Net Risk-Reward</p>
            <h3 className="text-2xl font-black text-blue-400 mt-1">{totalRR.toFixed(1)} R</h3>
          </div>
          <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* AI Chatbot Module */}
      <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-2xl flex flex-col h-[500px]">
        <div className="flex items-center gap-3 border-b border-blue-900/40 pb-4 mb-4">
          <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Institutional AI Copilot</h3>
            <p className="text-xs text-slate-400">Real-time trading psychology & performance counselor</p>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#070A10] border border-blue-900/40 text-blue-400'
                }`}
              >
                {msg.sender === 'user' ? 'You' : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-xl p-3.5 rounded-2xl text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-[#070A10] border border-blue-900/40 text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="text-xs text-blue-400 italic font-mono animate-pulse">
              AI Copilot is analyzing execution logs...
            </div>
          )}
        </div>

        {/* Input Box */}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-3 pt-3 border-t border-blue-900/40">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask AI about win rate, setup efficiency, or risk management..."
            className="flex-1 bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}