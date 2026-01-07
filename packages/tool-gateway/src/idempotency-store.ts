import { ToolExecutionResult } from './types';
import * as crypto from 'crypto';

/**
 * In-memory idempotency store for CP-17.
 */
export class IdempotencyStore {
  private store = new Map<string, { result: ToolExecutionResult; payloadHash: string }>();

  /**
   * Generates a composite key for (tenantId, idempotencyKey).
   */
  private generateKey(tenantId: string, idempotencyKey: string): string {
    return `${tenantId}:${idempotencyKey}`;
  }

  /**
   * Generates a hash of the tool and parameters to detect collisions.
   */
  private generatePayloadHash(toolName: string, toolVersion: string, params: any): string {
    const payload = JSON.stringify({ toolName, toolVersion, params });
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Checks for a prior result.
   * Rejects if same key but different payload.
   */
  async get(tenantId: string, idempotencyKey: string, toolName: string, toolVersion: string, params: any): Promise<ToolExecutionResult | null> {
    const key = this.generateKey(tenantId, idempotencyKey);
    const existing = this.store.get(key);

    if (!existing) return null;

    const currentHash = this.generatePayloadHash(toolName, toolVersion, params);
    if (existing.payloadHash !== currentHash) {
      throw new Error('IDEMPOTENCY_COLLISION: Same key used with different parameters');
    }

    return existing.result;
  }

  /**
   * Saves a result.
   */
  async save(tenantId: string, idempotencyKey: string, toolName: string, toolVersion: string, params: any, result: ToolExecutionResult): Promise<void> {
    const key = this.generateKey(tenantId, idempotencyKey);
    const payloadHash = this.generatePayloadHash(toolName, toolVersion, params);
    this.store.set(key, { result, payloadHash });
  }

  /**
   * Clears the store (primarily for testing).
   */
  clear() {
    this.store.clear();
  }
}
