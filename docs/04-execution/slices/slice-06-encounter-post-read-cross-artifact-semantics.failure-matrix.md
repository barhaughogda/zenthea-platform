# Failure Matrix: Encounter Slice 06 — Post-Read / Cross-Artifact Semantics

## Status: DESIGN-ONLY

This document defines the deterministic failure behaviors for cross-artifact resolution and composition within the Encounter domain. All failures defined herein are fail-closed.

## Failure Principles
- **Immediate Abort**: Any single violation within a resolution set MUST result in the immediate termination of the entire operation.
- **Zero Mutation**: Failure during read/resolution MUST NOT result in any state change to any artifact.
- **Zero Audit Emission**: To prevent side-channel leakage, failed resolution attempts MUST NOT emit audit events containing artifact identifiers or metadata.
- **No Partial Responses**: If any artifact in a requested cross-artifact set fails resolution, the entire response MUST be nullified.
- **No Authorization Inheritance**: Authorization for a primary artifact (e.g., Encounter) does NOT grant implicit authorization for related artifacts (e.g., Clinical Notes, Observations).
- **No Implicit Traversal**: Resolution is restricted to explicitly defined relationships.

## Failure Categories

### 1. Context Failures
| Scenario | Failure Condition | Outcome |
| :--- | :--- | :--- |
| Tenant Mismatch | Request context tenant does not match the tenant of the primary artifact. | Abort |
| Identity Invalidity | Requesting identity is not active or lacks a valid cryptographic session. | Abort |
| Capability Violation | Requesting identity lacks the specific capability required for cross-artifact resolution. | Abort |

### 2. Artifact Scope Violations
| Scenario | Failure Condition | Outcome |
| :--- | :--- | :--- |
| Out-of-Scope Reference | Resolution requested for an artifact not explicitly bound to the primary Encounter. | Abort |
| Domain Boundary Breach | Attempt to resolve artifacts residing outside the Clinical domain through Encounter semantics. | Abort |

### 3. Per-Artifact Authorization Failure
| Scenario | Failure Condition | Outcome |
| :--- | :--- | :--- |
| Secondary Lack of Access | Identity has access to Encounter but lacks explicit access to a related Clinical Note. | Abort |
| Sensitivity Escalation | Related artifact has a higher sensitivity classification than the requesting context allows. | Abort |

### 4. Temporal Inconsistency
| Scenario | Failure Condition | Outcome |
| :--- | :--- | :--- |
| Version Divergence | Related artifact version is logically incompatible with the Encounter state (e.g., post-dates Encounter closure). | Abort |
| Point-in-Time Mismatch | Resolution requested for a timestamp where the relationship did not exist. | Abort |

### 5. Cross-Tenant Contamination
| Scenario | Failure Condition | Outcome |
| :--- | :--- | :--- |
| Cross-Tenant Reference | Encounter contains a reference to an artifact owned by a different tenant. | Abort |
| Multi-Tenant Resolution | Attempt to resolve a set of artifacts spanning multiple tenant boundaries. | Abort |

### 6. Integrity Mismatch
| Scenario | Failure Condition | Outcome |
| :--- | :--- | :--- |
| Reference Broken | Encounter contains a reference to an artifact ID that does not exist in the registry. | Abort |
| Checksum Failure | Related artifact fails integrity validation during resolution. | Abort |

### 7. Partial Resolution Ambiguity
| Scenario | Failure Condition | Outcome |
| :--- | :--- | :--- |
| Missing Required Artifact | A mandatory related artifact (per definition) is missing or inaccessible. | Abort |
| Ambiguous Mapping | Multiple artifacts claim the same relationship slot for a single Encounter. | Abort |

### 8. System-Level Failures
| Scenario | Failure Condition | Outcome |
| :--- | :--- | :--- |
| Resolution Timeout | Cross-artifact resolution exceeds the deterministic time budget. | Abort |
| Persistence Unavailability | Underlying artifact registry or storage is unavailable. | Abort |
| Dependency Failure | External identity or policy service is unreachable. | Abort |
