# Documentation Lock: SL-07 (Scheduling Proposal – Patient-Initiated)

## 1. Governance Decision
**Status**: APPROVED
**Authority**: Governance Agent
**Date**: 2026-01-12
**Context**: Phase E Patient Journey Slice Execution

## 2. Lock Assertions
- **Scope and Constraints Locked**: The scope, behavioral boundaries, and constraints for SL-07 (Scheduling Proposal) as defined in the authoritative source below are hereby approved and frozen.
- **Proposal-Only Boundary**: SL-07 is strictly limited to **proposal-only** behavior. It possesses no execution semantics, no authority to modify calendars, and no capability to commit scheduling changes.
- **Dependency on SL-03**: SL-07 relies exclusively on the **sealed SL-03 PatientSessionContext** for all patient-scoped identity and tenant verification.
- **Boundary Enforcement**: Implementation of SL-07 may not widen the scope or bypass the constraints (e.g., no confirmation language, no calendar writes) without additional governance review and approval.

## 3. Authoritative Source
- `docs/16-phase-e/sl-07-scheduling-proposal.md`

## 4. Verification Notes
- **Non-Overlap**: SL-07 does not overlap with existing sealed slices (SL-01, SL-02, SL-03) or clinical drafting slices (SL-04).
- **Execution Boundary**: Explicitly excludes "Scheduling Execution" as defined in the platform's non-slice registry (`docs/02-slices/patient-journey-slices.md`).

---
**Zenthea Platform Governance**
*Lock Record ID: LOCK-SL-07-20260112*
