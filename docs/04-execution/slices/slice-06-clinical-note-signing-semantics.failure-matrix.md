# DESIGN-ONLY: Clinical Note Signing Semantics - Failure Matrix

## 1. CLASSIFICATION
- **Document Type**: DESIGN-ONLY
- **Governance Level**: SIGNING PATH SPECIFICATION
- **Scope**: FAILURE SCENARIOS ONLY (SignNote)
- **Status**: DRAFT / PROPOSED

## 2. PURPOSE
This document defines the deterministic failure scenarios for Slice 06 (Clinical Note Signing Semantics). It specifies the conditions under which the `SignNote` operation must be rejected. All failures are fail-closed, result in zero state mutation, and emit zero audit evidence.

## 3. FAILURE SEMANTICS (ABSOLUTE)
- **Fail-Closed**: Any constraint violation results in immediate termination of the request.
- **Zero Mutation**: No changes to the persistence layer or resource state are permitted on failure.
- **Zero Audit**: No audit events (e.g., `NOTE_SIGNED`) are emitted on failure to prevent side-channel leakage.
- **Synchronous Termination**: Error handling is terminal and occurs within the request-response cycle.
- **No Side Effects**: No background jobs, retries, or partial updates are permitted on failure.

## 4. FAILURE MATRIX

| Failure ID | Trigger Condition | Expected HTTP Outcome | Persistence Side Effects | Audit Expectation | Determinism Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S06-FM-01** | Missing or malformed tenant context | 4xx Class | NONE | NOT EMITTED | Fail-closed; ambiguous context |
| **S06-FM-02** | Missing or malformed authority context (Actor Identity) | 4xx Class | NONE | NOT EMITTED | Fail-closed; anonymous signing prohibited |
| **S06-FM-03** | Actor lacks `Signing Capability` | 4xx Class | NONE | NOT EMITTED | Fail-closed; capability-based authority required |
| **S06-FM-04** | Cross-tenant mismatch (Actor tenant != Note tenant) | 4xx Class | NONE | NOT EMITTED | Fail-closed; strict tenant isolation |
| **S06-FM-05** | Note not found (Invalid `noteId`) | 4xx Class | NONE | NOT EMITTED | Fail-closed; target resource missing |
| **S06-FM-06** | Note not in `DRAFT` state (e.g., already `SIGNED`) | 4xx Class | NONE | NOT EMITTED | Fail-closed; terminal state invariant |
| **S06-FM-07** | Note in non-signable state (e.g., `DELETED`, `ARCHIVED`) | 4xx Class | NONE | NOT EMITTED | Fail-closed; state gating restriction |
| **S06-FM-08** | Author-only constraint violation (if enforced by policy) | 4xx Class | NONE | NOT EMITTED | Fail-closed; policy-driven rejection |
| **S06-FM-09** | Timestamp source unavailable or untrusted | 5xx Class | NONE | NOT EMITTED | Fail-closed; temporal integrity failure |
| **S06-FM-10** | Persistence write failure (Database/Storage) | 5xx Class | NONE | NOT EMITTED | Fail-closed; atomicity violation |
| **S06-FM-11** | Audit sink failure (Audit emission rejected) | 5xx Class | NONE | NOT EMITTED | Fail-closed; observability requirement |

## 5. MANDATORY EXCLUSIONS
- **No Success Paths**: Successful signing is defined exclusively in the Golden Path.
- **No Implementation Details**: This matrix governs logical conditions, not specific code or database schemas.
- **No Retries**: All failures are terminal; no automated retry logic is permitted.
- **No Background Jobs**: All signing logic must be synchronous and deterministic.
- **No Best Effort**: The system does not attempt partial signing or "best effort" audit emission.

## 6. DETERMINISM GUARANTEES
- **Fail-Closed**: All operations are rejected if any constraint is not met.
- **Audit Silence**: The audit trail remains empty for all failed attempts.
- **State Integrity**: The resource state remains unchanged from its pre-request value.
- **Unambiguous Outcomes**: Every failure condition maps to a deterministic error response and zero side effects.
