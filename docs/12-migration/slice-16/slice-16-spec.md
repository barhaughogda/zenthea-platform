# Slice 16 – Escalation Paths & Decision Hooks (Control Plane)

**Status:** Implementation Complete
**Owner:** Platform Architecture
**Scope:** Escalation & Human-in-the-Loop
**Precondition:** Slice 15 complete and sealed

---

## Purpose

CP-16 introduces a standardized, injectable way to identify when an operator action or outcome should trigger escalation. It represents "decision required" states in a structured, metadata-only format, providing deterministic, testable decision routing without performing any mutation.

Think: “human review required” signals and decision envelopes, not execution.

---

## Doctrine (Non-Negotiables)

- **Read-only slice:** NO mutations, NO writes, NO state changes.
- **Metadata-only:** No tenantId, actorId, requestId, payload, cursor, raw rows, or PHI/PII in outputs. Safe for operator surfaces.
- **Stability:** CP-14 contracts are immutable. CP-16 uses additive V2 execution envelopes.
- **Deterministic:** Same metadata inputs always result in the same decision signals.

---

## Implementation Details

### 1. Decision Hook Interface (`packages/tool-gateway/src/decision-hooks/types.ts`)
Defines the taxonomy for decisions:
- `DecisionKind`: `HUMAN_REVIEW`, `SECURITY_REVIEW`, `COMPLIANCE_REVIEW`.
- `DecisionSeverity`: `info`, `warning`, `critical`.
- `DecisionRequirement`: `none`, `required`.
- `DecisionReasonCode`: `HIGH_RISK_REJECTION`, `POLICY_MISCONFIG_ERROR`, etc.

### 2. Escalation Policy (`packages/tool-gateway/src/escalation/default-escalation-policy.ts`)
Implements baseline mapping:
- `riskTier=high` AND `outcome=REJECTED` => `SECURITY_REVIEW` (critical)
- `outcome=ERROR` with misconfig codes => `COMPLIANCE_REVIEW` (warning)
- Default => `none`

### 3. V2 Execution Envelopes (`packages/tool-gateway/src/operator-dtos.ts`)
Introduces `ExecutionResultDtoV2` which extends the CP-14 `v1` result with an optional `decision` block.

### 4. OperatorAPI Integration (`packages/tool-gateway/src/operator-api.ts`)
Adds `executePolicyV2` and `executeViewV2` methods. These methods wrap the existing `v1` execution and evaluate the injected `IDecisionHook` to append decision metadata if required.

---

## Acceptance Criteria Results

- [x] Formal decision hook interfaces exist
- [x] Decision lifecycle states are explicit and validated
- [x] No automation paths are introduced (read-only slice)
- [x] Tests cover non-bypass and determinism

---

## Evidence

- Implementation:
  - `packages/tool-gateway/src/decision-hooks/types.ts`
  - `packages/tool-gateway/src/escalation/default-escalation-policy.ts`
  - `packages/tool-gateway/src/operator-decision-dtos.ts`
- Tests:
  - `packages/tool-gateway/src/slice-16.test.ts`
