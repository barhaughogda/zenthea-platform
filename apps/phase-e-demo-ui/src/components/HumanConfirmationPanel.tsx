/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * HumanConfirmationPanel surfaces what human confirmation would normally be required.
 * It previews WHO would confirm, WHAT decision would be required, and WHY.
 *
 * ALL options are rendered as DISABLED, READ-ONLY previews.
 * NO onClick handlers. NO hover states implying action.
 * This is a governance boundary visualization component.
 */

"use client";

import React, { useState } from "react";
import type { HumanConfirmationResult } from "@/lib/types";
import {
  getActorLabel,
  getDecisionTypeLabel,
} from "@/lib/confirmationPreviewEngine";

interface HumanConfirmationPanelProps {
  confirmation: HumanConfirmationResult | undefined;
  initialExpanded?: boolean;
}

/**
 * Returns actor-specific icon and color configuration.
 */
function getActorConfig(actor: HumanConfirmationResult["requiredActor"]) {
  switch (actor) {
    case "PATIENT":
      return {
        color: "bg-indigo-50 border-indigo-300 text-indigo-700",
        iconBg: "bg-indigo-100",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      };
    case "CLINICIAN":
      return {
        color: "bg-emerald-50 border-emerald-300 text-emerald-700",
        iconBg: "bg-emerald-100",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        ),
      };
    case "OPERATOR":
      return {
        color: "bg-amber-50 border-amber-300 text-amber-700",
        iconBg: "bg-amber-100",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
      };
    case "NONE":
    default:
      return {
        color: "bg-slate-50 border-slate-300 text-slate-600",
        iconBg: "bg-slate-100",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      };
  }
}

export function HumanConfirmationPanel({
  confirmation,
  initialExpanded = false,
}: HumanConfirmationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  // Don't render if no confirmation data or if no actor required
  if (!confirmation || confirmation.requiredActor === "NONE") {
    return null;
  }

  const { requiredActor, decisionType, previewOptions, explanation, rationale } =
    confirmation;
  const actorConfig = getActorConfig(requiredActor);

  return (
    <div className="mt-3 bg-white border border-purple-200 rounded-lg overflow-hidden shadow-sm">
      {/* PREVIEW ONLY BANNER — Critical governance boundary */}
      <div className="bg-purple-700 text-white px-3 py-2 flex items-center justify-center gap-2">
        <svg
          className="w-4 h-4 text-purple-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span className="text-[11px] font-black uppercase tracking-[0.15em]">
          HUMAN CONFIRMATION · PREVIEW ONLY
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-bold text-slate-500 uppercase hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            {isExpanded ? "Collapse" : "Expand"}
            <svg
              className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {isExpanded && (
          <>
            {/* WHO Section */}
            <div className={`rounded-lg border-2 p-4 ${actorConfig.color}`}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${actorConfig.iconBg}`}>
                  {actorConfig.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
                      Who Would Normally Confirm
                    </span>
                  </div>
                  <p className="text-base font-bold">{getActorLabel(requiredActor)}</p>
                  <p className="text-sm mt-1 opacity-90">{explanation}</p>
                </div>
              </div>
            </div>

            {/* WHAT Section */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                  What Decision Would Be Required
                </span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {getDecisionTypeLabel(decisionType)}
              </p>

              {/* Preview Options — DISABLED, READ-ONLY */}
              {previewOptions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Typical Decision Options (Preview Only)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {previewOptions.map((option, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed select-none opacity-70"
                        aria-disabled="true"
                        role="presentation"
                      >
                        <svg
                          className="w-3 h-3 mr-1.5 opacity-50"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WHY Section */}
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                  Why Confirmation Would Be Required
                </span>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">{rationale}</p>
            </div>

            {/* Footer — Governance reinforcement */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>Preview Only</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>No Actions Executed</span>
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-md p-2.5">
                <p className="text-[10px] text-purple-700 text-center leading-relaxed font-medium">
                  This is a read-only preview. No action has been taken.
                  <br />
                  <span className="opacity-75">
                    Decision options shown above are disabled and for illustration only.
                  </span>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
