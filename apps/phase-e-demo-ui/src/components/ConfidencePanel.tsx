/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * ConfidencePanel displays the epistemic classification of assistant outputs.
 * All annotations are deterministic and read-only.
 * Surfacing uncertainty increases perceived safety and clinical appropriateness.
 */

"use client";

import React, { useState } from "react";
import type { ConfidenceAnnotation } from "@/lib/types";
import { getConfidenceColor, getCategoryLabel } from "@/lib/confidenceEngine";

interface ConfidencePanelProps {
  annotations: ConfidenceAnnotation[];
  initialExpanded?: boolean;
}

export function ConfidencePanel({ 
  annotations, 
  initialExpanded = true 
}: ConfidencePanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  if (!annotations || annotations.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {/* Demo Advisory Banner */}
      <div className="bg-slate-700 text-white px-3 py-1.5 flex items-center justify-center gap-2 border-b border-slate-800">
        <svg 
          className="w-3 h-3 text-amber-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Read-Only Advisory · Confidence & Uncertainty Annotation
        </span>
      </div>

      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-2.5 bg-slate-100 hover:bg-slate-200 transition-colors border-b border-slate-200"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-700"
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
          <span className="text-sm font-bold text-slate-900">
            Statement Attribution (Safety View)
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span className="text-xs font-medium">
            {isExpanded ? "Hide Details" : "Show Details"}
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3">
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-2">
            Every assistant output is classified by its source of truth:
          </p>
          
          <div className="space-y-3">
            {annotations.map((annotation, i) => (
              <div
                key={i}
                className={`rounded-lg p-3 border ${getConfidenceColor(annotation.confidence)} shadow-sm`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/60 border border-current shadow-sm">
                    {getCategoryLabel(annotation.category)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Confidence:</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {annotation.confidence}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm font-semibold leading-relaxed mb-2">
                  {annotation.statement}
                </p>
                
                <div className="pt-2 border-t border-current/10">
                  <div className="flex items-start gap-1.5">
                    <span className="text-[9px] font-black uppercase text-slate-500 mt-0.5">Why:</span>
                    <p className="text-[11px] italic leading-tight opacity-90">
                      {annotation.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer disclaimer */}
          <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Read-Only Demo Environment</span>
              <span>Rule-Based Logic</span>
            </div>
            <p className="text-[9px] text-slate-500 text-center leading-relaxed italic border border-slate-100 p-2 rounded bg-white">
              Uncertainty is explicitly surfaced to prevent over-reliance on demo data. 
              No medical advice or clinical recommendations are provided.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
