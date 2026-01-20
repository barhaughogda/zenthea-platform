/**
 * PostgresPatientRepository Tests
 *
 * Tests for the PostgreSQL Patient adapter.
 *
 * REQUIREMENTS:
 * - PostgreSQL database must be running
 * - TEST_DATABASE_URL environment variable must be set
 * - Migrations must be applied before running tests
 *
 * TEST STRATEGY:
 * - Uses transaction rollback for test isolation
 * - Verifies tenant isolation
 * - Verifies correct field mapping
 * - Verifies immutability of returned objects
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { Pool, PoolClient } from "pg";
import { PostgresPatientRepository } from "../adapters/patient.adapter.js";
import type { PatientRecord } from "@zenthea/ehr-core";

// Skip tests if no database URL is provided
const TEST_DATABASE_URL = process.env["TEST_DATABASE_URL"];
const describeWithDb = TEST_DATABASE_URL ? describe : describe.skip;

describeWithDb("PostgresPatientRepository", () => {
  let pool: Pool;
  let client: PoolClient;
  let repository: PostgresPatientRepository;

  // Test data
  const tenantId1 = "00000000-0000-0000-0000-000000000001";
  const tenantId2 = "00000000-0000-0000-0000-000000000002";
  const patientId1 = "11111111-1111-1111-1111-111111111111";
  const patientId2 = "22222222-2222-2222-2222-222222222222";

  const testPatient1: PatientRecord = Object.freeze({
    id: patientId1,
    tenantId: tenantId1,
    mrn: "MRN-001",
    demographics: Object.freeze({
      givenName: "John",
      familyName: "Doe",
      dateOfBirth: "1990-01-15",
    }),
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    lastModifiedBy: "practitioner-001",
  });

  const testPatient2: PatientRecord = Object.freeze({
    id: patientId2,
    tenantId: tenantId2,
    mrn: "MRN-002",
    demographics: Object.freeze({
      givenName: "Jane",
      familyName: "Smith",
      dateOfBirth: "1985-06-20",
    }),
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
    lastModifiedBy: "practitioner-002",
  });

  beforeAll(async () => {
    pool = new Pool({ connectionString: TEST_DATABASE_URL });
    repository = new PostgresPatientRepository(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    // Start a transaction for test isolation
    client = await pool.connect();
    await client.query("BEGIN");

    // Clean up test data
    await client.query("DELETE FROM clinical_notes WHERE tenant_id IN ($1, $2)", [
      tenantId1,
      tenantId2,
    ]);
    await client.query("DELETE FROM encounters WHERE tenant_id IN ($1, $2)", [
      tenantId1,
      tenantId2,
    ]);
    await client.query("DELETE FROM patients WHERE tenant_id IN ($1, $2)", [
      tenantId1,
      tenantId2,
    ]);
  });

  afterAll(async () => {
    // Rollback to clean up
    if (client) {
      await client.query("ROLLBACK");
      client.release();
    }
  });

  describe("saveAsync", () => {
    it("should save a new patient record", async () => {
      const result = await repository.saveAsync(testPatient1);

      expect(result.success).toBe(true);
    });

    it("should update an existing patient record", async () => {
      // First save
      await repository.saveAsync(testPatient1);

      // Update
      const updatedPatient: PatientRecord = {
        ...testPatient1,
        demographics: {
          ...testPatient1.demographics,
          givenName: "Johnny",
        },
        updatedAt: "2024-01-15T00:00:00.000Z",
      };

      const result = await repository.saveAsync(updatedPatient);
      expect(result.success).toBe(true);

      // Verify update
      const retrieved = await repository.findByIdAsync(tenantId1, patientId1);
      expect(retrieved?.demographics.givenName).toBe("Johnny");
    });
  });

  describe("findByIdAsync", () => {
    it("should return null for non-existent patient", async () => {
      const result = await repository.findByIdAsync(tenantId1, patientId1);

      expect(result).toBeNull();
    });

    it("should find a patient by ID", async () => {
      await repository.saveAsync(testPatient1);

      const result = await repository.findByIdAsync(tenantId1, patientId1);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(patientId1);
      expect(result?.tenantId).toBe(tenantId1);
    });

    it("should enforce tenant isolation", async () => {
      await repository.saveAsync(testPatient1);

      // Try to access with different tenant
      const result = await repository.findByIdAsync(tenantId2, patientId1);

      expect(result).toBeNull();
    });

    it("should return frozen (immutable) objects", async () => {
      await repository.saveAsync(testPatient1);

      const result = await repository.findByIdAsync(tenantId1, patientId1);

      expect(result).not.toBeNull();
      expect(Object.isFrozen(result)).toBe(true);
      expect(Object.isFrozen(result?.demographics)).toBe(true);
    });

    it("should correctly map all fields", async () => {
      await repository.saveAsync(testPatient1);

      const result = await repository.findByIdAsync(tenantId1, patientId1);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(testPatient1.id);
      expect(result?.tenantId).toBe(testPatient1.tenantId);
      expect(result?.mrn).toBe(testPatient1.mrn);
      expect(result?.demographics.givenName).toBe(
        testPatient1.demographics.givenName
      );
      expect(result?.demographics.familyName).toBe(
        testPatient1.demographics.familyName
      );
      expect(result?.demographics.dateOfBirth).toBe(
        testPatient1.demographics.dateOfBirth
      );
      expect(result?.lastModifiedBy).toBe(testPatient1.lastModifiedBy);
    });
  });

  describe("findByMrnAsync", () => {
    it("should find a patient by MRN", async () => {
      await repository.saveAsync(testPatient1);

      const result = await repository.findByMrnAsync(tenantId1, "MRN-001");

      expect(result).not.toBeNull();
      expect(result?.mrn).toBe("MRN-001");
    });

    it("should return null for non-existent MRN", async () => {
      const result = await repository.findByMrnAsync(tenantId1, "NONEXISTENT");

      expect(result).toBeNull();
    });

    it("should enforce tenant isolation on MRN lookup", async () => {
      await repository.saveAsync(testPatient1);

      const result = await repository.findByMrnAsync(tenantId2, "MRN-001");

      expect(result).toBeNull();
    });
  });

  describe("listByTenantAsync", () => {
    it("should return empty array for tenant with no patients", async () => {
      const result = await repository.listByTenantAsync(tenantId1);

      expect(result).toEqual([]);
    });

    it("should return all patients for a tenant", async () => {
      await repository.saveAsync(testPatient1);
      await repository.saveAsync({
        ...testPatient1,
        id: "33333333-3333-3333-3333-333333333333",
        mrn: "MRN-003",
      });

      const result = await repository.listByTenantAsync(tenantId1);

      expect(result.length).toBe(2);
    });

    it("should not return patients from other tenants", async () => {
      await repository.saveAsync(testPatient1);
      await repository.saveAsync(testPatient2);

      const result1 = await repository.listByTenantAsync(tenantId1);
      const result2 = await repository.listByTenantAsync(tenantId2);

      expect(result1.length).toBe(1);
      expect(result1[0]?.id).toBe(patientId1);
      expect(result2.length).toBe(1);
      expect(result2[0]?.id).toBe(patientId2);
    });

    it("should return frozen objects in the list", async () => {
      await repository.saveAsync(testPatient1);

      const result = await repository.listByTenantAsync(tenantId1);

      expect(result.length).toBe(1);
      expect(Object.isFrozen(result[0])).toBe(true);
    });
  });
});
