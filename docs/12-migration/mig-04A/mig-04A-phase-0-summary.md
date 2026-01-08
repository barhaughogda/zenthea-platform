# MIG-04A – Phase 0 Summary: Clinical Documentation (Draft-Only, HITL)

## What MIG-04A is
MIG-04A is the **draft-only clinical documentation capability** of the Zenthea Platform. It enables AI-assisted generation and editing of clinical documentation **drafts** under strict **human-in-the-loop (HITL)** governance.

MIG-04A explicitly does **not** create legal medical record artifacts. It is a proposal workspace with auditability and consent gating, designed to be safe to deploy in regulated contexts.

## Why it exists
Clinical documentation is both:
- A high-leverage workflow for clinician time and care continuity, and
- A high-risk workflow where errors, provenance ambiguity, and uncontrolled automation can cause harm and regulatory exposure.

MIG-04A exists to capture the efficiency benefits of AI-assisted drafting **without** crossing into signing/finalization, write-back, or autonomous clinical action.

## What success looks like
Success in MIG-04A means:
- **Draft-only is unbreakable**: no sign/finalize/commit semantics and no write-back to systems of record.
- **HITL is enforced**: clinicians can review/edit drafts; AI outputs are clearly labeled as drafts requiring review.
- **Provenance is explicit**: what AI proposed vs what humans authored/edited is visible and attributable.
- **Auditability is complete**: draft lifecycle events and access are logged in a tamper-resistant way.
- **Consent + privacy controls are present**: consent gating, minimum necessary data exposure, and approved-vendor enforcement for PHI.
- **Clinically meaningful drafting**: core note families (e.g., SOAP, H&P, consult, discharge, procedure/operative, nursing, care plans, results narratives) are supported as drafts.

## What failure looks like
Failure in MIG-04A includes any of the following:
- Drafts are **misrepresented as final** or used for clinical decision-making without review.
- Any “commit” path leaks in (sign/finalize/lock/attest semantics, external EHR write-back, or background automation that advances state).
- Missing or weak provenance/audit trail (cannot reconstruct who saw/edited/generated what, and when).
- AI generates plausible-sounding but **fabricated clinical facts** without clear uncertainty and source constraints.
- PHI is exposed to unapproved vendors or logged/retained in ways that violate HIPAA/GDPR-aligned constraints.

## Why Phase 0 must precede implementation
Phase 0 (analysis + documentation) is required because clinical documentation is a safety-critical domain where:
- Scope creep (draft → finalization) must be prevented by design,
- The taxonomy of real-world documentation must be captured up front to avoid partial/unsafe implementations,
- Provenance, auditability, and amendment rules must be explicit before building workflows, and
- AI boundaries must be defined with **no ambiguity** to avoid regulator-unsafe behavior.

Phase 0 outputs are the authoritative guardrails for Phase 1 planning and implementation. Phase 1 must not begin until these constraints are accepted as the source of truth.

