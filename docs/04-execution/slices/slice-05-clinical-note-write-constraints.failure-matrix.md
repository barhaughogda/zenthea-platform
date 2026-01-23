# DESIGN-ONLY: Clinical Note Write Constraints - Failure Matrix

## 1. CLASSIFICATION
- **Document Type**: DESIGN-ONLY
- **Governance Level**: WRITE PATH SPECIFICATION
- **Scope**: FAILURE SCENARIOS ONLY (Create, Update, Sign)
- **Status**: DRAFT / PROPOSED

## 2. PURPOSE
This document defines the deterministic failure scenarios for Slice 05 (Clinical Note Write Constraints). It specifies the conditions under which write operations (Create, Update, Sign) must be rejected. All failures are fail-closed, result in zero state mutation, and emit zero audit evidence.

## 3. FAILURE SEMANTICS (ABSOLUTE)
- **Fail-Closed**: Any constraint violation results in immediate termination of the request.
- **Zero Mutation**: No changes to the persistence layer or resource state are permitted on failure.
- **Zero Audit**: No audit events (e.g., `NOTE_CREATED`, `NOTE_UPDATED`) are emitted on failure to prevent side-channel leakage.
- **Synchronous Termination**: Error handling is terminal and occurs within the request-response cycle.

## 4. FAILURE MATRIX

| Failure ID | Condition | Enforcement Boundary | Expected HTTP Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| **S05-FM-01** | Missing or malformed identity context | Identity Context Gate | 4xx Class | NOT EMITTED |
| **S05-FM-02** | Tenant mismatch (Author vs Context/Note) | Tenant Isolation Gate | 4xx Class | NOT EMITTED |
| **S05-FM-03** | Missing `Clinical Author` capability | Capability Gate | 4xx Class | NOT EMITTED |
| **S05-FM-04** | Non-author attempting `Update` | Ownership Invariant Gate | 4xx Class | NOT EMITTED |
| **S05-FM-05** | Non-author attempting `Sign` | Ownership Invariant Gate | 4xx Class | NOT EMITTED |
| **S05-FM-06** | `Update` attempted on `SIGNED` note | State Transition Gate | 4xx Class | NOT EMITTED |
| **S05-FM-07** | `Sign` attempted on `SIGNED` note (Duplicate) | State Transition Gate | 4xx Class | NOT EMITTED |
| **S05-FM-08** | `Sign` attempted on non-`DRAFT` state | State Transition Gate | 4xx Class | NOT EMITTED |
| **S05-FM-09** | Resource not found (Update/Sign) | Resource Discovery Gate | 4xx Class | NOT EMITTED |
| **S05-FM-10** | Persistence failure (Database/Storage) | Persistence Boundary | 5xx Class | NOT EMITTED |
| **S05-FM-11** | Audit emission failure | Persistence Boundary | 5xx Class | NOT EMITTED |
| **S05-FM-12** | Out-of-order operation (e.g. Update before Create) | State Transition Gate | 4xx Class | NOT EMITTED |
| **S05-FM-13** | Temporal violation (Request outside validity) | Temporal Gate | 4xx Class | NOT EMITTED |

## 5. DETERMINISM GUARANTEES
- **No Retries**: Failures at any gate are terminal; no automated recovery or retry logic is permitted.
- **No Compensating Actions**: The system does not attempt to "fix" or "roll back" state on failure, as zero mutation is guaranteed.
- **No Role Overrides**: Administrative or system roles cannot bypass these constraints.
- **No Implementation Details**: This matrix governs the logical failure conditions, independent of specific database or API implementation.

## 6. POST-CONDITIONS
- **Fail-Closed**: All operations are rejected if any constraint is not met.
- **Audit Silence**: The audit trail remains empty for all failed attempts.
- **State Integrity**: The resource state remains unchanged from its pre-request value.
