import { z } from 'zod';

/**
 * Configuration Layer for Consent Agent
 * 
 * Responsibilities:
 * - Define typed configuration schema using Zod
 * - Enforce configuration validity at startup
 * - Manage environment-specific flags (Jurisdiction, Policy Version)
 * 
 * Rules:
 * - No secrets in this file.
 * - Use environment variables only.
 */

export const ConfigSchema = z.object({
  env: z.enum(['development', 'staging', 'production']).default('development'),
  defaultJurisdiction: z.enum(['US-HIPAA', 'EU-GDPR', 'GLOBAL']).default('GLOBAL'),
  currentPolicyVersion: z.string().default('v1.0.0'),
  encryptionEnabled: z.boolean().default(true),
  aiExplanationEnabled: z.boolean().default(true),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Load and validate configuration.
 */
export function loadConfig(): Config {
  // TODO: Use platform config loader to pull from env
  return ConfigSchema.parse({
    env: process.env.NODE_ENV,
    defaultJurisdiction: process.env.CONSENT_DEFAULT_JURISDICTION,
    currentPolicyVersion: process.env.CONSENT_POLICY_VERSION,
    encryptionEnabled: process.env.CONSENT_ENCRYPTION_ENABLED === 'true',
    aiExplanationEnabled: process.env.CONSENT_AI_EXPLANATION_ENABLED === 'true',
  });
}
