/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * ConfirmationPreviewModal provides an interactive, but non-executing,
 * human confirmation experience. Users can click through a realistic
 * confirmation flow while understanding that NOTHING actually happens.
 *
 * STRICT CONSTRAINTS:
 * - NO execution
 * - NO external API calls
 * - NO persistence
 * - NO side effects
 * - ALL buttons update in-memory UI state ONLY
 */

"use client";

import React from "react";
import type { PreviewConfirmationRecord } from "@/lib/types";
import {
  getActorDisplayConfig,
  formatPreviewTimestamp,
} from "@/lib/interactivePreviewEngine";

interface ConfirmationPreviewModalProps {
  /** The preview confirmation record to display */
  record: PreviewConfirmationRecord;
  /** Called when user acknowledges the preview (session-only) */
  onAcknowledge: () => void;
  /** Called when user cancels/closes the modal */
  onCancel: () => void;
  /** Whether the modal is open */
  isOpen: boolean;
}

/**
 * Icon components for actor display
 */
function ActorIcon({ iconName }: { iconName: "user" | "shield" | "building" | "info" }) {
  switch (iconName) {
    case "user":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      );
    case "shield":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
    case "building":
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      );
    case "info":
    default:
      return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
}

/**
 * Color class mapping for actors
 */
function getColorClasses(color: string): {
  bg: string;
  border: string;
  text: string;
  iconBg: string;
} {
  const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-300",
      text: "text-indigo-700",
      iconBg: "bg-indigo-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    },
    amber: {
      bg: "bg-amber-50",
      border: "border-amber-300",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
    },
    slate: {
      bg: "bg-slate-50",
      border: "border-slate-300",
      text: "text-slate-600",
      iconBg: "bg-slate-100",
    },
  };
  return colorMap[color] || colorMap.slate;
}

export function ConfirmationPreviewModal({
  record,
  onAcknowledge,
  onCancel,
  isOpen,
}: ConfirmationPreviewModalProps) {
  if (!isOpen) {
    return null;
  }

  const actorConfig = getActorDisplayConfig(record.actor);
  const colors = getColorClasses(actorConfig.colorClass);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* MANDATORY HEADER — PREVIEW ONLY */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-800 px-6 py-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg
              className="w-5 h-5 text-purple-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-white font-black text-sm uppercase tracking-wider">
              PREVIEW ONLY
            </span>
          </div>
          <p className="text-purple-200 text-center text-xs font-medium">
            No action will be taken
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* WHO Section */}
          <div className={`rounded-lg border-2 p-4 ${colors.bg} ${colors.border}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-lg ${colors.iconBg} ${colors.text}`}>
                <ActorIcon iconName={actorConfig.iconName} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                  Who Would Normally Confirm
                </p>
                <p className={`text-lg font-bold ${colors.text}`}>{actorConfig.label}</p>
                <p className="text-sm text-slate-600 mt-1">{actorConfig.description}</p>
              </div>
            </div>
          </div>

          {/* WHAT Section */}
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                What Is Being Acknowledged
              </p>
            </div>
            <p className="text-sm font-medium text-slate-800 italic">
              "{record.intentSummary}"
            </p>
          </div>

          {/* WHAT WOULD NORMALLY HAPPEN Section */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                What Would Normally Happen Next
              </p>
            </div>
            <ul className="space-y-2">
              {record.wouldNormallyHappen.map((item, index) => (
                <li key={index} className="flex gap-2 text-sm text-blue-800">
                  <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WHY Section */}
          <div className="bg-amber-50 rounded-lg border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                Why Confirmation Would Be Required
              </p>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              {record.confirmationRationale}
            </p>
          </div>

          {/* Session Context */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span>
              Session Role: <span className="font-bold">{record.sessionRole}</span>
            </span>
            <span>
              Preview ID: <span className="font-mono">{record.previewId.slice(-12)}</span>
            </span>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
          {/* Reinforcement text */}
          <div className="bg-purple-100 border border-purple-200 rounded-md p-3 mb-4">
            <p className="text-[11px] text-purple-700 text-center font-medium leading-relaxed">
              <span className="font-black">PREVIEW ONLY</span> — Clicking "Acknowledge Preview"
              will record your acknowledgment in this session only. No action will be taken.
              No data will be persisted.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onAcknowledge}
              className="flex-1 px-4 py-2.5 rounded-lg border-2 border-purple-600 bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 hover:border-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Acknowledge Preview
            </button>
          </div>

          {/* Final disclaimer */}
          <p className="text-[9px] text-slate-400 text-center mt-3 uppercase tracking-wider font-bold">
            Session-only · No persistence · No execution · No side effects
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Badge component to display after acknowledgment.
 */
interface PreviewAcknowledgmentBadgeProps {
  record: PreviewConfirmationRecord;
}

export function PreviewAcknowledgmentBadge({ record }: PreviewAcknowledgmentBadgeProps) {
  const isAcknowledged = record.state === "PREVIEW_ACKNOWLEDGED";
  const isDenied = record.state === "PREVIEW_DENIED";

  if (!isAcknowledged && !isDenied) {
    return null;
  }

  return (
    <div
      className={`mt-3 rounded-lg border-2 p-3 ${
        isAcknowledged
          ? "bg-green-50 border-green-300"
          : "bg-red-50 border-red-300"
      }`}
    >
      <div className="flex items-center gap-2">
        {isAcknowledged ? (
          <svg
            className="w-4 h-4 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
        <div className="flex-1">
          <p
            className={`text-xs font-bold ${
              isAcknowledged ? "text-green-700" : "text-red-700"
            }`}
          >
            {isAcknowledged
              ? "Human confirmation preview acknowledged"
              : "Human confirmation preview declined"}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            No action taken · {record.sessionRole} ·{" "}
            {formatPreviewTimestamp(record.timestamp)}
          </p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-purple-100 border border-purple-200">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
          <span className="text-[9px] font-black text-purple-700 uppercase tracking-wider">
            Preview Only
          </span>
        </div>
      </div>
    </div>
  );
}
