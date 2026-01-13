import { describe, it, expect } from "vitest";
import { generateExecutionPlan } from "../executionPlanEngine";
import { RelevanceResult, ActionReadinessResult } from "../types";

describe("executionPlanEngine", () => {
  const mockRelevance: RelevanceResult = {
    intent: "record_summary",
    selectedItems: [
      {
        date: "2024-01-10",
        type: "visit",
        title: "Annual Checkup",
        summary: "Patient is healthy",
        score: 10,
        scoreBreakdown: { typeMatch: 5, keywordMatch: 5, recencyBonus: 0 }
      }
    ],
    explanation: [],
    hasEvidence: true,
    maxScore: 10,
    evidenceAttribution: ["2024-01-10: Annual Checkup"]
  };

  const mockReadiness: ActionReadinessResult = {
    category: "INFORMATIONAL_ONLY",
    explanation: "Informational only"
  };

  it("scheduling intent produces proposedActions and blockedBy 'Execution disabled'", () => {
    const result = generateExecutionPlan(
      "scheduling",
      { ...mockRelevance, intent: "scheduling" },
      { ...mockReadiness, category: "REQUIRES_PATIENT_CONFIRMATION" },
      "High"
    );
    expect(result.proposedActions).toContain("Search for available appointment slots matching patient preferences");
    expect(result.blockedBy).toContain("Execution disabled in demo environment");
    expect(result.requiredHumanConfirmations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ actor: "PATIENT", confirmationType: "Time Slot Selection" }),
        expect.objectContaining({ actor: "CLINICIAN", confirmationType: "Schedule Approval" })
      ])
    );
  });

  it("clinical drafting intent produces draft note actions and required clinician review", () => {
    const result = generateExecutionPlan(
      "clinical_drafting",
      { ...mockRelevance, intent: "clinical_drafting" },
      { ...mockReadiness, category: "REQUIRES_CLINICIAN_REVIEW" },
      "High"
    );
    expect(result.proposedActions).toContain("Draft clinical note summary using relevant timeline items");
    expect(result.requiredHumanConfirmations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ actor: "CLINICIAN", confirmationType: "Note Review and Attestation" })
      ])
    );
    expect(result.blockedBy).toContain("No attestation/commit capability in demo");
  });

  it("record_summary intent produces informational-only plan", () => {
    const result = generateExecutionPlan(
      "record_summary",
      mockRelevance,
      mockReadiness,
      "High"
    );
    expect(result.summary).toContain("informational-only summary");
    expect(result.requiredHumanConfirmations).toHaveLength(0);
    expect(result.blockedBy).toContain("Read-only environment; no record modifications");
  });

  it("unknown intent produces empty proposedActions and non-empty requiredData", () => {
    const result = generateExecutionPlan(
      "unknown",
      { ...mockRelevance, intent: "unknown" },
      { ...mockReadiness, category: "NOT_ACTIONABLE_IN_SYSTEM" },
      "Low"
    );
    expect(result.proposedActions).toHaveLength(0);
    expect(result.requiredData).toContain("Clarification of patient intent");
    expect(result.blockedBy).toContain("Unknown or unsupported intent for execution planning");
  });

  it("low confidence produces non-empty blockedBy and requiredData", () => {
    const result = generateExecutionPlan(
      "scheduling",
      { ...mockRelevance, intent: "scheduling" },
      { ...mockReadiness, category: "REQUIRES_ADDITIONAL_DATA" },
      "Low"
    );
    expect(result.blockedBy).toContain("Low confidence in intent or context");
    expect(result.requiredData).toContain("Preferred date range");
  });
});
