/**
 * ClinicalQuestion represents a pure domain model for a clinician's query.
 * Domain logic must be deterministic and free of side effects.
 */
export interface ClinicalQuestion {
  id: string;
  text: string;
  category: 'DIFFERENTIAL_DIAGNOSIS' | 'TREATMENT_PLAN' | 'LAB_INTERPRETATION' | 'SUMMARIZATION';
  timestamp: Date;
}

/**
 * EvidenceReference represents a piece of medical evidence grounding a response.
 */
export interface EvidenceReference {
  sourceId: string;
  sourceType: 'GUIDELINE' | 'STUDY' | 'INTERNAL_RECORD';
  citation: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

/**
 * Domain-specific invariants and validation rules go here.
 * No AI, no IO, no database access.
 */
export const validateClinicalInvariants = (question: ClinicalQuestion): boolean => {
  // TODO: Implement deterministic validation rules.
  return true;
};

// TODO: Define structured domain entities and pure logic.
