/**
 * Persistence interfaces for the billing domain
 */
export interface IUsageRepository {
  save(event: any): Promise<void>;
  getAggregatedUsage(tenantId: string, featureId: string, start: Date, end: Date): Promise<number>;
}

export interface ISubscriptionRepository {
  findByTenantId(tenantId: string): Promise<any>;
  save(subscription: any): Promise<void>;
}
