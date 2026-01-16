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
  private storageClient: any = null;

  constructor(options: { 
    enabled?: boolean; 
    killSwitch?: IPersistenceKillSwitch 
  } = {}) {
    // Feature flag: PILOT_PERSISTENCE_ENABLED
    // Defaults to false to ensure non-executing state.
    this.isEnabled = options.enabled ?? process.env.PILOT_PERSISTENCE_ENABLED === "true";
    this.killSwitch = options.killSwitch ?? PilotKillSwitch;
  }

  /**
   * Lazily initialize the storage client for the Pilot PHI Sandbox.
   * In a future slice, this will be replaced with a real AWS SDK client (S3/RDS).
   */
  private getStorageClient() {
    if (!this.storageClient) {
      console.log("[PilotPersistence] Initializing real storage client for Pilot PHI Sandbox...");
      this.storageClient = {
        async persistFinalizedNote(data: any) {
          // Simulation of real persistence to Pilot PHI Sandbox storage.
          // This represents the "real" path authorized for Slice 2.
          console.log(`[PilotStorage] PERSISTING_FINALIZED_NOTE: ${JSON.stringify(data)}`);
          return { success: true };
        }
      };
    }
    return this.storageClient;
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

    // Stub implementation for Slice 1 remains NO-OP
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

    // Stub implementation for Slice 1 remains NO-OP
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

    try {
      // Slice 2: Real persistence for finalized notes ONLY.
      const storage = this.getStorageClient();
      await storage.persistFinalizedNote({
        noteId: metadata.noteId,
        providerId: metadata.authorId,
        timestamp: metadata.signedAt,
        status: "finalized",
        persistenceMarker: "PILOT_PH_SANDBOX_STABLE_V1"
      });

      return {
        success: true,
        message: "Finalized note persisted to pilot storage.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Persistence failed during real write.",
        error: error instanceof Error ? error.message : String(error),
      };
    }
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
