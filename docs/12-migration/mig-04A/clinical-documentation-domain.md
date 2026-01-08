# MIG-04A – Phase 0: Clinical Documentation Domain (Draft-Only, HITL)
This document defines the **clinical documentation domain** for **MIG-04A (Draft-Only, Human-in-the-Loop)**.

It is the authoritative Phase 0 reference for:
- **Clinical scope** (what “clinical documentation” means in real practice)
- **Safety/compliance constraints** (draft-only doctrine; legal medical record rules)
- **AI role boundaries** (what AI may/must never do; provenance requirements)
- **Benchmarking** (Epic/Cerner/modern EHR patterns; known failure modes)
- **Explicit non-goals** (what MIG-04A will not do)

> HARD CONSTRAINT: MIG-04A is **draft-only**. It must not create, sign, finalize, lock, attest, transmit, or write-back any clinical documentation as a legal medical record. See also `docs/12-migration/mig-04-acceptance-guardrails.md` and `docs/12-migration/mig-04A-clinical-documentation-draft.md`.

---

## 0. Definitions (Normative)

- **Clinical documentation**: Any narrative or semi-structured clinical text that describes patient care, clinical reasoning, observations, communications, or decisions, and that may become part of (or be referenced by) a **legal medical record** depending on finalization/signing and jurisdiction.
- **Draft**: A mutable work product intended for review/editing. In MIG-04A, drafts are **not** legal medical record artifacts and must be labeled and governed accordingly.
- **Legal Medical Record (LMR)**: The set of records released upon request in response to legal/regulatory obligations. What constitutes the LMR varies by jurisdiction and policy, but the platform must treat it as **append-only, auditable, and non-repudiable** once finalized (MIG-04B and later).
- **Amendment / correction / addendum**:
  - **Addendum**: Additional information appended after initial completion, without changing the original content.
  - **Correction**: Clarifies an error with explicit linkage to the incorrect statement.
  - **Amendment**: Broader update post-completion with explicit reason, author, timestamp, and linkage to original.
  - **Overwriting** is generally not permitted for LMR content; corrections are typically **append-only** with audit trail.
- **Attestation / signing**: A credentialed human asserts the content is complete and accurate to the best of their knowledge, under applicable policy and professional responsibility. **Not allowed in MIG-04A.**
- **Authorship**: The identity of a human clinician (or staff member) responsible for content. AI output is never “author”; it is a **tool-generated proposal** that must be attributable and reviewable.

---

## 1. Canonical Clinical Documentation Types (Complete Taxonomy)

This section enumerates the **canonical categories** of clinical documentation used in real clinical practice.

### 1.1 Principle: Category completeness vs specialty enumeration
Clinical practice contains a very large number of specialty-specific notes (e.g., “stroke neurology consult”, “wound ostomy note”, “NICU daily progress note”). The platform must remain **complete** without enumerating every specialty label by:
- Defining a **complete set of canonical categories** that cover all real-world documentation families
- Treating specialty names as **subtypes** mapped to canonical categories

**Rule**: Any new note type introduced later must map to **exactly one** canonical category (or explicitly justify a new category with governance review).

### 1.2 Encounter-based clinician notes (physician/APP)
- **History & Physical (H&P)**: Initial assessment; history, exam, assessment, plan.
  - Includes: admission H&P, pre-op H&P, outpatient new patient evaluation.
- **Progress note**: Ongoing updates during an episode of care.
  - Includes: daily inpatient note, ICU progress note, post-op day notes.
- **SOAP note**: A structured form of progress/encounter note (Subjective/Objective/Assessment/Plan).
- **Consultation note**: Specialist evaluation and recommendations.
  - Includes: curbside consult documentation, formal consult.
- **Admission note**: Narrative associated with inpatient admission (often overlaps with H&P; keep as subtype).
- **Transfer note / handoff note**: Transition between teams/units/facilities (clinical handover).
- **Discharge summary**: Summary of hospitalization/episode of care; diagnoses, hospital course, discharge meds, follow-up.
- **ED (Emergency Department) note**: Emergency encounter documentation including triage, evaluation, course, disposition.
- **Observation unit note**: Observation stay documentation (often ED-adjacent).
- **Ambulatory / outpatient visit note**: Clinic encounter documentation (new/established, follow-up).
- **Telehealth / telephone encounter note**: Remote visit documentation (video/phone).
- **Clinical event note**: Significant events (rapid response, code blue narrative, clinical deterioration note).

### 1.3 Procedure and operative documentation
- **Operative note**: Surgical procedure narrative (indications, findings, technique, complications, implants).
- **Procedure note**: Bedside/clinic procedures (LP, central line, laceration repair, joint injection, etc.).
- **Sedation note / anesthesia narrative** (narrative layer): Anesthesia assessment, plan, intra/post narrative.
  - Note: anesthesia record is often structured; MIG-04A covers narrative drafting only.
- **Post-anesthesia care unit (PACU) note**: Immediate recovery documentation.
- **Implant / device narrative** (narrative layer): Relevant contextual narrative; structured implant registries are out of MIG-04A.

### 1.4 Nursing and allied health documentation
- **Nursing note**: Assessment, interventions, patient response, education, safety events.
  - Includes: shift note, wound care note, triage nursing note.
- **Care plan**: Multidisciplinary goals, interventions, outcomes (often nursing-owned but team-wide).
- **Flowsheet narrative addendum**: Narrative associated with structured observations (e.g., pain reassessment narrative).
- **Therapy notes**: PT/OT/SLP evaluation and progress notes.
- **Respiratory therapy note**: Treatments, assessments, response.
- **Social work / case management note**: Psychosocial assessment, discharge planning, resources.
- **Pharmacy clinical note**: Medication reconciliation narrative, antimicrobial stewardship consult note (narrative layer).
- **Dietitian/nutrition note**: Nutrition assessment and plan.
- **Psychology/behavioral health note**: Therapy session note, risk assessment narrative.

### 1.5 Diagnostic and results narratives (narrative layer)
These are narratives that interpret or contextualize results. They may be authored by clinicians or provided as patient-facing explanations.

- **Diagnostic summary**: Consolidated interpretation of multiple data sources (labs, imaging, vitals, history).
- **Imaging report (narrative layer)**: Radiology narrative/impression drafting (where allowed by policy).
  - Note: final radiology sign-out is out of MIG-04A.
- **Lab result interpretation (narrative layer)**: Clinician explanation of lab trends/meaning.
- **Pathology report (narrative layer)**: Narrative explanation or summary (final path sign-out out of MIG-04A).
- **ECG/EEG/PFT interpretation (narrative layer)**: Explanatory narrative drafts (final sign-out out of MIG-04A).

### 1.6 Care coordination, referrals, and communications
- **Referral letter** (outbound): Clinical summary and request to another service/provider.
- **Consult request / clinical question** (inbound/outbound): Documenting the question and context.
- **Transition of care note**: SNF/home health/hospital-to-clinic transitions.
- **Patient instructions / after-visit summary (AVS) narrative**: Patient-facing instructions/education.
- **Patient education note**: Education provided and understanding assessed.
- **Interdisciplinary / multidisciplinary team (MDT) note**: Tumor board, rounds, complex care conference notes.
- **Family meeting note / goals of care note**: Documenting shared decision-making and preferences.
- **Informed consent discussion note** (discussion record): Narrative of risks/benefits/alternatives discussed.
  - Note: legal consent forms/signatures are out of MIG-04A.

### 1.7 Administrative clinical narratives (still clinical risk-bearing)
These documents often influence access to care or reimbursement, but are not “billing submission” themselves.

- **Prior authorization narrative**: Clinical justification text supporting authorization.
- **Coding support narrative**: Clinical context to support coding review (no submission in MIG-04A).
- **Disability / work status letter**: Functional limitations, restrictions, timelines.
- **DME/support letters**: Medical necessity narrative for equipment/services.
- **School forms / clearance letters** (narrative portion): Clinical clearance and restrictions.

### 1.8 External document ingestion (non-native authored docs)
- **Scanned documents**: PDFs/images of external notes, consult letters, discharge paperwork.
- **Faxes**: Incoming clinical documents (often scanned PDFs).
- **Uploads**: Patient-provided or clinic-provided files.
- **External record packets**: Multi-document sets (ROI packets).
- **OCR-derived text** (derivative artifact): Machine-extracted text for search/review, with clear provenance and quality caveats.

**Rule**: External documents must be stored with immutable provenance metadata (source, date received, sender/organization if known, patient association method, OCR confidence/quality notes).

### 1.9 Amendments, addenda, corrections (lifecycle documentation)
- **Addendum**: appended content with explicit author and timestamp.
- **Correction**: appended clarification referencing the erroneous content.
- **Amendment**: appended update with reason code and linkage.
- **Retraction note** (rare; policy-defined): appended statement indicating an entry is incorrect/entered in error (never silent deletion).

---

## 2. Clinical Safety & Compliance Constraints (Draft-Only Doctrine + LMR Readiness)

### 2.1 Draft-only doctrine (MIG-04A)
MIG-04A must enforce:
- **Draft labeling everywhere**: UI banner and API payload tags must clearly state **DRAFT ONLY** and **NOT FOR CLINICAL DECISION / NOT SIGNED**.
- **No finalization semantics**: No “sign”, “finalize”, “attest”, “lock”, “commit”, “submit”, “writeback”, or equivalent behavior.
- **No write-back to authoritative EHR datastore**: No transmission/mutation of external system-of-record note endpoints.
- **No background automation**: No unattended background processes that move draft content into permanent records or trigger downstream actions.

### 2.2 Human-in-the-loop (HITL) requirements
- **Review required**: AI-generated content must never be treated as “true” without clinician review.
- **Editability required**: Drafts must be editable by a human reviewer prior to any downstream use.
- **Role-aware review**: Only appropriately authorized roles may view/edit drafts for a patient/encounter.
- **Consent gating**: Draft generation must be blocked unless consent is verified for the patient/provider pair and scope (see MIG-04A docs and HIPAA strategy).

### 2.3 Attestation requirements (future-ready; MIG-04B+)
Even though signing is out of scope for MIG-04A, Phase 0 must establish constraints:
- **Credentialed signer**: Signing must be performed by a credentialed human; AI cannot sign.
- **Non-repudiation**: Signing must be auditable, tamper-resistant, and attributable.
- **Co-sign workflows**: Supervision/co-sign may be required (e.g., trainee notes), jurisdiction/policy-specific.

### 2.4 Amendment vs overwrite rules (LMR-aligned)
- **Append-only corrections**: Amendments/addenda must be new entries that reference prior versions.
- **No silent edits**: Any change must preserve prior content and record a reason, author, and timestamp.
- **Diff visibility**: Reviewers must be able to view what changed between versions.

### 2.5 Audit trail requirements (minimum)
Audit trails must capture, at minimum:
- **Identity**: actor id, role, organization/tenant, authentication context
- **Patient/encounter context**: patient id, encounter id (if applicable), document category
- **Event type**: at least `CREATE_DRAFT`, `UPDATE_DRAFT`, `VIEW_DRAFT`, `DISCARD_DRAFT` (per `mig-04-acceptance-guardrails.md`)
- **Timing**: timestamp with timezone, ordering guarantees
- **Provenance**:
  - For AI-generated drafts: model/provider, model version, prompt template/version, retrieval sources (if any), tool proposals used, and output validation results
  - For human edits: editor identity, edit timestamps, and change summary or diff hash

Audit data must be:
- **Tamper-resistant**
- **Retained per policy**
- **Exportable for audit/legal requests**

### 2.6 Legal medical record rules (draft-safe but LMR-ready)
MIG-04A outputs are not LMR, but must be built so MIG-04B can safely transition:
- **Provenance must survive** the transition from draft to final record.
- **“Entered in error”** handling must be policy-defined and auditable.
- **Record release readiness**: once MIG-04B exists, the LMR may include audit metadata and amendments per policy.

### 2.7 HIPAA / GDPR constraints (platform-aligned)
In MIG-04A, draft content may contain PHI and must comply with platform security/compliance doctrines:
- **Minimum necessary**: limit PHI exposure to what is required for drafting/review.
- **Vendor eligibility/BAA**: any vendor processing PHI must be approved and (where required) under BAA (see `docs/04-security-compliance/vendor-selection.md` and `hipaa-strategy.md`).
- **Access control**: explicit authorization, tenant isolation, and auditable access (see `docs/04-security-compliance/security-model.md`).
- **Data minimization & retention**: drafts must not be retained indefinitely by default; retention policies must be explicit.
- **No PHI in non-essential logs**: redact/exclude PHI from telemetry and prompt logs unless explicitly permitted and protected.

For GDPR-aligned deployments (EU/EEA or equivalent privacy regimes), treat clinical documentation content as **special category data (health data)** and require:
- **Lawful basis + Article 9 condition**: processing must be justified by an appropriate lawful basis and health-data condition (operator responsibility, but system must support enforcement by configuration).
- **Purpose limitation**: drafting/review use must not silently expand into secondary uses (training, analytics, product improvement) without explicit governance.
- **Data subject rights readiness**: ability to support access/export, rectification workflows (via append-only corrections), restriction, and deletion/erasure where applicable and lawful.
- **Data residency + transfer controls**: vendor selection and AI execution must respect residency/transfer constraints (approved vendors only; retention and training controls explicit).
- **Privacy-by-design**: default deny, least privilege, strict tenant isolation, and auditability for every access.

---

## 3. AI Role Boundaries (No Ambiguity)

### 3.1 What AI MAY assist with (MIG-04A)
AI assistance is allowed only as **proposals** to a human reviewer, including:
- **Drafting narrative text** from provided context (encounter summary, clinician inputs, prior notes, structured data).
- **Structuring**: organizing content into note templates (SOAP, H&P, consult, discharge, etc.).
- **Summarization**: summarizing prior documentation or longitudinal history (with provenance).
- **Clarity and completeness prompts**: identifying missing sections/required elements (“allergies not documented”, “no ROS present”).
- **Patient instruction drafting**: educational drafts in patient-friendly language (clearly labeled as draft and reviewed).
- **Results explanation drafts**: explanatory narratives that **do not** claim definitive diagnosis and that reference source results.
- **Language improvements**: grammar, readability, de-duplication, and formatting.

### 3.2 What AI MUST NEVER do (MIG-04A and beyond)
AI must be prevented (by policy and UI) from:
- **Signing/attesting/finalizing/locking** any note or record.
- **Creating a legal medical record** or representing content as finalized.
- **Making autonomous clinical decisions** (diagnosis, treatment selection, disposition) without explicit clinician direction and review.
- **Inventing facts**: no fabricated vitals, exam findings, lab values, imaging findings, diagnoses, medications, allergies, timelines, or patient statements.
- **Altering source data**: no mutation of PHI/clinical facts in upstream stores (and no background writebacks).
- **Issuing orders/prescriptions/referrals** as actions (drafting a letter is okay; executing an order is not).
- **Impersonating a clinician**: AI text must not present as “I examined the patient” unless explicitly provided by clinician input and labeled appropriately.
- **Cross-patient leakage**: no access to or inclusion of information from other patients/tenants.

### 3.3 Draft labeling requirements (mandatory)
Every AI-assisted artifact must carry:
- **Draft status**: “DRAFT ONLY (AI-assisted)”
- **Human review requirement**: “Requires clinician review and editing before any use”
- **Non-final disclaimer**: “Not signed. Not a legal medical record.”
- **Provenance marker**: which sections were AI-proposed vs human-authored/edited

### 3.4 Evidence citation expectations (chart + external knowledge)
AI-generated content must include:
- **Chart evidence links** (when referencing patient facts): cite the source record(s) (e.g., lab result id/time, medication list source, previous note id/date).
- **External knowledge citations** (when using clinical guidelines/medical knowledge): cite the guideline/source reference used and version/date where available.

If citations are missing:
- AI must **downgrade confidence** and/or **refuse** to present statements as facts.

### 3.5 Confidence and hallucination controls
MIG-04A must use “unsafe until proven safe” assumptions:
- **Confidence signaling**: per-section confidence or “source available/not available” flags.
- **Uncertainty surfacing**: explicitly mark uncertain statements and ask clinician for confirmation.
- **Refusal paths**: refuse requests that attempt to bypass draft-only doctrine or request unsafe actions (e.g., “sign this note”, “submit to EHR”, “change allergy list”).
- **Schema validation**: outputs must be validated against note schemas (structural integrity) and policy checks (content safety).
- **Copy-forward risk controls**: detect/flag copied content that may be stale or contradictory.

---

## 4. Best-Practice Benchmarking (Epic, Cerner/Oracle Health, Modern EHRs)

### 4.1 What “good” looks like (industry patterns)
Best-in-class EHR documentation workflows generally provide:
- **Fast capture + high fidelity**: clinicians can document efficiently without degrading clinical accuracy.
- **Structured + narrative harmony**: narrative supports reasoning, while structured data supports downstream workflows.
- **Template discipline**: templates help completeness without encouraging meaningless boilerplate.
- **Clear authorship**: who wrote what and when is unambiguous; co-sign rules are enforced.
- **Amendment-safe lifecycle**: append-only corrections and robust audit trails.
- **Safe reuse**: smart phrases/macros are permitted but misuse is detectable/mitigated.
- **Contextual prompts**: nudges for missing required elements, contraindications, or documentation gaps.

### 4.2 Epic (high-level benchmarking)
Common strengths to benchmark:
- **Template and macro ecosystems** (e.g., smart phrases) supporting efficiency
- **Co-sign and role workflows** for trainees and supervising clinicians
- **Robust audit and attestation controls** in finalized documentation
Common risks to avoid:
- **Copy-forward/cloning amplification**: reused text creates factual drift
- **Note bloat**: excessive boilerplate impairs safety and readability

### 4.3 Cerner / Oracle Health (high-level benchmarking)
Common strengths to benchmark:
- **Enterprise-scale governance and audit posture**
- **Structured documentation integration** with clinical workflows
Common risks to avoid:
- **Inconsistent note quality across templates** and fragmented authoring experiences

### 4.4 Modern best-in-class EHR/clinical documentation tooling
Modern systems increasingly provide:
- **AI-assisted drafting and summarization**
- **Ambient/voice capture** (where policy permits) feeding draft notes
- **Inline validation**: prompts for missing elements and contradictions
For Zenthea, the key is **governed AI**:
- AI must remain proposal-only
- Provenance must be explicit
- Draft-only and HITL constraints must be unbreakable

### 4.5 Known clinical documentation failures (must design against)
Widely recognized failure modes include:
- **Copy/paste and copy-forward errors**: propagating incorrect diagnoses, exam findings, or histories.
- **Stale autopopulated data**: outdated medication lists, allergies, problem lists reused as if current.
- **Wrong patient errors**: cross-chart contamination or mis-association.
- **False certainty**: AI-generated text that sounds authoritative despite uncertain or missing evidence.
- **Note bloat**: decreased signal-to-noise; critical findings buried.
- **Time/sequence confusion**: mixing historical and current data without clear timestamps.
- **Inadequate auditability**: inability to reconstruct who authored/edited content.

---

## 5. Legacy Zenthea Audit (READ-ONLY Reference) – Current Status

### 5.1 Expected legacy reference location
The prompt references a legacy path: `<LEGACY_REPO_PATH>/apps/zenthea/src/app/company`.

### 5.2 What we could verify in this repo
Within this repo, we can confirm (from existing migration documents):
- Strong **draft-only** and anti-creep guardrails for MIG-04A (`docs/12-migration/mig-04-acceptance-guardrails.md`).
- An initial set of supported draft note categories (16 types) (`docs/12-migration/mig-04A-clinical-documentation-draft.md`, `docs/12-migration/slice-04A/slice-04A-spec.md`).

### 5.3 What we could NOT verify yet (explicit uncertainty)
The legacy reference repository path is not present in this workspace, so we could not audit:
- Existing legacy note templates and clinician workflows
- Legacy data model assumptions (encounter linkage, authorship, versioning)
- Legacy handling of amendments/addenda and audit trails
- Any legacy strengths/weaknesses in specialty documentation

**Phase 1 prerequisite (non-implementing)**: once the legacy repo is available in a readable location, perform a behavior-level audit and update this document with a “Legacy Findings” appendix.

---

## 6. Explicit Non-Goals for MIG-04A (Critical)

MIG-04A will NOT:
- **Write back** to any authoritative EHR datastore or external system of record.
- **Create legal medical record artifacts** (no finalize/lock/sign/attest).
- **Perform billing/coding submission** or trigger revenue-cycle workflows.
- **Make autonomous clinical decisions** or recommendations presented as final care decisions.
- **Place orders** (medications, labs, imaging, referrals) as executed actions.
- **Run background automation** that mutates PHI or advances document state without explicit HITL.
- **Replace clinician judgment** or remove required clinical review steps.
- **Guarantee correctness** of AI output; safety relies on HITL, provenance, and strict refusal/validation controls.

---

## 7. Phase 0 Output: Authoritative Scope Statement

For MIG-04A, “clinical documentation” means:
- Supporting the drafting and human editing of the canonical documentation categories above
- Under unbreakable **draft-only** semantics
- With explicit provenance, auditability, consent gating, and safety controls
- Without any commit/sign/write-back paths

This document is the reference for Phase 1 implementation planning, but Phase 0 ends here (analysis + documentation only).

