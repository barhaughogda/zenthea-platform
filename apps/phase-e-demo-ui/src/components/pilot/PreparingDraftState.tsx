"use client";

import React from "react";

interface PreparingDraftStateProps {
  isVisible: boolean;
}

/**
 * PreparingDraftState - Deterministic transition state
 * 
 * Shows a full-width loading state while "preparing" the draft.
 * Duration is deterministic (not dependent on actual processing).
 */
export function PreparingDraftState({ isVisible }: PreparingDraftStateProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full mx-4 text-center">
        {/* Animated spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-emerald-200 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-t-teal-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Preparing your notes draft
        </h2>
        
        <p className="text-gray-600 mb-6">
          Summarizing the consultation and drafting clinical documentation
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>

        {/* Safety notice */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Demo mode · Draft requires clinician review before finalizing
          </p>
        </div>
      </div>
    </div>
  );
}
