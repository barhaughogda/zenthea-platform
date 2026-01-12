# SL-04 — Clinical Drafting (Clinician‑Initiated) — Phase E Slice

## Status & Governance Posture
- **Phase**: Phase E (strictly non-executing; documentation/specification only)
- **Slice ID**: **SL-04**
- **Slice name**: **Clinical Drafting (Clinician‑Initiated)**
- **Scope posture**: **Draft-only** clinical documentation assistance
- **Initiation**: **Clinician-initiated only** (not patient-initiated)
- **Autonomy**: **No autonomous action**; clinician must explicitly request drafting

---

## Purpose and Clinical Intent
SL-04 defines a governed capability where a **licensed clinician** may explicitly request **AI assistance to draft clinical documentation** during or after an encounter. The intent is to reduce documentation burden while maintaining strict safety, compliance, and governance boundaries:

- Produce **advisory draft content** that the clinician can review and edit.
- Maintain **clear provenance** and **explicit draft labeling**.
- Ensure **fail-closed** behavior when identity, tenant scope, session, or consent is invalid.

SL-04 is explicitly designed to be demonstrable without enabling any record-finalization or system-of-record mutation.

---

## Explicit Boundaries (Non‑Negotiable)
SL-04 is valid only if all of the following remain true:

- **Draft-only behavior**:
  - Outputs are **draft artifacts only**.
  - **No writes to any EHR/system of record** are permitted.
- **Clinician-initiated only**:
  - The trigger is an authenticated clinician action in a clinician-facing surface.
  - **No patient-initiated workflow** is in scope.
- **No autonomous action**:
  - No background drafting, auto-save, auto-submission, or state progression without clinician action.
- **No attestation or legal authorship claims**:
  - The system must not claim that the clinician “signed”, “attested”, “finalized”, “committed”, or “authored” content unless it was explicitly entered by the clinician (and even then remains draft-only).
- **No MIG-04B semantics**:
  - Any language or behavior implying signing, attestation, finalization, locking, submission, or record commit is **forbidden** here.
- **Fail-closed**:
  - If clinician identity, tenant scope, session context, or consent gating is invalid/absent where required, SL-04 must deny the action and emit only metadata-safe audit.

---

## Non‑Goals (Anti‑Creep)
SL-04 does **not**:

- Create a legal medical record artifact.
- Enable signing, attestation, finalization, locking, submission, transmission, or any record commit.
- Perform write-back to an EHR or any system-of-record endpoint.
- Place orders, issue prescriptions, initiate referrals, or trigger downstream clinical actions.
- Make autonomous decisions about patient care.
- Run patient-facing drafting experiences or patient-initiated requests.

If a requirement resembles any commit / attestation behavior, SL-04 must reject it as out of scope.

---

## Relationship to MIG-04A (Reused Semantics)
SL-04 **reuses the already-sealed draft-only safety contract and acceptance posture** defined by **MIG-04A (Clinical Documentation — Draft Only, HITL)**, including:

- **Draft-only labeling rules** (“DRAFT ONLY (AI-assisted)”, “Not signed. Not a legal medical record.”, “Requires clinician review…”).
- **Refusal rules** for any sign/attest/finalize/commit/lock/write-back intent.
- **Evidence and uncertainty rules** (no fabricated patient facts; ask clarifying questions or mark uncertainty).
- **Provenance expectations** (prompt template/version and model/provider/version must be attributable).
- **Metadata-only audit expectations** (no clinical note text in logs).
- **Determinism expectations** (outputs must be reproducible under a fixed configuration).

SL-04 is the Phase E slice-level definition for **clinician initiation and governance wiring** of that draft-only behavior.

---

## Relationship to MIG-04B (Explicitly Forbidden)
SL-04 must **not** introduce, emulate, or approximate any behavior that belongs to **MIG-04B (Clinical Documentation — Commit / Attestation)**, including (non-exhaustive):

- Signing or attesting a clinical note (as executed action).
- Finalization, locking, “ready to file”, submission, or record commit semantics.
- Any outbound mutation of EHR/system-of-record clinical note data.
- Any representation that a document is a completed medical record artifact.

If any SL-04 language, UI, API, or behavior implies the above, SL-04 is invalid and must be corrected by removing the commit/attestation implication (not by extending scope).

---

## Inputs (Conceptual / High‑Level)
All inputs are conceptual and governed; concrete schemas are out of scope for Phase E.

- **Clinician identity (required)**:
  - Verified clinician authentication state
  - Role/entitlements appropriate for clinical drafting within the tenant
- **Tenant scope (required)**:
  - Tenant/org identifiers used to enforce strict isolation and authorization
- **Drafting request (required)**:
  - Clinician-provided intent (e.g., “draft an H&P”, “draft SOAP note”, “draft procedure note”)
  - Optional clinician constraints (tone, structure, required sections)
- **Encounter/patient context (optional; patient-scoped when present)**:
  - Minimal necessary patient/encounter context references needed for drafting
  - Only permitted when patient scope and consent gates pass (see SL-01 / SL-03)
- **Evidence references (optional)**:
  - Chart evidence pointers (IDs, timestamps, source record references)
  - External guideline citations (source + version/date)

---

## Outputs (Draft‑Only Artifacts)
SL-04 outputs are **draft-only** and must be clearly labeled as such.

- **Draft text** (narrative clinical prose), optionally structured into canonical sections (e.g., SOAP/H&P)
- **Draft metadata**:
  - Draft labeling + disclaimers (see below)
  - Provenance (model/provider/version; prompt template/version)
  - Evidence references per claim/section when applicable
  - Uncertainty flags where evidence is missing/ambiguous

### Mandatory draft labeling (every surface)
Every output containing clinical documentation content must include, at minimum:

- **“DRAFT ONLY (AI-assisted)”**
- **“Not signed. Not a legal medical record.”**
- **“Requires clinician review and editing before any use.”**
- Clear markers distinguishing **AI-proposed** vs **clinician-edited** content where applicable.

---

## Governance and Gate Enforcement

### Clinician identity and tenant scope (required; fail-closed)
SL-04 requires a valid clinician identity and tenant scope for every request. If either is missing or invalid, SL-04 must deny the request and emit metadata-only audit.

### SL-01 dependency (when patient context exists)
When drafting uses **patient/encounter context**, SL-04 must enforce **SL-01 Patient Scoping & Consent Gate** before any patient-scoped processing occurs. If SL-01 denies, SL-04 must **fail-closed**.

### SL-03 dependency (when patient-scoped)
When patient-scoped, SL-04 must derive patient/encounter context through **SL-03 Patient Session Establishment** (PatientSessionContext) to ensure:

- Deterministic scoping for downstream processing
- Tenant isolation and anti-wrong-patient protections
- Consistent governance boundaries across layers

If PatientSessionContext is absent/invalid, SL-04 must **fail-closed**.

---

## Determinism & Reproducibility (Normative)
SL-04 requires that draft generation be **deterministic and reproducible** for the same inputs and configuration. At minimum, the system must be able to reproduce outputs by fixing:

- Prompt template and version (immutable reference)
- Model/provider and version (immutable reference)
- Generation configuration (e.g., temperature and other sampling parameters set to deterministic values)
- Retrieval/evidence selection rules (stable ordering and identifiers)

Any non-deterministic behavior must be treated as a governance failure for this slice.

---

## Failure Modes (Fail‑Closed Cases)
SL-04 must fail-closed (deny) under any of the following conditions:

- **Clinician identity invalid or missing**
- **Tenant scope missing / mismatch / unauthorized**
- **Clinician session invalid/expired**
- **Patient context present but SL-01 decision is deny/unknown**
- **Patient-scoped request but SL-03 PatientSessionContext is missing/invalid**
- **Consent required but not granted or not verifiable**
- **Request attempts forbidden intent** (e.g., sign/attest/finalize/commit/lock/submit/write-back)
- **Policy cannot determine safety posture** (e.g., missing policy inputs, ambiguous domain)
- **Audit cannot be emitted safely** (metadata-only requirement cannot be satisfied)

In all failure cases, the system must:
- Return a clear denial reason (non-PHI).
- Emit **metadata-only** audit.
- Produce **no draft content**.

---

## Audit, Safety, and Privacy Expectations

### Metadata-only audit (no PHI in logs)
Audit events may record metadata such as:

- Correlation/request ID
- Tenant/org identifier
- Clinician identifier (opaque internal ID)
- Patient/encounter references only as **opaque identifiers or hashed tokens** (no names, no note content)
- Policy decisions (allow/deny + reason codes)
- Provenance metadata (model/provider/version; prompt template/version; validation outcomes)

Audit must never include clinical draft text or other PHI payloads.

### Safety expectations
- Draft outputs must never be presented as final or authoritative.
- Patient facts must be evidence-backed or explicitly marked uncertain/unverified.
- The system must refuse requests that would require fabrication or would cross draft-only boundaries.

---

## Demo Suitability Rationale (Phase E)
SL-04 is demo-suitable because it can show high-value clinician workflow assistance while remaining safely bounded:

- Clinician explicitly initiates drafting (no autonomous behavior).
- Outputs are **clearly labeled** as draft-only advisory content.
- Strong fail-closed gating demonstrates governance posture (identity/scope/session/consent).
- Metadata-only audit demonstrates compliance readiness without PHI exposure.
- No EHR write-back prevents accidental record mutation in demo environments.

---

## Acceptance Checks (Slice-Level, Documentary)
SL-04 is considered correctly defined (Phase E) only if the slice documentation:

- Makes **draft-only** constraints explicit and unambiguous.
- Explicitly excludes patient-initiated flows and any autonomous action.
- Defines **fail-closed** behavior for identity, tenant scope, session, and consent.
- Requires SL-01 and SL-03 enforcement when patient-scoped.
- Requires metadata-only audit with no PHI payloads.
- Requires deterministic/reproducible output under fixed configuration.

