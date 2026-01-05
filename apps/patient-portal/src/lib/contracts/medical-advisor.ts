/**
 * UI Contract for the Medical Advisor Agent integration.
 * 
 * Mandatory Constraints:
 * - Immutable UI contract (frozen in Step 3)
 * - Advisory only (non-authoritative)
 * - Read-only (no mutations)
 */
export interface MedicalAdvisory {
  id: string;
  advisoryText: string;
  evidenceReferences: Array<{
    sourceId: string;
    description: string;
    citation?: string;
  }>;
  metadata: {
    updatedAt: string;
    isDraft: boolean;
    isAdvisory: boolean;
    confidenceScore?: number;
  };
}

export interface MedicalAdvisorService {
  /**
   * Get the latest clinical advisory for a patient context.
   * Scoped to the current patient.
   */
  getAdvisory(patientId: string, query?: string): Promise<MedicalAdvisory | null>;
}
