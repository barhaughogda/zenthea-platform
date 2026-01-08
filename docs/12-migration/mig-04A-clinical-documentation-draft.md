# MIG-04A: Clinical Documentation (Draft Only, HITL)

- **Status**: Planned (Approved later via Step 0 lock)
- **ID**: MIG-04A
- **Category**: Migration
- **Focus**: Draft-only clinical documentation, human-in-the-loop (HITL)

## 1. Purpose
The goal of MIG-04A is to provide a safe, non-finalizing workspace for AI-assisted clinical documentation. All outputs generated in this slice are strictly **drafts** and cannot be used as official medical records without the subsequent MIG-04B commit cycle.

## 2. Explicit Non-Goals
- **No Legal Medical Records**: No artifact generated in MIG-04A shall be considered a legal medical record.
- **No Signing**: No electronic signatures or "sign-off" workflows.
- **No Finalization**: No "lock" or "finalize" actions.
- **No EHR Write-back**: No mutations to external EHR datastores or primary clinical databases.
- **No Background PHI Mutation**: No background jobs that modify PHI without direct HITL oversight.

## 3. In-Scope
- **Draft Artifacts**: Generation of structured and unstructured clinical text drafts.
- **Review UI**: Headless or adapter-driven UI for reviewing and editing drafts.
- **Structured Outputs**: Mapping AI outputs to clinical schemas (e.g., FHIR-aligned DTOs).
- **Audit Signals**: Persistence of "who, what, when" for every draft generation and edit.
- **Evaluations (Evals)**: Quality gates for clinical accuracy and hallucinations.

## 4. Integration Order
1. **Consent First**: Verify patient and provider consent for AI assistance.
2. **Clinical-Documentation-Agent Drafts**: Core drafting logic.
3. **Medical-Advisor Advisory**: Contextual clinical support/reminders during drafting.

## 5. Clinical Documentation Coverage
The following categories are supported in **draft mode only**:
- **Encounter note (SOAP)**: Subjective, Objective, Assessment, Plan.
- **Progress note**: Ongoing clinical status updates.
- **Consultation note**: Specialist opinions and recommendations.
- **H&P (History and Physical)**: Comprehensive initial assessments.
- **Discharge summary**: Transition of care documentation.
- **Operative note**: Surgical procedure documentation.
- **Procedure note**: Minor bedside or clinic procedure documentation.
- **ED note**: Emergency department encounter documentation.
- **Nursing note**: Nursing assessment and intervention documentation.
- **Care plan note**: Multi-disciplinary care planning.
- **Results interpretation note**: Explanatory drafts for labs/imaging (non-diagnostic).
- **Referral letter draft**: Outbound referral requests.
- **Patient instructions draft**: Educational materials for the patient.
- **Prior authorization narrative draft**: Supporting text for insurance (non-clinical decision).
- **Coding support narrative draft**: Drafting of clinical context for coding (no billing submission).
- **Documentation improvement prompts**: Real-time reminders for missing fields or required data.

## 6. Stop Conditions
- **IF** any write semantics to a finalized store are detected: **STOP**.
- **IF** a "commit" or "sign" button is requested in the UI: **STOP**.
- **IF** an automated background job attempts to sync a draft to a permanent clinical record: **STOP**.
