# Failure & Denial Matrix: Clinical Note Lifecycle

## 1. Principles
- Fail-closed by default
- One request → one decision → one outcome
- No partial success
- No silent fallback
- No retries that change semantics
- Authorization failures are final
- State conflicts are explicit

## 2. Failure Domains

### Transport Validation
Failures occurring at the boundary of the platform before business logic is invoked. Includes malformed payloads, missing headers, or invalid schema.

### Authorization Boundary
Failures where the provided identity or context does not meet the requirements for the requested operation. Includes missing tenant context, invalid authority, or insufficient role.

### Service-Level Validation
Failures where the request is well-formed and authorized but refers to non-existent or invalid entities. Includes missing Patient, Encounter, or Note references.

### State Machine Violations
Failures where the requested operation is illegal given the current state of the resource. Includes attempts to modify finalized records.

### Persistence Errors
Failures where the underlying storage layer cannot complete the requested operation. Includes connection loss or storage exhaustion.

### Concurrency / Conflict
Failures where multiple actors attempt to modify the same resource simultaneously, or a stale version is provided.

### Audit Emission Failures
Failures where the required audit record cannot be durably committed to the audit sink.

## 3. Failure Matrix

| Operation | Failure Condition | Detection Point | Error Type | HTTP Status | Retry Allowed | Audit Event |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| startDraft | Missing tenantId | Transport | ValidationError | 400 | No | None |
| startDraft | Invalid tenantId | Authorization | AuthError | 403 | No | SecurityEvidence |
| startDraft | Missing AuthorityContext | Transport | ValidationError | 400 | No | None |
| startDraft | Invalid AuthorityContext | Authorization | AuthError | 401 | No | SecurityEvidence |
| startDraft | Role missing (non-clinician) | Authorization | AuthError | 403 | No | SecurityEvidence |
| startDraft | Patient not found | Service | NotFoundError | 404 | No | ClinicalNoteRequested |
| startDraft | Encounter not found | Service | NotFoundError | 404 | No | ClinicalNoteRequested |
| startDraft | Persistence write failure | Persistence | SystemError | 500 | No | ClinicalNoteRequested |
| startDraft | Audit sink unavailable | Service | SystemError | 500 | No | None |
| updateDraft | Note not found | Service | NotFoundError | 404 | No | ClinicalNoteUpdateRequested |
| updateDraft | Cross-tenant access attempt | Authorization | AuthError | 403 | No | SecurityEvidence |
| updateDraft | Update after signing | State | ConflictError | 409 | No | ClinicalNoteUpdateRequested |
| updateDraft | Concurrent modification | Concurrency | ConflictError | 409 | No | ClinicalNoteUpdateRequested |
| updateDraft | Persistence write failure | Persistence | SystemError | 500 | No | ClinicalNoteUpdateRequested |
| finalizeNote | Note not found | Service | NotFoundError | 404 | No | ClinicalNoteFinalizationRequested |
| finalizeNote | Draft already signed | State | ConflictError | 409 | No | ClinicalNoteFinalizationRequested |
| finalizeNote | Persistence write failure | Persistence | SystemError | 500 | No | ClinicalNoteFinalizationRequested |
| readNote | Note not found | Service | NotFoundError | 404 | No | ClinicalNoteReadRequested |
| readNote | Cross-tenant access attempt | Authorization | AuthError | 403 | No | SecurityEvidence |
| readNote | Persistence read failure | Persistence | SystemError | 500 | No | ClinicalNoteReadRequested |

## 4. Authorization Failures
- Authorization failures MUST NOT emit business audit events.
- Authorization failures MAY emit security audit evidence (non-PHI) for intrusion detection and monitoring.
- Authorization is binary and final; no partial access or escalated retries are permitted.

## 5. State Violations
- Updating a SIGNED note is strictly forbidden to ensure clinical record integrity and non-repudiation.
- State violations MUST return ConflictError (409) to indicate that the resource state is incompatible with the request.
- Retries are forbidden as the state transition to SIGNED is terminal for the draft.

## 6. Audit Failure Semantics
- If audit emission fails, the entire request MUST fail.
- No “best effort” audit; the business transaction and the audit record are atomically bound.
- No delayed audit or background recovery; the audit must be synchronous with the operation.

## 7. Explicit Non-Existence
The following capabilities do not exist within Slice 01:
- Soft deletes (all deletions, if ever permitted, are hard deletions)
- Draft recovery (deleted or lost drafts cannot be restored)
- Undo (operations cannot be reversed)
- Version rollback (previous states of a draft are not restorable)
- Partial reads (notes are read in their entirety or not at all)
- Admin overrides (no bypass of state or authorization rules)

## 8. Lock Statement
This failure matrix is FINAL for Slice 01.
Any new failure mode requires an explicit amendment and re-commit.