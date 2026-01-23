/**
 * Audit Sink Abstraction - Slice 01
 *
 * Layer 5: Audit Emission for Clinical Note Lifecycle.
 *
 * CONSTRAINTS:
 * - Synchronous and deterministic.
 * - ZERO PHI or PII in audit payloads.
 * - Failures MUST fail the request (fail-closed).
 */

/**
 * Error thrown when audit emission fails.
 * This MUST fail the request (fail-closed).
 */
export class AuditFailureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditFailureError";
  }
}

/**
 * Authorized audit event names.
 */
export type AuditEventName =
  | "NOTE_DRAFT_STARTED"
  | "NOTE_DRAFT_UPDATED"
  | "NOTE_FINALIZED"
  | "NOTE_READ";

/**
 * Audit event payload for NOTE_DRAFT_STARTED.
 * Contains NO PHI or PII.
 */
export interface NoteDraftStartedPayload {
  tenantId: string;
  clinicianId: string;
  noteId: string;
  encounterId: string;
  timestamp: string;
  correlationId: string;
}

/**
 * Audit event payload for NOTE_DRAFT_UPDATED.
 * Contains NO PHI or PII.
 */
export interface NoteDraftUpdatedPayload {
  tenantId: string;
  clinicianId: string;
  noteId: string;
  encounterId: string;
  versionNumber: number;
  timestamp: string;
  correlationId: string;
}

/**
 * Audit event payload for NOTE_FINALIZED.
 * Contains NO PHI or PII.
 */
export interface NoteFinalizedPayload {
  tenantId: string;
  clinicianId: string;
  noteId: string;
  encounterId: string;
  finalVersionNumber: number;
  timestamp: string;
  correlationId: string;
}

/**
 * Audit event payload for NOTE_READ.
 * Contains NO PHI or PII.
 */
export interface NoteReadPayload {
  tenantId: string;
  clinicianId: string;
  noteId: string;
  encounterId: string;
  timestamp: string;
  correlationId: string;
}

/**
 * Union of all authorized audit event payloads.
 */
export type AuditPayload =
  | NoteDraftStartedPayload
  | NoteDraftUpdatedPayload
  | NoteFinalizedPayload
  | NoteReadPayload;

/**
 * Audit Sink interface for emitting audit events.
 */
export interface AuditSink {
  /**
   * Emits an audit event synchronously.
   * MUST throw AuditFailureError on failure.
   *
   * @param eventName - The name of the authorized audit event.
   * @param payload - The non-PHI audit payload.
   */
  emit(eventName: AuditEventName, payload: AuditPayload): void;
}

/**
 * No-op implementation of AuditSink for testing or when auditing is disabled.
 * In production, this would be replaced by a real implementation.
 */
export class NoOpAuditSink implements AuditSink {
  emit(_eventName: AuditEventName, _payload: AuditPayload): void {
    // No-op
  }
}
