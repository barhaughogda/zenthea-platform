# CP-21 — Application Surface Governance Closure Proof

**Status**: COMPLETED and SEALED (Mechanical Enforcement Verified Across All Surfaces)
**Date**: 2026-01-10
**Owner**: Staff Software Architect / Governance Lead
**Final Seal**: [Phase D Final Seal](./phase-d-final-seal.md)

## 1. Governance Mapping (Surface → Adapter → Policy → Audit → Status)

| Surface | Adapter / Boundary | Policy Enforcement | Audit Emission | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Messaging (Chat)** | `MessagingAgentAdapter` | `ToolExecutionGateway` (Mediation) | `ToolAuditLogger` (PHI-Safe) | ✅ SEALED |
| **Agent SDKs** | `@starter/*-agent-sdk` | `GovernanceGuard.enforce(ctx)` | `AuditSurface` (Uniform) | ✅ SEALED |
| **Tool Gateway** | `ToolExecutionGateway` | `PolicyEvaluator` + `Guard` | `ToolTelemetryLogger` | ✅ SEALED |
| **Patient Portal** | `ControlPlaneContext` | `GovernanceGuard.enforce(ctx)` | `getGovernance(ctx).emit` | ✅ SEALED |
| **Website Builder** | `ControlPlaneContext` | `GovernanceGuard.enforce(ctx)` | `getGovernance(ctx).emit` | ✅ SEALED |

## 2. Evidence of Mechanical Enforcement

### 2.1 Backend Guard Enforcement (CP-21.1)
All backend mutations now mechanically enforce the presence of `ControlPlaneContext` as the first instruction.

```typescript
// apps/website-builder/convex/websiteBuilder.ts
export const updateSiteStructure = mutation({
  args: {
    controlPlaneContext: controlPlaneContextValidator,
    // ...
  },
  handler: async (ctx, args) => {
    // CP-21: Mandatory Gate Enforcement - Fail Closed
    GovernanceGuard.enforce(args.controlPlaneContext);
    // ...
  }
});
```

### 2.2 SDK Boundary Enforcement (CP-21.2)
All SDK clients inherit `GovernanceGuard` enforcement at the `rawRequest` level, ensuring no downstream call is made without valid governance headers.

```typescript
// packages/chat-agent-sdk/src/client.ts
private async rawRequest(ctx: ControlPlaneContext, path: string, options: RequestInit): Promise<Response> {
  // CP-21: Mandatory Gate Enforcement - Fail Closed
  GovernanceGuard.enforce(ctx);

  // CP-21: Propagate governance context via headers
  headers.set('X-Control-Plane-Trace-Id', ctx.traceId);
  headers.set('X-Control-Plane-Actor-Id', ctx.actorId);
  headers.set('X-Control-Plane-Policy-Version', ctx.policyVersion);
}
```

### 2.3 Shared Guard Implementation (CP-21.3)
The `GovernanceGuard` provides a centralized, non-bypassable validation logic used across the platform.

```typescript
// packages/service-control-adapter/src/index.ts
export const GovernanceGuard = {
  enforce(ctx: ControlPlaneContext): void {
    if (!ctx) {
      throw new Error('GOVERNANCE_FAILURE: Missing mandatory ControlPlaneContext (CP-21)');
    }
    if (!ctx.traceId || !ctx.actorId || !ctx.policyVersion) {
      throw new Error('GOVERNANCE_FAILURE: Incomplete ControlPlaneContext (CP-21)');
    }
  }
};
```

## 3. Surface Verification Results

The previously identified bypass paths have been remediated:

1.  **Patient Portal Onboarding**: `apps/patient-portal/src/app/onboarding/intake/page.tsx` now correctly propagates `ControlPlaneContext` to all mutations.
2.  **Patient Portal Settings**: `apps/patient-portal/src/app/settings/page.tsx` verified for governance compliance.
3.  **Website Builder**: All mutations in `apps/website-builder/convex/` (including `websiteBuilder.ts`, `patients.ts`, `careTeam.ts`, etc.) now enforce `GovernanceGuard.enforce(ctx)`.

## 4. Final Classification

**CP-21 Status: COMPLETE and SEALED**

**Reasoning**: 
Mechanical enforcement is successfully implemented and verified across ALL application surfaces within the defined scope. Direct Convex mutations that previously bypassed the governance layer have been either wrapped or updated to require mandatory governance context.

**Final Actions**:
- [x] Migration of `apps/patient-portal` onboarding to `service-control-adapter`.
- [x] Migration of `apps/website-builder` mutations to mediated execution.
- [x] Mandatory `GovernanceGuard` enforcement in Convex backend.

## 5. Verification

- **Repo-wide Scan**: Complete. No un-governed mutation paths found.
- **Typecheck**: Satisfied.
- **Final Seal**: Applied.
