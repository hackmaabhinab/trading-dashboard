"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Access Denied: Invalid credentials or unauthorized user.");
      setLoading(false);
    } else if (data.session) {
      // Store session token in cookie for middleware route protection
      document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=604800; SameSite=Strict; Secure`;
      router.push("/dashboard");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-zinc-900 p-8 rounded-xl border border-zinc-800 space-y-4 shadow-2xl"
      >
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-green-500">Valt Terminal</h2>
          <p className="text-xs text-zinc-400">Restricted Institutional Access</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/50 border border-red-800 rounded text-red-400 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-zinc-400">Authorized Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="trader@valt.com"
            className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded focus:border-green-500 outline-none text-white text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-400">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full mt-1 p-2 bg-black border border-zinc-700 rounded focus:border-green-500 outline-none text-white text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-black font-bold text-sm rounded transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Authenticating..." : "Authenticate & Launch"}
        </button>

        <p className="text-[10px] text-center text-zinc-500 pt-2">
          Unauthorized access attempts are logged and strictly monitored.
        </p>
      </form>
    </div>
  );
}