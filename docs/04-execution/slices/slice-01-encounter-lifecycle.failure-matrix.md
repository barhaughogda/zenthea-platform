# Failure Matrix: Slice 01 — Encounter Lifecycle

## 1. CLASSIFICATION
- **Status:** DRAFT
- **Type:** FAILURE MATRIX
- **Domain:** Encounter
- **Slice:** 01 – Lifecycle

## 2. PURPOSE
This document enumerates all invalid, forbidden, and failed scenarios for the Encounter lifecycle. It defines the strict fail-closed behavior required to maintain the integrity of the Encounter state machine. This matrix is DESIGN-ONLY and contains no implementation details or success paths.

## 3. FAILURE SEMANTICS
- **Fail-Closed**: Every failure mode results in an immediate abort of the operation.
- **Atomic Abort**: No partial state changes are permitted.
- **No Side Effects**: No audit logs, notifications, or downstream events are emitted on failure.
- **Deterministic**: The same failure conditions must always yield the same abort outcome.

## 4. FAILURE MATRIX TABLE

| Failure ID | Scenario | Preconditions | Trigger | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **S01-FM-001** | Missing Tenant Context | System operational | Request to create or transition Encounter without a valid tenant identifier. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-002** | Malformed Tenant Context | System operational | Request with syntactically invalid or non-existent tenant identifier. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-003** | Missing Actor Context | System operational | Request to create or transition Encounter without a valid actor identifier. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-004** | Malformed Actor Context | System operational | Request with syntactically invalid or non-existent actor identifier. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-005** | Capability Violation: Create | Actor lacks `ENCOUNTER_CREATE` capability | Request to initialize a new Encounter. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-006** | Capability Violation: Activate | Actor lacks `ENCOUNTER_ACTIVATE` capability | Request to transition Encounter from `CREATED` to `ACTIVE`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-007** | Capability Violation: Complete | Actor lacks `ENCOUNTER_COMPLETE` capability | Request to transition Encounter from `ACTIVE` to `COMPLETED`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-008** | Duplicate Encounter Creation | Encounter with ID `X` already exists in tenant scope | Request to initialize a new Encounter with ID `X`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-009** | Invalid Transition: Skip State | Encounter is in `CREATED` state | Request to transition directly to `COMPLETED`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-010** | Invalid Transition: Re-open | Encounter is in `COMPLETED` state | Request to transition to `ACTIVE`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-011** | Invalid Transition: Reverse | Encounter is in `ACTIVE` state | Request to transition back to `CREATED`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-012** | Invalid Transition: From Cancelled | Encounter is in `CANCELLED` state | Request to transition to `ACTIVE` or `COMPLETED`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-013** | Invalid Transition: Self-Transition | Encounter is in `ACTIVE` state | Request to transition to `ACTIVE`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-014** | Concurrent Transition Attempt | Transition for Encounter `X` is already in flight | Second simultaneous request to transition Encounter `X`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-015** | Cross-Tenant Access | Encounter `X` exists in Tenant `A` | Request from Actor in Tenant `B` to transition Encounter `X`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-016** | Non-Existent Encounter | No Encounter with ID `X` exists in tenant scope | Request to transition Encounter `X`. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-017** | Persistence Unavailable | System operational | Request to transition state when the underlying persistence layer is unreachable. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-018** | Persistence Timeout | System operational | Request to transition state where the persistence operation exceeds the timeout threshold. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-019** | Idempotency Violation | Request `R` with idempotency key `K` already processed | Subsequent request `R` with same key `K` but different payload. | Immediate Abort; No state change; No audit emission. |
| **S01-FM-020** | Mutation after Completion | Encounter is in `COMPLETED` state | Any request to modify Encounter metadata or properties. | Immediate Abort; No state change; No audit emission. |

## 5. DETERMINISM RULES
1. **No Retries**: The system shall not automatically retry any operation that results in a failure listed in this matrix.
2. **No Partial State**: If a transition requires multiple internal steps, any failure in any step must roll back all changes to the state prior to the trigger.
3. **Explicit Failure**: All failures must be returned as explicit errors to the calling actor; no failure shall be silently ignored.
