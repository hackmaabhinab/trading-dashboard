import React from 'react';

const AIAgentsTab = () => {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#06090E', padding: 16 }}>
      
      {/* HEADER */}
      <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 8 }}>
        🤖 AI Trading Agents
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: 20 }}>
        Multi-Agent LLM Financial Trading Framework
      </p>

      {/* WHAT IT DOES */}
      <section style={{
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftColor: '#10B981',
        borderLeftWidth: 4,
      }}>
        <h2 style={{ color: '#10B981', fontWeight: 'bold', marginBottom: 8 }}>
          What TradingAgents Does:
        </h2>
        <p style={{ color: '#fff', lineHeight: 22, whiteSpace: 'pre-line' }}>
          • 🤖 Multiple AI agents working together{'\n'}
          • 📊 Market analysis & predictions{'\n'}
          • 💰 Trading decision recommendations{'\n'}
          • ⚠️ Risk management{'\n'}
          • 📰 News monitoring & impact{'\n'}
          • 🔄 Agent coordination system{'\n'}
          • 🎯 Performance tracking
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section style={{
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
      }}>
        <h2 style={{ color: '#10B981', fontWeight: 'bold', marginBottom: 8 }}>
          Agent Types:
        </h2>
        <p style={{ color: '#fff', lineHeight: 22, whiteSpace: 'pre-line' }}>
          1️⃣ Market Agent - Analyzes price action{'\n'}
          2️⃣ News Agent - Monitors events{'\n'}
          3️⃣ Risk Agent - Manages position risk{'\n'}
          4️⃣ Decision Agent - Makes trade calls{'\n'}
          5️⃣ Executor Agent - Executes orders
        </p>
      </section>

      {/* FEATURES */}
      <section style={{
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
      }}>
        <h2 style={{ color: '#10B981', fontWeight: 'bold', marginBottom: 12 }}>
          Key Features:
        </h2>
        
        <div style={{ marginBottom: 10 }}>
          <strong style={{ color: '#fff' }}>LLM Integration</strong>
          <p style={{ color: '#94a3b8', fontSize: 12 }}>
            Uses ChatGPT, Claude, Gemini for intelligence
          </p>
        </div>

        <div style={{ marginBottom: 10 }}>
          <strong style={{ color: '#fff' }}>Real-time Analysis</strong>
          <p style={{ color: '#94a3b8', fontSize: 12 }}>
            Live market data processing
          </p>
        </div>

        <div style={{ marginBottom: 10 }}>
          <strong style={{ color: '#fff' }}>Backtesting</strong>
          <p style={{ color: '#94a3b8', fontSize: 12 }}>
            Test strategies on historical data
          </p>
        </div>

        <div>
          <strong style={{ color: '#fff' }}>Open Source</strong>
          <p style={{ color: '#94a3b8', fontSize: 12 }}>
            Free, customizable, community-driven
          </p>
        </div>
      </section>

      {/* USE CASES */}
      <section style={{
        backgroundColor: '#1e293b',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
      }}>
        <h2 style={{ color: '#10B981', fontWeight: 'bold', marginBottom: 8 }}>
          Perfect For:
        </h2>
        <p style={{ color: '#fff', lineHeight: 22, whiteSpace: 'pre-line' }}>
          ✅ Automated trading strategies{'\n'}
          ✅ Multi-asset analysis{'\n'}
          ✅ Risk assessment{'\n'}
          ✅ Portfolio optimization{'\n'}
          ✅ Learning AI trading{'\n'}
          ✅ Backtesting strategies
        </p>
      </section>

      {/* CTA BUTTON */}
      <a href="https://github.com/TauricResearch/TradingAgents" target="_blank" rel="noreferrer"
        style={{
          backgroundColor: '#10B981',
          padding: '14px 20px',
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          📖 View on GitHub
        </span>
      </a>

      {/* INSTALLATION INFO */}
      <section style={{
        backgroundColor: '#0f172a',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
      }}>
        <p style={{ color: '#94a3b8', fontSize: 12 }}>
          💡 TradingAgents is a free, open-source framework you can integrate into VALT for AI-powered trading decisions!
        </p>
      </section>

    </main>
  );
};

export default AIAgentsTab;