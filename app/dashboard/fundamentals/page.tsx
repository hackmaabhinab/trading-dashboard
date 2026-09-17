'use client';

import React, { useState } from 'react';
import { Globe, Send, DollarSign, Landmark, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';

export default function FundamentalsPage() {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Welcome to Macroeconomic & Forex Fundamental Desk. Main aapka Macro Analyst Copilot hoon. Gold (XAUUSD) vs USD inverse relationship, Federal Reserve Policy, FOMC decisions, Inflation (CPI/PPI), ya COT Report ke baare me kuch bhi poochhein.',
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

      if (lower.includes('gold') || lower.includes('xau') || lower.includes('usd')) {
        response = 'Gold vs USD Relationship: XAU/USD mostly inverse (ulta) move karta hai. Jab US Dollar Index (DXY) strong hota hai ya US Treasury Yields badhti hain, toh Gold drop hota hai kyunki Yield-bearing assets USD ko attractive banate hain. War/Geopolitical Tension ya Recession risk me Gold safe-haven ki tarah pump hota hai.';
      } else if (lower.includes('fomc') || lower.includes('fed') || lower.includes('interest rate')) {
        response = 'FOMC & Rate Decision Analysis: Agar Fed Interest Rates BADHATA (Rate Hike) hai, toh USD bullish aur Gold/Equities bearish hote hain. Agar Rates CUT karta hai ya Dovish stance leta hai, toh USD drop aur Gold rally karta hai. Always check Dot Plot and Powell Press Conference stance.';
      } else if (lower.includes('cpi') || lower.includes('inflation')) {
        response = 'Inflation (CPI Data): Higher-than-expected CPI ka matlab hai Inflation abhi bhi high hai. Isse Fed rate cuts delay kar sakta hai -> Result: USD Bullish, Gold Instant Drop. Lower CPI = Rate Cut expectations -> Gold Bullish.';
      } else if (lower.includes('cot') || lower.includes('commitment')) {
        response = 'COT Report Strategy: Commercial Institutions (Smart Money) ke Net Long vs Net Short positions track karein. Agar Commercials extreme Net Long hain, toh Macro Trend Bullish flip hone ke high chances hote hain.';
      } else {
        response = `Macro View: "${userText}" par analysis. Forex Fundamentals me Central Bank Interest Rate Differential (Yield Spread) hi long-term trend direction decide karta hai.`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  const macroPrompts = [
    'XAUUSD vs USD Inverse Relationship kyun hota hai?',
    'FOMC Meeting outcome ko kaise analyze karein?',
    'CPI Inflation Data ka Gold par kya impact padta hai?',
    'US Dollar Index (DXY) ko XAUUSD ke sath kaise correlation me dekhein?',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-500" /> Forex Macro Fundamentals
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Institutional drivers, Central Bank policies, Gold/USD dynamics & Economic events copilot
        </p>
      </div>

      {/* Quick Macro Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {macroPrompts.map((prompt, i) => (
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

      {/* Fundamental AI Terminal */}
      <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-2xl flex flex-col h-[520px]">
        <div className="flex items-center justify-between border-b border-blue-900/40 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Macro Strategy Terminal</h3>
              <p className="text-xs text-blue-400 font-mono">Central Bank & Gold Dynamic Engine Active</p>
            </div>
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
                className={`p-2 rounded-lg text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#070A10] border border-blue-900/40 text-blue-400'
                }`}
              >
                {msg.sender === 'user' ? 'YOU' : 'MACRO'}
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
              <TrendingUp className="w-3 h-3" /> Analyzing macroeconomic correlation...
            </div>
          )}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-3 pt-3 border-t border-blue-900/40">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Ask about XAUUSD, DXY, FOMC, Rate Hikes, Inflation Data..."
            className="flex-1 bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" /> Analyze
          </button>
        </form>
      </div>
    </div>
  );
}