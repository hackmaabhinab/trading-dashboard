'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { PlusCircle, Search, Filter, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';

export default function JournalPage() {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOutcome, setFilterOutcome] = useState('ALL');

  // Form State
  const [pair, setPair] = useState('XAUUSD');
  const [setupType, setSetupType] = useState('SMC Order Block');
  const [riskPct, setRiskPct] = useState('1.0');
  const [rrRatio, setRrRatio] = useState('3.0');
  const [outcome, setOutcome] = useState('WIN');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTrades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data) setTrades(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const handleCreateTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('trades').insert([
      {
        pair,
        setup_type: setupType,
        risk_pct: parseFloat(riskPct),
        rr_ratio: parseFloat(rrRatio),
        outcome,
        notes,
      },
    ]);

    if (!error) {
      setNotes('');
      fetchTrades();
    }
    setSubmitting(false);
  };

  const filteredTrades = trades.filter((t) => {
    const matchesSearch = t.pair?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.setup_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterOutcome === 'ALL' || t.outcome === filterOutcome;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Trade Journal</h2>
        <p className="text-slate-400 text-sm mt-1">Manual execution entry & trade log management</p>
      </div>

      {/* Manual Entry Form */}
      <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-blue-400" /> New Trade Log
        </h3>

        <form onSubmit={handleCreateTrade} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Pair</label>
            <input
              type="text"
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              required
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Setup Type</label>
            <input
              type="text"
              value={setupType}
              onChange={(e) => setSetupType(e.target.value)}
              required
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Risk %</label>
            <input
              type="number"
              step="0.1"
              value={riskPct}
              onChange={(e) => setRiskPct(e.target.value)}
              required
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">R:R Ratio</label>
            <input
              type="number"
              step="0.1"
              value={rrRatio}
              onChange={(e) => setRrRatio(e.target.value)}
              required
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Outcome</label>
            <select
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="WIN">WIN</option>
              <option value="LOSS">LOSS</option>
              <option value="BE">BE</option>
            </select>
          </div>

          <div className="md:col-span-3 lg:col-span-5">
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Trade Notes / Confluences</label>
            <input
              type="text"
              placeholder="e.g. 15m Liquidity Sweep + FVG Entry"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {submitting ? 'Logging...' : 'Log Execution'}
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Table Section */}
      <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search pair or setup..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            {['ALL', 'WIN', 'LOSS', 'BE'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterOutcome(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterOutcome === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#070A10] text-slate-400 hover:text-slate-200 border border-blue-900/40'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-900/40 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Pair</th>
                <th className="py-3 px-4">Setup</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">R:R</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/20 text-sm text-slate-300">
              {loading ? (
                <tr><td colSpan={7} className="py-6 text-center text-slate-500">Loading trades...</td></tr>
              ) : filteredTrades.length === 0 ? (
                <tr><td colSpan={7} className="py-6 text-center text-slate-500">No matching trades found.</td></tr>
              ) : (
                filteredTrades.map((t) => (
                  <tr key={t.id} className="hover:bg-blue-950/20 transition-all">
                    <td className="py-3 px-4 font-mono text-slate-500">#{t.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-100">{t.pair}</td>
                    <td className="py-3 px-4 text-blue-300">{t.setup_type}</td>
                    <td className="py-3 px-4 font-mono">{t.risk_pct}%</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-200">{t.rr_ratio}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide flex items-center gap-1 w-fit ${
                        t.outcome === 'WIN'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          : t.outcome === 'LOSS'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {t.outcome === 'WIN' && <CheckCircle2 className="w-3 h-3" />}
                        {t.outcome === 'LOSS' && <XCircle className="w-3 h-3" />}
                        {t.outcome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{t.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}