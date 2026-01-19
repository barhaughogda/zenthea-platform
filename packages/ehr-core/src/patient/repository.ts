/**
 * Patient Repository - Phase F.2 Slice 1
 *
 * Internal in-memory stub repository for Patient storage.
 * This is NOT connected to any external persistence (no AWS, no databases).
 *
 * INVARIANTS:
 * - Repository interface MUST be internal and deny-by-default for writes
 * - Repository MUST NOT be exposed to external consumers
 */

import type { PatientRecord } from "./types.js";

/**
 * Internal repository interface for Patient storage.
 * This interface is internal to ehr-core and not exported publicly.
 */
export interface PatientRepository {
  /**
   * Find a patient by ID within a tenant.
   */
  findById(tenantId: string, patientId: string): PatientRecord | undefined;

  /**
   * Find a patient by MRN within a tenant.
   */
  findByMrn(tenantId: string, mrn: string): PatientRecord | undefined;

  /**
   * List all patients within a tenant (for read model derivation).
   */
  listByTenant(tenantId: string): ReadonlyArray<PatientRecord>;

  /**
   * Save a patient record. Internal use only - writes go through write model.
   * @internal
   */
  save(record: PatientRecord): void;
}

/**
 * In-memory implementation of PatientRepository.
 * Used for testing and development only - no external persistence binding.
 */
export class InMemoryPatientRepository implements PatientRepository {
  private readonly records: Map<string, PatientRecord> = new Map();

  findById(tenantId: string, patientId: string): PatientRecord | undefined {
    const record = this.records.get(patientId);
    if (record && record.tenantId === tenantId) {
      return record;
    }
    return undefined;
  }

  findByMrn(tenantId: string, mrn: string): PatientRecord | undefined {
    for (const record of this.records.values()) {
      if (record.tenantId === tenantId && record.mrn === mrn) {
        return record;
      }
    }
    return undefined;
  }

  listByTenant(tenantId: string): ReadonlyArray<PatientRecord> {
    const results: PatientRecord[] = [];
    for (const record of this.records.values()) {
      if (record.tenantId === tenantId) {
        results.push(record);
      }
    }
    return results;
  }

  save(record: PatientRecord): void {
    this.records.set(record.id, record);
  }

  /**
   * Clear all records. For testing only.
   * @internal
   */
  clear(): void {
    this.records.clear();
  }
}
