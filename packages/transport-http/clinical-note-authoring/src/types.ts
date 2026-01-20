/**
 * Clinical Note Authoring Transport Types - Phase I.3
 *
 * Transport-layer DTOs, service interface, and error contracts.
 *
 * INVARIANTS (from Phase I.0/I.1/I.2):
 * - All DTOs MUST be serializable (plain objects only)
 * - NO domain objects (ehr-core) exposed directly
 * - NO persistence types or entities exposed
 * - Every method requires explicit tenantId and AuthorityContext
 * - Fail-closed on missing or invalid context
 */

// ============================================================
// Authority Context (Transport-Safe Representation)
// ============================================================

/**
 * Authority context extracted from request headers/claims.
 * This is the transport-layer representation, NOT the domain AuthorityContext.
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
 * DTO for updating a draft clinical note.
 */
export interface UpdateDraftClinicalNoteRequest {
  readonly clinicalNoteId: string;
  readonly content: string;
}

/**
 * DTO for finalizing a clinical note.
 */
export interface FinalizeClinicalNoteRequest {
  readonly clinicalNoteId: string;
}

// ============================================================
// Response DTOs
// ============================================================

/**
 * Transport-safe representation of a clinical note.
 * NO domain objects - only plain serializable data.
 */
export interface ClinicalNoteDto {
  readonly clinicalNoteId: string;
  readonly tenantId: string;
  readonly encounterId: string;
  readonly patientId: string;
  readonly practitionerId: string;
  readonly status: "draft" | "finalized";
  readonly content: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly finalizedAt?: string;
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

/**
 * Union type for transport responses.
 */
export type TransportResponse<T> =
  | TransportSuccessResponse<T>
  | TransportErrorResponse;

// ============================================================
// Service Error Types (from Phase H.2 Error Taxonomy)
// ============================================================

/**
 * Service error type discriminator.
 */
export type ServiceErrorType =
  | "ValidationError"
  | "AuthorityError"
  | "NotFoundError"
  | "ConflictError"
  | "InvariantError"
  | "PersistenceError";

/**
 * Service error structure returned by the Clinical Note Authoring Service.
 */
export interface ServiceError {
  readonly type: ServiceErrorType;
  readonly message: string;
  readonly details?: readonly string[];
}

/**
 * Service result - success or error.
 */
export type ServiceResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: ServiceError };

// ============================================================
// Service Interface (Contract for Clinical Note Authoring Service)
// ============================================================

/**
 * Clinical Note Authoring Service Interface.
 *
 * This interface defines the contract that the transport layer calls.
 * The actual implementation is provided via dependency injection.
 *
 * INVARIANTS:
 * - Every method requires explicit tenantId
 * - Every method requires explicit authority context
 * - All methods return ServiceResult<T>
 * - No exceptions thrown for business logic
 */
export interface ClinicalNoteAuthoringService {
  /**
   * Start a new draft clinical note.
   */
  startDraft(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: StartDraftClinicalNoteRequest
  ): Promise<ServiceResult<ClinicalNoteDto>>;

  /**
   * Update an existing draft clinical note.
   */
  updateDraft(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: UpdateDraftClinicalNoteRequest
  ): Promise<ServiceResult<ClinicalNoteDto>>;

  /**
   * Finalize a draft clinical note (makes it immutable).
   */
  finalize(
    tenantId: string,
    authority: TransportAuthorityContext,
    input: FinalizeClinicalNoteRequest
  ): Promise<ServiceResult<ClinicalNoteDto>>;
}

// ============================================================
// Header Keys (for extracting context from requests)
// ============================================================

/**
 * Standard header names for authority context extraction.
 */
export const HEADER_KEYS = {
  TENANT_ID: "x-tenant-id",
  CLINICIAN_ID: "x-clinician-id",
  AUTHORIZED_AT: "x-authorized-at",
  CORRELATION_ID: "x-correlation-id",
} as const;
