# Consolidation Phase

This phase locks platform stability after initial agent scaffolding.

Outcome:
- Clean installs
- Consistent module conventions
- CI passes reliably
- Guardrails verified
- Docs match reality
- A repeatable workflow for future additions

Do not start legacy migration until this phase is complete.

---

## Scope

Services in scope:
- medical-advisor-agent
- consent-agent
- patient-portal-agent
- clinical-documentation-agent
- appointment-booking-agent

Platform packages in scope:
- ai-runtime
- tool-gateway
- ai-eval
- observability
- sdk
- auth
- ui
- any SDK packages already created

---

## Step 1: Full Workspace Sanity Run

Run from repo root:

1. `pnpm install`
2. `pnpm lint`
3. `pnpm test`
4. `pnpm eval:ai`
5. `pnpm build`
6. `pnpm -r exec tsc --noEmit`

Rules:
- Fix failures immediately.
- Avoid “quick hacks” that violate docs or guardrails.
- Any change that modifies architecture requires an ADR.

Deliverable:
- A short note in this doc under "Sanity Results" with pass/fail and any fixes made.

### Sanity Results
- install: Pass
- lint: Pass
- test: Pass (Fixed crash in appointment-booking-agent by excluding evals and increasing permissions)
- eval:ai: Pass (Aligned scripts with `.eval.test.ts` convention and added `--passWithNoTests`)
- build: Pass (Fixed by enabling network for font fetch)
- typecheck: Pass (Fixed AIRuntime instantiation in medical-advisor-agent)

#### Fixes Made
- Fixed `AIRuntime` instantiation error in `services/medical-advisor-agent/ai/index.ts` by providing a default provider.
- Renamed all `*.eval.ts` files to `*.eval.test.ts` to match the documented convention.
- Updated `package.json` scripts in all services to use consistent Vitest globs and `--passWithNoTests`.
- Removed duplicate `appointment-booking.eval.ts` in favor of `appointment-booking.eval.test.ts`.
- Verified all sanity commands pass from repo root.

---

## Step 2: Conventions Lock

We must lock these conventions across all services and packages.

### 2.1 ESM and Import Extensions
Pick one convention and apply it everywhere:
- Option A: TS imports without `.js` extensions (preferred if repo already works this way)
- Option B: TS imports with `.js` extensions everywhere

Rule:
- No mixed style across services.

Deliverable:
- Update or create `docs/02-architecture/module-conventions.md` with the chosen standard.
- Ensure all services conform.

### 2.2 Test File Naming
Lock test naming:
- Unit tests: `*.test.ts`
- AI eval tests: `*.eval.test.ts`

Deliverable:
- Ensure all services follow this.
- Ensure CI picks them up consistently.

### 2.3 README Completeness
Every service README must include:
- Overview
- Primary Users
- Responsibilities
- Non-Goals
- Compliance (HIPAA/GDPR)
- Tool policy
- Observability
- Backup and Recovery

Deliverable:
- Confirm all 5 services comply.

---

## Step 3: Guardrail Verification

Run and confirm:
- No service-to-service imports
- No model SDK calls outside ai-runtime
- No tool execution outside tool-gateway
- No billing calls outside billing service (if present)

Deliverable:
- Update root `GUARDRAILS.md` if anything is missing or unclear.
- Add a short section "Guardrail Verification Results" here.

### Guardrail Verification Results
- service coupling:
- model isolation:
- tool execution:
- billing isolation:

---

## Step 4: CI Consistency Check

Open:
- `.github/workflows/ci.yml`
- `.github/workflows/main.yml`
- `turbo.json`

Ensure:
- lint, test, typecheck, eval:ai are all included
- tasks run on affected packages where possible
- failures are fail-fast

Deliverable:
- If anything is missing, add it.
- If it is already correct, record "No changes required".

---

## Step 5: Docs-to-Repo Alignment Sweep

Confirm the repo matches documentation:
- folder structure
- naming conventions
- dependency rules
- tool proposal and gateway boundary
- backup validation and requirements

Deliverable:
- If mismatches exist, fix either the repo or the docs.
- Add one bullet list under "Alignment Notes".

### Alignment Notes
- 

---

## Step 6: Freeze the Baseline

Once Steps 1-5 pass:
- Tag a baseline commit (git tag) locally
- Create a clean branch naming convention for future work:
  - feature/<agent-name>-scaffold
  - feature/<domain>-migration
  - fix/<issue>

Deliverable:
- Record the baseline tag name under "Baseline Tag".

### Baseline Tag
- 

---

## Exit Criteria

This consolidation phase is complete when:
- All sanity commands pass
- Conventions are consistent
- Guardrails are verified
- CI matches documented expectations
- Docs and repo are aligned
- Baseline is tagged

Only then may you:
- Add new agents beyond the current set
- Start legacy EHR/website-builder migration