# Lock Note: Slice 05 — Clinical Note Write Constraints

## Status
- **State**: FINAL
- **Hardening**: HARDENED
- **Mutability**: IMMUTABLE

## Summary
This document locks the design specifications for **Slice 05 — Clinical Note Write Constraints**. This slice defines the strict safety boundaries and state transitions for clinical note creation and modification, ensuring data integrity and regulatory compliance.

## Locked Design Specifications

### 1. Author-Only Write Capability
- Only the original author of a clinical note has the authority to modify it while in `DRAFT` state.
- No other practitioner, regardless of role or administrative status, can modify a note they did not author.

### 2. Deterministic State Machine
- The state transition is strictly linear and deterministic: `DRAFT` → `SIGNED`.
- Once a note is transitioned to `SIGNED`, it is final.

### 3. Post-Sign Immutability
- A clinical note in the `SIGNED` state is **immutable**.
- No further edits, updates, or modifications are permitted to the content of a signed note.

### 4. Tenant Isolation
- All write operations are strictly scoped to the active tenant context.
- Cross-tenant write attempts must result in immediate failure.

### 5. Temporal Constraints
- All write operations must respect the temporal read/write constraints defined in Slice 04.
- Note timestamps and validity periods are enforced at the point of write.

### 6. Audit Emission
- Success-only, metadata-only audit logs must be emitted for every write operation.
- Audit logs must contain sufficient metadata for compliance without exposing Protected Health Information (PHI) in the log stream itself.

## Explicit Prohibitions
- **NO Post-Sign Edits**: Edits to signed notes are strictly forbidden.
- **NO Administrative Overrides**: No "super-user" or administrative role can bypass author-only or immutability constraints.
- **NO Break-Glass Mechanisms**: There are no exceptions or "break-glass" paths for modifying signed clinical notes.
- **NO Role Hierarchies**: Access is based on authorship and tenant context, not complex ACL tables or role hierarchies.
- **NO Async Write Paths**: All clinical note writes must be synchronous. Retries, background jobs, or asynchronous processing of the core write path are prohibited to ensure deterministic state.

## Reference Artifacts
- [Reference Blueprint](./slice-00-reference-blueprint.md)
- [Clinical Note Read Semantics](./slice-00-clinical-note-read-semantics.md)
- [Slice 05: Definition](./slice-05-clinical-note-write-constraints.definition.md)
- [Slice 05: Golden Path](./slice-05-clinical-note-write-constraints.golden-path.md)
- [Slice 05: Failure Matrix](./slice-05-clinical-note-write-constraints.failure-matrix.md)
- [Slice 05: Test Matrix](./slice-05-clinical-note-write-constraints.test-matrix.md)
- [Slice 05: Implementation Sequencing](./slice-05-clinical-note-write-constraints.implementation-sequencing.md)

## Immutability and Amendment Statement
This design is locked. Any future changes to the constraints defined herein require a formal slice amendment process. No implementation-level deviations are permitted.
