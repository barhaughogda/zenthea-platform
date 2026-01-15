# Phase X-01: Execution Implementation Plan (Non-Operational)

---

## 1. Status and Scope

| Field | Value |
|-------|-------|
| Document Type | Implementation Planning Artifact |
| Status | **DESIGN-ONLY** |
| Execution | **EXPLICITLY NOT ENABLED** |
| Classification | Internal Governance Contract |
| Version | 1.0 |
| Declaration Date | 2026-01-15 |

This document is an implementation planning artifact. It defines conceptual structures, module boundaries, and governance constraints for future implementation of the Zenthea platform.

**Execution is explicitly NOT ENABLED.**

No operational capability, runtime activation, deployment authority, or implementation action is granted by this document. All content represents design decisions and planning guidance only. The transition from planning to execution requires separate governance authorisation not provided by this instrument.

This document describes what must hold when implementation eventually proceeds. It does not authorise implementation to proceed.

---

## 2. Purpose of This Document

This document exists to:

- Translate frozen architecture and execution design into implementation-ready planning guidance
- Define conceptual module boundaries and responsibilities without prescribing implementation details
- Establish execution boundary enforcement requirements that must be satisfied before any operational enablement
- Document interface design principles that govern all future implementation work
- Define data and state handling constraints for the non-operational planning phase
- Establish assistant runtime placement rules and prohibitions
- Define kill-switch architecture requirements at the conceptual level
- Document environment separation requirements and cross-contamination prohibitions
- Enumerate explicitly prohibited activities during the implementation planning phase
- Provide a governance reference for architecture review and regulatory audit

This document does not:

- Authorise any form of operational deployment
- Enable any runtime behaviour or system activation
- Prescribe specific technologies, vendors, or tooling choices
- Establish implementation timelines or delivery schedules
- Grant authority to execute any described capability

---

## 3. Binding Authorities and Dependencies

This document is subordinate to and governed by the following binding authorities:

| Document | Location | Authority Level |
|----------|----------|-----------------|
| Architecture Baseline Declaration | `docs/01-architecture/architecture-baseline-declaration.md` | Binding (Frozen) |
| Phase W Execution Design Lock | `docs/01-architecture/phase-w-execution-design-lock.md` | Binding (Locked) |
| Execution Architecture Plan | `docs/01-architecture/execution-architecture-plan.md` | Binding |
| Integration Slice 01: Booking to Care | `docs/01-architecture/integration-slice-01-booking-to-care.md` | Binding |
| Integration Slice 02: Identity and Consent | `docs/01-architecture/integration-slice-02-identity-and-consent.md` | Binding |
| Integration Slice 03: Assistant and AI Boundaries | `docs/01-architecture/integration-slice-03-assistant-and-ai-boundaries.md` | Binding |
| Integration Slice 04: Messaging and Clinical Documentation | `docs/01-architecture/integration-slice-04-messaging-and-clinical-documentation.md` | Binding |
| Integration Slice 05: Scheduling, Orders, and Execution Readiness | `docs/01-architecture/integration-slice-05-scheduling-orders-and-execution-readiness.md` | Binding |

### Precedence Rules

Where this document provides additional detail or guidance, it extends but does not modify the binding authorities. Any apparent conflict must be resolved in favour of the binding documents.

- The Architecture Baseline Declaration defines invariants that must hold across all implementation
- The Phase W Execution Design Lock freezes execution design decisions as canonical specifications
- The Execution Architecture Plan defines the execution planning framework and permitted activities
- Integration Slices 01–05 define domain-specific boundaries, responsibilities, and prohibitions

This document may not contradict, override, or relax any constraint defined in the binding authorities.

---

## 4. Definition of "Implementation Planning"

### 4.1 What Implementation Planning IS

Implementation planning encompasses the following permitted activities:

| Activity | Description |
|----------|-------------|
| Module Boundary Definition | Defining conceptual boundaries between system components |
| Responsibility Assignment | Assigning responsibilities to defined modules |
| Interface Contract Design | Designing contracts between modules without implementing them |
| Data Schema Definition | Defining data structures and schemas for future implementation |
| Dependency Mapping | Identifying dependencies between modules and external systems |
| Execution Gate Design | Designing execution control mechanisms at the conceptual level |
| Audit Framework Design | Designing audit and evidence collection mechanisms |
| Testing Strategy Development | Designing verification and validation approaches |
| Safety Analysis | Identifying risks, failure modes, and mitigation requirements |
| Governance Framework Development | Designing governance processes for execution authorisation |

### 4.2 What Implementation Planning IS NOT

Implementation planning explicitly excludes the following activities:

| Excluded Activity | Clarification |
|-------------------|---------------|
| Code Implementation | Writing, compiling, or deploying executable code |
| System Configuration | Configuring runtime systems, services, or infrastructure |
| Data Migration | Moving, transforming, or processing production data |
| Feature Activation | Enabling any user-facing or system-facing feature |
| Integration Activation | Connecting systems or enabling data flows |
| User Exposure | Making any capability available to users |
| Runtime Deployment | Deploying any component to any environment |
| Execution Enablement | Authorising any form of operational execution |
| Vendor Selection | Committing to specific technology vendors or products |
| Timeline Commitment | Establishing binding implementation schedules |

Any activity that results in operational effect is outside the scope of implementation planning and requires separate governance authorisation.

---

## 5. System Decomposition (Conceptual)

This section defines the conceptual module structure for the platform. These definitions describe boundaries and responsibilities; they do not prescribe implementation architecture.

### 5.1 Modules

| Module | Description |
|--------|-------------|
| Identity Module | Manages identity verification, authentication state, and session lifecycle |
| Consent Module | Manages explicit consent grants, revocations, and scope enforcement |
| Scheduling Module | Manages scheduling proposals, confirmations, and availability |
| Order Module | Manages clinical and operational orders as records of intent |
| Messaging Module | Manages message composition, delivery confirmation, and audit |
| Documentation Module | Manages clinical documentation lifecycle from draft to committed state |
| Assistant Module | Manages assistant interactions, proposal preparation, and boundary enforcement |
| Audit Module | Maintains immutable audit records of all actions and access decisions |
| Execution Gate Module | Enforces execution boundaries and fail-closed semantics |
| Configuration Module | Manages tenant-level configuration, policy, and branding |

### 5.2 Responsibilities

| Module | Primary Responsibilities |
|--------|-------------------------|
| Identity Module | Authenticate users; manage session state; enforce identity verification requirements |
| Consent Module | Record consent grants; enforce consent boundaries; manage revocation |
| Scheduling Module | Accept scheduling proposals; enforce confirmation requirements; maintain schedule state |
| Order Module | Accept order creation; enforce confirmation requirements; maintain order state |
| Messaging Module | Accept message composition; enforce delivery confirmation; maintain message state |
| Documentation Module | Accept documentation drafts; enforce commitment confirmation; maintain document state |
| Assistant Module | Prepare proposals; enforce assistant boundaries; prevent autonomous execution |
| Audit Module | Record all actions; maintain immutability; support compliance queries |
| Execution Gate Module | Verify identity, consent, authorisation; enforce fail-closed semantics; block execution |
| Configuration Module | Store configuration; enforce tenant isolation; manage policy application |

### 5.3 Explicit Non-Responsibilities

| Module | Non-Responsibilities |
|--------|---------------------|
| Identity Module | Does not grant or assume consent; does not authorise clinical actions |
| Consent Module | Does not infer consent; does not override patient decisions; does not expire silently |
| Scheduling Module | Does not auto-confirm proposals; does not trigger execution; does not bypass human review |
| Order Module | Does not execute orders; does not dispatch to external systems; does not auto-confirm |
| Messaging Module | Does not send without confirmation; does not auto-deliver; does not impersonate humans |
| Documentation Module | Does not commit without confirmation; does not modify committed records; does not bypass review |
| Assistant Module | Does not execute actions; does not confirm proposals; does not hold authority |
| Audit Module | Does not modify records; does not filter events; does not selectively retain |
| Execution Gate Module | Does not default-allow; does not bypass verification; does not enable without authorisation |
| Configuration Module | Does not override governance constraints; does not enable cross-tenant access |

---

## 6. Execution Boundary Enforcement

Execution boundary enforcement is the architectural mechanism that prevents any operational effect without explicit authorisation. This section defines the conceptual structure of execution boundaries.

### 6.1 Global Flags

Global execution flags govern platform-wide execution state:

| Flag | Description | Default State |
|------|-------------|---------------|
| `EXECUTION_GLOBALLY_ENABLED` | Master flag controlling all execution capabilities | `FALSE` (Disabled) |
| `EXTERNAL_EFFECTS_PERMITTED` | Flag controlling any external side effects | `FALSE` (Disabled) |
| `AUTONOMOUS_ACTIONS_PERMITTED` | Flag controlling any autonomous system actions | `FALSE` (Disabled) |

All global flags default to disabled. Enabling any global flag requires documented governance authorisation outside the scope of this document.

### 6.2 Domain Flags

Domain-specific execution flags govern execution within each functional domain:

| Domain | Flag | Default State |
|--------|------|---------------|
| Scheduling | `SCHEDULING_EXECUTION_ENABLED` | `FALSE` |
| Orders | `ORDER_EXECUTION_ENABLED` | `FALSE` |
| Messaging | `MESSAGE_DISPATCH_ENABLED` | `FALSE` |
| Documentation | `DOCUMENT_COMMIT_ENABLED` | `FALSE` |
| Identity | `IDENTITY_ELEVATION_ENABLED` | `FALSE` |
| Consent | `CONSENT_MODIFICATION_ENABLED` | `FALSE` |

Domain flags are subordinate to global flags. A domain flag may only take effect if the corresponding global flag is enabled.

### 6.3 Action Flags

Action-specific execution flags govern individual action types:

| Action | Flag | Default State |
|--------|------|---------------|
| Appointment Confirmation | `APPOINTMENT_CONFIRM_ENABLED` | `FALSE` |
| Order Dispatch | `ORDER_DISPATCH_ENABLED` | `FALSE` |
| Message Delivery | `MESSAGE_SEND_ENABLED` | `FALSE` |
| Document Commitment | `DOCUMENT_COMMIT_ENABLED` | `FALSE` |
| External Calendar Sync | `CALENDAR_SYNC_ENABLED` | `FALSE` |
| External Notification | `NOTIFICATION_SEND_ENABLED` | `FALSE` |

Action flags are subordinate to both global and domain flags. An action flag may only take effect if all parent flags are enabled.

### 6.4 Startup Fail-Closed Semantics

The platform must operate with fail-closed semantics at startup and throughout operation:

| Requirement | Description |
|-------------|-------------|
| Default Disabled | All execution capabilities are disabled by default at system startup |
| Explicit Enablement | Execution capabilities require explicit enablement through governance-controlled configuration |
| Verification on Startup | The system must verify execution flag state on startup and refuse to start if flags are in inconsistent states |
| Audit on State Change | All execution flag state changes must be logged with full attribution |
| No Silent Enablement | No execution capability may be enabled without logged administrative action |
| Fail to Safe State | Any error in flag verification must result in execution being disabled, not enabled |

---

## 7. Interface Design Principles

This section defines principles that govern interface design for all modules. These principles establish constraints that must be satisfied by any future implementation.

### 7.1 Read vs Write Separation

All interfaces must maintain strict separation between read and write operations:

| Principle | Description |
|-----------|-------------|
| Separate Interfaces | Read operations and write operations are exposed through distinct interfaces |
| Independent Authorisation | Read authorisation and write authorisation are evaluated independently |
| Audit Distinction | Read operations and write operations are logged with distinct audit classifications |
| No Read-Triggered Writes | Read operations must not trigger write operations as a side effect |
| No Write-Embedded Reads | Write operations must explicitly declare any read dependencies |

### 7.2 Proposal vs Execution Distinction

All interfaces must maintain strict distinction between proposal operations and execution operations:

| Principle | Description |
|-----------|-------------|
| Proposal Interfaces | Interfaces for creating, modifying, and viewing proposals |
| Confirmation Interfaces | Interfaces for confirming proposals (human-gated) |
| Execution Interfaces | Interfaces for executing confirmed actions (blocked under this document) |
| State Visibility | Proposal state and execution state must be visible and distinguishable |
| No Conflation | Proposal acceptance must not be conflated with execution authorisation |

### 7.3 Human Authority Boundaries

All interfaces must enforce human authority boundaries:

| Principle | Description |
|-----------|-------------|
| Human Confirmation Required | All state-changing operations require explicit human confirmation |
| No Delegation to Systems | Confirmation authority may not be delegated to automated systems |
| No Delegation to Assistants | Confirmation authority may not be delegated to assistant surfaces |
| Contemporaneous Action | Confirmation must occur at the time of the action, not deferred or scheduled |
| Attribution Required | All confirmations must be attributed to the confirming human |

---

## 8. Data & State Handling (Non-Operational)

This section defines constraints on data and state handling during the non-operational planning phase.

### 8.1 Schemas Allowed

The following data-related activities are permitted during implementation planning:

| Activity | Constraints |
|----------|-------------|
| Schema Definition | Defining data schemas, structures, and relationships |
| Schema Validation | Validating schema designs against architectural requirements |
| Schema Documentation | Documenting schemas for review and governance |
| Test Data Design | Designing test data structures for future validation |
| Migration Planning | Planning data migration strategies without executing them |

### 8.2 Writes Prohibited

The following data-related activities are prohibited during implementation planning:

| Prohibited Activity | Clarification |
|---------------------|---------------|
| Production Data Access | No access to production data systems |
| Production Data Writes | No writes to production data stores |
| Production Data Migration | No migration of production data |
| Production Data Transformation | No transformation of production data |
| Production Data Export | No export of production data |
| Cross-Environment Data Movement | No movement of data between environments |

### 8.3 Audit Expectations

Audit requirements apply even during the non-operational planning phase:

| Expectation | Description |
|-------------|-------------|
| Design Decision Logging | All significant design decisions must be documented |
| Change Attribution | All document changes must be attributed to authors |
| Version Control | All artifacts must be maintained under version control |
| Review Trail | Design reviews must be documented with participants and outcomes |
| Governance Checkpoints | Governance approvals must be recorded with authorising parties |

---

## 9. Assistant Runtime Placement

This section defines where assistant logic may exist within the platform architecture and what boundaries constrain assistant behaviour.

### 9.1 Where Assistant Logic May Exist

| Location | Permitted Assistant Functions |
|----------|------------------------------|
| Patient Portal Surface | Read authorised patient data; prepare proposals for human review; present information |
| Provider Portal Surface | Read authorised clinical data; prepare proposals for human review; summarise records |
| Administrative Surface | Read operational data; support administrative queries; prepare reports |

### 9.2 What Assistants May Observe

| Observable Data | Constraints |
|-----------------|-------------|
| Patient Data (Scoped) | Only within authenticated user's authorisation scope |
| Clinical Records (Scoped) | Only within consent boundaries and care relationships |
| Scheduling State | Proposals and confirmed schedules within authorisation scope |
| Order State | Order records within authorisation scope |
| Message State | Messages within authorisation scope |

### 9.3 What Assistants Must Never Trigger

| Prohibited Trigger | Absolute Prohibition |
|--------------------|---------------------|
| Scheduling Confirmation | Assistants must not confirm scheduling proposals |
| Order Execution | Assistants must not execute or dispatch orders |
| Message Delivery | Assistants must not send or dispatch messages |
| Document Commitment | Assistants must not commit clinical documentation |
| Consent Modification | Assistants must not create, modify, or revoke consent |
| Identity Elevation | Assistants must not elevate identity verification state |
| Data Deletion | Assistants must not delete any data |
| External Effects | Assistants must not trigger any external system effects |
| Background Actions | Assistants must not initiate background processes |
| Scheduled Actions | Assistants must not schedule future autonomous actions |

---

## 10. Kill-Switch Architecture (Conceptual)

This section defines the conceptual architecture for kill-switch capabilities that enable immediate halt of execution.

### 10.1 Placement

Kill-switch controls must be placed at the following architectural points:

| Placement | Description |
|-----------|-------------|
| Global Platform Level | Master kill-switch affecting all platform execution capabilities |
| Domain Level | Domain-specific kill-switches for each functional domain |
| Tenant Level | Tenant-scoped kill-switches for tenant-specific halt |
| Module Level | Module-specific kill-switches for granular control |

### 10.2 Authority

Kill-switch authority is defined as follows:

| Authority Level | Scope | Activation Authority |
|-----------------|-------|---------------------|
| Global | All platform execution | Platform governance authority |
| Domain | Single functional domain | Domain governance authority |
| Tenant | Single tenant operations | Tenant administrator authority |
| Module | Single module operations | Platform operations authority |

### 10.3 Scope

Kill-switch scope definitions:

| Scope | Effect |
|-------|--------|
| Full Halt | All execution capabilities immediately disabled |
| Domain Halt | All execution within specified domain immediately disabled |
| Tenant Halt | All execution for specified tenant immediately disabled |
| Action Halt | Specific action types immediately disabled |

### 10.4 Immediate Halt Semantics

Kill-switch activation must satisfy the following semantics:

| Requirement | Description |
|-------------|-------------|
| Immediate Effect | Kill-switch activation must take effect immediately upon activation |
| No Queued Completion | In-flight operations must halt; queued operations must not proceed |
| Fail-Safe Default | Kill-switch failure must result in execution halt, not continuation |
| Audit Logging | All kill-switch activations must be immediately logged |
| No Override | Kill-switch cannot be overridden by user preference or configuration |
| Verification Required | Kill-switch state must be verified before any execution proceeds |

---

## 11. Environment Separation

This section defines requirements for separation between deployment environments.

### 11.1 Demo Environment

| Characteristic | Requirement |
|----------------|-------------|
| Purpose | Demonstration of platform capabilities |
| Data | Synthetic demonstration data only |
| Isolation | Complete isolation from sandbox and production |
| Access | Controlled access for demonstration purposes |
| Execution | May have limited execution capabilities for demonstration |

### 11.2 Sandbox Environment

| Characteristic | Requirement |
|----------------|-------------|
| Purpose | Development and testing |
| Data | Synthetic test data only |
| Isolation | Complete isolation from demo and production |
| Access | Development team access |
| Execution | May have execution capabilities for testing |

### 11.3 Production Environment

| Characteristic | Requirement |
|----------------|-------------|
| Purpose | Operational platform deployment |
| Data | Real operational data |
| Isolation | Complete isolation from demo and sandbox |
| Access | Authorised operational access only |
| Execution | Subject to all governance controls; currently blocked |

### 11.4 Explicit Prohibition on Cross-Contamination

The following cross-environment interactions are explicitly prohibited:

| Prohibition | Description |
|-------------|-------------|
| Data Movement | No movement of data between environments without explicit governance approval |
| Configuration Sharing | No sharing of execution-enabling configuration between environments |
| Credential Sharing | No sharing of credentials or access tokens between environments |
| Code Promotion without Review | No promotion of code between environments without review |
| State Synchronisation | No synchronisation of state between environments |
| Automatic Propagation | No automatic propagation of changes between environments |

---

## 12. Prohibited Activities

The following activities are explicitly prohibited during the implementation planning phase governed by this document:

| # | Prohibited Activity | Clarification |
|---|---------------------|---------------|
| 1 | **Deploying execution features** | No deployment of any feature that enables execution |
| 2 | **Enabling write paths without gating** | No write operation may proceed without human confirmation gate |
| 3 | **Activating background automation** | No background processes may execute state-changing actions |
| 4 | **Autonomous scheduling or order execution** | No automatic confirmation or execution of schedules or orders |
| 5 | **AI-driven decision execution** | No AI system may execute decisions without human confirmation |
| 6 | **Automatic message dispatch** | No automatic delivery of messages to recipients |
| 7 | **Production data access or modification** | No access to or modification of production data |
| 8 | **Cross-tenant data access** | No access to data across tenant boundaries |
| 9 | **Cross-patient data visibility** | No visibility into other patients' data |
| 10 | **Assistant-triggered state changes** | No assistant may trigger state-changing actions |
| 11 | **Time-based automatic execution** | No action may execute based on passage of time |
| 12 | **Bulk confirmation of items** | No bulk confirmation; each item requires individual confirmation |
| 13 | **Inferred or assumed consent** | No inference or assumption of consent |
| 14 | **Delegation of clinical judgement to AI** | No delegation of clinical decision authority to AI systems |
| 15 | **Silent or hidden actions** | No action may proceed without user visibility |
| 16 | **Bypassing human-in-the-loop requirements** | No mechanism may bypass mandatory human confirmation |
| 17 | **Cross-environment data movement** | No data movement between environments without governance approval |
| 18 | **Execution flag enablement** | No enabling of execution flags without documented governance approval |
| 19 | **External system integration activation** | No activation of integrations with external systems |
| 20 | **User exposure of blocked capabilities** | No exposure of execution-blocked capabilities to users |

---

## 13. Relationship to Future Phases

### 13.1 Phase Y Reference

This document is followed by Phase Y, which addresses execution enablement governance. Phase Y is referenced here for orientation only; no details of Phase Y are provided in this document.

### 13.2 Transition Requirements

Transition from Phase X (Implementation Planning) to Phase Y (Execution Enablement) requires:

- Completion of all implementation planning activities defined in this document
- Validation of all execution boundary enforcement mechanisms
- Architecture review confirming conformance to binding authorities
- Governance approval through documented processes outside the scope of this document

### 13.3 Non-Authorisation Statement

This document does not authorise transition to Phase Y. Transition authorisation requires separate governance instruments not provided by this document.

---

## 14. Closing Governance Statement

This document constitutes an implementation planning artifact for the Zenthea platform.

**This document authorises NOTHING operational.**

Specifically, this document does not authorise:

- Deployment of any system component to any environment
- Activation of any runtime feature or capability
- Execution of any automated process or workflow
- Delivery of any scheduled action, order, or message
- Access to or modification of production data
- Enablement of any execution flag or capability
- Transition from planning to operational state

All operational enablement remains subject to future governance decisions and explicit authorisation instruments that are outside the scope of this document.

The transition from implementation planning to execution requires separate governance authorisation that must:

- Document specific execution capabilities being enabled
- Define controls, gates, and human-in-the-loop requirements
- Undergo architecture and governance review
- Be approved through documented governance processes
- Be recorded as a versioned governance artifact

**Execution remains BLOCKED unless and until separately authorised through documented governance processes outside the scope of this declaration.**

This document is effective as of the declaration date and remains in force until superseded by subsequent governance instruments.

---

*Document Classification: Implementation Planning Artifact*
*Scope: Phase X-01 Execution Implementation Plan (Non-Operational)*
*Authority: Design Guidance Only; No Operational Authority Granted*
