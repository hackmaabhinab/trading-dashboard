'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

type Feedback = { title?: string; message: string; isSuccess?: boolean };
type FeedbackContextValue = { showAlert: (feedback: Feedback) => void };
const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedback() {
  const value = useContext(FeedbackContext);
  if (!value) throw new Error('useFeedback must be used within FeedbackProvider');
  return value;
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<Feedback | null>(null);
  const showAlert = (feedback: Feedback) => setAlert(feedback);
  const iconClass = alert?.isSuccess
    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
    : 'border-amber-500/30 bg-amber-500/10 text-amber-400';
  const buttonClass = alert?.isSuccess
    ? 'bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-400'
    : 'bg-amber-500 shadow-amber-500/20 hover:bg-amber-400';

  return (
    <FeedbackContext.Provider value={{ showAlert }}>
      {children}
      {alert ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in select-none" role="presentation">
          <div className="relative w-full max-w-md space-y-5 rounded-xl border border-neutral-800 bg-[#0A0A0A] p-6 shadow-2xl animate-scale-up" role="alertdialog" aria-modal="true" aria-labelledby="feedback-title">
            <div className="flex items-start gap-4">
              <div className={'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ' + iconClass}>
                {alert.isSuccess ? <Info className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              </div>
              <div className="space-y-1">
                <h3 id="feedback-title" className="text-sm font-black uppercase tracking-wider text-white">{alert.title || (alert.isSuccess ? 'SUCCESS' : 'NOTICE')}</h3>
                <p className="text-xs font-bold leading-relaxed text-neutral-400">{alert.message}</p>
              </div>
            </div>
            <div className="flex justify-end border-t border-neutral-800/80 pt-2">
              <button onClick={() => setAlert(null)} className={'rounded-lg px-6 py-2 text-xs font-black uppercase tracking-wider text-black shadow-lg transition-all active:scale-95 ' + buttonClass}>OK</button>
            </div>
          </div>
        </div>
      ) : null}
    </FeedbackContext.Provider>
  );
}
