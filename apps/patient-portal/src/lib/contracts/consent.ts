/**
 * UI Contract for Consent Management in Patient Portal
 */
export interface ConsentInfo {
  id: string;
  purpose: string;
  status: 'active' | 'revoked' | 'expired' | 'pending';
  grantedAt: string;
  expiresAt?: string;
  explanation?: string;
}

export interface ConsentService {
  getConsents(patientId: string): Promise<ConsentInfo[]>;
}
