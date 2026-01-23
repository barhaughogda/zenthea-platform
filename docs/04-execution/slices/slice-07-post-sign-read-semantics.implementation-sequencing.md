# Implementation Sequencing: Slice 07 — Post-Sign Read Semantics

## 1. Classification
- **Slice Name**: Post-Sign Read Semantics
- **Slice Number**: 07
- **Type**: DESIGN-ONLY
- **Document Type**: Execution sequencing specification
- **Status**: LOCK-READY

## 2. Purpose
This document defines the ONLY permitted implementation order for Slice 07. It prevents layer inversion, partial implementation, or scope bleed by establishing deterministic execution rules for post-sign reads. This specification ensures that clinical integrity is maintained by strictly following the mandatory layer order.

## 3. Mandatory Layer Order (NON-NEGOTIABLE)
Implementation MUST proceed through the following layers in this exact sequence. No layer may be started until the previous layer is fully implemented and verified.

1. **Transport Boundary**
2. **Authorization Boundary**
3. **Service Logic**
4. **Persistence Boundary**
5. **Audit Boundary**

## 4. Layer-by-Layer Sequencing Rules

### 4.1 Layer 1: Transport Boundary
- **Permitted**:
  - Validation of request structure (NoteID format, TenantID presence).
  - Enforcement of temporal metadata presence (Timestamp).
  - Fail-fast on malformed inputs.
- **Forbidden**:
  - Any check against the database or persistence layer.
  - Any capability or authorization checks.
- **Test Matrix Mapping**:
  - S07-TM-101 (Missing Tenant Context)
  - S07-TM-102 (Malformed Tenant Context)
  - S07-TM-303 (Malformed Timestamp)
- **Behavior**: Fail-fast on protocol/format violations.

### 4.2 Layer 2: Authorization Boundary
- **Permitted**:
  - Verification of `TenantID` match between request and context.
  - Verification of `can_read_clinical_note` capability possession.
  - Enforcement of Slice 04 temporal constraints (Validity window).
- **Forbidden**:
  - Reading the clinical note content.
  - Emitting audit logs.
- **Test Matrix Mapping**:
  - S07-TM-103 (Cross-Tenant Access Attempt)
  - S07-TM-201 (Missing Auth Context)
  - S07-TM-202 (Malformed Auth Context)
  - S07-TM-203 (Missing Read Capability)
  - S07-TM-204 (Capability Revoked)
  - S07-TM-301 (Pre-Validity Request)
  - S07-TM-302 (Post-Validity Request)
  - S07-TM-304 (Clock Skew Violation)
- **Behavior**: Fail-closed on any authorization or temporal violation.

### 4.3 Layer 3: Service Logic
- **Permitted**:
  - Verification of note state (MUST be `SIGNED`).
  - Verification of signature metadata presence and integrity (Hash match).
  - Coordination of retrieval from persistence.
- **Forbidden**:
  - Modification of note state or content.
  - Handling of `DRAFT` or `LOCKED` states (must result in abort).
- **Test Matrix Mapping**:
  - S07-TM-402 (Invalid State: DRAFT)
  - S07-TM-403 (Invalid State: LOCKED)
  - S07-TM-404 (Missing Signature)
  - S07-TM-405 (Integrity Mismatch)
- **Behavior**: Fail-closed on state or integrity violations.

### 4.4 Layer 4: Persistence Boundary
- **Permitted**:
  - Retrieval of the clinical note by `NoteID`.
  - Handling of "Not Found" conditions.
  - Handling of system-level failures (timeouts, connection issues).
- **Forbidden**:
  - Speculative reads or caching.
  - Bypassing tenant isolation at the query level.
- **Test Matrix Mapping**:
  - S07-TM-401 (Note Not Found)
  - S07-TM-501 (Persistence Timeout)
  - S07-TM-502 (Connection Failure)
  - S07-TM-503 (Resource Exhaustion)
- **Behavior**: Fail-fast on retrieval failure or system exhaustion.

### 4.5 Layer 5: Audit Boundary
- **Permitted**:
  - Emission of exactly one audit event ONLY upon successful completion of all prior layers.
  - Inclusion of metadata only (NoteID, RequesterID, Timestamp, TenantID).
- **Forbidden**:
  - Audit emission on ANY failure (S07-TM-101 through S07-TM-503).
  - Inclusion of PHI or PII in the audit log.
- **Test Matrix Mapping**:
  - S07-TM-001 (Golden Path - Success)
- **Behavior**: Atomic emission on success; silent on failure.

## 5. Hard Prohibitions
- **No parallel layer work**: Layers must be implemented and tested sequentially.
- **No cross-layer shortcuts**: Authorization must never be bypassed for "performance" or "convenience".
- **No speculative changes**: Implementation must strictly follow the provided matrices.
- **No refactoring of prior slices**: Slices 01–06 are immutable foundations.
- **No audit emission except on success**: Failures must not leave an audit trail to prevent side-channel leaks.

## 6. Completion Criteria
The implementation of Slice 07 is considered complete when:
- [ ] All tests in `slice-07-post-sign-read-semantics.test-matrix.md` are passing (GREEN).
- [ ] All tests for Slices 01–06 remain GREEN.
- [ ] Zero behavior changes have been introduced to prior slices.
- [ ] The code strictly adheres to the layer-by-layer sequencing defined here.
- [ ] No PHI/PII is present in audit logs.
- [ ] No audit logs are emitted for failed read attempts.

## 7. Lock Statement
This sequencing specification is FINAL and IMMUTABLE. Execution of Slice 07 implementation may not begin without this document. Any deviation from this sequence requires the definition of a new slice.
