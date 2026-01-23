# DESIGN-ONLY: Clinical Note Write Constraints - Test Matrix

## 1. CLASSIFICATION
- **Document Type**: DESIGN-ONLY
- **Governance Level**: WRITE PATH SPECIFICATION
- **Scope**: TEST SCENARIOS (Golden Path + Failure Matrix)
- **Status**: DRAFT / PROPOSED

## 2. PURPOSE
This document defines the DESIGN-ONLY test matrix for Slice 05 (Clinical Note Write Constraints). It provides a 1:1 mapping to the Failure Matrix (S05-FM-01 through S05-FM-13) and includes the Golden Path verification. All assertions are boundary-level (HTTP + Audit) and assume fail-closed behavior.

## 3. TEST PRINCIPLES
- **Fail-Closed**: Any constraint violation must result in immediate termination with zero state mutation.
- **Zero Audit on Failure**: No audit evidence is emitted for any failed request (preventing side-channel leakage).
- **Metadata-Only Audit on Success**: Successful operations emit audit evidence containing metadata only (no clinical content).
- **Capability-Based**: Assertions are based on identity capabilities, not roles or ACLs.

## 4. TEST MATRIX

| Test ID | Scenario | Preconditions | Input Conditions (Conceptual) | Expected HTTP Outcome | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S05-TP-GP** | **Golden Path: Successful Write Sequence** | Valid identity with `Clinical Author` capability; Tenant context matches | Create -> Update -> Sign sequence | 2xx Class (Success) | METADATA-ONLY EMITTED | Sequential determinism |
| **S05-TP-01** | Missing/Malformed Identity | No valid identity context provided | Create/Update/Sign request | 4xx Class | ZERO EMISSION | Identity Context Gate |
| **S05-TP-02** | Tenant Mismatch | Identity tenant != Resource/Context tenant | Create/Update/Sign request | 4xx Class | ZERO EMISSION | Tenant Isolation Gate |
| **S05-TP-03** | Missing Capability | Identity lacks `Clinical Author` capability | Create/Update/Sign request | 4xx Class | ZERO EMISSION | Capability Gate |
| **S05-TP-04** | Non-Author Update | Identity != Original Author | Update request on existing DRAFT | 4xx Class | ZERO EMISSION | Ownership Invariant Gate |
| **S05-TP-05** | Non-Author Sign | Identity != Original Author | Sign request on existing DRAFT | 4xx Class | ZERO EMISSION | Ownership Invariant Gate |
| **S05-TP-06** | Update Signed Note | Note state is `SIGNED` | Update request | 4xx Class | ZERO EMISSION | State Transition Gate |
| **S05-TP-07** | Duplicate Sign | Note state is `SIGNED` | Sign request | 4xx Class | ZERO EMISSION | State Transition Gate |
| **S05-TP-08** | Sign Non-Draft | Note state is not `DRAFT` (e.g. `DELETED`) | Sign request | 4xx Class | ZERO EMISSION | State Transition Gate |
| **S05-TP-09** | Resource Not Found | Resource ID does not exist | Update/Sign request | 4xx Class | ZERO EMISSION | Resource Discovery Gate |
| **S05-TP-10** | Persistence Failure | Simulated persistence layer unavailability | Create/Update/Sign request | 5xx Class | ZERO EMISSION | Persistence Boundary |
| **S05-TP-11** | Audit Emission Failure | Simulated audit service unavailability | Create/Update/Sign request | 5xx Class | ZERO EMISSION | Persistence Boundary |
| **S05-TP-12** | Out-of-Order Operation | No prior `Create` operation | Update/Sign request | 4xx Class | ZERO EMISSION | State Transition Gate |
| **S05-TP-13** | Temporal Violation | Request timestamp outside validity window | Create/Update/Sign request | 4xx Class | ZERO EMISSION | Temporal Gate |

## 5. VERIFICATION REQUIREMENTS
- **Zero Side Effects**: All failure tests (S05-TP-01 through S05-TP-13) must leave the system state identical to the pre-test state.
- **No Retries**: Tests must assert that a single failure terminates the request immediately.
- **Audit Integrity**: Verification must confirm that NO audit records are created for failed attempts.
