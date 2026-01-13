import { describe, it, expect } from "vitest";
import {
  evaluateHumanConfirmation,
  getActorLabel,
  getDecisionTypeLabel,
} from "../confirmationPreviewEngine";
import type { ActionReadinessResult, IntentBucket } from "../types";

describe("confirmationPreviewEngine", () => {
  describe("evaluateHumanConfirmation", () => {
    describe("intent → requiredActor mapping", () => {
      it("should return PATIENT for scheduling intent with patient confirmation required", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_PATIENT_CONFIRMATION",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "scheduling",
          actionReadiness,
          "High"
        );
        expect(result.requiredActor).toBe("PATIENT");
        expect(result.explanation).toContain("patient would usually be asked");
      });

      it("should return CLINICIAN for clinical_drafting intent with clinician review required", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_CLINICIAN_REVIEW",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "clinical_drafting",
          actionReadiness,
          "High"
        );
        expect(result.requiredActor).toBe("CLINICIAN");
        expect(result.explanation).toContain("clinician would typically review");
      });

      it("should return OPERATOR when additional data is required", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_ADDITIONAL_DATA",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "scheduling",
          actionReadiness,
          "Low"
        );
        expect(result.requiredActor).toBe("OPERATOR");
        expect(result.explanation).toContain("operator or administrative staff");
      });

      it("should return NONE for informational only", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "INFORMATIONAL_ONLY",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "record_summary",
          actionReadiness,
          "High"
        );
        expect(result.requiredActor).toBe("NONE");
        expect(result.explanation).toContain("informational content");
      });

      it("should return NONE for not actionable in system", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "NOT_ACTIONABLE_IN_SYSTEM",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "unknown",
          actionReadiness,
          "Medium"
        );
        expect(result.requiredActor).toBe("NONE");
      });
    });

    describe("readiness level → decisionType mapping", () => {
      it("should return CONFIRM for patient confirmation", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_PATIENT_CONFIRMATION",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "scheduling",
          actionReadiness,
          "High"
        );
        expect(result.decisionType).toBe("CONFIRM");
      });

      it("should return REVIEW for clinician review", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_CLINICIAN_REVIEW",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "clinical_drafting",
          actionReadiness,
          "High"
        );
        expect(result.decisionType).toBe("REVIEW");
      });

      it("should return PROVIDE_DATA for additional data required", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_ADDITIONAL_DATA",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "scheduling",
          actionReadiness,
          "Low"
        );
        expect(result.decisionType).toBe("PROVIDE_DATA");
      });

      it("should return NOT_APPLICABLE for informational only", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "INFORMATIONAL_ONLY",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "record_summary",
          actionReadiness,
          "High"
        );
        expect(result.decisionType).toBe("NOT_APPLICABLE");
      });
    });

    describe("unknown intent handling", () => {
      it("should return NOT_APPLICABLE for unknown intent with not actionable status", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "NOT_ACTIONABLE_IN_SYSTEM",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "unknown",
          actionReadiness,
          "Medium"
        );
        expect(result.requiredActor).toBe("NONE");
        expect(result.decisionType).toBe("NOT_APPLICABLE");
        expect(result.previewOptions).toHaveLength(0);
      });
    });

    describe("preview options generation", () => {
      it("should return scheduling-specific options for scheduling intent", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_PATIENT_CONFIRMATION",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "scheduling",
          actionReadiness,
          "High"
        );
        expect(result.previewOptions).toContain("Accept proposed time");
        expect(result.previewOptions).toContain("Request alternative");
        expect(result.previewOptions).toContain("Decline");
      });

      it("should return clinical-specific options for clinical_drafting intent", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_CLINICIAN_REVIEW",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "clinical_drafting",
          actionReadiness,
          "High"
        );
        expect(result.previewOptions).toContain("Approve draft");
        expect(result.previewOptions).toContain("Request revisions");
        expect(result.previewOptions).toContain("Reject draft");
      });

      it("should return empty options for informational only", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "INFORMATIONAL_ONLY",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "record_summary",
          actionReadiness,
          "High"
        );
        expect(result.previewOptions).toHaveLength(0);
      });
    });

    describe("rationale generation", () => {
      it("should include low confidence note when confidence is Low", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_PATIENT_CONFIRMATION",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "scheduling",
          actionReadiness,
          "Low"
        );
        expect(result.rationale).toContain("confidence in the available data is limited");
      });

      it("should not include confidence note when confidence is High", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_PATIENT_CONFIRMATION",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "scheduling",
          actionReadiness,
          "High"
        );
        expect(result.rationale).not.toContain("confidence");
      });

      it("should provide scheduling-specific rationale", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_PATIENT_CONFIRMATION",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "scheduling",
          actionReadiness,
          "High"
        );
        expect(result.rationale).toContain("explicit patient consent");
        expect(result.rationale).toContain("prevent booking errors");
      });

      it("should provide clinical-specific rationale", () => {
        const actionReadiness: ActionReadinessResult = {
          category: "REQUIRES_CLINICIAN_REVIEW",
          explanation: "Test",
        };
        const result = evaluateHumanConfirmation(
          "clinical_drafting",
          actionReadiness,
          "High"
        );
        expect(result.rationale).toContain("clinician authorization");
        expect(result.rationale).toContain("medical record integrity");
      });
    });

    describe("language safety", () => {
      const testCases: Array<{ intent: IntentBucket; category: ActionReadinessResult["category"] }> = [
        { intent: "scheduling", category: "REQUIRES_PATIENT_CONFIRMATION" },
        { intent: "clinical_drafting", category: "REQUIRES_CLINICIAN_REVIEW" },
        { intent: "record_summary", category: "INFORMATIONAL_ONLY" },
        { intent: "billing_explanation", category: "INFORMATIONAL_ONLY" },
        { intent: "unknown", category: "NOT_ACTIONABLE_IN_SYSTEM" },
      ];

      testCases.forEach(({ intent, category }) => {
        it(`should use conservative language for ${intent} intent`, () => {
          const actionReadiness: ActionReadinessResult = {
            category,
            explanation: "Test",
          };
          const result = evaluateHumanConfirmation(intent, actionReadiness, "Medium");
          
          // Ensure no forbidden action-implying language
          const allText = `${result.explanation} ${result.rationale}`;
          expect(allText).not.toContain("You can");
          expect(allText).not.toContain("Click to");
          expect(allText).not.toContain("Submit");
          expect(allText).not.toContain("Proceed");
          
          // Ensure conditional language is used
          if (result.requiredActor !== "NONE") {
            expect(result.explanation).toMatch(/would (normally|usually|typically)/);
          }
        });
      });
    });
  });

  describe("getActorLabel", () => {
    it("should return correct labels for each actor", () => {
      expect(getActorLabel("PATIENT")).toBe("Patient");
      expect(getActorLabel("CLINICIAN")).toBe("Clinician");
      expect(getActorLabel("OPERATOR")).toBe("Operator / Staff");
      expect(getActorLabel("NONE")).toBe("No Confirmation Required");
    });
  });

  describe("getDecisionTypeLabel", () => {
    it("should return correct labels for each decision type", () => {
      expect(getDecisionTypeLabel("CONFIRM")).toBe("Confirmation");
      expect(getDecisionTypeLabel("REVIEW")).toBe("Review & Authorization");
      expect(getDecisionTypeLabel("PROVIDE_DATA")).toBe("Data Collection");
      expect(getDecisionTypeLabel("NOT_APPLICABLE")).toBe("Informational Only");
    });
  });
});
