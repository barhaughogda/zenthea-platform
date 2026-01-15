/**
 * Transition Guards and Safeguards.
 * All execution paths fail closed per Phase Y-03.
 */

import { MESSAGING_EXECUTION_BLOCKED } from '../execution-block.js';
import { TransitionGuardResult } from '../states/lifecycle.js';
import { ExecutionTrigger, AuthorityRole } from '../types/authority.js';

/**
 * Global Transition Guard.
 * ALWAYS returns allowed: false in Phase Y-03.
 */
export function validateTransition(
  trigger: ExecutionTrigger,
  _action: string
): TransitionGuardResult {
  if (MESSAGING_EXECUTION_BLOCKED) {
    return {
      allowed: false,
      reason: 'PHASE_Y_03_BLOCKED',
      message: 'Execution is blocked by Phase Y-03 Global Execution Block.'
    };
  }

  // Fail-closed for any other reason
  if (trigger.authority.role === AuthorityRole.SYSTEM_ADMIN) {
     // Even system admin is blocked in this phase
     return {
       allowed: false,
       reason: 'PHASE_Y_03_BLOCKED',
       message: 'System Administrator execution is also blocked in this phase.'
     };
  }

  return {
    allowed: false,
    reason: 'INVALID_TRANSITION',
    message: 'Operation not permitted in current execution state.'
  };
}

/**
 * Kill-switch compatibility guard.
 * Design-only implementation of immediate halt semantics.
 */
export function checkKillSwitch(): void {
  // In Phase Y-03, the execution block acts as a permanent kill-switch.
  if (MESSAGING_EXECUTION_BLOCKED) {
    // Immediate halt semantics
    throw new Error("[HALT] Kill-switch active (Phase Y-03 Global Block).");
  }
}
