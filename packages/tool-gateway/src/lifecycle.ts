import { AgentLifecycleState, GovernanceReasonCode } from './types';

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
