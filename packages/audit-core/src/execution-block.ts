/**
 * DESIGN-ONLY SKELETON — EXECUTION NOT ENABLED
 *
 * This file contains global guards to ensure that no operational execution
 * occurs within the audit core domain at this phase.
 */

export const AUDIT_EXECUTION_BLOCKED = true;

/**
 * Throws an error if execution is attempted.
 * Fails closed by default.
 */
export function assertAuditExecutionBlocked(): void {
  if (AUDIT_EXECUTION_BLOCKED) {
    throw new Error("EXECUTION IS BLOCKED: Audit core is currently in design-only skeleton phase.");
  }
}

/**
 * Returns whether execution is permitted.
 * Always returns false in this phase.
 */
export function isAuditExecutionPermitted(): boolean {
  return false;
}
