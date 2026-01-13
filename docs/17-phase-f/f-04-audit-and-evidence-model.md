# F-04 — Audit and Evidence Model (Governance-Only)

**Document ID:** F-04-AEM  
**Mode:** GOVERNANCE / PHASE F — AUDIT AND EVIDENCE MODEL (Design-Only)  
**Status:** DRAFT (Design-Only; no implementation authorized)  
**Authority:** Platform Governance (Phase F)  
**Builds on:** Phase E (Non-Executing Orchestration), F-01 (Scheduling Execution Design), F-02 (Voice and Ambient Interaction Design), F-03 (Consent and Listening UX Design)  

---

## 0. Document Intent and Constraints

This document is a **design-only governance artifact**. It defines the audit, evidence, and accountability model required before any execution-capable behavior may be considered in healthcare domains—including scheduling, clinical actions, and financial actions.

This document explicitly does NOT authorize:

- Any implementation of any kind (no code, no infrastructure, no integrations)
- Any API, schema, event payload, or contract definition
- Any database, storage, or persistence mechanism specification
- Any vendor, product, or technology selection
- Any cryptographic algorithm or integrity mechanism specification
- Any regulatory mapping or compliance certification
- Any execution capability of any kind

Interpretation SHALL be conservative:

- Any behavior not explicitly permitted by this design is **FORBIDDEN**.
- Any ambiguity or missing prerequisite is **BLOCKING**.
- **Fail-closed posture is mandatory.** Execution without evidence is forbidden.
- **Audit is a prerequisite for execution, not a side effect.**

---

## 1. Context and Purpose

### 1.1 Why Audit and Evidence Are Required Before Execution

The platform's Phase E established a non-executing foundation: orchestration that understands intent, routes requests, applies governance gates, and produces proposals—without performing irreversible actions. Phase F introduces the possibility of execution: irreversible state changes in external systems that affect patients, clinicians, and healthcare operations.

Execution in healthcare domains carries consequences that extend beyond the immediate action:

- **Patient safety**: Incorrect scheduling, documentation, or clinical actions can harm patients.
- **Legal liability**: Healthcare actions create legal obligations and potential disputes.
- **Regulatory accountability**: Healthcare is a regulated industry requiring demonstrable compliance.
- **Operational integrity**: Healthcare operations depend on reliable, accurate system state.

Before any execution capability is considered, the platform must establish a model for capturing, preserving, and accessing evidence of what was decided, by whom, under what authority, and what occurred. This model is the prerequisite for execution, not an afterthought.

### 1.2 Distinction Between Observability and Legal-Grade Audit

The platform distinguishes between two related but distinct concepts:

**Observability** (as defined in Phase E, E-06) supports operational monitoring:

- Service health and performance metrics
- Distributed tracing for debugging
- Error detection and alerting
- Capacity planning and optimization

**Legal-grade audit** supports accountability and compliance:

- Immutable evidence of decisions and actions
- Attribution of authority and responsibility
- Reconstruction of event sequences for dispute resolution
- Regulatory examination and legal discovery

Observability serves engineering and operations. Audit serves governance, compliance, and accountability. They overlap but are not interchangeable. This document governs audit; observability requirements are addressed in Phase E artifacts.

### 1.3 Execution Without Evidence Is Forbidden

The following principle is non-negotiable:

**No execution may proceed without confirmed evidence capture.**

This means:

- Evidence capture is a hard gate, not a best-effort activity.
- Failure to capture evidence blocks execution.
- Evidence capture failure is not recoverable through retry; it requires investigation.
- Post-hoc evidence creation is forbidden; evidence must be contemporaneous.

This principle applies to all execution domains: scheduling, clinical documentation, financial actions, and any future execution-capable behavior.

---

## 2. Core Principles

### 2.1 Completeness

Every governed action that modifies authoritative state must be accompanied by evidence. There are no exceptions:

- Every execution attempt has evidence of the attempt.
- Every execution outcome has evidence of the outcome.
- Every denial has evidence of the denial and its reason.
- Every failure has evidence of the failure and its context.

"Completeness" does not mean capturing everything. It means capturing everything necessary to reconstruct the decision chain for any governed action. Completeness is defined by what an auditor, regulator, or legal counsel would need to understand what happened and why.

### 2.2 Immutability

Evidence, once captured, cannot be modified, deleted, or overwritten:

- Evidence records are append-only.
- Corrections are recorded as new evidence referencing the original, not as modifications.
- No actor—including system administrators—may alter captured evidence.
- Evidence integrity must be verifiable without relying on the system that captured it.

Immutability is essential for legal defensibility. If evidence can be changed, it cannot be trusted. The platform must be able to demonstrate that evidence presented today is identical to evidence captured at the time of the action.

### 2.3 Attribution

Every evidence record must identify who approved, who executed, and under what authority:

- **Decision authority**: Who authorized the action (which human, with what role, at what time).
- **Execution authority**: What system or process performed the action.
- **Delegation chain**: If authority was delegated, the chain must be traceable.
- **Absence of authority**: If an action was denied, who or what denied it and why.

Attribution must be to identifiable, authenticated actors. Anonymous or unattributable actions are forbidden for governed operations.

### 2.4 Temporal Ordering

Evidence must establish what happened and in what order:

- Every evidence record has a precise timestamp.
- Timestamps must be consistent and comparable across system boundaries.
- The sequence of events must be reconstructible from evidence alone.
- Temporal gaps or inconsistencies must be detectable and explicable.

Temporal ordering is essential for causation analysis. When a dispute arises about whether action A caused outcome B, the evidence must establish the sequence.

### 2.5 Human Accountability Preserved

AI and automated systems may participate in decision processes, but human accountability is never delegated:

- Humans approve; systems execute.
- Humans are responsible for decisions within their authority.
- Systems are responsible for faithful execution of human-approved decisions.
- AI may recommend, propose, or assist—but AI is never the accountable party for a healthcare action.

This principle is fundamental to the platform's governance model and reflects the current legal and regulatory framework for healthcare.

---

## 3. What Constitutes "Evidence"

### 3.1 Identity Evidence

Identity evidence establishes who the actors are:

- **Patient identity**: Confirmation that the subject of the action is correctly identified.
- **Approver identity**: Confirmation that the human who approved the action is authenticated and authorized.
- **System identity**: Confirmation of which system or service performed the action.

Identity evidence does not require storing identifying information in the evidence record itself. It requires storing sufficient information to prove, if challenged, that identity was verified at the time of action.

### 3.2 Consent Evidence

Consent evidence establishes that required consents were in place:

- **Consent state at time of action**: What consents were verified and their status.
- **Consent scope**: What the consent covered and whether the action was within scope.
- **Consent verification method**: How consent was confirmed (not the consent content itself).

Consent evidence must be contemporaneous. A record that consent was verified at time T is valid evidence for an action at time T. A record of consent verified at time T-1 may not be sufficient for an action at time T if consent could have changed.

### 3.3 Approval Evidence

Approval evidence establishes that a human with authority approved the action:

- **Approver identity**: Who approved (by authenticated identity, not name).
- **Approval timestamp**: When approval was granted.
- **Approval scope**: What was approved (specific action, not blanket authorization).
- **Approval conditions**: Any conditions attached to the approval.
- **Approval method**: How approval was captured (explicit action, not inferred).

Approval evidence must be affirmative. The absence of rejection is not evidence of approval. Timeout is not evidence of approval. Default is not evidence of approval.

### 3.4 Execution Intent Evidence

Execution intent evidence establishes what action was requested:

- **Action type**: What kind of action (schedule, cancel, document, etc.).
- **Action parameters**: The essential parameters of the action (in bounded, non-PHI form where possible).
- **Originating request**: Reference to the proposal or request that led to execution.
- **Preconditions verified**: Which preconditions were checked and their outcomes.

Execution intent evidence captures what was intended to happen, enabling comparison with what actually happened.

### 3.5 External System Acknowledgment (Conceptual)

When execution involves external systems, evidence must include acknowledgment from those systems:

- **Request sent**: Evidence that a request was transmitted to the external system.
- **Response received**: Evidence of the external system's response.
- **Outcome determination**: How the platform interpreted the response (success, failure, indeterminate).

This document does not define how external acknowledgments are captured—that is an implementation concern. It establishes that such acknowledgments are required evidence.

### 3.6 Distinction Between Evidence and PHI

Evidence is not a repository for Protected Health Information (PHI):

- Evidence records contain metadata, references, and bounded identifiers.
- PHI remains in governed data stores with appropriate access controls.
- Evidence enables traceability to PHI without duplicating PHI.
- An auditor should be able to reconstruct a decision chain from evidence without accessing PHI, then access PHI through governed channels if PHI content is necessary.

This separation protects patient privacy while enabling accountability. Evidence exposure (to auditors, regulators, legal counsel) does not automatically expose PHI.

---

## 4. Audit Lifecycle Model

### 4.1 Pre-Execution Evidence Collection

Before any execution attempt, the following evidence must be captured and confirmed:

1. **Identity verification outcome**: Evidence that patient, approver, and system identities were verified.
2. **Consent verification outcome**: Evidence that required consents were checked and valid.
3. **Approval capture**: Evidence that human approval was obtained for the specific action.
4. **Precondition verification outcomes**: Evidence that all required preconditions (as defined in F-01) were evaluated.

Pre-execution evidence must be captured before the execution attempt begins. If pre-execution evidence capture fails, execution must not proceed.

### 4.2 Execution-Attempt Recording

When an execution attempt begins, the following evidence must be captured:

1. **Attempt identifier**: A unique identifier for this execution attempt.
2. **Attempt timestamp**: When the attempt began.
3. **Action specification**: What action is being attempted (in bounded form).
4. **Context reference**: References to pre-execution evidence.
5. **Audit pipeline acknowledgment**: Confirmation that the audit pipeline has accepted the attempt record.

Execution must not proceed until the audit pipeline acknowledges receipt of the attempt record. This is a synchronous gate, not an asynchronous best-effort operation.

### 4.3 Execution Outcome Recording

When an execution attempt completes, the following evidence must be captured:

1. **Outcome status**: Success, failure, or indeterminate.
2. **Outcome timestamp**: When the outcome was determined.
3. **External acknowledgment reference**: Reference to any external system acknowledgment.
4. **Error classification** (if applicable): Bounded error category without sensitive details.
5. **Audit pipeline acknowledgment**: Confirmation that the audit pipeline has accepted the outcome record.

The execution is not considered complete until the outcome is recorded and acknowledged. An action that succeeded in the external system but failed to record evidence is an anomaly requiring investigation.

### 4.4 Post-Execution Reconciliation

After execution, reconciliation verifies that recorded evidence matches expected outcomes:

1. **Evidence completeness check**: All required evidence records exist for the attempt.
2. **Evidence consistency check**: Evidence records do not contradict each other.
3. **External state verification** (where feasible): The external system's state matches the recorded outcome.

Reconciliation may occur asynchronously after execution but must occur within a bounded time window. Reconciliation failures trigger investigation, not automatic correction.

### 4.5 Failure and Denial Recording

When execution is denied or fails, the following evidence must be captured:

1. **Denial or failure classification**: Bounded category of why execution did not proceed.
2. **Blocking condition**: Which precondition, gate, or system prevented execution.
3. **State at denial/failure**: The state of relevant contexts at the time of denial/failure.
4. **Recovery path** (if any): Whether the denial is recoverable and what would be required.

Denial and failure evidence is as important as success evidence. A complete audit trail includes actions that did not happen and why they did not happen.

---

## 5. Actors and Responsibility

### 5.1 Patient

**Role in evidence model:**

- Subject of actions; initiator of requests.
- Provider of consent evidence through consent interactions.
- Not an approver of clinical or scheduling actions affecting themselves (in most cases).

**Evidence created by patient actions:**

- Consent grant and revocation records.
- Request initiation records.
- Acknowledgment of outcomes (where applicable).

**Evidence access:**

- Patients may access evidence of actions taken on their behalf, subject to access controls.
- Patients may not access evidence of other patients or internal system operations.

### 5.2 Clinician

**Role in evidence model:**

- Approver of clinical actions within their scope of practice.
- Approver of scheduling actions within their authority.
- Subject of attribution for decisions they authorize.

**Evidence created by clinician actions:**

- Approval records with clinician identity and timestamp.
- Decision records when clinical judgment is applied.
- Review and verification records for proposals.

**Accountability:**

- Clinicians are accountable for decisions they approve.
- Clinicians are not accountable for system execution failures if their approval was correctly captured.
- Clinicians must be identifiable from evidence; anonymous clinical approvals are forbidden.

### 5.3 Provider / Operator

**Role in evidence model:**

- Establishes policies that govern evidence requirements.
- Accesses audit evidence for compliance and operational purposes.
- May delegate approval authority to staff within governed bounds.

**Evidence created by provider/operator actions:**

- Policy configuration records.
- Delegation and authorization records.
- Access and review records for audit evidence.

**Accountability:**

- Providers are accountable for the policies they establish.
- Providers are accountable for the delegation of authority they grant.
- Providers must be able to demonstrate to regulators that appropriate controls are in place.

### 5.4 System

**Role in evidence model:**

- Executor of approved actions.
- Capturer of evidence at each lifecycle stage.
- Enforcer of evidence requirements (blocking execution when evidence capture fails).

**Evidence created by system:**

- All lifecycle evidence records (pre-execution, attempt, outcome, reconciliation).
- Gate evaluation records.
- Error and failure records.

**Accountability:**

- The system is accountable for faithful execution of approved decisions.
- The system is accountable for complete evidence capture.
- The system is not accountable for the substance of human decisions.

### 5.5 AI Is Never a Legal Actor

This principle is stated explicitly because it is foundational:

**AI components may assist, recommend, propose, and process—but AI is never the accountable party for a healthcare action.**

This means:

- AI recommendations are not approvals.
- AI confidence scores are not evidence of correctness.
- AI-generated content requires human review before becoming authoritative.
- AI cannot be named as the approver, authorizer, or responsible party in evidence records.

When evidence records attribute actions, they attribute to humans or to the system. AI is a tool used by humans and systems, not an actor with independent authority or accountability.

---

## 6. Failure, Denial, and Dispute Handling

### 6.1 What Is Recorded on DENY

When an action is denied (blocked by a governance gate), evidence must capture:

1. **Denial timestamp**: When the denial occurred.
2. **Denying gate**: Which gate issued the denial (identity, consent, approval, precondition, etc.).
3. **Denial reason category**: A bounded classification of why denial occurred (not free-form text that might contain PHI).
4. **Request reference**: Reference to the request that was denied.
5. **Actor context**: Who was involved (patient, clinician) at the time of denial, by reference.
6. **Recovery indication**: Whether the denial is recoverable and what category of action would be required.

Denial evidence must be sufficient to answer: "Why was this request denied?" without requiring access to PHI or system internals.

### 6.2 What Is Recorded on ERROR

When an action fails due to system error, evidence must capture:

1. **Error timestamp**: When the error occurred.
2. **Error classification**: A bounded error category (not stack traces or technical details).
3. **Lifecycle stage**: At what point in the lifecycle the error occurred.
4. **State at error**: The state of relevant contexts at error time.
5. **Request reference**: Reference to the request that experienced the error.
6. **External system involved** (if applicable): Which external system was involved, without exposing sensitive integration details.

Error evidence must be sufficient to answer: "What went wrong and when?" without exposing system vulnerabilities or sensitive technical details.

### 6.3 How Disputes Are Supported Without Exposing PHI

Disputes may arise when patients, clinicians, or providers question what occurred. Evidence must support dispute resolution while protecting privacy:

**Dispute support requirements:**

- An auditor can reconstruct the decision chain from evidence records.
- Evidence records contain references, not PHI content.
- If PHI review is necessary, it occurs through governed access to primary PHI stores, not through evidence records.
- Evidence records can be shared with legal counsel, regulators, or dispute resolution parties without inadvertently exposing PHI.

**Separation principle:**

- Evidence answers: "What was decided, by whom, when, and what happened?"
- PHI stores answer: "What was the content of the clinical information involved?"

These are answered through different access paths with different authorization requirements.

### 6.4 No Silent Failure Allowed

Silent failure—where an action fails without evidence—is a governance violation:

- Every failure must produce an evidence record.
- If evidence capture itself fails, that is a critical system failure requiring immediate attention.
- The system must not proceed as if an action succeeded when outcome evidence cannot be captured.
- Operations teams must be alerted to evidence capture failures as high-priority incidents.

Silent failure undermines the entire audit model. If failures can go unrecorded, the evidence trail is unreliable.

---

## 7. Evidence Retention and Access (Conceptual)

### 7.1 Retention Principles

This document does not specify retention durations—those depend on regulatory requirements, organizational policy, and legal counsel. This document establishes retention principles:

1. **Evidence must be retained for as long as accountability may be required.** Accountability may extend years beyond the action itself due to clinical outcomes, legal proceedings, or regulatory examination.

2. **Retention periods must be defined by policy, not by system convenience.** Storage constraints do not justify premature evidence deletion.

3. **Evidence deletion must itself be evidenced.** When evidence is deleted (at the end of its retention period), the deletion is recorded.

4. **Evidence must remain accessible throughout its retention period.** Archived evidence must be retrievable; inaccessible evidence is not retained evidence.

### 7.2 Role-Based Access to Evidence

Access to evidence is governed by role and purpose:

- **Patients** may access evidence of actions taken regarding them.
- **Clinicians** may access evidence of actions they approved or that affected their patients.
- **Providers/Operators** may access evidence for compliance, quality, and operational purposes within their organization.
- **Regulators** may access evidence as required by law and regulation.
- **Legal counsel** may access evidence as required for dispute resolution or legal proceedings.
- **System administrators** may access evidence for technical investigation but may not modify it.

Access to evidence does not automatically grant access to PHI. Evidence access and PHI access are separately governed.

### 7.3 Separation Between Operational Logs and Audit Evidence

Operational logs and audit evidence serve different purposes and have different characteristics:

**Operational logs:**

- Support debugging, performance analysis, and system monitoring.
- May be sampled, aggregated, or summarized.
- May be retained for shorter periods.
- Are managed by engineering and operations teams.

**Audit evidence:**

- Supports accountability, compliance, and dispute resolution.
- Must be complete (no sampling of governed operations).
- Must be retained for policy-defined periods.
- Is managed under governance oversight.

These may share infrastructure but must be conceptually and operationally separated. Operational log deletion must not affect audit evidence retention.

---

## 8. Explicit Prohibitions

The following are explicitly prohibited under this design. These prohibitions are non-negotiable and may not be overridden by configuration, role, or organizational policy.

### 8.1 Executing Without Audit

**No execution may proceed if audit evidence cannot be captured and acknowledged.**

This prohibition is absolute:

- Audit capture failure blocks execution.
- "Best-effort" audit for governed operations is forbidden.
- Audit bypass for performance, convenience, or edge cases is forbidden.
- If the audit system is unavailable, execution is unavailable.

### 8.2 Mutable Audit Trails

**Audit evidence, once captured, must not be modified, deleted, or overwritten.**

This prohibition is absolute:

- No "correction" of evidence records.
- No "cleanup" of erroneous entries.
- No administrative override to remove records.
- Corrections are captured as new records referencing originals.

### 8.3 Implicit Approvals

**Approval must be explicit, affirmative, and attributable.**

The following are not approvals:

- Absence of rejection.
- Timeout without response.
- Default settings or policies.
- Prior approvals for similar actions.
- Organizational policies that "pre-approve" categories of action.

Every governed action requires an explicit approval act by an authorized human for that specific action.

### 8.4 Post-Hoc Evidence Creation

**Evidence must be contemporaneous with the action it evidences.**

The following are forbidden:

- Creating evidence records after the fact to fill gaps.
- Backdating evidence to match action timestamps.
- Reconstructing evidence from system state rather than capturing it at action time.
- "Repairing" incomplete evidence trails by inference.

If evidence was not captured at the time of action, the absence of evidence is the evidence. Post-hoc creation would render the entire audit model untrustworthy.

### 8.5 AI-Generated Attestations

**AI may not attest to facts, approvals, or outcomes.**

AI components may:

- Process information and produce outputs.
- Assist humans in making decisions.
- Generate drafts for human review.

AI components may not:

- Be recorded as the approver or authorizer of an action.
- Generate attestations that are treated as evidence of human decision.
- Substitute for human accountability in evidence records.

---

## 9. Out of Scope

This document explicitly excludes the following. These topics require separate artifacts and are not addressed here.

### 9.1 No Event Schemas

This document does not define event schemas, message formats, or data structures. Schema definitions are implementation artifacts.

### 9.2 No Storage Mechanisms

This document does not specify databases, file systems, or storage technologies. Storage selection is an implementation decision.

### 9.3 No Cryptographic Algorithms

This document does not specify hash functions, digital signatures, or integrity verification mechanisms. Cryptographic choices are implementation decisions requiring security review.

### 9.4 No Regulatory Mappings

This document does not map requirements to specific regulations (HIPAA, GDPR, state laws). Regulatory mapping requires legal review and is addressed in separate compliance artifacts.

---

## 10. Exit Criteria

Before any execution capability may be considered, the following conditions must be satisfied.

### 10.1 What Must Be Proven Before Execution Can Be Considered

The following proofs are required:

1. **Evidence completeness proof**: Demonstration that the proposed execution design captures all required evidence types (identity, consent, approval, intent, outcome) for all execution paths.

2. **Evidence immutability proof**: Demonstration that captured evidence cannot be modified through any system interface or administrative action.

3. **Attribution proof**: Demonstration that every evidence record correctly attributes to identified, authenticated actors.

4. **Temporal ordering proof**: Demonstration that evidence timestamps are reliable and that event sequences can be reconstructed.

5. **Failure recording proof**: Demonstration that all failure modes produce evidence records and that no failure path bypasses evidence capture.

6. **PHI separation proof**: Demonstration that evidence records do not contain PHI and that evidence exposure does not constitute PHI exposure.

### 10.2 Required Follow-On Artifact

The following artifact must be complete before execution can proceed:

**F-05 — Rollback and Compensation Design**

This artifact will define:

- How execution failures that leave external systems in inconsistent states are detected.
- How compensation actions (reversing effects of failed executions) are governed.
- How rollback decisions are evidenced and audited.
- The prohibition on automated rollback without human authorization.

F-05 is the necessary complement to F-04. Audit captures what happened; rollback/compensation addresses what to do when what happened was wrong.

### 10.3 Required Reviews

Before execution may be authorized, the following reviews must be completed with no blocking findings:

1. **Security Review**: Assessment of the audit and evidence model against security requirements, including tamper resistance, access control, and integrity verification.

2. **Privacy Review**: Assessment against privacy requirements, confirming that evidence does not constitute a secondary PHI repository and that evidence access is appropriately governed.

3. **Clinical Safety Review**: Assessment of the model's adequacy for clinical accountability, including whether the evidence model would support investigation of adverse clinical events.

4. **Legal Review**: Assessment of the model's adequacy for legal defensibility, including whether evidence would be admissible and persuasive in legal proceedings.

5. **Governance Review**: Assessment by Platform Governance that the model is consistent with Phase F principles, Phase E sealed posture, and platform-wide governance requirements.

---

## 11. Summary

This document establishes the **audit and evidence model** required before any execution-capable behavior may be considered.

**Key Principles Established:**

1. **Audit is a prerequisite for execution**: Execution without evidence is forbidden; evidence capture failure blocks execution.

2. **Evidence is complete**: Every governed action has evidence of identity, consent, approval, intent, and outcome.

3. **Evidence is immutable**: Once captured, evidence cannot be modified; corrections are new records.

4. **Evidence is attributed**: Every record identifies who approved, who executed, under what authority.

5. **Evidence is temporally ordered**: The sequence of events is reconstructible from evidence alone.

6. **Human accountability is preserved**: AI is never the accountable party; humans approve, systems execute.

7. **PHI and evidence are separated**: Evidence enables traceability without duplicating PHI.

8. **Failure is never silent**: Every denial, error, and failure produces evidence.

**Value Delivered:**

- **For Patients**: Assurance that actions affecting them are recorded and attributable; recourse through evidence if disputes arise.
- **For Clinicians**: Clear attribution of decisions they authorized; protection from accountability for system failures.
- **For Providers**: Demonstrable compliance posture; audit trail for regulatory examination.
- **For Regulators**: A defensible, conservative model that prioritizes completeness, immutability, and accountability.
- **For Legal Counsel**: Evidence that is contemporaneous, attributable, and separable from PHI.

---

**END OF ARTIFACT**

*Document ID: F-04-AEM*  
*Authority: Platform Governance (Phase F)*  
*Status: Design-Only — No Implementation Authorized*

---

**This document authorizes understanding and governance design only. It does not authorize implementation.**
