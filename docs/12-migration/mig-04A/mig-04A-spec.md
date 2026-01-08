# MIG-04A Specification (Phase 1): Clinical Documentation — Draft Only, HITL

**Status: PHASE 4 COMPLETE (Validated & Sealed)**

This document is the **authoritative contract** for **MIG-04A**.

It is derived strictly from:
- `docs/12-migration/mig-04A/clinical-documentation-domain.md`
- `docs/12-migration/mig-04A/mig-04A-phase-0-summary.md`

And must remain consistent with the anti-creep guardrails in:
- `docs/12-migration/mig-04-acceptance-guardrails.md`

> HARD CONSTRAINT: MIG-04A is **draft-only**. Any commit/sign/finalize/lock/write-back semantics are out of scope and are reserved for MIG-04B.

---

## A. Purpose & Success Definition

### A.1 Purpose
MIG-04A delivers a **regulated-safe, draft-only workspace** for clinical documentation where:
- AI may generate **draft proposals** for clinical documentation content, and
- credentialed humans review, edit, and manage drafts under strict governance,
- without creating a legal medical record artifact or writing to systems of record.

### A.2 Primary users
- **Clinicians (authors/reviewers)**: create and edit drafts, review AI proposals, request redrafts.
- **Clinical reviewers / supervisors**: review drafts for quality and safety, without committing/signing.
- **Auditors / governance**: verify compliance via audit trails and provenance.

### A.3 Definition of “done” (slice-level)
MIG-04A is “done” when:
- Draft-only constraints are **provably enforced** and no MIG-04B semantics exist in surface area.
- Draft lifecycle is fully versioned and auditable (`CREATE_DRAFT`, `UPDATE_DRAFT`, `VIEW_DRAFT`, `DISCARD_DRAFT`).
- AI behavior is constrained by an explicit **safety contract** (labeling, refusals, evidence expectations, provenance, eval gates).
- Consent gating and privacy-by-design principles are enforceable structurally.

---

## B. In-Scope Capabilities (STRICT)

Each capability below explicitly defines:
- **Read vs write** (where “write” means changes to *draft workspace state only*, never LMR or external EHR)
- **HITL checkpoints**
- **AI allowed vs forbidden actions**

### B.1 Draft clinical note generation (AI-assisted; proposal-only)
- **Capability**: Generate draft clinical documentation content for the canonical categories in Phase 0 (encounter notes, procedure/operative, nursing/allied health, diagnostic narratives, care coordination/communications, administrative narratives, external document narrative derivatives, and amendment/addendum artifacts).
- **Read vs write**:
  - **Read**: Allowed to read the minimum necessary patient/encounter context required for drafting (scope-controlled).
  - **Write (draft workspace)**: Allowed to create a new **draft** artifact.
  - **Write (system of record / LMR / external EHR)**: **Forbidden**.
- **HITL checkpoints**:
  - A human must explicitly request generation.
  - The result must be presented as **DRAFT ONLY** and must require human review/edit before any downstream use.
- **AI allowed**:
  - Draft narrative text and propose structured sections/fields.
  - Ask clarifying questions when required to avoid fabrication.
- **AI forbidden** (non-exhaustive; see Phase 0):
  - Signing, attesting, finalizing, locking, committing, submitting, or write-back.
  - Fabricating patient facts or implying actions not performed.

### B.2 Structured + narrative note composition (draft representation)
- **Capability**: Represent drafts as a combination of:
  - **Narrative text** (human-readable clinical prose), and
  - **Structured sections/fields** (e.g., SOAP/H&P sections) sufficient for validation and later MIG-04B transition.
- **Read vs write**:
  - **Write (draft workspace)**: Allowed to create/update draft representations.
- **HITL checkpoints**:
  - Human must be able to view and edit both narrative and structured sections before marking a draft “ready for signoff” (proposal-only state).
- **AI allowed**:
  - Propose structured section content derived from provided evidence/context.
- **AI forbidden**:
  - Creating “final” or “signed” representations or fields (see MIG-04 guardrails).

### B.3 Versioned drafts (no silent overwrites)
- **Capability**: Every save/update produces a new **version** of the draft, preserving prior content for audit and rollback.
- **Read vs write**:
  - **Write (draft workspace)**: Allowed to create new draft versions.
  - **Delete**: Hard deletion of history is forbidden; “discard” must be auditable and must preserve history.
- **HITL checkpoints**:
  - Human action is required to save an edit or accept an AI redraft.
- **AI allowed**:
  - Propose revisions; revisions become versions only upon human approval.
- **AI forbidden**:
  - Any background auto-save that persists AI-generated revisions without explicit human action.

### B.4 Amendments and addenda (draft-safe, LMR-aligned semantics)
- **Capability**: Support **addendum/correction/amendment** as explicit draft artifacts or explicit draft-version events that:
  - reference the prior version they modify,
  - include reason/metadata,
  - preserve original content.
- **Read vs write**:
  - **Write (draft workspace)**: Allowed only as append-only references to previous versions.
- **HITL checkpoints**:
  - Human must select amendment type and supply/confirm rationale.
- **AI allowed**:
  - Draft suggested amendment text and suggest reason options.
- **AI forbidden**:
  - Performing “overwrite edits” that remove or hide prior content.

### B.5 Attestation workflows (proposal-only; no signing)
- **Capability**: Support a **proposal-only** “ready for signoff” state and an **attestation preview** that can:
  - compile the draft into a signable format **without** enabling signing/commit.
- **Read vs write**:
  - **Write (draft workspace)**: Allowed to set proposal-only review states.
  - **Sign/attest/commit**: **Forbidden** (MIG-04B only).
- **HITL checkpoints**:
  - Only a human may mark “ready for signoff” (proposal-only).
- **AI allowed**:
  - Offer completeness checks and drafting improvements.
- **AI forbidden**:
  - Any “I attest” language attributed to the clinician unless explicitly entered/approved by the clinician.

### B.6 AI-assisted drafting (governed)
- **Capability**: Provide AI drafting and improvement prompts under strict governance.
- **Requirements** (must be enforced):
  - Draft labeling and provenance markers (see Section D).
  - Evidence expectations (chart sources and external references) (see Section D).
  - Refusal conditions for unsafe prompts (see Section D).
  - Prompt template/versioning expectations (see Section D).

### B.7 Evidence attachment (provenance)
- **Capability**: Attach evidence references to drafts, including:
  - chart evidence identifiers for patient facts (labs, meds, prior notes), and
  - external guideline citations for medical knowledge references.
- **Read vs write**:
  - **Write (draft workspace)**: Allowed to store evidence references/links/identifiers (not to change the underlying evidence sources).
- **HITL checkpoints**:
  - Human must be able to see evidence per claim/section and edit/remove unsupported statements.
- **AI allowed**:
  - Propose citations and flag where citations are missing.
- **AI forbidden**:
  - Presenting un-cited factual assertions as confirmed patient facts.

### B.8 Metadata-only audit emission (draft lifecycle + access)
- **Capability**: Emit audit events for:
  - `CREATE_DRAFT`, `UPDATE_DRAFT`, `VIEW_DRAFT`, `DISCARD_DRAFT`
- **Requirements**:
  - Audit must capture identity, patient/encounter context, timestamp, event type, and provenance metadata for AI outputs (per Phase 0).
  - Audit must be tamper-resistant and retained per policy.
- **Read vs write**:
  - **Write (audit log)**: Allowed for metadata-only audit events (no clinical content payloads unless explicitly approved by policy).

---

## C. Explicit Non-Goals (ANTI-CREEP; Mandatory)

MIG-04A does NOT:
- Finalize, lock, sign, attest, or otherwise create a **legal medical record**.
- Create any persistent “final” state flags (e.g., `isSigned`, `signedAt`, `isFinalized`) or equivalent semantics.
- Write back to external EHRs or systems of record (no external clinical-note mutation endpoints).
- Submit billing/coding, generate claim submissions, or trigger downstream revenue cycle automation.
- Place orders (medications, labs, imaging), execute referrals, or trigger clinical actions.
- Run background automation that advances document state or mutates PHI without explicit HITL approval.
- Allow AI to autonomously commit or represent clinical decisions as final.
- Allow silent deletion of draft history or un-audited edits.

If a requirement feels “almost reasonable” but approaches commit/sign/write-back semantics, it belongs in **MIG-04B**, not MIG-04A.

---

## D. AI Safety Contract (Normative)

### D.1 Draft labeling rules
Every artifact and response containing MIG-04A documentation must include:
- **Draft status**: “DRAFT ONLY (AI-assisted)”
- **Non-final disclaimer**: “Not signed. Not a legal medical record.”
- **HITL requirement**: “Requires clinician review and editing before any use.”
- **Provenance marker**: clearly indicate AI-proposed vs human-authored/edited sections.

### D.2 Confidence bounds and uncertainty handling
- AI must explicitly mark uncertainty when evidence is missing or ambiguous.
- AI must not present uncertain content with authoritative tone.
- If evidence is missing for a factual claim, AI must either:
  - ask a clarifying question, or
  - label the claim as unverified and prompt the clinician to confirm, or
  - refuse if the request would require fabrication.

### D.3 Refusal conditions (non-exhaustive; must be implemented and tested)
AI must refuse (or hard-stop via policy) when asked to:
- sign/attest/finalize/commit/lock/submit/write-back a clinical note,
- alter a system-of-record (problem list, allergies, meds) as an executed action,
- fabricate patient findings, results, or events,
- provide cross-patient data or bypass consent/authorization.

### D.4 Evidence citation requirements
- **Patient facts** must include **chart evidence references** (IDs/timestamps/source record pointers).
- **External medical knowledge** must include a citation (guideline/source + version/date when available).
- Missing citations must trigger:
  - downgraded confidence and explicit warning, or
  - refusal for high-risk assertions.

### D.5 Prompt versioning expectations
- Prompt templates used for clinical drafting must be versioned and auditable.
- AI outputs must be traceable to prompt version + model/provider/version (provenance).

### D.6 AI eval requirements before exposure
Before exposing MIG-04A drafting to real users:
- Evals must demonstrate:
  - refusals for commit/sign requests,
  - hallucination resistance (no fabricated patient facts),
  - boundary enforcement (no cross-patient leakage),
  - proper labeling/provenance behavior,
  - evidence behavior (citations required or uncertainty surfaced).

---

## E. Compliance & Audit Guarantees (Normative)

### E.1 What is auditable (minimum)
At minimum, the following must be auditable:
- Draft lifecycle actions (`CREATE_DRAFT`, `UPDATE_DRAFT`, `VIEW_DRAFT`, `DISCARD_DRAFT`)
- The actor identity and role, tenant/org context, patient/encounter context
- AI execution provenance (model/provider/version, prompt version, retrieval sources if any, validation outcomes)
- Human edit provenance (who edited what, when; change summary or diff hash)

### E.2 What is immutable
- Audit events must be **tamper-resistant** and non-repudiable.
- Prior draft versions must remain accessible for governance review (no silent overwrite).

### E.3 What must be versioned
- Draft content versions
- Amendment/addendum artifacts and linkages
- Prompt templates (and their versions) used for AI generation

### E.4 How corrections are represented (legally aligned)
Corrections/addenda/amendments must be:
- append-only,
- linked to the prior version they correct,
- attributed to a human actor with timestamp and reason,
- visible as a change history.

### E.5 HIPAA / GDPR enforcement (structural)
MIG-04A must be buildable such that it can enforce:
- minimum necessary data access,
- vendor eligibility and PHI handling constraints,
- strict tenant isolation and authorization checks,
- auditability for PHI access and AI executions involving PHI,
- privacy-by-design defaults (deny by default; least privilege).

---

## F. Service Boundaries (Normative)

### F.1 Relationship to `consent-agent`
- Consent verification is a **hard gate** for any AI-assisted drafting involving PHI.
- If consent is not granted for scope `clinical_documentation`, drafting must not proceed.

### F.2 Relationship to `medical-advisor-agent`
- `medical-advisor-agent` may provide contextual reminders or educational support, but:
  - must remain advisory,
  - must not introduce commit/sign semantics,
  - must not bypass evidence/provenance requirements.

### F.3 Relationship to the future write-plane (MIG-04B)
- MIG-04B is the only slice permitted to introduce:
  - signing/attestation as an executed action,
  - legal medical record creation,
  - locking/finalization,
  - external EHR write-back.
- MIG-04A must remain draft-only to:
  - reduce clinical safety risk during rollout,
  - preserve auditability and provenance discipline early,
  - prevent regulator-unsafe behavior prior to explicit approval for write paths.

### F.4 Boundary enforcement rule
If a feature request crosses any “commit” definition in `docs/12-migration/mig-04-acceptance-guardrails.md`, it is automatically **out of scope** for MIG-04A and must be deferred to MIG-04B planning/approval.

