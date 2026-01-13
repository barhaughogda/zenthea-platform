/**
 * LIVE DATA ADAPTER (SHADOW MODE)
 * 
 * Provides a read-only interface for retrieving live patient data.
 * All mutations are strictly prohibited and will throw errors.
 * This adapter is side-effect free.
 */

import { PatientContext, DEMO_PATIENT_CONTEXT } from "./demoPatientContext";
import { PatientTimeline, DEMO_PATIENT_TIMELINE } from "./demoPatientTimeline";

export interface LiveDataAdapter {
  getPatientContextReadOnly(patientId: string): Promise<PatientContext>;
  getPatientTimelineReadOnly(patientId: string): Promise<PatientTimeline>;
}

export const LiveDataAdapter: LiveDataAdapter = {
  /**
   * Retrieves live patient context in read-only mode.
   * Currently returns demo data shaped as live data for shadow mode grounding.
   */
  async getPatientContextReadOnly(patientId: string): Promise<PatientContext> {
    console.log(`[SHADOW MODE] Fetching read-only context for patient: ${patientId}`);
    
    // In a real implementation, this would call a production API
    // For Phase N-03, we return the demo fixture to maintain stability 
    // while testing the shadow mode routing logic.
    return { ...DEMO_PATIENT_CONTEXT, patientId };
  },

  /**
   * Retrieves live patient timeline in read-only mode.
   */
  async getPatientTimelineReadOnly(patientId: string): Promise<PatientTimeline> {
    console.log(`[SHADOW MODE] Fetching read-only timeline for patient: ${patientId}`);
    
    // In a real implementation, this would call a production API
    return { ...DEMO_PATIENT_TIMELINE, patientId };
  }
};

/**
 * PROHIBITED MUTATION PATHS
 * These are explicitly defined to prevent accidental usage.
 */
export const mutatePatientData = () => {
  throw new Error("[SECURITY VIOLATION] Mutation attempted in SHADOW MODE. All writes are blocked by design.");
};
