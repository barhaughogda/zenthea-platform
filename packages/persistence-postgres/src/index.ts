/**
 * PostgreSQL Persistence Adapters for EHR Core
 *
 * Phase G.3 - PostgreSQL Persistence Adapter Implementation
 *
 * This package provides PostgreSQL implementations of the persistence
 * interfaces defined in @zenthea/ehr-core.
 *
 * ARCHITECTURE:
 * - Raw SQL only - no ORMs
 * - Explicit prepared statements
 * - Tenant isolation on all queries
 * - Immutable returned objects
 *
 * USAGE:
 * ```typescript
 * import {
 *   PostgresConnection,
 *   PostgresPatientRepository,
 * } from "@zenthea/persistence-postgres";
 *
 * const connection = new PostgresConnection({
 *   host: "localhost",
 *   port: 5432,
 *   database: "zenthea",
 *   user: "zenthea",
 *   password: "...",
 * });
 *
 * await connection.connect();
 * const patientRepo = new PostgresPatientRepository(connection.getPool());
 * const patient = await patientRepo.findByIdAsync(tenantId, patientId);
 * await connection.disconnect();
 * ```
 */

// Connection management
export { PostgresConnection, getClientFromContext } from "./connection.js";

// Types
export type {
  PostgresConnectionConfig,
  PersistenceErrorCode,
  PersistenceError,
  PersistenceResult,
  TransactionContext,
} from "./types.js";
export { mapPostgresError } from "./types.js";

// Adapters
export { PostgresPatientRepository } from "./adapters/patient.adapter.js";
export { PostgresPractitionerRepository } from "./adapters/practitioner.adapter.js";
export { PostgresEncounterRepository } from "./adapters/encounter.adapter.js";
export { PostgresClinicalNoteRepository } from "./adapters/clinical-note.adapter.js";
