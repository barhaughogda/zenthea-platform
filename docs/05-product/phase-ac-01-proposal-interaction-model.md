# Phase AC-01: Proposal Interaction Model

## 1. Status and Scope

| Attribute          | Value                                      |
| ------------------ | ------------------------------------------ |
| Classification     | PRODUCT / INTERACTION DESIGN               |
| Execution Status   | **NOT ENABLED**                            |
| Scope              | Proposal interactions only                 |
| Document Type      | Design specification                       |
| Authority Level    | Read-only intent modeling                  |

This document defines how humans and assistants MAY express intent via proposals. Execution is NOT enabled. No proposal described in this document triggers execution, persistence side effects, or autonomous action.

---

## 2. Purpose of This Document

### 2.1 Why Proposal Modeling Is Required Before Execution

The Zenthea platform requires a formal interaction model for proposals before any execution capability is considered. This requirement exists because:

- Intent expression MUST be separable from intent fulfillment.
- Human oversight MUST be architecturally enforced at the proposal layer.
- System behavior MUST be predictable and auditable before execution is permitted.
- The distinction between "what someone wants" and "what the system does" MUST be explicit and traceable.

### 2.2 Relationship to Phase AB Product Lock

Phase AB established read-only product surfaces for booking journeys, provider workbenches, and assistant interactions. Phase AC-01 extends this foundation by defining how intent MAY be expressed within those surfaces without enabling execution.

This document does NOT modify Phase AB constraints. All read-only restrictions from Phase AB remain in force.

---

## 3. Binding Authorities and Dependencies

This document is governed by and MUST NOT contradict the following authoritative documents:

| Document                                | Location                                                      | Relevance                                      |
| --------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| Phase AB Product Lock                   | `docs/05-product/phase-ab-product-lock.md`                    | Establishes read-only product surface baseline |
| Architecture Baseline Declaration       | `docs/01-architecture/architecture-baseline-declaration.md`   | Defines canonical architecture constraints     |
| Phase W Execution Design Lock           | `docs/01-architecture/phase-w-execution-design-lock.md`       | Locks execution design decisions               |
| Phase X Execution Planning Lock         | `docs/02-implementation-planning/phase-x-execution-planning-lock.md` | Locks execution planning scope          |
| Phase Y Execution Skeleton Lock         | `docs/02-implementation-planning/phase-y-execution-skeleton-lock.md` | Locks execution skeleton boundaries     |
| Phase Z Execution Governance Lock       | `docs/03-governance/phase-z-execution-governance-lock.md`     | Establishes execution governance framework     |

This document references these authorities without duplicating their content.

---

## 4. Definition of a Proposal

### 4.1 What a Proposal IS

A proposal is a structured expression of intent that:

- Represents a desired future state or action.
- Originates from a human, assistant, or system source.
- Exists in a non-executed, non-persisted state by default.
- Carries explicit metadata identifying its source, scope, and status.
- Requires human review before any state transition beyond draft.

### 4.2 What a Proposal IS NOT

A proposal is NOT:

- An instruction to the system.
- A commitment to perform an action.
- A trigger for execution.
- A mechanism for autonomous system behavior.
- A persisted canonical record.
- A binding agreement or contract.

### 4.3 Explicit Distinction: Proposal, Confirmation, and Execution

| Concept      | Definition                                                                 | Status in AC-01         |
| ------------ | -------------------------------------------------------------------------- | ----------------------- |
| Proposal     | Expression of intent without commitment                                    | DEFINED                 |
| Confirmation | Human acknowledgment that a proposal may proceed to execution readiness    | DEFINED (non-executing) |
| Execution    | System action that modifies canonical state based on confirmed intent      | NOT ENABLED             |

Confirmation in AC-01 is a conceptual state only. Confirmation does NOT enable execution.

---

## 5. Proposal Sources

### 5.1 Human-Initiated Proposals

Humans MAY create proposals through designated interaction surfaces. Human-initiated proposals:

- MUST be explicitly attributed to the originating human identity.
- MUST carry a creation timestamp.
- MAY express any intent within the scope of available proposal types.
- MUST NOT trigger execution regardless of content.

### 5.2 Assistant-Suggested Proposals

Assistants MAY suggest proposals to humans. Assistant-suggested proposals:

- MUST be clearly labeled as assistant-generated.
- MUST be presented for human review.
- MUST NOT be auto-confirmed or auto-executed.
- MUST include the assistant context that generated the suggestion.

### 5.3 System-Generated Proposals (Conceptual Only)

The system MAY conceptually generate proposals based on defined rules or conditions. In AC-01:

- System-generated proposals are defined conceptually only.
- No system-generated proposals are enabled for creation.
- This category exists to establish future design space.

---

## 6. Assistant Proposal Constraints

### 6.1 Permitted Assistant Behaviors

Assistants MAY:

- Suggest proposals to humans.
- Provide information relevant to proposal creation.
- Explain proposal options and their implications.
- Present draft proposals for human review.
- Modify draft proposals based on human feedback.

### 6.2 Prohibited Assistant Behaviors

Assistants MUST NOT:

- Confirm proposals autonomously.
- Execute proposals under any circumstances.
- Persist proposals without explicit human authorization.
- Infer human intent and act upon it.
- Escalate proposal status without human action.
- Create proposals that bypass human review.

### 6.3 Mandatory Labeling Requirements

All assistant-generated proposals MUST include:

- A visible indicator that the proposal originated from an assistant.
- The assistant session or context identifier.
- A timestamp of proposal generation.
- An explicit statement that human review is required.

---

## 7. Proposal Lifecycle (Conceptual)

### 7.1 Lifecycle States

| State     | Definition                                                      | Execution Enabled |
| --------- | --------------------------------------------------------------- | ----------------- |
| Draft     | Proposal created but not reviewed                               | NO                |
| Reviewed  | Proposal examined by authorized human                           | NO                |
| Confirmed | Proposal acknowledged as valid intent (conceptual only)         | NO                |
| Expired   | Proposal no longer valid due to time or context change          | NO                |
| Discarded | Proposal explicitly rejected or abandoned                       | NO                |

### 7.2 Execution Status Declaration

**No lifecycle state defined in this document enables execution.**

The Confirmed state represents human acknowledgment of valid intent. It does NOT authorize, trigger, or permit execution. Execution requires governance and enablement defined in future phases.

### 7.3 State Transitions

- Draft → Reviewed: Requires human examination.
- Reviewed → Confirmed: Requires explicit human confirmation action.
- Any state → Expired: Occurs based on defined validity rules.
- Any state → Discarded: Requires explicit human or system action.

All state transitions are non-executing.

---

## 8. Human Authority and Control Points

### 8.1 Proposal Creation Authority

Humans with appropriate platform access MAY create proposals. The specific access requirements are defined by platform identity and authorization models.

### 8.2 Proposal Review Authority

Humans with appropriate platform access MAY review proposals. Review does NOT imply confirmation or execution authorization.

### 8.3 Proposal Confirmation Authority

Humans with appropriate platform access MAY confirm proposals. Confirmation in AC-01 is a conceptual acknowledgment only and does NOT enable execution.

### 8.4 Accountability Requirements

- Every proposal MUST have an identifiable human accountable for its creation or confirmation.
- Assistant-suggested proposals MUST have an identifiable human accountable for their review.
- No proposal MAY exist without traceable human accountability.

---

## 9. Data and State Boundaries

### 9.1 Proposal Data Isolation

Proposal data:

- MUST be isolated from canonical operational records.
- MUST NOT be treated as authoritative system state.
- MAY exist in ephemeral or draft storage only.
- MUST be distinguishable from executed or persisted data.

### 9.2 Canonical Record Protection

Proposals MUST NOT:

- Modify canonical patient records.
- Modify canonical appointment records.
- Modify canonical provider records.
- Modify any authoritative system state.

### 9.3 Side Effect Prohibition

Proposals MUST NOT trigger:

- External system calls.
- Notification dispatches.
- Calendar modifications.
- Billing events.
- Any observable side effect beyond proposal state itself.

---

## 10. Read-Only vs Interactive Surfaces

### 10.1 Where Proposals MAY Appear

Proposals MAY be displayed on:

- Designated proposal creation interfaces.
- Proposal review and confirmation interfaces.
- Assistant interaction surfaces (as suggestions only).
- Administrative oversight interfaces.

### 10.2 Permitted Interactions

Users MAY:

- View proposals.
- Create draft proposals.
- Edit draft proposals they are authorized to modify.
- Review proposals.
- Confirm proposals (conceptual acknowledgment only).
- Discard proposals.

### 10.3 Prohibited Interactions

Users MUST NOT be able to:

- Execute proposals through any interface.
- Trigger side effects through proposal interactions.
- Modify canonical system state through proposal surfaces.
- Bypass human review requirements.

---

## 11. Explicitly Blocked Behaviours

The following behaviours are explicitly prohibited in AC-01:

### 11.1 No Automatic Execution

Proposals MUST NOT be automatically executed based on:

- Confirmation status.
- Time elapsed.
- System rules or conditions.
- Assistant recommendations.
- Any other trigger.

### 11.2 No Background Processing

Proposals MUST NOT trigger background processes that:

- Prepare for execution.
- Pre-allocate resources.
- Notify external systems.
- Modify system state in anticipation of execution.

### 11.3 No Silent Persistence

Proposals MUST NOT be silently persisted to:

- Canonical data stores.
- Audit logs as executed actions.
- External systems.
- Any location that implies execution occurred.

### 11.4 No Assistant-Triggered State Changes

Assistants MUST NOT trigger:

- Proposal state transitions without human action.
- Data persistence without human authorization.
- System modifications of any kind.

### 11.5 No Time-Based or Inferred Actions

The system MUST NOT:

- Infer human intent and act upon it.
- Execute proposals after a time delay.
- Assume confirmation based on inaction.
- Treat proposal expiration as confirmation.

---

## 12. Relationship to Future Phases

### 12.1 How AC-01 Enables AC-02 and AC-03

Phase AC-01 establishes the foundational interaction model for proposals. Future phases MAY build upon this foundation:

- Phase AC-02 MAY define proposal persistence and draft management.
- Phase AC-03 MAY define proposal-to-execution bridging.

These future phases are not authorized by this document.

### 12.2 Execution Governance Requirement

Execution capability requires:

- Completion of execution governance framework (Phase Z).
- Explicit execution enablement authorization.
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

## 14. Closing Product Governance Statement

This document authorizes NOTHING operational.

- No execution is enabled.
- No persistence is enabled.
- No side effects are permitted.
- No autonomous assistant actions are authorized.

This document defines how intent MAY be expressed. It does NOT authorize the fulfillment of that intent.

Execution remains BLOCKED pending future governance phases and explicit enablement authorization.

---

**End of Document**
