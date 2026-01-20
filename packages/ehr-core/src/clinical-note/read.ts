/**
 * Clinical Note Read Model - Phase F.2 Slice 4
 *
 * Read operations for Clinical Note domain.
 * Returns non-authoritative, frozen ReadView objects.
 * No AuthorityContext parameter (read-only).
 */

import type { ClinicalNoteRepository } from "./repository.js";
import type { ClinicalNoteReadView } from "./types.js";

/**
 * Clinical Note Read Model - enforces tenant and encounter scoping.
 */
export class ClinicalNoteReadModel {
  constructor(private readonly repository: ClinicalNoteRepository) {}

  /**
   * Get a clinical note by ID.
   * Scoped to tenant.
   */
  getNote(tenantId: string, clinicalNoteId: string): ClinicalNoteReadView | null {
    const record = this.repository.findById(tenantId, clinicalNoteId);
    if (!record) {
      return null;
    }
    // Record is already frozen by repository
    return record;
  }

  /**
   * List all notes for an encounter.
   * Scoped to tenant and encounter.
   */
  getNotesForEncounter(
    tenantId: string,
    encounterId: string
  ): readonly ClinicalNoteReadView[] {
    const records = this.repository.findByEncounter(tenantId, encounterId);
    // Return frozen array of frozen objects
    return Object.freeze([...records]);
  }
}
