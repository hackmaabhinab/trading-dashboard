'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in select-none p-4">
      <div className="w-full max-w-md bg-[#0A0A0A] border border-neutral-800 rounded-xl p-6 shadow-2xl space-y-5 animate-scale-up relative">
        
        {/* Warning Icon & Header */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">{title}</h3>
            <p className="text-xs font-bold text-neutral-400 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800/80">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-black transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-black text-xs font-black tracking-wider uppercase shadow-lg shadow-red-500/20 transition-all active:scale-95 cursor-pointer"
          >
            Proceed / Delete
          </button>
        </div>

      </div>
    </div>
  );
}