/**
 * Domain Layer Types: Clinical Documentation Agent
 */

export type DocumentationType =
  | 'ENCOUNTER_NOTE'
  | 'SOAP_NOTE'
  | 'CONSULT_NOTE'
  | 'DISCHARGE_SUMMARY'
  | 'PROCEDURE_OPERATIVE_NOTE'
  | 'NURSING_ALLIED_HEALTH_NOTE'
  | 'DIAGNOSTIC_NARRATIVE'
  | 'CARE_COORDINATION_COMMUNICATION'
  | 'ADMINISTRATIVE_NARRATIVE'
  | 'EXTERNAL_DOCUMENT_DERIVATIVE'
  | 'AMENDMENT_ADDENDUM_CORRECTION';

export type DraftStatus = 
  | 'DRAFT' 
  | 'NEEDS_REVIEW' 
  | 'READY_FOR_SIGNOFF'; // Proposal-only; no signing action

export type SourceAttribution = 'AI_PROPOSED' | 'HUMAN_EDITED' | 'HUMAN_AUTHORED';

export interface NoteSection {
  sectionId: string;
  title: string;
  content: string;
  sourceAttribution: SourceAttribution;
}

export interface ChartEvidenceReference {
  type: 'CHART';
  id: string;
  timestamp: string;
  sourceRecordPointer: string;
}

export interface ExternalKnowledgeReference {
  type: 'EXTERNAL';
  guidelineSource: string;
  versionDate?: string;
  citation: string;
}

export type EvidenceReference = ChartEvidenceReference | ExternalKnowledgeReference;

export interface ProvenanceMetadata {
  model?: {
    provider: string;
    name: string;
    version: string;
  };
  promptVersion?: string;
  retrievalSources?: string[];
  validationOutcomes?: Record<string, any>;
  timestamp: string;
}

export interface DraftVersion {
  versionId: string;
  draftId: string;
  versionNumber: number;
  createdBy: string; // Human actor ID
  createdAt: string;
  content: {
    sections: NoteSection[];
  };
  evidenceReferences: EvidenceReference[];
  provenance?: ProvenanceMetadata;
  diffBaseVersionId?: string;
  isDiscarded: boolean;
}

export interface ClinicalNoteDraft {
  draftId: string;
  patientId: string;
  encounterId?: string;
  authoringProviderId: string;
  documentationType: DocumentationType;
  status: DraftStatus;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
  isDraftOnly: true; // Hard constraint
}

export type AmendmentType = 'ADDENDUM' | 'CORRECTION' | 'AMENDMENT' | 'RETRACTION_NOTE';

export interface Amendment {
  amendmentId: string;
  draftId: string;
  targetsVersionId: string;
  type: AmendmentType;
  reason: string;
  text: string;
  createdBy: string;
  createdAt: string;
}

export interface AttestationProposal {
  proposalId: string;
  draftId: string;
  proposedBy: string;
  proposedAt: string;
  attestationPreviewText: string;
  requiredChecks: {
    checkName: string;
    passed: boolean;
    message?: string;
  }[];
}

export const DRAFT_LABELS = {
  STATUS: 'DRAFT ONLY (AI-assisted)',
  DISCLAIMER: 'Not signed. Not a legal medical record.',
  HITL_REQUIRED: 'Requires clinician review and editing before any use.',
} as const;
