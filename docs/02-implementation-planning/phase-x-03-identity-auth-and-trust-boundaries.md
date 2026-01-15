# Phase X-03: Identity, Authentication, and Trust Boundaries (Design-Only)

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

This document is an identity, authentication, and trust boundaries design artifact. It defines conceptual identity models, authentication and authorisation boundaries, session trust requirements, consent enforcement linkage, assistant trust constraints, and audit expectations for the Zenthea platform.

**EXECUTION IS NOT ENABLED.**

No operational capability, runtime activation, deployment authority, or identity system implementation is granted by this document. All content represents design decisions and planning guidance only. The transition from planning to execution requires separate governance authorisation not provided by this instrument.

**All execution remains BLOCKED.**

---

## 2. Purpose of This Document

This document exists to define:

- The canonical identity model governing all platform interactions
- Authentication boundaries and what authentication must and must not establish
- Authorisation model with explicit capability tiers (READ, PROPOSE, CONFIRM, EXECUTE)
- Session trust semantics and elevation controls
- Linkage between authorisation decisions and explicit consent grants
- Assistant trust boundaries and non-authoritative constraints
- Multi-tenant trust isolation requirements
- Audit and evidence requirements for identity and access events

**This document does not:**

- Authorise any form of operational deployment or runtime behaviour
- Enable any authentication or identity verification system
- Prescribe specific technologies, vendors, protocols, or tooling choices
- Establish implementation timelines or delivery schedules
- Grant authority to execute any described capability
- Permit production identity operations or session management
- Enable cross-tenant identity linking or federation
- Authorise credential storage or secret management operations

---

## 3. Binding Authorities and Dependencies

This document is subordinate to and governed by the following binding authorities:

| Document | Location | Authority Level |
|----------|----------|-----------------|
| Architecture Baseline Declaration | `docs/01-architecture/architecture-baseline-declaration.md` | Binding (Frozen) |
| Phase W Execution Design Lock | `docs/01-architecture/phase-w-execution-design-lock.md` | Binding (Locked) |
| Execution Architecture Plan | `docs/01-architecture/execution-architecture-plan.md` | Binding |
| Integration Slice 02: Identity and Consent | `docs/01-architecture/integration-slice-02-identity-and-consent.md` | Binding |
| Integration Slice 03: Assistant and AI Boundaries | `docs/01-architecture/integration-slice-03-assistant-and-ai-boundaries.md` | Binding |
| Phase W-03: Identity and Consent Execution Design | `docs/01-architecture/phase-w-03-identity-and-consent-execution-design.md` | Binding (Locked) |
| Phase X-01: Execution Implementation Plan | `docs/02-implementation-planning/phase-x-01-execution-implementation-plan.md` | Binding |
| Phase X-02: Data and Persistence Design | `docs/02-implementation-planning/phase-x-02-data-and-persistence-design.md` | Binding |
| Platform Integration Map | `docs/00-overview/platform-integration-map.md` | Orientation |
| Platform Status | `docs/00-overview/platform-status.md` | Status Reference |

### Precedence Rules

Where this document provides additional detail or guidance, it extends but does not modify the binding authorities. Any apparent conflict must be resolved in favour of the binding documents.

- This document may not override constraints established in the Architecture Baseline Declaration
- This document may not override locked execution design decisions in Phase W artifacts
- This document may not contradict identity and consent boundaries defined in Integration Slice 02
- This document may not relax assistant boundaries defined in Integration Slice 03
- Conflicts between this document and binding authorities resolve in favour of binding authorities

---

## 4. Definitions

The following definitions govern the interpretation of this document.

**Identity**: A verified association between a natural person or system and their authenticated representation within the platform. Identity is the answer to "who is this actor?"

**Authentication**: The process of verifying that an actor is who they claim to be. Authentication establishes identity; it does not grant permissions.

**Authorisation**: The process of determining what actions an authenticated identity may perform. Authorisation depends on identity, role, scope, and explicit consent.

**Principal**: An authenticated entity capable of performing actions within the platform. Principals include patients, providers, operators, systems, and assistants.

**Actor**: The entity initiating an action. The actor is the principal responsible for a specific request or operation.

**Subject (Patient Subject)**: The patient whose data is being accessed or affected by an action. The subject is distinct from the actor; a provider actor may access a patient subject's records.

**Requesting Actor**: The actor initiating an access request. The requesting actor must be authenticated before any access decision.

**Session**: A bounded period of authenticated interaction between an actor and the platform. Sessions have defined start, expiry, and termination semantics.

**Identity Assertion**: A cryptographically verifiable claim that an actor has been authenticated. Identity assertions are issued upon successful authentication and verified on each request.

**Trust Boundary**: A logical boundary within which certain trust assumptions hold. Crossing a trust boundary requires verification and may require additional authorisation.

**Consent Grant**: An explicit, recorded agreement by a patient authorising specific access to their data. Consent grants are referenced but not duplicated from the consent model defined in Integration Slice 02 and Phase X-02.

**Least Privilege**: The principle that each actor receives only the minimum permissions necessary for their function. Permissions are not granted by default.

**Fail-Closed**: The operational mode wherein any verification failure results in denial of access. If verification cannot be completed, access is denied rather than granted.

---

## 5. Identity Classes (Canonical)

The platform recognises the following canonical identity classes. Each class defines what an identity may represent and the boundaries within which it operates.

### 5.1 Patient Identity

Patient identity represents a verified natural person who is a recipient of care within the platform.

**What patient identity may represent:**
- A natural person whose identity has been verified through established processes
- The owner and controller of their own health data and consent preferences
- An actor with self-service access to their own records

**Constraints:**
- Patient identity is tenant-scoped; a patient belongs to one or more tenants
- Patient identity grants no clinical authority or administrative privilege
- Patient identity may not access other patients' data under any circumstance

### 5.2 Provider Identity

Provider identity represents a verified clinical provider authorised to deliver care within the platform.

**What provider identity may represent:**
- A natural person whose clinical credentials have been verified
- An actor with clinical access rights within their authorised scope
- A care relationship with patients under their care

**Constraints:**
- Provider identity is tenant-scoped; a provider operates within assigned tenants
- Provider identity does not automatically grant access; consent is required
- Provider identity may not modify patient consent grants

### 5.3 Operator / Governance Identity

Operator identity represents administrative and governance personnel with platform-level responsibilities.

**What operator identity may represent:**
- A natural person with administrative authority over platform configuration
- An actor with visibility into operational and governance data
- A governance authority for platform-level decisions

**Constraints:**
- Operator identity may be platform-wide rather than tenant-scoped
- Operator access to patient-identifiable data requires explicit justification and audit logging
- Operator identity does not grant clinical authority

### 5.4 System Identity

System identity represents platform services and automated components operating on behalf of the platform.

**What system identity may represent:**
- A platform service performing authorised operations
- An automated component executing governed workflows
- A background process operating within defined boundaries

**Constraints:**
- System identity does not substitute for human confirmation where required
- System identity is attributed in audit records
- System identity may not bypass human-in-the-loop requirements

### 5.5 Assistant Identity

Assistant identity represents AI assistant surfaces operating within the platform.

**What assistant identity may represent:**
- An AI-powered surface providing advisory and preparatory functions
- A non-autonomous component operating under human oversight
- A read-only or proposal-only actor with no execution authority

**Constraints:**
- Assistant identity is non-authoritative
- Assistant identity may not confirm actions, commit records, or trigger execution
- Assistant identity may not be an authority source for identity verification, consent validation, or access decisions
- All assistant-prepared content must be attributed and labelled

### 5.6 Tenant Scoping Statement

Identity classes are tenant-scoped unless explicitly stated otherwise. Patient, provider, and system identities operate within tenant boundaries. Operator identities may operate across tenants where explicitly authorised and audited.

---

## 6. Authentication Boundaries (Design Only)

This section defines what authentication must establish and what it must not do. These are design-level boundaries; no authentication system is authorised by this document.

### 6.1 What Authentication Must Establish

Authentication, when implemented, must establish the following:

| Requirement | Description |
|-------------|-------------|
| Identity | The authenticated actor's verified identity |
| Tenant Scope | The tenant context within which the actor is operating |
| Authentication Method | The method used to verify identity |
| Expiry | The temporal bound after which the authentication is no longer valid |
| Attribution | Sufficient information to attribute actions to the authenticated actor |

### 6.2 What Authentication Must Not Do

Authentication must not:

| Prohibition | Clarification |
|-------------|---------------|
| Grant permissions implicitly | Authentication establishes identity; it does not grant authorisation |
| Infer consent | Authentication does not imply or create consent |
| Bypass tenant boundaries | Authentication within one tenant does not grant access to other tenants |
| Substitute for authorisation | Authentication is necessary but not sufficient for access |
| Persist beyond session bounds | Authentication state is session-scoped and must not outlive the session |

### 6.3 Session Establishment Semantics (Design-Level)

Session establishment must satisfy the following design-level requirements:

- Sessions are created only upon successful authentication
- Sessions are scoped to a single tenant context
- Sessions have defined expiry times set at establishment
- Sessions are associated with a single principal identity
- Session establishment must be recorded in the audit trail

### 6.4 Session Termination Semantics (Design-Level)

Session termination must satisfy the following design-level requirements:

- Sessions terminate upon explicit logout by the actor
- Sessions terminate upon expiry of the session timeout
- Sessions terminate upon detection of security anomalies
- Session termination must be recorded in the audit trail
- Terminated sessions may not be revived; new sessions require new authentication

---

## 7. Authorisation Model (READ vs PROPOSE vs CONFIRM vs EXECUTE)

The platform distinguishes four capability tiers governing what actions authenticated actors may perform.

### 7.1 Capability Tier Definitions

**READ**: Non-mutating access to data within authorisation scope. Read operations do not modify platform state.

**PROPOSE**: Create drafts, proposals, or suggestions that have no operational effect until confirmed. Proposals are records of intent, not committed actions.

**CONFIRM**: Human confirmation that transitions a proposal to committed state. Confirmation creates a committed record but does not trigger external effects.

**EXECUTE**: Side-effecting action that produces outcomes beyond internal platform state. Execution involves external delivery, transmission, or fulfilment.

### 7.2 Capability Matrix by Identity Class

| Identity Class | READ | PROPOSE | CONFIRM | EXECUTE |
|----------------|------|---------|---------|---------|
| Patient | Allowed (own data) | Allowed (own scope) | Allowed (own consent, scheduling) | BLOCKED |
| Provider | Allowed (consented scope) | Allowed (clinical scope) | Allowed (clinical confirmations) | BLOCKED |
| Operator | Allowed (operational scope) | Allowed (administrative scope) | Allowed (administrative confirmations) | BLOCKED |
| System | Allowed (audit and operational) | Blocked | Blocked | BLOCKED |
| Assistant | Allowed (limited, scoped to user context) | Allowed (attributed drafts only) | BLOCKED | BLOCKED |

### 7.3 Assistant Capability Constraints

Assistant identity operates under the following explicit constraints:

- **READ**: Allowed only within the authenticated user's existing authorisation scope. Assistant may not access data the user could not access directly.
- **PROPOSE**: Allowed only as attributed drafts. All assistant-prepared proposals must be labelled as assistant-generated and require human review.
- **CONFIRM**: Blocked. Assistants may not confirm proposals, commit records, or transition proposals to committed state.
- **EXECUTE**: Blocked. Assistants may not trigger execution, dispatch actions, or produce external effects.

### 7.4 Execution Status

**EXECUTE capability remains BLOCKED for all identity classes.**

No execution is authorised by this document. Execution enablement requires separate governance authorisation through instruments not provided here.

---

## 8. Consent Enforcement Linkage

Authorisation decisions are tied to explicit Consent Grants. This section defines the linkage between authorisation and consent without duplicating the consent model.

### 8.1 Consent as Authorisation Prerequisite

Access to patient data requires an explicit, active Consent Grant:

- Authorisation decisions must verify the existence of a valid consent grant
- Consent grants define the scope, duration, and permitted parties for access
- Access outside the scope of a consent grant is denied

### 8.2 Explicit Ban on Inferred or Assumed Consent

The following consent derivations are prohibited:

| Prohibited Consent Type | Clarification |
|-------------------------|---------------|
| Inferred consent | Consent may not be inferred from user behaviour |
| Assumed consent | Consent may not be assumed from context or relationship |
| Predicted consent | Consent may not be predicted from historical patterns |
| Blanket consent | General or unscoped consent is not valid |
| Derived consent | Consent may not be derived from other consent grants |

All consent must trace directly to an explicit, affirmative patient action.

### 8.3 Revocation Semantics

Consent revocation operates as follows:

- Revocation takes effect immediately upon patient action
- Revocation terminates future access under the revoked grant
- Access requests against revoked consent must be denied
- The system operates in fail-closed mode: if consent status cannot be verified, access is denied
- Revocation does not delete historical records created under valid consent
- Revocation must be recorded in the audit trail

---

## 9. Multi-Tenant Trust Boundaries

This section defines tenant isolation requirements at the identity and access layer.

### 9.1 Tenant Scoping Invariants

The following invariants govern tenant isolation:

- All patient and provider identities are tenant-scoped
- All consent grants are tenant-scoped
- All sessions operate within a single tenant context
- Tenant context is established at authentication and immutable for the session duration

### 9.2 Cross-Tenant Prohibitions

The following cross-tenant operations are prohibited:

| Prohibition | Description |
|-------------|-------------|
| Cross-tenant reads | No identity may read data from a tenant other than their authenticated context |
| Cross-tenant writes | No identity may write data to a tenant other than their authenticated context |
| Cross-tenant joins | No query may join data across tenant boundaries |
| Cross-tenant aggregations | No aggregation may combine data from multiple tenants |
| Cross-tenant identity linking | Identities may not be linked across tenant boundaries without explicit governance |

### 9.3 Operator Visibility Requirements

Operator access across tenants must satisfy:

- Operator visibility across tenants requires explicit authorisation
- All cross-tenant operator access must be logged with full attribution
- Operator access to patient-identifiable data requires specific justification
- Operator actions are subject to audit review

### 9.4 No Shared Mutable State Across Tenants

The following constraints ensure tenant isolation at the data level:

- No data record may be shared across tenants
- No mutable state may be visible to multiple tenants
- Configuration is tenant-scoped; no shared configuration between tenants
- Audit trails are tenant-scoped for tenant-specific events

---

## 10. Session Trust and Elevation Controls

This section defines session trust semantics and controls for privilege elevation.

### 10.1 No Silent Elevation

Privilege elevation is subject to the following constraints:

- No session may gain elevated privileges without explicit action
- Silent or automatic privilege elevation is prohibited
- Privilege changes must be logged in the audit trail
- Session scope established at authentication may not expand without re-authentication

### 10.2 Re-Authentication Requirements for Sensitive Operations

Certain operations require step-up verification beyond the initial session authentication:

| Operation Category | Re-Authentication Requirement |
|--------------------|-------------------------------|
| Consent grant or revocation | Re-authentication may be required |
| Clinical order confirmation | Re-authentication may be required |
| Administrative privilege use | Re-authentication may be required |
| Access to sensitive record categories | Re-authentication may be required |

Re-authentication requirements are defined at the governance level; this document does not prescribe specific triggers.

### 10.3 Step-Up Verification Concept

Step-up verification provides additional assurance for sensitive operations:

- Step-up verification occurs within an existing session
- Step-up verification does not create a new session
- Step-up verification results are logged
- Step-up verification requirements are policy-driven

This document defines the concept; it does not prescribe implementation mechanisms.

### 10.4 Session Fixation and Replay Protection

Sessions must be protected against fixation and replay attacks:

- Session identifiers must be unpredictable and securely generated
- Session identifiers must not be reusable after termination
- Session binding must prevent transfer of sessions between actors
- Replay of expired or terminated session credentials must be rejected

This document defines conceptual protections; it does not prescribe implementation mechanisms.

---

## 11. Assistant Trust Boundary (Non-Authoritative)

This section defines the explicit trust boundaries for assistant identity within the platform.

### 11.1 Assistant is Advisory and Preparatory Only

Assistant surfaces operate exclusively in advisory and preparatory modes:

- Assistants may retrieve and present information within authorised scope
- Assistants may prepare drafts and proposals for human review
- Assistants may summarise records for navigation and comprehension
- Assistants may suggest next steps in administrative workflows

### 11.2 Assistant is Not an Authority Source

Assistants may not serve as an authority source for:

| Prohibited Authority | Clarification |
|----------------------|---------------|
| Identity verification | Assistants may not verify or attest to identity |
| Consent validation | Assistants may not validate or create consent |
| Access decisions | Assistants may not make or influence authorisation decisions |
| Clinical judgement | Assistants may not provide clinical recommendations or substitute for clinician decision-making |
| Execution authorisation | Assistants may not authorise or trigger execution |

### 11.3 Required Labelling and Attribution

All assistant-prepared content must be:

- Labelled as assistant-generated
- Attributed to the assistant identity
- Distinguished from human-authored content
- Subject to human review before any confirmation or commitment

### 11.4 External Intelligence References

References to external intelligence sources (such as clinical databases, medical references, or third-party knowledge bases) are subject to the following constraints:

- External references are non-authoritative
- External references must be labelled with source attribution
- External references may not be presented as platform recommendations
- External references may not substitute for clinical judgement
- External references require human interpretation and validation

---

## 12. Audit and Evidence Requirements (Identity and Access)

This section defines audit requirements for identity and access events.

### 12.1 Required Audit Event Categories

The following event categories must be recorded in the audit trail:

| Event Category | Description |
|----------------|-------------|
| Authentication events | Login success, login failure, logout, session start |
| Session lifecycle events | Session creation, session expiry, session termination |
| Consent grant events | Consent grant creation, scope definition |
| Consent revocation events | Consent revocation, revocation timestamp, revoking actor |
| Consent usage events | Access requests evaluated against consent grants |
| Access decision events | Access allowed, access denied, authorisation evaluation |
| Privileged role changes | Role assignment, role revocation, privilege modification |
| Confirmation events | Proposal confirmation, confirming actor, confirmation timestamp |
| Step-up verification events | Re-authentication requests, step-up outcomes |

### 12.2 Append-Only and Correlation Requirements

Audit records must satisfy the following integrity requirements:

- Audit records are append-only; existing records may not be modified
- Audit records may not be deleted under any circumstance
- Each audit record must include a correlation identifier linking related events
- Correlation identifiers enable trace reconstruction across services and surfaces

These requirements align with audit and evidence model definitions in Phase X-02.

### 12.3 Prohibition on Unaudited Access

The following constraint is absolute:

- No access to patient data may occur without corresponding audit record
- No access decision may be made without audit logging
- No confirmation or commitment may proceed without audit record
- Failure to create an audit record must result in access denial (fail-closed)

---

## 13. Explicitly Blocked Activities

The following activities are explicitly blocked under this document:

| # | Blocked Activity | Clarification |
|---|------------------|---------------|
| 1 | **Enabling execution** | No execution capability may be enabled by this document |
| 2 | **Background jobs or automation** | No background processing that affects identity or access state |
| 3 | **Auto-confirmation** | No automatic confirmation of proposals without human action |
| 4 | **Assistant-triggered actions** | No assistant may trigger state changes or execution |
| 5 | **Persisting inferred consent** | No consent record may be created from inference |
| 6 | **Cross-tenant queries** | No query may access data across tenant boundaries |
| 7 | **Anonymous access to protected data** | No access to patient data without authenticated identity |
| 8 | **Unattributed access** | No access without attribution to a specific actor |
| 9 | **Storing plaintext credentials** | No storage of credentials or secrets in plaintext |
| 10 | **Production access by this document** | No production system access is authorised by this document |
| 11 | **Temporary bypass mechanisms** | No mechanism may bypass identity, consent, or authorisation checks |
| 12 | **Silent privilege elevation** | No elevation of privileges without explicit action and audit |
| 13 | **Session transfer between actors** | No session may be transferred from one actor to another |
| 14 | **Cross-patient data visibility** | No actor may view or infer another patient's data |
| 15 | **AI-based authorisation decisions** | No AI system may make or influence access decisions |
| 16 | **Time-based automatic consent** | No consent grant may be created by passage of time |
| 17 | **Bulk consent operations** | No bulk granting or revoking of consent |
| 18 | **Delegation of clinical authority to assistants** | No assistant may hold or exercise clinical authority |
| 19 | **Unlogged access decisions** | No access decision may proceed without audit logging |
| 20 | **External identity federation activation** | No external identity provider integration is authorised |

---

## 14. Closing Governance Statement

This document constitutes an identity, authentication, and trust boundaries design artifact for the Zenthea platform.

**This document authorises NOTHING operational.**

Specifically, this document does not authorise:

- Deployment of any identity or authentication system
- Activation of any session management capability
- Implementation of any authorisation enforcement
- Access to or modification of production identity data
- Enablement of any consent enforcement mechanism
- Activation of any trust boundary enforcement
- Transition from design to operational identity management

All operational enablement remains subject to future governance decisions and explicit authorisation instruments that are outside the scope of this document.

**Execution remains BLOCKED.**

The transition from identity and access design to operational implementation requires separate governance authorisation that must:

- Document specific identity and access capabilities being enabled
- Define authentication methods, session policies, and authorisation rules
- Specify consent enforcement mechanisms and audit requirements
- Undergo architecture and governance review
- Be approved through documented governance processes
- Be recorded as a versioned governance artifact

Any move to implementation requires separate governance approval not provided by this instrument.

This document is effective as of the declaration date and remains in force until superseded by subsequent governance instruments.

---

*Document Classification: Implementation Planning Artifact*
*Scope: Phase X-03 Identity, Authentication, and Trust Boundaries (Design-Only)*
*Authority: Design Guidance Only; No Operational Authority Granted*
