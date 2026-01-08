import { 
  ClinicalNoteDraft, 
  DraftVersion, 
  NoteSection, 
  EvidenceReference, 
  ProvenanceMetadata,
  DraftStatus,
  DocumentationType
} from './types';

/**
 * Creates a new draft version.
 * Ensures immutability and monotonic version numbers.
 */
export function createNewVersion(
  draft: ClinicalNoteDraft,
  prevVersion: DraftVersion | null,
  createdBy: string,
  sections: NoteSection[],
  evidenceReferences: EvidenceReference[],
  provenance?: ProvenanceMetadata
): DraftVersion {
  const versionNumber = prevVersion ? prevVersion.versionNumber + 1 : 1;
  const versionId = `v_${draft.draftId}_${versionNumber}`;
  
  return {
    versionId,
    draftId: draft.draftId,
    versionNumber,
    createdBy,
    createdAt: new Date().toISOString(),
    content: { sections },
    evidenceReferences,
    provenance,
    isDiscarded: false,
    diffBaseVersionId: prevVersion?.versionId,
  };
}

/**
 * Creates a new clinical note draft shell.
 */
export function createDraftShell(
  params: {
    draftId: string;
    patientId: string;
    providerId: string;
    documentationType: DocumentationType;
    encounterId?: string;
  }
): ClinicalNoteDraft {
  const now = new Date().toISOString();
  return {
    draftId: params.draftId,
    patientId: params.patientId,
    encounterId: params.encounterId,
    authoringProviderId: params.providerId,
    documentationType: params.documentationType,
    status: 'DRAFT',
    currentVersionId: '', // Will be set after first version creation
    createdAt: now,
    updatedAt: now,
    isDraftOnly: true,
  };
}

/**
 * Marks a version as discarded.
 */
export function discardVersion(version: DraftVersion): DraftVersion {
  return {
    ...version,
    isDiscarded: true,
  };
}

/**
 * Transitions draft status within allowed draft-only states.
 */
export function transitionStatus(
  draft: ClinicalNoteDraft,
  newStatus: DraftStatus
): ClinicalNoteDraft {
  // Guard against forbidden states is handled by type system, 
  // but we enforce logical transitions if needed here.
  return {
    ...draft,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };
}
