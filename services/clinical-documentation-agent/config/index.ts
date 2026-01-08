import { z } from 'zod';

/**
 * Config Layer: Clinical Documentation Agent
 */

export const ServiceConfigSchema = z.object({
  env: z.enum(['development', 'staging', 'production']),
  complianceMode: z.enum(['HIPAA', 'GDPR', 'NONE']).default('HIPAA'),
  safety: z.object({
    enforceDraftOnly: z.literal(true), // Hard constraint
    strictNoDiagnosis: z.boolean().default(true),
    logAuditEvents: z.boolean().default(true),
    requireEvidenceForPatientFacts: z.boolean().default(true),
  }),
  ai: z.object({
    defaultModelProvider: z.string().default('zenthea-internal'),
    defaultModelName: z.string().default('clinical-draft-v1'),
    defaultModelVersion: z.string().default('1.0.0'),
    defaultPromptVersion: z.string().default('v1.0.0'),
    temperature: z.number().min(0).max(1).default(0.2),
  }),
  tenantId: z.string().default('default-tenant'),
});

export type ServiceConfig = z.infer<typeof ServiceConfigSchema>;

/**
 * Loads and validates configuration from environment variables.
 */
export function loadConfig(): ServiceConfig {
  // In a real implementation, this would read from process.env
  // For Phase 3, we provide a valid default that satisfies the schema.
  return ServiceConfigSchema.parse({
    env: process.env.NODE_ENV || 'development',
    complianceMode: 'HIPAA',
    safety: {
      enforceDraftOnly: true,
      strictNoDiagnosis: true,
      logAuditEvents: true,
      requireEvidenceForPatientFacts: true,
    },
    ai: {
      defaultModelProvider: 'zenthea-internal',
      defaultModelName: 'clinical-draft-v1',
      defaultModelVersion: '1.0.0',
      defaultPromptVersion: 'v1.0.0',
      temperature: 0.2,
    },
    tenantId: 'zenthea-core',
  });
}
