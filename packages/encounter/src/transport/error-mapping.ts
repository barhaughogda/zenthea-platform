/**
 * Encounter Error Mapping - Slice 01
 */

import { TransportErrorResponse } from "./types.js";

export function createMissingTenantErrorResponse() {
  return {
    statusCode: 400,
    body: {
      success: false,
      error: "Missing tenant context",
    } as TransportErrorResponse,
  };
}

export function createMissingAuthorityErrorResponse() {
  return {
    statusCode: 403,
    body: {
      success: false,
      error: "Missing authority context",
    } as TransportErrorResponse,
  };
}

export function createInvalidAuthorityErrorResponse() {
  return {
    statusCode: 403,
    body: {
      success: false,
      error: "Invalid authority context",
    } as TransportErrorResponse,
  };
}

export function createCapabilityViolationErrorResponse(capability: string) {
  return {
    statusCode: 403,
    body: {
      success: false,
      error: `Missing required capability: ${capability}`,
    } as TransportErrorResponse,
  };
}

export function createValidationErrorResponse(details: string[]) {
  return {
    statusCode: 400,
    body: {
      success: false,
      error: "Validation failed",
      details,
    } as TransportErrorResponse,
  };
}

export function createInternalErrorResponse() {
  return {
    statusCode: 500,
    body: {
      success: false,
      error: "Internal server error",
    } as TransportErrorResponse,
  };
}

export function mapServiceErrorToHttp(error: {
  type: string;
  message: string;
}) {
  // For Layer 1, we don't have service errors yet, but we'll need this later.
  // For now, map everything to 400 or 500.
  return {
    statusCode: 400,
    body: { success: false, error: error.message } as TransportErrorResponse,
  };
}
