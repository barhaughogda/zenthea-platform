# PHASE D-2: NON-CLINICAL SURFACE WIRING (WEBSITE BUILDER)

## Status
- **Phase**: D-2
- **Domain**: Website Builder (Non-Clinical)
- **Mechanical Enforcement**: ACTIVE
- **Doctrine**: CP-21 (Mechanical > Conventional)

## Overview
Phase D-2 wires the Website Builder domain into the Control Plane via the `service-control-adapter`. This transition replaces conventional, manual authorization and audit calls with a fail-closed mechanical enforcement layer.

## Implementation Details

### 1. Convex Control Adapter
Implemented `apps/website-builder/convex/lib/controlAdapter.ts` which satisfies:
- `GovernanceSurface`: Evaluates policy before state changes.
- `AuditSurface`: Uniform audit emission to the central sink.

### 2. Governed Execution Paths
The following mutations have been refactored to route through the adapter:
- `initializeWebsiteBuilder`
- `updateSiteStructure`
- `updateHeader`
- `updateFooter`
- `publishWebsite`
- `unpublishWebsite`
- `saveWebsiteBuilder`

### 3. Policy Enforcement (E2)
Each refactored mutation now follows the fail-closed pattern:
```typescript
const decision = await gov.evaluatePolicy(cpCtx, "action_name", "website_builder");
if (!decision.allowed) {
  throw new Error(decision.reason || ERROR_MESSAGES.UNAUTHORIZED);
}
```

### 4. Audit Emission (E3)
Legacy local audit logging has been removed in favor of standard control plane emission:
```typescript
await gov.emit(cpCtx, {
  type: "standard_event_type",
  metadata: { ... },
  timestamp: new Date().toISOString()
});
```

## Evidence Artifacts
- **Code Changes**: Refactored `apps/website-builder/convex/websiteBuilder.ts`
- **Infrastructure**: Added `@starter/control-plane` and `@starter/service-control-adapter` dependencies.
- **Verification**: Typecheck passes; working tree is clean.

## Compliance Statement
This implementation fulfills the D-2 requirement for non-clinical surfaces. No PHI or clinical SDKs were modified. All governed actions are mechanically enforced through the adapter boundary.
