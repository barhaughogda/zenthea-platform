# Encounter Slice 05 — Read Semantics

## 1. CLASSIFICATION
- **Status**: DESIGN-ONLY
- **Type**: SLICE DEFINITION
- **Domain**: Encounter
- **Slice**: 05 — Read Semantics

## 2. PURPOSE
This document formalizes the mandatory semantics governing all read operations within the Encounter domain. It establishes the deterministic rules for data retrieval, visibility, and access control. This slice builds upon the lifecycle (Slice 01), authorization (Slice 02), and temporal visibility (Slice 03) foundations to ensure regulator-grade integrity for all data access.

## 3. READ SCOPE & SEMANTICS
A "read" is defined as any operation that retrieves the state or metadata of an Encounter without altering its persistent state.

- **Side-Effect Free**: Read operations are strictly side-effect free. No mutation, enrichment, or state transition shall occur as a result of a read request.
- **Deterministic Output**: For a given state, context, and input, the output of a read operation must be deterministic. Identical inputs must yield identical outputs.
- **No Derived State**: Read operations must return only the authoritative state and metadata. The generation of derived or computed state during a read operation is prohibited.
- **Explicit Exclusion**: This slice explicitly excludes all writes, mutations, and state transitions. Success in a read operation does not imply or grant permission for any mutation.

## 4. CAPABILITY-BASED AUTHORIZATION
Access to Encounter data is governed strictly by the possession of specific capabilities.

- **Capability Requirement**: Every read operation requires the explicit capability `can_read_encounter` within the provided `AuthorityContext`.
- **No Role-Based Logic**: Authorization decisions must not reference roles, groups, or administrative levels.
- **No Administrative Bypasses**: There are no "super-user" routes or flags that bypass authorization gates or domain invariants.
- **No Conditional Visibility**: Visibility is binary. If the required capability is absent, the read operation must fail closed.

## 5. STATE VISIBILITY RULES
Visibility of an Encounter is a deterministic function of its lifecycle state (as defined in Slice 01).

- **Explicit Visibility**: Visibility must be explicitly defined for every state in the Encounter lifecycle.
- **Terminal Readability**: Terminal states (`COMPLETED`, `CANCELLED`) are readable but remain immutable.
- **Transitional Failure**: Any attempt to read an Encounter in an invalid, transitional, or forbidden state must result in a fail-closed response.

## 6. TEMPORAL CONSTRAINTS
Read operations must respect the temporal visibility windows defined in Slice 03.

- **Temporal Alignment**: A read operation is only permitted if the request time (from the `AuthorityContext`) falls within the valid temporal visibility window for the Encounter.
- **Fail-Closed Windows**: Requests for encounters that are expired or reside in the future relative to the authoritative request time must fail closed.

## 7. TENANT ISOLATION
The system enforces absolute tenant isolation for all read operations.

- **Absolute Partitioning**: All Encounter data is strictly partitioned by tenant.
- **Cross-Tenant Prohibition**: Cross-tenant reads are architecturally impossible. Every read request must be validated against the mandatory `TenantContext`.

## 8. AUDIT RULES
Audit integrity for read operations is maintained through strict emission rules.

- **Success-Only Emission**: A metadata-only audit record is emitted ONLY upon the successful completion of a read operation.
- **Metadata-Only Payload**: Audit records must contain only the metadata necessary for execution tracing (e.g., `encounterId`, `capabilityUsed`, `correlationId`, `timestamp`). No clinical content or sensitive data shall be included.
- **Zero Failure Emission**: ZERO audit emission shall occur for failed read attempts.
- **Audit Integrity**: Any failure to emit a required audit record must result in the failure of the entire read request (fail-closed).

## 9. EXPLICIT PROHIBITIONS
The following behaviors and patterns are strictly prohibited:

- **No Soft-Fail Reads**: Partial success or "soft-fail" responses are prohibited. A read operation either succeeds completely or fails entirely.
- **No Partial Responses**: The system must not return partial or redacted data structures.
- **No Pagination Logic**: This slice does not define pagination semantics; reads are performed on a single Encounter.
- **No Filtering or Search**: Filtering, searching, and collection-based semantics are excluded from this definition.
- **No Caching Rules**: This document defines the authoritative read contract; caching strategies are implementation details and are prohibited from this definition.
- **No Role-Based Exceptions**: No exceptions to these rules shall be made based on user roles or administrative status.
- **No Implementation Hints**: This document defines "what" the semantics are, not "how" they are implemented.
