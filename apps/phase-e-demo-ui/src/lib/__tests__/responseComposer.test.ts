import { describe, it, expect } from "vitest";
import { composePrimaryResponse } from "../responseComposer";

describe("responseComposer", () => {
  const mockRouted = {
    questionType: "LAB_RESULTS" as any,
    whyThisRouting: "test",
    evidenceItems: [
      { date: "2025-05-11", type: "event" as any, title: "Lab Results: HbA1c", summary: "HbA1c: 6.8%" }
    ],
    evidenceFromContext: { patientName: "Jane Doe" },
    missingDataFlags: [],
  };

  it("composes LAB_RESULTS response", () => {
    const response = composePrimaryResponse({
      message: "labs",
      questionType: "LAB_RESULTS",
      routed: mockRouted,
    });
    expect(response.headline).toBe("Lab results found (read-only)");
    expect(response.body).toContain("Jane Doe");
    expect(response.body).toContain("2025-05-11");
    expect(response.basedOn).toContain("2025-05-11: Lab Results: HbA1c");
  });

  it("composes MEDICATION_LIST response", () => {
    const medRouted = {
      ...mockRouted,
      questionType: "MEDICATION_LIST" as any,
      evidenceItems: [],
      evidenceFromContext: { 
        patientName: "Jane Doe",
        medications: ["Metformin"]
      },
    };
    const response = composePrimaryResponse({
      message: "meds",
      questionType: "MEDICATION_LIST",
      routed: medRouted,
    });
    expect(response.headline).toBe("Medication list (read-only)");
    expect(response.body).toContain("Metformin");
    expect(response.basedOn).toContain("Medication list from patient context");
  });

  it("composes UNKNOWN response with clarifying question", () => {
    const unknownRouted = {
      ...mockRouted,
      questionType: "UNKNOWN" as any,
      evidenceItems: [],
      missingDataFlags: ["Intent ambiguous: needs clarification."],
    };
    const response = composePrimaryResponse({
      message: "hi",
      questionType: "UNKNOWN",
      routed: unknownRouted,
    });
    expect(response.headline).toBe("Needs clarification (read-only)");
    expect(response.body).toContain("Could you please specify");
  });
});
