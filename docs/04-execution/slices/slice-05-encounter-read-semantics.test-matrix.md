# Test Matrix: Encounter Slice 05 — Read Semantics

## 1. CLASSIFICATION
- **Status**: DESIGN-ONLY
- **Type**: TEST MATRIX
- **Domain**: Encounter
- **Slice**: 05 — Read Semantics

## 2. PURPOSE
This document defines the boundary-level verification suite for Encounter read operations. It ensures that every success and failure path identified in the design is verified against the authoritative domain constraints, maintaining fail-closed integrity and zero-leakage semantics.

## 3. TEST RULES
- **Boundary-Only**: Assertions are limited to boundary outcomes (HTTP Class) and externalized effects (Audit).
- **Fail-Closed**: Any constraint violation must result in an immediate operation abort.
- **Capability-Based**: All authorization tests are defined by the presence or absence of specific capabilities.
- **Audit Success-Only**: Audit events are emitted if and only if the operation completes successfully. Failure cases must emit zero audit events.

## 4. TEST MATRIX

| Test ID | Scenario | Preconditions (Conceptual) | Input Conditions (Conceptual) | Expected HTTP Outcome | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S05-TM-001** | **Golden Path: Successful Read** | Valid Encounter exists; Visibility window is active; State is readable | Valid Tenant Context; Valid Authority Context; `can_read_encounter` capability present | 2xx Success | EMITTED | Authoritative Success |
| **S05-TM-002** | Missing Tenant Context | Valid Encounter exists | `TenantContext` absent | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-003** | Malformed Tenant Context | Valid Encounter exists | `TenantContext` structurally invalid | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-004** | Missing Authority Context | Valid Encounter exists | `AuthorityContext` absent | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-005** | Malformed Authority Context | Valid Encounter exists | `AuthorityContext` structurally invalid | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-006** | Missing `can_read_encounter` capability | Valid Encounter exists | Capability absent from `AuthorityContext` | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-007** | Revoked or inactive capability | Valid Encounter exists | Capability present but marked inactive/revoked | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-008** | Capability scope mismatch | Valid Encounter exists | Capability present but scope excludes target resource | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-009** | Cross-Tenant Access Attempt | Encounter exists in different tenant | Valid Tenant Context; Valid Authority Context; `can_read_encounter` present | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-010** | Pre-Visibility Window Access | Request time precedes visibility window | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-011** | Post-Visibility Window Access | Request time exceeds visibility window | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-012** | Non-Deterministic Request Time | Malformed or non-deterministic timestamp | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-013** | Non-Readable Lifecycle State | Encounter in non-readable state | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-014** | Pre-Activation State | Encounter not yet activated | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-015** | Forbidden Transitional State | Encounter in forbidden transitional state | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-016** | Non-Existent Resource | Resource identifier does not exist | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-017** | Malformed Resource Identifier | Resource identifier structurally invalid | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-018** | Persistence Read Failure | Authoritative data retrieval fails | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
| **S05-TM-019** | Audit Sink Failure | Audit emission fails during success path | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort (Fail-Closed) |
| **S05-TM-020** | Internal Consistency Violation | Domain invariant integrity check fails | Valid contexts and capabilities | 4xx/5xx Client/Server Error | NOT EMITTED | Abort |
