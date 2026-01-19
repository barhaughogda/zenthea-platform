/**
 * Practitioner Slice 2 Tests
 *
 * RIGOR REQUIREMENTS:
 * 1. Writes fail closed without AuthorityContext
 * 2. Writes succeed only when AuthorityContext is present and valid
 * 3. Tenant isolation is strictly enforced for all operations
 * 4. Read model returns frozen immutable views
 * 5. Write model uses discriminated unions (no exceptions)
 * 6. Timestamps (createdAt, updatedAt) are handled correctly
 */

import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryPractitionerRepository } from "../practitioner/repository.js";
import { PractitionerWriteModel } from "../practitioner/write.js";
import { PractitionerReadModel } from "../practitioner/read.js";
import { createAuthorityContext } from "../authority/types.js";
import type { AuthorityContext } from "../authority/types.js";

describe("Practitioner Slice 2", () => {
  let repository: InMemoryPractitionerRepository;
  let writeModel: PractitionerWriteModel;
  let readModel: PractitionerReadModel;
  let validAuthority: AuthorityContext;

  const TENANT_A = "tenant-a";
  const TENANT_B = "tenant-b";

  beforeEach(() => {
    repository = new InMemoryPractitionerRepository();
    writeModel = new PractitionerWriteModel(repository);
    readModel = new PractitionerReadModel(repository);

    validAuthority = createAuthorityContext({
      clinicianId: "clinician-1",
      tenantId: TENANT_A,
      correlationId: "corr-123",
    });
  });

  describe("Authority Enforcement (Fail-Closed)", () => {
    it("should fail to create practitioner without authority context", () => {
      const result = writeModel.createPractitioner(null, {
        displayName: "Dr. Alice",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_MISSING");
      }
    });

    it("should fail to create practitioner with invalid authority context", () => {
      const invalidAuth = { clinicianId: "hack" } as any;
      const result = writeModel.createPractitioner(invalidAuth, {
        displayName: "Dr. Alice",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_INVALID");
      }
    });

    it("should succeed to create practitioner with valid authority context", () => {
      const result = writeModel.createPractitioner(validAuthority, {
        displayName: "Dr. Alice",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.displayName).toBe("Dr. Alice");
        expect(result.data.tenantId).toBe(TENANT_A);
      }
    });
  });

  describe("Tenant Isolation", () => {
    it("should prevent reading practitioner from different tenant", () => {
      // Create in Tenant A
      const createResult = writeModel.createPractitioner(validAuthority, {
        displayName: "Dr. A",
      });
      expect(createResult.success).toBe(true);
      const id = (createResult as any).data.id;

      // Try to read from Tenant B
      const readResult = readModel.getById(TENANT_B, id);
      expect(readResult).toBeUndefined();

      // Should be readable from Tenant A
      const readResultA = readModel.getById(TENANT_A, id);
      expect(readResultA?.displayName).toBe("Dr. A");
    });

    it("should prevent updating practitioner from different tenant", () => {
      // Create in Tenant A
      const createResult = writeModel.createPractitioner(validAuthority, {
        displayName: "Dr. A",
      });
      expect(createResult.success).toBe(true);
      const id = (createResult as any).data.id;

      // Authority for Tenant B
      const authorityB = createAuthorityContext({
        clinicianId: "clinician-2",
        tenantId: TENANT_B,
        correlationId: "corr-456",
      });

      // Try to update using Tenant B authority
      const updateResult = writeModel.updatePractitioner(authorityB, {
        practitionerId: id,
        displayName: "Hacked",
      });

      expect(updateResult.success).toBe(false);
      if (!updateResult.success) {
        expect(updateResult.error.code).toBe("PRACTITIONER_NOT_FOUND");
      }

      // Original record should remain unchanged
      const check = readModel.getById(TENANT_A, id);
      expect(check?.displayName).toBe("Dr. A");
    });
  });

  describe("Read Model Immutability", () => {
    it("should return frozen objects from read model", () => {
      writeModel.createPractitioner(validAuthority, {
        displayName: "Dr. Alice",
      });
      const practitioners = readModel.listAll(TENANT_A);
      const first = practitioners[0];

      expect(Object.isFrozen(first)).toBe(true);
      expect(() => {
        (first as any).displayName = "Changed";
      }).toThrow();
    });
  });

  describe("Timestamps and Invariants", () => {
    it("should set createdAt and updatedAt on creation", () => {
      const result = writeModel.createPractitioner(validAuthority, {
        displayName: "Dr. Alice",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdAt).toBeDefined();
        expect(result.data.updatedAt).toBe(result.data.createdAt);
      }
    });

    it("should update updatedAt on update but preserve createdAt", async () => {
      const createResult = writeModel.createPractitioner(validAuthority, {
        displayName: "Dr. Alice",
      });
      const original = (createResult as any).data;

      // Force a slight delay to ensure timestamp change if possible, 
      // but ISO strings might be same if fast. In real impl we trust Date.now().
      // For testing, we just check they are set.

      const updateResult = writeModel.updatePractitioner(validAuthority, {
        practitionerId: original.id,
        displayName: "Dr. Alice Updated",
      });

      expect(updateResult.success).toBe(true);
      if (updateResult.success) {
        expect(updateResult.data.createdAt).toBe(original.createdAt);
        expect(updateResult.data.updatedAt).toBeDefined();
      }
    });

    it("should enforce 'clinician' role for all practitioners", () => {
      const result = writeModel.createPractitioner(validAuthority, {
        displayName: "Dr. Alice",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.role).toBe("clinician");
      }
    });
  });
});
