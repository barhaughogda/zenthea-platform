import { OrchestrationState } from './types';

/**
 * Terminal state classification per E-01 §4.1.
 */
export const TERMINAL_STATES: ReadonlySet<OrchestrationState> = new Set([
  OrchestrationState.SUCCEEDED,
  OrchestrationState.REJECTED,
  OrchestrationState.CANCELLED,
  OrchestrationState.ERROR,
  OrchestrationState.BLOCKED,
]);

/**
 * Non-terminal state classification per E-01 §4.1.
 */
export const NON_TERMINAL_STATES: ReadonlySet<OrchestrationState> = new Set([
  OrchestrationState.NEW,
  OrchestrationState.VALIDATING,
  OrchestrationState.GATED,
  OrchestrationState.AUTHORIZED,
  OrchestrationState.RUNNING,
  OrchestrationState.PAUSED,
  OrchestrationState.AUDITING,
]);

/**
 * Deterministic check for terminal state per E-01 §4.2.
 */
export function isTerminalState(state: OrchestrationState): boolean {
  return TERMINAL_STATES.has(state);
}
