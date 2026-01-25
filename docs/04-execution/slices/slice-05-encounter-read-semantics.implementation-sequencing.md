# CLASSIFICATION
- DESIGN-ONLY
- Encounter Domain
- Slice 05 — Read Semantics
- Status: LOCK-READY

# PURPOSE
This document defines the ONLY permitted execution order for implementing Encounter read semantics. It establishes a non-negotiable baseline for all future code, ensuring deterministic, fail-closed behavior for all read operations within the Encounter domain.

# NON-NEGOTIABLE LAYER ORDER
Implementation MUST proceed strictly through these layers in the specified order. No layer may be bypassed, and no logic from a lower layer may leak into a higher layer.

1. **Transport Boundary**
2. **Authorization Boundary**
3. **Service Logic Boundary**
4. **Persistence Boundary**
5. **Audit Boundary**

# LAYER-BY-LAYER RESPONSIBILITIES

## 1. Transport Boundary
- **ALLOWED**: 
  - Schema validation of the incoming request.
  - Extraction of identity context from the request.
  - Mapping of external identifiers to internal domain keys.
- **PROHIBITED**: 
  - Domain logic execution.
  - Direct persistence access.
  - Authorization decisions.
- **TEST MAPPING**: S05-TM-001, S05-TM-002 MUST turn GREEN.

## 2. Authorization Boundary
- **ALLOWED**: 
  - Verification of identity permissions against the requested resource.
  - Enforcement of "fail-closed" access control.
  - Evaluation of relationship-based access (e.g., patient-provider link).
- **PROHIBITED**: 
  - Modification of the resource state.
  - Data transformation beyond what is required for access checks.
- **TEST MAPPING**: S05-TM-003 through S05-TM-007 MUST turn GREEN.

## 3. Service Logic Boundary
- **ALLOWED**: 
  - Application of business rules for read semantics.
  - Orchestration of internal domain services.
  - Enforcement of temporal read constraints (e.g., state-based visibility).
- **PROHIBITED**: 
  - Direct SQL or database-specific operations.
  - Bypassing authorization checks.
- **TEST MAPPING**: S05-TM-008 through S05-TM-012 MUST turn GREEN.

## 4. Persistence Boundary
- **ALLOWED**: 
  - Execution of read-only queries against the data store.
  - Mapping of database records to domain entities.
  - Enforcement of data-level constraints (e.g., non-null fields).
- **PROHIBITED**: 
  - Any write operation, including updates to "last read" timestamps.
  - Execution of business logic within database triggers or stored procedures.
- **TEST MAPPING**: S05-TM-013 through S05-TM-017 MUST turn GREEN.

## 5. Audit Boundary
- **ALLOWED**: 
  - Emission of audit logs for successful read operations.
  - Capture of the identity, resource, and timestamp of the access.
- **PROHIBITED**: 
  - Audit emission for failed requests (handled by global security middleware).
  - Blocking the primary read response due to audit failure (must be fire-and-forget or out-of-band).
- **TEST MAPPING**: S05-TM-018 through S05-TM-020 MUST turn GREEN.

# TEST MATRIX MAPPING

| Test ID | Layer Responsible |
| :--- | :--- |
| S05-TM-001 | Transport Boundary |
| S05-TM-002 | Transport Boundary |
| S05-TM-003 | Authorization Boundary |
| S05-TM-004 | Authorization Boundary |
| S05-TM-005 | Authorization Boundary |
| S05-TM-006 | Authorization Boundary |
| S05-TM-007 | Authorization Boundary |
| S05-TM-008 | Service Logic Boundary |
| S05-TM-009 | Service Logic Boundary |
| S05-TM-010 | Service Logic Boundary |
| S05-TM-011 | Service Logic Boundary |
| S05-TM-012 | Service Logic Boundary |
| S05-TM-013 | Persistence Boundary |
| S05-TM-014 | Persistence Boundary |
| S05-TM-015 | Persistence Boundary |
| S05-TM-016 | Persistence Boundary |
| S05-TM-017 | Persistence Boundary |
| S05-TM-018 | Audit Boundary |
| S05-TM-019 | Audit Boundary |
| S05-TM-020 | Audit Boundary |

# HARD STOP RULES
The following practices are strictly forbidden:
- **Parallel implementation**: Layers must be implemented and tested sequentially.
- **Refactoring beyond necessity**: Only code changes required to satisfy the Test Matrix are permitted.
- **Retries, background work, async flows**: Read operations must be synchronous and deterministic.
- **Role-based logic**: Access must be governed by specific permissions and relationships, not generic roles.
- **Soft-fail behavior**: Any failure at any layer must result in an immediate, safe termination of the request.
- **Partial reads**: The system must return the full requested entity or nothing.
- **Audit emission on failure**: Audit logs for this slice are reserved for successful access only.

# COMPLETION CRITERIA
Implementation is declared COMPLETE only when:
- All S05-TM-001 through S05-TM-020 tests are GREEN.
- Audit emission occurs only on successful reads.
- Fail-closed behavior is verified across all layers.
- Zero state mutation occurs during the entire read lifecycle.

# LOCK STATEMENT
This sequencing document is FINAL and IMMUTABLE. Any deviation from the order or responsibilities defined herein requires the creation of a new slice and a formal governance review.
