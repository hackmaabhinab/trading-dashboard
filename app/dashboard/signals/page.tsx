'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { sanitizeInput } from '../../../lib/sanitize';
import { 
  Radio, 
  Lock, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Sparkles, 
  Trash2, 
  Filter,
  Image as ImageIcon,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function SignalsPage() {
  const [isAdmin, setIsAdmin] = useState(true);
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ALL');

  // Form States
  const [pair, setPair] = useState('XAUUSD');
  const [type, setType] = useState('BUY MARKET');
  const [entry, setEntry] = useState('');
  const [sl, setSl] = useState('');
  const [tp1, setTp1] = useState('');
  const [tp2, setTp2] = useState('');
  const [notes, setNotes] = useState('');

  // TradingView Chart States
  const [chartUrl, setChartUrl] = useState('');
  const [showChartInput, setShowChartInput] = useState(false);

  // Zoom Image Viewer States
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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

    // Realtime Subscription
    const channel = supabase
      .channel('realtime_signals')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'signals' },
        (payload) => {
          setSignals((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'signals' },
        (payload) => {
          setSignals((prev) =>
            prev.map((s) => (s.id === payload.new.id ? payload.new : s))
          );
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'signals' },
        (payload) => {
          setSignals((prev) => prev.filter((s) => s.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
        entry_price: parseFloat(sanitizeInput(entry)),
        stop_loss: parseFloat(sanitizeInput(sl)),
        take_profit: tp1 ? parseFloat(sanitizeInput(tp1)) : null,
        status: 'ACTIVE',
        notes: sanitizeInput(notes),
        chart_url: chartUrl.trim() ? chartUrl.trim() : null,
      };

      const { data, error } = await supabase
        .from('signals')
        .insert([sanitizedData])
        .select();

      if (error) {
        console.error('Supabase Insert Error:', error);
        toast.error(`Database Error: ${error.message}`);
      } else if (data && data.length > 0) {
        setEntry('');
        setSl('');
        setTp1('');
        setTp2('');
        setNotes('');
        setChartUrl('');
        setShowChartInput(false);
        toast.success('Signal Broadcasted Successfully! 🚀');
      }
    } catch (err: any) {
      console.error('Catch Error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from('signals')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success(`Status updated to ${newStatus}`);
    }
  };

  const handleDeleteSignal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this signal?')) return;

    const { error } = await supabase
      .from('signals')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error(`Delete failed: ${error.message}`);
    } else {
      setSignals((prev) => prev.filter((s) => s.id !== id));
      toast.success('Signal deleted successfully');
    }
  };

  // Zoom Handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  // Filter signals according to selected tab
  const filteredSignals = signals.filter((s) => {
    if (activeTab === 'ACTIVE') return s.status === 'ACTIVE';
    if (activeTab === 'CLOSED') return s.status !== 'ACTIVE';
    return true;
  });

  const activeCount = signals.filter((s) => s.status === 'ACTIVE').length;
  const closedCount = signals.filter((s) => s.status !== 'ACTIVE').length;

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

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Take Profit Target</label>
              <input
                type="text"
                value={tp1}
                onChange={(e) => setTp1(e.target.value)}
                placeholder="2515.00"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          {/* Conditional TradingView Screenshot URL Field */}
          {showChartInput && (
            <div className="flex items-center gap-2 bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2">
              <ImageIcon className="w-4 h-4 text-rose-400 shrink-0" />
              <input
                type="url"
                value={chartUrl}
                onChange={(e) => setChartUrl(e.target.value)}
                placeholder="Paste TradingView Chart Screenshot URL (e.g. https://s3.tradingview.com/snapshots/...)..."
                className="w-full bg-transparent text-xs text-slate-200 font-mono focus:outline-none"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Confluences / Execution note..."
              className="flex-1 bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
            />

            <button
              type="button"
              onClick={() => setShowChartInput(!showChartInput)}
              className="px-3 py-2 bg-[#070A10] border border-blue-900/40 hover:border-rose-500 text-xs text-slate-300 font-mono rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
            >
              <ImageIcon className="w-4 h-4 text-rose-400" />
              {showChartInput ? 'Remove Chart' : 'Add TradingView Chart'}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50 whitespace-nowrap"
            >
              {submitting ? 'Broadcasting...' : 'Broadcast Signal'}
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase text-slate-400">Filter Signals:</span>
        </div>

        <div className="flex items-center gap-2 bg-[#0B0F17] p-1 rounded-xl border border-blue-900/30 text-xs">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({signals.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('CLOSED')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'CLOSED'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Closed ({closedCount})
          </button>
        </div>
      </div>

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
        ) : filteredSignals.length === 0 ? (
          <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-12 text-center space-y-3">
            <Sparkles className="w-10 h-10 text-blue-500/50 mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-slate-300">No {activeTab !== 'ALL' ? activeTab : ''} Signals Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Waiting for high-probability setups or adjust your active tab filter above.
            </p>
          </div>
        ) : (
          filteredSignals.map((s) => (
            <div
              key={s.id}
              className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-slate-100">{s.pair}</span>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-bold ${
                      s.type?.includes('BUY')
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
                      s.status?.includes('TP')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : s.status?.includes('SL')
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {s.status}
                  </span>

                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteSignal(s.id)}
                      className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-all ml-1"
                      title="Delete Signal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#070A10] p-4 rounded-xl border border-blue-900/30 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block">Entry Level:</span>
                  <span className="text-slate-200 font-bold text-sm">{s.entry_price ?? '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Stop Loss (SL):</span>
                  <span className="text-rose-400 font-bold text-sm">{s.stop_loss ?? '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Take Profit (TP):</span>
                  <span className="text-emerald-400 font-bold text-sm">{s.take_profit ?? '-'}</span>
                </div>
              </div>

              {s.notes && (
                <p className="text-xs text-slate-300 italic bg-[#070A10]/50 p-3 rounded-lg border border-blue-900/20">
                  "{s.notes}"
                </p>
              )}

              {/* TradingView Screenshot Image Rendering */}
              {s.chart_url && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-rose-400" /> TradingView Analysis Chart:
                    </span>
                    <a
                      href={s.chart_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-rose-400 hover:underline flex items-center gap-1"
                    >
                      Open Link <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div 
                    onClick={() => {
                      setSelectedChart(s.chart_url);
                      setZoomLevel(1);
                    }}
                    className="relative group rounded-xl overflow-hidden border border-blue-900/40 bg-[#070A10] cursor-pointer"
                  >
                    <img
                      src={s.chart_url}
                      alt="TradingView Chart Setup"
                      className="w-full max-h-96 object-contain transition-transform duration-300 group-hover:scale-[1.01]"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-mono text-white gap-2 font-bold">
                      <ZoomIn className="w-4 h-4 text-rose-400" /> Click to Zoom Chart
                    </div>
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="pt-2 border-t border-blue-900/20 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[10px] uppercase font-bold mr-2">Quick Update Status:</span>
                  <button
                    onClick={() => handleUpdateStatus(s.id, 'HIT TP 🎯')}
                    className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/20 flex items-center gap-1 font-bold transition-all text-[11px]"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Hit TP
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

      {/* Lightbox Modal with Interactive Zoom Controls */}
      {selectedChart && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition-all"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl border border-slate-600 transition-all"
              title="Reset Zoom"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSelectedChart(null)}
              className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full h-full overflow-auto flex items-center justify-center p-8">
            <img
              src={selectedChart}
              alt="Zoomed Chart"
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out"
            />
          </div>
        </div>
      )}
    </div>
  );
}