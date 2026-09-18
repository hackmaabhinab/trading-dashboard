"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import { Brain, Send, User, Bot, HeartHandshake } from "lucide-react";

interface ChatMessage {
  id?: number;
  sender: "user" | "assistant";
  message: string;
}

export default function PsychologyPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tradesContext, setTradesContext] = useState<any[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: tradesData } = await supabase
        .from("trades")
        .select("pair, emotion, outcome, risk_percent, setup, notes")
        .order("created_at", { ascending: false });

      if (tradesData) setTradesContext(tradesData);

      const { data: chatData } = await supabase
        .from("ai_chats")
        .select("sender, message")
        .eq("module", "psychology")
        .order("created_at", { ascending: true });

      if (chatData && chatData.length > 0) {
        setMessages(chatData as ChatMessage[]);
      } else {
        setMessages([
          {
            sender: "assistant",
            message:
              "Welcome to your Psychology & Mindset Sanctuary. I am here to help you master emotional control, overcome FOMO, deal with loss streaks, and execute like a disciplined institutional trader. What is on your mind?",
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
      { module: "psychology", sender: "user", message: userMsg },
    ]);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          module: "psychology",
          tradesHistory: tradesContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate AI response");

      const aiReply = data.reply;
      setMessages((prev) => [...prev, { sender: "assistant", message: aiReply }]);

      await supabase.from("ai_chats").insert([
        { module: "psychology", sender: "assistant", message: aiReply },
      ]);
    } catch (err: any) {
      console.error("AI Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          message: `⚠️ Error: ${err.message || "Failed to connect to Psychology AI"}`,
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
          <Brain className="h-6 w-6 text-purple-500" /> Psychology & Mindset AI
        </h1>
        <p className="text-slate-400 text-sm">
          Trading psychology specialist based on Mark Douglas & institutional mindset
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
                  m.sender === "user" ? "bg-purple-600" : "bg-slate-800 text-purple-400"
                }`}
              >
                {m.sender === "user" ? <User className="h-4 w-4" /> : <HeartHandshake className="h-4 w-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-purple-600/20 border border-purple-500/30 text-white"
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
              <Bot className="h-4 w-4 animate-spin text-purple-500" /> AI Coach is preparing mindset advice...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Discuss your fear, greed, revenge trades, or mindset issues..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#070A10] border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}