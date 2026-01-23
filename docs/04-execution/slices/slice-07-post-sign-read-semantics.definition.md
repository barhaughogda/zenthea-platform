# Slice 07 — Post-Sign Read Semantics

## 1. Classification
- **Slice Name**: Post-Sign Read Semantics
- **Status**: DESIGN-ONLY
- **Scope**: READ-ONLY, POST-SIGN ONLY
- **Regulatory Tier**: Tier 1 (Clinical Integrity)

## 2. Purpose
This slice defines the deterministic behavior for reading clinical notes that have reached the terminal `SIGNED` state. It establishes the finality of clinical documentation and ensures that post-signature access is governed by the composition of constraints defined in Slices 01–06.

## 3. Allowed Read Conditions
A read operation is permitted IF AND ONLY IF all the following conditions are met:

### 3.1 State Requirement
- The clinical note MUST be in the `SIGNED` state (as defined in Slice 06).
- The signature metadata MUST be present and valid.

### 3.2 Capability-Based Access
- The requester MUST possess the `can_read_clinical_note` capability.
- Access is granted based on the possession of the capability, not the identity or role of the requester.

### 3.3 Tenant Isolation
- The requester's `TenantID` MUST exactly match the clinical note's `TenantID`.
- Cross-tenant access is strictly forbidden at the infrastructure level.

### 3.4 Temporal Constraints (Inherited from Slice 04)
- The read request MUST comply with the temporal constraints defined in Slice 04.
- If a retention or access window is defined and has expired, the read MUST fail.

## 4. Explicit Prohibitions
The following behaviors are strictly forbidden and MUST result in a hard failure:

- **No reads of DRAFT notes**: This slice does not apply to notes in `DRAFT` or `PENDING_SIGNATURE` states.
- **No administrative overrides**: No "super-user" or "admin" bypasses are permitted.
- **No role-based ACLs**: Access must not be determined by user roles (e.g., "Doctor", "Nurse").
- **No “emergency access”**: No "break-glass" mechanisms are defined or permitted in this slice.
- **No partial reads**: The note must be returned in its entirety or not at all.
- **No audit emission on failure**: Failed read attempts MUST NOT emit audit logs to prevent side-channel information leakage.

## 5. Audit Semantics
- **Success-only**: Audit events are ONLY emitted upon a successful read operation.
- **Metadata-only**: Audit logs MUST contain only metadata (NoteID, RequesterID, Timestamp, TenantID).
- **Zero PHI/PII**: Audit logs MUST NOT contain any Protected Health Information (PHI) or Personally Identifiable Information (PII).
- **Exactly-once emission**: Each successful read operation MUST trigger exactly one audit event.

## 6. Deterministic Invariants
- **No ambiguity**: The decision to allow or deny a read must be binary and deterministic.
- **No retries**: A failed read operation must not be automatically retried by the system.
- **No background jobs**: Read operations must be synchronous and executed in the request context.
- **No policy inference**: Access decisions must be based on explicit capabilities and state, never on inferred logic or historical patterns.

## 7. Scope Boundaries
This slice explicitly EXCLUDES the following:
- **UI/UX**: How the note is displayed to the user.
- **Workflows**: The business processes that lead to or follow a read operation.
- **Cryptography**: The specific algorithms used for signing or encryption.
- **Caching**: Any mechanism for storing note content in memory or intermediate layers.
- **Write Operations**: Any modification to the note or its metadata.
