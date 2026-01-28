# Test Matrix: Encounter Slice 06 — Post-Read / Cross-Artifact Semantics

## Status: DESIGN-ONLY

This document defines the deterministic test suite for validating cross-artifact resolution and composition within the Encounter domain. It asserts boundary-level outcomes (HTTP class and audit emission) based on capability-based requirements.

## Test Principles
- **Atomic Outcomes**: Tests assert either total success (2xx + Audit) or total failure (4xx/5xx + No Audit).
- **Audit Integrity**: Audit events are emitted if and only if the entire cross-artifact resolution set is successfully returned.
- **Zero Mutation**: All tests are read-only and MUST NOT modify any system state.
- **Capability-Based**: Assertions are made against abstract capabilities and boundaries, independent of implementation details.

## 1. Golden Path Test

| ID | Description | Pre-conditions | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| GP-06-01 | Successful Cross-Artifact Read | Valid identity with required capabilities; Encounter exists with valid, authorized references to Clinical Notes and Observations; all artifacts reside in the same tenant; all integrity checks pass. | 2xx Success | **EMITTED** (Exactly Once) |

## 2. Failure Tests (Mapping 1:1 to Failure Matrix)

All failure tests MUST result in an **Abort** (4xx/5xx class) and **Zero Audit Emission**.

### 2.1 Context Failures
| ID | Scenario | Failure Condition | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| FT-06-01 | Tenant Mismatch | Request context tenant does not match the tenant of the primary artifact. | Abort | NOT EMITTED |
| FT-06-02 | Identity Invalidity | Requesting identity is not active or lacks a valid cryptographic session. | Abort | NOT EMITTED |
| FT-06-03 | Capability Violation | Requesting identity lacks the specific capability required for cross-artifact resolution. | Abort | NOT EMITTED |

### 2.2 Artifact Scope Violations
| ID | Scenario | Failure Condition | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| FT-06-04 | Out-of-Scope Reference | Resolution requested for an artifact not explicitly bound to the primary Encounter. | Abort | NOT EMITTED |
| FT-06-05 | Domain Boundary Breach | Attempt to resolve artifacts residing outside the Clinical domain through Encounter semantics. | Abort | NOT EMITTED |

### 2.3 Per-Artifact Authorization Failure
| ID | Scenario | Failure Condition | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| FT-06-06 | Secondary Lack of Access | Identity has access to Encounter but lacks explicit access to a related Clinical Note. | Abort | NOT EMITTED |
| FT-06-07 | Sensitivity Escalation | Related artifact has a higher sensitivity classification than the requesting context allows. | Abort | NOT EMITTED |

### 2.4 Temporal Inconsistency
| ID | Scenario | Failure Condition | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| FT-06-08 | Version Divergence | Related artifact version is logically incompatible with the Encounter state (e.g., post-dates Encounter closure). | Abort | NOT EMITTED |
| FT-06-09 | Point-in-Time Mismatch | Resolution requested for a timestamp where the relationship did not exist. | Abort | NOT EMITTED |

### 2.5 Cross-Tenant Contamination
| ID | Scenario | Failure Condition | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| FT-06-10 | Cross-Tenant Reference | Encounter contains a reference to an artifact owned by a different tenant. | Abort | NOT EMITTED |
| FT-06-11 | Multi-Tenant Resolution | Attempt to resolve a set of artifacts spanning multiple tenant boundaries. | Abort | NOT EMITTED |

### 2.6 Integrity Mismatch
| ID | Scenario | Failure Condition | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| FT-06-12 | Reference Broken | Encounter contains a reference to an artifact ID that does not exist in the registry. | Abort | NOT EMITTED |
| FT-06-13 | Checksum Failure | Related artifact fails integrity validation during resolution. | Abort | NOT EMITTED |

### 2.7 Partial Resolution Ambiguity
| ID | Scenario | Failure Condition | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| FT-06-14 | Missing Required Artifact | A mandatory related artifact (per definition) is missing or inaccessible. | Abort | NOT EMITTED |
| FT-06-15 | Ambiguous Mapping | Multiple artifacts claim the same relationship slot for a single Encounter. | Abort | NOT EMITTED |

### 2.8 System-Level Failures
| ID | Scenario | Failure Condition | Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- |
| FT-06-16 | Resolution Timeout | Cross-artifact resolution exceeds the deterministic time budget. | Abort | NOT EMITTED |
| FT-06-17 | Persistence Unavailability | Underlying artifact registry or storage is unavailable. | Abort | NOT EMITTED |
| FT-06-18 | Dependency Failure | External identity or policy service is unreachable. | Abort | NOT EMITTED |
