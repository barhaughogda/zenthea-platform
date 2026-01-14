/**
 * Sandbox-only. Kill-switch overrides all execution. Do not reuse.
 * 
 * Objective U-03: Sandbox Kill-Switch Validation (Internal Only)
 */

export interface SandboxHaltState {
  halted: boolean;
  reason: string | null;
  timestamp: string | null;
}

let killSwitchState: SandboxHaltState = {
  halted: false,
  reason: null,
  timestamp: null,
};

/**
 * Flag indicating if sandbox execution has been halted.
 * Exported for direct read-only access.
 */
export let SANDBOX_EXECUTION_HALTED = false;

/**
 * Returns the current state of the sandbox kill-switch.
 */
export function getSandboxKillSwitchState(): SandboxHaltState {
  return { ...killSwitchState };
}

/**
 * Immediately halts all sandbox execution paths.
 * Human-triggered only.
 */
export function haltSandboxExecution(reason: string): void {
  killSwitchState = {
    halted: true,
    reason,
    timestamp: new Date().toISOString(),
  };
  SANDBOX_EXECUTION_HALTED = true;
  console.warn(`[SANDBOX KILL-SWITCH] HALTED: ${reason}`);
}

/**
 * Resets the sandbox execution state.
 * Clearly marked: FOR DEVELOPMENT USE ONLY.
 */
export function resetSandboxExecution(): void {
  killSwitchState = {
    halted: false,
    reason: null,
    timestamp: null,
  };
  SANDBOX_EXECUTION_HALTED = false;
  console.log("[SANDBOX KILL-SWITCH] RESET: Sandbox execution available.");
}
