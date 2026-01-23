# Implementation Sequencing Plan — Slice 01: Clinical Note Lifecycle

## 1. Purpose

This document defines the mandatory build order for implementing Slice 01: Clinical Note Lifecycle. Implementation sequencing is required for the following reasons:

- **Risk Reduction**: Layered construction ensures that foundational components are validated before dependent components are built. Authorization failures detected late in development are exponentially more costly to remediate.
- **Determinism**: A fixed sequence eliminates ambiguity in what is built, when, and in what order. Parallel or ad-hoc implementation introduces non-deterministic state and untraceable defects.
- **Audit Safety**: Regulators require evidence that systems were constructed methodically. An explicit sequencing plan provides that evidence.
- **Dependency Integrity**: Each layer depends on the correctness of the layer beneath it. Building out of order creates circular dependencies and hidden coupling.

**Deviation from this sequence is forbidden.** Any implementation that does not follow this order is non-compliant and must be rejected during review.

---

## 2. Reference Artifacts

This sequencing plan is derived from and constrained by the following authoritative documents:

| Artifact | Location | Purpose |
| :--- | :--- | :--- |
| Slice 01 Execution Definition | `docs/04-execution/slices/slice-01-clinical-note-golden-path.md` | Defines scope, constraints, and explicit non-existence |
| Slice 01 Golden Path Flow | `docs/04-execution/slices/slice-01-clinical-note-golden-path.flow.md` | Defines the end-to-end success path and layer boundaries |
| Slice 01 Failure Matrix | `docs/04-execution/slices/slice-01-clinical-note-failure-matrix.md` | Defines all failure modes, detection points, and error semantics |
| Slice 01 Test Matrix | `docs/04-execution/slices/slice-01-clinical-note-test-matrix.md` | Defines the complete and required test coverage |

All implementation decisions must trace back to these artifacts. Implementation of behavior not defined in these artifacts is forbidden.

---

## 3. Layered Build Order

Implementation proceeds through five layers in strict sequence. Each layer must be complete and tested before the next layer begins.

### Layer 1: Transport Boundary

**What is built:**
- HTTP route definitions for all four operations (`startDraft`, `updateDraft`, `finalizeNote`, `readNote`)
- Request payload validation (schema enforcement)
- Header extraction (`tenantId`, `AuthorityContext`)
- Transport-level error responses (400 for missing/malformed inputs)

**What is NOT built:**
- Authorization logic
- Business logic
- Persistence operations
- Audit emissions

**Assumptions allowed:**
- Downstream layers return stub responses
- Authorization always passes (mocked)

**Dependencies that must exist:**
- HTTP framework configuration
- Error type definitions (`ValidationError`)
- Request/Response DTO shapes

**Completion criteria:**
- Tests S01-FM-01 and S01-FM-03 pass (missing `tenantId`, missing `AuthorityContext`)
- All four routes accept well-formed requests and reject malformed requests
- No downstream calls are made for transport validation failures

---

### Layer 2: Authorization Boundary

**What is built:**
- `tenantId` validation logic
- `AuthorityContext` parsing and validation
- Role verification (`clinician` role required)
- Tenant isolation enforcement (cross-tenant denial)
- `SecurityEvidence` audit emission for authorization failures

**What is NOT built:**
- Service-level business logic
- Entity existence checks
- State machine enforcement
- Persistence operations

**Assumptions allowed:**
- Service layer returns stub responses for authorized requests
- Entity existence checks are deferred

**Dependencies that must exist:**
- Transport Boundary (Layer 1) complete
- `AuthError` type definitions (401, 403)
- `SecurityEvidence` audit event schema

**Completion criteria:**
- Tests S01-FM-02, S01-FM-04, S01-FM-05 pass (invalid `tenantId`, invalid `AuthorityContext`, wrong role)
- Tests S01-FM-11, S01-FM-19 pass (cross-tenant access for `updateDraft` and `readNote`)
- All authorization failures emit `SecurityEvidence` audit event
- Authorization is binary (Allow/Deny) with no partial states

---

### Layer 3: Service Layer

**What is built:**
- `ClinicalDocumentationService` with all four operations
- Entity existence validation (Patient, Encounter, Note)
- State machine enforcement (`DRAFT` → `SIGNED` transition)
- Concurrency conflict detection (optimistic locking)
- Input validation at service boundary

**What is NOT built:**
- Persistence implementation (mocked)
- Audit emission implementation (mocked)

**Assumptions allowed:**
- Persistence returns controlled responses for test setup
- Audit sink accepts all emissions

**Dependencies that must exist:**
- Transport Boundary (Layer 1) complete
- Authorization Boundary (Layer 2) complete
- `NotFoundError` type definition (404)
- `ConflictError` type definition (409)
- State enum (`DRAFT`, `SIGNED`)

**Completion criteria:**
- Tests S01-FM-06, S01-FM-07 pass (Patient not found, Encounter not found)
- Tests S01-FM-10, S01-FM-15, S01-FM-18 pass (Note not found for `updateDraft`, `finalizeNote`, `readNote`)
- Tests S01-FM-12, S01-FM-16 pass (state machine violations: update after signing, finalize already signed)
- Test S01-FM-13 passes (concurrent update conflict)
- State transitions are enforced and non-reversible

---

### Layer 4: Persistence Layer

**What is built:**
- `ClinicalNoteDraft` entity storage
- `DraftVersion` entity storage (immutable)
- Create, Read, Update operations
- Tenant-scoped queries
- Optimistic locking mechanism
- Persistence failure propagation

**What is NOT built:**
- Delete operations (not in scope)
- Soft delete (explicitly forbidden)
- Version rollback (explicitly forbidden)

**Assumptions allowed:**
- Audit sink is available

**Dependencies that must exist:**
- Transport Boundary (Layer 1) complete
- Authorization Boundary (Layer 2) complete
- Service Layer (Layer 3) complete
- Database schema for `ClinicalNoteDraft` and `DraftVersion`
- `SystemError` type definition (500)

**Completion criteria:**
- Tests S01-FM-08, S01-FM-14, S01-FM-17, S01-FM-20 pass (persistence failures for all operations)
- All persistence operations enforce tenant isolation
- Version numbers increment correctly
- Persistence failures propagate as `SystemError` (500)

---

### Layer 5: Audit Emission

**What is built:**
- `NOTE_DRAFT_STARTED` event emission
- `NOTE_DRAFT_UPDATED` event emission
- `NOTE_FINALIZED` event emission
- `NOTE_READ` event emission
- Audit sink failure handling (fail-closed)
- Atomic binding of business transaction and audit record

**What is NOT built:**
- Background audit emission
- Delayed or batched audit
- Audit recovery mechanisms

**Assumptions allowed:**
- None. Audit is the final integration layer.

**Dependencies that must exist:**
- Transport Boundary (Layer 1) complete
- Authorization Boundary (Layer 2) complete
- Service Layer (Layer 3) complete
- Persistence Layer (Layer 4) complete
- Audit sink infrastructure

**Completion criteria:**
- Test S01-FM-09 passes (audit sink unavailable causes rollback)
- All Golden Path tests (S01-GP-01 through S01-GP-04) pass
- All audit events contain required correlation fields (`tenantId`, `clinicianId`, `noteId`, `encounterId`, `timestamp`)
- Audit payloads contain no PHI/PII
- Audit emission is synchronous with operation completion

---

## 4. Operation-by-Operation Sequencing

Operations are implemented in strict sequence. Parallel implementation of multiple operations is forbidden.

### Operation 1: `startDraft`

**Build order:**
1. Transport route and validation
2. Authorization check (role, tenant)
3. Service logic (Patient/Encounter existence)
4. Persistence (create draft and initial version)
5. Audit emission (`NOTE_DRAFT_STARTED`)

**Prerequisites:**
- None (first operation)

**Tests that must pass before proceeding:**
- S01-GP-01: Successful draft creation
- S01-FM-01: Missing `tenantId`
- S01-FM-02: Invalid `tenantId`
- S01-FM-03: Missing `AuthorityContext`
- S01-FM-04: Invalid `AuthorityContext`
- S01-FM-05: Wrong role
- S01-FM-06: Patient not found
- S01-FM-07: Encounter not found
- S01-FM-08: Persistence write failure
- S01-FM-09: Audit sink unavailable

**Explicit prohibition:**
- Implementation of `updateDraft` must not begin until all `startDraft` tests pass.

---

### Operation 2: `updateDraft`

**Build order:**
1. Transport route and validation
2. Authorization check (role, tenant, author ownership)
3. Service logic (Note existence, state check, concurrency)
4. Persistence (create new version, update pointer)
5. Audit emission (`NOTE_DRAFT_UPDATED`)

**Prerequisites:**
- `startDraft` fully implemented and tested
- Draft entity must exist (created by `startDraft`)

**Tests that must pass before proceeding:**
- S01-GP-02: Successful draft update
- S01-FM-10: Note not found
- S01-FM-11: Cross-tenant access
- S01-FM-12: Update after signing
- S01-FM-13: Concurrent update conflict
- S01-FM-14: Persistence write failure

**Explicit prohibition:**
- Implementation of `finalizeNote` must not begin until all `updateDraft` tests pass.

---

### Operation 3: `finalizeNote`

**Build order:**
1. Transport route and validation
2. Authorization check (role, tenant, author ownership)
3. Service logic (Note existence, state check)
4. Persistence (update status to SIGNED)
5. Audit emission (`NOTE_FINALIZED`)

**Prerequisites:**
- `startDraft` fully implemented and tested
- `updateDraft` fully implemented and tested
- Draft entity must exist in `DRAFT` state

**Tests that must pass before proceeding:**
- S01-GP-03: Successful note finalization
- S01-FM-15: Note not found
- S01-FM-16: Draft already signed
- S01-FM-17: Persistence write failure

**Explicit prohibition:**
- Implementation of `readNote` must not begin until all `finalizeNote` tests pass.

---

### Operation 4: `readNote`

**Build order:**
1. Transport route and validation
2. Authorization check (role, tenant)
3. Service logic (Note existence)
4. Persistence (read draft and version)
5. Audit emission (`NOTE_READ`)

**Prerequisites:**
- `startDraft` fully implemented and tested
- `updateDraft` fully implemented and tested
- `finalizeNote` fully implemented and tested
- Note entity must exist in `SIGNED` state

**Tests that must pass before proceeding:**
- S01-GP-04: Successful read of signed note
- S01-FM-18: Note not found
- S01-FM-19: Cross-tenant access
- S01-FM-20: Persistence read failure

**Explicit prohibition:**
- Slice 01 is not complete until all `readNote` tests pass.

---

## 5. Test Enablement Strategy

### When tests are written

Tests are written before implementation begins. Each layer and operation has a defined set of tests from the Test Matrix. Tests are authored in advance based on the Test Matrix specification.

### When tests are activated

Tests are activated (enabled to run) when:
1. All dependencies for that test are implemented
2. The preceding layer or operation is complete
3. The test can execute without environmental blockers

### Why failing tests block further work

A failing test indicates one of the following:
- The implementation does not match the specification
- A dependency is missing or incorrectly implemented
- The test itself is incorrectly specified (requires Test Matrix amendment)

In all cases, forward progress is blocked until the failure is resolved. Moving forward with failing tests introduces compounding errors that are exponentially harder to diagnose and fix.

### Why test green equals permission to proceed

A passing test provides evidence that:
- The behavior matches the specification
- Dependencies are correctly wired
- Error handling works as defined

Only when all tests for a layer or operation pass is the implementer permitted to proceed to the next phase.

---

## 6. Explicit Prohibitions

The following actions are forbidden during Slice 01 implementation:

| Prohibition | Rationale |
| :--- | :--- |
| Parallel operation implementation | Operations depend on each other; parallel work creates untestable states |
| Shared abstractions until forced | Premature abstraction introduces coupling and obscures boundaries |
| Refactors during slice execution | Refactoring changes behavior; behavior changes require Test Matrix updates |
| Schema changes outside persistence scope | Schema changes affect other slices and require governance review |
| Audit changes without test updates | Audit is a contractual obligation; changes require synchronized documentation |
| Implementation of out-of-scope features | Features not in the Execution Slice definition do not exist |
| Partial or incremental deployments | Slice 01 is atomic; partial deployment is undefined |
| Silent error swallowing | All errors must propagate with defined error types and status codes |
| Retry logic that changes semantics | Retries are forbidden per Failure Matrix |
| PHI in logs or audit payloads | Regulatory violation; non-negotiable |
| Background processing | All operations are synchronous per Golden Path Flow |
| Admin override paths | No bypass of state or authorization rules per Failure Matrix |

---

## 7. Completion Criteria for Slice 01

Slice 01 is considered COMPLETE when all of the following conditions are satisfied:

### Test Coverage

- [ ] All 24 Test Matrix rows pass (S01-GP-01 through S01-GP-04, S01-FM-01 through S01-FM-20)
- [ ] No test is skipped, ignored, or marked pending
- [ ] Test results are deterministic (same result on every run)

### Behavioral Completeness

- [ ] All four operations (`startDraft`, `updateDraft`, `finalizeNote`, `readNote`) are implemented
- [ ] State machine transitions are enforced (`DRAFT` → `SIGNED` only)
- [ ] All failures fail-closed with defined error types
- [ ] No undocumented behavior exists

### Audit Integrity

- [ ] All audit events defined in the Golden Path Flow are emitted
- [ ] `SecurityEvidence` is emitted for all authorization failures
- [ ] Audit payloads contain no PHI/PII
- [ ] Audit sink failure causes operation rollback

### Code Quality

- [ ] No TODOs in implementation code
- [ ] No feature flags or conditional paths
- [ ] No partial implementations
- [ ] No dead code or unreachable branches

### Documentation Alignment

- [ ] Implementation matches Execution Slice definition
- [ ] Implementation matches Golden Path Flow
- [ ] Implementation matches Failure Matrix
- [ ] Implementation matches Test Matrix

---

## 8. Lock Statement

This Implementation Sequencing Plan is **FINAL** for Slice 01: Clinical Note Lifecycle.

- Any deviation from this sequence is non-compliant.
- Any change to this plan requires synchronized updates to:
  - Slice 01 Execution Definition
  - Slice 01 Golden Path Flow
  - Slice 01 Failure Matrix
  - Slice 01 Test Matrix
- All documents must be updated and re-committed together to maintain architectural integrity.
- Unauthorized deviation from this sequencing plan is a blocking defect and must be remediated before slice completion can be declared.

---

**Document Classification:** EXECUTION ARCHITECTURE  
**Slice Identifier:** slice-01-clinical-note-lifecycle  
**Status:** LOCKED
