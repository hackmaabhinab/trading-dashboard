'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Save, Loader2, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function SettingsPage() {
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // States
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) setLoading(false);
          return;
        }

        const user = session.user;
        if (isMounted) {
          setUserId(user.id);
          setEmail(user.email || '');
        }

        // Fetch User Profile from Database
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, username, avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (profile && isMounted) {
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
          setUsername(profile.username || '');
          setAvatarUrl(profile.avatar_url || null);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Save changes to Supabase
  const handleSaveChanges = async () => {
    if (!userId) {
      alert('User session not found. Please log in.');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          username: username,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = (firstName?.[0] || email?.[0] || 'U').toUpperCase();

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center text-emerald-400 gap-2 font-bold text-sm">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading Account Profile...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-neutral-100 p-8 md:p-12 font-sans select-none flex flex-col items-center">
      
      {/* WIDER CONTAINER (Image 2 Proportional Layout) */}
      <div className="w-full max-w-5xl space-y-9 my-auto">
        
        {/* HEADER SECTION */}
        <div className="text-left">
          <p className="text-xs font-black text-neutral-500 uppercase tracking-widest">
            PERSONAL & ACCOUNT
          </p>
          <h1 className="text-4xl font-black text-white tracking-tight mt-1.5">
            Personal Info
          </h1>
        </div>

        {/* AVATAR SECTION */}
        <div className="flex items-center gap-6">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-neutral-800"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-4xl shadow-xl shadow-emerald-500/20">
                {avatarLetter}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setAvatarUrl(null)}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-[#0D0D0D] hover:bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-bold text-neutral-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <span>Delete Picture</span>
            <Trash2 className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        {/* PROFILE BOX */}
        <div className="bg-[#0A0A0A] border border-neutral-800/80 rounded-2xl p-7 space-y-5 shadow-2xl">
          <h2 className="text-base font-black text-white tracking-wide">
            Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="w-full bg-black/90 border border-neutral-800/90 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="w-full bg-black/90 border border-neutral-800/90 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ACCOUNT DETAILS BOX */}
        <div className="bg-[#0A0A0A] border border-neutral-800/80 rounded-2xl p-7 space-y-5 shadow-2xl">
          <h2 className="text-base font-black text-white tracking-wide">
            Account Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-black/90 border border-neutral-800/90 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-neutral-900/60 border border-neutral-800/60 rounded-xl px-4 py-3.5 text-sm font-bold text-neutral-500 cursor-not-allowed select-none"
              />
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={async () => {
              if (email) {
                await supabase.auth.resetPasswordForEmail(email);
                alert(`Password reset email sent to: ${email}`);
              }
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0D0D0D] hover:bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <span>Change Password</span>
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10 transition-all active:scale-95 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}