import { z } from 'zod';

/**
 * Config Layer: Clinical Documentation Agent
 * 
 * Responsibilities:
 * - Typed configuration schema using Zod.
 * - Environment-variable driven only.
 * - SAFETY: Invalid configuration must fail the service at startup.
 */

export const ServiceConfigSchema = z.object({
  env: z.enum(['development', 'staging', 'production']),
  jurisdiction: z.enum(['US-CA', 'US-NY', 'EU-DE', 'UK']), // Jurisdiction-aware behavior
  safety: z.object({
    enforceDraftOnly: z.boolean().default(true),
    strictNoDiagnosis: z.boolean().default(true),
    logAuditEvents: z.boolean().default(true),
  }),
  templates: z.array(z.string()).default(['SOAP', 'ProgressNote']),
  ai: z.object({
    modelName: z.string(),
    temperature: z.number().min(0).max(1).default(0.2), // Low temperature for consistency
  }),
});

export type ServiceConfig = z.infer<typeof ServiceConfigSchema>;

/**
 * Loads and validates configuration from environment variables.
 * TODO: Integrate with process.env and provide defaults.
 */
export function loadConfig(): ServiceConfig {
  // Placeholder: In a real implementation, this would read from process.env
  return ServiceConfigSchema.parse({
    env: 'development',
    jurisdiction: 'US-CA',
    safety: {
      enforceDraftOnly: true,
      strictNoDiagnosis: true,
      logAuditEvents: true,
    },
    templates: ['SOAP', 'ProgressNote'],
    ai: {
      modelName: 'gpt-4o',
      temperature: 0.2,
    },
  });
}
