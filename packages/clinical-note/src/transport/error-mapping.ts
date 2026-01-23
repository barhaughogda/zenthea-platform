/**
 * Error Mapping Layer - Slice 01
 *
 * Deterministic mapping from ServiceError to HTTP-safe responses.
 */

import type {
  ServiceError,
  ServiceErrorType,
  TransportErrorResponse,
} from "./types.js";

const ERROR_TYPE_TO_STATUS: Record<ServiceErrorType, number> = {
  ValidationError: 400,
  AuthorityError: 403,
  AuthorMismatchError: 403,
  NotFoundError: 404,
  ConflictError: 409,
  InvariantError: 422,
  PersistenceError: 500,
};

const SAFE_ERROR_MESSAGES: Record<ServiceErrorType, string> = {
  ValidationError: "Invalid input",
  AuthorityError: "Access denied",
  AuthorMismatchError: "Access denied",
  NotFoundError: "Resource not found",
  ConflictError: "Resource conflict",
  InvariantError: "Operation cannot be completed",
  PersistenceError: "An unexpected error occurred",
};

export function createNotAuthorizedErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 403,
    body: {
      success: false,
      error: "Not authorized",
    },
  };
}

export interface HttpErrorMapping {
  readonly statusCode: number;
  readonly body: TransportErrorResponse;
}

export function mapServiceErrorToHttp(error: ServiceError): HttpErrorMapping {
  const errorType = error.type;
  const statusCode = ERROR_TYPE_TO_STATUS[errorType] ?? 500;
  const safeMessage =
    SAFE_ERROR_MESSAGES[errorType] ?? "An unexpected error occurred";

  const details =
    errorType === "ValidationError" && error.details
      ? error.details
      : undefined;

  return {
    statusCode,
    body: {
      success: false,
      error: safeMessage,
      ...(details && details.length > 0 ? { details } : {}),
    },
  };
}

export function createValidationErrorResponse(
  details: readonly string[],
): HttpErrorMapping {
  return {
    statusCode: 400,
    body: {
      success: false,
      error: "Invalid input",
      details,
    },
  };
}

export function createMissingTenantErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 400,
    body: {
      success: false,
      error: "Tenant context required",
    },
  };
}

export function createMissingAuthorityErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 400,
    body: {
      success: false,
      error: "Authority context required",
    },
  };
}

export function createInternalErrorResponse(): HttpErrorMapping {
  return {
    statusCode: 500,
    body: {
      success: false,
      error: "An unexpected error occurred",
    },
  };
}
