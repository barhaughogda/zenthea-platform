# MIG-04A Execution Checklist: Clinical Documentation (Draft Only)

## Phase 1: Foundation and Gating
- [ ] **Step 1.1**: Verify `MIG-03` completion and `CP-17/20` sealing.
  - *Run gate*: Ensure all previous slice `complete.md` files are sealed.
- [ ] **Step 1.2**: Integrate `consent-agent` as a mandatory middleware for documentation routes.
  - *Run gate*: `pnpm test` (verify consent refusal paths).

## Phase 2: Agent Surface and Contracts
- [ ] **Step 2.1**: Define Zod schemas for documentation types in `clinical-documentation-agent`.
  - *Run gate*: `pnpm typecheck`.
- [ ] **Step 2.2**: Implement `generateDraft` endpoint with strict draft-only semantics.
  - *Run gate*: `pnpm test`.
- [ ] **Step 2.3**: Implement metadata-only audit logging for draft lifecycle.
  - *Run gate*: Verify log events in development console.

## Phase 3: Provider Portal UI (Draft Only)
- [ ] **Step 3.1**: Create draft review routes and navigation in the Provider Portal.
  - *Run gate*: `pnpm build` (verify no routing conflicts).
- [ ] **Step 3.2**: Implement `DraftEditor` and `DraftReviewPanel` components with "DRAFT ONLY" banners.
  - *Run gate*: Manual UI inspection.
- [ ] **Step 3.3**: Implement documentation type selector for 16 supported categories.
  - *Run gate*: Verify all types trigger correct draft templates.

## Phase 4: Safety and Evaluations
- [ ] **Step 4.1**: Implement AI refusal handlers for "sign" or "commit" requests.
  - *Run gate*: `pnpm eval:ai` (verify refusal rates).
- [ ] **Step 4.2**: Verify zero cross-patient leakage in data fetching layer.
  - *Run gate*: Unit tests for patient boundary enforcement.

## Phase 5: Final Review and Sealing
- [ ] **Step 5.1**: Conduct anti-creep code audit (search for `sign`, `finalize`, `commit`).
  - *STOP CONDITION*: If found, refactor to remove or stop slice.
- [ ] **Step 5.2**: Generate final evidence for `slice-04A-complete.md`.

---
**Verification Routine (Run after every step)**:
`pnpm lint && pnpm typecheck && pnpm build && pnpm test && pnpm eval:ai`
