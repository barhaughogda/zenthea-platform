# MIG-03 — Execution Checklist (Runbook)

**Purpose:** Define the exact ordered steps required to execute MIG-03 safely once it is started.  
**Scope authority:** `docs/12-migration/mig-03-provider-portal.md` (binding) + `docs/12-migration/mig-03-company-decomposition.md` (boundary authority).

---

## Operating constraints (non-negotiable)

- **No parallel migrations**: While MIG-03 is **In Progress**, **no other MIG-\*** slice may be started, advanced, or executed in parallel. Only maintenance fixes unrelated to migrations are allowed.
- **No UI refactors during migration**: During MIG-03, do **not** redesign, re-architect, rename, reorganize, or “clean up” UI beyond the minimum required to compile, route, and render the legacy surfaces in the new shell.
- **No business logic in the frontend**: Frontend code MUST NOT implement domain rules, scheduling/billing/messaging execution, or irreversible behavior. Frontend is presentation + routing + state for UX only.
- **Stop-on-breach**: If any change risks violating MIG-03 scope, non-goals, stop conditions, or integration order, **halt immediately** and do not continue until resolved.

---

## Mandatory validation commands (must pass)

These are the authoritative gates for this monorepo (Turbo via pnpm). They MUST pass at the specified checkpoints in every phase:

```bash
pnpm -w lint
pnpm -w typecheck
pnpm -w build
```

**Rule:** If any of the above fails, the phase is not allowed to exit.

---

## Phase 1: App scaffolding

### Entry criteria

- MIG-03 is explicitly started (status set to **In Progress** in `docs/ROADMAP.md`).
- `mig-03-provider-portal.md` and `mig-03-company-decomposition.md` have been re-read in full by the executor.
- A single execution branch exists for MIG-03 (no parallel migration branches).

### Execution steps (ordered)

- **Create provider portal app shell** under `apps/` with:
  - **Routing**: top-level app routing and placeholder routes for the provider surfaces that will be migrated.
  - **Navigation**: minimal navigation structure (no redesign).
  - **Auth/session context**: wiring only (no business decisions in UI).
- **Create `company-settings` route placeholder**:
  - `company-settings` stays inside `provider-portal` for MIG-03 (per decomposition doc).
  - If the legacy surface is not yet available, render a deterministic placeholder page stating “Company Settings (MIG-03 scaffold)”.
- **Add baseline health page**:
  - `GET /health` (or equivalent route) renders a deterministic page confirming shell boot + routing.
- **Set strict boundaries**:
  - No direct imports from future domain apps (`messaging`, `appointments`, `billing/accounting`, `reports/analytics`).
  - No irreversible actions, background jobs, or autonomous behavior.

### Commands that must pass

```bash
pnpm -w lint
pnpm -w typecheck
pnpm -w build
```

### Exit criteria

- Provider Portal app exists, boots, and renders a minimal shell route deterministically.
- No domain workflows are implemented; only shell scaffolding exists.
- All mandatory validation commands pass.

---

## Phase 2: Raw UI migration

### Entry criteria

- Phase 1 exit criteria met.
- A written inventory exists (in PR description or tracking notes) of the legacy provider-facing surfaces to be migrated, with explicit exclusions for non-goals.

### Execution steps (ordered)

- **Migrate provider-facing surfaces “as-is”** into the Provider Portal:
  - Port routes/screens with the smallest necessary changes to compile and render.
  - Preserve UX shape and behavior; no refactors, redesigns, or component rewrites.
- **Implement `company-settings` inside the portal**:
  - Migrate the legacy provider-facing settings surfaces into the portal OR keep a clearly-labeled placeholder if migration is not yet possible.
- **Enforce MIG-03 constraints** on migrated surfaces:
  - Any operation that is not **read-only** or **draft-first** MUST be stubbed/disabled with explicit UI messaging (“Not available in MIG-03”).
  - Ensure drafts are clearly marked as drafts; drafts MUST NOT trigger side effects.
- **Harden routing boundaries**:
  - Anything that belongs to deferred apps (`messaging`, `appointments` beyond read-only, `billing/accounting`, `reports/analytics`) must be removed from navigation or replaced with inert placeholders.

### Commands that must pass

```bash
pnpm -w lint
pnpm -w typecheck
pnpm -w build
```

### Exit criteria

- All in-scope provider-facing legacy UI surfaces render in the Provider Portal.
- `company-settings` exists in the Provider Portal (migrated or explicitly-labeled placeholder).
- All out-of-scope workflows are visibly blocked (no hidden partial implementations).
- No irreversible actions exist anywhere in the Provider Portal.
- All mandatory validation commands pass.

---

## Phase 3: Stabilization & mock isolation

### Entry criteria

- Phase 2 exit criteria met.
- All migrated surfaces compile and render without relying on unstable, implicit, or environment-specific behaviors.

### Execution steps (ordered)

- **Isolate external dependencies behind mocks/adapters**:
  - Any calls to services not yet approved for integration in MIG-03 MUST be replaced with deterministic mocks.
  - Mocks MUST be explicit (no “temporary” side-effecting fallbacks).
- **Make failure modes explicit**:
  - Loading/error/empty states must be deterministic and non-leaky (no raw stack traces in UI).
  - Any permission uncertainty must block the flow (do not guess).
- **Stabilize navigation and basic UX**:
  - Fix only breakage, not design. No refactors; only stabilization for correctness and clarity.

### Commands that must pass

```bash
pnpm -w lint
pnpm -w typecheck
pnpm -w build
```

### Exit criteria

- Provider Portal runs with deterministic mocked data wherever real integrations are not yet permitted.
- No UI path depends on unapproved services or introduces side effects.
- All mandatory validation commands pass.

---

## Phase 4: Controlled service integration

### Entry criteria

- Phase 3 exit criteria met.
- A written integration plan exists listing **only** the allowed services and the mandatory order below, with explicit statement of read-only/draft-only limits.

### Integration order (mandatory; skipping ahead is prohibited)

1. **`consent-agent`** (first)
2. **`clinical-documentation-agent`** (**drafts only**) (second)
3. **`appointment-booking-agent`** (**read-only**) (third)
4. **`medical-advisor-agent`** (**advisory only**) (last)

### Execution steps (ordered)

For each service, one at a time, in order:

- **Replace mocks with the real integration** behind explicit gating:
  - Only the behaviors allowed by MIG-03 are enabled (read-only or draft-only as applicable).
  - Any mutation/side effect paths remain blocked.
- **Least privilege enforcement**:
  - Ensure access is scoped to the minimum needed for the allowed behavior.
- **Negative-path validation**:
  - Confirm that forbidden actions are impossible (not merely hidden).

### Commands that must pass (after each service integration)

```bash
pnpm -w lint
pnpm -w typecheck
pnpm -w build
```

### Exit criteria

- Approved services are integrated in the required order, with constraints enforced:
  - Consent is integrated and gates visibility/eligibility.
  - Clinical documentation is draft-only (no finalization, no write-back).
  - Appointments are read-only (no booking/reschedule/cancel/reminders).
  - Medical advisor is advisory-only (no autonomous actions, no execution).
- All mandatory validation commands pass after the final integration step.

---

## Phase 5: Verification & sealing

### Entry criteria

- Phase 4 exit criteria met **or** Phase 4 is explicitly skipped because no integrations are being performed in MIG-03 (must be stated explicitly in the closure PR).

### Execution steps (ordered)

- **Scope verification**:
  - Re-check MIG-03 scope/non-goals/stop conditions.
  - Confirm no deferred apps were partially implemented.
- **Safety verification**:
  - Confirm no irreversible operations exist.
  - Confirm draft-first flows have no downstream side effects.
  - Confirm no autonomous/agentic behavior was introduced.
- **Documentation sealing**:
  - Update MIG-03 docs with any required evidence links (PRs, paths, notes).
  - Update `docs/ROADMAP.md` to mark MIG-03 as **Completed** only after exit criteria are met.

### Commands that must pass

```bash
pnpm -w lint
pnpm -w typecheck
pnpm -w build
```

### Exit criteria

- Evidence exists that MIG-03 constraints were respected (no scope creep, no side effects, no autonomy).
- All mandatory validation commands pass.
- MIG-03 is marked **Completed** in `docs/ROADMAP.md`.

---

## Definition: “MIG-03 Complete”

MIG-03 is **Complete** only when all statements below are true:

- **Provider Portal exists as the clinician-facing shell** with navigation and session context wiring, and it boots deterministically.
- **In-scope legacy provider-facing UI surfaces are migrated** into the Provider Portal with a raw/as-is posture (no refactors/re-architecture).
- **All workflows are constrained to read-only or draft-first**; drafts are explicitly labeled, and drafts do not trigger downstream side effects.
- **No non-goals are implemented**, including (but not limited to) messaging delivery, appointment execution, billing logic, EHR write-back, reporting pipelines, or any autonomous agent behavior.
- **Service integrations (if any) follow the mandated order** and enforce their limits:
  - `consent-agent` first
  - `clinical-documentation-agent` drafts-only
  - `appointment-booking-agent` read-only
  - `medical-advisor-agent` advisory-only, last
- **Monorepo validation gates pass**:
  - `pnpm -w lint`
  - `pnpm -w typecheck`
  - `pnpm -w build`
- **Documentation is sealed**: MIG-03 status is set to **Completed** in `docs/ROADMAP.md` and the MIG-03 docs remain consistent with the decomposition document.

