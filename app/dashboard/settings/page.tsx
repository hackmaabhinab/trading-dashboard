"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Save, Loader2, Check, LogOut, ShieldAlert, KeyRound } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useConfirm } from "@/app/dashboard/layout"; 

export default function SettingsPage() {
  const supabase = createClient();
  const { confirm, showAlert } = useConfirm(); // Yahan dono hooks nikal liye

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);

  // States
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  // Password Update States
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    async function loadUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          if (isMounted) setLoading(false);
          return;
        }

        const user = session.user;
        if (isMounted) {
          setUserId(user.id);
          setEmail(user.email || "");
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, username")
          .eq("id", user.id)
          .maybeSingle();

        if (profile && isMounted) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
          setUsername(profile.username || "");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  // Save Profile changes
  const handleSaveChanges = async () => {
    if (!userId) {
      showAlert({ title: "AUTHENTICATION ERROR", message: "User session not found. Please log in." });
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          username: username,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      showAlert({ title: "SAVE FAILED", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  // Direct Password Update Function
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showAlert({ title: "INVALID PASSWORD", message: "Password must be at least 6 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      showAlert({ title: "PASSWORD MISMATCH", message: "New passwords do not match!" });
      return;
    }

    setUpdatingPass(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      showAlert({ title: "SUCCESS", message: "Password updated successfully!", isSuccess: true });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showAlert({ title: "UPDATE FAILED", message: err.message });
    } finally {
      setUpdatingPass(false);
    }
  };

  // Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Delete All Journal Data & AI Chats Function
  const handleDeleteAllData = () => {
    confirm({
      title: "WARNING: DELETE ALL DATA",
      message: "This will permanently delete all your logged trades and AI chat history. Your login account will remain active. Proceed?",
      onConfirm: async () => {
        setSaving(true);
        try {
          const { error: tradesError } = await supabase
            .from("trades")
            .delete()
            .eq("user_id", userId);

          if (tradesError) throw tradesError;

          const { error: notesError } = await supabase
            .from("daily_notes")
            .delete()
            .eq("user_id", userId);

          if (notesError) throw notesError;

          localStorage.removeItem("volt_ai_sessions");

          showAlert({ title: "DATA WIPED", message: "All journal trades and chat history have been erased.", isSuccess: true });
          await supabase.auth.signOut();
          window.location.href = "/login";
        } catch (err: any) {
          showAlert({ title: "DELETION FAILED", message: err.message });
        } finally {
          setSaving(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center text-emerald-400 gap-2 font-bold text-sm">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading Account Profile...</span>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-neutral-100 p-8 md:p-12 font-sans select-none flex flex-col items-center">
      
      <div className="w-full max-w-5xl space-y-8 my-auto">
        
        {/* HEADER SECTION */}
        <div className="text-left flex items-center justify-between border-b border-neutral-800/80 pb-6">
          <div>
            <p className="text-xs font-black text-neutral-500 uppercase tracking-widest">
              PERSONAL & ACCOUNT
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-1">
              Personal Info & Settings
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-bold text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-neutral-400" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* PROFILE BOX */}
        <div className="bg-[#0A0A0A] border border-neutral-800/80 rounded-2xl p-7 space-y-5 shadow-2xl">
          <h2 className="text-base font-black text-white tracking-wide">
            Profile Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
                className="w-full bg-black/90 border border-neutral-800/90 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter Last Name"
                className="w-full bg-black/90 border border-neutral-800/90 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* ACCOUNT CREDENTIALS BOX */}
        <div className="bg-[#0A0A0A] border border-neutral-800/80 rounded-2xl p-7 space-y-5 shadow-2xl">
          <h2 className="text-base font-black text-white tracking-wide">
            Account Credentials
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
                className="w-full bg-black/90 border border-neutral-800/90 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400">Email (Logged-in Account)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-neutral-900/60 border border-neutral-800/60 rounded-xl px-4 py-3.5 text-sm font-bold text-emerald-400 cursor-not-allowed select-none"
              />
            </div>
          </div>
        </div>

        {/* DIRECT PASSWORD CHANGE BOX */}
        <div className="bg-[#0A0A0A] border border-neutral-800/80 rounded-2xl p-7 space-y-5 shadow-2xl">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-black text-white tracking-wide">
              Change Password Directly
            </h2>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/90 border border-neutral-800/90 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-400">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/90 border border-neutral-800/90 rounded-xl px-4 py-3.5 text-sm font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updatingPass}
                className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {updatingPass ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* ACTION BUTTONS & DANGER ZONE */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={handleDeleteAllData}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Delete All Data</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/10 transition-all active:scale-95 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}