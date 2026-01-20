/**
 * PostgresPractitionerRepository Tests
 *
 * Tests for the PostgreSQL Practitioner adapter.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { Pool, PoolClient } from "pg";
import { PostgresPractitionerRepository } from "../adapters/practitioner.adapter.js";
import type { PractitionerRecord } from "@zenthea/ehr-core";

const TEST_DATABASE_URL = process.env["TEST_DATABASE_URL"];
const describeWithDb = TEST_DATABASE_URL ? describe : describe.skip;

describeWithDb("PostgresPractitionerRepository", () => {
  let pool: Pool;
  let client: PoolClient;
  let repository: PostgresPractitionerRepository;

  const tenantId1 = "00000000-0000-0000-0000-000000000001";
  const tenantId2 = "00000000-0000-0000-0000-000000000002";
  const practitionerId1 = "aaaa1111-1111-1111-1111-111111111111";

  const testPractitioner: PractitionerRecord = Object.freeze({
    id: practitionerId1,
    tenantId: tenantId1,
    displayName: "Dr. Alice Smith",
    role: "clinician" as const,
    active: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  });

  beforeAll(async () => {
    pool = new Pool({ connectionString: TEST_DATABASE_URL });
    repository = new PostgresPractitionerRepository(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    client = await pool.connect();
    await client.query("BEGIN");
    await client.query(
      "DELETE FROM practitioners WHERE tenant_id IN ($1, $2)",
      [tenantId1, tenantId2]
    );
  });

  afterAll(async () => {
    if (client) {
      await client.query("ROLLBACK");
      client.release();
    }
  });

  describe("saveAsync", () => {
    it("should save a new practitioner record", async () => {
      const result = await repository.saveAsync(testPractitioner);
      expect(result.success).toBe(true);
    });
  });

  describe("findByIdAsync", () => {
    it("should return null for non-existent practitioner", async () => {
      const result = await repository.findByIdAsync(tenantId1, practitionerId1);
      expect(result).toBeNull();
    });

    it("should find a practitioner by ID", async () => {
      await repository.saveAsync(testPractitioner);
      const result = await repository.findByIdAsync(tenantId1, practitionerId1);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(practitionerId1);
      expect(result?.displayName).toBe("Dr. Alice Smith");
    });

    it("should enforce tenant isolation", async () => {
      await repository.saveAsync(testPractitioner);
      const result = await repository.findByIdAsync(tenantId2, practitionerId1);
      expect(result).toBeNull();
    });

    it("should return frozen objects", async () => {
      await repository.saveAsync(testPractitioner);
      const result = await repository.findByIdAsync(tenantId1, practitionerId1);

      expect(result).not.toBeNull();
      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  describe("findAllByTenantAsync", () => {
    it("should return empty array for tenant with no practitioners", async () => {
      const result = await repository.findAllByTenantAsync(tenantId1);
      expect(result).toEqual([]);
    });

    it("should return all practitioners for a tenant", async () => {
      await repository.saveAsync(testPractitioner);
      await repository.saveAsync({
        ...testPractitioner,
        id: "bbbb2222-2222-2222-2222-222222222222",
        displayName: "Dr. Bob Jones",
      });

      const result = await repository.findAllByTenantAsync(tenantId1);
      expect(result.length).toBe(2);
    });

    it("should not return practitioners from other tenants", async () => {
      await repository.saveAsync(testPractitioner);
      await repository.saveAsync({
        ...testPractitioner,
        id: "cccc3333-3333-3333-3333-333333333333",
        tenantId: tenantId2,
      });

      const result = await repository.findAllByTenantAsync(tenantId1);
      expect(result.length).toBe(1);
      expect(result[0]?.id).toBe(practitionerId1);
    });
  });
});
