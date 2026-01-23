# DESIGN-ONLY: Clinical Note Signing Semantics - Test Matrix

## 1. CLASSIFICATION
- **Document Type**: DESIGN-ONLY
- **Governance Level**: SIGNING PATH SPECIFICATION
- **Scope**: TEST SCENARIOS (SignNote)
- **Status**: DRAFT / PROPOSED

## 2. PURPOSE
This document defines the deterministic test matrix for Slice 06 (Clinical Note Signing Semantics). It maps the Golden Path and Failure Matrix scenarios to conceptual contract tests. These tests are boundary-level assertions only, ensuring fail-closed behavior and zero side effects on failure.

## 3. TEST RULES (ABSOLUTE)
- **Boundary-Only**: Assertions must occur at the request/response boundary.
- **No Internal Inspection**: No direct persistence or state inspection.
- **No Mocking**: No implementation-level mocking language.
- **Audit Emission**: Emitted ONLY for the Golden Path (S06-TM-01).
- **Zero Mutation on Failure**: All failure tests (S06-TM-02..N) must result in zero state change.

## 4. TEST MATRIX

| Test ID | Scenario | Preconditions (Conceptual) | Input Conditions (Conceptual) | Expected HTTP Outcome | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S06-TM-01** | Golden Path: Successful Signing | Valid Note in `DRAFT`; Valid Actor with `Signing Capability` | Valid `noteId`; Valid Context | 2xx Class | **EMITTED** | Success; Terminal State Transition |
| **S06-TM-02** | Missing/Malformed Tenant | Valid Note; Valid Actor | Missing/Invalid Tenant Context | 4xx Class | NOT EMITTED | Fail-closed; Context Required |
| **S06-TM-03** | Missing/Malformed Authority | Valid Note; Valid Tenant | Missing/Invalid Actor Identity | 4xx Class | NOT EMITTED | Fail-closed; Identity Required |
| **S06-TM-04** | Lacks Signing Capability | Valid Note; Valid Identity | Actor lacks `Signing Capability` | 4xx Class | NOT EMITTED | Fail-closed; Capability Required |
| **S06-TM-05** | Cross-Tenant Mismatch | Valid Note in Tenant A | Actor Identity from Tenant B | 4xx Class | NOT EMITTED | Fail-closed; Strict Isolation |
| **S06-TM-06** | Note Not Found | No Note exists for `noteId` | Invalid `noteId` | 4xx Class | NOT EMITTED | Fail-closed; Resource Missing |
| **S06-TM-07** | Note Already Signed | Note in `SIGNED` state | Valid `noteId`; Valid Context | 4xx Class | NOT EMITTED | Fail-closed; Invariant Violation |
| **S06-TM-08** | Note in Non-Signable State | Note in `DELETED` or `ARCHIVED` | Valid `noteId`; Valid Context | 4xx Class | NOT EMITTED | Fail-closed; State Gating |
| **S06-TM-09** | Author-Only Constraint | Policy: Author-only signing | Actor != Author | 4xx Class | NOT EMITTED | Fail-closed; Policy Violation |
| **S06-TM-10** | Timestamp Source Failure | Valid Note; Valid Actor | Timestamp service unavailable | 5xx Class | NOT EMITTED | Fail-closed; Temporal Integrity |
| **S06-TM-11** | Persistence Write Failure | Valid Note; Valid Actor | Storage layer rejection | 5xx Class | NOT EMITTED | Fail-closed; Atomicity Violation |
| **S06-TM-12** | Audit Sink Failure | Valid Note; Valid Actor | Audit emission rejected | 5xx Class | NOT EMITTED | Fail-closed; Observability Failure |

## 5. DETERMINISM GUARANTEES
- **Fail-Closed**: Any failure results in immediate termination and zero side effects.
- **Audit Silence**: No audit evidence is produced for any failure scenario (S06-TM-02 through S06-TM-12).
- **State Integrity**: On failure, the system state remains exactly as it was before the request.
- **No Ambiguity**: Every test case has a single, deterministic outcome defined by the HTTP status class and audit expectation.
