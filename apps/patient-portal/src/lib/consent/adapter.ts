import { ConsentAgentClient, ConsentRecord } from '@starter/consent-agent-sdk';
import { 
  ConsentInfo, 
  ConsentService, 
  CreateConsentRequest, 
  RevokeConsentRequest, 
  UpdateConsentPreferencesRequest 
} from '../contracts/consent';
import { ToolExecutionGateway, ToolAuditLogger } from '@starter/tool-gateway';

/**
 * Adapter translating Consent Agent SDK responses to the Patient Portal UI contract.
 */
export class ConsentAgentAdapter implements ConsentService {
  private client: ConsentAgentClient;
  private toolGateway: ToolExecutionGateway;
  private enableWrites: boolean;

  constructor(config: { 
    baseUrl: string; 
    getToken?: () => Promise<string>;
    enableWrites?: boolean;
  }) {
    this.client = new ConsentAgentClient(config);
    this.toolGateway = new ToolExecutionGateway(new ToolAuditLogger());
    this.enableWrites = config.enableWrites || false;
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

  async createConsent(patientId: string, request: CreateConsentRequest): Promise<ConsentInfo> {
    if (!this.enableWrites) {
      throw new Error('CONSENT_WRITES_DISABLED');
    }

    const command = {
      commandId: crypto.randomUUID(),
      proposalId: crypto.randomUUID(),
      tenantId: 'default',
      agentId: 'patient-portal-agent',
      tool: { name: 'createConsent', version: '1.0.0' },
      parameters: {
        patientId,
        purpose: request.purpose,
        scope: request.scope,
        jurisdiction: 'US-HIPAA',
        expiresAt: request.expiresAt,
      },
      approval: {
        approvedBy: patientId,
        approvedAt: new Date().toISOString(),
        approvalType: 'human' as const,
      },
      idempotencyKey: `create-${patientId}-${Date.now()}`,
      metadata: { correlationId: crypto.randomUUID() },
    };

    const result = await this.toolGateway.execute(command);

    if (result.status === 'failure') {
      throw new Error(result.error?.code || 'GATEWAY_ERROR');
    }

    // Mock response mapping since the gateway is mocked
    return {
      id: crypto.randomUUID(),
      purpose: request.purpose,
      status: 'active',
      grantedAt: new Date().toISOString(),
      expiresAt: request.expiresAt,
    };
  }

  async updateConsentPreferences(patientId: string, request: UpdateConsentPreferencesRequest): Promise<ConsentInfo> {
    if (!this.enableWrites) {
      throw new Error('CONSENT_WRITES_DISABLED');
    }

    const command = {
      commandId: crypto.randomUUID(),
      proposalId: crypto.randomUUID(),
      tenantId: 'default',
      agentId: 'patient-portal-agent',
      tool: { name: 'updateConsentPreferences', version: '1.0.0' },
      parameters: {
        patientId,
        consentRecordId: request.consentRecordId,
        scope: request.scope,
      },
      approval: {
        approvedBy: patientId,
        approvedAt: new Date().toISOString(),
        approvalType: 'human' as const,
      },
      idempotencyKey: `update-${request.consentRecordId}-${Date.now()}`,
      metadata: { correlationId: crypto.randomUUID() },
    };

    const result = await this.toolGateway.execute(command);

    if (result.status === 'failure') {
      throw new Error(result.error?.code || 'GATEWAY_ERROR');
    }

    return {
      id: request.consentRecordId,
      purpose: 'UNKNOWN', // In real app, we'd fetch or return from tool
      status: 'active',
      grantedAt: new Date().toISOString(),
    };
  }

  async revokeConsent(patientId: string, request: RevokeConsentRequest): Promise<void> {
    if (!this.enableWrites) {
      throw new Error('CONSENT_WRITES_DISABLED');
    }

    const command = {
      commandId: crypto.randomUUID(),
      proposalId: crypto.randomUUID(),
      tenantId: 'default',
      agentId: 'patient-portal-agent',
      tool: { name: 'revokeConsent', version: '1.0.0' },
      parameters: {
        patientId,
        consentRecordId: request.consentRecordId,
        reason: request.reason,
      },
      approval: {
        approvedBy: patientId,
        approvedAt: new Date().toISOString(),
        approvalType: 'human' as const,
      },
      idempotencyKey: `revoke-${request.consentRecordId}-${Date.now()}`,
      metadata: { correlationId: crypto.randomUUID() },
    };

    const result = await this.toolGateway.execute(command);

    if (result.status === 'failure') {
      throw new Error(result.error?.code || 'GATEWAY_ERROR');
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
 */
export class MockConsentAdapter implements ConsentService {
  async getConsents(patientId: string): Promise<ConsentInfo[]> {
    console.log(`[MockConsentAdapter] Returning mock consents for patient: ${patientId}`);
    
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

  async createConsent(patientId: string, request: CreateConsentRequest): Promise<ConsentInfo> {
    console.log(`[MockConsentAdapter] Creating mock consent for patient: ${patientId}`, request);
    return {
      id: `mock-${crypto.randomUUID()}`,
      purpose: request.purpose,
      status: 'active',
      grantedAt: new Date().toISOString(),
      expiresAt: request.expiresAt,
    };
  }

  async updateConsentPreferences(patientId: string, request: UpdateConsentPreferencesRequest): Promise<ConsentInfo> {
    console.log(`[MockConsentAdapter] Updating mock consent for patient: ${patientId}`, request);
    return {
      id: request.consentRecordId,
      purpose: 'UPDATED',
      status: 'active',
      grantedAt: new Date().toISOString(),
    };
  }

  async revokeConsent(patientId: string, request: RevokeConsentRequest): Promise<void> {
    console.log(`[MockConsentAdapter] Revoking mock consent for patient: ${patientId}`, request);
  }
}
