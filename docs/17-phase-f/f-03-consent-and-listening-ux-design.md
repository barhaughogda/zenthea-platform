# F-03 — Consent and Listening UX Design (Governance-Only)

**Document ID:** F-03-CLUX  
**Mode:** GOVERNANCE / PHASE F — UX DESIGN (Design-Only)  
**Status:** DRAFT (Design-Only; no implementation authorized)  
**Authority:** Platform Governance (Phase F)  
**Builds on:** Phase E (Non-Executing Orchestration), F-01 (Scheduling Execution Design), F-02 (Voice and Ambient Interaction Design)  

---

## 0. Document Intent and Constraints

This document is a **design-only governance artifact**. It defines how consent and listening state are communicated to users—patients, clinicians, and providers—for voice and transcription interactions. This document governs **user-visible consent and listening signals only**.

This document explicitly does NOT authorize:

- Any implementation of any kind (no code, no infrastructure, no integrations)
- Any API, schema, or contract definition
- Any UI component specifications, wireframes, or mockups
- Any mobile SDK or platform-specific implementation details
- Any ambient listening capability
- Any voice-triggered execution authority
- Any covert or implicit capture mechanisms

Interpretation SHALL be conservative:

- Any behavior not explicitly permitted by this design is **FORBIDDEN**.
- Any ambiguity or missing prerequisite is **BLOCKING**.
- **Fail-closed posture is mandatory.** When in doubt, deny.
- **Human consent must be explicit, visible, and auditable.**

---

## 1. Context and Dependencies

### 1.1 Relationship to Phase E (Non-Executing Orchestration)

Phase E established the foundational non-executing orchestration patterns that govern all platform interactions. This document inherits Phase E's core posture:

- **Deny-by-default**: No action proceeds without explicit authorization.
- **Fail-closed**: Missing identity, tenant scope, consent, or session context results in denial.
- **Metadata-only audit**: Sensitive operations are auditable without exposing payload content.
- **Non-executing outputs**: Proposals and drafts are advisory; they do not constitute commitment.

### 1.2 Relationship to F-01 (Scheduling Execution Design)

F-01 defines execution as irreversible external state change requiring explicit human approval. This document applies F-01's principles to consent and listening UX:

- **Approval is explicit and attributable**: Consent cannot be implied, inferred, or assumed.
- **Separation of intent from authority**: Expressing intent via voice does not confer execution authority.
- **Audit completeness**: Consent state and listening state transitions must be fully auditable.

### 1.3 Relationship to F-02 (Voice and Ambient Interaction Design)

F-02 defines the interaction modes and safety constraints for voice capture. This document operationalizes F-02's requirements at the UX layer:

- **Listening state must be visible**: Users must reliably determine listening state at all times.
- **No covert listening**: Silent, covert, or ambiguous listening is forbidden.
- **No implicit consent**: The absence of objection is not consent.
- **Fail-closed on ambiguity**: Uncertain consent or context results in denial.

### 1.4 Scope of This Document

This document governs **user-visible consent and listening signals only**. It defines:

- What users must see to understand consent state
- What users must see to understand listening state
- How the system communicates denial, failure, and error conditions
- What guarantees the platform makes to users about capture behavior

This document does NOT govern:

- The technical implementation of consent verification
- The backend audit infrastructure
- The speech-to-text processing pipeline
- Device-level permission mechanics

---

## 2. Design Goals

### 2.1 Trust-First UX

The primary goal of consent and listening UX is to establish and maintain user trust. Users must be able to trust that:

- The system behaves as it declares it will behave.
- The system captures audio only when the user has explicitly permitted capture.
- The system provides honest, accurate information about its state.
- The system does not engage in deceptive or ambiguous behavior.

Trust is a precondition for adoption. Absent trust, the platform cannot serve its clinical and patient care mission.

### 2.2 Zero Ambiguity About Listening State

Users must never be uncertain about whether the system is listening. This requires:

- **Unambiguous visual signals**: Listening state must be communicated through clear, persistent visual indicators.
- **Deterministic state transitions**: The system transitions between listening states only through explicit user actions or bounded timeouts.
- **No hidden states**: There are no listening states that are invisible to the user.

Ambiguity about listening state is a UX failure that undermines trust and creates compliance risk.

### 2.3 No Covert Capture

The platform MUST NOT capture audio without the user's knowledge. This prohibition is absolute:

- No background listening without visible indicators.
- No capture during states labeled as "not listening."
- No delayed activation that captures audio from before user initiation.
- No buffer capture of pre-initiation audio.

Covert capture is a trust violation, a potential regulatory violation, and a platform prohibition.

### 2.4 No Inferred Consent

Consent must be explicit. The following do NOT constitute consent:

- User presence in a room or proximity to a device.
- Failure to object or opt out.
- Prior consent to unrelated platform features.
- Prior use of voice features in previous sessions.
- Organizational policy or employment relationship.
- Clinical relationship or care context.

Consent must be affirmatively granted for each capture context.

### 2.5 UX as a Safety Boundary

Consent and listening UX is not decorative. It is a **safety boundary**:

- The UX layer is the user's primary means of understanding system behavior.
- The UX layer communicates governance decisions (deny, allow, error).
- The UX layer provides the evidence that supports audit and compliance.
- The UX layer is the point at which user trust is established or destroyed.

Design decisions in this domain have direct safety and compliance implications.

---

## 3. Consent Model

### 3.1 Explicit Consent vs Contextual Consent

**Explicit consent** is the only permitted consent model for voice capture. Explicit consent requires:

- A clear, unambiguous user action initiating capture (e.g., pressing a button, speaking a wake phrase that the user knowingly configured).
- User awareness that the action initiates capture.
- Capture limited to the scope declared at initiation time.

**Contextual consent** (the assumption that users consent based on context, role, or situation) is **forbidden**. The platform does not assume consent based on:

- The user being in a clinical setting.
- The user having previously used voice features.
- The user being authenticated to the platform.
- The user's role (clinician, provider, patient).
- The user's relationship to other consenting parties.

### 3.2 Session-Scoped Consent Only

Consent for voice capture is **session-scoped**:

- Consent applies only to the current capture session (a bounded window of capture initiated by explicit user action).
- Consent expires when the capture session ends.
- Consent does not persist across sessions.
- Consent does not carry forward to future interactions.

Each capture session requires its own consent initiation.

### 3.3 No Persistent or Evergreen Consent

The platform SHALL NOT implement persistent or evergreen consent for voice capture:

- No "remember my consent" settings that persist across sessions.
- No "always allow" toggles for voice capture.
- No organizational consent that applies to individual users without individual initiation.
- No default-on consent states.

Every capture session begins from a state of no consent. Consent must be re-established through explicit user action.

### 3.4 Consent Revocation Semantics

Users may revoke consent at any time during a capture session. Revocation semantics:

- **Immediate effect**: Revocation terminates capture immediately. There is no grace period.
- **Explicit feedback**: The system confirms revocation through visible state change.
- **No penalty**: Revocation does not result in loss of access to other platform features.
- **No pressure**: The system does not attempt to dissuade revocation or re-request consent immediately after revocation.
- **Auditable**: Revocation is recorded as a state transition in the audit trail.

Revocation mechanisms must be as accessible as initiation mechanisms.

---

## 4. Listening State Model

### 4.1 Defined Listening States

The platform recognizes exactly four listening states. These states are mutually exclusive; the system is in exactly one state at any time.

#### 4.1.1 Not Listening

**Definition:** The system is not capturing audio. The microphone is not active. No audio is being processed or transmitted.

**User expectation:** The user can speak freely without any capture occurring. Anything said in this state is not heard, recorded, or processed by the platform.

**Required indicators:** Clear visual indication that the system is in a passive state. No active listening iconography. No animation suggesting active processing.

#### 4.1.2 Armed (Ready but Inactive)

**Definition:** The system is prepared to begin capture upon explicit user initiation, but is not currently capturing. This state exists only in contexts where a wake mechanism is configured (e.g., push-to-talk ready state).

**User expectation:** The system is ready but not listening. Capture will begin only when the user takes the initiating action.

**Required indicators:** Clear visual indication distinguishing Armed from Active. The distinction must be unambiguous—users must not confuse "ready to listen" with "currently listening."

**Constraints:** Armed state does not involve any audio capture, buffering, or processing. It is a UI state only.

#### 4.1.3 Actively Listening

**Definition:** The system is capturing audio. The microphone is active. Audio is being processed or transmitted for transcription or intent detection.

**User expectation:** Anything said will be captured and processed by the platform. This is the only state in which capture occurs.

**Required indicators:** Prominent, unambiguous visual indication that capture is occurring. The indicator must be:

- **Visible**: Not hidden, minimized, or obscured.
- **Persistent**: Present for the duration of the listening state.
- **Distinct**: Clearly different from all other states.
- **Salient**: Noticeable without requiring the user to actively check.

#### 4.1.4 Processing (Post-Capture)

**Definition:** The capture window has ended. Audio capture has stopped. The system is processing the captured content (transcription, intent detection, governance evaluation).

**User expectation:** Capture has stopped; the user can speak freely without additional capture. The system is working on the captured content and will produce an outcome.

**Required indicators:** Visual indication that:

- Capture has ended.
- Processing is in progress.
- An outcome (proposal, draft, denial) is forthcoming.

### 4.2 Prohibited States

The following states are **forbidden** and SHALL NOT be implemented:

#### 4.2.1 Implicit Listening

A state where capture occurs without explicit user initiation. Forbidden because it violates the explicit consent requirement.

#### 4.2.2 Background Listening

A state where capture occurs while the user's attention is elsewhere or while the listening indicator is not visible. Forbidden because it violates the "no covert capture" requirement.

#### 4.2.3 Ambient Listening

A state where the system continuously captures or monitors audio waiting for keywords or patterns. Forbidden because it:

- Violates explicit consent requirements.
- Creates covert capture risk.
- Captures content beyond the user's intended scope.
- Cannot be reliably distinguished from surveillance by users.

**Ambient listening is not authorized under any Phase F design. This prohibition is non-negotiable.**

#### 4.2.4 Stealth Listening

A state where capture occurs while indicators suggest the system is not listening. Forbidden because it is deceptive and violates user trust.

### 4.3 State Transition Rules

All listening state transitions MUST be:

- **User-initiated or timeout-initiated**: The system does not autonomously enter Actively Listening.
- **Visible**: State transitions produce visible indicator changes.
- **Auditable**: State transitions are recorded in the audit trail with timestamps.
- **Deterministic**: The same user action in the same context produces the same state transition.

Permitted transitions:

| From | To | Trigger |
|:-----|:---|:--------|
| Not Listening | Armed | User configures wake mechanism |
| Not Listening | Actively Listening | Explicit user initiation |
| Armed | Actively Listening | Explicit user initiation (wake action) |
| Armed | Not Listening | User disables wake mechanism or session ends |
| Actively Listening | Processing | Capture window ends (user action or timeout) |
| Actively Listening | Not Listening | User revokes consent / cancels |
| Processing | Not Listening | Processing completes or fails |

Forbidden transitions:

- Any transition to Actively Listening without explicit user action.
- Any transition that is not reflected in visible indicators.
- Any transition that bypasses the Not Listening state when consent has not been established.

---

## 5. User Roles and Expectations

### 5.1 Patient

**Expectations:**

- The patient can always determine whether the system is listening.
- The patient's voice is captured only when they explicitly initiate capture.
- The patient can revoke consent and stop capture at any time.
- The patient is never subject to ambient or background listening.
- The patient receives clear feedback about what happens to their captured voice data.

**Controls:**

- Initiate capture (explicit action).
- Revoke consent / stop capture (explicit action).
- View current listening state (passive observation).

**Guarantees:**

- No voice capture without patient initiation.
- No covert listening.
- No persistent consent.
- Clear communication of denial and error states.

### 5.2 Clinician

**Expectations:**

- The clinician can always determine whether the system is listening.
- The clinician's voice is captured only when they explicitly initiate capture.
- The clinician can revoke consent and stop capture at any time.
- Patient PHI is not captured without appropriate consent and context binding.
- Voice capture does not create clinical documentation without governed review.

**Controls:**

- Initiate capture (explicit action).
- Revoke consent / stop capture (explicit action).
- View current listening state (passive observation).

**Guarantees:**

- No voice capture without clinician initiation.
- No covert listening.
- No ambient capture of patient conversations.
- Voice does not bypass clinical documentation governance.

### 5.3 Provider / Operator

**Expectations:**

- The provider/operator can configure voice feature availability for their practice.
- The provider/operator cannot enable ambient listening (it is platform-prohibited).
- The provider/operator cannot override individual consent requirements.
- The provider/operator receives audit visibility into consent and listening state for compliance purposes.

**Controls:**

- Enable/disable voice features at the practice level (configuration).
- Access audit records for consent and listening state transitions (read-only).

**Guarantees:**

- No organizational override of individual consent.
- No ambient listening capability, regardless of configuration.
- Audit trail available for compliance and governance.

---

## 6. Failure and Denial UX

### 6.1 How DENY States Are Presented

When the system cannot proceed due to missing prerequisites (identity, consent, context), the user receives a **denial notification** with the following characteristics:

**Required characteristics:**

- **Plain language**: No technical jargon, error codes displayed prominently, or system terminology.
- **Non-alarming**: The language does not suggest catastrophic failure or blame the user.
- **Actionable when possible**: If the user can resolve the issue (e.g., re-authenticate), guidance is provided.
- **Honest**: The denial reflects the actual reason; the system does not fabricate explanations.

**Example denial patterns (conceptual, not UI specification):**

- "We couldn't proceed because your session has ended. Please sign in again."
- "Voice capture isn't available right now. Please try again or use text."
- "We need to verify your identity before continuing."

### 6.2 How ERROR States Are Presented

When the system encounters an unexpected failure (technical error, service unavailable), the user receives an **error notification** with the following characteristics:

**Required characteristics:**

- **Plain language**: No stack traces, technical error messages, or internal identifiers exposed to users.
- **Non-technical**: The user does not need to understand the failure mechanism.
- **Non-alarming**: The language does not suggest data loss, security breach, or catastrophic failure unless genuinely warranted.
- **Guidance provided**: The user is told what to do next (retry, use alternative, contact support).

**Example error patterns (conceptual, not UI specification):**

- "Something went wrong. Your voice wasn't captured. Please try again."
- "We're having trouble processing your request. Please try again in a moment."
- "Voice features are temporarily unavailable. You can continue with text."

### 6.3 No Silent Failures

The system SHALL NOT fail silently. If capture fails, processing fails, or consent cannot be verified:

- The user is notified.
- The failure is reflected in the listening state indicator.
- The system does not proceed as if the operation succeeded.
- The failure is recorded in the audit trail.

Silent failure is a trust violation and a governance failure.

---

## 7. Audit and Evidence Implications

### 7.1 What Is Auditable

The following MUST be captured in the audit trail as metadata:

- **Consent state transitions**: When consent was established, by whom, and when it was revoked.
- **Listening state transitions**: Every transition between Not Listening, Armed, Actively Listening, and Processing, with timestamps.
- **Context binding**: What identity, tenant, and session context were bound at capture time.
- **Governance gate outcomes**: Which gates were evaluated and their results (pass/fail/deny).
- **User actions**: Initiation, revocation, cancellation actions attributable to specific users.
- **Denial and error events**: When denials or errors occurred and the bounded reason category.

### 7.2 What Is Never Stored (by Default)

The following are NOT stored by default:

- **Raw audio**: Audio content is not retained after processing unless a separate, explicit governance artifact authorizes retention with purpose limitation, retention limits, and regulatory approval.
- **Verbatim transcripts in audit logs**: Transcripts may be produced for user review but are not stored in audit logs by default.
- **PHI-bearing payloads**: Audit logs contain metadata only; sensitive content is not logged.

If any future requirement proposes raw audio or transcript retention, it MUST be treated as a separate governance topic with explicit approval requirements.

### 7.3 How Consent and Listening Transitions Are Represented

Audit records for consent and listening state transitions capture:

- **Timestamp**: When the transition occurred (UTC, high precision).
- **Previous state**: The state before the transition.
- **New state**: The state after the transition.
- **Trigger**: What caused the transition (user action, timeout, system event).
- **Actor**: The user associated with the transition (by authenticated identity, not PHI).
- **Context**: The bound session, tenant, and scope at transition time.

Audit records do NOT capture:

- Audio content.
- Transcript content.
- PHI-bearing details.

This posture ensures auditability without creating a secondary PHI repository.

---

## 8. Explicit Prohibitions

The following are **explicitly prohibited** under this design. These prohibitions are non-negotiable and may not be overridden by configuration, role, or organizational policy.

### 8.1 Ambient Listening

The platform SHALL NOT implement ambient listening—continuous or background audio capture that monitors for keywords, patterns, or events. Ambient listening:

- Violates explicit consent requirements.
- Creates covert capture risk.
- Cannot be reliably communicated to users.
- Is indistinguishable from surveillance from the user's perspective.

**Ambient listening is not authorized. No exception.**

### 8.2 Covert Recording

The platform SHALL NOT capture audio when:

- Listening state indicators show "Not Listening."
- The user has not explicitly initiated capture.
- The user has revoked consent.
- The user is not aware that capture is occurring.

Covert recording is deceptive, trust-destroying, and potentially unlawful.

### 8.3 Retroactive Consent

The platform SHALL NOT:

- Capture audio and then request consent retroactively.
- Buffer audio before consent is established and process it after consent is granted.
- Apply consent granted at time T to content captured at time T-1.

Consent must precede capture. There is no retroactive consent.

### 8.4 Execution Triggered by Voice Alone

Voice interaction SHALL NOT trigger execution of irreversible actions. Voice may:

- Express intent.
- Initiate a proposal.
- Provide input for drafts.
- Request information.

Voice SHALL NOT:

- Approve scheduling actions.
- Authorize clinical commitments.
- Trigger financial transactions.
- Execute any action that would require explicit human approval under F-01.

**Voice is an interface, not an authority. Voice never implies execution authority.**

---

## 9. Out of Scope

This document explicitly excludes the following. These topics require separate artifacts and are not addressed here.

### 9.1 No UI Mockups

This document does not provide visual designs, wireframes, mockups, or pixel-level specifications. It defines requirements that UI must satisfy, not how UI should appear.

### 9.2 No Component Specifications

This document does not define UI components, component libraries, design system tokens, or implementation patterns. Component specifications are implementation artifacts.

### 9.3 No Mobile Implementation

This document does not address mobile-specific considerations, iOS/Android APIs, mobile SDK integration, or platform-specific permission flows. Mobile implementation requires separate governance artifacts.

### 9.4 No Backend Contracts

This document does not define API contracts, data schemas, message formats, or service interfaces. Backend contracts are implementation artifacts governed by separate specifications.

---

## 10. Exit Criteria

Before any implementation of consent and listening UX may begin, the following conditions MUST be satisfied.

### 10.1 Required Future Artifacts

The following governance artifacts MUST be complete and approved:

1. **F-04 — Consent and Listening Implementation Contract**: Defines the precise contracts, state machines, and interfaces required to implement this design (design-only, not implementation).

2. **F-05 — Voice Interaction Audit Schema**: Defines the metadata fields, event taxonomy, and non-omittability constraints for voice interaction audit events (consistent with E-06/E-07 patterns).

### 10.2 Required Reviews

The following reviews MUST be completed with no blocking findings:

1. **Security Review**: Assessment of the consent and listening design against platform security requirements, including threat modeling for covert capture, consent bypass, and state manipulation.

2. **Privacy Review**: Assessment against HIPAA requirements, state privacy laws, and platform privacy commitments. Confirmation that the design does not create unauthorized PHI capture or retention.

3. **Clinical Review**: Assessment of the design's impact on clinical workflows, patient-clinician communication, and clinical documentation governance.

4. **Governance Review**: Assessment by Platform Governance that the design is consistent with Phase F principles, Phase E sealed posture, and platform-wide governance requirements.

### 10.3 Explicit Governance Unblock

Implementation SHALL NOT proceed until:

- All required artifacts (10.1) are complete and sealed.
- All required reviews (10.2) are completed with no blocking findings.
- Platform Governance issues an explicit unblock decision authorizing implementation.

---

## 11. Summary

This document establishes the **UX governance foundation** for consent and listening state communication in voice interactions.

**Key Principles Established:**

1. **Trust-first**: UX exists to establish and maintain user trust, not merely to satisfy technical requirements.
2. **Explicit consent only**: Consent must be affirmatively granted; implicit, contextual, and inferred consent are forbidden.
3. **Session-scoped consent**: Consent does not persist; each capture session requires fresh consent.
4. **Zero ambiguity**: Users must always be able to determine listening state without uncertainty.
5. **No covert capture**: Any capture without user awareness is forbidden.
6. **No ambient listening**: Continuous background monitoring is prohibited under all circumstances.
7. **Voice ≠ authority**: Voice is an interface for expressing intent; it does not confer execution authority.
8. **Fail-closed**: Uncertain consent or context results in denial, not best-effort processing.
9. **Auditable without payload**: Consent and listening transitions are fully auditable without storing audio or transcripts.

**Value Delivered:**

- **For Patients**: Clear, honest communication about when they are heard; no surveillance; no covert capture.
- **For Clinicians**: Preserved control over voice capture in clinical contexts; no ambient monitoring of patient conversations.
- **For Providers**: Audit visibility for compliance; no organizational override of individual consent.
- **For Regulators**: A defensible, conservative posture that prioritizes user awareness and explicit consent.

---

**END OF ARTIFACT**

*Document ID: F-03-CLUX*  
*Authority: Platform Governance (Phase F)*  
*Status: Design-Only — No Implementation Authorized*

---

**This document authorizes understanding and governance design only. It does not authorize implementation.**
