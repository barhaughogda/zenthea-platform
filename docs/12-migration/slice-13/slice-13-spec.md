# Slice 13 – Operator Audit Events & Error Taxonomy (Read-Only)

**Status:** Completed  
**Owner:** Platform Architecture  
**Scope:** Operator Control Plane  
**Precondition:** Slice 12 complete and sealed

**Scope Freeze:** No new operator capabilities beyond audit emission + stable reason codes. No persistence. No new query power. No writes.

---

## Purpose

Turn operator/control-plane **execution** and **rejection** into **structured, auditable outcomes** with a stable, low-cardinality **error taxonomy**.

This slice exists to eliminate:
- ad-hoc error strings
- ambiguous failure modes
- untracked rejections

---

## Doctrine (Non-Negotiables)

- Read-only
- Metadata-only
- Deny-by-default
- Zero PHI leakage
- Deterministic ordering and classification
- No new query power
- No persistence requirement (emission interface is sufficient)
- No sensitive identifiers in operator audit events (tenantId, actorId, requestId, idempotencyKey)

---

## In Scope

- Operator audit event model (metadata-only)
- Operator error taxonomy (stable reason codes)
- Emission of audit events for:
  - policy execution attempts
  - saved view execution attempts
  - deterministic rejections (unknown IDs, invalid targets, validation failures)
- Tests proving:
  - emission on success and rejection
  - forbidden fields never appear
  - no cursor/payload leakage

---

## Out of Scope

- No UI
- No persistence layer
- No authoring APIs
- No runtime parameters
- No PHI/PII access
- No tool execution
- No lifecycle transitions

---

## Models

### OperatorAuditAction
- `POLICY_EXECUTE`
- `VIEW_EXECUTE`

### OperatorAuditOutcome
- `ALLOWED`
- `REJECTED`

### OperatorAuditReasonCode (Error Taxonomy)

Low-cardinality, stable set:
- `UNKNOWN_POLICY_ID`
- `UNKNOWN_VIEW_ID`
- `UNSUPPORTED_TARGET`
- `VALIDATION_FAILED`
- `INTERNAL_ERROR`

Rules:
- `INTERNAL_ERROR` is acceptable as a last resort but is treated as a defect.
- `reasonCode` MUST NOT contain variable strings or stack traces.

### OperatorAuditEvent (Metadata-only)

Fields:
- `eventId` (UUID ok)
- `timestamp` (ISO)
- `action` (OperatorAuditAction)
- `outcome` (OperatorAuditOutcome)
- `reasonCode?` (OperatorAuditReasonCode)
- `policyId?`
- `viewId?`
- `target?` (`timeline` | `agentRegistry`)
- `policySnapshotHash?` (only if already available safely; optional)

Hard stops (MUST NOT appear):
- tenantId
- actorId
- requestId
- idempotencyKey
- payloads
- query logic
- cursor contents

---

## Execution Rules

- Emit exactly once per action attempt (success or rejection).
- Emission MUST be non-blocking and MUST NOT change control flow.
- Unknown IDs MUST be rejected deterministically and MUST emit a `REJECTED` audit event.
- Cursor values MUST NOT be logged or emitted (opaque; may encode ordering keys).

---

## Acceptance Criteria

- [x] Audit events emitted for:
  - [x] unknown policyId rejection
  - [x] unknown viewId rejection
  - [x] successful policy execution
  - [x] successful view execution
- [x] Stable reason codes are used everywhere (no ad-hoc strings).
- [x] Tests assert:
  - [x] emission on success and rejection
  - [x] forbidden fields never appear
  - [x] no cursor/payload leakage
- [x] Verification passes:
  - [x] `pnpm -r --filter @starter/tool-gateway test`

---

## Evidence (Fill When Complete)

- Implementation:
  - `packages/tool-gateway/src/types.ts`: Added `OperatorAuditEvent` and related types.
  - `packages/tool-gateway/src/audit.ts`: Added `NoOpOperatorAuditEmitter`.
  - `packages/tool-gateway/src/operator-api.ts`: Wired `auditEmitter` into `executePolicy` and `executeView`.
- Tests:
  - `packages/tool-gateway/src/slice-13.test.ts`: Comprehensive audit and security tests.

---

## Closure Statement (Fill When Complete)

Slice 13 is complete and sealed. Audit emission for operator actions is implemented with a stable error taxonomy and strict metadata-only guarantees.
