"use client";

/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * RelevancePanel displays the intent classification and relevant timeline items
 * for a user message. All data is sourced from the static demo timeline.
 * No inference, no execution, no persistence.
 */

import React, { useState } from "react";
import type { RelevanceResult, ScoredTimelineItem } from "@/lib/types";
import { getIntentLabel } from "@/lib/intentClassifier";
import { formatDate } from "@/lib/relevanceSelector";

interface RelevancePanelProps {
  relevance: RelevanceResult;
}

/**
 * Intent badge color mapping.
 */
function getIntentBadgeStyles(intent: RelevanceResult["intent"]): string {
  const styles: Record<RelevanceResult["intent"], string> = {
    scheduling: "bg-blue-100 text-blue-800 border-blue-200",
    clinical_drafting: "bg-green-100 text-green-800 border-green-200",
    record_summary: "bg-purple-100 text-purple-800 border-purple-200",
    billing_explanation: "bg-amber-100 text-amber-800 border-amber-200",
    unknown: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return styles[intent];
}

/**
 * Event type badge color mapping.
 */
function getEventTypeBadgeStyles(type: ScoredTimelineItem["type"]): string {
  const styles: Record<ScoredTimelineItem["type"], string> = {
    visit: "bg-blue-50 text-blue-700 border-blue-200",
    note: "bg-green-50 text-green-700 border-green-200",
    event: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return styles[type];
}

/**
 * Renders a single timeline item card.
 */
function TimelineItemCard({ item }: { item: ScoredTimelineItem }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-gray-500">
            {formatDate(item.date)}
          </span>
          <span
            className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${getEventTypeBadgeStyles(item.type)}`}
          >
            {item.type}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400">Score:</span>
          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
            {item.score}
          </span>
        </div>
      </div>
      <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
      <p className="text-xs text-gray-600 leading-relaxed">{item.summary}</p>
      <div className="mt-2 flex gap-1 flex-wrap">
        {item.scoreBreakdown.typeMatch > 0 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            +{item.scoreBreakdown.typeMatch} type match
          </span>
        )}
        {item.scoreBreakdown.keywordMatch > 0 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
            +{item.scoreBreakdown.keywordMatch} keyword
          </span>
        )}
        {item.scoreBreakdown.recencyBonus > 0 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-700 border border-violet-200">
            +{item.scoreBreakdown.recencyBonus} recent
          </span>
        )}
      </div>
    </div>
  );
}

export function RelevancePanel({ relevance }: RelevancePanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden mt-3">
      {/* Demo banner - always visible */}
      <div className="bg-red-600 text-white px-3 py-1.5 flex items-center gap-2">
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-xs font-bold uppercase tracking-wide">
          DEMO DATA • READ-ONLY • NO ACTIONS EXECUTED
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span className="text-sm font-bold text-slate-700">
            Reasoning Context (Intent-Aware)
          </span>
          <span
            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getIntentBadgeStyles(relevance.intent)}`}
          >
            {getIntentLabel(relevance.intent)}
          </span>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {isExpanded ? "Collapse" : "Expand"}
        </span>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Relevance Explanation */}
          <div className="bg-white border border-slate-200 rounded-lg p-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Relevance Explanation
            </h4>
            <ul className="space-y-1">
              {relevance.explanation.map((bullet, i) => (
                <li key={i} className="text-sm text-slate-700 leading-relaxed">
                  {bullet.startsWith("•") ? (
                    <span className="pl-2">{bullet}</span>
                  ) : (
                    bullet
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Selected Items */}
          {relevance.selectedItems.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Top {relevance.selectedItems.length} Relevant Items
              </h4>
              <div className="space-y-2">
                {relevance.selectedItems.map((item, i) => (
                  <TimelineItemCard key={i} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* No evidence state */}
          {!relevance.hasEvidence && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex gap-2">
                <svg
                  className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">No matching evidence found</p>
                  <p className="text-xs mt-1 text-amber-700">
                    The demo timeline does not contain items matching this
                    query. Try asking about visits, appointments, or clinical
                    notes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer disclaimer */}
          <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">
            DETERMINISTIC SELECTION • NO LLM INFERENCE • VERBATIM TIMELINE DATA
          </div>
        </div>
      )}
    </div>
  );
}
