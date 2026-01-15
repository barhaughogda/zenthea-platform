/**
 * Audit & Evidence Types for Messaging & Clinical Documentation.
 * Structures are append-only and intended for deterministic evidence trails.
 */

import { ExecutionTrigger } from './authority.js';

export type AuditEventId = string;

export interface DomainAuditEvent {
  readonly id: AuditEventId;
  readonly timestamp: string;
  readonly entityId: string;
  readonly action: string;
  readonly trigger: ExecutionTrigger;
  readonly payloadHash: string;
  readonly previousEventHash: string | null; // Append-only chain
}

/**
 * Deterministic record of a blocked execution attempt.
 */
export interface BlockedExecutionEvidence {
  readonly timestamp: string;
  readonly reason: string;
  readonly attemptedAction: string;
  readonly context: Record<string, unknown>;
}
