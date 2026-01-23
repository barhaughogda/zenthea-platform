# Test Matrix: Slice 01 — Encounter Lifecycle (DESIGN-ONLY)

## 1. CLASSIFICATION
- **Status:** DRAFT
- **Type:** TEST MATRIX
- **Domain:** Encounter
- **Slice:** 01 – Lifecycle
- **Scope:** Boundary-level behavior (Request → Outcome)

## 2. PURPOSE
This document defines the boundary-level contract test specification for the Encounter lifecycle. It serves as the definitive source for behavioral verification, ensuring that the system adheres to the state machine constraints and security requirements defined in the Golden Path and Failure Matrix.

## 3. ABSOLUTE TEST RULES
1. **Fail-Closed**: Any request that does not meet all validity criteria MUST result in an immediate abort.
2. **Zero Audit Emission on Failure**: No audit logs or events shall be emitted for any failed operation (4xx/5xx).
3. **Zero State Mutation on Failure**: No persistent state changes shall occur if the operation fails.
4. **Deterministic Outcomes**: Identical inputs and preconditions MUST yield identical HTTP outcome classes and state results.
5. **Capability-Based**: All authorization is asserted via capabilities; no role-based logic is permitted.
6. **Boundary-Only**: Tests assert only observable outcomes (HTTP status and resulting state); no internal mechanics or mocks are referenced.

## 4. TEST MATRIX TABLE

| Test ID | Scenario | Preconditions (Conceptual) | Input Conditions (Conceptual) | Expected HTTP Outcome | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S01-TM-001** | Golden Path: Full Lifecycle | System operational; Actor has all capabilities | Valid sequence: Create -> Activate -> Complete | 2xx (Success) | Full Emission | Sequential state transition: CREATED -> ACTIVE -> COMPLETED |
| **S01-TM-002** | Missing Tenant Context | System operational | Request without tenant identifier | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-003** | Malformed Tenant Context | System operational | Request with invalid tenant format | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-004** | Missing Actor Context | System operational | Request without actor identifier | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-005** | Malformed Actor Context | System operational | Request with invalid actor format | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-006** | Capability Violation: Create | Actor lacks `ENCOUNTER_CREATE` | Request to initialize Encounter | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-007** | Capability Violation: Activate | Actor lacks `ENCOUNTER_ACTIVATE` | Request to transition to ACTIVE | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-008** | Capability Violation: Complete | Actor lacks `ENCOUNTER_COMPLETE` | Request to transition to COMPLETED | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-009** | Duplicate Encounter Creation | Encounter ID `X` already exists | Request to create Encounter ID `X` | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-010** | Invalid Transition: Skip State | Encounter is in `CREATED` state | Request to transition to COMPLETED | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-011** | Invalid Transition: Re-open | Encounter is in `COMPLETED` state | Request to transition to ACTIVE | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-012** | Invalid Transition: Reverse | Encounter is in `ACTIVE` state | Request to transition to CREATED | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-013** | Invalid Transition: From Cancelled | Encounter is in `CANCELLED` state | Request to transition to ACTIVE | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-014** | Invalid Transition: Self-Transition | Encounter is in `ACTIVE` state | Request to transition to ACTIVE | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-015** | Concurrent Transition Attempt | Transition for `X` in flight | Simultaneous request for `X` | 4xx (Client Error) | Zero Emission | Fail-closed; Atomic abort |
| **S01-TM-016** | Cross-Tenant Access | Encounter `X` in Tenant `A` | Actor in Tenant `B` requests `X` | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-017** | Non-Existent Encounter | No Encounter with ID `X` | Request to transition `X` | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-018** | Persistence Unavailable | Persistence layer unreachable | Valid transition request | 5xx (Server Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-019** | Persistence Timeout | Persistence operation times out | Valid transition request | 5xx (Server Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-020** | Idempotency Violation | Request with key `K` processed | New payload with same key `K` | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |
| **S01-TM-021** | Mutation after Completion | Encounter is in `COMPLETED` state | Request to modify properties | 4xx (Client Error) | Zero Emission | Fail-closed; No state mutation |

## 5. POST-CONDITIONS
1. **Zero Ambiguity**: Every scenario results in a clearly defined HTTP outcome class and state result.
2. **No Side Effects**: Failed tests (S01-TM-002 through S01-TM-021) leave the system state identical to the pre-test state.
3. **Immutable Mapping**: This matrix maintains a strict 1:1 mapping to the Failure Matrix (S01-FM-001 through S01-FM-020).
