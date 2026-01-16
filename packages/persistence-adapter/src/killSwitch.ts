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
 * Default kill switch implementation for Slice 1.
 * Currently hardcoded to inhibit all persistence as per AP-01.
 */
export const PilotKillSwitch: IPersistenceKillSwitch = {
  isPersistenceInhibited: () => {
    // Slice 1: Hard-inhibit all persistence by default.
    // This aligns with AP-01 which authorizes infrastructure ONLY,
    // and BLOCKS application execution/persistence.
    return true;
  }
};
