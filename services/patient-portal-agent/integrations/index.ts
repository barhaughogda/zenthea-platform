/**
 * Integrations Layer for Patient Portal Agent.
 * External system boundaries (EHR, Calendar, etc.).
 */

/**
 * Placeholder interface for external health systems.
 * Requirements:
 * - No business logic here.
 * - No AI calls.
 * - No direct execution from AI outputs.
 */
export interface IEhrIntegrationAdapter {
  /**
   * Placeholder for fetching data from an external EHR system.
   */
  fetchExternalRecords(patientId: string, externalSystemId: string): Promise<any>;
}

/**
 * Placeholder interface for scheduling/calendar integrations.
 */
export interface ISchedulingAdapter {
  /**
   * Placeholder for proposing a scheduling request.
   * Must go through orchestration and Tool Execution Gateway.
   */
  proposeAppointment(patientId: string, appointmentDetails: any): Promise<void>;
}

/**
 * TODO: Implement adapter interfaces for external systems.
 * No external calls allowed in this layer yet.
 * RAG implementation pending.
 */
