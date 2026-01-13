import {
  PreviewAuditEvent,
  PreviewAuditActor,
  PreviewAuditEventType,
  IntentClassification,
  RelevanceResult,
  ConfidenceAnnotation,
  ActionReadinessResult,
  HumanConfirmationResult,
  ExecutionPlanResult,
} from "./types";

/**
 * PREVIEW ONLY — NOT RECORDED — NO ACTION TAKEN
 * 
 * This engine deterministically builds a list of PreviewAuditEvent items
 * based on the reasoning metadata for a message turn.
 */

interface BuildPreviewAuditTrailArgs {
  messageId: string;
  actorContext: { role: "patient" | "clinician" | "operator" };
  intent: IntentClassification;
  relevance: RelevanceResult;
  synthesis?: any; // Currently synthesis is simple, but we can track its generation
  confidence?: ConfidenceAnnotation[];
  readiness?: ActionReadinessResult;
  humanConfirmation?: HumanConfirmationResult;
  executionPlan?: ExecutionPlanResult;
}

export function buildPreviewAuditTrail({
  messageId,
  actorContext,
  intent,
  relevance,
  synthesis,
  confidence,
  readiness,
  humanConfirmation,
  executionPlan,
}: BuildPreviewAuditTrailArgs): PreviewAuditEvent[] {
  const events: PreviewAuditEvent[] = [];
  const now = new Date();
  let eventIndex = 0;

  const createEvent = (
    type: PreviewAuditEventType,
    actor: PreviewAuditActor,
    sliceOrPhase: string,
    summary: string,
    payloadPreview: Record<string, any>,
    extraPolicies: string[] = []
  ): PreviewAuditEvent => {
    const policyBasis = [
      "Phase E Non-Execution",
      "Phase O Preview-Only",
      ...extraPolicies,
    ];

    // Policy mapping rules
    if (actorContext.role === "patient") {
      policyBasis.push("SL-01 Consent Gate");
      policyBasis.push("SL-03 PatientSessionContext");
    }

    if (intent.intent === "clinical_drafting") {
      policyBasis.push("SL-04 Draft-Only");
      policyBasis.push("MIG-04B Blocked");
    }

    if (intent.intent === "scheduling") {
      policyBasis.push("SL-07 Proposal-Only");
      policyBasis.push("SL-08 HITL Review");
    }

    if (
      (readiness && readiness.category !== "INFORMATIONAL_ONLY") ||
      (humanConfirmation && humanConfirmation.requiredActor !== "NONE")
    ) {
      policyBasis.push("Execution Blocked");
    }

    return {
      id: `${messageId}-${eventIndex++}`,
      ts: now.toISOString(),
      actor,
      type,
      sliceOrPhase,
      policyBasis: Array.from(new Set(policyBasis)), // De-duplicate
      summary,
      payloadPreview,
    };
  };

  // 1. Intent Classified
  events.push(
    createEvent(
      "INTENT_CLASSIFIED",
      "SYSTEM",
      "PHASE-E",
      `System would normally classify intent as "${intent.intent}" based on keyword matching.`,
      {
        intentBucket: intent.intent,
        matchConfidence: intent.confidence,
        keywordCount: intent.matchedKeywords.length,
      }
    )
  );

  // 2. Evidence Selected
  if (relevance.selectedItems.length > 0) {
    events.push(
      createEvent(
        "EVIDENCE_SELECTED",
        "SYSTEM",
        "SL-03",
        `System would normally select ${relevance.selectedItems.length} evidence items for context.`,
        {
          itemCount: relevance.selectedItems.length,
          itemMetadata: relevance.selectedItems.map((item) => ({
            id: `item-${item.date}-${item.type}`, // Deterministic ID simulation
            type: item.type,
            date: item.date,
            score: item.score,
          })),
        }
      )
    );
  }

  // 3. Synthesis Generated (if present)
  if (synthesis) {
    events.push(
      createEvent(
        "SYNTHESIS_GENERATED",
        "SYSTEM",
        "PHASE-E",
        "System would normally generate a reasoning synthesis for the assistant response.",
        {
          hasSynthesis: true,
          model: "deterministic-demo-engine",
        }
      )
    );
  }

  // 4. Confidence Annotated
  if (confidence && confidence.length > 0) {
    events.push(
      createEvent(
        "CONFIDENCE_ANNOTATED",
        "SYSTEM",
        "PHASE-E",
        `System would normally annotate ${confidence.length} statements with epistemic confidence levels.`,
        {
          annotationCount: confidence.length,
          categories: confidence.map((c) => c.category),
          confidenceLevels: confidence.map((c) => c.confidence),
        }
      )
    );
  }

  // 5. Readiness Evaluated
  if (readiness) {
    events.push(
      createEvent(
        "READINESS_EVALUATED",
        "SYSTEM",
        "PHASE-E",
        `System would normally evaluate action readiness as "${readiness.category}".`,
        {
          readinessCategory: readiness.category,
        }
      )
    );
  }

  // 6. Execution Plan Previewed
  if (executionPlan) {
    events.push(
      createEvent(
        "EXECUTION_PLAN_PREVIEWED",
        "SYSTEM",
        "PHASE-O",
        "System would normally generate an execution plan for proposed actions.",
        {
          planId: executionPlan.planId,
          proposedActionCount: executionPlan.proposedActions.length,
          requiredConfirmationCount: executionPlan.requiredHumanConfirmations.length,
        }
      )
    );
  }

  return events;
}

/**
 * Creates a human confirmation related audit event.
 */
export function createHumanConfirmationAuditEvent(
  messageId: string,
  index: number,
  type: "HUMAN_CONFIRMATION_PREVIEW_OPENED" | "HUMAN_CONFIRMATION_PREVIEW_ACKNOWLEDGED" | "HUMAN_CONFIRMATION_PREVIEW_DENIED",
  actorRole: "patient" | "clinician" | "operator",
  intent: string
): PreviewAuditEvent {
  const now = new Date();
  const policyBasis = [
    "Phase E Non-Execution",
    "Phase O Preview-Only",
    "SL-08 HITL Review",
  ];

  if (actorRole === "patient") {
    policyBasis.push("SL-01 Consent Gate");
    policyBasis.push("SL-03 PatientSessionContext");
  }

  const summaries = {
    HUMAN_CONFIRMATION_PREVIEW_OPENED: `Human confirmation preview opened by ${actorRole}. No action taken.`,
    HUMAN_CONFIRMATION_PREVIEW_ACKNOWLEDGED: `Human confirmation preview acknowledged by ${actorRole}. No action taken.`,
    HUMAN_CONFIRMATION_PREVIEW_DENIED: `Human confirmation preview denied by ${actorRole}. No action taken.`,
  };

  return {
    id: `${messageId}-${index}`,
    ts: now.toISOString(),
    actor: actorRole.toUpperCase() as any,
    type,
    sliceOrPhase: "PHASE-O",
    policyBasis,
    summary: summaries[type],
    payloadPreview: {
      intentBucket: intent,
      event: type,
      timestamp: now.toISOString(),
    },
  };
}
