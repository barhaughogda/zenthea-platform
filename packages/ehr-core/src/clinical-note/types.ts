/**
 * Clinical Note Types - Phase F.2 Slice 4
 *
 * Clinical Note represents a clinician-authored medical record associated with an Encounter.
 *
 * INVARIANTS:
 * - Must be associated with exactly one Encounter
 * - Must be authored by a human clinician (Practitioner)
 * - Finalized notes are immutable
 * - All writes require AuthorityContext
 */

/**
 * Clinical Note status.
 */
export type ClinicalNoteStatus = "draft" | "finalized";

/**
 * Core Clinical Note record stored in the repository.
 * This is the internal representation.
 */
export interface ClinicalNoteRecord {
  readonly clinicalNoteId: string;
  readonly tenantId: string;
  readonly encounterId: string;
  readonly patientId: string;
  readonly practitionerId: string; // author
  readonly status: ClinicalNoteStatus;
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly finalizedAt?: string;
}

/**
 * Read-only view of a Clinical Note.
 * Returned by the Read Model as a frozen object.
 */
export interface ClinicalNoteReadView extends ClinicalNoteRecord {}

/**
 * Input for creating a new Clinical Note.
 */
export interface CreateClinicalNoteInput {
  readonly encounterId: string;
  readonly patientId: string;
  readonly content: string;
}

/**
 * Error codes for write operations.
 */
export type WriteErrorCode =
  | "AUTHORITY_MISSING"
  | "AUTHORITY_INVALID"
  | "ENCOUNTER_REQUIRED"
  | "PATIENT_REQUIRED"
  | "CONTENT_REQUIRED"
  | "NOTE_NOT_FOUND"
  | "ALREADY_FINALIZED"
  | "TENANT_MISMATCH"
  | "ENCOUNTER_MISMATCH"
  | "VALIDATION_ERROR";

/**
 * Structured error for write operations.
 */
export interface WriteError {
  readonly code: WriteErrorCode;
  readonly message: string;
}

/**
 * Result of a write operation.
 */
export type WriteResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: WriteError };
