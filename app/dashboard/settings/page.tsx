'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { User, ShieldCheck, Save, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setDisplayName(user.user_metadata?.full_name || '');
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: { full_name: displayName }
    });

    if (error) {
      toast.error(`Update failed: ${error.message}`);
    } else {
      toast.success('Trader Profile updated!');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleDeleteAccountData = async () => {
    const confirmed = window.confirm(
      '⚠️ WARNING: Are you sure? This will PERMANENTLY ERASE all your Trading Journal history and AI Chat conversations from the server database.'
    );

    if (!confirmed || !user) return;

    setDeleting(true);

    try {
      // Step A: Hard delete user's AI Chat logs
      const { error: chatErr } = await supabase
        .from('ai_chats')
        .delete()
        .filter('user_id', 'eq', user.id);

      // Step B: Hard delete user's Trading Journal
      const { error: tradeErr } = await supabase
        .from('trades')
        .delete()
        .filter('user_id', 'eq', user.id);

      // Step C: Clear Profile Metadata
      const { error: profileErr } = await supabase
        .from('profiles')
        .delete()
        .filter('id', 'eq', user.id);

      if (chatErr || tradeErr || profileErr) {
        console.error('Delete Errors:', { chatErr, tradeErr, profileErr });
        toast.error('Partial failure during deletion. Check console.');
      } else {
        toast.success('Database completely cleared for this account!');
      }

      // Step D: Local Storage Purge & Sign Out
      localStorage.clear();
      sessionStorage.clear();

      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (err: any) {
      toast.error('An error occurred during account wipe.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="border-b border-blue-900/30 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-100">Account Settings</h2>
          <p className="text-xs text-slate-400 mt-1">Manage your terminal profile & authentication credentials</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <form onSubmit={handleUpdateProfile} className="bg-[#0B0F17] border border-blue-900/40 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2 border-b border-blue-900/30 pb-3">
            <User className="w-4 h-4" /> Community Trader Identity
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Display Name (Visible on Community)</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. ProTrader_7"
              className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2 border-b border-blue-900/30 pb-3">
            <ShieldCheck className="w-4 h-4" /> Account Credentials
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#070A10] border border-blue-900/30 p-3 rounded-xl">
              <span className="text-slate-500 block mb-1">Logged In Email:</span>
              <span className="text-slate-200 font-bold">{user?.email || 'Guest User'}</span>
            </div>

            <div className="bg-[#070A10] border border-blue-900/30 p-3 rounded-xl">
              <span className="text-slate-500 block mb-1">Role / Account Type:</span>
              <span className="text-emerald-400 font-bold">VIP Institutional Member</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      <div className="bg-rose-950/20 border border-rose-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm border-b border-rose-500/20 pb-3">
          <AlertTriangle className="w-5 h-5 text-rose-500" /> Danger Zone: Permanent Data Erasure
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Wiping your account will permanently remove all your trading journal logs, AI strategy chats, and saved community profile metadata from the server database.
        </p>

        <button
          onClick={handleDeleteAccountData}
          disabled={deleting}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? 'Wiping All Data...' : 'Wipe Data & Logout'}
        </button>
      </div>
    </div>
  );
}