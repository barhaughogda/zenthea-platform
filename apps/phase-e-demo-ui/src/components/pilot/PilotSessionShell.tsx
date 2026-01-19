"use client";

import React from "react";

interface PilotSessionShellProps {
  children: React.ReactNode;
}

/**
 * PilotSessionShell - Wrapper component for the guided pilot flow
 * 
 * Provides consistent styling and the demo mode banner.
 * Emphasizes clinician control and non-automation for demo audiences.
 */
export function PilotSessionShell({ children }: PilotSessionShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Top-level demo mode trust banner */}
      <div className="bg-amber-500 text-white px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold tracking-wide">
            DEMO MODE · NO AUTOMATION · CLINICIAN-CONTROLLED
          </span>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Pilot Clinical Experience
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Guided end-to-end clinician workflow
              </p>
            </div>
            
            {/* Demo mode badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-300 rounded-lg shadow-sm">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
              <div className="text-left">
                <span className="text-xs font-bold text-amber-800 block">
                  Demo Mode Active
                </span>
                <span className="text-[10px] text-amber-600">
                  All actions require clinician initiation
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer trust signal */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-xs text-center text-slate-500">
            This demonstration illustrates clinician-controlled documentation. 
            No autonomous actions are performed. All decisions require explicit clinician confirmation.
          </p>
        </div>
      </footer>
    </div>
  );
}
