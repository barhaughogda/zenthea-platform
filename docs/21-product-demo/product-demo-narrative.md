# Product Demo Narrative (Design-Only)

## 1. Purpose of the Demo Narrative

This document provides a regulator-safe, product-led narrative for demonstrating the Zenthea platform to patients, clinicians, operators, regulators, and investors. The goal is to show how conversational interactions (voice or UI) are translated into governed proposals and drafts over a controlled service layer, with clear stop points, human authority preserved, and auditable boundaries.

This is a design-only narrative for alignment and demonstration planning. It describes intended behavior and governance posture without authorizing build work, deployment, operational use, or external action. No execution is permitted based on this document.

## 2. What the Demo Is — and Is Not

- **Is**: a governed walkthrough of intent, proposals, drafts, simulations, and trust boundaries.
- **Is NOT**: a live system, execution engine, or production workflow.
- **Is NOT**: a demonstration of clinical, financial, or operational authority by an AI system.
- **Is NOT**: evidence of external integrations performing real actions during the demo.

## 3. Demo Cast (Roles)

- **Patient**: expresses goals and preferences; can use voice or UI; remains in control of what is shared.
- **Clinician**: reviews and edits draft clinical content; retains authorship and signing authority.
- **Provider / Operator**: reviews proposals, applies policy and governance gates, approves or denies; owns operational decision points.
- **AI Agent (explicitly non-authoritative)**: assists with interpretation and drafting; produces proposals and drafts only; cannot confirm, sign, book, bill, or execute.

## 4. End-to-End Demo Flow (Narrative)

One coherent story is used throughout: a patient requests help scheduling a follow-up and asks the clinician to draft a visit note summary for review. The demo shows proposals and drafts first (Phase E), then a simulated execution boundary (Phase H), and finally how Shadow Mode comparison would be used to validate readiness (Phase I).

1) **Patient speaks or types a request** (Voice or UI).
   - **What happens**: the request is captured as user intent with visible context boundaries (what the patient said, what was referenced).
   - **Prohibited**: no booking, no message sending, no order placement, no data writes beyond the demo context.

2) **Consent + session established**.
   - **What happens**: consent status is surfaced and the session scope is established (who is speaking, what domain is in scope, what data is eligible).
   - **Prohibited**: no access to data outside the session scope; no use of PHI outside approved surfaces; no logging of PHI.

3) **Proposal generated (Phase E)**.
   - **What happens**: the agent proposes one or more options (times, locations, provider preferences) as a **PROPOSAL** with explicit “not confirmed” labeling.
   - **Prohibited**: no confirmation, no external calendar writes, no patient notification as if confirmed.

4) **Clinician reviews and drafts (Phase E)**.
   - **What happens**: a clinician-facing draft note or summary is produced as **DRAFT ONLY (AI-assisted)** with clear “not signed” labeling.
   - **Prohibited**: no signing, no billing submission, no final documentation committed to record based on the draft alone.

5) **Provider approves (Phase E)**.
   - **What happens**: the provider/operator performs a human-in-the-loop decision: approve or deny the scheduling proposal and the draft disposition.
   - **Prohibited**: the agent does not approve; approvals do not perform external actions in this demo narrative.

6) **Execution simulated (Phase H)**.
   - **What happens**: the system demonstrates a dry-run/simulation result that explains what would have been executed, with a clear label that no external action occurred.
   - **Prohibited**: no real booking, no real messages, no real EHR write; the simulation output is not treated as confirmation.

7) **Shadow Mode comparison explained (Phase I)**.
   - **What happens**: future-facing readiness validation is described: comparing proposed outcomes vs observed human decisions to measure drift and safety signals.
   - **Prohibited**: no implication that Shadow Mode is running today; no claim of live monitoring in production as part of this demo.

## 5. What the User Sees vs What the System Does

- **What the user sees (patient/clinician/provider)**
  - Clear labels: **PROPOSAL**, **PENDING PROVIDER APPROVAL**, **DRAFT ONLY**, **NOT SIGNED**, **SIMULATED**.
  - Consent visibility and session scope cues (what data is in scope).
  - Human decision points presented as required steps, not suggestions.
  - Denials phrased deterministically and conservatively (“Denied by policy. No action taken.”).

- **What the system does (governance-first, not user-facing)**
  - Applies deny-by-default policy gates and fails closed on uncertainty.
  - Constrains context to the current session boundary and declared consent.
  - Produces artifacts as proposals/drafts with explicit non-execution semantics.
  - Records audit metadata where required, without storing PHI in logs.
  - Exposes operator observability to explain denials and stop points.

## 6. Trust Signals Demonstrated

- **Consent visibility**: the demo surfaces whether consent is present and what scope is permitted.
- **Draft-only labeling**: clinical content is labeled as draft, not signed, requiring clinician review.
- **Pending vs confirmed language**: scheduling outputs are proposals unless a provider explicitly approves.
- **Simulation vs execution separation**: Phase H is framed as simulated outcomes; no external action is taken.
- **Auditability**: decisions, denials, and transitions are traceable via metadata and operator views, without PHI in logs.

## 7. Why This Is Different From Legacy EHRs

- **Clear separation of intent from action**: user requests create proposals and drafts, not transactions.
- **Human authority is explicit**: clinicians and providers approve, edit, and sign; the agent does not.
- **Governance is visible**: denials and stop points are explainable to operators and reviewers.
- **Safer demonstration posture**: simulations can be shown without implying production execution.

## 8. What This Demo Proves Today

- The platform can represent patient intent as structured proposals with explicit stop points.
- Consent and session scope can be treated as first-class gates for what is shown and what is prohibited.
- Clinician drafting can be framed as draft-only, with preserved signing authority and review requirements.
- Provider/operator decisions can be demonstrated as the required step that controls progression.
- Simulation can be presented as a non-executing artifact to validate end-to-end flow clarity.

## 9. What This Demo Does NOT Claim

- No live execution (no booking, messaging, orders, billing, or record writes).
- No autonomous AI.
- No clinical or financial authority delegated to an AI system.
- No ambient listening.
- No claim of completeness, guaranteed safety, or production readiness based on the demo narrative alone.

## 10. Forward Path

This narrative supports a phased progression without promising timelines or operational enablement. Phase E demonstrates governed proposals and drafts. Phase H introduces simulation/dry-run framing to validate boundaries and operator understanding without external action. Phase I introduces future-facing Shadow Mode validation concepts (comparison and drift measurement) to support readiness evidence once governance criteria are satisfied.

## 11. Closing Statement

This demo narrative is intended to demonstrate governance posture: clear consent handling, constrained sessions, explicit proposal/draft semantics, human decision authority, and auditable stop points. It is written to support review and alignment and to avoid any implication of operational execution.

This document describes a demonstration narrative only. It does not authorize implementation, execution, or operational use.

