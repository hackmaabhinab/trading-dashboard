'use client';
import React, { useEffect, useRef } from 'react';

export default function LiveChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = ''; // Duplicate scripts se bachne ke liye

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "500",
      "symbol": "OANDA:XAUUSD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2">
      <div ref={containerRef} className="tradingview-widget-container__wIdget h-[500px]" />
    </div>
  );
}