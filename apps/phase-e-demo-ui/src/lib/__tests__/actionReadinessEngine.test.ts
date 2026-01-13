import { describe, it, expect } from "vitest";
import { evaluateActionReadiness } from "../actionReadinessEngine";
import { RelevanceResult, ConfidenceAnnotation } from "../types";

describe("actionReadinessEngine", () => {
  const mockRelevance: RelevanceResult = {
    intent: "record_summary",
    selectedItems: [],
    explanation: [],
    hasEvidence: true,
    maxScore: 10,
    evidenceAttribution: []
  };

  const mockAnnotations: ConfidenceAnnotation[] = [
    {
      statement: "Data point A",
      category: "OBSERVED",
      confidence: "High",
      reason: "Found in record"
    }
  ];

  it("should return INFORMATIONAL_ONLY for record summary intent", () => {
    const result = evaluateActionReadiness("record_summary", mockRelevance, mockAnnotations);
    expect(result.category).toBe("INFORMATIONAL_ONLY");
    expect(result.explanation).toContain("informational purposes only");
    expect(result.explanation).toContain("No action has been taken");
  });

  it("should return REQUIRES_PATIENT_CONFIRMATION for scheduling intent", () => {
    const result = evaluateActionReadiness("scheduling", { ...mockRelevance, intent: "scheduling" }, mockAnnotations);
    expect(result.category).toBe("REQUIRES_PATIENT_CONFIRMATION");
    expect(result.explanation).toContain("This would normally require");
    expect(result.explanation).toContain("clinician to coordinate");
    expect(result.explanation).toContain("patient to confirm");
  });

  it("should return REQUIRES_CLINICIAN_REVIEW for clinical drafting intent", () => {
    const result = evaluateActionReadiness("clinical_drafting", { ...mockRelevance, intent: "clinical_drafting" }, mockAnnotations);
    expect(result.category).toBe("REQUIRES_CLINICIAN_REVIEW");
    expect(result.explanation).toContain("clinician to review and authorize");
  });

  it("should return REQUIRES_ADDITIONAL_DATA when uncertainty is detected", () => {
    const uncertainAnnotations: ConfidenceAnnotation[] = [
      ...mockAnnotations,
      {
        statement: "Missing follow-up",
        category: "UNCERTAIN",
        confidence: "Low",
        reason: "Time gap"
      }
    ];
    const result = evaluateActionReadiness("scheduling", { ...mockRelevance, intent: "scheduling" }, uncertainAnnotations);
    expect(result.category).toBe("REQUIRES_ADDITIONAL_DATA");
    expect(result.explanation).toContain("normally require additional data points");
  });

  it("should return NOT_ACTIONABLE_IN_SYSTEM for unknown intent", () => {
    const result = evaluateActionReadiness("unknown", { ...mockRelevance, intent: "unknown" }, mockAnnotations);
    expect(result.category).toBe("NOT_ACTIONABLE_IN_SYSTEM");
    expect(result.explanation).toContain("This system does not perform this action");
  });

  it("should return NOT_ACTIONABLE_IN_SYSTEM when no evidence is found", () => {
    const result = evaluateActionReadiness("scheduling", { ...mockRelevance, hasEvidence: false }, mockAnnotations);
    expect(result.category).toBe("NOT_ACTIONABLE_IN_SYSTEM");
    expect(result.explanation).toContain("No action has been taken");
  });
});
