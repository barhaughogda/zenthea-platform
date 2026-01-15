# Execution Architecture Plan

---

## Status and Scope

| Field | Value |
|-------|-------|
| Document Type | Execution Planning Artifact |
| Status | Draft |
| Execution | **NOT ENABLED** |
| Classification | Internal Architecture Governance |
| Version | 1.0 |
| Date | 2026-01-15 |

This document is an execution planning artifact only. It translates the frozen architecture baseline into an execution-ready architecture design. This document does not authorise runtime behaviour, deployment, or any form of execution. Execution remains blocked until separate governance artifacts explicitly authorise it.

---

## 1. Purpose of This Plan

The Architecture Baseline Declaration establishes what must hold. It defines boundaries, invariants, and constraints that govern all platform behaviour. With the baseline frozen, the platform requires a plan that translates those constraints into an execution-ready architecture without enabling execution itself.

This plan exists to bridge the gap between architecture definition and implementation readiness. It provides:

- A framework for designing interfaces, boundaries, and data ownership within baseline constraints
- A conceptual model for how execution will eventually be gated and controlled
- Guidance for sequencing work to maintain governance invariants throughout development
- Explicit documentation of what remains blocked and what separate authorisation is required

The baseline is binding. This plan is subordinate to the baseline. Nothing in this plan may contradict or override the Architecture Baseline Declaration or Integration Slices 01–05.

---

## 2. Inputs and Binding Authorities

The following documents govern this plan and are authoritative:

| Document | Location | Authority Level |
|----------|----------|-----------------|
| Architecture Baseline Declaration | `docs/01-architecture/architecture-baseline-declaration.md` | Binding (Frozen) |
| Integration Slice 01: Booking to Care | `docs/01-architecture/integration-slice-01-booking-to-care.md` | Binding |
| Integration Slice 02: Identity and Consent | `docs/01-architecture/integration-slice-02-identity-and-consent.md` | Binding |
| Integration Slice 03: Assistant and AI Boundaries | `docs/01-architecture/integration-slice-03-assistant-and-ai-boundaries.md` | Binding |
| Integration Slice 04: Messaging and Clinical Documentation | `docs/01-architecture/integration-slice-04-messaging-and-clinical-documentation.md` | Binding |
| Integration Slice 05: Scheduling, Orders, and Execution Readiness | `docs/01-architecture/integration-slice-05-scheduling-orders-and-execution-readiness.md` | Binding |
| Platform Integration Map | `docs/00-overview/platform-integration-map.md` | Orientation |
| Platform Status | `docs/00-overview/platform-status.md` | Status Reference |

This plan is subordinate to all binding documents. Where this plan provides additional detail or guidance, it extends but does not modify the binding authorities. Any apparent conflict must be resolved in favour of the binding documents.

---

## 3. Execution Posture and Non-Authorization Statement

Execution remains blocked. This plan does not authorise execution.

The following constraints are explicitly in effect:

- **No runtime behaviour is authorised.** No system component may perform state-changing actions in production.
- **No autonomous execution is permitted.** No system, process, or assistant may execute actions without explicit human confirmation.
- **No time-based execution is permitted.** No scheduled automation, deadline-triggered actions, or calendar-based execution may occur.
- **No background automation is permitted.** All actions must be visible to users and subject to explicit confirmation.

Any enablement of execution requires separate governance artifacts that explicitly authorise the transition from planning to operational state. Such artifacts must:

- Define specific execution capabilities being enabled
- Document controls, gates, and human-in-the-loop requirements
- Undergo architecture and governance review
- Be approved through documented governance processes

This plan enables planning only. It does not enable action.

---

## 4. Target Operating Model for "Execution Planning"

This section defines the scope of permitted activities during the execution planning phase.

### What Is Permitted Now

The following activities are permitted under this plan:

| Activity | Description | Constraints |
|----------|-------------|-------------|
| Interface Design | Defining API contracts, data schemas, and service boundaries | Must align with slice-defined boundaries |
| Boundary Definition | Establishing clear ownership and responsibility boundaries between surfaces and services | Must respect baseline invariants |
| Data Ownership Mapping | Documenting which service or surface owns which data and under what conditions | Must align with slice-defined ownership |
| Permission Models | Designing role-based access control, consent enforcement, and authorisation flows | Must enforce baseline access rules |
| Observability Design | Planning audit logging, tracing, and evidence collection mechanisms | Must support baseline auditability requirements |

### What Is Not Permitted Now

The following activities remain blocked:

| Blocked Activity | Rationale |
|------------------|-----------|
| Deploying execution features | Execution is not authorised |
| Enabling write paths without gating | All writes require human confirmation per baseline |
| Background automation | Silent or background actions are prohibited per baseline |
| Autonomous scheduling or order execution | Blocked per Integration Slice 05 |
| AI-driven decision execution | AI may propose but must not execute per Integration Slice 03 |
| Automatic message dispatch | Message delivery requires human confirmation per Integration Slice 04 |

---

## 5. Canonical Domains and Ownership (High Level)

The platform operates across the following canonical domains. Each domain has a designated surface that holds authoritative write access and lifecycle control.

| Domain | Authoritative Surface | Responsibility |
|--------|----------------------|----------------|
| Identity and Session | Identity Service | Manage identity verification, authentication state, and session lifecycle |
| Consent | Patient Portal (Patient-Controlled) | Manage explicit consent grants, revocations, and scope definitions |
| Patient Profile | Patient Portal (Patient-Controlled) | Manage patient demographic and profile information within patient control |
| Messaging | Patient Portal, Provider Portal | Manage message composition, delivery, and receipt within domain boundaries |
| Clinical Documentation (Draft) | Provider Portal | Manage draft clinical documents prior to commitment |
| Clinical Documentation (Committed) | Provider Portal (Clinician-Confirmed) | Manage committed clinical records with immutability and amendment workflows |
| Scheduling (Proposal) | Website Builder, Patient Portal, Provider Portal | Manage scheduling proposals as records of intent |
| Scheduling (Confirmed) | Provider Portal (Human-Confirmed) | Manage confirmed schedules as binding time allocations |
| Orders (Conceptual) | Provider Portal (Clinician-Created) | Manage clinical orders as records of intent awaiting execution enablement |
| Audit and Traceability | Platform | Maintain immutable audit records of all actions, access decisions, and state changes |
| Tenant Configuration and Branding | Admin Surfaces | Manage tenant-level configuration, branding, and policy settings |

Ownership implies:

- Authority for creating, updating, and retiring records within the domain
- Responsibility for enforcing domain invariants
- Accountability for audit and compliance within the domain
- Lifecycle control from creation through archival

Cross-domain access is permitted only through governed interfaces and within consent boundaries.

---

## 6. Read vs Propose vs Commit vs Execute Model

The platform distinguishes four levels of interaction with data and actions. This model governs all surfaces and systems.

| Level | Definition | Authorization |
|-------|------------|---------------|
| **Read** | Retrieve and view data within authorisation scope | Permitted per identity, consent, and role-based access policies |
| **Propose** | Create a draft or suggestion that has no operational effect | Permitted for humans and assistants within defined constraints |
| **Commit** | Confirm a proposal, making it part of the official record | Requires explicit human confirmation by authorised individual |
| **Execute** | Perform an action with external effect (delivery, fulfilment, transmission) | **Remains blocked** |

### Invariant: Proposals Never Imply Commitment

A proposal is a record of intent. It has no operational effect until explicitly confirmed by an authorised human. The existence of a proposal does not:

- Reserve resources
- Create binding commitments
- Trigger notifications
- Imply consent
- Authorise downstream actions

The boundary between Propose and Commit is a human confirmation gate. The boundary between Commit and Execute is a governance gate that remains closed.

---

## 7. Execution Gate Concept (Non-Implementing)

The execution gate is an architectural concept that defines where control must be enforced between confirmed intent and external side effects.

### Position in Architecture

The execution gate sits at the boundary between:

- Confirmed records (scheduling confirmations, committed orders, finalised messages)
- External side effects (delivery to recipients, transmission to external systems, resource allocation)

No confirmed record may produce an external side effect without passing through the execution gate.

### Verification Requirements

The execution gate must verify:

| Requirement | Description |
|-------------|-------------|
| Identity | The requesting user is authenticated and authorised |
| Consent | Applicable consent grants are active and in scope |
| Authorization | The action is within the user's permitted scope and role |
| Trace Context | A correlation ID and audit context are established for the action |

### Fail-Closed Behaviour

The execution gate must operate in fail-closed mode:

- If identity cannot be verified, deny execution
- If consent is absent or expired, deny execution
- If authorisation is insufficient, deny execution
- If trace context cannot be established, deny execution
- If any verification step fails, deny execution

No default-allow behaviour is permitted. Absence of explicit prohibition does not constitute permission.

### Non-Implementation Statement

This section defines the execution gate as an architectural concept. It does not specify technology, implementation approach, or operational configuration. Implementation details require separate technical design documentation.

---

## 8. Human-in-the-Loop Confirmation Surfaces

The following product surfaces are legitimate confirmation points where human users may confirm proposals and transition them to committed state.

| Surface | Confirmation Scope | Constraints |
|---------|-------------------|-------------|
| Patient Portal | Patient-controlled confirmations (consent grants, profile updates, self-service scheduling per policy) | Patient identity must be verified; confirmations apply to patient's own data only |
| Provider Portal | Clinical confirmations (scheduling, documentation commitment, order creation) | Provider identity and authorisation must be verified; confirmations apply within authorised patient scope |
| Website Builder | Limited (booking proposals only where policy permits patient self-scheduling) | No clinical confirmations; no PHI modifications |

### Confirmation Requirements

All confirmations must be:

- **Explicit**: Requires affirmative action by the user
- **Item-Specific**: Applies to a specific proposal or action, not bulk operations
- **Logged**: Recorded in the audit trail with timestamp, identity, and action reference
- **Contemporaneous**: Occurs at the time of the action, not deferred or scheduled

### Assistant Non-Authority

Assistants are not confirmation surfaces. Assistants may:

- Prepare proposals for human review
- Present information to support human decisions
- Summarise records and options

Assistants may not:

- Confirm proposals
- Commit records
- Execute actions
- Bypass human confirmation requirements

---

## 9. External Side Effects Boundary

External side effects are actions that produce outcomes beyond the platform's internal state. These actions require the highest level of control and remain blocked under current governance.

### Definition of External Side Effects

The following are classified as external side effects:

| Side Effect | Description |
|-------------|-------------|
| Creating appointments in external calendars | Synchronising confirmed schedules with external calendaring systems |
| Sending outbound messages | Delivering communications to recipients via external channels (email, SMS, push notifications) |
| Issuing orders | Transmitting clinical orders to external systems (pharmacies, labs, referral recipients) |
| Billing charges | Initiating financial transactions with external payment or billing systems |
| External system notifications | Sending event notifications to third-party integrations |

### Control Requirements

External side effects are never performed without:

- Explicit human confirmation at a legitimate confirmation surface
- A gated execution path that verifies identity, consent, authorisation, and trace context
- Full audit logging of the action and its outcome
- Separate governance authorisation for the specific execution capability

### Current Status

External side effects remain blocked. No execution path for external side effects is authorised by this plan or by the baseline. Enablement requires separate governance artifacts.

---

## 10. Observability and Evidence Requirements (Planning Level)

Audit and evidence collection are required even in non-executing mode. Traceability supports governance, compliance, and future audit review.

### Required Evidence (Conceptual)

| Evidence Type | Description | Purpose |
|---------------|-------------|---------|
| Immutable Audit Events | Records of all access decisions, state changes, and user actions | Regulatory compliance and forensic review |
| Correlation IDs | Unique identifiers that link related events across services and surfaces | Trace reconstruction and incident investigation |
| Decision Records | Documentation of policy decisions (access granted, denied, consent verified) | Compliance evidence and policy enforcement verification |
| Proposal-to-Confirmation Linkage | Association between proposals and their confirming actions | Workflow integrity and attribution verification |

### Planning-Phase Requirements

During execution planning, evidence mechanisms must be designed to support:

- Attribution of all proposals to their creators (human or assistant)
- Attribution of all confirmations to their confirming humans
- Linkage between proposals and their corresponding committed records
- Retention per regulatory requirements

Evidence collection is required even for proposal-only workflows. The absence of execution does not eliminate the need for audit.

---

## 11. Integration Sequencing Principles (Non-Timeline)

The following principles govern the sequencing of integration work. These are ordering constraints, not a schedule.

| Principle | Rationale |
|-----------|-----------|
| Lock interfaces before wiring | Service boundaries and contracts must be stable before integration work proceeds |
| Read paths before write paths | Read-only access is lower risk; validate governance on read paths before enabling writes |
| Proposals before confirmations | The proposal workflow must be validated before enabling confirmation workflows |
| Confirmations before any execution enablement | Human confirmation gates must be proven before considering execution enablement |
| Start with smallest bounded slice that proves governance invariants | Validate governance constraints on a minimal scope before expanding |

### Sequencing Invariant

No later phase may proceed until earlier phases demonstrate conformance to baseline invariants. Skipping phases or proceeding with unvalidated governance is prohibited.

---

## 12. Explicit Prohibitions and Guardrails

The following behaviours are explicitly prohibited under the baseline and this plan. These prohibitions are non-negotiable.

| Prohibition | Reference |
|-------------|-----------|
| No autonomous execution | Baseline Section 9.6; Slice 05 Section 10.2 |
| No silent background actions | Baseline Section 4.7; Slice 03 Section 9.3 |
| No bulk confirmation | Baseline Section 9.7; Slice 04 Section 9.3 |
| No inferred consent | Baseline Section 4.6; Slice 02 Section 5.5 |
| No assistant authority | Baseline Section 4.3; Slice 03 Section 9.1 |
| No cross-tenant access | Baseline Section 4.8 |
| No cross-patient visibility | Baseline Section 4.9; Slice 02 Section 8.4 |
| No time-based execution | Baseline Section 9.5; Slice 05 Section 10.7 |
| No delegation of clinical judgement to AI | Baseline Section 4.10; Slice 03 Section 6.2 |
| No implicit authority | Slice 05 Section 10.8 |

Violation of any prohibition constitutes an architectural defect that must be remediated before deployment.

---

## 13. Relationship to Existing Artifacts

This plan operates within and is subordinate to the existing architecture governance structure.

| Artifact | Relationship |
|----------|--------------|
| Architecture Baseline Declaration | Binding authority. This plan translates the baseline into planning guidance without modifying or overriding it. |
| Integration Slices 01–05 | Binding authority. This plan references and aligns with slice definitions without duplicating their content. |
| Platform Integration Map | Orientation artifact. This plan is consistent with the integration topology and principles defined therein. |
| Platform Status | Status tracking. This plan does not modify platform status; status updates require separate commits. |

This plan does not duplicate content from binding artifacts. Where detail is required, this plan references the authoritative source.

---

## 14. Future Extension Points (Non-Binding)

The following areas may require additional integration slices or governance amendments in future phases. These are identified for awareness only and are not authorised by this plan.

| Extension Area | Description | Governance Requirement |
|----------------|-------------|----------------------|
| Billing execution enablement | Transitioning billing from record-keeping to charge execution | Separate governance artifact required |
| External calendar connectors | Synchronising confirmed schedules with external calendaring systems | Separate governance artifact required |
| Provider-to-patient delegated workflows | Enabling providers to initiate actions on patient behalf within consent | Separate governance artifact and consent model extension required |
| Emergency halt and rollback semantics | Defining mechanisms for halting execution and reversing actions in emergency scenarios | Separate governance artifact required |
| Execution enablement for specific domains | Selectively enabling execution for low-risk, well-governed domains | Separate governance artifact per domain required |

These extensions require separate governance artifacts. They are not authorised by this plan, the baseline, or existing slices.

---

## Closing Statement

This plan enables execution planning only. It provides a framework for designing interfaces, boundaries, and control mechanisms that align with the frozen architecture baseline. It does not authorise runtime behaviour, deployment, or any form of execution.

Execution remains blocked until separate governance artifacts explicitly authorise the transition from planning to operational state. Any such authorisation must document specific capabilities, controls, and human-in-the-loop requirements, and must undergo architecture and governance review.

---

*End of Execution Architecture Plan*
