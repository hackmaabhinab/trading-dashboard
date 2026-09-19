'use client';

import React, { useState } from 'react';
import { Radio, Send, Filter, Image as ImageIcon, Sparkles, CheckCircle2, XCircle, ShieldAlert, Link as LinkIcon, ExternalLink, X } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

interface Signal {
  id: string;
  pair: string;
  executionType: string;
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
  note: string;
  chartUrl?: string;
  timestamp: string;
  status: 'Active' | 'Closed';
  outcome?: 'TP HIT' | 'SL HIT' | 'BREAK EVEN';
}

export default function SignalsPage() {
  // Production me auth session se admin status verify hoga
  const [isAdmin] = useState(true); 

  // Form States
  const [pair, setPair] = useState('XAUUSD');
  const [executionType, setExecutionType] = useState('BUY MARKET');
  const [entryPrice, setEntryPrice] = useState('2500.00');
  const [stopLoss, setStopLoss] = useState('2490.00');
  const [takeProfit, setTakeProfit] = useState('2515.00');
  const [note, setNote] = useState('');
  
  // TradingView Modal & Chart URL State
  const [chartUrl, setChartUrl] = useState('');
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  // Signals State
  const [signals, setSignals] = useState<Signal[]>([]);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Closed'>('All');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pair || !entryPrice) return;

    const newSignal: Signal = {
      id: Date.now().toString(),
      pair,
      executionType,
      entryPrice,
      stopLoss,
      takeProfit,
      note,
      chartUrl: chartUrl.trim() ? chartUrl.trim() : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
    };

    setSignals([newSignal, ...signals]);
    setNote('');
    setChartUrl('');
  };

  // Admin Actions Handler (TP, SL, BE)
  const handleSignalAction = (id: string, action: 'TP' | 'SL' | 'BE') => {
    setSignals((prev) =>
      prev.map((sig) => {
        if (sig.id !== id) return sig;

        if (action === 'TP') {
          return { ...sig, status: 'Closed', outcome: 'TP HIT' };
        } else if (action === 'SL') {
          return { ...sig, status: 'Closed', outcome: 'SL HIT' };
        } else if (action === 'BE') {
          return { ...sig, outcome: 'BREAK EVEN', stopLoss: sig.entryPrice };
        }
        return sig;
      })
    );
  };

  const filteredSignals = signals.filter((signal) => {
    if (activeFilter === 'Active') return signal.status === 'Active';
    if (activeFilter === 'Closed') return signal.status === 'Closed';
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-slate-200 p-6 space-y-6 w-full font-sans">
      {/* Top Header Title Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Radio className="w-6 h-6 text-emerald-500 animate-pulse" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Live VIP Signals & Broadcast</h1>
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            Read-only institutional signal channel (Broadcasted exclusively by Admin)
          </p>
        </div>
      </div>

      {/* Broadcast Form Panel (Visible Only To Admin) */}
      {isAdmin && (
        <div className="bg-[#0D0D11] border border-neutral-800/80 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800/60 mb-5">
            <div className="flex items-center gap-2 text-emerald-500 text-xs font-semibold tracking-wider uppercase">
              <Send className="w-4 h-4" />
              <span>Broadcast Trade Setup</span>
            </div>
            <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-2.5 py-1 rounded-md uppercase tracking-wider">
              ADMIN VERIFIED TERMINAL
            </span>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1.5 block">PAIR</label>
                <input
                  type="text"
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none transition-colors"
                  placeholder="e.g. XAUUSD"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1.5 block">EXECUTION TYPE</label>
                <select
                  value={executionType}
                  onChange={(e) => setExecutionType(e.target.value)}
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none transition-colors cursor-pointer"
                >
                  <option value="BUY MARKET">BUY MARKET</option>
                  <option value="SELL MARKET">SELL MARKET</option>
                  <option value="BUY LIMIT">BUY LIMIT</option>
                  <option value="SELL LIMIT">SELL LIMIT</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1.5 block">ENTRY PRICE</label>
                <input
                  type="text"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none transition-colors"
                  placeholder="2500.00"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1.5 block">STOP LOSS (SL)</label>
                <input
                  type="text"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none transition-colors"
                  placeholder="2490.00"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1.5 block">TAKE PROFIT TARGET</label>
                <input
                  type="text"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none transition-colors"
                  placeholder="2515.00"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Confluences / Execution note..."
                className="flex-1 w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsChartModalOpen(true)}
                  className={`flex items-center gap-2 bg-[#16161F] hover:bg-neutral-800 border ${
                    chartUrl ? 'border-emerald-500 text-emerald-400' : 'border-neutral-800 text-neutral-300'
                  } px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{chartUrl ? 'Chart Attached ✓' : 'Add TradingView Chart'}</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/50 shrink-0"
                >
                  <span>Broadcast Signal</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TradingView Chart Input Modal */}
      {isChartModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D0D11] border border-neutral-800 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <LinkIcon className="w-4 h-4" />
                <span>Attach TradingView Chart Link</span>
              </div>
              <button
                onClick={() => setIsChartModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-neutral-400 uppercase block">TradingView Image / Snapshot URL</label>
              <input
                type="url"
                value={chartUrl}
                onChange={(e) => setChartUrl(e.target.value)}
                placeholder="https://www.tradingview.com/x/..."
                className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsChartModalOpen(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-4 py-2 rounded-xl text-xs font-mono transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs Bar */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>FILTER SIGNALS:</span>
        </div>

        <div className="flex items-center gap-1 bg-[#0D0D11] p-1 rounded-xl border border-neutral-800/80">
          {(['All', 'Active', 'Closed'] as const).map((filter) => {
            const count =
              filter === 'All'
                ? signals.length
                : signals.filter((s) => s.status === filter).length;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white font-semibold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                {filter} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Signals Display Feed Container */}
      {filteredSignals.length === 0 ? (
        <div className="bg-[#07070A] border border-neutral-800/80 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-3 min-h-[320px]">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-center text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No Signals Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm">
            Waiting for high-probability setups or adjust your active tab filter above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSignals.map((signal) => (
            <div
              key={signal.id}
              className="bg-[#0D0D11] border border-neutral-800/80 hover:border-neutral-700 rounded-2xl p-5 transition-all space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800/50 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold font-mono text-white">{signal.pair}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      signal.executionType.includes('BUY')
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                        : 'bg-rose-950/60 text-rose-400 border border-rose-800/50'
                    }`}
                  >
                    {signal.executionType}
                  </span>

                  {signal.outcome && (
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                        signal.outcome === 'TP HIT'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : signal.outcome === 'SL HIT'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {signal.outcome}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-neutral-500">{signal.timestamp}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                      signal.status === 'Active'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800/40'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {signal.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-[#121218] p-2.5 rounded-xl border border-neutral-800/50">
                  <span className="text-[10px] text-neutral-500 block">ENTRY PRICE</span>
                  <span className="text-white font-bold">{signal.entryPrice}</span>
                </div>
                <div className="bg-[#121218] p-2.5 rounded-xl border border-neutral-800/50">
                  <span className="text-[10px] text-rose-400 block">STOP LOSS</span>
                  <span className="text-rose-300 font-bold">{signal.stopLoss}</span>
                </div>
                <div className="bg-[#121218] p-2.5 rounded-xl border border-neutral-800/50">
                  <span className="text-[10px] text-emerald-400 block">TAKE PROFIT</span>
                  <span className="text-emerald-300 font-bold">{signal.takeProfit}</span>
                </div>
              </div>

              {signal.note && (
                <p className="text-xs text-neutral-400 bg-[#121218]/50 p-2.5 rounded-xl border border-neutral-800/30 font-sans">
                  <span className="text-neutral-500 font-semibold mr-1">Note:</span> {signal.note}
                </p>
              )}

              {/* TradingView Chart Button on Signal Card */}
              {signal.chartUrl && (
                <a
                  href={signal.chartUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#121218] hover:bg-neutral-800 border border-neutral-800 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View TradingView Chart Setup</span>
                </a>
              )}

              {/* Admin Action Buttons (TP, SL, BE Controls) */}
              {isAdmin && signal.status === 'Active' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800/40">
                  <span className="text-[10px] font-mono text-neutral-500 mr-auto uppercase">Admin Actions:</span>

                  <button
                    onClick={() => handleSignalAction(signal.id, 'BE')}
                    className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Set BE</span>
                  </button>

                  <button
                    onClick={() => handleSignalAction(signal.id, 'SL')}
                    className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>SL Hit</span>
                  </button>

                  <button
                    onClick={() => handleSignalAction(signal.id, 'TP')}
                    className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-lg font-mono transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>TP Hit</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}