# Integration Slice 04: Messaging and Clinical Documentation Flow

**Boundaries, Responsibilities, and Governance for Messaging and Clinical Record Drafting**

---

## 1. Status and Scope

| Field | Value |
|-------|-------|
| Status | Draft |
| Slice Identifier | IS-04 |
| Classification | Design and Integration Artifact |
| Execution | NOT Enabled |

This document is a design and integration artifact only. It defines boundaries, responsibilities, and governance constraints for messaging and clinical documentation drafting within the Zenthea platform.

Execution is not enabled by this document. No runtime behaviour, system configuration, or operational change is authorised by its contents. This slice establishes boundaries and constraints; it does not grant authority for implementation or deployment.

---

## 2. Purpose of This Integration Slice

Messaging and clinical documentation are distinct domains with different risk profiles, governance requirements, and patient safety implications. Without clearly defined boundaries between draft and committed states, between proposal and execution, the platform cannot ensure:

- Patient safety through controlled clinical record management
- Communication integrity through governed message delivery
- Regulatory compliance through auditable documentation workflows
- Accountability through clear attribution of all actions

This slice exists to:

- Define the messaging domains within the platform and their distinct responsibilities
- Establish clear boundaries between draft states and committed states for both messages and clinical documentation
- Ensure that all drafts remain proposals without clinical authority until explicitly confirmed by authorised humans
- Document human-in-the-loop requirements for any action that results in message delivery or clinical record creation
- Provide an audit-ready reference for regulators, clinicians, and governance bodies
- Prevent implicit or accidental commitment of clinical documentation without human review

This slice does not prescribe how messaging or documentation shall be implemented. It prescribes what boundaries must hold, what behaviours are permitted, and what behaviours are prohibited.

---

## 3. Involved Product Surfaces

### 3.1 Patient Portal (Messaging View)

The Patient Portal provides authenticated patients with access to their own messaging capabilities for communication with their care team.

**Constraints:**
- Patients may compose and send messages within authorised communication channels
- Patients may view received messages from their care providers
- Patients may not access messages between other patients and providers
- Patients may not modify clinical documentation
- Patient-initiated messages are subject to delivery confirmation and audit logging

### 3.2 Provider Portal (Messaging and Documentation View)

The Provider Portal serves as the primary interface through which clinical providers manage patient communications and create clinical documentation.

**Constraints:**
- Providers may compose, review, and send messages to patients under their care
- Providers may create, review, and commit clinical documentation for patients under their care
- All provider communications and documentation actions are subject to audit logging
- Providers may not send messages or commit documentation on behalf of other providers without explicit delegation
- Cross-patient messaging is prohibited

### 3.3 Internal Clinical Communication Surfaces

Internal clinical communication surfaces facilitate provider-to-provider and staff-to-staff communication within the clinical workflow.

**Constraints:**
- Internal communications are scoped to authorised clinical staff within the same tenant
- Internal communications may reference patient context but must not expose patient data outside authorised boundaries
- Internal communications do not constitute clinical documentation unless explicitly committed as such
- All internal communications are subject to audit logging

### 3.4 Assistant Surfaces (Draft Preparation View)

Assistant surfaces may support messaging and documentation workflows through draft preparation capabilities.

**Constraints:**
- Assistants may prepare draft messages for human review
- Assistants may prepare draft clinical documentation summaries for human review
- Assistants must not send messages under any circumstance
- Assistants must not commit clinical documentation under any circumstance
- All assistant-generated drafts must be clearly labelled as assistant-generated
- Assistant access to patient data for drafting purposes is subject to all consent and access boundaries defined in Integration Slice 02

---

## 4. Messaging Domains and Responsibilities

The platform recognises three distinct messaging domains, each with specific responsibilities and constraints.

### 4.1 Patient Messaging

Patient messaging encompasses all communications between authenticated patients and their care providers.

**Characteristics:**
- Initiated by patients through the Patient Portal
- Delivered to authorised providers through the Provider Portal
- Subject to patient consent and access boundaries
- May contain patient-reported symptoms, questions, or administrative requests
- Does not constitute clinical documentation

**Responsibilities:**
- Patient Portal: Provide interface for message composition and delivery confirmation
- Provider Portal: Provide interface for message receipt and response
- Platform: Ensure delivery, audit logging, and access boundary enforcement

### 4.2 Provider Messaging

Provider messaging encompasses all communications initiated by clinical providers to patients.

**Characteristics:**
- Initiated by providers through the Provider Portal
- Delivered to patients through the Patient Portal
- Subject to provider authorisation and patient care relationship boundaries
- May contain care instructions, follow-up guidance, or administrative information
- Does not constitute clinical documentation unless explicitly committed as such

**Responsibilities:**
- Provider Portal: Provide interface for message composition, review, and delivery confirmation
- Patient Portal: Provide interface for message receipt and acknowledgement
- Platform: Ensure delivery, audit logging, and access boundary enforcement

### 4.3 Internal Clinical Communication

Internal clinical communication encompasses provider-to-provider and staff-to-staff communications within clinical workflows.

**Characteristics:**
- Initiated and received by authorised clinical staff
- Not directly visible to patients
- May reference patient context for care coordination
- Subject to tenant isolation and role-based access control
- Does not constitute clinical documentation unless explicitly committed as such

**Responsibilities:**
- Provider Portal: Provide interface for internal communication workflows
- Platform: Ensure audit logging, tenant isolation, and access boundary enforcement

---

## 5. Clinical Documentation Draft Lifecycle (Conceptual)

Clinical documentation within the platform follows a controlled lifecycle that distinguishes between draft states and committed states.

### 5.1 Draft State

A draft is a proposed clinical document that has not been committed to the clinical record. Drafts have the following properties:

- **No Clinical Authority**: Drafts do not constitute part of the patient's clinical record
- **Mutable**: Drafts may be modified, discarded, or revised without affecting the clinical record
- **Not Visible to Patients**: Drafts are not visible to patients until committed and released
- **Attributable**: Drafts are attributed to the author or system that created them
- **Transient**: Drafts may be retained for audit purposes but do not persist as clinical records

### 5.2 Committed State

A committed clinical document has been explicitly confirmed by an authorised clinician and becomes part of the patient's clinical record. Committed documents have the following properties:

- **Clinical Authority**: Committed documents constitute part of the patient's official clinical record
- **Immutable**: Committed documents may not be modified; corrections require amendment workflows
- **Visible to Patients**: Committed documents may be released to patients per policy and consent
- **Attributable**: Committed documents are attributed to the clinician who confirmed them
- **Permanent**: Committed documents are retained per regulatory requirements

### 5.3 Transition from Draft to Committed

The transition from draft to committed state requires:

- Explicit human confirmation by an authorised clinician
- Verification that the confirming clinician has authority to commit documentation for the patient
- Audit logging of the confirmation action including clinician identity, timestamp, and document reference
- No system, process, or assistant may execute this transition autonomously

---

## 6. Proposal vs Committed Record Boundary

This section defines the critical boundary between proposals (drafts) and committed records (clinical documentation, sent messages).

### 6.1 Proposals (Drafts)

Proposals are preparatory artifacts that represent intent or suggested content. Proposals include:

- Draft messages awaiting human review and send confirmation
- Draft clinical documentation awaiting human review and commit confirmation
- Summary drafts prepared by assistants for human review
- Pre-populated content suggestions for human consideration

**Properties of Proposals:**
- Have no operational effect until confirmed
- Do not enter the patient's clinical record
- Do not result in message delivery
- May be discarded without consequence
- Are clearly labelled as draft or proposed
- Are attributable to their source (human author or assistant)

### 6.2 Committed Records

Committed records are operational artifacts that have been explicitly confirmed by authorised humans and have taken effect. Committed records include:

- Sent messages (delivered to recipients)
- Committed clinical documentation (entered into clinical record)
- Finalised orders, referrals, or clinical actions

**Properties of Committed Records:**
- Have operational effect
- Are part of the patient's official record or communication history
- Cannot be silently modified or deleted
- Subject to regulatory retention requirements
- Attributable to the human who confirmed them

### 6.3 Boundary Enforcement

The boundary between proposals and committed records must be enforced at the platform level:

- No configuration, customisation, or user preference may allow automatic transition from draft to committed
- Human confirmation must be explicit, affirmative, and logged
- The confirmation step must be distinct from the drafting step
- System failures must not result in accidental commitment of drafts

---

## 7. Assistant Participation Constraints

This section defines what assistant surfaces may and may not do within messaging and clinical documentation workflows.

### 7.1 What Assistants May Do

Assistants may support messaging and documentation workflows through the following activities:

| Activity | Description | Constraints |
|----------|-------------|-------------|
| Draft Messages | Prepare draft message content for human review | Must be labelled as assistant-generated; requires human review before send |
| Draft Documentation | Prepare draft clinical documentation summaries for human review | Must be labelled as assistant-generated; requires human review before commit |
| Summarise Records | Create summaries of existing clinical records for provider reference | Read-only; summaries do not modify records |
| Prepare Templates | Pre-populate templates with relevant patient context | Human must review and confirm all content |
| Suggest Content | Offer content suggestions during composition | Suggestions are advisory only; human controls final content |

### 7.2 What Assistants Must Never Do

The following activities are explicitly prohibited for all assistant surfaces:

| Prohibited Activity | Rationale |
|---------------------|-----------|
| Send Messages | Message delivery is a state-changing action requiring human confirmation |
| Commit Clinical Documentation | Clinical record commitment is a state-changing action requiring human confirmation |
| Modify Existing Clinical Documentation | Clinical records are immutable; modifications require authorised amendment workflows |
| Delete Messages or Documentation | Deletion is a state-changing action requiring human confirmation and audit |
| Dispatch Communications | All outbound communications require human confirmation |
| Auto-populate and Send | No "draft and send" automation is permitted |
| Bypass Human Review | All assistant-generated content must pass through human review |

### 7.3 Assistant Attribution Requirements

All content generated or prepared by assistants must be:

- Clearly labelled as assistant-generated at the point of creation
- Traceable to the assistant interaction that created it
- Distinguishable from human-authored content in the audit trail
- Subject to human review before any operational effect

---

## 8. Data Access and Mutation Rules

This section defines what operations are permitted on messaging and clinical documentation data.

### 8.1 Read Access

| Data Category | Patient | Provider | Assistant | System |
|---------------|---------|----------|-----------|--------|
| Patient Messages (Own) | Read | Read (authorised) | Read (scoped) | Read (audit) |
| Provider Messages (Received) | Read | Read (own) | Read (scoped) | Read (audit) |
| Internal Communications | None | Read (authorised) | None | Read (audit) |
| Draft Messages | Read (own) | Read (own) | Read (scoped) | Read (audit) |
| Committed Clinical Documentation | Read (own, released) | Read (authorised) | Read (scoped) | Read (audit) |
| Draft Clinical Documentation | None | Read (own) | Read (scoped) | Read (audit) |

### 8.2 Write Access

| Data Category | Patient | Provider | Assistant | System |
|---------------|---------|----------|-----------|--------|
| Patient Messages | Create, Send (own) | None | Draft Only | None |
| Provider Messages | None | Create, Send | Draft Only | None |
| Internal Communications | None | Create, Send | None | None |
| Clinical Documentation | None | Create, Commit | Draft Only | None |

### 8.3 Mutation Constraints

The following mutation constraints apply without exception:

- **No Silent Mutation**: All writes must be logged with full attribution
- **No Autonomous Mutation**: All state-changing writes require human confirmation
- **No Cross-Patient Mutation**: No user may modify another patient's messages or documentation
- **No Retroactive Mutation**: Committed records may not be modified; amendments create new records
- **No Assistant Mutation**: Assistants may create drafts only; assistants may not execute writes

---

## 9. Human-in-the-Loop Requirements

The following actions require explicit human confirmation and must not be performed autonomously by any system, process, or assistant.

### 9.1 Mandatory Human Confirmation

| Action | Human Confirmation Required | Confirming Role |
|--------|----------------------------|-----------------|
| Send patient message | Yes | Patient |
| Send provider message | Yes | Provider |
| Send internal communication | Yes | Clinical Staff |
| Commit clinical documentation | Yes | Authorised Clinician |
| Amend existing clinical documentation | Yes | Authorised Clinician |
| Release documentation to patient | Yes | Authorised Clinician |
| Delete draft messages | Yes | Draft Owner |
| Discard draft documentation | Yes | Draft Owner |

### 9.2 Confirmation Requirements

Human confirmation must be:

- **Explicit**: Requires affirmative action; silence or timeout does not constitute confirmation
- **Specific**: Confirmation applies to a specific action on specific content
- **Informed**: The human must have opportunity to review the content before confirmation
- **Logged**: The confirmation action must be recorded in the audit trail with timestamp and identity
- **Separate**: The confirmation step must be distinct from the drafting or preparation step

### 9.3 No Bulk Confirmation

Bulk confirmation of multiple messages or documentation items is prohibited. Each item requiring commitment must be individually reviewed and confirmed.

### 9.4 No Time-Based Confirmation

Confirmation may not be triggered by time delay or schedule. Drafts do not automatically become committed records after any period of time.

---

## 10. Prohibited Behaviours

The following behaviours are explicitly prohibited within all messaging and clinical documentation workflows.

### 10.1 Autonomous Message Delivery

No system, process, or assistant may deliver messages without explicit human confirmation. This prohibition applies regardless of:

- Message content or category
- Recipient type (patient, provider, staff)
- Perceived urgency or priority
- Pre-configured templates or workflows
- Historical patterns or user preferences

### 10.2 Autonomous Documentation Commitment

No system, process, or assistant may commit clinical documentation without explicit human confirmation. This prohibition applies regardless of:

- Documentation type or category
- Source of draft content
- Confidence level of AI-generated content
- Workflow configuration or user preference
- Time elapsed since draft creation

### 10.3 Silent Background Processing

No background process may create, modify, or commit messages or clinical documentation without user visibility. All documentation and messaging workflows must be:

- Initiated by explicit user action
- Visible to the user throughout the workflow
- Subject to user confirmation before any operational effect

### 10.4 Modification of Committed Records

No system, process, or user may modify committed clinical documentation. Corrections or updates to committed records must follow amendment workflows that:

- Create new amendment records rather than modifying original records
- Require explicit human confirmation
- Maintain full audit trail of original and amendment records
- Preserve the integrity of the original record

### 10.5 Cross-Patient Communication

No user may send messages or create documentation that is attributed to a different patient context. Messages and documentation must be scoped to the patient context in which they were created.

### 10.6 Impersonation

No system, process, or assistant may create or send messages that appear to originate from a human when they do not. All assistant-generated content must be clearly attributed as such.

---

## 11. Relationship to Other Architecture Artifacts

This integration slice operates within the context of the broader platform architecture and depends on foundational definitions from other slices.

### 11.1 Referenced Artifacts

| Artifact | Location | Relationship |
|----------|----------|--------------|
| Platform Integration Map | `docs/00-overview/platform-integration-map.md` | Defines overall integration topology and principles governing all surfaces |
| Integration Slice 01: Booking to Care | `docs/01-architecture/integration-slice-01-booking-to-care.md` | Defines the patient journey context within which messaging occurs |
| Integration Slice 02: Identity and Consent | `docs/01-architecture/integration-slice-02-identity-and-consent.md` | Defines identity verification and consent model; this slice depends on IS-02 for all access decisions |
| Integration Slice 03: Assistant and AI Boundaries | `docs/01-architecture/integration-slice-03-assistant-and-ai-boundaries.md` | Defines assistant capabilities and prohibitions; this slice extends assistant constraints for messaging and documentation contexts |

### 11.2 Dependency on Identity and Consent

This slice depends on Integration Slice 02 (Identity and Consent). All messaging and documentation access decisions must respect:

- Identity verification requirements for all participants
- Consent grant boundaries for patient data access
- Tenant isolation rules for provider and staff communications
- Cross-patient visibility prohibitions

No messaging or documentation capability may be introduced that does not comply with the identity and consent boundaries defined in IS-02.

### 11.3 Extension of Assistant Boundaries

This slice extends Integration Slice 03 (Assistant and AI Boundaries) with specific constraints for messaging and documentation contexts. The prohibitions defined in IS-03 apply in full; this slice adds messaging-specific and documentation-specific constraints that further restrict assistant behaviour within these domains.

### 11.4 Relationship Statement

This slice extends but does not modify other integration slices. All slices that involve messaging or clinical documentation must respect the boundaries defined herein. This slice is a prerequisite for any messaging or clinical documentation implementation work.

---

## 12. Future Extension Points (Non-Binding)

The following extension points are identified for potential future consideration. These are non-binding observations and are explicitly out of scope for this slice. No implementation or deployment is authorised by their inclusion.

### 12.1 Structured Message Templates

Future capabilities may include structured message templates for common communication patterns (appointment reminders, care instructions, follow-up scheduling). Such templates would:

- Require human review and confirmation before delivery
- Be pre-approved through governance review
- Not bypass human-in-the-loop requirements
- Be subject to full audit logging

**Status:** Non-binding, out of scope, not authorised

### 12.2 Documentation Quality Assistance

Future capabilities may include assistant-provided quality checks for clinical documentation (completeness verification, terminology consistency). Such capabilities would:

- Be advisory only, not mandatory
- Not modify documentation content
- Require human review and confirmation
- Not block human confirmation of documentation

**Status:** Non-binding, out of scope, not authorised

### 12.3 Patient-Initiated Documentation Contributions

Future capabilities may include patient-contributed information (symptom diaries, self-reported outcomes) that could be reviewed and incorporated into clinical documentation. Such capabilities would:

- Clearly distinguish patient-contributed content from clinician-authored content
- Require clinician review before incorporation into clinical records
- Not grant patients direct write access to clinical documentation
- Maintain full attribution and audit trail

**Status:** Non-binding, out of scope, not authorised

### 12.4 Secure Messaging with External Parties

Future capabilities may include secure messaging with external parties (specialists, pharmacies, insurance). Such capabilities would:

- Be subject to separate governance and compliance review
- Require explicit patient consent for external communication
- Maintain full audit trail of external communications
- Not relax any human-in-the-loop requirements

**Status:** Non-binding, out of scope, not authorised

### 12.5 Extension Governance

Any future extension to messaging or clinical documentation capabilities must:

- Be documented in separate, versioned integration slices or amendments
- Undergo architecture and regulatory review before implementation
- Maintain all prohibitions and boundaries defined in this document
- Preserve human-in-the-loop requirements without exception
- Be subject to clinical governance review where applicable

---

*End of Integration Slice 04*
