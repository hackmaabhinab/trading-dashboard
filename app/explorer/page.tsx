"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  BrainCircuit, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  Sparkles,
  Bot,
  Activity,
  History
} from "lucide-react";

export default function ExplorerLandingPage() {
  const [activeTab, setActiveTab] = useState<"identify" | "optimize" | "protect">("identify");

  return (
    <div className="min-h-screen w-full bg-black text-slate-100 font-sans selection:bg-emerald-500 selection:text-black overflow-x-hidden">
      
      {/* 1. TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800/80 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black font-mono tracking-widest text-emerald-400 uppercase">
              VALT SYS
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
              v3.6-Flash
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#cypher" className="hover:text-white transition-colors">AI Coach</a>
            <a href="#backtest" className="hover:text-white transition-colors">Backtest</a>
            <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-xs font-medium text-neutral-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
            >
              Log In
            </Link>
            <Link 
              href="/dashboard" 
              className="text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER CENTERED */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* 2. HERO SECTION */}
        <section className="text-center space-y-6 py-8">
          <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-neutral-800 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Next-Gen Institutional AI Trading Journal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The Trading Journal That Tells You <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-600">How to Win.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Stop trading on emotion. VALT SYS inspects win-rates, risk leakage, execution flaws, and guides your daily decision-making with institutional precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
            >
              Explore Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#features" 
              className="w-full sm:w-auto text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-6 py-3.5 rounded-xl transition-all"
            >
              Guide Tour
            </a>
          </div>

          {/* TOP FEATURE PREVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left w-full">
            <div className="bg-[#0B0B0B] border border-neutral-800/80 p-5 rounded-2xl relative overflow-hidden hover:border-emerald-500/50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Meet Cypher AI</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Your personal AI trading psychologist & execution inspector.</p>
            </div>

            <div className="bg-[#0B0B0B] border border-neutral-800/80 p-5 rounded-2xl relative overflow-hidden hover:border-emerald-500/50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Backtest Simulator</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Replay market price action and validate your edge risk-free.</p>
            </div>

            <div className="bg-[#0B0B0B] border border-neutral-800/80 p-5 rounded-2xl relative overflow-hidden hover:border-emerald-500/50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Smart Analytics</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">Deep insights into MFE/MAE, hourly win-rate, and R:R ratios.</p>
            </div>
          </div>
        </section>

        {/* 3. INTERACTIVE FEATURE TABS */}
        <section id="features" className="py-16 border-t border-neutral-900 w-full">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">System Architecture</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Elevate Your Trading Strategy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start w-full">
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab("identify")}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeTab === "identify"
                    ? "bg-neutral-900 border-emerald-500 text-white shadow-lg"
                    : "bg-black border-neutral-800/80 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider block mb-1">01. Identify & Plan</span>
                <p className="text-xs">Uncover your true trading edge and build a winning strategy playbook.</p>
              </button>

              <button
                onClick={() => setActiveTab("optimize")}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeTab === "optimize"
                    ? "bg-neutral-900 border-emerald-500 text-white shadow-lg"
                    : "bg-black border-neutral-800/80 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider block mb-1">02. Optimize & Practice</span>
                <p className="text-xs">Replay historical chart data with our realistic market simulator.</p>
              </button>

              <button
                onClick={() => setActiveTab("protect")}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeTab === "protect"
                    ? "bg-neutral-900 border-emerald-500 text-white shadow-lg"
                    : "bg-black border-neutral-800/80 text-neutral-400 hover:border-neutral-700"
                }`}
              >
                <span className="text-xs font-bold uppercase tracking-wider block mb-1">03. Protect & Refine</span>
                <p className="text-xs">Manage risk parameters and eliminate emotional drawdown leaks.</p>
              </button>
            </div>

            <div className="md:col-span-2 bg-[#0B0B0B] border border-neutral-800 p-6 rounded-2xl min-h-[280px] flex flex-col justify-between">
              {activeTab === "identify" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase">
                    <TrendingUp className="w-4 h-4" /> Advanced Performance Tracking
                  </div>
                  <h3 className="text-xl font-bold text-white">Uncover Your Trading Edge</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Detailed analytics evaluate win rate across timeframes, asset classes (XAUUSD, Forex, Crypto), and session setups to show exactly where your profit comes from.
                  </p>
                </div>
              )}

              {activeTab === "optimize" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase">
                    <History className="w-4 h-4" /> Market Replay Engine
                  </div>
                  <h3 className="text-xl font-bold text-white">Gain 1 Year of Experience in 1 Hour</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Practice trading strategies risk-free using tick-by-tick market replay. Test SMC/ICT order blocks before risking capital.
                  </p>
                </div>
              )}

              {activeTab === "protect" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase">
                    <ShieldCheck className="w-4 h-4" /> Automated Risk Management
                  </div>
                  <h3 className="text-xl font-bold text-white">Secure Your Capital & Manage Drawdown</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Set hard max daily loss limits and position sizing rules. Cypher Coach alerts you immediately if you start revenge trading.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. CYPHER AI SECTION */}
        <section id="cypher" className="py-16 border-t border-neutral-900 w-full">
          <div className="bg-gradient-to-b from-[#0B0B0B] to-black border border-neutral-800 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-mono text-emerald-400">
                <BrainCircuit className="w-3.5 h-3.5" /> Cypher AI Assistant
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Your Personal AI Trading Coach
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                Cypher analyzes every trade log in real-time. Ask questions like <span className="text-white font-mono">"Why am I losing on Mondays?"</span> to receive instant answers.
              </p>
              <ul className="space-y-2 text-xs font-mono text-neutral-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Trade Flaw Inspection</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Risk & Reward Leakage Analysis</li>
              </ul>
            </div>

            <div className="bg-black border border-neutral-800 rounded-2xl p-4 font-mono text-xs space-y-3 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[10px] text-neutral-500">
                <span>CYPHER AI AUDIT</span>
                <span className="text-emerald-400">ACTIVE SESSION</span>
              </div>
              <div className="bg-neutral-900/80 p-3 rounded-lg border border-neutral-800 text-neutral-300">
                <p className="text-emerald-400 font-bold mb-1">💡 Execution Warning:</p>
                <p className="text-[11px] text-neutral-400">"Your last 3 XAUUSD trades were executed outside NY Killzone hours, resulting in 65% higher slippage."</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. REVIEWS */}
        <section id="reviews" className="py-16 border-t border-neutral-900 w-full">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">Trader Feedback</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">Hear From Funded Traders</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Prop Trader Alex", role: "Gold & Forex Scalper", review: "VALT SYS transformed my risk management. Cypher caught my overtrading habit." },
              { name: "SMC Trader Rahil", role: "Indices & XAUUSD", review: "The MFE/MAE analysis gave me the exact confidence to hold my winning trades." },
              { name: "Quant Trader Elena", role: "Crypto & Futures", review: "Cleanest trading dashboard on the market. The backtest simulator is blazingly fast." }
            ].map((item, i) => (
              <div key={i} className="bg-[#0B0B0B] border border-neutral-800 p-5 rounded-2xl space-y-3">
                <div className="flex gap-1 text-emerald-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-emerald-400" />
                  ))}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-sans">"{item.review}"</p>
                <div>
                  <span className="text-xs font-bold text-white block">{item.name}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 6. FOOTER */}
      <footer className="border-t border-neutral-900 bg-black py-10 px-4 w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-sm font-black font-mono tracking-widest text-emerald-400 uppercase">VALT SYS</span>
            <p className="text-[11px] text-neutral-500">Institutional AI Trading Journal & Execution Platform</p>
          </div>
          <div className="flex gap-6 text-xs font-mono text-neutral-400">
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#cypher" className="hover:text-white">Cypher AI</a>
          </div>
          <span className="text-[10px] font-mono text-neutral-600">© 2026 VALT SYS. All Rights Reserved.</span>
        </div>
      </footer>

    </div>
  );
}