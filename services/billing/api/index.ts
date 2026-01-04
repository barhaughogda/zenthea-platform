import { z } from 'zod';

/**
 * Usage reporting schema
 */
export const UsageEventSchema = z.object({
  tenantId: z.string(),
  serviceId: z.string(),
  featureId: z.string(),
  quantity: z.number().positive(),
  metadata: z.record(z.string(), z.any()).optional(),
  timestamp: z.date().default(() => new Date()),
});

export type UsageEvent = z.infer<typeof UsageEventSchema>;

/**
 * Entitlement check schema
 */
export const EntitlementCheckSchema = z.object({
  tenantId: z.string(),
  featureId: z.string(),
  context: z.record(z.string(), z.any()).optional(),
});

export type EntitlementCheck = z.infer<typeof EntitlementCheckSchema>;

export interface EntitlementResponse {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}

/**
 * Public interface for the Billing Service
 */
export interface IBillingService {
  /**
   * Report usage for a specific feature and tenant
   */
  reportUsage(event: UsageEvent): Promise<void>;

  /**
   * Check if a tenant is entitled to use a specific feature
   */
  checkEntitlement(check: EntitlementCheck): Promise<EntitlementResponse>;
}
