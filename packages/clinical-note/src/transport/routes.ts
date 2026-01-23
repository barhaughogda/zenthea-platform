/**
 * Clinical Note Routes - Slice 01
 *
 * HTTP routes for Clinical Note Authoring Transport.
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type {
  ClinicalNoteAuthoringService,
  ClinicalNoteDto,
  StartDraftClinicalNoteRequest,
  UpdateDraftClinicalNoteRequest,
  TransportAuthorityContext,
  TransportSuccessResponse,
} from "./types.js";
import { HEADER_KEYS } from "./types.js";
import {
  mapServiceErrorToHttp,
  createValidationErrorResponse,
  createMissingTenantErrorResponse,
  createMissingAuthorityErrorResponse,
  createNotAuthorizedErrorResponse,
  createInternalErrorResponse,
} from "./error-mapping.js";

export async function registerClinicalNoteRoutes(
  fastify: FastifyInstance,
  service: ClinicalNoteAuthoringService,
): Promise<void> {
  // POST /api/v1/clinical-notes/draft - Start a new draft
  fastify.post("/api/v1/clinical-notes/draft", async (request, reply) => {
    return handleStartDraft(request, reply, service);
  });

  // PATCH /api/v1/clinical-notes/:clinicalNoteId - Update an existing draft
  fastify.patch(
    "/api/v1/clinical-notes/:clinicalNoteId",
    async (request, reply) => {
      return handleUpdateDraft(request, reply, service);
    },
  );
}

export async function handleStartDraft(
  request: FastifyRequest,
  reply: FastifyReply,
  service: ClinicalNoteAuthoringService,
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
    const { statusCode, body } = createInternalErrorResponse();
    reply.status(statusCode).send(body);
  }
}

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

function extractAndValidateContext(
  request: FastifyRequest,
): ContextValidationResult {
  const headers = request.headers;

  const tenantId = getHeaderValue(headers, HEADER_KEYS.TENANT_ID);
  if (!tenantId) {
    return { valid: false, error: createMissingTenantErrorResponse() };
  }

  const clinicianId = getHeaderValue(headers, HEADER_KEYS.CLINICIAN_ID);
  const authorizedAt = getHeaderValue(headers, HEADER_KEYS.AUTHORIZED_AT);
  const correlationId = getHeaderValue(headers, HEADER_KEYS.CORRELATION_ID);

  if (!clinicianId || !authorizedAt || !correlationId) {
    return { valid: false, error: createMissingAuthorityErrorResponse() };
  }

  // Cross-tenant mismatch check
  const authTenant = getHeaderValue(headers, "x-auth-tenant-id");
  if (authTenant && authTenant !== tenantId) {
    return { valid: false, error: createNotAuthorizedErrorResponse() };
  }

  // ISO 8601 validation for authorizedAt
  const iso8601Regex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
  if (!iso8601Regex.test(authorizedAt)) {
    return { valid: false, error: createNotAuthorizedErrorResponse() };
  }

  const authority: TransportAuthorityContext = {
    clinicianId,
    tenantId,
    authorizedAt,
    correlationId,
  };

  return { valid: true, tenantId, authority };
}

function getHeaderValue(
  headers: FastifyRequest["headers"],
  key: string,
): string | undefined {
  const value = headers[key];
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  if (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof value[0] === "string"
  ) {
    return value[0].trim();
  }
  return undefined;
}

type BodyValidationResult<T> =
  | { valid: true; data: T }
  | {
      valid: false;
      error: {
        statusCode: number;
        body: { success: false; error: string; details?: readonly string[] };
      };
    };

function validateStartDraftBody(
  body: unknown,
): BodyValidationResult<StartDraftClinicalNoteRequest> {
  const errors: string[] = [];

  if (body === null || body === undefined || typeof body !== "object") {
    return {
      valid: false,
      error: createValidationErrorResponse(["Request body is required"]),
    };
  }

  const data = body as Record<string, unknown>;

  if (
    typeof data.encounterId !== "string" ||
    data.encounterId.trim().length === 0
  ) {
    errors.push("encounterId is required");
  }

  if (
    typeof data.patientId !== "string" ||
    data.patientId.trim().length === 0
  ) {
    errors.push("patientId is required");
  }

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

export async function handleUpdateDraft(
  request: FastifyRequest,
  reply: FastifyReply,
  service: ClinicalNoteAuthoringService,
): Promise<void> {
  // 1. Extract and validate context
  const contextResult = extractAndValidateContext(request);
  if (!contextResult.valid) {
    const { statusCode, body } = contextResult.error;
    reply.status(statusCode).send(body);
    return;
  }
  const { tenantId, authority } = contextResult;

  // 2. Extract clinicalNoteId from params
  const { clinicalNoteId } = request.params as { clinicalNoteId: string };
  if (!clinicalNoteId || clinicalNoteId.trim().length === 0) {
    const { statusCode, body } = createValidationErrorResponse([
      "clinicalNoteId is required",
    ]);
    reply.status(statusCode).send(body);
    return;
  }

  // 3. Validate request body
  const bodyValidation = validateUpdateDraftBody(request.body);
  if (!bodyValidation.valid) {
    const { statusCode, body } = bodyValidation.error;
    reply.status(statusCode).send(body);
    return;
  }
  const input = bodyValidation.data;

  // 4. Call service
  try {
    const result = await service.updateDraft(
      tenantId,
      authority,
      clinicalNoteId,
      input,
    );

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

function validateUpdateDraftBody(
  body: unknown,
): BodyValidationResult<UpdateDraftClinicalNoteRequest> {
  if (body === null || body === undefined || typeof body !== "object") {
    return {
      valid: false,
      error: createValidationErrorResponse(["Request body is required"]),
    };
  }

  const data = body as Record<string, unknown>;

  if (typeof data.content !== "string" || data.content.trim().length === 0) {
    return {
      valid: false,
      error: createValidationErrorResponse(["content is required"]),
    };
  }

  return {
    valid: true,
    data: {
      content: (data.content as string).trim(),
    },
  };
}
