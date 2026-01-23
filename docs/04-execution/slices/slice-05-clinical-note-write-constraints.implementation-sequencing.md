# Slice 05 — Clinical Note Write Constraints: Implementation Sequencing

## Status: DESIGN-ONLY
## Scope Boundary
This document defines the non-negotiable implementation sequence for Slice 05 (Clinical Note Write Constraints). It enforces a strictly layered approach to introducing write validation gates across the system boundary, ensuring deterministic Author-Only and Immutability invariants without side effects or scope creep.

## 1. Permitted vs. Prohibited Changes

### Permitted
- Addition of identity and capability validation logic at the transport and authorization boundaries.
- Enforcement of "Author-Only" invariants in service logic.
- Implementation of state transition validation (DRAFT -> SIGNED).
- Enforcement of immutability for SIGNED notes.
- Metadata-only audit emission for successful write operations.
- Fail-closed error handling for all constraint violations.

### Prohibited
- **NO** parallelization across layers.
- **NO** refactoring of existing code or read paths.
- **NO** introduction of background jobs or asynchronous processing for writes.
- **NO** automated retries for write failures.
- **NO** schema changes or database migrations.
- **NO** introduction of Role-Based Access Control (RBAC), ACL tables, or role hierarchies.
- **NO** administrative overrides or "break-glass" mechanisms.
- **NO** audit emission on validation failure.

## 2. Layered Implementation Sequence

Implementation MUST proceed sequentially through the following layers. Each layer must be fully verified against its assigned Test Matrix IDs before proceeding to the next.

### Layer 1: Transport Boundary
- **Objective**: Validate identity presence, tenant isolation, and basic request shape.
- **Requirements**:
  - Extract identity context and verify presence.
  - Enforce strict tenant isolation (Actor Tenant == Resource/Context Tenant).
  - Fail with 4xx class if identity is missing, malformed, or tenant mismatch occurs.
- **Satisfies**: `S05-TP-01`, `S05-TP-02`.

### Layer 2: Authorization Boundary
- **Objective**: Enforce capability-based access control.
- **Requirements**:
  - Verify the presence of the `Clinical Author` capability for all write paths (Create, Update, Sign).
  - Ensure the actor's capability scope matches the requested operation.
  - Fail-closed (4xx class) if the required capability is missing.
- **Satisfies**: `S05-TP-03`.

### Layer 3: Service Logic (Invariant Enforcement)
- **Objective**: Enforce ownership and state transition invariants.
- **Requirements**:
  - **Ownership**: Verify that only the original Author can mutate or sign a note (`Identity == Author`).
  - **State Transitions**: Enforce the unidirectional state machine (`DRAFT` -> `SIGNED`).
  - **Immutability**: Explicitly reject any mutation or state change for notes already in the `SIGNED` state.
  - **Temporal**: Integrate temporal constraints from Slice 04 for write operations.
- **Satisfies**: `S05-TP-04`, `S05-TP-05`, `S05-TP-06`, `S05-TP-07`, `S05-TP-08`, `S05-TP-12`, `S05-TP-13`.

### Layer 4: Persistence Boundary
- **Objective**: Ensure atomic state mutation and handle resource discovery.
- **Requirements**:
  - Verify resource existence before mutation.
  - Ensure write operations are atomic and fail-closed on persistence errors.
  - Maintain strict separation between validation logic and state changes.
- **Satisfies**: `S05-TP-09`, `S05-TP-10`.

### Layer 5: Audit Emission
- **Objective**: Success-only, metadata-only audit logging.
- **Requirements**:
  - Emit audit event (`NOTE_CREATED`, `NOTE_UPDATED`, `NOTE_SIGNED`) ONLY upon successful completion of the write operation.
  - Audit payload MUST be metadata-only (Actor ID, Tenant ID, Resource ID, Timestamp).
  - **CRITICAL**: Explicitly suppress audit emission on any validation or persistence failure.
- **Satisfies**: `S05-TP-GP`, `S05-TP-11`.

## 3. Hard Stop Rules
- **Layer Lock**: No work on Layer N+1 may begin until Layer N is verified and the working tree is clean.
- **Atomic Failure**: Any constraint violation MUST result in an immediate abort of the operation with zero state mutation.
- **No Side Effects**: Write validation must be side-effect free (excluding success-path auditing).

## 4. Completion Criteria Checklist
- [ ] Layer 1: Transport enforces identity and tenant isolation.
- [ ] Layer 2: Authorization enforces `Clinical Author` capability.
- [ ] Layer 3: Service logic enforces Author-Only and State Transition invariants.
- [ ] Layer 4: Persistence handles resource discovery and atomic writes.
- [ ] Layer 5: Audit is emitted for success and suppressed for all failures.
- [ ] All Slice 05 Test Matrix IDs (S05-TP-GP, S05-TP-01 through S05-TP-13) are satisfied.
- [ ] Zero regression in Slices 01–04.

## 5. Lock Statement
The implementation sequencing for Slice 05 is hereby locked. This document is DESIGN-ONLY and serves as the immutable specification for the execution phase. Any deviation requires a formal slice amendment.
