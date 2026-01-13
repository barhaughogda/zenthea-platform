# K-01 — Assistant Runtime Shell (Non-Executing)

**Phase:** K  
**Type:** Design Artifact (Design-Only)  
**Status:** Draft  
**Author:** Platform Architecture  
**Date:** 2026-01-13  

---

## 1. Purpose and Scope

### 1.1 Phase K: The First Usable Assistant MVP

Phase K represents the **first usable assistant MVP** — a milestone where Zenthea becomes a tangible, interactive experience for patients, clinicians, and operators. This is the phase where the platform transitions from architectural design to observable, governed interaction.

The Assistant Runtime Shell is the **surface through which users interact with Zenthea**. It is:

- A conversational interface (text and voice)
- A governed boundary that constrains all interactions
- A demonstration of useful, trustworthy AI assistance
- A proof that value does not require authority

### 1.2 Explicitly Non-Executing, Non-Automating, Non-Authoritative

**Phase K is strictly non-executing, non-automating, and non-authoritative.**

The Assistant Runtime Shell:

- **Does not execute** actions against external systems
- **Does not automate** workflows or processes
- **Does not possess authority** to make decisions on behalf of users
- **Does not act autonomously** in any capacity
- **Does not operate in the background** when users are not engaged

The assistant is a **tool for understanding, not a tool for action**. Users interact with an assistant that listens, reasons, and responds — but never acts without explicit human intervention at every step.

### 1.3 What "Usable" Means in Phase K

"Usable" does not mean "executing." In Phase K, usability is defined as:

| Usable Means | Usable Does NOT Mean |
|--------------|----------------------|
| Users can ask questions and receive governed responses | Users can trigger actions through conversation |
| Users can receive summaries, explanations, and drafts | Users can have actions performed on their behalf |
| Users can interact through text and explicit voice input | Users can speak commands that execute automatically |
| Users can experience a coherent, session-scoped interaction | Users can have persistent agents working for them |
| Users can trust the assistant's boundaries and limitations | Users can delegate authority to the assistant |

### 1.4 This Document Is Design-Only

This document:

- Defines the architectural intent for the Assistant Runtime Shell
- Establishes boundaries, constraints, and governance requirements
- Specifies what the shell may and must not do
- Enumerates explicit prohibitions and safety guarantees

This document does **not**:

- Authorize implementation of any component
- Authorize deployment to any environment
- Authorize data collection or storage
- Enable any form of execution or automation

**No implementation is authorized by this document.**

---

## 2. Relationship to Prior Phases

Phase K builds upon and explicitly references the following phases:

| Phase | Relationship |
|-------|-------------|
| **Phase E** | Established non-executing orchestration with proposal-only, draft-only semantics. Phase K preserves this posture entirely. The Assistant Runtime Shell operates within Phase E's non-executing boundary — all reasoning and output remain proposals, never actions. |
| **Phase J** | Established the Agent Runtime (J-01), Session & Identity Binding (J-02), Memory Model (J-03), and Conversational Discipline (J-04). Phase K implements these designs as user-facing experience. The Assistant Runtime Shell is the surface where Phase J's governance becomes tangible. |
| **Phase I** | Defined shadow mode readiness and execution validation. **Phase I remains blocked.** Phase K does not unblock execution. Shadow mode validation may run concurrently but Phase K does not depend on or enable execution semantics. |

### 2.1 Phase E — Non-Executing Posture Preserved

Phase E established that orchestration produces metadata-only outputs and never executes. The Assistant Runtime Shell inherits this constraint completely:

- All outputs are proposals, drafts, summaries, or explanations
- No output triggers workflow execution
- No output modifies external system state
- No output constitutes authorization or approval

The Assistant Runtime Shell is the **user interface to Phase E's non-executing orchestration**.

### 2.2 Phase J — Agent Runtime Made Tangible

Phase J defined the governance framework for the Agent Runtime:

- J-01 established the Daily Interaction Loop and runtime components
- J-02 established session and identity binding
- J-03 established memory constraints and trust boundaries
- J-04 established conversational discipline and response semantics

The Assistant Runtime Shell is the **surface through which these designs become user experience**. Every constraint in Phase J applies to every interaction through the shell.

### 2.3 Phase I — Execution Remains Blocked

Phase I defined execution readiness and shadow mode validation. **Execution remains blocked.**

The Assistant Runtime Shell:

- Does not unblock execution
- Does not enable shadow mode execution
- Does not create a path to execution capability
- Operates entirely upstream of execution boundaries

Phase K demonstrates that **useful, governed AI assistance is possible without execution authority**.

---

## 3. Definition of the Assistant Runtime Shell

### 3.1 What the Assistant Runtime Shell Is

The Assistant Runtime Shell is the **bounded surface** through which users interact with the Zenthea Agent Runtime. It is composed of:

| Component | Description |
|-----------|-------------|
| **Interfaces** | Text input/output and explicit voice input/output |
| **Session Container** | Governed session with explicit start and end |
| **Reasoning Boundary** | Computational scope within which reasoning occurs |
| **Output Constraint** | Response discipline applied to all outputs |

### 3.2 What the Assistant Runtime Shell Is NOT

The Assistant Runtime Shell explicitly excludes:

| Excluded | Rationale |
|----------|-----------|
| **Background Agents** | No processes run when user is not actively engaged |
| **Autonomous Behavior** | No self-initiated actions or monitoring |
| **Persistent Listeners** | No ambient capture or always-on listening |
| **Execution Capability** | No ability to modify external systems |
| **Authority Surface** | No ability to authorize actions on behalf of users |

### 3.3 UI and Voice as Interfaces Only

User interfaces (UI and voice) are **input/output channels**, not sources of authority:

- UI is a presentation layer for text interaction
- Voice is a modality for input, not a trigger for action
- Neither UI nor voice grants authority beyond what governance permits
- Both channels are subject to identical constraints and discipline

### 3.4 Explicit, Bounded Interaction Only

All interaction through the Assistant Runtime Shell is:

| Property | Requirement |
|----------|-------------|
| **Explicit** | User consciously initiates every interaction |
| **Bounded** | Each interaction has defined start and end |
| **Session-Scoped** | No cross-session context without explicit consent |
| **User-Initiated** | No proactive outreach or AI-initiated contact |

---

## 4. Runtime Components (Conceptual Only)

The Assistant Runtime Shell conceptually comprises four components. These are **logical boundaries**, not implementation prescriptions.

### 4.1 Listening Component

The Listening component receives explicit user input.

| Attribute | Specification |
|-----------|---------------|
| **Trigger** | Explicit user action only (button press, text submission, wake word) |
| **Scope** | Input capture bounded to explicit user session |
| **Visibility** | User always knows when listening is active |
| **Revocability** | User can stop listening at any time |
| **Passivity** | No ambient listening, no background capture |

Listening is **explicit, visible, and revocable** at all times.

### 4.2 Reasoning Component

The Reasoning component processes input against context, policies, and knowledge.

| Attribute | Specification |
|-----------|---------------|
| **Scope** | Bounded to current session and available context |
| **Explainability** | Reasoning steps are traceable to policies and constraints |
| **External Effect** | None — reasoning produces no side effects |
| **Authority** | None — reasoning does not authorize action |

Reasoning is **bounded and explainable**, with zero external effect.

### 4.3 Memory Component

The Memory component manages session context per Phase J-03 constraints.

| Attribute | Specification |
|-----------|---------------|
| **Scope** | Session-only by default (Phase K design) |
| **Governance** | All memory rules from J-03 apply |
| **PHI** | Never stored in memory; reference only |
| **Persistence** | Destroyed at session teardown |

Memory is **session-only and governed**, with no PHI storage.

### 4.4 Output Component

The Output component produces responses per Phase J-04 discipline.

| Attribute | Specification |
|-----------|---------------|
| **Constraint** | All J-04 response discipline applies |
| **Labeling** | All outputs labeled as proposals, drafts, or information |
| **Execution** | No output triggers execution |
| **Authority** | No output constitutes authorization |

Output is **constrained by J-04 discipline**, with no execution capability.

---

## 5. Allowed Interaction Modes

### 5.1 Text Input

| Attribute | Requirement |
|-----------|-------------|
| **Trigger** | User explicitly submits text |
| **Scope** | Interaction bounded to explicit submission |
| **Session** | Clear session boundaries with explicit start and end |
| **Response** | Text response governed by J-04 discipline |

### 5.2 Explicit Voice Input

| Attribute | Requirement |
|-----------|-------------|
| **Trigger** | User explicitly activates voice input (button press, wake word) |
| **Duration** | Voice capture active only during explicit session |
| **Termination** | Capture ends when user explicitly ends or after defined timeout |
| **Visibility** | Visible indicator confirms capture state at all times |
| **Transcript** | Voice input transcribed and shown for user verification |

### 5.3 File/Context Upload (Read-Only)

| Attribute | Requirement |
|-----------|-------------|
| **Trigger** | User explicitly uploads or references a file |
| **Consent** | User explicitly consents to processing |
| **Scope** | Processing limited to explicit user request |
| **Modification** | Read-only — no modification of uploaded content |
| **Retention** | Session-only unless explicitly persisted with consent |

### 5.4 Prohibited Interaction Modes

The following interaction modes are **explicitly prohibited**:

| Prohibited Mode | Rationale |
|-----------------|-----------|
| **Ambient Capture** | Passive audio/video capture violates consent and privacy |
| **Background Listening** | Always-on listening creates surveillance surface |
| **Proactive Outreach** | AI-initiated contact violates human-in-the-loop |
| **Implicit Activation** | Activation without explicit user intent violates consent |
| **Persistent Monitoring** | Continuous observation violates privacy and trust |

---

## 6. Daily Interaction Loop

### 6.1 Session Start

| Step | Description | Constraint |
|------|-------------|------------|
| **User Initiates** | User explicitly starts interaction | No auto-start, no background start |
| **Shell Activates** | Assistant Runtime Shell becomes active | Visible indication of active state |
| **Listening State** | System ready to receive input | Explicit listening indicator |

### 6.2 Identity Binding

| Step | Description | Constraint |
|------|-------------|------------|
| **Identity Verification** | User identity verified per J-02 | Fail-closed on verification failure |
| **Role Binding** | User role (patient/clinician/operator) established | No role assumption |
| **Session Context** | Session bound to verified identity | No session without identity |

### 6.3 Consent Verification

| Step | Description | Constraint |
|------|-------------|------------|
| **Consent Check** | Consent verified for interaction scope | No processing before consent |
| **Scope Establishment** | Boundaries of permitted interaction established | No scope expansion without re-consent |
| **Fail-Closed** | Ambiguous consent treated as denial | Never assume consent |

### 6.4 Interaction

| Step | Description | Constraint |
|------|-------------|------------|
| **Input Receipt** | User input received and captured | Explicit input only |
| **Reasoning** | Input processed against context and policies | Bounded, explainable reasoning |
| **Output Generation** | Response generated per J-04 discipline | All outputs are proposals/drafts |

### 6.5 Response or Refusal

| Step | Description | Constraint |
|------|-------------|------------|
| **Response Delivery** | Governed response presented to user | Labeled as non-authoritative |
| **Refusal Delivery** | Clear refusal when request cannot be fulfilled | Plain-language, actionable refusal |
| **User Decision** | User reviews and decides next action | No automatic progression |

### 6.6 Session Teardown

| Step | Description | Constraint |
|------|-------------|------------|
| **User Terminates** | User explicitly ends session | No lingering processes |
| **State Destruction** | Session memory destroyed | No persistent side effects |
| **Audit Finalization** | Metadata-only audit record finalized | No PHI in audit |
| **Shell Deactivates** | Assistant Runtime Shell becomes inactive | Visible indication of inactive state |

---

## 7. Trust and Safety Guarantees

### 7.1 No Silent Behavior

The Assistant Runtime Shell guarantees:

| Guarantee | Specification |
|-----------|---------------|
| **No Background Processing** | Nothing happens when user is not engaged |
| **No Silent Data Collection** | All data processing is visible and consented |
| **No Hidden Actions** | All system behavior is observable |
| **No Covert Communication** | No external calls without user awareness |

**If the user is not actively interacting, the shell is inert.**

### 7.2 No Inferred Authority

The Assistant Runtime Shell guarantees:

| Guarantee | Specification |
|-----------|---------------|
| **No Assumed Permission** | Every action requires explicit authorization |
| **No Escalating Authority** | Interaction does not expand permissions |
| **No Role Assumption** | Authority is verified, never assumed |
| **No Delegation** | Users cannot delegate authority to the assistant |

**The assistant has exactly zero authority by default.**

### 7.3 No Promises of Action

The Assistant Runtime Shell guarantees:

| Guarantee | Specification |
|-----------|---------------|
| **No Execution Promises** | Assistant never promises to perform actions |
| **No Follow-Through Claims** | Assistant never claims it will do something later |
| **No Commitment Language** | No "I will," "I have," or "I can do" for actions |
| **No Future Tense Execution** | No statements implying future action capability |

**The assistant proposes; humans decide and act.**

### 7.4 Clear Uncertainty Handling

The Assistant Runtime Shell guarantees:

| Guarantee | Specification |
|-----------|---------------|
| **Explicit Uncertainty** | Uncertainty is stated directly, never hedged |
| **No False Confidence** | The assistant never masks uncertainty with confident language |
| **Scope Identification** | What is uncertain is specifically identified |
| **Resolution Path** | How to resolve uncertainty is suggested when possible |

**When the assistant doesn't know, it says so clearly.**

---

## 8. Failure and Refusal Semantics

### 8.1 Deterministic Denials

All denials are deterministic and auditable:

| Denial Type | Behavior |
|-------------|----------|
| **Consent Denial** | "I cannot proceed without your explicit consent for [scope]." |
| **Policy Denial** | "This request is outside my authorized scope. [Reason]." |
| **Context Denial** | "I don't have enough information to respond accurately." |
| **Authority Denial** | "I cannot perform this action. Only [authorized role] may do this." |
| **Capability Denial** | "I do not have the capability to [action]. I can [alternative]." |

### 8.2 Plain-Language Refusals

Refusals must be expressed in clear, non-technical language:

| Requirement | Specification |
|-------------|---------------|
| **Direct Statement** | "I cannot [action]" — not "I'm not able to" or "I wish I could" |
| **Reason Provided** | Clear explanation of why compliance is not possible |
| **No Apology** | No "unfortunately," "sorry," or "I wish" — constraints are appropriate |
| **Alternative Offered** | Actionable alternative path when possible |

### 8.3 No Hallucinated Certainty

The assistant must never express false confidence:

| Prohibited Pattern | Required Pattern |
|-------------------|------------------|
| "The answer is X" (when uncertain) | "Based on available information, X appears likely, but I cannot confirm." |
| "You should do X" | "One option is X. Please discuss with your provider." |
| "This means X" | "This may indicate X, but confirmation is required." |

### 8.4 No "Best Guess" Execution

The assistant must never guess at execution:

| Prohibited Pattern | Rationale |
|-------------------|-----------|
| "I'll assume you meant X and proceed" | Assumption without consent |
| "Let me try X and see if it works" | Execution without authorization |
| "I think you want X, so I'll do that" | Inference as authority |
| "The best option is X, so I'll go ahead" | Recommendation as action |

**When uncertain, the assistant asks. It never guesses and acts.**

---

## 9. Voice-Specific Constraints

### 9.1 Voice = Input Only

Voice is a modality for input, not a source of authority:

| Constraint | Specification |
|------------|---------------|
| **Input Channel** | Voice is an input method, equivalent to text |
| **Not Identity** | Voice is not sufficient for identity verification |
| **Not Consent** | Speaking does not equal consenting |
| **Not Authority** | Voice cannot authorize actions |

### 9.2 Same Rules as Text

Voice interactions follow identical rules as text:

| Principle | Application |
|-----------|-------------|
| **J-04 Discipline** | All conversational discipline applies to voice |
| **Refusal Semantics** | Voice refusals follow text refusal requirements |
| **Uncertainty Expression** | Uncertainty is stated identically in voice |
| **Labeling** | Voice outputs are labeled as proposals/drafts |

### 9.3 No Voice-Triggered Authority

Voice commands cannot trigger authority:

| Voice Command | Result |
|---------------|--------|
| "Schedule my appointment" | Draft request created for human review |
| "Send this message" | Draft message created for human confirmation |
| "Update my information" | Draft update created for human verification |
| "Cancel my [X]" | NOT PROCESSED — escalated to human |

### 9.4 Visible Listening State Required

Users must always know when voice is being captured:

| Requirement | Specification |
|-------------|---------------|
| **Visual Indicator** | Clear visual signal when voice capture is active |
| **Audio Indicator** | Optional audio confirmation of capture state |
| **Transcript Display** | Voice input transcribed and displayed for verification |
| **Termination Control** | User can terminate voice capture at any time |

---

## 10. Audit and Observability

### 10.1 Metadata-Only Audit

Audit logs capture metadata only:

| Captured | Not Captured |
|----------|--------------|
| Timestamp of interaction | Full conversation transcript |
| User role and session ID | User's personal details |
| Intent category (e.g., "scheduling inquiry") | Specific request content |
| Outcome category (e.g., "proposal generated") | PHI or clinical details |
| Denial reason (category) | Verbatim user statements |
| Response type (e.g., "informational") | Response content |

### 10.2 No PHI in Logs

PHI must never appear in audit logs:

| Log Field | PHI Status |
|-----------|------------|
| User ID | Pseudonymized identifier only |
| Request type | Category, not content |
| Response type | Category, not content |
| Error details | Technical details only |
| Memory operations | Pointer references only |

### 10.3 Session-Scoped Traceability

Each session produces a traceable audit record:

| Field | Description |
|-------|-------------|
| `session_id` | Unique session identifier |
| `timestamp_start` | ISO 8601 timestamp of session start |
| `timestamp_end` | ISO 8601 timestamp of session end |
| `user_role` | Patient, clinician, or operator |
| `intent_categories` | List of intent categories (not content) |
| `outcome_categories` | List of outcome categories (not content) |
| `denial_count` | Number of denials in session |
| `execution_mode` | `NON_EXECUTING` (always in Phase K) |

---

## 11. Explicit Prohibitions

Phase K explicitly prohibits the following:

### 11.1 No Execution

| Prohibition | Rationale |
|-------------|-----------|
| No execution against external systems | Phase E non-executing posture preserved |
| No API calls that modify state | Side effects are forbidden |
| No workflow triggering | Automation is forbidden |
| No transaction processing | Financial operations are forbidden |
| No record modification | Systems of record are not writable |

### 11.2 No Automation

| Prohibition | Rationale |
|-------------|-----------|
| No scheduled tasks | Background automation is forbidden |
| No triggered workflows | Automatic processes are forbidden |
| No event-driven actions | Reactive automation is forbidden |
| No conditional execution | Programmatic action is forbidden |

### 11.3 No Background Agents

| Prohibition | Rationale |
|-------------|-----------|
| No persistent processes | Nothing runs when user is not engaged |
| No monitoring agents | Surveillance is forbidden |
| No proactive services | AI-initiated contact is forbidden |
| No queue processors | Background work is forbidden |

### 11.4 No Long-Term Memory

| Prohibition | Rationale |
|-------------|-----------|
| No cross-session persistence (Phase K default) | Longitudinal memory deferred per J-03 |
| No PHI storage | PHI belongs in systems of record |
| No behavioral profiling | Profiling creates surveillance surfaces |
| No inferred trait storage | Inference is processing, not memory |

### 11.5 No Persuasion or Therapeutic Framing

| Prohibition | Rationale |
|-------------|-----------|
| No persuasive language | Undermines informed consent |
| No emotional manipulation | Violates trust boundaries |
| No therapeutic role assumption | Requires licensed professional |
| No relationship building | Creates inappropriate attachment |
| No advice as recommendation | May constitute unauthorized medical advice |

---

## 12. Out of Scope

The following are explicitly out of scope for Phase K design:

| Item | Rationale |
|------|-----------|
| **UI Mockups or Wireframes** | Visual design requires separate authorization |
| **Mobile Implementation** | Deployment specifics are implementation decisions |
| **Execution Adapters** | Execution remains blocked; adapter design is deferred |
| **Performance Guarantees** | No SLA commitments in design phase |
| **Voice Synthesis Configuration** | Implementation decision |
| **Model Selection** | Operational decision, not design |
| **Localization** | Implementation decision |
| **Pricing or Billing Implications** | Business decisions are out of scope |
| **Third-Party Integration Details** | Integration requires separate approval |
| **Regulatory Certification Claims** | Design does not constitute compliance |

---

## 13. Exit Criteria

Before any Phase K implementation may proceed, the following must be satisfied:

### 13.1 Governance Review

| Criterion | Evidence Required |
|-----------|------------------|
| This design artifact reviewed by Clinical Safety Board | Signed review record |
| This design artifact reviewed by Technical Architecture Committee | Signed review record |
| This design artifact reviewed by Compliance Officer | Signed review record |
| Privacy impact assessment completed | PIA document |

### 13.2 Security Review

| Criterion | Evidence Required |
|-----------|------------------|
| Voice interface threat model completed | Threat model document |
| Input validation security review | Security assessment |
| Session boundary security review | Security assessment |
| No-execution enforcement review | Security verification |

### 13.3 UX Safety Validation

| Criterion | Evidence Required |
|-----------|------------------|
| Refusal semantics validated for user safety | UX safety assessment |
| Voice constraints validated for accessibility | Accessibility review |
| Uncertainty expression validated for clarity | UX review |
| No-persuasion constraints validated | UX safety assessment |

### 13.4 Phase K Readiness Confirmation

| Criterion | Evidence Required |
|-----------|------------------|
| Phase J design artifacts (J-01 through J-04) approved | J-series approval records |
| Non-executing posture preserved | Architecture confirmation |
| Human-in-the-loop maintained | Workflow validation |
| Fail-closed semantics verified | Failure mode analysis |
| Phase E constraints respected | Architecture alignment document |

---

## 14. Closing Governance Statement

**This document authorizes understanding and design alignment only. It does not authorize implementation or execution.**

This document:

- Defines the architectural intent for the Assistant Runtime Shell
- Establishes boundaries and constraints for Phase K
- Specifies what the shell may and must not do
- Enumerates explicit prohibitions and safety guarantees
- Preserves the execution block from all prior phases

This document does **not**:

- Authorize implementation of any Phase K component
- Authorize deployment to any environment
- Authorize data collection or storage
- Authorize voice processing or capture
- Authorize integration with any external system
- Authorize execution of any action
- Unblock Phase I execution semantics
- Enable automation, background processing, or autonomous behavior

Implementation of Phase K requires separate, explicit authorization following completion of all exit criteria, governance reviews, security assessments, and UX safety validations.

**Phase K demonstrates that useful AI assistance is possible without execution authority.**

**The execution block remains in force.**

**No execution is authorized by this document.**

---

*Document Version: 1.0*  
*Classification: Internal — Architecture Design*  
*Execution Block Status: ENFORCED*  
*Implementation Status: NOT AUTHORIZED*  
*Automation Status: NOT AUTHORIZED*  
*Background Processing Status: NOT AUTHORIZED*
