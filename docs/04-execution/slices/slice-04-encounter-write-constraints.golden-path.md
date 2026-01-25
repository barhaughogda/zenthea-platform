# Golden Path: Encounter Slice 04 — Write / Mutation Constraints

## 1. Classification
- **Domain**: Encounter Management
- **Slice**: 04 — Write / Mutation Constraints
- **Type**: Golden Path (Design-Only)
- **Status**: Finalized

## 2. Purpose
This document defines the singular successful execution path for mutating an Encounter resource. It ensures that all required constraints—tenant isolation, capability-based authorization, lifecycle state validity, and temporal consistency—are satisfied before an atomic mutation is committed and audited.

## 3. Preconditions
- **TenantContext**: A valid and active tenant context is present.
- **AuthorityContext**: The requesting actor possesses the `can_mutate_encounter` capability for the target Encounter.
- **Resource Existence**: The Encounter resource exists within the scope of the provided TenantContext.
- **Lifecycle State**: The Encounter is in a mutable state (either `CREATED` or `ACTIVE`).
- **Temporal Window**: The request timestamp is within the allowed temporal window for the current state.

## 4. Golden Path Sequence
1. **Context Validation**: The system verifies the `TenantContext` to ensure the request is bound to a valid tenant.
2. **Capability Verification**: The system confirms the `AuthorityContext` contains the explicit `can_mutate_encounter` capability for the specific resource.
3. **State Eligibility Check**: The system evaluates the current lifecycle state of the Encounter, confirming it is `CREATED` or `ACTIVE`.
4. **Temporal Consistency Check**: The system validates that the mutation request occurs within the deterministic temporal window defined for the current lifecycle state.
5. **Atomic Mutation**: The system executes the requested changes as a single, indivisible operation.
6. **Deterministic Transition**: If the mutation includes a state change, the Encounter transitions to the next valid state in the lifecycle (e.g., `CREATED` to `ACTIVE`).
7. **Audit Emission**: Upon successful commit, the system emits exactly one audit event.

## 5. Post-Conditions
- **Persistence**: The Encounter resource reflects the mutated state.
- **Integrity**: The resource remains compliant with all domain invariants.
- **Visibility**: The mutated resource is immediately visible to authorized actors subject to Slice 02 and Slice 03 constraints.

## 6. Audit Emission Guarantee
- **Count**: Exactly ONE audit event is emitted per successful mutation.
- **Payload**: The audit payload is metadata-only, containing the actor identifier, timestamp, capability used, and the nature of the transition, without including sensitive clinical data.

## 7. Explicit Non-Goals / Exclusions
- **Failure Handling**: This document does not cover authorization failures, state conflicts, or temporal violations (see Failure Matrix).
- **Implementation Details**: No specific API endpoints, database schemas, or storage mechanisms are defined here.
- **Read Visibility**: Constraints regarding who can see the resource are handled in Slice 02 and Slice 03.
