/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 * 
 * Action Readiness Model for the non-executing assistant.
 * This determines what kind of human or system action would normally be required
 * based on the detected intent and available context.
 */

import { IntentBucket, RelevanceResult, ConfidenceAnnotation, ActionReadinessResult } from "./types";

/**
 * Deterministic categories for action readiness.
 */
export type ReadinessCategory = ActionReadinessResult["category"];

/**
 * Deterministic engine to derive action readiness.
 * Derived ONLY from: intent, relevance result, and confidence annotations.
 */
export function evaluateActionReadiness(
  intent: IntentBucket,
  relevance: RelevanceResult,
  confidenceAnnotations: ConfidenceAnnotation[]
): ActionReadinessResult {
  // 1. Handle Uncertain Intent or Lack of Evidence
  if (intent === "unknown" || !relevance.hasEvidence) {
    return {
      category: "NOT_ACTIONABLE_IN_SYSTEM",
      explanation: "This system does not perform this action. No action has been taken.",
    };
  }

  // 2. Check for missing data (UNCERTAIN category in confidence annotations)
  const hasUncertainty = confidenceAnnotations.some(
    (a) => a.category === "UNCERTAIN"
  );
  if (hasUncertainty) {
    return {
      category: "REQUIRES_ADDITIONAL_DATA",
      explanation: "This would normally require additional data points to be fully actionable. No action has been taken.",
    };
  }

  // 3. Rule-based mapping based on Intent
  switch (intent) {
    case "scheduling":
      return {
        category: "REQUIRES_PATIENT_CONFIRMATION",
        explanation: "This would normally require a clinician to coordinate availability and a patient to confirm the appointment. No action has been taken.",
      };

    case "clinical_drafting":
      return {
        category: "REQUIRES_CLINICIAN_REVIEW",
        explanation: "This would normally require a clinician to review and authorize any clinical documentation or notes. No action has been taken.",
      };

    case "record_summary":
      return {
        category: "INFORMATIONAL_ONLY",
        explanation: "This is a record summary for informational purposes only. No action has been taken.",
      };

    case "billing_explanation":
      return {
        category: "INFORMATIONAL_ONLY",
        explanation: "This is a billing explanation for informational purposes only. No action has been taken.",
      };

    default:
      return {
        category: "NOT_ACTIONABLE_IN_SYSTEM",
        explanation: "This system does not perform this action. No action has been taken.",
      };
  }
}
