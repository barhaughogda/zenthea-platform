# Governance Lock Note: Encounter Slice 01 (Encounter Lifecycle)

## 1. Governance Declaration
**Status:** FINAL, HARDENED, IMMUTABLE
**Effective Lock Date:** 2026-01-23
**Authority:** Clinical Engineering Governance Board

This document formally locks the design, state transitions, and execution semantics for **Encounter Slice 01: Encounter Lifecycle**. Any modification to the logic, state machine, or constraints defined herein is strictly prohibited and requires a formal architecture revision process.

## 2. Locked Artifacts
The following artifacts are explicitly locked and must be treated as the source of truth for implementation and verification:

- `docs/04-execution/slices/slice-01-encounter-lifecycle.definition.md`
- `docs/04-execution/slices/slice-01-encounter-lifecycle.golden-path.md`
- `docs/04-execution/slices/slice-01-encounter-lifecycle.failure-matrix.md`
- `docs/04-execution/slices/slice-01-encounter-lifecycle.test-matrix.md`
- `docs/04-execution/slices/slice-01-encounter-lifecycle.implementation-sequencing.md`
- `docs/04-execution/slices/slice-00-reference-blueprint.md`

## 3. Locked State Machine: Encounter Lifecycle
The Encounter lifecycle is restricted to the following deterministic state transitions:

**CREATED → ACTIVE → COMPLETED**

### 3.1 Transition Constraints
- **Unidirectionality:** Transitions must follow the sequence exactly. No backward transitions are permitted.
- **No Skipped States:** Transitions from `CREATED` directly to `COMPLETED` are prohibited.
- **Immutability of Terminal State:** Once an Encounter reaches `COMPLETED`, it is locked. Re-opening or reverting to `ACTIVE` or `CREATED` is strictly prohibited.

## 4. Execution & Operational Constraints

### 4.1 Prohibitions
- **No Re-opening:** Encounters cannot be moved out of the `COMPLETED` state.
- **No Bypass:** Role-based (e.g., Clinical Lead) or administrative bypasses of the state machine are prohibited.
- **Synchronous Execution Only:** All state transitions must be processed synchronously. Async execution, retries, or background job processing for state transitions are prohibited.

### 4.2 Enforcement Semantics
- **Capability-Based Authorization:** Access and transition rights must be verified via explicit capabilities.
- **Fail-Closed Behavior:** Any failure in validation, authorization, or state transition must result in an immediate termination of the operation with no state change.
- **Audit Emission:**
  - **Success Only:** Audit logs must only be emitted upon successful state transition.
  - **Metadata Only:** Audit logs must contain only transaction metadata; no clinical data or PII.
  - **Zero Failure Emission:** No audit logs shall be emitted for failed transition attempts to prevent log pollution and potential information leakage.

## 5. Compliance Statement
This design is regulator-grade and authoritative. Implementation must adhere strictly to these constraints to ensure clinical safety and data integrity.
