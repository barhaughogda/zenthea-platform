/**
 * PREVIEW ONLY — NOT RECORDED — NO ACTION TAKEN
 * 
 * This component displays what WOULD be recorded in an audit/evidence system
 * if execution were enabled. This is for accountability demonstration only.
 */

"use client";

import React, { useState } from "react";
import type { PreviewAuditEvent } from "@/lib/types";

interface PreviewAuditPanelProps {
  auditTrail: PreviewAuditEvent[];
  initialExpanded?: boolean;
}

export function PreviewAuditPanel({
  auditTrail,
  initialExpanded = false,
}: PreviewAuditPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});

  if (!auditTrail || auditTrail.length === 0) {
    return null;
  }

  const togglePayload = (id: string) => {
    setExpandedPayloads((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toTimeString().split(" ")[0]; // HH:MM:SS
  };

  return (
    <div className="mt-3 bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
      {/* PREVIEW ONLY BANNER */}
      <div className="bg-neutral-800 text-white px-3 py-1.5 flex items-center justify-center gap-2 border-b border-neutral-900">
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
        <span className="text-[10px] font-bold uppercase tracking-widest text-center">
          PREVIEW AUDIT TRAIL · NOT RECORDED · NO ACTION TAKEN
        </span>
      </div>

      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 transition-colors border-b border-neutral-200"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-neutral-700"
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
          <span className="text-sm font-bold text-neutral-900">
            Accountability & Policy Preview
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-500">
          <span className="text-xs font-medium">
            {isExpanded ? "Hide Audit Trail" : "Show Audit Trail"}
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
        <div className="p-4 space-y-4">
          <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider mb-2">
            The following events would normally be written to an immutable audit log:
          </p>

          <div className="space-y-4">
            {auditTrail.map((event) => (
              <div key={event.id} className="border-l-2 border-neutral-300 pl-4 py-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-400">
                      {formatTimestamp(event.ts)}
                    </span>
                    <span className="text-[10px] font-bold bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {event.actor}
                    </span>
                    <span className="text-[11px] font-black text-neutral-800 uppercase tracking-tight">
                      {event.type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-1 rounded">
                    {event.sliceOrPhase}
                  </span>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                  {event.summary}
                </p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {event.policyBasis.map((policy, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {policy}
                    </span>
                  ))}
                </div>

                <div className="mt-2">
                  <button
                    onClick={() => togglePayload(event.id)}
                    className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-600 transition-colors flex items-center gap-1"
                  >
                    {expandedPayloads[event.id] ? "[-] Hide" : "[+] Show"} Payload Preview (Metadata Only)
                  </button>
                  {expandedPayloads[event.id] && (
                    <pre className="mt-2 p-2 bg-neutral-900 text-neutral-300 text-[10px] rounded overflow-x-auto font-mono border border-neutral-800 shadow-inner">
                      {JSON.stringify(event.payloadPreview, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer disclaimer */}
          <div className="mt-4 pt-3 border-t border-neutral-200 space-y-2">
            <div className="flex justify-between items-center text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
              <span>Non-Execution Preview</span>
              <span>Session-Only Trace</span>
            </div>
            <p className="text-[9px] text-neutral-500 text-center leading-relaxed italic bg-white p-2 rounded border border-neutral-100">
              This trail is not persisted and is for simulation purposes only. 
              No records have been created in the Zenthea Evidence Store.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
