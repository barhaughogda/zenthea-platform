import { IPersistenceKillSwitch, PilotKillSwitch } from "./killSwitch";
import {
  DraftMetadata,
  FinalizedNoteMetadata,
  IPilotPersistenceAdapter,
  PersistenceResult,
  SessionMetadata,
} from "./types";

/**
 * Pilot Persistence Adapter implementation.
 * 
 * DESIGN PRINCIPLES (Slice 1):
 * 1. Fail-Closed: Persistence is disabled by default.
 * 2. Kill-Switch First: Every operation checks the safety valve.
 * 3. Human-Gated: Requires explicit action signals.
 * 4. Non-Executing: Stubbed storage (no real database connections).
 */
class PilotPersistenceAdapter implements IPilotPersistenceAdapter {
  private readonly isEnabled: boolean;
  private readonly killSwitch: IPersistenceKillSwitch;

  constructor(options: { 
    enabled?: boolean; 
    killSwitch?: IPersistenceKillSwitch 
  } = {}) {
    // Feature flag: PILOT_PERSISTENCE_ENABLED
    // Defaults to false to ensure non-executing state.
    this.isEnabled = options.enabled ?? process.env.PILOT_PERSISTENCE_ENABLED === "true";
    this.killSwitch = options.killSwitch ?? PilotKillSwitch;
  }

  private async checkSafetyGates(): Promise<PersistenceResult | null> {
    // 1. Kill Switch Check (MUST be first)
    if (this.killSwitch.isPersistenceInhibited()) {
      return {
        success: false,
        message: "Persistence inhibited by kill-switch.",
      };
    }

    // 2. Feature Flag Check
    if (!this.isEnabled) {
      return {
        success: false,
        message: "Persistence disabled: PILOT_PERSISTENCE_ENABLED is false.",
      };
    }

    return null;
  }

  async recordSessionStarted(
    signal: "HUMAN_CONFIRMED_START",
    metadata: SessionMetadata
  ): Promise<PersistenceResult> {
    const gateResult = await this.checkSafetyGates();
    if (gateResult) return gateResult;

    // Stub implementation for Slice 1
    console.log(`[PilotPersistence] Stub: recordSessionStarted for session ${metadata.sessionId}`);
    
    return {
      success: true,
      message: "Session start record stubbed successfully.",
    };
  }

  async recordDraftGenerated(
    signal: "HUMAN_CONFIRMED_END_SESSION",
    metadata: DraftMetadata
  ): Promise<PersistenceResult> {
    const gateResult = await this.checkSafetyGates();
    if (gateResult) return gateResult;

    // Stub implementation for Slice 1
    console.log(`[PilotPersistence] Stub: recordDraftGenerated for draft ${metadata.draftId}`);

    return {
      success: true,
      message: "Draft generation record stubbed successfully.",
    };
  }

  async recordFinalizedNote(
    signal: "HUMAN_SIGNED_FINALIZE",
    metadata: FinalizedNoteMetadata
  ): Promise<PersistenceResult> {
    const gateResult = await this.checkSafetyGates();
    if (gateResult) return gateResult;

    // Stub implementation for Slice 1
    console.log(`[PilotPersistence] Stub: recordFinalizedNote for note ${metadata.noteId}`);

    return {
      success: true,
      message: "Finalized note record stubbed successfully.",
    };
  }
}

/**
 * Factory to create a Pilot Persistence Adapter.
 */
export function createPilotPersistenceAdapter(options?: {
  enabled?: boolean;
  killSwitch?: IPersistenceKillSwitch;
}): IPilotPersistenceAdapter {
  return new PilotPersistenceAdapter(options);
}
