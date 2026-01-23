# DESIGN-ONLY: Clinical Note Write Constraints

## 1. CLASSIFICATION
- **Document Type**: DESIGN-ONLY
- **Governance Level**: WRITE PATH SPECIFICATION
- **Scope**: WRITE PATHS ONLY (Creation, Mutation, Finalization)
- **Status**: DRAFT / PROPOSED

## 2. PURPOSE
This document defines the complete, deterministic WRITE constraint model for Clinical Notes within the Zenthea Platform. It governs the lifecycle of a note from initial creation through mutation to its final, immutable state. This specification introduces no implementation details and focuses exclusively on the capability-based authorization and state transition logic required for secure, regulator-grade clinical documentation.

## 3. DETERMINISTIC WRITE DECISION MODEL
All write operations (Create, Update, Sign) must undergo a multi-stage deterministic evaluation. Failure at ANY stage results in immediate termination of the request (fail-closed). The evaluation order is fixed:

1.  **Identity Context**: Verification of the requesting actor's identity and active session.
2.  **Tenant Isolation**: Strict verification that the actor and the target resource (or parent context) belong to the same tenant.
3.  **Capability Scope**: Verification that the actor possesses the specific capability required for the write path (e.g., Clinical Author).
4.  **State Transition Validity**: Verification that the requested transition is permitted from the current resource state.
5.  **Ownership Invariant**: Verification that only the original Author can mutate or sign the note.

## 4. STATE TRANSITION RULES
Clinical Notes follow a strict, unidirectional state machine.

| Current State | Operation | Target State | Constraint |
| :--- | :--- | :--- | :--- |
| (Non-existent) | Create | `DRAFT` | Requires `Clinical Author` capability. |
| `DRAFT` | Update | `DRAFT` | Permitted ONLY for the original Author. |
| `DRAFT` | Sign | `SIGNED` | Permitted ONLY for the original Author. Terminal transition. |
| `SIGNED` | (Any) | (None) | **FORBIDDEN**. State is immutable. |

### Forbidden Transitions:
- `SIGNED` → `DRAFT` (No un-signing or reverting to draft).
- `DRAFT` → (Deleted) (Deletion is not supported in this model).
- `SIGNED` → (Deleted) (Deletion is not supported in this model).

## 5. AUTHOR-ONLY INVARIANTS
The "Author-Only" principle is a hard invariant of the write model:
- **Exclusivity**: Only the actor who initiated the `Create` operation (the Author) is permitted to perform `Update` or `Sign` operations on that specific note.
- **No Delegation**: The ability to mutate a draft cannot be delegated to another actor, regardless of their capabilities or roles.
- **No Transfer**: Ownership of a clinical note cannot be transferred between actors.

## 6. IMMUTABILITY GUARANTEES
Once a note enters the `SIGNED` state, it becomes architecturally immutable:
- **No Edits**: No further modifications to the content, metadata, or state are permitted.
- **No Corrections**: This slice does not support corrections, amendments, or addenda.
- **No Overrides**: No administrative or system-level override can modify a `SIGNED` note.

## 7. AUDIT EMISSION RULES
Audit integrity is maintained through strict emission protocols for write operations:
- **Event Type**: `NOTE_CREATED`, `NOTE_UPDATED`, `NOTE_SIGNED`.
- **Condition**: Emitted EXACTLY ONCE upon the successful completion of the write operation.
- **Failures**: ZERO audit emission on authorization failure or constraint violation (to prevent side-channel leakage).
- **Payload**: Metadata-only. Includes Actor ID, Tenant ID, Resource ID, and Timestamp. No clinical content (PHI) is permitted in the audit trail.

## 8. EXPLICIT NON-EXISTENCE
The following mechanisms are explicitly excluded from the Clinical Note Write Model:
- **No Post-Sign Edits**: No mechanism exists to modify a note after it has been signed.
- **No Overrides**: No "break-glass" or administrative bypasses exist for write constraints.
- **No Admins**: Administrative identities have no inherent privilege to mutate or sign clinical notes.
- **No Retries**: Write failures at the authorization or state boundary are terminal; no automated retry logic is permitted.
- **No Soft Failures**: Partial success is impossible; any constraint violation results in a total abort of the write operation.

## 9. PHASE BOUNDARY AND GOVERNANCE INTENT
This document defines the boundary for Slice 05. It establishes the "What" of the write constraints, leaving the "How" to subsequent implementation slices. Any deviation from these constraints during implementation constitutes a governance violation.
