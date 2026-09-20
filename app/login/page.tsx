"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const router = useRouter();

  // Supabase client instance using useState to prevent re-instantiation
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Force session refresh before route change
        await supabase.auth.getSession();
        
        // Native hard push to ensure layout & middleware re-evaluate auth cookies properly
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-emerald-400 tracking-wide font-mono uppercase">
            Valt Terminal Login
          </h1>
          <p className="text-xs text-neutral-500">Restricted Institutional Access</p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-semibold">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">
              Authorized Email
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@valtsys.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">
              Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}