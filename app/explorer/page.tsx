'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Tab Data for Interactive "Seven products. One hub." Section
const hubTabsData: Record<
  string,
  {
    tag: string;
    title: string;
    description: string;
    bullets: string[];
    visualType: string;
  }
> = {
  Overview: {
    tag: 'DASHBOARD',
    title: 'Your entire trading universe, at a glance.',
    description:
      'See your top-level metrics, daily P&L, and immediate action items in a unified executive dashboard. No more switching between five different apps.',
    bullets: [
      'Clear daily and weekly P&L logging',
      'Instant session performance summaries',
      'Active system alerts and macro warnings',
    ],
    visualType: 'overview',
  },
  Journal: {
    tag: 'AUTOMATED JOURNAL',
    title: 'JOURNAL TRADE',
    description:
      'Connect once. Trades flow in real-time from your brokers and proprietary firms — auto-tagged and ready for review. .',
    bullets: [
      'Detailed trade logging with setup tags and chart snapshots',
      'Psychological state and session review notes',
      'Filter by session or asset (e.g., XAUUSD)',
    ],
    visualType: 'journal',
  },
  'Live Chart': {
    tag: 'INTEGRATED CHARTING',
    title: 'Institutional charting, built right in.',
    description:
      'Analyze price action, mark up liquidity pools, and spot precise Smart Money Concepts (SMC) directly inside your terminal workflow.',
    bullets: [
      'Real-time tick data for Forex, Crypto & Indices',
      'Advanced drawing tools & custom markers',
      'DARK THEME',
    ],
    visualType: 'chart',
  },
  'AI Insights': {
    tag: 'AI COACH',
    title: "Find what's costing you. In Plain Hinglish and English.",
    description:
      'Volt AI reads your execution data and surfaces psychological leaks: revenge trading, FOMO, and tilt cycles. Understand the real psychology behind your execution.',
    bullets: [
      'Behavioral pattern & tilt detection',
      'Time-of-day and session analysis',
      'Actionable advice to fix mental leaks',
    ],
    visualType: 'ai',
  },
  'News & AI': {
    tag: 'MACRO & SENTIMENT',
    title: 'Macro news, translated by AI.',
    description:
      'Real-time macroeconomic feeds (CPI, NFP, COT data) paired with instant AI analysis on how upcoming news events will impact currency and commodity dynamics.',
    bullets: [
      'Live global macroeconomic calendar',
      'Instant AI impact analysis on your setups',
      'Commitment of Traders (COT) & open interest insights',
    ],
    visualType: 'news',
  },
  Strategy: {
    tag: 'EDGE TRACKER',
    title: 'Master ICT and SMC with structured playbooks and guides.',
    description:
      'Access proven institutional frameworks, complete with detailed PDFs, rule-based entry playbooks, and video walkthroughs to sharpen your edge.',
    bullets: [
      'Comprehensive ICT & SMC strategy guides and reference PDFs',
      'Attached video breakdowns and real market execution examples',
      'Step-by-step entry playbooks for high-probability setups',
    ],
    visualType: 'strategy',
  },
  Community: {
    tag: 'SPACES | COMING SOON',
    title: 'A focused space to stay accountable and master trading psychology.',
    description:
      'Connect with like-minded individuals, share mindset breakthroughs, and keep each other disciplined through every market session.',
    bullets: [
      'Real-time discussions on trading psychology and mental roadblocks',
      'Accountability circles to avoid revenge trading and emotional tilt',
      'Daily session check-ins and mindset progress tracking',
    ],
    visualType: 'community',
  },
};

export default function VoltLandingExplorer() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const currentTabData = hubTabsData[activeTab];

  return (
    <div className="volt-root">
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .volt-root {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #f8fafc;
          background-color: #06090e;
          overflow-x: hidden;
          width: 100%;
        }

        .container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Emerald Green Gradients & Accents */
        .grad-text {
          background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Header Navbar */
        header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(6, 9, 14, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #1e293b;
        }
        nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 76px;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.03em;
          color: #ffffff;
          cursor: pointer;
        }
        .logo span.bolt {
          color: #10b981;
          font-size: 24px;
        }
        .nav-menu {
          display: flex;
          gap: 32px;
          list-style: none;
          font-size: 15px;
          font-weight: 500;
          color: #94a3b8;
        }
        .nav-menu li {
          cursor: pointer;
          transition: color 0.2s;
        }
        .nav-menu li:hover {
          color: #10b981;
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .btn-link {
          background: transparent;
          border: none;
          font-weight: 600;
          font-size: 15px;
          color: #f8fafc;
          cursor: pointer;
        }
        .btn-gradient {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          padding: 10px 22px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gradient:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
        }

        /* HERO SECTION */
        .hero-section {
          padding: 80px 0 100px;
          background: radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.12) 0%, rgba(6, 9, 14, 0) 60%),
                      radial-gradient(circle at 10% 60%, rgba(5, 150, 105, 0.12) 0%, rgba(6, 9, 14, 0) 60%);
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
        }
        .hero-title {
          font-size: 60px;
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -0.04em;
          color: #ffffff;
          margin-bottom: 24px;
        }
        .hero-sub {
          font-size: 18px;
          line-height: 1.6;
          color: #94a3b8;
          margin-bottom: 32px;
          max-width: 500px;
        }

        .tools-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 48px;
        }
        .pill {
          padding: 8px 16px;
          border-radius: 9999px;
          border: 1px solid #1e293b;
          background: #0f172a;
          font-size: 13px;
          font-weight: 600;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .pill.active {
          background: #10b981;
          color: #ffffff;
          border-color: #10b981;
        }

        /* HERO MOCKUP CARD */
        .hero-mockup {
          position: relative;
          background: #0d131f;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid #1e293b;
          color: #94a3b8;
          font-size: 13px;
        }
        .float-card {
          position: absolute;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 14px;
          padding: 16px 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          border: 1px solid #1e293b;
          z-index: 10;
        }
        .float-top {
          top: -20px;
          right: -20px;
          width: 260px;
        }
        .float-bottom {
          bottom: 30px;
          left: -30px;
          width: 280px;
        }

        /* HUB SECTION */
        .hub-section {
          padding: 100px 0;
          text-align: center;
          background: #090d16;
          border-top: 1px solid #1e293b;
        }
        .section-tag {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #10b981;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .section-tag span {
          width: 6px;
          height: 6px;
          background: #10b981;
          border-radius: 50%;
        }
        .section-title {
          font-size: 48px;
          font-weight: 800;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
          color: #fff;
        }
        .section-sub {
          font-size: 18px;
          color: #94a3b8;
          margin-bottom: 48px;
        }

        .hub-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .tab-btn {
          padding: 12px 24px;
          border-radius: 9999px;
          border: 1px solid #1e293b;
          background: #0d131f;
          font-weight: 600;
          font-size: 14px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s;
        }
        .tab-btn:hover {
          color: #fff;
          border-color: #334155;
        }
        .tab-btn.active {
          border-color: #10b981;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
        }

        .feature-hero-card {
          background: #0d131f;
          border-radius: 24px;
          border: 1px solid #1e293b;
          padding: 50px;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 48px;
          text-align: left;
          align-items: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }

        /* DARK SECTION: VOLT AI COACH */
        .dark-coach-section {
          background: #06090e;
          color: #fff;
          padding: 120px 0;
          position: relative;
          overflow: hidden;
          border-top: 1px solid #1e293b;
        }
        .dark-coach-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 400px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 9, 14, 0) 70%);
          pointer-events: none;
        }
        .coach-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          margin-top: 60px;
        }
        .chat-box {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 20px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .chat-msg {
          padding: 16px 20px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.5;
          max-width: 85%;
        }
        .msg-user {
          align-self: flex-end;
          background: #1e293b;
          color: #f8fafc;
        }
        .msg-ai {
          align-self: flex-start;
          background: #064e3b;
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #ecfdf5;
        }

        .pattern-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pattern-card {
          background: #0f172a;
          border: 1px solid #1e293b;
          padding: 20px;
          border-radius: 16px;
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .pattern-icon {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        /* NUMBERED STEPS SECTIONS */
        .step-section {
          padding: 120px 0;
          position: relative;
          background: #06090e;
          border-top: 1px solid #1e293b;
        }
        .big-number {
          font-size: 180px;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.03);
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          user-select: none;
        }
        .step-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 60px;
          position: relative;
          z-index: 2;
        }

        .three-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          position: relative;
          z-index: 2;
        }
        .gradient-feature-card {
          border-radius: 20px;
          padding: 36px 28px;
          color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 340px;
          border: 1px solid #1e293b;
          box-shadow: 0 15px 30px rgba(0,0,0,0.3);
        }
        .card-bg-1 { background: linear-gradient(145deg, #064e3b 0%, #0d131f 100%); }
        .card-bg-2 { background: linear-gradient(145deg, #047857 0%, #06090e 100%); }
        .card-bg-3 { background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%); }

        /* TRADERZELLA-STYLE FOOTER */
        .traderzella-footer {
          background: #030712;
          color: #94a3b8;
          padding: 80px 0 40px;
          border-top: 1px solid #1e293b;
          font-size: 14px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1.2fr 1fr;
          gap: 40px;
          padding-bottom: 60px;
          border-bottom: 1px solid #1e293b;
        }
        .footer-col h4 {
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-col ul li {
          cursor: pointer;
          transition: color 0.2s;
        }
        .footer-col ul li:hover {
          color: #10b981;
        }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .social-icons {
          display: flex;
          gap: 16px;
        }
        .social-icon {
          width: 36px;
          height: 36px;
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f8fafc;
          cursor: pointer;
          transition: all 0.2s;
        }
        .social-icon:hover {
          border-color: #10b981;
          color: #10b981;
        }

        @media (max-width: 900px) {
          .hero-grid, .feature-hero-card, .coach-grid, .three-cards-grid, .footer-grid {
            grid-template-columns: 1fr;
          }
          .hero-title { font-size: 40px; }
          .big-number { font-size: 100px; }
        }
      `}</style>

      {/* NAVBAR */}
      <header>
        <div className="container">
          <nav>
            <div className="logo" onClick={() => router.push('/')}>
              <span className="bolt">⚡</span> VOLT TERMINAL
            </div>
            <ul className="nav-menu">
              <li onClick={() => router.push('/')}>Overview</li>
              <li onClick={() => router.push('/')}>Journal</li>
              <li onClick={() => router.push('/')}>Charting</li>
              <li onClick={() => router.push('/')}>AI Insights</li>
              <li onClick={() => router.push('/')}>Community</li>
            </ul>
            <div className="nav-actions">
              <button className="btn-link" onClick={() => router.push('/login')}>Log In</button>
              <button className="btn-gradient" onClick={() => router.push('/login')}>Get Started ›</button>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <h1 className="hero-title">
                The Complete <br />
                <span className="grad-text">Trading Ecosystem</span>
              </h1>
              <p className="hero-sub">
                A lightning-fast, cloud-based terminal that won't lag your setup. Fully optimized for your desktop, tablet, and mobile workflow. Trade, journal, analyze, and connect — all in one place.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button className="btn-gradient" onClick={() => router.push('/login')} style={{ padding: '16px 36px', fontSize: '16px' }}>
                  Open Dashboard
                </button>
              </div>

              <div className="tools-pills">
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', width: '100%', letterSpacing: '0.05em' }}>
                  YOUR TOOLS
                </span>
                <span className="pill active">• Overview</span>
                <span className="pill">Journal</span>
                <span className="pill">Live Chart</span>
                <span className="pill">AI Insights</span>
                <span className="pill">News & Macro</span>
                <span className="pill">Strategy</span>
                <span className="pill">Community</span>
              </div>
            </div>

            {/* HERO MOCKUP CARD */}
            <div className="hero-mockup">
              <div className="float-card float-top">
                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginBottom: '4px' }}>
                  ⚡ MACRO NEWS AI
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                  CPI data cooling. Expect USD weakness.
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Just now</div>
              </div>

              <div className="float-card float-bottom">
                <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>
                  🎯 PSYCHOLOGY ALERT
                </div>
                <div style={{ fontSize: '13px', color: '#f8fafc', marginTop: '4px', fontWeight: 600 }}>
                  Excellent Discipline Today
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                  You followed your mechanical edge perfectly.
                </div>
              </div>

              <div className="dashboard-header">
                <span>Terminal Overview</span>
                <span>Active Session</span>
              </div>

              <div style={{ padding: '24px 0', textAlign: 'center' }}>
                <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>NET P&L (THIS MONTH)</div>
                <div style={{ fontSize: '42px', fontWeight: 800, color: '#10b981' }}>+$14,250.00</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '24px' }}>
                  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>WIN RATE</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>68.4%</div>
                  </div>
                  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>PROFIT FACTOR</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>2.84</div>
                  </div>
                  <div style={{ background: '#1e293b', padding: '12px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>ACTIVE EDGE</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>SMC Setup</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HUB SECTION (DYNAMIC TABS) */}
      <section className="hub-section">
        <div className="container">
          <div className="section-tag">
            <span></span> YOUR TOOLKIT
          </div>
          <h2 className="section-title">
            Seven products. <span className="grad-text">One hub.</span>
          </h2>
          <p className="section-sub">
            Everything you need to analyze the market, track your psychology, and execute your edge.
          </p>

          <div className="hub-tabs">
            {Object.keys(hubTabsData).map((tabName) => (
              <button
                key={tabName}
                className={`tab-btn ${activeTab === tabName ? 'active' : ''}`}
                onClick={() => setActiveTab(tabName)}
              >
                {tabName}
              </button>
            ))}
          </div>

          <div className="feature-hero-card">
            <div>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {currentTabData.tag}
              </div>
              <h3 style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', color: '#fff' }}>
                {currentTabData.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                {currentTabData.description}
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', fontWeight: 600 }}>
                {currentTabData.bullets.map((bullet, idx) => (
                  <li key={idx} style={{ color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#10b981' }}>✓</span> {bullet}
                  </li>
                ))}
              </ul>

              <button className="btn-gradient" onClick={() => router.push('/login')} style={{ marginTop: '28px', padding: '12px 24px', fontSize: '14px' }}>
                Launch Module →
              </button>
            </div>

            {/* DYNAMIC VISUAL MOCKUP BASED ON SELECTED TAB */}
            <div style={{ background: '#06090e', borderRadius: '16px', padding: '24px', color: '#fff', border: '1px solid #1e293b', minHeight: '320px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              
              {currentTabData.visualType === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#0d131f', padding: '24px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                    <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em' }}>NET P&L (THIS MONTH)</div>
                    <div style={{ fontSize: '38px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>+$14,250.00</div>
                    
                    <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                      <div style={{ flex: 1, background: '#1e293b', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>WIN RATE</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>68.4%</div>
                      </div>
                      <div style={{ flex: 1, background: '#1e293b', padding: '12px', borderRadius: '8px' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>PROFIT FACTOR</div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>2.84</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', padding: '12px 16px', borderRadius: '8px', fontSize: '13px', color: '#bfdbfe', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span>⚡</span> <span><strong>System Status:</strong> Excellent execution! Your Win Rate is 68.4% with a strong Profit Factor of 4.5. Your edge is robust.</span>
                  </div>
                </div>
              )}

              {currentTabData.visualType === 'journal' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '12px', color: '#94a3b8' }}>
                    <span>Live Trade Feed</span>
                    <span style={{ color: '#10b981' }}>● Auto Sync Active</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#0d131f', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>XAUUSD <span style={{ color: '#10b981', fontSize: '12px', marginLeft: '6px' }}>BUY</span></div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Smart Money Concept / FVG</div>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700, fontSize: '16px' }}>+$840.00</span>
                    </div>
                    <div style={{ background: '#0d131f', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>EURUSD <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '6px' }}>SELL</span></div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Liquidity Sweep</div>
                      </div>
                      <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '16px' }}>-$320.00</span>
                    </div>
                    <div style={{ background: '#0d131f', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700 }}>GBPUSD <span style={{ color: '#10b981', fontSize: '12px', marginLeft: '6px' }}>BUY</span></div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Order Block Retest</div>
                      </div>
                      <span style={{ color: '#10b981', fontWeight: 700, fontSize: '16px' }}>+$1,125.50</span>
                    </div>
                  </div>
                </div>
              )}

              {currentTabData.visualType === 'chart' && (
                <div style={{ height: '240px', background: '#0d131f', borderRadius: '12px', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 12, left: 16, fontSize: '14px', fontWeight: 700, color: '#fff' }}>XAUUSD <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>15m</span></div>
                  <div style={{ position: 'absolute', top: 12, right: 16, fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.2)' }}>● LIVE DATA</div>
                  
                  {/* Candlesticks Mockup */}
                  <div style={{ position: 'absolute', bottom: '30%', left: '15%', width: '12px', height: '25%', background: '#ef4444', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', bottom: '20%', left: '25%', width: '12px', height: '40%', background: '#10b981', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', bottom: '45%', left: '35%', width: '12px', height: '35%', background: '#10b981', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', bottom: '65%', left: '45%', width: '12px', height: '20%', background: '#10b981', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', bottom: '75%', left: '55%', width: '12px', height: '15%', background: '#ef4444', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', bottom: '50%', left: '65%', width: '12px', height: '30%', background: '#ef4444', borderRadius: '2px' }}></div>
                  <div style={{ position: 'absolute', bottom: '40%', left: '75%', width: '12px', height: '45%', background: '#10b981', borderRadius: '2px' }}></div>
                  
                  {/* SMC Annotations */}
                  <div style={{ position: 'absolute', bottom: '45%', left: '25%', width: '20%', height: '20%', background: 'rgba(59, 130, 246, 0.15)', border: '1px dashed #3b82f6' }}></div>
                  <div style={{ position: 'absolute', bottom: '48%', left: '27%', fontSize: '11px', color: '#60a5fa', fontWeight: 700 }}>FVG</div>

                  <div style={{ position: 'absolute', bottom: '65%', left: '45%', width: '25%', borderTop: '2px solid #eab308' }}></div>
                  <div style={{ position: 'absolute', bottom: '68%', left: '50%', fontSize: '11px', color: '#facc15', fontWeight: 700 }}>BOS / LIQUIDITY</div>
                </div>
              )}

              {currentTabData.visualType === 'ai' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                    🤖 Volt AI Leak Detector
                  </div>
                  <div style={{ background: '#0d131f', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b', fontSize: '14px', lineHeight: 1.5 }}>
                    "You took 3 trades tagged with <strong>'Early Entry'</strong> today. You are consistently entering positions 2 minutes before the hourly close. Waiting for the candle to close could improve your win rate by 14%."
                  </div>
                  <div style={{ background: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', fontSize: '14px', lineHeight: 1.5 }}>
                    "Your psychological tilt is usually triggered after a -$200 loss. I suggest implementing a hard 15-minute screen lock when this threshold is hit."
                  </div>
                </div>
              )}

              {currentTabData.visualType === 'news' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: '#0d131f', padding: '18px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                    <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span> HIGH IMPACT MACRO
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>US CPI Data Release (YoY)</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>Actual: 3.1% | Forecast: 3.2%</div>
                  </div>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 700, marginBottom: '8px' }}>🤖 AI IMPACT ANALYSIS ON USD/GOLD</div>
                    <div style={{ fontSize: '14px', color: '#ecfdf5', lineHeight: 1.6 }}>
                      Lower-than-expected CPI weakens the USD. Expect strong upward momentum on Gold (XAUUSD) as institutional algorithms re-price inflation expectations. Watch for a liquidity sweep at key resistance before continuation.
                    </div>
                  </div>
                </div>
              )}

              {currentTabData.visualType === 'strategy' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                    <span>Active Playbook Performance</span>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>+4.2% This Month</span>
                  </div>
                  <div style={{ background: '#0d131f', padding: '16px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>SMC Silver Bullet</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>42 Executions tracked</div>
                    </div>
                    <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 800 }}>68% WR</div>
                  </div>
                  <div style={{ background: '#0d131f', padding: '16px', borderRadius: '8px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>COT Report Alignment</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>14 Executions tracked</div>
                    </div>
                    <div style={{ fontSize: '20px', color: '#10b981', fontWeight: 800 }}>78% WR</div>
                  </div>
                </div>
              )}

              {currentTabData.visualType === 'community' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#10b981', marginBottom: '4px' }}>
                    💬 Trading Lounge
                  </div>
                  <div style={{ background: '#0d131f', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b', fontSize: '14px', color: '#94a3b8', lineHeight: 1.5 }}>
                    <strong style={{ color: '#fff' }}>You:</strong> Caught myself revenge trading after that early stop-out on the Gold long. Going to step away for the session.
                  </div>
                  <div style={{ background: '#1e293b', padding: '16px', borderRadius: '10px', border: '1px solid #334155', fontSize: '14px', color: '#e2e8f0', marginLeft: '24px', lineHeight: 1.5 }}>
                    <strong style={{ color: '#60a5fa' }}>Jay:</strong> Good awareness. The setup wasn't fully there anyway, price action is choppy waiting for the macro drop. Go take a walk.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DARK SECTION: VOLT AI COACH */}
      <section className="dark-coach-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div className="section-tag">
              <span></span> VOLT AI
            </div>
            <h2 className="section-title">
              Your personal <span className="grad-text">trading psychologist.</span>
            </h2>
            <p className="section-sub">
              Trained on institutional execution metrics. Knows your behavioral patterns better than you do. Master your mindset.
            </p>
          </div>

          <div className="coach-grid">
            <div className="chat-box">
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.05em' }}>
                LIVE AI DIAGNOSIS
              </div>
              <div className="chat-msg msg-user">
                Why did I bleed profits on Gold last week?
              </div>
              <div className="chat-msg msg-ai">
                You took 4 revenge trades within 3 minutes of stopping out. Each averaged a -$420 loss. That’s 73% of last week's drawdown originating from the same psychological tilt pattern.
              </div>
              <div className="chat-msg msg-user">
                What rule should I set to fix this?
              </div>
              <div className="chat-msg msg-ai">
                Enforce a mandatory 15-minute cool-down lock after any -$200 loss. Traders with similar behavioral profiles cut their drawdown by 38% after implementing this strict rule.
              </div>
            </div>

            <div className="pattern-cards">
              <div className="pattern-card">
                <div className="pattern-icon" style={{ background: '#064e3b', color: '#10b981' }}>🕒</div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>TIME OF DAY FILTER</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: '#fff' }}>
                    You lose <span style={{ color: '#ef4444' }}>62%</span> of trades placed after 2:30 PM EST.
                  </div>
                </div>
              </div>

              <div className="pattern-card">
                <div className="pattern-icon" style={{ background: '#831843', color: '#f43f5e' }}>⚠️</div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>BEHAVIOR DETECTED</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: '#fff' }}>
                    Revenge trades cost you <span style={{ color: '#ef4444' }}>$4,420</span> this quarter.
                  </div>
                </div>
              </div>

              <div className="pattern-card">
                <div className="pattern-icon" style={{ background: '#064e3b', color: '#10b981' }}>🎯</div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>BEST EDGE IDENTIFIED</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, marginTop: '2px', color: '#fff' }}>
                    Strongest setup: <span style={{ color: '#10b981' }}>SMC Fair Value Gap retests</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NUMBERED STEPS SECTIONS */}
      <section className="step-section">
        <div className="big-number">1</div>
        <div className="container">
          <div className="step-header">
            <div style={{ color: '#10b981', fontWeight: 700, fontSize: '12px', letterSpacing: '0.05em', marginBottom: '8px' }}>
              SEAMLESS CONNECTIONS
            </div>
            <h2 style={{ fontSize: '42px', fontWeight: 800, color: '#fff' }}>
              COMING SOON<br />
              <span className="grad-text">Powerful and Automated Data Syncing</span>
            </h2>
            <p style={{ color: '#94a3b8', marginTop: '12px', fontSize: '18px' }}>
              Connect your favorite platforms. We pull the data silently in the background while you focus on the charts.
            </p>
          </div>

          <div className="three-cards-grid">
            <div className="gradient-feature-card card-bg-1">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Broker API Integrations</h3>
                <p style={{ fontSize: '15px', opacity: 0.8, lineHeight: 1.6 }}>
                  Direct API connections to MetaTrader 4, MetaTrader 5, and top-tier brokerages. Instant fills flowing straight into your journal.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px', fontSize: '13px', color: '#10b981' }}>
                ✓ 500+ Platforms Supported
              </div>
            </div>

            <div className="gradient-feature-card card-bg-2">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Prop Firm Monitoring</h3>
                <p style={{ fontSize: '15px', opacity: 0.8, lineHeight: 1.6 }}>
                  Track your evaluation challenges and funded accounts. Get live alerts before you hit daily drawdown limits.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px', fontSize: '13px', color: '#10b981' }}>
                ✓ Real-time Rule Checking
              </div>
            </div>

            <div className="gradient-feature-card card-bg-3">
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Cloud Performance</h3>
                <p style={{ fontSize: '15px', opacity: 0.8, lineHeight: 1.6 }}>
                  Built for speed. No heavy background processes that lag your PC during analysis. Fully optimized for pc and mobile analysis.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px', fontSize: '13px', color: '#10b981' }}>
                ✓ Zero System Lag
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRADERZELLA-STYLE FOOTER */}
      <footer className="traderzella-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
                <span style={{ color: '#10b981' }}>⚡</span> VOLT TERMINAL
              </div>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#94a3b8', maxWidth: '340px' }}>
                Tools for futures, currency & options involves substantial risk & is not appropriate for everyone. Only risk capital should be used for trading. Testimonials appearing on this website may not be representative of other clients or customers and is not a guarantee of future performance or success.
              </p>
            </div>

            <div className="footer-col">
              <h4>Navigation</h4>
              <ul>
                <li onClick={() => router.push('/login')}>Log In</li>
                <li onClick={() => router.push('/')}>Features</li>
                <li onClick={() => router.push('/')}>Solutions</li>
                <li onClick={() => router.push('/')}>Blog</li>
                <li onClick={() => router.push('/')}>Pricing</li>
                <li onClick={() => router.push('/')}>Supported Brokers</li>
                <li onClick={() => router.push('/')}>Become A Partner</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Compare Journals & Tools</h4>
              <ul>
                <li onClick={() => router.push('/')}>vs. TraderSync</li>
                <li onClick={() => router.push('/')}>vs. Edgework</li>
                <li onClick={() => router.push('/')}>vs. Notion</li>
                <li onClick={() => router.push('/')}>vs. Excel</li>
                <li onClick={() => router.push('/')}>vs. TradingView</li>
                <li onClick={() => router.push('/')}>vs. FX Replay</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Company & Support</h4>
              <ul>
                <li onClick={() => router.push('/')}>Contact Us</li>
                <li onClick={() => router.push('/')}>Careers</li>
                <li onClick={() => router.push('/')}>Wall of love 💜</li>
                <li onClick={() => router.push('/')}>Privacy Policy</li>
                <li onClick={() => router.push('/')}>Terms & Conditions</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="social-icons">
              <div className="social-icon" onClick={() => router.push('/')}>𝕏</div>
              <div className="social-icon" onClick={() => router.push('/')}>📸</div>
              <div className="social-icon" onClick={() => router.push('/')}>in</div>
              <div className="social-icon" onClick={() => router.push('/')}>💬</div>
              <div className="social-icon" onClick={() => router.push('/')}>f</div>
            </div>
            <div style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }} onClick={() => router.push('/')}>
              WEBSITE DESIGN AND DEVELOP BY ABHINAV SHUKLA
              CONTACT NO - 6306217843 »
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}