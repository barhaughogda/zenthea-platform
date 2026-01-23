/**
 * Clinical Note Authoring Transport Types - Slice 01
 *
 * Transport-layer DTOs, service interface, and error contracts.
 *
 * INVARIANTS:
 * - All DTOs MUST be serializable (plain objects only)
 * - NO domain objects exposed directly
 * - Every method requires explicit tenantId and AuthorityContext
 * - Fail-closed on missing or invalid context
 */

// ============================================================
// Authority Context (Transport-Safe Representation)
// ============================================================

/**
 * Authority context extracted from request headers/claims.
 */
export interface TransportAuthorityContext {
  readonly clinicianId: string;
  readonly tenantId: string;
  readonly authorizedAt: string;
  readonly correlationId: string;
}

// ============================================================
// Request DTOs
// ============================================================

/**
 * DTO for starting a new draft clinical note.
 */
export interface StartDraftClinicalNoteRequest {
  readonly encounterId: string;
  readonly patientId: string;
  readonly content: string;
}

/**
 * DTO for updating an existing draft clinical note.
 */
export interface UpdateDraftClinicalNoteRequest {
  readonly content: string;
}

// ============================================================
// Response DTOs
// ============================================================

/**
 * Transport-safe representation of a clinical note.
 */
export interface ClinicalNoteDto {
  readonly clinicalNoteId: string;
  readonly tenantId: string;
  readonly encounterId: string;
  readonly patientId: string;
  readonly practitionerId: string;
  readonly status: "DRAFT" | "SIGNED";
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly signedAt?: string;
}

/**
 * Success response wrapper.
 */
export interface TransportSuccessResponse<T> {
  readonly success: true;
  readonly data: T;
}

/**
 * Error response wrapper - safe for client consumption.
 * MUST NOT contain PHI, PII, or internal details.
 */
export interface TransportErrorResponse {
  readonly success: false;
  readonly error: string;
  readonly details?: readonly string[];
}

// ============================================================
// Service Error Types
// ============================================================

export type ServiceErrorType =
  | "ValidationError"
  | "AuthorityError"
  | "NotFoundError"
  | "ConflictError"
  | "InvariantError"
  | "PersistenceError";

export interface ServiceError {
  readonly type: ServiceErrorType;
  readonly message: string;
  readonly details?: readonly string[];
}

export type ServiceResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: ServiceError };

// ============================================================
// Service Interface
// ============================================================

export interface ClinicalNoteAuthoringService {
  startDraft(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: StartDraftClinicalNoteRequest,
  ): Promise<ServiceResult<ClinicalNoteDto>>;

  updateDraft(
    tenantId: string,
    authority: TransportAuthorityContext,
    clinicalNoteId: string,
    input: UpdateDraftClinicalNoteRequest,
  ): Promise<ServiceResult<ClinicalNoteDto>>;

  finalizeNote(
    tenantId: string,
    authority: TransportAuthorityContext,
    clinicalNoteId: string,
  ): Promise<ServiceResult<ClinicalNoteDto>>;

  readNote(
    tenantId: string,
    authority: TransportAuthorityContext,
    clinicalNoteId: string,
  ): Promise<ServiceResult<ClinicalNoteDto>>;
}

// ============================================================
// Header Keys
// ============================================================

export const HEADER_KEYS = {
  TENANT_ID: "x-tenant-id",
  CLINICIAN_ID: "x-clinician-id",
  AUTHORIZED_AT: "x-authorized-at",
  CORRELATION_ID: "x-correlation-id",
} as const;
