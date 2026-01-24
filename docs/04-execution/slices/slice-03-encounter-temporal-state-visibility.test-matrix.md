# Test Matrix: Encounter Slice 03 — Temporal & State Visibility Constraints

## 1. CLASSIFICATION
- **Status**: DESIGN-ONLY
- **Type**: TEST MATRIX
- **Domain**: Encounter
- **Slice**: 03 — Temporal & State Visibility Constraints

## 2. TEST SEMANTICS (ABSOLUTE RULES)
- **Fail CLOSED**: Every failure test MUST result in an immediate abort and a 4xx outcome.
- **Audit Emission**: 
    - **GOLDEN PATH**: MUST emit exactly one audit record upon successful visibility resolution.
    - **FAILURE PATHS**: MUST NOT emit any audit records.
- **Deterministic Outcome**: Every test case has a binary outcome (Success/Deny). No partial visibility or retries are permitted.
- **Boundary-Only**: Tests focus on the visibility gate boundaries, not internal implementation details.

## 3. GOLDEN PATH TEST CASE

| Test ID | Scenario Name | Preconditions | Input Conditions | Expected Outcome | Audit | Determinism |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| S03-TM-001 | Successful Visibility Resolution | 1. Valid Tenant Context<br>2. Valid Identity<br>3. Required Visibility Capability Present<br>4. Encounter State is 'Visible' | 1. Request timestamp within validity window | 2xx | EMITTED | Success |

## 4. FAILURE TEST CASES (1:1 MAPPING TO FAILURE MATRIX)

### 4.1 Context & Identity Failures
| Test ID | Scenario Name | Preconditions | Input Conditions | Expected Outcome | Audit | Determinism |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| S03-TM-101 | Missing tenant context | Valid identity | Request missing tenant metadata | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-102 | Malformed tenant context | Valid identity | Request with invalid tenant format | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-103 | Cross-tenant access attempt | Valid identity | Request with tenant ID mismatching resource | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-104 | Missing authentication context | Valid tenant context | Request missing identity metadata | 4xx | NOT EMITTED | Abort / Fail-closed |

### 4.2 Temporal Validation Failures
| Test ID | Scenario Name | Preconditions | Input Conditions | Expected Outcome | Audit | Determinism |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| S03-TM-201 | Missing request timestamp | Valid context/identity | Request missing timestamp metadata | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-202 | Malformed request timestamp | Valid context/identity | Request with invalid timestamp format | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-203 | Pre-validity window request | Valid context/identity | Request timestamp < validity window start | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-204 | Post-validity window request | Valid context/identity | Request timestamp > validity window end | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-205 | Non-authoritative time source | Valid context/identity | Request with detected clock skew | 4xx | NOT EMITTED | Abort / Fail-closed |

### 4.3 State Visibility Failures
| Test ID | Scenario Name | Preconditions | Input Conditions | Expected Outcome | Audit | Determinism |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| S03-TM-301 | Missing encounter state | Valid context/identity | Encounter resource with null state | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-302 | Non-visible encounter state | Valid context/identity | Encounter state not explicitly 'Visible' | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-303 | Transitional state access | Valid context/identity | Encounter in transitional/temporary state | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-304 | Speculative state resolution | Valid context/identity | Encounter state requires inference | 4xx | NOT EMITTED | Abort / Fail-closed |

### 4.4 Authorization Dependency Failures
| Test ID | Scenario Name | Preconditions | Input Conditions | Expected Outcome | Audit | Determinism |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| S03-TM-401 | Missing visibility capability | Valid context/identity | Identity lacks required capability | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-402 | Expired visibility capability | Valid context/identity | Identity has expired capability | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-403 | Capability scope violation | Valid context/identity | Identity has capability for different scope | 4xx | NOT EMITTED | Abort / Fail-closed |

### 4.5 Resource & Integrity Failures
| Test ID | Scenario Name | Preconditions | Input Conditions | Expected Outcome | Audit | Determinism |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| S03-TM-501 | Encounter not found | Valid context/identity | Request for non-existent encounter ID | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-502 | Corrupted encounter metadata | Valid context/identity | Encounter resource with invalid metadata | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-503 | Missing temporal metadata | Valid context/identity | Encounter resource with no window defined | 4xx | NOT EMITTED | Abort / Fail-closed |

### 4.6 System-Level Failures
| Test ID | Scenario Name | Preconditions | Input Conditions | Expected Outcome | Audit | Determinism |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| S03-TM-601 | Persistence layer timeout | Valid context/identity | Persistence layer fails to respond | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-602 | Persistence read failure | Valid context/identity | Persistence layer returns I/O error | 4xx | NOT EMITTED | Abort / Fail-closed |
| S03-TM-603 | Determinism violation | Valid context/identity | Evaluation logic yields non-repeatable result | 4xx | NOT EMITTED | Abort / Fail-closed |
