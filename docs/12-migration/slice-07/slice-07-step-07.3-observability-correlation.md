# Slice 07 – Step 07.3: Observability & Snapshot Correlation

## Status
- **Status:** Completed
- **Date:** 2026-01-05
- **Task:** Correlate governance telemetry events with the active policySnapshotHash.

## Objectives
1. Correlate governance telemetry events with the active `policySnapshotHash`.
2. Include `policySnapshotHash` in:
   - `GovernanceControlResult`
   - `ToolGatewayEvent` (telemetry only)
3. Ensure `agentVersion`, `policySnapshotHash`, and governance decision appear together in telemetry.
4. Maintain strict "No PHI" and "Metadata-only" constraints for governance events.

## Implementation Details

### 1. Type Updates
Updated `packages/tool-gateway/src/types.ts` to include `policySnapshotHash` in both `ToolGatewayEvent` and `GovernanceControlResult`.

### 2. Gateway Correlation
Updated `packages/tool-gateway/src/gateway.ts`:
- The gateway now captures the active `policySnapshotHash` upon initialization.
- Every governance control result (denies and warnings) now includes the `policySnapshotHash`.
- Every telemetry event now includes the `policySnapshotHash`.
- This ensures that every tool invocation decision can be traced back to the exact version of the governance policy that was in effect at the time.

### 3. Verification
Created `packages/tool-gateway/src/correlation.test.ts` to validate:
- Telemetry events include the correct `policySnapshotHash`, `agentVersion`, and decision.
- Governance control results (DENIED) include the correct `policySnapshotHash`, `agentVersion`, and `reasonCode`.
- Governance warnings (WARNING) include the correct `policySnapshotHash`, `agentVersion`, and `reasonCode`.
- All correlation fields appear together in the same event.

## Constraints Check
- [x] Metadata-only: Only hashes and identifiers are included.
- [x] No PHI: No patient data or sensitive parameters.
- [x] No tenantId, actorId, requestId in GovernanceControlResult: Only tool and agent metadata included.
- [x] No new metrics: Only existing telemetry and governance logs are enhanced.
- [x] No persistence: Snapshot correlation happens in-memory at the gateway boundary.
- [x] pnpm typecheck passes.

## Deliverables
- `packages/tool-gateway/src/gateway.ts`
- `packages/tool-gateway/src/types.ts`
- `packages/tool-gateway/src/correlation.test.ts`
