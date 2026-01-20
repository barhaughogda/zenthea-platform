/**
 * PostgreSQL Patient Repository Adapter
 *
 * Phase G.3 - PostgreSQL Persistence Adapter Implementation
 *
 * Implements PatientRepository interface from ehr-core using raw SQL.
 *
 * INVARIANTS:
 * - All queries include tenant_id filtering
 * - No SELECT * - explicit column lists only
 * - Prepared statements for all queries
 * - Returned records are frozen (immutable)
 * - Not found returns undefined
 * - Constraint violations return structured errors
 */

import type { Pool } from "pg";
import type {
  PatientRecord,
  PatientDemographics,
  PatientRepository,
} from "@zenthea/ehr-core";
import { mapPostgresError, type PersistenceError } from "../types.js";

/**
 * Row shape from the patients table.
 * Used for type-safe query results.
 */
interface PatientRow {
  id: string;
  tenant_id: string;
  external_id: string | null;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  gender: string | null;
  email: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
  last_modified_by: string;
}

/**
 * Maps a database row to a domain PatientRecord.
 * Ensures the returned object is frozen.
 */
function rowToPatientRecord(row: PatientRow): PatientRecord {
  const demographics: PatientDemographics = Object.freeze({
    givenName: row.first_name,
    familyName: row.last_name,
    dateOfBirth: row.date_of_birth.toISOString().split("T")[0] ?? "",
  });

  return Object.freeze({
    id: row.id,
    tenantId: row.tenant_id,
    mrn: row.external_id ?? "",
    demographics,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    lastModifiedBy: row.last_modified_by,
  });
}

/**
 * PostgreSQL implementation of PatientRepository.
 *
 * Usage:
 * ```typescript
 * const repo = new PostgresPatientRepository(pool);
 * const patient = repo.findById(tenantId, patientId);
 * ```
 */
export class PostgresPatientRepository implements PatientRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Find a patient by ID within a tenant.
   * Returns undefined if not found or tenant mismatch.
   */
  findById(tenantId: string, patientId: string): PatientRecord | undefined {
    // Note: This is synchronous in the interface but we need async DB access.
    // This will be addressed in the async wrapper pattern.
    throw new Error(
      "Synchronous findById not supported. Use findByIdAsync instead."
    );
  }

  /**
   * Async implementation of findById.
   */
  async findByIdAsync(
    tenantId: string,
    patientId: string
  ): Promise<PatientRecord | null> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        external_id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        email,
        phone,
        created_at,
        updated_at,
        last_modified_by
      FROM patients
      WHERE tenant_id = $1 AND id = $2
    `;

    try {
      const result = await this.pool.query<PatientRow>(sql, [
        tenantId,
        patientId,
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      if (!row) {
        return null;
      }
      return rowToPatientRecord(row);
    } catch (error) {
      // Propagate as system error
      throw error;
    }
  }

  /**
   * Find a patient by MRN (external_id) within a tenant.
   * Returns undefined if not found.
   */
  findByMrn(tenantId: string, mrn: string): PatientRecord | undefined {
    throw new Error(
      "Synchronous findByMrn not supported. Use findByMrnAsync instead."
    );
  }

  /**
   * Async implementation of findByMrn.
   */
  async findByMrnAsync(
    tenantId: string,
    mrn: string
  ): Promise<PatientRecord | null> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        external_id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        email,
        phone,
        created_at,
        updated_at,
        last_modified_by
      FROM patients
      WHERE tenant_id = $1 AND external_id = $2
    `;

    try {
      const result = await this.pool.query<PatientRow>(sql, [tenantId, mrn]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      if (!row) {
        return null;
      }
      return rowToPatientRecord(row);
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all patients within a tenant.
   */
  listByTenant(tenantId: string): ReadonlyArray<PatientRecord> {
    throw new Error(
      "Synchronous listByTenant not supported. Use listByTenantAsync instead."
    );
  }

  /**
   * Async implementation of listByTenant.
   */
  async listByTenantAsync(tenantId: string): Promise<PatientRecord[]> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        external_id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        email,
        phone,
        created_at,
        updated_at,
        last_modified_by
      FROM patients
      WHERE tenant_id = $1
      ORDER BY last_name, first_name
    `;

    try {
      const result = await this.pool.query<PatientRow>(sql, [tenantId]);
      return result.rows.map(rowToPatientRecord);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save a patient record.
   * Uses upsert (INSERT ... ON CONFLICT) for idempotency.
   */
  save(record: PatientRecord): void {
    throw new Error("Synchronous save not supported. Use saveAsync instead.");
  }

  /**
   * Async implementation of save.
   * Returns structured error on constraint violations.
   */
  async saveAsync(
    record: PatientRecord
  ): Promise<{ success: true } | { success: false; error: PersistenceError }> {
    const sql = `
      INSERT INTO patients (
        id,
        tenant_id,
        external_id,
        first_name,
        last_name,
        date_of_birth,
        created_at,
        updated_at,
        last_modified_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        external_id = EXCLUDED.external_id,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        date_of_birth = EXCLUDED.date_of_birth,
        updated_at = EXCLUDED.updated_at,
        last_modified_by = EXCLUDED.last_modified_by
    `;

    try {
      await this.pool.query(sql, [
        record.id,
        record.tenantId,
        record.mrn || null,
        record.demographics.givenName,
        record.demographics.familyName,
        record.demographics.dateOfBirth,
        record.createdAt,
        record.updatedAt,
        record.lastModifiedBy,
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
}
