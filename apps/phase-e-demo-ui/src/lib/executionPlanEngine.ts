/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 * 
 * Deterministic engine for generating execution plan previews.
 * This engine produces structured artifacts that describe what WOULD
 * normally happen, but never executes any actions.
 */

import { 
  IntentBucket, 
  ExecutionPlanResult, 
  RelevanceResult, 
  ActionReadinessResult,
  RequiredActor
} from "./types";

/**
 * Generates a deterministic execution plan preview based on the current context.
 */
export function generateExecutionPlan(
  intent: IntentBucket,
  relevance: RelevanceResult,
  readiness: ActionReadinessResult,
  confidence: "High" | "Medium" | "Low"
): ExecutionPlanResult {
  const planId = `plan-${intent}-${Date.now().toString(36)}`;
  const evidence = relevance.selectedItems.map(item => `${item.date}: ${item.title}`);
  
  const result: ExecutionPlanResult = {
    planId,
    intentBucket: intent,
    summary: "",
    proposedActions: [],
    requiredHumanConfirmations: [],
    requiredData: [],
    blockedBy: ["Execution disabled in demo environment"],
    evidence,
    risks: ["This is a simulated plan for demonstration purposes only."],
    disclaimers: ["PREVIEW ONLY", "NO ACTIONS EXECUTED"],
  };

  // Base logic for all plans
  if (confidence === "Low") {
    result.blockedBy.push("Low confidence in intent or context");
  }

  switch (intent) {
    case "scheduling":
      result.summary = "This preview suggests how a scheduling request would normally be processed.";
      result.proposedActions = [
        "Search for available appointment slots matching patient preferences",
        "Coordinate with clinician schedule and clinic availability",
        "Prepare appointment confirmation notification"
      ];
      result.requiredHumanConfirmations = [
        { actor: "PATIENT", confirmationType: "Time Slot Selection" },
        { actor: "CLINICIAN", confirmationType: "Schedule Approval" }
      ];
      result.blockedBy.push("Write operations (scheduling) are disabled");
      if (confidence !== "High") {
        result.requiredData.push("Preferred date range", "Specific clinician preference");
      }
      break;

    case "clinical_drafting":
      result.summary = "A clinician would typically review a draft note based on the selected evidence.";
      result.proposedActions = [
        "Draft clinical note summary using relevant timeline items",
        "Flag potential gaps in documentation for clinician review",
        "Cross-reference with patient's stated concerns in current intent"
      ];
      result.requiredHumanConfirmations = [
        { actor: "CLINICIAN", confirmationType: "Note Review and Attestation" }
      ];
      result.blockedBy.push("No attestation/commit capability in demo");
      break;

    case "record_summary":
      result.summary = "This plan suggests an informational-only summary of patient records.";
      result.proposedActions = [
        "Synthesize selected timeline items into a concise summary",
        "Highlight key events and temporal changes identified"
      ];
      result.requiredHumanConfirmations = [];
      result.blockedBy.push("Read-only environment; no record modifications");
      break;

    case "billing_explanation":
      result.summary = "This preview indicates how billing queries would be investigated.";
      result.proposedActions = [
        "Retrieve relevant billing statements and insurance claims",
        "Identify specific line items matching the patient query"
      ];
      result.requiredHumanConfirmations = [
        { actor: "OPERATOR", confirmationType: "Financial Data Access" }
      ];
      result.blockedBy.push("Access to live billing systems is restricted");
      break;

    default:
      result.summary = "Insufficient information to generate a specific execution plan.";
      result.requiredData = ["Clarification of patient intent"];
      result.blockedBy.push("Unknown or unsupported intent for execution planning");
      break;
  }

  // Adjustments based on readiness
  if (readiness.category === "REQUIRES_ADDITIONAL_DATA") {
    result.blockedBy.push("Insufficient data for planning");
    if (result.requiredData.length === 0) {
      result.requiredData.push("Missing context required for action");
    }
  }

  return result;
}
