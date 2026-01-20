/**
 * PostgresClinicalNoteRepository Tests
 *
 * Tests for the PostgreSQL Clinical Note adapter.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { Pool, PoolClient } from "pg";
import { PostgresClinicalNoteRepository } from "../adapters/clinical-note.adapter.js";
import { PostgresEncounterRepository } from "../adapters/encounter.adapter.js";
import { PostgresPatientRepository } from "../adapters/patient.adapter.js";
import { PostgresPractitionerRepository } from "../adapters/practitioner.adapter.js";
import type {
  ClinicalNoteRecord,
  EncounterRecord,
  PatientRecord,
  PractitionerRecord,
} from "@zenthea/ehr-core";

const TEST_DATABASE_URL = process.env["TEST_DATABASE_URL"];
const describeWithDb = TEST_DATABASE_URL ? describe : describe.skip;

describeWithDb("PostgresClinicalNoteRepository", () => {
  let pool: Pool;
  let client: PoolClient;
  let noteRepo: PostgresClinicalNoteRepository;
  let encounterRepo: PostgresEncounterRepository;
  let patientRepo: PostgresPatientRepository;
  let practitionerRepo: PostgresPractitionerRepository;

  const tenantId1 = "00000000-0000-0000-0000-000000000001";
  const tenantId2 = "00000000-0000-0000-0000-000000000002";
  const patientId = "11111111-1111-1111-1111-111111111111";
  const practitionerId = "aaaa1111-1111-1111-1111-111111111111";
  const encounterId = "eeee1111-1111-1111-1111-111111111111";
  const noteId1 = "nnnn1111-1111-1111-1111-111111111111";

  const testPatient: PatientRecord = Object.freeze({
    id: patientId,
    tenantId: tenantId1,
    mrn: "MRN-001",
    demographics: Object.freeze({
      givenName: "John",
      familyName: "Doe",
      dateOfBirth: "1990-01-15",
    }),
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    lastModifiedBy: "system",
  });

  const testPractitioner: PractitionerRecord = Object.freeze({
    id: practitionerId,
    tenantId: tenantId1,
    displayName: "Dr. Alice Smith",
    role: "clinician" as const,
    active: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  });

  const testEncounter: EncounterRecord = Object.freeze({
    encounterId: encounterId,
    tenantId: tenantId1,
    patientId: patientId,
    practitionerId: practitionerId,
    status: "in-progress" as const,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    lastModifiedBy: "practitioner-001",
  });

  const testNote: ClinicalNoteRecord = Object.freeze({
    clinicalNoteId: noteId1,
    tenantId: tenantId1,
    encounterId: encounterId,
    patientId: patientId,
    practitionerId: practitionerId,
    status: "draft" as const,
    content: "Patient presents with symptoms of...",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  });

  beforeAll(async () => {
    pool = new Pool({ connectionString: TEST_DATABASE_URL });
    noteRepo = new PostgresClinicalNoteRepository(pool);
    encounterRepo = new PostgresEncounterRepository(pool);
    patientRepo = new PostgresPatientRepository(pool);
    practitionerRepo = new PostgresPractitionerRepository(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    client = await pool.connect();
    await client.query("BEGIN");

    // Clean up in correct order
    await client.query(
      "DELETE FROM clinical_notes WHERE tenant_id IN ($1, $2)",
      [tenantId1, tenantId2]
    );
    await client.query("DELETE FROM encounters WHERE tenant_id IN ($1, $2)", [
      tenantId1,
      tenantId2,
    ]);
    await client.query("DELETE FROM patients WHERE tenant_id IN ($1, $2)", [
      tenantId1,
      tenantId2,
    ]);
    await client.query(
      "DELETE FROM practitioners WHERE tenant_id IN ($1, $2)",
      [tenantId1, tenantId2]
    );

    // Create prerequisite data
    await patientRepo.saveAsync(testPatient);
    await practitionerRepo.saveAsync(testPractitioner);
    await encounterRepo.saveAsync(testEncounter);
  });

  afterAll(async () => {
    if (client) {
      await client.query("ROLLBACK");
      client.release();
    }
  });

  describe("saveAsync", () => {
    it("should save a new clinical note", async () => {
      const result = await noteRepo.saveAsync(testNote);
      expect(result.success).toBe(true);
    });

    it("should update an existing draft note", async () => {
      await noteRepo.saveAsync(testNote);

      const updatedNote: ClinicalNoteRecord = {
        ...testNote,
        content: "Updated content...",
        updatedAt: "2024-01-02T00:00:00.000Z",
      };

      const result = await noteRepo.saveAsync(updatedNote);
      expect(result.success).toBe(true);

      const retrieved = await noteRepo.findByIdAsync(tenantId1, noteId1);
      expect(retrieved?.content).toBe("Updated content...");
    });

    it("should not allow updating a finalized note", async () => {
      // Save and finalize
      const finalizedNote: ClinicalNoteRecord = {
        ...testNote,
        status: "finalized",
        finalizedAt: "2024-01-01T12:00:00.000Z",
      };
      await noteRepo.saveAsync(finalizedNote);

      // Try to update
      const updateAttempt: ClinicalNoteRecord = {
        ...finalizedNote,
        content: "Attempted update...",
      };

      const result = await noteRepo.saveAsync(updateAttempt);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("CONSTRAINT_VIOLATION");
      }
    });
  });

  describe("findByIdAsync", () => {
    it("should return null for non-existent note", async () => {
      const result = await noteRepo.findByIdAsync(tenantId1, noteId1);
      expect(result).toBeNull();
    });

    it("should find a note by ID", async () => {
      await noteRepo.saveAsync(testNote);
      const result = await noteRepo.findByIdAsync(tenantId1, noteId1);

      expect(result).not.toBeNull();
      expect(result?.clinicalNoteId).toBe(noteId1);
      expect(result?.content).toBe(testNote.content);
    });

    it("should enforce tenant isolation", async () => {
      await noteRepo.saveAsync(testNote);
      const result = await noteRepo.findByIdAsync(tenantId2, noteId1);
      expect(result).toBeNull();
    });

    it("should return frozen objects", async () => {
      await noteRepo.saveAsync(testNote);
      const result = await noteRepo.findByIdAsync(tenantId1, noteId1);

      expect(result).not.toBeNull();
      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  describe("findByEncounterAsync", () => {
    it("should find notes by encounter ID", async () => {
      await noteRepo.saveAsync(testNote);
      await noteRepo.saveAsync({
        ...testNote,
        clinicalNoteId: "nnnn2222-2222-2222-2222-222222222222",
      });

      const result = await noteRepo.findByEncounterAsync(
        tenantId1,
        encounterId
      );
      expect(result.length).toBe(2);
    });

    it("should enforce tenant isolation on encounter lookup", async () => {
      await noteRepo.saveAsync(testNote);

      const result = await noteRepo.findByEncounterAsync(
        tenantId2,
        encounterId
      );
      expect(result.length).toBe(0);
    });
  });

  describe("findByPatientAsync", () => {
    it("should find notes by patient ID", async () => {
      await noteRepo.saveAsync(testNote);

      const result = await noteRepo.findByPatientAsync(tenantId1, patientId);
      expect(result.length).toBe(1);
      expect(result[0]?.patientId).toBe(patientId);
    });
  });
});
