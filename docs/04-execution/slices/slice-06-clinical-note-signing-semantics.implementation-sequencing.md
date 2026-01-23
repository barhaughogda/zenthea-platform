# DESIGN-ONLY: Clinical Note Signing Semantics - Implementation Sequencing

## 1. PURPOSE AND SCOPE
This document governs the implementation sequencing for the `SignNote` operation. It defines the mandatory order of operations, boundary responsibilities, and fail-closed behaviors required to ensure the integrity of the signing process.

Signing is a **terminal, irreversible transition**. Once a note enters the `SIGNED` state, it is immutable and cannot be reverted to `DRAFT` or any other state.

## 2. EXPLICIT PROHIBITIONS
The following are strictly prohibited in the implementation of Slice 06:
- **No Retries**: Any failure at any layer must result in an immediate failure response to the caller.
- **No Background Jobs**: The entire signing sequence must occur within the request/response lifecycle.
- **No Partial Commits**: State transitions and audit emissions must be atomic; partial success is a system failure.
- **No Optimistic Locking**: State transitions must be governed by strict pessimistic or version-based gating.
- **No Refactors**: This slice implements signing logic only; no existing code should be refactored.
- **No Cryptography or UI Concerns**: This document governs logic and persistence boundaries only.
- **No Overrides, Admin Bypasses, or Recovery Paths**: The signing rules apply to all actors without exception.

## 3. MANDATORY LAYER ORDER
Implementation must follow this exact sequence. No layer may be bypassed or reordered.

1. **Transport Boundary**: Request validation and context extraction.
2. **Authorization Boundary**: Identity and capability verification.
3. **Service Logic**: State gating, invariant checking, and transition preparation.
4. **Persistence Boundary**: Atomic state mutation.
5. **Audit Boundary**: Immutable evidence emission.

## 4. LAYER-BY-LAYER SEQUENCING

### 4.1 Transport Boundary
- **Allowed Responsibilities**:
  - Extract Tenant ID and Actor Identity from request context.
  - Validate presence of required `noteId`.
- **Forbidden Responsibilities**:
  - Database lookups.
  - Business logic validation.
- **Failure Behavior**: Return 4xx Class (Fail-closed).
- **Test Mapping**: S06-TM-02, S06-TM-03.

### 4.2 Authorization Boundary
- **Allowed Responsibilities**:
  - Verify Actor has `Signing Capability`.
  - Verify Tenant isolation (Actor belongs to the target Tenant).
- **Forbidden Responsibilities**:
  - Loading the Note resource (this happens in Service Logic).
- **Failure Behavior**: Return 4xx Class (Fail-closed).
- **Test Mapping**: S06-TM-04, S06-TM-05.

### 4.3 Service Logic
- **Allowed Responsibilities**:
  - Load the Note resource.
  - Verify Note exists (S06-TM-06).
  - Verify Note is in `DRAFT` state (S06-TM-07, S06-TM-08).
  - Apply Author-only signing policies if applicable (S06-TM-09).
  - Acquire secure timestamp for the transition (S06-TM-10).
- **Forbidden Responsibilities**:
  - Directly writing to the database.
  - Emitting audit logs.
- **Failure Behavior**: Return 4xx/5xx Class (Fail-closed).
- **Test Mapping**: S06-TM-06, S06-TM-07, S06-TM-08, S06-TM-09, S06-TM-10.

### 4.4 Persistence Boundary
- **Allowed Responsibilities**:
  - Execute atomic update: `state = SIGNED`, `signedAt = timestamp`, `signedBy = actorId`.
  - Ensure update only succeeds if current state is `DRAFT`.
- **Forbidden Responsibilities**:
  - Post-commit logic (must return to Service Logic first).
- **Failure Behavior**: Return 5xx Class (Fail-closed).
- **Test Mapping**: S06-TM-11.

### 4.5 Audit Boundary
- **Allowed Responsibilities**:
  - Emit exactly-once audit event containing the terminal state transition evidence.
- **Forbidden Responsibilities**:
  - Any mutation of the Note resource.
- **Failure Behavior**: Return 5xx Class (Fail-closed). **CRITICAL**: If audit emission fails, the request MUST be treated as a failure even if persistence succeeded (though in a strictly atomic system, these should be bound).
- **Test Mapping**: S06-TM-12, S06-TM-01 (Success).

## 5. ATOMICITY AND IRREVERSIBILITY GUARANTEES
- **Persistence First**: The state mutation in the persistence layer must be confirmed before the audit event is emitted.
- **Audit Non-Omittability**: A successful `SignNote` response MUST be accompanied by a successful audit emission. Failure to audit MUST result in a 5xx error.
- **Terminal State**: Once the state is `SIGNED`, no further transitions (except those defined in future archival/deletion slices) are permitted.

## 6. COMPLETION CRITERIA CHECKLIST
- [ ] All S06-TM tests (01 through 12) satisfied at the boundary.
- [ ] Exactly-once audit emission on success (S06-TM-01).
- [ ] Zero audit emission on any failure (S06-TM-02 through S06-TM-12).
- [ ] Zero state mutation on any failure.
- [ ] No new states or intermediate statuses introduced.

## 7. LOCK DECLARATION
This document is **FINAL** and **IMMUTABLE**. It defines the governed implementation path for Slice 06. Any deviation from this sequencing or these prohibitions requires a formal design amendment and approval.
