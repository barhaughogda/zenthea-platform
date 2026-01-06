# Slice 12 – Step 12.1: Operator Query Policies (Read-Only)

**Status:** Completed

## Evidence
- `packages/tool-gateway/src/policy-registry.ts`: Implements the code-defined, immutable `OPERATOR_POLICY_REGISTRY`.
- `packages/tool-gateway/src/operator-api.ts`: Implements `executePolicy` for resolving and running named query definitions.
- `packages/tool-gateway/src/operator-api.test.ts`: Covers unknown policy rejection and results parity with direct API calls.
**Owner:** Platform Architecture  
**Scope:** Operator Control Plane  
**Precondition:** Slice 11 complete and sealed

---

## Purpose

Introduce **Operator Query Policies**: named, code-defined, immutable query definitions
that wrap existing Operator APIs with explicit governance.

Policies replace ad-hoc operator querying with approved, auditable intent.

---

## Core Principles

- Policies are defined in code
- Policies are immutable at runtime
- Policies reference existing Operator APIs
- No new data exposure
- No writes
- No PHI
- Deterministic ordering preserved
- Cursor semantics unchanged

---

## Policy Definition Model

Each policy MUST define:
- `policyId` (stable, unique)
- `description`
- `target` (`timeline` | `agentRegistry`)
- `filters` (explicit allowlisted subset from Slice 11)
- `ordering` (must match underlying API)
- `pagination` (cursor-based only)

Policies MUST NOT:
- Accept runtime filter input
- Modify pagination or ordering
- Bypass governance checks
- Perform dynamic evaluation

---

## Execution Model

- Operator invokes a policy by `policyId`
- System resolves the policy to a fixed query definition
- Query executes through existing Operator APIs
- Results are paginated deterministically
- Output shape is identical to the underlying API

---

## Security and Governance

- Deny-by-default: only registered policies are executable
- Policy registry is code-owned
- Unknown policy IDs are rejected
- Policy execution is fully auditable by ID

---

## Non-Goals

- No UI
- No persistence
- No metrics
- No caching
- No policy authoring APIs

---

## Exit Criteria

- Policy registry implemented
- At least one example policy per target
- Tests covering:
  - Unknown policy rejection
  - Deterministic results
  - Pagination parity with direct API calls
- No regressions in Slice 11 APIs