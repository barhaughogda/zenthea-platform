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

export interface CreateConsentRequest {
  purpose: string;
  scope: string[];
  expiresAt?: string;
}

export interface UpdateConsentPreferencesRequest {
  consentRecordId: string;
  scope: string[];
}

export interface RevokeConsentRequest {
  consentRecordId: string;
  reason?: string;
}

export interface ConsentService {
  getConsents(patientId: string): Promise<ConsentInfo[]>;
  createConsent(patientId: string, request: CreateConsentRequest): Promise<ConsentInfo>;
  updateConsentPreferences(patientId: string, request: UpdateConsentPreferencesRequest): Promise<ConsentInfo>;
  revokeConsent(patientId: string, request: RevokeConsentRequest): Promise<void>;
}
