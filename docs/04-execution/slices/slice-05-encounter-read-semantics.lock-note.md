# Governance Lock Note: Encounter Slice 05 — Read Semantics

## Status: DESIGN-ONLY
This document constitutes the final governance lock for the design of Encounter Slice 05. The specifications contained herein are hereby declared **FINAL**, **HARDENED**, and **IMMUTABLE**. No further design modifications are permitted.

## Artifact Reference
This lock note governs the following validated artifacts:
- `docs/04-execution/slices/slice-00-reference-blueprint.md`
- `docs/04-execution/slices/slice-05-encounter-read-semantics.definition.md`
- `docs/04-execution/slices/slice-05-encounter-read-semantics.golden-path.md`
- `docs/04-execution/slices/slice-05-encounter-read-semantics.failure-matrix.md`
- `docs/04-execution/slices/slice-05-encounter-read-semantics.test-matrix.md`
- `docs/04-execution/slices/slice-05-encounter-read-semantics.implementation-sequencing.md`

## Non-Negotiable Read Invariants
The implementation of Slice 05 must adhere to the following architectural constraints without exception:

1. **Read-Only Behavior**: Operations must be strictly non-mutating. No state changes, including metadata updates or "last accessed" timestamps, shall occur during the read lifecycle.
2. **Capability-Based Authorization**: Access is granted solely through validated capabilities. Identity-based or role-based logic is strictly prohibited.
3. **Strict Tenant Isolation**: Data boundaries must be enforced at the persistence layer. Cross-tenant data leakage is a terminal failure condition.
4. **Temporal and State Visibility**: Read operations must respect the exact temporal context and state visibility rules defined in the slice specification.
5. **Fail-Closed Semantics**: Any failure in authorization, isolation, or validation must result in an immediate termination of the request with no data returned.
6. **Audit Emission**: Audit logs shall be emitted if and only if a read operation is successful.
7. **Failure Privacy**: No audit logs or detailed error information shall be emitted on failed read attempts to prevent side-channel information leakage.

## Prohibitions
The following patterns are strictly forbidden:
- **Role-Based Logic**: Reliance on user roles or groups for access control.
- **Soft-Fail Behavior**: Returning partial data or degraded responses upon encountering errors.
- **Partial Reads**: Execution of queries that return incomplete record sets or unvalidated fields.
- **Background Processing**: Offloading read-related logic to asynchronous background tasks.
- **Administrative Overrides**: Bypassing isolation or authorization constraints for any user class, including system administrators.
