# Test Matrix: Clinical Note Lifecycle (Slice 01)

## 1. Purpose
- This document defines the COMPLETE and REQUIRED test coverage for Slice 01 (Clinical Note Lifecycle).
- Implementation is non-compliant unless every row in this matrix is satisfied.
- This matrix serves as the definitive source of truth for verifying the correctness of the Clinical Documentation Service.

## 2. Test Principles
- **One test = one assertion**: Each test case focuses on a single specific condition.
- **No combined scenarios**: Tests must not chain multiple failure modes or success paths unless explicitly required for state transition.
- **No implicit coverage**: Every requirement must be explicitly tested.
- **Failures must be deterministic**: Tests must produce the same result every time given the same inputs and state.
- **Independence**: Authorization, state, persistence, and audit are tested independently.
- **Outcome and Side Effects**: Tests assert both the final outcome (success/error) AND the presence or absence of side effects (persistence writes, audit emissions).

## 3. Test Matrix Table

| Test ID | Operation | Scenario | Precondition | Input | Expected Outcome | Expected State Change | Expected Audit Event | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S01-GP-01** | `startDraft` | Successful draft creation | Valid clinician context | Valid `patientId`, `encounterId` | Success (201) | New `ClinicalNoteDraft` created (status: DRAFT) | `NOTE_DRAFT_STARTED` | Golden Path Start |
| **S01-GP-02** | `updateDraft` | Successful draft update | Draft exists (status: DRAFT), same author | Valid `sections` | Success (200) | New `DraftVersion` created | `NOTE_DRAFT_UPDATED` | Golden Path Update |
| **S01-GP-03** | `finalizeNote` | Successful note finalization | Draft exists (status: DRAFT), same author | `noteId` | Success (200) | Draft status updated to SIGNED | `NOTE_FINALIZED` | Golden Path Finalize |
| **S01-GP-04** | `readNote` | Successful read of signed note | Note exists (status: SIGNED) | `noteId` | Success (200) | None | `NOTE_READ` | Golden Path Read |
| **S01-FM-01** | `startDraft` | Missing tenantId | None | Missing `tenantId` header | ValidationError (400) | None | None | Failure Matrix 3.39 |
| **S01-FM-02** | `startDraft` | Invalid tenantId | None | Invalid `tenantId` format | AuthError (403) | None | `SecurityEvidence` | Failure Matrix 3.40 |
| **S01-FM-03** | `startDraft` | Missing AuthorityContext | None | Missing `AuthorityContext` | ValidationError (400) | None | None | Failure Matrix 3.41 |
| **S01-FM-04** | `startDraft` | Invalid AuthorityContext | None | Malformed `AuthorityContext` | AuthError (401) | None | `SecurityEvidence` | Failure Matrix 3.42 |
| **S01-FM-05** | `startDraft` | Wrong role (non-clinician) | Valid context, wrong role | User without `clinician` role | AuthError (403) | None | `SecurityEvidence` | Failure Matrix 3.43 |
| **S01-FM-06** | `startDraft` | Patient not found | Valid clinician context | Non-existent `patientId` | NotFoundError (404) | None | `ClinicalNoteRequested` | Failure Matrix 3.44 |
| **S01-FM-07** | `startDraft` | Encounter not found | Valid clinician context | Non-existent `encounterId` | NotFoundError (404) | None | `ClinicalNoteRequested` | Failure Matrix 3.45 |
| **S01-FM-08** | `startDraft` | Persistence write failure | Valid clinician context | Valid inputs | SystemError (500) | None | `ClinicalNoteRequested` | Failure Matrix 3.46 |
| **S01-FM-09** | `startDraft` | Audit sink unavailable | Valid clinician context | Valid inputs | SystemError (500) | None | None | Failure Matrix 3.47; Rollback required |
| **S01-FM-10** | `updateDraft` | Note not found | Valid clinician context | Non-existent `noteId` | NotFoundError (404) | None | `ClinicalNoteUpdateRequested` | Failure Matrix 3.48 |
| **S01-FM-11** | `updateDraft` | Cross-tenant access | Note exists in Tenant B | Request from Tenant A | AuthError (403) | None | `SecurityEvidence` | Failure Matrix 3.49 |
| **S01-FM-12** | `updateDraft` | Update after signing | Note exists (status: SIGNED) | Valid `sections` | ConflictError (409) | None | `ClinicalNoteUpdateRequested` | Failure Matrix 3.50 |
| **S01-FM-13** | `updateDraft` | Concurrent update conflict | Note exists (status: DRAFT) | Stale version number | ConflictError (409) | None | `ClinicalNoteUpdateRequested` | Failure Matrix 3.51 |
| **S01-FM-14** | `updateDraft` | Persistence write failure | Note exists (status: DRAFT) | Valid inputs | SystemError (500) | None | `ClinicalNoteUpdateRequested` | Failure Matrix 3.52 |
| **S01-FM-15** | `finalizeNote` | Note not found | Valid clinician context | Non-existent `noteId` | NotFoundError (404) | None | `ClinicalNoteFinalizationRequested` | Failure Matrix 3.53 |
| **S01-FM-16** | `finalizeNote` | Draft already signed | Note exists (status: SIGNED) | `noteId` | ConflictError (409) | None | `ClinicalNoteFinalizationRequested` | Failure Matrix 3.54 |
| **S01-FM-17** | `finalizeNote` | Persistence write failure | Note exists (status: DRAFT) | `noteId` | SystemError (500) | None | `ClinicalNoteFinalizationRequested` | Failure Matrix 3.55 |
| **S01-FM-18** | `readNote` | Note not found | Valid clinician context | Non-existent `noteId` | NotFoundError (404) | None | `ClinicalNoteReadRequested` | Failure Matrix 3.56 |
| **S01-FM-19** | `readNote` | Cross-tenant access | Note exists in Tenant B | Request from Tenant A | AuthError (403) | None | `SecurityEvidence` | Failure Matrix 3.57 |
| **S01-FM-20** | `readNote` | Persistence read failure | Note exists | `noteId` | SystemError (500) | None | `ClinicalNoteReadRequested` | Failure Matrix 3.58 |

## 4. Required Coverage (Explicit)
The implementation MUST include tests for the following scenarios as defined in the matrix:
- **Tenant Context**: Missing `tenantId`, Invalid `tenantId`, Cross-tenant access.
- **Authority**: Missing `AuthorityContext`, Invalid `AuthorityContext`, Wrong role (`clinician` required).
- **Entity Integrity**: Patient not found, Encounter not found, Note not found.
- **State Machine**: Update after signing, Finalize already signed note.
- **Concurrency**: Concurrent update conflict (Optimistic Locking).
- **Infrastructure**: Persistence write failure, Persistence read failure, Audit sink unavailable.
- **Lifecycle**: Successful draft creation, update, finalization, and read.

## 5. Prohibited Content
The following capabilities do NOT exist in Slice 01 and therefore have NO tests:
- Editing after signing
- Soft deletes
- Undo
- Rollback (except for atomic failure handling)
- Background jobs
- Partial reads
- Admin override paths

## 6. Lock Statement
- This Test Matrix is FINAL for Slice 01.
- Adding new behavior or changing existing semantics requires a synchronized update to:
  - Execution Slice
  - Golden Path Flow
  - Failure Matrix
  - Test Matrix
- All documents must be updated and re-committed together to maintain architectural integrity.
