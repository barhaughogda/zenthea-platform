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

## 7. MIG-04A Acceptance Criteria (must all be true)
- [ ] **Draft Labeling**: Every UI screen and API response containing clinical documentation must include a clear "DRAFT" or "PROPOSAL" label.
- [ ] **API Surface**: No endpoints exist that allow for the finalization, locking, or signing of a clinical record.
- [ ] **Tool Allowlist**: No tools with write permissions to clinical record stores are active in the `clinical-documentation-agent` scope.
- [ ] **Connector Safety**: No external connectors are invoked with `WRITE_CONTROLLED` or similar mutation-heavy permissions in clinical documentation flows.
- [ ] **Job Constraints**: No background workers or cron jobs are permitted to perform PHI mutations or record commits.
- [ ] **Validation**: All draft outputs must be structured via Zod (or equivalent) schemas and validated before persistence.
- [ ] **Advisory Status**: AI-generated content is explicitly tagged as "Advisory/Draft" and requires human review before any further action.
- [ ] **Audit Completeness**: Audit trails must capture metadata for: `CREATE_DRAFT`, `UPDATE_DRAFT`, `DISCARD_DRAFT`, and `VIEW_DRAFT`.
- [ ] **Consent Gating**: Every request for draft generation must be preceded by a verified consent check for the specific patient/provider pair.
- [ ] **Safety Tests**: Unit and AI eval tests must demonstrate refusal of unsafe prompts, adherence to safe behavior, and denial of cross-patient data access.
- [ ] **CI Hygiene**: All pipeline stages (`pnpm lint`, `typecheck`, `build`, `test`, `eval:ai`) must be green.

## 8. MIG-04A Forbidden Change Detector (Stop Conditions)
The presence of any of the following patterns in code or configuration during MIG-04A execution indicates unauthorized scope creep:
- **Keywords**: `finalize`, `sign`, `submit`, `commit`, `pushToEHR`, `writeback`, `chartUpdate`, `attest`.
- **Routes**: `/finalize`, `/sign`, `/attest`, `/commit`, `/lock`.
- **Tools**: Any tool used in documentation flows that is not prefixed with `comm.*` (communication/draft only).

**STRICT RULE**: Detection of these patterns requires immediate cessation of MIG-04A work and a mandatory pivot to MIG-04B planning/approval.

## 9. Evidence Required to Mark MIG-04A Completed
To close out MIG-04A, the following artifacts must be provided:
- [ ] **Verification Doc**: A `complete.md` file in the slice directory containing verification outputs.
- [ ] **Code Evidence**: Explicit file paths for:
  - Drafting and review modules.
  - Zod schemas for clinical drafts.
  - Unit and AI evaluation test suites.
- [ ] **Governance Statement**: An explicit signed statement: *"I verify that no commit or signing semantics have been implemented in this slice, and all outputs are draft-only with human-in-the-loop requirements."*
