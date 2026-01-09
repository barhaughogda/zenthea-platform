import { RequestContext, Severity } from './types';

export interface AuditEvent {
  readonly context: RequestContext;
  readonly eventType: string;
  readonly severity: Severity;
  readonly payload: Record<string, unknown>;
  readonly result: 'SUCCESS' | 'FAILURE' | 'DENIED';
}

/**
 * Authoritative interface for audit emission.
 */
export interface IAuditEmitter {
  emit(event: AuditEvent): Promise<void>;
}
