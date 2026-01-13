# K-03 — Intent Classification and Capability Gating (Non-Executing)

**Phase:** K  
**Type:** Design Artifact (Design-Only)  
**Status:** Draft  
**Author:** Platform Architecture  
**Date:** 2026-01-13  

---

## 1. Purpose and Scope

### 1.1 Why Intent Classification Is Necessary for a Safe Assistant

Intent classification is the **deterministic process** by which the Zenthea assistant categorizes user input before generating any response. This classification is not an intelligence feature — it is a **safety boundary** that determines what the assistant may and must not do.

Every user input carries implicit or explicit intent. Without classification:

- The assistant cannot determine if a request requires clinical authority
- The assistant cannot detect requests that imply execution capability
- The assistant cannot apply role-appropriate response constraints
- The assistant cannot enforce fail-closed semantics on ambiguous input

**Intent classification is the first line of defense against unsafe assistant behavior.**

### 1.2 Intent Classification as a Safety Boundary

Intent classification exists to:

| Function | Purpose |
|----------|---------|
| **Prevent execution leakage** | Detect and block requests that imply the assistant can act |
| **Enforce response discipline** | Route classified intents to appropriate response types |
| **Apply capability constraints** | Ensure responses stay within Phase K's capability envelope |
| **Enable deterministic denials** | Produce consistent, auditable refusals for out-of-scope requests |
| **Support fail-closed posture** | Deny requests that cannot be confidently classified |

### 1.3 Intent Classification as a Governance Surface

Intent classification is not merely a routing mechanism. It is a **governance surface** that:

- Creates auditable decision points for every interaction
- Enables policy enforcement at the intent layer
- Provides evidence of deny-by-default posture
- Supports regulatory review of assistant behavior
- Documents the boundary between permitted and prohibited responses

### 1.4 Explicitly Non-Executing, Non-Authoritative, No Automation

**Phase K intent classification is strictly non-executing, non-authoritative, and non-automating.**

Intent classification:

- **Does not execute** any action based on classified intent
- **Does not authorize** any operation or workflow
- **Does not automate** any response generation beyond classification
- **Does not possess authority** to approve, confirm, or commit
- **Does not operate autonomously** — classification serves human-in-the-loop governance

### 1.5 This Document Is Design-Only

This document:

- Defines the governance intent for intent classification and capability gating
- Establishes boundaries and constraints for classification behavior
- Specifies what the classification layer may and must not do
- Enumerates explicit prohibitions and safety guarantees

This document does **not**:

- Authorize implementation of any classifier
- Provide classification algorithms, ML models, or scoring systems
- Define APIs, schemas, or data structures
- Authorize UI components or interaction flows
- Enable any form of execution or automation

**No implementation is authorized by this document.**

---

## 2. Relationship to Prior Phases

### 2.1 Phase E — Non-Executing Posture Inherited

Phase E established that orchestration produces metadata-only outputs and never executes. Intent classification inherits this constraint completely:

| Phase E Constraint | Intent Classification Implication |
|--------------------|----------------------------------|
| No side effects | Classification produces no external state changes |
| Proposal-only semantics | Classification routes to proposal/draft responses only |
| Fail-closed on uncertainty | Ambiguous intent treated as unclassifiable |
| Metadata-only traces | Classification decisions logged without PHI |

Intent classification is the **entry gate to Phase E's non-executing boundary**.

### 2.2 Phase J Constraints Applied

Phase J established the governance framework that intent classification must respect:

| Phase J Design | Intent Classification Implication |
|----------------|----------------------------------|
| **J-02 Session & Identity Binding** | Classification requires valid session and verified identity before processing; no classification without binding |
| **J-03 Memory Model** | Classification does not access longitudinal memory; session-scoped context only |
| **J-04 Conversational Discipline** | Classification determines which response discipline applies; routes to appropriate refusal semantics |

Every J-series constraint applies to every classification decision.

### 2.3 Phase K-01 — Runtime Shell Alignment

K-01 defined the Assistant Runtime Shell as the bounded surface for user interaction. Intent classification is the **gateway component** of the shell:

| K-01 Component | Classification Alignment |
|----------------|-------------------------|
| Listening Component | Classification processes explicit input only |
| Reasoning Component | Classification precedes reasoning; determines if reasoning may proceed |
| Memory Component | Classification respects J-03 memory constraints |
| Output Component | Classification determines permitted output category |

Classification is not separate from the runtime shell — it is the first governance layer within it.

### 2.4 Phase K-02 — Interaction Surfaces Alignment

K-02 defined product interaction surfaces as safety boundaries. Intent classification enforces these boundaries:

| K-02 Surface Constraint | Classification Enforcement |
|------------------------|---------------------------|
| No execution affordances | Classification blocks EXECUTION-INTENT category |
| Role-specific variants | Classification applies role-aware gating |
| Clear refusals required | Classification routes to refusal when appropriate |
| No implied authority | Classification rejects authority-implying requests |

Classification is how K-02's surface constraints become operationally enforceable.

---

## 3. Definitions

### 3.1 "Intent" vs "Request" vs "Command" vs "Execution"

| Term | Definition |
|------|------------|
| **Intent** | The underlying purpose or goal behind a user's input, as determined by classification. Intent is a categorization of what the user wants to accomplish. |
| **Request** | The literal input provided by the user (text or transcribed voice). A request may contain explicit or implicit intent. |
| **Command** | A request that implies the user expects the assistant to perform an action. In Phase K, commands are classified as EXECUTION-INTENT and cannot be fulfilled. |
| **Execution** | Any operation that modifies state in external systems, sends communications, commits transactions, or produces real-world effects. Phase K prohibits all execution. |

### 3.2 "Capability Gating"

**Capability Gating** is the enforcement mechanism that restricts assistant responses to the permitted capability envelope based on:

- Classified intent category
- User role and session binding
- Consent state
- Context sufficiency
- Policy constraints

Capability gating answers: "Given this classified intent, what response types are permitted?"

### 3.3 "Execution-Equivalent Language"

**Execution-Equivalent Language** refers to any phrasing in assistant output that could reasonably be interpreted as:

- Confirmation that an action has been performed
- Commitment to perform an action
- Implied completion of a workflow
- Authority to have made a decision

Examples: "Done," "Sent," "Scheduled," "Updated," "Your appointment is confirmed."

Execution-equivalent language is **prohibited** regardless of intent category.

### 3.4 "Fail-Closed" in This Context

**Fail-Closed** means that when the classification system encounters uncertainty, ambiguity, or error, it:

- Denies the request rather than attempting to process it
- Does not default to a "most likely" interpretation
- Does not proceed with partial classification
- Produces a clear, auditable denial
- Requires human clarification before proceeding

Fail-closed is not a fallback — it is the default posture for uncertain input.

---

## 4. Intent Categories (Design Taxonomy)

### 4.1 Intent Classification Table

| Category | Description | Examples |
|----------|-------------|----------|
| **INFORMATIONAL** | User seeks factual information, explanations, or clarification of existing data | "What time is my appointment?" "What does this medication do?" "What is my care plan?" |
| **CLARIFYING** | User asks a question to resolve ambiguity or understand options | "What do you mean by that?" "Can you explain the difference?" "What are my options?" |
| **DRAFTING** | User requests creation of a draft artifact (message, note, summary) that requires human review before any action | "Help me write a message to my doctor" "Draft a summary of my symptoms" "Prepare a question list" |
| **PROPOSAL** | User requests a non-binding proposal for an action they will decide upon | "What times are available for an appointment?" "Can you suggest a follow-up plan?" "What would a medication review involve?" |
| **REVIEW** | User requests human review workflow guidance or HITL escalation | "I need to discuss this with my provider" "Can someone review this?" "This needs clinical approval" |
| **NAVIGATION** | User seeks guidance on where or how to accomplish something outside the assistant | "How do I contact my provider?" "Where can I update my insurance?" "How do I access my records?" |
| **EXECUTION-INTENT** | User input implies expectation of real-world action or state change | "Schedule my appointment" "Send this message" "Cancel my prescription" "Submit this form" |
| **DISALLOWED** | User input requests self-harm information, illegal activity, policy-blocked content, or clinical decisions requiring professional authority | "How do I hurt myself?" "What's an illegal way to get medication?" "Diagnose my condition" |

### 4.2 Allowed and Prohibited Outputs by Category

| Category | Allowed Outputs | Prohibited Outputs |
|----------|-----------------|-------------------|
| **INFORMATIONAL** | Facts, explanations, data summaries with source attribution | Medical advice, diagnosis, treatment recommendations, execution-equivalent language |
| **CLARIFYING** | Questions for clarification, options presentation, explanation of terms | Leading questions, embedded assumptions, consent inference |
| **DRAFTING** | Draft artifacts clearly labeled "DRAFT — requires human review" | Final versions, "sent" or "submitted" artifacts, execution confirmation |
| **PROPOSAL** | Non-binding proposals with explicit "for your decision" framing | Commitments, confirmations, implied acceptance of proposals |
| **REVIEW** | Escalation guidance, contact information, workflow explanation | Promises of follow-up, commitments on behalf of humans, automatic escalation |
| **NAVIGATION** | Directions, contact methods, resource locations | Automatic navigation, form pre-filling, background redirection |
| **EXECUTION-INTENT** | Refusal with alternative (reframe as draft/proposal) | Any execution, confirmation, or action completion language |
| **DISALLOWED** | Clear refusal with reason; escalation guidance if safety concern | Any fulfillment, partial compliance, workarounds |

---

## 5. Capability Envelope (What Phase K Allows)

### 5.1 Explicitly Allowed Response Types

The following response types are permitted within Phase K's capability envelope:

| Response Type | Description | Labeling Requirement |
|---------------|-------------|---------------------|
| **Informational** | Factual responses with source attribution | None required beyond attribution |
| **Draft Artifacts** | Messages, notes, summaries for human review | Must be labeled "DRAFT" |
| **Non-Binding Proposals** | Options or suggestions for human decision | Must state "for your decision" or equivalent |
| **Refusals** | Clear denial with reason and alternative | Must follow J-04 refusal semantics |
| **Escalation Guidance** | Direction to appropriate human authority | Must not promise follow-up |
| **Clarifying Questions** | Questions to resolve ambiguity | Must not embed assumptions |
| **Navigation Assistance** | Directions to accomplish tasks elsewhere | Must not execute navigation |

### 5.2 Explicitly Disallowed Response Types

The following response types are **prohibited** in Phase K:

| Disallowed Response | Rationale |
|--------------------|-----------|
| **Confirmations** | "Done," "Completed," "Confirmed" imply execution |
| **Submissions** | Any indication that something has been submitted to a system |
| **Booking/Scheduling** | Any indication that an appointment or event has been created |
| **Sending** | Any indication that a message or communication has been transmitted |
| **Saving/Updating** | Any indication that data has been persisted to a system of record |
| **Notifying** | Any indication that a notification has been sent to another party |
| **Background Work** | Any indication of work happening outside the visible session |
| **Commitments** | "I will," "I'll make sure," "This will be handled" |
| **Implicit Progress** | Progress indicators suggesting real-world action |

---

## 6. Gating Rules (Deterministic)

### 6.1 Required Inputs for Gating Decision

Before any gating decision can be made, the following inputs must be verified:

| Input | Source | Requirement |
|-------|--------|-------------|
| **Session Binding** | J-02 | Valid session with verified identity |
| **User Role** | J-02 | Patient, Clinician, or Operator — verified |
| **Consent State** | J-02 | Explicit consent for interaction scope |
| **Context Sufficiency** | Current session | Sufficient context to classify intent |
| **Classified Intent** | Classification layer | Deterministic category assignment |

### 6.2 Gating Rule Ordering

Gating rules are evaluated in strict order. Failure at any stage produces denial:

```
1. IDENTITY / TENANT GATE
   └─ Is session bound to verified identity? (J-02)
   └─ Is tenant context established?
   └─ FAIL: "I cannot proceed without verified identity."

2. CONSENT GATE
   └─ Is consent granted for this interaction scope?
   └─ Is consent current (not revoked)?
   └─ FAIL: "I cannot proceed without your consent for this request."

3. CATEGORY GATE
   └─ Is intent classified with confidence?
   └─ Is classified category in ALLOWED set?
   └─ FAIL: "I cannot fulfill this type of request."

4. RESPONSE TYPE GATE
   └─ Is the required response type within capability envelope?
   └─ Does the response type match role constraints?
   └─ FAIL: "This request requires capabilities I do not have."
```

### 6.3 Deny-by-Default Posture

If any of the following conditions exist, the request is denied:

| Condition | Denial Reason |
|-----------|---------------|
| Intent cannot be confidently classified | "I don't understand this request well enough to proceed." |
| Multiple conflicting intents detected | "This request contains multiple goals. Please clarify one at a time." |
| Context is insufficient for classification | "I need more information to understand this request." |
| Category is ambiguous between INFORMATIONAL and EXECUTION-INTENT | Deny; request clarification |
| Role constraints conflict with intent | "This request is outside my scope for your role." |

### 6.4 No "Best Guess" Approvals

The classification and gating system must never:

- Assume the most likely intent when uncertain
- Proceed with partial classification confidence
- Default to a permissive category when ambiguous
- Approve requests that "probably" fall within scope
- Infer user intent from conversational patterns

**When uncertain, deny and request clarification.**

---

## 7. Execution Detection and Hard Block

### 7.1 Triggers for EXECUTION-INTENT Classification

The following patterns must trigger classification as EXECUTION-INTENT:

| Pattern Category | Examples |
|-----------------|----------|
| **Imperative action verbs** | "Schedule," "Book," "Send," "Submit," "Cancel," "Update," "Change," "Delete," "Create," "Register" |
| **Completion expectation** | "Please do X," "Go ahead and X," "Just X," "Can you X for me" |
| **Confirmation requests** | "Confirm my appointment," "Finalize this," "Make it official" |
| **Transaction language** | "Process this," "Complete the order," "Charge my card" |
| **Communication dispatch** | "Send this to my doctor," "Notify them," "Let them know," "Forward this" |
| **State modification** | "Update my address," "Change my preferences," "Set my reminder" |

### 7.2 Language Patterns Requiring Refusal or Rewrite

When EXECUTION-INTENT is detected, the assistant must:

1. **Refuse the execution component** clearly
2. **Offer a draft or proposal alternative** when applicable
3. **Explain what the user can do** to accomplish their goal through appropriate channels

| User Intent | Prohibited Response | Required Response |
|-------------|--------------------|--------------------|
| "Schedule my appointment" | "I've scheduled your appointment" | "I cannot schedule appointments. Here is a draft request you can review and submit through the patient portal." |
| "Send this to my doctor" | "Sent!" | "I cannot send messages. Here is a draft message for your review. You can send it through [channel]." |
| "Cancel my prescription" | "Cancelled" | "I cannot cancel prescriptions. Please contact [pharmacy/provider] to make this change." |

### 7.3 Voice Is Never Authority Escalation

Voice input receives identical classification treatment as text:

- Voice commands do not bypass gating rules
- Voice does not confer execution authority
- Voice-detected EXECUTION-INTENT produces identical refusal
- No "voice shortcut" patterns exist

**Voice is a modality, not a privilege.**

---

## 8. Cross-Role and Scope Protection

### 8.1 Role-Specific Classification Constraints

| Role | Additional Classification Constraints |
|------|--------------------------------------|
| **Patient** | Cannot access clinician tools or operator functions; clinical decision requests classified as DISALLOWED |
| **Clinician** | Can access patient context within consent; cannot access operator controls; AI clinical recommendations classified as DRAFTING (draft-only) |
| **Operator** | Cannot access patient-level data; cannot see PHI; clinical workflow requests classified as DISALLOWED |

### 8.2 Cross-Role Leakage Prevention

The classification layer must enforce:

| Prohibition | Enforcement |
|-------------|-------------|
| Patient cannot trigger clinician-scoped responses | Role gate denies before response generation |
| Clinician cannot access operator metrics or controls | Role gate blocks operator-scoped requests |
| Operator cannot access any PHI | PHI-containing intents blocked at classification |
| No role may access another role's session context | Session binding enforced per J-02 |

### 8.3 Role Elevation Prevention

The classification layer must prevent:

- Requests that attempt to gain higher-role capabilities
- Social engineering patterns that imply role change
- "On behalf of" requests that delegate authority
- Context manipulation that suggests elevated access

**Elevated authority requires a new session with explicit re-authentication (J-02).**

---

## 9. Failure, Denial, and Uncertainty Semantics

### 9.1 Deterministic Denial Messages

All denials from the classification and gating layer must be:

| Attribute | Requirement |
|-----------|-------------|
| **Deterministic** | Same input produces same denial |
| **Plain language** | No technical jargon, error codes, or system terminology |
| **Actionable** | User understands what they can do instead |
| **Non-apologetic** | No "unfortunately" or "I wish I could" — constraints are appropriate |
| **Complete** | User has all information needed to understand the denial |

### 9.2 Denial Message Categories

| Denial Category | Example Message |
|-----------------|-----------------|
| **Identity/Session** | "I cannot proceed without a verified session. Please sign in to continue." |
| **Consent** | "I cannot proceed without your consent for this type of request." |
| **Capability** | "I cannot perform this action. I can help you prepare a draft instead." |
| **Category** | "This type of request is outside my scope. Please contact [appropriate resource]." |
| **Context** | "I don't have enough information to respond accurately. Can you clarify [specific aspect]?" |
| **Role** | "This request requires capabilities not available for your role." |
| **Policy** | "This request is not permitted. [Brief reason without technical details]." |

### 9.3 No Silent Failures

The classification and gating layer must never:

- Drop a request without response
- Fail silently and return a generic response
- Change the subject without acknowledging the denied request
- Omit denial indication when gating fails

**Every gating failure produces an explicit, visible denial.**

### 9.4 No Technical Leakage in Denials

Denial messages must not expose:

| Prohibited | Rationale |
|------------|-----------|
| Classification confidence scores | Implementation detail |
| Internal category names | System architecture |
| Gating rule identifiers | Policy structure |
| Error codes or stack traces | Technical implementation |
| Model or classifier details | Security and confusion |

---

## 10. Audit and Observability (Metadata-Only)

### 10.1 What Gets Recorded

The classification and gating layer produces audit records containing:

| Field | Description |
|-------|-------------|
| `session_id` | Pseudonymized session identifier |
| `timestamp` | ISO 8601 timestamp of classification decision |
| `intent_category` | Classified category (INFORMATIONAL, DRAFTING, etc.) |
| `outcome_type` | ALLOW, DENY, or ERROR |
| `gate_blocked` | If denied, which gate produced the denial (IDENTITY, CONSENT, CATEGORY, RESPONSE_TYPE) |
| `role` | User role (Patient, Clinician, Operator) |
| `response_type` | If allowed, the permitted response type |

### 10.2 What Is NOT Recorded

| Excluded | Rationale |
|----------|-----------|
| Verbatim user input | PHI/PII risk |
| Verbatim assistant response | Content storage out of scope |
| Classification confidence scores | Implementation detail |
| User name or identifiers | PHI; only pseudonymized references |
| Clinical content | PHI |
| Specific request details | Privacy |

### 10.3 Audit as Governance Evidence

Audit records from the classification layer serve as evidence of:

- Deny-by-default posture (ratio of denials to approvals)
- Gating rule enforcement (which gates are blocking)
- Role-appropriate routing (role distribution of intents)
- Category distribution (what users are requesting)

This evidence supports regulatory review and governance validation.

---

## 11. Explicit Prohibitions

### 11.1 No Execution Affordances

The classification and gating layer must never:

| Prohibition | Rationale |
|-------------|-----------|
| Allow responses that confirm execution | Phase K is non-executing |
| Route EXECUTION-INTENT to fulfillment | Execution is blocked |
| Provide "workarounds" for execution requests | Undermines safety boundary |
| Imply that execution will occur later | Creates false expectation |

### 11.2 No Implicit Consent

The classification layer must never:

| Prohibition | Rationale |
|-------------|-----------|
| Infer consent from continued conversation | J-02 requires explicit consent |
| Treat silence as approval | Fail-closed mandate |
| Expand consent scope based on context | J-02 scope boundaries |
| Assume consent from prior sessions | Session-scoped consent only |

### 11.3 No Background Agents

The classification layer must never:

| Prohibition | Rationale |
|-------------|-----------|
| Queue requests for later processing | No background work in Phase K |
| Create persistent classification state | Session-scoped only |
| Trigger asynchronous workflows | Non-executing posture |
| Enable "fire and forget" patterns | Human-in-the-loop required |

### 11.4 No Persuasion or Therapeutic Framing

The classification layer must not route to responses that:

| Prohibition | Rationale |
|-------------|-----------|
| Attempt to convince users to change intent | J-04 prohibits persuasion |
| Provide emotional counseling | J-04 prohibits therapeutic role |
| Build rapport to modify behavior | J-04 prohibits relationship language |
| Use urgency to influence decisions | J-04 prohibits coercive language |

### 11.5 No Long-Term Memory in Phase K

Classification decisions must not:

| Prohibition | Rationale |
|-------------|-----------|
| Reference longitudinal memory | J-03 Phase K design limits |
| Build user profiles from classification history | Surveillance risk |
| Adapt classification based on past sessions | Session-scoped only |
| Store classification patterns for inference | Profiling prohibition |

---

## 12. Out of Scope

The following are explicitly out of scope for this design artifact:

| Out of Scope Item | Rationale |
|-------------------|-----------|
| **Classification algorithms** | Implementation decision |
| **ML models or classifiers** | Implementation decision |
| **Scoring or confidence models** | Implementation decision |
| **API definitions** | Implementation decision |
| **Data schemas** | Implementation decision |
| **UI components** | Requires separate authorization |
| **Integration patterns** | Implementation decision |
| **Performance requirements** | Operational specification |
| **NLP pipeline design** | Implementation decision |
| **Prompt engineering** | Implementation decision |
| **Localization of denial messages** | Implementation decision |
| **Testing strategies** | Implementation decision |

---

## 13. Exit Criteria

Before any implementation of intent classification and capability gating may proceed, the following must be satisfied:

### 13.1 Governance Review

| Criterion | Evidence Required |
|-----------|------------------|
| This design artifact reviewed by Clinical Safety Board | Signed review record |
| This design artifact reviewed by Technical Architecture Committee | Signed review record |
| This design artifact reviewed by Compliance Officer | Signed review record |
| Privacy impact assessment completed | PIA document |

### 13.2 UX Safety Review

| Criterion | Evidence Required |
|-----------|------------------|
| Denial semantics validated for user safety | UX safety assessment |
| Refusal phrasing validated for clarity | UX review |
| No execution-equivalent language patterns | UX audit |
| Role-specific messaging validated | UX review |

### 13.3 Security and Privacy Review

| Criterion | Evidence Required |
|-----------|------------------|
| Classification bypass threat model completed | Threat model document |
| Cross-role leakage prevention validated | Security assessment |
| PHI exposure prevention validated | Privacy assessment |
| Audit tampering resistance validated | Security assessment |

### 13.4 Evidence of Deny-by-Default Posture

| Criterion | Evidence Required |
|-----------|------------------|
| Gating rules produce denial on ambiguity | Design validation document |
| No "best guess" approval paths exist | Architecture review |
| Fail-closed behavior on all error paths | Failure mode analysis |
| EXECUTION-INTENT category produces consistent denial | Design verification |

---

## 14. Closing Governance Statement

**This document authorizes understanding and design alignment only. It does not authorize implementation or execution.**

This document:

- Defines the governance intent for intent classification and capability gating
- Establishes boundaries and constraints for classification behavior
- Specifies what the classification layer may and must not do
- Enumerates explicit prohibitions and safety guarantees
- Preserves the execution block from all prior phases

This document does **not**:

- Authorize implementation of any classifier or gating system
- Authorize development of ML models, scoring systems, or NLP pipelines
- Authorize API design, schema definition, or integration patterns
- Authorize UI development or denial message copy
- Authorize deployment to any environment
- Authorize data collection, storage, or processing
- Authorize execution of any action
- Unblock Phase I execution semantics
- Enable automation, background processing, or autonomous behavior

Implementation of intent classification and capability gating requires separate, explicit authorization following completion of all exit criteria, governance reviews, security assessments, and UX safety validations.

**Intent classification is a safety boundary, not a routing convenience.**

**Capability gating is a governance surface, not an implementation detail.**

**The execution block remains in force.**

**No execution is authorized by this document.**

---

*Document Version: 1.0*  
*Classification: Internal — Architecture Design*  
*Execution Block Status: ENFORCED*  
*Implementation Status: NOT AUTHORIZED*  
*Automation Status: NOT AUTHORIZED*  
*Background Processing Status: NOT AUTHORIZED*
