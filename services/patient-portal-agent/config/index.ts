import { z } from 'zod';

/**
 * Configuration Layer for Patient Portal Agent.
 * Typed service configuration using Zod.
 * Environment-variable driven only.
 */

export const ConfigSchema = z.object({
  /**
   * The jurisdiction where the service is operating (e.g., 'US', 'EU').
   * Used for HIPAA vs. GDPR compliance rules.
   */
  jurisdiction: z.enum(['US', 'EU', 'OTHER']).default('US'),

  /**
   * Feature gates to enable/disable specific agent capabilities.
   */
  features: z.object({
    enableLabSummaries: z.boolean().default(true),
    enableAppointmentScheduling: z.boolean().default(false), // Propose only
    enableMedicationExplanations: z.boolean().default(true),
  }),

  /**
   * Safety and compliance behavior flags.
   */
  safety: z.object({
    enforceZeroHallucination: z.boolean().default(true),
    requireConsentValidation: z.boolean().default(true),
    logSafetyViolations: z.boolean().default(true),
    prohibitDirectToolExecution: z.boolean().default(true),
  }),

  /**
   * AI Model Configuration.
   */
  ai: z.object({
    modelName: z.string().default('gpt-4-turbo'),
    temperature: z.number().min(0).max(1).default(0.2), // Low temperature for deterministic output
    maxTokens: z.number().default(1000),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Load configuration from environment variables.
 * TODO: Implement environment variable loading logic.
 */
export const config: Config = ConfigSchema.parse({
  jurisdiction: process.env.JURISDICTION || 'US',
  // ... other config values
});

/**
 * Requirements:
 * - Environment-variable driven.
 * - No secrets committed.
 * - Strict Zod validation.
 */
