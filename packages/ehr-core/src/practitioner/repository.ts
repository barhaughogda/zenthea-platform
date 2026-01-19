/**
 * Practitioner Repository - Phase F.2 Slice 2
 *
 * Internal in-memory repository for Practitioner records.
 * STRICTLY INTERNAL to ehr-core.
 */

import type { PractitionerRecord } from "./types.js";

/**
 * Internal repository interface for Practitioner storage.
 */
export interface PractitionerRepository {
  findById(tenantId: string, id: string): PractitionerRecord | undefined;
  save(record: PractitionerRecord): void;
  findAllByTenant(tenantId: string): PractitionerRecord[];
}

/**
 * In-memory implementation of PractitionerRepository.
 */
export class InMemoryPractitionerRepository implements PractitionerRepository {
  private readonly records = new Map<string, PractitionerRecord>();

  /**
   * Find a practitioner by ID and tenant ID.
   * Enforces tenant isolation.
   */
  findById(tenantId: string, id: string): PractitionerRecord | undefined {
    const record = this.records.get(id);
    if (record && record.tenantId === tenantId) {
      return record;
    }
    return undefined;
  }

  /**
   * Save or update a practitioner record.
   */
  save(record: PractitionerRecord): void {
    // Ensure record is frozen to preserve immutability
    this.records.set(record.id, Object.freeze({ ...record }));
  }

  /**
   * List all practitioners for a tenant.
   * Internal only, used by read model.
   */
  findAllByTenant(tenantId: string): PractitionerRecord[] {
    return Array.from(this.records.values())
      .filter((r) => r.tenantId === tenantId)
      .map((r) => Object.freeze({ ...r }));
  }
}
