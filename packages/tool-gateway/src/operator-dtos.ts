import { z } from 'zod';

/**
 * Control Plane DTO Versioning.
 * Starting with "v1" for stable, metadata-only contracts.
 */
export const OperatorDtoVersionSchema = z.literal('v1');
export type OperatorDtoVersion = z.infer<typeof OperatorDtoVersionSchema>;

/**
 * Bounded Risk Tiers for Policies.
 */
export const RiskTierSchema = z.enum(['low', 'medium', 'high']);
export type RiskTier = z.infer<typeof RiskTierSchema>;

/**
 * Bounded Presentation Metadata for Operator UIs.
 * 🚫 STRICTLY NO arbitrary JSON.
 */
export const BoundedPresentationSchema = z.object({
  icon: z.enum(['list', 'shield', 'activity', 'users', 'clock', 'alert-triangle']).optional(),
  layout: z.enum(['table', 'list', 'grid']).optional(),
  columns: z.array(z.object({
    key: z.string(),
    label: z.string(),
  })).optional(),
  defaultSort: z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']),
  }).optional(),
  badges: z.array(z.string()).optional(),
}).strict();

/**
 * Policy DTO: Safe representation of an Operator Query Policy.
 * 🚫 MUST NOT include raw filters or dynamic logic.
 */
export const PolicyDtoSchema = z.object({
  version: OperatorDtoVersionSchema,
  policyId: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  riskTier: RiskTierSchema,
  presentation: BoundedPresentationSchema,
  inputs: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
  })).optional(),
  outputs: z.array(z.object({
    name: z.string(),
    type: z.string(),
    description: z.string(),
  })).optional(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
  })).optional(),
}).strict();

export type PolicyDto = z.infer<typeof PolicyDtoSchema>;

/**
 * View DTO: Safe representation of a Saved View.
 * 🚫 MUST NOT include raw filters or tenant/actor identifiers.
 */
export const ViewDtoSchema = z.object({
  version: OperatorDtoVersionSchema,
  viewId: z.string(),
  name: z.string(),
  description: z.string(),
  policyId: z.string(),
  presentation: BoundedPresentationSchema,
}).strict();

export type ViewDto = z.infer<typeof ViewDtoSchema>;

/**
 * Execution Result DTO: Safe envelope for policy/view execution results.
 * 🚫 STRICTLY NO raw results, cursors, or PHI.
 */
export const ExecutionResultDtoSchema = z.object({
  version: OperatorDtoVersionSchema,
  executionId: z.string().uuid(),
  kind: z.enum(['policy', 'view']),
  id: z.string(), // policyId or viewId
  outcome: z.enum(['ALLOWED', 'REJECTED', 'ERROR']),
  reasonCode: z.string().optional(),
  resultSummary: z.object({
    message: z.string(),
    count: z.number().int().nonnegative(),
  }),
  pageInfo: z.object({
    hasNextPage: z.boolean(),
    count: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
  }),
  timestamp: z.string().datetime(),
  correlationId: z.string().optional(),
}).strict();

export type ExecutionResultDto = z.infer<typeof ExecutionResultDtoSchema>;

/**
 * Operator Audit DTO: Safe representation of an operator audit event.
 * Matches Slice 13 taxonomy.
 * 🚫 MUST NOT include tenantId, actorId, payload, or PHI.
 */
export const OperatorAuditDtoSchema = z.object({
  version: OperatorDtoVersionSchema,
  eventId: z.string().uuid(),
  action: z.enum(['POLICY_EXECUTE', 'VIEW_EXECUTE']),
  outcome: z.enum(['ALLOWED', 'REJECTED']),
  reasonCode: z.string().optional(),
  target: z.string(), // policyId or viewId
  timestamp: z.string().datetime(),
  metadata: z.object({
    targetType: z.enum(['timeline', 'agentRegistry']),
    policySnapshotHash: z.string().optional(),
  }).strict(),
}).strict();

export type OperatorAuditDto = z.infer<typeof OperatorAuditDtoSchema>;
