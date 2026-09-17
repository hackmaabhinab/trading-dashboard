'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { sanitizeInput } from '../../../lib/sanitize';
import { MessageSquare, Send, MessageCircle, User, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<{ [key: number]: any[] }>({});
  const [newPost, setNewPost] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  // Fetch Posts and Comments
  const fetchCommunityData = async () => {
    setLoading(true);
    
    // Fetch Posts
    const { data: postsData, error: postsError } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (postsError) {
      toast.error('Failed to fetch community posts');
      setLoading(false);
      return;
    }

    if (postsData) {
      setPosts(postsData);

      // Fetch Comments for all posts
      const { data: commentsData } = await supabase
        .from('community_comments')
        .select('*')
        .order('created_at', { ascending: true });

      if (commentsData) {
        const groupedComments: { [key: number]: any[] } = {};
        commentsData.forEach((c) => {
          if (!groupedComments[c.post_id]) groupedComments[c.post_id] = [];
          groupedComments[c.post_id].push(c);
        });
        setComments(groupedComments);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  // Post Discussion Handler
  const handlePostSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newPost.trim()) return;

  const sanitizedContent = sanitizeInput(newPost);

  const { data, error } = await supabase
    .from('community_posts')
    .insert([
      {
        author: 'Abhinav Malviya',
        role: 'Admin / Master Trader',
        content: sanitizedContent,
      },
    ])
    .select();

  if (error) {
    console.error('Community Post Error:', error);
    toast.error(`Database Error: ${error.message}`);
  } else if (data && data.length > 0) {
    setPosts([data[0], ...posts]);
    setNewPost('');
    toast.success('Discussion posted successfully!');
  }
};

  // Reply / Comment Handler
  const handleCommentSubmit = async (postId: number) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const sanitizedComment = sanitizeInput(text);

    const { data, error } = await supabase
      .from('community_comments')
      .insert([
        {
          post_id: postId,
          author: 'Abhinav Malviya',
          content: sanitizedComment,
        },
      ])
      .select();

    if (error) {
      toast.error('Failed to post reply');
    } else if (data) {
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data[0]],
      }));
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      toast.success('Reply added!');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-500" /> Traders Lounge & Community
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Discuss setups, share ideas, and interact with fellow traders in real-time
        </p>
      </div>

      {/* Post Discussion Form */}
      <form onSubmit={handlePostSubmit} className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl space-y-4">
        <textarea
          rows={3}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your trade setup, chart breakdown, or question..."
          className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
        ></textarea>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Persistent PostgreSQL Supabase Storage
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <Send className="w-3.5 h-3.5" /> Post Discussion
          </button>
        </div>
      </form>

      {/* Posts Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-slate-500 text-center py-8">Loading Community Posts...</div>
        ) : posts.length === 0 ? (
          <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-8 text-center text-slate-500">
            No community posts yet. Be the first to start a discussion!
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl space-y-4">
              {/* Post Header */}
              <div className="flex items-center justify-between border-b border-blue-900/20 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
                    {post.author ? post.author[0] : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-200">{post.author || 'Anonymous'}</span>
                      {post.role && (
                        <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                          {post.role}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(post.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Body */}
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

              {/* Comments / Replies Section */}
              <div className="pt-4 border-t border-blue-900/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  <span>Replies ({comments[post.id]?.length || 0})</span>
                </div>

                {/* Comment Feed */}
                {comments[post.id] && comments[post.id].length > 0 && (
                  <div className="space-y-2 pl-4 border-l-2 border-blue-900/40 my-3">
                    {comments[post.id].map((c) => (
                      <div key={c.id} className="bg-[#070A10] p-3 rounded-xl border border-blue-900/20 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-400">{c.author}</span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {new Date(c.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-slate-300">{c.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input Form */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    placeholder="Write a reply..."
                    className="flex-1 bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" /> Reply
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}