import { describe, it, expect } from "vitest";
import { routeEvidence } from "../evidenceRouter";
import { DEMO_PATIENT_CONTEXT } from "../demoPatientContext";
import { DEMO_PATIENT_TIMELINE } from "../demoPatientTimeline";

describe("evidenceRouter", () => {
  it("routes LAB_RESULTS and finds relevant items", () => {
    const routed = routeEvidence({
      message: "lab results",
      questionType: "LAB_RESULTS",
      patientContext: DEMO_PATIENT_CONTEXT,
      patientTimeline: DEMO_PATIENT_TIMELINE,
    });
    expect(routed.questionType).toBe("LAB_RESULTS");
    expect(routed.evidenceItems.length).toBeGreaterThan(0);
    expect(routed.evidenceItems[0].title).toContain("Lab Results");
  });

  it("routes MEDICATION_LIST and uses patient context", () => {
    const routed = routeEvidence({
      message: "medications",
      questionType: "MEDICATION_LIST",
      patientContext: DEMO_PATIENT_CONTEXT,
      patientTimeline: DEMO_PATIENT_TIMELINE,
    });
    expect(routed.questionType).toBe("MEDICATION_LIST");
    expect(routed.evidenceFromContext.medications).toEqual(DEMO_PATIENT_CONTEXT.currentMedications);
    expect(routed.evidenceItems.length).toBe(0);
  });

  it("routes LAST_VISIT_SUMMARY and finds the most recent visit", () => {
    const routed = routeEvidence({
      message: "last visit",
      questionType: "LAST_VISIT_SUMMARY",
      patientContext: DEMO_PATIENT_CONTEXT,
      patientTimeline: DEMO_PATIENT_TIMELINE,
    });
    expect(routed.questionType).toBe("LAST_VISIT_SUMMARY");
    expect(routed.evidenceItems.length).toBe(1);
    expect(routed.evidenceItems[0].type).toBe("visit");
    expect(routed.evidenceItems[0].date).toBe("2025-11-20");
  });

  it("routes UNKNOWN and sets missingDataFlags", () => {
    const routed = routeEvidence({
      message: "hello",
      questionType: "UNKNOWN",
      patientContext: DEMO_PATIENT_CONTEXT,
      patientTimeline: DEMO_PATIENT_TIMELINE,
    });
    expect(routed.questionType).toBe("UNKNOWN");
    expect(routed.missingDataFlags).toContain("Intent ambiguous: needs clarification.");
  });

  it("handles empty timeline correctly", () => {
    const emptyTimeline = { patientId: "PAT-12345", events: [] };
    const routed = routeEvidence({
      message: "lab results",
      questionType: "LAB_RESULTS",
      patientContext: DEMO_PATIENT_CONTEXT,
      patientTimeline: emptyTimeline,
    });
    expect(routed.missingDataFlags).toContain("No lab result objects in provided data.");
  });
});
