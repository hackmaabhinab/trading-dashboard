"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  
  // Use SSR client helper
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [inviteMode, setInviteMode] = useState(false);
  const [inviteReady, setInviteReady] = useState(false);
  const [checkingInvite, setCheckingInvite] = useState(false);

  useEffect(() => {
    let active = true;

    async function resolveInvite() {
      const currentUrl = new URL(window.location.href);
      const hashParams = new URLSearchParams(currentUrl.hash.replace(/^#/, ""));
      const inviteType = currentUrl.searchParams.get("type") === "invite" || hashParams.get("type") === "invite";
      const code = currentUrl.searchParams.get("code");
      const errorCode = currentUrl.searchParams.get("error_code") || hashParams.get("error_code");
      const errorDescription = currentUrl.searchParams.get("error_description") || hashParams.get("error_description");

      if (!inviteType && !code && !errorCode) return;
      setInviteMode(true);
      setCheckingInvite(true);

      if (errorCode) {
        setErrorMessage(errorCode === "otp_expired"
          ? "This invitation link has expired or was already used. Ask the admin to send a fresh invite."
          : errorDescription || "The invitation could not be verified. Ask the admin to send a new invite.");
        setCheckingInvite(false);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (active) setErrorMessage("This invitation link is invalid or expired. Ask the admin to send a fresh invite.");
        }
      } else {
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error && active) setErrorMessage("This invitation link is invalid or expired. Ask the admin to send a fresh invite.");
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error || !data.session?.user) {
        setErrorMessage((previous) => previous || "This invitation link is invalid or expired. Ask the admin to send a fresh invite.");
      } else {
        setEmail(data.session.user.email || "");
        setErrorMessage(null);
        setInviteReady(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      setCheckingInvite(false);
    }

    void resolveInvite();
    return () => { active = false; };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      if (inviteMode) {
        if (password.length < 8) {
          setErrorMessage("Choose a password with at least 8 characters.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage("The passwords do not match.");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        router.replace("/dashboard");
        return;
      }

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
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B0B0B] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-xl font-bold text-emerald-400 tracking-wide font-mono uppercase">
            {inviteMode ? "Set Your VAULT Password" : "VAULT Terminal Login"}
          </h1>
          <p className="text-xs text-neutral-500">{inviteMode ? (checkingInvite ? "Verifying your secure invitation" : "Create a password to activate your account") : "Restricted Institutional Access"}</p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-semibold">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        {(!inviteMode || inviteReady) && <form className="space-y-4" onSubmit={handleSubmit}>
          {!inviteMode && <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">Authorized Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="trader@valtsys.com" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>}

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">
              {inviteMode ? "New Password" : "Password"}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={inviteMode ? 8 : undefined}
              placeholder="••••••••"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {inviteMode && <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1">Confirm New Password</label>
            <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" />
          </div>}

          <button 
            type="submit"
            disabled={loading || checkingInvite}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (inviteMode ? "Saving password..." : "Authenticating...") : (inviteMode ? "Set Password & Continue" : "Log In")}
          </button>
        </form>}

        {/* Direct Payment Redirect Button */}
        {!inviteMode && <div className="text-center pt-3 border-t border-neutral-900/80 space-y-2">
          <p className="text-xs text-neutral-400">
            Don’t have an account yet?
          </p>
          <Link 
            href="/pricing"
            className="w-full inline-block text-center bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-emerald-400 font-semibold text-xs py-2.5 rounded-lg transition-all active:scale-[0.98]"
          >
            Create Account / Pay Subscription
          </Link>
        </div>}

      </div>
    </div>
  );
}
