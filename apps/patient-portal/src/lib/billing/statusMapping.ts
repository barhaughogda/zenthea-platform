import { mockBillingService } from '@/mocks/billing';

export const statusMapping: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */ = {};

export const getStatusLabel = (status: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => mockBillingService.getStatusLabel(status);
export const getStatusColor = (status: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => mockBillingService.getStatusColor(status);
export const getStatusBadgeVariant = (status: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => mockBillingService.getStatusBadgeVariant(status);
