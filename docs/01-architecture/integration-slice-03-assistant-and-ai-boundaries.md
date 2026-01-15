# Integration Slice 03: Assistant and AI Boundaries

**Access Boundaries, Responsibilities, and Prohibitions for AI-Based Intelligence Surfaces**

---

## 1. Status and Scope

| Field | Value |
|-------|-------|
| Status | Draft |
| Slice Identifier | IS-03 |
| Classification | Design and Integration Artifact |
| Execution | NOT Enabled |

This document is a design and integration artifact only. It defines access boundaries, responsibilities, and prohibitions for the Zenthea Assistant and any AI-based intelligence surfaces within the platform.

Execution is not enabled by this document. No runtime behaviour, system configuration, or operational change is authorised by its contents. This slice establishes boundaries and constraints; it does not grant authority for implementation or deployment.

---

## 2. Purpose of This Integration Slice

Assistant and AI access boundaries must be explicitly defined before any execution or automation is permitted. This is a regulatory and safety requirement, not a convenience.

This slice exists to:

- Define what assistant surfaces may and may not access across the platform
- Establish clear prohibitions on autonomous behaviour and AI-driven decision-making
- Ensure that all assistant interactions remain advisory, informational, or administrative without granting authority
- Document human-in-the-loop requirements for any action that affects patient data, clinical workflows, or system state
- Provide an audit-ready reference for regulators, clinicians, and governance bodies
- Prevent implicit delegation of clinical judgement to AI systems

Without this slice, no assistant or AI surface may be introduced to the platform. This document is a prerequisite for any assistant-related implementation work.

This slice does not prescribe how assistants shall be implemented. It prescribes what boundaries must hold, what behaviours are permitted, and what behaviours are prohibited.

---

## 3. Involved Product Surfaces

### 3.1 Patient Portal (Assistant View)

The Patient Portal may include assistant capabilities that help patients navigate their health information, understand care instructions, and access administrative functions.

**Constraints:**
- Assistant surfaces within the Patient Portal must operate within patient-scoped data boundaries
- No cross-patient data access under any circumstance
- No modification of clinical records, appointments, or consent without explicit patient confirmation
- Advisory information only; no clinical recommendations

### 3.2 Provider Portal (Assistant View)

The Provider Portal may include assistant capabilities that help clinical providers access patient information, summarise records, and navigate administrative workflows.

**Constraints:**
- Assistant surfaces within the Provider Portal must operate within the provider's authorised scope
- Subject to all consent boundaries defined in Integration Slice 02
- May summarise but must not interpret or recommend clinical actions
- No modification of clinical records without explicit provider confirmation

### 3.3 Operator and Governance Surfaces

Administrative and governance surfaces may include assistant capabilities for operational queries, audit access, and system monitoring.

**Constraints:**
- Must operate within operator role boundaries
- No access to patient-identifiable data unless explicitly authorised and logged
- Administrative queries only; no clinical data interpretation
- Subject to audit logging for all queries

### 3.4 External Intelligence Sources (Conceptual Only)

The platform may reference external clinical intelligence sources (such as drug databases, clinical guidelines, or reference materials) to support assistant responses.

**Constraints:**
- External sources may be referenced for informational purposes only
- No external source may be granted write access to platform data
- No external source may make or influence clinical decisions
- All external source references must be traceable and auditable
- This section is conceptual; no external intelligence integration is authorised by this document

---

## 4. Assistant Roles (Conceptual)

The following assistant roles define the conceptual categories of assistant behaviour within the platform. These roles describe function, not authority. No assistant role grants decision-making authority or permission to act autonomously.

### 4.1 Informational Assistant

An assistant operating in an informational role may provide read-only access to data the user is already authorised to view. The assistant may summarise, search, or present information but must not interpret clinical meaning or provide recommendations.

**Permitted:**
- Retrieve and display authorised data
- Summarise records for navigation purposes
- Answer factual questions about data the user may access

**Not Permitted:**
- Provide clinical interpretation
- Make recommendations
- Modify any data

### 4.2 Advisory Assistant

An assistant operating in an advisory role may provide non-binding suggestions or guidance based on platform policies, administrative rules, or general information. Advisory assistants must not provide clinical advice.

**Permitted:**
- Suggest next steps in administrative workflows
- Provide guidance on platform features and navigation
- Present policy information

**Not Permitted:**
- Provide clinical recommendations
- Substitute for clinical judgement
- Act on behalf of the user

### 4.3 Administrative Assistant

An assistant operating in an administrative role may prepare proposals for administrative actions (such as scheduling requests or message drafts) but must not execute those actions without explicit human confirmation.

**Permitted:**
- Draft messages or documents for review
- Prepare scheduling proposals
- Gather information for administrative tasks

**Not Permitted:**
- Send messages without confirmation
- Create or modify appointments without confirmation
- Execute any state-changing action autonomously

### 4.4 Role Clarification

These roles are descriptive categories for understanding assistant boundaries. They do not imply:

- Authority to act
- Delegation of responsibility
- Permission to bypass human confirmation
- Clinical competence or judgement capacity

---

## 5. Assistant Access Principles

The following principles govern all assistant access within the platform. These principles are non-negotiable and must be enforced regardless of assistant role or implementation approach.

### 5.1 Read-Only by Default

All assistant surfaces operate in read-only mode by default. Write access is not granted unless explicitly defined, scoped, and subject to human confirmation.

### 5.2 Proposal, Not Execution

Assistants may propose actions but must not execute them. All proposals require explicit human confirmation before taking effect. The distinction between proposal and execution must be maintained at all times.

### 5.3 Deterministic Access

Access decisions for assistant surfaces must be deterministic. Access must be based on verified identity, explicit consent, and defined rules. Access must not be based on AI inference, prediction, or probabilistic assessment.

### 5.4 No Implicit Authority

No assistant surface holds implicit authority. Authority must be explicitly granted, scoped, and documented. Absence of explicit prohibition does not constitute permission.

### 5.5 Scoped to User Context

Assistant access must be scoped to the authenticated user's existing authorisation. An assistant may not access data or perform actions beyond what the user could access or perform directly.

### 5.6 Audit Trail Required

All assistant interactions must be logged. The audit trail must include the query, the response, the data accessed, and the user context. Audit logs must be immutable and retained per regulatory requirements.

---

## 6. AI and External Intelligence Boundaries

This section defines strict boundaries for any use of AI capabilities or external intelligence sources within the platform.

### 6.1 Referencing External Clinical Intelligence

External clinical intelligence sources (such as drug interaction databases, clinical guidelines, or medical references) may be referenced to support informational responses. Such references must:

- Be presented as external reference material, not platform recommendations
- Include source attribution
- Be clearly distinguished from patient-specific data
- Not be used to generate clinical recommendations

### 6.2 Prohibition of Delegation of Judgement

Clinical judgement must not be delegated to AI systems. This prohibition includes:

- Diagnosis or differential diagnosis
- Treatment recommendations
- Medication selection or dosing
- Prognosis assessment
- Risk stratification for clinical purposes

AI systems may present information to support human judgement but must not substitute for it.

### 6.3 No Substitution of Clinician Decision-Making

No AI system, assistant, or automated process may substitute for clinician decision-making. This prohibition applies regardless of:

- Confidence level of AI output
- Apparent accuracy of AI predictions
- User request or preference
- Operational efficiency considerations

Clinicians must make clinical decisions. AI systems may support but must not replace this function.

### 6.4 Boundary Enforcement

These boundaries must be enforced at the platform level. No configuration, customisation, or user preference may override these prohibitions.

---

## 7. Data Access Rules

This section defines what assistant surfaces may and may not do with platform data.

### 7.1 What Assistants May Read

Assistants may read data that the authenticated user is authorised to access. This includes:

- Patient data (for the authenticated patient in Patient Portal)
- Patient data under care (for authorised providers in Provider Portal, subject to consent)
- Administrative data relevant to the user's role
- Public reference information

### 7.2 What Assistants May Summarise

Assistants may summarise data for navigation and comprehension purposes. Summaries must:

- Be factual representations of source data
- Not include clinical interpretation
- Not include recommendations
- Be clearly labelled as assistant-generated summaries

### 7.3 What Assistants May Reference

Assistants may reference:

- External clinical knowledge sources (with attribution)
- Platform documentation and help content
- Policy and procedural information
- General health information (non-personalised)

### 7.4 What Assistants Must Never Do

Assistants must never:

- **Write** clinical records, notes, or assessments
- **Mutate** existing data without explicit human confirmation
- **Dispatch** messages, notifications, or communications without explicit human confirmation
- **Persist** data beyond the immediate session without explicit authorisation
- **Create** appointments, orders, or clinical actions
- **Modify** consent grants or identity records
- **Delete** any data
- **Override** access controls or authorisation rules

---

## 8. Human-in-the-Loop Requirements

The following actions require explicit human confirmation and must not be performed autonomously by any assistant or AI surface.

### 8.1 Mandatory Human Confirmation

| Action Category | Human Confirmation Required |
|-----------------|----------------------------|
| Sending any message or communication | Yes |
| Creating or modifying appointments | Yes |
| Creating or modifying clinical records | Yes |
| Modifying consent grants | Yes |
| Submitting orders or requests | Yes |
| Sharing data with external parties | Yes |
| Elevating access privileges | Yes |
| Initiating any irreversible action | Yes |

### 8.2 Confirmation Requirements

Human confirmation must be:

- Explicit and affirmative (not assumed from inaction)
- Specific to the action being confirmed
- Logged in the audit trail
- Separate from the assistant interaction (distinct confirmation step)

### 8.3 No Bypass Mechanisms

No mechanism may bypass human-in-the-loop requirements. This prohibition applies to:

- Bulk actions
- Repeated actions
- Time-delayed actions
- Conditional actions
- Actions triggered by external events

---

## 9. Prohibited Behaviours

The following behaviours are explicitly prohibited for all assistant and AI surfaces within the platform.

### 9.1 Autonomous Execution

No assistant may execute state-changing actions without explicit human confirmation. Autonomous execution is prohibited regardless of:

- User configuration or preference
- Perceived urgency
- Historical patterns
- Confidence thresholds

### 9.2 AI-Based Authorisation

AI systems must not make authorisation decisions. Access control decisions must follow deterministic rules based on verified identity and explicit consent. No probabilistic or AI-inferred authorisation is permitted.

### 9.3 Silent Action

No assistant may perform actions without user visibility. All actions must be:

- Visible to the user
- Logged in the audit trail
- Subject to review

Silent or hidden actions are prohibited.

### 9.4 Background Automation

Assistants must not perform background automation. All assistant activity must be:

- In direct response to user interaction
- Visible to the user
- Bounded to the user session

Background processes, scheduled tasks, or automated workflows initiated by assistants are prohibited.

### 9.5 Voice-Triggered Execution

Voice interfaces, if introduced, must not trigger execution of state-changing actions. Voice interactions may:

- Query information
- Navigate interfaces
- Prepare proposals for confirmation

Voice interactions must not:

- Execute actions
- Modify data
- Bypass confirmation requirements

### 9.6 Implicit Learning from Patient Data

Assistants must not use patient data to train, improve, or modify AI models without explicit, specific consent that is separate from general platform consent.

---

## 10. Read vs Write Responsibility Matrix

The following table defines read and write permissions across assistant and user roles within the platform.

| Data Category | Assistant | Patient | Provider | System |
|---------------|-----------|---------|----------|--------|
| Patient Clinical Records | Read (scoped) | Read (own) | Read/Write (authorised) | Read (audit) |
| Appointment Data | Read (scoped) | Read (own) | Read/Write | Read/Write |
| Consent Grants | Read (scoped) | Read/Write (own) | Read (granted) | Read |
| Identity Records | Read (limited) | Read (own) | Read (limited) | Read/Write |
| Administrative Data | Read (scoped) | Read (own) | Read (scoped) | Read/Write |
| Audit Logs | None | Read (own) | Read (own actions) | Write |
| Assistant Interactions | None | Read (own) | Read (own) | Write |
| External Reference Data | Read | Read | Read | Read |

### 10.1 Matrix Clarifications

- **Assistant Read (scoped)**: Assistant may read only what the authenticated user is authorised to access
- **Assistant Write**: Assistants have no write permissions; all writes require human action
- **Patient Read/Write (own)**: Patients may read and modify their own consent grants and profile data
- **Provider Read/Write (authorised)**: Providers may read and write clinical data within their authorised scope and consent boundaries
- **System Read/Write**: Platform services may read and write as required for operation, subject to audit

---

## 11. Relationship to Other Architecture Artifacts

This integration slice operates within the context of the broader platform architecture and depends on foundational definitions from other slices.

### 11.1 Referenced Artifacts

| Artifact | Location | Relationship |
|----------|----------|--------------|
| Platform Integration Map | `docs/00-overview/platform-integration-map.md` | Defines overall integration topology and principles |
| Integration Slice 01: Booking to Care | `docs/01-architecture/integration-slice-01-booking-to-care.md` | Defines booking workflow; assistant surfaces may support but not execute booking actions |
| Integration Slice 02: Identity and Consent | `docs/01-architecture/integration-slice-02-identity-and-consent.md` | Defines identity and consent model; this slice depends on IS-02 for all access decisions |

### 11.2 Dependency on Identity and Consent

This slice depends on Integration Slice 02 (Identity and Consent). All assistant access decisions must respect:

- Identity verification requirements
- Consent grant boundaries
- Tenant isolation rules
- Cross-patient visibility prohibitions

No assistant capability may be introduced that does not comply with the identity and consent boundaries defined in IS-02.

### 11.3 Relationship Statement

This slice extends but does not modify other integration slices. All slices that involve assistant or AI capabilities must respect the boundaries defined herein. This slice is a prerequisite for any assistant-related implementation work.

---

## 12. Future Extension Points (Non-Binding)

The following extension points are identified for potential future consideration. These are non-binding observations and are explicitly out of scope for this slice. No implementation or deployment is authorised by their inclusion.

### 12.1 Voice Interfaces (Read-Only)

Future voice interfaces may provide read-only access to information within the boundaries defined in this slice. Voice interfaces would be subject to:

- All read-only constraints defined herein
- Prohibition on voice-triggered execution
- Human confirmation requirements for any proposed action
- Full audit logging

**Status:** Non-binding, out of scope, not authorised

### 12.2 Tool Invocation Under Explicit Human Control

Future assistant capabilities may include the ability to invoke platform tools (such as search, scheduling interfaces, or document generation) under explicit human control. Such capabilities would require:

- Explicit human initiation
- Visible tool invocation (no background operation)
- Human confirmation before any state change
- Bounded scope per invocation

**Status:** Non-binding, out of scope, not authorised

### 12.3 Structured Clinical Decision Support

Future capabilities may include structured clinical decision support that presents evidence-based information to clinicians. Such capabilities would:

- Present information only, not recommendations
- Require clinician review and judgement
- Not substitute for clinical decision-making
- Be subject to separate regulatory review

**Status:** Non-binding, out of scope, not authorised

### 12.4 Extension Governance

Any future extension to assistant or AI capabilities must:

- Be documented in separate, versioned integration slices or amendments
- Undergo architecture and regulatory review before implementation
- Maintain all prohibitions and boundaries defined in this document
- Preserve human-in-the-loop requirements without exception
- Be subject to clinical governance review where applicable

---

*End of Integration Slice 03*
