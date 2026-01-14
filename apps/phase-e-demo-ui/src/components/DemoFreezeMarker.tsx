/**
 * DEMO FROZEN · CANONICAL WALKTHROUGH
 *
 * Phase R-13: Demo Freeze Marker
 *
 * Small, neutral, non-authoritative UI indicator signaling that the demo
 * is a fixed, governed walkthrough. Muted styling, non-interactive.
 */

import React from "react";

export function DemoFreezeMarker() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-100 border border-slate-200 shadow-sm select-none" title="This demo is a fixed, governed walkthrough. Behavior does not change between runs.">
      <div className="w-2 h-2 rounded-full bg-slate-400" />
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 leading-none">
          DEMO FROZEN
        </span>
        <span className="text-[8px] font-medium text-slate-500 uppercase tracking-tight leading-none mt-0.5">
          Canonical Walkthrough
        </span>
      </div>
    </div>
  );
}
