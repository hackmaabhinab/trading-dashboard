'use client';

import React, { useState } from 'react';
import { Settings, User, Send, ShieldCheck, Key, Trash2, Save, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  // State Management
  const [fullName, setFullName] = useState('Abhinav Malviya');
  const [email] = useState('user@terminal.fx'); // Read-only logged in user email
  const [telegramId, setTelegramId] = useState('849302849'); // Mock synced Telegram ID
  const [isTelegramSynced, setIsTelegramSynced] = useState(true); // Locked after sync
  
  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Save Profile Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile details updated successfully!');
  };

  // Update Password Handler
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please enter current and new password');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
  };

  // Delete Account Handler
  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      'WARNING: Are you sure you want to delete your account? All your journal records, signals history, and community data will be permanently deleted from Supabase!'
    );
    if (confirmDelete) {
      toast.error('Account deleted. Redirecting to login...');
      // Logic for user data purge & session kill
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-blue-900/30 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-500" /> Account & Profile Settings
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Manage your account profile, Telegram bot integration, and security credentials
        </p>
      </div>

      {/* 1. Profile & Personal Details */}
      <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-blue-900/30 pb-3">
          <User className="w-4 h-4 text-blue-400" /> Personal Identity
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Email Address (Read-Only)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-[#070A10]/60 border border-blue-900/20 rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
            >
              <Save className="w-3.5 h-3.5" /> Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* 2. Telegram Synchronization */}
      <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-blue-900/30 pb-3">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-sky-400" /> Telegram Integration
          </h3>
          {isTelegramSynced ? (
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono px-2.5 py-1 rounded-md font-bold uppercase flex items-center gap-1">
              <Lock className="w-3 h-3" /> Synced & Locked
            </span>
          ) : (
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono px-2.5 py-1 rounded-md font-bold uppercase">
              Not Synced
            </span>
          )}
        </div>

        <div>
          <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Telegram User ID / Chat ID</label>
          <input
            type="text"
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
            disabled={isTelegramSynced}
            placeholder="e.g. 849302849"
            className={`w-full border rounded-xl px-4 py-2.5 text-sm font-mono ${
              isTelegramSynced
                ? 'bg-[#070A10]/60 border-blue-900/20 text-slate-500 cursor-not-allowed'
                : 'bg-[#070A10] border-blue-900/40 text-slate-200 focus:outline-none focus:border-sky-500'
            }`}
          />
          <p className="text-[11px] text-slate-500 mt-1.5 italic">
            * Once synced, Telegram User ID is locked to prevent unauthorized signal routing changes.
          </p>
        </div>
      </div>

      {/* 3. Security & Password Update */}
      <div className="bg-[#0B0F17] border border-blue-900/30 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-blue-900/30 pb-3">
          <ShieldCheck className="w-4 h-4 text-purple-400" /> Security Credentials
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-slate-400 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
            >
              <Key className="w-3.5 h-3.5" /> Update Password
            </button>
          </div>
        </form>
      </div>

      {/* 4. Danger Zone - Account Deletion */}
      <div className="bg-[#0B0F17] border border-rose-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
          <div>
            <h3 className="text-base font-bold text-rose-400 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Danger Zone
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently purge user account and remove all personal data from Supabase DB
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/40 text-rose-300 hover:text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-rose-600/20"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}