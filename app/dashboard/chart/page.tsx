'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';

export default function DedicatedChartPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = ''; // Clear previous instances

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "width": "100%",
      "height": "100%",
      "symbol": "OANDA:XAUUSD",
      "interval": "15",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "backgroundColor": "#000000",
      "gridColor": "rgba(255, 255, 255, 0.03)",
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "save_image": true,
      "calendar": false,
      "hide_volume": false,
      "support_host": "https://www.tradingview.com",
      "studies": [],
      "watchlist": [
        "OANDA:XAUUSD",
        "CAPITALCOM:DXY",
        "FX:EURUSD",
        "FX:GBPUSD",
        "FX:USDJPY",
        "FX:USDCHF",
        "FX:AUDUSD",
        "FX:USDCAD",
        "BITSTAMP:BTCUSD"
      ]
    });

    containerRef.current.appendChild(script);

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().catch((err) => {
        alert(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full h-screen bg-black overflow-hidden flex flex-col select-none">
      {/* Floating Compact Fullscreen Button */}
      <div className="absolute top-2 right-2 z-50 flex items-center">
        <button
          onClick={toggleFullscreen}
          className="group flex items-center gap-1.5 bg-neutral-900/90 hover:bg-emerald-500 text-neutral-200 hover:text-black px-2.5 py-1 rounded text-[11px] font-mono font-bold border border-neutral-800 hover:border-emerald-400 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Chart"}
        >
          {isFullscreen ? (
            <>
              <Minimize className="w-3 h-3 stroke-[2.5] transition-transform group-hover:scale-110" />
              <span>EXIT</span>
            </>
          ) : (
            <>
              <Maximize className="w-3.5 h-3.5 stroke-[2.5] transition-transform group-hover:scale-110" />
              <span>FULLSCREEN</span>
            </>
          )}
        </button>
      </div>

      {/* TradingView Chart Canvas */}
      <div className="tradingview-widget-container w-full h-full flex-1 bg-black">
        <div ref={containerRef} className="tradingview-widget-container__widget w-full h-full" />
      </div>
    </div>
  );
}