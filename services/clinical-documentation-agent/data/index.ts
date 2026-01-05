/**
 * Data Layer: Clinical Documentation Agent
 * 
 * Responsibilities:
 * - Persistence abstraction (Repository pattern).
 * - Draft storage and audit record management.
 * - SAFETY: Ensure immutability of audit logs and traceability of all drafts.
 */

import { ClinicalNoteDraft } from '../domain/index';

/**
 * Interface for storing and retrieving clinical documentation drafts.
 */
export interface IDraftRepository {
  /**
   * Saves a new draft. Drafts should be immutable once accepted or rejected;
   * revisions should create new records or versioned entries.
   */
  saveDraft(draft: ClinicalNoteDraft): Promise<string>;

  /**
   * Retrieves a draft by ID.
   */
  getDraft(draftId: string): Promise<ClinicalNoteDraft | null>;

  /**
   * Lists drafts for a specific patient/provider context.
   */
  listDrafts(patientId: string, providerId: string): Promise<ClinicalNoteDraft[]>;
}

/**
 * Interface for capturing audit records related to documentation activities.
 */
export interface IAuditRepository {
  /**
   * Logs a documentation event (e.g., draft created, draft revised).
   * Logs must be immutable and traceable to the provider and patient.
   */
  logEvent(event: {
    type: string;
    providerId: string;
    patientId: string;
    metadata: Record<string, any>;
    timestamp: Date;
  }): Promise<void>;
}

// TODO: Implement concrete repositories using the platform's database adapters
// TODO: Define data retention and encryption-at-rest policies
