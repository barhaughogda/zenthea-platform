# Slice 04 — Temporal Read Constraints: Failure Matrix

## Overview
This document defines the deterministic failure scenarios for Slice 04 (Temporal Read Constraints). All failures are design-only, fail-closed, and isolated from identity or scope-based authorization logic.

## Failure Scenarios

| Failure ID | Condition | Gate | Expected System Behavior | HTTP Outcome | Audit Expectation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S04-FM-01** | Missing `TemporalContext` | Protocol Ingress | Request rejected due to absence of required temporal metadata. | 4xx Class | NOT EMITTED |
| **S04-FM-02** | Malformed `RequestTimestamp` | Protocol Ingress | Request rejected due to non-standard or unparseable timestamp format. | 4xx Class | NOT EMITTED |
| **S04-FM-03** | `RequestTimestamp` before `ValidityInterval.Start` | Temporal Gate | Request rejected; the assertion time precedes the allowed validity window. | 4xx Class | NOT EMITTED |
| **S04-FM-04** | `RequestTimestamp` at or after `ValidityInterval.End` | Temporal Gate | Request rejected; the assertion time has expired relative to the validity window. | 4xx Class | NOT EMITTED |
| **S04-FM-05** | Missing `ValidityInterval` | Policy Evaluator | Request rejected; no temporal bounds provided for the capability assertion. | 4xx Class | NOT EMITTED |
| **S04-FM-06** | Invalid `ValidityInterval` (Start >= End) | Policy Evaluator | Request rejected; temporal bounds are logically impossible. | 4xx Class | NOT EMITTED |
| **S04-FM-07** | Clock source ambiguity | Temporal Gate | Request rejected if the system cannot verify the synchronization or source of the reference clock. | 5xx Class | NOT EMITTED |
| **S04-FM-08** | `TemporalContext` tampering | Integrity Gate | Request rejected if the cryptographic signature or integrity check of the temporal metadata fails. | 4xx Class | NOT EMITTED |
| **S04-FM-09** | Cross-tenant temporal metadata access | Isolation Gate | Request rejected if temporal metadata belongs to a different tenant context than the request. | 4xx Class | NOT EMITTED |

## Post-Conditions
- **Fail-Closed**: Any failure in temporal validation results in immediate termination of the request.
- **Audit Silence**: No audit events are emitted for these failures to prevent side-channel leakage of temporal constraints.
- **Isolation**: These failures occur independently of user identity or resource scope.
