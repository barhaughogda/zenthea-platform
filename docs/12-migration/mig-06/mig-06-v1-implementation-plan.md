# MIG-06 v1 Implementation Plan

**Document ID:** MIG-06-V1-IMPL  
**Mode:** IMPLEMENTATION / PHASE E — MIG-06 PROOF-OF-CONCEPT  
**Status:** DRAFT  
**Authority:** E-13-MUR (MIG-06 Unblock Record)  
**Prerequisites:** Phase E SEALED; E-13 IMPLEMENTATION-ALLOWED status active.

---

## 1. Purpose & Non-Goals

### 1.1 Purpose

MIG-06 v1 is a **minimum, proof-oriented implementation** that demonstrates the Phase E orchestration rails function correctly under governance control. This version SHALL prove:

1. A single orchestration can be triggered, validated, policy-gated, executed, audited, and terminated.
2. The orchestration adheres to E-03 contract interfaces without deviation.
3. The readiness model (E-04) blocks execution when dependencies are NOT_READY.
4. The failure taxonomy (E-05) produces deterministic abort outcomes.
5. The observability requirements (E-06) emit all mandatory signals with correct correlation.
6. A single, governed agent can produce a draft-only clinical assistance output.

MIG-06 v1 is NOT a production system. It is a **verification artifact** that proves the orchestration design is implementable without governance violation.

### 1.2 Non-Goals (Explicit Prohibitions)

The following behaviors are **STRICTLY FORBIDDEN** in MIG-06 v1:

| Prohibition | Rationale |
|:---|:---|
| Multiple orchestrations | Scope is single orchestration proof. |
| Multiple agents | Scope is single agent proof. |
| Clinical finalization, signing, attestation, or write-back | Draft-only doctrine (MIG-04A). |
| PHI/PII in any orchestration artifact | E-01 §9.3 data boundary invariant. |
| Persistence beyond audit sink | No state persistence permitted. |
| Retries (implicit or explicit) | E-05 §4.1 default NEVER; E-01 §5.7 non-retryable. |
| Background jobs, workers, or daemons | E-04 §5.1 explicit prohibition. |
| Queues or message brokers | E-03 §5.3 stateful engine prohibition. |
| Parallelism or concurrent execution | Single-step proof only. |
| UI changes or operator surface modifications | Out of scope for rails proof. |
| New Control Plane contracts | E-13 §4.2 prohibited actions. |
| Autonomous scope expansion | E-01 §9.2 non-autonomy invariant. |
| Runtime policy/view authoring | E-01 §1.3 explicit exclusion. |
| Cache-based execution | E-01 §9.5 CP-21 posture. |
| Degraded or best-effort execution | E-04 §3.2 prohibited states. |

---

## 2. Orchestration Overview

### 2.1 Trigger Classification

MIG-06 v1 SHALL support **exactly one** trigger classification:

| Classification | Description | E-03 Mapping |
|:---|:---|:---|
| `MIG06_V1_CLINICAL_DRAFT_ASSIST` | Operator-initiated request for draft clinical assistance | `OrchestrationTrigger.classification` |

All other trigger classifications SHALL be rejected with `POL-001` (Policy Denied).

### 2.2 Policy Gate

The policy gate SHALL evaluate the following conditions before execution is authorized:

1. Trigger classification MUST be `MIG06_V1_CLINICAL_DRAFT_ASSIST`.
2. Trigger metadata MUST be complete and valid per E-03 §1.1.
3. Policy version MUST match Control Plane authority.
4. Operator presence signal MUST be active (E-04 §2.1.4).
5. All dependencies MUST report READY status (E-04 §2).

If any condition fails, the orchestration SHALL transition to a terminal state without execution.

### 2.3 Single-Step Execution

MIG-06 v1 SHALL execute **exactly one** orchestration step:

| Step | Agent | Input | Output |
|:---|:---|:---|:---|
| `CLINICAL_DRAFT_GENERATION` | Clinical Documentation Agent | Metadata-only context reference | Draft-only clinical assistance metadata |

The step SHALL:
- Invoke the agent via the governed agent runtime boundary.
- Pass only metadata references (no PHI/PII).
- Receive only metadata-only results.
- NOT produce any clinical write-back, finalization, or state advancement.

### 2.4 Terminal Outcomes

Every orchestration attempt MUST terminate in exactly one of the following states:

| Outcome | E-01 State | Condition |
|:---|:---|:---|
| Success | `SUCCEEDED` | Step completed, audit accepted. |
| Policy Denied | `REJECTED` | Policy gate returned DENY. |
| Validation Failed | `BLOCKED` | Context missing, malformed, or contains forbidden content. |
| Dependency Unavailable | `BLOCKED` | Any dependency NOT_READY during readiness check. |
| Audit Failed | `ERROR` | Audit sink unreachable or NACK received. |
| Agent Failed | `ERROR` | Agent returned non-success outcome. |
| Operator Cancelled | `CANCELLED` | Explicit operator termination. |

No other terminal outcomes are permitted. Any unexpected condition SHALL map to `ERROR` with `EXE-001` (Invariant Violation).

---

## 3. Orchestration Flow (Step-by-Step)

The following sequence is **mandatory** and **non-skippable**. Each step MUST complete successfully before proceeding to the next.

### Step 1: Trigger Reception

**Input:** `OrchestrationTrigger` (E-03 §1.1)

**Actions:**
1. Validate trigger structure against E-03 §1.1 schema.
2. Verify `version` field equals `1.0.0`.
3. Verify `trigger_id` is a valid UUID.
4. Verify `classification` equals `MIG06_V1_CLINICAL_DRAFT_ASSIST`.
5. Verify `timestamp` is valid ISO8601.
6. Generate `orchestration_attempt_id` (UUID).
7. Emit `TRIGGER_RECEIVED` signal (E-06 §2.1).

**Outcomes:**
- **PASS:** Transition to Step 2 (Readiness Check).
- **FAIL (unknown classification):** Emit `POL-001`, transition to `REJECTED`.
- **FAIL (malformed trigger):** Emit `CON-001` or `CON-002`, transition to `BLOCKED`.

### Step 2: Readiness Check (E-04)

**Input:** None (system state inspection)

**Actions:**
1. Query Control Plane availability signal.
2. Query Policy Engine availability signal.
3. Query Audit Sink availability signal.
4. Query Operator Presence signal.
5. Query Agent Runtime availability signal.
6. Verify all version hashes match Control Plane authority.
7. Verify no signal is EXPIRED per CP-21 safety window.
8. Emit `READINESS_VALIDATED` signal if all dependencies READY.

**Outcomes:**
- **PASS:** Transition to Step 3 (Policy Evaluation).
- **FAIL (any dependency NOT_READY):** Emit `INF-001`, transition to `BLOCKED`.
- **FAIL (version mismatch):** Emit `POL-002`, transition to `BLOCKED`.
- **FAIL (operator offline):** Emit `OPR-002`, transition to `BLOCKED`.

### Step 3: Policy Evaluation

**Input:** `OrchestrationContext` (E-03 §1.3)

**Actions:**
1. Construct `OrchestrationContext` with:
   - `attempt_id` from Step 1
   - `policy_id` = `MIG06_V1_POLICY`
   - `policy_version` = `1.0.0`
   - `trace_id` from distributed trace context
   - `audit_id` (UUID)
   - `governance_mode` = `PHASE_E_RESTRICTED`
2. Invoke `ControlPlane.EvaluatePolicy(context)`.
3. Record `policy_decision_id` from response.
4. Emit `POLICY_EVALUATED` signal with outcome (E-06 §2.3).

**Outcomes:**
- **PASS (ALLOW):** Transition to `AUTHORIZED`, then Step 4.
- **FAIL (DENY):** Emit `POL-001`, transition to `REJECTED`.
- **FAIL (timeout):** Emit `INF-002`, transition to `BLOCKED`.
- **FAIL (unknown policy):** Emit `POL-002`, transition to `BLOCKED`.

### Step 4: Command Dispatch

**Input:** `OrchestrationCommand` (E-03 §1.2)

**Actions:**
1. Transition to `RUNNING`.
2. Emit `STEP_STARTED` signal (E-06 §2.4).
3. Construct `OrchestrationCommand` with:
   - `version` = `1.0.0`
   - `command_id` (UUID)
   - `attempt_id` from Step 1
   - `type` = `CLINICAL_DRAFT_GENERATION`
   - `parameters` = metadata-only context reference
   - `idempotency_key` = deterministic derivation from `attempt_id`
4. Dispatch command to Clinical Documentation Agent via governed runtime.
5. Await synchronous response (no background execution).
6. Validate response contains no PHI/PII.
7. Emit `STEP_COMPLETED` signal.

**Outcomes:**
- **PASS:** Transition to Step 5 (Audit Emission).
- **FAIL (agent error):** Emit `EXE-002`, transition to `ERROR`.
- **FAIL (PHI detected):** Emit `SEC-001`, transition to `ERROR`.
- **FAIL (timeout):** Emit `INF-002`, transition to `ERROR`.

### Step 5: Audit Emission

**Input:** Execution results (metadata-only)

**Actions:**
1. Transition to `AUDITING`.
2. Construct audit bundle containing:
   - `orchestration_attempt_id`
   - `trigger_id`
   - `policy_decision_id`
   - `command_id`
   - `outcome` = `DRAFT_GENERATED`
   - `evidence` = metadata-only execution markers
   - `timestamp`
3. Emit `StateTransitionRecorded` to Audit Sink.
4. Await synchronous ACK from Audit Sink.
5. Record `audit_correlation_id` from ACK.

**Outcomes:**
- **PASS (ACK received):** Transition to Step 6.
- **FAIL (NACK received):** Emit `AUD-002`, transition to `ERROR`.
- **FAIL (sink unreachable):** Emit `AUD-001`, transition to `BLOCKED`.

### Step 6: Completion

**Input:** `audit_correlation_id`

**Actions:**
1. Construct `OrchestrationResult` (E-03 §1.4) with:
   - `version` = `1.0.0`
   - `attempt_id`
   - `outcome` = `SUCCEEDED`
   - `evidence` = metadata-only completion markers
   - `audit_correlation_id`
2. Emit `ATTEMPT_COMPLETED` signal.
3. Wipe ephemeral execution context.
4. Transition to `SUCCEEDED`.

**Outcomes:**
- **PASS:** Terminal state `SUCCEEDED` reached.

---

## 4. Components to Implement

### 4.1 Orchestrator Skeleton

**Purpose:** Coordinate the six-step flow defined in Section 3.

**Responsibilities:**
- Accept `OrchestrationTrigger` input.
- Manage state transitions per E-01 §4.
- Invoke other components in mandatory sequence.
- Enforce fail-closed behavior on any failure.
- Produce `OrchestrationResult` or `OrchestrationAbort`.

**Constraints:**
- MUST be stateless (no persisted orchestration state).
- MUST be synchronous (no async execution paths).
- MUST enforce single-threaded execution per attempt.

### 4.2 Runner

**Purpose:** Execute the single permitted command type.

**Responsibilities:**
- Validate `OrchestrationCommand` structure.
- Route command to appropriate agent adapter.
- Enforce idempotency key collision detection.
- Capture and validate agent response.
- Detect PHI/PII in responses (fail-closed).

**Constraints:**
- MUST support only `CLINICAL_DRAFT_GENERATION` command type.
- MUST NOT implement retry logic.
- MUST NOT buffer or queue commands.

### 4.3 Agent Adapter

**Purpose:** Bridge between runner and Clinical Documentation Agent.

**Responsibilities:**
- Transform `OrchestrationCommand` to agent-compatible request.
- Invoke agent via governed runtime boundary.
- Transform agent response to metadata-only format.
- Propagate trace context to agent.

**Constraints:**
- MUST enforce metadata-only contract on both sides.
- MUST NOT modify agent behavior or scope.
- MUST NOT cache agent responses.

### 4.4 Policy Hook

**Purpose:** Integrate with Control Plane policy evaluation.

**Responsibilities:**
- Construct policy evaluation request.
- Invoke `ControlPlane.EvaluatePolicy()`.
- Interpret ALLOW/DENY outcomes.
- Extract `policy_decision_id`.

**Constraints:**
- MUST use synchronous evaluation only.
- MUST NOT implement policy caching.
- MUST NOT implement policy fallbacks.

### 4.5 Audit Wiring

**Purpose:** Emit mandatory signals to Audit Sink.

**Responsibilities:**
- Emit all signals defined in E-06 §2.
- Propagate correlation identifiers.
- Verify ACK/NACK from sink.
- Enforce fail-closed on emission failure.

**Constraints:**
- MUST be synchronous (await ACK before proceeding).
- MUST NOT use best-effort delivery.
- MUST NOT batch or defer emissions.

---

## 5. File & Module Layout

The following files SHALL be created under the `services/` directory structure. No speculative directories SHALL be created.

```
services/
└── orchestration/
    ├── package.json
    ├── tsconfig.json
    ├── README.md
    └── src/
        ├── index.ts                          # Public exports
        ├── orchestrator.ts                   # Orchestrator skeleton (§4.1)
        ├── runner.ts                         # Command runner (§4.2)
        ├── adapters/
        │   └── clinical-documentation-agent-adapter.ts  # Agent adapter (§4.3)
        ├── hooks/
        │   ├── policy-hook.ts                # Policy integration (§4.4)
        │   └── audit-hook.ts                 # Audit wiring (§4.5)
        ├── contracts/
        │   ├── trigger.ts                    # OrchestrationTrigger (E-03 §1.1)
        │   ├── command.ts                    # OrchestrationCommand (E-03 §1.2)
        │   ├── context.ts                    # OrchestrationContext (E-03 §1.3)
        │   ├── result.ts                     # OrchestrationResult (E-03 §1.4)
        │   └── abort.ts                      # OrchestrationAbort (E-03 §1.5)
        ├── state/
        │   └── state-machine.ts              # State model (E-01 §4)
        ├── validation/
        │   ├── trigger-validator.ts          # Trigger structure validation
        │   ├── context-validator.ts          # Context completeness validation
        │   └── phi-detector.ts               # PHI/PII detection (fail-closed)
        ├── readiness/
        │   └── readiness-checker.ts          # Dependency readiness (E-04)
        └── failure/
            └── failure-handler.ts            # Failure taxonomy mapping (E-05)
```

### 5.1 File Count Summary

| Directory | File Count | Purpose |
|:---|:---:|:---|
| `src/` root | 3 | Core orchestration logic |
| `src/adapters/` | 1 | Agent integration |
| `src/hooks/` | 2 | CP and audit integration |
| `src/contracts/` | 5 | E-03 interface types |
| `src/state/` | 1 | E-01 state machine |
| `src/validation/` | 3 | Input validation |
| `src/readiness/` | 1 | E-04 readiness |
| `src/failure/` | 1 | E-05 failure handling |
| **Total** | **17** | |

---

## 6. Governance Mapping

### 6.1 Phase E Document Compliance Matrix

| Component | E-01 | E-03 | E-04 | E-05 | E-06 |
|:---|:---:|:---:|:---:|:---:|:---:|
| Orchestrator | §3, §4 | §1 | — | §5 | §7 |
| Runner | §3.2 (Phase 4) | §1.2 | — | §3 | §2.4 |
| Agent Adapter | §2.4 | §4 | — | §3.1 | §3 |
| Policy Hook | §3.2 (Phase 3) | §3 | — | §4 | §2.3 |
| Audit Wiring | §3.2 (Phase 5) | §3.2 | — | §5.5 | §2, §4 |
| State Machine | §4 | — | — | §3 | §2.5 |
| Readiness Checker | — | — | §2, §3 | §6 | §2.2 |
| Failure Handler | §5 | §1.5 | §6 | §2, §3, §7 | §5 |

### 6.2 Contract Interface Compliance

| Interface | E-03 Reference | Implementation File |
|:---|:---|:---|
| `OrchestrationTrigger` | §1.1 | `contracts/trigger.ts` |
| `OrchestrationCommand` | §1.2 | `contracts/command.ts` |
| `OrchestrationContext` | §1.3 | `contracts/context.ts` |
| `OrchestrationResult` | §1.4 | `contracts/result.ts` |
| `OrchestrationAbort` | §1.5 | `contracts/abort.ts` |

### 6.3 Failure Code Compliance (E-05 §2)

| Code | Category | Handling Location |
|:---|:---|:---|
| `INF-001` | INFRASTRUCTURE | `readiness-checker.ts` |
| `INF-002` | INFRASTRUCTURE | `policy-hook.ts`, `runner.ts` |
| `POL-001` | POLICY | `policy-hook.ts`, `trigger-validator.ts` |
| `POL-002` | POLICY | `policy-hook.ts`, `readiness-checker.ts` |
| `AUD-001` | AUDIT | `audit-hook.ts` |
| `AUD-002` | AUDIT | `audit-hook.ts` |
| `CON-001` | CONTRACT | `trigger-validator.ts`, `context-validator.ts` |
| `CON-002` | CONTRACT | `trigger-validator.ts`, `context-validator.ts` |
| `SEC-001` | SECURITY | `phi-detector.ts` |
| `EXE-001` | EXECUTION | `state-machine.ts`, `failure-handler.ts` |
| `EXE-002` | EXECUTION | `runner.ts` |
| `OPR-001` | OPERATOR | `orchestrator.ts` |
| `OPR-002` | OPERATOR | `readiness-checker.ts` |

### 6.4 No New Evidence Artifacts

MIG-06 v1 SHALL NOT create any new Phase E evidence artifacts. The implementation proves the existing sealed artifacts (P1–P6) are sufficient and correct. No modifications to `docs/16-phase-e/evidence/` are permitted.

---

## 7. Testing Strategy

All tests MUST be deterministic, synchronous, and reproducible. Test execution SHALL NOT require external services or network access beyond mocked boundaries.

### 7.1 Happy Path Test

**Scenario:** Complete orchestration succeeds.

**Preconditions:**
- All dependencies return READY.
- Policy evaluation returns ALLOW.
- Agent returns valid metadata-only response.
- Audit sink returns ACK.

**Expected Outcome:**
- Terminal state: `SUCCEEDED`
- All six E-06 signals emitted in order.
- `OrchestrationResult` contains valid `audit_correlation_id`.

**Verification:**
- Assert state transitions: `NEW → VALIDATING → GATED → AUTHORIZED → RUNNING → AUDITING → SUCCEEDED`.
- Assert all correlation IDs match across signals.

### 7.2 Policy Denial Test

**Scenario:** Policy evaluation returns DENY.

**Preconditions:**
- All dependencies return READY.
- Policy evaluation returns DENY.

**Expected Outcome:**
- Terminal state: `REJECTED`
- Abort signal emitted with `reason_code` = `POL-001`.
- No execution step occurs.

**Verification:**
- Assert state transitions: `NEW → VALIDATING → GATED → REJECTED`.
- Assert `STEP_STARTED` signal NOT emitted.

### 7.3 Audit Failure Test

**Scenario:** Audit sink returns NACK.

**Preconditions:**
- All dependencies return READY.
- Policy evaluation returns ALLOW.
- Agent returns valid response.
- Audit sink returns NACK.

**Expected Outcome:**
- Terminal state: `ERROR`
- Abort signal emitted with `reason_code` = `AUD-002`.

**Verification:**
- Assert state transitions: `NEW → VALIDATING → GATED → AUTHORIZED → RUNNING → AUDITING → ERROR`.
- Assert abort metadata contains `audit_id`.

### 7.4 Agent Failure Test

**Scenario:** Agent returns error response.

**Preconditions:**
- All dependencies return READY.
- Policy evaluation returns ALLOW.
- Agent returns error outcome.

**Expected Outcome:**
- Terminal state: `ERROR`
- Abort signal emitted with `reason_code` = `EXE-002`.

**Verification:**
- Assert state transitions: `NEW → VALIDATING → GATED → AUTHORIZED → RUNNING → ERROR`.
- Assert `STEP_COMPLETED` signal NOT emitted (abort before completion).

### 7.5 Missing Context Test

**Scenario:** Required trigger field is missing.

**Preconditions:**
- Trigger payload missing `trigger_id` field.

**Expected Outcome:**
- Terminal state: `BLOCKED`
- Abort signal emitted with `reason_code` = `CON-002`.

**Verification:**
- Assert state transitions: `NEW → BLOCKED`.
- Assert validation occurs before readiness check.

### 7.6 Dependency Unavailable Test

**Scenario:** Control Plane returns NOT_READY.

**Preconditions:**
- Control Plane availability signal returns NOT_READY.

**Expected Outcome:**
- Terminal state: `BLOCKED`
- Abort signal emitted with `reason_code` = `INF-001`.

**Verification:**
- Assert state transitions: `NEW → VALIDATING → BLOCKED`.
- Assert policy evaluation NOT attempted.

### 7.7 PHI Detection Test

**Scenario:** Agent response contains PHI indicator.

**Preconditions:**
- All dependencies return READY.
- Policy evaluation returns ALLOW.
- Agent returns response with detected PHI pattern.

**Expected Outcome:**
- Terminal state: `ERROR`
- Abort signal emitted with `reason_code` = `SEC-001`.

**Verification:**
- Assert PHI detector triggered abort.
- Assert no PHI propagated to audit or result.

### 7.8 Unknown Trigger Classification Test

**Scenario:** Trigger has unknown classification.

**Preconditions:**
- Trigger `classification` = `UNKNOWN_TYPE`.

**Expected Outcome:**
- Terminal state: `REJECTED`
- Abort signal emitted with `reason_code` = `POL-001`.

**Verification:**
- Assert deny-by-default behavior.
- Assert no readiness check performed for denied classification.

### 7.9 Test Coverage Requirements

| Category | Minimum Coverage |
|:---|:---:|
| State transitions | 100% |
| Failure codes | 100% |
| E-06 signals | 100% |
| Contract validation | 100% |

---

## 8. PR Decomposition Plan

The implementation SHALL be delivered in **small, reviewable PRs** with clear intent. Each PR MUST be independently reviewable and MUST NOT introduce partial or broken states.

### PR-01: Contract Types

**Intent:** Define E-03 interface types.

**Files:**
- `contracts/trigger.ts`
- `contracts/command.ts`
- `contracts/context.ts`
- `contracts/result.ts`
- `contracts/abort.ts`

**Review Focus:** Schema compliance with E-03 §1.

**Estimated Size:** ~200 lines

---

### PR-02: State Machine

**Intent:** Implement E-01 §4 state model.

**Files:**
- `state/state-machine.ts`

**Review Focus:** Transition rules per E-01 §4.3, forbidden transitions per E-01 §4.4.

**Estimated Size:** ~150 lines

---

### PR-03: Validation Layer

**Intent:** Implement trigger and context validation.

**Files:**
- `validation/trigger-validator.ts`
- `validation/context-validator.ts`
- `validation/phi-detector.ts`

**Review Focus:** Fail-closed on missing fields (E-03 §0), PHI detection (E-01 §9.3).

**Estimated Size:** ~250 lines

---

### PR-04: Failure Handler

**Intent:** Implement E-05 failure taxonomy mapping.

**Files:**
- `failure/failure-handler.ts`

**Review Focus:** Complete failure code coverage per E-05 §2.

**Estimated Size:** ~150 lines

---

### PR-05: Readiness Checker

**Intent:** Implement E-04 dependency validation.

**Files:**
- `readiness/readiness-checker.ts`

**Review Focus:** All dependency signals checked per E-04 §2.1, fail-closed on NOT_READY.

**Estimated Size:** ~150 lines

---

### PR-06: Hooks

**Intent:** Implement policy and audit integration.

**Files:**
- `hooks/policy-hook.ts`
- `hooks/audit-hook.ts`

**Review Focus:** Synchronous evaluation, ACK requirement, no caching.

**Estimated Size:** ~200 lines

---

### PR-07: Agent Adapter

**Intent:** Implement Clinical Documentation Agent bridge.

**Files:**
- `adapters/clinical-documentation-agent-adapter.ts`

**Review Focus:** Metadata-only contract, trace propagation.

**Estimated Size:** ~100 lines

---

### PR-08: Runner

**Intent:** Implement command execution.

**Files:**
- `runner.ts`

**Review Focus:** Single command type support, idempotency enforcement, no retries.

**Estimated Size:** ~150 lines

---

### PR-09: Orchestrator

**Intent:** Implement core orchestration flow.

**Files:**
- `orchestrator.ts`
- `index.ts`

**Review Focus:** Mandatory sequence enforcement, state transition correctness.

**Estimated Size:** ~250 lines

---

### PR-10: Package Configuration

**Intent:** Configure service package.

**Files:**
- `package.json`
- `tsconfig.json`
- `README.md`

**Review Focus:** Dependency declarations, build configuration.

**Estimated Size:** ~100 lines

---

### PR-11: Test Suite

**Intent:** Implement all test scenarios from §7.

**Files:**
- Test files for each component (parallel to src structure)

**Review Focus:** Coverage requirements met, deterministic execution.

**Estimated Size:** ~500 lines

---

### 8.1 PR Dependency Graph

```
PR-01 (Contracts)
  │
  ├── PR-02 (State Machine)
  │
  ├── PR-03 (Validation)
  │     │
  │     └── PR-04 (Failure Handler)
  │
  └── PR-05 (Readiness)
        │
        └── PR-06 (Hooks)
              │
              ├── PR-07 (Agent Adapter)
              │     │
              │     └── PR-08 (Runner)
              │           │
              │           └── PR-09 (Orchestrator)
              │                 │
              │                 └── PR-10 (Package)
              │                       │
              │                       └── PR-11 (Tests)
              │
              └────────────────────────────┘
```

---

## 9. Success Criteria

The following criteria MUST be satisfied for MIG-06 v1 to be considered complete. Each criterion is **objective and observable**.

### 9.1 Functional Criteria

| ID | Criterion | Verification Method |
|:---|:---|:---|
| F-01 | A valid `MIG06_V1_CLINICAL_DRAFT_ASSIST` trigger produces `SUCCEEDED` outcome. | Automated test execution. |
| F-02 | An unknown trigger classification produces `REJECTED` with `POL-001`. | Automated test execution. |
| F-03 | A malformed trigger produces `BLOCKED` with `CON-001` or `CON-002`. | Automated test execution. |
| F-04 | Policy DENY produces `REJECTED` with `POL-001`. | Automated test execution. |
| F-05 | Dependency NOT_READY produces `BLOCKED` with `INF-001`. | Automated test execution. |
| F-06 | Audit NACK produces `ERROR` with `AUD-002`. | Automated test execution. |
| F-07 | Agent failure produces `ERROR` with `EXE-002`. | Automated test execution. |
| F-08 | PHI detection produces `ERROR` with `SEC-001`. | Automated test execution. |

### 9.2 Contract Criteria

| ID | Criterion | Verification Method |
|:---|:---|:---|
| C-01 | All E-03 §1 interfaces implemented with exact field compliance. | Code review against E-03. |
| C-02 | All E-01 §4 states supported with no additional states. | Code review against E-01. |
| C-03 | All E-01 §4.3 transitions implemented with no additional transitions. | Code review against E-01. |
| C-04 | All E-01 §4.4 forbidden transitions enforced. | Automated test coverage. |
| C-05 | All E-05 §2 failure codes mapped with correct outcomes. | Code review against E-05. |

### 9.3 Observability Criteria

| ID | Criterion | Verification Method |
|:---|:---|:---|
| O-01 | All E-06 §2 signals emitted for happy path. | Automated test assertion. |
| O-02 | All correlation IDs (E-06 §1) propagated correctly. | Automated test assertion. |
| O-03 | `ORCHESTRATION_ABORTED` emitted for all failure paths. | Automated test assertion. |
| O-04 | No PHI/PII present in any emitted signal. | Code review + automated detection. |

### 9.4 Governance Criteria

| ID | Criterion | Verification Method |
|:---|:---|:---|
| G-01 | No new Phase E evidence artifacts created. | File system inspection. |
| G-02 | No modifications to `docs/16-phase-e/`. | Git diff inspection. |
| G-03 | No Control Plane contract changes. | Code review. |
| G-04 | No retry logic implemented. | Code review. |
| G-05 | No background execution paths. | Code review. |
| G-06 | No caching of execution/decision/audit paths. | Code review. |

### 9.5 Test Coverage Criteria

| ID | Criterion | Verification Method |
|:---|:---|:---|
| T-01 | 100% state transition coverage. | Test coverage report. |
| T-02 | 100% failure code coverage. | Test coverage report. |
| T-03 | All §7 test scenarios pass. | CI pipeline execution. |

---

## Appendix A: Glossary

| Term | Definition |
|:---|:---|
| **Abort** | Immediate transition to terminal state with `OrchestrationAbort` emission. |
| **ACK** | Positive acknowledgment from Audit Sink confirming signal acceptance. |
| **NACK** | Negative acknowledgment from Audit Sink indicating rejection. |
| **NOT_READY** | Dependency state indicating unavailability or degradation. |
| **PHI** | Protected Health Information as defined by HIPAA. |
| **PII** | Personally Identifiable Information. |
| **READY** | Dependency state indicating availability and version compliance. |

---

## Appendix B: Document References

| Document | Path | Relevance |
|:---|:---|:---|
| E-01 | `docs/16-phase-e/e-01-orchestration-design-spec.md` | Orchestration design authority |
| E-03 | `docs/16-phase-e/e-03-orchestration-interface-and-contract-catalog.md` | Contract interfaces |
| E-04 | `docs/16-phase-e/e-04-dependency-and-readiness-model.md` | Readiness validation |
| E-05 | `docs/16-phase-e/e-05-failure-taxonomy-and-abort-semantics.md` | Failure handling |
| E-06 | `docs/16-phase-e/e-06-observability-and-traceability-requirements.md` | Observability signals |
| E-13 | `docs/16-phase-e/e-13-mig-06-unblock-record.md` | Implementation authorization |
| MIG-06 | `docs/12-migration/mig-06-automation-agent-orchestration.md` | Base contract |

---

*Document prepared under E-13 IMPLEMENTATION-ALLOWED authority.*  
*No governance surfaces, autonomy mechanisms, retries, or heuristics introduced.*
