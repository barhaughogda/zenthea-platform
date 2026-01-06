# Slice 15 – Operator UI Adapter (Headless, Read-Only)

**Status:** Draft (Not Approved)  
**Owner:** Platform Architecture  
**Scope:** Operator Experience (Read-Only)  
**Precondition:** Slice 14 complete and sealed

> STOP: Do not implement this slice until explicitly instructed.

---

## Purpose

Prove the control plane can drive a real operator experience without adding risk by building a **headless adapter** that consumes approved views/policies and produces UI-ready read models.

---

## Doctrine (Non-Negotiables)

- Read-only
- No new query power
- No runtime parameters
- No writes
- Metadata-only
- Deterministic ordering and pagination

---

## In Scope

- Headless adapter layer (no UI rendering)
- Consumption of saved views / policies (deny-by-default)
- DTO-based outputs only
- Tests for:
  - no bypass of policy/view execution
  - deterministic pagination parity

---

## Out of Scope

- No frontend UI
- No persistence
- No authoring APIs

---

## Acceptance Criteria

- [ ] Adapter can list available views and execute them (read-only)
- [ ] Outputs are DTO-based and UI-ready
- [ ] No bypass of policy execution path
- [ ] Verification passes

---

## Evidence (Fill When Complete)

- Implementation:
  - (TODO)
- Tests:
  - (TODO)

