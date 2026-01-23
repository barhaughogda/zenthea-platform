# Slice Definition: Encounter Lifecycle

## 1. CLASSIFICATION
- **Status:** DRAFT
- **Type:** SLICE DEFINITION
- **Domain:** Encounter
- **Slice:** 01 – Lifecycle

## 2. PURPOSE
- Define the canonical lifecycle of an Encounter as a deterministic finite state machine.
- Establish Encounter as a coordinating domain where state governs all downstream capabilities.
- Explicitly state that lifecycle management precedes and constrains all other Encounter behaviors.

## 3. STATE MODEL (DESIGN-ONLY)
The Encounter lifecycle is governed by a strict Finite State Machine (FSM) consisting of the following states:

- **CREATED**: The initial state. The Encounter exists as a shell but has not yet begun active clinical coordination.
- **ACTIVE**: The operational state. Clinical activities are ongoing.
- **COMPLETED**: A terminal state. The clinical encounter has concluded. No further clinical data may be associated.
- **CANCELLED**: A terminal state. The encounter was created in error or abandoned before completion.

## 4. STATE TRANSITION RULES
Transitions must be explicit, synchronous, and follow these allowed paths:

### Allowed Transitions:
- `CREATED` -> `ACTIVE`
- `CREATED` -> `CANCELLED`
- `ACTIVE` -> `COMPLETED`
- `ACTIVE` -> `CANCELLED`

### Forbidden Transitions:
- No transitions from terminal states (`COMPLETED`, `CANCELLED`).
- No re-opening an Encounter once it has reached a terminal state.
- No skipping states (e.g., `CREATED` -> `COMPLETED` is forbidden).
- No self-transitions (e.g., `ACTIVE` -> `ACTIVE` is not a lifecycle change).

## 5. CANONICAL INVARIANTS
- **Deterministic Transitions**: Every state change must be requested explicitly; there are no implicit or automatic state changes.
- **Fail-Closed**: Any attempt to perform an invalid transition must result in an immediate failure with no change to the system state.
- **Strict Tenant Isolation**: State transitions are scoped strictly to the owning tenant.
- **Capability-Based Access**: Authorization to trigger transitions is governed by specific capabilities, not roles.
- **No Administrative Overrides**: The state machine rules apply to all actors without exception; there is no "super-user" bypass for terminal states.
- **No Background Jobs**: All lifecycle transitions are synchronous operations.
- **No Retries**: Failed transition attempts are not automatically retried.

## 6. EXPLICIT NON-EXISTENCE
This slice is strictly limited to lifecycle state management. The following are explicitly excluded:
- No scheduling or appointment logic.
- No billing, coding, or financial logic.
- No clinical content (observations, notes, etc.).
- No document signing or attestation logic.
- No side effects outside of the atomic state change itself.

## 7. SLICE BOUNDARY
- This slice defines the foundational lifecycle ONLY.
- Future slices must adhere to the states and transitions defined here and must NOT redefine them.
- Future slices may depend on specific lifecycle states (e.g., "Note creation requires ACTIVE state") but cannot alter the lifecycle rules.

## 8. LOCK INTENT (NOT A LOCK)
- This slice is foundational for the Encounter domain.
- Formal locking of this definition will occur only after validation and the definition of downstream dependent slices.
