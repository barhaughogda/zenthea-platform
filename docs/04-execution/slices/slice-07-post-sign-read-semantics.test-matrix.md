# Test Matrix: Slice 07 — Post-Sign Read Semantics

## 1. Classification
- **Domain**: Clinical Documentation
- **Slice**: 07
- **Type**: Behavioral Specification (Design-Only)
- **Status**: Test Matrix

## 2. Test Philosophy
- **Boundary-Level Only**: Tests focus on request/response semantics at the service boundary.
- **Fail-Closed Enforcement**: Any violation of constraints must result in an immediate abort.
- **Audit Integrity**: Audit events are emitted ONLY for success; failures MUST NOT emit audit logs.
- **Capability-Based**: Access is governed by capabilities, never by roles or identity.
- **Temporal Strictness**: Enforcement of Slice 04 temporal constraints is mandatory.

## 3. Golden Path Test
| Test ID | Scenario | Preconditions | Input Conditions | Expected Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S07-TM-001 | Successful Read of Signed Note | Note exists in `SIGNED` state; Requestor has matching `TenantID`. | Valid `NoteID`, Valid `TenantID`, `can_read_clinical_note` capability, Valid request timestamp. | 200 OK (Full Note) | EMITTED |

## 4. Failure Tests (1:1 Mapping to Failure Matrix)

### 4.1 Tenant Isolation Failures
| Test ID | Scenario | Preconditions | Input Conditions | Expected Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S07-TM-101 | Missing Tenant Context | Note exists in `SIGNED` state. | Request lacks `TenantID`. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-102 | Malformed Tenant Context | Note exists in `SIGNED` state. | `TenantID` format is invalid. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-103 | Cross-Tenant Access Attempt | Note exists in `SIGNED` state for Tenant A. | Requestor provides Tenant B `TenantID`. | 4xx/5xx Abort | NOT EMITTED |

### 4.2 Authentication & Capability Failures
| Test ID | Scenario | Preconditions | Input Conditions | Expected Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S07-TM-201 | Missing Auth Context | Note exists in `SIGNED` state. | Request lacks authentication evidence. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-202 | Malformed Auth Context | Note exists in `SIGNED` state. | Auth context is corrupt/unreadable. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-203 | Missing Read Capability | Note exists in `SIGNED` state. | Requestor lacks `can_read_clinical_note`. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-204 | Capability Revoked | Note exists in `SIGNED` state. | Requestor capability is marked revoked. | 4xx/5xx Abort | NOT EMITTED |

### 4.3 Temporal Constraint Failures (Slice 04)
| Test ID | Scenario | Preconditions | Input Conditions | Expected Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S07-TM-301 | Pre-Validity Request | Note exists in `SIGNED` state. | Request timestamp < validity window. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-302 | Post-Validity Request | Note exists in `SIGNED` state. | Request timestamp > validity window. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-303 | Malformed Timestamp | Note exists in `SIGNED` state. | Request timestamp format is invalid. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-304 | Clock Skew Violation | Note exists in `SIGNED` state. | Request timestamp exceeds skew drift. | 4xx/5xx Abort | NOT EMITTED |

### 4.4 State & Integrity Failures
| Test ID | Scenario | Preconditions | Input Conditions | Expected Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S07-TM-401 | Note Not Found | Note does not exist. | Valid `NoteID` format, but ID unknown. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-402 | Invalid State: DRAFT | Note exists in `DRAFT` state. | Request for `DRAFT` note via read path. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-403 | Invalid State: LOCKED | Note exists in `LOCKED` state. | Request for `LOCKED` note via read path. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-404 | Missing Signature | Note marked `SIGNED` in state. | Signature metadata is missing. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-405 | Integrity Mismatch | Note marked `SIGNED` in state. | Content hash != signed metadata hash. | 4xx/5xx Abort | NOT EMITTED |

### 4.5 System-Level Failures
| Test ID | Scenario | Preconditions | Input Conditions | Expected Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| S07-TM-501 | Persistence Timeout | Note exists in `SIGNED` state. | Storage layer timeout during retrieval. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-502 | Connection Failure | Note exists in `SIGNED` state. | Downstream service connection lost. | 4xx/5xx Abort | NOT EMITTED |
| S07-TM-503 | Resource Exhaustion | Note exists in `SIGNED` state. | System-level saturation (CPU/Memory). | 4xx/5xx Abort | NOT EMITTED |

## 5. Prohibited Behaviors
- **No Retries**: Failed tests must not be automatically retried.
- **No Partial Success**: Any failure must result in zero data returned.
- **No Internal Inspection**: Expected outcomes are boundary-level only (HTTP status classes).
- **No Role Language**: Tests must use capability-based terminology only.
- **No Audit on Failure**: Any failure test that emits an audit log is a failure of the test itself.
