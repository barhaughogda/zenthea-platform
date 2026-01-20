/**
 * Clinical Note Authoring HTTP Server - Phase I.3
 *
 * Fastify server setup for Clinical Note Authoring Transport.
 *
 * INVARIANTS (from Phase I.0/I.2):
 * - Transport Layer MUST NOT contain business logic
 * - Transport Layer MUST call ONLY Service Layer APIs
 * - Fail-closed on any configuration or startup failure
 */

import Fastify, { type FastifyInstance, type FastifyError } from "fastify";
import type { ClinicalNoteAuthoringService } from "./types.js";
import { registerClinicalNoteRoutes } from "./routes/clinical-note.routes.js";
import { createInternalErrorResponse, createValidationErrorResponse } from "./error-mapping.js";

// ============================================================
// Server Configuration
// ============================================================

/**
 * Server configuration options.
 */
export interface ServerConfig {
  /** Host to bind to (default: 127.0.0.1) */
  readonly host?: string;
  /** Port to listen on (default: 3000) */
  readonly port?: number;
  /** Enable request logging (default: false in production) */
  readonly logger?: boolean;
}

/**
 * Default server configuration.
 */
const DEFAULT_CONFIG: Required<ServerConfig> = {
  host: "127.0.0.1",
  port: 3000,
  logger: false,
};

// ============================================================
// Server Factory
// ============================================================

/**
 * Creates a Fastify server instance with Clinical Note Authoring routes.
 *
 * The server is NOT started - call server.listen() to start.
 *
 * @param service - Clinical Note Authoring Service implementation (injected)
 * @param config - Optional server configuration
 * @returns Configured Fastify instance
 */
export async function createServer(
  service: ClinicalNoteAuthoringService,
  config?: ServerConfig
): Promise<FastifyInstance> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const fastify = Fastify({
    logger: mergedConfig.logger,
  });

  // Add custom error handler to ensure consistent error responses
  fastify.setErrorHandler((error: FastifyError, _request, reply) => {
    // Handle JSON parsing/validation errors
    if (
      error.statusCode === 400 ||
      error.code === "FST_ERR_CTP_EMPTY_JSON_BODY" ||
      error.code === "FST_ERR_CTP_INVALID_MEDIA_TYPE" ||
      error.code === "FST_ERR_CTP_INVALID_CONTENT_LENGTH" ||
      error.validation
    ) {
      const { statusCode, body } = createValidationErrorResponse([
        "Request body is required",
      ]);
      return reply.status(statusCode).send(body);
    }

    // Default to internal error for unknown errors - FAIL CLOSED
    const { statusCode, body } = createInternalErrorResponse();
    return reply.status(statusCode).send(body);
  });

  // Handle empty body for application/json content-type
  // This allows POST requests without body (like finalize) to work
  fastify.addContentTypeParser(
    "application/json",
    { parseAs: "string" },
    (_request, payload, done) => {
      if (!payload || payload.length === 0) {
        done(null, undefined);
        return;
      }
      try {
        done(null, JSON.parse(payload as string));
      } catch (err) {
        done(err as Error, undefined);
      }
    }
  );

  // Register routes
  await registerClinicalNoteRoutes(fastify, service);

  // Health check endpoint (does NOT require auth)
  fastify.get("/health", async (_request, reply) => {
    reply.status(200).send({ status: "healthy" });
  });

  return fastify;
}

/**
 * Starts the server and listens on the configured host/port.
 *
 * @param server - Fastify server instance
 * @param config - Optional server configuration
 * @returns Address the server is listening on
 */
export async function startServer(
  server: FastifyInstance,
  config?: ServerConfig
): Promise<string> {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  const address = await server.listen({
    host: mergedConfig.host,
    port: mergedConfig.port,
  });

  return address;
}

/**
 * Gracefully stops the server.
 *
 * @param server - Fastify server instance
 */
export async function stopServer(server: FastifyInstance): Promise<void> {
  await server.close();
}
