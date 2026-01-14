/**
 * DEMO ONLY — GUIDED PROMPT LIST — NO EXECUTION
 *
 * Phase R-03: Guided Demo Prompt List Component
 *
 * Displays ordered prompts for guided demo mode with step tracking.
 * In guided mode:
 * - Prompts are locked to predefined ordered set
 * - Clicking a prompt fills input and advances step
 * - Free-text input is disabled until current step is used
 *
 * In free mode:
 * - All prompts are visible and optional
 * - No step indicator
 * - Free-text input is always enabled
 *
 * This component ONLY affects UI presentation. It does NOT:
 * - Change assistant logic or reasoning
 * - Enable execution or confirmation
 * - Modify data access or authority
 */

"use client";

import React from "react";
import { useDemoMode } from "@/lib/demoModeContext";

interface GuidedPromptListProps {
  /** Callback when a prompt is selected */
  onSelectPrompt: (prompt: string) => void;
  /** Whether the assistant is currently processing */
  isProcessing: boolean;
}

/**
 * Sample prompts for free exploration mode.
 * Same set as original but presented differently.
 */
const FREE_MODE_PROMPTS = [
  "What happened at the last visit?",
  "Can I schedule an appointment?",
  "Show me the lab results",
  "Draft a clinical note summary",
  "Tell me about my medications",
  "What was the diagnosis?",
];

/**
 * Guided Prompt List Component.
 * Renders differently based on demo mode.
 */
export function GuidedPromptList({
  onSelectPrompt,
  isProcessing,
}: GuidedPromptListProps) {
  const {
    mode,
    guidedStep,
    totalSteps,
    currentGuidedPrompt,
    guidedPrompts,
    isGuidedComplete,
    advanceGuidedStep,
  } = useDemoMode();

  /**
   * Handle prompt click in guided mode.
   * Advances step counter and fills input.
   */
  const handleGuidedPromptClick = (prompt: string, index: number) => {
    if (isProcessing) return;
    if (index !== guidedStep) return; // Only current step is clickable
    onSelectPrompt(prompt);
    advanceGuidedStep();
  };

  /**
   * Handle prompt click in free mode.
   * Simply fills input.
   */
  const handleFreePromptClick = (prompt: string) => {
    if (isProcessing) return;
    onSelectPrompt(prompt);
  };

  // Guided mode rendering
  if (mode === "guided") {
    return (
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-indigo-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-indigo-800">
            Guided Narrative Prompts
          </h3>
          {!isGuidedComplete && (
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
              Use each prompt in order
            </span>
          )}
        </div>

        {isGuidedComplete ? (
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-2 text-indigo-600 mb-2">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-bold">
                Guided Narrative Complete
              </span>
            </div>
            <p className="text-xs text-gray-500">
              This demonstration has illustrated all predefined scenarios.
              Free-text input is now available.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {guidedPrompts.map((prompt, index) => {
              const isCurrent = index === guidedStep;
              const isPast = index < guidedStep;
              const isFuture = index > guidedStep;

              return (
                <button
                  key={prompt}
                  onClick={() => handleGuidedPromptClick(prompt, index)}
                  disabled={isProcessing || !isCurrent}
                  className={`w-full text-left text-sm px-4 py-3 rounded-lg border transition-all ${
                    isCurrent
                      ? "bg-indigo-50 border-indigo-400 text-indigo-800 font-medium cursor-pointer hover:bg-indigo-100"
                      : isPast
                        ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed line-through"
                        : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                  } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          isCurrent
                            ? "bg-indigo-600 text-white"
                            : isPast
                              ? "bg-gray-300 text-white"
                              : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {isPast ? (
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span>"{prompt}"</span>
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                        Current
                      </span>
                    )}
                    {isPast && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Used
                      </span>
                    )}
                    {isFuture && (
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Locked
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <p className="text-[10px] text-gray-500 mt-3 text-center italic">
          Guided mode demonstrates a fixed narrative. Prompts are executed in
          order.
        </p>
      </div>
    );
  }

  // Free mode rendering (original behavior with styling updates)
  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-700">
          Sample prompts (optional):
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
          Free exploration
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {FREE_MODE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleFreePromptClick(prompt)}
            disabled={isProcessing}
            className="text-left text-sm px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 text-gray-700 disabled:opacity-50 transition-colors"
          >
            "{prompt}"
          </button>
        ))}
      </div>
      <p className="text-[10px] text-gray-500 mt-3 text-center italic">
        Free exploration mode illustrates open-ended interaction. All outputs
        are observational only.
      </p>
    </div>
  );
}
