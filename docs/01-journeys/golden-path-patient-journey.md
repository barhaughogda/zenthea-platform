# Golden Path Patient Journey (Narrative Spine)

## 1. Purpose and Scope

### Purpose
This document provides a **formal Golden Path patient journey**: a single, end-to-end narrative that describes how a **Patient** interacts with Zenthea from first contact through post-visit understanding.

It is designed to be readable by:
- Clinicians and practice leadership evaluating patient-facing trust boundaries.
- Investors and reviewers who need a coherent story **without feature promises**.

### What this journey represents
- A **governance-grounded narrative spine** derived from existing, documented roles, user stories, and service constraints.
- A description of **patient experience** and **system behavior**, including explicit “does / does not” boundaries.

### Explicit non-goals
- No new stakeholders, roles, or capabilities beyond what is already documented.
- No UI/UX wireframes or product design assumptions.
- No technical implementation details (APIs, schemas, storage, architecture diagrams).
- No prioritization, sequencing, or roadmap updates.
- No implied automation where governance requires proposals, approvals, or human review.

---

## 2. Journey Assumptions

### Regulatory posture
- This journey assumes operation in a **regulated posture** aligned with the platform’s HIPAA strategy and security model.
- Compliance is a **shared responsibility** between the platform and operators; this journey describes platform-bound behavior, not operational policy.

### Draft-only constraints (clinical)
- Zenthea’s clinical AI behavior is **draft-only** and **advisory**.
- AI is **forbidden** from signing, attesting, finalizing, or committing clinical records.

### Consent and governance principles
- **Consent is a hard gate** for PHI-bearing workflows: consent must be verified **before** data retrieval and **before** any AI invocation.
- The system must **fail closed** when consent or authorization cannot be verified.
- All sensitive behavior must be **auditable** using **metadata-only** events (no PHI in logs).
- Tool-driven workflows must remain **proposal-only** at the agent layer; execution (when it exists) is separated behind governance (approval + gateway patterns).

---

## 3. The Golden Path (Narrative)

> Each step includes: primary actor(s), supporting actors, what the patient experiences, and what Zenthea does and does not do.

### 3.1 Discovery and trust formation
- **Primary actor(s)**: Patient
- **Supporting actors**: Practice staff (as the practice’s patient-facing operational role)
- **What the patient experiences**
  - The patient encounters Zenthea through a healthcare practice that uses it.
  - The patient expects clear boundaries: what is informational vs what is clinical advice, and how their data is protected.
- **What Zenthea does**
  - Presents patient-facing assistance as **informational and educational**, using calm, non-alarmist language.
  - Treats privacy, consent, and minimum-necessary access as first-class constraints.
- **What Zenthea does NOT do**
  - Does not present AI output as diagnosis, treatment, or clinical authority.
  - Does not imply that “trust” replaces verification (identity, consent, and authorization remain explicit).

### 3.2 Patient identity and scope (entering the patient experience)
- **Primary actor(s)**: Patient
- **Supporting actors**: Consent Agent (as the authoritative consent decision system); Platform security controls (identity, tenant scoping)
- **What the patient experiences**
  - The patient uses a patient-facing surface to access their own information and ask questions.
  - The patient experiences clear refusals when requests exceed their scope.
- **What Zenthea does**
  - Treats access as **patient-scoped** and **tenant-scoped**.
  - Refuses cross-patient access attempts deterministically.
  - Performs consent verification before any PHI-bearing retrieval or AI processing.
- **What Zenthea does NOT do**
  - Does not “guess” consent.
  - Does not proceed when consent cannot be verified (fail closed).

### 3.3 Appointment request and booking (proposal-only)
- **Primary actor(s)**: Patient (or, alternatively, Clinical Staff initiating on behalf of the patient)
- **Supporting actors**: Appointment Booking Agent; Consent Agent; practice staff; an approval/execution pathway (see “Contextual / Not Yet Defined”)
- **What the patient experiences**
  - The patient requests an appointment, reschedule, or cancellation.
  - The patient sees outcomes framed as **pending** until confirmed.
  - If constraints exist (availability, conflicts), they are explained plainly.
- **What Zenthea does**
  - Produces **structured proposals** for scheduling actions (create/reschedule/cancel).
  - Requires identity + consent validation and policy checks before producing proposals.
  - Uses neutral language that avoids promising confirmed bookings.
- **What Zenthea does NOT do**
  - Does not directly book/modify/cancel appointments.
  - Does not bypass approval, consent, or authorization checks.
  - Does not send notifications autonomously by default.
- **Contextual / Not Yet Defined**
  - The named **approver** and the exact **governed execution gateway** behavior are referenced as required in scheduling flows, but are not defined as patient-visible capability in governing docs. The patient-visible “confirmation” step is therefore contextual.

### 3.4 Patient intake and pre-visit context
- **Primary actor(s)**: Patient
- **Supporting actors**: Clinical Staff; Consent Agent
- **What the patient experiences**
  - The patient may provide information needed for the visit (history, symptoms, updates) through practice workflows.
- **What Zenthea does**
  - Enforces that any PHI-bearing use of patient-provided information is consent-validated and purpose-limited.
  - Maintains identity and tenant scoping.
- **What Zenthea does NOT do**
  - Does not autonomously infer or enrich clinical facts from incomplete information.
  - Does not use patient-provided information to create clinical records without clinician initiation and review.
- **Contextual / Not Yet Defined**
  - Specific **intake capture** workflows and what is patient-entered vs staff-entered are not defined in the governing journey sources. This step exists as contextual pre-visit reality, but its exact Zenthea surface behavior is not yet defined.

### 3.5 Clinical encounter (clinician-led; patient not “driving” clinical AI)
- **Primary actor(s)**: Patient; Licensed Clinician
- **Supporting actors**: Clinical Documentation Agent (provider-facing); Medical Advisor Agent (provider-facing); Consent Agent
- **What the patient experiences**
  - The patient has a clinical encounter with their clinician.
  - The patient may experience improved clarity and reduced administrative friction as clinicians use drafting support (without the patient needing to interact with clinical AI directly).
- **What Zenthea does**
  - Allows clinicians to initiate **draft-only** documentation assistance.
  - Ensures documentation support is patient-scoped, purpose-limited, and consent-validated.
  - Ensures clinical reasoning support remains **advisory**, with uncertainty disclosed and evidence cited when external evidence is used.
- **What Zenthea does NOT do**
  - Does not diagnose autonomously, prescribe, order tests, or execute clinical actions.
  - Does not sign/attest/finalize/commit clinical records via AI (explicitly blocked).
  - Does not operate without explicit clinician initiation.

### 3.6 Documentation and review (drafts + human authority)
- **Primary actor(s)**: Licensed Clinician
- **Supporting actors**: Clinical Documentation Agent; Consent Agent; audit/oversight roles (metadata-only audit)
- **What the patient experiences**
  - The patient should not experience AI-generated content as a “final medical record.”
  - When patient-facing summaries are available, the patient experiences them as explanations and summaries—not diagnoses.
- **What Zenthea does**
  - Produces clinician-facing documentation as drafts that require clinician review, editing, acceptance, or rejection.
  - Captures draft acceptance/rejection signals as metadata for auditability and improvement loops.
- **What Zenthea does NOT do**
  - Does not create legally binding documentation autonomously.
  - Does not introduce new clinical facts that were not provided.

### 3.7 Orders, follow-ups, and referrals (explained, not executed)
- **Primary actor(s)**: Patient; Licensed Clinician
- **Supporting actors**: Patient Portal Agent (patient-facing); Medical Advisor Agent (provider-facing); Consent Agent
- **What the patient experiences**
  - The patient may need to understand next steps: follow-ups, monitoring, procedures, or referrals.
  - The patient may ask: “What does this mean?” and “What should I do next?”
- **What Zenthea does**
  - Provides informational explanations in plain language and directs the patient to appropriate next steps (e.g., contact the provider/practice).
  - Supports clinician-facing advisory suggestions (draft-only) for follow-up and monitoring ideas, requiring clinician review.
- **What Zenthea does NOT do**
  - Does not place orders, refer autonomously, or schedule downstream clinical actions automatically.
  - Does not allow downstream systems to act automatically on advisory outputs.
- **Contextual / Not Yet Defined**
  - The mechanics of how referrals/orders are represented and surfaced to patients (beyond explanation) are not defined in the governing sources. Any “execution” semantics must remain explicitly governed and are therefore contextual here.

### 3.8 Billing and insurance touchpoints (explanatory only; no financial execution by AI)
- **Primary actor(s)**: Patient (as the person receiving explanations); Billing/Revenue Cycle staff (domain stakeholders)
- **Supporting actors**: Billing domain service; Payment provider (as an external executor, where applicable)
- **What the patient experiences**
  - The patient may encounter billing-related information (statements, payment status, plan explanations) via the practice’s billing workflows.
  - The patient may seek explanations of what a charge means and what actions are available.
- **What Zenthea does**
  - Treats billing as a dedicated domain: billing is authoritative over money.
  - Allows AI to **summarize and explain** billing state when it is surfaced through patient-facing experiences.
- **What Zenthea does NOT do**
  - Does not initiate payments, apply credits/refunds, change pricing, or change entitlements via AI.
  - Does not imply payer/claims automation where it is not documented.
- **Contextual / Not Yet Defined**
  - Payer workflows (prior authorization, claims exchange), clearinghouse integrations, and related insurance interactions are explicitly listed as gaps in governing docs; therefore detailed patient insurance flows are contextual.

### 3.9 Patient post-visit understanding (patient portal Q&A)
- **Primary actor(s)**: Patient
- **Supporting actors**: Patient Portal Agent; Consent Agent
- **What the patient experiences**
  - The patient asks questions about their own record in plain language.
  - The patient receives calm, non-alarmist explanations, with clear labeling that content is not medical advice.
- **What Zenthea does**
  - Retrieves minimum necessary, patient-scoped information (when consent permits) and summarizes without hallucinating patient data.
  - Labels outputs as informational/educational and not medical advice.
  - Refuses unsafe requests (e.g., cross-patient data access, prompt injection attempts) and logs/audits refusal events as metadata.
- **What Zenthea does NOT do**
  - Does not provide diagnosis or treatment recommendations.
  - Does not reveal clinician-only notes unless explicitly authorized.
  - Does not proceed if consent cannot be verified (fail closed).

---

## 4. Governance Anchors

### Where consent is checked (hard gates)
- **Before patient portal retrieval and response generation**: consent must be verified before data retrieval and AI invocation.
- **Before scheduling proposals**: patient-related scheduling actions require consent and authorization validation.
- **Before provider-facing drafting**: clinical documentation and clinical advisory workflows must be patient-scoped, purpose-limited, and consent-validated.

### Where actions must fail closed
- When consent cannot be verified for any PHI-bearing workflow.
- When authorization (identity, role, tenant scope) cannot be verified.
- When a request attempts to exceed scope (e.g., cross-patient access, bypassing consent).

### Where AI is advisory only
- **Patient-facing**: informational/educational explanations, explicitly not medical advice.
- **Provider-facing**: draft-only documentation and advisory clinical reasoning; no autonomous clinical or financial actions.
- **Tool-driven workflows**: proposals only at the agent layer; execution is separated behind governance and explicit approvals.

---

## 5. Known Gaps and Deferred Areas

### Explicitly deferred
- **Clinical documentation “write paths & attestation”**: explicitly blocked (no AI signing/commit/finalization).

### Contextual / Not Yet Defined (cannot be described without speculation)
- **Scheduling execution details**: “proposal → approval → execution via governed gateway” is required by doctrine, but patient-visible confirmation mechanics and the named approver are not fully defined in the governing sources.
- **Patient intake capture**: specific intake workflows and surfaces are not specified in the governing sources.
- **Orders/referrals execution surfaces**: representation and execution semantics are not specified; only advisory and explanatory boundaries are documented.
- **Insurance/payer workflows**: prior authorization, claims exchange, clearinghouse integrations are explicitly listed as gaps.
- **Lab ordering / result ingestion interfaces**: exchange mechanics are not specified (patient portal may explain results, but ordering/ingestion is not defined).
- **Interoperability (HIE/HIN) and information blocking workflows**: specific Zenthea interoperability surfaces/standards support are not described.
- **Public health reporting workflows**: referenced as a gap; not defined as an operational patient journey.

---

## Required Execution Report

### Files read
- `docs/00-overview/stakeholders-and-user-stories.md`
- `docs/00-overview/stakeholder-planning-artifacts.md`
- `docs/00-overview/vision.md`
- `docs/00-overview/principles.md`
- `docs/ROADMAP.md`
- `docs/01-architecture/execution-standards.md`
- `docs/04-security-compliance/hipaa-strategy.md`
- `docs/04-security-compliance/security-model.md`
- `docs/04-security-compliance/vendor-selection.md`
- `docs/ARCHITECTURE-DOCTRINE-AUDIT.md`
- `docs/ARCHITECTURE-SLICE-SEAL-INDEX.md`
- `docs/ARCHITECTURE-CHECKPOINT-REPORT.md`
- `docs/05-services/patient-portal-agent.md`
- `docs/05-services/consent-agent.md`
- `docs/05-services/appointment-booking-agent.md`
- `docs/05-services/billing-and-monetisation.md`
- `docs/05-services/clinical-documentation-agent.md`
- `docs/05-services/medical-advisor-agent.md`

### File written
- `docs/01-journeys/golden-path-patient-journey.md`

### Ambiguities or gaps encountered (explicitly not guessed)
- Scheduling “proposal → approval → execution” includes a governed gateway and approval step, but patient-visible confirmation mechanics and the named approver are not fully specified in governing sources.
- Patient intake capture workflows are not specified.
- Orders/referrals execution semantics are not specified; only advisory/explanatory constraints are documented.
- Insurance/payer, clearinghouse, lab exchange mechanics, interoperability surfaces, and public health reporting are explicitly listed as gaps in governing docs.

