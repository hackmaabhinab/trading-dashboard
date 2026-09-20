'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Send, 
  ShieldAlert, 
  Lock, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  HelpCircle, 
  Layers,
  Sparkles,
  Paperclip
} from 'lucide-react';

interface Reply {
  id: string;
  author: string;
  time: string;
  text: string;
}

interface Post {
  id: string;
  author: string;
  category: string;
  time: string;
  text: string;
  replies: Reply[];
}

const categories = [
  { id: 'All', label: 'ALL POSTS', icon: Layers },
  { id: 'Trade Setups', label: 'TRADE SETUPS', icon: TrendingUp },
  { id: 'Technical Analysis', label: 'TECHNICAL ANALYSIS', icon: Sparkles },
  { id: 'Psychology', label: 'PSYCHOLOGY', icon: Brain },
  { id: 'Questions', label: 'QUESTIONS', icon: HelpCircle },
  { id: 'General', label: 'GENERAL', icon: MessageSquare },
];

export default function CommunityPage() {
  const [currentUser, setCurrentUser] = useState<string>('Abhinav Shukla');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [postCategory, setPostCategory] = useState<string>('Trade Setups');
  const [postText, setPostText] = useState<string>('');
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  // Dynamic Random Active Traders Counter (140 - 150)
  const [activeTraders, setActiveTraders] = useState<number>(124);

  useEffect(() => {
    // Initial random value set karne ke liye
    setActiveTraders(Math.floor(Math.random() * (150 - 140 + 1)) + 140);

    // Har 4 second me count ko randomly badalne ke liye
    const interval = setInterval(() => {
      setActiveTraders(Math.floor(Math.random() * (150 - 140 + 1)) + 140);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Dynamic Posts State
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Alex_Trader',
      category: 'Trade Setups',
      time: '01:15 PM',
      text: 'XAUUSD look for sweep at 2500 level before continuation upwards. Classic ICT liquidity grab scenario.',
      replies: [
        {
          id: 'r1',
          author: 'ProTrader_99',
          time: '01:17 PM',
          text: 'Agreed, watching the 15m order block near 2495.'
        }
      ]
    }
  ]);

  // Handle Publish Post
  const handlePublish = () => {
    if (!postText.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: currentUser,
      category: postCategory,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: postText,
      replies: []
    };

    setPosts([newPost, ...posts]);
    setPostText('');
  };

  // Handle Reply Submit
  const handleAddReply = (postId: string) => {
    const replyText = replyInputs[postId];
    if (!replyText || !replyText.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [
            ...p.replies,
            {
              id: Date.now().toString(),
              author: currentUser,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              text: replyText
            }
          ]
        };
      }
      return p;
    }));

    setReplyInputs({ ...replyInputs, [postId]: '' });
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="w-full min-h-screen bg-black text-neutral-100 p-4 md:p-6 space-y-6 font-sans select-none">
      
      {/* 1. TOP HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <Users className="w-6 h-6 text-emerald-400 shrink-0" />
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase">
              Trader Community Terminal
            </h1>
          </div>
          <p className="text-xs font-bold text-neutral-400 mt-1">
            Discuss market structure, breakdown live trade setups, and share execution psychology with pro traders.
          </p>
        </div>

        {/* Dynamic Live Active Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-emerald-500/30 w-fit backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
          <span className="text-[11px] font-bold text-neutral-300 tracking-wider uppercase">
            Active Traders Online: <span className="text-emerald-400 font-black transition-all duration-500">{activeTraders}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 2. MAIN FEED & COMPOSER */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* CREATE POST CONTAINER */}
          <div className="bg-[#0A0A0A] border border-neutral-800/90 rounded-xl p-4 md:p-5 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/90 border border-neutral-800 rounded-lg">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Posting as:</span>
                <span className="text-xs font-black text-emerald-400 tracking-wide">{currentUser}</span>
                <Lock className="w-3 h-3 text-neutral-500 ml-1" />
              </div>

              <select
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                {categories.filter(c => c.id !== 'All').map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white font-bold">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Share your trade setup, market perspective, liquidity grab scenario, or query with the community..."
              className="w-full h-28 bg-black/60 border border-neutral-800/80 rounded-lg p-3 text-xs font-bold text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/40 transition-all resize-none"
            />

            <div className="flex items-center justify-between pt-1">
              <button 
                type="button"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-emerald-400 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Attach Chart URL</span>
              </button>

              <button 
                onClick={handlePublish}
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black tracking-wider uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 stroke-[3]" />
                <span>Publish Message</span>
              </button>
            </div>
          </div>

          {/* 3. CATEGORY FILTERS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-black whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-500/5'
                      : 'bg-[#0A0A0A] text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* 4. POSTS FEED */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center bg-[#0A0A0A] border border-neutral-800 rounded-xl text-neutral-500 font-bold text-xs">
                No posts found in this category.
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-[#0A0A0A] border border-neutral-800/80 rounded-xl p-4 md:p-5 space-y-4">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs uppercase">
                        {post.author.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">{post.author}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-neutral-500">{post.time}</span>
                  </div>

                  <p className="text-xs font-bold text-neutral-200 leading-relaxed pl-11">
                    {post.text}
                  </p>

                  {post.replies.length > 0 && (
                    <div className="ml-11 space-y-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-black/50 border-l-2 border-emerald-500/50 rounded-r-lg p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-400">{reply.author}</span>
                            <span className="text-[10px] font-bold text-neutral-500">{reply.time}</span>
                          </div>
                          <p className="text-xs font-bold text-neutral-300">
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="ml-11 flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={replyInputs[post.id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddReply(post.id)}
                      placeholder="Write a reply..."
                      className="flex-1 bg-black/60 border border-neutral-800 rounded-lg px-3 py-2 text-xs font-bold text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
                    />
                    <button 
                      onClick={() => handleAddReply(post.id)}
                      className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/30 text-neutral-200 hover:text-emerald-400 text-xs font-black rounded-lg transition-all active:scale-95 cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>

        {/* 5. SIDEBAR: PROTOCOL */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0A0A0A] border border-neutral-800 rounded-xl p-4 space-y-3 sticky top-4">
            <div className="flex items-center gap-2 text-emerald-400 border-b border-neutral-800 pb-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <h2 className="text-xs font-black tracking-widest uppercase">Community Protocol</h2>
            </div>
            
            <ul className="space-y-2.5 text-[11px] font-bold text-neutral-400 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-black">•</span>
                <span>Share high-probability trade setups with clear risk-to-reward ratio.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-black">•</span>
                <span>Keep analysis focused on technicals, liquidity sweeps, and market structure.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-black">•</span>
                <span>Respect institutional decorum and maintain professional communication.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-black">•</span>
                <span>No financial advice or direct external account management links allowed.</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}