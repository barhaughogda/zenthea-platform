/**
 * Persistence Kill Switch.
 * 
 * This is the primary safety mechanism to prevent ANY persistence
 * when the system is in a locked or emergency state.
 */

export interface IPersistenceKillSwitch {
  /**
   * Returns true if persistence is disabled system-wide.
   */
  isPersistenceInhibited(): boolean;
}

/**
 * Default kill switch implementation for Slice 2.
 * 
 * FAIL-CLOSED BEHAVIOR:
 * 1. Defaults to INHIBITED (true).
 * 2. Can ONLY be turned OFF by explicitly setting PILOT_KILL_SWITCH="OFF".
 * 3. Any other value (including undefined) results in persistence being inhibited.
 */
export const PilotKillSwitch: IPersistenceKillSwitch = {
  isPersistenceInhibited: () => {
    // Kill switch is explicitly OFF only when environment variable is exactly "OFF"
    const killSwitchState = process.env.PILOT_KILL_SWITCH;
    return killSwitchState !== "OFF";
  }
};
