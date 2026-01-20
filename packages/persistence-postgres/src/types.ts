/**
 * Types for PostgreSQL Persistence Adapters
 *
 * Phase G.3 - PostgreSQL Persistence Adapter Implementation
 *
 * INVARIANTS:
 * - No database-specific types in domain interfaces
 * - Error types are structured, not exceptions
 * - All operations require explicit tenant_id
 */

/**
 * Configuration for PostgreSQL connection.
 * All fields are required to ensure explicit configuration.
 */
export interface PostgresConnectionConfig {
  readonly host: string;
  readonly port: number;
  readonly database: string;
  readonly user: string;
  readonly password: string;
  readonly ssl?: boolean;
  readonly max?: number; // Max connections in pool
  readonly idleTimeoutMillis?: number;
  readonly connectionTimeoutMillis?: number;
}

/**
 * Persistence error codes for structured error handling.
 * These map to database-level errors without exposing database details.
 */
export type PersistenceErrorCode =
  | "CONNECTION_ERROR"
  | "QUERY_ERROR"
  | "CONSTRAINT_VIOLATION"
  | "UNIQUE_VIOLATION"
  | "FOREIGN_KEY_VIOLATION"
  | "NOT_NULL_VIOLATION"
  | "CHECK_VIOLATION"
  | "TRANSACTION_ERROR"
  | "TIMEOUT_ERROR"
  | "UNKNOWN_ERROR";

/**
 * Structured error for persistence operations.
 * Does not expose raw database error messages to consumers.
 */
export interface PersistenceError {
  readonly code: PersistenceErrorCode;
  readonly message: string;
  readonly detail?: string;
  readonly constraint?: string;
}

/**
 * Result type for persistence operations that may fail.
 */
export type PersistenceResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: PersistenceError };

/**
 * Transaction context for explicit transaction management.
 * Passed to repository methods that participate in a transaction.
 */
export interface TransactionContext {
  /**
   * Execute a query within this transaction.
   * Internal use only - not exposed to domain layer.
   */
  readonly _client: unknown;
}

/**
 * Maps PostgreSQL error codes to structured error codes.
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export function mapPostgresError(pgError: {
  code?: string;
  constraint?: string;
  message?: string;
  detail?: string;
}): PersistenceError {
  const code = pgError.code ?? "";

  // Class 08 - Connection Exception
  if (code.startsWith("08")) {
    return {
      code: "CONNECTION_ERROR",
      message: "Database connection error",
      detail: pgError.detail,
    };
  }

  // Class 23 - Integrity Constraint Violation
  if (code === "23505") {
    return {
      code: "UNIQUE_VIOLATION",
      message: "A record with this identifier already exists",
      constraint: pgError.constraint,
    };
  }

  if (code === "23503") {
    return {
      code: "FOREIGN_KEY_VIOLATION",
      message: "Referenced record does not exist",
      constraint: pgError.constraint,
    };
  }

  if (code === "23502") {
    return {
      code: "NOT_NULL_VIOLATION",
      message: "Required field is missing",
      constraint: pgError.constraint,
    };
  }

  if (code === "23514") {
    return {
      code: "CHECK_VIOLATION",
      message: "Value violates check constraint",
      constraint: pgError.constraint,
    };
  }

  if (code.startsWith("23")) {
    return {
      code: "CONSTRAINT_VIOLATION",
      message: "Data integrity constraint violated",
      constraint: pgError.constraint,
    };
  }

  // Class 40 - Transaction Rollback
  if (code.startsWith("40")) {
    return {
      code: "TRANSACTION_ERROR",
      message: "Transaction failed",
    };
  }

  // Class 57 - Operator Intervention (includes timeout)
  if (code === "57014") {
    return {
      code: "TIMEOUT_ERROR",
      message: "Query timeout",
    };
  }

  // Default query error
  if (code) {
    return {
      code: "QUERY_ERROR",
      message: "Database query failed",
      detail: pgError.detail,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected database error occurred",
  };
}
