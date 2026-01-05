import { BillingService, ClaimStatusInfo } from '../lib/contracts/billing';

export const mockBillingService: BillingService = {
  getClaimStatusInfo: (status: string): ClaimStatusInfo => ({
    status,
    message: 'Mock status message',
    helpfulMessage: 'Mock helpful message',
  }),
  getStatusLabel: (_status: string) => 'Mock label',
  getStatusColor: (_status: string) => 'blue',
  getStatusBadgeVariant: (_status: string) => 'default',
};
