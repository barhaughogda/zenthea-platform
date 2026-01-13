/**
 * DEMO ONLY — Unit tests for the deterministic relevance selector.
 * Tests scoring and selection rules over demo timeline data.
 */

import { describe, it, expect } from "vitest";
import { selectRelevantItems, formatDate } from "../relevanceSelector";
import type { PatientTimeline } from "../demoPatientTimeline";

// Test fixture: subset of the demo timeline
const TEST_TIMELINE: PatientTimeline = {
  patientId: "TEST-001",
  events: [
    {
      date: "2025-11-20",
      type: "visit",
      title: "Routine Follow-up (Hypertension)",
      summary: "Blood pressure stable at 128/82. Medication adherence confirmed.",
    },
    {
      date: "2025-11-20",
      type: "note",
      title: "Care Plan Update",
      summary: "Continue current regimen. Added Cetirizine as needed.",
    },
    {
      date: "2025-08-15",
      type: "visit",
      title: "Urgent Care - Low Back Pain",
      summary: "Patient presented with acute lower back strain.",
    },
    {
      date: "2025-08-16",
      type: "event",
      title: "Referral: Physical Therapy",
      summary: "Referral sent to City Rehabilitation for 6 sessions.",
    },
    {
      date: "2025-05-10",
      type: "visit",
      title: "Annual Wellness Visit",
      summary: "Comprehensive review. HbA1c 6.8% (stable). Labs ordered.",
    },
    {
      date: "2025-05-11",
      type: "event",
      title: "Lab Results: HbA1c & CMP",
      summary: "HbA1c: 6.8%. CMP within normal limits.",
    },
  ],
};

// Empty timeline for edge case testing
const EMPTY_TIMELINE: PatientTimeline = {
  patientId: "TEST-002",
  events: [],
};

describe("relevanceSelector", () => {
  describe("selectRelevantItems", () => {
    describe("scheduling intent", () => {
      it("should return visits and events for scheduling queries", () => {
        const result = selectRelevantItems("I need to schedule an appointment", TEST_TIMELINE);
        expect(result.intent).toBe("scheduling");
        expect(result.hasEvidence).toBe(true);
        expect(result.selectedItems.length).toBeGreaterThan(0);
        expect(result.selectedItems.length).toBeLessThanOrEqual(3);
      });

      it("should score most recent items higher", () => {
        const result = selectRelevantItems("book an appointment", TEST_TIMELINE);
        expect(result.selectedItems[0].date).toBe("2025-11-20");
      });
    });

    describe("clinical_drafting intent", () => {
      it("should return notes and visits for clinical queries", () => {
        const result = selectRelevantItems("draft a clinical note", TEST_TIMELINE);
        expect(result.intent).toBe("clinical_drafting");
        expect(result.hasEvidence).toBe(true);
        
        // Should include notes
        const hasNote = result.selectedItems.some(item => item.type === "note");
        expect(hasNote).toBe(true);
      });

      it("should include visits for assessment queries", () => {
        const result = selectRelevantItems("what is the assessment?", TEST_TIMELINE);
        expect(result.intent).toBe("clinical_drafting");
        expect(result.hasEvidence).toBe(true);
      });
    });

    describe("record_summary intent", () => {
      it("should return relevant items for last visit queries", () => {
        const result = selectRelevantItems("what happened at the last visit?", TEST_TIMELINE);
        expect(result.intent).toBe("record_summary");
        expect(result.hasEvidence).toBe(true);
      });

      it("should return labs for lab-related queries", () => {
        const result = selectRelevantItems("show me the lab results", TEST_TIMELINE);
        expect(result.intent).toBe("record_summary");
        expect(result.hasEvidence).toBe(true);
        
        // Should find the lab results event
        const hasLabs = result.selectedItems.some(item => 
          item.title.toLowerCase().includes("lab")
        );
        expect(hasLabs).toBe(true);
      });

      it("should match medication queries", () => {
        const result = selectRelevantItems("what medication am I on?", TEST_TIMELINE);
        expect(result.intent).toBe("record_summary");
        expect(result.hasEvidence).toBe(true);
      });
    });

    describe("billing_explanation intent", () => {
      it("should return no evidence when no billing events exist", () => {
        const result = selectRelevantItems("explain my bill", TEST_TIMELINE);
        expect(result.intent).toBe("billing_explanation");
        // The test timeline has no billing-related events
        expect(result.hasEvidence).toBe(false);
        expect(result.selectedItems).toHaveLength(0);
      });

      it("should include explanation about missing billing data", () => {
        const result = selectRelevantItems("show me my insurance claim", TEST_TIMELINE);
        expect(result.intent).toBe("billing_explanation");
        expect(result.explanation.some(e => 
          e.toLowerCase().includes("billing") || e.toLowerCase().includes("no")
        )).toBe(true);
      });
    });

    describe("unknown intent", () => {
      it("should return no evidence for unknown intents without keyword matches", () => {
        const result = selectRelevantItems("hello world", TEST_TIMELINE);
        expect(result.intent).toBe("unknown");
        // Unknown intent doesn't get type matching bonus
        expect(result.hasEvidence).toBe(false);
      });

      it("should include helpful explanation for unknown intents", () => {
        const result = selectRelevantItems("random gibberish xyz", TEST_TIMELINE);
        expect(result.intent).toBe("unknown");
        expect(result.explanation.length).toBeGreaterThan(0);
      });
    });

    describe("scoring rules", () => {
      it("should apply type match bonus (+3) correctly", () => {
        const result = selectRelevantItems("schedule visit", TEST_TIMELINE);
        // Visits should get +3 for type match in scheduling intent
        const visitItem = result.selectedItems.find(item => item.type === "visit");
        if (visitItem) {
          expect(visitItem.scoreBreakdown.typeMatch).toBe(3);
        }
      });

      it("should apply keyword match bonus (+2) correctly", () => {
        const result = selectRelevantItems("back pain", TEST_TIMELINE);
        // Should find the "Low Back Pain" visit and give keyword bonus
        const backPainItem = result.selectedItems.find(item => 
          item.title.toLowerCase().includes("back")
        );
        if (backPainItem) {
          expect(backPainItem.scoreBreakdown.keywordMatch).toBe(2);
        }
      });

      it("should apply recency bonus (+1) to most recent item", () => {
        const result = selectRelevantItems("what happened", TEST_TIMELINE);
        const mostRecentItem = result.selectedItems.find(item => 
          item.date === "2025-11-20"
        );
        if (mostRecentItem) {
          expect(mostRecentItem.scoreBreakdown.recencyBonus).toBe(1);
        }
      });

      it("should sort by score descending, then by date descending", () => {
        const result = selectRelevantItems("visit", TEST_TIMELINE);
        for (let i = 1; i < result.selectedItems.length; i++) {
          const prev = result.selectedItems[i - 1];
          const curr = result.selectedItems[i];
          
          if (prev.score === curr.score) {
            // If same score, prev date should be >= curr date
            expect(new Date(prev.date).getTime()).toBeGreaterThanOrEqual(
              new Date(curr.date).getTime()
            );
          } else {
            // prev score should be > curr score
            expect(prev.score).toBeGreaterThan(curr.score);
          }
        }
      });

      it("should select at most 3 items", () => {
        const result = selectRelevantItems("visit note event", TEST_TIMELINE);
        expect(result.selectedItems.length).toBeLessThanOrEqual(3);
      });

      it("should only select items with score > 0", () => {
        const result = selectRelevantItems("schedule appointment", TEST_TIMELINE);
        for (const item of result.selectedItems) {
          expect(item.score).toBeGreaterThan(0);
        }
      });
    });

    describe("explanation generation", () => {
      it("should include intent classification in explanation", () => {
        const result = selectRelevantItems("schedule appointment", TEST_TIMELINE);
        expect(result.explanation.some(e => 
          e.includes("Intent classified")
        )).toBe(true);
      });

      it("should include matched keywords in explanation", () => {
        const result = selectRelevantItems("schedule appointment", TEST_TIMELINE);
        expect(result.explanation.some(e => 
          e.includes("schedule") || e.includes("appointment")
        )).toBe(true);
      });

      it("should list selected items in explanation", () => {
        const result = selectRelevantItems("what happened at my visit", TEST_TIMELINE);
        if (result.hasEvidence) {
          expect(result.explanation.some(e => e.includes("Found"))).toBe(true);
        }
      });
    });

    describe("empty timeline handling", () => {
      it("should handle empty timeline gracefully", () => {
        const result = selectRelevantItems("schedule appointment", EMPTY_TIMELINE);
        expect(result.hasEvidence).toBe(false);
        expect(result.selectedItems).toHaveLength(0);
        expect(result.explanation.length).toBeGreaterThan(0);
      });

      it("should not crash on empty timeline", () => {
        expect(() => {
          selectRelevantItems("anything", EMPTY_TIMELINE);
        }).not.toThrow();
      });
    });

    describe("edge cases", () => {
      it("should handle empty message", () => {
        const result = selectRelevantItems("", TEST_TIMELINE);
        expect(result.intent).toBe("unknown");
        expect(result.hasEvidence).toBe(false);
      });

      it("should handle whitespace-only message", () => {
        const result = selectRelevantItems("   \n\t   ", TEST_TIMELINE);
        expect(result.intent).toBe("unknown");
      });

      it("should be case insensitive", () => {
        const lower = selectRelevantItems("schedule appointment", TEST_TIMELINE);
        const upper = selectRelevantItems("SCHEDULE APPOINTMENT", TEST_TIMELINE);
        
        expect(lower.intent).toBe(upper.intent);
        expect(lower.hasEvidence).toBe(upper.hasEvidence);
      });
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const result = formatDate("2025-11-20");
      expect(result).toContain("Nov");
      expect(result).toContain("20");
      expect(result).toContain("2025");
    });

    it("should handle different date formats", () => {
      const result = formatDate("2025-05-10");
      expect(result).toContain("May");
      expect(result).toContain("10");
      expect(result).toContain("2025");
    });
  });
});
