import { z } from 'zod';

/**
 * Metadata-only Decision DTOs for CP-16.
 * ⚠️ SECURITY: NO tenantId, actorId, requestId, payload, or PHI.
 */

export const DecisionKindSchema = z.enum([
  'HUMAN_REVIEW',
  'SECURITY_REVIEW',
  'COMPLIANCE_REVIEW'
]);

export const DecisionSeveritySchema = z.enum(['info', 'warning', 'critical']);

export const DecisionReasonCodeSchema = z.enum([
  'HIGH_RISK_REJECTION',
  'POLICY_MISCONFIG_ERROR',
  'ANOMALOUS_OUTCOME',
  'MANUAL_ESCALATION_SIGNAL'
]);

/**
 * Decision DTO: Structured representation of a required decision.
 */
export const DecisionDtoSchema = z.object({
  kind: DecisionKindSchema,
  severity: DecisionSeveritySchema,
  reasonCode: DecisionReasonCodeSchema,
  message: z.string().optional(),
}).strict();

export type DecisionDto = z.infer<typeof DecisionDtoSchema>;

/**
 * Decision Request DTO: Metadata envelope for requesting a decision.
 */
export const DecisionRequestDtoSchema = z.object({
  executionId: z.string().uuid(),
  targetType: z.enum(['policy', 'view']),
  targetId: z.string(),
  decisionKind: DecisionKindSchema,
  reasonCode: DecisionReasonCodeSchema,
  severity: DecisionSeveritySchema,
  createdAt: z.string().datetime(),
}).strict();

export type DecisionRequestDto = z.infer<typeof DecisionRequestDtoSchema>;

/**
 * Decision Response DTO: Acknowledgment only (read-only slice).
 */
export const DecisionResponseDtoSchema = z.object({
  executionId: z.string().uuid(),
  acknowledged: z.boolean().default(false),
  timestamp: z.string().datetime(),
}).strict();

export type DecisionResponseDto = z.infer<typeof DecisionResponseDtoSchema>;
