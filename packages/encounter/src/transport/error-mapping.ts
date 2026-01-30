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
  switch (error.type) {
    case "AUTHORIZATION_ERROR":
      return {
        statusCode: 403,
        body: {
          success: false,
          error: error.message,
        } as TransportErrorResponse,
      };
    case "FORBIDDEN_ERROR":
      return {
        statusCode: 403,
        body: {
          success: false,
          error: error.message,
        } as TransportErrorResponse,
      };
    case "NOT_FOUND":
      return {
        statusCode: 404,
        body: {
          success: false,
          error: error.message,
        } as TransportErrorResponse,
      };
    case "CONFLICT":
      return {
        statusCode: 409,
        body: {
          success: false,
          error: error.message,
        } as TransportErrorResponse,
      };
    case "PRECONDITION_FAILED":
      return {
        statusCode: 412,
        body: {
          success: false,
          error: error.message,
        } as TransportErrorResponse,
      };
    default:
      return {
        statusCode: 400,
        body: {
          success: false,
          error: error.message,
        } as TransportErrorResponse,
      };
  }
}
