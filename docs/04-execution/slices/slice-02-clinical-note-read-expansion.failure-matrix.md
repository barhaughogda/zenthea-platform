# Failure Matrix — Slice 02: Clinical Note Read Expansion

## 1. Overview
This matrix defines the deterministic system behavior for all identified failure conditions within the scope of Slice 02 (Non-Author Read Access). The system operates on a **Fail-Closed** principle: any violation of preconditions or system failure results in an immediate denial of access and zero data exposure.

## 2. Failure Matrix

| Failure ID | Broken Precondition | Failure Trigger | Expected System Behavior | Authorization Outcome | Data Exposure | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S02-FM-01** | Missing AuthorityContext | Request initiated without valid identity context. | System terminates request processing at the transport boundary. | Deny | NONE | No (No context to audit) |
| **S02-FM-02** | Malformed AuthorityContext | Request contains structural errors in the identity or role metadata. | System rejects the identity context as untrusted and terminates processing. | Deny | NONE | No (Untrusted context) |
| **S02-FM-03** | Tenant Mismatch | Requestor Tenant ID does not match the Target Note Tenant ID. | System detects cross-tenant boundary violation and terminates retrieval. | Deny | NONE | Yes (Security violation) |
| **S02-FM-04** | Note Not Found | Target Note ID does not exist in the persistence layer. | System returns a null result after failing to locate the resource. | Deny | NONE | No (Resource non-existent) |
| **S02-FM-05** | Note Not SIGNED | Target Note exists but is in the `DRAFT` state. | System identifies the note state as restricted for non-authors and blocks access. | Deny | NONE | Yes (Unauthorized state access) |
| **S02-FM-06** | Requestor is Author | Requestor ID matches the Note Author ID (Author access is Slice 01). | System redirects logic to Slice 01 rules; Slice 02 read expansion is not applied. | Deny (via S02) | NONE | No (Handled by Slice 01) |
| **S02-FM-07** | Missing Tenant Context | Request is well-formed but lacks a specific Tenant ID for scoping. | System cannot establish a tenant boundary and terminates processing. | Deny | NONE | No (Incomplete context) |
| **S02-FM-08** | Audit Sink Unavailable | The system is unable to emit the mandatory `NOTE_READ` audit event. | System halts the operation to prevent unaudited access to clinical data. | Deny | NONE | No (Sink failure) |
| **S02-FM-09** | Persistence Unavailable | The system of record is unreachable or returns a fatal error. | System enters a fail-safe state and terminates the request. | Deny | NONE | No (System failure) |

## 3. Deterministic Invariants
- **Zero Leakage**: In every failure case, no clinical content, patient identifiers, or metadata are returned to the requestor.
- **Atomic Decisioning**: Authorization is evaluated as a single "Allow" or "Deny" decision; partial access is never granted.
- **Tenant Isolation**: Tenant mismatch is treated as a critical security event and must always result in a Deny outcome.
- **State Enforcement**: The `SIGNED` state is a hard requirement for non-author access; no other state (e.g., `DRAFT`, `DELETED`) is accessible via this slice.
