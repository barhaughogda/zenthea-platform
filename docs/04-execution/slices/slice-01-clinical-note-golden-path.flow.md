# Golden Path Flow: Clinical Note Lifecycle

## 1. Actors and Boundaries
- **Actor**: Clinician (Single role: `clinician`)
- **Boundaries**: 
  - **Transport**: Entry point for requests.
  - **Authorization Boundary**: Intercepts all requests. Authorization happens once per request and is binary (Allow/Deny).
  - **Service Layer**: Executes business logic (`ClinicalDocumentationService`).
  - **Persistence**: Immutable storage for notes and versions.
  - **Audit Sink**: Captures non-PHI evidence of all operations.

## 2. End-to-end Golden Path

### A) Start Draft
- **Service Call**: `startDraft`
- **Input DTO**: `{ patientId, encounterId, documentationType }`
- **Headers/Context**: `tenantId`, `AuthorityContext` (Clinician)
- **Authorization**: `Allow` if `clinician` role is present and `tenantId` matches.
- **Persistence**: `Create` new `ClinicalNoteDraft` shell and initial `DraftVersion`.
- **Audit Emission**: `NOTE_DRAFT_STARTED`
  - Correlation: `tenantId`, `clinicianId`, `noteId`, `encounterId`, `timestamp`
- **Output DTO**: `{ noteId, status: "DRAFT" }`
- **Fail-closed**: Missing `tenantId`, invalid authority, cross-tenant mismatch.

### B) Update Draft
- **Service Call**: `updateDraft`
- **Input DTO**: `{ noteId, sections: [] }`
- **Headers/Context**: `tenantId`, `AuthorityContext` (Clinician)
- **Authorization**: `Allow` if `clinician` role is present, `tenantId` matches, and clinician is the author.
- **Persistence**: `Update` `ClinicalNoteDraft` (pointer) and `Create` new immutable `DraftVersion`.
- **Audit Emission**: `NOTE_DRAFT_UPDATED`
  - Correlation: `tenantId`, `clinicianId`, `noteId`, `encounterId`, `timestamp`
- **Output DTO**: `{ noteId, versionNumber, status: "DRAFT" }`
- **Fail-closed**: Note not found, finalized conflict, cross-tenant mismatch.

### C) Sign (Finalize)
- **Service Call**: `finalizeNote`
- **Input DTO**: `{ noteId }`
- **Headers/Context**: `tenantId`, `AuthorityContext` (Clinician)
- **Authorization**: `Allow` if `clinician` role is present, `tenantId` matches, and clinician is the author.
- **Persistence**: `Update` `ClinicalNoteDraft` status to `SIGNED`.
- **Audit Emission**: `NOTE_FINALIZED`
  - Correlation: `tenantId`, `clinicianId`, `noteId`, `encounterId`, `timestamp`
- **Output DTO**: `{ noteId, status: "SIGNED" }`
- **Fail-closed**: Note already signed, note not found, cross-tenant mismatch.

### D) Read Signed
- **Service Call**: `readNote`
- **Input DTO**: `{ noteId }`
- **Headers/Context**: `tenantId`, `AuthorityContext` (Clinician)
- **Authorization**: `Allow` if `clinician` role is present and `tenantId` matches.
- **Persistence**: `Read` `ClinicalNoteDraft` and latest `DraftVersion`.
- **Audit Emission**: `NOTE_READ`
  - Correlation: `tenantId`, `clinicianId`, `noteId`, `encounterId`, `timestamp`
- **Output DTO**: `{ noteId, content, status: "SIGNED" }`
- **Fail-closed**: Note not found, cross-tenant mismatch.

## 3. Out-of-Scope (Explicitly Non-Existent)
The following features are NOT implemented and must fail-closed if attempted:
- Editing after signing (Forbidden)
- Multi-role access (Only `clinician` role allowed)
- Sharing
- Templates
- Search
- Export
- Background jobs
- Notifications
- Analytics

## 4. State Machine (Single Path)
- **Transitions**: `DRAFT` -> `SIGNED`
- **Invariants**: 
  - `SIGNED` is immutable. 
  - Any `updateDraft` call on a `SIGNED` note must fail-closed with `ConflictError`.

## 5. Determinism and Safety Invariants
- **No Background Jobs**: All operations are synchronous and atomic.
- **No Retries**: Semantics-changing retries are forbidden.
- **No PHI in Logs**: Audit payloads and error messages must never contain PHI/PII.
- **Fail-Closed**: Any ambiguity in authorization or tenant context results in immediate denial.
- **Tenant Isolation**: Mandatory at every boundary and query level.

## 6. Traceability Map
| Operation | Authorization Check | Persistence Action | Audit Event |
| :--- | :--- | :--- | :--- |
| Start Draft | Role + Tenant Check | Create Draft + Version | `NOTE_DRAFT_STARTED` |
| Update Draft | Role + Tenant + Author | Create Version | `NOTE_DRAFT_UPDATED` |
| Sign Note | Role + Tenant + Author | Update Status (SIGNED) | `NOTE_FINALIZED` |
| Read Note | Role + Tenant Check | Read Draft + Version | `NOTE_READ` |
