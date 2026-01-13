import { describe, it, expect } from "vitest";
import { buildConfidenceAnnotations } from "../confidenceEngine";
import { RelevanceResult, ComparativeInsights } from "../types";

describe("confidenceEngine", () => {
  const mockRelevance: RelevanceResult = {
    intent: "record_summary",
    selectedItems: [
      {
        date: "2025-10-15",
        type: "visit",
        title: "Annual Wellness Visit",
        summary: "Patient reports feeling well.",
        score: 10,
        scoreBreakdown: { typeMatch: 5, keywordMatch: 5, recencyBonus: 0 }
      }
    ],
    explanation: ["Matched keywords: wellness"],
    hasEvidence: true,
    maxScore: 10,
    evidenceAttribution: ["2025-10-15: Annual Wellness Visit"]
  };

  const mockComparative: ComparativeInsights = {
    lastEncounter: "2025-10-15: Annual Wellness Visit",
    timeSinceLastEncounterDays: 90,
    differencesVsLastEncounter: ["New in this request vs last encounter: fatigue"],
    trends: ["Repeated mention across visits: hypertension"],
    gaps: ["Care gap: 2025-10-15 to 2026-01-13 (90 days)"],
    evidenceAttribution: ["2025-10-15: Annual Wellness Visit"]
  };

  it("should create OBSERVED annotation for relevant items", () => {
    const annotations = buildConfidenceAnnotations(mockRelevance, mockComparative);
    const observed = annotations.find(a => a.category === "OBSERVED");
    
    expect(observed).toBeDefined();
    expect(observed?.confidence).toBe("High");
    expect(observed?.statement).toContain("Directly referenced record");
  });

  it("should create PATTERN annotation for trends", () => {
    const annotations = buildConfidenceAnnotations(mockRelevance, mockComparative);
    const pattern = annotations.find(a => a.category === "PATTERN");
    
    expect(pattern).toBeDefined();
    expect(pattern?.confidence).toBe("Medium");
    expect(pattern?.statement).toBe(mockComparative.trends[0]);
  });

  it("should create COMPARATIVE annotation for differences", () => {
    const annotations = buildConfidenceAnnotations(mockRelevance, mockComparative);
    const comp = annotations.find(a => a.category === "COMPARATIVE");
    
    expect(comp).toBeDefined();
    expect(comp?.confidence).toBe("Medium");
    expect(comp?.statement).toBe(mockComparative.differencesVsLastEncounter[0]);
  });

  it("should create UNCERTAIN annotation for gaps", () => {
    const annotations = buildConfidenceAnnotations(mockRelevance, mockComparative);
    const uncertainty = annotations.find(a => a.category === "UNCERTAIN");
    
    expect(uncertainty).toBeDefined();
    expect(uncertainty?.confidence).toBe("Low");
    expect(uncertainty?.statement).toBe(mockComparative.gaps[0]);
  });

  it("should flag intent uncertainty when intent is unknown", () => {
    const unknownRelevance = { ...mockRelevance, intent: "unknown" as any };
    const annotations = buildConfidenceAnnotations(unknownRelevance, mockComparative);
    
    const intentUncertainty = annotations.find(a => a.statement.includes("intent is ambiguous"));
    expect(intentUncertainty).toBeDefined();
    expect(intentUncertainty?.confidence).toBe("Low");
  });

  it("should flag uncertainty when no evidence is found", () => {
    const noEvidenceRelevance = { ...mockRelevance, hasEvidence: false, selectedItems: [] };
    const emptyComparative = { ...mockComparative, trends: [], gaps: [], differencesVsLastEncounter: [] };
    
    const annotations = buildConfidenceAnnotations(noEvidenceRelevance, emptyComparative);
    const noEvidence = annotations.find(a => a.category === "UNCERTAIN");
    
    expect(noEvidence).toBeDefined();
    expect(noEvidence?.statement).toContain("No relevant evidence found");
  });
});
