# Phase W-04: Scheduling and Orders Execution Design

## 1. Status and Scope

| Attribute            | Value                                      |
|----------------------|--------------------------------------------|
| Document Status      | DESIGN-ONLY                                |
| Execution Status     | BLOCKED                                    |
| Scope                | Scheduling & Orders Domain                 |
| Classification       | Governance                                 |
| Compliance Level     | Mandatory                                  |

This document defines the executable design for the Scheduling & Orders domain. No execution authority is granted by this document. All execution remains explicitly blocked until separate authorisation is issued through the established governance process.

The scope of this document is strictly limited to the Scheduling & Orders domain. No other domains, systems, or capabilities are addressed or authorised herein.

---

## 2. Purpose of This Document

This document establishes the executable design that would govern the Scheduling & Orders domain if execution were later authorised. It defines:

- The conceptual actions that would become executable
- The state models governing scheduling records and order records
- The distinction between intent, proposal, confirmation, and execution
- The human authority requirements for all operations
- The data mutation constraints
- The evidence and audit requirements
- The failure and rollback semantics
- The assistant participation constraints

This document does not authorise execution. It provides a complete, auditable design such that when authorisation is granted, execution may proceed with deterministic, governed behaviour.

Scheduling and orders represent high-risk domains where the boundary between intent and action must be rigorously maintained. The consequences of uncontrolled scheduling or order execution include patient safety risks, operational integrity failures, and regulatory non-compliance. This document treats the Scheduling & Orders domain with the strict human control requirements that such risks demand.

This document assumes that the Identity & Consent domain (W-03) would be executable first. Scheduling & Orders execution depends on verified identity and active consent as foundational prerequisites.

---

## 3. Binding Authorities and Dependencies

This document is bound by and must be interpreted in conformance with the following authorities:

| Document | Location | Relationship |
|----------|----------|--------------|
| Architecture Baseline Declaration | `architecture-baseline-declaration.md` | Establishes the foundational governance model and architectural invariants |
| Execution Architecture Plan | `execution-architecture-plan.md` | Defines the phased approach to execution enablement and the Read/Propose/Commit/Execute model |
| Phase W-01: Execution Readiness Entry Criteria | `phase-w-01-execution-readiness-entry-criteria.md` | Specifies the entry criteria that must be satisfied before any execution proceeds |
| Phase W-02: First Executable Domain Selection | `phase-w-02-first-executable-domain-selection.md` | Documents the selection of Identity & Consent as the first executable domain; Scheduling is explicitly non-selected |
| Phase W-03: Identity and Consent Execution Design | `phase-w-03-identity-and-consent-execution-design.md` | Defines the execution design for the prerequisite Identity & Consent domain |
| Integration Slice 05: Scheduling, Orders, and Execution Readiness | `integration-slice-05-scheduling-orders-and-execution-readiness.md` | Provides the domain-specific integration requirements, boundaries, and prohibitions |

No provision in this document may contradict or supersede the authorities listed above. In case of ambiguity, the binding authorities take precedence.

### 3.1 Dependency on Identity & Consent

This document has an explicit dependency on the Identity & Consent domain as defined in Phase W-03. The Scheduling & Orders domain cannot be executable unless Identity & Consent is executable first. All scheduling and order actions require:

- Verified identity of all participants
- Active consent grants within scope
- Authenticated sessions with valid authorisation

No scheduling or order action may proceed without satisfaction of Identity & Consent prerequisites.

---

## 4. Domain Definition: Scheduling & Orders

The Scheduling & Orders domain governs the following record types and their associated lifecycles.

### 4.1 Scheduling Records

Scheduling records represent time-bounded allocations of resources, including appointments, availability blocks, and capacity reservations. Scheduling records progress through defined states from initial request through confirmation.

#### Scheduling Intent

A scheduling intent is an expressed desire to allocate a time slot. Intents are not binding and do not reserve resources. Intents may be expressed through various surfaces (Website Builder, Patient Portal, Provider Portal) and may be discarded without consequence.

#### Scheduling Proposal

A scheduling proposal is a formalised record of intent that has been submitted for review. Proposals are governed artefacts subject to:

- Attribution to the submitting party and originating surface
- Review by authorised personnel
- Acceptance, modification, or rejection through governed workflow
- Audit logging of all state changes

Proposals do not reserve resources. Proposals have no operational effect until confirmed.

#### Scheduling Confirmation

A scheduling confirmation is a committed allocation of a time slot and associated resources. Confirmations are binding commitments that:

- Reserve the specified time slot
- Allocate the specified resources
- Are visible to all authorised participants
- Are attributable to the human who confirmed them
- Are subject to modification and cancellation through governed workflows

#### Scheduling Execution (Out of Scope)

Scheduling execution represents the actual delivery of the scheduled service. Execution is explicitly out of scope for this document. The boundary between confirmation and execution is blocked.

### 4.2 Order Records

Order records represent clinical or operational intent expressed by authorised personnel. Orders are records of requested actions that await downstream processes.

#### Order Intent

An order intent is an expressed clinical or operational need. Intents are not formalised records and do not trigger downstream processes.

#### Order Proposal

An order proposal is a draft order record prepared for review. Order proposals may be created by authorised personnel or prepared by assistants for human review. Proposals are governed artefacts subject to:

- Attribution to the creating party
- Clear labelling if assistant-generated
- Review and confirmation by authorised personnel
- Modification or rejection through governed workflow

#### Order Confirmation

An order confirmation is a committed record of clinical or operational intent. Confirmed orders:

- Represent the recorded intent of the confirming clinician or authorised personnel
- Are attributable to the human who confirmed them
- Are subject to modification, cancellation, and revocation workflows
- Do not execute automatically upon confirmation

#### Order Execution (Out of Scope)

Order execution represents the fulfilment of the order (dispensing, transmission, allocation). Execution is explicitly out of scope for this document. Orders remain records of intent; they do not trigger execution.

### 4.3 Distinction: Intent, Proposal, Confirmation, Execution

| Stage | Definition | Binding Effect | Operational Effect |
|-------|------------|----------------|-------------------|
| Intent | Expressed desire or need | None | None |
| Proposal | Formalised record submitted for review | None | None |
| Confirmation | Committed record approved by authorised human | Binding commitment (for schedules) or record of intent (for orders) | None (execution blocked) |
| Execution | Actual delivery or fulfilment | Operational effect | Out of scope |

The distinction between these stages is fundamental. Each transition requires explicit human action. No stage implies or triggers the subsequent stage automatically.

---

## 5. Executable Actions (Conceptual)

The following actions are defined at the conceptual level. These actions are NOT ENABLED. They represent the complete set of operations that would become executable upon authorisation.

### 5.1 Appointment Proposal

The action of creating a formalised scheduling proposal for review. This action would:

- Accept scheduling parameters (time, participants, resources, purpose)
- Create a proposal record attributed to the submitting party
- Place the proposal in pending review state
- Log the creation action with full attribution and timestamp

**Status: NOT ENABLED**

### 5.2 Appointment Confirmation

The action of confirming a scheduling proposal, creating a binding time allocation. This action would:

- Validate that the confirming human has authorisation to confirm
- Verify availability of the requested time slot and resources
- Create a confirmed schedule record attributed to the confirming human
- Reserve the specified time slot and resources
- Notify relevant participants through governed notification workflows
- Log the confirmation action with full attribution and timestamp

**Status: NOT ENABLED**

### 5.3 Appointment Modification

The action of modifying a confirmed schedule through governed workflow. This action would:

- Validate that the modifying human has authorisation to modify
- Preserve the prior state in the audit trail
- Apply the requested modifications to the schedule record
- Notify affected participants through governed notification workflows
- Log the modification action with full attribution and timestamp

**Status: NOT ENABLED**

### 5.4 Appointment Cancellation

The action of cancelling a confirmed schedule through governed workflow. This action would:

- Validate that the cancelling human has authorisation to cancel
- Preserve the complete schedule record in the audit trail
- Transition the schedule to cancelled state
- Release reserved time slots and resources
- Notify affected participants through governed notification workflows
- Log the cancellation action with full attribution and timestamp

**Status: NOT ENABLED**

### 5.5 Order Creation (Conceptual)

The action of creating an order record as a record of clinical or operational intent. This action would:

- Validate that the creating human has clinical authorisation to create the order type
- Accept order parameters (type, content, subject, urgency)
- Create an order record attributed to the creating clinician
- Place the order in pending confirmation or confirmed state based on workflow
- Log the creation action with full attribution and timestamp

**Status: NOT ENABLED**

### 5.6 Order Revocation

The action of revoking a previously created or confirmed order. This action would:

- Validate that the revoking human has authorisation to revoke
- Preserve the complete order record in the audit trail
- Transition the order to revoked state
- Prevent any downstream action based on the revoked order
- Log the revocation action with full attribution and timestamp

**Status: NOT ENABLED**

---

## 6. State Models (Design-Level)

### 6.1 Scheduling Record States

| State | Description |
|-------|-------------|
| `INTENT` | Scheduling desire expressed but not formalised |
| `PROPOSAL_PENDING` | Formal proposal submitted, awaiting review |
| `PROPOSAL_MODIFIED` | Proposal modified during review process |
| `PROPOSAL_REJECTED` | Proposal rejected by reviewing authority |
| `PROPOSAL_WITHDRAWN` | Proposal withdrawn by submitting party |
| `CONFIRMED` | Schedule confirmed by authorised human |
| `CONFIRMED_MODIFIED` | Confirmed schedule modified through governed workflow |
| `CANCELLED` | Confirmed schedule cancelled through governed workflow |
| `COMPLETED` | Schedule time has passed; record retained for audit |

### 6.2 Allowed Scheduling State Transitions

| From State | To State | Trigger | Authority Required |
|------------|----------|---------|-------------------|
| `INTENT` | `PROPOSAL_PENDING` | Formal submission | Submitting party |
| `PROPOSAL_PENDING` | `PROPOSAL_MODIFIED` | Modification during review | Reviewing authority |
| `PROPOSAL_PENDING` | `PROPOSAL_REJECTED` | Rejection decision | Reviewing authority |
| `PROPOSAL_PENDING` | `PROPOSAL_WITHDRAWN` | Withdrawal request | Submitting party |
| `PROPOSAL_PENDING` | `CONFIRMED` | Confirmation decision | Confirming authority |
| `PROPOSAL_MODIFIED` | `PROPOSAL_REJECTED` | Rejection decision | Reviewing authority |
| `PROPOSAL_MODIFIED` | `PROPOSAL_WITHDRAWN` | Withdrawal request | Submitting party |
| `PROPOSAL_MODIFIED` | `CONFIRMED` | Confirmation decision | Confirming authority |
| `CONFIRMED` | `CONFIRMED_MODIFIED` | Modification request | Authorised modifier |
| `CONFIRMED` | `CANCELLED` | Cancellation request | Authorised canceller |
| `CONFIRMED` | `COMPLETED` | Time passage (record-keeping only) | System (audit only) |
| `CONFIRMED_MODIFIED` | `CANCELLED` | Cancellation request | Authorised canceller |
| `CONFIRMED_MODIFIED` | `COMPLETED` | Time passage (record-keeping only) | System (audit only) |

### 6.3 Explicitly Blocked Scheduling State Transitions

The following transitions are explicitly blocked:

- Any transition from terminal states (`PROPOSAL_REJECTED`, `PROPOSAL_WITHDRAWN`, `CANCELLED`, `COMPLETED`) to any other state
- Any automatic transition without human action (except `COMPLETED` which is a record-keeping state, not an execution state)
- Any transition that skips the `PROPOSAL_*` states for new scheduling requests
- Any transition from `CONFIRMED` to `EXECUTED` (execution is blocked)
- Any transition triggered by time delay, timeout, or scheduled automation
- Any transition triggered by assistant action
- Any bulk transition affecting multiple scheduling records

### 6.4 Order Record States

| State | Description |
|-------|-------------|
| `DRAFT` | Order content prepared, not yet submitted |
| `PENDING_CONFIRMATION` | Order submitted, awaiting clinical confirmation |
| `CONFIRMED` | Order confirmed by authorised clinician |
| `MODIFIED` | Confirmed order modified through governed workflow |
| `REVOKED` | Order revoked by authorised clinician |
| `SUPERSEDED` | Order replaced by a newer order |

### 6.5 Allowed Order State Transitions

| From State | To State | Trigger | Authority Required |
|------------|----------|---------|-------------------|
| `DRAFT` | `PENDING_CONFIRMATION` | Submission for review | Creating clinician or reviewer |
| `DRAFT` | `CONFIRMED` | Direct confirmation (where policy permits) | Authorised clinician |
| `PENDING_CONFIRMATION` | `CONFIRMED` | Confirmation decision | Authorised clinician |
| `PENDING_CONFIRMATION` | `REVOKED` | Revocation decision | Authorised clinician |
| `CONFIRMED` | `MODIFIED` | Modification request | Authorised clinician |
| `CONFIRMED` | `REVOKED` | Revocation decision | Authorised clinician |
| `CONFIRMED` | `SUPERSEDED` | Replacement order confirmed | Authorised clinician |
| `MODIFIED` | `REVOKED` | Revocation decision | Authorised clinician |
| `MODIFIED` | `SUPERSEDED` | Replacement order confirmed | Authorised clinician |

### 6.6 Explicitly Blocked Order State Transitions

The following transitions are explicitly blocked:

- Any transition from terminal states (`REVOKED`, `SUPERSEDED`) to any non-terminal state
- Any automatic transition without human action
- Any transition from `CONFIRMED` or `MODIFIED` to `EXECUTED` (execution is blocked)
- Any transition triggered by time delay, timeout, or scheduled automation
- Any transition triggered by assistant action
- Any bulk transition affecting multiple order records
- Any transition that bypasses the required clinical authority

---

## 7. Human Authority and Control Points

### 7.1 Required Human Roles

| Role | Authority | Domain |
|------|-----------|--------|
| **Patient** | May submit scheduling requests; may withdraw own proposals; may request cancellation per policy | Own scheduling records |
| **Provider** | May review, modify, confirm, or reject scheduling proposals; may create, confirm, modify, or revoke orders | Patients under their care |
| **Staff** | May review and confirm scheduling proposals per policy; may not create or modify clinical orders | Administrative scheduling |
| **Operator** | May view scheduling and order status; may confirm non-clinical scheduling per policy | Operational oversight |
| **Auditor** | May review all scheduling and order records and audit trails | All records (read-only) |

### 7.2 Control Point Requirements

Every executable action requires human authority at defined control points:

| Action | Initiation | Confirmation | Audit |
|--------|------------|--------------|-------|
| Appointment Proposal | Human | N/A (proposal) | Human |
| Appointment Confirmation | Human (reviewer) | Human (confirmer) | Human |
| Appointment Modification | Human | Human | Human |
| Appointment Cancellation | Human | Human | Human |
| Order Creation | Human (clinician) | Human (clinician) | Human |
| Order Modification | Human (clinician) | Human (clinician) | Human |
| Order Revocation | Human (clinician) | Immediate | Human |

### 7.3 No Autonomous Authority

No action within the Scheduling & Orders domain may proceed without human initiation. No action may be confirmed without human confirmation where specified. No system component, process, or assistant may assume authority to act autonomously on scheduling or order matters.

The following are explicitly prohibited:

- System-initiated scheduling confirmations
- Assistant-initiated scheduling confirmations
- Time-triggered scheduling confirmations
- System-initiated order confirmations
- Assistant-initiated order confirmations
- Implied or inferred authority for any state-changing action

---

## 8. Data Mutation Rules

### 8.1 Mutable Data

The following data elements may be mutated through governed process:

- Scheduling proposal content (during review, before confirmation)
- Scheduling proposal state (per allowed transitions)
- Confirmed schedule attributes (through modification workflow)
- Confirmed schedule state (per allowed transitions)
- Order draft content (before confirmation)
- Order state (per allowed transitions)
- Order attributes (through modification workflow, before execution)

### 8.2 Immutable Data

The following data elements are immutable once created:

- Scheduling proposal submission record (who, when, what)
- Scheduling confirmation record (who, when, what was confirmed)
- Order confirmation record (who, when, what was confirmed)
- Audit trail entries
- Timestamp records
- Revocation records
- Cancellation records
- Evidence records for any state transition

### 8.3 Append-Only Data

The following data structures are append-only:

- Scheduling record history (all state transitions)
- Order record history (all state transitions)
- Modification history (all changes with attribution)
- Participant notification log
- Access log for scheduling and order records

### 8.4 Explicit Prohibition on Silent Mutation

No scheduling or order record may be mutated without:

- Full audit logging of the mutation
- Attribution to a specific human actor
- Timestamp from a trusted time source
- Preservation of prior state in the audit trail

Silent mutation—any change to a scheduling or order record without the above requirements—is prohibited.

---

## 9. Evidence and Audit Requirements

### 9.1 Required Evidence for Every Proposed Execution

Every proposed execution within the Scheduling & Orders domain must record:

| Evidence Element | Description |
|------------------|-------------|
| **Action Type** | The specific action being proposed |
| **Timestamp** | UTC timestamp of proposal |
| **Initiator Identity** | Verified identity of the initiating human |
| **Subject Record** | The scheduling or order record being acted upon |
| **Prior State** | Complete state before proposed action |
| **Proposed State** | Complete state after proposed action |
| **Participants** | All parties affected by the proposed action |
| **Resources** | All resources affected by the proposed action (for scheduling) |
| **Rationale** | Documented reason for the action |
| **Authority Reference** | Reference to authorising governance provision |
| **Consent Reference** | Reference to applicable consent grants (from W-03) |

### 9.2 Audit Trail Integrity Requirements

Audit trail entries must be:

- **Immutable**: Once written, audit entries may not be modified or deleted
- **Timestamped**: All entries must include a timestamp from a trusted time source
- **Attributable**: All entries must be attributable to specific human actors
- **Complete**: All state transitions must be logged without gaps
- **Retrievable**: Audit entries must be retrievable for governance review
- **Retained**: Audit entries must be retained per regulatory requirements

### 9.3 Correlation Requirements

All related actions must be correlatable through:

- Unique scheduling record identifiers
- Unique order record identifiers
- Correlation identifiers linking proposals to confirmations
- Correlation identifiers linking modifications to original records
- Correlation identifiers linking cancellations to original records
- Session identifiers linking actions to authenticated sessions

---

## 10. Failure, Rollback, and Halt Semantics

### 10.1 Deterministic Rollback

If any execution action fails to complete successfully:

- All partial mutations must be rolled back
- The prior state must be restored completely
- The failure must be recorded in the audit trail
- No partial or inconsistent state may persist
- The failure reason must be documented
- Affected parties must be notified through governed channels

Rollback must be deterministic. Given the same failure condition, rollback must produce the same result.

### 10.2 Kill-Switch Applicability

The system-wide kill-switch applies to the Scheduling & Orders domain:

- Activation of the kill-switch immediately halts all pending scheduling and order executions
- No new executions may be initiated while the kill-switch is active
- Active operations must complete or roll back within defined timeout
- Confirmed schedules and orders remain in their committed state (no execution occurs)
- Kill-switch activation must be recorded in the audit trail
- Kill-switch deactivation requires explicit governance authorisation

### 10.3 Immediate Halt Conditions

Execution must halt immediately upon:

- Kill-switch activation
- Detection of inconsistent state in scheduling or order records
- Failure of audit trail recording
- Loss of human confirmation channel
- Expiration of confirmation timeout
- Detection of identity or consent violations
- Detection of authorisation failures
- Detection of cross-patient data access attempts
- Detection of cross-tenant data access attempts

### 10.4 Recovery Requirements

Recovery from halt conditions requires:

- Resolution of the triggering condition
- Governance review of the halt event
- Explicit authorisation to resume
- Audit logging of the recovery decision

---

## 11. Assistant Participation Constraints

### 11.1 What the Assistant MAY Do

The assistant may support scheduling and order workflows through the following activities:

| Activity | Description | Constraints |
|----------|-------------|-------------|
| Draft Scheduling Proposals | Prepare draft scheduling requests for human review | Must be labelled as assistant-generated; requires human confirmation |
| Draft Order Content | Prepare draft order content for human review | Must be labelled as assistant-generated; requires human confirmation |
| Summarise Scheduling Status | Present summaries of scheduling proposals and confirmed appointments | Read-only; summaries do not modify records |
| Suggest Available Slots | Present available time slots based on published availability | Suggestions are informational only; human controls selection |
| Prepare Order Templates | Pre-populate order templates with relevant context | Human must review and confirm all content |
| Explain Implications | Explain the implications of proposed scheduling or order actions | Informational only; does not constitute recommendation |
| Surface Conflicts | Identify potential scheduling conflicts or order issues | Informational only; human makes final decision |
| Generate Draft Documentation | Prepare draft documentation related to scheduling or orders | Human must review and confirm all content |

### 11.2 What the Assistant MUST NOT Do

The following activities are explicitly prohibited for all assistant surfaces:

| Prohibited Activity | Rationale |
|---------------------|-----------|
| Confirm Scheduling Proposals | Confirmation requires human authority |
| Create Confirmed Appointments | Appointment confirmation requires human authorisation |
| Execute Orders | Order execution is out of scope and requires human authorisation |
| Modify Confirmed Schedules | Modification of confirmed schedules requires human authorisation |
| Cancel Appointments | Cancellation requires human confirmation |
| Modify Order Records | Order modification requires clinical authority |
| Revoke Orders | Order revocation requires clinical authority |
| Dispatch Notifications | All notifications require human confirmation |
| Trigger Execution Workflows | Execution is not authorised |
| Infer Scheduling Intent | Scheduling must be explicitly requested |
| Infer Order Intent | Orders must be explicitly created by clinicians |
| Bypass Human Review | All assistant-generated content must pass through human review |
| Assume Clinical Authority | Assistants hold no clinical authority |
| Make Clinical Recommendations | Clinical decisions require human clinicians |
| Bulk Process Records | Each record must be individually handled |

### 11.3 Attribution Requirements

All content generated or prepared by assistants must be:

- Clearly labelled as assistant-generated at the point of creation
- Traceable to the assistant interaction that created it
- Distinguishable from human-authored content in the audit trail
- Subject to human review before any operational effect
- Recorded with the identity of the human who requested assistant assistance

---

## 12. Explicitly Blocked Behaviours

The following behaviours are explicitly blocked within the Scheduling & Orders domain:

### 12.1 Autonomous Scheduling

No system, process, or assistant may confirm scheduling proposals without explicit human confirmation. This prohibition applies regardless of scheduling type, availability status, patient preference, provider preference, historical patterns, or workflow configuration.

### 12.2 Background Execution

No background process may execute scheduled actions or orders without user visibility and explicit authorisation. This prohibition includes scheduled batch processing, time-triggered execution, event-triggered execution, and queue-based automatic processing.

### 12.3 Implied Confirmation

No scheduling proposal or order may be confirmed based on the absence of rejection, timeout, inaction, or any condition other than explicit human confirmation.

### 12.4 Bulk Operations

Bulk confirmation, bulk cancellation, bulk modification, or any bulk operation affecting multiple scheduling or order records is prohibited. Each record requiring action must be individually reviewed and acted upon.

### 12.5 Time-Based Execution

No scheduled action or order may be executed based on the passage of time without explicit human authorisation at the time of execution. This prohibition includes scheduled automatic execution, deadline-triggered execution, and calendar-based automation.

### 12.6 Silent Rescheduling

No system, process, or assistant may reschedule confirmed appointments without explicit human confirmation and notification to all affected parties.

### 12.7 Assistant-Triggered Execution

Assistants must not trigger execution of any scheduled action or order. This prohibition is absolute and applies regardless of user request, perceived urgency, confidence level, or workflow context.

### 12.8 Inferred Authority

No system, process, or assistant may infer or assume authority to confirm schedules or execute orders. Authority must be explicitly granted and verified at the time of action.

### 12.9 Cross-Patient Operations

No scheduling or order action may affect records belonging to patients other than the explicitly identified subject. Cross-patient visibility and cross-patient modification are prohibited.

### 12.10 Automatic Order Fulfilment

No order may be automatically fulfilled, transmitted, or executed upon confirmation. Order confirmation creates a record of intent; fulfilment requires separate, explicitly authorised processes that are out of scope for this document.

---

## 13. Relationship to Future Implementation

This document defines design intent only. Implementation requires:

1. Separate implementation proposal documenting the proposed implementation approach
2. Review against this design specification to verify conformance
3. Review against all binding authorities to verify conformance
4. Explicit implementation authorisation through governance process
5. Conformance verification prior to deployment
6. Ongoing audit against design constraints during operation

No implementation may proceed based solely on this document. This document establishes what execution would look like; it does not authorise the creation of executable capability.

### 13.1 Prerequisites for Implementation Consideration

Before implementation may be considered:

- Phase W-01 entry criteria must be satisfied
- Phase W-03 (Identity & Consent) must be executable
- All binding authorities must be satisfied
- Governance authorisation must be granted
- Risk assessment must be completed and accepted
- Human authority structures must be in place and operational

### 13.2 Implementation Proposal Requirements

Any future implementation proposal must:

- Reference this document as the design authority
- Demonstrate conformance to all requirements herein
- Document any deviations and obtain governance approval for such deviations
- Include test plans that verify all human-in-the-loop requirements
- Include audit mechanisms that satisfy all evidence requirements
- Include kill-switch and rollback mechanisms

---

## 14. Closing Governance Statement

This document defines the executable design for the Scheduling & Orders domain. Execution is NOT authorised by this document.

All execution remains BLOCKED until:

- Explicit authorisation is issued through the established governance process
- Phase W-01 execution readiness entry criteria have been satisfied
- Phase W-03 (Identity & Consent) is executable
- Implementation has been reviewed for conformance with this design
- Human authority structures are in place and operational
- Kill-switch and rollback mechanisms are operational
- Audit mechanisms are operational

This document may be cited as the design authority for future implementation proposals. It may not be cited as authorisation for execution.

The Scheduling & Orders domain represents high-risk functionality where failures may impact patient safety, operational integrity, and regulatory compliance. This document requires strict human control at every state-changing action. No autonomous, automatic, or assistant-triggered execution is permitted under any circumstance.

**Execution Status: BLOCKED**

---

*End of Phase W-04: Scheduling and Orders Execution Design*
