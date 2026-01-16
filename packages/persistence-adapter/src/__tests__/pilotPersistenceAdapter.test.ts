import { describe, it, expect, vi } from "vitest";
import { createPilotPersistenceAdapter } from "../pilotPersistenceAdapter";
import { IPersistenceKillSwitch } from "../killSwitch";

describe("PilotPersistenceAdapter (Slice 1)", () => {
  const mockMetadata = {
    sessionId: "sess-123",
    providerId: "prov-456",
    mockPatientId: "pat-789",
    timestamp: new Date(),
  };

  const mockDraftMetadata = {
    draftId: "draft-123",
    labels: ["AI Suggested"],
    authorId: "prov-456",
  };

  const mockFinalizedMetadata = {
    noteId: "note-123",
    authorId: "prov-456",
    signedAt: new Date(),
  };

  it("should inhibit persistence when kill-switch is active (default)", async () => {
    const adapter = createPilotPersistenceAdapter({ enabled: true });
    
    const result = await adapter.recordSessionStarted("HUMAN_CONFIRMED_START", mockMetadata);
    
    expect(result.success).toBe(false);
    expect(result.message).toContain("inhibited by kill-switch");
  });

  it("should fail when feature flag is disabled", async () => {
    const inactiveKillSwitch: IPersistenceKillSwitch = {
      isPersistenceInhibited: () => false,
    };
    
    const adapter = createPilotPersistenceAdapter({ 
      enabled: false, 
      killSwitch: inactiveKillSwitch 
    });
    
    const result = await adapter.recordDraftGenerated("HUMAN_CONFIRMED_END_SESSION", mockDraftMetadata);
    
    expect(result.success).toBe(false);
    expect(result.message).toContain("Persistence disabled: PILOT_PERSISTENCE_ENABLED is false");
  });

  it("should succeed with stub when both gates are open", async () => {
    const inactiveKillSwitch: IPersistenceKillSwitch = {
      isPersistenceInhibited: () => false,
    };
    
    const adapter = createPilotPersistenceAdapter({ 
      enabled: true, 
      killSwitch: inactiveKillSwitch 
    });
    
    const result = await adapter.recordFinalizedNote("HUMAN_SIGNED_FINALIZE", mockFinalizedMetadata);
    
    expect(result.success).toBe(true);
    expect(result.message).toContain("stubbed successfully");
  });

  it("should enforce kill-switch as the first gate", async () => {
    // Even if enabled, kill-switch should block it
    const activeKillSwitch: IPersistenceKillSwitch = {
      isPersistenceInhibited: () => true,
    };
    
    const adapter = createPilotPersistenceAdapter({ 
      enabled: true, 
      killSwitch: activeKillSwitch 
    });
    
    const result = await adapter.recordSessionStarted("HUMAN_CONFIRMED_START", mockMetadata);
    
    expect(result.success).toBe(false);
    expect(result.message).toContain("inhibited by kill-switch");
  });
});
