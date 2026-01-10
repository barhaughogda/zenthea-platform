# E-01 — Orchestration Design Specification (ODS)

**Document ID:** E-01-ODS  
**Mode:** GOVERNANCE / PHASE E — ORCHESTRATION DESIGN  
**Status:** DRAFT (Design-Only; governance review required)  
**Scope:** Defines the complete orchestration design required to safely execute migration and automation (MIG-06) under governance control.  
**Authority:** Platform Governance (Phase E)  
**Prerequisites:** CP-21 is SEALED and authoritative; MIG-06 remains DESIGN-BLOCKED until Phase E exit.  

---

## 0. Deterministic Interpretation Rules (Fail-Closed)

This document is a **design specification**. It defines governance-grade obligations and constraints. It does not define implementation, runtime changes, schemas, refactors, or vendor selection.

Interpretation SHALL be fail-closed:

- Any ambiguity, missing prerequisite, missing context, or conflicting constraint SHALL be treated as **BLOCKING**.
- Any behavior not explicitly permitted by this design SHALL be treated as **FORBIDDEN**.
- Any violation of a Design Invariant (Section 9) SHALL result in **automatic abort** as defined in Section 5.

---

## 1. Purpose & Authority

### 1.1 Why orchestration exists

Orchestration exists to provide a **governance-controlled coordination model** for migration execution and automation (MIG-06) that is:

- **Policy-triggered** at the moment of attempted execution.
- **Deterministic** for the same metadata inputs and version selections.
- **Fail-closed** under uncertainty, degradation, or incomplete evidence.
- **Auditable** with metadata-only signals and complete lifecycle traceability.
- **Non-autonomous**, with explicit escalation boundaries and operator stop authority.

### 1.2 What orchestration is responsible for

Orchestration SHALL be responsible for:

- **Trigger intake** and explicit trigger classification (deny-by-default).
- **Context validation** for completeness and non-sensitivity (metadata-only handling).
- **Policy gating** prior to any execution or side effect.
- **Controlled execution sequencing** within the allowed scope and lifecycle model.
- **Lifecycle state management** using an explicit, governed state model (Section 4).
- **Audit emission** for every phase and state transition (Section 7).
- **Escalation routing** when boundaries are uncertain or human review is required.
- **Fail-closed termination** with explicit, bounded outcomes and non-retryable conditions.

### 1.3 What orchestration explicitly does NOT do

Orchestration SHALL NOT:

- Expand platform capability beyond sealed Control Plane contracts (CP-16..CP-21).
- Introduce autonomous execution, self-directed scope expansion, or self-modifying behavior.
- Create, modify, or author policies/views/workflows at runtime.
- Execute or enable any write paths outside CP-17 allowlisted controlled mutations.
- Write, store, emit, or propagate PHI/PII in any orchestration artifact, log, audit, correlation identifier, cache key, or external boundary.
- Rely on caching or permit cache replay for any governed execution/decision/mutation/audit path (CP-21/CP-19 posture).

---

## 2. Orchestration Actors & Roles

This section defines **logical roles** and their responsibilities. These are not implementation assignments.

### 2.1 Control Plane (CP)

The Control Plane SHALL be the authoritative source of governance constraints and SHALL provide the authoritative gating capabilities required for orchestration, including:

- Deterministic policy and view version selection constraints.
- Deterministic policy evaluation and decision signaling.
- Controlled mutation allowlist constraints, approvals, and idempotency requirements.
- Audit taxonomy and audit acceptance requirements (metadata-only).
- Governance invariants required for execution safety (including deny-by-default and non-cacheability posture).

The Control Plane SHALL have **stop authority** as defined in Section 2.6.

### 2.2 Orchestrator (logical role; not implementation)

The Orchestrator SHALL be the coordinating role that:

- Drives the orchestration flow model (Section 3) with explicit sequencing.
- Enforces the state model (Section 4) without implicit transitions.
- Enforces fail-closed semantics (Section 5) without hidden retries or implicit fallbacks.
- Produces required observability and audit evidence (Section 7).

The Orchestrator SHALL NOT act as an autonomous agent and SHALL NOT self-author policies, workflows, or runtime rules.

### 2.3 Services

Services SHALL be execution targets that:

- Provide read-only execution surfaces and metadata-only outputs when invoked under orchestration.
- Perform controlled mutations only via the Control Plane governed mutation surface and allowlist boundaries.

Services SHALL NOT accept orchestration-originated requests that violate policy gating, data boundaries, or invariant constraints.

### 2.4 Agents

Agents SHALL be governed execution participants that:

- Operate within explicit lifecycle boundaries.
- Produce metadata-only outputs suitable for audit and operator surfaces.
- Escalate via decision signaling when boundaries are uncertain or approval is required.

Agents SHALL NOT widen their permissions, tools, or scope during execution.

### 2.5 Operators

Operators SHALL be the human-in-the-loop authority that:

- Initiates, approves, pauses, resumes, and terminates orchestration attempts via governed operator surfaces.
- Provides explicit decisions required to proceed when orchestration is paused for human review.
- Exercises stop authority as defined in Section 2.6.

### 2.6 Failure authority (who can stop execution)

Failure authority SHALL be explicit and enforceable:

- **Control Plane** SHALL have ultimate authority to deny, block, or stop execution through policy denial, invariant enforcement, and governance gating.
- **Operator** SHALL have authority to stop an in-progress orchestration attempt through an explicit termination action that results in a terminal state (Section 4).
- **Orchestrator** SHALL automatically stop execution on any invariant violation, missing prerequisite, or fail-closed condition (Section 5).

No other actor SHALL have authority to override a Control Plane denial or to force execution when the design requires blocking.

---

## 3. Orchestration Flow Model (End-to-End)

This model is normative and complete. No implicit steps exist. Each orchestration attempt SHALL follow the explicit phase sequence below.

### 3.1 Phases (mandatory sequence)

Every orchestration attempt SHALL execute phases in this exact order:

1. **Trigger**
2. **Validation**
3. **Policy Gate**
4. **Execution**
5. **Audit**
6. **Completion**

A phase SHALL NOT be skipped. A phase SHALL NOT be combined with another phase in a way that obscures distinct gate outcomes.

### 3.2 Phase definitions and required outcomes

#### Phase 1 — Trigger

Inputs:

- A single recognized trigger event with a trigger classification.

Requirements:

- The trigger SHALL be classified into an allowed trigger category.
- Unknown or unclassified triggers SHALL be rejected (deny-by-default).

Outcomes:

- Proceed to Validation, or terminate as **REJECTED** (policy-independent rejection for unknown triggers).

#### Phase 2 — Validation

Inputs:

- Trigger metadata.
- Candidate orchestration context (metadata-only).

Requirements:

- Context SHALL be complete for deterministic policy evaluation and deterministic version selection.
- Context SHALL be validated for forbidden content (PHI/PII and other disallowed identifiers).
- Required correlation identifiers SHALL be present (Section 7.1).

Outcomes:

- Proceed to Policy Gate, or terminate as **BLOCKED** (missing/invalid context) or **ERROR** (validation failure taxonomy).

#### Phase 3 — Policy Gate

Inputs:

- Validated context.
- Deterministic policy/view version selection inputs.

Requirements:

- Policy evaluation SHALL occur explicitly prior to any execution.
- Version selection SHALL be deterministic and explicitly recorded.
- Any unknown policy, unknown version, or unresolvable selection SHALL be rejected (deny-by-default).

Outcomes:

- Proceed to Execution, or terminate as **REJECTED** (policy denial), or enter **PAUSED** (decision required), or terminate as **BLOCKED** (contract ambiguity or unsafe boundary).

#### Phase 4 — Execution

Inputs:

- A positive policy authorization outcome, or an explicit operator-approved resumption outcome if previously paused.

Requirements:

- Execution SHALL follow the lifecycle-bound model: **spawn → run → pause → terminate**.
- Execution SHALL be deterministic for the same metadata inputs and version selections.
- Execution SHALL NOT perform hidden retries, implicit fallbacks, or non-audited branching.
- Any request for a write-controlled action SHALL be gated by controlled mutation constraints and approvals; non-allowlisted actions SHALL be forbidden.

Outcomes:

- Proceed to Audit on completion of each executed step, or transition to PAUSED/ERROR/BLOCKED/TERMINATED per the State Model (Section 4) and Failure Semantics (Section 5).

#### Phase 5 — Audit

Inputs:

- Execution step outcomes and state transitions (metadata-only).

Requirements:

- Audit signals SHALL be emitted for each phase and each state transition as required in Section 7.2.
- Audit MUST be treated as non-optional for governed orchestration.

Outcomes:

- Proceed to Completion only if audit emission is acknowledged as accepted (Section 5.5 defines audit failure handling).

#### Phase 6 — Completion

Inputs:

- The final orchestration state and audit evidence.

Requirements:

- Completion SHALL produce a final, metadata-only closure record with bounded outcome classification.
- Completion SHALL NOT mask partial execution, partial audit, or unresolved dependencies.

Outcomes:

- Transition into one and only one terminal state (Section 4.2).

### 3.3 Required branching (no “happy-path only”)

The flow SHALL explicitly support and record the following non-happy path branches:

- Trigger rejection branch (unknown trigger).
- Validation failure branch (missing/invalid/forbidden context).
- Policy denial branch (explicit policy denial).
- Decision required branch (explicit pause awaiting human decision).
- Dependency degraded/unavailable branch (fail-closed blocking).
- Partial execution branch (some steps executed, then aborted).
- Audit failure branch (audit not accepted).

No branch SHALL continue execution without re-entering the explicit Policy Gate with deterministic inputs and recorded evidence.

---

## 4. State Model

The orchestration state model is authoritative for lifecycle control, auditability, and governance stop semantics.

### 4.1 Allowed states

Orchestration SHALL support only the following states:

Non-terminal states:

- **NEW** (received trigger; not yet validated)
- **VALIDATING**
- **GATED** (policy gate in progress; no execution performed)
- **AUTHORIZED** (policy authorization granted; execution permitted)
- **RUNNING**
- **PAUSED** (decision required; awaiting operator action)
- **AUDITING** (audit emission in progress; no further execution permitted until completed)

Terminal states:

- **SUCCEEDED**
- **REJECTED** (policy denial or trigger denial; no execution performed beyond allowed read-only gate evaluation)
- **CANCELLED** (operator stop)
- **ERROR** (bounded failure; execution stopped)
- **BLOCKED** (design/contract ambiguity or missing prerequisite; execution stopped)

### 4.2 Terminal vs non-terminal rules

- Terminal states SHALL be irreversible.
- Non-terminal states SHALL only transition according to Section 4.3.
- **PAUSED** SHALL be stable and SHALL NOT auto-resume.

### 4.3 Allowed transitions (explicit)

The following transitions are allowed:

- NEW → VALIDATING
- VALIDATING → GATED
- GATED → AUTHORIZED
- GATED → REJECTED
- GATED → PAUSED
- GATED → BLOCKED
- AUTHORIZED → RUNNING
- RUNNING → PAUSED
- RUNNING → AUDITING
- AUDITING → RUNNING (only to continue an already-authorized attempt; no implicit retries)
- AUDITING → SUCCEEDED
- AUDITING → ERROR
- AUDITING → BLOCKED
- PAUSED → GATED (only via explicit operator resume trigger; re-evaluate policy)
- PAUSED → CANCELLED (explicit operator stop)
- RUNNING → CANCELLED (explicit operator stop)
- VALIDATING/GATED/AUTHORIZED/RUNNING/PAUSED/AUDITING → ERROR (on explicit failure conditions)
- VALIDATING/GATED/AUTHORIZED/RUNNING/PAUSED/AUDITING → BLOCKED (on explicit blocking conditions)

### 4.4 Forbidden transitions (explicit)

The following transitions are forbidden and SHALL be treated as invariant violations:

- Any terminal → any non-terminal.
- NEW → AUTHORIZED/RUNNING/PAUSED/AUDITING (skipping Validation and Policy Gate).
- VALIDATING → RUNNING (skipping Policy Gate).
- GATED → RUNNING (skipping explicit AUTHORIZED).
- PAUSED → RUNNING (resume without explicit policy re-evaluation).
- Any state → SUCCEEDED without AUDITING.
- Any state → execution continuation while audit is pending (AUDITING is execution-frozen).
- Any transition that would cause a side effect after a policy denial or after entering BLOCKED.

### 4.5 Re-entrancy rules (explicit)

Re-entrancy SHALL be restricted:

- Re-entrancy is **FORBIDDEN** for any attempt that entered **BLOCKED** due to ambiguity, missing prerequisites, or invariant violation.
- Re-entrancy is **FORBIDDEN** for terminal states.
- Re-entrancy is **ALLOWED ONLY** for:
  - resumption from **PAUSED** via explicit operator action that re-enters the **Policy Gate**; and
  - continuation after **AUDITING → RUNNING** when audit is accepted and the attempt remains authorized.

Re-entrancy SHALL NOT create new side effects. Any controlled mutation request SHALL be idempotent and approval-gated; any non-idempotent replay SHALL be treated as an invariant violation and SHALL abort.

---

## 5. Failure & Fail-Closed Semantics

All failure handling SHALL be fail-closed. Execution SHALL stop unless explicit, governed conditions allow a transition back to a gated state.

### 5.1 Missing context

If required context is missing, malformed, or non-deterministic:

- Orchestration SHALL transition to **BLOCKED**.
- Orchestration SHALL emit audit signals marking **ContextMissing** with bounded metadata.
- Orchestration SHALL NOT proceed to Policy Gate or Execution.

Missing context is **non-retryable** for the same attempt. Any correction SHALL require a new operator-triggered attempt.

### 5.2 Policy denial

If policy evaluation denies execution:

- Orchestration SHALL transition to **REJECTED**.
- Orchestration SHALL NOT execute any side effect.
- Orchestration SHALL emit a metadata-only denial audit signal.

Policy denial is **non-retryable** for the same attempt. Any subsequent attempt SHALL be treated as a new trigger requiring full validation and policy evaluation.

### 5.3 Partial execution

Partial execution is defined as: at least one execution step completed, followed by abort due to failure, denial, or dependency loss.

If partial execution occurs:

- Orchestration SHALL transition to **ERROR** (or **BLOCKED** if the root cause is ambiguity/prerequisite absence).
- Orchestration SHALL stop all further execution.
- Orchestration SHALL enter **PAUSED** only when a human decision is explicitly required and the system remains safe and fully auditable.
- Orchestration SHALL emit audit signals sufficient to prove which steps executed and which did not, without payload exposure.

Any attempt to continue execution after partial execution SHALL require re-entering **Policy Gate** with deterministic inputs and explicit operator authorization where required.

### 5.4 Dependency unavailability

Dependencies include Control Plane gating services and any required external integration boundary surfaces.

If a required dependency is unavailable or degraded below the required readiness threshold:

- Orchestration SHALL transition to **BLOCKED** prior to any execution step that depends on the degraded dependency.
- Orchestration SHALL NOT continue execution under “best effort” fallback semantics.
- Orchestration SHALL emit audit signals marking **DependencyUnavailable** with bounded metadata.

Dependency unavailability is **non-retryable** for the same attempt when it prevents policy gating, approval validation, idempotency assurance, or audit acceptance.

### 5.5 Audit failure

Audit failure is defined as: required audit signals cannot be emitted, cannot be accepted, or cannot be correlated to the orchestration attempt deterministically.

Audit failure SHALL be handled as follows:

- If audit failure occurs **before any execution**, orchestration SHALL transition to **BLOCKED** and SHALL NOT execute.
- If audit failure occurs **after partial execution**, orchestration SHALL transition to **ERROR** and SHALL stop all further execution.
- Orchestration SHALL NOT claim completion (SUCCEEDED/REJECTED/CANCELLED) without audit acceptance.

Audit failure is **non-retryable** for the same attempt.

### 5.6 Explicit abort rules (mandatory)

Orchestration SHALL abort immediately and transition to **BLOCKED** or **ERROR** (as appropriate) on any of the following:

- Missing prerequisite evidence (including required Control Plane readiness for the attempted phase).
- Unknown trigger, unknown policy, unknown version, or unresolved deterministic selection.
- Any request for a forbidden tool or write path outside controlled mutation allowlist.
- Any potential PHI/PII exposure in context, logs, audit, correlation identifiers, or outputs.
- Any detection of caching, cache replay risk, or non-cacheability uncertainty for governed paths.
- Any hidden retry, implicit fallback, or non-audited branching.

### 5.7 Explicit non-retryable conditions (mandatory)

The following conditions SHALL be treated as non-retryable for the same attempt:

- Policy denial.
- Missing/invalid context.
- Invariant violation.
- Audit failure.
- Control Plane unavailability for required gates.
- Any forbidden action request (tool/write/path).
- Any PHI/PII boundary violation.

---

## 6. Control Plane Dependency Model

This section defines which orchestration steps REQUIRE Control Plane capabilities and what happens when Control Plane is degraded.

### 6.1 Steps that REQUIRE Control Plane services (explicit)

The following steps SHALL require Control Plane services and SHALL NOT proceed without them:

- **Policy Gate**: deterministic version selection and explicit policy evaluation outcomes.
- **Decision signaling**: escalation/decision-required outcomes and their metadata-only forms.
- **Write-controlled gating**: approvals and idempotency requirements for controlled mutation actions.
- **Audit acceptance**: audit sink acceptance and bounded taxonomy classification sufficient for governance traceability.

### 6.2 Control Plane degraded semantics

Control Plane degradation SHALL be treated as a blocking condition for any step that requires Control Plane services.

When Control Plane is degraded:

- Orchestration SHALL NOT enter **AUTHORIZED**.
- Orchestration SHALL NOT execute any controlled mutation request.
- Orchestration SHALL transition to **BLOCKED** if it cannot complete Policy Gate, approval validation, idempotency validation, or audit acceptance.

### 6.3 Explicit blocking conditions

The following SHALL be explicit blocking conditions:

- Inability to perform deterministic version selection.
- Inability to perform explicit policy evaluation.
- Inability to validate approvals/idempotency for any requested controlled mutation.
- Inability to emit and obtain acceptance for required audit events.

---

## 7. Observability & Traceability Requirements

Observability and traceability are preconditions for execution. If required observability cannot be established, orchestration SHALL NOT proceed beyond Validation.

### 7.1 Required correlation identifiers (mandatory)

The following identifiers SHALL exist for each orchestration attempt and SHALL be propagated through all phases as metadata-only signals:

- **orchestration_attempt_id** (stable for the attempt)
- **trigger_id** (stable for the originating trigger)
- **policy_evaluation_id** (stable for each policy evaluation event)
- **policy_id** and **policy_version** (explicitly selected; deterministic)
- **view_id** and **view_version** (explicitly selected; deterministic) when applicable
- **decision_signal_id** (when decision hooks are emitted)
- **audit_correlation_id** (stable across all audit events for the attempt)
- **trace_id** (distributed trace correlation identifier)

Correlation identifiers SHALL NOT include PHI/PII, tenant identifiers, actor identifiers, request identifiers, cursors, raw rows, or payload content.

### 7.2 Required audit signals per orchestration phase (mandatory)

The following metadata-only audit signals SHALL be emitted (at minimum) for each attempt:

- **TriggerReceived**
- **TriggerRejected** (if rejected)
- **ContextValidated** or **ContextInvalid** (explicit reason code)
- **PolicyEvaluated** (policy_id, policy_version, allow/deny, bounded reason code)
- **DecisionRequiredEmitted** (when PAUSED is entered)
- **ExecutionStepStarted** / **ExecutionStepCompleted** (bounded step identifier; no payloads)
- **MutationRequested** / **MutationDenied** / **MutationApproved** (bounded tool identifier only; no raw parameters)
- **StateTransitionRecorded** (from_state, to_state)
- **AuditAccepted** or **AuditFailed**
- **AttemptCompleted** (terminal outcome code)

### 7.3 What must be observable BEFORE execution is allowed

Before entering **AUTHORIZED** and **RUNNING**, the following SHALL be observable and correlated:

- Trigger classification is known and accepted.
- Context validation is complete and recorded.
- Policy evaluation is complete, recorded, and explicitly allows execution.
- Deterministic version selections are recorded.
- Audit pipeline readiness is observable such that audit events can be emitted and accepted.

If any of the above is not observable, orchestration SHALL transition to **BLOCKED**.

---

## 8. Explicit Non-Goals

This orchestration design SHALL NEVER:

- Provide a general workflow engine, background job platform, queues, cron infrastructure, or long-running autonomous workers as orchestration semantics.
- Select or commit to an orchestration vendor, runtime, or persistence mechanism.
- Introduce new Control Plane contracts, schemas, DTOs, or runtime behavior changes.
- Create new mutation tool surfaces, expand the CP-17 allowlist, or bypass approval/idempotency gates.
- Handle secrets/credentials or create credential custody within orchestration scope.
- Perform clinical write-back, attestation, signing, finalization, or advancement of clinical state.

Deferred to later phases (explicitly out of scope for Phase E and this document):

- Implementation choices (engine selection, persistence mechanics, scheduling strategy).
- Operational tuning (concurrency controls, retry timing, performance optimizations) beyond the strict “no hidden retries” constraint.
- Operator UX/authorization UX patterns and interface designs.

---

## 9. Design Invariants (Violations = Automatic Abort)

The following invariants MUST always hold. Any violation SHALL trigger immediate abort per Section 5.6.

### 9.1 Governance and determinism invariants

- Orchestration MUST be policy-triggered. Execution SHALL NOT occur without explicit policy evaluation for the attempt.
- Orchestration MUST be deterministic for the same metadata inputs and explicit version selections.
- Orchestration MUST be lifecycle-bound to explicit states and explicit transitions; no implicit transitions exist.

### 9.2 Safety and non-autonomy invariants

- Orchestration MUST be non-autonomous. It SHALL NOT self-direct new scope, tools, permissions, or actions.
- Orchestration SHALL NOT self-author, self-modify, or generate policies/views/workflows at runtime.
- Orchestration SHALL NOT perform hidden retries or implicit fallbacks that can change outcomes or side effects.

### 9.3 Data boundary invariants

- Orchestration SHALL NOT write or emit PHI/PII to any storage, log, audit, correlation identifier, cache key, or external boundary.
- All audit and observability signals MUST be metadata-only and MUST NOT include sensitive identifiers or payload-like content.

### 9.4 Controlled mutation invariants

- No write path SHALL exist outside the CP-17 allowlist and its approval + idempotency gates.
- Any attempted non-allowlisted mutation SHALL be denied and SHALL abort the attempt.

### 9.5 Cache boundary invariants (CP-21 posture)

- Execution/decision/mutation/audit pathways MUST be non-cacheable as a system property.
- Any uncertainty about non-cacheability or any cache replay risk SHALL abort the attempt and transition to BLOCKED.

---

## 10. Ambiguities (Explicitly Documented; Fail-Closed)

The following areas are intentionally not specified in this design and SHALL be treated as blocked if required to proceed safely:

- **Orchestration engine selection** (vendor or in-house).
- **Persistence strategy** for orchestration state.
- **Retry timing and concurrency policy**, beyond the hard invariant: no hidden retries and no side-effect replays.
- **Operator UX integration** details and authorization UX patterns.

If any of the above becomes necessary to satisfy determinism, fail-closed execution, audit acceptance, or controlled mutation gating, MIG-06 SHALL remain BLOCKED until governance issues an explicit, sealed design decision resolving the ambiguity.

