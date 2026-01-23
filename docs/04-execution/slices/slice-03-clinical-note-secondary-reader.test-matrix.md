# Test Matrix: Slice 03 - Clinical Note Secondary Reader

## 1. Purpose
This document defines the DESIGN-ONLY contract test matrix for Slice 03. It specifies the expected system behavior at the boundary for both successful (Golden Path) and unsuccessful (Failure Matrix) scenarios.

## 2. Test Matrix

| Test ID | Scenario Description | Trigger Condition | Expected HTTP Status | Expected Response Shape | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S03-TM-01** | **Golden Path**: Authorized secondary read of signed note | Caller possesses secondary-read capability, same tenant, note state is `SIGNED`, caller is not author | `200 OK` | Full Note Object (Metadata + Content) | **Emitted** (`NOTE_READ`) |
| **S03-TM-02** | **Failure**: Author attempting secondary read flow | Requesting user is the author of the note | `403 Forbidden` | Error Object (Access Denied) | Not Emitted |
| **S03-TM-03** | **Failure**: Unauthorized note state (`DRAFT`) | Caller with secondary-read capability attempts to read a note in `DRAFT` state | `403 Forbidden` | Error Object (Access Denied) | Not Emitted |
| **S03-TM-04** | **Failure**: Unauthorized note state (`PENDING_SIGNATURE`) | Caller with secondary-read capability attempts to read a note in `PENDING_SIGNATURE` state | `403 Forbidden` | Error Object (Access Denied) | Not Emitted |
| **S03-TM-05** | **Failure**: Tenant ID mismatch | Caller with secondary-read capability attempts to read a note from a different tenant | `404 Not Found` | Error Object (Generic) | Not Emitted |
| **S03-TM-06** | **Failure**: Unauthorized capability | Caller lacks secondary-read capability and attempts access | `403 Forbidden` | Error Object (Access Denied) | Not Emitted |
| **S03-TM-07** | **Failure**: Non-existent note | Caller with secondary-read capability attempts to read a note ID that does not exist | `404 Not Found` | Error Object (Generic) | Not Emitted |
| **S03-TM-08** | **Failure**: Unauthenticated request | Request missing valid identity headers | `401 Unauthorized` | Error Object (Identity Required) | Not Emitted |
| **S03-TM-09** | **Failure**: Invalid/Expired session context | Request with invalid or expired session context | `401 Unauthorized` | Error Object (Identity Required) | Not Emitted |
| **S03-TM-10** | **Failure**: Unauthorized write attempt | Caller with secondary-read capability attempts `POST`/`PUT`/`DELETE` on the note endpoint | `405 Method Not Allowed` | Error Object (Method Not Allowed) | Not Emitted |

## 3. Boundary Constraints
- **Fail-Closed**: All authorization failures must result in a non-200 status code and no PHI leakage.
- **Information Leakage Prevention**: Cross-tenant or non-existent note requests must return generic `404` errors to avoid confirming resource existence to unauthorized actors.
- **Audit Integrity**: Audit events must be emitted only for successful authorized access.

---
**Classification**: DESIGN-ONLY. NON-EXECUTABLE.
