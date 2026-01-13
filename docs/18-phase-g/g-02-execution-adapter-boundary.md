# G-02 — Execution Adapter Boundary (Design-Only)

**Document ID:** G-02-EAB  
**Mode:** GOVERNANCE / PHASE G — EXECUTION ADAPTER BOUNDARY (Design-Only)  
**Status:** DRAFT (Design-Only; no implementation authorized)  
**Authority:** Platform Governance (Phase G)  
**Depends On:** Phase E (Non-Executing Orchestration), Phase F (F-04 Audit and Evidence Model, F-05 Rollback and Compensation Design), G-01 (Scheduling Execution Slice)  

---

## 1. Document Intent and Non-Authorization Statement

This document is a **design-only governance artifact**. It defines the architectural boundary that separates orchestration from execution within the Zenthea platform.

This document explicitly does NOT authorize:

- Any implementation of any kind (no code, no infrastructure, no integrations)
- Any API, protocol, queue, or transport mechanism
- Any schema, event payload, or contract definition
- Any SDK, client library, or abstraction layer
- Any vendor, product, or technology selection
- Any retry logic, circuit breaker, or resilience pattern
- Any execution capability of any kind

This document establishes **architectural boundaries only**. It describes what an Execution Adapter is, where it sits, and what it may never do. It does not describe how an Execution Adapter is built.

Interpretation SHALL be conservative:

- Any behavior not explicitly permitted by this design is **FORBIDDEN**.
- Any ambiguity is **BLOCKING**.
- **Fail-closed posture is mandatory.**
- **Understanding this boundary does not authorize crossing it.**

G-01 remains locked. Execution remains blocked. This document extends governance design; it does not unlock implementation.

---

## 2. Context and Dependency Chain

### 2.1 Relationship to Prior Phases

**Phase E** established non-executing orchestration: the platform can understand intent, route requests, apply governance gates, produce proposals, and coordinate agent activity—without performing irreversible actions. Phase E components are permitted to read, reason, and recommend. They are prohibited from writing to, modifying, or commanding external systems.

**Phase F** established the governance prerequisites for execution: consent models (F-03), audit and evidence requirements (F-04), and rollback/compensation design (F-05). Phase F defines what must be true before execution is permissible and what must be recorded when execution occurs.

**G-01** established the first execution slice (Provider-Confirmed Scheduling), defining the governance model for a single irreversible action type. G-01 specifies the gates, authorities, and failure semantics for that slice but does not define the architectural mechanism by which execution occurs.

### 2.2 Why Execution Must Be Isolated from Orchestration

The platform's architecture must enforce a hard separation between:

1. **Orchestration logic** (Phase E): Determines what should happen, under what conditions, with what approvals.
2. **Execution mechanism** (Phase G): Performs the irreversible action on an external system.

This separation is not a design preference; it is a governance requirement. The reasons are:

- **Audit clarity**: When an irreversible action occurs, there must be no ambiguity about which component performed it, under what authority, and with what evidence.
- **Accountability isolation**: If orchestration logic contained execution capability, a bug, misconfiguration, or adversarial input could cause unintended external state changes. The boundary prevents this.
- **Regulatory defensibility**: Regulators and auditors require demonstrable separation of concerns. A system where "anywhere can execute anything" is indefensible.
- **Failure containment**: Orchestration failures should never cascade into execution failures. Execution failures should never be silently absorbed by orchestration.

The Execution Adapter is the single, governed surface where this boundary is crossed. No other path from orchestration to external systems is permitted.

### 2.3 Dependency on G-01 Lock Status

G-01 is currently in design-only status. Execution is blocked platform-wide. This document does not change that status.

This document exists to ensure that when execution is eventually unblocked (through formal Phase G governance approval), the architectural boundary is already understood and enforceable. The boundary must be designed before it can be implemented.

---

## 3. Definition: Execution Adapter

### 3.1 What an Execution Adapter Is

An **Execution Adapter** is the single architectural surface through which the Zenthea platform may interact with external systems for the purpose of irreversible state change.

The Execution Adapter is:

- A **boundary**, not a feature.
- A **constraint surface**, not a capability expansion.
- A **governance enforcement point**, not a convenience abstraction.
- The **only permissible path** from platform orchestration to external system state change.

### 3.2 What an Execution Adapter Is Not

An Execution Adapter is NOT:

- A generic integration layer or API gateway.
- A message queue, event bus, or async processor.
- A retry mechanism, circuit breaker, or resilience pattern.
- An SDK or client library that simplifies external system access.
- A cache, buffer, or batching mechanism.
- An autonomous agent or decision-making component.

The Execution Adapter does not make decisions. It does not infer intent. It does not optimize, batch, or defer. It exists solely to transmit an explicitly authorized, fully evidenced, human-approved action to an external system and to record the outcome.

### 3.3 Singular Responsibility

The Execution Adapter has exactly one responsibility:

**Faithfully transmit an execution command that has passed all governance gates, and faithfully record the outcome.**

Any additional responsibility—interpretation, transformation, enrichment, inference, retry, compensation—violates the boundary definition and is prohibited.

---

## 4. Authority and Control Model

### 4.1 The Three-Zone Model

The platform enforces a strict three-zone authority model for execution:

| Zone | Component | Authority | May Execute |
|------|-----------|-----------|-------------|
| **Zone 1** | Orchestration (Phase E) | Proposal, coordination, gate evaluation | **NO** |
| **Zone 2** | Execution Adapter (Phase G) | Transmission, recording | **ONLY** as proxy |
| **Zone 3** | External System | Authoritative state | (External) |

**Zone 1 (Orchestration)** may:
- Receive user intent
- Coordinate agent activity
- Apply governance gates
- Produce proposals
- Request human approval
- Assemble execution commands for Zone 2

**Zone 1 (Orchestration)** may NOT:
- Transmit commands to external systems
- Modify external system state
- Infer execution authority from context
- Proceed without explicit human approval

**Zone 2 (Execution Adapter)** may:
- Receive a fully authorized, fully evidenced execution command from Zone 1
- Verify that required evidence exists and is acknowledged
- Transmit the command to Zone 3
- Record the outcome (success, failure, indeterminate)
- Return the outcome to Zone 1

**Zone 2 (Execution Adapter)** may NOT:
- Modify, enhance, or reinterpret the command
- Infer missing parameters or intent
- Retry without explicit re-authorization
- Execute without audit acknowledgment
- Proceed if any prerequisite is unverified

**Zone 3 (External System)** is outside platform governance. The platform's responsibility ends at transmission and outcome recording. The platform does not control Zone 3 behavior.

### 4.2 AI Authority Exclusion

AI components exist exclusively within Zone 1. AI may assist with:

- Understanding user intent
- Coordinating workflows
- Generating proposals
- Recommending actions

AI may NEVER:

- Authorize execution
- Construct execution commands without human approval
- Bypass governance gates
- Act as an approver in the authority chain

The Execution Adapter accepts commands from the orchestration layer. The orchestration layer may contain AI components. But the authority that permits execution flows through human approval, not AI recommendation. AI participation in Zone 1 does not confer AI authority in Zone 2.

### 4.3 Human Approval as Mandatory Prerequisite

Every execution command that reaches the Execution Adapter must be traceable to an explicit human approval:

- **For scheduling execution (G-01)**: Provider or authorized staff approval (SL-08).
- **For future execution slices**: Domain-specific human authority as defined in those slices.

The Execution Adapter must be able to verify that human approval exists before transmission. "Approval exists somewhere in the system" is insufficient. The approval must be referenced, verifiable, and linked to the specific command.

---

## 5. Boundary Rules (Hard Constraints)

The following rules define the hard boundary between orchestration and execution. These rules are non-negotiable and may not be overridden by configuration, role, or operational necessity.

### 5.1 Orchestration Code May Not Call External Systems

No component in Zone 1 (orchestration) may directly communicate with external systems for the purpose of state change.

- No HTTP calls to external APIs.
- No database writes to external systems.
- No queue publications that trigger external actions.
- No webhook invocations that modify external state.

Zone 1 communicates only with Zone 2. Zone 2 communicates with Zone 3. There is no direct path from Zone 1 to Zone 3.

Read-only queries to external systems (where permitted by data governance) are a separate concern and are not governed by this document.

### 5.2 Adapters May Not Infer Intent

The Execution Adapter receives explicit, complete commands. It does not:

- Infer missing parameters from context.
- Default undefined values.
- Interpret ambiguous instructions.
- Expand abbreviated commands.
- Apply business logic to modify commands.

If a command is incomplete, ambiguous, or invalid, the Execution Adapter rejects it. It does not attempt to "make it work."

### 5.3 Adapters May Not Retry Autonomously

If execution fails, the Execution Adapter records the failure and returns the outcome. It does NOT:

- Automatically retry the command.
- Queue the command for later execution.
- Escalate to a fallback mechanism.
- Attempt alternative external systems.

Retry requires human re-evaluation and re-authorization. The path for retry is: failure → human review → new approval → new execution command → new execution attempt.

### 5.4 Adapters May Not Execute Without Synchronous Audit Readiness

Before transmitting any command to an external system, the Execution Adapter must verify:

1. **Pre-execution evidence is captured**: All required evidence (identity, consent, approval, intent) exists.
2. **Audit pipeline is ready**: The audit system has acknowledged the execution attempt signal.
3. **Evidence can be recorded**: The infrastructure for recording the outcome is available.

If any of these conditions is not satisfied, execution is blocked. "Fire and hope audit catches up" is forbidden.

This is a synchronous gate, not an asynchronous best-effort operation. The Execution Adapter waits for audit acknowledgment before proceeding.

---

## 6. Failure and Uncertainty Semantics

### 6.1 Guiding Principle: Assume Non-Execution

When the outcome of an execution attempt is uncertain, the platform's default assumption is that **execution did not occur**.

This is a conservative posture designed to prevent:

- Duplicate executions from retry attempts that assume failure.
- Silent state inconsistencies from unrecorded successes.
- Cascading errors from incorrect state assumptions.

If the platform cannot confirm that execution occurred, it treats the action as not executed and requires human intervention before any further attempt.

### 6.2 Timeout Handling

If the Execution Adapter transmits a command and does not receive a response within a defined window:

1. **Record the timeout**: The audit trail captures that a timeout occurred.
2. **Assume non-execution**: The platform does not assume the external system processed the command.
3. **Block further attempts**: No automatic retry occurs.
4. **Require reconciliation**: Human review must determine external system state before any further action.

The timeout duration is not defined in this document (that is an implementation concern). The handling of timeout is defined: assume non-execution, block, require human review.

### 6.3 Partial Acknowledgment

If the external system returns a response that is ambiguous (neither clear success nor clear failure):

1. **Record the ambiguous response**: The audit trail captures exactly what was returned.
2. **Classify as indeterminate**: The execution outcome is marked as indeterminate, not success.
3. **Block further attempts**: No automatic retry or continuation occurs.
4. **Require reconciliation**: Human review must interpret the response and determine next steps.

The Execution Adapter does not interpret ambiguous responses. It records them and escalates to human judgment.

### 6.4 External System Error

If the external system returns an explicit error:

1. **Record the error**: The audit trail captures the error classification (not raw error text that might contain PHI).
2. **Mark as failed**: The execution outcome is marked as failed.
3. **Block automatic retry**: No retry without human re-authorization.
4. **Preserve command context**: The original command context is preserved for potential re-attempt after human review.

Explicit errors are easier to handle than ambiguous outcomes, but they still require human evaluation before retry.

### 6.5 Platform-Side Failure

If the platform itself fails during execution (e.g., process crash, infrastructure failure):

1. **Evidence may be incomplete**: Pre-execution evidence may exist without outcome evidence.
2. **Assume non-execution**: Unless outcome evidence confirms success, assume the action did not complete.
3. **Investigation required**: Operations teams must investigate to determine platform and external system state.
4. **Manual reconciliation**: Human intervention is required to reconcile state and determine next steps.

Platform-side failures are anomalies. They are not handled through automatic recovery; they are investigated.

---

## 7. Audit and Evidence Coupling

### 7.1 Subordination to F-04 Requirements

The Execution Adapter is subordinate to the audit and evidence model defined in F-04. This means:

- Every requirement in F-04 applies to the Execution Adapter.
- F-04 defines what evidence must exist; the Execution Adapter must ensure that evidence exists before and after execution.
- F-04 defines immutability requirements; the Execution Adapter must not provide any mechanism to modify captured evidence.
- F-04 defines attribution requirements; the Execution Adapter must ensure that every execution is attributable to identified actors.

The Execution Adapter does not define its own audit requirements. It implements the requirements defined in F-04.

### 7.2 Pre-Execution Evidence Gate

Before transmitting any command, the Execution Adapter verifies that pre-execution evidence is complete:

- **Identity evidence**: Patient, approver, and system identities are verified and recorded.
- **Consent evidence**: Required consents are verified and recorded.
- **Approval evidence**: Human approval for the specific action is captured and recorded.
- **Intent evidence**: The execution command specification is recorded.

If any pre-execution evidence is missing or unverifiable, execution is blocked.

### 7.3 Execution-Attempt Acknowledgment

Before transmitting any command, the Execution Adapter:

1. Emits an execution-attempt signal to the audit pipeline.
2. Waits for acknowledgment from the audit pipeline.
3. Proceeds only after acknowledgment is received.

If acknowledgment is not received, execution is blocked. This ensures that every execution attempt is recorded before it occurs, preventing silent execution.

### 7.4 Post-Execution Evidence Capture

After receiving an outcome from the external system, the Execution Adapter:

1. Captures the outcome (success, failure, indeterminate, timeout).
2. Records the outcome in the audit trail.
3. Waits for audit acknowledgment of the outcome.
4. Returns the outcome to the orchestration layer only after audit confirmation.

The execution is not considered complete until the outcome is recorded. An action that succeeded in the external system but failed to record is an anomaly requiring investigation, not a success.

### 7.5 Execution Without Evidence Is Invalid

This principle is restated for emphasis:

**Any execution that cannot demonstrate complete evidence is invalid by definition.**

This means:

- If pre-execution evidence cannot be verified, execution did not legitimately occur.
- If post-execution evidence cannot be captured, execution cannot be confirmed.
- If evidence is later found to be incomplete, the execution is retroactively flagged as non-compliant.

Evidence is not a side effect of execution; it is a prerequisite and a confirmation.

---

## 8. Explicit Prohibitions

The following are explicitly prohibited. These prohibitions are absolute and may not be overridden by any authority, role, or operational circumstance.

### 8.1 No Background Retries

The Execution Adapter may not automatically retry failed execution attempts.

- No exponential backoff retry loops.
- No queued retry mechanisms.
- No scheduled retry jobs.
- No "retry until success" patterns.

Every execution attempt requires explicit human authorization. A failed attempt invalidates that authorization. A new attempt requires new authorization.

### 8.2 No Silent Execution

Every execution attempt must be visible to relevant actors.

- Patients must be informed when actions are taken on their behalf.
- Providers must receive confirmation of actions they approved.
- Operations teams must have visibility into all execution activity.

Execution that occurs without corresponding visibility to affected parties is a governance violation.

### 8.3 No AI-Initiated Calls

AI components may not initiate execution.

- AI may recommend actions.
- AI may prepare proposals.
- AI may assist with command construction.
- AI may NOT authorize or trigger transmission to external systems.

The trigger for execution is human approval, never AI decision.

### 8.4 No Implicit Compensation

If an execution results in an undesired state, correction must be explicit:

- No automatic "undo" mechanisms.
- No background correction jobs.
- No silent state adjustments.

Compensation requires human authorization and follows the F-05 compensation model. The Execution Adapter does not compensate; it executes new, explicitly authorized compensation commands.

### 8.5 No Bypass of Human Approval

No technical mechanism, configuration option, or operational procedure may bypass the requirement for human approval before execution.

- No "admin mode" that skips approval.
- No "emergency override" that executes without authorization.
- No "batch processing" that aggregates approvals.
- No "trusted source" exception that assumes approval.

Human approval is mandatory. There are no exceptions.

---

## 9. Out of Scope

This document explicitly excludes the following. These topics require separate artifacts and are not addressed here.

### 9.1 No Implementation Details

This document does not specify:

- Programming languages, frameworks, or libraries.
- Deployment architectures or infrastructure.
- Performance requirements or scalability patterns.
- Monitoring, alerting, or operational tooling.

Implementation is out of scope. This document governs design.

### 9.2 No Integration Specifications

This document does not specify:

- External system protocols or APIs.
- Authentication mechanisms for external systems.
- Data mapping between platform and external systems.
- Error code interpretations for specific external systems.

Integration specifications are implementation artifacts.

### 9.3 No Transport Details

This document does not specify:

- HTTP, gRPC, or other transport protocols.
- Message formats or serialization.
- Network topology or connectivity.
- Encryption or transport security mechanisms.

Transport is an implementation concern.

### 9.4 No Vendor Selection

This document does not specify:

- Which external systems the platform will integrate with.
- Which vendors provide those systems.
- Which products or services are selected.
- Commercial or contractual arrangements.

Vendor selection is a separate governance and procurement activity.

### 9.5 No Queue or Async Mechanism Specification

This document does not specify:

- Whether execution uses synchronous or asynchronous communication.
- What queue or message broker technology is used.
- How async acknowledgment is handled.
- Delivery guarantees or ordering semantics.

These are implementation decisions that must satisfy the requirements in this document but are not defined by it.

---

## 10. Exit Criteria

Before any implementation of the Execution Adapter may be authorized, the following conditions must be satisfied.

### 10.1 Documentation Prerequisites

1. **G-01 is sealed**: The first execution slice (Scheduling Execution) is formally sealed and unmodified.
2. **G-02 is sealed**: This document is formally sealed and unmodified.
3. **F-04 is sealed**: The Audit and Evidence Model is formally sealed and unmodified.
4. **F-05 is sealed**: The Rollback and Compensation Design is formally sealed and unmodified.

All prerequisite documents must be sealed before implementation is considered.

### 10.2 Governance Review

1. **Boundary review**: A formal governance review has verified that this document correctly defines the execution boundary.
2. **Prohibition review**: A formal governance review has verified that the prohibitions in this document are complete and enforceable.
3. **Consistency review**: A formal governance review has verified that this document is consistent with G-01, F-04, F-05, and Phase E design artifacts.

### 10.3 Security Review

1. **Boundary security**: A security review has assessed whether the three-zone model provides adequate isolation.
2. **Audit security**: A security review has assessed whether the audit coupling requirements are sufficient to prevent unrecorded execution.
3. **Authority security**: A security review has assessed whether the human approval requirements cannot be bypassed.

### 10.4 Clinical Safety Review

1. **Failure mode safety**: A clinical safety review has assessed whether the failure and uncertainty semantics protect patient safety.
2. **Non-execution assumption**: A clinical safety review has confirmed that assuming non-execution under uncertainty is the correct default for clinical contexts.

### 10.5 Formal Unblock

Implementation may not begin until:

1. All exit criteria in this document are satisfied.
2. All exit criteria in G-01 are satisfied.
3. Phase G governance formally unblocks execution.
4. A specific implementation scope is authorized (not blanket authorization).

Completion of this document's exit criteria is necessary but not sufficient. Formal Phase G governance approval is required.

---

## 11. Closing Governance Statement

This document establishes the architectural boundary between orchestration and execution within the Zenthea platform. It defines the Execution Adapter as the single, governed surface through which irreversible external state changes may occur.

The Execution Adapter is a constraint, not a capability. It exists to ensure that:

- Execution is isolated from orchestration.
- Execution is subordinate to audit requirements.
- Execution is traceable to human approval.
- Execution failures are handled conservatively.
- AI is excluded from execution authority.

The requirements in this document are mandatory. The prohibitions are absolute. There are no exceptions, workarounds, or expedited paths.

**This document authorizes understanding and governance design only. It does not authorize implementation or execution.**

---

*Document ID: G-02-EAB*  
*Authority: Platform Governance (Phase G)*  
*Status: Design-Only — No Implementation Authorized*

---

**END OF ARTIFACT**
