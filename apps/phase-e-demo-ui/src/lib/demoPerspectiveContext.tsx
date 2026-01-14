/**
 * DEMO ONLY — PERSPECTIVE FRAMING — NO AUTHORITY CHANGES
 *
 * Phase R-02: Demo Perspective Framing Layer
 *
 * This context provides a UI-only perspective selector that changes
 * which panels are expanded/collapsed by default. It does NOT:
 * - Change permissions or roles
 * - Re-run reasoning or logic
 * - Modify data or execution paths
 * - Grant any authority
 *
 * Perspective framing is purely for demo visibility and emphasis.
 */

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";

/**
 * Available demo perspectives.
 * These are UI framings, not roles or permissions.
 */
export type DemoPerspective = "patient" | "clinician" | "operator";

/**
 * Panel identifiers for visibility control.
 */
export type PanelId =
  | "synthesis"      // InsightPanel - "What Stands Out"
  | "confidence"     // ConfidencePanel - Confidence & Uncertainty
  | "readiness"      // ActionReadinessPanel - Workflow Readiness
  | "confirmation"   // HumanConfirmationPanel - Human Confirmation Preview
  | "execution"      // ExecutionPlanPanel - Execution Plan
  | "audit"          // PreviewAuditPanel - Audit Preview
  | "relevance"      // RelevancePanel - Evidence/Reasoning Context
  | "comparative"   // ComparativePanel - Comparative Signals
  | "ledger";        // DemoTrustLedgerPanel - Trust Ledger

/**
 * Visibility rules per perspective.
 * Defines which panels are expanded by default.
 */
export const PERSPECTIVE_VISIBILITY: Record<DemoPerspective, {
  expanded: PanelId[];
  collapsed: PanelId[];
  chatDeemphasized?: boolean;
  helperText: string;
}> = {
  patient: {
    expanded: ["synthesis", "confidence"],
    collapsed: ["readiness", "confirmation", "execution", "audit", "relevance", "comparative", "ledger"],
    chatDeemphasized: false,
    helperText: "This view emphasizes understanding only. No actions can be taken.",
  },
  clinician: {
    expanded: ["synthesis", "readiness", "confirmation"],
    collapsed: ["audit", "comparative", "relevance", "confidence", "execution", "ledger"],
    chatDeemphasized: false,
    helperText: "This view emphasizes review and approval preview. No execution occurs.",
  },
  operator: {
    expanded: ["audit", "execution", "readiness", "ledger"],
    collapsed: ["synthesis", "confidence", "confirmation", "relevance", "comparative"],
    chatDeemphasized: true,
    helperText: "This view emphasizes governance and audit visibility. Execution is blocked.",
  },
};

/**
 * Context value interface.
 */
interface DemoPerspectiveContextValue {
  /** Current perspective selection */
  perspective: DemoPerspective;
  /** Change perspective (UI state only, no logic re-runs) */
  setPerspective: (p: DemoPerspective) => void;
  /** Check if a panel should be expanded by default */
  shouldExpandPanel: (panelId: PanelId) => boolean;
  /** Current perspective's helper text */
  helperText: string;
  /** Whether chat area should be de-emphasized */
  chatDeemphasized: boolean;
}

const DemoPerspectiveContext = createContext<DemoPerspectiveContextValue | null>(null);

/**
 * Provider component for demo perspective state.
 * Reads perspective from URL query param (?perspective=patient|clinician|operator), 
 * defaults to "patient".
 */
export function DemoPerspectiveProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  
  // Phase V-01: Perspective persistence (sessionStorage fallback)
  const getInitialPerspective = (): DemoPerspective => {
    // 1. Check URL query params first
    const perspectiveParam = searchParams.get("perspective");
    if (perspectiveParam === "patient" || perspectiveParam === "clinician" || perspectiveParam === "operator") {
      // Store in sessionStorage if found in URL
      if (typeof window !== "undefined") {
        sessionStorage.setItem("zenthea_demo_perspective", perspectiveParam);
      }
      return perspectiveParam;
    }

    // 2. Fallback to sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("zenthea_demo_perspective");
      if (stored === "patient" || stored === "clinician" || stored === "operator") {
        return stored;
      }
    }

    // 3. If still missing, default to patient (redirect logic will handle the gate)
    return "patient";
  };

  const [perspective, setPerspectiveState] = useState<DemoPerspective>(getInitialPerspective());

  // Switching perspective should NOT reset session or recompute reasoning
  // It only changes UI emphasis
  const setPerspective = useCallback((p: DemoPerspective) => {
    setPerspectiveState(p);
    // Phase V-01: Update sessionStorage and URL
    if (typeof window !== "undefined") {
      sessionStorage.setItem("zenthea_demo_perspective", p);
      const url = new URL(window.location.href);
      url.searchParams.set("perspective", p);
      window.history.replaceState(null, "", url.toString());
    }
  }, []);

  const shouldExpandPanel = useCallback(
    (panelId: PanelId): boolean => {
      const rules = PERSPECTIVE_VISIBILITY[perspective];
      return rules.expanded.includes(panelId);
    },
    [perspective]
  );

  const value = useMemo(
    () => ({
      perspective,
      setPerspective,
      shouldExpandPanel,
      helperText: PERSPECTIVE_VISIBILITY[perspective].helperText,
      chatDeemphasized: PERSPECTIVE_VISIBILITY[perspective].chatDeemphasized ?? false,
    }),
    [perspective, setPerspective, shouldExpandPanel]
  );

  return (
    <DemoPerspectiveContext.Provider value={value}>
      {children}
    </DemoPerspectiveContext.Provider>
  );
}

/**
 * Hook to access demo perspective context.
 */
export function useDemoPerspective(): DemoPerspectiveContextValue {
  const context = useContext(DemoPerspectiveContext);
  if (!context) {
    throw new Error("useDemoPerspective must be used within DemoPerspectiveProvider");
  }
  return context;
}

/**
 * Helper to get perspective display label.
 */
export function getPerspectiveLabel(perspective: DemoPerspective): string {
  const labels: Record<DemoPerspective, string> = {
    patient: "Patient",
    clinician: "Clinician",
    operator: "Operator",
  };
  return labels[perspective];
}
