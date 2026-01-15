# Phase AC-03: Proposal Review and Human Confirmation Model

## 1. Status and Scope

| Attribute          | Value                                      |
| ------------------ | ------------------------------------------ |
| Classification     | PRODUCT / INTERACTION DESIGN               |
| Execution Status   | **EXECUTION IS NOT ENABLED**               |
| Scope              | Human review, confirmation, and rejection of proposals |
| Document Type      | Design specification                       |
| Authority Level    | Interaction and human authority only       |

This document defines how proposals MAY be reviewed, confirmed, and rejected by humans. Review and confirmation MUST NOT imply execution readiness or trigger execution. Execution is NOT enabled. No review or confirmation mechanism described in this document authorises execution, enables autonomous action, or confers operational authority.

---

## 2. Purpose of This Document

### 2.1 Why Review and Confirmation Governance Is Required Before Execution

The Zenthea platform requires formal governance of proposal review and human confirmation before any execution capability is considered. This requirement exists because:

- Review MUST be separable from approval.
- Confirmation MUST be separable from execution.
- Human authority over proposal disposition MUST be explicit and traceable.
- The distinction between acknowledging intent and authorising action MUST be unambiguous.
- Rejection and return-for-revision MUST be governed by explicit rules, not inferred behaviours.

### 2.2 Relationship to Prior Phases

Phase AC-01 established the foundational interaction model for proposals, defining what proposals are, how they originate, and how humans and assistants MAY interact with them. Phase AC-02 extended this foundation by governing how proposals MAY be stored and managed over time. Phase AC-03 extends this further by defining how proposals MAY be reviewed, confirmed, and rejected by humans.

This document does NOT modify Phase AC-01 or Phase AC-02 constraints. All proposal constraints from prior phases remain in force.

---

## 3. Binding Authorities and Dependencies

This document is governed by and MUST NOT contradict the following authoritative documents:

| Document                                | Location                                                      | Relevance                                      |
| --------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| Phase AB Product Lock                   | `docs/05-product/phase-ab-product-lock.md`                    | Establishes read-only product surface baseline |
| Phase AC-01 Proposal Interaction Model  | `docs/05-product/phase-ac-01-proposal-interaction-model.md`   | Defines proposal interaction constraints       |
| Phase AC-02 Proposal Persistence and Draft Governance | `docs/05-product/phase-ac-02-proposal-persistence-and-draft-governance.md` | Defines proposal persistence constraints |
| Platform Status                         | `docs/00-overview/platform-status.md`                         | Declares canonical repository state            |
| Architecture Baseline Declaration       | `docs/01-architecture/architecture-baseline-declaration.md`   | Defines canonical architecture constraints     |

This document references these authorities without duplicating their content.

---

## 4. Definition of Proposal Review

### 4.1 What Review IS

Proposal review is:

- The examination of a proposal by an authorised human.
- An assessment of proposal content, completeness, and appropriateness.
- A human oversight activity that precedes confirmation or rejection.
- A traceable event with explicit attribution and timestamp.
- A non-executing activity that does not modify canonical state.

### 4.2 What Review IS NOT

Proposal review is NOT:

- Approval or confirmation of the proposal.
- Authorisation for execution.
- A trigger for system action or side effects.
- An implicit endorsement of proposal content.
- A substitute for explicit confirmation.
- A mechanism for autonomous system behaviour.

---

## 5. Human Roles and Review Authority

### 5.1 Reviewer

A reviewer is a human with authority to examine proposals and render disposition decisions. Reviewers:

- MUST be explicitly authorised to review proposals within their scope.
- MAY approve, reject, or return proposals for revision.
- MUST NOT delegate review authority to assistants or automated systems.
- MUST be identifiable and attributable in all review actions.

### 5.2 Proposer

A proposer is a human who created or owns a proposal. Proposers:

- MAY view the review status of their proposals.
- MAY respond to requests for revision.
- MUST NOT self-confirm proposals that require independent review.
- MUST NOT bypass review requirements.

### 5.3 Observer

An observer is a human with authority to view proposals and review activity without disposition authority. Observers:

- MAY view proposals and review history for oversight purposes.
- MUST NOT approve, reject, or return proposals.
- MUST NOT influence review outcomes through system actions.
- MAY be defined for audit, compliance, or governance purposes.

---

## 6. Review States (Non-Executing)

### 6.1 Submitted for Review

- A proposal that has been explicitly submitted for human review.
- MUST carry attribution identifying the human who submitted it.
- MUST carry a timestamp of submission.
- Execution: NOT ENABLED.

### 6.2 In Review

- A proposal currently under active human examination.
- MAY be assigned to a specific reviewer or review group.
- MUST remain non-executing while under review.
- Execution: NOT ENABLED.

### 6.3 Approved (Non-Executing)

- A proposal that has received positive disposition from an authorised reviewer.
- Approval is a conceptual acknowledgment only.
- Approval MUST NOT enable execution.
- Approval MUST NOT trigger side effects.
- Execution: NOT ENABLED.

### 6.4 Rejected

- A proposal that has received negative disposition from an authorised reviewer.
- MUST carry attribution identifying the rejecting reviewer.
- MUST carry a timestamp of rejection.
- MAY carry a rejection reason.
- Rejected proposals MUST NOT be executed.
- Execution: NOT ENABLED.

### 6.5 Returned for Revision

- A proposal returned to the proposer for modification.
- MUST carry attribution identifying the returning reviewer.
- MUST carry revision guidance or reason for return.
- Returns the proposal to draft state pending revision.
- Execution: NOT ENABLED.

---

## 7. Confirmation Semantics

### 7.1 What Confirmation IS

Confirmation is:

- An explicit human action acknowledging that a proposal represents valid intent.
- A recorded disposition event with attribution and timestamp.
- A prerequisite for any future execution consideration.
- A traceable artifact for audit and accountability purposes.
- A human authority checkpoint in the proposal lifecycle.

### 7.2 What Confirmation IS NOT

Confirmation is NOT:

- Authorisation for execution.
- A trigger for system action.
- Evidence that execution has occurred or will occur.
- A commitment to fulfil the proposal.
- A mechanism for autonomous system behaviour.
- A substitute for execution governance.

### 7.3 Explicit Separation from Execution

| Concept                | Definition                                                              | Execution Implication |
| ---------------------- | ----------------------------------------------------------------------- | --------------------- |
| Confirmed Proposal     | A proposal acknowledged as valid intent by an authorised human          | NONE                  |
| Approved Proposal      | A proposal that has received positive review disposition                | NONE                  |
| Execution-Ready        | A conceptual state requiring future governance (NOT DEFINED)            | NOT ENABLED           |
| Executed Proposal      | A proposal that has triggered system action (NOT DEFINED)               | NOT ENABLED           |

Confirmation MUST NOT be interpreted as execution authorisation. A confirmed proposal remains non-executing regardless of confirmation status, reviewer authority, or elapsed time.

---

## 8. Human Confirmation Requirements

### 8.1 Explicit Action

- Confirmation MUST require explicit human action.
- Confirmation MUST NOT be inferred from behaviour, timing, or inaction.
- Confirmation MUST be a discrete, identifiable event.
- Passive acknowledgment MUST NOT constitute confirmation.

### 8.2 Attribution

- Every confirmation MUST carry attribution identifying the confirming human.
- Attribution MUST identify the specific individual responsible.
- Attribution MUST NOT be defaulted, inferred, or delegated to systems.
- Anonymous or system-attributed confirmations are prohibited.

### 8.3 Timestamping

- Every confirmation MUST carry a timestamp.
- Timestamps MUST be system-generated and tamper-evident.
- Timestamp accuracy MUST be sufficient for audit purposes.
- Backdated confirmations are prohibited.

### 8.4 No Inferred Intent

- Confirmation MUST NOT be inferred from:
  - User silence or inaction.
  - Repeated viewing of a proposal.
  - Time elapsed since proposal creation.
  - Assistant interpretation or suggestion.
  - Pattern matching or behaviour analysis.
  - Any implicit signal.

---

## 9. Assistant Participation Constraints

### 9.1 Assistants MAY Assist

Assistants MAY:

- Present proposals for human review.
- Provide information relevant to review decisions.
- Summarise proposal content and history.
- Highlight relevant context for reviewer consideration.
- Assist humans in formulating revision requests.

### 9.2 Assistants MUST NOT Confirm, Approve, or Reject

Assistants MUST NOT:

- Confirm proposals on behalf of humans.
- Approve proposals autonomously.
- Reject proposals without human action.
- Return proposals for revision without human action.
- Infer or anticipate human review decisions.
- Escalate proposal status without explicit human action.
- Bypass human review requirements.
- Act upon inferred human intent.

---

## 10. Data and State Boundaries

### 10.1 No Canonical Mutation

Review and confirmation activities MUST NOT:

- Modify canonical patient records.
- Modify canonical appointment records.
- Modify canonical provider records.
- Modify any authoritative system state.
- Create operational records as a result of confirmation.

### 10.2 No Execution Readiness

Review and confirmation MUST NOT:

- Confer execution readiness upon proposals.
- Place proposals in execution queues.
- Trigger pre-execution preparation.
- Allocate resources for execution.
- Signal readiness to external systems.

### 10.3 No Side Effects

Review and confirmation MUST NOT trigger:

- External system calls.
- Notification dispatches beyond review workflow.
- Calendar modifications.
- Billing events.
- Any observable side effect beyond review state itself.

---

## 11. Explicitly Blocked Behaviours

### 11.1 No Auto-Confirmation

Proposals MUST NOT be automatically confirmed based on:

- Time elapsed.
- Reviewer inaction.
- System rules or conditions.
- Assistant recommendation.
- Proposal completeness.
- Prior similar proposals.

### 11.2 No Background Review

Proposals MUST NOT be subject to:

- Automated review processing.
- Background validation that constitutes review.
- Scheduled auto-disposition.
- Silent review state transitions.
- Asynchronous approval or rejection.

### 11.3 No Assistant-Driven Confirmation

Assistants MUST NOT:

- Confirm proposals under any circumstances.
- Trigger confirmation through suggestion or inference.
- Interpret user behaviour as confirmation intent.
- Recommend confirmation in ways that bypass human action.
- Create conditions that lead to implied confirmation.

### 11.4 No Silent Approval

Approval MUST NOT occur through:

- Absence of rejection.
- Expiration of review period.
- Default disposition rules.
- System-inferred reviewer intent.
- Any mechanism other than explicit human action.

---

## 12. Relationship to Future Phases

### 12.1 AC-04 Reference Only

Phase AC-04 MAY define execution enablement and proposal-to-execution bridging. Phase AC-04 is referenced for context only and is not authorised by this document.

### 12.2 Execution Requires Future Governance

Execution capability requires:

- Completion of execution governance framework.
- Explicit execution enablement authorisation.
- Documented readiness evidence.
- Human approval at appropriate authority levels.

This document does NOT satisfy any execution governance requirement.

---

## 13. Change Control Rules

### 13.1 Immutability

Once this document is committed and locked:

- Its content MUST NOT be modified in place.
- Corrections require a superseding document with explicit reference.
- The commit hash serves as the immutable reference.

### 13.2 Supersession Requirements

A superseding document MUST:

- Explicitly reference this document.
- State which sections are superseded.
- Provide rationale for changes.
- Undergo equivalent review and approval.

---

## 14. Closing Governance Statement

This document authorizes NOTHING operational.

- No execution is enabled.
- No operational review authority is enabled.
- No side effects are permitted.
- No autonomous actions are authorised.
- No execution readiness is conferred by confirmation.

This document defines how proposals MAY be reviewed, confirmed, and rejected by humans. It does NOT authorise the fulfilment of confirmed intent.

**EXECUTION REMAINS BLOCKED** pending future governance phases and explicit enablement authorisation.

---

*End of Document*
