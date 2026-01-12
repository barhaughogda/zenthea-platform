# Zenthea Platform Roadmap

This is the **authoritative source of truth** for platform progress. It integrates high-level strategic phases with tactical execution slices.

- **Execution Standards**: Refer to `docs/01-architecture/execution-standards.md` for rules and definitions.
- **Detailed Specs**: See `docs/12-migration/` for individual slice specifications.

---

## 1. Strategic Timeline (Phases)

| Phase | Description | Status | Target |
| :--- | :--- | :--- | :--- |
| **Phase A** | Complete the Agent Surface (Scaffold Only) | **Completed** | 100% Scaffolding Coverage |
| **Phase B** | Legacy Repository Analysis | **Completed** | Inventory & Mapping Docs |
| **Phase C** | Migration by Extraction | **Completed** | Domain Parity |
| **Phase D** | Integration & Hardening | **Completed (CP-21 Sealed)** | Production Readiness |
| **Phase E** | Patient Journey Execution (Slice-Based) | **Completed (Sealed)** | 100% Slice Coverage |
| **Phase F** | Execution Design & Governance Unlocks | **Planned** | Not Scheduled |

---

## 1A. Golden Path Alignment

Phase E execution is **anchored to the Patient Golden Path**, and is expressed as **slice-based delivery**, not feature delivery.

- The Golden Path is the narrative spine that defines the bounded end-to-end journey and “does / does not” constraints: `docs/01-journeys/golden-path-patient-journey.md`
- Phase E delivery units are **execution slices** extracted from the Golden Path, each independently buildable/testable/sealable with explicit governance boundaries: `docs/02-slices/patient-journey-slices.md`

This roadmap preserves all completed and sealed Control Plane (CP) and Migration (MIG) milestones; Phase E **builds on** them without reopening them.

---

## 2. Integrated Status Board

This table tracks both **Control Plane (CP)** and **Migration (MIG)** slices in order of execution/dependency.

| ID | Category | Name | Status | Evidence / Location |
| :--- | :--- | :--- | :--- | :--- |
| **MIG-00** | Migration | Platform Foundation | **Completed** | `docs/11-next-phases/` |
| **MIG-01** | Migration | Website Builder (Non-Clinical) | **Completed** | `docs/12-migration/slice-01/` |
| **MIG-02B**| Migration | Patient Portal (PHI) | **Completed** | `docs/12-migration/Slice-02B/` |
| **CP-04** | Control | Observability & Abuse Signals | **Completed** | `docs/12-migration/slice-04/` |
| **CP-06** | Control | Agent Governance | **Completed** | `docs/12-migration/slice-06/` |
| **CP-07** | Control | Agent Lifecycle Enforcement | **Completed** | `docs/12-migration/slice-07/` |
| **CP-08** | Control | Approval Signals & Escalation | **Completed** | `docs/12-migration/slice-08/` |
| **CP-09** | Control | Controlled Rollouts & Transitions | **Completed** | `docs/12-migration/slice-09/` |
| **CP-10** | Control | Governance Read Models | **Completed** | `docs/12-migration/slice-10/` |
| **CP-11** | Control | Operator APIs (Read-Only) | **Completed** | `docs/12-migration/slice-11/` |
| **CP-12** | Control | Operator Query Policies | **Completed** | `docs/12-migration/slice-12/` |
| **CP-13** | Control | Operator Audit & Error Taxonomy | **Completed** | `docs/12-migration/slice-13/` |
| **MIG-03** | Migration | Provider Portal (Clinical) | **Completed** | `docs/12-migration/mig-03-provider-portal.md` |
| **CP-14** | Control | Control Plane DTOs & Metadata | **Completed** | `docs/12-migration/slice-14/` |
| **CP-15** | Control | Operator UI Adapter (Headless) | **Completed** | `docs/12-migration/slice-15/` |
| **MIG-04A** | Migration | Clinical Documentation (Draft Only, HITL) | **Completed** | `docs/12-migration/mig-04A/` *(Phase 4 Validated – Draft-Only Safe)* |
| **MIG-04B** | Migration | Clinical Documentation (Write Paths & Attestation) | **Blocked (Explicit Design Stop)** | `docs/12-migration/mig-04B-clinical-documentation-commit.md` |
| **MIG-05** | Migration | Scheduling & Billing | **Planned** | — |
| **CP-16** | Control | Escalation Paths & Decision Hooks | **Completed** | `docs/12-migration/slice-16/` |
| **CP-17** | Control | Controlled Mutations | **Completed** | `docs/12-migration/slice-17/` |
| **CP-18** | Control | Policy & View Versioning | **Completed** | `docs/12-migration/slice-18/` |
| **CP-19** | Control | Performance & Caching Boundaries | **Completed** | `docs/12-migration/slice-19/` |
| **CP-20** | Control | External Integrations & Interop | **Completed** | `docs/12-migration/slice-20/` |
| **MIG-06** | Migration | Automation & Agent Orchestration | **Completed (v1 Sealed – Draft-Only Orchestration Rails)** | `docs/12-migration/mig-06/`<br>`docs/16-phase-e/phase-e-final-seal.md`<br>`docs/16-phase-e/e-13-mig-06-unblock-record.md` |

---

## 3. Active Workstream

Phase C (Migration by Extraction) is complete.
Phase D (Integration & Hardening) is complete and sealed.
CP-21 Application Surface Governance is mechanically enforced across all remediated surfaces.
MIG-04B remains explicitly blocked by design.
The platform is preparing to enter the next phase of work (Phase E).

Phase E has begun as **journey-aligned slice execution** anchored to the Patient Golden Path.
Initial focus is **demo-grade, non-executing behavior** (proposal-only, read-only, draft-only) that demonstrates governed boundaries without widening platform capability.
Governance posture remains unchanged (deny-by-default, consent-gated, fail-closed, metadata-only audit where required).
MIG-04B remains blocked by design and is not reopened by Phase E.

---

## 4. Phase E — Patient Journey Execution (Slice-Based)

Phase E executes the Patient Golden Path by delivering **bounded, governed slices**. Each slice below is mechanically traceable to `docs/02-slices/patient-journey-slices.md` and inherits the Golden Path constraints in `docs/01-journeys/golden-path-patient-journey.md`.

### 4.1 Foundation Slices (Mandatory Prerequisites)

#### SL-01 — Patient Scoping & Consent Gate
- **Short description**: Deterministic grant/deny boundary for patient-scoped workflows (identity + tenant scoping + consent verification), with fail-closed behavior on missing verification.
- **Governance role**: Prerequisite + gatekeeper (hard gate before any PHI-bearing retrieval or AI invocation).
- **Reference**: `docs/02-slices/patient-journey-slices.md` (SL-01)

### 4.2 Demo-Grade Slices (Investor & Stakeholder Ready)

These slices are suitable for demos because they are **bounded and non-executing**, proving governance posture (consent gating, draft-only, proposal-only, and “no financial action”) while remaining reviewable and conservative.

#### SL-02 — Patient Record Inquiry (Read-Only Summary)
- **What it demonstrates**: Patient post-visit understanding through plain-language, read-only summaries of patient-scoped information.
- **Explicit constraints**: Read-only; consent-gated; fail-closed; informational/educational (“Not Medical Advice”); metadata-only audit (no PHI in logs).
- **Demo suitability rationale**: Demonstrates patient trust boundaries and non-hallucination expectations without introducing execution semantics.
- **Reference**: `docs/02-slices/patient-journey-slices.md` (SL-02)

#### SL-03 — Patient Session Establishment
- **Short description**: Establishment of a governed patient session, including identity verification, tenant scoping, and initial consent state loading.
- **Governance role**: Foundation for all patient-scoped interactions; ensures deterministic session boundaries.
- **Reference**: `docs/02-slices/patient-journey-slices.md` (SL-03)

#### SL-07 — Scheduling Proposal (Patient-Initiated)
- **What it demonstrates**: Patient-initiated scheduling requests yielding structured **proposals** and clearly communicated “pending” status.
- **Explicit constraints**: Proposal-only; **no scheduling execution** (no booking/modification/cancellation commit); consent-gated; fail-closed; avoids promises of confirmation.
- **Demo suitability rationale**: Shows governed “request → proposal” behavior and safe communication of uncertainty without operational side effects.
- **Reference**: `docs/02-slices/patient-journey-slices.md` (SL-07)

#### SL-04 — Clinical Drafting (Clinician-Initiated)
- **What it demonstrates**: Clinician-initiated documentation support producing clearly labeled drafts/advisory output.
- **Explicit constraints**: Draft-only; clinician-initiated; consent-gated; fail-closed; no signing/attestation/finalization/commit; evidence citations when external evidence is used.
- **Demo suitability rationale**: Demonstrates clinician authority and draft-only doctrine with patient safety boundaries intact.
- **Reference**: `docs/02-slices/patient-journey-slices.md` (SL-04)

#### SL-05 — Clinical Draft Feedback (Signal Capture)
- **What it demonstrates**: Clinician review decisions (edit/accept/reject) captured as improvement/audit signals.
- **Explicit constraints**: Captures feedback as **metadata-only** events (no PHI); does not change clinical record state; does not create “commit” semantics.
- **Demo suitability rationale**: Demonstrates human-in-the-loop and auditability without expanding write authority into clinical domains.
- **Reference**: `docs/02-slices/patient-journey-slices.md` (SL-05)

#### SL-06 — Billing State Explanation (Patient-Facing)
- **What it demonstrates**: Patient-facing explanations of billing state and meaning in plain language.
- **Explicit constraints**: Explanatory only; **no financial action** (no payments, refunds, credits, pricing, entitlements changes); consent-gated where patient-scoped.
- **Demo suitability rationale**: Demonstrates financial-domain boundaries (“billing is authoritative over money”) without creating irreversible actions.
- **Reference**: `docs/02-slices/patient-journey-slices.md` (SL-06)

### 4.3 Deferred / Blocked Execution Areas

These areas are explicitly deferred because they require additional governed prerequisites and/or are explicitly blocked by doctrine. Each item below is **Not scheduled**.

- **Scheduling execution and confirmation**: Deferred because the governed “proposal → approval → execution” gateway mechanics and named approver semantics are not fully defined in governing sources; Phase E remains proposal-only. **Not scheduled.**  
  References: `docs/01-journeys/golden-path-patient-journey.md` (3.3), `docs/02-slices/patient-journey-slices.md` (Explicit Non-Slices: Scheduling Execution)

- **Intake capture workflows**: Deferred because specific intake capture surfaces and mechanics are not defined in governing sources; any PHI-bearing intake processing must remain consent-gated and purpose-limited. **Not scheduled.**  
  References: `docs/01-journeys/golden-path-patient-journey.md` (3.4), `docs/02-slices/patient-journey-slices.md` (Explicit Non-Slices: Intake Capture Surfaces)

- **Clinical commitment and attestation (MIG-04B linkage)**: **Blocked by explicit design stop**; AI signing/attestation/finalization/commit is forbidden unless governance unblocks MIG-04B (which remains blocked). **Not scheduled.**  
  References: `docs/ROADMAP.md` (MIG-04B row), `docs/02-slices/patient-journey-slices.md` (Explicit Non-Slices: Clinical Commitment / Attestation)

- **Orders, referrals, labs, insurance, clearinghouse integration**: Deferred because execution surfaces and exchange mechanics are not defined in governing sources; only advisory/explanatory boundaries are documented and interoperability gaps are explicitly listed. **Not scheduled.**  
  References: `docs/01-journeys/golden-path-patient-journey.md` (3.7–3.8; Known Gaps), `docs/02-slices/patient-journey-slices.md` (Explicit Non-Slices: Orders/Referrals Execution; Interoperability)

### 4.4 Relationship to Existing MIG and CP Work

- Phase E **builds on** the completed CP/MIG foundations (consent gating doctrine, deny-by-default tool governance, metadata-only audit posture, decision hooks/escalation semantics, controlled mutations boundaries, caching boundaries, and integration envelopes) and does not reopen sealed work.
- Completed and sealed milestones remain authoritative as recorded in the Integrated Status Board and the seal index (`docs/ARCHITECTURE-SLICE-SEAL-INDEX.md`).
- **MIG-05 (Scheduling & Billing)** is now conceptually split for clarity (without reopening or unsealing MIG work):
  - **Proposal/explanation behavior** is addressed in Phase E via SL-07 (scheduling proposal) and SL-06 (billing explanation).
  - **Execution behavior** (committing schedule changes and any financial transactions) remains deferred under explicit governed prerequisites and is **Not scheduled** in Phase E.
