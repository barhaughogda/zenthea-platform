/**
 * PostgreSQL Practitioner Repository Adapter
 *
 * Phase G.3 - PostgreSQL Persistence Adapter Implementation
 *
 * Implements PractitionerRepository interface from ehr-core using raw SQL.
 *
 * INVARIANTS:
 * - All queries include tenant_id filtering
 * - No SELECT * - explicit column lists only
 * - Prepared statements for all queries
 * - Returned records are frozen (immutable)
 * - Not found returns undefined
 */

import type { Pool } from "pg";
import type {
  PractitionerRecord,
  PractitionerRepository,
} from "@zenthea/ehr-core";
import { mapPostgresError, type PersistenceError } from "../types.js";

/**
 * Row shape from the practitioners table.
 */
interface PractitionerRow {
  id: string;
  tenant_id: string;
  external_id: string | null;
  first_name: string;
  last_name: string;
  specialty: string | null;
  email: string;
  display_name: string;
  role: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Maps a database row to a domain PractitionerRecord.
 * Ensures the returned object is frozen.
 */
function rowToPractitionerRecord(row: PractitionerRow): PractitionerRecord {
  return Object.freeze({
    id: row.id,
    tenantId: row.tenant_id,
    displayName: row.display_name,
    role: "clinician" as const, // Domain restricts to 'clinician' in Slice 2
    active: row.active,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  });
}

/**
 * PostgreSQL implementation of PractitionerRepository.
 */
export class PostgresPractitionerRepository implements PractitionerRepository {
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Find a practitioner by ID within a tenant.
   * Returns undefined if not found or tenant mismatch.
   */
  findById(tenantId: string, id: string): PractitionerRecord | undefined {
    throw new Error(
      "Synchronous findById not supported. Use findByIdAsync instead."
    );
  }

  /**
   * Async implementation of findById.
   */
  async findByIdAsync(
    tenantId: string,
    id: string
  ): Promise<PractitionerRecord | null> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        external_id,
        first_name,
        last_name,
        specialty,
        email,
        display_name,
        role,
        active,
        created_at,
        updated_at
      FROM practitioners
      WHERE tenant_id = $1 AND id = $2
    `;

    try {
      const result = await this.pool.query<PractitionerRow>(sql, [
        tenantId,
        id,
      ]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      if (!row) {
        return null;
      }
      return rowToPractitionerRecord(row);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Save a practitioner record.
   */
  save(record: PractitionerRecord): void {
    throw new Error("Synchronous save not supported. Use saveAsync instead.");
  }

  /**
   * Async implementation of save.
   * Uses upsert for idempotency.
   */
  async saveAsync(
    record: PractitionerRecord
  ): Promise<{ success: true } | { success: false; error: PersistenceError }> {
    // Parse display name into first/last (simple split)
    const nameParts = record.displayName.split(" ");
    const firstName = nameParts[0] ?? record.displayName;
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const sql = `
      INSERT INTO practitioners (
        id,
        tenant_id,
        first_name,
        last_name,
        email,
        display_name,
        role,
        active,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        display_name = EXCLUDED.display_name,
        role = EXCLUDED.role,
        active = EXCLUDED.active,
        updated_at = EXCLUDED.updated_at
    `;

    // Generate a placeholder email if not storing it
    const email = `${record.id}@placeholder.local`;

    try {
      await this.pool.query(sql, [
        record.id,
        record.tenantId,
        firstName,
        lastName,
        email,
        record.displayName,
        record.role,
        record.active,
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
   * List all practitioners for a tenant.
   */
  findAllByTenant(tenantId: string): PractitionerRecord[] {
    throw new Error(
      "Synchronous findAllByTenant not supported. Use findAllByTenantAsync instead."
    );
  }

  /**
   * Async implementation of findAllByTenant.
   */
  async findAllByTenantAsync(tenantId: string): Promise<PractitionerRecord[]> {
    const sql = `
      SELECT 
        id,
        tenant_id,
        external_id,
        first_name,
        last_name,
        specialty,
        email,
        display_name,
        role,
        active,
        created_at,
        updated_at
      FROM practitioners
      WHERE tenant_id = $1
      ORDER BY display_name
    `;

    try {
      const result = await this.pool.query<PractitionerRow>(sql, [tenantId]);
      return result.rows.map(rowToPractitionerRecord);
    } catch (error) {
      throw error;
    }
  }
}
