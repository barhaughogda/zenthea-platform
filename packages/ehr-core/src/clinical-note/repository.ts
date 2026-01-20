/**
 * Clinical Note Repository - Phase F.2 Slice 4
 *
 * In-memory storage for Clinical Note records.
 * Enforces tenant and encounter isolation.
 */

import type { ClinicalNoteRecord } from "./types.js";

/**
 * Repository for Clinical Note records.
 * Uses an in-memory Map for storage (no persistence beyond memory).
 */
export class ClinicalNoteRepository {
  // Map of clinicalNoteId -> ClinicalNoteRecord
  private readonly records = new Map<string, ClinicalNoteRecord>();

  /**
   * Save a record to the repository.
   * Records are frozen before storage to ensure immutability.
   */
  save(record: ClinicalNoteRecord): void {
    // Defense in depth: ensure the record is frozen
    const frozenRecord = Object.isFrozen(record) ? record : Object.freeze({ ...record });
    this.records.set(frozenRecord.clinicalNoteId, frozenRecord);
  }

  /**
   * Find a record by its ID, scoped to a tenant.
   */
  findById(tenantId: string, clinicalNoteId: string): ClinicalNoteRecord | null {
    const record = this.records.get(clinicalNoteId);
    if (!record || record.tenantId !== tenantId) {
      return null;
    }
    return record;
  }

  /**
   * Find all records for an encounter within a tenant.
   */
  findByEncounter(tenantId: string, encounterId: string): ClinicalNoteRecord[] {
    return Array.from(this.records.values())
      .filter((r) => r.tenantId === tenantId && r.encounterId === encounterId)
      .map((r) => Object.freeze({ ...r }));
  }

  /**
   * Internal helper to get all records (for testing).
   */
  _all(): ClinicalNoteRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Internal helper to clear repository (for testing).
   */
  _clear(): void {
    this.records.clear();
  }
}
