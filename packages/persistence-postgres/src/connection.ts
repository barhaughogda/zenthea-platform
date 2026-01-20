/**
 * PostgreSQL Connection Management
 *
 * Phase G.3 - PostgreSQL Persistence Adapter Implementation
 *
 * Provides connection pool management with explicit lifecycle control.
 * No auto-connect, no magic - everything is explicit.
 *
 * INVARIANTS:
 * - Connection must be explicitly initialized
 * - Connection must be explicitly closed
 * - Transaction boundaries are explicit
 * - Errors propagate as system errors
 */

import { Pool, PoolClient, type PoolConfig } from "pg";
import type { PostgresConnectionConfig, TransactionContext } from "./types.js";

/**
 * PostgreSQL connection manager.
 * Wraps the pg Pool with explicit lifecycle management.
 */
export class PostgresConnection {
  private pool: Pool | null = null;
  private readonly config: PoolConfig;

  constructor(config: PostgresConnectionConfig) {
    this.config = {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl,
      max: config.max ?? 10,
      idleTimeoutMillis: config.idleTimeoutMillis ?? 30000,
      connectionTimeoutMillis: config.connectionTimeoutMillis ?? 5000,
    };
  }

  /**
   * Initialize the connection pool.
   * Must be called before any database operations.
   */
  async connect(): Promise<void> {
    if (this.pool !== null) {
      throw new Error("Connection already initialized");
    }
    this.pool = new Pool(this.config);

    // Test the connection
    const client = await this.pool.connect();
    client.release();
  }

  /**
   * Close all connections in the pool.
   * Must be called during application shutdown.
   */
  async disconnect(): Promise<void> {
    if (this.pool === null) {
      return;
    }
    await this.pool.end();
    this.pool = null;
  }

  /**
   * Get the underlying pool for direct queries.
   * Throws if not connected.
   */
  getPool(): Pool {
    if (this.pool === null) {
      throw new Error("Connection not initialized. Call connect() first.");
    }
    return this.pool;
  }

  /**
   * Execute a function within an explicit transaction.
   *
   * @param fn The function to execute within the transaction.
   *           Receives a TransactionContext to use for queries.
   * @returns The result of the function, or throws on error.
   *
   * Transaction semantics:
   * - BEGIN is called before fn
   * - COMMIT is called if fn succeeds
   * - ROLLBACK is called if fn throws
   * - Fail-closed: any error causes rollback
   */
  async withTransaction<T>(
    fn: (ctx: TransactionContext) => Promise<T>
  ): Promise<T> {
    const pool = this.getPool();
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const ctx: TransactionContext = {
        _client: client,
      };

      const result = await fn(ctx);

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Execute a query outside of a transaction.
   * For read-only queries or single-statement writes.
   */
  async query<T extends Record<string, unknown>>(
    text: string,
    values?: unknown[]
  ): Promise<{ rows: T[]; rowCount: number | null }> {
    const pool = this.getPool();
    const result = await pool.query<T>(text, values);
    return {
      rows: result.rows,
      rowCount: result.rowCount,
    };
  }
}

/**
 * Extract the PoolClient from a TransactionContext.
 * Internal helper for adapters participating in transactions.
 */
export function getClientFromContext(ctx: TransactionContext): PoolClient {
  return ctx._client as PoolClient;
}
