# Integration Slice 05: Scheduling, Orders, and Execution Readiness

**Boundaries, Responsibilities, and Readiness Constraints for Scheduling Proposals and Order Records**

---

## 1. Status and Scope

| Field | Value |
|-------|-------|
| Status | Draft |
| Slice Identifier | IS-05 |
| Classification | Design and Integration Artifact |
| Execution | NOT Enabled |

This document is a design and integration artifact only. It defines boundaries, responsibilities, and readiness constraints for scheduling and order domains within the Zenthea platform.

Execution is not enabled by this document. No runtime behaviour, system configuration, or operational change is authorised by its contents. This slice establishes boundaries and constraints; it does not grant authority for implementation, deployment, or any form of automatic execution.

This document explicitly blocks execution. Any transition from proposal to execution requires separate authorisation through documented governance processes outside the scope of this slice.

---

## 2. Purpose of This Integration Slice

Scheduling and orders represent domains where the boundary between intent and action must be rigorously maintained. Without clearly defined boundaries between proposals, confirmed schedules, and executable actions, the platform cannot ensure:

- Patient safety through controlled scheduling workflows
- Operational integrity through governed order management
- Regulatory compliance through auditable proposal-to-confirmation pathways
- Accountability through clear attribution of all scheduling and order decisions

This slice exists to:

- Define the scheduling and order domains within the platform and their distinct responsibilities
- Establish clear boundaries between scheduling proposals, confirmed schedules, and executable actions
- Ensure that all scheduling proposals remain records of intent without operational effect until explicitly confirmed by authorised humans
- Ensure that all orders remain records of requested actions without execution until explicitly confirmed by authorised humans
- Document human-in-the-loop requirements for any transition that moves a proposal toward confirmation or execution
- Provide an audit-ready reference for regulators, clinicians, and governance bodies
- Prevent implicit or accidental execution of scheduled actions or orders without human review

This slice does not prescribe how scheduling or orders shall be implemented. It prescribes what boundaries must hold, what behaviours are permitted, and what behaviours are prohibited.

Execution remains out of scope. This slice defines readiness constraints only.

---

## 3. Involved Product Surfaces

### 3.1 Patient Portal (Scheduling View)

The Patient Portal provides authenticated patients with visibility into their scheduling proposals and confirmed appointments.

**Constraints:**
- Patients may view their own scheduling proposals and confirmed appointments
- Patients may initiate scheduling requests that create proposals for review
- Patients may not confirm appointments without provider or staff review where policy requires
- Patients may not access scheduling information for other patients
- Patient-initiated scheduling requests result in proposals, not confirmed appointments

### 3.2 Provider Portal (Scheduling and Orders View)

The Provider Portal serves as the primary interface through which clinical providers review scheduling proposals, confirm appointments, and create orders.

**Constraints:**
- Providers may review scheduling proposals for patients under their care
- Providers may confirm or reject scheduling proposals within their authorised scope
- Providers may create orders as records of clinical intent
- All provider scheduling and order actions are subject to audit logging
- Providers may not execute orders; orders remain records of intent awaiting downstream processes
- Cross-patient scheduling modification is prohibited

### 3.3 Website Builder (Booking Entry Point)

The Website Builder provides the public-facing entry point for booking requests that generate scheduling proposals.

**Constraints:**
- Website Builder may accept booking requests from prospective patients
- Booking requests result in scheduling proposals, not confirmed appointments
- Website Builder may not confirm appointments or execute scheduling actions
- Website Builder may not access protected health information
- All booking requests are subject to downstream review and confirmation

### 3.4 Assistant Surfaces (Proposal Preparation View)

Assistant surfaces may support scheduling and order workflows through proposal preparation capabilities.

**Constraints:**
- Assistants may prepare draft scheduling proposals for human review
- Assistants may prepare draft order requests for human review
- Assistants must not confirm scheduling proposals under any circumstance
- Assistants must not execute orders under any circumstance
- Assistants must not modify confirmed schedules or committed orders
- All assistant-generated proposals must be clearly labelled as assistant-generated
- Assistant access to patient data for proposal preparation is subject to all consent and access boundaries defined in Integration Slice 02

### 3.5 Operator and Administrative Surfaces

Administrative surfaces provide operational oversight of scheduling and order workflows.

**Constraints:**
- Operators may view scheduling and order status for operational purposes
- Operators may not confirm clinical scheduling proposals or orders without appropriate clinical authority
- Administrative confirmation of non-clinical scheduling may be permitted within defined policy boundaries
- All operator actions are subject to audit logging

---

## 4. Scheduling and Order Domains

The platform recognises scheduling and orders as distinct but related domains, each with specific boundaries and constraints.

### 4.1 Scheduling Domain

The scheduling domain encompasses all activities related to the allocation of time-bounded resources, including appointments, availability, and capacity management.

**Characteristics:**
- Scheduling concerns the coordination of time, participants, and resources
- Scheduling proposals represent intent to allocate a time slot
- Confirmed schedules represent committed allocation of time slots
- Scheduling does not imply execution of any clinical or operational action

**Boundaries:**
- Scheduling proposals are records of intent, not commitments
- Confirmed schedules are commitments of time allocation, not execution of services
- The act of confirming a schedule does not trigger any automatic execution

### 4.2 Order Domain

The order domain encompasses all activities related to the creation and management of clinical or operational orders, including referrals, prescriptions, and service requests.

**Characteristics:**
- Orders represent recorded clinical or operational intent
- Orders are created by authorised personnel as records of requested actions
- Orders do not execute themselves; they await downstream processes
- Order status represents the state of the order record, not the state of execution

**Boundaries:**
- Orders are records of intent, not execution triggers
- Order creation does not imply automatic fulfilment
- Order confirmation does not authorise automatic execution

### 4.3 Separation of Concerns

Scheduling and orders are related but distinct:

- A scheduling proposal may reference an order, but confirming the schedule does not execute the order
- An order may reference a scheduled appointment, but creating the order does not confirm the schedule
- Neither domain has authority over the other
- Both domains remain records of intent until separate execution processes are authorised

---

## 5. Scheduling Proposal Lifecycle (Conceptual)

Scheduling within the platform follows a controlled lifecycle that distinguishes between proposal, confirmation, and execution states.

### 5.1 Proposal State

A scheduling proposal is a record of intent to schedule that has not been confirmed. Proposals have the following properties:

- **No Commitment**: Proposals do not reserve resources or create binding commitments
- **Mutable**: Proposals may be modified, withdrawn, or revised without affecting confirmed schedules
- **Pending Review**: Proposals await human review and confirmation
- **Attributable**: Proposals are attributed to the requester and the system or surface that created them
- **No Operational Effect**: Proposals have no effect on resource allocation until confirmed

### 5.2 Confirmed State

A confirmed schedule represents a committed allocation of time and resources. Confirmed schedules have the following properties:

- **Commitment**: Confirmed schedules represent binding allocation of time slots and resources
- **Subject to Modification Policy**: Confirmed schedules may be modified or cancelled through governed workflows
- **Visible to Participants**: Confirmed schedules are visible to all authorised participants
- **Attributable**: Confirmed schedules are attributed to the human who confirmed them
- **Audit Logged**: Confirmation actions are recorded with full attribution and timestamp

### 5.3 Execution State (Out of Scope)

Execution represents the actual delivery of the scheduled service or action. Execution is explicitly out of scope for this integration slice.

- **Not Authorised**: This slice does not authorise execution of any scheduled action
- **Separate Governance**: Execution requires separate authorisation and governance
- **No Automatic Transition**: Confirmed schedules do not automatically transition to execution
- **Human Control Required**: Any transition toward execution requires explicit human authorisation

### 5.4 Transition from Proposal to Confirmed

The transition from proposal to confirmed state requires:

- Explicit human confirmation by an authorised individual
- Verification that the confirming individual has authority to confirm the scheduling proposal
- Audit logging of the confirmation action including identity, timestamp, and proposal reference
- No system, process, or assistant may execute this transition autonomously

### 5.5 Transition from Confirmed to Execution (Blocked)

The transition from confirmed schedule to execution is not authorised by this slice:

- This slice does not enable execution
- Execution requires separate governance and authorisation
- No automatic, time-based, or assistant-triggered execution is permitted
- This constraint is non-negotiable within the scope of this slice

---

## 6. Orders vs Executable Actions Boundary

This section defines the critical boundary between orders (records of intent) and executable actions (operational effects).

### 6.1 Orders as Records of Intent

Orders within this slice are defined as records of clinical or operational intent. Orders include:

- Clinical orders (referrals, prescriptions, diagnostic requests)
- Service orders (procedure requests, consultation requests)
- Administrative orders (resource allocation requests, workflow triggers)

**Properties of Orders:**
- Represent recorded intent by authorised personnel
- Do not execute automatically upon creation or confirmation
- Remain in record state awaiting downstream processes
- Are subject to review, modification, and cancellation workflows
- Are fully auditable with attribution and timestamp

### 6.2 Executable Actions (Out of Scope)

Executable actions are operational effects that result from order fulfilment. Executable actions are explicitly out of scope for this integration slice.

**Examples of Executable Actions (Not Authorised):**
- Automatic prescription dispensing
- Automatic referral transmission
- Automatic appointment booking with external systems
- Automatic resource allocation
- Automatic notification dispatch
- Automatic workflow triggering

### 6.3 Boundary Enforcement

The boundary between orders and executable actions must be enforced:

- No order may trigger automatic execution
- No system, process, or assistant may execute orders without explicit human authorisation
- Order confirmation does not imply execution authorisation
- Execution requires separate governance outside the scope of this slice

### 6.4 Order State Does Not Imply Execution State

Order status represents the state of the order record, not the state of execution:

- A "confirmed" order is a confirmed record of intent, not a completed action
- A "pending" order is awaiting confirmation, not awaiting execution
- Order status changes do not trigger execution workflows within this slice

---

## 7. Assistant Participation Constraints

This section defines what assistant surfaces may and may not do within scheduling and order workflows.

### 7.1 What Assistants May Do

Assistants may support scheduling and order workflows through the following activities:

| Activity | Description | Constraints |
|----------|-------------|-------------|
| Draft Scheduling Proposals | Prepare draft scheduling requests for human review | Must be labelled as assistant-generated; requires human confirmation |
| Draft Order Requests | Prepare draft order content for human review | Must be labelled as assistant-generated; requires human confirmation |
| Summarise Scheduling Status | Present summaries of scheduling proposals and confirmed appointments | Read-only; summaries do not modify records |
| Suggest Available Slots | Present available time slots based on published availability | Suggestions are informational only; human controls selection |
| Prepare Order Templates | Pre-populate order templates with relevant context | Human must review and confirm all content |

### 7.2 What Assistants Must Never Do

The following activities are explicitly prohibited for all assistant surfaces:

| Prohibited Activity | Rationale |
|---------------------|-----------|
| Confirm Scheduling Proposals | Confirmation is a state-changing action requiring human authority |
| Create Confirmed Appointments | Appointment confirmation requires human authorisation |
| Execute Orders | Order execution is out of scope and requires human authorisation |
| Modify Confirmed Schedules | Modification of confirmed schedules requires human authorisation |
| Cancel Appointments | Cancellation is a state-changing action requiring human confirmation |
| Dispatch Order-Related Communications | All dispatches require human confirmation |
| Auto-populate and Confirm | No "draft and confirm" automation is permitted |
| Bypass Human Review | All assistant-generated content must pass through human review |
| Trigger Execution Workflows | Execution is not authorised; assistants must not trigger execution |
| Infer Scheduling Intent | Scheduling must be explicitly requested; assistants must not infer |

### 7.3 Assistant Attribution Requirements

All content generated or prepared by assistants must be:

- Clearly labelled as assistant-generated at the point of creation
- Traceable to the assistant interaction that created it
- Distinguishable from human-authored content in the audit trail
- Subject to human review before any operational effect

---

## 8. Data Access and Mutation Rules

This section defines what operations are permitted on scheduling and order data.

### 8.1 Read Access

| Data Category | Patient | Provider | Assistant | System |
|---------------|---------|----------|-----------|--------|
| Scheduling Proposals (Own) | Read | Read (authorised) | Read (scoped) | Read (audit) |
| Confirmed Schedules (Own) | Read | Read (authorised) | Read (scoped) | Read (audit) |
| Provider Availability (Public) | Read | Read | Read (scoped) | Read |
| Orders (Own Care Context) | Limited | Read (authorised) | Read (scoped) | Read (audit) |
| Order Status | Limited | Read (authorised) | Read (scoped) | Read (audit) |

### 8.2 Write Access

| Data Category | Patient | Provider | Assistant | Operator | System |
|---------------|---------|----------|-----------|----------|--------|
| Scheduling Proposals | Create (request) | Create, Confirm | Draft Only | Confirm (policy-defined) | None |
| Confirmed Schedules | None | Confirm, Modify | None | Modify (policy-defined) | None |
| Orders | None | Create, Confirm | Draft Only | None | None |
| Order Status | None | Update | None | None | None |

### 8.3 Mutation Constraints

The following mutation constraints apply without exception:

- **No Silent Mutation**: All writes must be logged with full attribution
- **No Autonomous Mutation**: All state-changing writes require human confirmation
- **No Cross-Patient Mutation**: No user may modify another patient's scheduling or orders
- **No Automatic Confirmation**: Proposals do not auto-confirm under any circumstance
- **No Automatic Execution**: Orders and schedules do not auto-execute under any circumstance
- **No Assistant Mutation**: Assistants may create drafts only; assistants may not execute writes
- **No Time-Based Mutation**: Passage of time does not trigger state changes

---

## 9. Human-in-the-Loop Requirements

The following actions require explicit human confirmation and must not be performed autonomously by any system, process, or assistant.

### 9.1 Mandatory Human Confirmation

| Action | Human Confirmation Required | Confirming Role |
|--------|----------------------------|-----------------|
| Confirm scheduling proposal | Yes | Provider, Staff, or Patient (per policy) |
| Modify confirmed schedule | Yes | Provider or authorised Staff |
| Cancel confirmed appointment | Yes | Provider, Staff, or Patient (per policy) |
| Create clinical order | Yes | Authorised Clinician |
| Confirm order | Yes | Authorised Clinician |
| Modify order | Yes | Authorised Clinician |
| Cancel order | Yes | Authorised Clinician |
| Transition toward execution | Yes | Authorised personnel (separate governance) |

### 9.2 Confirmation Requirements

Human confirmation must be:

- **Explicit**: Requires affirmative action; silence or timeout does not constitute confirmation
- **Specific**: Confirmation applies to a specific scheduling proposal or order
- **Informed**: The human must have opportunity to review the content before confirmation
- **Logged**: The confirmation action must be recorded in the audit trail with timestamp and identity
- **Separate**: The confirmation step must be distinct from the drafting or preparation step
- **Non-Delegable to Systems**: Confirmation authority cannot be delegated to automated systems

### 9.3 No Bulk Confirmation

Bulk confirmation of multiple scheduling proposals or orders is prohibited. Each item requiring confirmation must be individually reviewed and confirmed.

### 9.4 No Time-Based Confirmation

Confirmation may not be triggered by time delay or schedule. Proposals do not automatically become confirmed after any period of time.

### 9.5 No Conditional Confirmation

Confirmation may not be conditional on external events, system states, or automated triggers. All confirmation requires contemporaneous human action.

---

## 10. Prohibited Behaviours

The following behaviours are explicitly prohibited within all scheduling and order workflows.

### 10.1 Autonomous Scheduling Confirmation

No system, process, or assistant may confirm scheduling proposals without explicit human confirmation. This prohibition applies regardless of:

- Scheduling type or category
- Availability status
- Patient or provider preference
- Historical patterns
- Workflow configuration

### 10.2 Autonomous Order Execution

No system, process, or assistant may execute orders without explicit human authorisation. This prohibition applies regardless of:

- Order type or category
- Clinical urgency
- Confidence level of AI-generated content
- Workflow configuration
- Time elapsed since order creation

### 10.3 Background Execution

No background process may execute scheduled actions or orders without user visibility and explicit authorisation. This prohibition includes:

- Scheduled batch processing
- Time-triggered execution
- Event-triggered execution
- Queue-based automatic processing

### 10.4 Auto-Confirmation

No scheduling proposal or order may be automatically confirmed based on:

- Time elapsed since creation
- Absence of rejection
- System default settings
- Patient or provider inaction
- External system triggers

### 10.5 Silent Scheduling

No system, process, or assistant may create confirmed appointments or execute orders without user visibility. All scheduling and order actions must be:

- Visible to affected parties
- Logged in the audit trail
- Subject to review

### 10.6 Assistant-Triggered Execution

Assistants must not trigger execution of any scheduled action or order. This prohibition is absolute and applies regardless of:

- User request
- Perceived urgency
- Confidence level
- Workflow context

### 10.7 Time-Based Execution

No scheduled action or order may be executed based on the passage of time without explicit human authorisation at the time of execution. This prohibition includes:

- Scheduled automatic execution
- Deadline-triggered execution
- Calendar-based automation

### 10.8 Implied Authority

No system, process, or assistant may infer or assume authority to confirm schedules or execute orders. Authority must be explicitly granted and verified at the time of action.

---

## 11. Relationship to Other Architecture Artifacts

This integration slice operates within the context of the broader platform architecture and depends on foundational definitions from other slices.

### 11.1 Referenced Artifacts

| Artifact | Location | Relationship |
|----------|----------|--------------|
| Platform Integration Map | `docs/00-overview/platform-integration-map.md` | Defines overall integration topology and principles governing all surfaces |
| Integration Slice 01: Booking to Care | `docs/01-architecture/integration-slice-01-booking-to-care.md` | Defines the patient journey and booking workflow context; this slice extends scheduling boundaries |
| Integration Slice 02: Identity and Consent | `docs/01-architecture/integration-slice-02-identity-and-consent.md` | Defines identity verification and consent model; this slice depends on IS-02 for all access decisions |
| Integration Slice 03: Assistant and AI Boundaries | `docs/01-architecture/integration-slice-03-assistant-and-ai-boundaries.md` | Defines assistant capabilities and prohibitions; this slice extends assistant constraints for scheduling and order contexts |
| Integration Slice 04: Messaging and Clinical Documentation | `docs/01-architecture/integration-slice-04-messaging-and-clinical-documentation.md` | Defines messaging and documentation boundaries; scheduling and order notifications are subject to IS-04 constraints |

### 11.2 Dependency on Identity and Consent

This slice depends on Integration Slice 02 (Identity and Consent). All scheduling and order access decisions must respect:

- Identity verification requirements for all participants
- Consent grant boundaries for patient data access
- Tenant isolation rules for provider and staff actions
- Cross-patient visibility prohibitions

No scheduling or order capability may be introduced that does not comply with the identity and consent boundaries defined in IS-02.

### 11.3 Extension of Booking Workflow

This slice extends Integration Slice 01 (Booking to Care) with additional constraints for scheduling proposals and order management. The booking workflow defined in IS-01 terminates at the creation of a scheduling proposal; this slice governs the proposal-to-confirmation boundary and explicitly blocks the confirmation-to-execution boundary.

### 11.4 Extension of Assistant Boundaries

This slice extends Integration Slice 03 (Assistant and AI Boundaries) with specific constraints for scheduling and order contexts. The prohibitions defined in IS-03 apply in full; this slice adds scheduling-specific and order-specific constraints that further restrict assistant behaviour within these domains.

### 11.5 Coordination with Messaging Boundaries

Notifications related to scheduling and orders are subject to the messaging constraints defined in Integration Slice 04 (Messaging and Clinical Documentation). No scheduling or order notification may bypass the human-in-the-loop requirements defined in IS-04.

### 11.6 Relationship Statement

This slice extends but does not modify other integration slices. All slices that involve scheduling or order management must respect the boundaries defined herein. This slice is a prerequisite for any scheduling or order implementation work.

---

## 12. Future Extension Points (Non-Binding)

The following extension points are identified for potential future consideration. These are non-binding observations and are explicitly out of scope for this slice. No implementation or deployment is authorised by their inclusion.

### 12.1 Execution Enablement (Requires Separate Governance)

Future phases may define execution capabilities for confirmed schedules and orders. Such capabilities would require:

- Separate governance documentation and approval
- Explicit authorisation outside the scope of this slice
- Preservation of all human-in-the-loop requirements defined herein
- Full audit logging of all execution actions
- Emergency halt and rollback capabilities

**Status:** Non-binding, out of scope, not authorised by this slice

### 12.2 Recurring Scheduling Proposals

Future capabilities may include recurring scheduling proposals for ongoing care patterns. Such capabilities would:

- Create individual proposals for each occurrence
- Require human confirmation for each occurrence (no bulk confirmation)
- Not enable automatic execution
- Be subject to full audit logging

**Status:** Non-binding, out of scope, not authorised

### 12.3 Order Templates and Protocols

Future capabilities may include order templates and clinical protocols that pre-populate order content. Such capabilities would:

- Require human review and confirmation for each order
- Not enable automatic order creation or execution
- Be subject to clinical governance review
- Maintain full attribution and audit trail

**Status:** Non-binding, out of scope, not authorised

### 12.4 External System Integration

Future capabilities may include integration with external scheduling or order systems. Such integrations would:

- Be subject to separate governance and compliance review
- Not relax any human-in-the-loop requirements
- Maintain full audit trail of all cross-system interactions
- Not enable automatic execution in either direction

**Status:** Non-binding, out of scope, not authorised

### 12.5 Extension Governance

Any future extension to scheduling or order capabilities must:

- Be documented in separate, versioned integration slices or amendments
- Undergo architecture and regulatory review before implementation
- Maintain all prohibitions and boundaries defined in this document
- Preserve human-in-the-loop requirements without exception
- Be subject to clinical governance review where applicable
- Explicitly document execution enablement criteria and controls

---

*End of Integration Slice 05*
