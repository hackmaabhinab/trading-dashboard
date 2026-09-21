'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Flame, 
  RefreshCw, 
  ExternalLink, 
  Clock, 
  AlertTriangle, 
  Filter,
  Layers,
  Radio
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  country: string;
  date: string;
  time: string;
  impact: 'High' | 'Medium' | 'Low' | string;
  forecast: string;
  previous: string;
  actual: string;
}

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  isUSD: boolean;
  impact: string;
}

export default function LiveMarketNewsPage() {
  const [calendar, setCalendar] = useState<CalendarEvent[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState<boolean>(true);
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  
  // Filters
  const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');
  const [impactFilter, setImpactFilter] = useState<string>('ALL');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchAllData = async () => {
    setLoadingCalendar(true);
    setLoadingNews(true);

    try {
      // 1. Fetch Economic Calendar
      const calRes = await fetch('/api/economic-calendar');
      const calData = await calRes.json();
      if (calData.data) {
        setCalendar(calData.data);
      }

      // 2. Fetch USD Breaking News
      const newsRes = await fetch('/api/usd-news');
      const newsData = await newsRes.json();
      if (newsData.items) {
        setNews(newsData.items);
      }

      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoadingCalendar(false);
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    
    // Har 1 ghante (3600000 ms) me automatic refresh
    const interval = setInterval(fetchAllData, 3600000);
    return () => clearInterval(interval);
  }, []);

  // Filtered Calendar Events
  const filteredEvents = calendar.filter((item) => {
    if (selectedCurrency !== 'ALL' && item.country !== selectedCurrency) return false;
    if (impactFilter === 'HIGH' && item.impact.toLowerCase() !== 'high') return false;
    return true;
  });

  // Impact Color Badge Helper (Forex Factory Folder Styles)
  const getImpactBadge = (impact: string) => {
    const imp = impact.toLowerCase();
    if (imp === 'high') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded uppercase">
          <Flame className="w-3 h-3 fill-rose-500" /> HIGH
        </span>
      );
    }
    if (imp === 'medium') {
      return (
        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded uppercase">
          MED
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono font-bold text-yellow-500/80 bg-yellow-950/40 border border-yellow-800/40 px-2 py-0.5 rounded uppercase">
        LOW
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-200 p-3 lg:p-6 space-y-6 w-full font-sans">
      
      {/* Top Header Bar */}
      <div className="bg-[#12131C] border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Macro Economic Wire & Calendar
            </h1>
            <p className="text-xs text-neutral-400 font-mono">
              Live Forex Factory Economic Feed • 1-Hour Auto Sync Cycle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {lastRefreshed && (
            <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
              Last Sync: {lastRefreshed}
            </span>
          )}
          
          <button 
            onClick={fetchAllData}
            disabled={loadingCalendar || loadingNews}
            className="flex items-center gap-2 bg-[#0B0C10] hover:bg-neutral-800 border border-neutral-800 px-3.5 py-2 rounded-xl text-xs font-mono text-emerald-400 transition-all cursor-pointer active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingCalendar || loadingNews ? 'animate-spin' : ''}`} />
            <span>Sync Live Feed</span>
          </button>
        </div>
      </div>

      {/* Main 2-Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SECTION 1: FOREX FACTORY ECONOMIC CALENDAR (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-[#12131C] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
            
            {/* Calendar Header & Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <Calendar className="w-4 h-4" />
                <span>Forex Economic Calendar</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Currency Filter */}
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-[#0B0C10] border border-neutral-800 text-white rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Currencies</option>
                  <option value="USD">USD Only</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>

                {/* High Impact Filter */}
                <button
                  onClick={() => setImpactFilter(impactFilter === 'HIGH' ? 'ALL' : 'HIGH')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
                    impactFilter === 'HIGH'
                      ? 'bg-rose-950 border-rose-800 text-rose-400'
                      : 'bg-[#0B0C10] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  High Impact Only
                </button>
              </div>
            </div>

            {/* Events List Table */}
            {loadingCalendar ? (
              <div className="py-20 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                <p className="text-xs text-neutral-400 font-mono">Loading Forex Factory Calendar...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="py-12 text-center text-neutral-500 text-xs font-mono">
                No economic events found matching filter parameters.
              </div>
            ) : (
              <div className="space-y-2 overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="text-[10px] text-neutral-500 uppercase border-b border-neutral-800/80 pb-2">
                      <th className="py-2 px-1">Time</th>
                      <th className="py-2 px-1">Curr</th>
                      <th className="py-2 px-1">Impact</th>
                      <th className="py-2 px-2">Event</th>
                      <th className="py-2 px-1 text-right">Forecast</th>
                      <th className="py-2 px-1 text-right">Previous</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {filteredEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-[#181926] transition-colors">
                        <td className="py-3 px-1 text-neutral-400 whitespace-nowrap">{evt.time || 'All Day'}</td>
                        <td className="py-3 px-1 font-bold text-white">{evt.country}</td>
                        <td className="py-3 px-1">{getImpactBadge(evt.impact)}</td>
                        <td className="py-3 px-2 font-sans font-medium text-slate-200">{evt.title}</td>
                        <td className="py-3 px-1 text-right text-emerald-400 font-bold">{evt.forecast}</td>
                        <td className="py-3 px-1 text-right text-neutral-400">{evt.previous}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

        {/* SECTION 2: BREAKING USD NEWS & HIGH IMPACT ALERTS (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#12131C] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>USD Breaking Alerts & News</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Live Wire Feed</span>
            </div>

            {loadingNews ? (
              <div className="py-20 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-rose-500 animate-spin mx-auto" />
                <p className="text-xs text-neutral-400 font-mono">Fetching Macro Breaking Wire...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {news.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                      item.isUSD 
                        ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700/60' 
                        : 'bg-[#0B0C10] border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.isUSD ? 'bg-rose-900/80 text-rose-200' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {item.impact}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.pubDate}
                      </span>
                    </div>

                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-white hover:text-emerald-400 transition-colors flex items-start justify-between gap-2 leading-snug"
                    >
                      <span>{item.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                    </a>

                    {item.description && (
                      <p className="text-[11px] text-neutral-400 font-sans leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}