# Golden Path Flow — Slice 02: Clinical Note Read Expansion

## 1. Actors and Boundaries
- **Requestor**: A non-author clinician authenticated within the system.
- **Transport Boundary**: The entry point for the read request, responsible for initial validation and context extraction.
- **Authorization Boundary**: The gatekeeper that evaluates access rights based on tenant membership, role, and note state.
- **Service Logic**: The core business logic that orchestrates the retrieval process.
- **Persistence Layer**: The system of record where clinical note data and version history are stored.
- **Audit Sink**: The destination for mandatory security and access event logging.

## 2. Preconditions for Success
- The requesting clinician is authenticated and possesses a valid `AuthorityContext` with the `clinician` role.
- The requesting clinician belongs to the same tenant as the target clinical note.
- The target clinical note exists in the persistence layer.
- The target clinical note is in the `SIGNED` state.
- The requesting clinician is NOT the author of the clinical note (author access is governed by Slice 01).
- All system dependencies (Persistence, Audit Sink) are operational.

## 3. End-to-End Flow
1. **Transport Entry**: The requestor initiates a read request for a specific clinical note ID. The transport layer extracts the `tenantId` and `AuthorityContext` from the request headers and validates that the request is well-formed.
2. **Authorization Boundary**: The system verifies that the requestor's `tenantId` matches the note's `tenantId`. It further confirms the requestor has the `clinician` role and that the note state is `SIGNED`. Access is granted as a binary "Allow" decision.
3. **Service Logic**: The service layer receives the authorized request and coordinates the retrieval of the clinical note and its latest signed version from the persistence layer.
4. **Persistence Read**: The persistence layer performs a tenant-scoped query to retrieve the clinical note metadata and the content of the finalized version.
5. **Audit Emission**: Upon successful retrieval, the service layer emits a `NOTE_READ` audit event to the audit sink. The event includes the Requestor ID, Target Note ID, Tenant ID, Timestamp, and a "Success" outcome.
6. **Response Delivery**: The system returns the clinical note content and metadata to the requestor via the transport layer.

## 4. Output Contract
The system returns a structured response containing:
- Clinical note metadata (ID, Patient ID, Encounter ID, Author ID, Created Timestamp).
- The current state of the note (`SIGNED`).
- The full clinical content of the finalized version.
- The timestamp of finalization.

## 5. Determinism & Safety Invariants
- **Tenant Isolation**: Access is strictly limited to the tenant boundary; cross-tenant requests must never succeed.
- **State Integrity**: Non-author access is only possible for notes in the `SIGNED` state.
- **Immutability**: The read operation is strictly non-mutating; no data in the persistence layer is modified.
- **Audit Synchronicity**: The operation is only considered successful if the audit event is successfully emitted.
- **Fail-Closed**: Any failure in authorization or verification results in an immediate denial with no data leakage.

## 6. Explicit Non-Goals
- Access to clinical notes in the `DRAFT` state by non-authors.
- Modification of clinical note content or metadata by non-authors.
- Searching, filtering, or listing multiple clinical notes.
- Administrative overrides or "break-glass" access paths.
- Patient or external party access to clinical notes.
- Redaction or partial masking of clinical content.
