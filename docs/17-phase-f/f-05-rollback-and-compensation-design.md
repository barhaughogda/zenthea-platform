# F-05 — Rollback and Compensation Design

## 1. Document Intent and Constraints
This document is a design-only governance artifact and does not authorize or describe any technical implementation. It defines the principles of failure handling for the Zenthea Platform. It is strictly non-executing.
Governance dictates that a 'rollback' is not an 'undo' operation in a healthcare context, and 'compensation' is never equivalent to 'deletion'. Automated rollback of stateful clinical or administrative actions is strictly forbidden.

## 2. Context and Dependency Chain
This design builds upon the governance frameworks established in Phase E. It directly depends on the following Phase F governance designs:
- F-01: Scheduling and Execution Design
- F-02: Voice and Ambient Interaction Design
- F-03: Consent and Listening UX Design
- F-04: Audit and Evidence Model
Within the Zenthea Platform, any execution that reaches a state of external visibility or permanence is assumed to be irreversible by default.

## 3. Definitions
- **Rollback vs Compensation vs Correction**: 
    - **Rollback**: The cessation of an active execution and attempt to return to the last known-good state before the failure occurred, provided no external effects have been triggered.
    - **Compensation**: A new, secondary action initiated to mitigate or correct the effects of a previously completed or partially completed action that cannot be reverted.
    - **Correction**: An administrative or clinical adjustment to an existing record, which must be performed as an additive event rather than a modification of original data.
- **Irreversible vs Reversible Actions**:
    - **Reversible**: An internal state transition that has not yet been committed to an audit log or external system.
    - **Irreversible**: Any action that has produced evidence, notified a human, or updated a clinical record of truth.
- **Partial execution and split-brain states**: A failure condition where internal system state and external system reality (or audit logs) are in disagreement, often resulting from mid-execution interruptions.

## 4. Failure Classes
- **Pre-execution failure**: Failure occurring after authorization but before any state change or evidence generation.
- **Mid-execution failure**: Failure occurring during the transition of state, potentially leaving the system in an inconsistent or "partial" state.
- **Post-execution inconsistency**: Failure detected after completion, where the outcome does not match the intended governance or clinical requirement.
- **External system disagreement**: The platform indicates success, but a downstream system (e.g., EHR, Pharmacy) indicates failure or a different state.
- **Audit pipeline failure**: Failure to record the evidence of an action, rendering the action invalid despite its technical completion.

## 5. Authority Model
- **Request Authority**: Rollback or compensation may only be requested by the primary clinician involved in the session or a designated clinical administrator.
- **Approval Authority**: Approval for compensation must be granted by a separate Governance or Compliance officer, or an authorized clinical supervisor.
- **Prohibition of AI Authority**: AI agents are strictly prohibited from exercising authority over rollback or compensation. They may suggest failures but cannot authorize recovery actions.
- **Separation of Approval vs Execution Authority**: The entity (human) requesting a correction or compensation must be distinct from the entity approving the governing policy for that compensation, ensuring checks and balances in clinical safety.

## 6. Rollback Rules
- **When rollback is allowed**: Only during pre-execution phases or when it can be mathematically proven that no external state change has occurred.
- **When rollback is forbidden**: Strictly forbidden once evidence has been successfully committed to the primary audit log or an external system.
- **Compensation Requirement**: Failures occurring after external commitment must be handled through Compensation, never through Reversion, to maintain the integrity of the clinical timeline.
- **No Silent Rollback**: Every rollback event must be logged as a failure-to-execute event in the audit stream.

## 7. Compensation Model
In a healthcare context, compensation means performing a corrective action that is visible, audited, and referenced.
- **Examples**: Issuing a cancellation for a duplicate appointment, adding a corrective annotation to a clinical note, or initiating a follow-up clarification task for a patient.
- **Governed Action**: Compensation is treated as a new governed action, requiring its own evidence chain and authorization, and it must explicitly reference the original failed or incorrect execution.

## 8. Audit and Evidence Requirements
- **Evidence Generation**: Every rollback or compensation event must produce a unique evidence record in the primary audit stream.
- **Referential Integrity**: The new evidence must contain a cryptographic or logical reference to the original execution ID.
- **No Erasure or Mutation**: There shall be no erasure or mutation of prior records. The history of the failure and the history of the compensation must both persist in the immutable audit log.

## 9. Patient, Clinician, Provider Impact
- **Patient Transparency**: Patients must be notified if a failure in execution affects their care plan or data, with clear communication regarding the corrective/compensatory action taken.
- **Clinician Accountability**: The system must protect clinicians by ensuring all corrections are clearly labeled, preventing the appearance of retroactive tampering.
- **Provider Liability**: The platform maintains a fail-closed posture to minimize liability by ensuring no "ghost" actions exist without corresponding evidence.

## 10. Explicit Prohibitions
- **No automatic rollback**: Automated systems may never revert state without human oversight.
- **No retroactive correction without evidence**: All corrections must be additive.
- **No deletion of external system effects**: Actions taken in third-party systems must be countered with compensatory actions, not deleted.
- **No masking or hiding failures**: All execution failures must be exposed to the audit and governance layers.

## 11. Out of Scope
- Technical recovery mechanisms (e.g., database transactions, retry logic).
- User interface (UI) flows for clinicians to initiate compensation.
- Specific integration strategies with third-party EHRs or APIs.

## 12. Exit Criteria
Before any execution unblock related to rollback or compensation can be authorized for implementation, the following must be completed:
- Formal review and sign-off by the Security Architecture team.
- Clinical Safety review to ensure compensation models do not introduce patient harm.
- Legal and Regulatory review for compliance with HIPAA and state laws.
- Final Governance Board approval of the execution standards.

This document authorizes understanding and governance design only. It does not authorize implementation.
