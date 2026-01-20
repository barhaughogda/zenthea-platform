/**
 * Error Mapping Layer - Phase I.3
 *
 * Deterministic mapping from ServiceError to HTTP-safe responses.
 *
 * INVARIANTS (from Phase I.0/I.2):
 * - ServiceError → HTTP Status + Safe Response
 * - Responses MUST NOT contain PHI, PII, internal stack traces, SQL details
 * - Mapping MUST be deterministic and consistent
 * - Unknown errors fail closed with 500
 */

import type {
  ServiceError,
  ServiceErrorType,
  TransportErrorResponse,
} from "./types.js";

// ============================================================
// HTTP Status Code Mapping
// ============================================================

/**
 * Maps ServiceErrorType to HTTP status code.
 *
 * Mapping table (from Phase I.2):
 * - ValidationError → 400 Bad Request
 * - AuthorityError  → 403 Forbidden
 * - NotFoundError   → 404 Not Found
 * - ConflictError   → 409 Conflict
 * - InvariantError  → 422 Unprocessable Entity
 * - PersistenceError → 500 Internal Server Error
 */
const ERROR_TYPE_TO_STATUS: Record<ServiceErrorType, number> = {
  ValidationError: 400,
  AuthorityError: 403,
  NotFoundError: 404,
  ConflictError: 409,
  InvariantError: 422,
  PersistenceError: 500,
};

/**
 * Safe error messages for each error type.
 * These MUST NOT contain PHI, PII, or internal details.
 */
const SAFE_ERROR_MESSAGES: Record<ServiceErrorType, string> = {
  ValidationError: "Invalid input",
  AuthorityError: "Access denied",
  NotFoundError: "Resource not found",
  ConflictError: "Resource conflict",
  InvariantError: "Operation cannot be completed",
  PersistenceError: "An unexpected error occurred",
};

// ============================================================
// Transport Error Response
// ============================================================

/**
 * Result of mapping a service error to HTTP response components.
 */
export interface HttpErrorMapping {
  readonly statusCode: number;
  readonly body: TransportErrorResponse;
}

/**
 * Maps a ServiceError to HTTP-safe response components.
 *
 * INVARIANTS:
 * - Always returns a valid HTTP status code
 * - Body NEVER contains PHI, PII, or internal details
 * - Unknown error types fail closed with 500
 * - Details are sanitized (only validation messages allowed)
 */
export function mapServiceErrorToHttp(error: ServiceError): HttpErrorMapping {
  const errorType = error.type;

  // Get status code - fail closed on unknown types
  const statusCode = ERROR_TYPE_TO_STATUS[errorType] ?? 500;

  // Get safe message - fail closed on unknown types
  const safeMessage = SAFE_ERROR_MESSAGES[errorType] ?? "An unexpected error occurred";

  // Only include sanitized details for validation errors
  // Other error details might contain sensitive information
  const details =
    errorType === "ValidationError" && error.details
      ? sanitizeValidationDetails(error.details)
      : undefined;

  const body: TransportErrorResponse = {
    success: false,
    error: safeMessage,
    ...(details && details.length > 0 ? { details } : {}),
  };

  return { statusCode, body };
}

/**
 * Creates a transport error response for transport-layer validation failures.
 * Used when DTO validation fails before reaching the service layer.
 */
export function createValidationErrorResponse(
  details: readonly string[]
): HttpErrorMapping {
  return {
    statusCode: 400,
    body: {
      success: false,
      error: "Invalid input",
      details: sanitizeValidationDetails(details),
    },
  };
}

/**
 * Creates a transport error response for missing tenant context.
 */
export function createMissingTenantErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 400,
    body: {
      success: false,
      error: "Tenant context required",
    },
  };
}

/**
 * Creates a transport error response for missing authority context.
 */
export function createMissingAuthorityErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 403,
    body: {
      success: false,
      error: "Authority context required",
    },
  };
}

/**
 * Creates a transport error response for invalid authority context.
 */
export function createInvalidAuthorityErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 403,
    body: {
      success: false,
      error: "Invalid authority context",
    },
  };
}

/**
 * Creates a transport error response for cross-tenant access attempts.
 */
export function createCrossTenantErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 403,
    body: {
      success: false,
      error: "Access denied",
    },
  };
}

/**
 * Creates a generic internal server error response.
 * Used for unexpected failures that should not leak internal details.
 */
export function createInternalErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 500,
    body: {
      success: false,
      error: "An unexpected error occurred",
    },
  };
}

// ============================================================
// Sanitization Helpers
// ============================================================

/**
 * Sanitizes validation details to ensure no PHI/PII leakage.
 *
 * Rules:
 * - Only allow field name validation messages
 * - Strip any values that look like IDs, names, or medical data
 * - Limit detail length to prevent information leakage
 */
function sanitizeValidationDetails(
  details: readonly string[]
): readonly string[] {
  const maxDetailLength = 100;
  const maxDetails = 10;

  return details
    .slice(0, maxDetails)
    .map((detail) => {
      // Truncate long messages
      if (detail.length > maxDetailLength) {
        return detail.slice(0, maxDetailLength) + "...";
      }
      return detail;
    })
    .filter((detail) => {
      // Filter out details that might contain PHI/PII patterns
      // This is a basic check - production would need more sophisticated filtering
      const suspiciousPatterns = [
        // SSN pattern (US Social Security Number)
        /\b\d{3}-\d{2}-\d{4}\b/,
        // Long numbers that could be MRN, phone, etc.
        /\b\d{10,}\b/,
        // Email addresses
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
        // Potential names: Capitalized First Last pattern (e.g., "John Doe", "Mary Smith")
        /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/,
        // Date of birth patterns
        /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/,
      ];

      return !suspiciousPatterns.some((pattern) => pattern.test(detail));
    });
}
