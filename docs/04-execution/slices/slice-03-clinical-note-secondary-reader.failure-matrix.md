# Failure Matrix: Slice 03 - Clinical Note Secondary Reader

## 1. Purpose
This document defines the comprehensive taxonomy of failure modes for the Clinical Note Secondary Reader slice. It specifies the deterministic, fail-closed outcomes for all invalid or unauthorized access attempts.

## 2. Failure Matrix

| Failure ID | Trigger Condition | Expected System Behavior | Authorization Outcome | Audit Outcome | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S03-FM-01 | Requesting user is the author of the note | Abort request; secondary read logic is not applicable to authors. | DENIED | No Audit (Pre-auth failure) | Author access is handled by primary read logic (Slice 02). |
| S03-FM-02 | Note is in `DRAFT` state | Abort request; secondary readers cannot access drafts. | DENIED | No Audit (Pre-auth failure) | Access restricted to `SIGNED` notes only. |
| S03-FM-03 | Note is in `PENDING_SIGNATURE` state | Abort request; secondary readers cannot access notes pending signature. | DENIED | No Audit (Pre-auth failure) | Access restricted to `SIGNED` notes only. |
| S03-FM-04 | Tenant ID mismatch (Cross-tenant attempt) | Abort request; absolute tenant isolation violation. | DENIED | SECURITY_VIOLATION | Critical security boundary. Return generic error to prevent leakage. |
| S03-FM-05 | User role is not authorized for secondary read | Abort request; role lacks `NOTE_READ` authority for non-authored notes. | DENIED | No Audit (Pre-auth failure) | Only specific clinical roles (e.g., Supervisor) are permitted. |
| S03-FM-06 | Note ID does not exist | Abort request; resource not found. | DENIED | No Audit (Pre-auth failure) | Return generic `NotFound` or `AccessDenied`. |
| S03-FM-07 | Missing authentication headers | Abort request; unauthenticated request. | DENIED | No Audit (Pre-auth failure) | Transport boundary failure. |
| S03-FM-08 | Invalid or expired session | Abort request; session context unavailable. | DENIED | No Audit (Pre-auth failure) | Transport boundary failure. |
| S03-FM-09 | Attempted write operation (POST/PUT/DELETE) | Abort request; secondary access is strictly read-only. | DENIED | No Audit (Pre-auth failure) | Secondary readers have no write authority. |

## 3. Failure Semantics
- **Fail-Closed**: All failures result in the most restrictive state (Access Denied).
- **No Information Leakage**: Errors returned to the actor must not reveal the existence of a note or details about tenant boundaries if the request is unauthorized.
- **Deterministic Abort**: The system must stop processing immediately upon encountering any of the above conditions.

---
**Classification**: DESIGN-ONLY. NON-EXECUTABLE.
