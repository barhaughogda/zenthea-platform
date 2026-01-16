# Pilot Persistence Adapter

## Purpose
The Pilot Persistence Adapter is the authoritative gateway for all write operations during the Zenthea pilot phase. It ensures that data persistence is explicit, minimal, and strictly human-gated.

This adapter is specifically designed for the **Mock Consultation Loop** and aligns with `docs/06-beta/pilot-persistence-adapter-design.md`.

## Status: Slice 2 (Controlled Real Persistence)
- **Persistence is DISABLED by default.**
- **recordFinalizedNote**: AUTHORIZED for real persistence to the Pilot PHI Sandbox (simulated RDS/S3).
- **recordSessionStarted**: Remains STUBBED (NO-OP).
- **recordDraftGenerated**: Remains STUBBED (NO-OP).
- All writes are strictly human-gated and checked against the kill switch.

## Safety Mechanisms
1. **Kill Switch**: Every write method checks the `IPersistenceKillSwitch` first. If inhibited, the operation fails immediately.
2. **Feature Flag**: Persistence must be explicitly enabled via `PILOT_PERSISTENCE_ENABLED=true`.
3. **Human Gating**: Every method requires an explicit signal (e.g., `HUMAN_SIGNED_FINALIZE`) to proceed.

## Usage
```typescript
import { createPilotPersistenceAdapter } from "@starter/persistence-adapter";

const adapter = createPilotPersistenceAdapter({
  enabled: true, // or via process.env.PILOT_PERSISTENCE_ENABLED
});

// Authorizing a real write for a finalized clinical note
const result = await adapter.recordFinalizedNote("HUMAN_SIGNED_FINALIZE", {
  noteId: "note-123",
  authorId: "provider-456",
  signedAt: new Date()
});

if (result.success) {
  console.log(result.message); // "Finalized note persisted to pilot storage."
}
```

## Alignment
This implementation strictly follows:
- `docs/06-beta/pilot-persistence-adapter-design.md`
- `docs/03-governance/phase-ap/ap-01-pilot-phi-sandbox-provisioning-authorization.md` (Slice 2 authorizes specific persistence)
