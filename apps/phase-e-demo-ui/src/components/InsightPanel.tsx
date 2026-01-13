/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * InsightPanel displays the synthesis and pattern detection results
 * for a user message. All analysis is deterministic and read-only.
 */

"use client";

import React, { useState, useMemo } from "react";
import type { RelevanceResult } from "@/lib/types";
import { analyzeTimeline } from "@/lib/synthesisEngine";

interface InsightPanelProps {
  relevance: RelevanceResult;
  initialExpanded?: boolean;
}

export function InsightPanel({ relevance, initialExpanded = true }: InsightPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Perform deterministic analysis
  const analysis = useMemo(() => {
    return analyzeTimeline(relevance.intent, relevance.selectedItems);
  }, [relevance.intent, relevance.selectedItems]);

  // If insufficient context, don't show the detailed analysis section
  if (relevance.selectedItems.length < 2) {
    return null;
  }

  return (
    <div className="mt-3 bg-indigo-50 border border-indigo-200 rounded-lg overflow-hidden shadow-sm">
      {/* Demo banner */}
      <div className="bg-indigo-600 text-white px-3 py-1 flex items-center justify-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest">
          DEMO DATA · READ-ONLY · NO ACTIONS EXECUTED
        </span>
      </div>

      {/* Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-2.5 bg-indigo-100 hover:bg-indigo-200 transition-colors border-b border-indigo-200"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-indigo-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span className="text-sm font-bold text-indigo-900">
            What Stands Out (Read-Only Analysis)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold uppercase">
            {analysis.patterns.length} Pattern{analysis.patterns.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs text-indigo-600 font-medium">
            {isExpanded ? "Collapse" : "Expand"}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Synthesis Paragraph */}
          <div className="bg-white/80 rounded-lg p-3 border border-indigo-100">
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1.5">
              Synthesis
            </h4>
            <p className="text-sm text-indigo-900 leading-relaxed italic">
              "{analysis.synthesis}"
            </p>
          </div>

          {/* Pattern Bullets */}
          <div>
            <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
              Detected Patterns
            </h4>
            <div className="space-y-2">
              {analysis.standOutSummary.map((bullet, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-white/60 p-2 rounded border border-indigo-50"
                >
                  <span className="text-indigo-500 mt-1 flex-shrink-0">•</span>
                  <p className="text-xs text-indigo-800 font-medium leading-tight">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Attribution Footer */}
          <div className="pt-3 border-t border-indigo-200 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[9px] text-indigo-400 font-bold uppercase tracking-wider">
              <span>Based on demo patient timeline</span>
              <span>Deterministic Logic</span>
            </div>
            <p className="text-[9px] text-indigo-500 text-center uppercase tracking-widest font-medium">
              Language is observational · No clinical recommendations
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
