"use client";

/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Phase R-12: Demo Trust Ledger Panel
 *
 * This component displays a human-inspectable ledger of applied transformation layers.
 * It is for transparency, regulatory review, and operator inspection.
 * UI-ONLY: NO execution, NO intelligence, NO side effects.
 */

import React, { useState } from "react";
import { buildDemoTrustLedger, type TrustLedgerEntry } from "@/lib/demoTrustLedger";

interface DemoTrustLedgerPanelProps {
  initialExpanded?: boolean;
}

export function DemoTrustLedgerPanel({
  initialExpanded = false,
}: DemoTrustLedgerPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const ledger = buildDemoTrustLedger();

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-2 bg-slate-100 border-b border-slate-200 hover:bg-slate-150 transition-colors"
      >
        <div className="flex flex-col items-start">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm font-bold text-slate-700">
              Demo Trust Ledger (Read-Only)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            Transparency surface • No execution • No authority
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {isExpanded ? "Collapse" : "Expand"}
        </span>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3 bg-white">
          <div className="space-y-2">
            {ledger.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50"
              >
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {entry.label}
                    </h4>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 font-bold border border-slate-300">
                        {entry.status}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold border border-slate-200">
                        {entry.scope}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer disclaimer */}
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">
            DETERMINISTIC PIPELINE • NO LLM CALLS • REGULATORY TRANSPARENCY
          </div>
        </div>
      )}
    </div>
  );
}
