# DESIGN-ONLY Governance Lock Note: Encounter Slice 06

## Status: FINAL, HARDENED, IMMUTABLE

This document declares the design for Encounter Slice 06 — Post-Read / Cross-Artifact Semantics as finalized and locked. No further modifications to the architectural specifications or semantic requirements are permitted.

## Referenced Artifacts

The following artifacts constitute the complete and immutable specification for Slice 06:

- `docs/04-execution/slices/slice-00-reference-blueprint.md`
- `docs/04-execution/slices/slice-06-encounter-post-read-cross-artifact-semantics.definition.md`
- `docs/04-execution/slices/slice-06-encounter-post-read-cross-artifact-semantics.golden-path.md`
- `docs/04-execution/slices/slice-06-encounter-post-read-cross-artifact-semantics.failure-matrix.md`
- `docs/04-execution/slices/slice-06-encounter-post-read-cross-artifact-semantics.test-matrix.md`
- `docs/04-execution/slices/slice-06-encounter-post-read-cross-artifact-semantics.implementation-sequencing.md`

## Non-Negotiable Invariants

The implementation of Slice 06 MUST adhere to the following architectural invariants:

1.  **Read-Only Behavior**: All operations across all artifacts in this slice are strictly non-mutating.
2.  **Atomic Cross-Artifact Resolution**: Resolution of multiple clinical artifacts must be atomic. The system must return a complete, consistent set of artifacts or fail entirely.
3.  **Capability-Based Authorization**: Access control must be governed exclusively by capability-based authorization mechanisms.
4.  **Strict Tenant Isolation**: Data boundaries between tenants must be enforced at the infrastructure and application layers with zero leakage.
5.  **Temporal and Integrity Consistency**: The system must enforce temporal alignment and data integrity across all retrieved artifacts.
6.  **Fail-Closed Semantics**: Any failure at any boundary (authorization, resolution, integrity check) must result in an immediate termination of the request with no data returned.
7.  **Success-Only Audit Emission**: Audit logs must be emitted only upon the total success of the cross-artifact resolution process.
8.  **Zero Failure Audit Emission**: No audit logs containing sensitive context shall be emitted upon failure to prevent metadata leakage.

## Explicit Prohibitions

The following behaviors are strictly prohibited:

1.  **Partial Responses**: Returning a subset of requested artifacts or degraded data is forbidden.
2.  **Async/Background Retries**: All operations must be synchronous; background processing or asynchronous retry logic for artifact resolution is prohibited.
3.  **Caching Layers**: Implementation of caching layers for cross-artifact resolution is prohibited to ensure real-time consistency and security enforcement.
4.  **Role-Based Logic**: The use of Role-Based Access Control (RBAC) logic within the slice boundaries is prohibited in favor of capability-based authorization.
5.  **Administrative Overrides**: No administrative or "super-user" overrides shall exist to bypass the defined invariants.
6.  **Cross-Domain Traversal**: Traversal beyond the explicitly defined clinical artifacts is prohibited.
7.  **Post-Read Mutation**: Any modification of artifact state following the read operation is strictly forbidden.
