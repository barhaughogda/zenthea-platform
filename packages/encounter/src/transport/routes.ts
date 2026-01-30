/**
 * Encounter Routes - Slice 01
 *
 * Layer 1: Transport Boundary
 */

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  EncounterService,
  HEADER_KEYS,
  TransportAuthorityContext,
  TransportSuccessResponse,
  EncounterDto,
  CreateEncounterRequest,
  ActivateEncounterRequest,
  CompleteEncounterRequest,
} from "./types.js";
import {
  createMissingTenantErrorResponse,
  createMissingAuthorityErrorResponse,
  createInvalidAuthorityErrorResponse,
  createCapabilityViolationErrorResponse,
  createValidationErrorResponse,
  createInternalErrorResponse,
  mapServiceErrorToHttp,
} from "./error-mapping.js";

export async function registerEncounterRoutes(
  fastify: FastifyInstance,
  service: EncounterService,
): Promise<void> {
  // POST /api/v1/encounters - Create Encounter
  fastify.post("/api/v1/encounters", async (request, reply) => {
    return handleCreateEncounter(request, reply, service);
  });

  // POST /api/v1/encounters/:encounterId/activate - Activate Encounter
  fastify.post(
    "/api/v1/encounters/:encounterId/activate",
    async (request, reply) => {
      return handleActivateEncounter(request, reply, service);
    },
  );

  // POST /api/v1/encounters/:encounterId/complete - Complete Encounter
  fastify.post(
    "/api/v1/encounters/:encounterId/complete",
    async (request, reply) => {
      return handleCompleteEncounter(request, reply, service);
    },
  );
}

async function handleCreateEncounter(
  request: FastifyRequest,
  reply: FastifyReply,
  service: EncounterService,
): Promise<void> {
  const context = extractAndValidateContext(request, ["ENCOUNTER_CREATE"]);
  if (!context.valid) {
    const { statusCode, body } = context.error;
    reply.status(statusCode).send(body);
    return;
  }

  const bodyValidation = validateCreateEncounterBody(request.body);
  if (!bodyValidation.valid) {
    const { statusCode, body } = bodyValidation.error;
    reply.status(statusCode).send(body);
    return;
  }

  try {
    const result = await service.createEncounter(
      context.tenantId,
      context.authority,
      bodyValidation.data,
    );
    if (result.success) {
      const response: TransportSuccessResponse<EncounterDto> = {
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

async function handleActivateEncounter(
  request: FastifyRequest,
  reply: FastifyReply,
  service: EncounterService,
): Promise<void> {
  const context = extractAndValidateContext(request, ["ENCOUNTER_ACTIVATE"]);
  if (!context.valid) {
    const { statusCode, body } = context.error;
    reply.status(statusCode).send(body);
    return;
  }

  const params = request.params as { encounterId?: string };
  if (!params.encounterId) {
    const { statusCode, body } = createValidationErrorResponse([
      "encounterId is required",
    ]);
    reply.status(statusCode).send(body);
    return;
  }

  try {
    const result = await service.activateEncounter(
      context.tenantId,
      context.authority,
      { encounterId: params.encounterId },
    );
    if (result.success) {
      const response: TransportSuccessResponse<EncounterDto> = {
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

async function handleCompleteEncounter(
  request: FastifyRequest,
  reply: FastifyReply,
  service: EncounterService,
): Promise<void> {
  const context = extractAndValidateContext(request, ["ENCOUNTER_COMPLETE"]);
  if (!context.valid) {
    const { statusCode, body } = context.error;
    reply.status(statusCode).send(body);
    return;
  }

  const params = request.params as { encounterId?: string };
  if (!params.encounterId) {
    const { statusCode, body } = createValidationErrorResponse([
      "encounterId is required",
    ]);
    reply.status(statusCode).send(body);
    return;
  }

  try {
    const result = await service.completeEncounter(
      context.tenantId,
      context.authority,
      { encounterId: params.encounterId },
    );
    if (result.success) {
      const response: TransportSuccessResponse<EncounterDto> = {
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

type ContextResult =
  | { valid: true; tenantId: string; authority: TransportAuthorityContext }
  | { valid: false; error: { statusCode: number; body: any } };

function extractAndValidateContext(
  request: FastifyRequest,
  requiredCapabilities: string[],
): ContextResult {
  const headers = request.headers;

  const tenantId = getHeaderValue(headers, HEADER_KEYS.TENANT_ID);
  if (!tenantId)
    return { valid: false, error: createMissingTenantErrorResponse() };

  const clinicianId = getHeaderValue(headers, HEADER_KEYS.CLINICIAN_ID);
  if (!clinicianId)
    return { valid: false, error: createMissingAuthorityErrorResponse() };

  const authorizedAt = getHeaderValue(headers, HEADER_KEYS.AUTHORIZED_AT);
  const correlationId = getHeaderValue(headers, HEADER_KEYS.CORRELATION_ID);
  if (!authorizedAt || !correlationId)
    return { valid: false, error: createInvalidAuthorityErrorResponse() };

  const capabilitiesRaw =
    getHeaderValue(headers, HEADER_KEYS.CAPABILITIES) || "";
  const capabilities = capabilitiesRaw
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  for (const cap of requiredCapabilities) {
    if (!capabilities.includes(cap)) {
      return {
        valid: false,
        error: createCapabilityViolationErrorResponse(cap),
      };
    }
  }

  return {
    valid: true,
    tenantId,
    authority: {
      clinicianId,
      tenantId,
      authorizedAt,
      correlationId,
      capabilities,
    },
  };
}

function getHeaderValue(
  headers: FastifyRequest["headers"],
  key: string,
): string | undefined {
  const value = headers[key];
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value[0]?.trim();
  return undefined;
}

function validateCreateEncounterBody(
  body: any,
):
  | { valid: true; data: CreateEncounterRequest }
  | { valid: false; error: { statusCode: number; body: any } } {
  if (!body || typeof body !== "object") {
    return {
      valid: false,
      error: createValidationErrorResponse(["Body is required"]),
    };
  }
  if (
    typeof body.patientId !== "string" ||
    body.patientId.trim().length === 0
  ) {
    return {
      valid: false,
      error: createValidationErrorResponse(["patientId is required"]),
    };
  }
  return { valid: true, data: { patientId: body.patientId.trim() } };
}
