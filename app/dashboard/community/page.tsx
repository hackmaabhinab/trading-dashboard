'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, Image as ImageIcon, Users, MessageCircle, Sparkles, UserCheck } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface Message {
  id: string;
  author: string;
  category: string;
  content: string;
  chartUrl?: string;
  timestamp: string;
  replies: Comment[];
}

export default function CommunityPage() {
  const [username, setUsername] = useState('Abhinav');
  const [category, setCategory] = useState('General 💬');
  const [content, setContent] = useState('');
  const [chartUrl, setChartUrl] = useState('');
  const [showChartInput, setShowChartInput] = useState(false);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  // Initial Chat Messages Feed
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'Alex_Trader',
      category: 'Trade Setups 📊',
      content: 'XAUUSD look for sweep at 2500 level before continuation upwards. Classic ICT liquidity grab scenario.',
      timestamp: '01:15 PM',
      replies: [
        { id: 'c1', author: 'ProTrader_99', text: 'Agreed, watching the 15m order block near 2495.', timestamp: '01:17 PM' }
      ]
    }
  ]);

  // Handle Post New Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: username || 'Anonymous Trader',
      category,
      content,
      chartUrl: chartUrl.trim() ? chartUrl : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      replies: []
    };

    setMessages([newMessage, ...messages]);
    setContent('');
    setChartUrl('');
    setShowChartInput(false);
  };

  // Handle Reply to a Post
  const handleAddReply = (messageId: string) => {
    const text = replyInput[messageId];
    if (!text || !text.trim()) return;

    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            replies: [
              ...msg.replies,
              {
                id: Date.now().toString(),
                author: username || 'Trader',
                text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return msg;
      })
    );

    setReplyInput({ ...replyInput, [messageId]: '' });
  };

  const filteredMessages = messages.filter(msg => {
    if (activeFilter === 'All') return true;
    return msg.category.includes(activeFilter);
  });

  return (
    <div className="min-h-screen bg-black text-slate-200 p-6 space-y-6 w-full font-sans">
      
      {/* Top Header Title Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-emerald-500" />
            <h1 className="text-2xl font-bold tracking-tight text-white">Trader Community Terminal</h1>
          </div>
          <p className="text-xs text-neutral-400 font-medium">
            Discuss market structure, breakdown live trade setups, and share execution psychology with pro traders.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0D0D11] border border-neutral-800 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-mono text-neutral-300">Active Traders Online: <strong className="text-white">82</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Chat Post Box + Live Feed */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Send Message Input Card */}
          <div className="bg-[#0D0D11] border border-neutral-800/80 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-mono">Posting as:</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-lg px-2.5 py-1 text-xs font-mono outline-none"
                  placeholder="Your Name"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-lg px-3 py-1 text-xs font-mono outline-none cursor-pointer"
              >
                <option value="Trade Setups 📊">Trade Setups 📊</option>
                <option value="Technical Analysis 📈">Technical Analysis 📈</option>
                <option value="Psychology 🧠">Psychology 🧠</option>
                <option value="Questions ❓">Questions ❓</option>
                <option value="General 💬">General 💬</option>
              </select>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your trade setup, market perspective, liquidity grab scenario, or query with the community..."
                className="w-full bg-[#121218] border border-neutral-800/80 focus:border-emerald-500 text-white rounded-xl p-3.5 text-xs outline-none resize-none h-24 transition-colors"
              />

              {showChartInput && (
                <input
                  type="text"
                  value={chartUrl}
                  onChange={(e) => setChartUrl(e.target.value)}
                  placeholder="Paste TradingView Chart Image URL..."
                  className="w-full bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3.5 py-2 text-xs font-mono outline-none"
                />
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setShowChartInput(!showChartInput)}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>{showChartInput ? 'Remove Chart URL' : 'Attach Chart URL'}</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Message</span>
                </button>
              </div>
            </form>
          </div>

          {/* Filter Categories Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Trade Setups', 'Technical Analysis', 'Psychology', 'Questions', 'General'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-emerald-600 text-white font-semibold shadow-md'
                    : 'bg-[#0D0D11] border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          {filteredMessages.length === 0 ? (
            <div className="bg-[#0D0D11] border border-neutral-800/80 rounded-2xl p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-neutral-600 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No Discussions Yet</h3>
              <p className="text-xs text-neutral-500">Be the first trader to start a conversation in this topic!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="bg-[#0D0D11] border border-neutral-800/80 rounded-2xl p-5 space-y-3">
                  
                  {/* Card Top Header */}
                  <div className="flex items-center justify-between border-b border-neutral-800/40 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/50 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
                        {msg.author.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-white font-mono">{msg.author}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400">
                        {msg.category}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-neutral-500">{msg.timestamp}</span>
                  </div>

                  {/* Content */}
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">{msg.content}</p>

                  {/* Optional Chart Image View */}
                  {msg.chartUrl && (
                    <div className="mt-2 rounded-xl overflow-hidden border border-neutral-800 max-h-60 bg-black/50">
                      <img src={msg.chartUrl} alt="Chart Analysis" className="w-full object-cover" />
                    </div>
                  )}

                  {/* Reply List Section */}
                  {msg.replies.length > 0 && (
                    <div className="bg-[#121218]/80 border border-neutral-800/50 rounded-xl p-3 space-y-2 mt-3">
                      {msg.replies.map((reply) => (
                        <div key={reply.id} className="text-xs space-y-0.5 border-b border-neutral-800/40 last:border-0 pb-1.5 last:pb-0">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-emerald-400">{reply.author}</span>
                            <span className="text-[9px] font-mono text-neutral-500">{reply.timestamp}</span>
                          </div>
                          <p className="text-neutral-300 text-[11px]">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Box */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={replyInput[msg.id] || ''}
                      onChange={(e) => setReplyInput({ ...replyInput, [msg.id]: e.target.value })}
                      placeholder="Write a reply..."
                      className="flex-1 bg-[#121218] border border-neutral-800 focus:border-emerald-500 text-white rounded-xl px-3 py-1.5 text-xs outline-none"
                    />
                    <button
                      onClick={() => handleAddReply(msg.id)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs px-3 py-1.5 rounded-xl font-mono transition-colors cursor-pointer shrink-0"
                    >
                      Reply
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Sidebar Column: Rules & Protocol */}
        <div className="space-y-4">
          
          <div className="bg-[#0D0D11] border border-neutral-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <UserCheck className="w-4 h-4" />
              <span>Community Protocol</span>
            </div>
            <ul className="text-xs text-neutral-400 space-y-2.5 list-disc pl-4 font-sans leading-relaxed">
              <li>Share high-probability trade setups with clear risk-to-reward ratio.</li>
              <li>Keep analysis focused on technicals, liquidity sweeps, and market structure.</li>
              <li>Respect institutional decorum and maintain professional communication.</li>
              <li>No financial advice or direct external account management links allowed.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}