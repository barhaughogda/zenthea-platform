# Classification Header
- **Slice**: 04
- **Domain**: Encounter
- **Type**: Implementation Sequencing
- **Status**: DESIGN-ONLY

## 1. Purpose
This document defines the mandatory execution order for Encounter mutation logic within Slice 04. It serves as the non-negotiable execution baseline to ensure that all write/mutation constraints are enforced consistently across the system.

## 2. Non-Negotiable Layer Order
The following sequence must be strictly adhered to for every mutation request. No deviation is permitted:
1. **Transport Boundary**
2. **Authorization Boundary**
3. **Service Logic (Domain Invariants)**
4. **Persistence Boundary**
5. **Audit Boundary**

## 3. Layer-by-Layer Responsibilities

### 3.1 Transport Boundary
- **Explicitly Allowed**: 
    - Schema validation of the incoming request payload.
    - Extraction of authentication context (e.g., UserID, OrgID).
    - Mapping of external request models to internal command objects.
- **Explicitly Prohibited**: 
    - Any business logic or domain invariant checks.
    - Database access or persistence operations.
- **Test Matrix Mapping**: 
    - TC-04-FL-01 (Invalid Payload)
    - TC-04-FL-02 (Missing Required Fields)

### 3.2 Authorization Boundary
- **Explicitly Allowed**: 
    - Verification of user permissions for the requested action.
    - Validation of organizational scope (multi-tenancy checks).
- **Explicitly Prohibited**: 
    - Modification of any domain data.
    - Execution of service-level logic.
- **Test Matrix Mapping**: 
    - TC-04-FL-03 (Unauthorized Access)
    - TC-04-FL-04 (Cross-Org Access Violation)

### 3.3 Service Logic (Domain Invariants)
- **Explicitly Allowed**: 
    - Enforcement of domain-specific constraints (e.g., terminal state immutability).
    - Validation of state transitions.
    - Preparation of the final domain object for persistence.
- **Explicitly Prohibited**: 
    - Direct database writes (must delegate to Persistence Boundary).
    - Side effects like sending notifications or triggering async jobs.
- **Test Matrix Mapping**: 
    - TC-04-FL-05 through TC-04-FL-15 (Domain Invariant Violations)

### 3.4 Persistence Boundary
- **Explicitly Allowed**: 
    - Atomic execution of the database transaction.
    - Enforcement of database-level constraints (foreign keys, uniqueness).
    - Total rollback on any failure.
- **Explicitly Prohibited**: 
    - Partial updates or non-atomic operations.
    - Retries within the persistence layer.
- **Test Matrix Mapping**: 
    - TC-04-GP-01 (Golden Path Success)
    - TC-04-FL-16 (Database Constraint Violation)
    - TC-04-FL-17 (Transaction Failure)

### 3.5 Audit Boundary
- **Explicitly Allowed**: 
    - Emission of audit logs ONLY after successful persistence.
    - Capture of the final state change for compliance.
- **Explicitly Prohibited**: 
    - Emission of audit logs on failure (unless specifically for security auditing).
    - Blocking the primary transaction if audit emission fails.
- **Test Matrix Mapping**: 
    - TC-04-FL-18 (Audit Emission Failure)
    - TC-04-FL-19 (Audit Integrity Check)

## 4. Mutation Ordering Constraints
- **Atomic Mutation**: All changes within a single request must succeed or fail as a single unit.
- **No Partial Updates**: Partial updates to an Encounter resource are strictly prohibited.
- **No Retries/Async**: Retries, asynchronous processing, or background jobs are not allowed within the mutation flow.
- **Terminal State Immutability**: Once an Encounter reaches a terminal state (e.g., COMPLETED, CANCELLED), no further mutations are permitted.

## 5. Test Matrix Mapping
- **TC-04-GP-01**: Turns GREEN at **Audit Boundary** stage.
- **TC-04-FL-01 to TC-04-FL-02**: Turn GREEN at **Transport Boundary** stage.
- **TC-04-FL-03 to TC-04-FL-04**: Turn GREEN at **Authorization Boundary** stage.
- **TC-04-FL-05 to TC-04-FL-15**: Turn GREEN at **Service Logic** stage.
- **TC-04-FL-16 to TC-04-FL-17**: Turn GREEN at **Persistence Boundary** stage.
- **TC-04-FL-18 to TC-04-FL-19**: Turn GREEN at **Audit Boundary** stage.

## 6. Hard Stop Rules
- **No Refactors**: No code refactoring is allowed during the implementation of this slice.
- **No Schema Changes**: Database schema modifications are strictly prohibited.
- **No Retries**: Automatic retries of failed operations are not permitted.
- **No Role-Based Logic**: Logic based on specific user roles (beyond basic authorization) is prohibited.
- **No Side Effects on Failure**: No external side effects (audit logs, notifications) should occur if the mutation fails.

## 7. Completion Criteria Checklist
- [ ] Behavior is deterministic for all inputs.
- [ ] Zero audit emission occurs on transaction failure.
- [ ] Success is atomic; failure results in a total rollback.
- [ ] All tests in the Slice 04 Test Matrix are GREEN.

## 8. Lock Readiness Statement
Slice 04 is hereby declared **READY FOR LOCK** once this Implementation Sequencing document is approved.
