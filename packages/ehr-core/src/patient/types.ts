/**
 * Patient Types - Phase F.2 Slice 1
 *
 * Patient represents the subject of care within the EHR core.
 * This entity establishes the patient-scoped authority boundary.
 *
 * INVARIANTS (from Phase F-00 and F-02):
 * - Patient MUST NOT imply authentication, authorization, or identity mechanisms
 * - Patient data mutation MUST be explicit and governed
 * - Patient read surfaces MUST NOT imply write capability
 * - Any future association of clinical content MUST remain out of scope in Slice 1
 */

/**
 * Core patient record type for the write model.
 * This represents the authoritative patient data.
 */
export interface PatientRecord {
  /**
   * Unique identifier for the patient within the EHR system.
   */
  readonly id: string;

  /**
   * Tenant scope for multi-tenant isolation.
   */
  readonly tenantId: string;

  /**
   * Medical Record Number - external identifier for the patient.
   */
  readonly mrn: string;

  /**
   * Patient demographics - minimal set for Slice 1.
   * Note: This is NOT an identity system - just demographic data.
   */
  readonly demographics: PatientDemographics;

  /**
   * ISO-8601 timestamp of record creation.
   */
  readonly createdAt: string;

  /**
   * ISO-8601 timestamp of last modification.
   */
  readonly updatedAt: string;

  /**
   * Identifier of the clinician who last modified this record.
   * Always attributable to a human clinician.
   */
  readonly lastModifiedBy: string;
}

/**
 * Minimal patient demographics for Slice 1.
 * Kept minimal to avoid scope creep.
 */
export interface PatientDemographics {
  readonly givenName: string;
  readonly familyName: string;
  readonly dateOfBirth: string; // ISO-8601 date (YYYY-MM-DD)
}

/**
 * Input for creating a new patient record.
 */
export interface CreatePatientInput {
  readonly mrn: string;
  readonly demographics: PatientDemographics;
}

/**
 * Input for updating patient demographics.
 */
export interface UpdatePatientDemographicsInput {
  readonly patientId: string;
  readonly demographics: Partial<PatientDemographics>;
}

/**
 * Result type for write operations.
 * Uses discriminated union for fail-closed semantics (no exceptions for control flow).
 */
export type WriteResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: WriteError };

/**
 * Error codes for write operation failures.
 * These are structured errors, not exceptions.
 */
export type WriteError =
  | { readonly code: "AUTHORITY_MISSING"; readonly message: string }
  | { readonly code: "AUTHORITY_INVALID"; readonly message: string }
  | { readonly code: "PATIENT_NOT_FOUND"; readonly message: string }
  | { readonly code: "TENANT_MISMATCH"; readonly message: string }
  | { readonly code: "VALIDATION_ERROR"; readonly message: string };

/**
 * Read-only view of a patient for the read model.
 * This is a derived view - NOT authoritative for writes.
 */
export interface PatientReadView {
  readonly id: string;
  readonly tenantId: string;
  readonly mrn: string;
  readonly displayName: string;
  readonly dateOfBirth: string;
}
