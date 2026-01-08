# MIG-04A Implementation Plan (Phase 2): Clinical Documentation — Draft Only, HITL

This document is **engineering planning only**. It defines *how* MIG-04A will be built inside:
- `services/clinical-documentation-agent`

It must adhere strictly to:
- `docs/12-migration/mig-04A/mig-04A-spec.md`
- `docs/12-migration/mig-04A/mig-04A-acceptance-criteria.md`
- `docs/12-migration/mig-04-acceptance-guardrails.md`

> HARD CONSTRAINT: No MIG-04B “commit” semantics (sign/finalize/lock/write-back) may appear in MIG-04A.
> HARD CONSTRAINT: This plan defines **interfaces, workflows, and module responsibilities** only. **No persistence implementations, no UI integrations, no production domain logic implementation in this phase.**

---

## A. Service Responsibility Breakdown (by layer)

This section defines what each folder owns and what it is forbidden from doing.

### A.1 `api/` — request/response contracts only
- **Owns**
  - Request/response DTOs for draft lifecycle and AI draft generation requests
  - Input validation boundaries (shape/type; not business invariants)
  - Error taxonomy surfaced to callers (e.g., `CONSENT_DENIED`, `REFUSAL`, `VALIDATION_FAILED`)
- **Forbidden**
  - Any workflow sequencing (belongs to `orchestration/`)
  - Any AI model invocation (belongs to `ai/` via governed runtime)
  - Any domain invariants or state transitions (belongs to `domain/`)
  - Any persistence (belongs to `data/` interfaces; no concrete DB in MIG-04A)
  - Any commit/sign/finalize semantics (MIG-04B only)

### A.2 `orchestration/` — workflow sequencing, consent checks, approval gates
- **Owns**
  - End-to-end workflow coordination for:
    - draft creation, revision, view, discard
    - AI-assisted draft generation / redraft proposal
    - proposal-only “ready for signoff” state transitions (no signing)
    - amendment/addendum/correction creation as append-only draft artifacts
  - Mandatory calls to `consent-agent` (hard gate)
  - Calling `ai/` for proposal generation
  - Calling `domain/` to enforce deterministic invariants (via pure functions)
  - Calling `data/` repositories (interfaces) to persist drafts to **draft workspace only**
  - Emitting audit events (via an audit sink abstraction)
- **Forbidden**
  - Any direct model calls (must go through governed AI runtime usage in `ai/`)
  - Any tool execution side effects beyond allowed draft workflows
  - Any external EHR write-back / interop mutation (MIG-04B only)
  - Any background job that advances draft state without explicit clinician initiation
  - Any “finalize/lock/sign/attest/commit” actions

### A.3 `domain/` — deterministic note structures, invariants, version rules (pure)
- **Owns**
  - Deterministic domain types and invariants for:
    - draft status lifecycle (draft-only states)
    - versioning rules (no silent overwrite)
    - amendment/addendum/correction semantics (append-only)
    - evidence reference constraints (structure, required metadata)
    - provenance markers (AI vs human sections)
  - Pure validation functions (deterministic; no IO)
  - Normalization functions that do not infer facts
- **Forbidden**
  - Any AI logic (no prompts, no inference)
  - Any IO/persistence/network calls
  - Any time-dependent behavior without explicit injected clock
  - Any “final/legal medical record” semantics or flags (`isSigned`, `signedAt`, `isFinalized`, etc.)

### A.4 `ai/` — draft generation only, governed runtime usage
- **Owns**
  - AI task definitions for draft generation / redraft proposals
  - Output schema definitions (validated before returning)
  - Refusal rule wiring: explicit refusal triggers must map to acceptance criteria
  - Provenance metadata capture requirements for AI runs
  - Eval harness integration points (unit vs AI eval)
- **Forbidden**
  - Persisting drafts directly (must return proposals only; persistence is orchestration-controlled)
  - Any tool execution that mutates clinical record stores or external EHR endpoints
  - Any behavior that implies finality/signature/attestation as executed

### A.5 `data/` — repository interfaces (no concrete DB yet)
- **Owns**
  - Repository interfaces for storing and retrieving drafts and versions **within the draft workspace**
  - Storage-agnostic contracts (e.g., “createVersion”, “getHistory”)
  - Explicit boundaries around “metadata-only” audit storage if needed (as interface only)
- **Forbidden**
  - Concrete database implementations in Phase 2/3 unless explicitly approved (this phase: none)
  - Any schema additions implying finalization (`isSigned`, etc.)
  - Any deletion of history

### A.6 `integrations/` — read-only inputs (EHR context, transcripts)
- **Owns**
  - Interfaces/adapters for read-only context inputs (examples):
    - encounter context summaries
    - transcripts (ambient/voice) as an input artifact
    - external document ingestion references (PDF/fax pointers; not storage)
  - Normalization/redaction contracts to enforce “minimum necessary”
- **Forbidden**
  - Any write-back to external systems
  - Any uncontrolled retrieval beyond patient/tenant scope
  - Any vendor SDK calls not routed through platform governance (where applicable)

### A.7 `config/` — feature flags, safety toggles
- **Owns**
  - Compliance-mode switches (HIPAA/GDPR mode behaviors as configuration)
  - Safety toggles (e.g., “require evidence refs for patient-fact claims”)
  - AI model and prompt version selection parameters (by reference; not hard-coded secrets)
- **Forbidden**
  - Disabling guardrails by default
  - Any configuration that enables commit semantics in MIG-04A

### A.8 `tests/` — unit vs eval vs safety tests
- **Owns**
  - Unit tests:
    - domain invariants (versioning, amendment rules, prohibited states)
    - orchestration gating (consent required, refusal handling)
  - AI eval tests:
    - refusal for sign/commit/write-back attempts
    - hallucination resistance (fabricated patient facts)
    - labeling/provenance requirements
    - evidence/citation behavior
    - cross-patient leakage
- **Forbidden**
  - Tests that require real PHI or real external integrations
  - Any test harness that masks failures of guardrails (must fail closed)

---

## B. Core Domain Models (Conceptual; schemas + responsibilities only)

> These are **conceptual models** for Phase 3 implementation. This section defines shapes and invariants, not code.

### B.1 `ClinicalNoteDraft`
- **Responsibility**: The draft container for a clinical note in MIG-04A.
- **Key fields (conceptual)**
  - `draftId`
  - `patientId` (required; patient-scoped)
  - `encounterId` (optional; but recommended where available)
  - `authoringProviderId` (human identity)
  - `documentationType` (must map to canonical categories from Phase 0)
  - `status` (draft-only states; see below)
  - `currentVersionId`
  - `createdAt`, `updatedAt`
  - `isDraftOnly: true` (hard constraint)
- **Immutability/versioning**
  - Draft content is never overwritten in place; updates create new `DraftVersion`.

### B.2 `NoteSection`
- **Responsibility**: A structured section (e.g., Subjective, Objective, Assessment, Plan; HPI; ROS; PE; MDM).
- **Key fields**
  - `sectionId`
  - `title` (controlled vocabulary per template, plus safe free-form titles where allowed)
  - `content` (narrative text)
  - `sourceAttribution` (AI-proposed vs human-edited markers)
- **Invariants**
  - Sections must not include claims of performed actions unless supported by clinician input/evidence.

### B.3 `DraftVersion`
- **Responsibility**: An immutable snapshot of the draft at a point in time.
- **Key fields**
  - `versionId`
  - `draftId`
  - `versionNumber` (monotonic)
  - `createdBy` (human actor)
  - `createdAt`
  - `content` (narrative + structured sections)
  - `evidenceReferences[]`
  - `provenance` (AI run metadata if AI-assisted)
  - `diffBaseVersionId` (optional linkage for diffs)
- **Immutability**
  - Versions are immutable once created.
  - Discarding marks a version as discarded; it does not delete it.

### B.4 `Amendment` / `Addendum` / `Correction`
- **Responsibility**: Append-only modification artifacts linked to a prior version.
- **Key fields**
  - `amendmentId`
  - `draftId`
  - `targetsVersionId` (required)
  - `type`: `ADDENDUM | CORRECTION | AMENDMENT | RETRACTION_NOTE` (retraction only if policy-defined)
  - `reason` (required; human-confirmed)
  - `text` (narrative)
  - `createdBy`, `createdAt`
- **Legal semantics**
  - Must preserve original content; amendment artifacts *reference* prior content, not overwrite.

### B.5 `AttestationProposal`
- **Responsibility**: A proposal-only representation that indicates a draft is “ready for signoff” without enabling signing.
- **Key fields**
  - `proposalId`
  - `draftId`
  - `proposedBy` (human)
  - `proposedAt`
  - `attestationPreviewText` (generated preview; draft-only labeling mandatory)
  - `requiredChecks` (completeness checklist results; advisory)
- **Hard rule**
  - No `signedBy`, no `signedAt`, no certificate, no locking.

### B.6 `EvidenceReference`
- **Responsibility**: Provenance pointers supporting patient facts or external clinical knowledge references.
- **Types**
  - `ChartEvidenceReference`: references to chart artifacts (lab result id/time, medication list source, prior note id/date, transcript id)
  - `ExternalKnowledgeReference`: guideline/source citation + version/date
- **Invariants**
  - Patient-fact claims must be linked to chart evidence or explicitly marked unverified.
  - Evidence references must never “become truth”; they are traceability pointers.

### B.7 Draft-only status model (proposal-only states)
- Allowed states (example set; must remain draft-only):
  - `DRAFT`
  - `NEEDS_REVIEW`
  - `READY_FOR_SIGNOFF` (**proposal-only**; no signing action)
- Forbidden states:
  - `SIGNED`, `FINAL`, `LOCKED`, `COMMITTED`, `SUBMITTED`

---

## C. Workflow Definitions (Happy Path + Refusal)

All workflows must:
- include **consent check** prior to AI drafting involving PHI,
- emit audit events (`CREATE_DRAFT`, `UPDATE_DRAFT`, `VIEW_DRAFT`, `DISCARD_DRAFT`) at the specified boundaries,
- enforce AI safety contract (labeling, refusal, evidence expectations),
- remain draft-only (no commit semantics).

### C.1 Draft creation (human-initiated; without AI)
1. **API** receives “create draft shell” request (patient/encounter/type).
2. **Orchestration**:
   - authenticates/authorizes clinician
   - validates patient/tenant scope
   - creates `ClinicalNoteDraft` with `isDraftOnly: true`
   - creates initial empty `DraftVersion` (version 1)
3. **Audit**:
   - emit `CREATE_DRAFT` (metadata only)
4. **Response** returns draft id + current version id + draft-only labels.

### C.2 Draft viewing
1. **API** receives “view draft/version” request.
2. **Orchestration** authorizes access (patient/tenant scope).
3. **Audit** emit `VIEW_DRAFT`.
4. **Response** includes draft-only labels + provenance markers.

### C.3 Clinician edit → save new version
1. **API** receives updated content.
2. **Orchestration**:
   - validates actor and scope
   - calls `domain/` invariant checks (no forbidden states; version monotonic; required metadata)
   - creates new `DraftVersion` (version N+1) attributed to human editor
3. **Audit** emit `UPDATE_DRAFT`.
4. **Response** returns new version metadata + draft-only labels.

### C.4 AI-assisted draft generation (new draft or redraft proposal)
1. **API** receives “generate draft” request (type + context references).
2. **Orchestration**:
   - authorizes clinician and patient scope
   - **consent-agent hard gate**:
     - if denied/unknown ⇒ stop, emit refusal/denial audit signal, return `CONSENT_DENIED`
   - collects **minimum necessary** context via `integrations/` (read-only)
3. **AI**:
   - constructs governed AI runtime invocation (see Section D)
   - returns **proposal**: structured sections + narrative + evidence refs + provenance
   - may return **refusal** if request violates safety contract
4. **Orchestration**:
   - validates AI output schema
   - enforces policy post-checks (labeling, forbidden semantics, evidence requirements)
   - persists as a new draft/version **only upon explicit clinician acceptance** (HITL checkpoint)
5. **Audit**:
   - on acceptance: emit `CREATE_DRAFT` (if new) or `UPDATE_DRAFT` (if redraft)
   - on refusal: emit refusal signal (metadata-only)

### C.5 Attestation proposal flow (proposal-only)
1. Clinician requests “mark ready for signoff” or “attestation preview”.
2. **Orchestration**:
   - validates draft-only state transition is allowed
   - generates/compiles preview text (may use AI only for formatting/completeness prompts; still proposal-only)
3. **Audit** emit `UPDATE_DRAFT` (state change as draft-only)
4. **Response** includes explicit “proposal-only; no signing in MIG-04A” disclaimer.

### C.6 Amendment / addendum / correction flow (append-only)
1. Clinician selects target version and amendment type + reason.
2. **Orchestration**:
   - validates append-only semantics in `domain/`
   - creates amendment artifact linked to target version
3. **Audit** emit `UPDATE_DRAFT`
4. **Response** shows amendment linked to prior version; original remains visible.

### C.7 Refusal flows (hard stops)
Refusal must occur (and be test-covered) when:
- request contains commit/sign/finalize/lock/write-back semantics
- request requires fabrication of patient facts
- consent cannot be verified
- authorization/patient scope fails

Refusal handling rules:
- fail closed
- return explicit refusal reason category (non-PHI)
- emit an auditable refusal/denial signal (metadata only)

---

## D. AI Runtime Usage Plan (Structure + Guarantees; no prompt content)

### D.1 Prompt layer usage (structure)
For each AI drafting invocation, the runtime must assemble (in order):
- **System layer**: global safety constraints (draft-only, no fabrication, no signing, no write-back)
- **Policy layer**: compliance mode constraints (HIPAA/GDPR), vendor eligibility, tool allowlist
- **Domain layer**: documentation type rules and required sections (template discipline), amendment semantics
- **Task layer**: “generate draft” / “redraft” / “summarize” / “patient instructions draft”
- **Memory layer**: scoped, minimal, and explicitly retrieved (no uncontrolled memory)
- **Input layer**: clinician-provided inputs + read-only context references

### D.2 Output schemas (must validate)
AI outputs must be validated against schemas that include:
- draft-only labels and disclaimers
- structured sections + narrative
- provenance payload (model/provider/version, prompt version, retrieval sources if any)
- evidence references (chart and external knowledge)
- refusal response type (explicitly typed; not ambiguous text)

### D.3 Refusal triggers (must be explicit)
AI must refuse or the policy layer must hard-stop on:
- sign/attest/finalize/commit/lock/submit/write-back prompts
- requests that require fabrication or imply performed actions without evidence
- cross-patient or cross-tenant access requests
- attempts to bypass consent or authorization

### D.4 Safety fallback behavior
When uncertain or missing evidence:
- ask clarifying questions, or
- label as unverified and prompt clinician confirmation, or
- refuse for high-risk assertions

### D.5 Required eval types (before exposure)
Phase 3 must implement evals that directly satisfy acceptance criteria:
- commit/sign refusal tests
- hallucination tests (fabricated patient facts)
- evidence/citation tests
- labeling/provenance tests
- cross-patient leakage tests

---

## E. Observability & Audit Plan (metadata-only)

### E.1 Events to emit (minimum)
- `CREATE_DRAFT`
- `UPDATE_DRAFT`
- `VIEW_DRAFT`
- `DISCARD_DRAFT`

### E.2 Where events are emitted (workflow boundaries)
- **CREATE_DRAFT**: after draft shell creation; after clinician-accepted AI creation
- **VIEW_DRAFT**: on read access to a draft/version
- **UPDATE_DRAFT**: on new version creation, state changes (draft-only), amendment artifacts
- **DISCARD_DRAFT**: when draft/version is marked discarded (no deletion)

### E.3 Required metadata (minimum)
- actor identity + role + tenant/org context
- patient/encounter ids (metadata only)
- draft id + version id + documentation type
- timestamp and correlation id
- for AI-assisted events:
  - model/provider/version
  - prompt template/version
  - retrieval sources identifiers (no PHI payload)
  - validation outcomes (pass/fail categories)

### E.4 Explicitly excluded from audit/telemetry by default
- raw clinical note payloads
- transcript text
- PHI-rich content fields

If any payload logging is ever proposed, it requires explicit governance approval and compliance-mode gating.

