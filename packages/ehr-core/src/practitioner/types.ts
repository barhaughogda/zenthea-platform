/**
 * Practitioner Types - Phase F.2 Slice 2
 *
 * Practitioner represents a human clinician providing care.
 *
 * INVARIANTS (from Phase F-00 and F-02):
 * - Practitioner MUST NOT imply authentication, authorization, or identity mechanisms
 * - Practitioner data mutation MUST be explicit and governed by AuthorityContext
 * - Practitioner read surfaces MUST NOT imply write capability
 * - Cross-tenant access MUST be denied
 */

/**
 * Core practitioner record type for the write model.
 * This represents the authoritative practitioner data.
 */
export interface PractitionerRecord {
  /**
   * Unique identifier for the practitioner.
   */
  readonly id: string;

  /**
   * Tenant scope for multi-tenant isolation.
   */
  readonly tenantId: string;

  /**
   * Display name for the practitioner (e.g., "Dr. Alice Smith").
   */
  readonly displayName: string;

  /**
   * Role of the practitioner. In Slice 2, this is restricted to "clinician".
   */
  readonly role: "clinician";

  /**
   * Whether the practitioner is active.
   */
  readonly active: boolean;

  /**
   * ISO-8601 timestamp of record creation.
   */
  readonly createdAt: string;

  /**
   * ISO-8601 timestamp of last modification.
   */
  readonly updatedAt: string;
}

/**
 * Input for creating a new practitioner record.
 */
export interface CreatePractitionerInput {
  readonly displayName: string;
  readonly active?: boolean;
}

/**
 * Input for updating practitioner profile.
 */
export interface UpdatePractitionerInput {
  readonly practitionerId: string;
  readonly displayName?: string;
  readonly active?: boolean;
}

/**
 * Result type for write operations.
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
  | { readonly code: "PRACTITIONER_NOT_FOUND"; readonly message: string }
  | { readonly code: "TENANT_MISMATCH"; readonly message: string }
  | { readonly code: "VALIDATION_ERROR"; readonly message: string };

/**
 * Read-only view of a practitioner for the read model.
 * This is a derived view - NOT authoritative for writes.
 * Frozen and immutable.
 */
export interface PractitionerReadView {
  readonly id: string;
  readonly tenantId: string;
  readonly displayName: string;
  readonly role: string;
  readonly active: boolean;
}
