# J-02 — Session & Identity Binding for the Agent Runtime

**Phase:** J  
**Type:** Design Artifact (Design-Only)  
**Status:** Draft  
**Author:** Platform Architecture  
**Date:** 2026-01-13  

---

## 1. Purpose and Scope

### 1.1 Why Session & Identity Binding Is Mandatory

Session and identity binding is a foundational prerequisite for any meaningful agent interaction. Before Zenthea can provide useful assistance — even in a strictly non-executing capacity — the system must know with certainty:

- **Who** is interacting (identity)
- **In what capacity** (role)
- **Under what authority** (session-scoped consent and permissions)
- **For what duration** (session boundaries)

Without these guarantees, the agent runtime cannot:

- Apply appropriate access policies
- Enforce role-based constraints
- Scope memory and context correctly
- Produce auditable interaction records
- Respect consent boundaries

**There is no useful agent interaction without verified identity and session binding.**

### 1.2 Explicit Non-Executing Posture

This document maintains the Phase J non-executing posture established in J-01. Session and identity binding governs **who may interact** and **under what constraints**. It does not authorize:

- Identity verification implementation
- Authentication protocol selection
- Session management infrastructure
- Any form of execution authority

Session binding enables governance. It does not enable action.

### 1.3 Fail-Closed Mandate

All session and identity operations operate under a fail-closed mandate:

- Ambiguous identity → Deny interaction
- Missing session → Deny processing
- Unclear consent → Treat as denied
- Uncertain authority → Reject request

The system does not guess, infer, or assume identity or authority.

---

## 2. Relationship to Prior Phases

Phase J-02 builds upon and explicitly references the following phases:

| Phase | Relationship |
|-------|-------------|
| **Phase E** | Established orchestration design with explicit session context validation requirements. Phase J-02 extends session semantics to the agent runtime interaction model. |
| **Phase I** | Defined shadow mode validation with zero-interference guarantees. Phase J-02 ensures identity binding does not create new interference or side-effect risks. |
| **Phase J-01** | Established the Daily Interaction Loop requiring session establishment before processing. Phase J-02 defines the binding model that satisfies this requirement. |

### 2.1 Phase E Session Context

Phase E (Orchestration Design) established that:

- Context validation must occur before policy evaluation
- Session context must be complete and non-sensitive
- Correlation identifiers must not include PHI/PII

Phase J-02 applies these principles to the interactive agent runtime, extending them to voice, text, and UI modalities.

### 2.2 Phase I Identity Guarantees

Phase I (Shadow Mode) established that:

- No patient care shall be impacted by the system
- Privacy preservation remains paramount
- No bypassing of safety gates is permitted

Phase J-02 ensures that identity binding reinforces these guarantees and does not introduce new attack surfaces.

### 2.3 Phase J-01 Session Establishment Stage

The Daily Interaction Loop (J-01, Section 5) defines Stage 2 as "Establish Session & Consent." Phase J-02 provides the governance design for this stage, specifying:

- What constitutes a valid session
- How identity is bound to session
- How consent is scoped and verified
- How authority is constrained

---

## 3. Identity Domains

### 3.1 Recognized Identity Domains

Zenthea recognizes three distinct identity domains, each with specific authority constraints and session semantics:

| Domain | Description | Authority Scope |
|--------|-------------|-----------------|
| **Patient** | An individual receiving or seeking care | Access to own records, own care plans, own communications |
| **Clinician** | A licensed healthcare provider | Access to assigned patient records, clinical workflows, documentation |
| **Operator / Admin** | System administrator or operational staff | Access to system configuration, audit logs, operational metrics |

### 3.2 Domain Isolation Requirements

Each identity domain is strictly isolated:

- **No cross-domain inference**: A patient session cannot access clinician context
- **No implicit domain expansion**: Authority does not expand across domain boundaries
- **No domain blending**: A single session cannot span multiple identity domains
- **No inherited authority**: Child sessions do not inherit parent domain authority

### 3.3 AI as Identity Holder — Explicit Prohibition

**The AI is never an identity holder.**

Zenthea cannot:

- Act as its own identity
- Hold authority independent of a human user
- Accumulate permissions across sessions
- Represent itself as an actor in auditable transactions

All actions, proposals, and outputs are attributed to the human identity that initiated the session. The AI is a tool within the session, not a participant with independent standing.

### 3.4 Identity Verification Boundaries

This document defines governance requirements for identity binding. It does not specify:

- Authentication mechanisms (passwords, biometrics, tokens)
- Identity provider selection
- Credential storage or management
- Multi-factor authentication requirements

These implementation concerns are explicitly out of scope (Section 11).

---

## 4. Session Binding Model

### 4.1 Definition of Session

A **session** is a time-bounded, identity-bound, consent-scoped interaction context within which the agent runtime may process user requests. A session has:

| Property | Requirement |
|----------|-------------|
| **Unique identifier** | Each session has a unique, non-predictable session ID |
| **Bound identity** | Each session is bound to exactly one verified human identity |
| **Bound role** | Each session operates under exactly one identity domain (Patient, Clinician, Operator) |
| **Explicit start** | Sessions begin with explicit user action, never implicitly |
| **Explicit end** | Sessions terminate explicitly or via timeout, never silently |
| **Scoped consent** | Consent is captured and applies only within session boundaries |
| **Bounded duration** | Sessions have a maximum duration; no indefinite sessions exist |

### 4.2 Session-Scoped Authority

All authority is session-scoped:

- Authority is granted at session establishment
- Authority cannot be expanded during an active session
- Authority terminates when the session ends
- Authority does not persist across sessions unless re-established

### 4.3 Role-Bound Sessions

Each session operates under a single role:

| Session Role | Authority Constraints |
|--------------|----------------------|
| **Patient Session** | Access limited to that patient's own records, preferences, and communications |
| **Clinician Session** | Access limited to assigned patients and authorized clinical functions |
| **Operator Session** | Access limited to operational functions; no patient-level access |

### 4.4 No Cross-Role Inference

The agent runtime shall not:

- Infer patient identity from clinician context
- Infer clinician preferences from patient interactions
- Blend administrative and clinical authority
- Derive permissions from session history

Each session is evaluated independently against its declared role.

### 4.5 No Implicit Elevation

Authority cannot be elevated within a session:

- A patient cannot gain clinician access by request
- A clinician cannot gain operator access by context
- No "sudo" or "escalation" pattern exists within a session
- Elevated authority requires a new session with explicit re-authentication

---

## 5. Voice and UI Binding Rules

### 5.1 Voice Is Input Only

Voice is a modality for capturing user intent. Voice does not confer:

- Identity verification (voice biometrics are not authorized for identity binding)
- Implicit consent
- Authority expansion
- Execution capability

Voice input must be bound to an already-established session with verified identity.

### 5.2 All Input Must Bind to an Active Session

Every input — voice, text, file, or UI interaction — must be bound to an active, valid session before processing:

| Input Type | Binding Requirement |
|------------|---------------------|
| **Voice command** | Must be captured within an active session with visible session indicator |
| **Text input** | Must be submitted from authenticated UI with valid session token |
| **File upload** | Must be initiated from authenticated context with explicit consent |
| **UI interaction** | Must occur within authenticated application session |

### 5.3 No Anonymous Capture

The system shall not:

- Capture voice without session binding
- Process text from unauthenticated sources
- Accept file uploads without identity verification
- Record interactions for anonymous or unknown users

### 5.4 No Ambient Capture

The system shall not:

- Listen passively when not explicitly invoked
- Monitor UI activity outside explicit interactions
- Observe user behavior for inference purposes
- Capture context from non-session sources

### 5.5 No "Best Guess" Attribution

If identity or session cannot be verified:

- Input is rejected, not attributed to a "likely" user
- Processing does not proceed with assumed identity
- No fallback to "anonymous" or "guest" identity
- System fails closed and requires explicit re-authentication

---

## 6. Consent and Authority Enforcement

### 6.1 Consent Must Be Explicit and Session-Scoped

Consent is:

| Property | Requirement |
|----------|-------------|
| **Explicit** | User must affirmatively grant consent; silence is not consent |
| **Informed** | User must understand what they are consenting to |
| **Session-scoped** | Consent applies only within the current session |
| **Revocable** | User may revoke consent at any time during the session |
| **Auditable** | Consent events are recorded in the audit log |

### 6.2 Consent Scope Boundaries

Consent is granular and does not expand:

- Consent to voice input does not imply consent to storage
- Consent to record access does not imply consent to sharing
- Consent in one session does not carry to future sessions
- Consent for one purpose does not extend to other purposes

### 6.3 Revocation Semantics

When consent is revoked:

- Processing stops immediately for the revoked scope
- No new operations begin under the revoked consent
- In-flight operations complete only if they cannot be safely interrupted
- The session may continue for other consented operations
- Revocation is recorded in the audit log

### 6.4 Fail-Closed Behavior on Ambiguity

When consent is ambiguous:

- Treat as not granted
- Request explicit clarification
- Do not proceed with processing
- Do not default to "implied" consent
- Log the ambiguity for audit purposes

---

## 7. Multi-Device and Continuity Rules (Design Only)

### 7.1 Session Continuity Principles

Session continuity across devices or modalities is subject to strict governance:

| Principle | Requirement |
|-----------|-------------|
| **Explicit transfer** | Session transfer to a new device requires explicit user action |
| **Re-authentication** | Device transfer may require re-authentication based on risk policy |
| **No silent handoff** | Sessions do not silently migrate between devices |
| **Visible state** | User must always know which device holds the active session |

### 7.2 Prohibited Continuity Patterns

The following are explicitly prohibited:

- **Silent session transfer**: Moving a session without user awareness
- **Ambient device detection**: Inferring session target from device proximity
- **Automatic handoff**: Transferring sessions based on context or location
- **Multi-device simultaneous**: Same session active on multiple devices
- **Session cloning**: Duplicating sessions for parallel operation

### 7.3 Design-Only Scope

This section defines governance requirements only. Implementation of multi-device session management is out of scope for Phase J.

---

## 8. Failure, Denial, and Ambiguity Handling

### 8.1 Deterministic Denials

Session and identity failures produce deterministic, auditable denials:

| Failure Type | Response | Audit |
|--------------|----------|-------|
| **Identity not verified** | Deny session creation; prompt for authentication | IdentityVerificationFailed |
| **Session expired** | Deny request; prompt for re-authentication | SessionExpired |
| **Session not found** | Deny request; prompt for session establishment | SessionNotFound |
| **Role mismatch** | Deny request; explain required role | RoleMismatch |
| **Consent not granted** | Deny processing; request consent | ConsentNotGranted |
| **Consent revoked** | Stop processing; acknowledge revocation | ConsentRevoked |

### 8.2 Plain-Language Failure Explanation

All failures must be explained in clear, user-appropriate language:

- Explain what failed
- Explain why it failed (in user terms)
- Explain what the user can do to recover
- Do not expose technical details or system internals

### 8.3 No Silent Drops

The system shall not:

- Silently ignore requests when session is invalid
- Fail without user notification
- Process partial requests without acknowledgment
- Drop connections without explanation

Every failure produces an explicit, visible response.

---

## 9. Audit and Attribution

### 9.1 Metadata-Only Audit

Audit records for session and identity binding capture metadata only:

| Captured | Not Captured |
|----------|--------------|
| Session ID | Session contents or conversation |
| Session start/end timestamps | User's spoken or typed words |
| Identity domain (Patient/Clinician/Operator) | User's name or personal identifiers |
| Consent event categories | Specific consent text |
| Denial reason codes | Detailed failure context |
| Device/modality category | Device identifiers or fingerprints |

### 9.2 Identity + Session ID Binding

Every auditable event includes:

| Field | Description |
|-------|-------------|
| `session_id` | Unique session identifier (pseudonymized) |
| `identity_domain` | Patient, Clinician, or Operator |
| `identity_ref` | Pseudonymized identity reference (never PII) |
| `timestamp` | ISO 8601 timestamp |
| `event_type` | Categorized event type |
| `outcome` | Success, Denied, Failed |

### 9.3 No PHI in Logs

PHI shall never appear in session or identity audit logs:

- No patient names, MRNs, or dates of birth
- No clinical content or diagnosis codes
- No addresses, phone numbers, or emails
- No biometric identifiers
- No device serial numbers or unique hardware IDs

---

## 10. Explicit Prohibitions

Phase J-02 explicitly prohibits the following:

| Prohibition | Rationale |
|-------------|-----------|
| **No ambient identity inference** | Identity must be explicitly verified, not inferred from context, location, or device |
| **No long-lived implicit sessions** | Sessions must have bounded duration with explicit renewal |
| **No execution authority** | Session binding enables governance, not action |
| **No memory without identity** | Agent memory cannot be accessed or written without a valid, bound session |
| **No voice-based identity verification** | Voice biometrics are not authorized for identity binding in Phase J |
| **No device-based identity assumption** | Device ownership does not prove user identity |
| **No session inheritance** | New sessions do not inherit authority from previous sessions |
| **No shared sessions** | Sessions are bound to exactly one identity; no multi-user sessions |
| **No anonymous interaction** | All agent interactions require verified identity |
| **No consent by default** | Consent must be explicitly granted, not assumed |

### 10.1 Technical Enforcement Principles

These prohibitions must be architecturally enforceable:

- Session validation must precede all agent processing
- Identity verification must precede session creation
- Consent verification must precede scoped operations
- Audit capture must be non-optional for session events

---

## 11. Out of Scope

The following are explicitly out of scope for Phase J-02:

| Item | Rationale |
|------|-----------|
| **Authentication protocols** | Protocol selection (OAuth, SAML, etc.) is implementation |
| **UI flows** | Login screens, session indicators, and UX are implementation |
| **Mobile implementation** | Platform-specific session handling is implementation |
| **Execution adapters** | Execution remains blocked per Phase J posture |
| **Biometric implementation** | Biometric verification technology selection is implementation |
| **Token management** | Session token formats and storage are implementation |
| **Identity provider integration** | IdP selection and integration are implementation |
| **Device management** | Device registration and trust establishment are implementation |
| **Password policies** | Credential requirements are implementation |
| **Multi-factor authentication** | MFA mechanisms are implementation |

---

## 12. Exit Criteria

Before any Phase J implementation related to session and identity binding may proceed, the following must be satisfied:

### 12.1 Governance Review

| Criterion | Evidence Required |
|-----------|------------------|
| This design artifact reviewed by Clinical Safety Board | Signed review record |
| This design artifact reviewed by Technical Architecture Committee | Signed review record |
| This design artifact reviewed by Compliance Officer | Signed review record |
| Privacy impact assessment completed for identity handling | PIA document |

### 12.2 Security Review

| Criterion | Evidence Required |
|-----------|------------------|
| Session binding threat model completed | Threat model document |
| Identity domain isolation review | Security assessment |
| Consent model security review | Security assessment |
| Audit trail tampering resistance review | Security assessment |

### 12.3 Privacy Review

| Criterion | Evidence Required |
|-----------|------------------|
| PHI exclusion from audit logs verified | Privacy boundary document |
| Pseudonymization approach approved | Privacy assessment |
| Cross-session data isolation verified | Isolation verification document |
| Consent semantics validated for HIPAA | Compliance review document |

### 12.4 Phase J Readiness Confirmation

| Criterion | Evidence Required |
|-----------|------------------|
| J-01 Agent Runtime design approved | J-01 approval record |
| J-02 Session Binding design approved | This document's approval record |
| Non-executing posture preserved | Architecture review confirmation |
| Identity binding does not enable execution | Security confirmation |

---

## 13. Closing Governance Statement

**This document authorizes understanding and governance design only. It does not authorize implementation or execution.**

This document:

- Defines the governance requirements for session and identity binding
- Establishes isolation boundaries for identity domains
- Specifies consent semantics and authority constraints
- Enumerates explicit prohibitions and audit requirements

This document does **not**:

- Authorize implementation of authentication systems
- Authorize implementation of session management infrastructure
- Authorize integration with identity providers
- Authorize deployment to any environment
- Authorize collection of identity data
- Authorize execution of any action

Implementation of session and identity binding requires separate, explicit authorization following completion of all exit criteria, governance reviews, and security assessments.

**No execution is authorized by this document.**

---

*Document Version: 1.0*  
*Classification: Internal — Architecture Design*  
*Execution Block Status: ENFORCED*  
*Implementation Status: NOT AUTHORIZED*
