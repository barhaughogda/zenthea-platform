# Clinical Note Write Semantics (Slice 00)

## Classification
- **Status**: CANONICAL
- **Type**: DESIGN-ONLY / GOVERNANCE-GRADE
- **Scope**: All Clinical Note WRITE operations (Draft Creation, Draft Updates, Note Signing)
- **Exclusions**: READ behavior (Refer to `slice-00-clinical-note-read-semantics.md`)

## Governance Composition
This document consolidates and composes the rules defined in:
- `slice-05-clinical-note-write-constraints.definition.md`
- `slice-06-clinical-note-signing-semantics.definition.md`

## Mandatory Invariants

### Authorization
- **Capability-Based Only**: All write operations must be authorized via explicit capabilities. Role-based access control (RBAC) is strictly prohibited at the governance layer.
- **Author-Only Mutation**: Only the original author of a clinical note draft possesses the capability to modify its content.

### State Machine
- **Deterministic Unidirectional Flow**: The state machine is strictly DRAFT → SIGNED.
- **Terminal State**: SIGNED is a terminal state. No transitions out of SIGNED are permitted.
- **Zero Post-Sign Mutation**: Once a note enters the SIGNED state, it is immutable. No modifications, corrections, or deletions are permitted under any circumstances.

### Operational Constraints
- **Tenant Isolation**: Strict tenant isolation is mandatory at every boundary. Data leakage between tenants is a critical violation.
- **Synchronous & Atomic**: All write operations must be synchronous and atomic. Partial success is prohibited.
- **Fail-Closed**: Any violation of invariants, authorization, or constraints must result in immediate operation failure.
- **No Background Processing**: All write logic must execute within the request-response cycle.
- **No Retries**: Automatic retries for write operations are prohibited to ensure deterministic behavior.

## Audit Semantics
- **Success-Only Emission**: Audit events are emitted ONLY upon the successful completion of a write or sign operation.
- **Metadata-Only Payloads**: Audit payloads must contain metadata only. No clinical content or sensitive identifiers are permitted in audit logs.
- **Failure Path Silence**: ZERO audit emission is permitted on any failure path or rejected request.

## Prohibitions
- **NO Administrative Overrides**: No system or administrative user may bypass write constraints or state machine rules.
- **NO Emergency Bypasses**: There are no "break-glass" scenarios that permit unauthorized mutation or state reverts.
- **NO Role-Based Shortcuts**: No user role grants exemption from capability-based authorization.
- **NO Version Rewrites**: History must be preserved; overwriting existing versions of a draft is prohibited.
- **NO Retroactive Edits**: Edits to signed notes are strictly prohibited.
- **NO Soft Deletes**: Deletion of clinical notes (draft or signed) is not permitted at the governance level.
- **NO Feature Flags**: No feature flags or configuration toggles may alter the core write behavior or invariants defined herein.

## Canonical Declaration
This document is the CANONICAL authority for Clinical Note WRITE behavior within the Zenthea Platform. Any deviation in implementation is a governance violation. Any modification to these semantics requires a formal amendment process and approval by the Governance Board.
