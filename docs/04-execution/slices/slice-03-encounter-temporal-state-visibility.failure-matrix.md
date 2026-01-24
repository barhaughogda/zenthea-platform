# Failure Matrix: Encounter Slice 03 — Temporal & State Visibility Constraints

## 1. CLASSIFICATION
- **Status**: DESIGN-ONLY
- **Type**: FAILURE MATRIX
- **Domain**: Encounter
- **Slice**: 03 — Temporal & State Visibility Constraints

## 2. FAILURE SEMANTICS (ABSOLUTE RULES)
- **Fail CLOSED**: Any failure results in an immediate abort and a binary "Deny" decision.
- **NO Audit Emission**: ZERO audit emission shall occur for failures originating from temporal or state-based violations.
- **NO Partial Visibility**: If visibility is denied, no portion of the Encounter data shall be retrieved or returned.
- **NO Retries**: Violation results in immediate termination of the request with no provision for retry.
- **NO Error Detail Leakage**: Responses MUST NOT contain details regarding which constraint was violated or the current state of the Encounter.
- **NO State Mutation**: The visibility check is a read-only operation; it MUST NOT mutate any state.
- **NO Grace Periods**: Temporal windows are absolute; no grace periods or buffers are permitted.

## 3. FAILURE SCENARIOS

### 3.1 Context & Identity Failures
| ID | Failure Scenario | Boundary Violated | Deterministic Outcome |
| :--- | :--- | :--- | :--- |
| FM-03-101 | Missing tenant context in request | Tenant Integrity | Abort; Return Deny |
| FM-03-102 | Malformed tenant context (invalid format) | Tenant Integrity | Abort; Return Deny |
| FM-03-103 | Cross-tenant access attempt | Tenant Isolation | Abort; Return Deny |
| FM-03-104 | Missing authentication context | Identity Integrity | Abort; Return Deny |

### 3.2 Temporal Validation Failures
| ID | Failure Scenario | Boundary Violated | Deterministic Outcome |
| :--- | :--- | :--- | :--- |
| FM-03-201 | Missing request timestamp in metadata | Temporal Integrity | Abort; Return Deny |
| FM-03-202 | Malformed request timestamp (invalid precision/format) | Temporal Integrity | Abort; Return Deny |
| FM-03-203 | Request timestamp precedes validity window start | Pre-validity Boundary | Abort; Return Deny |
| FM-03-204 | Request timestamp exceeds validity window end | Post-validity Boundary | Abort; Return Deny |
| FM-03-205 | Non-authoritative time source detected (clock skew) | Temporal Authority | Abort; Return Deny |

### 3.3 State Visibility Failures
| ID | Failure Scenario | Boundary Violated | Deterministic Outcome |
| :--- | :--- | :--- | :--- |
| FM-03-301 | Encounter lifecycle state missing or null | State Integrity | Abort; Return Deny |
| FM-03-302 | Encounter state not explicitly designated as 'Visible' | State Visibility Gate | Abort; Return Deny |
| FM-03-303 | Attempted usage of transitional state for visibility | State Determinism | Abort; Return Deny |
| FM-03-304 | Inferred or speculative state resolution | State Determinism | Abort; Return Deny |

### 3.4 Authorization Dependency Failures (Slice 02)
| ID | Failure Scenario | Boundary Violated | Deterministic Outcome |
| :--- | :--- | :--- | :--- |
| FM-03-401 | Missing required visibility capability | Capability Presence | Abort; Return Deny |
| FM-03-402 | Revoked or expired visibility capability | Capability Validity | Abort; Return Deny |
| FM-03-403 | Capability-context mismatch (scope violation) | Capability Integrity | Abort; Return Deny |

### 3.5 Resource & Integrity Failures
| ID | Failure Scenario | Boundary Violated | Deterministic Outcome |
| :--- | :--- | :--- | :--- |
| FM-03-501 | Encounter resource not found | Resource Existence | Abort; Return Deny |
| FM-03-502 | Encounter metadata incomplete or corrupted | Metadata Integrity | Abort; Return Deny |
| FM-03-503 | Encounter temporal metadata missing (no window defined) | Temporal Integrity | Abort; Return Deny |

### 3.6 System-Level Failures
| ID | Failure Scenario | Boundary Violated | Deterministic Outcome |
| :--- | :--- | :--- | :--- |
| FM-03-601 | Persistence layer timeout during visibility check | System Availability | Abort; Return Deny |
| FM-03-602 | Persistence read failure (I/O error) | System Integrity | Abort; Return Deny |
| FM-03-603 | Determinism violation (non-repeatable evaluation) | Logic Determinism | Abort; Return Deny |
