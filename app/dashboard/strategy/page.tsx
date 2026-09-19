'use client';

import React, { useState } from 'react';
import { Compass, Plus, BookOpen, Layers, CheckCircle, Target, X } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

interface Strategy {
  id: string;
  title: string;
  category: string;
  winRate: string;
  riskReward: string;
  timeframe: string;
  description: string;
  rules: string[];
  chartUrl?: string;
  createdAt: string;
}

export default function StrategyPage() {
  // Production me yeh role check auth state se replace hoga
  const [isAdmin] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Institutional SMC');
  const [winRate, setWinRate] = useState('75%');
  const [riskReward, setRiskReward] = useState('1:3+');
  const [timeframe, setTimeframe] = useState('15m / 1h');
  const [description, setDescription] = useState('');
  const [rulesInput, setRulesInput] = useState('');
  const [chartUrl, setChartUrl] = useState('');

  // Initial Strategies List
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      title: 'XAUUSD Liquidity Grab & Order Block Entry Model',
      category: 'Smart Money Concepts (SMC)',
      winRate: '78%',
      riskReward: '1:3.5',
      timeframe: '15m / 1h',
      description: 'High-probability execution framework focusing on London/NY session sweep of internal liquidity followed by Displacement into an Unmitigated Fair Value Gap (FVG).',
      rules: [
        'Identify Asian Session High/Low Liquidity Sweep.',
        'Wait for clear Displacement on 5m/15m chart breaking Market Structure (MSS).',
        'Place Limit Order at 50% of the FVG or Mitigated Order Block.',
        'Invalidation SL above/below the Liquidity Sweep High/Low.'
      ],
      createdAt: '2026-09-19'
    }
  ]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const rulesArray = rulesInput
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const newStrategy: Strategy = {
      id: Date.now().toString(),
      title,
      category,
      winRate,
      riskReward,
      timeframe,
      description,
      rules: rulesArray.length > 0 ? rulesArray : ['Follow strict risk management protocols.'],
      chartUrl: chartUrl.trim() ? chartUrl : undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStrategies([newStrategy, ...strategies]);
    setIsModalOpen(false);

    // Reset Form
    setTitle('');
    setDescription('');
    setRulesInput('');
    setChartUrl('');
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 p-6 space-y-6 w-full font-sans">
      {/* Page Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Institutional Playbook & Strategies</h1>
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            Proven execution models, entry rules, and edge frameworks published by Admin
          </p>
        </div>

        {/* Publish Strategy Button (Only for Admin) */}
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-emerald-950/50 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Strategy</span>
          </button>
        )}
      </div>

      {/* Strategies List Feed */}
      {strategies.length === 0 ? (
        <div className="bg-[#07070A] border border-neutral-800/80 rounded-2xl p-20 flex flex-col items-center justify-center text-center space-y-3 min-h-[350px]">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No strategies published yet</h3>
          <p className="text-xs text-neutral-500 max-w-sm">
            Click on &quot;Publish Strategy&quot; to add your first trading framework.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {strategies.map((strat) => (
            <div
              key={strat.id}
              className="bg-[#0D0D11] border border-neutral-800/80 hover:border-neutral-700 rounded-2xl p-6 transition-all space-y-5"
            >
              {/* Top Meta Info */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/60 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-0.5 rounded-md uppercase">
                    {strat.category}
                  </span>
                  <h2 className="text-lg font-bold text-white pt-1">{strat.title}</h2>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="bg-[#121218] border border-neutral-800 px-3 py-1.5 rounded-xl text-center">
                    <span className="text-[9px] text-neutral-500 block">EST. WIN RATE</span>
                    <span className="text-emerald-400 font-bold">{strat.winRate}</span>
                  </div>
                  <div className="bg-[#121218] border border-neutral-800 px-3 py-1.5 rounded-xl text-center">
                    <span className="text-[9px] text-neutral-500 block">RISK : REWARD</span>
                    <span className="text-emerald-400 font-bold">{strat.riskReward}</span>
                  </div>
                  <div className="bg-[#121218] border border-neutral-800 px-3 py-1.5 rounded-xl text-center">
                    <span className="text-[9px] text-neutral-500 block">TIMEFRAME</span>
                    <span className="text-amber-400 font-bold">{strat.timeframe}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-neutral-300 leading-relaxed">{strat.description}</p>

              {/* Execution Rules Checklist */}
              {strat.rules.length > 0 && (
                <div className="bg-[#121218] border border-neutral-800/60 rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-300 uppercase">
                    <Target className="w-4 h-4 text-rose-400" />
                    <span>Execution Rules & Checklist:</span>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {strat.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Chart Image preview if provided */}
              {strat.chartUrl && (
                <div className="rounded-xl overflow-hidden border border-neutral-800 max-h-80 bg-black">
                  <img src={strat.chartUrl} alt="Strategy Chart Example" className="w-full object-cover" />
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1">
                <span>Published on: {strat.createdAt}</span>
                <span>Verified Admin Model</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Publish Strategy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D11] border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase font-mono">
                <Layers className="w-4 h-4" />
                <span>Publish New Trading Model</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Strategy Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. London Sweep ICT Order Block Model"
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Win Rate</label>
                  <input
                    type="text"
                    value={winRate}
                    onChange={(e) => setWinRate(e.target.value)}
                    className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Risk : Reward</label>
                  <input
                    type="text"
                    value={riskReward}
                    onChange={(e) => setRiskReward(e.target.value)}
                    className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Timeframe</label>
                  <input
                    type="text"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">Overview & Logic</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the strategy logic, session timing, and market conditions..."
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl p-3 text-xs outline-none h-20 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Execution Rules (One rule per line)
                </label>
                <textarea
                  value={rulesInput}
                  onChange={(e) => setRulesInput(e.target.value)}
                  placeholder={'Rule 1: Wait for Asian Session Liquidity Sweep\nRule 2: Look for 5m MSS with FVG\nRule 3: Entry at 50% FVG mitigation'}
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl p-3 text-xs font-mono outline-none h-24 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">TradingView Chart Image URL (Optional)</label>
                <input
                  type="text"
                  value={chartUrl}
                  onChange={(e) => setChartUrl(e.target.value)}
                  placeholder="https://s3.tradingview.com/snapshots/..."
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2 text-xs font-mono outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  Publish Strategy Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}