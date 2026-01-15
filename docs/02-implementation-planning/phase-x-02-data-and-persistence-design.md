# Phase X-02: Data and Persistence Design (Schemas Only)

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

This document is a data and persistence design artifact. It defines canonical data objects, classification rules, persistence boundaries, and schema constraints for future implementation of the Zenthea platform.

**Execution is explicitly NOT ENABLED.**

No operational capability, runtime activation, deployment authority, schema migration, or live persistence change is granted by this document. All content represents design decisions and planning guidance only. The transition from planning to execution requires separate governance authorisation not provided by this instrument.

This document defines schemas only. No live persistence changes are authorised.

---

## 2. Purpose of This Document

This document exists to:

- Define canonical data objects and their structural requirements for all platform domains
- Establish data classification rules that govern mutability, immutability, and append-only semantics
- Define identity and consent persistence boundaries that protect patient autonomy and data integrity
- Establish the proposal versus committed record model that governs all state transitions
- Define audit and evidence model requirements for regulatory compliance and forensic review
- Establish multi-tenant isolation requirements at the data layer
- Define data access and mutation constraints that enforce human-in-the-loop requirements
- Document failure, rollback, and recovery semantics at the data level
- Enumerate explicitly blocked activities during the design phase
- Provide a governance reference for architecture review and regulatory audit

This document does not:

- Authorise any form of operational deployment
- Enable any runtime behaviour or system activation
- Prescribe specific technologies, vendors, or tooling choices
- Establish implementation timelines or delivery schedules
- Grant authority to execute any described capability
- Authorise schema migrations or live database changes
- Permit access to production data systems

---

## 3. Binding Authorities and Dependencies

This document is subordinate to and governed by the following binding authorities:

| Document | Location | Authority Level |
|----------|----------|-----------------|
| Architecture Baseline Declaration | `docs/01-architecture/architecture-baseline-declaration.md` | Binding (Frozen) |
| Phase W Execution Design Lock | `docs/01-architecture/phase-w-execution-design-lock.md` | Binding (Locked) |
| Execution Architecture Plan | `docs/01-architecture/execution-architecture-plan.md` | Binding |
| Phase X-01: Execution Implementation Plan | `docs/02-implementation-planning/phase-x-01-execution-implementation-plan.md` | Binding |
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
- Phase X-01 defines module boundaries and execution enforcement requirements
- Integration Slices 01–05 define domain-specific boundaries, responsibilities, and prohibitions

This document may not contradict, override, or relax any constraint defined in the binding authorities.

---

## 4. Data Domains (Canonical Objects)

The following canonical data objects represent the core data structures for the platform. These definitions describe conceptual structure and required fields; they do not prescribe implementation.

### 4.1 Patient

Represents a verified patient identity within the platform.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Patient Identifier | Unique, immutable identifier | Immutable |
| Tenant Identifier | Tenant to which the patient belongs | Immutable |
| Identity Verification Status | Verified, Provisional, or Revoked | Mutable (governed) |
| Demographic Record Reference | Reference to demographic data | Mutable (patient-controlled) |
| Creation Timestamp | When the patient record was established | Immutable |
| Last Modified Timestamp | When the patient record was last updated | Mutable |

**Ownership:** Patient (via Patient Portal)
**Write Access:** Patient (profile updates); Identity Service (verification status)

### 4.2 Provider

Represents a verified clinical provider identity within the platform.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Provider Identifier | Unique, immutable identifier | Immutable |
| Tenant Identifier | Tenant to which the provider belongs | Immutable |
| Credential Verification Status | Verified, Provisional, or Revoked | Mutable (governed) |
| Role Assignments | Clinical roles and permissions | Mutable (admin-controlled) |
| Creation Timestamp | When the provider record was established | Immutable |
| Last Modified Timestamp | When the provider record was last updated | Mutable |

**Ownership:** Platform (tenant-scoped)
**Write Access:** Identity Service; Administrative Surfaces

### 4.3 Clinic / Tenant

Represents an organisational boundary within the platform.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Tenant Identifier | Unique, immutable identifier | Immutable |
| Organisation Name | Display name for the tenant | Mutable |
| Configuration Reference | Reference to tenant configuration | Mutable |
| Status | Active, Suspended, or Terminated | Mutable (platform-controlled) |
| Creation Timestamp | When the tenant was established | Immutable |

**Ownership:** Platform
**Write Access:** Platform Administration

### 4.4 Consent Grant

Represents an explicit consent given by a patient for data access.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Grant Identifier | Unique identifier for the grant | Immutable |
| Patient Identifier | The patient granting consent | Immutable |
| Grantee Identifier | The provider or service receiving consent | Immutable |
| Scope Definition | Specific data or actions covered | Immutable |
| Valid From | Effective start date | Immutable |
| Valid Until | Expiration date (if applicable) | Immutable |
| Revocation Status | Active or Revoked | Mutable (patient-controlled) |
| Revocation Timestamp | When revocation occurred (if applicable) | Immutable (set once) |
| Creation Timestamp | When the grant was created | Immutable |
| Granting Action Reference | Reference to the granting audit event | Immutable |

**Ownership:** Patient
**Write Access:** Patient (via Patient Portal)

### 4.5 Session / Identity Assertion

Represents an authenticated session within the platform.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Session Identifier | Unique session identifier | Immutable |
| Identity Identifier | The authenticated identity | Immutable |
| Identity Type | Patient, Provider, or System | Immutable |
| Tenant Context | Tenant scope for the session | Immutable |
| Authentication Method | Method used for authentication | Immutable |
| Session Start | When the session began | Immutable |
| Session Expiry | When the session expires | Immutable |
| Termination Status | Active, Expired, or Terminated | Mutable |
| Termination Timestamp | When termination occurred (if applicable) | Immutable (set once) |

**Ownership:** Platform (Identity Service)
**Write Access:** Identity Service

### 4.6 Scheduling Proposal

Represents a record of intent to schedule that has not been confirmed.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Proposal Identifier | Unique proposal identifier | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Patient Identifier | The patient requesting scheduling | Immutable |
| Requested Service | Service or appointment type | Immutable |
| Requested Time | Proposed date and time | Immutable |
| Requesting Surface | Surface that created the proposal | Immutable |
| Requesting Actor | Identity that initiated the proposal | Immutable |
| Assistant Attribution | Whether prepared by assistant (if applicable) | Immutable |
| Proposal Status | Pending, Confirmed, Rejected, Withdrawn, Expired | Mutable (governed) |
| Status Change Timestamp | When status last changed | Mutable |
| Creation Timestamp | When the proposal was created | Immutable |
| Expiry Timestamp | When the proposal expires if not acted upon | Immutable |

**Ownership:** Platform (Scheduling Service)
**Write Access:** Surfaces (create); Authorised humans (status changes)

### 4.7 Confirmed Appointment

Represents a committed allocation of time and resources.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Appointment Identifier | Unique appointment identifier | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Patient Identifier | The scheduled patient | Immutable |
| Provider Identifier | The assigned provider | Immutable |
| Service Type | Appointment type or service | Immutable |
| Scheduled Start | Confirmed start time | Immutable |
| Scheduled End | Confirmed end time | Immutable |
| Confirmation Source | Proposal that was confirmed | Immutable |
| Confirming Actor | Human who confirmed the appointment | Immutable |
| Confirmation Timestamp | When confirmation occurred | Immutable |
| Appointment Status | Confirmed, Completed, Cancelled, No-Show | Mutable (governed) |
| Status Change Actor | Human who changed status (if applicable) | Immutable (per change) |
| Status Change Timestamp | When status changed | Mutable |
| Creation Timestamp | When the appointment was created | Immutable |

**Ownership:** Platform (Scheduling Service)
**Write Access:** Authorised humans (via Provider Portal)

### 4.8 Order Proposal

Represents a draft clinical or operational order awaiting confirmation.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Order Proposal Identifier | Unique proposal identifier | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Patient Identifier | The patient subject of the order | Immutable |
| Ordering Provider | The provider creating the order | Immutable |
| Order Type | Category of order (referral, prescription, diagnostic, etc.) | Immutable |
| Order Content | Structured order details | Mutable (pre-confirmation only) |
| Assistant Attribution | Whether prepared by assistant (if applicable) | Immutable |
| Proposal Status | Draft, Pending Review, Confirmed, Rejected, Withdrawn | Mutable (governed) |
| Status Change Timestamp | When status last changed | Mutable |
| Creation Timestamp | When the proposal was created | Immutable |

**Ownership:** Platform (Order Service)
**Write Access:** Authorised clinicians (create, modify drafts)

### 4.9 Confirmed Order

Represents a committed clinical or operational order.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Order Identifier | Unique order identifier | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Patient Identifier | The patient subject of the order | Immutable |
| Ordering Provider | The provider who confirmed the order | Immutable |
| Order Type | Category of order | Immutable |
| Order Content | Structured order details (frozen at confirmation) | Immutable |
| Proposal Source | Order proposal that was confirmed | Immutable |
| Confirming Actor | Human who confirmed the order | Immutable |
| Confirmation Timestamp | When confirmation occurred | Immutable |
| Order Status | Confirmed, Pending Execution, Executed, Cancelled | Mutable (governed) |
| Status Change Actor | Human who changed status (if applicable) | Immutable (per change) |
| Status Change Timestamp | When status changed | Mutable |
| Creation Timestamp | When the committed order was created | Immutable |

**Ownership:** Platform (Order Service)
**Write Access:** Authorised clinicians (status changes only)

### 4.10 Message Draft

Represents a draft message awaiting human review and send confirmation.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Draft Identifier | Unique draft identifier | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Author Identifier | The identity authoring the message | Immutable |
| Author Type | Patient, Provider, or Assistant | Immutable |
| Recipient Identifier | Intended recipient | Mutable (pre-send only) |
| Message Content | Draft message body | Mutable (pre-send only) |
| Assistant Attribution | Whether prepared by assistant (if applicable) | Immutable |
| Draft Status | Draft, Sent, Discarded | Mutable (governed) |
| Creation Timestamp | When the draft was created | Immutable |
| Last Modified Timestamp | When the draft was last updated | Mutable |

**Ownership:** Author
**Write Access:** Author (via respective portal)

### 4.11 Message Sent (Committed)

Represents a committed message that has been delivered.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Message Identifier | Unique message identifier | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Sender Identifier | The identity who sent the message | Immutable |
| Sender Type | Patient, Provider | Immutable |
| Recipient Identifier | The recipient | Immutable |
| Message Content | Message body (frozen at send) | Immutable |
| Draft Source | Draft that was sent (if applicable) | Immutable |
| Send Confirmation Actor | Human who confirmed send | Immutable |
| Send Timestamp | When the message was sent | Immutable |
| Delivery Status | Sent, Delivered, Read | Mutable |
| Read Timestamp | When the message was read (if applicable) | Immutable (set once) |

**Ownership:** Platform (Messaging Service)
**Write Access:** System (delivery status updates only)

### 4.12 Clinical Document Draft

Represents a draft clinical document awaiting clinician review and commitment.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Draft Identifier | Unique draft identifier | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Patient Identifier | The patient subject of the document | Immutable |
| Author Identifier | The identity authoring the document | Immutable |
| Author Type | Provider or Assistant | Immutable |
| Document Type | Category of clinical document | Immutable |
| Document Content | Draft document body | Mutable (pre-commit only) |
| Assistant Attribution | Whether prepared by assistant (if applicable) | Immutable |
| Draft Status | Draft, Committed, Discarded | Mutable (governed) |
| Creation Timestamp | When the draft was created | Immutable |
| Last Modified Timestamp | When the draft was last updated | Mutable |

**Ownership:** Author
**Write Access:** Authorised clinicians (via Provider Portal)

### 4.13 Clinical Document Committed

Represents a committed clinical document that is part of the patient's official record.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Document Identifier | Unique document identifier | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Patient Identifier | The patient subject of the document | Immutable |
| Authoring Provider | The clinician who committed the document | Immutable |
| Document Type | Category of clinical document | Immutable |
| Document Content | Document body (frozen at commit) | Immutable |
| Draft Source | Draft that was committed (if applicable) | Immutable |
| Committing Actor | Human who confirmed commitment | Immutable |
| Commit Timestamp | When the document was committed | Immutable |
| Release Status | Unreleased, Released to Patient | Mutable (governed) |
| Release Timestamp | When released to patient (if applicable) | Immutable (set once) |
| Amendment References | References to any amendments | Append-only |

**Ownership:** Platform (Documentation Service)
**Write Access:** Authorised clinicians (release status only); Amendments via separate records

### 4.14 Amendment (Append-Only)

Represents a correction or addendum to a committed clinical document.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Amendment Identifier | Unique amendment identifier | Immutable |
| Original Document Identifier | The document being amended | Immutable |
| Tenant Identifier | Tenant scope | Immutable |
| Patient Identifier | The patient subject of the amendment | Immutable |
| Amending Provider | The clinician creating the amendment | Immutable |
| Amendment Type | Correction, Addendum, or Clarification | Immutable |
| Amendment Content | Amendment body | Immutable |
| Amendment Reason | Stated reason for amendment | Immutable |
| Confirmation Actor | Human who confirmed the amendment | Immutable |
| Confirmation Timestamp | When the amendment was confirmed | Immutable |

**Ownership:** Platform (Documentation Service)
**Write Access:** Authorised clinicians (create only; no modification after creation)

### 4.15 Audit Event (Append-Only)

Represents an immutable record of a platform action or access decision.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Event Identifier | Unique event identifier | Immutable |
| Correlation Identifier | Links related events across services | Immutable |
| Tenant Identifier | Tenant scope (if applicable) | Immutable |
| Actor Identifier | The identity performing the action | Immutable |
| Actor Type | Patient, Provider, System, or Assistant | Immutable |
| Action Type | Category of action performed | Immutable |
| Action Scope | Specific operation or access | Immutable |
| Target Resource | Resource affected by the action | Immutable |
| Target Patient | Patient context (if applicable) | Immutable |
| Outcome | Success, Failure, or Denied | Immutable |
| Timestamp | When the event occurred | Immutable |
| Session Reference | Session in which the action occurred | Immutable |
| Additional Context | Structured metadata (JSON or equivalent) | Immutable |

**Ownership:** Platform (Audit Service)
**Write Access:** System only (automatic on action)

### 4.16 Execution Readiness Evidence (Append-Only)

Represents evidence of readiness verification for execution enablement.

| Attribute | Description | Classification |
|-----------|-------------|----------------|
| Evidence Identifier | Unique evidence identifier | Immutable |
| Domain | The execution domain being verified | Immutable |
| Evidence Type | Category of evidence | Immutable |
| Evidence Content | Structured evidence data | Immutable |
| Verification Actor | Human or system that verified | Immutable |
| Verification Timestamp | When verification occurred | Immutable |
| Gate Reference | Execution gate being satisfied | Immutable |
| Outcome | Pass, Fail, or Pending | Immutable |

**Ownership:** Platform (Governance Service)
**Write Access:** Authorised governance processes only

---

## 5. Data Classification Rules

All data objects within the platform are classified according to the following mutability rules.

### 5.1 Immutable Data

Immutable data may not be modified after initial creation. Attempts to modify immutable fields must be rejected at the persistence layer.

**Characteristics:**
- Set once at record creation
- No update operations permitted
- Deletion prohibited (except under explicit regulatory or legal requirement with governance approval)
- Forms the foundation for audit integrity

**Examples:**
- All identifier fields
- Timestamps recording when events occurred
- Confirmed document and order content
- Audit event records

### 5.2 Mutable Data

Mutable data may be modified under governed conditions. All mutations require explicit human confirmation and produce audit records.

**Characteristics:**
- Changes permitted within defined governance rules
- All changes must be attributed to a confirming human
- All changes must be logged with full context
- State transitions must follow defined workflows

**Examples:**
- Proposal and appointment status fields
- Draft content (pre-commitment only)
- Patient profile fields under patient control
- Session termination status

### 5.3 Append-Only Data

Append-only data structures permit only the addition of new records. Existing records may not be modified or deleted.

**Characteristics:**
- New records may be added
- Existing records may not be updated
- Existing records may not be deleted
- Provides immutable history for audit and compliance

**Examples:**
- Audit events
- Clinical document amendments
- Execution readiness evidence
- Consent grant history (revocation adds status, does not delete grant)

### 5.4 Prohibited-to-Store Data

The following categories of data are explicitly prohibited from persistence within the platform.

| Prohibited Category | Rationale |
|---------------------|-----------|
| Inferred consent records | Consent must be explicitly granted; inferred consent may not be recorded |
| AI-generated clinical recommendations stored as authoritative | AI output is advisory only; clinical authority requires human confirmation |
| Cross-tenant aggregated patient data | Tenant isolation must be maintained; cross-tenant aggregation is prohibited |
| Unattributed clinical records | All clinical records must be attributed to a confirming human |
| Automatically confirmed proposals | Proposals require human confirmation; auto-confirmation records are prohibited |
| Plaintext credentials or secrets | Authentication secrets must be stored in secure credential stores, not in application data |
| External patient identifiers without governance | External identifiers require explicit governance approval for storage |
| Silently promoted proposal-to-committed records | The transition must be explicit and auditable |

---

## 6. Identity and Consent Persistence Boundaries

This section defines what identity and consent data must and must not be persisted.

### 6.1 What MUST Be Persisted

| Data Category | Persistence Requirement | Rationale |
|---------------|-------------------------|-----------|
| Explicit consent grants | Full record with all attributes | Legal and regulatory requirement |
| Consent revocations | Revocation timestamp and actor | Audit trail for consent lifecycle |
| Identity verification events | Verification method, timestamp, outcome | Security and compliance audit |
| Session establishment and termination | Session lifecycle for security review | Forensic capability |
| All consent grant changes | Append-only history | Patient rights and regulatory compliance |
| Consent scope definitions | Explicit scope for each grant | Enforce access boundaries |

### 6.2 What MUST NOT Be Persisted

| Data Category | Prohibition | Rationale |
|---------------|-------------|-----------|
| Inferred consent records | Absolute prohibition | Consent must be explicit; inference creates false records |
| Assumed consent from user behaviour | Absolute prohibition | Behaviour does not constitute consent |
| Predicted consent based on patterns | Absolute prohibition | Prediction is not consent |
| Consent derived from context | Absolute prohibition | Context does not grant consent |
| Blanket or general consent records | Absolute prohibition | Consent must be specific and scoped |
| Consent with undefined scope | Absolute prohibition | Scope must be explicit |
| Consent without patient attribution | Absolute prohibition | Patient must be identifiable |

### 6.3 Explicit Ban on Inferred Consent Records

No system, process, or data layer may create, store, or maintain consent records that are inferred, assumed, predicted, or derived from any source other than explicit patient action. This prohibition is absolute and applies regardless of:

- Operational efficiency considerations
- Historical patterns
- User interface design constraints
- Technical convenience
- Third-party integration requirements

Any record that purports to represent consent must trace directly to an explicit, affirmative patient action recorded with full attribution.

---

## 7. Proposal vs Committed Record Model

This section defines the structural requirements for proposal and committed records and the linkage between them.

### 7.1 Required Fields for Proposals

All proposal records (scheduling proposals, order proposals, message drafts, document drafts) must include:

| Field Category | Required Fields |
|----------------|-----------------|
| Identity | Unique proposal identifier; tenant identifier |
| Attribution | Requesting actor; requesting surface; assistant attribution (if applicable) |
| Content | Proposal-specific content fields |
| Temporal | Creation timestamp; expiry timestamp (where applicable) |
| Status | Proposal status; status change timestamp |
| Linkage | No linkage to committed record until confirmation occurs |

### 7.2 Required Fields for Committed Records

All committed records (confirmed appointments, confirmed orders, sent messages, committed documents) must include:

| Field Category | Required Fields |
|----------------|-----------------|
| Identity | Unique committed record identifier; tenant identifier |
| Source | Reference to source proposal (if applicable) |
| Confirmation | Confirming actor; confirmation timestamp |
| Content | Committed content (frozen at confirmation) |
| Status | Record status; status change tracking |
| Audit | Correlation identifier linking to audit events |

### 7.3 Required Linkage Between Proposals and Committed Records

The relationship between proposals and committed records must satisfy:

| Requirement | Description |
|-------------|-------------|
| Explicit Reference | Committed records must reference their source proposal |
| One-to-One Confirmation | A proposal may be confirmed at most once |
| No Orphan Commits | Committed records created through the proposal workflow must reference a valid proposal |
| Preserved Proposal | The source proposal remains available for audit after confirmation |
| Distinct Records | Proposals and committed records are separate entities with separate identifiers |

### 7.4 Explicit Prohibition on Silent Promotion

The following behaviours are prohibited:

| Prohibited Behaviour | Clarification |
|----------------------|---------------|
| Silent promotion from proposal to committed | No proposal may transition to committed state without explicit human confirmation |
| In-place status change masquerading as confirmation | Status changes do not substitute for creating a committed record |
| Background confirmation processes | No automated background process may confirm proposals |
| Time-triggered confirmation | Passage of time does not confirm proposals |
| Implicit confirmation from inaction | Inaction does not constitute confirmation |
| Bulk confirmation | Each proposal requires individual human confirmation |

The transition from proposal to committed record requires:

1. Explicit human action by an authorised individual
2. Creation of a new committed record with distinct identifier
3. Recording of confirmation actor and timestamp
4. Linkage from committed record to source proposal
5. Audit event recording the confirmation action
6. No modification of the source proposal content

---

## 8. Audit and Evidence Model

This section defines the required structure and constraints for audit and evidence records.

### 8.1 Required Audit Event Fields

All audit events must include the following fields:

| Field | Description | Requirement |
|-------|-------------|-------------|
| Event Identifier | Unique identifier for the event | Mandatory |
| Correlation Identifier | Links related events across services and surfaces | Mandatory |
| Timestamp | Precise time of event occurrence | Mandatory |
| Actor Identifier | Identity performing the action | Mandatory |
| Actor Type | Category of actor (Patient, Provider, System, Assistant) | Mandatory |
| Tenant Identifier | Tenant context (if applicable) | Mandatory where tenant-scoped |
| Action Type | Category of action performed | Mandatory |
| Action Scope | Specific operation or access decision | Mandatory |
| Target Resource | Resource affected by the action | Mandatory |
| Target Patient | Patient context for patient-related actions | Mandatory where patient-scoped |
| Outcome | Result of the action (Success, Failure, Denied) | Mandatory |
| Session Reference | Session in which the action occurred | Mandatory for session-scoped actions |

### 8.2 Append-Only Enforcement Principle

Audit records are append-only. The following constraints apply:

| Constraint | Description |
|------------|-------------|
| No Update | Audit events may not be modified after creation |
| No Delete | Audit events may not be deleted under any circumstance |
| No Truncation | Audit logs may not be truncated or compacted |
| Immutable Storage | Audit storage must enforce immutability at the persistence layer |
| Sequential Integrity | Audit events must maintain sequential integrity; gaps are detectable |
| Tamper Evidence | Any tampering attempt must be detectable through integrity verification |

### 8.3 Retention Policy

Retention policy for audit records is declared as governance-controlled and out of scope for this document.

- Retention periods are determined by regulatory requirements and governance policy
- This document does not specify retention durations
- Retention configuration requires separate governance authorisation
- Retention policy changes require documented governance approval

---

## 9. Multi-Tenant Isolation Requirements

This section defines data-level requirements for tenant isolation.

### 9.1 Tenant Scoping Fields

All tenant-scoped data objects must include:

| Field | Description |
|-------|-------------|
| Tenant Identifier | Unique identifier for the tenant |
| Tenant Identifier Immutability | Tenant identifier may not be changed after record creation |
| Mandatory Tenant Context | Tenant identifier is required for all tenant-scoped operations |

### 9.2 Cross-Tenant Query Prohibition

The following cross-tenant operations are prohibited at the data layer:

| Prohibition | Description |
|-------------|-------------|
| Cross-tenant reads | No query may return data from multiple tenants |
| Cross-tenant writes | No operation may write to data in a different tenant context |
| Cross-tenant joins | No query may join data across tenant boundaries |
| Cross-tenant aggregations | No aggregation may combine data from multiple tenants |
| Tenant identifier omission | Queries must specify tenant context; open queries are prohibited |
| Tenant identifier override | No mechanism may bypass tenant scoping |

### 9.3 No Shared Mutable State Across Tenants

The following constraints ensure tenant isolation:

| Constraint | Description |
|------------|-------------|
| No shared data records | Each data record belongs to exactly one tenant |
| No shared sequences | Identifier generation must be tenant-scoped or globally unique |
| No cross-tenant references | Foreign key relationships may not cross tenant boundaries |
| Isolated configuration | Tenant configuration is tenant-scoped |
| Isolated audit trails | Audit queries are tenant-scoped (except platform-level audit) |

---

## 10. Data Access and Mutation Constraints

This section defines constraints on data access and mutation operations.

### 10.1 Reads vs Writes Separation

All data operations must maintain strict separation between read and write paths:

| Principle | Description |
|-----------|-------------|
| Separate interfaces | Read operations and write operations are accessed through distinct interfaces |
| Independent authorisation | Read authorisation and write authorisation are evaluated independently |
| Read operations are non-mutating | Read operations must not modify data as a side effect |
| Write operations require explicit declaration | All mutations must be explicitly declared, not hidden in read paths |

### 10.2 Human Confirmation Requirements for State Changes

All state-changing operations require human confirmation:

| Requirement | Description |
|-------------|-------------|
| Explicit confirmation | State changes require affirmative human action |
| Specific confirmation | Confirmation applies to a specific operation on specific data |
| Contemporaneous confirmation | Confirmation occurs at the time of the action |
| Attributed confirmation | Confirmation is logged with confirming identity |
| Separate confirmation step | Confirmation is distinct from drafting or preparation |

### 10.3 No Write Paths Authorised by This Document

**This document authorises no write paths.**

All write operations described herein represent design specifications for future implementation. No operational write path is enabled or authorised by this document. Write enablement requires separate governance authorisation through instruments not provided by this document.

| Explicit Statement | Clarification |
|--------------------|---------------|
| No production writes | No write operation to production data is authorised |
| No schema changes | No schema migration or alteration is authorised |
| No data migration | No movement or transformation of data is authorised |
| No test data writes to production | No test data may be written to production systems |

---

## 11. Failure, Rollback, and Recovery Semantics (Data-Level)

This section defines conceptual failure and recovery semantics at the data level.

### 11.1 Rollback for Mutable vs Append-Only Data

| Data Type | Rollback Semantics |
|-----------|-------------------|
| Mutable data | Rollback restores previous state; change history is preserved in audit |
| Append-only data | Rollback is not applicable; compensation records are appended instead |
| Immutable data | Immutable data cannot be rolled back; it can only be superseded by new records |

### 11.2 Compensation Record Approach (Append-Only)

For append-only data structures, errors are addressed through compensation records:

| Principle | Description |
|-----------|-------------|
| No deletion | Erroneous append-only records are not deleted |
| Compensation records | Errors are addressed by appending compensation or correction records |
| Audit trail preservation | The original record and compensation record both remain in the audit trail |
| Attribution required | Compensation records require human attribution |
| Linkage required | Compensation records must reference the original record being compensated |

### 11.3 Kill-Switch Effect on Writes

The conceptual effect of kill-switch activation on data writes:

| State | Effect on Writes |
|-------|------------------|
| Kill-switch active | All write operations are rejected; system operates in read-only mode |
| Kill-switch granularity | Kill-switch may operate at global, domain, tenant, or module level |
| Pending writes | In-flight write operations are aborted; partial writes are not committed |
| Write queue | Queued writes are not processed until kill-switch is deactivated |
| Recovery state | Upon kill-switch deactivation, system resumes from consistent state |

---

## 12. Explicitly Blocked Activities

The following activities are explicitly blocked during the design phase governed by this document:

| # | Blocked Activity | Clarification |
|---|------------------|---------------|
| 1 | **Production data access** | No access to production data systems is authorised |
| 2 | **Schema migrations** | No migration of schemas to any environment is authorised |
| 3 | **Live schema changes** | No alteration of live database schemas is authorised |
| 4 | **Write enablement** | No write path to any data system is authorised |
| 5 | **Background processing** | No background data processing jobs are authorised |
| 6 | **Cross-environment data movement** | No movement of data between environments is authorised |
| 7 | **Data seeding** | No seeding of data to production or staging environments is authorised |
| 8 | **Index creation on live systems** | No index modifications to live systems is authorised |
| 9 | **Retention policy implementation** | No implementation of retention policies is authorised |
| 10 | **Backup and restore operations** | No backup or restore of production data is authorised by this document |
| 11 | **Data transformation jobs** | No ETL or data transformation is authorised |
| 12 | **Replication configuration** | No database replication setup is authorised |
| 13 | **Encryption key management** | No operational key management is authorised |
| 14 | **Access control implementation** | No implementation of database-level access controls is authorised |
| 15 | **Performance tuning on live systems** | No performance modifications to live systems is authorised |

---

## 13. Relationship to Other Artifacts

This document operates within and is subordinate to the existing architecture governance structure.

### Referenced Documents

| Artifact | Relationship |
|----------|--------------|
| Platform Integration Map | Orientation artifact defining integration topology and principles (`docs/00-overview/platform-integration-map.md`) |
| Integration Slice 01: Booking to Care | Defines canonical booking data objects referenced in scheduling sections |
| Integration Slice 02: Identity and Consent | Defines identity and consent models that govern persistence boundaries |
| Integration Slice 03: Assistant and AI Boundaries | Defines assistant attribution requirements reflected in schema fields |
| Integration Slice 04: Messaging and Clinical Documentation | Defines draft-to-committed lifecycle for messages and documents |
| Integration Slice 05: Scheduling, Orders, and Execution Readiness | Defines proposal-to-confirmed lifecycle for scheduling and orders |

### Non-Duplication Principle

This document does not duplicate content from binding artifacts. Where detail is required, this document references the authoritative source. Data object definitions herein provide persistence-specific attributes while deferring to integration slices for domain-specific behaviour definitions.

---

## 14. Closing Governance Statement

This document constitutes a data and persistence design artifact for the Zenthea platform.

**This document authorises NOTHING operational.**

Specifically, this document does not authorise:

- Access to production data systems
- Schema migrations to any environment
- Live schema changes or alterations
- Write operations to any data system
- Background data processing or transformation
- Cross-environment data movement
- Implementation of persistence infrastructure
- Enablement of any data access path
- Configuration of any database system
- Deployment of any data-related component

All operational enablement remains subject to future governance decisions and explicit authorisation instruments that are outside the scope of this document.

**Execution remains BLOCKED.**

The transition from design to operational data persistence requires separate governance authorisation that must:

- Document specific data operations being enabled
- Define access controls, audit requirements, and human-in-the-loop gates
- Undergo architecture and governance review
- Be approved through documented governance processes
- Be recorded as a versioned governance artifact

This document defines schemas only. No live persistence changes are authorised. Execution remains blocked unless and until separately authorised through documented governance processes outside the scope of this declaration.

---

*Document Classification: Implementation Planning Artifact*
*Scope: Phase X-02 Data and Persistence Design (Schemas Only)*
*Authority: Design Guidance Only; No Operational Authority Granted*
