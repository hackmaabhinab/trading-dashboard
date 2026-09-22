"use client";

import React, { useState, useEffect, useRef } from "react";
// SSR-compatible client helper
import { createClient } from "@/utils/supabase/client";
import { 
  Plus, 
  Search, 
  Trash2, 
  Send, 
  Mic, 
  Bot, 
  RotateCw, 
  MessageSquare,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useConfirm } from "@/app/dashboard/layout";

export const dynamic = 'force-dynamic';

interface Message {
  id: string;
  sender: "user" | "volt";
  text: string;
  time: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function AnalyticsPage() {
  const { confirm, showAlert } = useConfirm();

  const [userName, setUserName] = useState<string>("TRADER");
  const [userId, setUserId] = useState<string | null>(null); // NEW: Added userId state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [tradesHistory, setTradesHistory] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPromptCategory, setSelectedPromptCategory] = useState<number>(0);
  
  // State for collapsible drawer / sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize SSR Supabase Client
  const supabase = createClient();

  // Quick Prompts & Sub-questions Mapping
  const promptCategories = [
    {
      main: "Why Am I Losing?",
      subPrompts: [
        "What am I doing wrong lately?",
        "What's causing my drawdowns?",
        "Find the pattern in my losing trades",
        "Show me my most expensive mistakes",
        "Which trades hurt my account the most?",
      ],
    },
    {
      main: "Where's My Edge?",
      subPrompts: [
        "Which setups give me the highest R:R?",
        "What is my highest win-rate entry pattern?",
        "Which trading session is most profitable for me?",
        "Am I better at longing or shorting?",
      ],
    },
    {
      main: "Am I Following My Plan?",
      subPrompts: [
        "Did I stick to my risk management rules?",
        "How often do I break my stop loss rules?",
        "Check my trade execution consistency",
        "Am I taking trades outside my session window?",
      ],
    },
    {
      main: "How Do I Get Better?",
      subPrompts: [
        "Actionable roadmap to improve win-rate",
        "How to optimize my position sizing?",
        "What should I focus on fixing this week?",
        "Give me 3 rules to reduce my drawdowns",
      ],
    },
  ];

  // Auto set sidebar state on desktop/mobile load
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  // 1. Fetch User Info & Trades from Supabase using SSR session
  useEffect(() => {
    fetchUserData();
    fetchJournalTrades();
  }, []);

  // 2. Load Persisted Sessions from LocalStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("volt_ai_sessions");
    if (savedSessions) {
      try {
        const parsed: ChatSession[] = JSON.parse(savedSessions);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      } catch (e) {
        console.error("Failed to parse saved sessions", e);
      }
    }
  }, []);

  // 3. Auto Scroll on Message Update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Save Sessions to LocalStorage whenever they change
  const saveSessionsToStorage = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem("volt_ai_sessions", JSON.stringify(updatedSessions));
  };

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id); // NEW: Save userId to state
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.username) {
          setUserName(profile.username.replace(/^@/, '').toUpperCase());
        } else {
          const name = user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split("@")[0] || "TRADER";
          setUserName(name.replace(/^@/, '').toUpperCase());
        }
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  };

  const fetchJournalTrades = async () => {
    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trades for AI:", error.message);
    } else if (data) {
      setTradesHistory(data);
    }
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSelectSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confirm({
      title: "DELETE CHAT SESSION",
      message: "Kya aap is chat session ko delete karna chahte hain?",
      onConfirm: () => {
        const updated = sessions.filter((s) => s.id !== sessionId);
        saveSessionsToStorage(updated);
        if (currentSessionId === sessionId) {
          handleNewChat();
        }
        showAlert({ title: "DELETED", message: "Chat session deleted successfully!", isSuccess: true });
      },
    });
  };

  const handleSendMessage = async (customText?: string) => {
    const queryText = customText || inputMessage;
    if (!queryText.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!customText) setInputMessage("");
    setLoading(true);

    let activeId = currentSessionId;
    let updatedSessions = [...sessions];

    if (!activeId) {
      activeId = Date.now().toString();
      setCurrentSessionId(activeId);
      const newSession: ChatSession = {
        id: activeId,
        title: queryText.length > 25 ? queryText.substring(0, 25) + "..." : queryText,
        messages: newMessages,
        createdAt: new Date().toISOString(),
      };
      updatedSessions = [newSession, ...updatedSessions];
    } else {
      updatedSessions = updatedSessions.map((s) =>
        s.id === activeId ? { ...s, messages: newMessages } : s
      );
    }
    saveSessionsToStorage(updatedSessions);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          module: "analytics",
          tradesHistory: tradesHistory,
          userId: userId // NEW: Passed userId in the payload
        }),
      });

      const data = await res.json();

      const voltMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "volt",
        text: data.reply || "Unable to fetch analysis from VOLT Terminal.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      const finalMessages = [...newMessages, voltMsg];
      setMessages(finalMessages);

      const finalSessions = updatedSessions.map((s) =>
        s.id === activeId ? { ...s, messages: finalMessages } : s
      );
      saveSessionsToStorage(finalSessions);
    } catch (err) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "volt",
        text: "Error connecting to VOLT AI Core. Check network or API key.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const finalMessages = [...newMessages, errorMsg];
      setMessages(finalMessages);

      const finalSessions = updatedSessions.map((s) =>
        s.id === activeId ? { ...s, messages: finalMessages } : s
      );
      saveSessionsToStorage(finalSessions);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-[#080808] text-neutral-200 font-sans overflow-hidden relative">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* Animated Drawer / Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-full w-72 bg-[#0D0D0D] border-r border-neutral-800/60 p-3 flex flex-col justify-between shrink-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-full md:w-0 md:p-0 md:border-none"
        }`}
      >
        <div className="space-y-4 overflow-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <div className="flex gap-0.5 items-center justify-center">
                  <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                  <span className="w-1 h-5 bg-emerald-400 rounded-full"></span>
                  <span className="w-1 h-3 bg-emerald-600 rounded-full"></span>
                </div>
              </div>
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-white tracking-wider font-mono truncate">VOLT AI</h2>
                <p className="text-[10px] text-neutral-500 truncate">Your Personal Coach</p>
              </div>
            </div>
            
            {/* Close drawer button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5 md:hidden" />
              <PanelLeftClose className="w-5 h-5 hidden md:block" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-neutral-800/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-all"
            />
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* History / Sessions List */}
          <div className="space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            <span className="text-[10px] text-neutral-500 font-semibold px-2 uppercase block mb-1 tracking-wider">
              History
            </span>
            {filteredSessions.length === 0 ? (
              <p className="text-xs text-neutral-500 px-2 py-1">No chats yet</p>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    currentSessionId === session.id
                      ? "bg-neutral-800/80 text-white font-medium"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-1">
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="truncate">{session.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 transition-opacity p-0.5"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sync Footer Info */}
        <div className="border-t border-neutral-900 pt-3 px-2 text-[10px] text-neutral-500 flex justify-between items-center">
          <span>Synced: {tradesHistory.length} Trades</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-[#050505] relative overflow-hidden">
        {/* Top Header / Navigation Toggle */}
        <div className="h-12 border-b border-neutral-900/80 bg-[#080808] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-all flex items-center gap-2"
                title="Open Sidebar"
              >
                <Menu className="w-5 h-5 md:hidden" />
                <PanelLeftOpen className="w-5 h-5 hidden md:block" />
              </button>
            )}
            <span className="text-xs font-semibold text-neutral-300 font-mono tracking-wider">
              VOLT TERMINAL / ANALYTICS
            </span>
          </div>
        </div>

        {/* Chat Messages Viewport */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 flex flex-col">
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center justify-center max-w-2xl mx-auto text-center w-full space-y-6">
              {/* Logo Symbol */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-700/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                <div className="flex gap-1.5 items-center justify-center">
                  <span className="w-1.5 h-8 bg-emerald-500 rounded-full"></span>
                  <span className="w-1.5 h-10 bg-emerald-400 rounded-full"></span>
                  <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                Hi {userName}, what should we look at today?
              </h1>

              {/* Main Prompt Input Box */}
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Ask question.."
                  className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500/50 rounded-2xl px-5 py-4 text-sm text-white placeholder-neutral-500 focus:outline-none shadow-xl pr-24 transition-all"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <button className="p-2 text-neutral-500 hover:text-neutral-300 transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || loading}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 disabled:opacity-40 rounded-xl transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap justify-center gap-2 w-full pt-2">
                {promptCategories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPromptCategory(idx);
                      handleSendMessage(cat.main);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                      selectedPromptCategory === idx
                        ? "bg-neutral-800 border-neutral-700 text-white"
                        : "bg-[#0F0F0F] border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-white"
                    }`}
                  >
                    {cat.main}
                  </button>
                ))}
              </div>

              {/* Dynamic Sub-Prompts List */}
              <div className="w-full text-left space-y-2 pt-2 max-w-lg mx-auto">
                {promptCategories[selectedPromptCategory].subPrompts.map((sub, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(sub)}
                    className="flex items-center gap-2 text-xs text-neutral-400 hover:text-emerald-400 transition-colors w-full text-left group py-1"
                  >
                    <span className="text-neutral-600 group-hover:text-emerald-400">↳</span>
                    <span>{sub}</span>
                  </button>
                ))}

                <button
                  onClick={() =>
                    setSelectedPromptCategory((prev) => (prev + 1) % promptCategories.length)
                  }
                  className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors pt-2"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Refresh options</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Chat View */
            <div className="max-w-3xl mx-auto w-full space-y-5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "volt" && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-emerald-600/20 border border-emerald-500/30 text-white"
                        : "bg-[#111111] border border-neutral-800 text-neutral-300 shadow-md"
                    }`}
                  >
                    {m.sender === "volt" ? (
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-2 uppercase tracking-wider">
                          VOLT AI
                        </span>
                        <div className="space-y-2 text-xs leading-6 text-neutral-300 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&_strong]:text-white [&_strong]:font-bold">
                          <ReactMarkdown>{m.text}</ReactMarkdown>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    )}
                    <span className="text-[9px] text-neutral-500 block text-right mt-2 font-mono">
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 justify-start max-w-3xl mx-auto w-full">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-3.5 text-xs text-neutral-400 flex items-center gap-2 italic">
                    <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                    VOLT AI is analyzing your journal data...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Sticky Input Field */}
        {messages.length > 0 && (
          <div className="p-4 border-t border-neutral-900 bg-[#0A0A0A] shrink-0">
            <div className="max-w-3xl mx-auto relative flex items-center">
              <input
                type="text"
                placeholder="Ask question.."
                className="w-full bg-[#121212] border border-neutral-800 focus:border-emerald-500/50 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none pr-12 transition-all"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={loading || !inputMessage.trim()}
                className="absolute right-2 p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-30 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}