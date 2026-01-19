/**
 * Patient Write Model - Phase F.2 Slice 1
 *
 * Write operations for Patient entity with fail-closed authority enforcement.
 *
 * INVARIANTS (from Phase F-00, F-01, F-02):
 * - Writes MUST require explicit AuthorityContext representing human clinician action
 * - Writes MUST fail closed when AuthorityContext is absent or invalid
 * - AuthorityContext MUST be a structured object, not a boolean
 * - Writes MUST be attributable to a human clinician
 * - Attribution MUST NOT be inferred from client context
 * - Operations return result types (no exceptions for control flow)
 */

import {
  type AuthorityContext,
  isValidAuthorityContext,
} from "../authority/types.js";
import type { PatientRepository } from "./repository.js";
import type {
  CreatePatientInput,
  PatientRecord,
  UpdatePatientDemographicsInput,
  WriteError,
  WriteResult,
} from "./types.js";

/**
 * Patient Write Model - enforces authority boundary for all mutations.
 *
 * All write operations require a valid AuthorityContext. If the context
 * is missing or invalid, the operation fails closed (returns error result,
 * does not throw).
 */
export class PatientWriteModel {
  private readonly repository: PatientRepository;

  constructor(repository: PatientRepository) {
    this.repository = repository;
  }

  /**
   * Create a new patient record.
   *
   * Requires valid AuthorityContext - fails closed if absent/invalid.
   */
  createPatient(
    authority: AuthorityContext | undefined | null,
    input: CreatePatientInput
  ): WriteResult<PatientRecord> {
    // FAIL CLOSED: Verify authority context
    const authorityValidation = this.validateAuthority(authority);
    if (!authorityValidation.valid) {
      return authorityValidation.error;
    }
    const validAuthority = authorityValidation.authority;

    // Validate input
    const inputValidation = this.validateCreateInput(input);
    if (inputValidation !== null) {
      return inputValidation;
    }

    // Check for duplicate MRN within tenant
    const existing = this.repository.findByMrn(validAuthority.tenantId, input.mrn);
    if (existing) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: `Patient with MRN ${input.mrn} already exists in tenant`,
        },
      };
    }

    // Create the record
    const now = new Date().toISOString();
    const record: PatientRecord = Object.freeze({
      id: this.generateId(),
      tenantId: validAuthority.tenantId,
      mrn: input.mrn,
      demographics: Object.freeze({ ...input.demographics }),
      createdAt: now,
      updatedAt: now,
      lastModifiedBy: validAuthority.clinicianId,
    });

    this.repository.save(record);

    return { success: true, data: record };
  }

  /**
   * Update patient demographics.
   *
   * Requires valid AuthorityContext - fails closed if absent/invalid.
   */
  updateDemographics(
    authority: AuthorityContext | undefined | null,
    input: UpdatePatientDemographicsInput
  ): WriteResult<PatientRecord> {
    // FAIL CLOSED: Verify authority context
    const authorityValidation = this.validateAuthority(authority);
    if (!authorityValidation.valid) {
      return authorityValidation.error;
    }
    const validAuthority = authorityValidation.authority;

    // Find existing patient
    const existing = this.repository.findById(
      validAuthority.tenantId,
      input.patientId
    );
    if (!existing) {
      return {
        success: false,
        error: {
          code: "PATIENT_NOT_FOUND",
          message: `Patient ${input.patientId} not found in tenant`,
        },
      };
    }

    // Verify tenant match (defense in depth)
    if (existing.tenantId !== validAuthority.tenantId) {
      return {
        success: false,
        error: {
          code: "TENANT_MISMATCH",
          message: "Patient belongs to different tenant",
        },
      };
    }

    // Merge demographics
    const updatedDemographics = Object.freeze({
      givenName: input.demographics.givenName ?? existing.demographics.givenName,
      familyName:
        input.demographics.familyName ?? existing.demographics.familyName,
      dateOfBirth:
        input.demographics.dateOfBirth ?? existing.demographics.dateOfBirth,
    });

    // Create updated record
    const record: PatientRecord = Object.freeze({
      ...existing,
      demographics: updatedDemographics,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: validAuthority.clinicianId,
    });

    this.repository.save(record);

    return { success: true, data: record };
  }

  /**
   * Validate authority context - FAIL CLOSED on any issue.
   */
  private validateAuthority(
    authority: AuthorityContext | undefined | null
  ):
    | { valid: true; authority: AuthorityContext }
    | { valid: false; error: WriteResult<never> } {
    // Missing authority - fail closed
    if (authority === undefined || authority === null) {
      return {
        valid: false,
        error: {
          success: false,
          error: {
            code: "AUTHORITY_MISSING",
            message:
              "Authority context is required for write operations. " +
              "All writes must be attributable to a verified human clinician.",
          },
        },
      };
    }

    // Invalid authority structure - fail closed
    if (!isValidAuthorityContext(authority)) {
      return {
        valid: false,
        error: {
          success: false,
          error: {
            code: "AUTHORITY_INVALID",
            message:
              "Authority context is invalid or not properly constructed. " +
              "Authority must be established through verified channels.",
          },
        },
      };
    }

    return { valid: true, authority };
  }

  /**
   * Validate create patient input.
   */
  private validateCreateInput(
    input: CreatePatientInput
  ): WriteResult<never> | null {
    if (!input.mrn || input.mrn.trim().length === 0) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "MRN is required",
        },
      };
    }

    if (!input.demographics) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Demographics are required",
        },
      };
    }

    if (
      !input.demographics.givenName ||
      input.demographics.givenName.trim().length === 0
    ) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Given name is required",
        },
      };
    }

    if (
      !input.demographics.familyName ||
      input.demographics.familyName.trim().length === 0
    ) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Family name is required",
        },
      };
    }

    if (
      !input.demographics.dateOfBirth ||
      input.demographics.dateOfBirth.trim().length === 0
    ) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Date of birth is required",
        },
      };
    }

    return null;
  }

  /**
   * Generate a unique ID for a new patient.
   * Simple implementation for in-memory stub.
   */
  private generateId(): string {
    return `pat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
