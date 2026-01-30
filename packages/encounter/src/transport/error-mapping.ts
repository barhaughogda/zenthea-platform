/**
 * Encounter Error Mapping - Slice 01
 */

import {
  EncounterService,
  EncounterServiceResponse,
  EncounterDto,
  CreateEncounterRequest,
  ActivateEncounterRequest,
  CompleteEncounterRequest,
  TransportAuthorityContext,
  EncounterServiceError,
  TransportErrorResponse,
} from "./types.js";
import { ServiceErrorType } from "../service/types.js";

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

export function mapServiceErrorToHttp(error: EncounterServiceError) {
  let statusCode = 400;

  switch (error.type as ServiceErrorType | string) {
    case "NOT_FOUND":
      statusCode = 404;
      break;
    case "FORBIDDEN":
      statusCode = 403;
      break;
    case "INVALID_STATE":
      statusCode = 409;
      break;
    case "CONFLICT":
      statusCode = 409;
      break;
    case "SYSTEM_ERROR":
    case "INTERNAL_ERROR":
      statusCode = 500;
      break;
    default:
      statusCode = 400;
  }

  return {
    statusCode,
    body: { success: false, error: error.message } as TransportErrorResponse,
  };
}
