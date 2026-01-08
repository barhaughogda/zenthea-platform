# MIG-04A: Provider Portal Clinical Documentation (Draft Only) - Slice Specification

- **Status**: Planned
- **Slice ID**: MIG-04A
- **Domain**: Clinical Documentation
- **Stakeholders**: Clinicians, Governance, Compliance

## 1. Scope and Objectives
Provide clinician-facing draft documentation workflows within the Provider Portal. This slice focuses strictly on the generation and review of AI-proposed documentation artifacts without enabling legal finalization or external persistence.

### 1.1 Core Doctrine
- **Draft-only**: Every artifact is transient and labeled as a draft.
- **Human-in-the-loop (HITL)**: All AI outputs require explicit clinician review and interaction.
- **Proposal-only**: AI agents propose; clinicians dispose.
- **No Commit/Sign/Finalize**: Strictly prohibited in this slice.

## 2. Preconditions
- **MIG-03**: Provider Portal (Clinical Foundation) completed and merged.
- **Consent-Agent**: Active and integrated as the primary gatekeeper for PHI processing.
- **Clinical-Documentation-Agent**: Scaffolded and ready for implementation.
- **Medical-Advisor-Agent**: Scaffolded and ready for implementation.
- **CP-17 to CP-20**: Control Plane modules (Controlled Mutations, Policy Versioning, Performance Boundaries, External Interop) are sealed.

## 3. In-Scope Capabilities
### 3.1 Draft Generation
Support for the following documentation types (all draft-only):
- **Encounter note (SOAP)**
- **Progress note**
- **Consultation note**
- **H&P (History and Physical)**
- **Discharge summary**
- **Operative note**
- **Procedure note**
- **ED note**
- **Nursing note**
- **Care plan note**
- **Results interpretation note** (labs/imaging) - explanatory draft only.
- **Referral letter draft**
- **Patient instructions draft** (educational)
- **Prior authorization narrative draft**
- **Coding support narrative draft**
- **Documentation improvement prompts** (missing fields/reminders)

### 3.2 Review and Edit Workflow
- **Client-side Editing**: Allow clinicians to modify draft text in the UI.
- **Review States**: Implement states for `Draft`, `Needs Review`, and `Ready for Signoff`.
- **Citations**: AI must cite evidence sources when using external medical knowledge.
- **Safety**: Robust refusal paths for unsafe or out-of-scope prompts with clear disclaimers.

## 4. Explicit Non-Goals (Out of Scope)
- **Signing and Attestation**: No legal record creation or signing functionality.
- **EHR Write-back**: No transmission of data to external systems of record.
- **Autonomous Action**: No agent-initiated clinical decisions or commits.
- **Background PHI Mutation**: No automated modification of clinical data.

## 5. System Interfaces
### 5.1 Provider Portal App Surface
- **Routes**: `/patients/[id]/documentation/drafts`
- **Components**: `DraftEditor`, `DraftReviewPanel`, `ClinicalNoteTypeSelector`.

### 5.2 Agent Contracts
- **clinical-documentation-agent**: `generateDraft(type, context) -> { draft_id, content, metadata }`.
- **consent-agent**: `verifyConsent(patientId, providerId, scope: 'clinical_documentation') -> { granted: boolean }`.

### 5.3 Observability and Audit
- Emit metadata-only audit events: `CREATE_DRAFT`, `UPDATE_DRAFT`, `VIEW_DRAFT`, `DISCARD_DRAFT`.

## 6. Testing and Evaluations
- **Deterministic Rules**: Unit tests for schema validation, consent gating, and state transitions.
- **AI Evals**:
  - **Refusals**: Test behavior against prohibited prompts (e.g., "Sign this note").
  - **Hallucinations**: Guardrails against fabricated clinical data.
  - **Language**: Ensure non-prescriptive, advisory tone.
  - **Leakage**: Verify zero cross-patient data access.

## 7. Acceptance Criteria
- Adheres strictly to `docs/12-migration/mig-04-acceptance-guardrails.md`.
- **Hard Prohibitions**:
  - No database fields for `isSigned` or `signedAt`.
  - No UI elements for "Sign" or "Finalize".
  - No EHR write-back integration enabled.

## 8. Rollback Plan
- Revert all UI and API bindings to the documentation service.
- Maintain UI functionality in mock mode for offline testing/demo if needed.

---
**Note**: MIG-04B (Controlled Commit and Sign) is a subsequent, independent slice and is strictly excluded from this implementation.
