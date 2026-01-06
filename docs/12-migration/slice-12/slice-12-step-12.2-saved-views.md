# Slice 12 - Step 12.2: Saved Views (Read-Only)

**Status:** Planned  
**Owner:** Platform Architecture  
**Scope:** Operator Control Plane  
**Precondition:** Step 12.1 complete and sealed (Operator Query Policies)

---

## Purpose

Introduce **Saved Views**: named, code-defined, immutable read views that reference an
approved **Operator Query Policy** by `policyId`.

Saved Views provide stable, reusable operator "screens" without introducing ad-hoc
query power, runtime parameters, or persistence.

---

## Core Principles

- Views are defined in code
- Views are immutable at runtime
- Views reference exactly one allowlisted `policyId`
- Views do not accept runtime filters or parameters
- Views execute through policy execution from Step 12.1
- No new data exposure
- No writes
- No PHI
- Deterministic ordering preserved
- Cursor semantics unchanged

---

## Saved View Model

Each saved view MUST define:
- `viewId` (stable, unique)
- `name`
- `description`
- `policyId` (must exist in the policy registry)
- `target` (`timeline` | `agentRegistry`) derived from the policy
- Optional presentation metadata (non-sensitive only):
  - `columns` (allowlisted)
  - `defaultPageSize` (bounded)

Saved views MUST NOT:
- Contain query logic
- Override policy filters
- Change ordering or pagination
- Accept runtime inputs

---

## Execution Model

- Operator invokes a view by `viewId`
- System resolves view to its `policyId`
- System executes the policy via Step 12.1 execution path
- Results are returned with cursor-based pagination
- Output shape matches the underlying Operator API target

---

## Security and Governance

- Deny-by-default: only registered views are executable
- Unknown `viewId` is rejected
- View registry is code-owned
- Views are validated at startup:
  - `policyId` exists
  - Presentation metadata is allowlisted
  - Any bounds checks pass (page size, columns)

---

## Non-Goals

- No persistence of saved views
- No UI or frontend work
- No view authoring APIs
- No metrics or caching layers
- No new filters

---

## Exit Criteria

- Saved view registry implemented
- At least one example view per target
- Tests covering:
  - Unknown viewId rejection
  - View resolves to policy execution (no bypass)
  - Deterministic results
  - Pagination parity with direct policy execution
- No regressions in Step 12.1 or Slice 11 APIs