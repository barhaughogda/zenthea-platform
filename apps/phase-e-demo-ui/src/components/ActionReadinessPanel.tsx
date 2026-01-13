/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 * 
 * ActionReadinessPanel surfaces what kind of human or system action would normally be required
 * for the detected intent. It is strictly advisory and includes clear banners indicating
 * that no actions are executed in this demo environment.
 */

"use client";

import React, { useState } from "react";
import type { ActionReadinessResult } from "@/lib/types";

interface ActionReadinessPanelProps {
  readiness: ActionReadinessResult | undefined;
  initialExpanded?: boolean;
}

export function ActionReadinessPanel({ readiness, initialExpanded = false }: ActionReadinessPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  if (!readiness) {
    return null;
  }

  const { category, explanation } = readiness;

  // Map categories to visual indicators
  const categoryConfig = {
    INFORMATIONAL_ONLY: {
      label: "Informational Only",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    REQUIRES_CLINICIAN_REVIEW: {
      label: "Requires Clinician Review",
      color: "bg-amber-50 border-amber-200 text-amber-700",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    REQUIRES_PATIENT_CONFIRMATION: {
      label: "Requires Patient Confirmation",
      color: "bg-indigo-50 border-indigo-200 text-indigo-700",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    REQUIRES_ADDITIONAL_DATA: {
      label: "Requires Additional Data",
      color: "bg-orange-50 border-orange-200 text-orange-700",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    NOT_ACTIONABLE_IN_SYSTEM: {
      label: "Not Actionable In System",
      color: "bg-slate-50 border-slate-200 text-slate-700",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    }
  }[category];

  return (
    <div className="mt-3 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
      {/* ADVISORY BANNER */}
      <div className="bg-amber-600 text-white px-3 py-1.5 flex items-center justify-center gap-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-[10px] font-black uppercase tracking-[0.1em]">
          ADVISORY ONLY / NO ACTIONS EXECUTED
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md border ${categoryConfig.color}`}>
              {categoryConfig.icon}
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Workflow Readiness Framing
            </h3>
          </div>
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
            <div className={`rounded-lg border p-4 ${categoryConfig.color} bg-opacity-30`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-current">
                  {categoryConfig.label}
                </span>
              </div>

              <p className="text-sm font-medium leading-relaxed">
                {explanation}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  NON-EXECUTING ASSISTANT
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  READ-ONLY DEMO
                </div>
              </div>
              
              <p className="text-[10px] text-slate-500 leading-relaxed italic bg-slate-50 p-2 rounded border border-slate-100">
                This framing is provided to illustrate typical workflow requirements. 
                This system does not perform the mentioned actions and no outcomes have been promised.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
