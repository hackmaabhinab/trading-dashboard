'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldCheck, Copy, ArrowRight, Lock, User, Mail, Hash, PhoneCall, IndianRupee } from 'lucide-react';
import Link from 'next/link';

function PaymentContent() {
  const searchParams = useSearchParams();

  // Read selected plan & amount dynamically from URL query parameters
  const selectedPlan = searchParams.get('plan') || 'Quarterly Plan (3 Months)';
  const rawAmount = searchParams.get('amount') || '399';
  const subscriptionAmount = Number(rawAmount).toLocaleString('en-IN'); // Formats correctly (e.g., 1,000 or 399)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    upiName: '',
    utrNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Exact UPI ID
  const adminUpiId = "abhinavpandit8990@okhdfcbank"; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          amount: Number(rawAmount),
          planName: selectedPlan 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        // Displays the actual database error instead of generic message
        alert(`Error: ${result.error || "Submission failed"}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("Submission failed. Check network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isSubmitted) {
    const waMessage = encodeURIComponent(
      `Hello Admin, I have completed the payment of ₹${subscriptionAmount} for ${selectedPlan}.\n\nUsername: ${formData.username}\nEmail: ${formData.email}\nUTR Number: ${formData.utrNumber}\n\nPlease verify my payment so I can login.`
    );

    return (
      <div className="min-h-screen w-full bg-[#050505] text-[#d1d4dc] flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-md w-full bg-[#131722] border border-[#2a2e39] rounded-2xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 bg-[#089981]/20 text-[#089981] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Payment Proof Submitted!</h2>
            <p className="text-xs text-[#787b86] mt-1">
              Your ₹{subscriptionAmount} payment details for {selectedPlan} are under review.
            </p>
          </div>

          <div className="bg-[#1e222d] border border-[#2a2e39] p-4 rounded-xl text-left text-xs space-y-2 font-mono">
            <div><span className="text-[#787b86]">Plan Selected:</span> <span className="text-white font-bold">{selectedPlan}</span></div>
            <div><span className="text-[#787b86]">Amount Paid:</span> <span className="text-emerald-400 font-bold">₹{subscriptionAmount}</span></div>
            <div><span className="text-[#787b86]">Username:</span> <span className="text-white font-bold">{formData.username}</span></div>
            <div><span className="text-[#787b86]">Email:</span> <span className="text-white">{formData.email}</span></div>
            <div><span className="text-[#787b86]">UTR / Ref:</span> <span className="text-[#2962ff] font-bold">{formData.utrNumber}</span></div>
            <div><span className="text-[#787b86]">Status:</span> <span className="text-amber-400 font-bold">PENDING APPROVAL</span></div>
          </div>

          <p className="text-xs text-[#d1d4dc]">
            Speed up approval by sending a confirmation message on WhatsApp:
          </p>

          <a
            href={`https://wa.me/916306217843?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition-colors shadow-lg"
          >
            <PhoneCall className="w-4 h-4" /> Confirm on WhatsApp
          </a>

          <Link href="/login" className="block text-xs text-[#787b86] hover:text-white pt-2">
            Go to Login Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#d1d4dc] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bg-[#131722] border border-[#2a2e39] rounded-2xl grid grid-cols-1 lg:grid-cols-12 overflow-hidden shadow-2xl">
        
        {/* LEFT COLUMN: QR CODE & INSTRUCTIONS */}
        <div className="lg:col-span-5 p-5 sm:p-8 bg-[#1e222d]/40 border-b lg:border-b-0 lg:border-r border-[#2a2e39] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#2962ff] font-bold text-xs sm:text-sm mb-4">
              <ShieldCheck className="w-5 h-5" />
              <span>SECURE MEMBERSHIP CHECKOUT</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white">Scan & Pay via UPI</h1>
            <p className="text-xs text-[#787b86] mt-1">
              Scan QR code using Google Pay, PhonePe, Paytm or BHIM UPI.
            </p>

            {/* DYNAMIC AMOUNT HIGHLIGHT BADGE */}
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-1">
              <span className="text-[11px] text-[#787b86] uppercase tracking-wider font-semibold">
                {selectedPlan}
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Subscription Fee:</span>
                <span className="text-xl font-black text-emerald-400 font-mono flex items-center gap-0.5">
                  <IndianRupee className="w-4 h-4" />{subscriptionAmount}
                </span>
              </div>
            </div>

            {/* QR CODE BOX */}
            <div className="my-5 flex flex-col items-center">
              <div className="bg-white p-3 rounded-2xl shadow-2xl border border-white/20 max-w-[230px] w-full">
                <img 
                  src="/qr-code.jpg" 
                  alt="UPI QR Code" 
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>

              {/* CLEAN UPI ID DISPLAY */}
              <div className="mt-4 flex items-center justify-between w-full max-w-[280px] bg-[#0a0a0a] border border-[#2a2e39] px-3 py-2 rounded-xl text-xs">
                <span className="text-[#787b86] shrink-0">UPI ID:</span>
                <span className="font-mono text-white font-bold px-1 whitespace-nowrap overflow-x-auto select-all">
                  {adminUpiId}
                </span>
                <button 
                  type="button"
                  onClick={handleCopyUpi} 
                  className="text-[#2962ff] hover:text-white transition-colors p-1 shrink-0"
                  title="Copy UPI ID"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-[#089981]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#787b86]">
              <p className="flex items-start gap-2">
                <span className="text-[#2962ff] font-bold">1.</span> Scan QR code & pay exact <b className="text-white">₹{subscriptionAmount}</b>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#2962ff] font-bold">2.</span> Note down 12-digit UTR / Ref ID.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#2962ff] font-bold">3.</span> Submit form with payment proof.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2a2e39] text-[11px] text-[#787b86]">
            Manual verification usually takes 5-15 minutes after UTR submission.
          </div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-center">
          <h2 className="text-xl font-bold text-white mb-1">Create Account & Submit Proof</h2>
          <p className="text-xs text-[#787b86] mb-6">Fill in details after paying ₹{subscriptionAmount}.</p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#787b86] mb-1 font-medium">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#2962ff]"
                />
              </div>
              <div>
                <label className="block text-[#787b86] mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#2962ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#787b86] mb-1 font-medium">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-[#787b86]" />
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl pl-9 pr-3 py-2.5 text-white outline-none focus:border-[#2962ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#787b86] mb-1 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#787b86]" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl pl-9 pr-3 py-2.5 text-white outline-none focus:border-[#2962ff]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#787b86] mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#787b86]" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl pl-9 pr-3 py-2.5 text-white outline-none focus:border-[#2962ff]"
                />
              </div>
            </div>

            <div className="h-px bg-[#2a2e39] my-2"></div>

            <div>
              <label className="block text-[#787b86] mb-1 font-medium font-mono">Payer Name / UPI ID</label>
              <input
                type="text"
                name="upiName"
                required
                placeholder="e.g. Abhinav / abhinav@okaxis"
                value={formData.upiName}
                onChange={handleChange}
                className="w-full bg-[#1e222d] border border-[#2a2e39] rounded-xl px-3 py-2.5 text-white outline-none focus:border-[#2962ff]"
              />
            </div>

            <div>
              <label className="block text-[#089981] mb-1 font-bold">12-Digit UTR / Ref Number (For ₹{subscriptionAmount})</label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-3 text-[#089981]" />
                <input
                  type="text"
                  name="utrNumber"
                  required
                  maxLength={12}
                  placeholder="e.g. 423156789012"
                  value={formData.utrNumber}
                  onChange={handleChange}
                  className="w-full bg-[#1e222d] border border-[#089981]/50 rounded-xl pl-9 pr-3 py-2.5 text-white outline-none focus:border-[#089981] font-mono tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-[#2962ff] hover:bg-[#1e4bd8] text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2962ff]/20 disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Registering...' : `Pay ₹${subscriptionAmount} & Create Account`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-6">
          <div className="text-sm text-[#787b86]">Loading secure payment...</div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
