import { z } from 'zod';

/**
 * 🆔 Connector Identifier
 * Standardizes how we identify external systems.
 */
export const ConnectorIdSchema = z.object({
  name: z.string().min(1).describe('The name of the external system (e.g., "n8n", "epic-fhir", "google-calendar")'),
  version: z.string().min(1).describe('The version of the connector implementation'),
});

export type ConnectorId = z.infer<typeof ConnectorIdSchema>;

/**
 * 🏗️ Integration Capability
 * Defines the nature of the interaction.
 */
export const IntegrationCapabilitySchema = z.enum([
  'READ_ONLY',
  'WRITE_CONTROLLED',
]);

export type IntegrationCapability = z.infer<typeof IntegrationCapabilitySchema>;

/**
 * 🔒 Data Classification
 * Mandatory classification for all data passing through the boundary.
 */
export const DataClassificationSchema = z.enum([
  'NONE',
  'PII', // Personally Identifiable Information
  'PHI', // Protected Health Information
]);

export type DataClassification = z.infer<typeof DataClassificationSchema>;

/**
 * ❌ Failure Taxonomy
 * Standardized metadata-only failure categories.
 */
export const FailureTaxonomySchema = z.enum([
  'TIMEOUT',
  'UNREACHABLE',
  'AUTH_FAILED',
  'RATE_LIMITED',
  'INVALID_REQUEST',
  'UPSTREAM_ERROR',
  'IDEMPOTENCY_CONFLICT',
  'CIRCUIT_BROKEN',
  'UNKNOWN_ERROR',
]);

export type FailureTaxonomy = z.infer<typeof FailureTaxonomySchema>;

/**
 * 🛡️ Redaction Policy
 * Declarative policy for field redaction.
 */
export const RedactionPolicySchema = z.object({
  fieldsToRedact: z.array(z.string()),
  strategy: z.enum(['MASK', 'STRIP', 'HASH']).default('STRIP'),
});

export type RedactionPolicy = z.infer<typeof RedactionPolicySchema>;

/**
 * 🔁 Retry Policy
 * Declarative retry configuration.
 */
export const RetryPolicySchema = z.object({
  maxAttempts: z.number().int().min(0).max(10),
  backoff: z.enum(['FIXED', 'EXPONENTIAL']),
  initialDelayMs: z.number().int().min(0),
});

export type RetryPolicy = z.infer<typeof RetryPolicySchema>;

/**
 * 🗝️ Idempotency Requirement
 * Mandatory for WRITE_CONTROLLED operations.
 */
export const IdempotencyRequirementSchema = z.object({
  key: z.string().min(1),
  ttlSeconds: z.number().int().positive().optional(),
});

export type IdempotencyRequirement = z.infer<typeof IdempotencyRequirementSchema>;

/**
 * 📩 Integration Request Envelope
 * The standard request wrapper for all external calls.
 */
export const IntegrationRequestEnvelopeSchema = z.object({
  connectorId: ConnectorIdSchema,
  capability: IntegrationCapabilitySchema,
  classification: DataClassificationSchema,
  purpose: z.string().min(1).describe('The explicit business purpose for this call'),
  correlationId: z.string().uuid(),
  idempotency: IdempotencyRequirementSchema.optional(),
  redaction: RedactionPolicySchema.optional(),
  retry: RetryPolicySchema.optional(),
}).refine(
  (data) => {
    if (data.capability === 'WRITE_CONTROLLED') {
      return !!data.idempotency;
    }
    return true;
  },
  {
    message: "WRITE_CONTROLLED capability requires an idempotency key",
    path: ["idempotency"],
  }
);

export type IntegrationRequestEnvelope = z.infer<typeof IntegrationRequestEnvelopeSchema>;

/**
 * 📤 Integration Result Envelope
 * ⚠️ SECURITY: MUST NOT contain raw payloads or PHI/PII.
 * Metadata-only summary of the interaction.
 */
export const IntegrationResultEnvelopeSchema = z.object({
  status: z.enum(['SUCCESS', 'FAILED']),
  connectorId: ConnectorIdSchema,
  correlationId: z.string().uuid(),
  classification: DataClassificationSchema,
  summary: z.object({
    bytesProcessed: z.number().int().nonnegative().optional(),
    recordCount: z.number().int().nonnegative().optional(),
    message: z.string().max(200).optional(),
  }),
  error: z.object({
    code: FailureTaxonomySchema,
    message: z.string().max(200),
    isRetryable: z.boolean(),
  }).optional(),
  latencyMs: z.number().int().nonnegative(),
  // 🚫 STRICTLY NO payload, data, or raw fields allowed.
}).strict();

export type IntegrationResultEnvelope = z.infer<typeof IntegrationResultEnvelopeSchema>;
