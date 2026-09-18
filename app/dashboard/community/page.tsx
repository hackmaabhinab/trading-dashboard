'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { sanitizeInput } from '../../../lib/sanitize';
import { 
  Users, 
  Send, 
  Heart, 
  MessageSquare, 
  Share2, 
  TrendingUp, 
  Image as ImageIcon, 
  Clock, 
  UserCheck, 
  Flame, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Trash2,
  Edit2,
  Check,
  X,
  Trophy,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'All',
  'Trade Setups 📊',
  'Technical Analysis 📈',
  'Psychology 🧠',
  'Questions ❓',
  'General 💬'
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Username state
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState('Trade Setups 📊');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  // Edit Post State
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  // Active Expand Comments State
  const [expandedComments, setExpandedComments] = useState<{ [key: number]: boolean }>({});
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
  const [postComments, setPostComments] = useState<{ [key: number]: any[] }>({});

  // Liked Posts Tracker
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  // Lightbox Zoom State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  useEffect(() => {
    const savedLikes = localStorage.getItem('liked_community_posts');
    if (savedLikes) {
      try {
        setLikedPosts(JSON.parse(savedLikes));
      } catch (e) {
        console.error('Error parsing liked posts:', e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, username')
          .eq('id', user.id)
          .single();

        const activeName = profile?.username || profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Trader';
        setUsername(activeName);
      } else {
        setUsername('Trader');
      }
    };

    fetchUserProfile();
    fetchPosts();

    const channel = supabase
      .channel('realtime_community')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'community_posts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const calculateTopContributors = (allPosts: any[]) => {
    const contributorMap: { [key: string]: { count: number; totalLikes: number } } = {};

    allPosts.forEach((post) => {
      const authorName = post.author || 'Anonymous';
      if (!contributorMap[authorName]) {
        contributorMap[authorName] = { count: 0, totalLikes: 0 };
      }
      contributorMap[authorName].count += 1;
      contributorMap[authorName].totalLikes += post.likes || 0;
    });

    const sorted = Object.keys(contributorMap)
      .map((author) => ({
        name: author,
        postsCount: contributorMap[author].count,
        totalLikes: contributorMap[author].totalLikes
      }))
      .sort((a, b) => b.postsCount - a.postsCount || b.totalLikes - a.totalLikes)
      .slice(0, 5);

    setTopContributors(sorted);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load community discussions');
    } else if (data) {
      setPosts(data);
      calculateTopContributors(data);
    }
    setLoading(false);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setSubmitting(true);

    try {
      const cleanImgUrl = imageUrl.trim();

      const sanitizedPayload = {
        author: sanitizeInput(username),
        content: sanitizeInput(content),
        category: category,
        image_url: cleanImgUrl ? cleanImgUrl : null,
        likes: 0,
        replies_count: 0
      };

      const { data, error } = await supabase
        .from('community_posts')
        .insert([sanitizedPayload])
        .select();

      if (error) {
        toast.error(`Database Error: ${error.message}`);
      } else if (data) {
        setContent('');
        setImageUrl('');
        setShowImageInput(false);
        toast.success('Post shared with community! 🚀');
        fetchPosts();
      }
    } catch (err: any) {
      toast.error('An error occurred while publishing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: number, postAuthor: string) => {
    if (!username || username !== postAuthor) {
      toast.error('Aap sirf apne posts delete kar sakte hain!');
      return;
    }

    const { error } = await supabase
      .from('community_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      toast.error('Delete karne me error aaya');
    } else {
      const updatedPosts = posts.filter((p) => p.id !== postId);
      setPosts(updatedPosts);
      calculateTopContributors(updatedPosts);
      toast.success('Post delete ho gaya');
    }
  };

  const handleStartEdit = (post: any) => {
    setEditingPostId(post.id);
    setEditContent(post.content);
  };

  const handleSaveEdit = async (postId: number) => {
    if (!editContent.trim()) {
      toast.error('Content khali nahi ho sakta');
      return;
    }

    const { error } = await supabase
      .from('community_posts')
      .update({ content: sanitizeInput(editContent) })
      .eq('id', postId);

    if (error) {
      toast.error('Update karne me error aaya');
    } else {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, content: editContent } : p))
      );
      setEditingPostId(null);
      toast.success('Post update ho gaya!');
    }
  };

  const handleLike = async (postId: number, postAuthor: string, currentLikes: number) => {
    if (username && postAuthor === username) {
      toast.error('Aap apne hi post par like nahi kar sakte!');
      return;
    }

    const hasLiked = likedPosts.includes(postId);
    const newLikesCount = hasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;

    const updatedLikedPosts = hasLiked
      ? likedPosts.filter((id) => id !== postId)
      : [...likedPosts, postId];

    setLikedPosts(updatedLikedPosts);
    localStorage.setItem('liked_community_posts', JSON.stringify(updatedLikedPosts));

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: newLikesCount } : p))
    );

    const { error } = await supabase
      .from('community_posts')
      .update({ likes: newLikesCount })
      .eq('id', postId);

    if (error) {
      toast.error('Failed to update like');
      fetchPosts();
    } else {
      if (!hasLiked) {
        toast.success('Post Liked!');
      }
    }
  };

  const toggleComments = async (postId: number) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

    if (!postComments[postId]) {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setPostComments((prev) => ({ ...prev, [postId]: data }));
      }
    }
  };

  const handleAddComment = async (postId: number, postAuthor: string) => {
    if (username && postAuthor === username) {
      toast.error('Aap apne hi post par reply nahi kar sakte!');
      return;
    }

    const text = replyText[postId];
    if (!text || !text.trim()) return;

    const newComment = {
      post_id: postId,
      author: username || 'Trader',
      comment: sanitizeInput(text)
    };

    const { data, error } = await supabase
      .from('community_comments')
      .insert([newComment])
      .select();

    if (error) {
      toast.error('Failed to post comment');
    } else if (data) {
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data[0]]
      }));

      const targetPost = posts.find((p) => p.id === postId);
      const updatedCount = (targetPost?.replies_count || 0) + 1;

      await supabase
        .from('community_posts')
        .update({ replies_count: updatedCount })
        .eq('id', postId);

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, replies_count: updatedCount } : p))
      );

      setReplyText((prev) => ({ ...prev, [postId]: '' }));
      toast.success('Reply added!');
    }
  };

  const openImageModal = (url: string) => {
    setSelectedImage(url);
    setZoomLevel(1);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setZoomLevel(1);
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="border-b border-blue-900/30 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500 animate-pulse" /> Trader Community Terminal
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Discuss market structure, breakdown live trade setups, and share execution psychology with pro traders.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0B0F17] border border-blue-900/40 px-4 py-2 rounded-xl text-xs text-slate-300 font-mono">
          <Flame className="w-4 h-4 text-amber-500 animate-bounce" />
          <span>Active Traders Online: <strong className="text-emerald-400">81</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Create Post Card */}
          <form onSubmit={handleCreatePost} className="bg-[#0B0F17] border border-blue-900/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <input
                  type="text"
                  value={username || 'Loading...'}
                  disabled
                  readOnly
                  className="bg-[#070A10] border border-blue-900/40 rounded-lg px-2.5 py-1 text-xs text-slate-400 font-mono font-bold cursor-not-allowed opacity-80"
                />
              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-[#070A10] border border-blue-900/40 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-medium"
              >
                {CATEGORIES.filter(c => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your trade setup, market perspective, liquidity grab scenario, or query with the community..."
              rows={3}
              required
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none transition-all"
            />

            {showImageInput && (
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste direct chart image link (e.g. TradingView image URL)..."
                  className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1.5 font-medium transition-all"
              >
                <ImageIcon className="w-4 h-4" /> {showImageInput ? 'Remove Chart Image' : 'Attach Chart URL'}
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {submitting ? 'Sharing...' : 'Publish Setup'}
              </button>
            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
                    : 'bg-[#0B0F17] border-blue-900/30 text-slate-400 hover:text-slate-200 hover:border-blue-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 h-36 animate-pulse" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-12 text-center space-y-3">
                <Sparkles className="w-10 h-10 text-blue-500/50 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-300">No Community Discussions Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Be the first institutional trader to share a breakdown or start a topic above!
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isExpanded = expandedComments[post.id];
                const commentsList = postComments[post.id] || [];
                const isOwner = username && post.author === username;
                const isLiked = likedPosts.includes(post.id);

                return (
                  <div
                    key={post.id}
                    className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl space-y-4 hover:border-blue-800/40 transition-all"
                  >
                    {/* Author & Timestamp */}
                    <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                          {post.author ? post.author.substring(0, 2).toUpperCase() : 'AT'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                            {post.author || 'Anonymous Trader'}
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {post.category && (
                          <span className="text-[11px] bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold px-2.5 py-1 rounded-lg">
                            {post.category}
                          </span>
                        )}

                        {isOwner && (
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={() => handleStartEdit(post)}
                              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all"
                              title="Edit Post"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id, post.author)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-900/20 rounded-lg transition-all"
                              title="Delete Post"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post Content */}
                    {editingPostId === post.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingPostId(null)}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {post.content}
                      </p>
                    )}

                    {/* Attached Chart Image with HD Zoom Modal */}
                    {post.image_url && (
                      <div className="relative group rounded-xl overflow-hidden border border-blue-900/40 bg-[#070A10] max-w-full">
                        <img
                          src={post.image_url}
                          alt="Chart Attachment"
                          onClick={() => openImageModal(post.image_url)}
                          className="w-full max-h-96 object-contain hover:scale-[1.01] transition-all duration-300 cursor-zoom-in"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <button
                          onClick={() => openImageModal(post.image_url)}
                          className="absolute bottom-3 right-3 bg-slate-900/80 hover:bg-slate-800 text-slate-200 p-2 rounded-xl border border-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-bold backdrop-blur-md shadow-lg"
                        >
                          <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>View HD</span>
                        </button>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-blue-900/20 text-xs">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id, post.author, post.likes)}
                          className={`flex items-center gap-1.5 font-bold transition-all bg-[#070A10] border px-3 py-1.5 rounded-xl ${
                            isLiked
                              ? 'border-rose-500/50 text-rose-400 bg-rose-500/10'
                              : 'border-blue-900/30 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
                          } ${isOwner ? 'opacity-60 cursor-not-allowed' : ''}`}
                          title={isOwner ? "Aap apne post par like nahi kar sakte" : "Like post"}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
                          <span>{post.likes || 0}</span>
                        </button>

                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 font-bold transition-all bg-[#070A10] border border-blue-900/30 px-3 py-1.5 rounded-xl hover:border-blue-500/30"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                          <span>{post.replies_count || commentsList.length || 0} Replies</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Thread link copied!');
                        }}
                        className="text-slate-500 hover:text-slate-300 p-1.5 hover:bg-blue-900/20 rounded-lg transition-all"
                        title="Share Thread"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Replies */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-blue-900/30 space-y-3 animate-fadeIn">
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                          {commentsList.length === 0 ? (
                            <p className="text-xs text-slate-500 italic">No replies yet. Start the conversation!</p>
                          ) : (
                            commentsList.map((c: any, idx: number) => (
                              <div key={idx} className="bg-[#070A10] border border-blue-900/20 p-2.5 rounded-xl text-xs space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-blue-400">{c.author || 'Trader'}</span>
                                  <span className="text-[10px] text-slate-600 font-mono">
                                    {new Date(c.created_at).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-slate-300">{c.comment}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {isOwner ? (
                          <p className="text-[11px] text-slate-500 italic bg-[#070A10] p-2 rounded-xl border border-blue-900/20 text-center">
                            Aap apne hi post par reply nahi kar sakte.
                          </p>
                        ) : (
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={replyText[post.id] || ''}
                              onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                              placeholder="Write an institutional reply..."
                              className="flex-1 bg-[#070A10] border border-blue-900/40 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddComment(post.id, post.author);
                              }}
                            />
                            <button
                              onClick={() => handleAddComment(post.id, post.author)}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all"
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-extrabold text-slate-200 flex items-center gap-2 border-b border-blue-900/30 pb-3">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Top Market Contributors
            </h3>

            <div className="space-y-3 text-xs">
              {topContributors.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No contributor rankings yet.</p>
              ) : (
                topContributors.map((trader, idx) => (
                  <div key={trader.name} className="flex items-center justify-between p-2.5 bg-[#070A10] rounded-xl border border-blue-900/20">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-amber-400 flex items-center gap-1">
                        {idx === 0 && <Trophy className="w-3 h-3 text-amber-400 inline" />} #{idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-slate-200">{trader.name}</div>
                        <div className="text-[10px] text-slate-500">{trader.postsCount} {trader.postsCount === 1 ? 'Post' : 'Posts'}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ❤️ {trader.totalLikes}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-5 space-y-3 text-xs text-slate-400 shadow-xl">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Community Protocol
            </h4>
            <ul className="space-y-2 list-disc list-inside text-[11px] leading-relaxed">
              <li>Share high-probability setups with entry & risk reasoning.</li>
              <li>Maintain respectful institutional decorum.</li>
              <li>No financial advice / direct account pumping links allowed.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* HD Chart Image Modal (Zoom In / Zoom Out Lightbox) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeImageModal}
        >
          <div 
            className="relative bg-[#070A10] border border-blue-900/60 rounded-2xl p-4 max-w-5xl max-h-[90vh] flex flex-col items-center shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Control Toolbar */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-blue-900/40 mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-slate-200">Institutional Chart View (HD)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 3))}
                  className="p-1.5 bg-blue-900/30 border border-blue-500/30 hover:bg-blue-600/30 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75))}
                  className="p-1.5 bg-blue-900/30 border border-blue-500/30 hover:bg-blue-600/30 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 bg-blue-900/30 border border-blue-500/30 hover:bg-blue-600/30 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={closeImageModal}
                  className="p-1.5 bg-rose-900/30 border border-rose-500/30 hover:bg-rose-600/30 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ml-2"
                  title="Close Modal"
                >
                  <X className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>

            {/* Zoomable Image Container */}
            <div className="overflow-auto w-full max-h-[75vh] flex items-center justify-center p-2 rounded-xl bg-[#030508]">
              <img
                src={selectedImage}
                alt="Enlarged Chart"
                style={{ transform: `scale(${zoomLevel})` }}
                className="transition-transform duration-200 max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}