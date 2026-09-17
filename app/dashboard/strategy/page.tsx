'use client';

import React, { useState } from 'react';
import { Compass, BookOpen, Layers, CheckCircle, ShieldAlert, Plus, Sparkles } from 'lucide-react';

export default function StrategyPage() {
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      title: 'ICT Silver Bullet & Liquidity Sweep',
      timeframe: '5m / 15m',
      pair: 'XAUUSD / EURUSD',
      winRate: '72%',
      rrRatio: '1:3+',
      rules: [
        'Identify Asian / London High/Low Liquidity Sweep.',
        'Wait for Market Structure Shift (MSS) on 5m timeframe.',
        'Enter at Fair Value Gap (FVG) or Order Block during Killzone hours.',
        'Set Stop Loss above/below the swing liquidity point.',
      ],
      author: 'Admin (Master Trader)',
    },
    {
      id: 2,
      title: 'SMC Premium & Discount Array Reversal',
      timeframe: '1H / 4H',
      pair: 'XAUUSD / Forex Majors',
      winRate: '68%',
      rrRatio: '1:4+',
      rules: [
        'Mark 4H Market Structure & Equilibrium (Fib 0.5 level).',
        'Wait for price to tap Discount zone (for Longs) or Premium zone (for Shorts).',
        'Look for 15m Breaker Block or Mitigated Order Block.',
        'Target external range liquidity (Previous High/Low).',
      ],
      author: 'Admin (Master Trader)',
    },
  ]);

  // Admin New Strategy Form State
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [title, setTitle] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [pair, setPair] = useState('');
  const [winRate, setWinRate] = useState('');
  const [rrRatio, setRrRatio] = useState('');
  const [ruleInput, setRuleInput] = useState('');

  const handleAddStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newStrat = {
      id: Date.now(),
      title,
      timeframe,
      pair,
      winRate,
      rrRatio,
      rules: ruleInput.split('\n').filter((r) => r.trim() !== ''),
      author: 'Admin (You)',
    };

    setStrategies([newStrat, ...strategies]);
    setTitle('');
    setTimeframe('');
    setPair('');
    setWinRate('');
    setRrRatio('');
    setRuleInput('');
    setShowAdminForm(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Compass className="w-8 h-8 text-blue-500" /> Institutional Playbook & Strategies
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Proven execution models, entry rules, and edge frameworks published by Admin
          </p>
        </div>

        <button
          onClick={() => setShowAdminForm(!showAdminForm)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> {showAdminForm ? 'Close Editor' : 'Post New Strategy'}
        </button>
      </div>

      {/* Admin Strategy Creator Form */}
      {showAdminForm && (
        <form onSubmit={handleAddStrategy} className="bg-[#0B0F17] border border-blue-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-blue-400 flex items-center gap-2 border-b border-blue-900/40 pb-3">
            <Sparkles className="w-4 h-4" /> Admin Strategy Publisher
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Strategy Title</label>
              <input
                type="text"
                required
                placeholder="e.g. ICT London Open Breakout"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Timeframe</label>
              <input
                type="text"
                required
                placeholder="e.g. 5m / 15m"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Applicable Pair(s)</label>
              <input
                type="text"
                required
                placeholder="e.g. XAUUSD / GBPUSD"
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Historical Win Rate</label>
              <input
                type="text"
                placeholder="e.g. 70%"
                value={winRate}
                onChange={(e) => setWinRate(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Target R:R Ratio</label>
              <input
                type="text"
                placeholder="e.g. 1:3+"
                value={rrRatio}
                onChange={(e) => setRrRatio(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">
              Execution Rules (Enter each rule on a new line)
            </label>
            <textarea
              rows={4}
              required
              placeholder="1. Sweep Asian Session High&#10;2. Wait for 5m MSS&#10;3. Enter at FVG"
              value={ruleInput}
              onChange={(e) => setRuleInput(e.target.value)}
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20"
            >
              Publish Strategy to Dashboard
            </button>
          </div>
        </form>
      )}

      {/* Strategies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strat) => (
          <div
            key={strat.id}
            className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all"
          >
            <div>
              <div className="flex items-start justify-between border-b border-blue-900/40 pb-3 mb-4">
                <div>
                  <span className="px-2.5 py-1 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {strat.pair}
                  </span>
                  <h3 className="text-xl font-bold text-slate-100 mt-2">{strat.title}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Timeframe</span>
                  <span className="text-xs font-mono font-bold text-slate-200">{strat.timeframe}</span>
                </div>
              </div>

              {/* Stats Badges */}
              <div className="flex items-center gap-4 text-xs font-mono mb-4">
                <div className="bg-[#070A10] px-3 py-1.5 border border-blue-900/40 rounded-lg">
                  <span className="text-slate-500">Est. Win Rate: </span>
                  <span className="text-emerald-400 font-bold">{strat.winRate}</span>
                </div>
                <div className="bg-[#070A10] px-3 py-1.5 border border-blue-900/40 rounded-lg">
                  <span className="text-slate-500">Target R:R: </span>
                  <span className="text-blue-400 font-bold">{strat.rrRatio}</span>
                </div>
              </div>

              {/* Rules List */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Execution Checklist:</p>
                {strat.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-[#070A10] p-2.5 rounded-lg border border-blue-900/20">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-blue-900/30 flex items-center justify-between text-[11px] text-slate-500">
              <span>Author: <strong className="text-slate-400">{strat.author}</strong></span>
              <span className="text-emerald-400 font-bold">Verified Edge</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}