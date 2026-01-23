# Implementation Sequencing: Encounter Slice 01 (Encounter Lifecycle)

**Classification:** DESIGN-ONLY  
**Domain:** Encounter  
**Slice:** 01  
**Status:** LOCK-READY

## 1. Purpose
This Implementation Sequencing document defines the mandatory build order and execution discipline for Encounter Slice 01. It ensures that the implementation follows a layered, deterministic approach, preventing scope creep and ensuring that failure semantics and audit rules are strictly adhered to.

## 2. Non-Negotiable Build Order (Layers)

### Layer 1: Transport Boundary
- **Allowed changes:** Define API request/response structures, input validation (Zod schemas), and tenant/actor context extraction.
- **Prohibited changes:** Any service logic, database access, or authorization checks.
- **Completion gate:** All "Context Failure" tests (missing/malformed tenant or actor) must pass (S01-TM-002, S01-TM-003).

### Layer 2: Authorization Boundary
- **Allowed changes:** Implementation of capability-based access control checks.
- **Prohibited changes:** Any mutation of state or audit emission.
- **Completion gate:** All "Capability Failure" tests must pass (S01-TM-004, S01-TM-005, S01-TM-006).

### Layer 3: Service Logic
- **Allowed changes:** Implementation of the state machine transitions and business rule validation.
- **Prohibited changes:** Persistence or audit emission.
- **Completion gate:** All "Invalid Transition" and "State Machine Rule" tests must pass (S01-TM-007 through S01-TM-016).

### Layer 4: Persistence Boundary
- **Allowed changes:** Database interactions, transaction management, and concurrency control (optimistic locking).
- **Prohibited changes:** Audit emission.
- **Completion gate:** Concurrency and idempotency tests must pass (S01-TM-017, S01-TM-018, S01-TM-019).

### Layer 5: Audit Emission
- **Allowed changes:** Successful audit emission on operation completion.
- **Prohibited changes:** Any audit emission on failure.
- **Completion gate:** All audit-related expectations must pass (S01-TM-020, S01-TM-021), and the full Golden Path (S01-TM-001) must turn GREEN.

## 3. Operation Sequencing (Encounter Lifecycle Order)
Implementation must follow the lifecycle order defined in the Golden Path:
1. **Create Encounter** (Transition to `CREATED`)
2. **Activate Encounter** (Transition from `CREATED` to `ACTIVE`)
3. **Complete Encounter** (Transition from `ACTIVE` to `COMPLETED`)

**Explicit Non-Existence (Prohibited Behaviors):**
- Re-open (No transition from `COMPLETED` to `ACTIVE`)
- Skip transitions (e.g., `CREATED` to `COMPLETED` directly)
- Reverse transitions (e.g., `ACTIVE` to `CREATED`)
- Admin bypasses (No roles or ACL overrides)

## 4. Test Gates (Map Test Matrix IDs to Phases)

| Test Matrix ID | Phase / Layer | Earliest Layer for GREEN |
| :--- | :--- | :--- |
| S01-TM-001 | Full Slice (Golden Path) | Layer 5 |
| S01-TM-002 | Context Failure (Missing Tenant) | Layer 1 |
| S01-TM-003 | Context Failure (Missing Actor) | Layer 1 |
| S01-TM-004 | Capability Failure (Create) | Layer 2 |
| S01-TM-005 | Capability Failure (Activate) | Layer 2 |
| S01-TM-006 | Capability Failure (Complete) | Layer 2 |
| S01-TM-007 | Invalid Transition (Activate -> Activate) | Layer 3 |
| S01-TM-008 | Invalid Transition (Complete -> Complete) | Layer 3 |
| S01-TM-009 | Invalid Transition (Complete -> Activate) | Layer 3 |
| S01-TM-010 | State Machine (Activate non-existent) | Layer 3 |
| S01-TM-011 | State Machine (Complete non-existent) | Layer 3 |
| S01-TM-012 | State Machine (Activate wrong tenant) | Layer 3 |
| S01-TM-013 | State Machine (Complete wrong tenant) | Layer 3 |
| S01-TM-014 | State Machine (Activate already completed) | Layer 3 |
| S01-TM-015 | State Machine (Complete already completed) | Layer 3 |
| S01-TM-016 | State Machine (Activate already active) | Layer 3 |
| S01-TM-017 | Concurrency (Activate) | Layer 4 |
| S01-TM-018 | Concurrency (Complete) | Layer 4 |
| S01-TM-019 | Idempotency (Create) | Layer 4 |
| S01-TM-020 | Audit (Success Only) | Layer 5 |
| S01-TM-021 | Audit (Failure Silence) | Layer 5 |

## 5. Hard Stop Rules (Execution Discipline)
The following conditions are immediate hard stops for implementation:
- Dirty working tree (any uncommitted changes).
- Not on the `main` branch for DESIGN-ONLY documentation.
- `origin/main` misalignment (local branch must be up to date).
- Any modification to existing artifacts without explicit change control.
- Any addition of roles, ACL tables, or overrides.
- Any async or background processing.
- Any retries (operations must be deterministic and fail-closed).

## 6. Completion Criteria Checklist
- [ ] All tests green (S01-TM-001 through S01-TM-021).
- [ ] No out-of-scope behaviors added (no re-open, no skip transitions).
- [ ] Deterministic outcomes verified (identical inputs yield identical outcomes).
- [ ] Audit rules verified (success-only, metadata-only; failure silence).

## 7. Lock Statement
This Implementation Sequencing document is the execution plan baseline for Encounter Slice 01. Any deviation from this plan requires explicit change control approval.
