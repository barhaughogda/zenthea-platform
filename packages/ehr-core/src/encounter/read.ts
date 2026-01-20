/**
 * Encounter Read Model - Phase F.2 Slice 3
 *
 * Read-only derived views of Encounter data.
 *
 * INVARIANTS (from Phase F-00, F-01, F-02):
 * - Read models MUST be derived and MUST NOT be used as a write path
 * - Read models MUST NOT accept AuthorityContext
 * - Read models MUST NOT mutate anything
 * - Returns frozen, read-only views
 */

import type { EncounterRepository } from "./repository.js";
import type { EncounterReadView, EncounterRecord } from "./types.js";

/**
 * Encounter Read Model - provides derived, non-authoritative views.
 */
export class EncounterReadModel {
  private readonly repository: EncounterRepository;

  constructor(repository: EncounterRepository) {
    this.repository = repository;
  }

  /**
   * Get an encounter read view by ID.
   */
  getEncounter(tenantId: string, encounterId: string): EncounterReadView | undefined {
    const record = this.repository.findById(tenantId, encounterId);
    if (!record) {
      return undefined;
    }
    return this.toReadView(record);
  }

  /**
   * List all encounters in a tenant as read views.
   */
  listEncounters(tenantId: string): ReadonlyArray<EncounterReadView> {
    const records = this.repository.listByTenant(tenantId);
    return Object.freeze(records.map((r) => this.toReadView(r)));
  }

  /**
   * Convert an encounter record to a read view.
   */
  private toReadView(record: EncounterRecord): EncounterReadView {
    return Object.freeze({
      encounterId: record.encounterId,
      tenantId: record.tenantId,
      patientId: record.patientId,
      practitionerId: record.practitionerId,
      status: record.status,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      startedAt: record.startedAt,
      endedAt: record.endedAt,
    });
  }
}
