# Slice 03: Clinical Note Secondary Reader

## 1. Slice Intent
Extend read access to signed clinical notes to a designated secondary clinical role (e.g., supervisor or co-signer) within the same tenant. This slice focuses on the minimal expansion of the read boundary while maintaining strict fail-closed security and absolute tenant isolation.

## 2. In-Scope Capabilities
- **Secondary Role Read Access**: Enable a second clinical role to perform `NOTE_READ` operations on notes they did not author.
- **Signed Note Restriction**: Access is strictly limited to clinical notes that have reached the `SIGNED` state.
- **Tenant-Locked Retrieval**: Ensure all secondary read operations are performed within the same tenant boundary as the original note.
- **Audit Logging**: Explicit capture of `NOTE_READ` events for secondary readers, including metadata (timestamp, reader ID, role, note ID).

## 3. Explicit Non-Goals
- **No ACL Tables**: No introduction of Access Control List tables or complex permission mapping.
- **No Role Hierarchies**: No implementation of hierarchical role structures or inheritance.
- **No Feature Flags**: No conditional logic gated by feature flags.
- **No Policy Engines**: No external or internal policy evaluation engines.
- **No Write Access**: Absolute exclusion of any create, update, or delete capabilities for secondary readers.
- **No Draft Access**: Secondary readers cannot access notes in `DRAFT` or `PENDING_SIGNATURE` states.

## 4. Actors and Authority Context
- **Primary Author**: The clinician who created and signed the note. Retains existing read/write authority.
- **Secondary Reader**: A clinician within the same tenant with a designated role (e.g., Supervisor) requiring read-only access to signed records.
- **Authority Context**: Authority is derived from the combination of `TenantID`, `UserRole`, and `NoteState`.

## 5. State Preconditions
- The Clinical Note must exist and be in the `SIGNED` state.
- The Secondary Reader must be authenticated and belong to the same `TenantID` as the note.
- The Secondary Reader must possess a recognized clinical role authorized for secondary reading.

## 6. Audit Requirements
- Every successful secondary read must emit a `NOTE_READ` audit event.
- Audit events must contain:
  - `EventID`
  - `Timestamp`
  - `ActorID` (Secondary Reader)
  - `ActorRole`
  - `NoteID`
  - `TenantID`
  - `AccessType` (Secondary)
- No clinical content (PHI) is to be stored in the audit log; metadata only.

## 7. Failure Semantics
- **Fail-Closed**: Any ambiguity in role, tenant alignment, or note state must result in an immediate `AccessDenied` response.
- **State Mismatch**: Attempts to read notes not in the `SIGNED` state by a secondary reader must fail with `UnauthorizedStateAccess`.
- **Tenant Mismatch**: Any cross-tenant access attempt must be treated as a critical security violation and return a generic `NotFound` or `AccessDenied` to prevent information leakage.

## 8. Phase Boundary Statement
This slice is a DESIGN-ONLY specification. It defines the contract and constraints for secondary reader access. No executable code, database migrations, or configuration changes are authorized within this slice. Implementation is deferred to subsequent executable slices.

---
**Classification**: DESIGN-ONLY. NON-EXECUTABLE.
