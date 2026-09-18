"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";
import { Bot, Send, User, Sparkles, Trash2, Pencil, X, Check } from "lucide-react";

interface ChatMessage {
  id?: number;
  sender: "user" | "assistant";
  message: string;
}

export default function AnalyticsPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tradesContext, setTradesContext] = useState<any[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch user trades for AI Context
      const { data: tradesData } = await supabase
        .from("trades")
        .select("*")
        .order("created_at", { ascending: false });

      if (tradesData) setTradesContext(tradesData);

      // 2. Load Chat history from Supabase
      const { data: chatData } = await supabase
        .from("ai_chats")
        .select("id, sender, message")
        .eq("module", "analytics")
        .order("created_at", { ascending: true });

      if (chatData && chatData.length > 0) {
        setMessages(chatData as ChatMessage[]);
      } else {
        setMessages([
          {
            sender: "assistant",
            message:
              "Welcome! I am your AI Trade Analytics Coach. I have synced with your trade journal. What would you like to analyze today?",
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

    // Optimistic UI Update
    const updatedChats: ChatMessage[] = [
      ...messages,
      { sender: "user", message: userMsg },
    ];
    setMessages(updatedChats);
    setLoading(true);

    // Save User message to Supabase
    const { data: insertedUserMsg } = await supabase
      .from("ai_chats")
      .insert([{ module: "analytics", sender: "user", message: userMsg }])
      .select("id")
      .single();

    if (insertedUserMsg) {
      setMessages((prev) =>
        prev.map((m, idx) =>
          idx === prev.length - 1 ? { ...m, id: insertedUserMsg.id } : m
        )
      );
    }

    try {
      // API call to Next.js API Route
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          module: "analytics",
          tradesHistory: tradesContext,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Failed to generate AI response");

      const aiReply = data.reply;

      // Save AI reply to Supabase
      const { data: insertedAiMsg } = await supabase
        .from("ai_chats")
        .insert([{ module: "analytics", sender: "assistant", message: aiReply }])
        .select("id")
        .single();

      setMessages((prev) => [
        ...prev,
        {
          id: insertedAiMsg?.id,
          sender: "assistant",
          message: aiReply,
        },
      ]);
    } catch (err: any) {
      console.error("AI Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          message: `⚠️ Error: ${
            err.message || "Failed to reach AI API. Check API Key."
          }`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // --- ÜZENET TÖRLÉSE ---
  const handleDeleteMessage = async (indexToDelete: number, msgId?: number) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    setMessages((prev) => prev.filter((_, idx) => idx !== indexToDelete));

    if (msgId) {
      try {
        await supabase.from("ai_chats").delete().eq("id", msgId);
      } catch (err) {
        console.error("Failed to delete message from DB:", err);
      }
    }
  };

  // --- SZERKESZTÉS INDÍTÁSA ---
  const startEditing = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditText(currentText);
  };

  // --- SZERKESZTÉS MENTÉSE ---
  const handleSaveEdit = async (index: number, msgId?: number) => {
    if (!editText.trim()) return;

    const updatedText = editText.trim();
    setMessages((prev) =>
      prev.map((m, idx) => (idx === index ? { ...m, message: updatedText } : m))
    );
    setEditingIndex(null);

    if (msgId) {
      try {
        await supabase
          .from("ai_chats")
          .update({ message: updatedText })
          .eq("id", msgId);
      } catch (err) {
        console.error("Failed to update message in DB:", err);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#070A10] min-h-screen text-slate-100 flex flex-col">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-500" /> AI Trade Analytics
        </h1>
        <p className="text-slate-400 text-sm">
          Live AI connected directly to your trading journal database
        </p>
      </div>

      <div className="flex-1 bg-[#0B0F17] border border-slate-800 rounded-xl p-4 flex flex-col h-[calc(100vh-220px)]">
        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`group flex items-start gap-3 ${
                m.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  m.sender === "user"
                    ? "bg-blue-600"
                    : "bg-slate-800 text-blue-400"
                }`}
              >
                {m.sender === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Formatted Markdown Chat Bubble */}
              <div
                className={`relative max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-blue-600/20 border border-blue-500/30 text-white"
                    : "bg-[#070A10] border border-slate-800 text-slate-200"
                }`}
              >
                {editingIndex === index ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full bg-[#070A10] border border-slate-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSaveEdit(index, m.id)}
                      className="text-emerald-400 hover:text-emerald-300 p-1"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="text-slate-400 hover:text-slate-300 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {m.sender === "assistant" ? (
                      <div className="prose prose-invert max-w-none text-sm space-y-2">
                        <ReactMarkdown>{m.message}</ReactMarkdown>
                      </div>
                    ) : (
                      m.message
                    )}

                    {/* Szerkesztés és Törlés gombok (hoverre jelennek meg) */}
                    <div
                      className={`absolute top-2 ${
                        m.sender === "user" ? "-left-16" : "-right-16"
                      } opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-[#0B0F17] border border-slate-800 p-1 rounded-lg`}
                    >
                      <button
                        onClick={() => startEditing(index, m.message)}
                        className="p-1 text-slate-400 hover:text-blue-400 rounded transition-colors"
                        title="Edit message"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(index, m.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono">
              <Bot className="h-4 w-4 animate-spin text-blue-500" /> AI is
              reading your journal and thinking...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Ask AI about your trades (e.g. 'What is my best setup?', 'Why am I losing on XAUUSD?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#070A10] border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <Send className="h-4 w-4" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}