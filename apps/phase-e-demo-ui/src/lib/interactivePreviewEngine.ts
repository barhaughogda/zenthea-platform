/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Interactive Preview Engine for the human confirmation preview flow.
 * This engine manages session-only state transitions for the interactive
 * confirmation UX. ALL state is ephemeral — never persisted.
 *
 * STRICT CONSTRAINTS:
 * - NO execution
 * - NO external API calls
 * - NO persistence
 * - NO side effects
 * - ALL state resets on session end
 */

import type {
  PreviewConfirmationState,
  PreviewConfirmationRecord,
  PreviewConfirmationInput,
  RequiredActor,
} from "./types";

// =============================================================================
// Language Safety Constants
// =============================================================================

/**
 * Forbidden words that must NOT appear in isolation.
 * These words are only permitted when paired with "preview only" context.
 */
export const FORBIDDEN_STANDALONE_WORDS = [
  "submit",
  "confirmed",
  "booked",
  "sent",
  "saved",
  "approved",
] as const;

/**
 * Required conditional language patterns.
 * At least one must appear in explanatory text.
 */
export const REQUIRED_CONDITIONAL_PATTERNS = [
  "would normally",
  "would typically",
  "would usually",
  "a clinician would",
  "a patient would",
  "an operator would",
  "no action has been taken",
  "preview only",
] as const;

// =============================================================================
// State Transition Logic
// =============================================================================

/**
 * Valid state transitions for preview confirmation flow.
 * PROPOSAL_CREATED → PREVIEW_ACKNOWLEDGED | PREVIEW_DENIED
 */
const VALID_TRANSITIONS: Record<PreviewConfirmationState, PreviewConfirmationState[]> = {
  PROPOSAL_CREATED: ["PREVIEW_ACKNOWLEDGED", "PREVIEW_DENIED"],
  PREVIEW_ACKNOWLEDGED: [], // Terminal state
  PREVIEW_DENIED: [], // Terminal state
};

/**
 * Checks if a state transition is valid.
 */
export function isValidTransition(
  from: PreviewConfirmationState,
  to: PreviewConfirmationState
): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

/**
 * Transitions a preview confirmation record to a new state.
 * Returns a new record (immutable) or null if transition is invalid.
 */
export function transitionPreviewState(
  record: PreviewConfirmationRecord,
  newState: PreviewConfirmationState
): PreviewConfirmationRecord | null {
  if (!isValidTransition(record.state, newState)) {
    return null;
  }

  return {
    ...record,
    state: newState,
    timestamp: new Date(),
  };
}

// =============================================================================
// Preview Record Creation
// =============================================================================

/**
 * Generates a unique preview ID for session-scoped tracking.
 * Format: preview-{timestamp}-{random}
 */
function generatePreviewId(): string {
  return `preview-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generates the "what would normally happen next" list.
 * Uses ONLY conditional language — no action-implying statements.
 */
function generateWouldNormallyHappen(
  actor: RequiredActor,
  intentSummary: string,
  proposedActions?: string[]
): string[] {
  const results: string[] = [];

  // Actor-specific conditional language
  switch (actor) {
    case "PATIENT":
      results.push("A patient would typically review the proposed action");
      results.push("The patient would normally provide explicit consent");
      results.push("The system would usually wait for patient confirmation before proceeding");
      break;
    case "CLINICIAN":
      results.push("A clinician would typically review and authorize this request");
      results.push("The clinician would normally verify clinical appropriateness");
      results.push("Documentation would usually be updated only after clinician approval");
      break;
    case "OPERATOR":
      results.push("An operator would normally gather required information");
      results.push("Administrative staff would typically verify eligibility");
      results.push("The request would usually proceed only after data validation");
      break;
    default:
      results.push("This is informational content — no confirmation would normally be required");
  }

  // Add intent-specific context if available
  if (proposedActions && proposedActions.length > 0) {
    results.push(
      `If this were a real request, the following steps would typically occur: ${proposedActions.slice(0, 2).join("; ")}`
    );
  }

  return results;
}

/**
 * Builds the confirmation rationale with safe language.
 */
function buildConfirmationRationale(
  actor: RequiredActor,
  decisionType: string
): string {
  const baseRationale = {
    PATIENT:
      "Human confirmation would normally be required to ensure patient autonomy and informed consent. " +
      "This safeguard would typically protect against unauthorized actions affecting patient care.",
    CLINICIAN:
      "Clinical review would normally be required to maintain medical record integrity and regulatory compliance. " +
      "A clinician would typically verify that proposed actions align with established care protocols.",
    OPERATOR:
      "Administrative review would normally be required to ensure data accuracy and operational compliance. " +
      "Staff would typically validate information before system changes would take effect.",
    NONE:
      "This informational content would not normally require explicit confirmation. " +
      "No action has been taken — this is a preview only.",
  };

  return baseRationale[actor] || baseRationale.NONE;
}

/**
 * Creates a new PreviewConfirmationRecord from input data.
 * Initial state is always PROPOSAL_CREATED.
 */
export function createPreviewConfirmationRecord(
  input: PreviewConfirmationInput
): PreviewConfirmationRecord {
  const { humanConfirmation, executionPlan, sessionRole } = input;
  const actor = humanConfirmation.requiredActor;

  const intentSummary =
    executionPlan?.summary ||
    `${humanConfirmation.explanation} (${humanConfirmation.decisionType})`;

  return {
    previewId: generatePreviewId(),
    state: "PROPOSAL_CREATED",
    actor,
    intentSummary,
    wouldNormallyHappen: generateWouldNormallyHappen(
      actor,
      intentSummary,
      executionPlan?.proposedActions
    ),
    confirmationRationale: buildConfirmationRationale(
      actor,
      humanConfirmation.decisionType
    ),
    timestamp: new Date(),
    sessionRole: sessionRole || "Demo User",
  };
}

// =============================================================================
// Language Safety Validation
// =============================================================================

/**
 * Checks if text contains forbidden standalone words.
 * Words are only forbidden when NOT in a "preview only" context.
 */
export function containsForbiddenStandaloneWord(text: string): {
  hasForbidden: boolean;
  foundWords: string[];
} {
  const lowerText = text.toLowerCase();
  const foundWords: string[] = [];

  // Check if text has preview-only context
  const hasPreviewContext =
    lowerText.includes("preview only") ||
    lowerText.includes("preview-only") ||
    lowerText.includes("no action") ||
    lowerText.includes("would normally") ||
    lowerText.includes("would typically");

  if (hasPreviewContext) {
    return { hasForbidden: false, foundWords: [] };
  }

  // Check for forbidden words
  for (const word of FORBIDDEN_STANDALONE_WORDS) {
    // Use word boundary matching
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(text)) {
      foundWords.push(word);
    }
  }

  return {
    hasForbidden: foundWords.length > 0,
    foundWords,
  };
}

/**
 * Checks if text contains required conditional language patterns.
 */
export function hasConditionalLanguage(text: string): {
  hasConditional: boolean;
  matchedPatterns: string[];
} {
  const lowerText = text.toLowerCase();
  const matchedPatterns: string[] = [];

  for (const pattern of REQUIRED_CONDITIONAL_PATTERNS) {
    if (lowerText.includes(pattern)) {
      matchedPatterns.push(pattern);
    }
  }

  return {
    hasConditional: matchedPatterns.length > 0,
    matchedPatterns,
  };
}

/**
 * Validates that text follows language safety requirements.
 */
export function validateLanguageSafety(text: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const forbiddenCheck = containsForbiddenStandaloneWord(text);
  if (forbiddenCheck.hasForbidden) {
    errors.push(
      `Contains forbidden standalone words: ${forbiddenCheck.foundWords.join(", ")}. ` +
        `These words must be paired with "preview only" context.`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// Display Helpers
// =============================================================================

/**
 * Returns a human-readable label for the preview state.
 */
export function getPreviewStateLabel(state: PreviewConfirmationState): string {
  switch (state) {
    case "PROPOSAL_CREATED":
      return "Proposal Created";
    case "PREVIEW_ACKNOWLEDGED":
      return "Preview Acknowledged";
    case "PREVIEW_DENIED":
      return "Preview Declined";
    default:
      return "Unknown State";
  }
}

/**
 * Returns the badge text to display after acknowledgment.
 */
export function getAcknowledgmentBadgeText(
  record: PreviewConfirmationRecord
): string {
  if (record.state === "PREVIEW_ACKNOWLEDGED") {
    return `Human confirmation preview acknowledged by ${record.sessionRole} — no action taken`;
  }
  if (record.state === "PREVIEW_DENIED") {
    return `Human confirmation preview declined by ${record.sessionRole} — no action taken`;
  }
  return "Preview pending — no action taken";
}

/**
 * Formats a timestamp for display.
 */
export function formatPreviewTimestamp(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// =============================================================================
// Role → Confirmation Mapping
// =============================================================================

/**
 * Maps actor to display configuration for the modal.
 */
export function getActorDisplayConfig(actor: RequiredActor): {
  label: string;
  description: string;
  iconName: "user" | "shield" | "building" | "info";
  colorClass: string;
} {
  switch (actor) {
    case "PATIENT":
      return {
        label: "Patient",
        description: "A patient would normally be asked to confirm this action",
        iconName: "user",
        colorClass: "indigo",
      };
    case "CLINICIAN":
      return {
        label: "Clinician",
        description: "A clinician would typically review and authorize this request",
        iconName: "shield",
        colorClass: "emerald",
      };
    case "OPERATOR":
      return {
        label: "Operator / Staff",
        description: "An operator would normally gather required information",
        iconName: "building",
        colorClass: "amber",
      };
    case "NONE":
    default:
      return {
        label: "No Confirmation Required",
        description: "This informational content would normally not require confirmation — preview only",
        iconName: "info",
        colorClass: "slate",
      };
  }
}
