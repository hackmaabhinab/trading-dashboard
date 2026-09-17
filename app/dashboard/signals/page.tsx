'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { sanitizeInput } from '../../../lib/sanitize';
import { Radio, Lock, Send, Clock, CheckCircle2, XCircle, MinusCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function SignalsPage() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [pair, setPair] = useState('XAUUSD');
  const [type, setType] = useState('BUY MARKET');
  const [entry, setEntry] = useState('');
  const [sl, setSl] = useState('');
  const [tp1, setTp1] = useState('');
  const [tp2, setTp2] = useState('');
  const [notes, setNotes] = useState('');

  const fetchSignals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('signals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch Error:', error);
      toast.error('Failed to load signals from Supabase');
    } else if (data) {
      setSignals(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handlePostSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry || !sl) {
      toast.error('Please enter Entry Price and Stop Loss');
      return;
    }

    setSubmitting(true);

    try {
      const sanitizedData = {
        pair: sanitizeInput(pair),
        type: sanitizeInput(type),
        entry: sanitizeInput(entry),
        sl: sanitizeInput(sl),
        tp1: sanitizeInput(tp1),
        tp2: sanitizeInput(tp2),
        notes: sanitizeInput(notes),
        status: 'ACTIVE',
      };

      const { data, error } = await supabase
        .from('signals')
        .insert([sanitizedData])
        .select();

      if (error) {
        console.error('Supabase Insert Error:', error);
        toast.error(`Database Error: ${error.message}`);
      } else if (data && data.length > 0) {
        setSignals([data[0], ...signals]);
        setEntry('');
        setSl('');
        setTp1('');
        setTp2('');
        setNotes('');
        toast.success('Signal Broadcasted Successfully! 🚀');
      }
    } catch (err: any) {
      console.error('Catch Error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Action Handler for Signal Status Update
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('signals')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      setSignals(signals.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Radio className="w-8 h-8 text-rose-500 animate-pulse" /> Live VIP Signals & Broadcast
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Read-only institutional signal channel (Broadcasted exclusively by Admin)
          </p>
        </div>

        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
            isAdmin
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
              : 'bg-blue-600/10 border-blue-500/40 text-blue-400'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          {isAdmin ? 'Admin Mode Active' : 'User Mode (Read Only)'}
        </button>
      </div>

      {/* Admin Broadcaster Box */}
      {isAdmin && (
        <form onSubmit={handlePostSignal} className="bg-[#0B0F17] border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <Send className="w-4 h-4" /> Broadcast Trade Setup
            </h3>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono px-2.5 py-1 rounded-md font-bold uppercase">
              Admin Verified Terminal
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Pair</label>
              <input
                type="text"
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                required
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Execution Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="BUY MARKET">BUY MARKET</option>
                <option value="SELL MARKET">SELL MARKET</option>
                <option value="BUY LIMIT">BUY LIMIT</option>
                <option value="SELL LIMIT">SELL LIMIT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Entry Price</label>
              <input
                type="text"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                required
                placeholder="2500.00"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Stop Loss (SL)</label>
              <input
                type="text"
                value={sl}
                onChange={(e) => setSl(e.target.value)}
                required
                placeholder="2490.00"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Take Profit 1</label>
              <input
                type="text"
                value={tp1}
                onChange={(e) => setTp1(e.target.value)}
                placeholder="2515.00"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Take Profit 2</label>
              <input
                type="text"
                value={tp2}
                onChange={(e) => setTp2(e.target.value)}
                placeholder="2530.00"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Confluences / Execution note..."
              className="flex-1 bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              {submitting ? 'Broadcasting...' : 'Broadcast Signal'}
            </button>
          </div>
        </form>
      )}

      {/* Broadcast Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 h-40 animate-pulse flex flex-col justify-between">
                <div className="h-6 bg-blue-900/30 rounded w-1/4"></div>
                <div className="h-12 bg-blue-900/20 rounded w-full"></div>
                <div className="h-4 bg-blue-900/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-12 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-blue-500/50 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-300">No Signal Broadcasts Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Waiting for high-probability Institutional setups. Signals will automatically display here once broadcasted by Admin.
            </p>
          </div>
        ) : (
          signals.map((s) => (
            <div
              key={s.id}
              className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-slate-100">{s.pair}</span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold ${
                      s.type.includes('BUY')
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {s.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" /> {new Date(s.created_at).toLocaleTimeString()}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold ${
                      s.status.includes('TP')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : s.status.includes('SL')
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#070A10] p-4 rounded-xl border border-blue-900/30 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block">Entry Level:</span>
                  <span className="text-slate-200 font-bold text-sm">{s.entry}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stop Loss (SL):</span>
                  <span className="text-rose-400 font-bold text-sm">{s.sl}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Target TP1:</span>
                  <span className="text-emerald-400 font-bold text-sm">{s.tp1 || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Target TP2:</span>
                  <span className="text-emerald-400 font-bold text-sm">{s.tp2 || '-'}</span>
                </div>
              </div>

              {s.notes && (
                <p className="text-xs text-slate-300 italic bg-[#070A10]/50 p-3 rounded-lg border border-blue-900/20">
                  "{s.notes}"
                </p>
              )}

              {isAdmin && (
                <div className="pt-2 border-t border-blue-900/20 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[10px] uppercase font-bold mr-2">Quick Update Status:</span>
                  <button
                    onClick={() => handleUpdateStatus(s.id, 'HIT TP1 🎯')}
                    className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 flex items-center gap-1 font-bold transition-all text-[11px]"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Hit TP1
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(s.id, 'HIT TP2 🚀')}
                    className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 flex items-center gap-1 font-bold transition-all text-[11px]"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Hit TP2
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(s.id, 'HIT SL ❌')}
                    className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg hover:bg-rose-500/20 flex items-center gap-1 font-bold transition-all text-[11px]"
                  >
                    <XCircle className="w-3 h-3" /> Hit SL
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(s.id, 'CLOSED @ BE ⚖️')}
                    className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/20 flex items-center gap-1 font-bold transition-all text-[11px]"
                  >
                    <MinusCircle className="w-3 h-3" /> Close BE
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}