"use client";

/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * ComparativePanel displays temporal and comparative insights for the current query.
 * Sourced from the deterministic comparative engine.
 * No medical advice, no recommendations, pure observation.
 */

import React, { useState } from "react";
import type { ComparativeInsights } from "@/lib/types";

interface ComparativePanelProps {
  insights: ComparativeInsights;
  initialExpanded?: boolean;
}

export function ComparativePanel({ insights, initialExpanded = true }: ComparativePanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden mt-4">
      {/* Demo banner */}
      <div className="bg-blue-600 text-white px-3 py-1.5 flex items-center gap-2">
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs font-bold uppercase tracking-wide">
          DEMO DATA • READ-ONLY • OBSERVATIONAL ONLY • NO ACTIONS EXECUTED
        </span>
      </div>

      {/* Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-2 bg-slate-100 border-b border-slate-200 hover:bg-slate-150 transition-colors"
      >
        <div className="flex items-center gap-2">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-sm font-bold text-slate-700">
            Comparative Signals (Demo, Read-only)
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {isExpanded ? "Collapse" : "Expand"}
        </span>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Last Encounter Summary */}
          {insights.lastEncounter ? (
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Compared to last encounter
              </h4>
              <div className="text-sm text-slate-700 mb-2">
                <span className="font-semibold">Last encounter:</span> {insights.lastEncounter} 
                {insights.timeSinceLastEncounterDays !== undefined && (
                  <span className="ml-2 text-slate-500">
                    ({insights.timeSinceLastEncounterDays} days ago)
                  </span>
                )}
              </div>
              {insights.differencesVsLastEncounter.length > 0 ? (
                <ul className="space-y-1">
                  {insights.differencesVsLastEncounter.map((diff, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-slate-400">•</span>
                      {diff}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic">No significant keyword differences detected vs last encounter.</p>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800 italic">No prior encounter available in demo timeline.</p>
            </div>
          )}

          {/* Trends */}
          {insights.trends.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Trends
              </h4>
              <ul className="space-y-1">
                {insights.trends.map((trend, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-slate-400">•</span>
                    {trend}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gaps */}
          {insights.gaps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Gaps
              </h4>
              <ul className="space-y-1">
                {insights.gaps.map((gap, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-red-400">•</span>
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Based On (Evidence Attribution) */}
          {insights.evidenceAttribution.length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Based on
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {insights.evidenceAttribution.map((attr, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer disclaimer */}
          <div className="pt-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">
            DETERMINISTIC COMPARISON • OBSERVATIONAL ONLY
          </div>
        </div>
      )}
    </div>
  );
}
