/**
 * DEMO ONLY — NARRATIVE MODE BANNER — NO AUTHORITY
 *
 * Phase R-03: Demo Narrative Mode Visual Indicator
 *
 * Displays the current demo mode clearly at all times.
 * Uses observational, conditional language — never implies permission or authority.
 */

"use client";

import React from "react";
import { useDemoMode, type DemoMode } from "@/lib/demoModeContext";

/**
 * Banner configuration per mode.
 * All copy uses observational language (demonstrates, shows, illustrates).
 */
const MODE_BANNERS: Record<
  DemoMode,
  {
    label: string;
    sublabel: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    iconPath: string;
  }
> = {
  guided: {
    label: "GUIDED DEMO · FIXED NARRATIVE · NO IMPROVISATION",
    sublabel: "This sequence illustrates a predefined scenario. Prompts are ordered and locked.",
    bgClass: "bg-indigo-600",
    textClass: "text-white",
    borderClass: "border-indigo-700",
    iconPath:
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
  },
  free: {
    label: "FREE EXPLORATION · READ-ONLY · NO ACTIONS EXECUTED",
    sublabel: "This mode illustrates open exploration. All responses are observational only.",
    bgClass: "bg-emerald-600",
    textClass: "text-white",
    borderClass: "border-emerald-700",
    iconPath:
      "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7",
  },
};

/**
 * Demo Mode Banner Component.
 * Displays mode indicator and step progress (for guided mode).
 */
export function DemoModeBanner() {
  const { mode, guidedStep, totalSteps, isGuidedComplete } = useDemoMode();
  const config = MODE_BANNERS[mode];

  return (
    <div
      className={`${config.bgClass} ${config.textClass} px-4 py-3 rounded-lg border ${config.borderClass} shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={config.iconPath}
            />
          </svg>
          <span className="text-sm font-bold tracking-wide">{config.label}</span>
        </div>

        {/* Step indicator for guided mode */}
        {mode === "guided" && !isGuidedComplete && (
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <span className="text-xs font-bold">
              Step {guidedStep + 1} of {totalSteps}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= guidedStep ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed badge for guided mode */}
        {mode === "guided" && isGuidedComplete && (
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-xs font-bold">Narrative Complete</span>
          </div>
        )}
      </div>

      <p className="text-xs mt-1.5 opacity-90">{config.sublabel}</p>
    </div>
  );
}

/**
 * Compact step indicator for use in tight spaces.
 * Only renders in guided mode.
 */
export function GuidedStepIndicator() {
  const { mode, guidedStep, totalSteps, isGuidedComplete } = useDemoMode();

  if (mode !== "guided") return null;

  if (isGuidedComplete) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Complete
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
      Step {guidedStep + 1} of {totalSteps}
    </span>
  );
}
