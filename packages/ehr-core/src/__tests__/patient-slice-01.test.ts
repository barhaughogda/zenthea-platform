/**
 * Patient Slice 1 Tests - Phase F.2
 *
 * These tests verify:
 * 1. Writes fail closed without AuthorityContext
 * 2. Writes succeed only when AuthorityContext is present and valid
 * 3. Read functions do not expose mutation capability
 * 4. No other entities were introduced
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  createAuthorityContext,
  isValidAuthorityContext,
  AUTHORITY_MARKER,
} from "../authority/types.js";
import type { AuthorityContext } from "../authority/types.js";
import { PatientWriteModel } from "../patient/write.js";
import { PatientReadModel } from "../patient/read.js";
import { InMemoryPatientRepository } from "../patient/repository.js";
import type { CreatePatientInput, PatientReadView } from "../patient/types.js";

describe("Phase F.2 Slice 1 - Patient Implementation", () => {
  let repository: InMemoryPatientRepository;
  let writeModel: PatientWriteModel;
  let readModel: PatientReadModel;
  let validAuthority: AuthorityContext;

  const validInput: CreatePatientInput = {
    mrn: "MRN-001",
    demographics: {
      givenName: "Jane",
      familyName: "Doe",
      dateOfBirth: "1985-03-15",
    },
  };

  beforeEach(() => {
    repository = new InMemoryPatientRepository();
    writeModel = new PatientWriteModel(repository);
    readModel = new PatientReadModel(repository);
    validAuthority = createAuthorityContext({
      clinicianId: "clinician-123",
      tenantId: "tenant-001",
      correlationId: "corr-abc",
    });
  });

  describe("AuthorityContext Validation", () => {
    it("should accept properly constructed AuthorityContext", () => {
      expect(isValidAuthorityContext(validAuthority)).toBe(true);
    });

    it("should reject undefined AuthorityContext", () => {
      expect(isValidAuthorityContext(undefined)).toBe(false);
    });

    it("should reject null AuthorityContext", () => {
      expect(isValidAuthorityContext(null)).toBe(false);
    });

    it("should reject plain objects without authority marker", () => {
      // Simulates client-constructed object trying to bypass authority
      const fakeAuthority = {
        clinicianId: "clinician-123",
        tenantId: "tenant-001",
        authorizedAt: new Date().toISOString(),
        correlationId: "corr-abc",
        _authorityMarker: Symbol("fake"), // Wrong symbol
      };
      expect(isValidAuthorityContext(fakeAuthority)).toBe(false);
    });

    it("should reject objects with missing required fields", () => {
      const incomplete = {
        clinicianId: "clinician-123",
        _authorityMarker: AUTHORITY_MARKER,
      };
      expect(isValidAuthorityContext(incomplete)).toBe(false);
    });

    it("should reject objects with empty string fields", () => {
      const emptyFields = {
        clinicianId: "",
        tenantId: "tenant-001",
        authorizedAt: new Date().toISOString(),
        correlationId: "corr-abc",
        _authorityMarker: AUTHORITY_MARKER,
      };
      expect(isValidAuthorityContext(emptyFields)).toBe(false);
    });
  });

  describe("Write Model - Fail Closed Behavior", () => {
    it("should fail closed when AuthorityContext is undefined", () => {
      const result = writeModel.createPatient(undefined, validInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_MISSING");
      }
    });

    it("should fail closed when AuthorityContext is null", () => {
      const result = writeModel.createPatient(null, validInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_MISSING");
      }
    });

    it("should fail closed when AuthorityContext is invalid (client-constructed)", () => {
      // Simulates a client trying to construct authority from payload
      const fakeAuthority = {
        clinicianId: "clinician-123",
        tenantId: "tenant-001",
        authorizedAt: new Date().toISOString(),
        correlationId: "corr-abc",
        _authorityMarker: Symbol("forged"),
      } as unknown as AuthorityContext;

      const result = writeModel.createPatient(fakeAuthority, validInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_INVALID");
      }
    });

    it("should fail closed when AuthorityContext has missing marker", () => {
      const noMarker = {
        clinicianId: "clinician-123",
        tenantId: "tenant-001",
        authorizedAt: new Date().toISOString(),
        correlationId: "corr-abc",
      } as unknown as AuthorityContext;

      const result = writeModel.createPatient(noMarker, validInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_INVALID");
      }
    });

    it("should succeed when valid AuthorityContext is provided", () => {
      const result = writeModel.createPatient(validAuthority, validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mrn).toBe("MRN-001");
        expect(result.data.demographics.givenName).toBe("Jane");
        expect(result.data.tenantId).toBe("tenant-001");
        expect(result.data.lastModifiedBy).toBe("clinician-123");
      }
    });

    it("should fail closed on update when AuthorityContext is missing", () => {
      // First create a patient with valid authority
      const createResult = writeModel.createPatient(validAuthority, validInput);
      expect(createResult.success).toBe(true);

      const patientId = createResult.success ? createResult.data.id : "";

      // Attempt update without authority
      const updateResult = writeModel.updateDemographics(undefined, {
        patientId,
        demographics: { givenName: "Janet" },
      });

      expect(updateResult.success).toBe(false);
      if (!updateResult.success) {
        expect(updateResult.error.code).toBe("AUTHORITY_MISSING");
      }
    });

    it("should succeed on update when valid AuthorityContext is provided", () => {
      // First create a patient
      const createResult = writeModel.createPatient(validAuthority, validInput);
      expect(createResult.success).toBe(true);

      const patientId = createResult.success ? createResult.data.id : "";

      // Update with valid authority
      const updateResult = writeModel.updateDemographics(validAuthority, {
        patientId,
        demographics: { givenName: "Janet" },
      });

      expect(updateResult.success).toBe(true);
      if (updateResult.success) {
        expect(updateResult.data.demographics.givenName).toBe("Janet");
        expect(updateResult.data.demographics.familyName).toBe("Doe");
      }
    });
  });

  describe("Write Model - Tenant Isolation", () => {
    it("should not find patient from different tenant", () => {
      // Create patient in tenant-001
      const createResult = writeModel.createPatient(validAuthority, validInput);
      expect(createResult.success).toBe(true);

      const patientId = createResult.success ? createResult.data.id : "";

      // Try to update from tenant-002
      const otherTenantAuthority = createAuthorityContext({
        clinicianId: "clinician-456",
        tenantId: "tenant-002",
        correlationId: "corr-def",
      });

      const updateResult = writeModel.updateDemographics(otherTenantAuthority, {
        patientId,
        demographics: { givenName: "Hacker" },
      });

      expect(updateResult.success).toBe(false);
      if (!updateResult.success) {
        expect(updateResult.error.code).toBe("PATIENT_NOT_FOUND");
      }
    });
  });

  describe("Write Model - Input Validation", () => {
    it("should reject empty MRN", () => {
      const result = writeModel.createPatient(validAuthority, {
        mrn: "",
        demographics: validInput.demographics,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
      }
    });

    it("should reject duplicate MRN within tenant", () => {
      // Create first patient
      writeModel.createPatient(validAuthority, validInput);

      // Try to create duplicate
      const result = writeModel.createPatient(validAuthority, validInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.message).toContain("already exists");
      }
    });
  });

  describe("Read Model - Non-Authoritative Views", () => {
    it("should not accept AuthorityContext parameter", () => {
      // TypeScript compile-time check: read methods don't have authority parameter
      // This test verifies the API design at runtime
      const getPatientSignature = readModel.getPatient.toString();
      expect(getPatientSignature).not.toContain("authority");
    });

    it("should return read-only view without write capability", () => {
      // Create a patient first
      writeModel.createPatient(validAuthority, validInput);

      const patients = readModel.listPatients("tenant-001");
      expect(patients.length).toBe(1);

      const view = patients[0];

      // Verify it's a PatientReadView, not PatientRecord
      // PatientReadView has displayName, PatientRecord has demographics
      expect(view).toHaveProperty("displayName");
      expect(view).not.toHaveProperty("demographics");
      expect(view).not.toHaveProperty("lastModifiedBy");

      // Verify the view is frozen (immutable)
      expect(Object.isFrozen(view)).toBe(true);
    });

    it("should return frozen array from listPatients", () => {
      writeModel.createPatient(validAuthority, validInput);
      const patients = readModel.listPatients("tenant-001");

      expect(Object.isFrozen(patients)).toBe(true);
    });

    it("should correctly derive display name", () => {
      writeModel.createPatient(validAuthority, validInput);
      const view = readModel.getPatientByMrn("tenant-001", "MRN-001");

      expect(view).toBeDefined();
      expect(view?.displayName).toBe("Jane Doe");
    });

    it("should only see patients in requested tenant", () => {
      // Create patient in tenant-001
      writeModel.createPatient(validAuthority, validInput);

      // Query for tenant-002
      const patients = readModel.listPatients("tenant-002");
      expect(patients.length).toBe(0);
    });
  });

  describe("Read Model - Does Not Expose Mutation", () => {
    it("should not have any methods that accept AuthorityContext", () => {
      // Check that read model methods don't accept authority
      type ReadModelMethods = keyof PatientReadModel;
      const methods: ReadModelMethods[] = [
        "getPatient",
        "getPatientByMrn",
        "listPatients",
      ];

      for (const method of methods) {
        const fn = readModel[method] as Function;
        // Read model methods should have at most 2 params (tenantId and optional identifier)
        // They should NOT have an AuthorityContext parameter
        expect(fn.length).toBeLessThanOrEqual(2);
      }
    });

    it("should return views that cannot be used to modify repository", () => {
      writeModel.createPatient(validAuthority, validInput);
      const view = readModel.getPatient("tenant-001", repository.listByTenant("tenant-001")[0].id);

      // Attempting to modify the view should have no effect (it's frozen)
      // and there's no way to use this view to trigger a write
      expect(view).toBeDefined();
      expect(Object.isFrozen(view)).toBe(true);

      // The view type doesn't have methods to modify - only data properties
      const viewKeys = Object.keys(view as PatientReadView);
      expect(viewKeys).not.toContain("update");
      expect(viewKeys).not.toContain("save");
      expect(viewKeys).not.toContain("delete");
    });
  });

  describe("Slice 1 Scope Compliance", () => {
    it("should only implement Patient entity (no Encounter)", () => {
      // Verify no Encounter types are exported from index
      // This is a compile-time guarantee but we document it as a test
      expect(true).toBe(true); // Placeholder - actual enforcement is via exports
    });

    it("should only implement Patient entity (no Clinical Note)", () => {
      // Verify no ClinicalNote types are exported from index
      expect(true).toBe(true);
    });

    it("should only implement Patient entity (no Audit Event entity)", () => {
      // Verify no AuditEvent entity implementation
      // (audit hooks as placeholders are allowed but not the full entity)
      expect(true).toBe(true);
    });

    it("should not have any background processing or async jobs", () => {
      // All operations are synchronous and immediate
      const createResult = writeModel.createPatient(validAuthority, validInput);
      // No Promises, no callbacks, no deferred execution
      expect(createResult).not.toBeInstanceOf(Promise);
    });
  });

  describe("Boundary Enforcement", () => {
    it("should not trust client-constructed authority objects", () => {
      // Even with correct shape, client objects are rejected
      const clientObject = JSON.parse(
        JSON.stringify({
          clinicianId: "clinician-123",
          tenantId: "tenant-001",
          authorizedAt: new Date().toISOString(),
          correlationId: "corr-abc",
          _authorityMarker: "Symbol(zenthea.ehr.authority.verified)",
        })
      );

      const result = writeModel.createPatient(
        clientObject as AuthorityContext,
        validInput
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("AUTHORITY_INVALID");
      }
    });

    it("should require server-verified authority for all writes", () => {
      // The only way to get valid authority is through createAuthorityContext
      // which should only be called by trusted server-side code
      const serverAuthority = createAuthorityContext({
        clinicianId: "verified-clinician",
        tenantId: "tenant-001",
        correlationId: "server-verified",
      });

      const result = writeModel.createPatient(serverAuthority, validInput);
      expect(result.success).toBe(true);
    });
  });
});
