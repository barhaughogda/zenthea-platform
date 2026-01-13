import { describe, it, expect } from "vitest";
import {
  isValidTransition,
  transitionPreviewState,
  createPreviewConfirmationRecord,
  containsForbiddenStandaloneWord,
  hasConditionalLanguage,
  validateLanguageSafety,
  getPreviewStateLabel,
  getAcknowledgmentBadgeText,
  getActorDisplayConfig,
  FORBIDDEN_STANDALONE_WORDS,
  REQUIRED_CONDITIONAL_PATTERNS,
} from "../interactivePreviewEngine";
import type {
  PreviewConfirmationRecord,
  HumanConfirmationResult,
  ExecutionPlanResult,
} from "../types";

describe("interactivePreviewEngine", () => {
  // ==========================================================================
  // State Transition Tests
  // ==========================================================================
  describe("state transitions", () => {
    describe("isValidTransition", () => {
      it("should allow PROPOSAL_CREATED → PREVIEW_ACKNOWLEDGED", () => {
        expect(isValidTransition("PROPOSAL_CREATED", "PREVIEW_ACKNOWLEDGED")).toBe(true);
      });

      it("should allow PROPOSAL_CREATED → PREVIEW_DENIED", () => {
        expect(isValidTransition("PROPOSAL_CREATED", "PREVIEW_DENIED")).toBe(true);
      });

      it("should NOT allow PREVIEW_ACKNOWLEDGED → any state", () => {
        expect(isValidTransition("PREVIEW_ACKNOWLEDGED", "PROPOSAL_CREATED")).toBe(false);
        expect(isValidTransition("PREVIEW_ACKNOWLEDGED", "PREVIEW_DENIED")).toBe(false);
        expect(isValidTransition("PREVIEW_ACKNOWLEDGED", "PREVIEW_ACKNOWLEDGED")).toBe(false);
      });

      it("should NOT allow PREVIEW_DENIED → any state", () => {
        expect(isValidTransition("PREVIEW_DENIED", "PROPOSAL_CREATED")).toBe(false);
        expect(isValidTransition("PREVIEW_DENIED", "PREVIEW_ACKNOWLEDGED")).toBe(false);
        expect(isValidTransition("PREVIEW_DENIED", "PREVIEW_DENIED")).toBe(false);
      });

      it("should NOT allow PROPOSAL_CREATED → PROPOSAL_CREATED", () => {
        expect(isValidTransition("PROPOSAL_CREATED", "PROPOSAL_CREATED")).toBe(false);
      });
    });

    describe("transitionPreviewState", () => {
      const baseRecord: PreviewConfirmationRecord = {
        previewId: "preview-test-123",
        state: "PROPOSAL_CREATED",
        actor: "PATIENT",
        intentSummary: "Test intent",
        wouldNormallyHappen: ["Test action"],
        confirmationRationale: "Test rationale",
        timestamp: new Date("2024-01-01"),
        sessionRole: "Demo User",
      };

      it("should transition from PROPOSAL_CREATED to PREVIEW_ACKNOWLEDGED", () => {
        const result = transitionPreviewState(baseRecord, "PREVIEW_ACKNOWLEDGED");
        expect(result).not.toBeNull();
        expect(result!.state).toBe("PREVIEW_ACKNOWLEDGED");
        expect(result!.timestamp).not.toEqual(baseRecord.timestamp);
      });

      it("should transition from PROPOSAL_CREATED to PREVIEW_DENIED", () => {
        const result = transitionPreviewState(baseRecord, "PREVIEW_DENIED");
        expect(result).not.toBeNull();
        expect(result!.state).toBe("PREVIEW_DENIED");
      });

      it("should return null for invalid transitions", () => {
        const acknowledgedRecord = { ...baseRecord, state: "PREVIEW_ACKNOWLEDGED" as const };
        expect(transitionPreviewState(acknowledgedRecord, "PROPOSAL_CREATED")).toBeNull();
        expect(transitionPreviewState(acknowledgedRecord, "PREVIEW_DENIED")).toBeNull();
      });

      it("should preserve all other fields during transition", () => {
        const result = transitionPreviewState(baseRecord, "PREVIEW_ACKNOWLEDGED");
        expect(result!.previewId).toBe(baseRecord.previewId);
        expect(result!.actor).toBe(baseRecord.actor);
        expect(result!.intentSummary).toBe(baseRecord.intentSummary);
        expect(result!.sessionRole).toBe(baseRecord.sessionRole);
      });
    });
  });

  // ==========================================================================
  // Language Safety Tests
  // ==========================================================================
  describe("language safety", () => {
    describe("containsForbiddenStandaloneWord", () => {
      it("should detect forbidden words when used standalone", () => {
        const result = containsForbiddenStandaloneWord("Click Submit to proceed");
        expect(result.hasForbidden).toBe(true);
        expect(result.foundWords).toContain("submit");
      });

      it("should detect multiple forbidden words", () => {
        const result = containsForbiddenStandaloneWord("Confirmed and Saved");
        expect(result.hasForbidden).toBe(true);
        expect(result.foundWords).toContain("confirmed");
        expect(result.foundWords).toContain("saved");
      });

      it("should NOT flag forbidden words in preview-only context", () => {
        const result = containsForbiddenStandaloneWord(
          "Preview only: This would normally be submitted"
        );
        expect(result.hasForbidden).toBe(false);
      });

      it("should NOT flag forbidden words with 'would normally' context", () => {
        const result = containsForbiddenStandaloneWord(
          "A patient would normally confirm this booking"
        );
        expect(result.hasForbidden).toBe(false);
      });

      it("should NOT flag forbidden words with 'no action' context", () => {
        const result = containsForbiddenStandaloneWord(
          "No action has been taken. The appointment is not booked."
        );
        expect(result.hasForbidden).toBe(false);
      });

      it("should be case-insensitive", () => {
        const result = containsForbiddenStandaloneWord("SUBMIT NOW");
        expect(result.hasForbidden).toBe(true);
      });

      it("should handle empty text", () => {
        const result = containsForbiddenStandaloneWord("");
        expect(result.hasForbidden).toBe(false);
        expect(result.foundWords).toHaveLength(0);
      });
    });

    describe("hasConditionalLanguage", () => {
      it("should detect 'would normally' pattern", () => {
        const result = hasConditionalLanguage("A clinician would normally review this");
        expect(result.hasConditional).toBe(true);
        expect(result.matchedPatterns).toContain("would normally");
      });

      it("should detect 'would typically' pattern", () => {
        const result = hasConditionalLanguage("This would typically require approval");
        expect(result.hasConditional).toBe(true);
        expect(result.matchedPatterns).toContain("would typically");
      });

      it("should detect 'preview only' pattern", () => {
        const result = hasConditionalLanguage("This is preview only");
        expect(result.hasConditional).toBe(true);
        expect(result.matchedPatterns).toContain("preview only");
      });

      it("should detect 'no action has been taken' pattern", () => {
        const result = hasConditionalLanguage("No action has been taken");
        expect(result.hasConditional).toBe(true);
        expect(result.matchedPatterns).toContain("no action has been taken");
      });

      it("should detect actor-specific patterns", () => {
        expect(
          hasConditionalLanguage("A clinician would review this").hasConditional
        ).toBe(true);
        expect(
          hasConditionalLanguage("A patient would confirm this").hasConditional
        ).toBe(true);
        expect(
          hasConditionalLanguage("An operator would process this").hasConditional
        ).toBe(true);
      });

      it("should return false for text without conditional language", () => {
        const result = hasConditionalLanguage("Click here to proceed");
        expect(result.hasConditional).toBe(false);
        expect(result.matchedPatterns).toHaveLength(0);
      });
    });

    describe("validateLanguageSafety", () => {
      it("should pass for text with conditional language and no forbidden words", () => {
        const result = validateLanguageSafety(
          "A patient would normally be asked to confirm this appointment"
        );
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it("should fail for text with standalone forbidden words", () => {
        const result = validateLanguageSafety("Click Submit to book your appointment");
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it("should pass for forbidden words in safe context", () => {
        const result = validateLanguageSafety(
          "Preview only: No action has been taken. The appointment is not booked."
        );
        expect(result.isValid).toBe(true);
      });
    });

    describe("FORBIDDEN_STANDALONE_WORDS constant", () => {
      it("should include all required forbidden words", () => {
        const requiredWords = ["submit", "confirmed", "booked", "sent", "saved", "approved"];
        requiredWords.forEach((word) => {
          expect(FORBIDDEN_STANDALONE_WORDS).toContain(word);
        });
      });
    });

    describe("REQUIRED_CONDITIONAL_PATTERNS constant", () => {
      it("should include all required patterns", () => {
        const requiredPatterns = [
          "would normally",
          "would typically",
          "would usually",
          "no action has been taken",
          "preview only",
        ];
        requiredPatterns.forEach((pattern) => {
          expect(REQUIRED_CONDITIONAL_PATTERNS).toContain(pattern);
        });
      });
    });
  });

  // ==========================================================================
  // Record Creation Tests
  // ==========================================================================
  describe("createPreviewConfirmationRecord", () => {
    const mockHumanConfirmation: HumanConfirmationResult = {
      requiredActor: "PATIENT",
      decisionType: "CONFIRM",
      previewOptions: ["Accept", "Decline"],
      explanation: "A patient would normally confirm this",
      rationale: "Patient consent is required",
    };

    const mockExecutionPlan: ExecutionPlanResult = {
      planId: "plan-123",
      intentBucket: "scheduling",
      summary: "Schedule an appointment",
      proposedActions: ["Check availability", "Reserve slot"],
      requiredHumanConfirmations: [],
      requiredData: [],
      blockedBy: [],
      evidence: [],
      risks: [],
      disclaimers: [],
    };

    it("should create a record in PROPOSAL_CREATED state", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: mockHumanConfirmation,
        executionPlan: mockExecutionPlan,
      });
      expect(record.state).toBe("PROPOSAL_CREATED");
    });

    it("should generate a unique preview ID", () => {
      const record1 = createPreviewConfirmationRecord({
        humanConfirmation: mockHumanConfirmation,
      });
      const record2 = createPreviewConfirmationRecord({
        humanConfirmation: mockHumanConfirmation,
      });
      expect(record1.previewId).not.toBe(record2.previewId);
    });

    it("should use execution plan summary as intent summary when available", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: mockHumanConfirmation,
        executionPlan: mockExecutionPlan,
      });
      expect(record.intentSummary).toBe(mockExecutionPlan.summary);
    });

    it("should generate wouldNormallyHappen with conditional language", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: mockHumanConfirmation,
        executionPlan: mockExecutionPlan,
      });
      record.wouldNormallyHappen.forEach((item) => {
        const check = hasConditionalLanguage(item);
        expect(check.hasConditional).toBe(true);
      });
    });

    it("should use default session role when not provided", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: mockHumanConfirmation,
      });
      expect(record.sessionRole).toBe("Demo User");
    });

    it("should use provided session role", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: mockHumanConfirmation,
        sessionRole: "Test Patient",
      });
      expect(record.sessionRole).toBe("Test Patient");
    });

    it("should set the correct actor from human confirmation", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: mockHumanConfirmation,
      });
      expect(record.actor).toBe("PATIENT");
    });
  });

  // ==========================================================================
  // Role → Confirmation Mapping Tests
  // ==========================================================================
  describe("getActorDisplayConfig", () => {
    it("should return correct config for PATIENT", () => {
      const config = getActorDisplayConfig("PATIENT");
      expect(config.label).toBe("Patient");
      expect(config.iconName).toBe("user");
      expect(config.colorClass).toBe("indigo");
      expect(config.description).toContain("patient");
      expect(config.description).toContain("would normally");
    });

    it("should return correct config for CLINICIAN", () => {
      const config = getActorDisplayConfig("CLINICIAN");
      expect(config.label).toBe("Clinician");
      expect(config.iconName).toBe("shield");
      expect(config.colorClass).toBe("emerald");
      expect(config.description).toContain("clinician");
      expect(config.description).toContain("would typically");
    });

    it("should return correct config for OPERATOR", () => {
      const config = getActorDisplayConfig("OPERATOR");
      expect(config.label).toBe("Operator / Staff");
      expect(config.iconName).toBe("building");
      expect(config.colorClass).toBe("amber");
      expect(config.description).toContain("operator");
      expect(config.description).toContain("would normally");
    });

    it("should return correct config for NONE", () => {
      const config = getActorDisplayConfig("NONE");
      expect(config.label).toBe("No Confirmation Required");
      expect(config.iconName).toBe("info");
      expect(config.colorClass).toBe("slate");
      expect(config.description).toContain("would normally not");
    });

    it("should use conditional language in all descriptions", () => {
      const actors = ["PATIENT", "CLINICIAN", "OPERATOR", "NONE"] as const;
      actors.forEach((actor) => {
        const config = getActorDisplayConfig(actor);
        const check = hasConditionalLanguage(config.description);
        expect(check.hasConditional).toBe(true);
      });
    });
  });

  // ==========================================================================
  // Display Helper Tests
  // ==========================================================================
  describe("display helpers", () => {
    describe("getPreviewStateLabel", () => {
      it("should return correct label for PROPOSAL_CREATED", () => {
        expect(getPreviewStateLabel("PROPOSAL_CREATED")).toBe("Proposal Created");
      });

      it("should return correct label for PREVIEW_ACKNOWLEDGED", () => {
        expect(getPreviewStateLabel("PREVIEW_ACKNOWLEDGED")).toBe("Preview Acknowledged");
      });

      it("should return correct label for PREVIEW_DENIED", () => {
        expect(getPreviewStateLabel("PREVIEW_DENIED")).toBe("Preview Declined");
      });
    });

    describe("getAcknowledgmentBadgeText", () => {
      const baseRecord: PreviewConfirmationRecord = {
        previewId: "test-123",
        state: "PROPOSAL_CREATED",
        actor: "PATIENT",
        intentSummary: "Test",
        wouldNormallyHappen: [],
        confirmationRationale: "Test",
        timestamp: new Date(),
        sessionRole: "Test User",
      };

      it("should include 'no action taken' for acknowledged state", () => {
        const record = { ...baseRecord, state: "PREVIEW_ACKNOWLEDGED" as const };
        const text = getAcknowledgmentBadgeText(record);
        expect(text).toContain("no action taken");
        expect(text).toContain("acknowledged");
        expect(text).toContain("Test User");
      });

      it("should include 'no action taken' for denied state", () => {
        const record = { ...baseRecord, state: "PREVIEW_DENIED" as const };
        const text = getAcknowledgmentBadgeText(record);
        expect(text).toContain("no action taken");
        expect(text).toContain("declined");
      });

      it("should indicate pending for proposal state", () => {
        const text = getAcknowledgmentBadgeText(baseRecord);
        expect(text).toContain("pending");
        expect(text).toContain("no action taken");
      });
    });
  });

  // ==========================================================================
  // Generated Content Language Safety Tests
  // ==========================================================================
  describe("generated content language safety", () => {
    const mockHumanConfirmation: HumanConfirmationResult = {
      requiredActor: "PATIENT",
      decisionType: "CONFIRM",
      previewOptions: [],
      explanation: "Test",
      rationale: "Test",
    };

    it("should generate confirmationRationale with conditional language for PATIENT", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: { ...mockHumanConfirmation, requiredActor: "PATIENT" },
      });
      const check = hasConditionalLanguage(record.confirmationRationale);
      expect(check.hasConditional).toBe(true);
    });

    it("should generate confirmationRationale with conditional language for CLINICIAN", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: { ...mockHumanConfirmation, requiredActor: "CLINICIAN" },
      });
      const check = hasConditionalLanguage(record.confirmationRationale);
      expect(check.hasConditional).toBe(true);
    });

    it("should generate confirmationRationale with conditional language for OPERATOR", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: { ...mockHumanConfirmation, requiredActor: "OPERATOR" },
      });
      const check = hasConditionalLanguage(record.confirmationRationale);
      expect(check.hasConditional).toBe(true);
    });

    it("should generate confirmationRationale with 'no action' for NONE", () => {
      const record = createPreviewConfirmationRecord({
        humanConfirmation: { ...mockHumanConfirmation, requiredActor: "NONE" },
      });
      const check = hasConditionalLanguage(record.confirmationRationale);
      expect(check.hasConditional).toBe(true);
    });

    it("should not contain forbidden standalone words in any generated content", () => {
      const actors = ["PATIENT", "CLINICIAN", "OPERATOR", "NONE"] as const;
      actors.forEach((actor) => {
        const record = createPreviewConfirmationRecord({
          humanConfirmation: { ...mockHumanConfirmation, requiredActor: actor },
        });
        
        // Check all generated text fields
        const allText = [
          record.intentSummary,
          record.confirmationRationale,
          ...record.wouldNormallyHappen,
        ].join(" ");
        
        const validation = validateLanguageSafety(allText);
        expect(validation.isValid).toBe(true);
      });
    });
  });
});
