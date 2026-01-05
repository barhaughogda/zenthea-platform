export interface ClaimStatusInfo {
  status: string;
  message: string;
  helpfulMessage: string;
}

export interface BillingService {
  getClaimStatusInfo(status: string): ClaimStatusInfo;
  getStatusLabel(status: string): string;
  getStatusColor(status: string): string;
  getStatusBadgeVariant(status: string): string;
}
