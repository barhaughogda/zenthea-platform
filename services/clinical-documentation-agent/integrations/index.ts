/**
 * Integrations Layer: Clinical Documentation Agent
 * 
 * Responsibilities:
 * - Interfaces/adapters for read-only context inputs.
 * - Consent verification hard gate.
 * 
 * FORBIDDEN:
 * - Any write-back to external systems.
 * - Any uncontrolled retrieval beyond patient/tenant scope.
 */

export interface IEHRReadIntegration {
  /**
   * Fetches minimal necessary patient context for drafting.
   */
  getPatientSummary(patientId: string): Promise<{
    patientId: string;
    recentLabs?: any[];
    medications?: any[];
    allergies?: any[];
    recentNotes?: any[];
  }>;

  /**
   * Fetches encounter details.
   */
  getEncounterContext(encounterId: string): Promise<{
    encounterId: string;
    patientId: string;
    type: string;
    startTime: string;
  }>;
}

export interface ITranscriptionReadIntegration {
  /**
   * Fetches transcript content by ID.
   */
  getTranscript(transcriptId: string): Promise<{
    id: string;
    text: string;
    metadata: Record<string, any>;
  }>;
}

export type ConsentScope = 'clinical_documentation' | 'ai_assistance';

export interface IConsentAgent {
  /**
   * Verifies if consent is granted for a specific scope.
   * MUST be a hard gate for any AI-assisted drafting involving PHI.
   */
  verifyConsent(params: {
    patientId: string;
    scope: ConsentScope;
    tenantId: string;
  }): Promise<{
    granted: boolean;
    reason?: string;
  }>;
}
