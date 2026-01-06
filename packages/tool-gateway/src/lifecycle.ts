import { ITransitionTelemetry } from './lifecycle-telemetry';
import { AgentLifecycleState, GovernanceReasonCode } from './types';

/**
 * Metadata-only request to transition an agent between lifecycle states.
 * 🚫 MUST NOT include PHI, tenantId, or actorId.
 */
export interface TransitionRequest {
  agentId: string;
  agentVersion: string;
  fromState: AgentLifecycleState;
  toState: AgentLifecycleState;
  reason: string;
  requestedByRole: string;
  timestamp: string;
}

/**
 * Metadata-only decision for a transition request.
 * 🚫 MUST NOT include PHI, tenantId, or actorId.
 */
export interface TransitionDecision {
  requestId: string;
  decision: 'approve' | 'reject';
  decidedByRole: string;
  timestamp: string;
}

/**
 * Interface for emitting transition requests.
 */
export interface ITransitionRequestEmitter {
  emitRequest(request: TransitionRequest): void;
}

/**
 * Interface for providing transition decisions.
 */
export interface ITransitionDecisionProvider {
  getDecision(requestId: string): Promise<TransitionDecision | null>;
}

/**
 * Hook for emitting telemetry when a transition request is made.
 * 🚫 MUST NOT include PHI, tenantId, or actorId.
 */
export function emitTransitionRequestTelemetry(
  telemetry: ITransitionTelemetry,
  request: TransitionRequest,
  policySnapshotHash: string
): void {
  // Fire-and-forget
  telemetry.emitTransitionEvent({
    agentVersion: request.agentVersion,
    fromState: request.fromState,
    toState: request.toState,
    decision: 'requested',
    policySnapshotHash,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Hook for emitting telemetry when a transition decision is returned.
 * 🚫 MUST NOT include PHI, tenantId, or actorId.
 */
export function emitTransitionDecisionTelemetry(
  telemetry: ITransitionTelemetry,
  request: TransitionRequest,
  decision: TransitionDecision,
  policySnapshotHash: string
): void {
  // Fire-and-forget
  telemetry.emitTransitionEvent({
    agentVersion: request.agentVersion,
    fromState: request.fromState,
    toState: request.toState,
    decision: decision.decision === 'approve' ? 'approved' : 'rejected',
    policySnapshotHash,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Result of a lifecycle transition validation.
 */
export interface TransitionValidationResult {
  allowed: boolean;
  reasonCode?: GovernanceReasonCode;
}

/**
 * Validates a transition between agent lifecycle states.
 * This is deterministic and metadata-only.
 * 
 * Allowed Transitions:
 * - experimental -> active
 * - active -> deprecated
 * - deprecated -> retired
 * - active -> disabled
 * - deprecated -> disabled
 * 
 * Forbidden Transitions:
 * - retired -> any
 * - disabled -> active
 * - active -> experimental
 * - (any others not explicitly allowed)
 */
export function validateTransition(
  fromState: AgentLifecycleState,
  toState: AgentLifecycleState
): TransitionValidationResult {
  // 1. Check if states are the same (idempotent/identity transition)
  // Usually allowed, but let's be explicit based on the provided matrix.
  // The matrix doesn't mention state -> state. 
  // For safety in this slice, we only allow what is in the table.
  if (fromState === toState) {
    return { allowed: true };
  }

  // 2. Define allowed transitions
  const allowedTransitions: Record<AgentLifecycleState, AgentLifecycleState[]> = {
    experimental: ['active'],
    active: ['deprecated', 'disabled'],
    deprecated: ['retired', 'disabled'],
    disabled: [],
    retired: [],
  };

  const allowedTo = allowedTransitions[fromState] || [];
  
  if (allowedTo.includes(toState)) {
    return { allowed: true };
  }

  // 3. Handle forbidden transitions with specific reason codes if needed,
  // but for now, any non-allowed transition is denied.
  return {
    allowed: false,
    reasonCode: 'LIFECYCLE_DENIED',
  };
}
