import { describe, it, expect } from "vitest";
import { resolveIdentity } from "../identityResolver";

describe("identityResolver", () => {
  const patientName = "Jane Doe";
  const clinicalInput = "The patient, Jane Doe, reported feeling dizzy on 2025-11-20. The patient's blood pressure was normal.";
  const patientInput = "You reported feeling dizzy on 2025-11-20. Your blood pressure was normal.";

  describe("PATIENT perspective", () => {
    it("should replace patient name with 'you'", () => {
      const result = resolveIdentity("Jane Doe reported this.", "patient", patientName);
      expect(result).toBe("you reported this.");
      expect(result).not.toContain("Jane Doe");
    });

    it("should replace 'the patient' with 'you'", () => {
      const result = resolveIdentity("The patient reported this.", "patient", patientName);
      expect(result).toBe("you reported this.");
    });

    it("should handle possessives for both name and 'the patient'", () => {
      const result = resolveIdentity("Jane Doe's record and the patient's note.", "patient", patientName);
      expect(result).toBe("your record and your note.");
    });

    it("should correct grammar after replacement", () => {
      const result = resolveIdentity("Jane Doe has a follow-up.", "patient", patientName);
      // "Jane Doe" -> "you", "you has" -> "you have"
      expect(result).toBe("you have a follow-up.");
    });

    it("should NEVER allow the patient's name to appear", () => {
      const complexInput = "Jane Doe says Jane Doe is feeling better. The patient's name is Jane Doe.";
      const result = resolveIdentity(complexInput, "patient", patientName);
      expect(result.toLowerCase()).not.toContain("jane");
      expect(result.toLowerCase()).not.toContain("doe");
    });
  });

  describe("CLINICIAN perspective", () => {
    it("should replace second-person language with 'the patient'", () => {
      const result = resolveIdentity("You reported this and your history shows X.", "clinician", patientName);
      expect(result).toBe("the patient reported this and the patient's history shows X.");
    });

    it("should allow patient name AT MOST ONCE", () => {
      const input = "Jane Doe arrived. Jane Doe was seen by Dr. Smith. Jane Doe's chart is ready.";
      const result = resolveIdentity(input, "clinician", patientName);
      
      const nameRegex = new RegExp(patientName, "g");
      const matches = result.match(nameRegex);
      expect(matches?.length).toBe(1);
      expect(result).toContain("Jane Doe arrived. the patient was seen by Dr. Smith. the patient's chart is ready.");
    });
  });

  describe("OPERATOR perspective", () => {
    it("should remove all personal references and replace with record framing", () => {
      const input = "Jane Doe is the patient. You can see the history.";
      const result = resolveIdentity(input, "operator", patientName);
      expect(result).not.toContain("Jane Doe");
      expect(result).not.toContain("patient");
      expect(result).not.toContain("You");
      // "the patient" -> "this record", so "is the patient" -> "is this record"
      expect(result.toLowerCase()).toContain("this record is this record");
      expect(result.toLowerCase()).toContain("this record can see the history");
    });

    it("should prefix paragraphs with [RECORD]", () => {
      const input = "First paragraph.\n\nSecond paragraph.";
      const result = resolveIdentity(input, "operator", patientName);
      const lines = result.split("\n\n");
      expect(lines[0].startsWith("[RECORD]")).toBe(true);
      expect(lines[1].startsWith("[RECORD]")).toBe(true);
    });

    it("should remove conversational tone", () => {
      const input = "Hello, Jane Doe. I found your record.";
      const result = resolveIdentity(input, "operator", patientName);
      expect(result).not.toContain("Hello");
      expect(result).not.toContain("I found");
      expect(result.toLowerCase()).toContain("this record");
    });
  });

  describe("Factual preservation", () => {
    it("should preserve all clinical facts, dates, and values", () => {
      const input = "On 2025-11-20, Jane Doe had a blood pressure of 120/80 and took Metformin 500mg.";
      
      const perspectives: any[] = ["patient", "clinician", "operator"];
      perspectives.forEach(p => {
        const result = resolveIdentity(input, p, patientName);
        expect(result).toContain("2025-11-20");
        expect(result).toContain("120/80");
        expect(result).toContain("Metformin 500mg");
      });
    });
  });

  describe("Idempotency", () => {
    it("should be idempotent (running twice produces same output)", () => {
      const input = "Jane Doe reported that the patient has a cough.";
      const firstPass = resolveIdentity(input, "patient", patientName);
      const secondPass = resolveIdentity(firstPass, "patient", patientName);
      expect(firstPass).toBe(secondPass);
    });
  });
});
