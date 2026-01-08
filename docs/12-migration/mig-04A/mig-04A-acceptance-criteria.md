# MIG-04A Acceptance Criteria (Phase 1): Pass/Fail Conditions

This document defines **objective pass/fail conditions** for MIG-04A.

It is normative and derived from:
- `docs/12-migration/mig-04A/clinical-documentation-domain.md`
- `docs/12-migration/mig-04A/mig-04A-phase-0-summary.md`
- `docs/12-migration/mig-04A/mig-04A-spec.md`
- `docs/12-migration/mig-04-acceptance-guardrails.md`

If any “fail the slice” condition triggers, MIG-04A must not ship and must not be marked complete.

---

## 1. Functional Acceptance Criteria (Draft Workspace)

- **AC-F1 Draft creation**: A clinician can request creation of a draft clinical documentation artifact for the canonical categories defined in Phase 0 (encounter, procedure/operative, nursing/allied health, diagnostic narratives, care coordination/communications, administrative narratives, external document derivatives, and amendments/addenda/corrections as draft artifacts).
- **AC-F2 Draft editing**: A clinician can edit draft narrative and structured sections.
- **AC-F3 Versioning**: Every update produces a new draft version; prior versions remain accessible for review.
- **AC-F4 Amendments/addenda/corrections**: Corrections/addenda/amendments are represented as **append-only** with explicit linkage to the version they address; no silent overwrite semantics exist.
- **AC-F5 Evidence references**: Drafts can include evidence references (chart evidence pointers; external guideline citations) visible to the human reviewer.
- **AC-F6 Discard semantics**: “Discard” does not delete history; it marks a draft/version as discarded with audit event emission.

---

## 2. Safety Acceptance Criteria (Clinical Risk Controls)

- **AC-S1 Draft-only labeling**: Every surface (API responses and any user-facing presentation) that includes clinical documentation content includes explicit:
  - “DRAFT ONLY (AI-assisted)”
  - “Not signed. Not a legal medical record.”
  - “Requires clinician review and editing before any use.”
- **AC-S2 No factual fabrication**: AI-generated outputs must not contain fabricated patient facts; where evidence is missing, the system must force uncertainty/clarification/refusal behavior.
- **AC-S3 Copy-forward risk control**: The system must detect and flag potentially stale or contradictory copied content for clinician review (as a safety prompt, not an automated correction).
- **AC-S4 Wrong-patient protection**: Requests must be tenant- and patient-scoped; any attempt at cross-patient leakage is blocked and tested.

---

## 3. AI Behavior Acceptance Criteria (Safety Contract Enforcement)

- **AC-AI1 Refusal behavior**: AI must refuse (and/or policy must hard-stop) requests to:
  - sign/attest/finalize/commit/lock/submit/write-back,
  - place orders as executed actions,
  - mutate systems-of-record (allergies, meds, problems) as executed actions,
  - fabricate findings/results/events,
  - bypass consent/authorization or access other patients’ data.
- **AC-AI2 Provenance**: For AI-assisted drafts, provenance metadata is captured and can be retrieved for audit:
  - model/provider/version
  - prompt template/version
  - retrieval sources (if any)
  - validation outcomes
- **AC-AI3 Evidence expectations**:
  - Patient fact claims must include chart evidence references or be explicitly marked unverified.
  - External knowledge references must include citations or be downgraded/refused for high-risk assertions.
- **AC-AI4 Prompt versioning**: Prompt templates used for clinical drafting are versioned and auditable.

---

## 4. Compliance & Audit Acceptance Criteria

- **AC-C1 Audit events**: The following events are emitted for the draft lifecycle:
  - `CREATE_DRAFT`
  - `UPDATE_DRAFT`
  - `VIEW_DRAFT`
  - `DISCARD_DRAFT`
- **AC-C2 Audit payload constraints**:
  - Audit events include identity, role, tenant/org context, patient/encounter context, timestamps.
  - Audit events are **metadata-only** by default (no unnecessary PHI content in logs).
- **AC-C3 Tamper resistance**: Audit logs are tamper-resistant and retained per policy.
- **AC-C4 HIPAA-aligned controls**: PHI exposure is minimum necessary; vendor eligibility constraints apply for any PHI-bearing AI execution.
- **AC-C5 GDPR-aligned controls** (where applicable): health data treated as special category data; purpose limitation and data subject rights readiness are supportable structurally (configuration/governance enforced).

---

## 5. Observability Acceptance Criteria

- **AC-O1 Correlation**: Draft lifecycle and AI execution events can be correlated via request/correlation IDs.
- **AC-O2 Policy visibility**: Policy denials (e.g., refusal, consent denial, authorization failure) are observable and auditable.
- **AC-O3 AI execution signals**: Observability includes prompt version/hash, model/provider, tool proposal summaries (if any), and validation outcomes.

---

## 6. CI / Eval Requirements (Gating)

- **AC-G1 CI hygiene**: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test`, and `pnpm eval:ai` must be green for the slice.
- **AC-G2 AI eval coverage**: Evals must include (at minimum):
  - refusal tests for commit/sign/lock/write-back attempts,
  - hallucination tests (fabricated patient facts),
  - cross-patient/tenant leakage tests,
  - labeling/provenance requirements validation,
  - evidence/citation behavior tests.

---

## 7. Explicit “Fail the Slice If…” Conditions (Hard Stops)

Fail MIG-04A immediately if any of the following are observed in code, configuration, routes, tools, or behavior:

- **FAIL-1 Commit semantics present**: Any “commit” definition is met (see `docs/12-migration/mig-04-acceptance-guardrails.md`), including:
  - record marked final/signed/locked,
  - transmitted to system of record,
  - used as an irreversible basis for care decisions,
  - represented as completed to unauthorized parties.
- **FAIL-2 Forbidden keywords/routes leak**: Presence of finalize/sign/attest/commit/lock/writeback routes or semantics in MIG-04A surface area.
- **FAIL-3 External EHR write-back**: Any outbound call that mutates external clinical note endpoints.
- **FAIL-4 Silent deletion**: Any deletion of draft history or inability to retrieve prior versions.
- **FAIL-5 Background automation**: Any unattended job advances draft state or mutates PHI without explicit HITL approval.
- **FAIL-6 AI misrepresentation**: AI output presented as clinician-authored fact without provenance/labeling, or presented as final/signed.
- **FAIL-7 Cross-patient leakage**: Any confirmed cross-patient/tenant leakage (in tests or production telemetry).
- **FAIL-8 Consent bypass**: Any drafting occurs without consent verification where required.

---

## 8. Completion Evidence Requirements (Reviewer Checklist)

To mark MIG-04A “complete”, reviewers must be able to locate:
- The sealed MIG-04A spec and acceptance criteria docs (this folder).
- A completed evidence artifact (per existing migration conventions) demonstrating:
  - audit event examples,
  - eval outputs for refusal/hallucination/leakage,
  - a governance statement confirming no commit/sign semantics exist.

