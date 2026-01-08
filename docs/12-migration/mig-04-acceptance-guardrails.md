# MIG-04 Acceptance Guardrails

- **Scope**: Anti-creep guardrails for Clinical Documentation (MIG-04A vs MIG-04B)

## 1. Hard Prohibitions in MIG-04A
- [ ] No `isFinalized` or `isSigned` flags in database schemas.
- [ ] No POST/PUT routes to external EHR "clinical_note" endpoints.
- [ ] No inclusion of electronic signature blocks in generated PDFs.
- [ ] No deletion of draft history (audit required).
- [ ] No automated billing submission triggered by draft completion.

## 2. Allowed in MIG-04A
- [ ] Generation of clinical text using LLMs.
- [ ] Persistence of drafts in temporary/staging collections.
- [ ] User interface for "Edit Draft" and "Save Draft".
- [ ] Versioning of drafts for audit purposes.
- [ ] Clinical validation logic (e.g., "Check for missing allergies").

## 3. Only in MIG-04B
- [ ] The "Sign and Commit" action.
- [ ] Locking a record to prevent further edits.
- [ ] Exporting to the legal medical record (LMR) datastore.
- [ ] Attaching a provider's digital certificate/signature.
- [ ] Triggering downstream billing or referral automation.

## 4. Definition of Commit
A "commit" occurs when any of the following conditions are met:
1. The record is marked as "Final", "Signed", or "Locked".
2. The record is transmitted to an external system of record (e.g., EPIC, Cerner).
3. The record is used as the basis for a clinical decision that cannot be undone.
4. The record becomes accessible to unauthorized parties as a "completed" document.

## 5. Frontend Constraints
- **UI Labeling**: All MIG-04A screens must clearly display a "DRAFT ONLY - NOT FOR CLINICAL DECISION" banner.
- **No Write Paths**: No buttons or menu items labeled "Sign", "Finalize", or "Save to EHR".
- **Separation of Concerns**: Frontend components for drafting must not contain logic for state transitions into "Final".

## 6. Verification Gates
- **Step 1 (Drafting)**: Verify draft is saved to staging only.
- **Step 2 (Review)**: Verify HITL can edit but not sign.
- **Step 3 (Audit)**: Verify all edits are tracked in the governance log.
- **Pre-MIG-04B Gate**: Perform a code audit to ensure no "commit" logic leaked into the drafting service.
