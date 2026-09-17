'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Set access token cookie for middleware check
      document.cookie = `sb-access-token=${data.session?.access_token}; path=/`;
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B0F17] border border-blue-900/30 p-8 rounded-2xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl text-blue-400 mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-wider">
            INSTITUTIONAL<span className="text-blue-500 font-black">.FX</span>
          </h1>
          <p className="text-xs text-slate-400">Enter your credentials to access execution terminal</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg flex items-center gap-2 text-rose-400 text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-2">Terminal ID / Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="trader@institutional.fx"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-400 mb-2">Passcode</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate Terminal'}
          </button>
        </form>
      </div>
    </div>
  );
}