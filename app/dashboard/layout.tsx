"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart2, 
  BookOpen, 
  LineChart, 
  Layers, 
  Users, 
  Settings, 
  ChevronRight,
  Menu,
  X,
  Newspaper
} from "lucide-react";

const navTabs = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Journal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Live Chart", href: "/dashboard/chart", icon: LineChart },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Strategy", href: "/dashboard/strategy", icon: Layers },
  { name: "News", href: "/dashboard/news", icon: Newspaper },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-black text-slate-200 overflow-hidden font-sans">
      
      {/* 1. MOBILE TOP HEADER (Shown ONLY on mobile screens) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-neutral-800 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white active:scale-95 transition-transform"
          >
            <Menu className="w-5 h-5 text-emerald-400" />
          </button>
          <span className="text-xs font-bold font-mono tracking-widest text-emerald-400 uppercase">
            VALT SYS
          </span>
        </div>
      </header>

      {/* 2. MOBILE OVERLAY BACKDROP */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* 3. MOBILE SLIDE-OUT DRAWER (ONLY on Mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-[#0A0A0A] border-r border-neutral-800 z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
            <span className="text-xs font-bold font-mono tracking-widest text-emerald-400 uppercase">
              VALT SYS
            </span>
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-1.5 flex flex-col items-start">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all w-fit ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-neutral-400"}`} />
                  <span className="truncate tracking-wide font-bold">{tab.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* 4. DESKTOP SIDEBAR (HIDDEN on Mobile) */}
      <aside
        className={`hidden md:flex bg-[#0A0A0A] border-r border-neutral-800 flex-col justify-between transition-all duration-300 shrink-0 h-full ${
          isExpanded ? "w-44" : "w-16"
        }`}
      >
        <div className="p-3 space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-neutral-700 transition-colors text-white"
            >
              <Menu className="w-5 h-5" />
            </button>

            {isExpanded && (
              <span className="text-xs font-bold font-mono tracking-widest text-emerald-400 pr-1 uppercase">
                VALT SYS
              </span>
            )}
          </div>

          <nav className="space-y-1.5 flex flex-col items-start">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all ${
                    isExpanded ? "w-fit" : "w-10 justify-center px-0"
                  } ${
                    isActive
                      ? "bg-neutral-800 text-white border border-neutral-700 shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                  title={!isExpanded ? tab.name : ""}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-neutral-400"}`} />
                  {isExpanded && <span className="truncate tracking-wide font-bold">{tab.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-neutral-800">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </aside>

      {/* 5. MAIN CONTENT VIEWPORT (Fully Edge-to-Edge for ALL Tabs) */}
      <main className="flex-1 h-full overflow-y-auto bg-black w-full p-0">
        {children}
      </main>
    </div>
  );
}