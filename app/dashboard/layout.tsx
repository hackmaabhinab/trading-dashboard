"use client";

import { useState, createContext, useContext } from "react";
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
  Newspaper,
  AlertTriangle,
  Info,
  History // <- Added History icon for Backtest
} from "lucide-react";

// 1. Global Confirm & Alert Context Setup
interface ConfirmContextType {
  confirm: (options: { title?: string; message: string; onConfirm: () => void }) => void;
  showAlert: (options: { title?: string; message: string; isSuccess?: boolean }) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within DashboardLayout");
  }
  return context;
}

const navTabs = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Journal", href: "/dashboard/journal", icon: BookOpen },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Live Chart", href: "/dashboard/chart", icon: LineChart },
  { name: "Backtest", href: "/dashboard/backtest", icon: History }, // <- Added Backtest Tab
  { name: "News", href: "/dashboard/news", icon: Newspaper },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Strategy", href: "/dashboard/strategy", icon: Layers },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Global Modal State (Supports both Confirm & Alert)
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: "confirm" | "alert";
    title: string;
    message: string;
    isSuccess: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    isSuccess: false,
    onConfirm: () => {},
  });

  const confirm = ({ title = "WARNING", message, onConfirm }: { title?: string; message: string; onConfirm: () => void }) => {
    setModalState({ isOpen: true, type: "confirm", title, message, isSuccess: false, onConfirm });
  };

  const showAlert = ({ title = "NOTICE", message, isSuccess = false }: { title?: string; message: string; isSuccess?: boolean }) => {
    setModalState({ isOpen: true, type: "alert", title, message, isSuccess, onConfirm: () => {} });
  };

  return (
    <ConfirmContext.Provider value={{ confirm, showAlert }}>
      <div className="flex flex-col md:flex-row h-screen w-screen bg-black text-slate-200 overflow-hidden font-sans">
        
        {/* MOBILE TOP HEADER */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-neutral-800 shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white active:scale-95 transition-transform cursor-pointer"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
            </button>
            <span className="text-xs font-bold font-mono tracking-widest text-emerald-400 uppercase">
              VALT SYS
            </span>
          </div>
        </header>

        {/* MOBILE OVERLAY BACKDROP */}
        {mobileOpen && (
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-sm transition-opacity"
          />
        )}

        {/* MOBILE SLIDE-OUT DRAWER */}
<aside
  className={`fixed inset-y-0 left-0 w-fit max-w-[75vw] bg-[#0A0A0A] border-r border-neutral-800 z-50 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:hidden ${
    mobileOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  <div className="p-4 space-y-6">
    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 gap-6">
      <span className="text-xs font-bold font-mono tracking-widest text-emerald-400 uppercase whitespace-nowrap">
        VALT SYS
      </span>
      <button 
        onClick={() => setMobileOpen(false)}
        className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    <nav className="space-y-1.5 flex flex-col items-stretch">
      {navTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all w-full ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-md"
                : "text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-neutral-400"}`} />
            <span className="truncate tracking-wide font-bold whitespace-nowrap">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  </div>
</aside>
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`hidden md:flex bg-[#0A0A0A] border-r border-neutral-800 flex-col justify-between transition-all duration-300 shrink-0 h-full ${
            isExpanded ? "w-44" : "w-16"
          }`}
        >
          <div className="p-3 space-y-6">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-neutral-700 transition-colors text-white cursor-pointer"
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
              className="w-full flex items-center justify-center p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 transition-colors cursor-pointer"
            >
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT VIEWPORT */}
        <main className="flex-1 h-full overflow-y-auto bg-black w-full p-0 relative">
          {children}
        </main>

        {/* GLOBAL ANIMATED MODAL (CONFIRM & ALERT) */}
        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none p-4">
            <div className="w-full max-w-md bg-[#0A0A0A] border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-5 animate-scale-up relative">
              
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  modalState.type === "confirm" 
                    ? "bg-red-500/10 border-red-500/30 text-red-400" 
                    : modalState.isSuccess 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}>
                  {modalState.type === "confirm" ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">{modalState.title}</h3>
                  <p className="text-xs font-bold text-neutral-400 leading-relaxed">
                    {modalState.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800/80">
                {modalState.type === "confirm" ? (
                  <>
                    <button
                      onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                      className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-black transition-all active:scale-95 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        modalState.onConfirm();
                        setModalState(prev => ({ ...prev, isOpen: false }));
                      }}
                      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-black text-xs font-black tracking-wider uppercase shadow-lg shadow-red-500/20 transition-all active:scale-95 cursor-pointer"
                    >
                      Proceed / Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                    className={`px-6 py-2 rounded-lg text-black text-xs font-black tracking-wider uppercase shadow-lg transition-all active:scale-95 cursor-pointer ${
                      modalState.isSuccess 
                        ? "bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20" 
                        : "bg-amber-500 hover:bg-amber-400 shadow-amber-500/20"
                    }`}
                  >
                    OK
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </ConfirmContext.Provider>
  );
}