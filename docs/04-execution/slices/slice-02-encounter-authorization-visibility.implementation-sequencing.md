# Implementation Sequencing: Encounter Slice 02 — Authorization & Visibility Semantics

## Classification
- **Slice Name**: Encounter Slice 02 — Authorization & Visibility Semantics
- **Status**: DESIGN-ONLY
- **Document Type**: Implementation Sequencing
- **Domain**: Encounter Domain

## Purpose
This document defines the ONLY permitted execution order for the implementation of Encounter Slice 02. This sequencing ensures that authorization and visibility constraints are built into the foundation of the system rather than applied as an afterthought.

**Deviation from this sequence is strictly prohibited.**

## Non-Negotiable Layer Order
Implementation MUST proceed through the following boundaries in the exact order listed. No work may begin on a subsequent layer until the current layer is fully implemented and all associated tests are GREEN.

1. **Transport Boundary**
2. **Authorization Boundary**
3. **Service Logic Boundary**
4. **Persistence Boundary**
5. **Audit Boundary**

## Per-Layer Rules

### 1. Transport Boundary
- **May be implemented**: Request/Response schemas, DTO mapping, input validation (syntax and type).
- **Explicitly Forbidden**: Business logic, database access, permission checks.
- **Failure Handling**: Return 400 Bad Request for malformed inputs.
- **Semantics**: Fail-closed on any schema mismatch.

### 2. Authorization Boundary
- **May be implemented**: Attribute-based access control (ABAC) checks, scope verification, relationship-based visibility logic.
- **Explicitly Forbidden**: Data retrieval (beyond what is needed for auth), side-effects, state changes.
- **Failure Handling**: Return 403 Forbidden for unauthorized access.
- **Semantics**: Fail-closed mandatory; if a check cannot be completed, access is denied.

### 3. Service Logic Boundary
- **May be implemented**: Orchestration of domain services, application of visibility filters to result sets, enforcement of business invariants.
- **Explicitly Forbidden**: Direct SQL/database queries, raw transport handling.
- **Failure Handling**: Throw domain-specific exceptions.
- **Semantics**: Fail-closed on any invariant violation.

### 4. Persistence Boundary
- **May be implemented**: Repository implementations, database transactions, Row-Level Security (RLS) enforcement.
- **Explicitly Forbidden**: Authorization logic (must be passed down or handled by RLS), transport logic.
- **Failure Handling**: Rollback transactions on any failure.
- **Semantics**: Fail-closed on database constraint violations.

### 5. Audit Boundary
- **May be implemented**: Synchronous audit logging of access and modifications, security event emission.
- **Explicitly Forbidden**: Asynchronous/background auditing (must be part of the transaction), retry logic for audit writes.
- **Failure Handling**: If audit fails, the entire operation must fail.
- **Semantics**: Fail-closed; no action is complete without a successful audit record.

## Test Matrix Mapping
The following tests from `slice-02-encounter-authorization-visibility.test-matrix.md` MUST turn GREEN at the specified layer before proceeding:

| Test ID | Layer | Requirement |
| :--- | :--- | :--- |
| S02-TM-001 | Transport Boundary | Schema validation for encounter access |
| S02-TM-002 | Transport Boundary | Input sanitization for visibility filters |
| S02-TM-003 | Authorization Boundary | Patient-to-Encounter relationship check |
| S02-TM-004 | Authorization Boundary | Provider-to-Encounter relationship check |
| S02-TM-005 | Authorization Boundary | Deny access for unrelated users |
| S02-TM-006 | Authorization Boundary | Fail-closed on missing auth context |
| S02-TM-007 | Service Logic Boundary | Filter encounter list by visibility rules |
| S02-TM-008 | Service Logic Boundary | Enforce "Locked" encounter read-only status |
| S02-TM-009 | Service Logic Boundary | Prevent visibility of sensitive encounter types |
| S02-TM-010 | Persistence Boundary | Transactional integrity of visibility updates |
| S02-TM-011 | Persistence Boundary | RLS enforcement for encounter records |
| S02-TM-012 | Persistence Boundary | Data consistency across visibility changes |
| S02-TM-013 | Audit Boundary | Log successful authorized access |
| S02-TM-014 | Audit Boundary | Log denied unauthorized attempts |
| S02-TM-015 | Audit Boundary | Log visibility state changes |
| S02-TM-016 | Audit Boundary | Atomic operation/audit failure handling |

## Hard Stop Rules
The following practices are EXPLICITLY PROHIBITED:
- **Parallel layer work**: Do not start Layer N+1 until Layer N is complete.
- **Refactoring during execution**: Refactoring of existing code must happen before or after the slice implementation.
- **Background jobs**: All authorization and visibility logic must be synchronous.
- **Retries**: No automatic retries for authorization or audit failures.
- **Role-based logic**: Use attribute/relationship-based logic only; avoid hardcoded roles.
- **Admin overrides**: No "super-user" bypasses for visibility rules.
- **Partial visibility**: Records are either visible or not; no "partial data" returns.
- **Side-effects on failure**: No state changes or logs (other than audit) if the operation fails.

## Completion Criteria
Slice 02 is considered "implementation complete" only when:
- [ ] All 5 layers are implemented in order.
- [ ] Tests S02-TM-001 through S02-TM-016 are all GREEN.
- [ ] No Hard Stop Rules were violated.
- [ ] Code follows the Single Responsibility Principle per layer.
- [ ] Audit logs capture all relevant security events.

## Lock Readiness Statement
Successful completion of the criteria above makes Encounter Slice 02 eligible for governance lock. Once locked, no further modifications to the authorization or visibility semantics of this slice are permitted without a formal change request.
