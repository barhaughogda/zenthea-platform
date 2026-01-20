/**
 * Encounter Slice 3 Tests - Phase F.2
 *
 * These tests verify:
 * 1. Writes fail closed without AuthorityContext
 * 2. Writes succeed only when AuthorityContext is present and valid
 * 3. Read functions do not expose mutation capability
 * 4. Tenant isolation is enforced for all operations
 * 5. Encounter creation correctly binds patient and practitioner
 * 6. Status updates correctly change updatedAt timestamp
 * 7. Read model returns frozen views
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  createAuthorityContext,
} from "../authority/types.js";
import type { AuthorityContext } from "../authority/types.js";
import { EncounterWriteModel } from "../encounter/write.js";
import { EncounterReadModel } from "../encounter/read.js";
import { InMemoryEncounterRepository } from "../encounter/repository.js";
import type { CreateEncounterInput } from "../encounter/types.js";

describe("Phase F.2 Slice 3 - Encounter Implementation", () => {
  let repository: InMemoryEncounterRepository;
  let writeModel: EncounterWriteModel;
  let readModel: EncounterReadModel;
  let validAuthority: AuthorityContext;

  const validInput: CreateEncounterInput = {
    patientId: "pat-123",
    practitionerId: "prac-456",
    status: "planned",
  };

  beforeEach(() => {
    repository = new InMemoryEncounterRepository();
    writeModel = new EncounterWriteModel(repository);
    readModel = new EncounterReadModel(repository);
    validAuthority = createAuthorityContext({
      clinicianId: "clinician-123",
      tenantId: "tenant-001",
      correlationId: "corr-abc",
    });
  });

  describe("AuthorityContext Enforcement", () => {
    it("should fail closed when AuthorityContext is undefined", () => {
      const result = writeModel.createEncounter(validInput, undefined);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_MISSING");
      }
    });

    it("should fail closed when AuthorityContext is invalid", () => {
      const fakeAuthority = {
        clinicianId: "clinician-123",
        tenantId: "tenant-001",
        authorizedAt: new Date().toISOString(),
        correlationId: "corr-abc",
        _authorityMarker: Symbol("fake"),
      } as unknown as AuthorityContext;

      const result = writeModel.createEncounter(validInput, fakeAuthority);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_INVALID");
      }
    });

    it("should succeed when valid AuthorityContext is provided", () => {
      const result = writeModel.createEncounter(validInput, validAuthority);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.patientId).toBe("pat-123");
        expect(result.data.practitionerId).toBe("prac-456");
        expect(result.data.status).toBe("planned");
        expect(result.data.tenantId).toBe("tenant-001");
      }
    });
  });

  describe("Write Model - Domain Logic", () => {
    it("should bind patient and practitioner upon creation", () => {
      const result = writeModel.createEncounter(validInput, validAuthority);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.patientId).toBe(validInput.patientId);
        expect(result.data.practitionerId).toBe(validInput.practitionerId);
      }
    });

    it("should update status and change updatedAt", async () => {
      const createResult = writeModel.createEncounter(validInput, validAuthority);
      expect(createResult.success).toBe(true);
      
      const encounterId = createResult.success ? createResult.data.encounterId : "";
      const initialUpdatedAt = createResult.success ? createResult.data.updatedAt : "";

      // Wait a tiny bit to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 10));

      const updateResult = writeModel.updateEncounterStatus(
        encounterId,
        "in-progress",
        validAuthority
      );

      expect(updateResult.success).toBe(true);
      if (updateResult.success) {
        expect(updateResult.data.status).toBe("in-progress");
        expect(updateResult.data.updatedAt).not.toBe(initialUpdatedAt);
      }
    });

    it("should fail if encounter does not exist", () => {
      const result = writeModel.updateEncounterStatus(
        "non-existent",
        "completed",
        validAuthority
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("ENCOUNTER_NOT_FOUND");
      }
    });
  });

  describe("Write Model - Tenant Isolation", () => {
    it("should not find encounter from different tenant during update", () => {
      // Create encounter in tenant-001
      const createResult = writeModel.createEncounter(validInput, validAuthority);
      expect(createResult.success).toBe(true);
      const encounterId = createResult.success ? createResult.data.encounterId : "";

      // Try to update from tenant-002
      const otherTenantAuthority = createAuthorityContext({
        clinicianId: "clinician-456",
        tenantId: "tenant-002",
        correlationId: "corr-def",
      });

      const updateResult = writeModel.updateEncounterStatus(
        encounterId,
        "completed",
        otherTenantAuthority
      );

      expect(updateResult.success).toBe(false);
      if (!updateResult.success) {
        expect(updateResult.error.code).toBe("ENCOUNTER_NOT_FOUND");
      }
    });
  });

  describe("Read Model - Views and Security", () => {
    it("should list encounters only within requested tenant", () => {
      // Create encounter in tenant-001
      writeModel.createEncounter(validInput, validAuthority);

      const tenant1Encounters = readModel.listEncounters("tenant-001");
      expect(tenant1Encounters.length).toBe(1);

      const tenant2Encounters = readModel.listEncounters("tenant-002");
      expect(tenant2Encounters.length).toBe(0);
    });

    it("should return frozen views that cannot be modified", () => {
      writeModel.createEncounter(validInput, validAuthority);
      const encounters = readModel.listEncounters("tenant-001");
      const view = encounters[0];

      expect(Object.isFrozen(view)).toBe(true);
      
      // Attempting to modify should fail or have no effect
      expect(() => {
        (view as any).status = "cancelled";
      }).toThrow();
    });

    it("should return frozen array from listEncounters", () => {
      writeModel.createEncounter(validInput, validAuthority);
      const encounters = readModel.listEncounters("tenant-001");
      expect(Object.isFrozen(encounters)).toBe(true);
    });

    it("should not accept AuthorityContext for read operations", () => {
      const getEncounterSignature = readModel.getEncounter.toString();
      expect(getEncounterSignature).not.toContain("authority");
      
      const listEncountersSignature = readModel.listEncounters.toString();
      expect(listEncountersSignature).not.toContain("authority");
    });
  });

  describe("Slice 3 Scope Compliance", () => {
    it("should not implement delete operation", () => {
      expect((writeModel as any).deleteEncounter).toBeUndefined();
    });

    it("should not have any async operations", () => {
      const result = writeModel.createEncounter(validInput, validAuthority);
      expect(result).not.toBeInstanceOf(Promise);
    });
  });
});
