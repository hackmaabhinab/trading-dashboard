'use client';

import React, { useState } from 'react';
import { Brain, Send, ShieldAlert, Sparkles, HeartHandshake, Zap } from 'lucide-react';

export default function PsychologyPage() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Welcome to the Psychology Chamber. Trading me 80% success mindset aur discipline se aati hai. Kya aap abhi Revenge Trading, Fear of Missing Out (FOMO), Loss Aversion, ya Over-leveraging feel kar rahe hain? Mujhe batayein, milkar system reset karte hain.',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      let response = '';
      const lower = userText.toLowerCase();

      if (lower.includes('fomo') || lower.includes('miss')) {
        response = 'FOMO Rule: Jo movement bina aapke setup ke nikal gayi, wo aapka trade nahi tha. Market me opportunities unlimited hain, lekin aapka capital limited hai. Terminal close karein aur next planned setup ka wait karein.';
      } else if (lower.includes('loss') || lower.includes('revenge')) {
        response = 'Revenge Trading Warning: Loss market ko pay kiya gaya tuition fee hai. Loss accept karein aur abhi ke liye system off kar dein. Agla trade revenge me lene se accounts blow hote hain.';
      } else if (lower.includes('fear') || lower.includes('darr')) {
        response = 'Fear Management: Agar aapko trade lene me darr lag raha hai, toh aapka Position Size bohot bada hai. Risk % ko 0.5% par layein. Sahi risk size se darr khatam ho jata hai.';
      } else if (lower.includes('greed') || lower.includes('overtrade')) {
        response = 'Overtrading Check: Max 2-3 trades per day rule set karein. Extra trades lene se market aapka profit wapas kheench leti hai. Execution Quality > Quantity.';
      } else {
        response = `Mindset Checkpoint: Professional traders outcome par nahi, Execution Process par focus karte hain. Trade plan ko strictly follow karein.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 900);
  };

  const quickPrompts = [
    'I feel like Revenge Trading today',
    'How to control FOMO during volatility?',
    'I am afraid to enter even on good setups',
    'How to handle consecutive losses?',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-500" /> Trading Psychology Coach
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Master your emotions, eliminate FOMO, and build institutional discipline
          </p>
        </div>
      </div>

      {/* Quick Mindset Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => setInputMsg(prompt)}
            className="text-left p-3 bg-[#0B0F17] border border-blue-900/30 hover:border-blue-500/50 rounded-xl text-xs text-slate-300 hover:text-slate-100 transition-all flex items-center gap-2 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Psychology Chat Terminal */}
      <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-2xl flex flex-col h-[520px]">
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Mindset Control Room</h3>
              <p className="text-xs text-emerald-400 font-mono">Active - Behavioral Analysis Online</p>
            </div>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`p-2 rounded-lg text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#070A10] border border-blue-900/40 text-blue-400'
                }`}
              >
                {msg.sender === 'user' ? 'YOU' : 'COACH'}
              </div>
              <div
                className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
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
            <div className="text-xs text-blue-400 font-mono animate-pulse flex items-center gap-2">
              <Zap className="w-3 h-3" /> Psychology Coach is formulating response...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-3 pt-3 border-t border-blue-900/40">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Express your state of mind (e.g. lost a trade, feeling greedy, confused)..."
            className="flex-1 bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" /> Consult
          </button>
        </form>
      </div>
    </div>
  );
}