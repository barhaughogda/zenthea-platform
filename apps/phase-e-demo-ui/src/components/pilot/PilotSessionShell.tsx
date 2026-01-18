"use client";

import React from "react";

interface PilotSessionShellProps {
  children: React.ReactNode;
}

/**
 * PilotSessionShell - Wrapper component for the guided pilot flow
 * 
 * Provides consistent styling and the demo mode banner.
 */
export function PilotSessionShell({ children }: PilotSessionShellProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Pilot Clinical Experience
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Guided end-to-end clinician workflow
              </p>
            </div>
            
            {/* Demo mode badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-amber-700">
                Demo mode · No automation · Clinician-controlled
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
