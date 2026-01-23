# Failure Matrix: Slice 07 — Post-Sign Read Semantics

## 1. Classification
- **Domain**: Clinical Documentation
- **Slice**: 07
- **Type**: Behavioral Specification (Design-Only)
- **Status**: Failure Matrix

## 2. Failure Philosophy
- **Strictly Fail-Closed**: Any deviation from the Golden Path results in immediate termination of the request.
- **Zero-Audit on Failure**: No audit events are emitted for any failure scenario to prevent side-channel information leakage.
- **No Partial Reads**: The system never returns partial data or internal state details upon failure.
- **Deterministic Outcomes**: Failure outcomes are binary and based strictly on boundary-level constraints.

## 3. Failure Scenarios

### 3.1 Tenant Isolation Failures
| Scenario ID | Failure Mode | Boundary Constraint | Outcome |
| :--- | :--- | :--- | :--- |
| FM-07-101 | Missing Tenant Context | Request context lacks a valid `TenantID`. | Immediate Abort |
| FM-07-102 | Malformed Tenant Context | `TenantID` format is invalid or unrecognizable. | Immediate Abort |
| FM-07-103 | Cross-Tenant Access Attempt | Requestor `TenantID` does not match Note `TenantID`. | Immediate Abort |

### 3.2 Authentication & Capability Failures
| Scenario ID | Failure Mode | Boundary Constraint | Outcome |
| :--- | :--- | :--- | :--- |
| FM-07-201 | Missing Auth Context | Request lacks valid authentication session evidence. | Immediate Abort |
| FM-07-202 | Malformed Auth Context | Authentication session context is corrupt or unreadable. | Immediate Abort |
| FM-07-203 | Missing Read Capability | Requestor context lacks the `can_read_clinical_note` capability. | Immediate Abort |
| FM-07-204 | Capability Revoked | Required capability is present but marked as inactive/revoked. | Immediate Abort |

### 3.3 Temporal Constraint Failures (Slice 04)
| Scenario ID | Failure Mode | Boundary Constraint | Outcome |
| :--- | :--- | :--- | :--- |
| FM-07-301 | Pre-Validity Request | Request timestamp is before the allowed access window. | Immediate Abort |
| FM-07-302 | Post-Validity Request | Request timestamp is after the allowed access window (Retention Expired). | Immediate Abort |
| FM-07-303 | Malformed Timestamp | Request timestamp format is invalid or non-deterministic. | Immediate Abort |
| FM-07-304 | Clock Skew Violation | Request timestamp exceeds permitted system clock skew drift. | Immediate Abort |

### 3.4 State & Integrity Failures
| Scenario ID | Failure Mode | Boundary Constraint | Outcome |
| :--- | :--- | :--- | :--- |
| FM-07-401 | Note Not Found | The requested `NoteID` does not exist within the tenant scope. | Immediate Abort |
| FM-07-402 | Invalid State: DRAFT | Note is in `DRAFT` state; post-sign semantics do not apply. | Immediate Abort |
| FM-07-403 | Invalid State: LOCKED | Note is in `LOCKED` state but not yet `SIGNED`. | Immediate Abort |
| FM-07-404 | Missing Signature | Note is marked `SIGNED` but signature metadata is missing. | Immediate Abort |
| FM-07-405 | Integrity Mismatch | Note content hash does not match the signed metadata hash. | Immediate Abort |

### 3.5 System-Level Failures
| Scenario ID | Failure Mode | Boundary Constraint | Outcome |
| :--- | :--- | :--- | :--- |
| FM-07-501 | Persistence Timeout | Storage layer fails to respond within the deterministic timeout. | Immediate Abort |
| FM-07-502 | Connection Failure | Loss of connectivity to downstream clinical data services. | Immediate Abort |
| FM-07-503 | Resource Exhaustion | System-level saturation preventing deterministic execution. | Immediate Abort |

## 4. Prohibited Failure Behaviors
- **NO Audit Emission**: Audit logs MUST NOT be generated for any scenario listed in Section 3.
- **NO Retries**: The platform MUST NOT automatically retry a request that has reached an "Immediate Abort" outcome.
- **NO Error Details**: The response to the requestor MUST NOT contain internal stack traces, database errors, or specific failure logic.
- **NO Role-Based Logic**: Failures must never be suppressed or bypassed based on user roles or administrative status.
- **NO Partial Success**: If any constraint fails, the entire read operation is voided.
