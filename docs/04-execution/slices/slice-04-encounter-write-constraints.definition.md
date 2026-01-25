# Encounter Slice 04 — Write / Mutation Constraints

## 1. CLASSIFICATION
- **Status**: DESIGN-ONLY
- **Type**: SLICE DEFINITION
- **Domain**: Encounter
- **Slice**: 04 — Write / Mutation Constraints

## 2. PURPOSE
This document defines the mandatory constraints governing all write and mutation operations within the Encounter domain. It establishes the deterministic rules that must be satisfied to permit any change to Encounter state or metadata. This slice builds upon the lifecycle (Slice 01), authorization (Slice 02), and temporal visibility (Slice 03) foundations to ensure regulator-grade integrity for all state-altering operations.

## 3. WRITE SCOPE & SEMANTICS
A "write" or "mutation" is defined as any operation that results in a change to the persistent state of an Encounter or its associated metadata.

- **Explicit Separation**: Read semantics (Slices 02 and 03) govern the visibility of data, while write semantics (this slice) govern the modification of data. Success in a read operation does not imply or grant permission for a write operation.
- **Atomic Mutation**: Every mutation must be atomic. The system must ensure that an Encounter never enters a partial or inconsistent state.
- **No Side Effects**: Write operations are strictly limited to the Encounter domain. Mutations must not trigger side effects in external domains (e.g., Billing, Scheduling) within the same execution context.

## 4. CAPABILITY-BASED AUTHORIZATION
Mutation is governed strictly by the possession of specific capabilities.

- **Capability Requirement**: Any mutation requires the explicit capability `can_mutate_encounter` within the provided `AuthorityContext`.
- **No Role-Based Logic**: Authorization decisions must not reference roles, groups, or administrative levels.
- **Contextual Validation**: Capabilities are validated within the mandatory `TenantContext`. Cross-tenant mutations are architecturally prohibited.

## 5. STATE-GATED MUTATIONS
The ability to mutate an Encounter is a deterministic function of its current lifecycle state (as defined in Slice 01).

- **Permitted States**: Mutations are permitted ONLY when the Encounter is in the `CREATED` or `ACTIVE` states.
- **Terminal Immutability**: The `COMPLETED` and `CANCELLED` states are terminal and immutable. No mutation of any kind is permitted once an Encounter has reached a terminal state.
- **Transition Integrity**: Mutations that attempt to trigger a state transition must strictly obey the allowed paths defined in the Slice 01 Finite State Machine.

## 6. TEMPORAL CONSTRAINTS
Mutations are subject to strict temporal gates, interacting with the temporal visibility defined in Slice 03.

- **Synchronous Request Time**: All mutations must use the explicitly provided request time from the `AuthorityContext`.
- **No Backdating**: Mutations with a request time preceding the Encounter's creation time are prohibited.
- **No Forward-dating**: Mutations with a request time in the future relative to the system's authoritative time source (at the boundary) are prohibited.
- **Window Alignment**: A mutation is only permitted if the request time falls within the valid temporal window for the Encounter's current state.

## 7. DETERMINISTIC FAIL-CLOSED BEHAVIOR
The system adheres to a strict fail-closed philosophy for all mutations.

- **Immediate Abort**: Any violation of a write constraint (authorization, state, temporal, or integrity) must result in an immediate abort of the entire operation.
- **Zero Partial Mutation**: If an abort occurs, the Encounter state must remain exactly as it was prior to the request.
- **Zero Retries**: The system must not attempt to retry a failed mutation. Responsibility for recovery or retry lies entirely with the caller.

## 8. AUDIT SEMANTICS
Audit integrity is maintained through success-only emission rules.

- **Success-Only Emission**: A metadata-only audit record is emitted ONLY upon the successful completion of a mutation.
- **Failure Silence**: ZERO audit emission shall occur for failed mutation attempts. This prevents information leakage and ensures the audit log contains only valid state changes.
- **Metadata Content**: Audit records must contain only the metadata necessary for reconstruction (e.g., `encounterId`, `capabilityUsed`, `correlationId`, `timestamp`). No clinical content or sensitive data shall be included in the audit emission.

## 9. EXPLICIT PROHIBITIONS
The following behaviors and patterns are strictly prohibited:

- **No Administrative Bypasses**: There are no "super-user" routes or flags that bypass mutation constraints or state machine rules.
- **No Bulk Updates**: Mutations must be performed on a single Encounter per request. Bulk or batch mutations are prohibited.
- **No Background Mutation**: All mutations must be synchronous and occur within the request-response cycle. Background or asynchronous state changes are excluded from the domain contract.
- **No Schema or Implementation References**: This definition is independent of persistence schemas, API protocols, or UI implementations.
- **No Implementation Details**: This document defines "what" the constraints are, not "how" they are implemented.
