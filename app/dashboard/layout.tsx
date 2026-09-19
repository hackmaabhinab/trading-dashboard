"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart2, 
  BookOpen, 
  LineChart, 
  Radio, 
  Layers, 
  Users, 
  Settings, 
  ChevronRight,
  Menu,
  X,
  Newspaper,
  FlaskConical
} from "lucide-react";

const navTabs = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Journal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Live Chart", href: "/dashboard/chart", icon: LineChart },
  { name: "Signals", href: "/dashboard/signals", icon: Radio },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Strategy", href: "/dashboard/strategy", icon: Layers },
  { name: "News", href: "/dashboard/news", icon: Newspaper },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-black text-slate-200 overflow-hidden font-sans">
      {/* Collapsible Drawer Sidebar */}
      <aside
        className={`bg-[#0A0A0A] border-r border-neutral-800 flex flex-col justify-between transition-all duration-300 z-50 shrink-0 h-full ${
          isExpanded ? "w-60" : "w-16"
        }`}
      >
        <div className="p-3 space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-neutral-700 transition-colors text-white"
            >
              {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {isExpanded && (
              <span className="text-xs font-bold font-mono tracking-widest text-neutral-400 pr-2 uppercase">
                VALT SYS
              </span>
            )}
          </div>

          <nav className="space-y-1.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-neutral-800 text-white border border-neutral-700 shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                  title={!isExpanded ? tab.name : ""}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-neutral-400"}`} />
                  {isExpanded && <span className="truncate tracking-wide">{tab.name}</span>}
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

      {/* Main Dynamic Viewport - Vertical Scroll Enabled */}
      <main className="flex-1 h-full overflow-y-auto bg-black p-0 w-full">
        {children}
      </main>
    </div>
  );
}