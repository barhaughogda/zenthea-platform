# Design Lock Note: Encounter Slice 02 — Authorization & Visibility Semantics

## Status: FINAL, HARDENED, IMMUTABLE

This document declares the design for Encounter Slice 02 — Authorization & Visibility Semantics as final and immutable. All subsequent implementation and verification activities must adhere strictly to the semantics defined herein.

## Referenced Artifacts
- `docs/04-execution/slices/slice-00-reference-blueprint.md`
- `docs/04-execution/slices/slice-02-encounter-authorization-visibility.definition.md`
- `docs/04-execution/slices/slice-02-encounter-authorization-visibility.golden-path.md`
- `docs/04-execution/slices/slice-02-encounter-authorization-visibility.failure-matrix.md`
- `docs/04-execution/slices/slice-02-encounter-authorization-visibility.test-matrix.md`
- `docs/04-execution/slices/slice-02-encounter-authorization-visibility.implementation-sequencing.md`

## Governance Assertions

### Authorization Model
- **Capability-Based Authorization**: Access is granted solely based on the possession and validation of cryptographic or logic-bound capabilities.
- **No Role Systems**: The use of Role-Based Access Control (RBAC) or any identity-to-role mapping systems is strictly prohibited within this slice.

### Isolation and Visibility
- **Strict Tenant Isolation**: Cross-tenant data leakage is prevented by hardware-grade or equivalent logical isolation boundaries. No request shall ever span multiple tenant contexts.
- **Pre-Logic Enforcement**: Visibility rules and authorization checks must be executed and validated prior to the invocation of any business logic.
- **Fail-Closed Behavior**: Any failure in authorization, visibility checking, or tenant validation must result in an immediate termination of the request and a transition to a secure, closed state.

### Audit and Observability
- **Audit Emission**: Audit logs shall be emitted ONLY upon successful completion of a Golden Path access. Authorization failures must be handled by secure logging/monitoring systems distinct from the business audit trail.

## Prohibitions

The following architectural patterns and behaviors are strictly prohibited:
- **ACL Tables**: No Access Control List tables or similar persistent permission mappings.
- **Role Hierarchies**: No hierarchical structures for permissions or roles.
- **Admin Overrides**: No "super-user" or administrative bypasses of authorization or visibility logic.
- **Conditional Bypasses**: No logic-based exceptions to the enforcement of authorization rules.
- **Post-hoc Visibility Mutation**: No modification of visibility or access rights after the initial authorization event for a given request context.
