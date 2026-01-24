# Encounter Slice 03 — Temporal & State Visibility Constraints

## 1. PURPOSE
This document defines the mandatory temporal and lifecycle-state constraints governing Encounter visibility. These constraints function as immutable gates that must be satisfied to permit access to Encounter data. This slice is strictly additive, composing directly upon the foundations established in Slice 01 (Lifecycle) and Slice 02 (Authorization & Visibility).

## 2. TEMPORAL CONSTRAINT MODEL
Visibility of an Encounter is strictly contingent upon the validity of the request time relative to defined temporal windows.

- **Mandatory Validation**: Visibility is permitted ONLY when the provided request time falls within the valid temporal window defined for the Encounter.
- **Explicit Context**: Temporal context MUST be explicitly provided within the request and validated against the Encounter's temporal metadata.
- **No Implicit Clock**: The system MUST NOT rely on implicit system clock assumptions for visibility resolution. All temporal evaluations must use the explicitly provided context.
- **Fail-Closed Requirement**: Requests with missing, malformed, or ambiguous temporal context MUST result in immediate visibility denial.

## 3. STATE-BASED VISIBILITY
Encounter visibility is a deterministic function of its current lifecycle state as defined in Slice 01.

- **State Derivation**: Visibility is strictly derived from the Encounter's immutable lifecycle state at the moment of the request.
- **Explicit Visibility Matrix**: Only states explicitly designated as 'Visible' permit data access. All other states are 'Forbidden'.
- **No Transitional Visibility**: Visibility is binary. There is no partial visibility during state transitions, nor is there speculative visibility for anticipated states.
- **No State Coercion**: The visibility resolution process MUST NOT modify, advance, or coerce the Encounter state.

## 4. COMPOSITION RULES
Temporal and state-based constraints are evaluated within a strict sequence of operations:

- **Temporal Sequence**: Temporal constraints are evaluated AFTER successful tenant isolation and authorization (Slice 02), but BEFORE any business logic execution or data retrieval.
- **State Sequence**: State visibility checks are evaluated AFTER temporal validation but BEFORE any persistence layer access.
- **Cumulative Enforcement**: Visibility is granted ONLY if all preceding and current slice constraints are satisfied.

## 5. AUDIT RULES
Audit integrity is maintained through strict emission rules:

- **Success Emission**: Audit logs are emitted ONLY upon successful resolution of all visibility constraints.
- **Failure Silence**: ZERO audit emission shall occur for failures originating from temporal or state-based violations. This prevents information leakage regarding the existence or state of an Encounter.

## 6. EXPLICIT PROHIBITIONS
The following actions and behaviors are strictly prohibited:

- **No Overrides**: Manual, administrative, or emergency overrides of temporal or state constraints are forbidden.
- **No Grace Periods**: Temporal windows are absolute; no grace periods or buffers are permitted.
- **No Retries**: Violation of a temporal or state constraint results in immediate termination of the request with no provision for retry within the same execution context.
- **No Background Reconciliation**: Visibility must be resolved synchronously; background reconciliation of visibility state is prohibited.
- **No Mutation**: The visibility check is a read-only operation; it MUST NOT mutate the Encounter or any related state.
- **Capability-Based Language**: All constraints are defined in terms of system capabilities and requirements; role-based language is prohibited.

## 7. FAILURE PHILOSOPHY
The system adheres to a strict fail-closed philosophy:

- **Immediate Termination**: The first violation of any temporal or state constraint MUST result in immediate termination of the request.
- **No Partial Reads**: If visibility is denied, no portion of the Encounter data shall be retrieved or returned.
- **No Detail Leakage**: Failure responses MUST NOT contain details regarding which constraint was violated or the current state of the Encounter.

## 8. PHASE BOUNDARY
This document is a DESIGN-ONLY specification. It defines the logical constraints and governing principles for temporal and state-based visibility. It contains no implementation details, schemas, API definitions, or code references.
