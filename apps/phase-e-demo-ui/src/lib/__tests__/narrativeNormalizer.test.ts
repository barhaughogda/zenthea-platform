import { describe, it, expect } from "vitest";
import { normalizeNarrativeSubject } from "../narrativeNormalizer";

describe("narrativeNormalizer", () => {
  const mixedInput = "The patient reported X. You had Y. Patient had Z.";

  describe("PATIENT perspective", () => {
    it("should enforce second-person 'you' throughout", () => {
      const result = normalizeNarrativeSubject(mixedInput, "patient");
      expect(result).not.toContain("patient");
      expect(result).not.toContain("The patient");
      expect(result).toContain("You reported X");
      expect(result).toContain("You had Y");
      expect(result).toContain("You had Z");
    });

    it("should handle possessives", () => {
      const input = "The patient's record shows history.";
      const result = normalizeNarrativeSubject(input, "patient");
      expect(result).toBe("Your record shows history.");
    });
  });

  describe("CLINICIAN perspective", () => {
    it("should enforce third-person professional language", () => {
      const result = normalizeNarrativeSubject(mixedInput, "clinician");
      expect(result).not.toContain("You had");
      expect(result).toContain("The patient reported X");
      expect(result).toContain("the patient had Y");
      expect(result).toContain("The patient had Z");
    });

    it("should allow 'patient' references", () => {
      const result = normalizeNarrativeSubject("The patient is here.", "clinician");
      expect(result).toBe("The patient is here.");
    });
  });

  describe("OPERATOR perspective", () => {
    it("should enforce record-centric language and prefixes", () => {
      const result = normalizeNarrativeSubject(mixedInput, "operator");
      expect(result).not.toContain("patient");
      expect(result).not.toContain("You");
      expect(result).toContain("[RECORD] this record reported X");
      expect(result).toContain("this record had Y");
      expect(result).toContain("this record had Z");
    });

    it("should prefix paragraphs with [RECORD]", () => {
      const input = "First para.\n\nSecond para.";
      const result = normalizeNarrativeSubject(input, "operator");
      const lines = result.split("\n\n");
      expect(lines[0].startsWith("[RECORD]")).toBe(true);
      expect(lines[1].startsWith("[RECORD]")).toBe(true);
    });
  });

  describe("Deterministic behavior", () => {
    it("should produce the same output for the same input", () => {
      const input = "The patient reported X.";
      const result1 = normalizeNarrativeSubject(input, "patient");
      const result2 = normalizeNarrativeSubject(input, "patient");
      expect(result1).toBe(result2);
    });
  });
});
