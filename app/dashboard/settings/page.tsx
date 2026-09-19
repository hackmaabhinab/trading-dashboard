'use client';

import React, { useState } from 'react';
import { User, Shield, LogOut, Save, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function SettingsPage() {
  const { data } = useDashboardData();
  const [displayName, setDisplayName] = useState(data?.displayName || 'ABHINAV SHUKLA');
  const [email] = useState(data?.email || 'sakshishuklafundedac8990@gmail.com');
  const [role] = useState(data?.role || 'VIP Institutional Member');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSignOut = () => {
    alert('Sign Out Clicked');
  };

  const handleWipeData = () => {
    if (confirm('Are you sure you want to permanently erase all your data? This action cannot be undone.')) {
      alert('Data wiped successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 p-6 space-y-6 w-full font-sans">
      
      {/* Top Header Section */}
      <div className="flex items-center justify-between w-full">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Account Settings</h1>
          <p className="text-xs text-neutral-400 font-medium">
            Manage your terminal profile & authentication credentials
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-[#0B0C10] hover:bg-neutral-800 border border-neutral-800 text-neutral-300 px-4 py-2 rounded-xl text-xs font-mono transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 text-neutral-400" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Settings Container */}
      <div className="bg-[#0B0C10] border border-neutral-800/80 rounded-2xl p-6 shadow-2xl space-y-6 w-full">
        
        {/* Community Identity Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-500 uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>Community Trader Identity</span>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-neutral-400 block mb-1.5">
                DISPLAY NAME (VISIBLE ON COMMUNITY)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#12131A] border border-neutral-800/80 focus:border-emerald-500 text-white rounded-xl px-4 py-2.5 text-xs font-mono outline-none transition-colors"
                placeholder="Enter Display Name"
              />
            </div>
          </div>

          {/* Account Credentials Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-500 uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Account Credentials</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#12131A] border border-neutral-800/80 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 block">Logged In Email:</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold break-all">{email}</span>
              </div>

              <div className="bg-[#12131A] border border-neutral-800/80 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-neutral-500 block">Role / Account Type:</span>
                <span className="text-xs font-mono text-emerald-400 font-semibold">{role}</span>
              </div>
            </div>
          </div>

          {/* Save Profile Button */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>

            {isSaved && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profile details updated successfully!</span>
              </div>
            )}
          </div>
        </form>

      </div>

      {/* Danger Zone Section */}
      <div className="bg-[#0B0C10] border border-rose-950/60 rounded-2xl p-6 space-y-4 w-full">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone: Permanent Data Erasure</span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed font-sans">
          Wiping your account will permanently remove all your trading journal logs, AI strategy chats, and saved community profile metadata from the server database.
        </p>

        <button
          onClick={handleWipeData}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-rose-950/50"
        >
          <Trash2 className="w-4 h-4" />
          <span>Wipe Data & Logout</span>
        </button>
      </div>

    </div>
  );
}