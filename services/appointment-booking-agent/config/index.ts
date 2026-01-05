import { z } from 'zod';

/**
 * Service Configuration Schema
 */
export const ConfigSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default('development'),
  jurisdiction: z.enum(['US', 'EU', 'UK']).default('US'),
  approval: z.object({
    requireStaffApprovalForWeekends: z.boolean().default(true),
    autoApprovePatientReschedule: z.boolean().default(false),
  }),
  scheduling: z.object({
    defaultAppointmentDurationMinutes: z.number().default(30),
    maxAdvanceBookingDays: z.number().default(90),
  }),
  ai: z.object({
    modelId: z.string().default('gpt-4o'),
    temperature: z.number().default(0),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Load configuration from environment variables.
 */
export const loadConfig = (): Config => {
  return ConfigSchema.parse({
    env: process.env.NODE_ENV,
    jurisdiction: process.env.JURISDICTION,
    // ... other mappings ...
  });
};

/**
 * Config Layer Entry Point
 */
export const config = loadConfig();
