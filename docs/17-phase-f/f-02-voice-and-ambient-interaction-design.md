# F-02 — Voice and Ambient Interaction Design (Governance-Only)

**Document ID:** F-02-VAI  
**Mode:** GOVERNANCE / PHASE F — INTERACTION DESIGN (Design-Only)  
**Status:** DRAFT (Design-Only; no implementation authorized)  
**Authority:** Platform Governance (Phase F)  
**Builds on:** Phase E (Non-Executing Orchestration), Phase F (Execution Discovery)  

---

## 0. Document Intent and Constraints

This document is a **design-only governance artifact**. It defines a conservative, regulator-readable model for how **voice** and **ambient interaction** may be used in Zenthea **as interfaces over existing governed services**, without creating new authority, new execution paths, or new bypass surfaces.

This document explicitly does NOT authorize:

- Any implementation of any kind (no code, no infrastructure, no integrations)
- Any microphone APIs or device permission mechanics
- Any speech-to-text provider selection or vendor evaluation
- Any API, schema, or contract definition
- Any UI components or UI behavior specification
- Any background recording or covert capture
- Any execution capability, booking, payment, or irreversible state changes

Interpretation SHALL be conservative:

- Any behavior not explicitly permitted by this design is **FORBIDDEN**.
- Any ambiguity or missing prerequisite is **BLOCKING**.
- **Voice is an interface, not an authority. Voice ≠ execution authority.**

---

## 1. Context & Intent

### 1.1 Relationship to the Conversational AI Vision

The platform vision explicitly frames conversation and voice as **modalities**, not privileged capabilities: “UI, chat, and voice are interchangeable interfaces… over the same governed service layer” (see `docs/00-overview/vision.md`).

This document operationalizes that statement in Phase F terms: voice is treated as **input and presentation**, not as an alternative execution plane.

### 1.2 Relationship to Phase E (Non-Executing Orchestration)

Phase E established **non-executing orchestration patterns**: understanding intent, routing, applying governance gates, and emitting auditable outcomes without performing irreversible actions (see Phase E posture in `docs/17-phase-f/f-01-scheduling-execution-design.md`, `docs/16-phase-e/phase-e-expected-failures.md`, and `docs/ROADMAP.md`).

This document inherits Phase E’s posture:

- **Deny-by-default**
- **Fail-closed** on missing identity / tenant scope / consent / session context
- **No “best effort” behavior** when safety posture cannot be determined
- **Metadata-only audit** for sensitive flows

### 1.3 Relationship to Phase F (Execution Discovery)

Phase F exists to *frame and design* governed execution without implementing it (see `docs/17-phase-f/phase-f-discovery.md`). Voice interaction is explicitly not an execution unlock. It is a design topic only insofar as it must remain compatible with Phase F governance constraints for future domains.

### 1.4 Non-Negotiable Statement

**Voice interaction may express intent. It does not confer approval. It does not confer execution authority.**  
Any change to real-world or authoritative state remains governed by existing execution discovery principles (named authority, explicit approval, auditability, reversibility rules) and requires separate governance unlocks.

---

## 2. Interaction Modes (Defined Precisely)

This section defines the allowed vocabulary for voice and ambient interaction. Modes are mutually exclusive at any point in time; switching modes MUST be explicit and auditable.

### 2.1 Mode A — Explicit Voice Command (Push-to-talk or Wake + Intent)

**Definition:** The user intentionally initiates a voice capture window to express a bounded request (an “utterance”), with the intent to produce one of the platform’s non-executing outcomes (e.g., a proposal, a draft, or a deny/clarify response).

**Required properties:**

- **User-initiated start**: initiation is attributable to a clear user action (e.g., push-to-talk) or an explicit wake mechanism **that is still treated as an intentional initiation** (no covert always-on capture).
- **Bounded capture window**: the capture window is time-bounded and terminates deterministically.
- **Mode declaration**: the system declares that it is in “Explicit Voice Command” mode (see “listening state” requirements in Section 3).
- **Non-executing outputs only**: outcomes are restricted to **DENY / DRAFT / PROPOSAL**. No execution or commit is allowed. (Clarification loops are treated as **DENY** until a user supplies unambiguous, sufficient information.)

**Allowed in Phase F design:** YES  
**Allowed for any Phase F implementation:** NO (Phase F is design-only; implementation requires separate unlock.)

### 2.2 Mode B — Ambient Capture (Background Listening with Strict Constraints)

**Definition:** The system may listen in the background for limited, pre-declared purposes (e.g., contextual assistance), while imposing strict governance constraints to prevent covert surveillance, PHI leakage, or implicit authorization.

**Strict constraints (non-negotiable):**

- **No covert listening**: ambient capture MUST never be silent, hidden, or ambiguous to the user.
- **Hard purpose limitation**: ambient capture MUST be purpose-scoped and must not expand into generalized monitoring.
- **No action inference**: ambient capture MUST NOT infer or propose actions that could be interpreted as execution intent without explicit user-initiated confirmation in Mode A.
- **No default retention**: raw audio storage is prohibited by default (see Section 6).

**Allowed in Phase F design:** **FORBIDDEN** (defined here only to document the prohibition and required constraints for any future governance review).  
**Allowed for any Phase F implementation or pilot behavior:** **FORBIDDEN** until a separate, explicit governance unlock with threat model, consent UX specification, and regulatory review.

### 2.3 Mode C — Transcription-Only Mode (No Action Inference)

**Definition:** The user intentionally requests transcription as text output only. The system does not infer intent, does not route to orchestration, and does not produce proposals/drafts.

**Required properties:**

- **No orchestration invocation**: transcription-only is not an AI action planner. It does not propose next steps.
- **No intent detection**: any classification, intent labeling, or action suggestion is prohibited in this mode.
- **Explicit labeling**: transcription output is clearly labeled “transcription-only” and is not presented as a platform decision or recommendation.

**Allowed in Phase F design:** YES  
**Allowed for any Phase F implementation:** NO (Phase F is design-only; implementation requires separate unlock.)

### 2.4 Forbidden Hybridization (All Modes)

The following are forbidden across all modes:

- “Always-on” listening without a clearly declared mode and user-visible listening state
- Silent mode switching
- Background monitoring that produces action proposals without explicit user initiation
- Any mechanism where voice is treated as implicit approval, implicit consent, or “good enough” identity verification

---

## 3. Consent & Authority Model

### 3.1 When Voice Interaction Is Allowed (Design Constraints)

Voice interaction is only allowed conceptually when all of the following are true:

- The user is authenticated and attributable (patient or clinician identity is known)
- The tenant scope is known and deterministic
- Required consent gating is satisfied for the relevant data scope
- The listening mode and listening state are explicitly declared and auditable

If any prerequisite is missing, ambiguous, or stale, the system MUST **fail-closed** (deny or request re-establishment of context; see Sections 4–5).

### 3.2 Explicit vs Implicit Consent

**Explicit consent (required):**

- A user’s intentional initiation of Mode A (explicit voice command) or Mode C (transcription-only) is treated as **explicit consent for that bounded capture window only**, subject to policy and session scope.
- Any consent required for PHI-bearing retrieval, processing, or proposal generation MUST still be satisfied via the existing governance gates; voice does not override or substitute for consent verification.

**Implicit consent (prohibited):**

- The absence of objection is not consent.
- Presence in a room, proximity to a device, or continued session existence is not consent.
- Prior use of voice is not consent for future capture windows.

### 3.3 Listening State Must Be Visible and Auditable

The system MUST maintain a user-visible and auditable “listening state” with at least the following conceptual states:

- **NOT LISTENING**
- **LISTENING (Mode A / Mode B / Mode C)**
- **PROCESSING (post-capture)**
- **DENIED / BLOCKED (with reason)**

This document does not define UI, but it does require that the user can reliably determine listening state at all times, and that state transitions are captured as auditable metadata.

### 3.4 Prohibition of Silent or Covert Listening

Silent, covert, or ambiguous listening is **forbidden**. Any design or implementation proposal that cannot prove reliable user awareness of listening state is **non-compliant** and must be rejected.

---

## 4. Session & Context Binding (Fail-Closed)

Voice interaction is always processed under explicit context binding. If binding cannot be established deterministically, the system MUST fail-closed.

### 4.1 Binding to SL-03 PatientSessionContext (Patient Scope)

When voice is used in a patient-scoped context, all patient identity, tenant scope, and consent-scoped context MUST be derived via **SL-03 Patient Session Establishment** (PatientSessionContext).

Normative requirements:

- Voice MUST NOT introduce alternate patient identification methods.
- Voice MUST NOT accept “best guess” patient matching from speech content.
- If `PatientSessionContext` is missing or invalid, the system MUST **fail-closed**.

This inherits the sealed SL-03 posture: deterministic session context, metadata-only audit, and fail-closed behavior on missing identity fields (see `docs/locks/SL-03-final-seal.md`).

### 4.2 Clinician Identity Binding (Clinician Scope)

When voice is used by a clinician, the clinician identity MUST be valid and attributable and MUST be scoped to a tenant boundary.

Normative requirements:

- If clinician identity is missing/invalid, deny.
- If tenant scope is missing/mismatch/unauthorized, deny.
- If clinician session is invalid/expired, deny.

### 4.3 Tenant Scope Binding (All Scopes)

Every voice interaction MUST be bound to a single tenant scope:

- Cross-tenant interpretation is forbidden.
- If tenant is ambiguous, deny.

### 4.4 Fail-Closed on Missing or Ambiguous Context

If any of the following are missing, ambiguous, or unverified, the only permitted outcome is **DENY** (including a structured clarification request when safe):

- Identity (patient or clinician)
- Tenant scope
- Required consent state
- PatientSessionContext (when patient-scoped)

No proposals, drafts, or suggested actions may be produced if the system cannot prove correct context binding.

---

## 5. Safety & Failure Semantics (No “Best Guess”)

Voice introduces additional ambiguity (mishearing, partial utterances, background noise). The platform must treat these as governance-relevant failure modes.

### 5.1 Mishearing and Transcription Uncertainty

If the system cannot reliably interpret the utterance, it MUST:

- Request clarification (a **DENY** outcome with a structured clarification request) and present the interpreted text for confirmation, or
- Deny with a bounded reason (DENY) when clarification cannot safely resolve context.

### 5.2 Ambiguity and Partial Commands

When an utterance is ambiguous (multiple plausible intents) or partial (missing required parameters), the system MUST:

- Prefer clarification loops over action
- Produce a proposal/draft only after required parameters are explicitly confirmed

### 5.3 Explicit Prohibition of “Best Guess” Execution or Commitment

The system MUST NOT:

- Execute based on a “best guess”
- Infer missing critical details (dates, patient identity, tenant, approvals)
- Treat high confidence as authorization
- Convert ambiguous voice input into any irreversible outcome

### 5.4 Conservative Default Outcome

In uncertain conditions, the default posture is:

- **DENY** (when safety posture cannot be determined), including a clarification request when the system can safely ask targeted questions without expanding capability.

---

## 6. Audit & Observability (Metadata-Only; No Raw Audio by Default)

Voice interaction MUST be auditable in a manner consistent with the platform’s metadata-only posture.

### 6.1 What Must Be Auditable (Minimum Set)

At minimum, the audit trail MUST capture:

- **Mode used** (Mode A / Mode B / Mode C)
- **Listening state transitions** (NOT LISTENING ↔ LISTENING ↔ PROCESSING ↔ DENIED/BLOCKED)
- **Context binding outcome** (bound / not bound; patient-scoped vs clinician-scoped; tenant-bound vs blocked)
- **Gates evaluated** (identified by governing gate names; e.g., identity, tenant scope, consent, session context)
- **Intent detected (bounded)**: a conservative, non-payload label (e.g., an allowlisted intent category) and whether user confirmation was obtained
- **Outcome**: **DENY / DRAFT / PROPOSAL**

### 6.2 Prohibition: Storing Raw Audio by Default

Raw audio MUST NOT be stored by default.

If any future proposal requests raw audio retention, it MUST be treated as a separate, high-risk governance topic requiring explicit approval, purpose limitation, retention limits, and regulatory review. Absent that separate governance approval, raw audio retention remains forbidden.

### 6.3 Metadata-Only Audit Posture

Audit records for voice must remain metadata-only:

- No raw audio
- No raw transcripts in audit logs by default
- No PHI-bearing payloads in logs/audit/observability channels

Voice observability must allow an auditor to trace:

**intent → gates evaluated → decision outcome**

…without exposing sensitive content by default.

---

## 7. Explicitly Out of Scope (Hard Boundaries)

This document explicitly excludes:

- Microphone APIs, device permissions, OS-level capture semantics
- Speech-to-text provider selection, evaluation, or procurement
- Background recording, storage pipelines, or always-on listening
- Any execution behavior (booking, canceling, modifying schedules; financial actions; clinical commits)
- Any UI components, layouts, or user flow specifications

---

## 8. Exit Criteria (Required Before Any Implementation)

No implementation of voice or ambient interaction may begin until all of the following artifacts exist and are approved:

1. **Consent UX spec** (explicit consent boundaries, listening state disclosure requirements, and revocation semantics)
2. **Threat model** (including covert listening risks, replay attacks, wrong-patient risk, and PHI exposure analysis)
3. **Audit schema** (metadata-only requirements, event taxonomy, and non-omittability constraints)
4. **Regulatory review** (HIPAA/privacy posture review and any applicable jurisdictional requirements)

---

## 9. Closing Statement

**This document authorizes understanding and governance design only. It does not authorize implementation.**

