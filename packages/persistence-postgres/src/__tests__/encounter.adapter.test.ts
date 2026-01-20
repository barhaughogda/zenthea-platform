/**
 * PostgresEncounterRepository Tests
 *
 * Tests for the PostgreSQL Encounter adapter.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { Pool, PoolClient } from "pg";
import { PostgresEncounterRepository } from "../adapters/encounter.adapter.js";
import { PostgresPatientRepository } from "../adapters/patient.adapter.js";
import { PostgresPractitionerRepository } from "../adapters/practitioner.adapter.js";
import type {
  EncounterRecord,
  PatientRecord,
  PractitionerRecord,
} from "@zenthea/ehr-core";

const TEST_DATABASE_URL = process.env["TEST_DATABASE_URL"];
const describeWithDb = TEST_DATABASE_URL ? describe : describe.skip;

describeWithDb("PostgresEncounterRepository", () => {
  let pool: Pool;
  let client: PoolClient;
  let encounterRepo: PostgresEncounterRepository;
  let patientRepo: PostgresPatientRepository;
  let practitionerRepo: PostgresPractitionerRepository;

  const tenantId1 = "00000000-0000-0000-0000-000000000001";
  const tenantId2 = "00000000-0000-0000-0000-000000000002";
  const patientId = "11111111-1111-1111-1111-111111111111";
  const practitionerId = "aaaa1111-1111-1111-1111-111111111111";
  const encounterId1 = "eeee1111-1111-1111-1111-111111111111";

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
    encounterId: encounterId1,
    tenantId: tenantId1,
    patientId: patientId,
    practitionerId: practitionerId,
    status: "planned" as const,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    lastModifiedBy: "practitioner-001",
  });

  beforeAll(async () => {
    pool = new Pool({ connectionString: TEST_DATABASE_URL });
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

    // Clean up in correct order (foreign key constraints)
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
  });

  afterAll(async () => {
    if (client) {
      await client.query("ROLLBACK");
      client.release();
    }
  });

  describe("saveAsync", () => {
    it("should save a new encounter record", async () => {
      const result = await encounterRepo.saveAsync(testEncounter);
      expect(result.success).toBe(true);
    });

    it("should return error for invalid patient reference", async () => {
      const invalidEncounter: EncounterRecord = {
        ...testEncounter,
        patientId: "99999999-9999-9999-9999-999999999999",
      };

      const result = await encounterRepo.saveAsync(invalidEncounter);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FOREIGN_KEY_VIOLATION");
      }
    });
  });

  describe("findByIdAsync", () => {
    it("should return null for non-existent encounter", async () => {
      const result = await encounterRepo.findByIdAsync(tenantId1, encounterId1);
      expect(result).toBeNull();
    });

    it("should find an encounter by ID", async () => {
      await encounterRepo.saveAsync(testEncounter);
      const result = await encounterRepo.findByIdAsync(tenantId1, encounterId1);

      expect(result).not.toBeNull();
      expect(result?.encounterId).toBe(encounterId1);
      expect(result?.patientId).toBe(patientId);
      expect(result?.status).toBe("planned");
    });

    it("should enforce tenant isolation", async () => {
      await encounterRepo.saveAsync(testEncounter);
      const result = await encounterRepo.findByIdAsync(tenantId2, encounterId1);
      expect(result).toBeNull();
    });

    it("should return frozen objects", async () => {
      await encounterRepo.saveAsync(testEncounter);
      const result = await encounterRepo.findByIdAsync(tenantId1, encounterId1);

      expect(result).not.toBeNull();
      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  describe("listByTenantAsync", () => {
    it("should return empty array for tenant with no encounters", async () => {
      const result = await encounterRepo.listByTenantAsync(tenantId1);
      expect(result).toEqual([]);
    });

    it("should return all encounters for a tenant", async () => {
      await encounterRepo.saveAsync(testEncounter);
      await encounterRepo.saveAsync({
        ...testEncounter,
        encounterId: "eeee2222-2222-2222-2222-222222222222",
      });

      const result = await encounterRepo.listByTenantAsync(tenantId1);
      expect(result.length).toBe(2);
    });
  });

  describe("findByPatientAsync", () => {
    it("should find encounters by patient ID", async () => {
      await encounterRepo.saveAsync(testEncounter);

      const result = await encounterRepo.findByPatientAsync(
        tenantId1,
        patientId
      );
      expect(result.length).toBe(1);
      expect(result[0]?.patientId).toBe(patientId);
    });
  });
});
