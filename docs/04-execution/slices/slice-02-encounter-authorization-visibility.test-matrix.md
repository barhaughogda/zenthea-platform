# Test Matrix: Encounter Slice 02 — Authorization & Visibility Semantics

## 1. CLASSIFICATION
- **Slice**: Encounter Slice 02
- **Type**: TEST MATRIX
- **Status**: DESIGN-ONLY

## 2. ABSOLUTE TEST RULES
- **Boundary Assertions Only**: Tests MUST only assert on request/response boundaries.
- **No Internal State Inspection**: Tests MUST NOT inspect internal service state or private members.
- **No Persistence Assumptions**: Tests MUST NOT assume specific database technologies or schemas.
- **No Retries**: All tests are single-execution; no retry logic is permitted.
- **No Partial Success**: Outcomes are binary (Success/Fail); partial authorization is prohibited.
- **Fail-Closed Audit Policy**: 
  - **NO Audit Emission** on ANY failure (4xx/5xx).
  - **Audit Emitted** ONLY for successful authorization (2xx).
- **Capability-Based Only**: All tests MUST use capability-based assertions. No roles or administrative overrides.

## 3. TEST SCENARIOS

### 3.1 Golden Path
| ID | Scenario | Assertions |
| :--- | :--- | :--- |
| S02-TM-001 | Authorized Encounter Access | 1. Authorized visibility confirmed<br>2. Encounter exists and is resolved<br>3. Required capability present and valid<br>4. Tenant context matches resource tenant<br>5. Outcome: 2xx-class (Success)<br>6. **Audit: EMITTED** |

### 3.2 Failure Scenarios (Mapped to Failure Matrix)
| ID | Failure Matrix ID | Scenario | Assertions |
| :--- | :--- | :--- | :--- |
| S02-TM-002 | FM-02-101 | Missing `tenantId` | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-003 | FM-02-102 | Malformed `tenantId` | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-004 | FM-02-103 | Cross-tenant access attempt | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-005 | FM-02-201 | Missing `authorityId` | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-006 | FM-02-202 | Malformed `authorityId` | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-007 | FM-02-203 | Missing `correlationId` | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-008 | FM-02-301 | Required capability absent | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-009 | FM-02-302 | Capability revoked or expired | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-010 | FM-02-401 | Encounter outside visibility scope | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-011 | FM-02-402 | Visibility derivation failure | 1. Outcome: 5xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-012 | FM-02-501 | Invalid lifecycle state for operation | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-013 | FM-02-502 | Modification attempt on terminal state | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-014 | FM-02-601 | Encounter resource not found | 1. Outcome: 4xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-015 | FM-02-701 | Persistence lookup failure | 1. Outcome: 5xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |
| S02-TM-016 | FM-02-702 | Dependency unavailability | 1. Outcome: 5xx-class<br>2. Resource treated as non-existent<br>3. Fail-closed behavior<br>4. **Audit: NOT EMITTED** |

## 4. EXPLICIT PROHIBITIONS
- **NO Role-Based Bypass**: Tests MUST NOT allow any identity to bypass authorization checks based on role or administrative status.
- **NO Partial Visibility**: Tests MUST NOT assert on partial data returns; authorization is all-or-nothing.
- **NO Error Detail Leakage**: Failure responses MUST NOT contain internal logic details or specific gate failure reasons.
- **NO State Mutation on Failure**: Tests MUST verify that no data is changed when authorization fails.
