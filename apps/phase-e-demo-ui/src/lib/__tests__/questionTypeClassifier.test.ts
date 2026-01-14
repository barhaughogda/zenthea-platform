import { describe, it, expect } from "vitest";
import { classifyQuestionType } from "../questionTypeClassifier";

describe("questionTypeClassifier", () => {
  it("classifies LAB_RESULTS correctly", () => {
    expect(classifyQuestionType("What are my lab results?")).toBe("LAB_RESULTS");
    expect(classifyQuestionType("show me my hba1c")).toBe("LAB_RESULTS");
    expect(classifyQuestionType("glucose levels")).toBe("LAB_RESULTS");
    expect(classifyQuestionType("blood test")).toBe("LAB_RESULTS");
  });

  it("classifies MEDICATION_LIST correctly", () => {
    expect(classifyQuestionType("What medications am I on?")).toBe("MEDICATION_LIST");
    expect(classifyQuestionType("show my meds")).toBe("MEDICATION_LIST");
    expect(classifyQuestionType("prescription for metformin")).toBe("MEDICATION_LIST");
    expect(classifyQuestionType("lisinopril dosage")).toBe("MEDICATION_LIST");
  });

  it("classifies APPOINTMENT_LOOKUP correctly", () => {
    expect(classifyQuestionType("When is my next appointment?")).toBe("APPOINTMENT_LOOKUP");
    expect(classifyQuestionType("schedule a visit")).toBe("APPOINTMENT_LOOKUP");
    expect(classifyQuestionType("booking next week")).toBe("APPOINTMENT_LOOKUP");
  });

  it("classifies LAST_VISIT_SUMMARY correctly", () => {
    expect(classifyQuestionType("What happened at the last visit?")).toBe("LAST_VISIT_SUMMARY");
    expect(classifyQuestionType("most recent visit summary")).toBe("LAST_VISIT_SUMMARY");
  });

  it("classifies DIAGNOSIS_HISTORY correctly", () => {
    expect(classifyQuestionType("What is my diagnosis?")).toBe("DIAGNOSIS_HISTORY");
    expect(classifyQuestionType("problem list")).toBe("DIAGNOSIS_HISTORY");
    expect(classifyQuestionType("dx assessment")).toBe("DIAGNOSIS_HISTORY");
  });

  it("classifies GENERAL_SUMMARY correctly", () => {
    expect(classifyQuestionType("Give me a summary of my record")).toBe("GENERAL_SUMMARY");
    expect(classifyQuestionType("overview of my health")).toBe("GENERAL_SUMMARY");
    expect(classifyQuestionType("what stands out?")).toBe("GENERAL_SUMMARY");
  });

  it("classifies UNKNOWN for ambiguous queries", () => {
    expect(classifyQuestionType("Hello")).toBe("UNKNOWN");
    expect(classifyQuestionType("What's the weather?")).toBe("UNKNOWN");
  });

  it("respects priority: LAB > MEDS", () => {
    // Both "lab" and "meds" are present, should be LAB
    expect(classifyQuestionType("Show me my lab results and meds")).toBe("LAB_RESULTS");
  });
});
