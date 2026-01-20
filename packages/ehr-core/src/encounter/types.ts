/**
 * Encounter Types - Phase F.2 Slice 3
 *
 * Encounter represents a clinical interaction between a patient and a practitioner.
 * It serves as a container for clinical data within the EHR core.
 *
 * INVARIANTS (from Phase F-00 and F-02):
 * - Encounter MUST NOT imply billing, scheduling, or external workflow mechanisms in Slice 3
 * - Encounter MUST bind a patient and a practitioner within the same tenant
 * - Encounter data mutation MUST be explicit and governed by AuthorityContext
 * - Cross-tenant access MUST be denied
 */

/**
 * Valid status values for an encounter.
 */
export type EncounterStatus = "planned" | "in-progress" | "completed" | "cancelled";

/**
 * Core encounter record type for the write model.
 * This represents the authoritative encounter data.
 */
export interface EncounterRecord {
  /**
   * Unique identifier for the encounter.
   */
  readonly encounterId: string;

  /**
   * Tenant scope for multi-tenant isolation.
   */
  readonly tenantId: string;

  /**
   * Reference to the patient involved in the encounter.
   */
  readonly patientId: string;

  /**
   * Reference to the practitioner involved in the encounter.
   */
  readonly practitionerId: string;

  /**
   * Current status of the encounter.
   */
  readonly status: EncounterStatus;

  /**
   * ISO-8601 timestamp of record creation.
   */
  readonly createdAt: string;

  /**
   * ISO-8601 timestamp of last modification.
   */
  readonly updatedAt: string;

  /**
   * ISO-8601 timestamp when the encounter actually started.
   */
  readonly startedAt?: string;

  /**
   * ISO-8601 timestamp when the encounter actually ended.
   */
  readonly endedAt?: string;

  /**
   * Identifier of the clinician who last modified this record.
   * Always attributable to a human clinician via AuthorityContext.
   */
  readonly lastModifiedBy: string;
}

/**
 * Input for creating a new encounter record.
 */
export interface CreateEncounterInput {
  readonly patientId: string;
  readonly practitionerId: string;
  readonly status: EncounterStatus;
  readonly startedAt?: string;
  readonly endedAt?: string;
}

/**
 * Result type for write operations.
 * Uses discriminated union for fail-closed semantics.
 */
export type WriteResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: WriteError };

/**
 * Error codes for write operation failures.
 */
export type WriteError =
  | { readonly code: "AUTHORITY_MISSING"; readonly message: string }
  | { readonly code: "AUTHORITY_INVALID"; readonly message: string }
  | { readonly code: "ENCOUNTER_NOT_FOUND"; readonly message: string }
  | { readonly code: "TENANT_MISMATCH"; readonly message: string }
  | { readonly code: "VALIDATION_ERROR"; readonly message: string };

/**
 * Read-only view of an encounter for the read model.
 * This is a derived view - NOT authoritative for writes.
 * Frozen and immutable.
 */
export interface EncounterReadView {
  readonly encounterId: string;
  readonly tenantId: string;
  readonly patientId: string;
  readonly practitionerId: string;
  readonly status: EncounterStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly startedAt?: string;
  readonly endedAt?: string;
}
