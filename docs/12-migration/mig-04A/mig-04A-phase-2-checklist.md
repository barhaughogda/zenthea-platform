# MIG-04A Phase 2 Checklist: Pre-flight for Phase 3 Implementation

This checklist defines **preconditions** and **hard “do not start” gates** for Phase 3.

Scope rules:
- Phase 3 must implement only what is allowed by:
  - `docs/12-migration/mig-04A/mig-04A-spec.md`
  - `docs/12-migration/mig-04A/mig-04A-acceptance-criteria.md`
- Phase 3 must not introduce MIG-04B semantics (sign/commit/finalize/lock/write-back).

---

## 1. Required Documents (must exist and be reviewed)

- [ ] `docs/12-migration/mig-04A/clinical-documentation-domain.md` (Phase 0)
- [ ] `docs/12-migration/mig-04A/mig-04A-phase-0-summary.md` (Phase 0)
- [ ] `docs/12-migration/mig-04A/mig-04A-spec.md` (Phase 1; authoritative contract)
- [ ] `docs/12-migration/mig-04A/mig-04A-acceptance-criteria.md` (Phase 1; pass/fail)
- [ ] `docs/12-migration/mig-04A/mig-04A-implementation-plan.md` (Phase 2; module + workflow plan)
- [ ] `docs/12-migration/mig-04-acceptance-guardrails.md` (anti-creep guardrails)

**Do not start Phase 3 unless** a reviewer can trace every Phase 3 work item to a line item in the spec/acceptance criteria.

---

## 2. Guardrails (must be treated as hard constraints)

- [ ] Draft-only doctrine is explicitly understood by the implementer:
  - no sign/finalize/attest/lock/commit
  - no external EHR write-back
  - no “final state” flags in schemas
- [ ] Consent is a hard gate for AI-assisted drafting involving PHI (`consent-agent` required).
- [ ] Append-only versioning is mandatory; no silent overwrites; no deletion of history.
- [ ] Audit emission boundaries are agreed (`CREATE_DRAFT`, `UPDATE_DRAFT`, `VIEW_DRAFT`, `DISCARD_DRAFT`).
- [ ] AI safety contract is non-negotiable (labeling, refusal, evidence expectations, provenance).

**Do not start Phase 3 unless** the team agrees that any scope crossing the “Definition of Commit” is automatically MIG-04B.

---

## 3. Service Boundary Pre-Checks (no UI integration; no persistence implementations)

- [ ] Phase 3 work is limited to `services/clinical-documentation-agent` (no UI app integration work in this slice).
- [ ] `data/` work is limited to repository interfaces (no concrete DB/persistence implementation unless separately approved).
- [ ] `integrations/` work is limited to read-only context interfaces (no write-back).

**Do not start Phase 3 unless** the implementation plan’s “Forbidden” rules per layer are accepted.

---

## 4. CI + Eval Gates (must be defined before coding)

- [ ] CI commands are defined as hard gates (must pass for slice):
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`
  - `pnpm test`
  - `pnpm eval:ai`
- [ ] Evals planned to cover at minimum:
  - refusal for commit/sign/lock/write-back
  - hallucination (fabricated patient facts)
  - cross-patient/tenant leakage
  - labeling + provenance requirements
  - evidence/citation behavior

**Do not start Phase 3 unless** the team agrees that failing any eval is a release blocker for MIG-04A.

---

## 5. Explicit “Do Not Start Phase 3 Unless…” Conditions

Phase 3 must not begin if:
- [ ] Any requirement suggests finalization, signing, locking, committing, or write-back.
- [ ] There is ambiguity about whether an action modifies a system of record.
- [ ] The team cannot specify where consent is checked in every AI-assisted workflow.
- [ ] The team cannot specify where audit events are emitted in every workflow.
- [ ] The plan includes any background automation that advances document state without explicit clinician initiation.
- [ ] The plan cannot guarantee metadata-only audit logs by default.

