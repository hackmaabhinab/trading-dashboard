'use client';

import { useState, useEffect } from 'react';

export function useDashboardData(userId = 'default_user_abhinav') {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Database se data fetch karne ke liye function
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ai?userId=${userId}`, {
        method: 'GET',
      });
      const json = await res.json();
      
      if (res.ok) {
        setData(json);
      } else {
        setError(json.message || 'Failed to sync with database');
      }
    } catch (err: any) {
      setError(err.message || 'Network error connecting to database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // AI Module query bhejane ya data save karne ke liye function
  const sendAiQuery = async (message: string, module: string, tradesHistory?: any[]) => {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message, module, tradesHistory })
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'AI Request Failed');
      
      return json.reply;
    } catch (err: any) {
      console.error("AI Hook Error:", err);
      return null;
    }
  };

  return { data, loading, error, fetchUserData, sendAiQuery };
}