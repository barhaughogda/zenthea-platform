# Test Matrix — Slice 02: Clinical Note Read Expansion

## 1. Overview
This matrix defines the comprehensive test suite for Slice 02 (Non-Author Read Access). It ensures deterministic verification of the Golden Path and all failure conditions identified in the Failure Matrix.

## 2. Test Matrix

| Test ID | Related Failure ID or Golden Path | Preconditions | Action | Expected Outcome (Observable Only) | Audit Expectation | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S02-TM-01** | Golden Path | Non-author clinician authenticated; Note exists in `SIGNED` state within same tenant; System dependencies operational. | Requestor initiates a read request for the target Note ID. | System returns the full clinical content and metadata of the `SIGNED` note. | Yes | Verifies successful non-author access. |
| **S02-TM-02** | **S02-FM-01** | Request initiated without a valid identity context. | Requestor initiates a read request for a Note ID. | System denies access and returns no data. | No | Verifies missing authority context. |
| **S02-TM-03** | **S02-FM-02** | Request contains structurally malformed identity or role metadata. | Requestor initiates a read request for a Note ID. | System denies access and returns no data. | No | Verifies malformed authority context. |
| **S02-TM-04** | **S02-FM-03** | Requestor Tenant ID does not match the Target Note Tenant ID. | Requestor initiates a read request for the target Note ID. | System denies access and returns no data. | Yes | Verifies cross-tenant isolation. |
| **S02-TM-05** | **S02-FM-04** | Target Note ID does not exist in the persistence layer. | Requestor initiates a read request for the non-existent Note ID. | System denies access and returns no data. | No | Verifies non-existent resource handling. |
| **S02-TM-06** | **S02-FM-05** | Target Note exists but is in the `DRAFT` state. | Requestor initiates a read request for the `DRAFT` Note ID. | System denies access and returns no data. | Yes | Verifies state-based access control. |
| **S02-TM-07** | **S02-FM-06** | Requestor ID matches the Note Author ID. | Requestor initiates a read request for their own Note ID. | System denies access via Slice 02 logic. | No | Verifies Slice 02 boundary (Author access handled by Slice 01). |
| **S02-TM-08** | **S02-FM-07** | Request lacks a specific Tenant ID for scoping. | Requestor initiates a read request for a Note ID. | System denies access and returns no data. | No | Verifies missing tenant context. |
| **S02-TM-09** | **S02-FM-08** | The audit sink is unavailable. | Requestor initiates a read request for a `SIGNED` Note ID in the same tenant. | System denies access and returns no data. | No | Verifies mandatory audit emission for data access. |
| **S02-TM-10** | **S02-FM-09** | The persistence layer is unreachable or returns a fatal error. | Requestor initiates a read request for a Note ID. | System denies access and returns no data. | No | Verifies fail-safe behavior on system failure. |

## 3. Test Execution Requirements
- **Environment**: Tests must be executed in an environment with a strictly controlled identity and persistence state.
- **Data Isolation**: Each test case must use unique identifiers to prevent cross-test interference.
- **Observability**: Verification is strictly limited to external system responses and the presence/absence of audit records.
- **Fail-Closed Verification**: For all failure cases (S02-TM-02 through S02-TM-10), the system must demonstrate zero leakage of clinical data.
