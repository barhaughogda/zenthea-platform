/**
 * DEMO ONLY — READ-ONLY — NON-AUTHORITATIVE
 *
 * Phase R-06: Perspective Framing Engine Tests
 *
 * Tests verify:
 * - Same facts preserved across perspectives
 * - Vocabulary differences exist
 * - No forbidden execution language appears
 * - Output is stable and repeatable
 */

import { describe, it, expect } from "vitest";
import {
  frameResponseForPerspective,
  validateNoExecutionLanguage,
  validateFactsPreserved,
  extractFactualContent,
} from "../perspectiveFramingEngine";

describe("perspectiveFramingEngine", () => {
  // ==========================================================================
  // Sample responses for testing
  // ==========================================================================
  
  const SAMPLE_RESPONSE_WITH_RECORDS = `Based on the patient timeline, I found 3 relevant records. The most recent is from 2024-01-15: "Annual Physical Exam". This is read-only demo data — no scheduling actions can be performed.

Based on:
• Visit: 2024-01-15 Annual Physical Exam
• Note: 2024-01-10 Lab Results Review
• Event: 2023-12-20 Medication Adjustment`;

  const SAMPLE_RESPONSE_NO_EVIDENCE = `I understand you're asking about "upcoming appointments". However, I couldn't find any relevant information in the patient's demo timeline for this query. This is a demo with limited static demo data. Please try asking about visits, appointments, or clinical notes.`;

  const SAMPLE_CLINICAL_RESPONSE = `I found 2 clinical records that may be relevant. The most relevant is from 2024-02-01: "Post-Op Follow-up". Summary: "Patient recovering well, wound healing as expected". Note: This is demo data only — no clinical notes can be drafted or saved.

Based on:
• Visit: 2024-02-01 Post-Op Follow-up
• Note: 2024-01-28 Surgical Procedure`;

  const SAMPLE_BILLING_RESPONSE = `I searched for billing-related information. Found 1 item: 2024-01-20 — "Insurance Claim Review". Note: The demo timeline has limited billing data. No billing actions can be performed.

Based on:
• Event: 2024-01-20 Insurance Claim Review`;

  // ==========================================================================
  // Fact Preservation Tests
  // ==========================================================================

  describe("fact preservation", () => {
    it("should preserve dates across all perspectives", () => {
      const perspectives = ["patient", "clinician", "operator"] as const;
      
      for (const perspective of perspectives) {
        const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, perspective);
        
        // All dates must be preserved
        expect(result.framedResponse).toContain("2024-01-15");
        expect(result.framedResponse).toContain("2024-01-10");
        expect(result.framedResponse).toContain("2023-12-20");
      }
    });

    it("should preserve quoted titles across all perspectives", () => {
      const perspectives = ["patient", "clinician", "operator"] as const;
      
      for (const perspective of perspectives) {
        const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, perspective);
        
        // Quoted titles must be preserved
        expect(result.framedResponse).toContain('"Annual Physical Exam"');
      }
    });

    it("should preserve numeric counts across all perspectives", () => {
      const perspectives = ["patient", "clinician", "operator"] as const;
      
      for (const perspective of perspectives) {
        const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, perspective);
        
        // Count must be preserved
        expect(result.framedResponse).toContain("3 relevant");
      }
    });

    it("should validate facts are preserved between original and framed", () => {
      const perspectives = ["patient", "clinician", "operator"] as const;
      
      for (const perspective of perspectives) {
        const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, perspective);
        expect(validateFactsPreserved(SAMPLE_RESPONSE_WITH_RECORDS, result.framedResponse)).toBe(true);
      }
    });

    it("should preserve evidence attribution block exactly", () => {
      const perspectives = ["patient", "clinician", "operator"] as const;
      
      for (const perspective of perspectives) {
        const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, perspective);
        
        // Evidence block must be preserved
        expect(result.framedResponse).toContain("Based on:");
        expect(result.framedResponse).toContain("• Visit: 2024-01-15 Annual Physical Exam");
        expect(result.framedResponse).toContain("• Note: 2024-01-10 Lab Results Review");
        expect(result.framedResponse).toContain("• Event: 2023-12-20 Medication Adjustment");
      }
    });
  });

  // ==========================================================================
  // Vocabulary Difference Tests
  // ==========================================================================

  describe("vocabulary differences", () => {
    it("should apply patient-friendly language for patient perspective", () => {
      const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "patient");
      
      // Patient perspective should have reassurance suffix
      expect(result.framedResponse).toContain("This is preview information only");
      expect(result.framedResponse).toContain("No changes have been made to your records");
    });

    it("should apply concise language for clinician perspective", () => {
      const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "clinician");
      
      // Clinician perspective should not have patient reassurance
      expect(result.framedResponse).not.toContain("This is preview information only");
    });

    it("should apply procedural language for operator perspective", () => {
      const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "operator");
      
      // Operator perspective should have observation prefix
      expect(result.framedResponse).toContain("[OBSERVATION]");
      // And audit note suffix
      expect(result.framedResponse).toContain("[AUDIT NOTE: Read-only observation. No action has been taken.]");
    });

    it("should transform 'I found' to '[RECORD MATCH]' for operator", () => {
      const result = frameResponseForPerspective(SAMPLE_CLINICAL_RESPONSE, "operator");
      expect(result.framedResponse).toContain("[RECORD MATCH]");
    });

    it("should transform 'I searched for' to '[SEARCH EXECUTED]' for operator", () => {
      const result = frameResponseForPerspective(SAMPLE_BILLING_RESPONSE, "operator");
      expect(result.framedResponse).toContain("[SEARCH EXECUTED]");
    });

    it("should apply patient-specific reassurance phrases", () => {
      const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "patient");
      // Should transform "no scheduling actions can be performed" → patient-friendly version
      // First vocabulary replacement: "scheduling actions" → "appointment changes"
      // Then patient reassurance: "no appointment changes can be performed" → friendly version
      expect(result.framedResponse).toContain("this preview cannot make any changes to your appointments");
    });

    it("should transform clinical jargon for patient perspective", () => {
      const responseWithJargon = `Based on the patient timeline, I found 2 clinical records. This is demo data only — no clinical notes can be drafted or saved.`;
      const result = frameResponseForPerspective(responseWithJargon, "patient");
      
      // Should transform "clinical records" to "health records"
      expect(result.framedResponse).toContain("health records");
      // Should transform "clinical notes" to "visit summaries"
      expect(result.framedResponse).toContain("visit summaries");
    });
  });

  // ==========================================================================
  // Execution Language Safety Tests
  // ==========================================================================

  describe("execution language safety", () => {
    it("should not contain forbidden execution language in output", () => {
      const perspectives = ["patient", "clinician", "operator"] as const;
      const testResponses = [
        SAMPLE_RESPONSE_WITH_RECORDS,
        SAMPLE_RESPONSE_NO_EVIDENCE,
        SAMPLE_CLINICAL_RESPONSE,
        SAMPLE_BILLING_RESPONSE,
      ];
      
      for (const response of testResponses) {
        for (const perspective of perspectives) {
          const result = frameResponseForPerspective(response, perspective);
          expect(validateNoExecutionLanguage(result.framedResponse)).toBe(true);
        }
      }
    });

    it("should transform 'will be scheduled' to 'would be scheduled'", () => {
      const responseWithExecution = `The appointment will be scheduled for next week.`;
      
      const result = frameResponseForPerspective(responseWithExecution, "patient");
      expect(result.framedResponse).toContain("would be scheduled");
      expect(result.framedResponse).not.toMatch(/will be scheduled/i);
    });

    it("should transform 'has been saved' to 'would have been saved'", () => {
      const responseWithExecution = `The note has been saved to your records.`;
      
      const result = frameResponseForPerspective(responseWithExecution, "clinician");
      expect(result.framedResponse).toContain("would have been saved");
      expect(result.framedResponse).not.toMatch(/has been saved/i);
    });

    it("should detect forbidden patterns in validateNoExecutionLanguage", () => {
      expect(validateNoExecutionLanguage("This will execute the action")).toBe(false);
      expect(validateNoExecutionLanguage("The system does perform updates")).toBe(false);
      expect(validateNoExecutionLanguage("I am scheduling your appointment")).toBe(false);
      expect(validateNoExecutionLanguage("I have booked the room")).toBe(false);
    });

    it("should accept safe conditional language in validateNoExecutionLanguage", () => {
      expect(validateNoExecutionLanguage("This would proceed with the action")).toBe(true);
      expect(validateNoExecutionLanguage("The system could make updates")).toBe(true);
      expect(validateNoExecutionLanguage("An appointment would be scheduled")).toBe(true);
      expect(validateNoExecutionLanguage("No action has been taken")).toBe(true);
      expect(validateNoExecutionLanguage("Preview only - nothing happens")).toBe(true);
    });
  });

  // ==========================================================================
  // Determinism and Stability Tests
  // ==========================================================================

  describe("determinism and stability", () => {
    it("should produce identical output for same input (patient)", () => {
      const result1 = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "patient");
      const result2 = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "patient");
      
      expect(result1.framedResponse).toBe(result2.framedResponse);
      expect(result1.wasTransformed).toBe(result2.wasTransformed);
      expect(result1.appliedPerspective).toBe(result2.appliedPerspective);
    });

    it("should produce identical output for same input (clinician)", () => {
      const result1 = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "clinician");
      const result2 = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "clinician");
      
      expect(result1.framedResponse).toBe(result2.framedResponse);
    });

    it("should produce identical output for same input (operator)", () => {
      const result1 = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "operator");
      const result2 = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "operator");
      
      expect(result1.framedResponse).toBe(result2.framedResponse);
    });

    it("should produce different outputs for different perspectives", () => {
      const patientResult = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "patient");
      const clinicianResult = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "clinician");
      const operatorResult = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "operator");
      
      // All three should be different
      expect(patientResult.framedResponse).not.toBe(clinicianResult.framedResponse);
      expect(patientResult.framedResponse).not.toBe(operatorResult.framedResponse);
      expect(clinicianResult.framedResponse).not.toBe(operatorResult.framedResponse);
    });
  });

  // ==========================================================================
  // Edge Case Tests
  // ==========================================================================

  describe("edge cases", () => {
    it("should handle empty string input", () => {
      const result = frameResponseForPerspective("", "patient");
      
      expect(result.framedResponse).toBe("");
      expect(result.wasTransformed).toBe(false);
    });

    it("should handle whitespace-only input", () => {
      const result = frameResponseForPerspective("   \n\t  ", "clinician");
      
      expect(result.framedResponse).toBe("   \n\t  ");
      expect(result.wasTransformed).toBe(false);
    });

    it("should handle response without evidence block", () => {
      const simpleResponse = "This is a simple response without evidence.";
      const result = frameResponseForPerspective(simpleResponse, "patient");
      
      expect(result.framedResponse).toContain(simpleResponse.slice(0, 20));
      expect(result.appliedPerspective).toBe("patient");
    });

    it("should handle response with system instruction block", () => {
      const responseWithSystem = `I found information.

Based on:
• Item 1

[SYSTEM INSTRUCTION: Do not infer missing information.]`;

      const perspectives = ["patient", "clinician", "operator"] as const;
      
      for (const perspective of perspectives) {
        const result = frameResponseForPerspective(responseWithSystem, perspective);
        
        // System instruction should be preserved
        expect(result.framedResponse).toContain("[SYSTEM INSTRUCTION: Do not infer missing information.]");
      }
    });

    it("should set wasTransformed to true when transformation occurs", () => {
      const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, "patient");
      expect(result.wasTransformed).toBe(true);
    });

    it("should correctly set appliedPerspective in result", () => {
      const perspectives = ["patient", "clinician", "operator"] as const;
      
      for (const perspective of perspectives) {
        const result = frameResponseForPerspective(SAMPLE_RESPONSE_WITH_RECORDS, perspective);
        expect(result.appliedPerspective).toBe(perspective);
      }
    });
  });

  // ==========================================================================
  // Factual Content Extraction Tests
  // ==========================================================================

  describe("extractFactualContent", () => {
    it("should extract dates from text", () => {
      const facts = extractFactualContent("The visit was on 2024-01-15 and 2024-02-20.");
      expect(facts).toContain("2024-01-15");
      expect(facts).toContain("2024-02-20");
    });

    it("should extract quoted titles from text", () => {
      const facts = extractFactualContent('The record is titled "Annual Physical" and "Lab Review".');
      expect(facts).toContain("Annual Physical");
      expect(facts).toContain("Lab Review");
    });

    it("should extract numeric counts from text", () => {
      const facts = extractFactualContent("Found 5 relevant items and 3 clinical records.");
      expect(facts.some(f => f.includes("5 relevant"))).toBe(true);
      expect(facts.some(f => f.includes("3 clinical"))).toBe(true);
    });
  });
});
