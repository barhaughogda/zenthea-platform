# Golden Path: Slice 07 — Post-Sign Read Semantics

## 1. Classification
- **Domain**: Clinical Documentation
- **Slice**: 07
- **Type**: Behavioral Specification (Design-Only)
- **Status**: Golden Path

## 2. Actors and Preconditions
### Actors
- **Requestor**: An authenticated entity (human or system) requesting access to a clinical note.
- **Platform**: The Zenthea orchestration and persistence layer.

### Preconditions
- The clinical note exists in the system.
- The clinical note has a status of `SIGNED`.
- The Requestor is authenticated and provides a valid session context.
- The Requestor possesses the required capability for reading clinical documentation.

## 3. Sequential Golden Path Steps
1. **Request Initiation**: Requestor submits a read request for a specific clinical note ID.
2. **Tenant Isolation Verification**: Platform validates that the Requestor's tenant context matches the clinical note's tenant ownership.
3. **Capability Validation**: Platform verifies the Requestor possesses the explicit capability to read signed clinical documentation.
4. **Temporal Integrity Check**: Platform validates the request against the system's temporal constraints (inherited from Slice 04).
5. **State Verification**: Platform confirms the clinical note's current state is exactly `SIGNED`.
6. **Data Retrieval**: Platform retrieves the immutable content and metadata of the signed note.
7. **Audit Emission**: Platform emits a success-only audit event containing request metadata.
8. **Response Delivery**: Platform returns the clinical note data to the Requestor.

## 4. Authorization Gates
The following gates are evaluated in strict sequence. Any failure results in immediate termination (Fail-Closed).

1. **Gate 1: Tenant Isolation**: Ensures cross-tenant data leakage is physically impossible by enforcing a strict tenant ID match.
2. **Gate 2: Capability Check**: Validates the presence of the `clinical.note.read` capability within the Requestor's context.
3. **Gate 3: Temporal Validation**: Ensures the request falls within the allowed system time-window for clinical data access.
4. **Gate 4: State Constraint**: Enforces that only notes in the `SIGNED` state are accessible via this specific semantic path.

## 5. Audit Emission Step
- **Trigger**: Successful completion of all Authorization Gates and data retrieval.
- **Scope**: Success-only.
- **Content**: Metadata-only (Requestor ID, Note ID, Timestamp, Capability used).
- **Frequency**: Exactly once per successful read.

## 6. Deterministic Invariants
- **Fail-Closed**: Any gate failure or system error terminates the process immediately.
- **No Partial Reads**: The Requestor receives either the complete signed note or nothing.
- **Zero-Audit on Failure**: No audit events are emitted for failed or unauthorized requests.
- **Immutability**: The content returned is guaranteed to be the version captured at the moment of signing.

## 7. Explicit Out-of-Scope
- Retries or error recovery logic.
- Mock data or implementation examples.
- Role-based access control (RBAC) or ACL table lookups.
- Handling of `DRAFT` or `LOCKED` states.
- UI/UX presentation logic.
- Audit logging for failures.
