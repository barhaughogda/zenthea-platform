# Slice 18 – Policy & View Versioning

**Status:** Completed (2026-01-07)  
**Owner:** Platform Architecture  
**Scope:** Control Plane Infrastructure  
**Precondition:** CP-14, CP-15, CP-16, CP-17 complete

---

## Purpose

Allow safe evolution of policies and saved views over time without breaking audit trails or determinism.

---

## Doctrine (Non-Negotiables)

- Deterministic version selection
- Old versions remain addressable until explicitly deprecated
- Audit events reference stable identifiers + versions
- No runtime authoring
- No new query power

---

## In Scope

- Versioning scheme for policies and views
- Deprecation rules and guardrails
- Compatibility rules (breaking changes → new version)
- Tests verifying:
  - stable historical execution
  - explicit version selection

---

## Out of Scope

- No UI
- No persistence layer requirement
- No runtime authoring APIs

---

## Acceptance Criteria

- [x] Policies and views support explicit versioning
- [x] Audit trails remain reconstructable across versions
- [x] Tests cover backward compatibility + determinism

---

## Evidence (Completed)

- Implementation:
  - `packages/tool-gateway/src/versioning/types.ts`
  - `packages/tool-gateway/src/versioning/resolvers.ts`
  - `packages/tool-gateway/src/policy-registry.ts`
  - `packages/tool-gateway/src/saved-view-registry.ts`
  - `packages/tool-gateway/src/operator-api.ts`
  - `packages/tool-gateway/src/operator-dtos.ts`
  - `packages/tool-gateway/src/types.ts`
- Tests:
  - `packages/tool-gateway/src/slice-18.test.ts`

