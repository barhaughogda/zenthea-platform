/**
 * Patient Read Model - Phase F.2 Slice 1
 *
 * Read-only derived views of Patient data.
 *
 * INVARIANTS (from Phase F-00, F-01, F-02):
 * - Read models MUST be derived and MUST NOT be used as a write path
 * - Read models MUST NOT accept AuthorityContext (reads don't require authority)
 * - Read models MUST NOT mutate anything
 * - Read models MUST be safe-by-default
 * - Read surfaces MUST NOT imply write capability
 */

import type { PatientRepository } from "./repository.js";
import type { PatientReadView, PatientRecord } from "./types.js";

/**
 * Patient Read Model - provides derived, non-authoritative views.
 *
 * This model:
 * - Does NOT accept AuthorityContext (reads are separate from writes)
 * - Does NOT mutate any data
 * - Returns frozen, read-only views
 * - Is NOT authoritative - cannot be used for write operations
 */
export class PatientReadModel {
  private readonly repository: PatientRepository;

  constructor(repository: PatientRepository) {
    this.repository = repository;
  }

  /**
   * Get a patient read view by ID.
   *
   * NOTE: This is a read-only view. It cannot be used to modify the patient.
   */
  getPatient(tenantId: string, patientId: string): PatientReadView | undefined {
    const record = this.repository.findById(tenantId, patientId);
    if (!record) {
      return undefined;
    }
    return this.toReadView(record);
  }

  /**
   * Get a patient read view by MRN.
   *
   * NOTE: This is a read-only view. It cannot be used to modify the patient.
   */
  getPatientByMrn(tenantId: string, mrn: string): PatientReadView | undefined {
    const record = this.repository.findByMrn(tenantId, mrn);
    if (!record) {
      return undefined;
    }
    return this.toReadView(record);
  }

  /**
   * List all patients in a tenant as read views.
   *
   * NOTE: These are read-only views. They cannot be used to modify patients.
   */
  listPatients(tenantId: string): ReadonlyArray<PatientReadView> {
    const records = this.repository.listByTenant(tenantId);
    return Object.freeze(records.map((r) => this.toReadView(r)));
  }

  /**
   * Convert a patient record to a read view.
   *
   * The read view is a derived, safe-by-default projection that:
   * - Contains only what's needed for display/selection
   * - Is frozen and immutable
   * - Cannot be used for writes
   */
  private toReadView(record: PatientRecord): PatientReadView {
    return Object.freeze({
      id: record.id,
      tenantId: record.tenantId,
      mrn: record.mrn,
      displayName: `${record.demographics.givenName} ${record.demographics.familyName}`,
      dateOfBirth: record.demographics.dateOfBirth,
    });
  }
}
