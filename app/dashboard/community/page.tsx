'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Send, 
  ShieldAlert, 
  MessageSquare, 
  TrendingUp, 
  Brain, 
  HelpCircle, 
  Layers,
  Sparkles,
  Paperclip,
  ExternalLink,
  Loader2,
  Trash2
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useConfirm } from '@/app/dashboard/layout';

interface Reply {
  id: string;
  author: string;
  time: string;
  text: string;
}

interface Post {
  id: string;
  user_id: string;
  author: string;
  category: string;
  time: string;
  text: string;
  chart_url?: string;
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
  const { confirm, showAlert } = useConfirm();
  const supabase = createClient();

  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<string>('TRADER');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [postCategory, setPostCategory] = useState<string>('Trade Setups');
  const [postText, setPostText] = useState<string>('');
  const [chartUrl, setChartUrl] = useState<string>('');
  const [showChartInput, setShowChartInput] = useState<boolean>(false);
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  // Active Traders Counter
  const [activeTraders, setActiveTraders] = useState<number>(142);

  useEffect(() => {
    setActiveTraders(Math.floor(Math.random() * (150 - 140 + 1)) + 140);
    const interval = setInterval(() => {
      setActiveTraders(Math.floor(Math.random() * (150 - 140 + 1)) + 140);
    }, 9000);

    fetchUserDataAndPosts();

    return () => clearInterval(interval);
  }, [supabase]);

  // Fetch User Profile & Posts from Supabase
  const fetchUserDataAndPosts = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        setCurrentUserId(user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.username) {
          setCurrentUser(profile.username);
        } else {
          setCurrentUser(user.email?.split('@')[0] || 'TRADER');
        }
      }

      const { data: dbPosts, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (dbPosts) {
        const formattedPosts: Post[] = dbPosts.map((p: any) => ({
          id: p.id,
          user_id: p.user_id,
          author: p.author,
          category: p.category,
          time: new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: p.text,
          chart_url: p.chart_url,
          replies: p.replies || []
        }));
        setPosts(formattedPosts);
      }
    } catch (err) {
      console.error('Error loading community feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const cleanUsername = currentUser.replace(/^@/, '');

  // Handle Publish Post
  const handlePublish = async () => {
    if (!postText.trim() || !currentUserId) return;

    setPublishing(true);
    try {
      const newPostPayload = {
        user_id: currentUserId,
        author: cleanUsername,
        category: postCategory,
        text: postText,
        chart_url: chartUrl.trim() || null,
        replies: []
      };

      const { data, error } = await supabase
        .from('community_posts')
        .insert([newPostPayload])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const createdPost: Post = {
          id: data.id,
          user_id: data.user_id,
          author: data.author,
          category: data.category,
          time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: data.text,
          chart_url: data.chart_url,
          replies: data.replies || []
        };
        setPosts([createdPost, ...posts]);
        setPostText('');
        setChartUrl('');
        setShowChartInput(false);
        showAlert({ title: "PUBLISHED", message: "Aapki post successfully community feed par share ho gayi hai!", isSuccess: true });
      }
    } catch (err: any) {
      showAlert({ title: "ERROR", message: `Failed to publish post: ${err.message}`, isSuccess: false });
    } finally {
      setPublishing(false);
    }
  };

  // Handle Delete Post with Animated Confirmation Modal
  const handleDeletePost = (postId: string, postUserId: string) => {
    if (postUserId !== currentUserId) {
      return;
    }

    confirm({
      title: "DELETE COMMUNITY POST",
      message: "Kya aap is post ko community feed se delete karna chahte hain?",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from('community_posts')
            .delete()
            .eq('id', postId);

          if (error) throw error;

          setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
          showAlert({ title: "DELETED", message: "Post successfully delete ho gayi!", isSuccess: true });
        } catch (err: any) {
          showAlert({ title: "ERROR", message: `Failed to delete post: ${err.message}`, isSuccess: false });
        }
      },
    });
  };

  // Handle Reply Submit
  const handleAddReply = async (postId: string) => {
    const replyText = replyInputs[postId];
    if (!replyText || !replyText.trim() || !currentUserId) return;

    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    // Prevent self-reply validation check
    if (targetPost.user_id === currentUserId) {
      return;
    }

    const newReply: Reply = {
      id: Date.now().toString(),
      author: cleanUsername,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: replyText.trim()
    };

    const updatedReplies = [...targetPost.replies, newReply];

    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ replies: updatedReplies })
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.map(p => p.id === postId ? { ...p, replies: updatedReplies } : p));
      setReplyInputs({ ...replyInputs, [postId]: '' });
      showAlert({ title: "REPLIED", message: "Aapka reply successfully post ho gaya!", isSuccess: true });
    } catch (err: any) {
      showAlert({ title: "ERROR", message: `Failed to add reply: ${err.message}`, isSuccess: false });
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center text-emerald-400 gap-2 font-bold text-sm">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading Community Terminal...</span>
      </div>
    );
  }

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
                <span className="text-xs font-black text-emerald-400 tracking-wide">@{cleanUsername}</span>
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

            {showChartInput && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">TradingView Chart Link</label>
                <input
                  type="url"
                  value={chartUrl}
                  onChange={(e) => setChartUrl(e.target.value)}
                  placeholder="https://www.tradingview.com/chart/..."
                  className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-emerald-400 font-mono placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button 
                type="button"
                onClick={() => setShowChartInput(!showChartInput)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-emerald-400 text-xs font-bold transition-all active:scale-95 cursor-pointer"
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>{showChartInput ? 'Hide Chart Input' : 'Attach Chart URL'}</span>
              </button>

              <button 
                onClick={handlePublish}
                disabled={publishing || !postText.trim()}
                type="button"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-xs font-black tracking-wider uppercase shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
              >
                {publishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 stroke-[3]" />}
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
                No posts found in this category. Be the first trader to share analysis!
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-[#0A0A0A] border border-neutral-800/80 rounded-xl p-4 md:p-5 space-y-4 shadow-xl">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs uppercase">
                        {post.author.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-white">@{post.author.replace(/^@/, '')}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-neutral-500">{post.time}</span>
                      
                      {/* Delete button appears only if post belongs to current logged-in user */}
                      {post.user_id === currentUserId && (
                        <button
                          onClick={() => handleDeletePost(post.id, post.user_id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs font-bold text-neutral-200 leading-relaxed pl-11">
                    {post.text}
                  </p>

                  {/* Attached TradingView Chart Link */}
                  {post.chart_url && (
                    <div className="ml-11 pt-1">
                      <a 
                        href={post.chart_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 hover:text-emerald-300 text-xs font-mono font-bold transition-all"
                      >
                        <span>View Attached TradingView Chart</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Replies List */}
                  {post.replies.length > 0 && (
                    <div className="ml-11 space-y-2 pt-2">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="bg-black/50 border-l-2 border-emerald-500/50 rounded-r-lg p-3 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-400">@{reply.author.replace(/^@/, '')}</span>
                            <span className="text-[10px] font-bold text-neutral-500">{reply.time}</span>
                          </div>
                          <p className="text-xs font-bold text-neutral-300">
                            {reply.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input or Restriction Notice */}
                  {post.user_id === currentUserId ? (
                    <div className="ml-11 pt-2">
                      <span className="text-[11px] text-neutral-500 italic font-medium"></span>
                    </div>
                  ) : (
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
                  )}

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