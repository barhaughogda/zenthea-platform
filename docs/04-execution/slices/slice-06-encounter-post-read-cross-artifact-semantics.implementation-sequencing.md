# Implementation Sequencing: Encounter Slice 06 — Post-Read / Cross-Artifact Semantics

**STATUS: DESIGN-ONLY**

## 1. Non-Negotiable Implementation Order

Implementation MUST proceed strictly through the following boundaries. Each boundary must be fully verified against its assigned Test Matrix IDs before proceeding to the next.

### I. Transport Boundary
- **Allowed Responsibilities**:
  - Protocol termination (HTTPS/TLS).
  - Request schema validation (Structural integrity).
  - Tenant context extraction (Header-based).
  - Response serialization.
- **Explicit Prohibitions**:
  - Business logic execution.
  - Data persistence.
  - Authorization decisions.
- **Failure Handling**: Fail-closed on structural invalidity or missing tenant context.
- **Verification (Test IDs)**: FT-06-01.

### II. Authorization Boundary
- **Allowed Responsibilities**:
  - Capability-based access control (CBAC) enforcement.
  - Per-artifact authorization verification (Encounter + Clinical Artifacts).
  - Strict tenant isolation enforcement.
- **Explicit Prohibitions**:
  - Role-based access control (RBAC) logic.
  - Administrative overrides.
  - Partial authorization (All artifacts must be authorized or none).
- **Failure Handling**: Fail-closed (403 Forbidden) on any capability mismatch or tenant boundary violation.
- **Verification (Test IDs)**: FT-06-02, FT-06-03, FT-06-04.

### III. Service Logic Boundary
- **Allowed Responsibilities**:
  - Atomic cross-artifact resolution.
  - Enforcement of temporal and integrity consistency.
  - Coordination of artifact retrieval.
  - Zero mutation logic.
- **Explicit Prohibitions**:
  - Background jobs.
  - Async retries.
  - Caching layers.
  - Cross-domain traversal beyond Clinical artifacts.
  - Partial resolution (All artifacts succeed OR entire request aborts).
- **Failure Handling**: Fail-closed on any resolution failure, integrity violation, or temporal inconsistency.
- **Verification (Test IDs)**: GP-06-01, FT-06-05, FT-06-06, FT-06-07, FT-06-08, FT-06-09, FT-06-10, FT-06-11, FT-06-12.

### IV. Persistence Boundary
- **Allowed Responsibilities**:
  - Read-only execution of artifact retrieval.
  - Enforcement of strict tenant isolation at the data tier.
  - Integrity verification of persisted records.
- **Explicit Prohibitions**:
  - Write operations.
  - Schema modifications.
  - Data transformation beyond retrieval requirements.
- **Failure Handling**: Fail-closed on connection failure or data corruption.
- **Verification (Test IDs)**: FT-06-13, FT-06-14, FT-06-15.

### V. Audit Boundary
- **Allowed Responsibilities**:
  - Emission of comprehensive audit events ONLY on full request success.
  - Capture of access metadata (Subject, Object, Action, Outcome).
- **Explicit Prohibitions**:
  - Audit emission on ANY failure.
  - Storage of PHI within audit logs.
- **Failure Handling**: Request failure if audit emission cannot be guaranteed for a successful operation.
- **Verification (Test IDs)**: FT-06-16, FT-06-17, FT-06-18.

## 2. Global Invariants

- **Atomic Cross-Artifact Resolution**: The system MUST return the complete set of requested artifacts or abort the entire request. No partial responses or degraded modes are permitted.
- **Strict Tenant Isolation**: All operations MUST be scoped to the authenticated tenant. Cross-tenant access is a terminal failure.
- **Capability-Based Authorization**: Access is granted solely based on the presence of required capabilities for each artifact type.
- **Temporal and Integrity Consistency**: Artifacts must be temporally relevant to the Encounter and maintain referential integrity.
- **Zero Mutation**: This slice is strictly read-only. No state changes are permitted.
- **Audit Integrity**: Audit logs must reflect the final outcome accurately, with zero emission on failure to prevent noise and potential information leakage.

## 3. Explicit Prohibitions

- No role-based logic.
- No partial resolution.
- No background jobs.
- No async retries.
- No caching layers.
- No administrative overrides.
- No cross-domain traversal beyond Clinical artifacts.
