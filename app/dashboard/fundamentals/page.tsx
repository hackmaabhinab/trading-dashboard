"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import { Globe2, Send, User, Bot, TrendingUp } from "lucide-react";

interface ChatMessage {
  id?: number;
  sender: "user" | "assistant";
  message: string;
}

export default function FundamentalsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: chatData } = await supabase
        .from("ai_chats")
        .select("sender, message")
        .eq("module", "fundamentals")
        .order("created_at", { ascending: true });

      if (chatData && chatData.length > 0) {
        setMessages(chatData as ChatMessage[]);
      } else {
        setMessages([
          {
            sender: "assistant",
            message:
              "Welcome to Forex Fundamentals AI. Ask me about macroeconomics, CPI inflation data, NFP jobs reports, Federal Reserve Interest Rate decisions, or macroeconomic direction for Gold (XAUUSD) & Major Forex Pairs!",
          },
        ]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");

    const updatedChats: ChatMessage[] = [
      ...messages,
      { sender: "user", message: userMsg },
    ];
    setMessages(updatedChats);
    setLoading(true);

    await supabase.from("ai_chats").insert([
      { module: "fundamentals", sender: "user", message: userMsg },
    ]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          module: "fundamentals",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate AI response");

      const aiReply = data.reply;
      setMessages((prev) => [...prev, { sender: "assistant", message: aiReply }]);

      await supabase.from("ai_chats").insert([
        { module: "fundamentals", sender: "assistant", message: aiReply },
      ]);
    } catch (err: any) {
      console.error("AI Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          message: `⚠️ Error: ${err.message || "Failed to connect to Fundamentals AI"}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#070A10] min-h-screen text-slate-100 flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Globe2 className="h-6 w-6 text-emerald-500" /> Forex Fundamentals AI
        </h1>
        <p className="text-slate-400 text-sm">
          Macroeconomic news analysis, Central Bank policies & CPI/NFP market impact
        </p>
      </div>

      <div className="flex-1 bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-col h-[calc(100vh-220px)]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                m.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  m.sender === "user" ? "bg-emerald-600" : "bg-slate-800 text-emerald-400"
                }`}
              >
                {m.sender === "user" ? <User className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-emerald-600/20 border border-emerald-500/30 text-white"
                    : "bg-[#070A10] border border-slate-800 text-slate-200"
                }`}
              >
                {m.sender === "assistant" ? (
                  <div className="prose prose-invert max-w-none text-sm space-y-2">
                    <ReactMarkdown>{m.message}</ReactMarkdown>
                  </div>
                ) : (
                  m.message
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
              <Bot className="h-4 w-4 animate-spin text-emerald-500" /> AI is analyzing economic data...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Ask about NFP news, Interest rates impact, Gold direction..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#070A10] border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}