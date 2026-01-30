/**
 * Audit Sink Interface - Slice 01
 */

export type AuditAction =
  | "ENCOUNTER_CREATED"
  | "ENCOUNTER_ACTIVATED"
  | "ENCOUNTER_COMPLETED";

export interface AuditPayload {
  tenantId: string;
  encounterId: string;
  actorId: string;
  action: AuditAction;
  timestamp: string;
  correlationId: string;
}

export interface AuditSink {
  emit(payload: AuditPayload): Promise<void>;
}
