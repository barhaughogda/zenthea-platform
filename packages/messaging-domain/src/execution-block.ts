/**
 * PHASE Y-03 EXECUTION BLOCK
 * 
 * CRITICAL: This constant governs all execution within the messaging-domain package.
 * Per Phase Y-03 requirements, execution is currently BLOCKED and fail-closed.
 * 
 * This code is design-only and MUST NOT perform any IO, persistence, or network calls.
 */

/**
 * Global execution block for Messaging & Clinical Documentation.
 * Set to true to prevent any operational transitions.
 */
export const MESSAGING_EXECUTION_BLOCKED = true;

/**
 * Helper to ensure execution is blocked.
 * Throws if execution is attempted while MESSAGING_EXECUTION_BLOCKED is true.
 * 
 * @throws Error if execution is attempted
 */
export function ensureExecutionBlocked(): void {
  if (MESSAGING_EXECUTION_BLOCKED) {
    throw new Error(
      "[EXECUTION_BLOCKED] Messaging and Clinical Documentation execution is NOT enabled. " +
      "This is a fail-closed skeleton implementation per Phase Y-03."
    );
  }
}

/**
 * Guard for any operation that would modify state or perform execution.
 * All such operations must call this first.
 */
export function failClosedExecutionGuard(): never {
  ensureExecutionBlocked();
  
  // This point should never be reached as long as MESSAGING_EXECUTION_BLOCKED is true
  throw new Error("[FATAL] Execution guard failed to block operation.");
}
