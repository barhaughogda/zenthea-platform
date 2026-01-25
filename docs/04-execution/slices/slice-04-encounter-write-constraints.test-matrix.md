# Test Matrix: Encounter Slice 04 — Write / Mutation Constraints

**Status: DESIGN-ONLY**
**Classification: REGULATOR-GRADE**
**Scope: Boundary-Level Only**

## 1. Test Philosophy

This Test Matrix defines the deterministic verification boundary for Encounter mutation operations. It ensures that all write constraints—contextual, authorization, lifecycle, temporal, and systemic—are strictly enforced. The system operates under a **Fail-Closed** architecture: any violation results in an immediate abort with zero state mutation and zero audit emission.

---

## 2. Golden Path Test

| Test ID | Scenario | Preconditions | Expected HTTP | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-04-GP-01** | **Successful Atomic Mutation** | Valid TenantContext, Valid AuthorityContext (with `can_mutate_encounter`), Encounter in `CREATED` or `ACTIVE` state, Valid Temporal Window. | 2xx Class | **EMITTED** | Atomic Success |

---

## 3. Failure Matrix Tests (1:1 Mapping)

### 3.1 Context Failures
| Test ID | Failure Scenario | Preconditions | Expected HTTP | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-04-FL-01** | Missing Tenant Context | Operation requested without a valid tenant identifier. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-02** | Malformed Tenant Context | Tenant identifier format is invalid or unrecognized. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-03** | Missing Authority Context | Operation requested without an established actor identity. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-04** | Malformed Authority Context | Actor identity format is invalid or cryptographically unverifiable. | 4xx Class | **NOT EMITTED** | Fail-Closed |

### 3.2 Authorization Failures
| Test ID | Failure Scenario | Preconditions | Expected HTTP | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-04-FL-05** | Missing Capability | Actor lacks the `can_mutate_encounter` capability. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-06** | Inactive Capability | Required capability is present but marked revoked or inactive. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-07** | Relationship Violation | Actor identity is valid but lacks permission for the specific Encounter resource. | 4xx Class | **NOT EMITTED** | Fail-Closed |

### 3.3 Lifecycle State Failures
| Test ID | Failure Scenario | Preconditions | Expected HTTP | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-04-FL-08** | Invalid Source State | Encounter is in a state other than `CREATED` or `ACTIVE`. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-09** | Terminal State Mutation | Attempt to modify an Encounter in a terminal state (e.g., `COMPLETED`, `CANCELLED`). | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-10** | Illegal Transition | Mutation request implies a state transition not permitted by the lifecycle model. | 4xx Class | **NOT EMITTED** | Fail-Closed |

### 3.4 Temporal Failures
| Test ID | Failure Scenario | Preconditions | Expected HTTP | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-04-FL-11** | Outside Mutation Window | Request timestamp falls outside the permitted window for the current state. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-12** | Malformed Timestamp | Provided temporal data is not in a deterministic, ISO-compliant format. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-13** | Temporal Ambiguity | Detected clock skew or sequence violation relative to known system time. | 4xx Class | **NOT EMITTED** | Fail-Closed |

### 3.5 Resource Failures
| Test ID | Failure Scenario | Preconditions | Expected HTTP | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-04-FL-14** | Resource Non-Existence | The targeted Encounter identifier does not exist in the system. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-15** | Cross-Tenant Violation | Target Encounter belongs to a tenant different from the request context. | 4xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-16** | Invariant Violation | Mutation would result in an Encounter state that violates core integrity rules. | 4xx Class | **NOT EMITTED** | Fail-Closed |

### 3.6 System Failures
| Test ID | Failure Scenario | Preconditions | Expected HTTP | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-04-FL-17** | Persistence Failure | Underlying storage mechanism fails to acknowledge the mutation. | 5xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-18** | Audit Sink Failure | The mandatory audit record cannot be durably recorded. | 5xx Class | **NOT EMITTED** | Fail-Closed |
| **TC-04-FL-19** | Atomicity Violation | Any part of the multi-resource mutation fails to commit. | 5xx Class | **NOT EMITTED** | Total Rollback |

---

## 4. Absolute Constraints

1.  **Zero State Mutation on Failure**: Any test resulting in a 4xx or 5xx class response MUST leave the Encounter state identical to its pre-test state.
2.  **Zero Audit Emission on Failure**: Any test resulting in a 4xx or 5xx class response MUST NOT emit an audit event.
3.  **No Partial Success**: Mutations are strictly atomic; partial application of changes is a terminal failure.
4.  **No Role-Based Logic**: Verification is strictly capability-based (`can_mutate_encounter`).
5.  **No Implementation Leakage**: Error responses must not contain stack traces or internal structural metadata.
