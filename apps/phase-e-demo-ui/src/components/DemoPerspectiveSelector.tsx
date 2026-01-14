/**
 * DEMO ONLY — PERSPECTIVE FRAMING — NO AUTHORITY CHANGES
 *
 * Phase R-02: Demo Perspective Selector Component
 *
 * This component allows switching between demo perspectives to change
 * which panels are expanded/collapsed by default. It clearly indicates
 * that this is a VISIBILITY-ONLY control with no permission implications.
 *
 * Visual requirements:
 * - No new colors that imply authority
 * - No buttons added (uses radio/select pattern)
 * - No calls to action
 * - No role icons that imply permissions
 */

"use client";

import React from "react";
import {
  useDemoPerspective,
  type DemoPerspective,
  getPerspectiveLabel,
} from "@/lib/demoPerspectiveContext";

/**
 * Demo Perspective Selector
 *
 * Allows switching demo perspectives without:
 * - Resetting session
 * - Recomputing reasoning
 * - Changing permissions
 * - Granting authority
 */
export function DemoPerspectiveSelector() {
  const { perspective, setPerspective, helperText } = useDemoPerspective();

  const perspectives: DemoPerspective[] = ["patient", "clinician", "operator"];

  return (
    <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 mb-4">
      {/* Header with visibility-only label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Demo Perspective
          </span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-200 rounded">
            Visibility Only
          </span>
        </div>
      </div>

      {/* Perspective options */}
      <div className="flex gap-2 mb-2">
        {perspectives.map((p) => (
          <label
            key={p}
            className={`
              flex-1 cursor-pointer text-center py-2 px-3 rounded border text-sm font-medium transition-colors
              ${
                perspective === p
                  ? "bg-slate-700 text-white border-slate-700"
                  : "bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              }
            `}
          >
            <input
              type="radio"
              name="demo-perspective"
              value={p}
              checked={perspective === p}
              onChange={() => setPerspective(p)}
              className="sr-only"
            />
            {getPerspectiveLabel(p)}
          </label>
        ))}
      </div>

      {/* Perspective-specific helper text */}
      <p className="text-[11px] text-slate-500 text-center italic leading-relaxed">
        {helperText}
      </p>

      {/* Footer disclaimer */}
      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-center gap-2">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          No permissions granted
        </span>
        <span className="text-slate-300">•</span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          UI emphasis only
        </span>
      </div>
    </div>
  );
}
