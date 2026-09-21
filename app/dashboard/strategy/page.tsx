'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Plus, 
  BookOpen, 
  Layers, 
  CheckCircle, 
  Target, 
  X, 
  Heart, 
  Edit3, 
  Trash2, 
  Filter, 
  Search, 
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

// -------------------------------------------------------------
// AAPKE ADMIN EMAILS KO YAHAN DEFINE KAREIN
// Niche apne admin account ka exact email address daalein:
// -------------------------------------------------------------
const ADMIN_EMAILS = [
  'admin@example.com',
  'sakshishuklafundedac8990@gmail.com' // admin email
];

// Inline YouTube Icon Component
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface Strategy {
  id: string;
  title: string;
  category: 'ICT' | 'Price Action' | 'Indicator' | 'Institutional SMC' | string;
  winRate: string;
  winRateNum: number;
  riskReward: string;
  timeframe: string;
  description: string;
  rules: string[];
  chartUrl?: string;
  youtubeUrl?: string;
  likesCount: number;
  createdAt: string;
}

// Default Seed Strategies
const DEFAULT_RECOMMENDED_STRATEGIES: Strategy[] = [
  {
    id: 'rec-1',
    title: 'XAUUSD London Sweep & FVG Order Block Model',
    category: 'Institutional SMC',
    winRate: '78%',
    winRateNum: 78,
    riskReward: '1:3.5',
    timeframe: '15m / 1h',
    description: 'High-probability execution framework focusing on London session sweep of Asian High/Low liquidity followed by strong displacement into an unmitigated Fair Value Gap (FVG).',
    rules: [
      'Identify Asian Session High & Low liquidity pools.',
      'Wait for London Session liquidity sweep (Sweep + Reject).',
      'Look for clear 5m displacement creating a Market Structure Shift (MSS).',
      'Place limit entry at 50% Consequent Encroachment of FVG or OB.',
      'SL above/below the Liquidity Sweep wick peak.'
    ],
    chartUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    likesCount: 142,
    createdAt: '2026-09-20'
  },
  {
    id: 'rec-2',
    title: 'ICT Silver Bullet 10 AM NY Killzone Setup',
    category: 'ICT',
    winRate: '74%',
    winRateNum: 74,
    riskReward: '1:3.0',
    timeframe: '1m / 5m',
    description: 'Precision time-and-price model executed exclusively between 10:00 AM - 11:00 AM EST. Targets session liquidity runs using 1m FVG entry.',
    rules: [
      'Trade only between 10:00 AM and 11:00 AM New York local time.',
      'Confirm continuous HTF Bias alignment.',
      'Wait for 1m internal structure break leaving an displacement FVG.',
      'Set target to opposing equal highs/lows or Buyside/Sellside liquidity.'
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    likesCount: 98,
    createdAt: '2026-09-18'
  },
  {
    id: 'rec-3',
    title: 'Key Level Breakout & Re-test Price Action Model',
    category: 'Price Action',
    winRate: '65%',
    winRateNum: 65,
    riskReward: '1:2.5',
    timeframe: '1h / 4h',
    description: 'Classic pure price action strategy utilizing multi-touch support/resistance confluence, momentum rejection candles, and volume validation.',
    rules: [
      'Mark major daily/4h support and resistance zones.',
      'Wait for full body candle closure above/below key level.',
      'Enter on 15m/1h pullback re-test showing rejection pinbar or engulfing candle.',
      'TP at next major HTF liquidity structure.'
    ],
    likesCount: 64,
    createdAt: '2026-09-15'
  },
  {
    id: 'rec-4',
    title: 'Triple EMA Trend & RSI Momentum Confluence',
    category: 'Indicator',
    winRate: '45%',
    winRateNum: 45,
    riskReward: '1:2.0',
    timeframe: '15m / 1h',
    description: 'Systematic indicator-based model combining EMA 20/50/200 trend ribbon alignment with RSI hidden divergence entries.',
    rules: [
      'EMA 20 > EMA 50 > EMA 200 for Bullish trend regime.',
      'Wait for price pullback touching EMA 50.',
      'Confirm RSI (14) pulled back to 40-45 zone without breaching lower low.',
      'Enter market order on first bullish candle close.'
    ],
    likesCount: 41,
    createdAt: '2026-09-10'
  }
];

export default function StrategyPage() {
  const supabase = createClient();

  // User Auth & Secure Admin State (DEFAULT = FALSE)
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); 
  const [userLikedIds, setUserLikedIds] = useState<Set<string>>(new Set());

  // Data & Modal States
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [minWinRate, setMinWinRate] = useState<number>(0);

  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'ICT' | 'Price Action' | 'Indicator' | 'Institutional SMC'>('ICT');
  const [winRate, setWinRate] = useState('70%');
  const [riskReward, setRiskReward] = useState('1:3');
  const [timeframe, setTimeframe] = useState('15m / 1h');
  const [description, setDescription] = useState('');
  const [rulesInput, setRulesInput] = useState('');
  const [chartUrl, setChartUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  // Extract Numeric Win Rate for accurate filtering
  const parseNumericWinRate = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const digits = String(value).replace(/[^0-9]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  };

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        const role = user.user_metadata?.role || user.app_metadata?.role || '';
        const userEmail = (user.email || '').toLowerCase();

        // Check if logged-in user email or role matches Admin definition
        const isUserAdmin = 
          role === 'admin' || 
          ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === userEmail);

        setIsAdmin(isUserAdmin);

        const { data: likes } = await supabase
          .from('strategy_likes')
          .select('strategy_id')
          .eq('user_id', user.id);

        if (likes) {
          setUserLikedIds(new Set(likes.map((l) => l.strategy_id)));
        }
      } else {
        setIsAdmin(false);
      }

      await fetchStrategiesFromDB();
    } catch (err) {
      console.error('Initialization error:', err);
      setStrategies(DEFAULT_RECOMMENDED_STRATEGIES);
    } finally {
      setLoading(false);
    }
  };

  const fetchStrategiesFromDB = async () => {
    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .order('likes_count', { ascending: false });

    if (error || !data || data.length === 0) {
      setStrategies(DEFAULT_RECOMMENDED_STRATEGIES);
    } else {
      const formatted: Strategy[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        winRate: item.win_rate,
        winRateNum: item.win_rate_num || parseNumericWinRate(item.win_rate),
        riskReward: item.risk_reward,
        timeframe: item.timeframe,
        description: item.description,
        rules: item.rules || [],
        chartUrl: item.chart_url,
        youtubeUrl: item.youtube_url,
        likesCount: item.likes_count || 0,
        createdAt: item.created_at ? item.created_at.split('T')[0] : '2026-09-20',
      }));
      setStrategies(formatted);
    }
  };

  const getEmbedYoutubeUrl = (url?: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch')) {
      const params = new URLSearchParams(url.split('?')[1]);
      videoId = params.get('v') || '';
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  // Single-User Single-Like Logic
  const handleToggleLike = async (strategyId: string) => {
    if (!userId) {
      alert('Please login to like strategies!');
      return;
    }

    const isAlreadyLiked = userLikedIds.has(strategyId);
    const updatedLikedIds = new Set(userLikedIds);

    let countChange = 0;
    if (isAlreadyLiked) {
      updatedLikedIds.delete(strategyId);
      countChange = -1;
    } else {
      updatedLikedIds.add(strategyId);
      countChange = 1;
    }
    setUserLikedIds(updatedLikedIds);

    setStrategies((prev) =>
      prev
        .map((s) => (s.id === strategyId ? { ...s, likesCount: Math.max(0, s.likesCount + countChange) } : s))
        .sort((a, b) => b.likesCount - a.likesCount)
    );

    try {
      if (isAlreadyLiked) {
        await supabase
          .from('strategy_likes')
          .delete()
          .eq('strategy_id', strategyId)
          .eq('user_id', userId);

        const target = strategies.find((s) => s.id === strategyId);
        if (target) {
          await supabase
            .from('strategies')
            .update({ likes_count: Math.max(0, target.likesCount - 1) })
            .eq('id', strategyId);
        }
      } else {
        await supabase
          .from('strategy_likes')
          .insert({ strategy_id: strategyId, user_id: userId });

        const target = strategies.find((s) => s.id === strategyId);
        if (target) {
          await supabase
            .from('strategies')
            .update({ likes_count: target.likesCount + 1 })
            .eq('id', strategyId);
        }
      }
    } catch (err) {
      console.error('Like toggle DB error:', err);
    }
  };

  // ADMIN ACTION: Save or Edit
  const handleSaveStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Unauthorized access.');
      return;
    }

    if (!title || !description || !winRate || !riskReward || !timeframe) {
      alert('Please fill out all required strategy fields.');
      return;
    }

    const rulesArray = rulesInput
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const numericWinRate = parseNumericWinRate(winRate);

    const payload = {
      title,
      category,
      win_rate: winRate.includes('%') ? winRate : `${winRate}%`,
      win_rate_num: numericWinRate,
      risk_reward: riskReward,
      timeframe,
      description,
      rules: rulesArray.length > 0 ? rulesArray : ['Follow strict risk management.'],
      chart_url: chartUrl.trim() || null,
      youtube_url: youtubeUrl.trim() || null,
    };

    if (editingId) {
      setStrategies((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                title,
                category,
                winRate: payload.win_rate,
                winRateNum: numericWinRate,
                riskReward,
                timeframe,
                description,
                rules: payload.rules,
                chartUrl: payload.chart_url || undefined,
                youtubeUrl: payload.youtube_url || undefined,
              }
            : s
        )
      );

      if (!editingId.startsWith('rec-')) {
        await supabase.from('strategies').update(payload).eq('id', editingId);
      }
    } else {
      const { data } = await supabase.from('strategies').insert(payload).select();
      if (data && data[0]) {
        await fetchStrategiesFromDB();
      } else {
        const newStrat: Strategy = {
          id: `local-${Date.now()}`,
          title,
          category,
          winRate: payload.win_rate,
          winRateNum: numericWinRate,
          riskReward,
          timeframe,
          description,
          rules: payload.rules,
          chartUrl: payload.chart_url || undefined,
          youtubeUrl: payload.youtube_url || undefined,
          likesCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setStrategies((prev) => [newStrat, ...prev]);
      }
    }

    closeModal();
  };

  // ADMIN ACTION: Delete
  const handleDeleteStrategy = async (id: string) => {
    if (!isAdmin) return;
    if (!confirm('Are you sure you want to delete this strategy model?')) return;

    if (!id.startsWith('rec-') && !id.startsWith('local-')) {
      await supabase.from('strategies').delete().eq('id', id);
    }
    setStrategies((prev) => prev.filter((s) => s.id !== id));
  };

  // ADMIN ACTION: Open Modal
  const openEditModal = (strat: Strategy) => {
    if (!isAdmin) return;
    setEditingId(strat.id);
    setTitle(strat.title);
    setCategory(strat.category as any);
    setWinRate(strat.winRate);
    setRiskReward(strat.riskReward);
    setTimeframe(strat.timeframe);
    setDescription(strat.description);
    setRulesInput(strat.rules.join('\n'));
    setChartUrl(strat.chartUrl || '');
    setYoutubeUrl(strat.youtubeUrl || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setRulesInput('');
    setChartUrl('');
    setYoutubeUrl('');
    setCategory('ICT');
    setWinRate('70%');
    setRiskReward('1:3');
    setTimeframe('15m / 1h');
  };

  // Filtered Strategies
  const filteredStrategies = strategies
    .filter((strat) => {
      if (selectedCategory !== 'ALL' && strat.category !== selectedCategory) {
        return false;
      }

      const currentStratWinRate = parseNumericWinRate(strat.winRateNum || strat.winRate);
      if (minWinRate > 0 && currentStratWinRate < minWinRate) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          strat.title.toLowerCase().includes(query) ||
          strat.description.toLowerCase().includes(query) ||
          strat.category.toLowerCase().includes(query)
        );
      }

      return true;
    })
    .sort((a, b) => b.likesCount - a.likesCount);

  return (
    <div className="min-h-screen bg-black text-slate-100 p-4 md:p-8 space-y-8 w-full font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Institutional Playbook & Edge Models
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </h1>
              <p className="text-xs text-neutral-400">
                Verified execution rules, entry setups, and algorithmic ranking by community engagement.
              </p>
            </div>
          </div>
        </div>

        {/* Publish Strategy Button ONLY VISIBLE TO VERIFIED ADMIN */}
        {isAdmin && (
          <button
            onClick={() => {
              closeModal();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-950/50 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Strategy</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-2xl">
        
        {/* Search Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search strategy title, rules, setup logic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500/50 transition-all"
          />
        </div>

        {/* Category & Win Rate Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#121212] border border-neutral-800 rounded-xl p-1 gap-1">
            {['ALL', 'ICT', 'Price Action', 'Indicator', 'Institutional SMC'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-[#121212] border border-neutral-800 px-3 py-2 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-neutral-400 text-[11px]">Min Win Rate:</span>
            <select
              value={minWinRate}
              onChange={(e) => setMinWinRate(Number(e.target.value))}
              className="bg-transparent text-white font-mono focus:outline-none cursor-pointer text-xs"
            >
              <option value={0} className="bg-[#121212] text-white">All Win Rates</option>
              <option value={40} className="bg-[#121212] text-white">≥ 40% Win Rate</option>
              <option value={50} className="bg-[#121212] text-white">≥ 50% Win Rate</option>
              <option value={70} className="bg-[#121212] text-white">≥ 70% Win Rate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Strategies Feed */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-500 font-mono">Loading Institutional Strategies...</p>
        </div>
      ) : filteredStrategies.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#121212] border border-neutral-800 flex items-center justify-center text-neutral-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No strategies found matching filter</h3>
          <p className="text-xs text-neutral-500 max-w-sm">
            Try resetting your search query or selecting "All Win Rates".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredStrategies.map((strat, index) => {
            const isLikedByMe = userLikedIds.has(strat.id);
            const embedYoutube = getEmbedYoutubeUrl(strat.youtubeUrl);

            return (
              <div
                key={strat.id}
                className="bg-[#0a0a0a] border border-neutral-800 hover:border-neutral-700 rounded-2xl p-6 transition-all duration-300 space-y-5 shadow-2xl relative group"
              >
                {/* Strategy Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-800 pb-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {strat.category}
                      </span>
                      {index === 0 && (
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800/60 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> #1 TOP RANKED
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">{strat.title}</h2>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 font-mono text-xs">
                    <div className="bg-[#121212] border border-neutral-800 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[9px] text-neutral-500 block">EST. WIN RATE</span>
                      <span className="text-emerald-400 font-bold">{strat.winRate}</span>
                    </div>
                    <div className="bg-[#121212] border border-neutral-800 px-3 py-1.5 rounded-xl text-center">
                      <span className="text-[9px] text-neutral-500 block">RISK : REWARD</span>
                      <span className="text-emerald-400 font-bold">{strat.riskReward}</span>
                    </div>
                    <div className="bg-[#121212] border border-neutral-800 px-3 py-1.5 rounded-xl text-center hidden sm:block">
                      <span className="text-[9px] text-neutral-500 block">TIMEFRAME</span>
                      <span className="text-amber-400 font-bold">{strat.timeframe}</span>
                    </div>

                    {/* EDIT & DELETE BUTTONS ONLY VISIBLE TO ADMIN */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 pl-2 border-l border-neutral-800">
                        <button
                          onClick={() => openEditModal(strat)}
                          className="p-2 text-neutral-400 hover:text-emerald-400 hover:bg-[#181818] rounded-lg transition-colors cursor-pointer"
                          title="Edit Strategy"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStrategy(strat.id)}
                          className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-[#181818] rounded-lg transition-colors cursor-pointer"
                          title="Delete Strategy"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-normal">
                  {strat.description}
                </p>

                {/* Rules Checklist */}
                {strat.rules.length > 0 && (
                  <div className="bg-[#121212] border border-neutral-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wide">
                      <Target className="w-4 h-4 text-rose-400" />
                      <span>Execution Rules & Checklist:</span>
                    </div>
                    <ul className="space-y-2">
                      {strat.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* YouTube Breakdown Embed */}
                {embedYoutube && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-semibold uppercase">
                      <YoutubeIcon className="w-4 h-4" />
                      <span>Video Breakdown:</span>
                    </div>
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-black">
                      <iframe
                        src={embedYoutube}
                        title={strat.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Chart Image */}
                {strat.chartUrl && !embedYoutube && (
                  <div className="rounded-xl overflow-hidden border border-neutral-800 max-h-80 bg-black">
                    <img
                      src={strat.chartUrl}
                      alt="Strategy Chart Preview"
                      className="w-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}

                {/* Footer Stats & Like Action */}
                <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-2 border-t border-neutral-800">
                  <span className="text-[10px]">Published: {strat.createdAt}</span>

                  <button
                    onClick={() => handleToggleLike(strat.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 active:scale-90 cursor-pointer ${
                      isLikedByMe
                        ? 'bg-rose-950/50 border-rose-800 text-rose-400 shadow-md shadow-rose-950/50'
                        : 'bg-[#121212] border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLikedByMe ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                      }`}
                    />
                    <span>{strat.likesCount} Likes</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADMIN ONLY PUBLISH / EDIT MODAL */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c0c0c] border border-neutral-800 rounded-2xl w-full max-w-2xl p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase font-mono">
                <Layers className="w-4 h-4" />
                <span>{editingId ? 'Edit Strategy Model' : 'Publish New Trading Model'}</span>
              </div>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStrategy} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Strategy Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. London Sweep ICT Order Block Model"
                  className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2.5 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Trade Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none cursor-pointer"
                  >
                    <option value="ICT">ICT</option>
                    <option value="Price Action">Price Action</option>
                    <option value="Indicator">Indicator</option>
                    <option value="Institutional SMC">Institutional SMC</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Win Rate *
                  </label>
                  <input
                    type="text"
                    required
                    value={winRate}
                    onChange={(e) => setWinRate(e.target.value)}
                    placeholder="e.g. 75%"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Risk : Reward *
                  </label>
                  <input
                    type="text"
                    required
                    value={riskReward}
                    onChange={(e) => setRiskReward(e.target.value)}
                    placeholder="e.g. 1:3.5"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    Timeframe *
                  </label>
                  <input
                    type="text"
                    required
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    placeholder="e.g. 15m / 1h"
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-2 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  Overview & Setup Logic *
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the strategy logic, session timing, and market conditions..."
                  className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl p-3 text-xs outline-none h-20 resize-none"
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
                  className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl p-3 text-xs font-mono outline-none h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    YouTube Breakdown URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2 text-xs font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                    TradingView Chart Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={chartUrl}
                    onChange={(e) => setChartUrl(e.target.value)}
                    placeholder="https://s3.tradingview.com/..."
                    className="w-full bg-[#141414] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  {editingId ? 'Update Strategy' : 'Publish Strategy Model'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}