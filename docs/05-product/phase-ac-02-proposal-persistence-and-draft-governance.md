# Phase AC-02: Proposal Persistence and Draft Governance

## 1. Status and Scope

| Attribute          | Value                                      |
| ------------------ | ------------------------------------------ |
| Classification     | PRODUCT / INTERACTION DESIGN               |
| Execution Status   | **EXECUTION IS NOT ENABLED**               |
| Scope              | Proposal persistence and draft governance  |
| Document Type      | Design specification                       |
| Authority Level    | Storage and lifecycle governance only      |

This document defines how proposals MAY be stored, revisited, versioned, expired, and audited. Persistence of proposals MUST NOT imply readiness, confirmation, or execution authority. Execution is NOT enabled. No persistence mechanism described in this document triggers execution, enables autonomous action, or confers operational authority.

---

## 2. Purpose of This Document

### 2.1 Why Persistence Governance Is Required Before Execution

The Zenthea platform requires formal governance of proposal persistence before any execution capability is considered. This requirement exists because:

- Storage of intent expressions MUST be separable from fulfilment of intent.
- Persistence MUST NOT confer authority or imply execution readiness.
- Draft management MUST preserve human oversight and control.
- Versioning and amendment MUST be explicit, traceable, and auditable.
- Expiration and retention MUST be governed by explicit rules, not inferred behaviours.

### 2.2 Relationship to Phase AC-01

Phase AC-01 established the foundational interaction model for proposals, defining what proposals are, how they originate, and how humans and assistants MAY interact with them. Phase AC-02 extends this foundation by governing how proposals MAY be stored and managed over time.

This document does NOT modify Phase AC-01 constraints. All proposal constraints from Phase AC-01 remain in force.

---

## 3. Binding Authorities and Dependencies

This document is governed by and MUST NOT contradict the following authoritative documents:

| Document                                | Location                                                      | Relevance                                      |
| --------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------- |
| Phase AB Product Lock                   | `docs/05-product/phase-ab-product-lock.md`                    | Establishes read-only product surface baseline |
| Phase AC-01 Proposal Interaction Model  | `docs/05-product/phase-ac-01-proposal-interaction-model.md`   | Defines proposal interaction constraints       |
| Platform Status                         | `docs/00-overview/platform-status.md`                         | Declares canonical repository state            |
| Architecture Baseline Declaration       | `docs/01-architecture/architecture-baseline-declaration.md`   | Defines canonical architecture constraints     |

This document references these authorities without duplicating their content.

---

## 4. Definition of Proposal Persistence

### 4.1 What Persistence IS

Proposal persistence is:

- The storage of proposal data beyond the immediate interaction session.
- A mechanism for humans to revisit, review, and manage proposals over time.
- A record of expressed intent with explicit attribution and timestamps.
- A governed storage category subject to defined lifecycle rules.
- A traceable artifact for audit and accountability purposes.

### 4.2 What Persistence IS NOT

Proposal persistence is NOT:

- A commitment to execute the proposal.
- Evidence that the proposal has been confirmed.
- A trigger for execution or background processing.
- A canonical operational record.
- A mechanism for autonomous system action.
- A substitute for explicit human confirmation.

### 4.3 Explicit Separation from Execution Readiness

| Concept                | Definition                                                              | Execution Implication |
| ---------------------- | ----------------------------------------------------------------------- | --------------------- |
| Stored Proposal        | A proposal that exists in persistent storage                            | NONE                  |
| Persisted Draft        | A draft proposal retained across sessions                               | NONE                  |
| Versioned Proposal     | A proposal with tracked amendment history                               | NONE                  |
| Retained Confirmation  | A non-executing confirmation acknowledgment stored for audit            | NONE                  |

Persistence MUST NOT be interpreted as execution readiness. A persisted proposal remains non-executing regardless of its storage duration, version count, or confirmation status.

---

## 5. Proposal Storage Categories

### 5.1 Ephemeral Drafts

Ephemeral drafts:

- MUST exist only within the active interaction session.
- MUST be discarded when the session ends.
- MUST NOT be recoverable after session termination.
- MAY be used for proposal exploration without persistence overhead.

### 5.2 Session-Bound Drafts

Session-bound drafts:

- MUST be associated with a specific user session.
- MUST expire when the session expires.
- MAY be retained for the duration of the session for user convenience.
- MUST NOT persist beyond session boundaries without explicit user action.

### 5.3 Persisted Proposals

Persisted proposals:

- MUST be explicitly saved by human action.
- MUST carry attribution identifying the human who authorised persistence.
- MUST carry a timestamp of persistence.
- MUST be subject to defined retention and expiration rules.
- MUST remain non-executing regardless of persistence status.

### 5.4 Prohibited Storage Categories

The following storage categories are prohibited:

- **Auto-persisted proposals**: Proposals MUST NOT be persisted without explicit human authorisation.
- **Shadow storage**: Proposals MUST NOT be stored in undisclosed or hidden locations.
- **Execution-ready queues**: Proposals MUST NOT be stored in queues that imply execution readiness.
- **Background staging**: Proposals MUST NOT be stored for background processing or pre-execution preparation.

---

## 6. Proposal Ownership and Visibility Rules

### 6.1 Human Ownership

- Every persisted proposal MUST have an identifiable human owner.
- Ownership MUST be established at the time of persistence.
- Ownership MUST be explicitly recorded and attributable.
- Ownership transfers MUST be explicit and logged.

### 6.2 Role-Based Visibility

- Proposal visibility MUST be governed by role-based access rules.
- Visibility rules MUST be explicit and auditable.
- Proposals MUST NOT be visible to unauthorised parties.
- Cross-tenant visibility is prohibited.

### 6.3 Explicit Prohibition on Inferred Ownership

- Ownership MUST NOT be inferred from context, session, or behaviour.
- If ownership cannot be explicitly determined, the proposal MUST NOT be persisted.
- Assistant suggestions MUST NOT carry implicit ownership until a human explicitly claims ownership.

---

## 7. Proposal Lifecycle States (Non-Executing)

### 7.1 Draft

- A proposal in initial creation or modification.
- MAY be ephemeral, session-bound, or persisted.
- Execution: NOT ENABLED.

### 7.2 Revised

- A proposal that has been modified after initial creation.
- MUST carry version linkage to prior versions.
- Execution: NOT ENABLED.

### 7.3 Reviewed

- A proposal that has been examined by an authorised human.
- Review MUST be logged with attribution and timestamp.
- Execution: NOT ENABLED.

### 7.4 Confirmed (Non-Executing)

- A proposal acknowledged as valid intent by an authorised human.
- Confirmation is a conceptual state only.
- Confirmation MUST NOT enable execution.
- Execution: NOT ENABLED.

### 7.5 Expired

- A proposal that has exceeded its defined validity period.
- Expired proposals MUST NOT be executed.
- Expired proposals MUST NOT be automatically revived.
- Execution: NOT ENABLED.

### 7.6 Discarded

- A proposal explicitly rejected or abandoned.
- Discarded proposals MUST be retained for audit purposes per retention rules.
- Discarded proposals MUST NOT be executed.
- Execution: NOT ENABLED.

---

## 8. Versioning and Amendment Rules

### 8.1 Append-Only Expectations

- Proposal modifications MUST create new versions.
- Prior versions MUST be retained and immutable.
- Version history MUST be complete and auditable.
- Modification of historical versions is prohibited.

### 8.2 Supersession Semantics

- A revised proposal MUST explicitly reference the version it supersedes.
- Superseded versions MUST be marked as superseded.
- Only the latest non-superseded version MAY be active.
- Supersession chains MUST be traceable.

### 8.3 No Silent Mutation

- Proposal content MUST NOT be modified without creating a new version.
- Metadata changes that affect proposal meaning MUST create new versions.
- Silent or background modifications are prohibited.
- All mutations MUST be attributed and timestamped.

---

## 9. Expiration and Retention Principles

### 9.1 Time-Bound Proposals

- Proposals MAY carry explicit validity periods.
- Validity periods MUST be defined at creation or through governance rules.
- Proposals without explicit validity periods MUST be subject to default expiration rules.

### 9.2 Explicit Expiration

- Expiration MUST be explicit and deterministic.
- Expired proposals MUST transition to the Expired lifecycle state.
- Expiration MUST NOT be reversible without creating a new proposal.
- Expiration MUST be logged with timestamp.

### 9.3 No Automatic Carry-Forward

- Proposals MUST NOT automatically carry forward beyond their validity period.
- Expired proposals MUST NOT be automatically renewed.
- Continuation of expired intent MUST require explicit human action to create a new proposal.

---

## 10. Assistant Interaction Constraints

### 10.1 Assistants MAY Assist in Drafting

Assistants MAY:

- Suggest proposal content for human review.
- Assist humans in editing draft proposals.
- Provide information relevant to proposal creation.
- Present draft options for human selection.

### 10.2 Assistants MUST NOT Persist Autonomously

Assistants MUST NOT:

- Persist proposals without explicit human authorisation.
- Save drafts without human action.
- Create persisted records autonomously.
- Establish proposal ownership on behalf of humans.

### 10.3 Assistants MUST NOT Revive Expired Proposals

Assistants MUST NOT:

- Automatically revive expired proposals.
- Suggest revival without explicit human request.
- Treat expired proposals as active candidates.
- Bypass expiration rules through suggestion or inference.

---

## 11. Audit and Evidence Expectations

### 11.1 Attribution

- Every proposal action MUST carry human attribution.
- Attribution MUST identify the specific human responsible.
- Attribution MUST NOT be inferred or defaulted.

### 11.2 Timestamps

- Every proposal state change MUST carry a timestamp.
- Timestamps MUST be system-generated and tamper-evident.
- Timestamp accuracy MUST be sufficient for audit purposes.

### 11.3 Version Linkage

- Every proposal version MUST link to its predecessor.
- Version chains MUST be complete and unbroken.
- Orphaned versions are prohibited.

### 11.4 Correlation Identifiers

- Proposals MUST carry correlation identifiers for audit tracing.
- Correlation identifiers MUST link related proposals and actions.
- Correlation MUST be sufficient to reconstruct proposal history.

---

## 12. Explicitly Blocked Behaviours

### 12.1 No Auto-Persistence

Proposals MUST NOT be automatically persisted based on:

- Session duration.
- Content completeness.
- Assistant recommendation.
- System rules or conditions.
- User inactivity.

### 12.2 No Execution Triggers

Persistence MUST NOT trigger:

- Execution of any kind.
- Pre-execution preparation.
- Resource allocation.
- External system notifications.
- Workflow initiation.

### 12.3 No Background Processing

Persisted proposals MUST NOT be subject to:

- Background validation.
- Asynchronous processing.
- Scheduled review.
- Automated state transitions.
- Silent enrichment or modification.

### 12.4 No Inferred Confirmation

Confirmation MUST NOT be inferred from:

- Persistence duration.
- Repeated access.
- User silence or inaction.
- Assistant interpretation.
- Pattern matching or behaviour analysis.

### 12.5 No Proposal Promotion

Proposals MUST NOT be automatically promoted to:

- Execution-ready status.
- Confirmed status.
- Priority queues.
- Pre-approved categories.
- Any status implying execution readiness.

---

## 13. Relationship to Future Phases

### 13.1 AC-03 Reference Only

Phase AC-03 MAY define proposal-to-execution bridging. Phase AC-03 is referenced for context only and is not authorised by this document.

### 13.2 Execution Requires Future Governance

Execution capability requires:

- Completion of execution governance framework.
- Explicit execution enablement authorisation.
- Documented readiness evidence.
- Human approval at appropriate authority levels.

This document does NOT satisfy any execution governance requirement.

---

## 14. Closing Governance Statement

This document authorizes NOTHING operational.

- No execution is enabled.
- No operational persistence is enabled.
- No side effects are permitted.
- No autonomous actions are authorised.
- No execution readiness is conferred by persistence.

This document defines how proposals MAY be stored, versioned, and governed. It does NOT authorise the fulfilment of stored intent.

**EXECUTION REMAINS BLOCKED** pending future governance phases and explicit enablement authorisation.

---

*End of Document*
