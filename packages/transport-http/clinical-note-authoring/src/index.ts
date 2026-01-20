/**
 * Clinical Note Authoring HTTP Transport - Phase I.3
 *
 * Public API for the Clinical Note Authoring Transport Layer.
 *
 * This package provides HTTP transport for the Clinical Note Authoring Service.
 * It is responsible ONLY for:
 * - HTTP request parsing
 * - DTO validation
 * - AuthorityContext extraction
 * - tenantId enforcement
 * - Calling the Clinical Note Authoring Service
 * - Mapping ServiceError → HTTP-safe responses
 *
 * INVARIANTS (from Phase I.0/I.1/I.2):
 * - NO direct imports from ehr-core
 * - NO direct imports from persistence adapters
 * - ONLY calls Service Layer APIs
 * - NO business logic implementation
 * - NO transaction management
 * - Fail-closed on any context/validation failure
 */

// Types
export type {
  // DTOs
  StartDraftClinicalNoteRequest,
  UpdateDraftClinicalNoteRequest,
  FinalizeClinicalNoteRequest,
  ClinicalNoteDto,
  // Response types
  TransportSuccessResponse,
  TransportErrorResponse,
  TransportResponse,
  // Authority
  TransportAuthorityContext,
  // Service interface
  ClinicalNoteAuthoringService,
  ServiceError,
  ServiceErrorType,
  ServiceResult,
} from "./types.js";

export { HEADER_KEYS } from "./types.js";

// Error mapping
export {
  mapServiceErrorToHttp,
  createValidationErrorResponse,
  createMissingTenantErrorResponse,
  createMissingAuthorityErrorResponse,
  createInvalidAuthorityErrorResponse,
  createCrossTenantErrorResponse,
  createInternalErrorResponse,
  type HttpErrorMapping,
} from "./error-mapping.js";

// Server
export {
  createServer,
  startServer,
  stopServer,
  type ServerConfig,
} from "./server.js";

// Routes
export { registerClinicalNoteRoutes } from "./routes/clinical-note.routes.js";
