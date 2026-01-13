# J-01 — Agent Runtime & Daily Interaction Loop

**Phase:** J  
**Type:** Design Artifact (Design-Only)  
**Status:** Draft  
**Author:** Platform Architecture  
**Date:** 2026-01-13  

---

## 1. Purpose and Scope

Phase J defines the architectural foundation for the **Agent Runtime & Daily Interaction Loop** — the first phase in which Zenthea functions as a usable AI assistant for patients, clinicians, and operators.

### 1.1 What Phase J Represents

Phase J establishes:

- A continuous interaction model where users may converse with Zenthea throughout their day
- A framework for capturing intent, reasoning over context, and producing useful outputs
- A governance-aligned assistant that enhances human workflows without replacing human authority

### 1.2 Explicit Non-Executing Posture

**Phase J is strictly non-executing.** Zenthea may:

- Listen (when explicitly invoked)
- Reason over available context
- Draft, summarize, propose, and advise
- Surface information and recommendations

Zenthea may **not**:

- Execute actions on behalf of users
- Modify external systems or patient records
- Trigger workflows without explicit human authorization
- Act autonomously or in the background

### 1.3 Usefulness Without Authority

**Usefulness does not require authority.** Phase J demonstrates that an AI assistant may provide substantial value — summarizing records, drafting communications, proposing care steps, answering questions — while possessing zero execution capability.

The absence of execution authority is not a limitation to be overcome; it is a deliberate design constraint that preserves safety, trust, and regulatory compliance.

---

## 2. Relationship to Prior Phases

Phase J builds upon and explicitly references the following phases:

| Phase | Relationship |
|-------|-------------|
| **Phase E** | Established non-executing orchestration. Phase J preserves this posture entirely. All reasoning and proposal generation occurs within the non-executing boundary. |
| **Phase F** | Defined execution governance design, including consent models and audit requirements. Phase J respects these designs but does not invoke execution paths. |
| **Phase G** | Defined execution adapter boundaries. Execution remains **blocked**. Phase J operates upstream of all adapter boundaries. |
| **Phase H** | Established simulation semantics. Phase J is not simulation — it is real interaction, but without execution. |
| **Phase I** | Defined shadow mode and readiness validation. Phase J may run concurrently with shadow mode validation but remains independent. |

### 2.1 Critical Constraint

Phase J does not unblock execution. Phase J demonstrates that Zenthea can be useful, trusted, and governance-compliant in daily interaction — but the decision to enable execution remains a separate, future governance event requiring explicit human authorization.

---

## 3. Definition of the Agent Runtime

### 3.1 What "Agent Runtime" Means in Zenthea

The Agent Runtime is the computational and governance framework within which Zenthea processes user interactions, reasons over context, and produces outputs. It is the active component of Zenthea that responds to user requests.

### 3.2 Runtime Components

The Agent Runtime is composed of four distinct, separable components:

| Component | Definition | Authority Level |
|-----------|------------|-----------------|
| **Listening** | Receiving explicit user input (voice, text, file) | Input only — no interpretation beyond capture |
| **Reasoning** | Processing input against context, policies, and knowledge | Computational only — no external effect |
| **Memory** | Retrieving and storing session and long-term context | Internal state only — no patient record modification |
| **Output** | Producing drafts, summaries, proposals, and responses | Presentation only — no action execution |

### 3.3 Separation of Concerns

Each component is architecturally isolated:

- **Listening** cannot initiate reasoning without explicit user invocation
- **Reasoning** cannot invoke external systems or modify state
- **Memory** cannot write to systems of record
- **Output** cannot trigger workflows or send communications

### 3.4 AI Is Never an Authority

The Agent Runtime explicitly lacks:

- Decision-making authority
- Execution capability
- Approval authority
- The ability to act on behalf of users

The AI is an **advisor** and **assistant** — never an actor or decision-maker. All authority remains with human users and the governance systems that constrain them.

---

## 4. Interaction Modes (Allowed)

Phase J authorizes the following interaction modes:

### 4.1 Explicit Voice Command

| Attribute | Requirement |
|-----------|-------------|
| **Trigger** | User explicitly activates voice input (button press, wake word, explicit request) |
| **Duration** | Voice capture active only during explicit session |
| **Termination** | Capture ends when user explicitly ends session or after defined timeout |
| **Visibility** | Visible indicator (UI, LED, audible) confirms capture state at all times |

### 4.2 Text and UI Interaction

| Attribute | Requirement |
|-----------|-------------|
| **Trigger** | User explicitly submits text or interacts with UI element |
| **Scope** | Interaction bounded to explicit user action |
| **Session** | Clear session boundaries with explicit start and end |

### 4.3 File or Note Input (User-Initiated)

| Attribute | Requirement |
|-----------|-------------|
| **Trigger** | User explicitly uploads, pastes, or references a file or note |
| **Consent** | User explicitly consents to Zenthea processing the content |
| **Scope** | Processing limited to explicit user request |

### 4.4 Prohibited Interaction Modes

The following modes are **explicitly prohibited** in Phase J:

| Prohibited Mode | Rationale |
|-----------------|-----------|
| **Ambient listening** | Passive audio capture violates consent and privacy |
| **Background monitoring** | Autonomous observation violates governance constraints |
| **Proactive outreach** | AI-initiated contact violates human-in-the-loop requirements |
| **Persistent surveillance** | Continuous monitoring violates privacy and trust |
| **Implicit activation** | Activation without explicit user intent violates consent |

---

## 5. Daily Interaction Loop

### 5.1 Overview

The Daily Interaction Loop defines the canonical flow for each interaction between a user and Zenthea. Every interaction follows this structure.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       DAILY INTERACTION LOOP                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────┐                                                      │
│  │ 1. CAPTURE    │  User explicitly invokes Zenthea                     │
│  │    INTENT     │  Intent is captured and logged                       │
│  └───────┬───────┘                                                      │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────┐                                                      │
│  │ 2. ESTABLISH  │  Session identity confirmed                          │
│  │    SESSION &  │  Consent verified for scope                          │
│  │    CONSENT    │  Context boundaries established                      │
│  └───────┬───────┘                                                      │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────┐                                                      │
│  │ 3. REASON     │  Process request against available context           │
│  │    OVER       │  Apply policies and constraints                      │
│  │    CONTEXT    │  Generate reasoning (not exposed)                    │
│  └───────┬───────┘                                                      │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────┐                                                      │
│  │ 4. PRODUCE    │  Draft, summarize, propose, or advise                │
│  │    OUTPUTS    │  Label all outputs as proposals/drafts               │
│  │               │  Present to user for review                          │
│  └───────┬───────┘                                                      │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────┐                                                      │
│  │ 5. HAND OFF   │  User reviews and decides                            │
│  │    TO HUMAN   │  User may accept, modify, or reject                  │
│  │               │  No automatic progression                            │
│  └───────┬───────┘                                                      │
│          │                                                              │
│          ▼                                                              │
│  ┌───────────────┐                                                      │
│  │ 6. END        │  Session terminates cleanly                          │
│  │    CLEANLY    │  No persistent side effects                          │
│  │               │  Audit record finalized                              │
│  └───────────────┘                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Stage Definitions

| Stage | Description | Constraints |
|-------|-------------|-------------|
| **1. Capture Intent** | User explicitly states what they want. Zenthea captures the request. | No interpretation beyond capture. No assumption of implicit intent. |
| **2. Establish Session & Consent** | Session is established with user identity. Consent is verified for the scope of the request. | No processing before consent. No scope expansion without re-consent. |
| **3. Reason Over Context** | Zenthea processes the request using available context, policies, and knowledge. | Internal reasoning only. No external calls. No state modification. |
| **4. Produce Outputs** | Zenthea generates drafts, summaries, proposals, or advice. | All outputs labeled as non-authoritative. No action taken. |
| **5. Hand Off to Human** | Outputs are presented to the user for review and decision. | User retains all authority. No automatic execution. |
| **6. End Cleanly** | Session terminates with no persistent side effects. Audit record is finalized. | No lingering processes. No background continuation. |

### 5.3 Loop Invariants

Every interaction must satisfy these invariants:

- **Explicit start**: No interaction begins without explicit user invocation
- **Consent before processing**: No reasoning occurs before consent is verified
- **Human-in-the-loop**: User reviews all outputs before any subsequent action
- **No side effects**: Interaction produces no external state change
- **Clean termination**: Every session ends explicitly with full audit capture

---

## 6. Memory Model (Non-Authoritative)

### 6.1 Memory Hierarchy

Zenthea's memory is organized into two tiers:

| Memory Type | Scope | Retention | Authority |
|-------------|-------|-----------|-----------|
| **Session Memory** | Current interaction session | Duration of session only | Non-authoritative |
| **Long-Term Memory** | Cross-session context | Persisted per governance policy | Non-authoritative |

### 6.2 What May Be Remembered

| Category | Permissible Memory | Rationale |
|----------|-------------------|-----------|
| **User Preferences** | UI preferences, communication style, accessibility needs | Enhances user experience without clinical risk |
| **Interaction History** | Topics discussed, questions asked (metadata only) | Enables continuity without PHI exposure |
| **Context References** | Pointers to records user has viewed (not record content) | Enables context without data duplication |
| **Session State** | Current conversation context | Necessary for coherent interaction |

### 6.3 What Must Never Be Remembered

| Category | Prohibition | Rationale |
|----------|-------------|-----------|
| **Clinical Decisions** | Never store AI reasoning as clinical fact | AI is not a decision-maker |
| **Patient Health Information (PHI)** | Never cache or duplicate PHI in memory | PHI must remain in systems of record |
| **Credentials or Secrets** | Never store authentication material | Security violation |
| **User Corrections as Training Data** | Never use user feedback to modify model weights | Governance and privacy violation |
| **Content of Denied Requests** | Never persist details of denied requests beyond audit | Privacy protection |

### 6.4 Memory Boundaries

| User Role | Memory Isolation | Cross-Contamination |
|-----------|-----------------|---------------------|
| **Patient** | Patient memory isolated to that patient's context | Never shared with other patients |
| **Clinician** | Clinician memory isolated per session and patient | Never shared across patients inappropriately |
| **Operator** | Operator memory isolated to operational context | Never includes patient-level detail |

### 6.5 Memory Is Non-Authoritative

All memory in Zenthea is explicitly non-authoritative:

- Memory may inform proposals but cannot authorize action
- Memory is never a system of record
- Memory may be stale or incomplete; this is expected
- Memory cannot override governance constraints
- Memory cannot grant permissions or consent

---

## 7. Failure, Denial, and Uncertainty Handling

### 7.1 Fail-Closed Posture

Zenthea operates in a fail-closed mode:

| Condition | Response |
|-----------|----------|
| Ambiguous input | Request clarification; do not guess |
| Missing context | State limitation clearly; do not fabricate |
| Consent unclear | Treat as denied; request explicit consent |
| Policy violation | Deny request; state reason |
| System error | Terminate cleanly; log error; notify user |

### 7.2 Deterministic Denials

Denials are deterministic and auditable:

| Denial Type | Behavior |
|-------------|----------|
| **Consent Denial** | "I cannot proceed without your explicit consent for [scope]." |
| **Policy Denial** | "This request is outside my authorized scope. [Reason]." |
| **Context Denial** | "I don't have enough information to respond accurately." |
| **Authority Denial** | "I cannot perform this action. Only [authorized role] may do this." |

### 7.3 No Hallucinated Certainty

Zenthea must not express false confidence:

| Prohibited Pattern | Required Pattern |
|-------------------|------------------|
| "The patient's diagnosis is X" | "Based on the records I can access, the documentation suggests X" |
| "You should take medication Y" | "The care plan includes medication Y; please confirm with your provider" |
| "I have scheduled your appointment" | "I have drafted an appointment request for your review" |

### 7.4 User-Facing Language

All denials and limitations must be expressed in clear, non-technical language:

- Explain what cannot be done
- Explain why (in user terms)
- Suggest alternative paths if appropriate
- Never leave user confused about system state

---

## 8. Voice as Interface (Not Authority)

### 8.1 Voice Is Input Only

Voice is a modality for input, not a source of authority:

| Voice Attribute | Boundary |
|-----------------|----------|
| **Input** | Voice may convey user intent |
| **Identity** | Voice is not sufficient for identity verification in isolation |
| **Consent** | Voice consent must be paired with explicit affirmation |
| **Authority** | Voice alone cannot authorize action |

### 8.2 Voice Does Not Equal Approval

Saying something aloud is not the same as approving it:

- Voice commands produce drafts and proposals, not executed actions
- "Schedule my appointment" → produces draft request for review
- "Send this message" → produces draft message for user confirmation
- Voice cannot bypass human-in-the-loop requirements

### 8.3 Voice Cannot Trigger Execution

In Phase J, voice input cannot trigger any form of execution:

| Voice Command | Result |
|---------------|--------|
| "Book my appointment" | Draft created; human review required |
| "Refill my prescription" | Request captured; human approval required |
| "Cancel my treatment" | NOT PROCESSED — escalated to human |

### 8.4 Voice Must Be Visible and Revocable

| Requirement | Implementation |
|-------------|----------------|
| **Visibility** | User must always know when voice is being captured (visual indicator) |
| **Transcript** | Voice input must be transcribed and shown to user for verification |
| **Revocation** | User may revoke or correct any voice input before proceeding |
| **Termination** | User may terminate voice session at any time |

---

## 9. Audit and Observability

### 9.1 Metadata-Only Audit

Audit logs in Phase J capture metadata, not content:

| Captured | Not Captured |
|----------|--------------|
| Timestamp of interaction | Full conversation transcript |
| User role and session ID | User's personal details |
| Intent category (e.g., "appointment query") | Specific medical content |
| Outcome category (e.g., "proposal generated") | PHI or clinical details |
| Denial reason (category) | Verbatim user statements |

### 9.2 No PHI in Logs

PHI must never appear in audit logs:

| Log Field | PHI Status |
|-----------|------------|
| User ID | Pseudonymized identifier only |
| Request type | Category, not content |
| Response type | Category, not content |
| Error details | Technical details only |
| Memory operations | Pointer references only |

### 9.3 Reasoning Step Traceability

Reasoning steps are traceable without exposing chain-of-thought:

| Traceable | Not Exposed |
|-----------|-------------|
| Which policies were evaluated | Full reasoning chain |
| Which context sources were accessed | Model weights or prompts |
| Which constraints were applied | Internal deliberation |
| Decision outcome (approved/denied) | Probability scores or confidence |

### 9.4 Audit Record Structure

Each interaction produces an audit record with:

| Field | Description |
|-------|-------------|
| `session_id` | Unique session identifier |
| `timestamp_start` | ISO 8601 timestamp of session start |
| `timestamp_end` | ISO 8601 timestamp of session end |
| `user_role` | Patient, clinician, or operator |
| `intent_category` | Categorized intent (not verbatim) |
| `outcome_category` | Categorized outcome (not verbatim) |
| `policies_evaluated` | List of policy identifiers evaluated |
| `execution_mode` | `NON_EXECUTING` (always in Phase J) |

---

## 10. Explicit Prohibitions

Phase J explicitly prohibits the following:

| Prohibition | Rationale |
|-------------|-----------|
| **No execution** | Zenthea may not execute actions against external systems |
| **No external API side effects** | No outbound calls that modify state |
| **No background actions** | No processing when user is not actively engaged |
| **No ambient capture** | No passive listening or observation |
| **No autonomous decisions** | AI cannot decide on behalf of users |
| **No patient record modification** | Zenthea cannot write to EHR or systems of record |
| **No communication sending** | Zenthea cannot send emails, messages, or notifications |
| **No appointment booking** | Zenthea may draft; humans must execute |
| **No prescription actions** | Zenthea may summarize; no medication authority |
| **No billing transactions** | Zenthea may explain; no financial operations |
| **No persistent surveillance** | No ongoing monitoring of user behavior |
| **No model training on user data** | User interactions do not train the model |

### 10.1 Technical Enforcement

These prohibitions must be enforced architecturally:

- Execution adapters must reject all requests from Phase J runtime
- External API gateways must block outbound calls from Phase J context
- Background task schedulers must not accept Phase J origination
- Memory systems must reject PHI storage attempts

---

## 11. Out of Scope

The following are explicitly out of scope for Phase J:

| Item | Rationale |
|------|-----------|
| **Implementation code** | Phase J is design-only; no code authorization |
| **UI mockups or wireframes** | Visual design requires separate authorization |
| **Mobile deployment specifics** | Deployment strategy is out of scope |
| **Execution adapter design** | Execution remains blocked |
| **Performance benchmarks** | No SLA commitments in design phase |
| **Regulatory certification claims** | Design does not constitute compliance |
| **Third-party integration details** | Integration requires separate approval |
| **Model selection or tuning** | Model decisions are operational, not design |
| **Pricing or billing implications** | Business decisions are out of scope |

---

## 12. Exit Criteria

Before any Phase J implementation may proceed, the following must be satisfied:

### 12.1 Governance Review

| Criterion | Evidence Required |
|-----------|------------------|
| This design artifact reviewed by Clinical Safety Board | Signed review record |
| This design artifact reviewed by Technical Architecture Committee | Signed review record |
| This design artifact reviewed by Compliance Officer | Signed review record |
| Privacy impact assessment completed | PIA document |

### 12.2 Security Review

| Criterion | Evidence Required |
|-----------|------------------|
| Memory model security review | Security assessment document |
| Audit log privacy review | Privacy assessment document |
| Voice interface threat model | Threat model document |
| Input validation review | Security checklist |

### 12.3 Privacy Review

| Criterion | Evidence Required |
|-----------|------------------|
| PHI handling boundaries verified | Privacy boundary document |
| Memory retention policies approved | Policy approval record |
| Consent model validated | Consent design review |
| Cross-user isolation verified | Isolation verification document |

### 12.4 Architectural Alignment

| Criterion | Evidence Required |
|-----------|------------------|
| Non-executing posture preserved | Architecture review document |
| Human-in-the-loop maintained | Workflow validation document |
| Fail-closed semantics verified | Failure mode analysis |
| Audit completeness confirmed | Audit coverage document |

### 12.5 Documentation Completeness

| Criterion | Evidence Required |
|-----------|------------------|
| All prohibited patterns documented | This document |
| All allowed patterns documented | This document |
| User-facing language guidelines | Language guidelines document |
| Operator training requirements | Training requirements document |

---

## 13. Closing Governance Statement

**This document authorizes understanding and governance alignment only.**

This document:

- Defines the architectural intent for Phase J
- Establishes boundaries and constraints for the Agent Runtime
- Specifies the Daily Interaction Loop structure
- Enumerates explicit prohibitions and requirements

This document does **not**:

- Authorize implementation of any Phase J component
- Authorize deployment to any environment
- Authorize integration with any external system
- Authorize collection of user data
- Authorize execution of any action

Implementation of Phase J requires separate, explicit authorization following completion of all exit criteria, governance reviews, and security assessments.

**No execution is authorized by this document.**

---

*Document Version: 1.0*  
*Classification: Internal — Architecture Design*  
*Execution Block Status: ENFORCED*  
*Implementation Status: NOT AUTHORIZED*
