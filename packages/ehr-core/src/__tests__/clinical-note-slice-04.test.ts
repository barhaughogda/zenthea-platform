/**
 * Clinical Note Slice 04 Tests
 *
 * Verifies Clinical Note core domain:
 * - Fail-closed authority enforcement
 * - Tenant isolation
 * - Encounter binding
 * - Finalized immutability
 * - Read view immutability
 * - Synchronous behavior
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createAuthorityContext } from "../authority/types.js";
import { ClinicalNoteRepository } from "../clinical-note/repository.js";
import { ClinicalNoteWriteModel } from "../clinical-note/write.js";
import { ClinicalNoteReadModel } from "../clinical-note/read.js";
import type { CreateClinicalNoteInput } from "../clinical-note/types.js";

describe("Phase F.2 Slice 4: Clinical Note", () => {
  let repository: ClinicalNoteRepository;
  let writeModel: ClinicalNoteWriteModel;
  let readModel: ClinicalNoteReadModel;

  const TENANT_A = "tenant-a";
  const TENANT_B = "tenant-b";
  const CLINICIAN_1 = "practitioner-1";
  const PATIENT_1 = "patient-1";
  const ENCOUNTER_1 = "encounter-1";

  const validAuthA = createAuthorityContext({
    clinicianId: CLINICIAN_1,
    tenantId: TENANT_A,
    correlationId: "corr-1",
  });

  beforeEach(() => {
    repository = new ClinicalNoteRepository();
    writeModel = new ClinicalNoteWriteModel(repository);
    readModel = new ClinicalNoteReadModel(repository);
  });

  describe("Writes (Create)", () => {
    const validInput: CreateClinicalNoteInput = {
      encounterId: ENCOUNTER_1,
      patientId: PATIENT_1,
      content: "Patient presents with mild symptoms.",
    };

    it("should create a draft clinical note with valid authority", () => {
      const result = writeModel.createClinicalNote(validInput, validAuthA);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe("draft");
        expect(result.data.content).toBe(validInput.content);
        expect(result.data.tenantId).toBe(TENANT_A);
        expect(result.data.practitionerId).toBe(CLINICIAN_1);
        expect(result.data.encounterId).toBe(ENCOUNTER_1);
      }
    });

    it("should fail closed if authority is missing", () => {
      const result = writeModel.createClinicalNote(validInput, null);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_MISSING");
      }
      expect(repository._all()).toHaveLength(0);
    });

    it("should fail closed if authority is invalid", () => {
      const invalidAuth = { clinicianId: "foo" } as any;
      const result = writeModel.createClinicalNote(validInput, invalidAuth);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_INVALID");
      }
      expect(repository._all()).toHaveLength(0);
    });

    it("should fail if content is empty", () => {
      const invalidInput = { ...validInput, content: "  " };
      const result = writeModel.createClinicalNote(invalidInput, validAuthA);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CONTENT_REQUIRED");
      }
    });
  });

  describe("Writes (Finalize)", () => {
    it("should finalize a draft note", () => {
      const createResult = writeModel.createClinicalNote(
        { encounterId: ENCOUNTER_1, patientId: PATIENT_1, content: "Draft content" },
        validAuthA
      );
      expect(createResult.success).toBe(true);
      const noteId = (createResult as any).data.clinicalNoteId;

      const finalizeResult = writeModel.finalizeClinicalNote(noteId, validAuthA);

      expect(finalizeResult.success).toBe(true);
      if (finalizeResult.success) {
        expect(finalizeResult.data.status).toBe("finalized");
        expect(finalizeResult.data.finalizedAt).toBeDefined();
      }
    });

    it("should not allow finalizing twice", () => {
      const createResult = writeModel.createClinicalNote(
        { encounterId: ENCOUNTER_1, patientId: PATIENT_1, content: "Draft content" },
        validAuthA
      );
      const noteId = (createResult as any).data.clinicalNoteId;
      writeModel.finalizeClinicalNote(noteId, validAuthA);

      const result = writeModel.finalizeClinicalNote(noteId, validAuthA);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("ALREADY_FINALIZED");
      }
    });

    it("should enforce tenant isolation during finalize", () => {
      const createResult = writeModel.createClinicalNote(
        { encounterId: ENCOUNTER_1, patientId: PATIENT_1, content: "Draft content" },
        validAuthA
      );
      const noteId = (createResult as any).data.clinicalNoteId;

      const authB = createAuthorityContext({
        clinicianId: "other",
        tenantId: TENANT_B,
        correlationId: "corr-2",
      });

      const result = writeModel.finalizeClinicalNote(noteId, authB);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOTE_NOT_FOUND");
      }
    });
  });

  describe("Read Model & Isolation", () => {
    it("should isolate notes by tenant", () => {
      // Create note in Tenant A
      writeModel.createClinicalNote(
        { encounterId: ENCOUNTER_1, patientId: PATIENT_1, content: "Note A" },
        validAuthA
      );

      // Try to read from Tenant B
      const noteFromB = readModel.getNotesForEncounter(TENANT_B, ENCOUNTER_1);
      expect(noteFromB).toHaveLength(0);

      const noteFromA = readModel.getNotesForEncounter(TENANT_A, ENCOUNTER_1);
      expect(noteFromA).toHaveLength(1);
    });

    it("should isolate notes by encounter", () => {
      writeModel.createClinicalNote(
        { encounterId: "enc-1", patientId: PATIENT_1, content: "Note 1" },
        validAuthA
      );
      writeModel.createClinicalNote(
        { encounterId: "enc-2", patientId: PATIENT_1, content: "Note 2" },
        validAuthA
      );

      const notes1 = readModel.getNotesForEncounter(TENANT_A, "enc-1");
      const notes2 = readModel.getNotesForEncounter(TENANT_A, "enc-2");

      expect(notes1).toHaveLength(1);
      expect(notes1[0].content).toBe("Note 1");
      expect(notes2).toHaveLength(1);
      expect(notes2[0].content).toBe("Note 2");
    });

    it("should return frozen objects that cannot be modified", () => {
      const result = writeModel.createClinicalNote(
        { encounterId: ENCOUNTER_1, patientId: PATIENT_1, content: "Original" },
        validAuthA
      );
      const note = (result as any).data;

      expect(Object.isFrozen(note)).toBe(true);
      
      const readNote = readModel.getNote(TENANT_A, note.clinicalNoteId);
      expect(Object.isFrozen(readNote)).toBe(true);

      expect(() => {
        (readNote as any).content = "Modified";
      }).toThrow();
    });
  });

  describe("Immutability of Finalized Notes", () => {
    it("should not allow modification of finalized notes in repository", () => {
      const createResult = writeModel.createClinicalNote(
        { encounterId: ENCOUNTER_1, patientId: PATIENT_1, content: "Original" },
        validAuthA
      );
      const noteId = (createResult as any).data.clinicalNoteId;
      writeModel.finalizeClinicalNote(noteId, validAuthA);

      const finalized = repository.findById(TENANT_A, noteId)!;
      expect(finalized.status).toBe("finalized");

      expect(() => {
        (finalized as any).content = "Changed";
      }).toThrow();
    });
  });
});
