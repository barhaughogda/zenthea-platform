# Slice 14 – Control Plane DTOs & View Metadata (Read-Only)

**Status:** Completed  
**Owner:** Platform Architecture  
**Scope:** Control Plane → Experience Boundary  
**Precondition:** Slice 13 complete and sealed

---

## Purpose

Decouple internal control-plane models from external consumers by introducing stable, versioned **DTOs** and safe **view metadata** so UIs and automation cannot bind to internals.

---

## Doctrine (Non-Negotiables)

- Read-only
- Metadata-only
- Deny-by-default
- Zero PHI leakage
- Explicit versioning
- No internal model leakage

---

## In Scope

- DTO envelope(s) for operator/control-plane reads
- View metadata model (non-sensitive presentation hints only)
- Mapping layer: internal → DTO
- Tests asserting:
  - forbidden fields never appear
  - versioned response contracts remain stable

---

## Out of Scope

- No UI
- No persistence layer
- No query authoring
- No runtime parameters
- No writes

---

## Acceptance Criteria

- [x] DTO contracts defined and versioned
- [x] All operator/control-plane outputs return DTOs (not internals)
- [x] View metadata is allowlisted and non-sensitive
- [x] Tests cover forbidden-field absence and version stability

---

## Evidence (Fill When Complete)

- Implementation:
  - `packages/tool-gateway/src/operator-dtos.ts` (Canonical DTO Definitions)
  - `packages/tool-gateway/src/operator-api.ts` (Updated to return DTOs)
  - `packages/tool-gateway/src/policy-registry.ts` (Updated metadata)
  - `packages/tool-gateway/src/saved-view-registry.ts` (Updated metadata)
- Tests:
  - `packages/tool-gateway/src/slice-14.test.ts` (100% Pass)

