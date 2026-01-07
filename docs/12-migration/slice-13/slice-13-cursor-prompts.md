# Slice 13 – Cursor Prompts (Copy/Paste Only)

**Status:** Planned

---

## Prompt 1 — Implement Operator Audit Events + Error Taxonomy (Read-Only)

Implement Slice 13 in packages/tool-gateway with minimal, read-only changes.

Constraints:
- No new query power.
- No persistence required: emit via interface; provide safe default no-op emitter.
- Metadata-only: MUST NOT include tenantId, actorId, requestId, cursor, payloads, idempotencyKey.
- Deterministic reason codes (stable union type).
- Do not change existing operator output shapes; this slice is additive audit emission only.
- Emission must be non-blocking and must not affect control flow.

Required changes:
1) Add types:
- OperatorAuditAction, OperatorAuditOutcome, OperatorAuditReasonCode, OperatorAuditEvent.
- IOperatorAuditEmitter with a single method: emit(event): Promise<void>.

2) Wire into OperatorAPI:
- Extend OperatorAPI constructor to accept optional audit emitter (default no-op).
- In executePolicy(policyId, cursor?):
  - On success: emit ALLOWED with action POLICY_EXECUTE; include policyId + target.
  - On unknown policyId: emit REJECTED with reasonCode UNKNOWN_POLICY_ID, then throw.
  - On unsupported target: emit REJECTED with reasonCode UNSUPPORTED_TARGET, then throw.
  - On unexpected errors: emit REJECTED with reasonCode INTERNAL_ERROR, then rethrow.
  - Never emit cursor or payloads.

- In executeView(viewId, cursor?):
  - On success: emit ALLOWED with action VIEW_EXECUTE; include viewId (+ policyId if available) + target if available.
  - On unknown viewId: emit REJECTED with reasonCode UNKNOWN_VIEW_ID, then throw.
  - Never bypass executePolicy; saved views must execute via policy path.

3) After implementation, fill `docs/12-migration/slice-13/slice-13-spec.md` Evidence section with concrete file paths and test files.

---

## Prompt 2 — Tests + Verification

Add tests in packages/tool-gateway/src to prove Slice 13 guarantees:

- Unknown policyId emits REJECTED audit event with reasonCode UNKNOWN_POLICY_ID.
- Unknown viewId emits REJECTED audit event with reasonCode UNKNOWN_VIEW_ID.
- Successful executePolicy emits ALLOWED audit event.
- Successful executeView emits ALLOWED audit event and does not bypass policy execution.
- Security: emitted audit events do not contain forbidden fields:
  - tenantId
  - actorId
  - requestId
  - idempotencyKey
  - payload
  - cursor

Use a mock IOperatorAuditEmitter that records emitted events.
Tests must be deterministic.

Verification:
- pnpm -r --filter @starter/tool-gateway test

