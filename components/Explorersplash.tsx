"use client";

import React, { useState, useEffect } from "react";

export default function ExplorerSplash({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // 2 Seconds ke baad fade-out shuru hoga
    const timer1 = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // 2.6 Seconds par component completely hide ho jayega
    const timer2 = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ease-in-out select-none ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Main Animated Logo Box */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Volt Logo Icon with Pulsing Outer Ring */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer Pulsing Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping duration-1000" />
          
          {/* Main Logo Circle */}
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] z-10">
            {/* Triangle Icon inside */}
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-black translate-y-[-2px]" />
          </div>
        </div>

        {/* Brand Name & Loading Indicator */}
        <div className="flex flex-col items-center space-y-2 text-center z-10">
          <h1 className="text-2xl font-black tracking-widest text-white uppercase">
            VOLT <span className="text-emerald-400">TERMINAL</span>
          </h1>

          <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>INITIALIZING DESK...</span>
          </div>
        </div>

        {/* Sleek Bottom Loading Bar */}
        <div className="w-40 h-[2px] bg-neutral-800 rounded-full overflow-hidden mt-2 z-10">
          <div className="h-full bg-emerald-400 rounded-full animate-[splashLoading_1.8s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Tailwind CSS Custom Keyframe Animation for Progress Bar */}
      <style jsx>{`
        @keyframes splashLoading {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 15%;
          }
          100% {
            width: 100%;
            margin-left: 0%;
          }
        }
      `}</style>
    </div>
  );
}