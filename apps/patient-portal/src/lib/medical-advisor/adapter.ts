import { 
  MedicalAdvisorAgentClient, 
  ClinicalQueryResponse 
} from '@starter/medical-advisor-agent-sdk';
import { MedicalAdvisorService, MedicalAdvisory } from '../contracts/medical-advisor';
import { ControlPlaneContext } from '@starter/service-control-adapter';

/**
 * Adapter translating Medical Advisor Agent SDK responses to the Patient Portal UI contract.
 * 
 * Mandatory Constraints:
 * - No business logic
 * - No data enrichment
 * - No retries, caching, batching, or orchestration
 * - Minimal structured logging at boundaries
 */
export class MedicalAdvisorAgentAdapter implements MedicalAdvisorService {
  private client: MedicalAdvisorAgentClient;
  private ctx: ControlPlaneContext;

  constructor(config: { baseUrl: string; getToken?: () => Promise<string>; ctx: ControlPlaneContext }) {
    this.client = new MedicalAdvisorAgentClient(config);
    this.ctx = config.ctx;
  }

  async getAdvisory(patientId: string, query?: string): Promise<MedicalAdvisory | null> {
    try {
      console.log('[MedicalAdvisorAgentAdapter] Fetching clinical advisory', { 
        event: 'ADVISORY_FETCH_START', 
        patientId: patientId.slice(0, 4) + '...' // Redacting PHI
      });

      // Following Step 4.4 requirements: ADVISORY ONLY and READ-ONLY.
      // We pass the minimum necessary context to the agent.
      const response = await this.client.submitQuery(this.ctx, {
        query: query || 'Provide a general health advisory summary based on my records.',
        context: {
          patientId,
          tenantId: 'demo-tenant', // Should be pulled from context in a real app
        },
        metadata: {
          requestId: crypto.randomUUID(),
          clinicianId: 'system-advisor', // Internal ID for system-generated advisories
        }
      });

      const mapped = this.mapToUI(response);

      console.log('[MedicalAdvisorAgentAdapter] Successfully fetched advisory', { 
        event: 'ADVISORY_FETCH_SUCCESS', 
        patientId: patientId.slice(0, 4) + '...', // Redacting PHI
        requestId: response.metadata.promptVersion // Using prompt version as a proxy for correlation
      });

      return mapped;
    } catch (error) {
      console.error('[MedicalAdvisorAgentAdapter] Failed to fetch clinical advisory', {
        event: 'ADVISORY_FETCH_ERROR',
        patientId: patientId.slice(0, 4) + '...', // Redacting PHI
        error: error instanceof Error ? error.message : String(error)
      });
      // In case of error, we return null to allow the UI to handle it gracefully
      // as per deterministic UX requirements.
      return null;
    }
  }

  private mapToUI(response: ClinicalQueryResponse): MedicalAdvisory {
    return {
      id: crypto.randomUUID(),
      advisoryText: response.advisoryText,
      evidenceReferences: response.evidenceReferences.map((ref: { sourceId: string; description: string; citation?: string }) => ({
        sourceId: ref.sourceId,
        description: ref.description,
        citation: ref.citation,
      })),
      metadata: {
        updatedAt: new Date().toISOString(),
        isDraft: response.metadata.isDraft,
        isAdvisory: response.metadata.isAdvisory,
        confidenceScore: response.metadata.confidenceScore,
      }
    };
  }
}

/**
 * Mock implementation of the Medical Advisor Service for development and testing.
 * Used when the USE_REAL_MEDICAL_ADVISOR_AGENT feature flag is off.
 */
export class MockMedicalAdvisorAdapter implements MedicalAdvisorService {
  async getAdvisory(patientId: string): Promise<MedicalAdvisory | null> {
    console.log(`[MockMedicalAdvisorAdapter] Returning mock clinical advisory for patient: ${patientId}`);
    
    // This represents the "existing mock" state required by Slice 02B.
    return {
      id: 'mock-advisory-1',
      advisoryText: 'Based on your recent lab results and health history, your overall health indicators remain stable. We recommend continuing your current wellness routine and staying hydrated. Please note that this is an informational summary only.',
      evidenceReferences: [
        {
          sourceId: 'guideline-1',
          description: 'Standard Wellness Guidelines 2024',
          citation: 'National Health Institute'
        }
      ],
      metadata: {
        updatedAt: new Date().toISOString(),
        isDraft: true,
        isAdvisory: true,
        confidenceScore: 0.95,
      }
    };
  }
}
