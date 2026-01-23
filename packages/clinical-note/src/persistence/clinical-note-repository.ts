/**
 * Clinical Note Repository - Slice 01
 *
 * Layer 4: Persistence Boundary for Clinical Note Lifecycle.
 *
 * INVARIANTS:
 * - Persistence is immutable and synchronous.
 * - All writes are append-only.
 * - No updates to existing records.
 */

import { randomUUID } from "node:crypto";

/**
 * Persistence failure error.
 * Thrown when a write operation fails.
 */
export class PersistenceFailureError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "PersistenceFailureError";
  }
}

/**
 * Authorized Data Model (Minimal) - ClinicalNoteDraft
 */
export interface ClinicalNoteDraftRecord {
  noteId: string; // PK
  tenantId: string;
  encounterId: string;
  patientId: string;
  practitionerId: string;
  status: "DRAFT";
  createdAt: string;
}

/**
 * Authorized Data Model (Minimal) - DraftVersion
 */
export interface DraftVersionRecord {
  versionId: string; // PK
  noteId: string; // FK
  versionNumber: number;
  content: string;
  createdAt: string;
}

/**
 * Clinical Note Repository Abstraction.
 *
 * In this phase, we use an in-memory implementation to satisfy the
 * "synchronous and immutable" requirement without external dependencies.
 */
export class ClinicalNoteRepository {
  private readonly notes = new Map<string, ClinicalNoteDraftRecord>();
  private readonly versions = new Map<string, DraftVersionRecord[]>();

  /**
   * Persists a new clinical note draft and its initial version.
   *
   * @param draft - The clinical note draft record to persist.
   * @param content - The initial content for the draft version.
   * @throws PersistenceFailureError if persistence fails.
   */
  async saveNewDraft(
    draft: ClinicalNoteDraftRecord,
    content: string,
  ): Promise<void> {
    try {
      // 1. Check for existing note (immutability guarantee)
      if (this.notes.has(draft.noteId)) {
        throw new Error(`Clinical note ${draft.noteId} already exists`);
      }

      // 2. Persist ClinicalNoteDraft (root record)
      this.notes.set(draft.noteId, { ...draft });

      // 3. Persist DraftVersion (immutable append-only)
      const version: DraftVersionRecord = {
        versionId: `ver_${randomUUID()}`,
        noteId: draft.noteId,
        versionNumber: 1,
        content,
        createdAt: draft.createdAt,
      };

      if (!this.versions.has(draft.noteId)) {
        this.versions.set(draft.noteId, []);
      }
      this.versions.get(draft.noteId)!.push(version);
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        throw new PersistenceFailureError(error.message);
      }
      throw new PersistenceFailureError(
        "Failed to persist clinical note draft",
        error,
      );
    }
  }

  /**
   * Retrieves a clinical note draft by ID.
   *
   * @param noteId - The ID of the clinical note to retrieve.
   * @returns The clinical note draft record and its latest version, or null if not found.
   */
  async findById(
    noteId: string,
  ): Promise<{
    note: ClinicalNoteDraftRecord;
    latestVersion: DraftVersionRecord;
  } | null> {
    const note = this.notes.get(noteId);
    if (!note) return null;

    const versions = this.versions.get(noteId);
    if (!versions || versions.length === 0) return null;

    // Latest version is the last one in the append-only list
    const latestVersion = versions[versions.length - 1];
    return { note, latestVersion };
  }

  /**
   * Persists a new version of an existing clinical note draft.
   *
   * @param noteId - The ID of the clinical note.
   * @param content - The new content for the draft version.
   * @param createdAt - The timestamp for the new version.
   * @returns The new version record.
   * @throws PersistenceFailureError if persistence fails.
   */
  async saveNewVersion(
    noteId: string,
    content: string,
    createdAt: string,
  ): Promise<DraftVersionRecord> {
    try {
      const versions = this.versions.get(noteId);
      if (!versions) {
        throw new Error(`Clinical note ${noteId} not found`);
      }

      const nextVersionNumber = versions.length + 1;
      const version: DraftVersionRecord = {
        versionId: `ver_${randomUUID()}`,
        noteId,
        versionNumber: nextVersionNumber,
        content,
        createdAt,
      };

      versions.push(version);
      return version;
    } catch (error) {
      throw new PersistenceFailureError(
        "Failed to persist new clinical note version",
        error,
      );
    }
  }
}
