import { describe, it, expect } from "vitest";
import { buildPreviewAuditTrail, createHumanConfirmationAuditEvent } from "../previewAuditEngine";
import { IntentClassification, RelevanceResult, ActionReadinessResult } from "../types";

describe("previewAuditEngine", () => {
  const mockIntent: IntentClassification = {
    intent: "scheduling",
    matchedKeywords: ["schedule", "appointment"],
    confidence: "high",
  };

  const mockRelevance: RelevanceResult = {
    intent: "scheduling",
    selectedItems: [
      {
        date: "2023-10-01",
        type: "visit",
        title: "Follow-up Visit",
        summary: "Patient discussed follow-up.",
        score: 10,
        scoreBreakdown: { typeMatch: 5, keywordMatch: 5, recencyBonus: 0 },
      },
    ],
    explanation: ["Matched visit by date"],
    hasEvidence: true,
    maxScore: 10,
    evidenceAttribution: ["visit-2023-10-01"],
  };

  const mockReadiness: ActionReadinessResult = {
    category: "REQUIRES_CLINICIAN_REVIEW",
    explanation: "Scheduling requires review.",
  };

  const messageId = "msg-123";

  it("builds a deterministic audit trail with correct policy basis for scheduling", () => {
    const auditTrail = buildPreviewAuditTrail({
      messageId,
      actorContext: { role: "patient" },
      intent: mockIntent,
      relevance: mockRelevance,
      readiness: mockReadiness,
    });

    expect(auditTrail.length).toBeGreaterThan(0);
    
    // Check first event (INTENT_CLASSIFIED)
    const intentEvent = auditTrail.find(e => e.type === "INTENT_CLASSIFIED");
    expect(intentEvent).toBeDefined();
    expect(intentEvent?.policyBasis).toContain("Phase E Non-Execution");
    expect(intentEvent?.policyBasis).toContain("SL-01 Consent Gate"); // patient context
    expect(intentEvent?.policyBasis).toContain("SL-07 Proposal-Only"); // scheduling intent
    expect(intentEvent?.policyBasis).toContain("Execution Blocked"); // readiness requires review
  });

  it("includes correct policy basis for clinical drafting", () => {
    const draftingIntent: IntentClassification = {
      intent: "clinical_drafting",
      matchedKeywords: ["note"],
      confidence: "high",
    };

    const auditTrail = buildPreviewAuditTrail({
      messageId,
      actorContext: { role: "clinician" },
      intent: draftingIntent,
      relevance: mockRelevance,
    });

    const intentEvent = auditTrail.find(e => e.type === "INTENT_CLASSIFIED");
    expect(intentEvent?.policyBasis).toContain("SL-04 Draft-Only");
    expect(intentEvent?.policyBasis).toContain("MIG-04B Blocked");
    expect(intentEvent?.policyBasis).not.toContain("SL-01 Consent Gate"); // clinician context
  });

  it("ensures payload preview contains no forbidden clinical content", () => {
    const auditTrail = buildPreviewAuditTrail({
      messageId,
      actorContext: { role: "patient" },
      intent: mockIntent,
      relevance: mockRelevance,
    });

    auditTrail.forEach(event => {
      const payloadString = JSON.stringify(event.payloadPreview).toLowerCase();
      expect(payloadString).not.toContain("note");
      expect(payloadString).not.toContain("transcript");
      expect(payloadString).not.toContain("diagnosis");
      // Summary text from mockRelevance should not be in payload
      expect(payloadString).not.toContain("patient discussed follow-up");
    });
  });

  it("creates human confirmation audit events correctly", () => {
    const event = createHumanConfirmationAuditEvent(
      messageId,
      5,
      "HUMAN_CONFIRMATION_PREVIEW_ACKNOWLEDGED",
      "clinician",
      "scheduling"
    );

    expect(event.id).toBe(`${messageId}-5`);
    expect(event.type).toBe("HUMAN_CONFIRMATION_PREVIEW_ACKNOWLEDGED");
    expect(event.actor).toBe("CLINICIAN");
    expect(event.policyBasis).toContain("SL-08 HITL Review");
    expect(event.payloadPreview.intentBucket).toBe("scheduling");
  });

  it("maintains deterministic ordering by index in ID", () => {
    const auditTrail = buildPreviewAuditTrail({
      messageId,
      actorContext: { role: "patient" },
      intent: mockIntent,
      relevance: mockRelevance,
    });

    auditTrail.forEach((event, index) => {
      expect(event.id).toBe(`${messageId}-${index}`);
    });
  });
});
