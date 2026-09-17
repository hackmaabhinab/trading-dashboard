'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function LiveTicker() {
  const tickers = [
    { symbol: 'XAUUSD', price: '2508.45', change: '+0.82%', isUp: true },
    { symbol: 'EURUSD', price: '1.08520', change: '-0.14%', isUp: false },
    { symbol: 'GBPUSD', price: '1.29410', change: '+0.31%', isUp: true },
    { symbol: 'DXY', price: '101.85', change: '-0.25%', isUp: false },
  ];

  return (
    <div className="bg-[#0B0F17] border-b border-blue-900/30 px-6 py-2 overflow-x-auto">
      <div className="flex items-center gap-8 text-xs font-mono shrink-0">
        <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
          Institutional Ticker
        </span>
        {tickers.map((t) => (
          <div key={t.symbol} className="flex items-center gap-2">
            <span className="text-slate-400 font-bold">{t.symbol}</span>
            <span className="text-slate-200">{t.price}</span>
            <span
              className={`flex items-center text-[11px] font-bold ${
                t.isUp ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {t.isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {t.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}