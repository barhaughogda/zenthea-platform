import { describe, it, expect } from "vitest";
import { mapNarrativeSubject } from "../narrativeSubjectMapper";

describe("narrativeSubjectMapper", () => {
  const sampleText = "The patient visited the clinic. The patient's heart rate was normal. We monitored the patient.";

  describe("Clinician Perspective (Pass-through)", () => {
    it("should return text unchanged for clinician", () => {
      const result = mapNarrativeSubject(sampleText, "clinician");
      expect(result).toBe(sampleText);
    });
  });

  describe("Patient Perspective (Second Person)", () => {
    it("should convert 'the patient' to 'you'", () => {
      const text = "Based on the records, the patient has three upcoming appointments.";
      const result = mapNarrativeSubject(text, "patient");
      expect(result).toContain("you have three upcoming appointments");
    });

    it("should convert 'The patient' to 'You'", () => {
      const text = "The patient has been cleared for activity.";
      const result = mapNarrativeSubject(text, "patient");
      expect(result).toBe("You have been cleared for activity.");
    });

    it("should convert 'the patient's' to 'your'", () => {
      const text = "We reviewed the patient's history.";
      const result = mapNarrativeSubject(text, "patient");
      expect(result).toBe("We reviewed your history.");
    });

    it("should convert 'The patient's' to 'Your'", () => {
      const text = "The patient's last visit was in January.";
      const result = mapNarrativeSubject(text, "patient");
      expect(result).toBe("Your last visit was in January.");
    });

    it("should handle multiple references in one string", () => {
      const result = mapNarrativeSubject(sampleText, "patient");
      expect(result).toBe("You visited the clinic. Your heart rate was normal. We monitored you.");
    });
  });

  describe("Operator Perspective (Record Framing)", () => {
    it("should convert 'the patient' to 'this record'", () => {
      const text = "The patient is eligible for the program.";
      const result = mapNarrativeSubject(text, "operator");
      expect(result).toContain("[RECORD] This record is eligible");
    });

    it("should convert 'the patient's' to 'this record's'", () => {
      const text = "The patient's status is active.";
      const result = mapNarrativeSubject(text, "operator");
      expect(result).toContain("[RECORD] This record's status is active.");
    });

    it("should tag multiple paragraphs with [RECORD]", () => {
      const text = "The patient visited.\n\nThe patient's stats are normal.";
      const result = mapNarrativeSubject(text, "operator");
      const lines = result.split("\n\n");
      expect(lines[0]).toBe("[RECORD] This record visited.");
      expect(lines[1]).toBe("[RECORD] This record's stats are normal.");
    });
  });

  describe("Safety and Edge Cases", () => {
    it("should handle empty text", () => {
      expect(mapNarrativeSubject("", "patient")).toBe("");
    });

    it("should handle text already in second person", () => {
      const text = "You have an appointment tomorrow.";
      expect(mapNarrativeSubject(text, "patient")).toBe(text);
    });

    it("should preserve facts, dates, and diagnoses", () => {
      const text = "The patient was diagnosed with Type 2 Diabetes on 2023-10-15.";
      const patientResult = mapNarrativeSubject(text, "patient");
      const operatorResult = mapNarrativeSubject(text, "operator");

      expect(patientResult).toContain("Type 2 Diabetes");
      expect(patientResult).toContain("2023-10-15");
      expect(operatorResult).toContain("Type 2 Diabetes");
      expect(operatorResult).toContain("2023-10-15");
    });

    it("should not introduce forbidden execution language", () => {
      const text = "The patient needs a follow-up.";
      const result = mapNarrativeSubject(text, "patient");
      expect(result).not.toContain("I am scheduling");
      expect(result).not.toContain("Action taken");
    });
  });
});
