# Slice 13 – Operator Audit Events & Error Taxonomy (Read-Only)

**Status:** Draft (Not Approved)  
**Owner:** Platform Architecture  
**Scope:** Operator Control Plane  
**Precondition:** Slice 12 complete and sealed

> STOP: Do not implement this slice until explicitly instructed.

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

---

## Acceptance Criteria

- [ ] Audit events emitted for:
  - [ ] unknown policyId rejection
  - [ ] unknown viewId rejection
  - [ ] successful policy execution
  - [ ] successful view execution
- [ ] Stable reason codes are used everywhere (no ad-hoc strings).
- [ ] Tests assert:
  - [ ] emission on success and rejection
  - [ ] forbidden fields never appear
  - [ ] no cursor/payload leakage
- [ ] Verification passes:
  - [ ] `pnpm -r --filter @starter/tool-gateway test`

---

## Evidence (Fill When Complete)

- Implementation:
  - (TODO)
- Tests:
  - (TODO)

