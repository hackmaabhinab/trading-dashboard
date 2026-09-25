'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Zap, ShieldCheck, ArrowRight, Sparkles, Star } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();

  const handleSelectPlan = (planName: string, amount: number) => {
    // Redirect to payment page with selected plan details in URL query
    router.push(`/payment?plan=${encodeURIComponent(planName)}&amount=${amount}`);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-[#d1d4dc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 bg-[#2962ff]/10 border border-[#2962ff]/30 text-[#2962ff] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Choose Your Membership Plan
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Unlock Institutional Trading Tools
        </h1>
        <p className="text-sm sm:text-base text-[#787b86] max-w-2xl mx-auto">
          Get full access to Valt Terminal algorithms, ICT/SMC indicator suites, real-time alerts, and premium trading analytics.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        
        {/* PLAN 1: 3 MONTHS */}
        <div className="bg-[#131722] border border-[#2a2e39] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#2962ff]/50 transition-all shadow-xl relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#787b86] uppercase tracking-wider font-mono">Quarterly Pass</span>
              <span className="bg-[#1e222d] text-[#787b86] text-[11px] px-2.5 py-1 rounded-md font-medium">3 Months Access</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">₹</span>
                <span className="text-5xl font-black text-white">399</span>
                <span className="text-xs text-[#787b86]">/ 3 months</span>
              </div>
              <p className="text-xs text-[#787b86] mt-1">₹133/month • Billed quarterly</p>
            </div>

            <div className="h-px bg-[#2a2e39] my-6"></div>

            {/* Features List */}
            <div className="space-y-3 text-xs mb-8">
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">What&apos;s Included:</p>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span>Full Valt Terminal Access (3 Months)</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span>SMC / ICT Smart Money Indicators</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span>Real-Time Market Buy/Sell Signals</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span>Multi-Timeframe Charting Tools</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#787b86]">
                <CheckCircle2 className="w-4 h-4 text-[#787b86] shrink-0" />
                <span>Standard Community Support</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSelectPlan('Quarterly Plan (3 Months)', 399)}
            className="w-full bg-[#1e222d] hover:bg-[#2962ff] text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs border border-[#2a2e39] hover:border-transparent active:scale-[0.98]"
          >
            Select 3 Months Plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* PLAN 2: 1 YEAR (BEST VALUE) */}
        <div className="bg-[#131722] border-2 border-[#089981] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          
          {/* Badge */}
          <div className="absolute top-0 right-0 bg-[#089981] text-black font-extrabold text-[10px] uppercase px-4 py-1 rounded-bl-xl tracking-wider flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-black" /> Most Popular (Save 37%)
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 mt-2">
              <span className="text-xs font-bold text-[#089981] uppercase tracking-wider font-mono">Annual Membership</span>
              <span className="bg-[#089981]/20 text-[#089981] text-[11px] px-2.5 py-1 rounded-md font-semibold">1 Year Access</span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">₹</span>
                <span className="text-5xl font-black text-white">1,000</span>
                <span className="text-xs text-[#787b86]">/ year</span>
              </div>
              <p className="text-xs text-[#089981] mt-1 font-medium">Just ₹83/month • Best value for traders</p>
            </div>

            <div className="h-px bg-[#2a2e39] my-6"></div>

            {/* Features List */}
            <div className="space-y-3 text-xs mb-8">
              <p className="font-bold text-white text-xs uppercase tracking-wider mb-2">Everything in Quarterly + VIP Perks:</p>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span><strong>12 Months Full Access</strong> to Valt Terminal</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span>All Advanced SMC, ICT & Order Flow Suite</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span>Instant Telegram / WhatsApp Alert Integration</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span>Priority Account Verification (Instant Approval)</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#d1d4dc]">
                <CheckCircle2 className="w-4 h-4 text-[#089981] shrink-0" />
                <span>VIP Support & Future Indicator Updates Free</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSelectPlan('Annual VIP Plan (1 Year)', 1000)}
            className="w-full bg-[#089981] hover:bg-[#067361] text-black font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-[#089981]/20 active:scale-[0.98]"
          >
            Get 1 Year VIP Pass <Zap className="w-4 h-4 fill-black" />
          </button>
        </div>

      </div>

      {/* ALL INCLUDED TOOLS SECTION */}
      <div className="max-w-4xl mx-auto bg-[#131722]/60 border border-[#2a2e39] rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-bold text-white text-center mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#2962ff]" />
          What Tools & Features You Will Get Inside
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#1e222d] p-4 rounded-xl border border-[#2a2e39]">
            <p className="font-bold text-white mb-1">📊 ICT / SMC Concepts</p>
            <p className="text-[#787b86]">Order Blocks, Fair Value Gaps (FVG), Liquidity Sweeps, and Break of Structure (BOS) automatic detection.</p>
          </div>

          <div className="bg-[#1e222d] p-4 rounded-xl border border-[#2a2e39]">
            <p className="font-bold text-white mb-1">⚡ Instant Buy/Sell Signals</p>
            <p className="text-[#787b86]">High-probability entry, stop-loss, and target levels directly overlaid on live charts.</p>
          </div>

          <div className="bg-[#1e222d] p-4 rounded-xl border border-[#2a2e39]">
            <p className="font-bold text-white mb-1">🔔 Live Telegram Alerts</p>
            <p className="text-[#787b86]">Get notified on your phone whenever a high-accuracy setup is triggered on Forex or Crypto.</p>
          </div>

          <div className="bg-[#1e222d] p-4 rounded-xl border border-[#2a2e39]">
            <p className="font-bold text-white mb-1">📈 Multi-Timeframe Matrix</p>
            <p className="text-[#787b86]">Analyze trends from 1m scalping up to Daily trends in a single unified dashboard view.</p>
          </div>

          <div className="bg-[#1e222d] p-4 rounded-xl border border-[#2a2e39]">
            <p className="font-bold text-white mb-1">🛡️ Risk-Reward Calculator</p>
            <p className="text-[#787b86]">Built-in position size and risk calculator to protect your capital on every single trade.</p>
          </div>

          <div className="bg-[#1e222d] p-4 rounded-xl border border-[#2a2e39]">
            <p className="font-bold text-white mb-1">💬 Priority Admin Support</p>
            <p className="text-[#787b86]">Direct 1-on-1 support on WhatsApp and Telegram for setup assistance and query resolution.</p>
          </div>
        </div>
      </div>

    </div>
  );
}