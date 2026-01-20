/**
 * PostgreSQL Clinical Note Repository Adapter
 *
 * Phase G.3 - PostgreSQL Persistence Adapter Implementation
 *
 * Implements ClinicalNoteRepository class interface from ehr-core using raw SQL.
 *
 * INVARIANTS:
 * - All queries include tenant_id filtering
 * - No SELECT * - explicit column lists only
 * - Prepared statements for all queries
 * - Returned records are frozen (immutable)
 * - Not found returns null
 * - Finalized notes are immutable (status check on update)
 */

import type { Pool } from "pg";
import type {
  ClinicalNoteRecord,
  ClinicalNoteStatus,
} from "@zenthea/ehr-core";
import { mapPostgresError, type PersistenceError } from "../types.js";

/**
 * Row shape from the clinical_notes table.
 */
interface ClinicalNoteRow {
  id: string;
  tenant_id: string;
  encounter_id: string;
  patient_id: string;
  author_id: string;
  note_type: string;
  content_raw: string;
  status: string;
  signed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Valid clinical note status values.
 */
const VALID_STATUSES: Set<ClinicalNoteStatus> = new Set(["draft", "finalized"]);

/**
 * Maps DB status to domain status.
 * G.1 uses 'final'/'amended', domain uses 'finalized'.
 */
function toClinicalNoteStatus(dbStatus: string): ClinicalNoteStatus {
  if (dbStatus === "final" || dbStatus === "amended") {
    return "finalized";
  }
  if (VALID_STATUSES.has(dbStatus as ClinicalNoteStatus)) {
    return dbStatus as ClinicalNoteStatus;
  }
  return "draft";
}

/**
 * Maps domain status to DB status.
 */
function toDbStatus(domainStatus: ClinicalNoteStatus): string {
  if (domainStatus === "finalized") {
    return "final";
  }
  return domainStatus;
}

/**
 * Maps a database row to a domain ClinicalNoteRecord.
 * Ensures the returned object is frozen.
 */
function rowToClinicalNoteRecord(row: ClinicalNoteRow): ClinicalNoteRecord {
  const record: ClinicalNoteRecord = {
    clinicalNoteId: row.id,
    tenantId: row.tenant_id,
    encounterId: row.encounter_id,
    patientId: row.patient_id,
    practitionerId: row.author_id,
    status: toClinicalNoteStatus(row.status),
    content: row.content_raw,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    ...(row.signed_at && { finalizedAt: row.signed_at.toISOString() }),
  };

  return Object.freeze(record);
}

/**
 * PostgreSQL implementation of ClinicalNoteRepository.
 *
 * Note: The ehr-core ClinicalNoteRepository is a class, not an interface.
 * This adapter provides the same method signatures with async implementations.
 */
export class PostgresClinicalNoteRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Save a clinical note record.
   * Records are frozen before storage to ensure immutability.
   */
  save(record: ClinicalNoteRecord): void {
    throw new Error("Synchronous save not supported. Use saveAsync instead.");
  }

  /**
   * Async implementation of save.
   * Uses upsert for idempotency.
   * Will not update finalized notes (returns error).
   */
  async saveAsync(
    record: ClinicalNoteRecord
  ): Promise<{ success: true } | { success: false; error: PersistenceError }> {
    // Check if note exists and is finalized (immutable)
    const existingNote = await this.findByIdAsync(
      record.tenantId,
      record.clinicalNoteId
    );
    if (existingNote && existingNote.status === "finalized") {
      return {
        success: false,
        error: {
          code: "CONSTRAINT_VIOLATION",
          message: "Cannot modify a finalized clinical note",
        },
      };
    }

    const sql = `
      INSERT INTO clinical_notes (
        id,
        tenant_id,
        encounter_id,
        patient_id,
        author_id,
        note_type,
        content_raw,
        status,
        signed_at,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        content_raw = EXCLUDED.content_raw,
        status = EXCLUDED.status,
        signed_at = EXCLUDED.signed_at,
        updated_at = EXCLUDED.updated_at
    `;

    try {
      await this.pool.query(sql, [
        record.clinicalNoteId,
        record.tenantId,
        record.encounterId,
        record.patientId,
        record.practitionerId,
        "progress-note", // Default note_type for domain compatibility
        record.content,
        toDbStatus(record.status),
        record.finalizedAt ?? null,
        record.createdAt,
        record.updatedAt,
      ]);

      return { success: true };
    } catch (error) {
      const pgError = error as {
        code?: string;
        constraint?: string;
        message?: string;
        detail?: string;
      };
      return { success: false, error: mapPostgresError(pgError) };
    }
  }

  /**
   * Find a clinical note by ID, scoped to a tenant.
   * Returns null if not found or tenant mismatch.
   */
  findById(tenantId: string, clinicalNoteId: string): ClinicalNoteRecord | null {
    throw new Error(
      "Synchronous findById not supported. Use findByIdAsync instead."
    );
  }

  /**
   * Async implementation of findById.
   */
  async findByIdAsync(
    tenantId: string,
    clinicalNoteId: string
  ): Promise<ClinicalNoteRecord | null> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        encounter_id,
        patient_id,
        author_id,
        note_type,
        content_raw,
        status,
        signed_at,
        created_at,
        updated_at
      FROM clinical_notes
      WHERE tenant_id = $1 AND id = $2
    `;

    try {
      const result = await this.pool.query<ClinicalNoteRow>(sql, [
        tenantId,
        clinicalNoteId,
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      if (!row) {
        return null;
      }
      return rowToClinicalNoteRecord(row);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all clinical notes for an encounter within a tenant.
   */
  findByEncounter(
    tenantId: string,
    encounterId: string
  ): ClinicalNoteRecord[] {
    throw new Error(
      "Synchronous findByEncounter not supported. Use findByEncounterAsync instead."
    );
  }

  /**
   * Async implementation of findByEncounter.
   */
  async findByEncounterAsync(
    tenantId: string,
    encounterId: string
  ): Promise<ClinicalNoteRecord[]> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        encounter_id,
        patient_id,
        author_id,
        note_type,
        content_raw,
        status,
        signed_at,
        created_at,
        updated_at
      FROM clinical_notes
      WHERE tenant_id = $1 AND encounter_id = $2
      ORDER BY created_at DESC
    `;

    try {
      const result = await this.pool.query<ClinicalNoteRow>(sql, [
        tenantId,
        encounterId,
      ]);
      return result.rows.map(rowToClinicalNoteRecord);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find all clinical notes for a patient within a tenant.
   */
  async findByPatientAsync(
    tenantId: string,
    patientId: string
  ): Promise<ClinicalNoteRecord[]> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        encounter_id,
        patient_id,
        author_id,
        note_type,
        content_raw,
        status,
        signed_at,
        created_at,
        updated_at
      FROM clinical_notes
      WHERE tenant_id = $1 AND patient_id = $2
      ORDER BY created_at DESC
    `;

    try {
      const result = await this.pool.query<ClinicalNoteRow>(sql, [
        tenantId,
        patientId,
      ]);
      return result.rows.map(rowToClinicalNoteRecord);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Internal helper to get all records (for testing).
   */
  async _allAsync(tenantId: string): Promise<ClinicalNoteRecord[]> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        encounter_id,
        patient_id,
        author_id,
        note_type,
        content_raw,
        status,
        signed_at,
        created_at,
        updated_at
      FROM clinical_notes
      WHERE tenant_id = $1
      ORDER BY created_at DESC
    `;

    try {
      const result = await this.pool.query<ClinicalNoteRow>(sql, [tenantId]);
      return result.rows.map(rowToClinicalNoteRecord);
    } catch (error) {
      throw error;
    }
  }
}
