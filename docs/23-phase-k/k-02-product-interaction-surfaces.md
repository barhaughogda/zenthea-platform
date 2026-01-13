# K-02 — Product Interaction Surfaces (Non-Executing)

**Phase:** K  
**Type:** Design Artifact (Design-Only)  
**Status:** Draft  
**Author:** Platform Architecture  
**Date:** 2026-01-13  

---

## 1. Purpose and Scope

### 1.1 Why Interaction Surfaces Are a Safety Boundary

Product interaction surfaces define the **controlled interfaces** through which users engage with the Zenthea platform. In a governed, clinical AI system, interaction surfaces are not merely UI components — they are **safety boundaries** that constrain what users can perceive, request, and interpret.

Every interaction surface must:

- **Present governed outputs** — Only display information that has passed through policy, consent, and response discipline
- **Constrain input modalities** — Accept only explicit, intentional user inputs
- **Prevent authority leakage** — Never imply that the surface can trigger action
- **Maintain visibility** — Never obscure system state or behavior from users

Interaction surfaces are the **user-facing edge of governance**. A poorly designed surface can create the illusion of authority where none exists, or imply execution capability that is prohibited.

### 1.2 Explicitly Non-Executing, Non-Authoritative

**All interaction surfaces in Phase K are strictly non-executing and non-authoritative.**

An interaction surface:

- **Does not execute** — No surface can trigger action against external systems
- **Does not authorize** — No surface can approve, confirm, or submit on behalf of users
- **Does not delegate** — No surface can receive delegated authority from users
- **Does not persist** — No surface maintains state beyond the active session
- **Does not notify** — No surface sends background notifications or alerts

The interaction surface is a **presentation boundary**, not an **authority boundary**. Users interact with the surface to receive information, proposals, and drafts — never to trigger execution.

### 1.3 This Document Is Design-Only

This document:

- Defines the architectural intent for product interaction surfaces
- Establishes constraints on what surfaces may present and receive
- Specifies role-specific variants and prohibitions
- Enumerates UX safety guarantees and failure presentation requirements

This document does **not**:

- Authorize implementation of any interaction surface
- Provide UI mockups, wireframes, or visual specifications
- Enable deployment to any environment
- Authorize data collection, storage, or processing

**No implementation is authorized by this document.**

---

## 2. Relationship to Prior Phases

### 2.1 Phase E — Non-Executing Orchestration

Phase E established that orchestration produces metadata-only outputs and never executes. All interaction surfaces inherit this constraint:

| Phase E Constraint | Interaction Surface Implication |
|--------------------|--------------------------------|
| Proposal-only outputs | Surfaces display proposals, never execution results |
| Draft-only artifacts | Surfaces present drafts for human review |
| No side effects | Surfaces cannot trigger state changes |
| Metadata-only traces | Surfaces do not display PHI in audit contexts |

Interaction surfaces are the **user-visible expression of Phase E's non-executing posture**.

### 2.2 Phase J — Runtime, Identity, Memory, and Conversation Discipline

Phase J defined the governance framework that interaction surfaces must respect:

| Phase J Design | Interaction Surface Implication |
|----------------|--------------------------------|
| J-01 Agent Runtime | Surfaces connect to runtime through governed channels |
| J-02 Session & Identity | Surfaces are bound to verified sessions and identities |
| J-03 Memory Model | Surfaces do not persist state beyond session |
| J-04 Conversational Discipline | All surface outputs follow response semantics |

Every constraint in Phase J applies to every interaction through any surface.

### 2.3 Phase K-01 — Assistant Runtime Shell

K-01 defined the Assistant Runtime Shell as the bounded surface for user interaction. K-02 extends this by defining:

- The specific interaction surfaces within the shell
- Role-specific variants of each surface
- UX safety guarantees that surfaces must provide
- Failure and denial presentation requirements

K-02 is the **surface specification layer** that implements K-01's shell architecture.

---

## 3. Definition of "Interaction Surface"

### 3.1 What an Interaction Surface Is

An interaction surface is a **bounded interface** through which users perceive and communicate with the Zenthea platform.

| Attribute | Definition |
|-----------|------------|
| **Bounded** | Defined start and end; no ambient or persistent presence |
| **Explicit** | Activated by intentional user action only |
| **Governed** | All inputs and outputs pass through policy enforcement |
| **Observable** | State is visible to users at all times |
| **Revocable** | Users can terminate interaction at any time |

### 3.2 What an Interaction Surface Is NOT

An interaction surface explicitly excludes:

| Excluded Concept | Rationale |
|-----------------|-----------|
| **Execution Interface** | Surfaces do not trigger action |
| **Automation Trigger** | Surfaces do not initiate workflows |
| **Background Agent** | Surfaces do not persist when users disengage |
| **Notification Channel** | Surfaces do not push unsolicited messages |
| **Authority Gateway** | Surfaces do not approve, confirm, or authorize |

### 3.3 Separation from Execution, Automation, and Background Agents

The boundary between interaction surfaces and execution components is absolute:

| Interaction Surface | Execution Component (Blocked) |
|--------------------|------------------------------|
| Presents proposals | Executes actions |
| Displays drafts | Submits transactions |
| Shows information | Modifies records |
| Receives questions | Processes commands |
| Provides explanations | Triggers workflows |

**No execution component is authorized in Phase K. This separation is architectural, not optional.**

---

## 4. Core Interaction Surfaces

### 4.1 Text Chat Surface

The text chat surface is the primary interaction modality.

| Attribute | Specification |
|-----------|---------------|
| **Input Method** | Explicit text submission by user |
| **Output Method** | Governed text response per J-04 discipline |
| **Session Binding** | Bound to authenticated session per J-02 |
| **Memory Scope** | Session-only per J-03 |
| **Activation** | Explicit user action to begin chat |
| **Termination** | Explicit user action or timeout |

**Text Chat Surface Constraints:**

- No auto-send or implicit submission
- No real-time streaming that implies action
- No "typing indicators" that suggest autonomous behavior
- No "confirm" or "submit" buttons that imply execution
- All outputs labeled as proposals, drafts, or information

### 4.2 Explicit Voice Interaction Surface

The voice interaction surface accepts spoken input with explicit activation.

| Attribute | Specification |
|-----------|---------------|
| **Activation** | Explicit button press or wake word only |
| **Listening State** | Visible indicator always present when active |
| **Capture Duration** | Bounded; ends on explicit termination or timeout |
| **Transcription** | Voice input transcribed and displayed for user verification |
| **Response Modality** | Text and/or audio response per configuration |
| **Authority** | Identical constraints as text — no execution capability |

**Voice Surface Constraints:**

- No ambient or always-on listening
- No voice-triggered actions without human verification
- No voice-based identity verification for authority
- Transcription confirmation required before processing
- All J-04 response discipline applies to voice outputs

### 4.3 Session Summary / Review Surface

The session summary surface presents synthesized session information for user review.

| Attribute | Specification |
|-----------|---------------|
| **Content** | Summary of session interactions and proposals |
| **Timing** | Available during and at end of session |
| **Format** | Read-only presentation of session activity |
| **Authority** | No execution or submission capability |
| **Retention** | Destroyed at session teardown unless explicitly saved with consent |

**Summary Surface Constraints:**

- No "submit summary" or "send to provider" actions
- No automatic forwarding or persistence
- User must explicitly initiate any export (copy, save)
- Labeled as "session notes" or "draft summary" — never "record"
- No PHI persistence beyond session boundary

---

## 5. Role-Specific Interaction Variants

### 5.1 Patient Experience

Patients interact with surfaces designed for safety, clarity, and accessibility.

| Patient Surface Attribute | Specification |
|---------------------------|---------------|
| **Vocabulary** | Plain language, no medical jargon unless defined |
| **Response Complexity** | Appropriate reading level |
| **Action Language** | Never implies patient can authorize clinical action |
| **Escalation Path** | Clear guidance to contact provider for decisions |
| **Consent Display** | Explicit consent status always visible |

**Patient-Specific Prohibitions:**

- No clinical decision language ("you should," "you must")
- No diagnostic implications ("this means you have")
- No treatment recommendations without provider attribution
- No urgency language that creates panic or coercion
- No data collection beyond explicit session consent

### 5.2 Clinician Experience

Clinicians interact with surfaces designed for efficiency within governance constraints.

| Clinician Surface Attribute | Specification |
|-----------------------------|---------------|
| **Vocabulary** | Clinical terminology acceptable |
| **Draft Artifacts** | Clinical documentation drafts clearly labeled |
| **Patient Context** | Available per consent and policy |
| **Action Language** | Never implies assistant can act on clinician's behalf |
| **Authority Boundary** | Clear separation from EHR/system of record |

**Clinician-Specific Prohibitions:**

- No auto-population of official records
- No signature or attestation capability
- No order entry or prescription capability
- No "submit to EHR" or "finalize documentation" actions
- No implied clinical authority for assistant outputs

### 5.3 Operator / Governance Experience

Operators interact with surfaces designed for platform oversight.

| Operator Surface Attribute | Specification |
|----------------------------|---------------|
| **Visibility** | Aggregate metrics and audit categories only |
| **PHI Access** | None — operators see metadata, not content |
| **Configuration** | Read-only in Phase K; no live configuration |
| **Incident View** | Categorized incidents, no transcript access |
| **Policy Review** | Policy documentation, not policy editing |

**Operator-Specific Prohibitions:**

- No PHI visibility under any circumstance
- No user session introspection (content)
- No live configuration changes (Phase K is non-executing)
- No user impersonation or identity assumption
- No override of consent or policy boundaries

### 5.4 Explicit Prohibition on Cross-Role Leakage

**No surface may expose information, capabilities, or affordances from one role to another.**

| Cross-Role Leakage | Prohibition |
|--------------------|-------------|
| Patient sees clinician tools | Forbidden |
| Clinician sees operator metrics | Forbidden |
| Operator sees patient PHI | Forbidden |
| Any role sees another role's session | Forbidden |
| Any surface implies capabilities beyond role | Forbidden |

Role isolation is enforced at the surface layer, not merely at the data layer.

---

## 6. Entry and Exit Points

### 6.1 Session Start

| Entry Step | Specification |
|------------|---------------|
| **Explicit Initiation** | User takes intentional action to begin (button, login, etc.) |
| **Identity Verification** | Identity verified per J-02 before surface activates |
| **Consent Check** | Consent verified per scope before interaction proceeds |
| **Surface Activation** | Surface becomes visible and interactive |
| **State Indication** | User sees clear indication that session is active |

**Session Start Constraints:**

- No auto-start based on presence detection
- No ambient activation based on device state
- No session continuation without re-verification at boundary
- No implied consent from prior sessions

### 6.2 Explicit Activation

Each interaction within a session requires explicit activation:

| Activation Type | Specification |
|-----------------|---------------|
| **Text Input** | User explicitly submits text (button press, enter key) |
| **Voice Input** | User explicitly activates voice capture (button, wake word) |
| **Context Upload** | User explicitly selects and confirms upload |
| **Summary Request** | User explicitly requests summary generation |

**No implicit activation is permitted.**

### 6.3 Session Teardown

| Exit Step | Specification |
|-----------|---------------|
| **Explicit Termination** | User explicitly ends session or timeout occurs |
| **State Destruction** | Session memory destroyed per J-03 |
| **Surface Deactivation** | Surface becomes inactive and non-interactive |
| **Audit Finalization** | Metadata-only audit record finalized |
| **Exit Indication** | User sees clear indication that session has ended |

**Session Teardown Constraints:**

- No lingering processes after user disengages
- No background continuation of session tasks
- No deferred action queues
- No "we'll follow up" promises

### 6.4 No Background Persistence

**When the user is not actively engaged, interaction surfaces are inert.**

| Prohibited Background Behavior | Rationale |
|-------------------------------|-----------|
| Background listening | Violates consent and privacy |
| Background processing | Violates non-executing posture |
| Queued notifications | Violates explicit interaction model |
| Persistent state across sessions (default) | Violates session-scoped memory |
| Proactive outreach | Violates human-in-the-loop |

**If the user has ended the session, nothing happens.**

---

## 7. Voice as a Surface (Not Authority)

### 7.1 Visible Listening State

Voice interaction requires continuous visible indication of system state:

| State | Visual Indication Required |
|-------|---------------------------|
| **Inactive** | Clear indication that voice is not being captured |
| **Listening** | Prominent, unmistakable indication that voice is being captured |
| **Processing** | Indication that captured audio is being processed |
| **Responding** | Indication that system is generating/delivering response |

**Users must never be uncertain whether voice is being captured.**

### 7.2 Transcription Confirmation

All voice input must be transcribed and confirmed:

| Transcription Requirement | Specification |
|--------------------------|---------------|
| **Display** | Transcribed text displayed to user |
| **Verification** | User can review before processing |
| **Correction** | User can correct or cancel before proceeding |
| **No Silent Processing** | No voice input processed without visible transcription |

### 7.3 Same Constraints as Text

Voice interactions are subject to identical governance as text:

| Constraint | Text | Voice |
|------------|------|-------|
| J-04 Response Discipline | ✓ | ✓ |
| Proposal-only outputs | ✓ | ✓ |
| No execution capability | ✓ | ✓ |
| Refusal semantics | ✓ | ✓ |
| Uncertainty expression | ✓ | ✓ |
| Session-scoped memory | ✓ | ✓ |

**Voice is a modality, not a privilege escalation.**

---

## 8. UX Safety Guarantees

### 8.1 No Illusion of Execution

Interaction surfaces must never create the impression that execution has occurred or will occur:

| Prohibited UX Pattern | Required UX Pattern |
|----------------------|---------------------|
| "Done" or "Completed" | "Draft created" or "Proposal ready" |
| "Submitted" or "Sent" | "Draft available for your review" |
| "Scheduled" or "Booked" | "Draft request created — requires confirmation" |
| "Updated" or "Changed" | "Draft update prepared — not yet applied" |
| Progress bars suggesting action | Status indicators showing draft/proposal state |

### 8.2 Clear Refusals

When the system cannot fulfill a request, surfaces must present clear refusals:

| Refusal Requirement | Specification |
|---------------------|---------------|
| **Direct Language** | "I cannot [action]" — not hedging or apologizing |
| **Reason Provided** | Clear explanation of why request cannot be fulfilled |
| **Alternative Offered** | Actionable alternative when possible |
| **No Ambiguity** | User understands that request is denied, not deferred |

### 8.3 Clear Uncertainty

When the system is uncertain, surfaces must express uncertainty clearly:

| Uncertainty Requirement | Specification |
|------------------------|---------------|
| **Explicit Statement** | "I am not certain" — not hedging language |
| **Scope Identification** | What specific aspect is uncertain |
| **No False Confidence** | Never mask uncertainty with confident language |
| **Resolution Path** | How to obtain certainty when possible |

### 8.4 No Persuasive or Therapeutic Framing

Surfaces must never employ persuasive or therapeutic communication patterns:

| Prohibited Pattern | Rationale |
|-------------------|-----------|
| Persuasive language | Undermines informed consent |
| Emotional appeals | Manipulates user decision-making |
| Therapeutic framing | Requires licensed professional |
| Relationship language | Creates inappropriate attachment |
| Urgency without cause | Coerces user action |
| "I recommend" or "You should" | Implies authority the system does not have |

---

## 9. Failure and Denial Presentation

### 9.1 Deterministic, Plain-Language Denials

All denials must be deterministic and expressed in plain language:

| Denial Category | Example Presentation |
|-----------------|---------------------|
| **Consent Denial** | "I cannot proceed without your consent for [scope]." |
| **Policy Denial** | "This request is outside my authorized scope." |
| **Context Denial** | "I don't have enough information to respond accurately." |
| **Capability Denial** | "I do not have the capability to [action]." |
| **Authority Denial** | "I cannot authorize this action. Only [role] may do this." |

### 9.2 No Silent Failures

Surfaces must never fail silently:

| Failure Type | Required Presentation |
|--------------|----------------------|
| Processing failure | "I encountered an error processing your request." |
| Timeout | "Your request took too long. Please try again." |
| Context limit | "I cannot process this much information at once." |
| Service unavailable | "This capability is temporarily unavailable." |

**If something goes wrong, the user must know.**

### 9.3 No Technical Leakage

Error presentations must not expose technical details:

| Prohibited Error Content | Rationale |
|-------------------------|-----------|
| Stack traces | Exposes implementation details |
| Error codes | Meaningless to users |
| Internal component names | Exposes architecture |
| Database errors | Security and confusion risk |
| API response details | Security and confusion risk |

Errors are presented in user-appropriate language only.

---

## 10. Audit and Observability (UX Perspective)

### 10.1 What Users Can See

Users have visibility into their own interactions:

| User-Visible Information | Specification |
|-------------------------|---------------|
| Current session content | Full visibility into active session |
| Session summary | Summary of session interactions (on request) |
| Consent status | What consents are active |
| Session boundaries | When session started and ends |
| Denial reasons | Why specific requests were refused |

**Users see their own session, nothing else.**

### 10.2 What Operators Can See

Operators have visibility into aggregate platform behavior:

| Operator-Visible Information | Specification |
|-----------------------------|---------------|
| Aggregate metrics | Session counts, interaction volumes |
| Denial categories | Types of denials (not content) |
| Error categories | Types of errors (not content) |
| Performance indicators | Response times, availability |
| Audit categories | Interaction types (not content) |

**Operators see metadata, never PHI, never session content.**

### 10.3 Metadata-Only, No PHI

Audit and observability surfaces must never expose PHI:

| Audit Field | PHI Status |
|-------------|------------|
| Session ID | Pseudonymized |
| User ID | Pseudonymized |
| Interaction category | Category only |
| Denial reason | Category only |
| Error type | Technical category only |
| Timestamp | Allowed |

**PHI never appears in audit surfaces, operator dashboards, or observability tools.**

---

## 11. Explicit Prohibitions

### 11.1 No Execution Affordances

Surfaces must not provide affordances that suggest execution capability:

| Prohibited Affordance | Rationale |
|----------------------|-----------|
| "Submit" button | Implies transaction execution |
| "Confirm" button | Implies authorization capability |
| "Send" button | Implies message transmission |
| "Schedule" button | Implies booking execution |
| "Order" button | Implies transaction initiation |
| "Approve" button | Implies authorization authority |

### 11.2 No "Confirm" or "Submit" Actions

No surface may present a confirmation or submission action:

| Prohibited Action | Rationale |
|-------------------|-----------|
| Submit form | No form submission to external systems |
| Confirm request | No confirmation of external action |
| Finalize draft | No finalization that implies record creation |
| Send message | No message transmission |
| Schedule appointment | No calendar modification |

**Users may export, copy, or save drafts. They may not "submit" through the surface.**

### 11.3 No Background Notifications

Surfaces must not send or receive background notifications:

| Prohibited Notification | Rationale |
|------------------------|-----------|
| Push notifications | Violates explicit interaction model |
| Email from assistant | Violates non-executing posture |
| SMS from assistant | Violates non-executing posture |
| Badge updates | Implies background activity |
| Sound alerts when inactive | Violates session-scoped interaction |

### 11.4 No Implied Success Language

Surfaces must not use language that implies successful execution:

| Prohibited Language | Required Alternative |
|--------------------|---------------------|
| "Your appointment is scheduled" | "Draft request created for review" |
| "Message sent" | "Draft message ready — not yet sent" |
| "Changes saved" | "Draft changes prepared — not yet applied" |
| "Request submitted" | "Draft request available for human submission" |
| "Done" | "Draft complete" |

---

## 12. Out of Scope

The following are explicitly out of scope for this design artifact:

| Out of Scope Item | Rationale |
|-------------------|-----------|
| **UI Mockups** | Visual design requires separate authorization |
| **Wireframes** | Layout specification requires separate authorization |
| **Mobile Implementation** | Platform-specific design requires separate authorization |
| **Execution Adapters** | Execution remains blocked |
| **Performance Guarantees** | SLA commitments require implementation |
| **Accessibility Certification** | Certification requires implementation |
| **Localization** | Language support requires implementation |
| **Color Schemes / Branding** | Visual identity requires separate authorization |
| **Animation / Interaction Timing** | Detailed UX requires implementation |
| **Device-Specific Behavior** | Platform specifics require implementation |

---

## 13. Exit Criteria

Before any interaction surface implementation may proceed, the following must be satisfied:

### 13.1 Governance Review

| Criterion | Evidence Required |
|-----------|------------------|
| Clinical Safety Board review | Signed review record |
| Technical Architecture Committee review | Signed review record |
| Compliance Officer review | Signed review record |
| Privacy Impact Assessment | PIA document |

### 13.2 UX Safety Validation

| Criterion | Evidence Required |
|-----------|------------------|
| No-execution affordance audit | UX audit document |
| Refusal semantics validation | UX safety assessment |
| Uncertainty expression validation | UX clarity review |
| No-persuasion validation | UX ethics assessment |
| Role separation validation | Access control review |

### 13.3 Security and Privacy Review

| Criterion | Evidence Required |
|-----------|------------------|
| Input validation security review | Security assessment |
| Role leakage prevention review | Security assessment |
| PHI exposure prevention review | Privacy assessment |
| Session boundary security review | Security assessment |

### 13.4 Phase K Readiness Confirmation

| Criterion | Evidence Required |
|-----------|------------------|
| K-01 Assistant Runtime Shell approved | K-01 approval record |
| Phase J designs (J-01 through J-04) approved | J-series approval records |
| Non-executing posture confirmed | Architecture confirmation |
| Phase E constraints respected | Architecture alignment document |

---

## 14. Closing Governance Statement

**This document authorizes understanding and design alignment only. It does not authorize implementation or execution.**

This document:

- Defines the architectural intent for product interaction surfaces
- Establishes boundaries and constraints for surface behavior
- Specifies role-specific variants and prohibitions
- Enumerates UX safety guarantees and failure presentation requirements
- Preserves the execution block from all prior phases

This document does **not**:

- Authorize implementation of any interaction surface
- Authorize UI development, mockups, or visual design
- Authorize deployment to any environment
- Authorize data collection, storage, or processing
- Authorize voice capture or processing
- Authorize notification or messaging capability
- Unblock Phase I execution semantics
- Enable any form of execution, automation, or background processing

Implementation of Phase K interaction surfaces requires separate, explicit authorization following completion of all exit criteria, governance reviews, security assessments, and UX safety validations.

**The execution block remains in force.**

**No execution is authorized by this document.**

---

*Document Version: 1.0*  
*Classification: Internal — Architecture Design*  
*Execution Block Status: ENFORCED*  
*Implementation Status: NOT AUTHORIZED*  
*Automation Status: NOT AUTHORIZED*  
*Background Processing Status: NOT AUTHORIZED*
