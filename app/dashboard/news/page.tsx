'use client';

import React, { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  Newspaper, 
  ExternalLink, 
  Clock, 
  Globe, 
  RefreshCw
} from 'lucide-react';

interface Article {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
}

export default function LiveMarketNewsPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLiveNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news');
      const data = await response.json();

      if (data.status === 'ok' && data.items) {
        setNews(data.items);
      }
    } catch (err) {
      console.error("Client fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveNews();
    const interval = setInterval(fetchLiveNews, 300000); // 5 min auto refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#07080B] text-slate-200 p-3 lg:p-4 space-y-4 w-full font-sans">
      
      {/* Top Header & Live Status */}
      <div className="bg-[#12131C] border border-neutral-800 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="bg-[#1A1B26] border border-neutral-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-sm text-white uppercase bg-emerald-600 px-1.5 py-0.5 rounded text-[10px]">LIVE</span>
            <span className="font-bold text-xs tracking-tight text-white">MARKET<span className="text-emerald-400">WIRE</span></span>
          </div>
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">| Real-Time Global Economic Feeds</span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLiveNews}
            className="flex items-center gap-1.5 bg-[#0B0C10] hover:bg-neutral-800 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
          
          <div className="flex items-center gap-2 bg-[#0B0C10] border border-neutral-800 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-semibold">Live Synced</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Live News Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#12131C] border border-neutral-800 rounded-2xl p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                <Newspaper className="w-4 h-4" />
                <span>Real-Time Market Stream</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Auto-updating live wire</span>
            </div>

            {loading && news.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin mx-auto" />
                <p className="text-xs text-neutral-400 font-mono">Fetching live economic stream...</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800/60 space-y-3">
                {news.map((item, index) => (
                  <div key={index} className="pt-3 first:pt-0 flex flex-col gap-1.5 hover:bg-[#181926] p-3 rounded-xl transition-colors">
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs md:text-sm font-semibold text-slate-100 hover:text-emerald-400 transition-colors flex items-center justify-between gap-2"
                    >
                      <span>{item.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    </a>
                    
                    {item.description && (
                      <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 pt-1">
                      <span className="text-emerald-400 font-medium">{item.source}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.pubDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Status */}
        <div className="space-y-4">
          <div className="bg-[#12131C] border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider pb-2 border-b border-neutral-800">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Live Market Sessions</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between bg-[#0B0C10] p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-400">London Session</span>
                <span className="text-emerald-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between bg-[#0B0C10] p-2.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-400">New York Session</span>
                <span className="text-emerald-400 font-bold">OPENING SOON</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}