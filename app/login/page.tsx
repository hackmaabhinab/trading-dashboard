'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(`Login Failed: ${error.message}`);
        setLoading(false);
      } else if (data?.user) {
        toast.success('Access Granted! Redirecting...');
        
        setTimeout(() => {
          // Redirect to /dashboard (Overview tab) instead of VIP Signals
          router.push('/dashboard');
          router.refresh();
        }, 500);
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred during sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070A10] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B0F17] border border-blue-900/40 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-wide">INSTITUTIONAL.FX</h2>
          <p className="text-xs text-slate-400">Enter provided credentials to access trading terminal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="trader@institutional.fx"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full bg-[#070A10] border border-blue-900/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Terminal'}
          </button>
        </form>
      </div>
    </div>
  );
}