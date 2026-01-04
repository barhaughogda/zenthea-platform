import { z } from 'zod';

/**
 * Typed configuration schema for the Medical Advisor Agent.
 * Environment-variable driven. No secrets.
 */
export const MedicalAdvisorConfigSchema = z.object({
  environment: z.enum(['development', 'staging', 'production']),
  ai: z.object({
    defaultModel: z.string().default('clinical-reasoning-v1'),
    maxTokens: z.number().int().positive().default(2048),
    temperature: z.number().min(0).max(1).default(0),
  }),
  governance: z.object({
    enableStrictPolicyEnforcement: z.boolean().default(true),
    logAuditTrails: z.boolean().default(true),
  }),
  integrations: z.object({
    evidenceProvider: z.string().default('internal'),
  }),
});

export type MedicalAdvisorConfig = z.infer<typeof MedicalAdvisorConfigSchema>;

/**
 * Loads configuration from environment variables.
 * Fails fast if configuration is invalid.
 */
export const loadConfig = (): MedicalAdvisorConfig => {
  const config = {
    environment: process.env.NODE_ENV || 'development',
    ai: {
      defaultModel: process.env.AI_DEFAULT_MODEL,
      maxTokens: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS) : undefined,
      temperature: process.env.AI_TEMPERATURE ? parseFloat(process.env.AI_TEMPERATURE) : undefined,
    },
    governance: {
      enableStrictPolicyEnforcement: process.env.ENABLE_STRICT_POLICY === 'true',
    },
  };

  return MedicalAdvisorConfigSchema.parse(config);
};

// TODO: Define feature flags and AI config overrides.
// TODO: Ensure configuration is auditable.
