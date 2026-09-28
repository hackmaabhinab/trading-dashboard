"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, Link2, Loader2, Wallet } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useConfirm } from "@/app/dashboard/layout";

type Commission = { id: string; commission_amount: number | string; status: string; created_at: string };
type Withdrawal = { id: string; amount: number | string; status: string; requested_at: string };
const money = (value: number) => `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function AffiliatePanel() {
  const supabase = useMemo(() => createClient(), []);
  const { showAlert } = useConfirm();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) { setLoadError("Sign in to access your affiliate account."); setLoading(false); return; }
    const { data: newCode, error: codeError } = await supabase.rpc("ensure_affiliate_account");
    if (codeError || !newCode) { setLoadError("Affiliate setup is not ready yet. Please try again later."); setLoading(false); return; }
    setCode(newCode as string);
    const [commissionResult, withdrawalResult] = await Promise.all([
      supabase.from("affiliate_commissions").select("id,commission_amount,status,created_at").eq("affiliate_user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("affiliate_withdrawals").select("id,amount,status,requested_at").eq("user_id", user.id).order("requested_at", { ascending: false }),
    ]);
    if (commissionResult.error || withdrawalResult.error) setLoadError("Your affiliate summary could not be loaded. Pull to refresh or try again.");
    setCommissions((commissionResult.data ?? []) as Commission[]);
    setWithdrawals((withdrawalResult.data ?? []) as Withdrawal[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void load(); }, [load]);

  const totalEarned = commissions.filter((item) => item.status === "available").reduce((sum, item) => sum + Number(item.commission_amount), 0);
  const reserved = withdrawals.filter((item) => item.status === "pending" || item.status === "paid").reduce((sum, item) => sum + Number(item.amount), 0);
  const available = Math.max(0, totalEarned - reserved);
  const affiliateLink = code && typeof window !== "undefined" ? `${window.location.origin}/pricing?ref=${code}` : "";

  async function copyLink() {
    if (!affiliateLink) return;
    try { await navigator.clipboard.writeText(affiliateLink); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    catch { showAlert({ title: "COPY FAILED", message: "Copy your affiliate link manually." }); }
  }

  async function requestWithdrawal() {
    const requested = Number(amount);
    if (!Number.isFinite(requested) || requested <= 0 || !upi.trim()) { showAlert({ title: "CHECK WITHDRAWAL DETAILS", message: "Enter a valid amount and UPI ID." }); return; }
    setBusy(true);
    const { error } = await supabase.rpc("request_affiliate_withdrawal", { p_amount: requested, p_payout_upi: upi.trim() });
    setBusy(false);
    if (error) { showAlert({ title: "WITHDRAWAL REQUEST FAILED", message: error.message }); return; }
    setAmount("");
    showAlert({ title: "REQUEST SUBMITTED", message: "Your withdrawal request is pending manual review. Approved payouts are processed within 24 hours.", isSuccess: true });
    await load();
  }

  return <section className="rounded-2xl border border-neutral-800 bg-[#0A0A0A] p-5 shadow-2xl sm:p-7">
    <div className="mb-5 flex items-center gap-3"><div className="rounded-xl border border-emerald-900 bg-emerald-950/60 p-2 text-emerald-400"><Link2 className="h-5 w-5" /></div><div><h2 className="text-base font-black tracking-wide text-white">Affiliate Program</h2><p className="mt-1 text-xs text-neutral-500">30% customer discount · 30% commission on the original plan price</p></div></div>
    {loading ? <div className="flex min-h-24 items-center justify-center text-emerald-400"><Loader2 className="h-5 w-5 animate-spin" /></div> : loadError ? <div className="flex items-center justify-between gap-3 text-sm text-neutral-400"><span>{loadError}</span><button onClick={() => void load()} className="rounded-lg border border-neutral-700 px-3 py-2 text-xs font-bold text-white">Retry</button></div> : <>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-black p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Available balance</p><p className="mt-2 text-2xl font-black text-emerald-400">{money(available)}</p></div>
        <div className="rounded-xl border border-neutral-800 bg-black p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Lifetime commission</p><p className="mt-2 text-2xl font-black text-white">{money(totalEarned)}</p></div>
        <div className="rounded-xl border border-neutral-800 bg-black p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Approved referrals</p><p className="mt-2 text-2xl font-black text-white">{commissions.filter((item) => item.status === "available").length}</p></div>
      </div>
      <div className="mt-4 rounded-xl border border-neutral-800 bg-black p-4"><label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Your affiliate link</label><div className="mt-2 flex gap-2"><input readOnly value={affiliateLink} className="min-w-0 flex-1 rounded-lg border border-neutral-800 bg-[#111] px-3 py-3 text-xs text-white"/><button onClick={() => void copyLink()} className="flex shrink-0 items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-black">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}<span>{copied ? "Copied" : "Copy"}</span></button></div><p className="mt-2 text-[11px] text-neutral-500">When a new customer buys through this link, they receive 30% off. You earn 30% of the original plan price after their payment is manually approved.</p></div>
      <div className="mt-4 rounded-xl border border-neutral-800 bg-black p-4"><div className="mb-3 flex items-center gap-2 text-white"><Wallet className="h-4 w-4 text-emerald-400"/><h3 className="text-sm font-bold">Request a withdrawal</h3></div><div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><input inputMode="decimal" type="number" min="0.01" max={available} step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Amount (₹)" className="rounded-lg border border-neutral-800 bg-[#111] px-3 py-3 text-sm text-white placeholder:text-neutral-600"/><input value={upi} onChange={(event) => setUpi(event.target.value)} placeholder="Your UPI ID" className="rounded-lg border border-neutral-800 bg-[#111] px-3 py-3 text-sm text-white placeholder:text-neutral-600"/><button disabled={busy || available <= 0} onClick={() => void requestWithdrawal()} className="rounded-lg bg-emerald-500 px-4 py-3 text-xs font-black text-black disabled:cursor-not-allowed disabled:opacity-40">{busy ? "Submitting…" : "Request payout"}</button></div><p className="mt-2 text-[11px] text-neutral-500">Payouts are paid manually within 24 hours after review.</p></div>
      {withdrawals.length ? <div className="mt-4"><h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">Recent withdrawal requests</h3><div className="space-y-2">{withdrawals.slice(0, 5).map((item) => <div key={item.id} className="flex justify-between rounded-lg border border-neutral-800 bg-black px-3 py-2 text-xs"><span className="text-white">{money(Number(item.amount))}</span><span className="capitalize text-neutral-400">{item.status}</span></div>)}</div></div> : null}
    </>}
  </section>;
}

