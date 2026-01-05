import { mockBillingService } from '@/mocks/billing';

export const CLAIM_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  DENIED: 'denied',
};

export const getClaimStatusMessage = (status: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => 
  mockBillingService.getClaimStatusInfo(status).message;

export const getClaimStatusHelpfulMessage = (status: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => 
  mockBillingService.getClaimStatusInfo(status).helpfulMessage;
