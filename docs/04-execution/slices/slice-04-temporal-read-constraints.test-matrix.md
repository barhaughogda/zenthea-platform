# Slice 04 — Temporal Read Constraints: Test Matrix

## Overview
This document defines the DESIGN-ONLY Test Matrix for Slice 04 (Temporal Read Constraints). It specifies the boundary-level behavior for temporal validation gates, ensuring deterministic fail-closed semantics.

## Test Matrix

| Test ID | Scenario | Preconditions | Input Conditions (Conceptual) | Expected HTTP Outcome | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **S04-TM-01** | Golden Path | Valid `TemporalContext` | `RequestTimestamp` within `ValidityInterval` | 2xx Class | EMITTED | Success path |
| **S04-TM-02** | Missing Context | S04-FM-01 | `TemporalContext` is null/absent | 4xx Class | NOT EMITTED | Fail-closed |
| **S04-TM-03** | Malformed Timestamp | S04-FM-02 | `RequestTimestamp` format invalid | 4xx Class | NOT EMITTED | Fail-closed |
| **S04-TM-04** | Pre-Validity | S04-FM-03 | `RequestTimestamp` < `ValidityInterval.Start` | 4xx Class | NOT EMITTED | Fail-closed |
| **S04-TM-05** | Post-Validity | S04-FM-04 | `RequestTimestamp` >= `ValidityInterval.End` | 4xx Class | NOT EMITTED | Fail-closed |
| **S04-TM-06** | Missing Interval | S04-FM-05 | `ValidityInterval` is null/absent | 4xx Class | NOT EMITTED | Fail-closed |
| **S04-TM-07** | Logical Inversion | S04-FM-06 | `ValidityInterval.Start` >= `End` | 4xx Class | NOT EMITTED | Fail-closed |
| **S04-TM-08** | Clock Ambiguity | S04-FM-07 | Reference clock source untrusted | 5xx Class | NOT EMITTED | Fail-closed |
| **S04-TM-09** | Metadata Tampering | S04-FM-08 | Integrity check failure | 4xx Class | NOT EMITTED | Fail-closed |
| **S04-TM-10** | Tenant Mismatch | S04-FM-09 | Context/Tenant ID mismatch | 4xx Class | NOT EMITTED | Fail-closed |

## Post-Conditions
- **Design-Only**: No implementation details, mocking, or retry logic specified.
- **Boundary Assertion**: Verification limited to HTTP status class and audit emission.
- **Zero Ambiguity**: 1:1 mapping to Failure Matrix (S04-FM-01 through S04-FM-09).
