/**
 * Types for the Pilot Persistence Adapter.
 * Strictly limited to the Mock Consultation Loop events.
 */

export interface SessionMetadata {
  sessionId: string;
  providerId: string;
  mockPatientId: string;
  timestamp: Date;
}

export interface DraftMetadata {
  draftId: string;
  labels: string[]; // e.g., ["AI Suggested", "Draft"]
  authorId: string;
}

export interface FinalizedNoteMetadata {
  noteId: string;
  authorId: string;
  signedAt: Date;
}

export interface PersistenceResult {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * The Pilot Persistence Adapter interface.
 * All write methods MUST be human-gated and checked against a kill switch.
 */
export interface IPilotPersistenceAdapter {
  /**
   * Records that a session has started. Metadata only.
   * @param signal Explicit human action signal.
   * @param metadata Session metadata.
   */
  recordSessionStarted(
    signal: "HUMAN_CONFIRMED_START",
    metadata: SessionMetadata
  ): Promise<PersistenceResult>;

  /**
   * Records that a draft has been generated.
   * @param signal Explicit human action signal.
   * @param metadata Draft metadata.
   */
  recordDraftGenerated(
    signal: "HUMAN_CONFIRMED_END_SESSION",
    metadata: DraftMetadata
  ): Promise<PersistenceResult>;

  /**
   * Records a finalized clinical note.
   * @param signal Explicit human action signal.
   * @param metadata Finalized note metadata.
   */
  recordFinalizedNote(
    signal: "HUMAN_SIGNED_FINALIZE",
    metadata: FinalizedNoteMetadata
  ): Promise<PersistenceResult>;
}
