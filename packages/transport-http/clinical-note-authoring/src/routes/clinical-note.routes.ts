/**
 * Clinical Note Routes - Phase I.3
 *
 * HTTP routes for Clinical Note Authoring Transport.
 *
 * INVARIANTS (from Phase I.0/I.1/I.2):
 * - Request parsing and DTO validation
 * - Explicit tenantId and AuthorityContext extraction
 * - tenantId enforcement (no implicit inference)
 * - Call service layer only - NO business logic
 * - Map ServiceError → HTTP-safe responses
 * - Fail-closed on any context/validation failure
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type {
  ClinicalNoteAuthoringService,
  ClinicalNoteDto,
  StartDraftClinicalNoteRequest,
  UpdateDraftClinicalNoteRequest,
  FinalizeClinicalNoteRequest,
  TransportAuthorityContext,
  TransportSuccessResponse,
} from "../types.js";
import { HEADER_KEYS } from "../types.js";
import {
  mapServiceErrorToHttp,
  createValidationErrorResponse,
  createMissingTenantErrorResponse,
  createMissingAuthorityErrorResponse,
  createInvalidAuthorityErrorResponse,
  createCrossTenantErrorResponse,
  createInternalErrorResponse,
} from "../error-mapping.js";

// ============================================================
// Route Registration
// ============================================================

/**
 * Registers Clinical Note Authoring routes on a Fastify instance.
 *
 * @param fastify - Fastify instance
 * @param service - Clinical Note Authoring Service implementation
 */
export async function registerClinicalNoteRoutes(
  fastify: FastifyInstance,
  service: ClinicalNoteAuthoringService
): Promise<void> {
  // POST /api/v1/clinical-notes/draft - Start a new draft
  fastify.post("/api/v1/clinical-notes/draft", async (request, reply) => {
    return handleStartDraft(request, reply, service);
  });

  // PUT /api/v1/clinical-notes/draft/:clinicalNoteId - Update a draft
  fastify.put(
    "/api/v1/clinical-notes/draft/:clinicalNoteId",
    async (request, reply) => {
      return handleUpdateDraft(request, reply, service);
    }
  );

  // POST /api/v1/clinical-notes/:clinicalNoteId/finalize - Finalize a note
  fastify.post(
    "/api/v1/clinical-notes/:clinicalNoteId/finalize",
    async (request, reply) => {
      return handleFinalize(request, reply, service);
    }
  );
}

// ============================================================
// Route Handlers
// ============================================================

/**
 * Handle POST /api/v1/clinical-notes/draft
 *
 * Starts a new draft clinical note.
 */
async function handleStartDraft(
  request: FastifyRequest,
  reply: FastifyReply,
  service: ClinicalNoteAuthoringService
): Promise<void> {
  // 1. Extract and validate context
  const contextResult = extractAndValidateContext(request);
  if (!contextResult.valid) {
    const { statusCode, body } = contextResult.error;
    reply.status(statusCode).send(body);
    return;
  }
  const { tenantId, authority } = contextResult;

  // 2. Validate request body
  const bodyValidation = validateStartDraftBody(request.body);
  if (!bodyValidation.valid) {
    const { statusCode, body } = bodyValidation.error;
    reply.status(statusCode).send(body);
    return;
  }
  const input = bodyValidation.data;

  // 3. Call service
  try {
    const result = await service.startDraft(tenantId, authority, input);

    if (result.success) {
      const response: TransportSuccessResponse<ClinicalNoteDto> = {
        success: true,
        data: result.data,
      };
      reply.status(201).send(response);
    } else {
      const { statusCode, body } = mapServiceErrorToHttp(result.error);
      reply.status(statusCode).send(body);
    }
  } catch {
    // Fail closed - do not expose internal error details
    const { statusCode, body } = createInternalErrorResponse();
    reply.status(statusCode).send(body);
  }
}

/**
 * Handle PUT /api/v1/clinical-notes/draft/:clinicalNoteId
 *
 * Updates an existing draft clinical note.
 */
async function handleUpdateDraft(
  request: FastifyRequest,
  reply: FastifyReply,
  service: ClinicalNoteAuthoringService
): Promise<void> {
  // 1. Extract and validate context
  const contextResult = extractAndValidateContext(request);
  if (!contextResult.valid) {
    const { statusCode, body } = contextResult.error;
    reply.status(statusCode).send(body);
    return;
  }
  const { tenantId, authority } = contextResult;

  // 2. Extract path parameter
  const params = request.params as { clinicalNoteId?: string };
  if (!params.clinicalNoteId || params.clinicalNoteId.trim().length === 0) {
    const { statusCode, body } = createValidationErrorResponse([
      "clinicalNoteId is required",
    ]);
    reply.status(statusCode).send(body);
    return;
  }

  // 3. Validate request body
  const bodyValidation = validateUpdateDraftBody(
    request.body,
    params.clinicalNoteId
  );
  if (!bodyValidation.valid) {
    const { statusCode, body } = bodyValidation.error;
    reply.status(statusCode).send(body);
    return;
  }
  const input = bodyValidation.data;

  // 4. Call service
  try {
    const result = await service.updateDraft(tenantId, authority, input);

    if (result.success) {
      const response: TransportSuccessResponse<ClinicalNoteDto> = {
        success: true,
        data: result.data,
      };
      reply.status(200).send(response);
    } else {
      const { statusCode, body } = mapServiceErrorToHttp(result.error);
      reply.status(statusCode).send(body);
    }
  } catch {
    const { statusCode, body } = createInternalErrorResponse();
    reply.status(statusCode).send(body);
  }
}

/**
 * Handle POST /api/v1/clinical-notes/:clinicalNoteId/finalize
 *
 * Finalizes a draft clinical note (makes it immutable).
 */
async function handleFinalize(
  request: FastifyRequest,
  reply: FastifyReply,
  service: ClinicalNoteAuthoringService
): Promise<void> {
  // 1. Extract and validate context
  const contextResult = extractAndValidateContext(request);
  if (!contextResult.valid) {
    const { statusCode, body } = contextResult.error;
    reply.status(statusCode).send(body);
    return;
  }
  const { tenantId, authority } = contextResult;

  // 2. Extract path parameter
  const params = request.params as { clinicalNoteId?: string };
  if (!params.clinicalNoteId || params.clinicalNoteId.trim().length === 0) {
    const { statusCode, body } = createValidationErrorResponse([
      "clinicalNoteId is required",
    ]);
    reply.status(statusCode).send(body);
    return;
  }

  const input: FinalizeClinicalNoteRequest = {
    clinicalNoteId: params.clinicalNoteId,
  };

  // 3. Call service
  try {
    const result = await service.finalize(tenantId, authority, input);

    if (result.success) {
      const response: TransportSuccessResponse<ClinicalNoteDto> = {
        success: true,
        data: result.data,
      };
      reply.status(200).send(response);
    } else {
      const { statusCode, body } = mapServiceErrorToHttp(result.error);
      reply.status(statusCode).send(body);
    }
  } catch {
    const { statusCode, body } = createInternalErrorResponse();
    reply.status(statusCode).send(body);
  }
}

// ============================================================
// Context Extraction and Validation
// ============================================================

type ContextValidationResult =
  | {
      valid: true;
      tenantId: string;
      authority: TransportAuthorityContext;
    }
  | {
      valid: false;
      error: { statusCode: number; body: { success: false; error: string } };
    };

/**
 * Extracts and validates tenant and authority context from request headers.
 *
 * FAIL-CLOSED behavior:
 * - Missing tenantId → 400
 * - Missing authority → 403
 * - Invalid authority → 403
 * - Tenant mismatch between header and authority → 403
 */
function extractAndValidateContext(
  request: FastifyRequest
): ContextValidationResult {
  const headers = request.headers;

  // 1. Extract tenantId - REQUIRED, FAIL CLOSED
  const tenantId = getHeaderValue(headers, HEADER_KEYS.TENANT_ID);
  if (!tenantId) {
    return { valid: false, error: createMissingTenantErrorResponse() };
  }

  // 2. Extract authority context components - ALL REQUIRED, FAIL CLOSED
  const clinicianId = getHeaderValue(headers, HEADER_KEYS.CLINICIAN_ID);
  const authorizedAt = getHeaderValue(headers, HEADER_KEYS.AUTHORIZED_AT);
  const correlationId = getHeaderValue(headers, HEADER_KEYS.CORRELATION_ID);

  if (!clinicianId) {
    return { valid: false, error: createMissingAuthorityErrorResponse() };
  }

  if (!authorizedAt || !correlationId) {
    return { valid: false, error: createInvalidAuthorityErrorResponse() };
  }

  // 3. Construct authority context
  const authority: TransportAuthorityContext = {
    clinicianId,
    tenantId, // Authority must match the request tenantId
    authorizedAt,
    correlationId,
  };

  // 4. Validate authority tenantId matches request tenantId
  // This prevents cross-tenant access attempts
  if (authority.tenantId !== tenantId) {
    return { valid: false, error: createCrossTenantErrorResponse() };
  }

  return { valid: true, tenantId, authority };
}

/**
 * Safely extracts a header value, handling arrays.
 */
function getHeaderValue(
  headers: FastifyRequest["headers"],
  key: string
): string | undefined {
  const value = headers[key];
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
    return value[0].trim();
  }
  return undefined;
}

// ============================================================
// Request Body Validation
// ============================================================

type BodyValidationResult<T> =
  | { valid: true; data: T }
  | {
      valid: false;
      error: { statusCode: number; body: { success: false; error: string; details?: readonly string[] } };
    };

/**
 * Validates the request body for starting a draft.
 */
function validateStartDraftBody(
  body: unknown
): BodyValidationResult<StartDraftClinicalNoteRequest> {
  const errors: string[] = [];

  if (body === null || body === undefined || typeof body !== "object") {
    return {
      valid: false,
      error: createValidationErrorResponse(["Request body is required"]),
    };
  }

  const data = body as Record<string, unknown>;

  // Validate encounterId
  if (typeof data.encounterId !== "string" || data.encounterId.trim().length === 0) {
    errors.push("encounterId is required");
  }

  // Validate patientId
  if (typeof data.patientId !== "string" || data.patientId.trim().length === 0) {
    errors.push("patientId is required");
  }

  // Validate content
  if (typeof data.content !== "string" || data.content.trim().length === 0) {
    errors.push("content is required");
  }

  if (errors.length > 0) {
    return { valid: false, error: createValidationErrorResponse(errors) };
  }

  return {
    valid: true,
    data: {
      encounterId: (data.encounterId as string).trim(),
      patientId: (data.patientId as string).trim(),
      content: (data.content as string).trim(),
    },
  };
}

/**
 * Validates the request body for updating a draft.
 */
function validateUpdateDraftBody(
  body: unknown,
  clinicalNoteId: string
): BodyValidationResult<UpdateDraftClinicalNoteRequest> {
  const errors: string[] = [];

  if (body === null || body === undefined || typeof body !== "object") {
    return {
      valid: false,
      error: createValidationErrorResponse(["Request body is required"]),
    };
  }

  const data = body as Record<string, unknown>;

  // Validate content
  if (typeof data.content !== "string" || data.content.trim().length === 0) {
    errors.push("content is required");
  }

  if (errors.length > 0) {
    return { valid: false, error: createValidationErrorResponse(errors) };
  }

  return {
    valid: true,
    data: {
      clinicalNoteId,
      content: (data.content as string).trim(),
    },
  };
}
