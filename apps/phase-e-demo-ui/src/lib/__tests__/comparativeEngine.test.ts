import { describe, it, expect } from "vitest";
import { buildComparativeInsights, DEMO_NOW } from "../comparativeEngine";
import { TimelineEvent } from "../demoPatientTimeline";

const TEST_TIMELINE: TimelineEvent[] = [
  {
    date: "2025-11-20",
    type: "visit",
    title: "Routine Follow-up (Hypertension)",
    summary: "Blood pressure stable. Medication adherence confirmed.",
  },
  {
    date: "2025-08-15",
    type: "visit",
    title: "Urgent Care - Low Back Pain",
    summary: "Acute lower back strain. Recommended physical therapy.",
  },
  {
    date: "2025-08-16",
    type: "event",
    title: "Referral: Physical Therapy",
    summary: "Referral sent for 6 sessions of PT.",
  },
  {
    date: "2025-05-10",
    type: "visit",
    title: "Annual Wellness Visit",
    summary: "Comprehensive review. HbA1c 6.8%.",
  },
];

describe("comparativeEngine", () => {
  describe("buildComparativeInsights", () => {
    // 1. New keyword vs last encounter
    it("should detect new keywords in current message vs last encounter", () => {
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "I have new dizziness and nausea",
        relevantItems: [TEST_TIMELINE[0]],
        timeline: TEST_TIMELINE,
      });
      expect(insights.differencesVsLastEncounter).toContain("New in this request vs last encounter: dizziness");
      expect(insights.differencesVsLastEncounter).toContain("New in this request vs last encounter: nausea");
    });

    // 2. Previously mentioned keyword missing from current request
    it("should detect keywords from last encounter missing in current request", () => {
      const simpleTimeline: TimelineEvent[] = [
        {
          date: "2025-11-20",
          type: "visit",
          title: "Visit",
          summary: "Hypertension and blood pressure.",
        }
      ];
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "how is my health?",
        relevantItems: [simpleTimeline[0]],
        timeline: simpleTimeline,
      });
      expect(insights.differencesVsLastEncounter).toContain("Previously mentioned but not in this request: hypertension");
      expect(insights.differencesVsLastEncounter).toContain("Previously mentioned but not in this request: blood");
    });

    // 3. Repeated concern detection
    it("should detect repeated concerns across timeline", () => {
      const repeatedTimeline: TimelineEvent[] = [
        ...TEST_TIMELINE,
        {
          date: "2025-12-01",
          type: "visit",
          title: "Follow-up",
          summary: "Patient still reporting back pain.",
        }
      ];
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "my back still hurts",
        relevantItems: [repeatedTimeline[4]],
        timeline: repeatedTimeline,
      });
      expect(insights.trends.some(t => t.includes("back") && t.includes("times"))).toBe(true);
    });

    // 4. Referral follow-up gap detection
    it("should detect referrals without follow-up visits within 90 days", () => {
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "check my referrals",
        relevantItems: [],
        timeline: TEST_TIMELINE,
      });
      expect(insights.gaps.some(g => g.includes("Referral with no follow-up"))).toBe(true);
      expect(insights.gaps.some(g => g.includes("Physical Therapy"))).toBe(true);
    });

    // 5. Encounter gap detection > 90 days
    it("should detect care gaps > 90 days between encounters", () => {
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "any gaps?",
        relevantItems: [],
        timeline: TEST_TIMELINE,
      });
      // Gap between 2025-05-10 and 2025-08-15 is 97 days
      expect(insights.gaps.some(g => g.includes("Care gap") && g.includes("97 days"))).toBe(true);
    });

    // 6. Evidence attribution contains only known demo items
    it("should attribute evidence only to items in the timeline", () => {
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "last visit",
        relevantItems: [TEST_TIMELINE[0]],
        timeline: TEST_TIMELINE,
      });
      expect(insights.evidenceAttribution.every(attr => 
        TEST_TIMELINE.some(item => attr.includes(item.date) && attr.includes(item.title))
      )).toBe(true);
    });

    // 7. Caps enforced - differencesVsLastEncounter
    it("should cap differencesVsLastEncounter at 4 bullets", () => {
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "headache fever cough sore throat dizziness",
        relevantItems: [TEST_TIMELINE[0]],
        timeline: TEST_TIMELINE,
      });
      expect(insights.differencesVsLastEncounter.length).toBeLessThanOrEqual(4);
    });

    // 8. Caps enforced - trends
    it("should cap trends at 4 bullets", () => {
      const manyRepeatsTimeline: TimelineEvent[] = [
        ...TEST_TIMELINE,
        { date: "2025-12-01", type: "note", title: "note1", summary: "pain back cough fever" },
        { date: "2025-12-02", type: "note", title: "note2", summary: "pain back cough fever" },
        { date: "2025-12-03", type: "note", title: "note3", summary: "pain back cough fever" },
      ];
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "trends?",
        relevantItems: [],
        timeline: manyRepeatsTimeline,
      });
      expect(insights.trends.length).toBeLessThanOrEqual(4);
    });

    // 9. Caps enforced - gaps
    it("should cap gaps at 4 bullets", () => {
      const manyGapsTimeline: TimelineEvent[] = [
        { date: "2024-01-01", type: "visit", title: "v1", summary: "summary" },
        { date: "2024-05-01", type: "visit", title: "v2", summary: "summary" },
        { date: "2024-09-01", type: "visit", title: "v3", summary: "summary" },
        { date: "2025-01-01", type: "visit", title: "v4", summary: "summary" },
        { date: "2025-05-01", type: "visit", title: "v5", summary: "summary" },
      ];
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "gaps?",
        relevantItems: [],
        timeline: manyGapsTimeline,
      });
      expect(insights.gaps.length).toBeLessThanOrEqual(4);
    });

    // 10. Recency trend detection
    it("should add recency trend if newest relevant item is within 30 days of DEMO_NOW", () => {
      const recentTimeline: TimelineEvent[] = [
        {
          date: "2026-01-10", // 3 days before DEMO_NOW
          type: "visit",
          title: "Recent Visit",
          summary: "Just a few days ago.",
        }
      ];
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "recent visit",
        relevantItems: [recentTimeline[0]],
        timeline: recentTimeline,
      });
      expect(insights.trends.some(t => t.includes("Recency"))).toBe(true);
    });

    // 11. Time since last encounter calculation
    it("should correctly calculate timeSinceLastEncounterDays", () => {
      const insights = buildComparativeInsights({
        intent: "record_summary",
        message: "when was my last visit?",
        relevantItems: [TEST_TIMELINE[0]],
        timeline: TEST_TIMELINE,
      });
      // DEMO_NOW is 2026-01-13. TEST_TIMELINE[0] is 2025-11-20.
      // 2025-11-20 to 2025-11-30 = 10 days
      // Dec = 31 days
      // Jan = 13 days
      // Total = 10 + 31 + 13 = 54 days
      expect(insights.timeSinceLastEncounterDays).toBe(54);
    });

    // 12. Empty timeline handling
    it("should handle empty timeline gracefully", () => {
      const insights = buildComparativeInsights({
        intent: "unknown",
        message: "hello",
        relevantItems: [],
        timeline: [],
      });
      expect(insights.lastEncounter).toBeUndefined();
      expect(insights.differencesVsLastEncounter).toHaveLength(0);
      expect(insights.trends).toHaveLength(0);
      expect(insights.gaps).toHaveLength(0);
      expect(insights.evidenceAttribution).toHaveLength(0);
    });
  });
});
