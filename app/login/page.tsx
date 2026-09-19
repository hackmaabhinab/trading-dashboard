"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        alert("Account create ho gaya! Ab email/password se login karo.");
        setIsSignUp(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        // Auth token setup for middleware
        if (data.session) {
          document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=604800; SameSite=Lax`;
        }
        router.push("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <form onSubmit={handleAuth} className="w-full max-w-md bg-zinc-900 p-8 rounded-xl border border-zinc-800 space-y-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-green-500">
          {isSignUp ? "Create Valt Account" : "Valt Terminal Login"}
        </h2>
        {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
        <div>
          <label className="text-xs text-zinc-400">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded focus:border-green-500 outline-none text-white"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-400">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded focus:border-green-500 outline-none text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 hover:bg-green-500 text-black font-bold rounded transition"
        >
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
        </button>
        <p
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-center text-zinc-400 hover:underline cursor-pointer pt-2"
        >
          {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
        </p>
      </form>
    </div>
  );
}