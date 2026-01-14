/**
 * DEMO ONLY — NARRATIVE MODE FRAMING — NO LOGIC CHANGES
 *
 * Phase R-03: Demo Narrative Mode (Guided vs Free)
 *
 * This context provides a UI-only narrative mode selector that determines
 * how the demo experience is framed. It does NOT:
 * - Change permissions, authority, or execution
 * - Re-run assistant logic or reasoning
 * - Modify data access or confidence calculations
 * - Grant any capabilities
 *
 * Narrative mode is purely for demo governance and presentation framing.
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
 * Demo narrative modes.
 * "guided" - Fixed narrative, no improvisation, step-based prompts
 * "free" - Open exploration, read-only, no actions executed
 */
export type DemoMode = "guided" | "free";

/**
 * Predefined ordered prompts for guided demo narrative.
 * These illustrate the assistant's reasoning capabilities without implying action.
 */
export const GUIDED_PROMPTS: readonly string[] = [
  "What happened at the last visit?",
  "Can I schedule an appointment?",
  "Draft a clinical note summary",
] as const;

/**
 * Context value interface.
 */
interface DemoModeContextValue {
  /** Current demo mode selection */
  mode: DemoMode;
  /** Current step in guided mode (0-indexed) */
  guidedStep: number;
  /** Total steps in guided mode */
  totalSteps: number;
  /** Whether free-text input is permitted */
  isInputEnabled: boolean;
  /** Advance to next guided step after prompt is used */
  advanceGuidedStep: () => void;
  /** Current prompt for guided mode (null if completed) */
  currentGuidedPrompt: string | null;
  /** All guided prompts (ordered) */
  guidedPrompts: readonly string[];
  /** Whether guided mode is complete */
  isGuidedComplete: boolean;
}

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

/**
 * Provider component for demo narrative mode state.
 * Reads mode from URL query param (?mode=guided|free), defaults to "guided".
 */
export function DemoModeProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  
  // Phase V-01: Mode persistence (sessionStorage fallback)
  const getInitialMode = (): DemoMode => {
    // 1. Check URL query params first
    const modeParam = searchParams.get("mode");
    if (modeParam === "guided" || modeParam === "free") {
      // Store in sessionStorage if found in URL
      if (typeof window !== "undefined") {
        sessionStorage.setItem("zenthea_demo_mode", modeParam);
      }
      return modeParam;
    }

    // 2. Fallback to sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("zenthea_demo_mode");
      if (stored === "guided" || stored === "free") {
        return stored;
      }
    }

    // 3. Default to guided
    return "guided";
  };

  const mode = getInitialMode();

  // Guided step tracking (session-only, does NOT trigger re-computation)
  const [guidedStep, setGuidedStep] = useState(0);

  // Phase V-01: Update URL when mode or perspective is set (perspective handled in its own context)
  // Mode is read-only here but we ensure it's in URL if missing
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (!url.searchParams.has("mode")) {
        url.searchParams.set("mode", mode);
        window.history.replaceState(null, "", url.toString());
      }
    }
  }, [mode]);

  const totalSteps = GUIDED_PROMPTS.length;
  const isGuidedComplete = guidedStep >= totalSteps;

  // Advance step (does NOT reset session or recompute logic)
  const advanceGuidedStep = useCallback(() => {
    setGuidedStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  // Current prompt for guided mode
  const currentGuidedPrompt = isGuidedComplete
    ? null
    : GUIDED_PROMPTS[guidedStep];

  // Input is enabled only in free mode, or in guided mode after completing all steps
  const isInputEnabled = mode === "free" || isGuidedComplete;

  const value = useMemo(
    () => ({
      mode,
      guidedStep,
      totalSteps,
      isInputEnabled,
      advanceGuidedStep,
      currentGuidedPrompt,
      guidedPrompts: GUIDED_PROMPTS,
      isGuidedComplete,
    }),
    [
      mode,
      guidedStep,
      totalSteps,
      isInputEnabled,
      advanceGuidedStep,
      currentGuidedPrompt,
      isGuidedComplete,
    ]
  );

  return (
    <DemoModeContext.Provider value={value}>
      {children}
    </DemoModeContext.Provider>
  );
}

/**
 * Hook to access demo mode context.
 * @throws Error if used outside DemoModeProvider
 */
export function useDemoMode(): DemoModeContextValue {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error("useDemoMode must be used within DemoModeProvider");
  }
  return context;
}

/**
 * Helper to get mode display label.
 * Uses observational, conditional language per requirements.
 */
export function getModeLabel(mode: DemoMode): string {
  const labels: Record<DemoMode, string> = {
    guided: "Guided Demo",
    free: "Free Exploration",
  };
  return labels[mode];
}

/**
 * Helper to get mode description.
 * Uses observational, conditional language per requirements.
 */
export function getModeDescription(mode: DemoMode): string {
  const descriptions: Record<DemoMode, string> = {
    guided: "This demonstrates a fixed narrative sequence. Prompts are predefined and ordered.",
    free: "This illustrates open exploration. Sample prompts remain visible but optional.",
  };
  return descriptions[mode];
}
