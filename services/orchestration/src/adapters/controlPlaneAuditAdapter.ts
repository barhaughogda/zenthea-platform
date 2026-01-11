import { 
  AuditEmitter as OrchAuditEmitter, 
  AuditSignal, 
  AuditResult 
} from '../audit/auditTypes';
import { 
  IAuditEmitter, 
  AuditEvent 
} from '@starter/control-plane';

/**
 * PR-10: Real Adapter Wiring (Control Plane Audit).
 * 
 * Bridges the orchestration-side AuditEmitter interface with the 
 * authoritative ControlPlaneAuditEmitter implementation.
 * 
 * Constraints:
 * - MUST be synchronous.
 * - MUST map thrown errors to AUD-001 (Sink Unreachable).
 * - MUST map explicit failures to AUD-002.
 * - Metadata-only (no PHI/PII).
 */
export class ControlPlaneAuditAdapter implements OrchAuditEmitter {
  constructor(
    private readonly emitter: IAuditEmitter
  ) {}

  /**
   * Emits an audit signal by bridging to the Control Plane emitter.
   * 
   * Implementation Note: Although the IAuditEmitter interface in 
   * @starter/control-plane returns a Promise, we treat the emission 
   * as synchronous here to satisfy the Orchestrator's sync mandate.
   */
  public emit(signal: AuditSignal): AuditResult {
    try {
      const event: AuditEvent = {
        context: {
          tenantId: 'SYSTEM',
          actorId: 'ORCHESTRATOR',
          traceId: signal.orchestration_attempt_id,
          timestamp: Date.parse(signal.timestamp) || Date.now()
        },
        eventType: signal.event_type,
        severity: this.mapSeverity(signal),
        payload: signal.metadata,
        result: this.mapResult(signal)
      };

      // Bridge async call to sync boundary.
      const result = this.emitter.emit(event);

      if (result instanceof Promise) {
        // In a strictly synchronous flow, we cannot await.
        // We assume the emitter provided can handle this or is a sync mock in tests.
        // If it's a real promise, we return a NACK because we cannot guarantee delivery.
        return {
          status: 'NACK',
          reason: 'Control Plane Audit Emitter returned a Promise in a synchronous context',
          error_code: 'AUD-001'
        };
      }

      return {
        status: 'ACK',
        audit_id: `CP-${Date.now()}`
      };
    } catch (error) {
      // Map thrown errors to AUD-001 (Sink Unreachable)
      return {
        status: 'NACK',
        reason: error instanceof Error ? error.message : String(error),
        error_code: 'AUD-001'
      };
    }
  }

  private mapSeverity(signal: AuditSignal): 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' {
    if (signal.event_type === 'ORCHESTRATION_ABORT') return 'ERROR';
    return 'INFO';
  }

  private mapResult(signal: AuditSignal): 'SUCCESS' | 'FAILURE' | 'DENIED' {
    if (signal.event_type === 'ORCHESTRATION_ABORT') return 'FAILURE';
    if (signal.event_type === 'POLICY_EVALUATION' && signal.metadata.outcome === 'DENY') return 'DENIED';
    return 'SUCCESS';
  }
}
