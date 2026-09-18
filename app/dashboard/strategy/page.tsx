"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Compass, Plus, CheckCircle2, ShieldCheck, Sparkles, X, Trash2, Video, ExternalLink, Edit3 } from "lucide-react";

interface Strategy {
  id?: number | string;
  title: string;
  timeframe: string;
  pairs: string;
  winRate: number | string;
  targetRr: string;
  rules: string[];
  author?: string;
  youtubeUrl?: string;
}

export default function StrategyPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [timeframe, setTimeframe] = useState("15M");
  const [pairs, setPairs] = useState("XAUUSD");
  const [winRate, setWinRate] = useState("65");
  const [targetRr, setTargetRr] = useState("1:2");
  const [rulesText, setRulesText] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [publishing, setPublishing] = useState(false);

  // Fetch Custom Strategies Only
  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    let customStrategies: Strategy[] = [];

    try {
      const { data, error } = await supabase
        .from("strategies")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        customStrategies = data.map((item) => ({
          id: item.id,
          title: item.title,
          timeframe: item.timeframe,
          pairs: item.pairs,
          winRate: item.win_rate ?? item.winRate ?? 50,
          targetRr: item.target_rr ?? item.targetRr ?? "1:2",
          author: item.author || "Admin (You)",
          youtubeUrl: item.youtube_url || item.youtubeUrl || "",
          rules: Array.isArray(item.rules)
            ? item.rules
            : typeof item.rules === "string"
            ? item.rules.split("\n").filter((r: string) => r.trim() !== "")
            : []
        }));
      }
    } catch (err) {
      console.error("Supabase fetch failed:", err);
    }

    if (customStrategies.length === 0) {
      const localData = localStorage.getItem("custom_strategies");
      if (localData) {
        try {
          customStrategies = JSON.parse(localData);
        } catch (e) {
          console.error("Local storage parse error:", e);
        }
      }
    }

    setStrategies(customStrategies);
  };

  // Open Form to Edit Existing Strategy
  const handleEditClick = (st: Strategy) => {
    setEditingId(st.id || null);
    setTitle(st.title || "");
    setTimeframe(st.timeframe || "15M");
    setPairs(st.pairs || "XAUUSD");
    setWinRate(String(st.winRate || "65"));
    setTargetRr(st.targetRr || "1:2");
    setRulesText(Array.isArray(st.rules) ? st.rules.join("\n") : "");
    setYoutubeUrl(st.youtubeUrl || "");
    setShowEditor(true);
  };

  // Reset Form
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setTimeframe("15M");
    setPairs("XAUUSD");
    setWinRate("65");
    setTargetRr("1:2");
    setRulesText("");
    setYoutubeUrl("");
    setShowEditor(false);
  };

  // Save (Create or Update) Strategy
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || publishing) return;

    setPublishing(true);

    const rulesArray = rulesText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const strategyPayload = {
      title: title.trim(),
      timeframe: timeframe.trim() || "15M",
      pairs: pairs.trim() || "XAUUSD",
      win_rate: parseInt(winRate) || 50,
      target_rr: targetRr.trim() || "1:2",
      rules: rulesArray,
      author: "Admin (You)",
      youtube_url: youtubeUrl.trim()
    };

    if (editingId) {
      // --- UPDATE EXISTING STRATEGY ---
      // Local Storage Update
      const existingLocal: Strategy[] = JSON.parse(localStorage.getItem("custom_strategies") || "[]");
      const updatedLocal = existingLocal.map((st) =>
        String(st.id) === String(editingId)
          ? {
              ...st,
              title: strategyPayload.title,
              timeframe: strategyPayload.timeframe,
              pairs: strategyPayload.pairs,
              winRate: strategyPayload.win_rate,
              targetRr: strategyPayload.target_rr,
              rules: strategyPayload.rules,
              youtubeUrl: strategyPayload.youtube_url
            }
          : st
      );
      localStorage.setItem("custom_strategies", JSON.stringify(updatedLocal));

      // Supabase DB Update
      try {
        await supabase
          .from("strategies")
          .update(strategyPayload)
          .eq("id", editingId);
      } catch (err) {
        console.error("Database update failed:", err);
      }
    } else {
      // --- CREATE NEW STRATEGY ---
      const newLocalStrategy: Strategy = {
        id: Date.now(),
        title: strategyPayload.title,
        timeframe: strategyPayload.timeframe,
        pairs: strategyPayload.pairs,
        winRate: strategyPayload.win_rate,
        targetRr: strategyPayload.target_rr,
        rules: strategyPayload.rules,
        author: strategyPayload.author,
        youtubeUrl: strategyPayload.youtube_url
      };

      const existingLocal = JSON.parse(localStorage.getItem("custom_strategies") || "[]");
      const updatedLocal = [newLocalStrategy, ...existingLocal];
      localStorage.setItem("custom_strategies", JSON.stringify(updatedLocal));

      try {
        await supabase.from("strategies").insert([strategyPayload]);
      } catch (err) {
        console.error("Database insert exception:", err);
      }
    }

    await fetchStrategies();
    setPublishing(false);
    resetForm();
  };

  // Delete Strategy
  const handleDelete = async (id?: number | string) => {
    if (!confirm("Are you sure you want to delete this strategy?")) return;

    const existingLocal: Strategy[] = JSON.parse(localStorage.getItem("custom_strategies") || "[]");
    const updatedLocal = existingLocal.filter((item) => String(item.id) !== String(id));
    localStorage.setItem("custom_strategies", JSON.stringify(updatedLocal));

    if (id) {
      try {
        await supabase.from("strategies").delete().eq("id", id);
      } catch (err) {
        console.error("Delete failed in DB:", err);
      }
    }

    setStrategies((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  return (
    <div className="p-6 space-y-8 bg-[#070A10] min-h-screen text-slate-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Compass className="h-6 w-6 text-blue-500" /> Institutional Playbook & Strategies
          </h1>
          <p className="text-slate-400 text-sm">
            Proven execution models, entry rules, and edge frameworks published by Admin
          </p>
        </div>

        <button
          onClick={() => {
            if (showEditor) {
              resetForm();
            } else {
              setShowEditor(true);
            }
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          {showEditor ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showEditor ? "Close Editor" : "Publish Strategy"}
        </button>
      </div>

      {/* Form Editor */}
      {showEditor && (
        <form
          onSubmit={handlePublish}
          className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl relative"
        >
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Sparkles className="h-4 w-4" /> {editingId ? "Edit Strategy (Admin)" : "Admin Strategy Publisher"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                STRATEGY TITLE
              </label>
              <input
                type="text"
                placeholder="e.g. ICT Silver Bullet"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                TIMEFRAME
              </label>
              <input
                type="text"
                placeholder="15M / 1H"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                APPLICABLE PAIR(S)
              </label>
              <input
                type="text"
                placeholder="XAUUSD, EURUSD"
                value={pairs}
                onChange={(e) => setPairs(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                HISTORICAL WIN RATE (%)
              </label>
              <input
                type="number"
                placeholder="65"
                value={winRate}
                onChange={(e) => setWinRate(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                TARGET R:R RATIO
              </label>
              <input
                type="text"
                placeholder="1:3"
                value={targetRr}
                onChange={(e) => setTargetRr(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Video className="h-3 w-3" /> YOUTUBE VIDEO LINK
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full bg-[#070A10] border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              EXECUTION RULES (ENTER EACH RULE ON A NEW LINE)
            </label>
            <textarea
              rows={4}
              placeholder="1. Mark liquidity sweep&#10;2. Wait for MSS on 5m&#10;3. Enter at FVG"
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="w-full bg-[#070A10] border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={publishing}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {publishing
                ? editingId
                  ? "Updating..."
                  : "Publishing..."
                : editingId
                ? "Update Strategy"
                : "Publish Strategy to Dashboard"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      )}

      {/* Strategies Grid */}
      {strategies.length === 0 ? (
        <div className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          No strategies published yet. Click on <strong>"Publish Strategy"</strong> to add your first strategy.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {strategies.map((st, idx) => (
            <div
              key={st.id || idx}
              className="bg-[#0B0F17] border border-slate-800 rounded-2xl p-6 space-y-5 flex flex-col justify-between relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 uppercase tracking-wider">
                    {st.pairs}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold mr-2">
                      Timeframe: <span className="text-white font-bold">{st.timeframe}</span>
                    </span>

                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => handleEditClick(st)}
                      title="Edit Strategy"
                      className="text-slate-500 hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-blue-500/10"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(st.id)}
                      title="Delete Strategy"
                      className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-white tracking-tight">{st.title}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                  <span className="bg-[#070A10] border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                    Est. Win Rate: <strong className="text-emerald-400">{st.winRate}%</strong>
                  </span>
                  <span className="bg-[#070A10] border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                    Target R:R: <strong className="text-blue-400">{st.targetRr}</strong>
                  </span>

                  {/* YouTube Link Button */}
                  {st.youtubeUrl && (
                    <a
                      href={st.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Watch Tutorial</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    EXECUTION CHECKLIST:
                  </p>
                  <div className="space-y-2">
                    {st.rules.map((rule, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-start gap-2.5 bg-[#070A10] border border-slate-800/80 p-2.5 rounded-xl text-xs text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Author: <strong className="text-slate-400">{st.author || "Admin"}</strong>
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" /> Verified Edge
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}