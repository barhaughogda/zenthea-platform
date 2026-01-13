/**
 * DEMO ONLY — Unit tests for the deterministic intent classifier.
 * Tests keyword matching rules for all intent buckets.
 */

import { describe, it, expect } from "vitest";
import { classifyIntent, getIntentLabel } from "../intentClassifier";

describe("intentClassifier", () => {
  describe("classifyIntent", () => {
    describe("scheduling intent", () => {
      it("should classify 'appointment' keyword", () => {
        const result = classifyIntent("I need to make an appointment");
        expect(result.intent).toBe("scheduling");
        expect(result.matchedKeywords).toContain("appointment");
      });

      it("should classify 'schedule' keyword", () => {
        const result = classifyIntent("Can I schedule a visit?");
        expect(result.intent).toBe("scheduling");
        expect(result.matchedKeywords).toContain("schedule");
      });

      it("should classify 'reschedule' keyword", () => {
        const result = classifyIntent("I want to reschedule my visit");
        expect(result.intent).toBe("scheduling");
        expect(result.matchedKeywords).toContain("reschedule");
      });

      it("should classify 'book' keyword", () => {
        const result = classifyIntent("How do I book a slot?");
        expect(result.intent).toBe("scheduling");
        expect(result.matchedKeywords).toContain("book");
      });

      it("should classify 'availability' keyword", () => {
        const result = classifyIntent("What is the doctor's availability?");
        expect(result.intent).toBe("scheduling");
        expect(result.matchedKeywords).toContain("availability");
      });

      it("should have high confidence with multiple keywords", () => {
        const result = classifyIntent("I need to schedule an appointment");
        expect(result.intent).toBe("scheduling");
        expect(result.confidence).toBe("high");
        expect(result.matchedKeywords.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe("clinical_drafting intent", () => {
      it("should classify 'note' keyword", () => {
        const result = classifyIntent("Can you draft a note?");
        expect(result.intent).toBe("clinical_drafting");
        expect(result.matchedKeywords).toContain("note");
      });

      it("should classify 'soap' keyword", () => {
        const result = classifyIntent("Generate a SOAP format");
        expect(result.intent).toBe("clinical_drafting");
        expect(result.matchedKeywords).toContain("soap");
      });

      it("should classify 'assessment' keyword", () => {
        const result = classifyIntent("What is the assessment?");
        expect(result.intent).toBe("clinical_drafting");
        expect(result.matchedKeywords).toContain("assessment");
      });

      it("should classify 'diagnosis' keyword", () => {
        const result = classifyIntent("Tell me about the diagnosis");
        expect(result.intent).toBe("clinical_drafting");
        expect(result.matchedKeywords).toContain("diagnosis");
      });

      it("should classify 'draft' keyword", () => {
        const result = classifyIntent("Please draft a summary");
        expect(result.intent).toBe("clinical_drafting");
        expect(result.matchedKeywords).toContain("draft");
      });

      it("should classify 'clinical' keyword", () => {
        const result = classifyIntent("Show me the clinical summary");
        expect(result.intent).toBe("clinical_drafting");
        expect(result.matchedKeywords).toContain("clinical");
      });
    });

    describe("record_summary intent", () => {
      it("should classify 'what happened' phrase", () => {
        const result = classifyIntent("What happened at the last visit?");
        expect(result.intent).toBe("record_summary");
        expect(result.matchedKeywords).toContain("what happened");
      });

      it("should classify 'last visit' phrase", () => {
        const result = classifyIntent("Tell me about my last visit");
        expect(result.intent).toBe("record_summary");
        expect(result.matchedKeywords).toContain("last visit");
      });

      it("should classify 'results' keyword", () => {
        const result = classifyIntent("Show me my results");
        expect(result.intent).toBe("record_summary");
        expect(result.matchedKeywords).toContain("results");
      });

      it("should classify 'labs' keyword", () => {
        const result = classifyIntent("What do my labs say?");
        expect(result.intent).toBe("record_summary");
        expect(result.matchedKeywords).toContain("labs");
      });

      it("should classify 'medication' keyword", () => {
        const result = classifyIntent("What medication am I on?");
        expect(result.intent).toBe("record_summary");
        expect(result.matchedKeywords).toContain("medication");
      });

      it("should classify 'follow-up' keyword", () => {
        const result = classifyIntent("When is my follow-up?");
        expect(result.intent).toBe("record_summary");
        expect(result.matchedKeywords).toContain("follow-up");
      });
    });

    describe("billing_explanation intent", () => {
      it("should classify 'bill' keyword", () => {
        const result = classifyIntent("Explain my bill");
        expect(result.intent).toBe("billing_explanation");
        expect(result.matchedKeywords).toContain("bill");
      });

      it("should classify 'invoice' keyword", () => {
        const result = classifyIntent("Where is my invoice?");
        expect(result.intent).toBe("billing_explanation");
        expect(result.matchedKeywords).toContain("invoice");
      });

      it("should classify 'cost' keyword", () => {
        const result = classifyIntent("What is the cost?");
        expect(result.intent).toBe("billing_explanation");
        expect(result.matchedKeywords).toContain("cost");
      });

      it("should classify 'payment' keyword", () => {
        const result = classifyIntent("How do I make a payment?");
        expect(result.intent).toBe("billing_explanation");
        expect(result.matchedKeywords).toContain("payment");
      });

      it("should classify 'insurance' keyword", () => {
        const result = classifyIntent("Is this covered by insurance?");
        expect(result.intent).toBe("billing_explanation");
        expect(result.matchedKeywords).toContain("insurance");
      });

      it("should classify 'refund' keyword", () => {
        const result = classifyIntent("Can I get a refund?");
        expect(result.intent).toBe("billing_explanation");
        expect(result.matchedKeywords).toContain("refund");
      });
    });

    describe("unknown intent", () => {
      it("should return unknown for unrecognized messages", () => {
        const result = classifyIntent("Hello there!");
        expect(result.intent).toBe("unknown");
        expect(result.matchedKeywords).toHaveLength(0);
        expect(result.confidence).toBe("low");
      });

      it("should return unknown for empty messages", () => {
        const result = classifyIntent("");
        expect(result.intent).toBe("unknown");
        expect(result.matchedKeywords).toHaveLength(0);
      });

      it("should return unknown for random text", () => {
        const result = classifyIntent("The quick brown fox jumps over the lazy dog");
        expect(result.intent).toBe("unknown");
        expect(result.matchedKeywords).toHaveLength(0);
      });

      it("should return unknown for whitespace-only messages", () => {
        const result = classifyIntent("   \t\n   ");
        expect(result.intent).toBe("unknown");
      });
    });

    describe("case insensitivity", () => {
      it("should match uppercase keywords", () => {
        const result = classifyIntent("SCHEDULE an APPOINTMENT");
        expect(result.intent).toBe("scheduling");
      });

      it("should match mixed case keywords", () => {
        const result = classifyIntent("ScHeDuLe An ApPoInTmEnT");
        expect(result.intent).toBe("scheduling");
      });
    });

    describe("priority ordering", () => {
      it("should prefer intent with more keyword matches", () => {
        // "schedule appointment" has 2 scheduling keywords
        const result = classifyIntent("I want to schedule an appointment");
        expect(result.intent).toBe("scheduling");
        expect(result.matchedKeywords.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe("getIntentLabel", () => {
    it("should return correct label for scheduling", () => {
      expect(getIntentLabel("scheduling")).toBe("Scheduling & Appointments");
    });

    it("should return correct label for clinical_drafting", () => {
      expect(getIntentLabel("clinical_drafting")).toBe("Clinical Documentation");
    });

    it("should return correct label for record_summary", () => {
      expect(getIntentLabel("record_summary")).toBe("Record Summary");
    });

    it("should return correct label for billing_explanation", () => {
      expect(getIntentLabel("billing_explanation")).toBe("Billing & Insurance");
    });

    it("should return correct label for unknown", () => {
      expect(getIntentLabel("unknown")).toBe("General Inquiry");
    });
  });
});
