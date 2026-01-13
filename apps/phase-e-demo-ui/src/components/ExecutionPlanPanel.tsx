/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 * 
 * ExecutionPlanPanel surfaces the proposed actions and requirements for a detected intent.
 * It is strictly for demonstration purposes and includes prominent banners indicating
 * that no actions are actually performed.
 */

"use client";

import React, { useState } from "react";
import type { ExecutionPlanResult } from "@/lib/types";

interface ExecutionPlanPanelProps {
  plan: ExecutionPlanResult | undefined;
  initialExpanded?: boolean;
}

export function ExecutionPlanPanel({ plan, initialExpanded = false }: ExecutionPlanPanelProps) {
  const [isOpen, setIsOpen] = useState(initialExpanded);

  if (!plan) {
    return null;
  }

  return (
    <div className="mt-3 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {/* PROMINENT DEMO BANNER */}
      <div className="bg-red-700 text-white px-3 py-1.5 flex flex-col items-center justify-center gap-0.5">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-[0.1em]">
            EXECUTION PLAN PREVIEW ONLY
          </span>
        </div>
        <span className="text-[9px] font-bold opacity-90">NO ACTIONS EXECUTED</span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md border bg-slate-50 border-slate-200 text-slate-700">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Execution Strategy Preview
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[10px] font-bold text-slate-500 uppercase hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            {isOpen ? "Collapse" : "Expand"}
            <svg
              className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-800 mb-4 italic leading-relaxed">
            "{plan.summary}"
          </p>

          {isOpen && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Proposed Actions */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Proposed Action Sequence
                </h4>
                <ul className="space-y-1.5">
                  {plan.proposedActions.length > 0 ? (
                    plan.proposedActions.map((action, i) => (
                      <li key={i} className="flex gap-2 text-xs text-slate-700">
                        <span className="text-slate-300 font-bold">•</span>
                        <span>{action}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-400 italic">No actions proposed for this intent.</li>
                  )}
                </ul>
              </div>

              {/* Confirmations */}
              {plan.requiredHumanConfirmations.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Required Human Confirmations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {plan.requiredHumanConfirmations.map((conf, i) => (
                      <div key={i} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] flex items-center gap-1.5">
                        <span className="font-black text-indigo-600">{conf.actor}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-600 font-medium">{conf.confirmationType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Data */}
              {plan.requiredData.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-orange-400 mb-2">
                    Required Data for Execution
                  </h4>
                  <ul className="space-y-1">
                    {plan.requiredData.map((data, i) => (
                      <li key={i} className="flex gap-2 text-xs text-orange-700">
                        <span className="text-orange-300 font-bold">?</span>
                        <span>{data}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Blocked By */}
              {plan.blockedBy.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-red-400 mb-2">
                    Execution Barriers
                  </h4>
                  <ul className="space-y-1">
                    {plan.blockedBy.map((reason, i) => (
                      <li key={i} className="flex gap-2 text-xs text-red-700">
                        <span className="text-red-300 font-bold">!</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evidence */}
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                  Evidence Base
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {plan.evidence.map((ev, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] text-slate-500">
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              ID: {plan.planId}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-[9px] font-black text-red-600 uppercase">Non-Executing</span>
            </div>
          </div>
          <div className="flex gap-1">
            {plan.disclaimers.map((d, i) => (
              <span key={i} className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
