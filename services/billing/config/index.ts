import { z } from 'zod';

export const BillingConfigSchema = z.object({
  stripeSecretKey: z.string().optional(),
  stripeWebhookSecret: z.string().optional(),
  defaultCurrency: z.string().default('usd'),
  usageAggregationInterval: z.number().default(3600), // in seconds
});

export type BillingConfig = z.infer<typeof BillingConfigSchema>;

export const config: BillingConfig = {
  defaultCurrency: 'usd',
  usageAggregationInterval: 3600,
};
