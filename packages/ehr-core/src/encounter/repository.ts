/**
 * Encounter Repository - Phase F.2 Slice 3
 *
 * Internal in-memory stub repository for Encounter storage.
 *
 * INVARIANTS:
 * - Repository interface MUST be internal and deny-by-default for writes
 * - Repository MUST NOT be exposed to external consumers
 * - Cross-tenant access MUST be denied
 */

import type { EncounterRecord } from "./types.js";

/**
 * Internal repository interface for Encounter storage.
 * This interface is internal to ehr-core and not exported publicly.
 */
export interface EncounterRepository {
  /**
   * Find an encounter by ID within a tenant.
   */
  findById(tenantId: string, encounterId: string): EncounterRecord | undefined;

  /**
   * List all encounters within a tenant.
   */
  listByTenant(tenantId: string): ReadonlyArray<EncounterRecord>;

  /**
   * Save an encounter record. Internal use only.
   * @internal
   */
  save(record: EncounterRecord): void;
}

/**
 * In-memory implementation of EncounterRepository.
 */
export class InMemoryEncounterRepository implements EncounterRepository {
  private readonly records: Map<string, EncounterRecord> = new Map();

  findById(tenantId: string, encounterId: string): EncounterRecord | undefined {
    const record = this.records.get(encounterId);
    if (record && record.tenantId === tenantId) {
      return record;
    }
    return undefined;
  }

  listByTenant(tenantId: string): ReadonlyArray<EncounterRecord> {
    const results: EncounterRecord[] = [];
    for (const record of this.records.values()) {
      if (record.tenantId === tenantId) {
        results.push(record);
      }
    }
    return Object.freeze(results);
  }

  save(record: EncounterRecord): void {
    // Ensure record is frozen before storage
    this.records.set(record.encounterId, Object.freeze(record));
  }

  /**
   * Clear all records. For testing only.
   * @internal
   */
  clear(): void {
    this.records.clear();
  }
}
