# Phase D-3: Mandatory Gate Enforcement (CP-21)

## Overview
Phase D-3 establishes mechanical enforcement of the governance boundary. It ensures that all governed operations (tool executions and service calls) must be mediated through the `service-control-adapter` or provided with a valid `ControlPlaneContext`.

## Mandatory Enforcement Doctrine (CP-21)
1. **Fail Closed**: Any call to governed infrastructure (Tool Gateway, Agent SDKs) without a valid `ControlPlaneContext` MUST fail with a `GOVERNANCE_FAILURE` or `UNAUTHORIZED` error.
2. **Contextual Integrity**: The `actorId` in the execution command must match the `actorId` in the provided `ControlPlaneContext`.
3. **Traceability**: All calls must propagate `traceId` and `policyVersion` from the control plane context.

## Implementation Details

### 1. Governance Guard
Introduced `GovernanceGuard` in `@starter/service-control-adapter` as a central enforcement point.

```typescript
export const GovernanceGuard = {
  enforce(ctx: ControlPlaneContext): void {
    if (!ctx || !ctx.traceId || !ctx.actorId || !ctx.policyVersion) {
      throw new Error('GOVERNANCE_FAILURE: Missing or incomplete ControlPlaneContext (CP-21)');
    }
  }
};
```

### 2. Tool Gateway Enforcement
Updated `ToolExecutionGateway.execute` to require `ControlPlaneContext`.

```typescript
async execute(command: unknown, ctx: ControlPlaneContext): Promise<ToolExecutionResult> {
  GovernanceGuard.enforce(ctx);
  // ... validation and integrity checks ...
}
```

### 3. SDK Client Enforcement
All agent SDK clients (Chat, Appointment, Consent, Medical Advisor) now require `ControlPlaneContext` for all network requests.

```typescript
private async rawRequest(ctx: ControlPlaneContext, path: string, options: RequestInit): Promise<Response> {
  GovernanceGuard.enforce(ctx);
  // Headers propagation
  headers.set('X-Control-Plane-Trace-Id', ctx.traceId);
  headers.set('X-Control-Plane-Actor-Id', ctx.actorId);
  headers.set('X-Control-Plane-Policy-Version', ctx.policyVersion);
  // ...
}
```

### 4. Application Compliance
`apps/patient-portal` has been updated to derive `ControlPlaneContext` from the active session and pass it through all adapter boundaries.

## Verification
- [x] `ToolExecutionGateway` fails without context.
- [x] Agent SDKs fail without context.
- [x] `patient-portal` adapters updated to provide context.
- [x] Type-level enforcement prevents bypasses in new code.

## Forbidden Bypass Paths (Eliminated)
- Direct instantiation of `ToolExecutionGateway` without context.
- Direct SDK calls without control plane headers.
- Unauthenticated/untraced tool executions.
