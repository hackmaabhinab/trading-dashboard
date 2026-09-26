"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import ExplorerSplash from "@/components/Explorersplash";

type Feature = {
  id: string;
  name: string;
  eyebrow: string;
  icon: string;
  benefit: string;
  problem: string;
  problemId: 1 | 2 | 3;
  visual: "overview" | "journal" | "ai" | "news" | "strategy" | "community" | "backtest";
};

const features: Feature[] = [
  {
    id: "overview",
    name: "Overview",
    eyebrow: "DASHBOARD",
    icon: "◈",
    benefit: "Know your numbers. See your edge.",
    problem: "Solves Problem #1",
    problemId: 1,
    visual: "overview",
  },
  {
    id: "journal",
    name: "Journal",
    eyebrow: "TRADE JOURNAL",
    icon: "▤",
    benefit: "Every trade tagged. Every mistake logged.",
    problem: "Solves Problem #1",
    problemId: 1,
    visual: "journal",
  },
  {
    id: "ai",
    name: "Vault AI",
    eyebrow: "AI COACH",
    icon: "✦",
    benefit: "Find the behavioral leaks you keep missing.",
    problem: "Solves Problem #1",
    problemId: 1,
    visual: "ai",
  },
  {
    id: "news",
    name: "News + AI",
    eyebrow: "MACRO INTELLIGENCE",
    icon: "◉",
    benefit: "News events decoded before they move markets.",
    problem: "Solves Problem #2",
    problemId: 2,
    visual: "news",
  },
  {
    id: "strategy",
    name: "Strategy Playbook",
    eyebrow: "EDGE TRACKER",
    icon: "⌁",
    benefit: "Clear edge. Consistent execution.",
    problem: "Solves Problem #3",
    problemId: 3,
    visual: "strategy",
  },
  {
    id: "community",
    name: "Community",
    eyebrow: "ACCOUNTABILITY",
    icon: "◎",
    benefit: "Accountability circles keep you disciplined.",
    problem: "Solves Problem #3",
    problemId: 3,
    visual: "community",
  },
  {
    id: "backtest",
    name: "Backtest",
    eyebrow: "DATA VALIDATION",
    icon: "⌘",
    benefit: "Confidence comes from data, not hope.",
    problem: "Solves Problem #1",
    problemId: 1,
    visual: "backtest",
  },
];

const painPoints = [
  {
    number: "01",
    title: "You Journal, But Never Know Why You Lose",
    description:
      "Most traders log trades but never connect the dots. VALT AI reads your behavior, timing, tags, and outcomes to expose the pattern.",
    icon: "↯",
  },
  {
    number: "02",
    title: "News Events Blindside Your Positions",
    description:
      "Economic releases can flip a setup in seconds. Get the macro context and AI impact read before the market reprices.",
    icon: "!",
  },
  {
    number: "03",
    title: "You Have No Accountability System",
    description:
      "Without structure or people watching the process, the same mistakes become habits. VALT gives your execution a feedback loop.",
    icon: "◌",
  },
];

const testimonials = [
  {
    quote:
      "I stopped guessing what was wrong with my trading. The patterns were already in my journal — VALT just showed me.",
    name: "Beta Trader",
    role: "Intraday FX",
  },
  {
    quote:
      "The biggest shift was seeing the same mistake across 20+ trades instead of blaming one bad setup.",
    name: "Prop Firm Trader",
    role: "Gold & FX",
  },
  {
    quote:
      "It turned my journal from a database into an actual feedback system. That changed how I review my week.",
    name: "Active Trader",
    role: "SMC / ICT",
  },
];

function Reveal({
  children,
  className = "",
  delay = 0,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, amount });

  useEffect(() => {
    if (inView) {
      void controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CountUp({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1300;
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <div className="icon-ring" aria-hidden="true">
      <span>{children}</span>
    </div>
  );
}

function HeroSplitVisual() {
  const leftLines = ["-2.8R", "FOMO entry", "No stop plan"];
  const rightLines = ["+3.6R", "Rules followed", "Review complete"];

  return (
    <motion.div
      className="hero-visual"
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-glow" />
      <div className="split-header">
        <span>THE SAME MARKET. TWO DIFFERENT TRADERS.</span>
        <span className="live-dot">LIVE</span>
      </div>

      <div className="split-grid">
        <motion.div
          className="trader-panel trader-bad"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="panel-label">WITHOUT A SYSTEM</div>
          <div className="avatar-shell sad">
            <div className="avatar-face">
              <span>•</span>
              <span>•</span>
              <i>︶</i>
            </div>
          </div>
          <div className="trader-copy">
            <strong>Down bad.</strong>
            <span>Frustrated. Guessing. Chasing.</span>
          </div>
          <div className="mini-loss-chart">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="panel-stats">
            {leftLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="trader-panel trader-good"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        >
          <div className="panel-label">WITH VALT</div>
          <div className="avatar-shell happy">
            <div className="avatar-face">
              <span>•</span>
              <span>•</span>
              <i>⌣</i>
            </div>
          </div>
          <div className="trader-copy">
            <strong>Dialed in.</strong>
            <span>Clear rules. Calm execution.</span>
          </div>
          <div className="mini-profit-chart">
            <svg viewBox="0 0 180 58" role="img" aria-label="Upward profit curve">
              <motion.path
                d="M4 46 C26 42 34 44 51 34 S82 38 94 26 S120 23 132 16 S158 18 176 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.7, delay: 0.55, ease: "easeOut" }}
              />
            </svg>
          </div>
          <div className="panel-stats">
            {rightLines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProblemVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="problem-visual journal-visual">
        <div className="journal-head">
          <span>TRADE JOURNAL</span>
          <span className="question-cluster">?</span>
        </div>
        <div className="journal-row">
          <span>XAUUSD</span>
          <span>BUY</span>
          <b>-$320</b>
        </div>
        <div className="journal-row">
          <span>EURUSD</span>
          <span>SELL</span>
          <b>-$180</b>
        </div>
        <motion.div
          className="float-question q1"
          animate={{ y: [0, -9, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          ?
        </motion.div>
        <motion.div
          className="float-question q2"
          animate={{ y: [0, -7, 0], rotate: [2, -2, 2] }}
          transition={{ duration: 2.1, repeat: Infinity, delay: 0.4 }}
        >
          ?
        </motion.div>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="problem-visual news-visual">
        <div className="news-banner">⚠ HIGH IMPACT — 2 MIN</div>
        <div className="news-chart">
          <svg viewBox="0 0 280 100" role="img" aria-label="Sudden chart drop">
            <path d="M0 55 L46 48 L84 50 L124 43 L158 46 L190 42 L208 82 L232 90 L274 91" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>
        <motion.div
          className="surprise-badge"
          animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.1, repeat: Infinity }}
        >
          TOO LATE
        </motion.div>
      </div>
    );
  }

  return (
    <div className="problem-visual loop-visual">
      <div className="loop-avatar">😵</div>
      <div className="loop-path">
        <span>LOSS</span>
        <span>REVENGE</span>
        <span>LOSS</span>
      </div>
      <motion.div
        className="loop-arrow"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        ↻
      </motion.div>
    </div>
  );
}

function FeaturePreview({ visual }: { visual: Feature["visual"] }) {
  const common = "preview-shell";

  switch (visual) {
    case "overview":
      return (
        <div className={common}>
          <div className="preview-topline">
            <span>OVERVIEW</span>
            <span className="positive">+14.8%</span>
          </div>
          <div className="metric-grid">
            {[
              ["NET P&L", "+₹1,42,500"],
              ["WIN RATE", "68.4%"],
              ["PROFIT FACTOR", "2.84"],
              ["RULE SCORE", "91/100"],
            ].map(([label, value], i) => (
              <motion.div
                key={label}
                className="metric-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <span>{label}</span>
                <b className={i === 0 ? "positive" : ""}>{value}</b>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case "journal":
      return (
        <div className={common}>
          <div className="preview-topline">
            <span>LIVE TRADE FEED</span>
            <span className="sync-dot">● AUTO SYNC</span>
          </div>
          <div className="trade-list">
            {[
              ["XAUUSD", "BUY", "+₹8,400", "SMC / FVG"],
              ["EURUSD", "SELL", "-₹3,200", "Liquidity sweep"],
              ["GBPUSD", "BUY", "+₹11,255", "OB retest"],
            ].map((trade, i) => (
              <motion.div
                key={trade[0]}
                className="trade-row"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div>
                  <strong>{trade[0]}</strong>
                  <span>{trade[3]}</span>
                </div>
                <em className={trade[1] === "BUY" ? "positive" : "negative"}>{trade[1]}</em>
                <b className={trade[2].startsWith("+") ? "positive" : "negative"}>{trade[2]}</b>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case "ai":
      return (
        <div className={common}>
          <div className="preview-topline">
            <span>VAULT AI · LIVE DIAGNOSIS</span>
            <span className="ai-pulse">● SCANNING</span>
          </div>
          <div className="chat-stack">
            <div className="chat-bubble user-bubble">Why do I keep giving back profits?</div>
            <motion.div
              className="chat-bubble ai-bubble"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Your drawdown clusters after early stop-outs. The next 15 minutes show a repeat revenge-trade pattern.
            </motion.div>
            <motion.div
              className="ai-recommendation"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
            >
              <span>RULE</span>
              Lock trading for 15 minutes after a -₹2,000 stop-out.
            </motion.div>
          </div>
        </div>
      );

    case "news":
      return (
        <div className={common}>
          <div className="preview-topline">
            <span>MACRO CALENDAR</span>
            <span className="negative">HIGH IMPACT</span>
          </div>
          <div className="news-card">
            <div>
              <small>US · 14:00</small>
              <strong>CPI (YoY)</strong>
              <span>Forecast 3.2% · Actual pending</span>
            </div>
            <span className="impact-pill">HIGH</span>
          </div>
          <div className="news-card ai-news-card">
            <small>VAULT AI READ</small>
            <strong>Expect volatility in USD + Gold.</strong>
            <span>Wait for the sweep. Don't front-run the release.</span>
          </div>
        </div>
      );

    case "strategy":
      return (
        <div className={common}>
          <div className="preview-topline">
            <span>PLAYBOOK</span>
            <span className="positive">RULES ON</span>
          </div>
          <div className="strategy-list">
            {[
              ["SMC Silver Bullet", "Entry → confirmation → risk"],
              ["FVG Retest", "Wait for fill + reaction"],
              ["Session Sweep", "London / NY only"],
            ].map((item, i) => (
              <motion.div
                key={item[0]}
                className="strategy-row"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
              >
                <span className="check">✓</span>
                <div>
                  <strong>{item[0]}</strong>
                  <small>{item[1]}</small>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case "community":
      return (
        <div className={common}>
          <div className="preview-topline">
            <span>ACCOUNTABILITY CIRCLE</span>
            <span className="positive">4 ACTIVE</span>
          </div>
          <div className="community-feed">
            <div className="community-message">
              <b>You</b>
              <span>Stopped after 2 losses. Following the plan.</span>
            </div>
            <motion.div
              className="community-message reply"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
            >
              <b>Jay</b>
              <span>Good call. Protect the process, not the ego.</span>
            </motion.div>
            <div className="discipline-bar">
              <span>WEEKLY DISCIPLINE</span>
              <div>
                <span style={{ width: "91%" }} />
              </div>
              <b>91%</b>
            </div>
          </div>
        </div>
      );

    case "backtest":
      return (
        <div className={`${common} chart-preview`}>
          <div className="preview-topline">
            <span>BACKTEST · XAUUSD</span>
            <span className="positive">+28.4R</span>
          </div>
          <svg viewBox="0 0 420 200" role="img" aria-label="Backtest chart with entries and exits">
            <defs>
              <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(16,185,129,0.24)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0)" />
              </linearGradient>
            </defs>
            <path d="M10 155 L44 145 L74 151 L105 120 L138 132 L164 104 L194 115 L224 82 L252 95 L286 58 L318 74 L344 47 L378 57 L410 25 L410 182 L10 182 Z" fill="url(#chartFill)" />
            <motion.path
              d="M10 155 L44 145 L74 151 L105 120 L138 132 L164 104 L194 115 L224 82 L252 95 L286 58 L318 74 L344 47 L378 57 L410 25"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            />
            <circle cx="105" cy="120" r="5" fill="#10B981" />
            <circle cx="224" cy="82" r="5" fill="#10B981" />
            <circle cx="344" cy="47" r="5" fill="#10B981" />
          </svg>
          <div className="chart-legend">
            <span><i className="legend-entry" /> Entry</span>
            <span><i className="legend-exit" /> Exit</span>
            <span>312 samples</span>
          </div>
        </div>
      );
  }
}

export default function VoltLandingExplorer() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [testimonial, setTestimonial] = useState(0);

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.7]);

  const active = useMemo(
    () => features.find((feature) => feature.id === activeFeature) ?? features[0],
    [activeFeature]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonial((current) => (current + 1) % testimonials.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <ExplorerSplash />

      <div className="volt-root">
        <style jsx global>{`
          :root {
            --bg: #06090e;
            --panel: #0b111a;
            --panel-2: #0f172a;
            --border: rgba(148, 163, 184, 0.14);
            --text: #f8fafc;
            --muted: #94a3b8;
            --muted-2: #64748b;
            --green: #10b981;
            --green-2: #34d399;
            --gold: #fbbf24;
            --red: #ef4444;
          }

          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            margin: 0;
            background: var(--bg);
            color: var(--text);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          button,
          a {
            -webkit-tap-highlight-color: transparent;
          }

          .volt-root {
            width: 100%;
            min-height: 100vh;
            overflow-x: hidden;
            background:
              radial-gradient(circle at 12% 4%, rgba(16, 185, 129, 0.08), transparent 27%),
              radial-gradient(circle at 90% 12%, rgba(251, 191, 36, 0.045), transparent 22%),
              var(--bg);
            color: var(--text);
          }

          .container {
            width: min(1180px, calc(100% - 32px));
            margin: 0 auto;
          }

          .nav-shell {
            position: sticky;
            top: 0;
            z-index: 100;
            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
            background: rgba(6, 9, 14, 0.78);
            backdrop-filter: blur(18px);
          }

          .nav {
            min-height: 72px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
          }

          .brand {
            border: 0;
            background: none;
            color: #fff;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            font-size: 17px;
            font-weight: 900;
            letter-spacing: 0.045em;
            white-space: nowrap;
          }

          .brand-bolt {
            width: 30px;
            height: 30px;
            display: grid;
            place-items: center;
            border-radius: 10px;
            color: #02150f;
            background: linear-gradient(135deg, var(--green-2), var(--green));
            box-shadow: 0 0 32px rgba(16, 185, 129, 0.3);
            font-size: 16px;
          }

          .desktop-nav {
            display: flex;
            gap: 24px;
            align-items: center;
          }

          .desktop-nav button,
          .footer-link {
            border: 0;
            background: transparent;
            color: #a9b3c3;
            font-size: 13px;
            cursor: pointer;
            transition: color 0.2s ease;
          }

          .desktop-nav button:hover,
          .footer-link:hover {
            color: #fff;
          }

          .nav-actions {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .nav-login {
            border: 0;
            background: transparent;
            color: #fff;
            cursor: pointer;
            min-height: 48px;
            padding: 0 12px;
            font-weight: 700;
          }

          .primary-btn,
          .secondary-btn,
          .mobile-toggle {
            min-height: 48px;
            border-radius: 14px;
            border: 1px solid transparent;
            padding: 0 18px;
            cursor: pointer;
            font-weight: 800;
            transition: transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease;
          }

          .primary-btn {
            color: #02150f;
            background: linear-gradient(135deg, #34d399, #10b981);
            box-shadow: 0 10px 35px rgba(16, 185, 129, 0.2);
          }

          .primary-btn.gold {
            color: #1e1300;
            background: linear-gradient(135deg, #fcd34d, #fbbf24);
            box-shadow: 0 10px 35px rgba(251, 191, 36, 0.2);
          }

          .primary-btn:hover,
          .secondary-btn:hover,
          .nav-login:hover {
            transform: translateY(-2px);
          }

          .primary-btn:hover {
            box-shadow: 0 14px 38px rgba(16, 185, 129, 0.33);
          }

          .primary-btn.gold:hover {
            box-shadow: 0 14px 38px rgba(251, 191, 36, 0.33);
          }

          .pulse {
            animation: ctaPulse 2.4s ease-in-out infinite;
          }

          @keyframes ctaPulse {
            0%, 100% { box-shadow: 0 10px 35px rgba(16, 185, 129, 0.18); }
            50% { box-shadow: 0 16px 45px rgba(16, 185, 129, 0.34); }
          }

          .mobile-toggle {
            display: none;
            width: 48px;
            padding: 0;
            border-color: var(--border);
            color: #fff;
            background: rgba(15, 23, 42, 0.72);
          }

          .mobile-menu {
            position: absolute;
            inset: 72px 16px auto;
            overflow: hidden;
            border: 1px solid var(--border);
            border-radius: 18px;
            background: rgba(8, 13, 21, 0.98);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.45);
          }

          .mobile-menu button {
            width: 100%;
            min-height: 52px;
            padding: 0 18px;
            border: 0;
            border-bottom: 1px solid var(--border);
            background: transparent;
            color: #dbe5f2;
            text-align: left;
            font-weight: 700;
          }

          .hero {
            position: relative;
            padding: 66px 0 96px;
          }

          .hero-grid {
            display: grid;
            grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
            gap: 60px;
            align-items: center;
          }

          .eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 18px;
            color: var(--green-2);
            font-size: 11px;
            font-weight: 900;
            letter-spacing: 0.16em;
          }

          .eyebrow-dot {
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: var(--green);
            box-shadow: 0 0 14px rgba(16, 185, 129, 0.8);
          }

          .hero-title {
            max-width: 660px;
            margin: 0;
            font-size: clamp(42px, 6vw, 74px);
            line-height: 0.98;
            letter-spacing: -0.055em;
            font-weight: 950;
          }

          .hero-title span {
            display: block;
            background: linear-gradient(135deg, #fff 6%, #a7f3d0 55%, #10b981 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .hero-sub {
            max-width: 620px;
            margin: 22px 0 28px;
            color: #a7b3c5;
            font-size: clamp(16px, 2vw, 19px);
            line-height: 1.68;
          }

          .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
          }

          .secondary-btn {
            color: #dce7f5;
            background: rgba(15, 23, 42, 0.7);
            border-color: var(--border);
          }

          .trust-line {
            display: flex;
            flex-wrap: wrap;
            gap: 8px 16px;
            margin-top: 22px;
            color: var(--muted-2);
            font-size: 12px;
          }

          .trust-line span {
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .trust-line b {
            color: #cbd5e1;
          }

          .hero-visual {
            position: relative;
            border: 1px solid rgba(16, 185, 129, 0.18);
            border-radius: 28px;
            padding: 16px;
            background:
              linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(6, 9, 14, 0.98)),
              #0b111a;
            box-shadow: 0 35px 100px rgba(0, 0, 0, 0.48), 0 0 80px rgba(16, 185, 129, 0.06);
            overflow: hidden;
          }

          .hero-glow {
            position: absolute;
            width: 280px;
            height: 280px;
            border-radius: 999px;
            top: -120px;
            right: -40px;
            background: rgba(16, 185, 129, 0.12);
            filter: blur(55px);
            pointer-events: none;
          }

          .split-header,
          .preview-topline {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            color: #718096;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.12em;
          }

          .live-dot {
            color: var(--green-2);
            padding: 5px 8px;
            border: 1px solid rgba(16, 185, 129, 0.18);
            border-radius: 999px;
            background: rgba(16, 185, 129, 0.06);
          }

          .split-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 14px;
          }

          .trader-panel {
            position: relative;
            min-height: 355px;
            padding: 18px;
            overflow: hidden;
            border-radius: 20px;
            border: 1px solid var(--border);
          }

          .trader-bad {
            background:
              radial-gradient(circle at 70% 10%, rgba(239, 68, 68, 0.13), transparent 30%),
              linear-gradient(180deg, rgba(127, 29, 29, 0.13), rgba(15, 23, 42, 0.94));
          }

          .trader-good {
            background:
              radial-gradient(circle at 20% 10%, rgba(16, 185, 129, 0.14), transparent 34%),
              linear-gradient(180deg, rgba(6, 78, 59, 0.2), rgba(15, 23, 42, 0.94));
          }

          .panel-label {
            color: #8390a5;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.12em;
          }

          .avatar-shell {
            width: 86px;
            height: 86px;
            margin: 26px auto 20px;
            border-radius: 28px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(2, 6, 23, 0.56);
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          }

          .avatar-shell.sad { color: #fecaca; }
          .avatar-shell.happy { color: #a7f3d0; }

          .avatar-face {
            display: grid;
            grid-template-columns: repeat(2, 10px);
            grid-template-rows: 12px 18px;
            gap: 3px 14px;
            font-size: 13px;
            align-items: center;
          }

          .avatar-face i {
            grid-column: 1 / -1;
            justify-self: center;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
          }

          .trader-copy {
            display: flex;
            flex-direction: column;
            gap: 5px;
            text-align: center;
          }

          .trader-copy strong {
            font-size: 18px;
          }

          .trader-copy span {
            color: #8e9bb0;
            font-size: 12px;
          }

          .mini-loss-chart,
          .mini-profit-chart {
            height: 64px;
            margin: 18px 0;
            padding: 0 5px;
            border-radius: 12px;
            background: rgba(2, 6, 23, 0.38);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .mini-loss-chart {
            display: flex;
            align-items: end;
            gap: 7px;
          }

          .mini-loss-chart span {
            flex: 1;
            background: linear-gradient(180deg, #f87171, #7f1d1d);
            border-radius: 4px 4px 0 0;
          }

          .mini-loss-chart span:nth-child(1) { height: 35%; }
          .mini-loss-chart span:nth-child(2) { height: 48%; }
          .mini-loss-chart span:nth-child(3) { height: 63%; }
          .mini-loss-chart span:nth-child(4) { height: 78%; }
          .mini-loss-chart span:nth-child(5) { height: 92%; }

          .mini-profit-chart {
            display: flex;
            align-items: center;
            color: var(--green);
          }

          .mini-profit-chart svg {
            width: 100%;
            overflow: visible;
          }

          .panel-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }

          .panel-stats div {
            min-height: 50px;
            display: grid;
            place-items: center;
            text-align: center;
            padding: 6px;
            border-radius: 10px;
            background: rgba(15, 23, 42, 0.72);
            border: 1px solid rgba(255,255,255,0.06);
            color: #9aa8bb;
            font-size: 9px;
          }

          .section {
            padding: 92px 0;
            border-top: 1px solid rgba(148,163,184,0.08);
          }

          .section.soft {
            background: rgba(9, 13, 22, 0.56);
          }

          .section-heading {
            max-width: 740px;
            margin: 0 auto 48px;
            text-align: center;
          }

          .section-heading .eyebrow {
            justify-content: center;
          }

          .section-heading h2 {
            margin: 0;
            font-size: clamp(32px, 4vw, 52px);
            line-height: 1.03;
            letter-spacing: -0.04em;
          }

          .section-heading p {
            margin: 16px auto 0;
            color: var(--muted);
            max-width: 650px;
            line-height: 1.7;
          }

          .problem-grid,
          .features-grid,
          .pricing-grid,
          .proof-grid {
            display: grid;
            gap: 16px;
          }

          .problem-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .problem-card,
          .feature-card,
          .proof-card,
          .pricing-card,
          .step-card {
            position: relative;
            border: 1px solid var(--border);
            background:
              linear-gradient(180deg, rgba(15, 23, 42, 0.72), rgba(8, 13, 21, 0.96));
            border-radius: 22px;
            box-shadow: 0 20px 65px rgba(0, 0, 0, 0.22);
          }

          .problem-card {
            min-height: 390px;
            padding: 22px;
            overflow: hidden;
          }

          .problem-card::after {
            content: "";
            position: absolute;
            inset: auto 10% -25% 10%;
            height: 130px;
            border-radius: 999px;
            background: rgba(16, 185, 129, 0.08);
            filter: blur(35px);
            pointer-events: none;
          }

          .problem-number {
            display: inline-flex;
            padding: 6px 9px;
            border-radius: 999px;
            background: rgba(239,68,68,0.08);
            border: 1px solid rgba(239,68,68,0.17);
            color: #fca5a5;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.08em;
          }

          .problem-icon {
            width: 44px;
            height: 44px;
            display: grid;
            place-items: center;
            margin: 18px 0 14px;
            border-radius: 14px;
            color: #fca5a5;
            background: rgba(127,29,29,0.18);
            border: 1px solid rgba(239,68,68,0.14);
            font-size: 21px;
          }

          .problem-card h3 {
            margin: 0;
            font-size: 21px;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }

          .problem-card p {
            margin: 12px 0 0;
            color: #99a7ba;
            font-size: 14px;
            line-height: 1.65;
          }

          .problem-visual {
            position: relative;
            min-height: 142px;
            margin-top: 22px;
            overflow: hidden;
            border-radius: 16px;
            border: 1px solid rgba(148,163,184,0.1);
            background: #090f17;
          }

          .journal-visual {
            padding: 12px;
          }

          .journal-head,
          .journal-row {
            display: grid;
            grid-template-columns: 1.2fr 0.7fr 0.7fr;
            align-items: center;
            gap: 8px;
            font-size: 9px;
          }

          .journal-head {
            padding-bottom: 9px;
            color: #718096;
            border-bottom: 1px solid var(--border);
          }

          .journal-row {
            padding: 11px 0;
            color: #cbd5e1;
            border-bottom: 1px solid rgba(148,163,184,0.06);
          }

          .journal-row b {
            color: #f87171;
            text-align: right;
          }

          .question-cluster {
            justify-self: end;
            color: #fbbf24;
            font-size: 18px;
          }

          .float-question {
            position: absolute;
            color: #fbbf24;
            font-size: 34px;
            font-weight: 950;
            text-shadow: 0 0 30px rgba(251,191,36,0.25);
          }

          .q1 { right: 14px; top: 36px; }
          .q2 { right: 44px; bottom: 14px; font-size: 25px; }

          .news-visual {
            padding: 14px;
          }

          .news-banner {
            display: inline-flex;
            padding: 5px 8px;
            border-radius: 999px;
            color: #fecaca;
            background: rgba(239,68,68,0.08);
            border: 1px solid rgba(239,68,68,0.18);
            font-size: 8px;
            font-weight: 900;
          }

          .news-chart {
            color: #f87171;
            margin: 10px 0;
          }

          .news-chart svg {
            width: 100%;
            height: 72px;
          }

          .surprise-badge {
            position: absolute;
            right: 10px;
            bottom: 10px;
            padding: 7px 9px;
            border-radius: 8px;
            color: #fff;
            background: #7f1d1d;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.08em;
          }

          .loop-visual {
            display: grid;
            place-items: center;
          }

          .loop-avatar {
            font-size: 37px;
          }

          .loop-path {
            position: absolute;
            left: 18px;
            right: 18px;
            bottom: 12px;
            display: flex;
            justify-content: space-between;
            color: #94a3b8;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.08em;
          }

          .loop-arrow {
            position: absolute;
            top: 14px;
            right: 14px;
            color: #ef4444;
            font-size: 26px;
          }

          .features-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .feature-card {
            min-height: 245px;
            padding: 20px;
            cursor: pointer;
            overflow: hidden;
            transform-style: preserve-3d;
          }

          .feature-card.active {
            border-color: rgba(16, 185, 129, 0.45);
            background:
              radial-gradient(circle at 80% 15%, rgba(16,185,129,0.11), transparent 28%),
              linear-gradient(180deg, rgba(6,78,59,0.17), rgba(8,13,21,0.98));
          }

          .feature-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 14px;
          }

          .icon-ring {
            width: 46px;
            height: 46px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
            border-radius: 14px;
            color: var(--green-2);
            border: 1px solid rgba(16,185,129,0.25);
            background: rgba(16,185,129,0.06);
            box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
            position: relative;
          }

          .icon-ring::before {
            content: "";
            position: absolute;
            inset: -1px;
            border-radius: inherit;
            border: 1px solid transparent;
            border-top-color: rgba(16,185,129,0.72);
            animation: iconSpin 4.5s linear infinite;
          }

          @keyframes iconSpin {
            to { transform: rotate(360deg); }
          }

          .feature-eyebrow {
            margin-top: 16px;
            color: #6f7d91;
            font-size: 9px;
            letter-spacing: 0.13em;
            font-weight: 900;
          }

          .feature-card h3 {
            margin: 6px 0 8px;
            font-size: 20px;
            line-height: 1.1;
          }

          .feature-card p {
            margin: 0;
            color: #9aa8bb;
            font-size: 13px;
            line-height: 1.6;
          }

          .problem-link {
            display: inline-flex;
            margin-top: 18px;
            padding: 6px 8px;
            border-radius: 999px;
            color: #c7d2e0;
            background: rgba(148,163,184,0.05);
            border: 1px solid rgba(148,163,184,0.1);
            font-size: 9px;
            font-weight: 800;
          }

          .preview-wrap {
            margin-top: 28px;
            border: 1px solid var(--border);
            border-radius: 28px;
            padding: 16px;
            background:
              radial-gradient(circle at 16% 15%, rgba(16,185,129,0.08), transparent 25%),
              #070c13;
            box-shadow: 0 30px 90px rgba(0,0,0,0.32);
          }

          .preview-header {
            display: flex;
            gap: 12px;
            align-items: center;
            justify-content: space-between;
            padding: 2px 6px 16px;
          }

          .preview-header h3 {
            margin: 4px 0 0;
            font-size: 22px;
            letter-spacing: -0.02em;
          }

          .preview-header p {
            margin: 0;
            color: #77859a;
            font-size: 12px;
          }

          .preview-shell {
            min-height: 320px;
            padding: 18px;
            border-radius: 20px;
            background: rgba(15,23,42,0.58);
            border: 1px solid rgba(148,163,184,0.1);
          }

          .metric-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-top: 20px;
          }

          .metric-card,
          .trade-row,
          .news-card,
          .strategy-row,
          .community-message,
          .ai-recommendation {
            border: 1px solid rgba(148,163,184,0.1);
            background: rgba(2,6,23,0.4);
            border-radius: 12px;
          }

          .metric-card {
            min-height: 92px;
            padding: 14px;
          }

          .metric-card span,
          .news-card small,
          .ai-recommendation span,
          .discipline-bar > span {
            color: #6f7d91;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.1em;
          }

          .metric-card b {
            display: block;
            margin-top: 10px;
            font-size: 18px;
          }

          .positive { color: #34d399 !important; }
          .negative { color: #f87171 !important; }

          .trade-list,
          .strategy-list,
          .community-feed {
            display: grid;
            gap: 9px;
            margin-top: 20px;
          }

          .trade-row {
            display: grid;
            grid-template-columns: 1.5fr 0.45fr 0.75fr;
            align-items: center;
            gap: 10px;
            padding: 13px;
          }

          .trade-row div {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .trade-row span,
          .strategy-row small,
          .news-card span,
          .community-message span {
            color: #7f8ca0;
            font-size: 10px;
          }

          .trade-row em {
            font-style: normal;
            font-weight: 900;
            font-size: 9px;
          }

          .trade-row b {
            text-align: right;
            font-size: 12px;
          }

          .sync-dot,
          .ai-pulse {
            color: #34d399 !important;
          }

          .chat-stack {
            display: grid;
            gap: 11px;
            max-width: 760px;
            margin-top: 20px;
          }

          .chat-bubble {
            max-width: 88%;
            padding: 14px;
            border-radius: 13px;
            font-size: 12px;
            line-height: 1.55;
          }

          .user-bubble {
            justify-self: end;
            background: #1e293b;
            color: #e5edf7;
          }

          .ai-bubble {
            background: rgba(6,78,59,0.7);
            border: 1px solid rgba(16,185,129,0.18);
            color: #d1fae5;
          }

          .ai-recommendation {
            padding: 14px;
            color: #d1fae5;
            font-size: 12px;
            line-height: 1.55;
            box-shadow: 0 0 32px rgba(16,185,129,0.06);
          }

          .ai-recommendation span {
            display: block;
            color: #34d399;
            margin-bottom: 6px;
          }

          .news-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 14px;
            margin-top: 12px;
          }

          .news-card > div {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .news-card strong {
            font-size: 14px;
          }

          .impact-pill {
            padding: 6px 8px;
            border-radius: 999px;
            color: #fca5a5 !important;
            background: rgba(239,68,68,0.08);
            border: 1px solid rgba(239,68,68,0.18);
            font-size: 8px !important;
            font-weight: 900;
          }

          .ai-news-card {
            background: rgba(16,185,129,0.06);
            border-color: rgba(16,185,129,0.14);
          }

          .ai-news-card small {
            color: #34d399;
          }

          .strategy-row {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
          }

          .check {
            width: 28px;
            height: 28px;
            display: grid;
            place-items: center;
            border-radius: 9px;
            background: rgba(16,185,129,0.1);
            color: #34d399;
            font-size: 12px;
          }

          .strategy-row div {
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .community-message {
            padding: 13px;
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .community-message b {
            font-size: 10px;
            color: #fff;
          }

          .community-message.reply {
            background: rgba(30,41,59,0.55);
          }

          .discipline-bar {
            display: grid;
            grid-template-columns: auto 1fr auto;
            align-items: center;
            gap: 9px;
            padding: 12px;
            border-radius: 12px;
            background: rgba(16,185,129,0.04);
            border: 1px solid rgba(16,185,129,0.1);
          }

          .discipline-bar > div {
            height: 6px;
            overflow: hidden;
            border-radius: 999px;
            background: #111827;
          }

          .discipline-bar > div span {
            display: block;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, #059669, #34d399);
          }

          .discipline-bar b {
            color: #34d399;
            font-size: 10px;
          }

          .chart-preview svg {
            width: 100%;
            height: 245px;
            color: #34d399;
          }

          .chart-legend {
            display: flex;
            gap: 18px;
            align-items: center;
            color: #748297;
            font-size: 9px;
          }

          .chart-legend span {
            display: inline-flex;
            align-items: center;
            gap: 5px;
          }

          .chart-legend i {
            width: 7px;
            height: 7px;
            border-radius: 999px;
            display: inline-block;
          }

          .legend-entry { background: var(--green); }
          .legend-exit { background: #475569; }

          .how-it-works {
            position: relative;
            display: block;
          }

          .reel-intro-bar {
            position: absolute;
            top: 18px;
            left: 18px;
            right: 18px;
            z-index: 20;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            pointer-events: none;
          }

          .reel-intro-bar span {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            color: #738197;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.13em;
          }

          .reel-scroll-hint {
            animation: reelHint 1.9s ease-in-out infinite;
          }

          @keyframes reelHint {
            0%, 100% { transform: translateY(0); opacity: 0.65; }
            50% { transform: translateY(5px); opacity: 1; }
          }

          .reel-slide {
            position: sticky;
            top: 72px;
            min-height: calc(100svh - 72px);
            height: calc(100svh - 72px);
            display: grid;
            grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
            gap: clamp(28px, 6vw, 90px);
            align-items: center;
            padding: 72px 0 34px;
            overflow: hidden;
            border-top: 1px solid rgba(148,163,184,0.08);
            background: #06090e;
          }

          .reel-slide:first-of-type {
            border-top: 0;
          }

          .reel-slide::before {
            content: "";
            position: absolute;
            width: 420px;
            height: 420px;
            left: -170px;
            bottom: -220px;
            border-radius: 999px;
            background: rgba(16,185,129,0.1);
            filter: blur(65px);
            pointer-events: none;
          }

          .reel-slide.reel-amber::before {
            background: rgba(251,191,36,0.08);
          }

          .reel-slide.reel-blue::before {
            background: rgba(59,130,246,0.08);
          }

          .reel-copy {
            position: relative;
            z-index: 2;
            max-width: 490px;
            padding-left: clamp(20px, 5vw, 76px);
          }

          .reel-step-index {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 16px;
            color: #34d399;
            font-size: 10px;
            font-weight: 950;
            letter-spacing: 0.14em;
          }

          .reel-step-index i {
            width: 34px;
            height: 1px;
            background: linear-gradient(90deg, #10b981, transparent);
          }

          .reel-copy h3 {
            margin: 0;
            max-width: 520px;
            font-size: clamp(40px, 6vw, 76px);
            line-height: 0.98;
            letter-spacing: -0.055em;
            font-weight: 950;
          }

          .reel-copy p {
            margin: 20px 0 0;
            max-width: 510px;
            color: #94a3b8;
            font-size: clamp(15px, 1.5vw, 18px);
            line-height: 1.7;
          }

          .reel-result {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 22px;
            padding: 9px 11px;
            border-radius: 999px;
            color: #d8fbe9;
            background: rgba(16,185,129,0.06);
            border: 1px solid rgba(16,185,129,0.15);
            font-size: 10px;
            font-weight: 850;
          }

          .reel-progress {
            display: flex;
            gap: 7px;
            margin-top: 28px;
          }

          .reel-progress i {
            width: 24px;
            height: 4px;
            border-radius: 999px;
            background: #243041;
          }

          .reel-progress i.active {
            width: 52px;
            background: #10b981;
            box-shadow: 0 0 18px rgba(16,185,129,0.25);
          }

          .reel-visual {
            position: relative;
            z-index: 2;
            width: min(680px, 100%);
            min-height: 68vh;
            margin-right: clamp(14px, 4vw, 60px);
            border-radius: 28px;
            overflow: hidden;
            border: 1px solid rgba(148,163,184,0.12);
            background:
              linear-gradient(180deg, rgba(15,23,42,0.72), rgba(4,8,13,0.98)),
              #080d14;
            box-shadow: 0 40px 120px rgba(0,0,0,0.5), 0 0 80px rgba(16,185,129,0.07);
          }

          .reel-window-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            min-height: 46px;
            padding: 0 16px;
            border-bottom: 1px solid rgba(148,163,184,0.09);
            color: #748297;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 0.1em;
          }

          .reel-window-bar b {
            color: #34d399;
          }

          .reel-dashboard {
            height: calc(100% - 46px);
            padding: clamp(22px, 4vw, 42px);
          }

          .reel-dashboard-top {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: flex-end;
          }

          .reel-dashboard-top strong {
            display: block;
            margin-top: 6px;
            font-size: clamp(30px, 4vw, 48px);
            letter-spacing: -0.05em;
          }

          .reel-dashboard-top span {
            color: #708096;
            font-size: 10px;
          }

          .reel-metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-top: 22px;
          }

          .reel-metric {
            min-height: 108px;
            padding: 14px;
            border: 1px solid rgba(148,163,184,0.09);
            border-radius: 16px;
            background: rgba(15,23,42,0.52);
          }

          .reel-metric span {
            color: #65738a;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 0.11em;
          }

          .reel-metric b {
            display: block;
            margin-top: 10px;
            font-size: 24px;
          }

          .reel-table {
            display: grid;
            gap: 9px;
            margin-top: 16px;
          }

          .reel-trade {
            display: grid;
            grid-template-columns: 1.25fr 0.55fr 0.75fr;
            gap: 10px;
            align-items: center;
            padding: 14px;
            border-radius: 14px;
            background: rgba(15,23,42,0.52);
            border: 1px solid rgba(148,163,184,0.08);
            font-size: 11px;
          }

          .reel-trade div {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .reel-trade small {
            color: #68768a;
            font-size: 8px;
          }

          .reel-trade strong:last-child {
            text-align: right;
          }

          .scan-ui {
            height: 100%;
            display: grid;
            grid-template-rows: auto 1fr auto;
            gap: 14px;
            padding: clamp(22px, 4vw, 42px);
          }

          .scan-orb {
            width: 110px;
            height: 110px;
            margin: 24px auto 10px;
            display: grid;
            place-items: center;
            border-radius: 999px;
            color: #a7f3d0;
            border: 1px solid rgba(16,185,129,0.22);
            background: radial-gradient(circle, rgba(16,185,129,0.13), rgba(16,185,129,0.02));
            box-shadow: 0 0 70px rgba(16,185,129,0.1);
            font-size: 34px;
          }

          .scan-radar {
            width: 100%;
            height: 9px;
            overflow: hidden;
            border-radius: 999px;
            background: #101927;
            border: 1px solid rgba(16,185,129,0.08);
          }

          .scan-radar span {
            display: block;
            width: 31%;
            height: 100%;
            border-radius: inherit;
            background: linear-gradient(90deg, transparent, #34d399, transparent);
            animation: scanRadar 2s linear infinite;
          }

          @keyframes scanRadar {
            from { transform: translateX(-120%); }
            to { transform: translateX(430%); }
          }

          .scan-findings {
            display: grid;
            gap: 8px;
          }

          .scan-finding {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 13px;
            border-radius: 13px;
            border: 1px solid rgba(148,163,184,0.08);
            background: rgba(15,23,42,0.5);
            color: #cbd5e1;
            font-size: 10px;
          }

          .scan-finding b { color: #f87171; }

          .insight-ui {
            height: 100%;
            display: grid;
            grid-template-columns: 0.75fr 1.25fr;
            gap: 14px;
            padding: clamp(18px, 3vw, 34px);
          }

          .insight-rule-panel,
          .insight-chat-panel {
            padding: 16px;
            border-radius: 17px;
            border: 1px solid rgba(148,163,184,0.09);
            background: rgba(15,23,42,0.5);
          }

          .insight-rule-panel h4,
          .insight-chat-panel h4 {
            margin: 0;
            color: #76859a;
            font-size: 8px;
            letter-spacing: 0.11em;
          }

          .insight-rule {
            margin-top: 22px;
            padding: 13px;
            border-radius: 13px;
            background: rgba(16,185,129,0.06);
            border: 1px solid rgba(16,185,129,0.15);
          }

          .insight-rule strong {
            display: block;
            color: #f8fafc;
            font-size: 14px;
            line-height: 1.3;
          }

          .insight-rule span {
            display: block;
            margin-top: 7px;
            color: #7890a8;
            font-size: 9px;
            line-height: 1.55;
          }

          .insight-chat {
            display: grid;
            gap: 10px;
            margin-top: 17px;
          }

          .insight-msg {
            max-width: 86%;
            padding: 12px;
            border-radius: 13px;
            color: #cfdae8;
            background: #1e293b;
            font-size: 10px;
            line-height: 1.55;
          }

          .insight-msg.ai {
            justify-self: end;
            color: #d1fae5;
            background: rgba(6,78,59,0.62);
            border: 1px solid rgba(16,185,129,0.14);
          }

          .profit-ui {
            height: 100%;
            display: grid;
            grid-template-rows: auto 1fr auto;
            gap: 12px;
            padding: clamp(18px, 4vw, 40px);
          }

          .profit-main {
            display: grid;
            place-items: center;
            min-height: 300px;
            border-radius: 19px;
            border: 1px solid rgba(148,163,184,0.08);
            background: rgba(2,6,23,0.35);
          }

          .profit-main svg {
            width: 92%;
            height: 76%;
            color: #34d399;
          }

          .profit-bottom {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 9px;
          }

          .profit-stat {
            padding: 13px;
            border-radius: 13px;
            border: 1px solid rgba(148,163,184,0.08);
            background: rgba(15,23,42,0.5);
          }

          .profit-stat span {
            color: #68778c;
            font-size: 8px;
          }

          .profit-stat b {
            display: block;
            margin-top: 5px;
            font-size: 17px;
          }

          .proof-layout {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 18px;
            align-items: stretch;
          }

          .testimonial-card {
            padding: 26px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 320px;
          }

          .quote-mark {
            color: var(--green);
            font-size: 48px;
            font-weight: 900;
            line-height: 0.7;
          }

          .testimonial-quote {
            margin: 22px 0 28px;
            font-size: clamp(21px, 3vw, 31px);
            font-weight: 800;
            line-height: 1.2;
            letter-spacing: -0.03em;
          }

          .testimonial-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .testimonial-meta div {
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .testimonial-meta span {
            color: #7f8ca0;
            font-size: 10px;
          }

          .dots {
            display: flex;
            gap: 6px;
          }

          .dots button {
            width: 10px;
            height: 10px;
            padding: 0;
            border: 0;
            border-radius: 999px;
            background: #334155;
            cursor: pointer;
          }

          .dots button.active {
            width: 24px;
            background: var(--green);
          }

          .proof-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .proof-card {
            padding: 20px;
            min-height: 145px;
          }

          .proof-card strong {
            display: block;
            margin-top: 18px;
            font-size: 28px;
            letter-spacing: -0.04em;
          }

          .proof-card span {
            display: block;
            margin-top: 4px;
            color: #7f8ca0;
            font-size: 10px;
            line-height: 1.5;
          }

          .proof-footnotes {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin-top: 10px;
          }

          .badge {
            min-height: 50px;
            display: grid;
            place-items: center;
            padding: 10px;
            text-align: center;
            border-radius: 12px;
            border: 1px solid var(--border);
            background: rgba(15,23,42,0.42);
            color: #9eabbd;
            font-size: 9px;
            font-weight: 800;
          }

          .pricing-wrap {
            border: 1px solid rgba(251,191,36,0.18);
            border-radius: 28px;
            padding: clamp(14px, 2vw, 22px);
            background:
              radial-gradient(circle at 90% 0%, rgba(251,191,36,0.07), transparent 28%),
              linear-gradient(180deg, rgba(20,24,32,0.7), rgba(6,9,14,0.98));
            box-shadow: 0 35px 90px rgba(0,0,0,0.25);
          }

          .pricing-banner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 17px 19px;
            margin-bottom: 14px;
            border-radius: 18px;
            background: linear-gradient(90deg, rgba(251,191,36,0.08), rgba(251,191,36,0.025));
            border: 1px solid rgba(251,191,36,0.17);
          }

          .pricing-banner strong {
            color: #fde68a;
            font-size: clamp(15px, 2vw, 19px);
          }

          .pricing-banner span {
            display: block;
            margin-top: 5px;
            color: #8f9bad;
            font-size: 10px;
          }

          .pricing-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
          }

          .pricing-card {
            padding: clamp(22px, 3vw, 30px);
            min-height: 430px;
            display: flex;
            flex-direction: column;
            border-radius: 22px;
          }

          .pricing-card.recommended {
            border-color: rgba(251,191,36,0.48);
            box-shadow: 0 25px 90px rgba(251,191,36,0.12);
            background:
              radial-gradient(circle at 80% 0%, rgba(251,191,36,0.1), transparent 34%),
              linear-gradient(180deg, rgba(36,30,13,0.72), rgba(12,14,18,0.98));
          }

          .pricing-card.annual {
            border-color: rgba(16,185,129,0.35);
            background:
              radial-gradient(circle at 20% 0%, rgba(16,185,129,0.08), transparent 35%),
              linear-gradient(180deg, rgba(6,78,59,0.16), rgba(8,13,21,0.98));
          }

          .plan-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }

          .plan-name {
            font-size: 12px;
            font-weight: 950;
            letter-spacing: 0.1em;
          }

          .recommended-pill {
            padding: 6px 8px;
            border-radius: 999px;
            color: #1e1300;
            background: var(--gold);
            font-size: 8px;
            font-weight: 950;
            letter-spacing: 0.06em;
          }

          .plan-period {
            display: inline-flex;
            margin-top: 7px;
            color: #6f7d91;
            font-size: 10px;
            font-weight: 800;
          }

          .price {
            margin-top: 21px;
            font-size: clamp(40px, 5vw, 56px);
            font-weight: 950;
            letter-spacing: -0.06em;
          }

          .price small {
            color: #7f8ca0;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0;
          }

          .strike {
            display: inline-block;
            margin-left: 8px;
            color: #64748b;
            font-size: 12px;
            font-weight: 700;
            text-decoration: line-through;
            letter-spacing: 0;
          }

          .discount {
            display: inline-flex;
            align-self: flex-start;
            margin-top: 8px;
            padding: 6px 8px;
            border-radius: 999px;
            color: #fcd34d;
            background: rgba(251,191,36,0.06);
            border: 1px solid rgba(251,191,36,0.12);
            font-size: 9px;
            font-weight: 950;
            letter-spacing: 0.04em;
          }

          .plan-copy {
            margin: 16px 0 20px;
            max-width: 440px;
            color: #8f9bad;
            font-size: 13px;
            line-height: 1.7;
          }

          .plan-features {
            display: grid;
            gap: 11px;
            margin: 0;
            padding: 0;
            list-style: none;
            color: #dbe5ef;
            font-size: 12px;
          }

          .plan-features li {
            display: flex;
            gap: 8px;
            align-items: flex-start;
          }

          .plan-features b {
            color: var(--green);
          }

          .plan-button {
            width: 100%;
            margin-top: auto;
          }

          .fine-print {
            margin-top: 12px;
            color: #59667a;
            font-size: 9px;
            line-height: 1.55;
          }

          .final-cta {
            position: relative;
            overflow: hidden;
            padding: 78px 0;
            border-top: 1px solid rgba(16,185,129,0.08);
            border-bottom: 1px solid rgba(16,185,129,0.08);
            background:
              radial-gradient(circle at 50% 120%, rgba(16,185,129,0.18), transparent 48%),
              #05080c;
          }

          .final-cta-inner {
            max-width: 820px;
            margin: 0 auto;
            text-align: center;
          }

          .final-cta h2 {
            margin: 0;
            font-size: clamp(37px, 5vw, 64px);
            line-height: 0.98;
            letter-spacing: -0.045em;
          }

          .final-cta p {
            margin: 16px auto 26px;
            max-width: 620px;
            color: #99a7ba;
            line-height: 1.65;
          }

          .footer {
            padding: 48px 0 30px;
            background: #03060a;
          }

          .footer-grid {
            display: grid;
            grid-template-columns: 1.6fr repeat(3, 1fr);
            gap: 28px;
          }

          .footer h4 {
            margin: 0 0 14px;
            color: #fff;
            font-size: 12px;
          }

          .footer p,
          .footer li {
            color: #66748a;
            font-size: 10px;
            line-height: 1.7;
          }

          .footer ul {
            margin: 0;
            padding: 0;
            display: grid;
            gap: 7px;
            list-style: none;
          }

          .footer-bottom {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            padding-top: 24px;
            margin-top: 30px;
            border-top: 1px solid rgba(148,163,184,0.08);
            color: #4b5a70;
            font-size: 9px;
          }

          .disclaimer {
            max-width: 780px;
            line-height: 1.65;
          }

          @media (max-width: 1080px) {
            .desktop-nav { display: none; }
            .mobile-toggle { display: grid; place-items: center; }
            .hero-grid { grid-template-columns: 1fr; gap: 42px; }
            .hero-copy { max-width: 760px; margin: 0 auto; text-align: center; }
            .hero-actions, .trust-line { justify-content: center; }
            .hero-visual { max-width: 900px; width: 100%; margin: 0 auto; }
            .features-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .proof-layout { grid-template-columns: 1fr; }
            .pricing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .pricing-card.recommended { order: -1; }
            .footer-grid { grid-template-columns: 1.4fr 1fr 1fr; }
          }

          @media (max-width: 720px) {
            .reel-intro-bar { top: 12px; left: 14px; right: 14px; }
            .reel-slide {
              position: relative;
              top: auto;
              height: auto;
              min-height: 100svh;
              grid-template-columns: 1fr;
              gap: 26px;
              padding: 70px 0 34px;
            }
            .reel-copy { padding: 0 14px; max-width: none; }
            .reel-copy h3 { font-size: clamp(42px, 12vw, 64px); }
            .reel-copy p { max-width: none; }
            .reel-visual {
              min-height: 62svh;
              margin: 0 14px;
              width: auto;
              border-radius: 22px;
            }
            .insight-ui { grid-template-columns: 1fr; }
            .insight-rule-panel { display: none; }
            .profit-bottom { grid-template-columns: 1fr; }
            .reel-trade { grid-template-columns: 1fr auto; }
            .reel-trade strong:last-child { grid-column: 1 / -1; text-align: left; }
            .container { width: min(100% - 22px, 640px); }
            .nav { min-height: 66px; }
            .nav-actions .nav-login { display: none; }
            .hero { padding: 42px 0 62px; }
            .hero-grid { display: block; }
            .hero-copy { text-align: left; }
            .hero-actions, .trust-line { justify-content: flex-start; }
            .hero-title { font-size: clamp(42px, 12vw, 60px); }
            .hero-visual { display: none; }

            .section { padding: 68px 0; }
            .problem-grid,
            .features-grid,
            .how-it-works,
            .pricing-grid,
            .proof-grid,
            .proof-footnotes {
              grid-template-columns: 1fr;
            }

            .problem-card { min-height: auto; }
            .feature-card { min-height: 215px; }
            .preview-wrap { padding: 10px; }
            .preview-shell { min-height: 280px; padding: 14px; }
            .metric-grid { grid-template-columns: repeat(2, 1fr); }
            .chart-preview svg { height: 190px; }

            .pricing-card.recommended {
              order: initial;
              transform: none;
            }

            .pricing-banner {
              align-items: flex-start;
              flex-direction: column;
            }

            .footer-grid { grid-template-columns: 1fr 1fr; }
            .footer-grid > :first-child { grid-column: 1 / -1; }
            .footer-bottom { flex-direction: column; }
          }

          @media (max-width: 420px) {
            .reel-intro-bar span:last-child { display: none; }
            .reel-window-bar { min-height: 42px; padding: 0 12px; }
            .reel-dashboard { padding: 20px 14px; }
            .reel-metrics { gap: 7px; }
            .reel-metric { min-height: 88px; padding: 11px; }
            .reel-metric b { font-size: 18px; }
            .scan-ui, .insight-ui, .profit-ui { padding: 18px 13px; }
            .scan-orb { width: 84px; height: 84px; font-size: 26px; }
            .split-grid { grid-template-columns: 1fr; }
            .trader-panel { min-height: 300px; }
            .hero-title { font-size: 42px; }
            .hero-actions { flex-direction: column; align-items: stretch; }
            .hero-actions button { width: 100%; }
            .trade-row { grid-template-columns: 1.3fr 0.5fr; }
            .trade-row b { grid-column: 1 / -1; text-align: left; }
            .footer-grid { grid-template-columns: 1fr; }
            .footer-grid > :first-child { grid-column: auto; }
          }

          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            *,
            *::before,
            *::after {
              animation-duration: 0.001ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.001ms !important;
            }
          }
        `}</style>

        <header className="nav-shell">
          <div className="container">
            <nav className="nav">
              <button className="brand" onClick={() => router.push("/")} aria-label="VOLT TERMINAL home">
                <span className="brand-bolt">ϟ</span>
                VOLT TERMINAL
              </button>

              <div className="desktop-nav">
                <button onClick={() => scrollTo("features")}>Product</button>
                <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
                <button onClick={() => scrollTo("proof")}>Results</button>
                <button onClick={() => scrollTo("pricing")}>Pricing</button>
              </div>

              <div className="nav-actions">
                <button className="nav-login" onClick={() => router.push("/login")}>
                  Log In
                </button>
                <motion.button
                  className="primary-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/pricing")}
                >
                  Start Free
                </motion.button>
                <button
                  className="mobile-toggle"
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen((open) => !open)}
                >
                  {mobileOpen ? "✕" : "☰"}
                </button>
              </div>
            </nav>

            <AnimatePresence>
              {mobileOpen && (
                <motion.div
                  className="mobile-menu"
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <button onClick={() => scrollTo("features")}>Product</button>
                  <button onClick={() => scrollTo("how-it-works")}>How It Works</button>
                  <button onClick={() => scrollTo("proof")}>Results</button>
                  <button onClick={() => scrollTo("pricing")}>Pricing</button>
                  <button onClick={() => router.push("/login")}>Log In</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main>
          <section className="hero">
            <div className="container">
              <motion.div className="hero-grid" style={{ y: heroY, opacity: heroOpacity }}>
                <div className="hero-copy">
                  <div className="eyebrow">
                    <span className="eyebrow-dot" />
                    BUILT FOR TRADERS WHO ARE DONE GUESSING
                  </div>
                  <h1 className="hero-title">
                    Your Trading Journal Isn&apos;t Solving Your Biggest Problem
                    <span>VALT finds the leak.</span>
                  </h1>
                  <p className="hero-sub">
                    Most traders journal, but never analyze. VALT changes that.
                    Log the trade, understand the behavior, catch the macro risk,
                    and build rules you can actually follow.
                  </p>

                  <div className="hero-actions">
                    <motion.button
                      className="primary-btn pulse"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => scrollTo("how-it-works")}
                    >
                      Watch How It Works ↓
                    </motion.button>
                    <motion.button
                      className="secondary-btn"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/login")}
                    >
                      Open Dashboard
                    </motion.button>
                  </div>

                  <div className="trust-line">
                    <span>✓ <b>2-minute</b> trade logging</span>
                    <span>✓ AI behavioral diagnosis</span>
                    <span>✓ Macro alerts + playbooks</span>
                  </div>
                </div>

                <HeroSplitVisual />
              </motion.div>
            </div>
          </section>

          <section className="section soft" id="problems">
            <div className="container">
              <div className="section-heading">
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  THE REAL PROBLEM
                </div>
                <h2>More trades won&apos;t fix a process you never diagnose.</h2>
                <p>
                  The market isn&apos;t the only variable. Your behavior, the news,
                  and the absence of accountability all shape the result.
                </p>
              </div>

              <div className="problem-grid">
                {painPoints.map((point, index) => (
                  <Reveal key={point.number} delay={index * 0.08}>
                    <motion.article
                      className="problem-card"
                      whileHover={{ y: -6, rotateX: 1.5, rotateY: index === 1 ? 0 : index === 0 ? -1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="problem-number">PROBLEM #{point.number}</span>
                      <div className="problem-icon">{point.icon}</div>
                      <h3>{point.title}</h3>
                      <p>{point.description}</p>
                      <ProblemVisual index={index} />
                    </motion.article>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section className="section" id="features">
            <div className="container">
              <div className="section-heading">
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  ONE TERMINAL. ONE FEEDBACK LOOP.
                </div>
                <h2>Everything your trading process is missing.</h2>
                <p>
                  Pick a module. See exactly what it changes. Then stack the system
                  until your journal becomes a trading advantage.
                </p>
              </div>

              <div className="features-grid">
                {features.map((feature, index) => (
                  <Reveal key={feature.id} delay={index * 0.045}>
                    <motion.button
                      className={`feature-card ${active.id === feature.id ? "active" : ""}`}
                      onClick={() => setActiveFeature(feature.id)}
                      whileHover={{ scale: 1.025, rotateX: 1.5, rotateY: index % 2 === 0 ? -1.2 : 1.2 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.18 }}
                      aria-pressed={active.id === feature.id}
                    >
                      <div className="feature-top">
                        <Icon>{feature.icon}</Icon>
                        <span className="problem-link">{feature.problem}</span>
                      </div>
                      <div className="feature-eyebrow">{feature.eyebrow}</div>
                      <h3>{feature.name}</h3>
                      <p>{feature.benefit}</p>
                    </motion.button>
                  </Reveal>
                ))}
              </div>

              <div className="preview-wrap">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, x: 18, filter: "blur(4px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, x: -18, filter: "blur(4px)" }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="preview-header">
                      <div>
                        <div className="eyebrow" style={{ marginBottom: 6 }}>{active.eyebrow}</div>
                        <h3>{active.name}</h3>
                        <p>{active.benefit}</p>
                      </div>
                      <span className="problem-link">{active.problem}</span>
                    </div>
                    <FeaturePreview visual={active.visual} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

          <section className="section soft" id="how-it-works" style={{ padding: 0 }}>
            <div className="how-it-works">
              <div className="reel-intro-bar">
                <span><span className="eyebrow-dot" /> HOW IT WORKS · SCROLL TO WATCH</span>
                <span className="reel-scroll-hint">↓ SCROLL TO NEXT</span>
              </div>

              <article className="reel-slide" style={{ zIndex: 1 }}>
                <div className="reel-copy">
                  <div className="reel-step-index"><i /> STEP 01 / 04</div>
                  <h3>Journal Your Trades.</h3>
                  <p>
                    Log the setup, your mindset, the result, and the mistake while the context is still fresh. No bloated forms. Just the data your future self needs.
                  </p>
                  <span className="reel-result">⏱ 2 minutes per trade</span>
                  <div className="reel-progress"><i className="active" /><i /><i /><i /></div>
                </div>

                <motion.div
                  className="reel-visual"
                  initial={{ opacity: 0, x: 50, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="reel-window-bar">
                    <span>VALT JOURNAL</span>
                    <b>● AUTO SYNC READY</b>
                  </div>
                  <div className="reel-dashboard">
                    <div className="reel-dashboard-top">
                      <div>
                        <span>TODAY&apos;S SESSION</span>
                        <strong>7 Trades</strong>
                      </div>
                      <span className="positive">+3.8R</span>
                    </div>
                    <div className="reel-metrics">
                      {[
                        ["SETUP", "SMC / FVG"],
                        ["MINDSET", "CALM"],
                        ["RULE SCORE", "92/100"],
                        ["RISK", "0.5R"],
                      ].map(([label, value], i) => (
                        <motion.div
                          className="reel-metric"
                          key={label}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1, duration: 0.45 }}
                        >
                          <span>{label}</span>
                          <b className={label === "RULE SCORE" ? "positive" : ""}>{value}</b>
                        </motion.div>
                      ))}
                    </div>
                    <div className="reel-table">
                      {[
                        ["XAUUSD", "BUY", "+₹8,400", "FVG Retest"],
                        ["EURUSD", "SELL", "-₹3,200", "Liquidity Sweep"],
                        ["GBPUSD", "BUY", "+₹11,255", "OB Retest"],
                      ].map((trade, i) => (
                        <motion.div
                          className="reel-trade"
                          key={trade[0]}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.35 + i * 0.1, duration: 0.4 }}
                        >
                          <div><strong>{trade[0]}</strong><small>{trade[3]}</small></div>
                          <strong className={trade[1] === "BUY" ? "positive" : "negative"}>{trade[1]}</strong>
                          <strong className={trade[2].startsWith("+") ? "positive" : "negative"}>{trade[2]}</strong>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </article>

              <article className="reel-slide reel-amber" style={{ zIndex: 2 }}>
                <div className="reel-copy">
                  <div className="reel-step-index"><i /> STEP 02 / 04</div>
                  <h3>VAULT AI Analyzes.</h3>
                  <p>
                    Your journal becomes a behavior dataset. VAULT scans timing, tags, drawdowns, repeated setups, and emotional triggers to find the pattern you keep missing.
                  </p>
                  <span className="reel-result">⚡ Analysis: Instant</span>
                  <div className="reel-progress"><i /><i className="active" /><i /><i /></div>
                </div>

                <motion.div
                  className="reel-visual"
                  initial={{ opacity: 0, x: 50, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="reel-window-bar">
                    <span>VAULT AI · PATTERN ENGINE</span>
                    <b>● SCANNING</b>
                  </div>
                  <div className="scan-ui">
                    <div>
                      <span style={{ color: "#718096", fontSize: 9, fontWeight: 900, letterSpacing: "0.11em" }}>BEHAVIORAL SCAN</span>
                      <motion.div
                        className="scan-orb"
                        animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 45px rgba(16,185,129,0.08)", "0 0 80px rgba(16,185,129,0.18)", "0 0 45px rgba(16,185,129,0.08)"] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        ✦
                      </motion.div>
                      <div className="scan-radar"><span /></div>
                    </div>
                    <div className="scan-findings">
                      {[
                        ["Revenge trade cluster", "HIGH"],
                        ["Early-entry pattern", "HIGH"],
                        ["Best setup: FVG retest", "FOUND"],
                      ].map((finding, i) => (
                        <motion.div
                          className="scan-finding"
                          key={finding[0]}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.25 + i * 0.12, duration: 0.4 }}
                        >
                          <span>{finding[0]}</span>
                          <b className={finding[1] === "FOUND" ? "positive" : ""}>{finding[1]}</b>
                        </motion.div>
                      ))}
                    </div>
                    <div style={{ color: "#758399", fontSize: 10, lineHeight: 1.6 }}>
                      1,284 journal events scanned · 23 recurring patterns checked
                    </div>
                  </div>
                </motion.div>
              </article>

              <article className="reel-slide reel-blue" style={{ zIndex: 3 }}>
                <div className="reel-copy">
                  <div className="reel-step-index"><i /> STEP 03 / 04</div>
                  <h3>Get Personalized Insights.</h3>
                  <p>
                    No generic “trade better” advice. VAULT turns the pattern into one clear rule you can test on your next session.
                  </p>
                  <span className="reel-result">🎯 Fix your psychology. Improve next week.</span>
                  <div className="reel-progress"><i /><i /><i className="active" /><i /></div>
                </div>

                <motion.div
                  className="reel-visual"
                  initial={{ opacity: 0, x: 50, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="reel-window-bar">
                    <span>VAULT AI · YOUR WEEKLY REVIEW</span>
                    <b>● READY</b>
                  </div>
                  <div className="insight-ui">
                    <div className="insight-rule-panel">
                      <h4>RULE BUILDER</h4>
                      <motion.div
                        className="insight-rule"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.45, duration: 0.45 }}
                      >
                        <strong>15-MIN COOLDOWN</strong>
                        <span>After any stop-out over 1R. Protect the next decision from the previous loss.</span>
                      </motion.div>
                      <div style={{ marginTop: 14, color: "#64748b", fontSize: 9, lineHeight: 1.65 }}>
                        Trigger: Stop-out &gt; 1R<br />
                        Action: Trading lock<br />
                        Review: End of session
                      </div>
                    </div>
                    <div className="insight-chat-panel">
                      <h4>AI DIAGNOSIS</h4>
                      <div className="insight-chat">
                        <div className="insight-msg">Why do I give back profits after a stop?</div>
                        <motion.div
                          className="insight-msg ai"
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2, duration: 0.45 }}
                        >
                          Your next 3 trades after a loss have 2.4× higher risk and worse rule adherence.
                        </motion.div>
                        <motion.div
                          className="insight-msg ai"
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5, duration: 0.45 }}
                        >
                          Your highest-quality sessions come after a reset. Turn that reset into a hard rule.
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </article>

              <article className="reel-slide" style={{ zIndex: 4 }}>
                <div className="reel-copy">
                  <div className="reel-step-index"><i /> STEP 04 / 04</div>
                  <h3>Track Improvement.</h3>
                  <p>
                    See whether the rule actually changed your execution. Track discipline, drawdown, setup quality, and your profit curve over time.
                  </p>
                  <span className="reel-result">📈 Consistent profits from consistent rules.</span>
                  <div className="reel-progress"><i /><i /><i /><i className="active" /></div>
                </div>

                <motion.div
                  className="reel-visual"
                  initial={{ opacity: 0, x: 50, scale: 0.97 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="reel-window-bar">
                    <span>VALT PERFORMANCE · 30 DAY REVIEW</span>
                    <b>● IMPROVING</b>
                  </div>
                  <div className="profit-ui">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <div>
                        <span style={{ color: "#6f7d91", fontSize: 9, fontWeight: 900, letterSpacing: "0.11em" }}>NET PERFORMANCE</span>
                        <strong style={{ display: "block", marginTop: 5, fontSize: 30, letterSpacing: "-0.05em" }}>+18.6R</strong>
                      </div>
                      <span className="positive" style={{ fontSize: 11, fontWeight: 900 }}>RULE SCORE 94%</span>
                    </div>
                    <div className="profit-main">
                      <svg viewBox="0 0 540 260" role="img" aria-label="Profit curve rising with fewer drawdown dips">
                        <defs>
                          <linearGradient id="reelProfitFill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(16,185,129,0.22)" />
                            <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                          </linearGradient>
                        </defs>
                        <path d="M10 214 C52 210 71 193 104 198 S161 167 192 175 S247 130 281 147 S327 105 352 113 S396 86 424 95 S475 61 530 30 L530 245 L10 245 Z" fill="url(#reelProfitFill)" />
                        <motion.path
                          d="M10 214 C52 210 71 193 104 198 S161 167 192 175 S247 130 281 147 S327 105 352 113 S396 86 424 95 S475 61 530 30"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.25 }}
                        />
                      </svg>
                    </div>
                    <div className="profit-bottom">
                      <div className="profit-stat"><span>DRAWDOWN</span><b className="positive">-28%</b></div>
                      <div className="profit-stat"><span>DISCIPLINE</span><b className="positive">+31%</b></div>
                      <div className="profit-stat"><span>RULE ADHERENCE</span><b className="positive">94%</b></div>
                    </div>
                  </div>
                </motion.div>
              </article>
            </div>
          </section>

          <section className="section" id="proof">
            <div className="container">
              <div className="section-heading">
                <div className="eyebrow">
                  <span className="eyebrow-dot" />
                  SOCIAL PROOF
                </div>
                <h2>Built around measurable trader behavior.</h2>
                <p>
                  The figures below are the proof points requested for this landing
                  page. Verify each claim against your current analytics and user records
                  before publishing as factual marketing data.
                </p>
              </div>

              <div className="proof-layout">
                <Reveal>
                  <motion.article
                    className="proof-card testimonial-card"
                    key={testimonial}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div>
                      <div className="quote-mark">“</div>
                      <div className="testimonial-quote">{testimonials[testimonial].quote}</div>
                    </div>
                    <div className="testimonial-meta">
                      <div>
                        <strong>{testimonials[testimonial].name}</strong>
                        <span>{testimonials[testimonial].role}</span>
                      </div>
                      <div className="dots" aria-label="Testimonial selector">
                        {testimonials.map((item, index) => (
                          <button
                            key={item.name}
                            className={index === testimonial ? "active" : ""}
                            onClick={() => setTestimonial(index)}
                            aria-label={`Show testimonial ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.article>
                </Reveal>

                <div className="proof-grid">
                  <Reveal delay={0.06}>
                    <div className="proof-card">
                      <div className="eyebrow">LOSS CONTROL</div>
                      <strong>40%</strong>
                      <span>Claimed reduction in losses across 3 traders.</span>
                    </div>
                  </Reveal>
                  <Reveal delay={0.12}>
                    <div className="proof-card">
                      <div className="eyebrow">TIME SAVED</div>
                      <strong>5h/wk</strong>
                      <span>Claimed average weekly time saved on analysis.</span>
                    </div>
                  </Reveal>
                  <Reveal delay={0.18}>
                    <div className="proof-card">
                      <div className="eyebrow">DISCIPLINE</div>
                      <strong>78%</strong>
                      <span>Claimed users reporting improved discipline.</span>
                    </div>
                  </Reveal>
                  <Reveal delay={0.24}>
                    <div className="proof-card">
                      <div className="eyebrow">WIN RATE</div>
                      <strong><CountUp value={8} prefix="+" suffix="%" /></strong>
                      <span>Requested average win-rate improvement claim.</span>
                    </div>
                  </Reveal>
                </div>
              </div>

              <div className="proof-footnotes">
                <div className="badge">50+ professional beta testers</div>
                <div className="badge">Used by prop firm traders</div>
                <div className="badge">Recommended in trading communities</div>
              </div>

              <div style={{ marginTop: 16 }} className="proof-grid">
                <Reveal delay={0.1}>
                  <div className="proof-card">
                    <div className="eyebrow">ACTIVE USERS</div>
                    <strong>
                      <CountUp value={200} suffix="+" />
                    </strong>
                    <span>Requested quick-stat target.</span>
                  </div>
                </Reveal>
                <Reveal delay={0.16}>
                  <div className="proof-card">
                    <div className="eyebrow">TRADES ANALYZED</div>
                    <strong>₹15M+</strong>
                    <span>Requested total trade volume analyzed.</span>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="section soft" id="pricing">
            <div className="container">
              <div className="pricing-wrap">
                <div className="pricing-banner">
                  <div>
                    <strong>First 10 Users — Launch Pricing</strong>
                    <span>Choose the workflow that matches how seriously you review your trading.</span>
                  </div>
                  <div className="recommended-pill">LIMITED OFFER</div>
                </div>

                <div className="pricing-grid">
                  <Reveal>
                    <motion.article className="pricing-card recommended" whileHover={{ y: -7 }}>
                      <div className="plan-top">
                        <span className="plan-name">PREMIUM</span>
                        <span className="recommended-pill">MOST POPULAR</span>
                      </div>
                      <span className="plan-period">MONTHLY ACCESS</span>
                      <div className="price">
                        ₹399 <small>/ month</small>
                        <span className="strike">₹499</span>
                      </div>
                      <div className="discount">LAUNCH PRICE</div>
                      <p className="plan-copy">
                        The core feedback loop for traders who want to stop repeating the same mistake.
                      </p>
                      <ul className="plan-features">
                        <li><b>✓</b> Unlimited trades</li>
                        <li><b>✓</b> VAULT AI behavioral insights</li>
                        <li><b>✓</b> Community + accountability</li>
                        <li><b>✓</b> Advanced journal analytics</li>
                      </ul>
                      <motion.button
                        className="primary-btn gold plan-button"
                        onClick={() => router.push("/pricing")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Get Premium — ₹399
                      </motion.button>
                    </motion.article>
                  </Reveal>

                  <Reveal delay={0.08}>
                    <motion.article className="pricing-card annual" whileHover={{ y: -7 }}>
                      <div className="plan-top">
                        <span className="plan-name">PRO</span>
                        <span className="recommended-pill" style={{ background: "#10b981", color: "#03150f" }}>ANNUAL</span>
                      </div>
                      <span className="plan-period">12 MONTHS · BILLED YEARLY</span>
                      <div className="price">
                        ₹999 <small>/ year</small>
                      </div>
                      <div className="discount" style={{ color: "#6ee7b7", borderColor: "rgba(16,185,129,0.15)", background: "rgba(16,185,129,0.06)" }}>
                        ANNUAL PLAN
                      </div>
                      <p className="plan-copy">
                        Everything in Premium, plus the deeper research tools for traders who want one complete system.
                      </p>
                      <ul className="plan-features">
                        <li><b>✓</b> Everything in Premium</li>
                        <li><b>✓</b> Strategy library</li>
                        <li><b>✓</b> Backtesting</li>
                        <li><b>✓</b> Advanced validation tools</li>
                      </ul>
                      <motion.button
                        className="primary-btn plan-button"
                        onClick={() => router.push("/pricing")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Get Pro — ₹999 / Year
                      </motion.button>
                    </motion.article>
                  </Reveal>
                </div>

                <div className="fine-print">
                  Pricing, promotional language, and product entitlements shown here are based on your requested offer. Confirm production pricing and billing setup before launch.
                </div>
              </div>
            </div>
          </section>

          <section className="final-cta">
            <div className="container">
              <Reveal>
                <div className="final-cta-inner">
                  <div className="eyebrow" style={{ justifyContent: "center" }}>
                    <span className="eyebrow-dot" />
                    STOP LOGGING. START LEARNING.
                  </div>
                  <h2>
                    Your journal already has the answers.
                    <span style={{ display: "block", color: "#34d399" }}>VALT helps you see them.</span>
                  </h2>
                  <p>
                    Build the system once. Get the feedback every week. Make your next
                    trade from rules — not emotion.
                  </p>
                  <div className="hero-actions" style={{ justifyContent: "center" }}>
                    <motion.button
                      className="primary-btn pulse"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/pricing")}
                    >
                      Get Premium for ₹399 →
                    </motion.button>
                    <motion.button
                      className="secondary-btn"
                      whileHover={{ scale: 1.02, y: -2 }}
                      onClick={() => router.push("/login")}
                    >
                      Log in to Dashboard
                    </motion.button>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div>
                <button className="brand" onClick={() => router.push("/")}>
                  <span className="brand-bolt">ϟ</span>
                  VOLT TERMINAL
                </button>
                <p style={{ marginTop: 16, maxWidth: 390 }}>
                  A trading journal + AI coaching platform built to turn execution data
                  into better decisions, stronger rules, and more disciplined trading.
                </p>
              </div>

              <div>
                <h4>PRODUCT</h4>
                <ul>
                  <li><button className="footer-link" onClick={() => scrollTo("features")}>Features</button></li>
                  <li><button className="footer-link" onClick={() => scrollTo("how-it-works")}>How it works</button></li>
                  <li><button className="footer-link" onClick={() => scrollTo("pricing")}>Pricing</button></li>
                </ul>
              </div>

              <div>
                <h4>ACCOUNT</h4>
                <ul>
                  <li><button className="footer-link" onClick={() => router.push("/login")}>Log in</button></li>
                  <li><button className="footer-link" onClick={() => router.push("/pricing")}>Start free</button></li>
                  <li><button className="footer-link" onClick={() => router.push("/")}>Contact</button></li>
                </ul>
              </div>

              <div>
                <h4>LEGAL</h4>
                <p>Trading involves substantial risk. Use risk capital only. Historical results, testimonials, and illustrative examples are not guarantees of future performance.</p>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="disclaimer">
                © {new Date().getFullYear()} VOLT TERMINAL. All rights reserved.
              </div>
              <div>Built for traders who want a tighter feedback loop.</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
