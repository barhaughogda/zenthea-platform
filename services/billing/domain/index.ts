import { z } from 'zod';

/**
 * Plan definition
 */
export const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tier: z.enum(['free', 'pro', 'enterprise']),
  features: z.array(z.string()),
  limits: z.record(z.string(), z.number()),
  billingModel: z.enum(['subscription', 'usage-based', 'hybrid']),
});

export type Plan = z.infer<typeof PlanSchema>;

/**
 * Subscription definition
 */
export const SubscriptionSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  planId: z.string(),
  status: z.enum(['active', 'canceled', 'past_due', 'incomplete']),
  currentPeriodStart: z.date(),
  currentPeriodEnd: z.date(),
  cancelAtPeriodEnd: z.boolean(),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;

/**
 * Usage aggregate
 */
export interface UsageAggregate {
  tenantId: string;
  featureId: string;
  totalQuantity: number;
  periodStart: Date;
  periodEnd: Date;
}
