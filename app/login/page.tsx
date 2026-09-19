"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation for authentication/navigation
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
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

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">Authorized Email</label>
            <input 
              type="email" 
              required
              placeholder="trader@valtsys.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 font-mono">
          Need an account? <Link href="/signup" className="text-emerald-400 hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}