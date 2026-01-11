import { OrchestrationState } from '../state/types';

/**
 * PR-06: Audit Hook Wiring (Non-Emitting).
 * 
 * Authoritative audit signal contract for orchestration lifecycle events.
 * Reference: E-05 (FTAS), E-06 (OTR).
 */

export type AuditEventType = 
  | 'STATE_TRANSITION'
  | 'POLICY_EVALUATION'
  | 'ORCHESTRATION_ABORT'
  | 'ORCHESTRATION_COMPLETE';

export interface AuditSignal {
  version: '1.0.0';
  event_type: AuditEventType;
  orchestration_attempt_id: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface StateTransitionAudit extends AuditSignal {
  event_type: 'STATE_TRANSITION';
  metadata: {
    previous_state: OrchestrationState;
    target_state: OrchestrationState;
  };
}

export interface PolicyEvaluationAudit extends AuditSignal {
  event_type: 'POLICY_EVALUATION';
  metadata: {
    policy_id: string;
    policy_version: string;
    outcome: 'ALLOW' | 'DENY';
    decision_id: string;
  };
}

export interface OrchestrationAbortAudit extends AuditSignal {
  event_type: 'ORCHESTRATION_ABORT';
  metadata: {
    reason_code: string;
    stop_authority: 'CONTROL_PLANE' | 'OPERATOR' | 'ORCHESTRATOR';
    last_known_state: OrchestrationState;
  };
}

export type AuditACK = { status: 'ACK'; audit_id: string };
export type AuditNACK = { status: 'NACK'; reason: string; error_code: 'AUD-001' | 'AUD-002' };

export type AuditResult = AuditACK | AuditNACK;

export interface AuditEmitter {
  /**
   * Synchronously emits an audit signal.
   * MUST return ACK or NACK. Exceptions are treated as NACK.
   */
  emit(signal: AuditSignal): AuditResult;
}
