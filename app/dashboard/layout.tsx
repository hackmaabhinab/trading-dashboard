'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart2, 
  Brain, 
  Globe, 
  TrendingUp, 
  Radio, 
  MessageSquare, 
  Settings, 
  PanelLeftOpen, 
  X,
  ShieldCheck,
  Send
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Journal', href: '/dashboard/journal', icon: BookOpen },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2 },
  { name: 'Psychology', href: '/dashboard/psychology', icon: Brain },
  { name: 'Fundamentals', href: '/dashboard/fundamentals', icon: Globe },
  { name: 'Strategy', href: '/dashboard/strategy', icon: TrendingUp },
  { name: 'VIP Signals', href: '/dashboard/signals', icon: Radio },
  { name: 'Community', href: '/dashboard/community', icon: MessageSquare },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col md:flex-row relative">
      
      {/* Mobile Top Header Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B0F17] border-b border-blue-900/30 w-full sticky top-0 z-40 select-none">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 rounded-xl bg-blue-950 border border-blue-900/60 text-blue-400 hover:text-white active:bg-blue-900 transition-colors cursor-pointer outline-none"
            aria-label="Open Sidebar Menu"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
          <span className="font-black text-base tracking-wider text-blue-500">
            INSTITUTIONAL<span className="text-slate-100">.FX</span>
          </span>
        </div>
      </div>

      {/* Mobile Sliding Navigation Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[10000] md:hidden flex">
          {/* Backdrop Overlay */}
          <div 
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Drawer Sidebar */}
          <aside className="relative w-72 bg-[#0B0F17] border-r border-blue-900/40 h-full flex flex-col justify-between shadow-2xl z-[10001] select-none">
            {/* Drawer Header */}
            <div className="p-4 border-b border-blue-900/30 flex items-center justify-between bg-[#070A10]">
              <h1 className="font-black text-lg tracking-wider text-blue-500">
                INSTITUTIONAL<span className="text-slate-100">.FX</span>
              </h1>
              <button 
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-xl bg-blue-950/60 border border-blue-900/60 text-slate-400 hover:text-white active:bg-blue-900 cursor-pointer outline-none"
                aria-label="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
              <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation Menu</p>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsDrawerOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-blue-950/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Status Footer */}
            <div className="p-4 m-3 bg-[#070A10] border border-blue-900/30 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Supabase DB
                </span>
                <span className="font-mono font-bold text-emerald-400">ONLINE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-sky-400" /> Telegram Bot
                </span>
                <span className="font-mono font-bold text-sky-400">ACTIVE</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0B0F17] border-r border-blue-900/30 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-blue-900/30">
          <h1 className="font-black text-xl tracking-wider text-blue-500">
            INSTITUTIONAL<span className="text-slate-100">.FX</span>
          </h1>
        </div>

        <div className="px-4 py-6 space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-blue-950/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 m-4 bg-[#070A10] border border-blue-900/30 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Supabase DB
            </span>
            <span className="font-mono font-bold text-emerald-400">ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-sky-400" /> Telegram Bot
            </span>
            <span className="font-mono font-bold text-sky-400">ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-full">
        {children}
      </main>

    </div>
  );
}