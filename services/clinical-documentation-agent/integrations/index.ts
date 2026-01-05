/**
 * Integrations Layer: Clinical Documentation Agent
 * 
 * Responsibilities:
 * - Define boundaries for external systems (EHR, Transcription services, etc.).
 * - Placeholder interfaces for future integrations.
 * - SAFETY: No direct writes to external systems without orchestration and approval.
 */

/**
 * Interface for reading clinical context from external sources (e.g., EHR).
 */
export interface IEHRIntegration {
  /**
   * Fetches patient context relevant for documentation.
   * TODO: Implement patient-scoped, purpose-limited data retrieval.
   */
  getPatientContext(patientId: string): Promise<any>;
}

/**
 * Interface for receiving transcription inputs.
 */
export interface ITranscriptionIntegration {
  /**
   * Streams or fetches transcripts from a recording service.
   */
  getTranscript(transcriptId: string): Promise<string>;
}

// TODO: Implement adapters for specific EHR vendors (e.g., Epic, Cerner)
// TODO: Ensure all integration calls are logged for auditability
// NOTE: Direct writes to EHR are EXPLICITLY out of scope for this agent.
