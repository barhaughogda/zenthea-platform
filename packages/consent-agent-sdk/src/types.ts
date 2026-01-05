import { z } from 'zod';

export const ConsentScopeSchema = z.object({
  dataCategories: z.array(z.string()),
  exceptions: z.array(z.string()).optional(),
});

export const ConsentRecordSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string(),
  actorId: z.string(),
  purpose: z.enum(['TREATMENT', 'PAYMENT', 'OPERATIONS', 'RESEARCH', 'MARKETING', 'EMERGENCY']),
  scope: ConsentScopeSchema,
  jurisdiction: z.enum(['US-HIPAA', 'EU-GDPR', 'GLOBAL']),
  grantedAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  revokedAt: z.string().datetime().optional(),
  revocationReason: z.string().optional(),
  version: z.string(),
  explanation: z.string().optional(),
});

export type ConsentRecord = z.infer<typeof ConsentRecordSchema>;

export const ConsentHistorySchema = z.array(ConsentRecordSchema);
export type ConsentHistory = z.infer<typeof ConsentHistorySchema>;

export const ConsentCheckRequestSchema = z.object({
  patientId: z.string().uuid(),
  actorId: z.string(),
  purpose: z.string(),
  resourceId: z.string().optional(),
});

export const ConsentDecisionResponseSchema = z.object({
  allowed: z.boolean(),
  decisionId: z.string().uuid(),
  reason: z.string(),
  policyVersion: z.string(),
  explanation: z.string().optional(),
});

export type ConsentDecisionResponse = z.infer<typeof ConsentDecisionResponseSchema>;
