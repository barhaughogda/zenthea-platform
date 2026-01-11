import { OrchestrationState } from './types';

/**
 * Explicit allowed transitions per E-01 §4.3.
 * Any transition not in this map is FORBIDDEN per E-01 §4.4.
 */
export const ALLOWED_TRANSITIONS: ReadonlyMap<OrchestrationState, ReadonlySet<OrchestrationState>> = new Map<OrchestrationState, Set<OrchestrationState>>([
  [OrchestrationState.NEW, new Set([OrchestrationState.VALIDATING])],
  
  [OrchestrationState.VALIDATING, new Set([
    OrchestrationState.GATED,
    OrchestrationState.ERROR,
    OrchestrationState.BLOCKED
  ])],
  
  [OrchestrationState.GATED, new Set([
    OrchestrationState.AUTHORIZED,
    OrchestrationState.REJECTED,
    OrchestrationState.PAUSED,
    OrchestrationState.BLOCKED,
    OrchestrationState.ERROR
  ])],
  
  [OrchestrationState.AUTHORIZED, new Set([
    OrchestrationState.RUNNING,
    OrchestrationState.ERROR,
    OrchestrationState.BLOCKED
  ])],
  
  [OrchestrationState.RUNNING, new Set([
    OrchestrationState.PAUSED,
    OrchestrationState.AUDITING,
    OrchestrationState.CANCELLED,
    OrchestrationState.ERROR,
    OrchestrationState.BLOCKED
  ])],
  
  [OrchestrationState.PAUSED, new Set([
    OrchestrationState.GATED,
    OrchestrationState.CANCELLED,
    OrchestrationState.ERROR,
    OrchestrationState.BLOCKED
  ])],
  
  [OrchestrationState.AUDITING, new Set([
    OrchestrationState.RUNNING,
    OrchestrationState.SUCCEEDED,
    OrchestrationState.ERROR,
    OrchestrationState.BLOCKED
  ])],
]);

/**
 * Deterministic transition validation per E-01 §4.3.
 * Illegal transitions are unrepresentable or explicitly rejected.
 */
export function isValidTransition(from: OrchestrationState, to: OrchestrationState): boolean {
  const allowed = ALLOWED_TRANSITIONS.get(from);
  return allowed?.has(to) ?? false;
}
