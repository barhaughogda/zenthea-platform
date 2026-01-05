import { ConsentAgentClient, ConsentRecord } from '@starter/consent-agent-sdk';
import { ConsentInfo, ConsentService } from '../contracts/consent';

/**
 * Adapter translating Consent Agent SDK responses to the Patient Portal UI contract.
 * 
 * Mandatory Constraints:
 * - No business logic
 * - No data enrichment
 * - No retries, caching, batching, or orchestration
 * - Minimal structured logging at boundaries
 */
export class ConsentAgentAdapter implements ConsentService {
  private client: ConsentAgentClient;

  constructor(config: { baseUrl: string; getToken?: () => Promise<string> }) {
    this.client = new ConsentAgentClient(config);
  }

  async getConsents(patientId: string): Promise<ConsentInfo[]> {
    try {
      console.log('[ConsentAgentAdapter] Fetching consent history', { 
        event: 'CONSENT_FETCH_START', 
        patientId: patientId.slice(0, 4) + '...' // Redacting PHI
      });
      const history = await this.client.getHistory(patientId);
      
      const mapped = history.map((record: ConsentRecord) => this.mapToUI(record));
      
      console.log('[ConsentAgentAdapter] Successfully fetched consents', { 
        event: 'CONSENT_FETCH_SUCCESS', 
        patientId: patientId.slice(0, 4) + '...', // Redacting PHI
        count: mapped.length 
      });
      return mapped;
    } catch (error) {
      console.error('[ConsentAgentAdapter] Failed to fetch consents', {
        event: 'CONSENT_FETCH_ERROR',
        patientId: patientId.slice(0, 4) + '...', // Redacting PHI
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  private mapToUI(record: ConsentRecord): ConsentInfo {
    let status: ConsentInfo['status'] = 'active';
    
    if (record.revokedAt) {
      status = 'revoked';
    } else if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      status = 'expired';
    }

    return {
      id: record.id,
      purpose: record.purpose,
      status,
      grantedAt: record.grantedAt,
      expiresAt: record.expiresAt,
      explanation: record.explanation,
    };
  }
}

/**
 * Mock implementation of the Consent Service for development and testing.
 * Used when the USE_REAL_CONSENT_AGENT feature flag is off.
 */
export class MockConsentAdapter implements ConsentService {
  async getConsents(patientId: string): Promise<ConsentInfo[]> {
    console.log(`[MockConsentAdapter] Returning mock consents for patient: ${patientId}`);
    
    // This represents the "existing mock" state
    // Given the previous state was null, we return an empty array or a set of mock data
    // to match the expected UI behavior once integrated.
    return [
      {
        id: 'mock-consent-1',
        purpose: 'TREATMENT',
        status: 'active',
        grantedAt: new Date().toISOString(),
        explanation: 'Allows your care team to access your medical records for treatment purposes.'
      },
      {
        id: 'mock-consent-2',
        purpose: 'RESEARCH',
        status: 'revoked',
        grantedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        explanation: 'Participation in clinical research studies.'
      }
    ];
  }
}
