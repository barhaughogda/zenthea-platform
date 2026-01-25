# Failure Matrix: Encounter Slice 05 — Read Semantics

## 1. CLASSIFICATION
- **Status**: DESIGN-ONLY
- **Type**: FAILURE MATRIX
- **Domain**: Encounter
- **Slice**: 05 — Read Semantics

## 2. PURPOSE
This document defines the exhaustive set of failure scenarios for Encounter read operations. It establishes the deterministic outcomes and boundary constraints for every non-success path, ensuring regulator-grade integrity and fail-closed behavior.

## 3. FAILURE PRINCIPLES
- **Fail-Closed**: Any violation of a boundary constraint results in the immediate termination of the operation and an absolute denial of access.
- **Zero Audit Emission**: Failed operations MUST NOT emit any audit events. Audit emission is reserved exclusively for successful completions.
- **No Information Leakage**: Failure outcomes are deterministic (Abort). No internal state, reason codes, or diagnostic information shall be leaked to the requester.
- **Capability-Based**: Failures are evaluated against capabilities, never roles or administrative status.
- **Tenant Isolation**: Any cross-tenant or missing tenant context is a terminal failure.

## 4. FAILURE MATRIX

| Failure Category | Failure Condition | Boundary Constraint Violated | Deterministic Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| **Context** | Missing `TenantContext` | Absolute Tenant Isolation | Abort | NOT EMITTED |
| **Context** | Malformed `TenantContext` | Tenant Context Integrity | Abort | NOT EMITTED |
| **Context** | Missing `AuthorityContext` | Absolute Authority Requirement | Abort | NOT EMITTED |
| **Context** | Malformed `AuthorityContext` | Authority Context Integrity | Abort | NOT EMITTED |
| **Authorization** | Missing `can_read_encounter` capability | Capability-Based Access Control | Abort | NOT EMITTED |
| **Authorization** | Revoked or inactive capability | Temporal Capability Validity | Abort | NOT EMITTED |
| **Authorization** | Capability scope mismatch | Capability Boundary Enforcement | Abort | NOT EMITTED |
| **Tenant Isolation** | Encounter identifier belongs to different tenant | Absolute Tenant Partitioning | Abort | NOT EMITTED |
| **Temporal Visibility** | Request time precedes visibility window | Temporal Visibility (Slice 03) | Abort | NOT EMITTED |
| **Temporal Visibility** | Request time exceeds visibility window | Temporal Visibility (Slice 03) | Abort | NOT EMITTED |
| **Temporal Visibility** | Malformed or non-deterministic timestamp | Temporal Integrity | Abort | NOT EMITTED |
| **State Visibility** | Encounter in non-readable state | Lifecycle State Visibility (Slice 01) | Abort | NOT EMITTED |
| **State Visibility** | Encounter not yet activated | Lifecycle State Visibility (Slice 01) | Abort | NOT EMITTED |
| **State Visibility** | Encounter in forbidden transitional state | Lifecycle State Visibility (Slice 01) | Abort | NOT EMITTED |
| **Resource** | Encounter identifier does not exist | Resource Existence | Abort | NOT EMITTED |
| **Resource** | Encounter identifier malformed | Identifier Integrity | Abort | NOT EMITTED |
| **System** | Persistence read failure | Authoritative Data Retrieval | Abort | NOT EMITTED |
| **System** | Audit sink failure | Audit Integrity (Fail-Closed) | Abort | NOT EMITTED |
| **System** | Internal consistency violation | Domain Invariant Integrity | Abort | NOT EMITTED |

## 5. BOUNDARY ENFORCEMENT
Every failure condition listed above represents a terminal boundary. The system is architected to prevent any data egress if any of these constraints are not met. There are no "soft-fails" or partial data returns.

## 6. PROHIBITIONS
- **No Success Paths**: This document explicitly excludes all success scenarios.
- **No Implementation Details**: This matrix defines constraints, not implementation logic.
- **No Role-Based Logic**: All failures are defined by capability and context violations.
- **No UI/API References**: This document is protocol-agnostic and focused on domain semantics.
- **No Diagnostic Leakage**: Failure responses must not provide information that could be used to probe the system's state or boundaries.
