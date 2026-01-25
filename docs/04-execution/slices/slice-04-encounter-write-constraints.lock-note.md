# Slice 04: Encounter Write Constraints
## GOVERNANCE LOCK NOTE

**Status:** FINAL, HARDENED, IMMUTABLE  
**Domain:** Encounter  
**Type:** GOVERNANCE LOCK NOTE  
**Scope:** DESIGN-ONLY  

---

### 1. Referenced Artifacts
The following Slice 04 design artifacts are hereby locked and declared immutable:

- `docs/04-execution/slices/slice-04-encounter-write-constraints.definition.md`
- `docs/04-execution/slices/slice-04-encounter-write-constraints.golden-path.md`
- `docs/04-execution/slices/slice-04-encounter-write-constraints.failure-matrix.md`
- `docs/04-execution/slices/slice-04-encounter-write-constraints.test-matrix.md`
- `docs/04-execution/slices/slice-04-encounter-write-constraints.implementation-sequencing.md`

---

### 2. Immutable Guarantees
Encounter write constraints defined in Slice 04 are FINAL. All mutations within this domain MUST adhere to the following guarantees:

- **Authoritative:** The Encounter service is the sole authority for all state transitions.
- **Deterministic:** Given the same input and state, the outcome must be identical and predictable.
- **Fail-Closed:** Any validation failure, system error, or ambiguous state must result in an immediate abort and a closed state.
- **Terminal States:** Once an Encounter reaches a terminal state (e.g., COMPLETED, CANCELLED), it is IMMUTABLE.
- **No Partial Updates:** All writes are atomic. Partial modification of an Encounter record is prohibited.
- **No Retries:** Automatic retries of failed write operations are prohibited within the service logic.
- **No Async/Background Behavior:** All write operations must be synchronous and complete within the request-response cycle.
- **No Administrative Bypass:** There are no "super-user" or administrative paths that circumvent these constraints.
- **No Role-Based Overrides:** Constraints apply uniformly regardless of the actor's role.
- **No Post-Terminal Mutation:** Any attempt to modify an Encounter in a terminal state must be rejected.

---

### 3. Audit Rules
- **Success Only:** Audit emissions occur ONLY upon successful mutation of the Encounter state.
- **Zero Emission on Failure:** No audit records shall be generated for failed or aborted operations.
- **Metadata-Only:** Audit payloads must contain metadata and state transition evidence only; no PII or sensitive clinical data.
- **Fail-Closed Audit:** If the audit emission fails, the entire transaction must fail (Fail-Closed).

---

### 4. Prohibitions
The following actions are strictly PROHIBITED:

- **Schema Changes:** No modifications to the Encounter schema are permitted under this slice.
- **Soft Deletes:** Deletion of Encounters is prohibited; state transitions to CANCELLED are the only valid removal path.
- **Re-opening Closed Encounters:** Transitioning an Encounter out of a terminal state is strictly forbidden.
- **Partial Writes:** No field-level updates that bypass full record validation.
- **Side Effects on Failure:** No external state changes or notifications may occur if the primary write fails.
- **Feature Flags:** No conditional bypasses or feature flags may be used to disable these constraints.

---

### 5. Governance Statement
Slice 04 (Encounter Write Constraints) is hereby **LOCKED**. 

Any future modification to the behavior, constraints, or logic defined in the referenced artifacts requires the initiation of a new execution slice and a formal design process. This lock note supersedes all prior informal documentation and establishes the hardened baseline for Encounter write operations.
