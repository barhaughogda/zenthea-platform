import { 
  ClinicalNoteDraft, 
  DraftVersion, 
  Amendment, 
  AttestationProposal 
} from '../domain/types';

/**
 * Data Layer: Clinical Documentation Agent
 * 
 * Responsibilities:
 * - Repository interfaces for storing and retrieving drafts and versions 
 *   within the draft workspace.
 * - Storage-agnostic contracts.
 * - Explicit boundaries around metadata-only audit storage.
 * 
 * FORBIDDEN:
 * - Concrete database implementations in Phase 3.
 * - Any schema additions implying finalization (isSigned, etc.).
 * - Any deletion of history.
 */

export interface IDraftRepository {
  /**
   * Creates a new draft shell.
   */
  createDraft(draft: ClinicalNoteDraft): Promise<void>;

  /**
   * Retrieves a draft metadata by ID.
   */
  getDraft(draftId: string): Promise<ClinicalNoteDraft | null>;

  /**
   * Adds a new version to a draft.
   */
  saveVersion(version: DraftVersion): Promise<void>;

  /**
   * Retrieves a specific version by ID.
   */
  getVersion(versionId: string): Promise<DraftVersion | null>;

  /**
   * Retrieves all versions for a draft.
   */
  getVersionHistory(draftId: string): Promise<DraftVersion[]>;

  /**
   * Saves an amendment/addendum.
   */
  saveAmendment(amendment: Amendment): Promise<void>;

  /**
   * Retrieves amendments for a draft.
   */
  getAmendments(draftId: string): Promise<Amendment[]>;

  /**
   * Saves an attestation proposal (ready for signoff state).
   */
  saveAttestationProposal(proposal: AttestationProposal): Promise<void>;

  /**
   * Lists drafts for a patient.
   */
  listDraftsByPatient(patientId: string): Promise<ClinicalNoteDraft[]>;
}

export type AuditEventType = 
  | 'CREATE_DRAFT' 
  | 'UPDATE_DRAFT' 
  | 'VIEW_DRAFT' 
  | 'DISCARD_DRAFT';

export interface IAuditSink {
  /**
   * Emits a metadata-only audit event.
   * Payloads must not contain raw clinical content unless explicitly approved.
   */
  emitEvent(event: {
    eventType: AuditEventType;
    actorId: string;
    role: string;
    tenantId: string;
    patientId: string;
    encounterId?: string;
    draftId?: string;
    versionId?: string;
    metadata: Record<string, any>;
    timestamp: string;
    correlationId: string;
  }): Promise<void>;
}
