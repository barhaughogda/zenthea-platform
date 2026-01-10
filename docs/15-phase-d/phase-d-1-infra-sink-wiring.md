# Phase D-1: Infrastructure Sink Wiring

## Overview
This document describes the wiring of the Control Plane interfaces to concrete implementations, providing the mechanical availability of policy decisions and audit emission as platform primitives.

## Implementations

### 1. Audit Emission (`IAuditEmitter`)
- **Implementation**: `ControlPlaneAuditEmitter` in `packages/control-plane/src/audit-impl.ts`
- **Backend**: `@starter/observability` (Logger)
- **Features**:
  - Maps `AuditEvent` severity levels to standard `LogLevel`.
  - Structured, deterministic log entries.
  - Fail-safe fallback to `console.error` for audit infrastructure failures.
  - Zero PHI/PII in audit payloads (restricted to machine-level context).

### 2. Policy Evaluation (`IPolicyEvaluator`)
- **Implementation**: `ControlPlanePolicyEvaluator` in `packages/control-plane/src/policy-impl.ts`
- **Backend**: `@starter/policy`
- **Features**:
  - **Fail-Closed Strategy**: Any non-`PERMIT` effect (including `INDETERMINATE` or errors) results in `allowed: false`.
  - **Automated Failure Audit**: Emits a `CRITICAL` audit event upon internal evaluation failures.

## Out of Scope
- **CP-21 E1**: Non-cacheability enforcement is deferred to subsequent slices.
- **Advanced Obligations**: Obligations returned by the policy backend are not yet processed.
- **Persistence Layer**: Actual log persistence/retention is handled by the observability platform infrastructure, not the control plane itself.

## Verification
Implementations were verified via type-level compliance checks in `packages/control-plane/src/verify-implementations.ts`.
