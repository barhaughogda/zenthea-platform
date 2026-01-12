# F-01 — Scheduling Execution Design

**Document ID:** F-01-SED  
**Mode:** GOVERNANCE / PHASE F — EXECUTION DESIGN (Design-Only)  
**Status:** DRAFT (Design-Only; no implementation authorized)  
**Authority:** Platform Governance (Phase F)  
**Prerequisites:** Phase E SEALED; SL-07 SEALED; SL-08 SEALED  

---

## 0. Document Intent and Constraints

This document is a **design-only governance artifact**. It defines what "Scheduling Execution" means at a conceptual, governance, and trust level.

This document does NOT authorize:

- Implementation of any kind
- API, schema, or contract definition
- UI design or behavior specification
- Automation of any scheduling action
- Integration with external systems

Interpretation SHALL be conservative:

- Any behavior not explicitly permitted by this design is **FORBIDDEN**.
- Any ambiguity or missing prerequisite is **BLOCKING**.
- This document enables understanding, not action.

---

## 1. Context

### 1.1 Relationship to Phase E

Phase E established the **non-executing foundation** for the patient scheduling journey:

- **SL-07 (Scheduling Proposal)** — Sealed. A patient-initiated flow that produces a structured scheduling proposal (new appointment, reschedule, or cancellation). SL-07 is explicitly non-executing: it produces a proposal in a pending state and communicates that status clearly to the patient. No booking, modification, or cancellation is performed.

- **SL-08 (Provider Review)** — Sealed. A Human-In-The-Loop (HITL) flow that allows a provider or authorized staff member to review a scheduling proposal. SL-08 is explicitly non-executing: it captures the provider's decision (approve, reject, request modification) but does not possess the capability to commit, finalize, or execute scheduling changes in any authoritative domain system.

Phase E was intentionally constrained to **demonstrable, auditable, non-executing behavior**. The outputs of SL-07 and SL-08 are advisory artifacts and decision signals only.

### 1.2 What Phase F Introduces

Phase F addresses the transition from **proposal and decision** to **irreversible external state change**.

Where Phase E asks: "What does the patient want?" and "What does the provider decide?"  
Phase F asks: "What happens when we commit this decision to the real world?"

This is a **materially different category of behavior**. Phase E outputs have no real-world consequence beyond the patient's understanding and the provider's recorded decision. Phase F execution changes external state in ways that may be difficult or impossible to reverse.

### 1.3 Irreversibility Statement

**Phase F introduces irreversible intent.**

Once a scheduling action is executed:

- An appointment slot may be consumed and no longer available to other patients.
- External calendar systems may be updated.
- Notifications may be sent to patients, providers, and practice staff.
- Downstream clinical workflows may be triggered or affected.
- Billing and operational processes may be initiated.

These changes cannot be "taken back" by the platform in the same way that a draft can be discarded. Reversing an executed action requires a new, separate action (cancellation, reschedule) with its own governance and approval requirements.

---

## 2. What "Execution" Means (and Does NOT Mean)

### 2.1 Definition of Execution

In the context of scheduling, **execution** means:

> The commitment of an approved scheduling decision to an authoritative external system, resulting in a state change that is visible to and relied upon by actors outside the Zenthea platform.

Execution is characterized by:

1. **External State Change** — The action modifies state in a system of record (e.g., practice management system, EHR calendar, external scheduling platform).
2. **Reliance by Others** — Patients, providers, and practice staff will act based on the executed state (e.g., patient arrives for appointment, provider prepares for visit).
3. **Irreversibility Threshold** — The action cannot be undone without a new, separate, governed action.

### 2.2 What Execution Is NOT

Execution is NOT:

- **A proposal** — SL-07 outputs are proposals, not execution.
- **A decision** — SL-08 captures decisions, but decisions are not execution.
- **An internal state change** — Updating a proposal's status from "pending" to "approved" within the platform is not execution; it is decision capture.
- **A notification** — Informing a patient that their proposal was approved is not execution; it is communication about decision state.

### 2.3 Forbidden Behaviors (Non-Negotiable)

The following behaviors are **strictly forbidden** in any scheduling execution design:

1. **Autonomous Execution** — No AI agent, orchestration process, or automated workflow may execute a scheduling action without explicit human approval for that specific action.

2. **Silent Booking** — No scheduling action may be committed without the patient being clearly informed of the action and its irreversible nature.

3. **AI Authority over Scheduling** — No AI component may possess the authority to approve, commit, or finalize scheduling changes. AI may assist, propose, and orchestrate—but never authorize or execute.

4. **Implicit Approval** — Absence of rejection is not approval. Timeout is not approval. Default is not approval. Approval must be explicit and attributable.

5. **Bypass of Governance Gates** — No execution path may bypass identity verification, tenant scoping, consent verification, or provider approval state.

6. **Execution without Audit** — No scheduling action may be executed without a complete, non-omittable audit trail that captures the decision, the approver, the execution attempt, and the outcome.

---

## 3. Actors and Authority

This section defines the roles involved in scheduling execution and their explicit authorities and limitations.

### 3.1 Patient

**Role:** The patient is the subject of the scheduling action and the initiator of the request.

**Authority:**
- May initiate a scheduling request (SL-07).
- May receive information about proposal status and execution outcomes.
- May initiate subsequent requests (reschedule, cancellation) following the same governed flow.

**Limitations:**
- Cannot approve their own scheduling request for execution.
- Cannot directly execute a scheduling action.
- Cannot bypass provider review requirements where established by practice policy.

### 3.2 Provider (or Authorized Staff)

**Role:** The provider or authorized practice staff member is the human decision-maker who reviews scheduling proposals.

**Authority:**
- May approve, reject, or request modification of scheduling proposals (SL-08).
- Approval by an authorized human is **the necessary precondition** for execution.
- The provider's approval constitutes the **authorization signal** that permits execution to proceed.

**Limitations:**
- Approval alone does not cause execution; execution is a separate, governed step.
- Cannot delegate approval authority to AI or automated systems.
- Must be authenticated and authorized within the platform before approval is valid.

### 3.3 System (Orchestration)

**Role:** The platform orchestrates the flow from proposal to decision to execution, but does not possess independent authority.

**Authority:**
- May coordinate the sequencing of governance gates.
- May invoke external systems to perform execution **only after** all preconditions are satisfied.
- May emit audit signals and capture execution outcomes.
- May deny or block execution if preconditions are not met.

**Limitations:**
- Cannot approve scheduling actions.
- Cannot execute scheduling actions without explicit human approval.
- Cannot override governance denials.
- Cannot retry failed executions without new governance approval.

### 3.4 Summary of Authority

| Actor | Can Initiate Request | Can Approve | Can Trigger Execution | Can Execute |
|:------|:-------------------:|:-----------:|:---------------------:|:-----------:|
| Patient | Yes | No | No | No |
| Provider/Staff | No | Yes | Indirectly (via approval) | No |
| System (Orchestration) | No | No | Yes (if authorized) | Proxy only |
| External System | No | No | No | Yes (as target) |

**Key Principle:** No single actor can both approve and execute. The separation of approval authority (human) from execution capability (system-to-external) is a fundamental governance boundary.

---

## 4. Execution Preconditions

Before any scheduling action may be executed, all of the following preconditions MUST be satisfied. Failure of any precondition is **BLOCKING**.

### 4.1 Identity Verification (Hard Gate)

- The patient subject of the scheduling action MUST be positively identified.
- The approving provider or staff member MUST be authenticated and authorized within the platform.
- Identity verification MUST NOT rely on cached or stale authentication state.

### 4.2 Tenant Scoping (Hard Gate)

- The scheduling action MUST be scoped to a specific practice/tenant.
- Cross-tenant scheduling actions are forbidden.
- Tenant context MUST be verified at the time of execution, not only at the time of proposal.

### 4.3 Consent Verification (Hard Gate)

- Patient consent for scheduling-related data processing MUST be verified.
- Consent verification MUST occur prior to execution, not only at proposal time.
- If consent state has changed since proposal, execution MUST be blocked pending re-evaluation.

### 4.4 Proposal State Completeness

- A valid SL-07 proposal MUST exist for the scheduling action.
- The proposal MUST be in a state that permits execution (not expired, not withdrawn, not already executed).
- All required proposal fields MUST be complete and valid.

### 4.5 Approval State Completeness

- A valid SL-08 approval decision MUST exist for the scheduling action.
- The approval MUST be:
  - Explicit (not implied by absence of rejection)
  - Attributable (linked to a specific authenticated human approver)
  - Current (not expired, not superseded by subsequent decisions)
  - Unconditional (not contingent on unverified conditions)

### 4.6 External System Readiness

- The target external system (practice management, EHR calendar, etc.) MUST be available and responsive.
- The platform MUST have valid credentials and authorization to act on the external system.
- If external system readiness cannot be verified, execution MUST be blocked.

### 4.7 Audit Pipeline Readiness

- The audit pipeline MUST be available to receive and acknowledge execution audit signals.
- Execution MUST NOT proceed if audit signals cannot be emitted and acknowledged.
- Audit failure is an execution blocker, not a post-execution concern.

---

## 5. Failure and Rollback Semantics

### 5.1 Execution Failure Modes

Execution may fail at multiple points:

1. **Pre-execution Failure** — A precondition (Section 4) is not satisfied. Execution does not proceed. No external state change occurs.

2. **Execution Attempt Failure** — Preconditions were satisfied, but the external system rejected or failed the request (e.g., slot no longer available, system error, timeout).

3. **Post-execution Discovery** — Execution appeared to succeed, but subsequent verification reveals a discrepancy or conflict.

### 5.2 What Happens on Failure

**Pre-execution Failure:**
- Execution attempt is blocked.
- Proposal and approval state remain unchanged.
- Patient and provider may be notified of the blocking condition.
- A new attempt may be possible after the blocking condition is resolved.

**Execution Attempt Failure:**
- Execution is recorded as failed with a bounded reason code.
- No assumption is made about external state (it may or may not have changed).
- Retry is NOT automatic; any retry requires new governance evaluation.
- Patient and provider must be informed of the failure.

**Post-execution Discovery:**
- The discrepancy is recorded as an audit event.
- Resolution requires human intervention (practice staff, support).
- Automated "correction" is forbidden; any correction is a new governed action.

### 5.3 What Is Auditable

All of the following MUST be captured in the audit trail (metadata-only):

- Proposal identifier and state at time of execution attempt
- Approval identifier, approver identity, and approval timestamp
- Execution attempt timestamp
- Execution outcome (success, failure, blocked)
- If failed: bounded reason code (no raw error payloads)
- External system interaction identifier (if available and non-sensitive)

### 5.4 What Cannot Be Undone

Once execution succeeds:

- The appointment slot is consumed in the external system.
- The patient and provider are operating on the assumption that the appointment exists.
- Any reversal (cancellation, reschedule) is a **new scheduling action** with its own proposal, approval, and execution requirements.

There is no "undo" for successful execution. There is only "new action."

### 5.5 Rollback Prohibition

The platform SHALL NOT attempt automated rollback of executed scheduling actions. Rollback implies:

- The platform knows the pre-execution state definitively (it may not).
- The platform can restore that state without side effects (it cannot guarantee this).
- No external actor has relied on the executed state (they may have).

Instead, any error discovered post-execution is handled through:

1. Audit capture
2. Human notification
3. New governed action (if correction is required)

---

## 6. Trust and Safety Rationale

### 6.1 How This Design Protects Patients

**Clear Communication:** Patients are never led to believe an appointment is confirmed when it is only proposed or approved. Execution is a distinct step, and patients are informed when execution completes (or fails).

**No Surprises:** Patients will not arrive for appointments that don't exist in the external system. The proposal-approval-execution flow ensures that confirmed appointments are real.

**Consent Respected:** Execution cannot proceed without verified consent. If a patient withdraws consent, execution is blocked.

**Recourse Available:** If something goes wrong, the audit trail provides a complete record for investigation and resolution. Patients are not left without explanation.

### 6.2 How This Design Protects Clinicians

**Authority Preserved:** Clinicians retain decision authority. AI assists but cannot override or bypass clinician judgment. No appointment is confirmed without explicit clinician or authorized staff approval.

**Accountability Clear:** The audit trail records who approved what and when. Clinicians are not held responsible for actions they did not approve.

**No Autonomous Action:** The platform cannot create clinical workflow obligations (appointments) without human authorization. Clinicians' schedules are not manipulated by automated processes.

### 6.3 How This Design Protects the Platform (Legal and Operational)

**Audit Completeness:** Every execution attempt is recorded with sufficient metadata to reconstruct the decision chain. This supports compliance requirements and dispute resolution.

**No Unauthorized Action:** The platform can demonstrate that execution only occurs with explicit human approval. This limits liability for scheduling errors.

**Fail-Closed Posture:** When in doubt, the platform does not execute. This conservative posture reduces the risk of harm from edge cases or system failures.

**Separation of Concerns:** The platform orchestrates but does not authorize. This clear separation supports regulatory compliance and operational clarity.

---

## 7. Out of Scope (Hard Boundaries)

This document explicitly does NOT define:

### 7.1 Not Defined in This Document

- **API contracts** — No endpoint definitions, request/response schemas, or protocol specifications.
- **Data schemas** — No database models, proposal structures, or approval record formats.
- **UI behavior** — No wireframes, user flows, or interaction patterns.
- **External system integration details** — No specific EHR, practice management, or calendar system interfaces.
- **Notification mechanics** — No email, SMS, or in-app notification specifications.
- **Error message content** — No user-facing error text or localization.
- **Performance requirements** — No latency, throughput, or availability targets.
- **Retry policies** — No timing, backoff, or retry limit specifications (beyond "no automatic retry").

### 7.2 Not Authorized by This Document

- **Any implementation work** — This document does not authorize code, infrastructure, or integration work.
- **Any automation of approval** — This document does not create a path to automated approval.
- **Any relaxation of preconditions** — The preconditions in Section 4 are not negotiable in this design.

### 7.3 Explicitly Deferred

The following topics are related but require separate governance documents:

- **Scheduling execution for provider-initiated requests** — This document addresses patient-initiated flows only.
- **Batch scheduling operations** — Bulk execution requires separate governance.
- **Emergency/urgent scheduling flows** — Expedited paths require separate risk assessment.
- **Cross-practice scheduling** — Multi-tenant execution requires separate governance.

---

## 8. Exit Criteria for Phase F (Scheduling Execution)

Before Phase F scheduling execution may proceed to implementation, the following MUST be true:

### 8.1 Required Governance Artifacts

1. **F-02 — Scheduling Execution Contract Specification** — A separate document defining the precise contracts, preconditions, and interfaces required for execution (design-only, not implementation).

2. **F-03 — External System Integration Requirements** — A separate document defining what the platform requires from external scheduling systems (capabilities, guarantees, failure modes).

3. **F-04 — Execution Failure Taxonomy** — A separate document defining the bounded set of failure reason codes and their semantics (consistent with E-05 patterns).

4. **F-05 — Scheduling Execution Audit Schema** — A separate document defining the metadata fields required for execution audit events (consistent with E-06/E-07 patterns).

### 8.2 Required Evidence

1. **Precondition Verifiability Proof** — Evidence that each precondition in Section 4 can be mechanically verified at execution time.

2. **Audit Non-Omittability Proof** — Evidence that execution cannot succeed without audit signal emission and acknowledgment.

3. **Separation of Authority Proof** — Evidence that no single actor or component can both approve and execute.

### 8.3 Required Reviews

1. **Security Review** — Assessment of the execution design against platform security requirements.

2. **Compliance Review** — Assessment of the execution design against HIPAA and relevant regulatory requirements.

3. **Operational Review** — Assessment of the execution design against practice operational requirements and failure handling expectations.

### 8.4 Explicit Governance Unblock

Phase F scheduling execution SHALL NOT proceed to implementation until:

- All required artifacts (8.1) are complete and sealed.
- All required evidence (8.2) is generated and verified.
- All required reviews (8.3) are completed with no blocking findings.
- Platform Governance issues an explicit unblock decision (analogous to MIG-06 unblock in Phase E).

---

## 9. Summary

This document establishes the **conceptual and governance foundation** for scheduling execution in Phase F.

**Key Principles Established:**

1. Execution is an irreversible external state change, distinct from proposal and decision.
2. Human approval is the necessary precondition for execution; AI cannot approve or execute autonomously.
3. All preconditions must be satisfied before execution; any failure is blocking.
4. Execution is fully auditable; audit failure blocks execution.
5. There is no automatic rollback; errors are handled through new governed actions.
6. This document authorizes understanding only; implementation requires further governance work.

**Value Delivered:**

- **For Patients:** Clear, honest communication about scheduling state; no false confirmations.
- **For Clinicians:** Preserved authority; no autonomous manipulation of schedules.
- **For the Platform:** Defensible, auditable, fail-safe execution posture.

---

**END OF ARTIFACT**

*Document ID: F-01-SED*  
*Authority: Platform Governance (Phase F)*  
*Status: Design-Only — No Implementation Authorized*
