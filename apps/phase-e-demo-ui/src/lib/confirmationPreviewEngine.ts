/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Confirmation Preview Engine for the non-executing assistant.
 * This engine determines WHO would normally confirm, WHAT decision would be required,
 * and WHY confirmation is needed based on the detected intent and action readiness.
 *
 * ALL outputs are read-only previews. NO actions are executed.
 * Language follows conservative, conditional phrasing only.
 */

import type {
  IntentBucket,
  ActionReadinessResult,
  ConfidenceLevel,
  RequiredActor,
  DecisionType,
  HumanConfirmationResult,
} from "./types";

// Re-export types for convenience
export type { RequiredActor, DecisionType, HumanConfirmationResult };

/**
 * Maps action readiness category to required actor.
 * Deterministic mapping based on governance rules.
 */
function getRequiredActor(
  category: ActionReadinessResult["category"]
): RequiredActor {
  switch (category) {
    case "REQUIRES_PATIENT_CONFIRMATION":
      return "PATIENT";
    case "REQUIRES_CLINICIAN_REVIEW":
      return "CLINICIAN";
    case "REQUIRES_ADDITIONAL_DATA":
      return "OPERATOR";
    case "INFORMATIONAL_ONLY":
    case "NOT_ACTIONABLE_IN_SYSTEM":
    default:
      return "NONE";
  }
}

/**
 * Maps action readiness category to decision type.
 * Deterministic mapping based on workflow requirements.
 */
function getDecisionType(
  category: ActionReadinessResult["category"]
): DecisionType {
  switch (category) {
    case "REQUIRES_PATIENT_CONFIRMATION":
      return "CONFIRM";
    case "REQUIRES_CLINICIAN_REVIEW":
      return "REVIEW";
    case "REQUIRES_ADDITIONAL_DATA":
      return "PROVIDE_DATA";
    case "INFORMATIONAL_ONLY":
    case "NOT_ACTIONABLE_IN_SYSTEM":
    default:
      return "NOT_APPLICABLE";
  }
}

/**
 * Generates preview options based on intent and decision type.
 * These are read-only labels — NO actions can be performed.
 */
function getPreviewOptions(
  intent: IntentBucket,
  decisionType: DecisionType
): string[] {
  if (decisionType === "NOT_APPLICABLE") {
    return [];
  }

  switch (intent) {
    case "scheduling":
      return ["Accept proposed time", "Request alternative", "Decline"];

    case "clinical_drafting":
      return ["Approve draft", "Request revisions", "Reject draft"];

    case "record_summary":
      return ["Acknowledge receipt", "Flag for follow-up"];

    case "billing_explanation":
      return ["Acknowledge", "Request clarification"];

    default:
      if (decisionType === "CONFIRM") {
        return ["Confirm", "Decline"];
      }
      if (decisionType === "REVIEW") {
        return ["Approve", "Request changes", "Reject"];
      }
      if (decisionType === "PROVIDE_DATA") {
        return ["Provide information", "Defer"];
      }
      return [];
  }
}

/**
 * Generates a conservative explanation of WHO would confirm.
 * Uses only approved conditional phrasing.
 */
function getActorExplanation(
  requiredActor: RequiredActor,
  intent: IntentBucket
): string {
  switch (requiredActor) {
    case "PATIENT":
      if (intent === "scheduling") {
        return "A patient would usually be asked to confirm the proposed appointment time before it is finalized.";
      }
      return "A patient would usually be asked to confirm this action before it takes effect.";

    case "CLINICIAN":
      if (intent === "clinical_drafting") {
        return "A clinician would typically review and authorize any clinical documentation before it becomes part of the medical record.";
      }
      return "A clinician would typically review this request before any action is taken.";

    case "OPERATOR":
      return "An operator or administrative staff member would normally gather the required information before proceeding.";

    case "NONE":
    default:
      return "This is informational content that would not normally require human confirmation.";
  }
}

/**
 * Generates a rationale for WHY confirmation would be required.
 * Conservative, governance-aligned language only.
 */
function getRationale(
  requiredActor: RequiredActor,
  intent: IntentBucket,
  confidenceLevel: ConfidenceLevel
): string {
  if (requiredActor === "NONE") {
    return "No human decision is required for informational content.";
  }

  const confidenceNote =
    confidenceLevel === "Low"
      ? " Additionally, confidence in the available data is limited."
      : "";

  switch (intent) {
    case "scheduling":
      return `Appointment scheduling would normally require explicit patient consent to ensure availability and prevent booking errors.${confidenceNote}`;

    case "clinical_drafting":
      return `Clinical documentation would normally require clinician authorization to maintain medical record integrity and regulatory compliance.${confidenceNote}`;

    case "record_summary":
      return `Record summaries are typically shared for informational purposes but may require acknowledgment for care coordination.${confidenceNote}`;

    case "billing_explanation":
      return `Billing information is typically provided for transparency but may require follow-up for disputes or clarifications.${confidenceNote}`;

    default:
      return `This action would normally require human oversight to ensure accuracy and appropriate authorization.${confidenceNote}`;
  }
}

/**
 * Evaluates what human confirmation would normally be required.
 *
 * This is a DETERMINISTIC engine that produces READ-ONLY previews.
 * NO actions are executed. All language is conditional and conservative.
 *
 * @param intent - The classified intent bucket
 * @param actionReadiness - The action readiness evaluation result
 * @param overallConfidence - The overall confidence level (defaults to "Medium")
 * @returns HumanConfirmationResult describing what confirmation would normally be required
 */
export function evaluateHumanConfirmation(
  intent: IntentBucket,
  actionReadiness: ActionReadinessResult,
  overallConfidence: ConfidenceLevel = "Medium"
): HumanConfirmationResult {
  const requiredActor = getRequiredActor(actionReadiness.category);
  const decisionType = getDecisionType(actionReadiness.category);
  const previewOptions = getPreviewOptions(intent, decisionType);
  const explanation = getActorExplanation(requiredActor, intent);
  const rationale = getRationale(requiredActor, intent, overallConfidence);

  return {
    requiredActor,
    decisionType,
    previewOptions,
    explanation,
    rationale,
  };
}

/**
 * Returns a human-readable label for the required actor.
 */
export function getActorLabel(actor: RequiredActor): string {
  switch (actor) {
    case "PATIENT":
      return "Patient";
    case "CLINICIAN":
      return "Clinician";
    case "OPERATOR":
      return "Operator / Staff";
    case "NONE":
    default:
      return "No Confirmation Required";
  }
}

/**
 * Returns a human-readable label for the decision type.
 */
export function getDecisionTypeLabel(type: DecisionType): string {
  switch (type) {
    case "CONFIRM":
      return "Confirmation";
    case "REVIEW":
      return "Review & Authorization";
    case "PROVIDE_DATA":
      return "Data Collection";
    case "NOT_APPLICABLE":
    default:
      return "Informational Only";
  }
}
