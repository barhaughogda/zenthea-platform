/**
 * Phase Y-01
 * Execution is NOT ENABLED
 * Design-only scaffolding
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 */

/**
 * AuditEvent: Append-only by definition.
 * No storage implementation, no writers, no readers.
 */
export interface AuditEvent {
  readonly timestamp: Date;
  readonly eventType: string;
  readonly actor: string;
  readonly data: Record<string, unknown>;
}

/**
 * ExecutionEvidence: Append-only by definition.
 * No storage implementation, no writers, no readers.
 */
export interface ExecutionEvidence {
  readonly auditEventId: string;
  readonly hash: string;
  readonly verificationStatus: 'PENDING';
}
