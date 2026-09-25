'use client';

import React, { useState, useRef, useEffect } from 'react';
import BacktestTerminal from '@/components/BacktestTerminal';
import { Plus, X, BarChart2, Briefcase, History, Search, ChevronDown } from 'lucide-react';

export interface SessionConfig {
  name: string;
  balance: number;
  asset: string;
  timeframe: string;
  date: string;
}

const ASSET_LIST = [
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', type: 'Metals', broker: 'OANDA' },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar', type: 'Metals', broker: 'OANDA' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'Forex', broker: 'OANDA' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', type: 'Forex', broker: 'OANDA' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', type: 'Forex', broker: 'OANDA' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', type: 'Forex', broker: 'OANDA' },
  { symbol: 'US30', name: 'Dow Jones Industrial Average', type: 'Indices', broker: 'OANDA' },
  { symbol: 'NAS100', name: 'Nasdaq 100', type: 'Indices', broker: 'OANDA' },
  { symbol: 'SPX500', name: 'S&P 500', type: 'Indices', broker: 'OANDA' },
  { symbol: 'UK100', name: 'FTSE 100', type: 'Indices', broker: 'OANDA' },
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', type: 'Crypto', broker: 'BINANCE' },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', type: 'Crypto', broker: 'BINANCE' },
  { symbol: 'USOIL', name: 'WTI Crude Oil', type: 'Energies', broker: 'OANDA' },
];

export default function BacktestDashboardPage() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [assetSearch, setAssetSearch] = useState('');
  const [assetCategory, setAssetCategory] = useState('All');
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [config, setConfig] = useState<SessionConfig>({
    name: 'XAUUSD SMC Backtest',
    balance: 100000,
    asset: 'XAUUSD',
    timeframe: '15m',
    date: '2026-09-01',
  });

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAssetDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setIsSessionActive(true);
  };

  const filteredAssets = ASSET_LIST.filter(a => {
    const matchesSearch = a.symbol.toLowerCase().includes(assetSearch.toLowerCase()) || a.name.toLowerCase().includes(assetSearch.toLowerCase());
    const matchesCategory = assetCategory === 'All' || a.type === assetCategory;
    return matchesSearch && matchesCategory;
  });

  if (isSessionActive) {
    return (
      <div className="h-full w-full bg-black fixed inset-0 z-50">
        <BacktestTerminal config={config} onExit={() => setIsSessionActive(false)} />
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#0A0A0A] min-h-screen text-slate-200 font-sans">
      
      <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white">Testing</h1>
          <p className="text-neutral-400 text-sm mt-1">Manage your backtesting sessions and prop firm simulations.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Start a session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <History className="w-5 h-5" />
            <h3 className="font-bold text-sm">Time Invested</h3>
          </div>
          <p className="text-3xl font-black text-white">0<span className="text-lg text-neutral-500">d</span> 0<span className="text-lg text-neutral-500">hr</span></p>
        </div>
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <BarChart2 className="w-5 h-5" />
            <h3 className="font-bold text-sm">Win Rate</h3>
          </div>
          <p className="text-3xl font-black text-white">--%</p>
        </div>
        <div className="bg-[#111111] border border-neutral-800 rounded-xl p-6">
          <div className="flex items-center gap-3 text-neutral-400 mb-2">
            <Briefcase className="w-5 h-5" />
            <h3 className="font-bold text-sm">Trades Taken</h3>
          </div>
          <p className="text-3xl font-black text-white">0</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0f1219] border border-neutral-800 rounded-xl w-full max-w-xl overflow-visible shadow-2xl">
            
            <div className="flex justify-between items-center p-5 border-b border-neutral-800">
              <h2 className="text-lg font-bold text-white">Create a quick session</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartSession} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-2 bg-[#1a1f2c] p-1 rounded-lg">
                <button type="button" className="bg-[#2a3040] text-white py-2 rounded-md text-xs font-bold shadow">Backtesting Session</button>
                <button type="button" className="text-neutral-400 py-2 rounded-md text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                  Prop Firm Session <span className="bg-emerald-500/10 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20">Coming Soon</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Name *</label>
                <input 
                  type="text" 
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  className="w-full bg-[#151a23] border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">Account Balance *</label>
                <div className="relative">
                  <span className="absolute left-4 top-2.5 text-neutral-500 font-bold">$</span>
                  <input 
                    type="number" 
                    value={config.balance}
                    onChange={(e) => setConfig({...config, balance: Number(e.target.value)})}
                    className="w-full bg-[#151a23] border border-neutral-700 text-white rounded-lg pl-8 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Custom Asset Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Assets *</label>
                  <div 
                    onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
                    className="w-full bg-[#151a23] border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm flex justify-between items-center cursor-pointer hover:border-neutral-500"
                  >
                    <span>{config.asset}</span>
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  </div>

                  {isAssetDropdownOpen && (
                    <div className="absolute top-full mt-2 w-full bg-[#1a1f2c] border border-neutral-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-neutral-800">
                        <div className="relative">
                          <Search className="absolute left-3 top-2 w-4 h-4 text-neutral-500" />
                          <input 
                            type="text"
                            placeholder="Search asset..."
                            value={assetSearch}
                            onChange={(e) => setAssetSearch(e.target.value)}
                            className="w-full bg-[#151a23] text-white text-sm rounded-md pl-9 pr-3 py-1.5 focus:outline-none border border-neutral-700 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
                          {['All', 'Indices', 'Metals', 'Energies', 'Forex', 'Crypto'].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setAssetCategory(cat)}
                              className={`text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-colors ${assetCategory === cat ? 'bg-blue-600 text-white' : 'bg-[#2a3040] text-neutral-400 hover:text-white'}`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto">
                        <div className="text-[10px] font-bold text-neutral-500 px-3 py-2 uppercase tracking-wider bg-[#151a23]">Available Assets</div>
                        {filteredAssets.map(a => (
                          <div 
                            key={a.symbol}
                            onClick={() => { setConfig({...config, asset: a.symbol}); setIsAssetDropdownOpen(false); }}
                            className="px-4 py-2 hover:bg-[#2a3040] cursor-pointer flex justify-between items-center group transition-colors"
                          >
                            <div>
                              <div className="text-sm font-bold text-white group-hover:text-blue-400">{a.symbol} <span className="text-neutral-500 text-xs font-normal ml-1">({a.name})</span></div>
                            </div>
                            <span className="text-[10px] text-blue-500 font-bold tracking-wide">{a.broker}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Start Date *</label>
                  <input 
                    type="date" 
                    style={{ colorScheme: "dark" }}
                    value={config.date}
                    onChange={(e) => setConfig({...config, date: e.target.value})}
                    className="w-full bg-[#151a23] border border-neutral-700 text-white rounded-lg px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-lg font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  Start Backtesting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}