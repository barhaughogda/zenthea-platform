# Slice 00: Execution Reference Blueprint

## 1. Purpose
This document serves as the authoritative execution blueprint for the Zenthea Platform. It formalizes the methodology established and proven by Slice 01. All future execution slices MUST conform to the standards, structures, and sequences defined herein. This blueprint ensures deterministic, regulator-grade execution across the entire platform.

## 2. Mandatory Slice Artifacts
Every execution slice must produce and maintain the following artifacts:

*   **Slice Definition**: A formal specification of the slice's scope, boundaries, and intended outcomes.
*   **Golden Path Flow**: A deterministic mapping of the successful execution path, from entry to exit.
*   **Failure Matrix**: A comprehensive taxonomy of all expected failure modes and their corresponding abort semantics.
*   **Test Matrix**: A structured mapping of requirements to specific contract and integration tests.
*   **Implementation Sequencing**: A step-by-step, non-parallelizable execution plan for implementation.
*   **Governance Lock Note**: A formal declaration of completion and immutable state for the slice.

## 3. Mandatory Layer Order (Non-Negotiable)
Implementation MUST proceed through the following layers in the exact order specified. No layer skipping, parallelization, or backtracking is permitted.

1.  **Transport Boundary**: Definition of external interfaces and protocol-level constraints.
2.  **Authorization Boundary**: Enforcement of identity, scope, and permission gates.
3.  **Service Logic**: Implementation of core domain rules and orchestration.
4.  **Persistence Boundary**: Formalization of state transitions and storage contracts.
5.  **Audit Emission**: Mandatory recording of evidence and execution traces.

## 4. Contract Test Rules
*   **Boundary Assertion Only**: Contract tests MUST assert behavior at the defined boundaries.
*   **No Internal Inspection**: Tests are prohibited from inspecting repository state, service internals, or private implementation details.
*   **No Production Mocking**: Mocking of production internals is forbidden; only external dependencies at the boundary may be simulated.
*   **RED → GREEN Progression**: All implementation must follow a strict Red-Green-Refactor cycle driven by contract tests.

## 5. Failure Semantics
*   **Fail-Closed Everywhere**: Any failure, ambiguity, or unexpected state MUST result in an immediate abort and a secure, closed state.
*   **One Failure Per Test**: Each failure test case must target exactly one failure mode.
*   **No Partial Success**: Execution is atomic; partial completion of a slice or operation is a failure.
*   **No Retries**: Automatic retries are prohibited within the execution logic.
*   **No Background Work**: All operations within the slice must be synchronous and traceable; background processing is excluded from the execution contract.

## 6. Git Hygiene Rules
*   **Feature Branch Per Slice**: Every slice implementation must occur on a dedicated feature branch.
*   **Small, Single-Scope Commits**: Commits must be atomic and focused on a single logical change.
*   **Clean Phase Boundaries**: No untracked or modified files are permitted at the transition between implementation phases.
*   **Immediate Lock Commitment**: Governance locks must be committed and pushed to the remote repository immediately upon generation.
*   **Deployable Main**: The `main` branch must remain in a deployable state at all times.

## 7. Hard Stop Conditions
Execution MUST STOP immediately if any of the following conditions are met:

*   **Dirty Working Tree**: Presence of untracked or modified files outside the current task scope.
*   **Branch Misalignment**: Local branch state diverging from the remote tracking branch.
*   **Contract-Test Impurity**: Tests that depend on internal state or violate boundary isolation.
*   **Scope Creep**: Any attempt to introduce functionality not explicitly defined in the slice artifacts.
*   **Governance Lock Violation**: Any modification to a file or state protected by a finalized governance lock.

## 8. Reuse Declaration
Slice 01 is the reference implementation for this blueprint. All future slices are required to mirror the patterns established in Slice 01. Deviations from these patterns require explicit governance approval. Copying established patterns is mandatory; inventing new execution patterns is forbidden by default.

## 9. Lock Statement
This blueprint is FINAL and IMMUTABLE. Any modifications to this document require a formal governance amendment and a new versioned release of the reference blueprint.
