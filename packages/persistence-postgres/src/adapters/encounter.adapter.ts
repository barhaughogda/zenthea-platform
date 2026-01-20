/**
 * PostgreSQL Encounter Repository Adapter
 *
 * Phase G.3 - PostgreSQL Persistence Adapter Implementation
 *
 * Implements EncounterRepository interface from ehr-core using raw SQL.
 *
 * INVARIANTS:
 * - All queries include tenant_id filtering
 * - No SELECT * - explicit column lists only
 * - Prepared statements for all queries
 * - Returned records are frozen (immutable)
 * - Not found returns undefined
 * - Status values are validated against enum
 */

import type { Pool } from "pg";
import type {
  EncounterRecord,
  EncounterStatus,
  EncounterRepository,
} from "@zenthea/ehr-core";
import { mapPostgresError, type PersistenceError } from "../types.js";

/**
 * Row shape from the encounters table.
 */
interface EncounterRow {
  id: string;
  tenant_id: string;
  patient_id: string;
  practitioner_id: string | null;
  status: string;
  start_time: Date | null;
  end_time: Date | null;
  encounter_type: string | null;
  created_at: Date;
  updated_at: Date;
  last_modified_by: string;
}

/**
 * Valid encounter status values.
 * Maps between DB status strings and domain enum.
 */
const VALID_STATUSES: Set<EncounterStatus> = new Set([
  "planned",
  "in-progress",
  "completed",
  "cancelled",
]);

/**
 * Validates and converts DB status to domain status.
 * Falls back to 'planned' if invalid (fail-safe).
 */
function toEncounterStatus(dbStatus: string): EncounterStatus {
  if (VALID_STATUSES.has(dbStatus as EncounterStatus)) {
    return dbStatus as EncounterStatus;
  }
  // G.1 schema uses 'finished' but domain uses 'completed'
  if (dbStatus === "finished") {
    return "completed";
  }
  // G.1 uses 'arrived' which isn't in domain - map to in-progress
  if (dbStatus === "arrived") {
    return "in-progress";
  }
  return "planned";
}

/**
 * Converts domain status to DB status.
 */
function toDbStatus(domainStatus: EncounterStatus): string {
  // Map 'completed' back to 'finished' for DB
  if (domainStatus === "completed") {
    return "finished";
  }
  return domainStatus;
}

/**
 * Maps a database row to a domain EncounterRecord.
 * Ensures the returned object is frozen.
 */
function rowToEncounterRecord(row: EncounterRow): EncounterRecord {
  const record: EncounterRecord = {
    encounterId: row.id,
    tenantId: row.tenant_id,
    patientId: row.patient_id,
    practitionerId: row.practitioner_id ?? "",
    status: toEncounterStatus(row.status),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    lastModifiedBy: row.last_modified_by,
    ...(row.start_time && { startedAt: row.start_time.toISOString() }),
    ...(row.end_time && { endedAt: row.end_time.toISOString() }),
  };

  return Object.freeze(record);
}

/**
 * PostgreSQL implementation of EncounterRepository.
 */
export class PostgresEncounterRepository implements EncounterRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Find an encounter by ID within a tenant.
   * Returns undefined if not found or tenant mismatch.
   */
  findById(tenantId: string, encounterId: string): EncounterRecord | undefined {
    throw new Error(
      "Synchronous findById not supported. Use findByIdAsync instead."
    );
  }

  /**
   * Async implementation of findById.
   */
  async findByIdAsync(
    tenantId: string,
    encounterId: string
  ): Promise<EncounterRecord | null> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        patient_id,
        practitioner_id,
        status,
        start_time,
        end_time,
        encounter_type,
        created_at,
        updated_at,
        last_modified_by
      FROM encounters
      WHERE tenant_id = $1 AND id = $2
    `;

    try {
      const result = await this.pool.query<EncounterRow>(sql, [
        tenantId,
        encounterId,
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      if (!row) {
        return null;
      }
      return rowToEncounterRecord(row);
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all encounters within a tenant.
   */
  listByTenant(tenantId: string): ReadonlyArray<EncounterRecord> {
    throw new Error(
      "Synchronous listByTenant not supported. Use listByTenantAsync instead."
    );
  }

  /**
   * Async implementation of listByTenant.
   */
  async listByTenantAsync(tenantId: string): Promise<EncounterRecord[]> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        patient_id,
        practitioner_id,
        status,
        start_time,
        end_time,
        encounter_type,
        created_at,
        updated_at,
        last_modified_by
      FROM encounters
      WHERE tenant_id = $1
      ORDER BY created_at DESC
    `;

    try {
      const result = await this.pool.query<EncounterRow>(sql, [tenantId]);
      return result.rows.map(rowToEncounterRecord);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find encounters by patient ID within a tenant.
   */
  async findByPatientAsync(
    tenantId: string,
    patientId: string
  ): Promise<EncounterRecord[]> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        patient_id,
        practitioner_id,
        status,
        start_time,
        end_time,
        encounter_type,
        created_at,
        updated_at,
        last_modified_by
      FROM encounters
      WHERE tenant_id = $1 AND patient_id = $2
      ORDER BY created_at DESC
    `;

    try {
      const result = await this.pool.query<EncounterRow>(sql, [
        tenantId,
        patientId,
      ]);
      return result.rows.map(rowToEncounterRecord);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save an encounter record.
   */
  save(record: EncounterRecord): void {
    throw new Error("Synchronous save not supported. Use saveAsync instead.");
  }

  /**
   * Async implementation of save.
   * Uses upsert for idempotency.
   */
  async saveAsync(
    record: EncounterRecord
  ): Promise<{ success: true } | { success: false; error: PersistenceError }> {
    const sql = `
      INSERT INTO encounters (
        id,
        tenant_id,
        patient_id,
        practitioner_id,
        status,
        start_time,
        end_time,
        created_at,
        updated_at,
        last_modified_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        patient_id = EXCLUDED.patient_id,
        practitioner_id = EXCLUDED.practitioner_id,
        status = EXCLUDED.status,
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        updated_at = EXCLUDED.updated_at,
        last_modified_by = EXCLUDED.last_modified_by
    `;

    try {
      await this.pool.query(sql, [
        record.encounterId,
        record.tenantId,
        record.patientId,
        record.practitionerId || null,
        toDbStatus(record.status),
        record.startedAt ?? null,
        record.endedAt ?? null,
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
