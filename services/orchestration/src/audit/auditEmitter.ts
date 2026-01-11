import { AuditEmitter, AuditSignal, AuditResult, AuditACK } from './auditTypes';
import { randomUUID } from 'node:crypto';

/**
 * PR-06: Audit Hook Wiring (Non-Emitting).
 * 
 * An inert, non-emitting implementation of the AuditEmitter.
 * Used to wire boundary hooks without side-effects.
 * 
 * Constraints:
 * - NO real audit sink.
 * - NO logging frameworks.
 * - Synchronous only.
 */
export class InertAuditEmitter implements AuditEmitter {
  /**
   * Always returns ACK for the non-emitting boundary.
   * In a real implementation, this would contact the Audit Sink.
   */
  public emit(signal: AuditSignal): AuditResult {
    // PR-06: Non-emitting boundary. Just return ACK.
    const ack: AuditACK = {
      status: 'ACK',
      audit_id: randomUUID()
    };
    return ack;
  }
}
