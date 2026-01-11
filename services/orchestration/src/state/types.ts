/**
 * Authoritative orchestration states per E-01 §4.1.
 */
export enum OrchestrationState {
  // Non-terminal states
  NEW = 'NEW',
  VALIDATING = 'VALIDATING',
  GATED = 'GATED',
  AUTHORIZED = 'AUTHORIZED',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  AUDITING = 'AUDITING',

  // Terminal states
  SUCCEEDED = 'SUCCEEDED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  ERROR = 'ERROR',
  BLOCKED = 'BLOCKED',
}

/**
 * Shared transition type for state machine validation.
 */
export type StateTransition = {
  from: OrchestrationState;
  to: OrchestrationState;
};
