/**
 * External system boundaries for medical evidence and external data.
 * No business logic or AI calls here.
 */

/**
 * Adapter interface for external medical evidence systems (e.g., OpenEvidence).
 * All external access must go through this governed integration boundary.
 */
export interface IExternalEvidenceAdapter {
  search(query: string, constraints: {
    tenantId: string;
    clinicianId: string;
  }): Promise<{
    results: Array<{
      id: string;
      title: string;
      snippet: string;
      citation: string;
    }>;
  }>;
}

/**
 * Adapter interface for EHR data retrieval (if needed by this agent).
 * Must be tenant and identity scoped.
 */
export interface IEhrDataAdapter {
  getPatientData(patientId: string, scope: string): Promise<any>;
}

// TODO: Handle retries, failures, and vendor eligibility.
// TODO: No vendor SDKs should be used outside of concrete implementations.
// TODO: No direct execution from AI outputs.
