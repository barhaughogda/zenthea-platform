# Next Phases Plan

This document defines the authoritative execution plan for continuing development of the Zenthea Platform after establishing the monorepo starter and core guardrails.

This plan assumes:
- The platform foundation is complete.
- The agent taxonomy is the source of truth for scope.
- We prioritize architectural correctness over feature speed.

This plan must be followed in order.

---

## Guiding Principles

- Scaffold before implementing.
- One reference implementation per pattern.
- No legacy code migration until the platform surface is complete.
- Compliance, auditability, and safety are first-class concerns.
- Frontends are consumers, not authorities.

---

## Phase A: Complete the Agent Surface (Scaffold Only)

### Objective
Ensure that every critical domain capability has a named, structured, and governed home in the system.

At the end of Phase A:
- All major agents exist as services.
- All agents follow the same structural and compliance patterns.
- No deep business logic is implemented yet.

---

### A1. Scaffold Agents by Build Waves

Use `docs/11-next-phases/agent-taxonomy.md` as the authoritative list.

#### Wave 1: Core clinical + patient access + consent
Scaffold the following services:

- medical-advisor-agent
- patient-portal-agent
- appointment-booking-agent
- clinical-documentation-agent
- consent-agent

Why this wave:
- Validates HIPAA-grade service patterns.
- Forces separation between provider and patient logic.
- Establishes consent and identity as foundational primitives.

Constraints:
- No real clinical logic yet.
- AI outputs must be draft-only.
- Tool usage is proposal-only.
- All PHI access paths must be documented.

---

#### Wave 2: Clinical depth and billing adjacency
Scaffold the following services:

- care-plan-agent
- medication-agent
- coding-agent
- triage-agent
- education-agent

Why this wave:
- Adds clinical completeness.
- Exercises structured outputs and approval workflows.
- Prepares for billing and compliance integration.

Constraints:
- Suggest-only outputs.
- No claim submission or medication changes.
- Explicit human-in-the-loop checkpoints.

---

#### Wave 3: Governance and operations
Scaffold the following services:

- ai-governor-agent
- audit-agent
- internal-admin-agent
- sales-agent
- marketing-agent
- project-agent

Why this wave:
- Differentiates the platform as enterprise-ready.
- Depends on observability and policy infrastructure being stable.

---

### A2. Service Scaffold Requirements (All Agents)

Each agent scaffold must include:

- Canonical service folder structure:
  - api/
  - orchestration/
  - domain/
  - ai/
  - data/
  - integrations/
  - config/
  - tests/
- README.md with:
  - Domain purpose
  - Primary users
  - API surface
  - AI behavior and limitations
  - Compliance notes (HIPAA/GDPR)
  - Backup and Recovery section
- Zod schemas for API and AI outputs (empty but valid)
- At least one AI evaluation placeholder
- No tool execution logic

Exit criteria:
- Service builds and type-checks
- CI passes
- No architectural guardrail violations

---

### A3. Generate Typed SDKs

For each new agent service:

- Create a corresponding SDK package under `/packages`
  - Example: `packages/medical-advisor-agent-sdk`
- SDKs must:
  - Contain transport logic only
  - Use Zod schemas as the contract
  - Expose no business or AI logic
- Frontends and other services must use SDKs exclusively

---

### A4. Update Client Composition App

In `apps/client-demo`:

- Add navigation entries for all scaffolded agents
- Keep routes disabled if no UI exists
- Do not build full UIs yet unless required for learning
- Ensure composition uses SDKs and transpiled UI packages only

---

## Phase B: Legacy Zenthea Repository Preparation (No Code Migration Yet)

### Objective
Understand the legacy system fully before importing any logic.

This phase is analysis-only.

---

### B1. Inventory the Legacy Repository

In the legacy repo:

- Fill out `docs/11-next-phases/migration-inventory-template.md`
- Identify:
  - Domains and responsibilities
  - Data models and persistence
  - APIs and workflows
  - Frontends and shared UI
  - Integrations and dependencies
  - Compliance assumptions

No code is moved in this step.

---

### B2. Map Legacy Modules to Platform Targets

Using `migration-mapping-template.md`:

- Assign each legacy module to:
  - A target agent service
  - A shared package
  - A frontend module
  - Or deprecation
- Identify refactors required to meet guardrails

Exit criteria:
- Mapping document completed
- Migration order agreed
- First domain selected

---

## Phase C: Migration by Extraction

### Objective
Migrate proven domain logic without importing architectural debt.

---

### Migration Rules

- Do not copy-paste directories.
- Re-implement inside the canonical service template.
- Port behavior and invariants, not structure.
- Add AI only after deterministic core is stable.
- Add evals before exposing new capabilities.

---

### Migration Loop (Per Domain)

1. Create clean service skeleton (if not already scaffolded)
2. Implement deterministic domain logic
3. Define data schemas and repository interfaces
4. Integrate observability and backup strategy
5. Add AI capabilities and prompts
6. Add AI evals and CI gates
7. Create or extend SDK
8. Integrate UI via SDK

Repeat one domain at a time.

---

## Phase D: Integration, Hardening, and Readiness

### Objective
Prepare the system for real users and production environments.

Activities:
- Wire tool approval and execution flows where required
- Implement billing plans and entitlements
- Harden CI/CD gates
- Validate audit trails and compliance posture
- Prepare provider and patient-facing UIs

Exit criteria:
- All critical flows auditable
- All PHI access paths documented
- No bypasses of AI runtime or tool gateway
- Platform ready for first real client

---

## Authoritative Reminder

Do not skip phases.
Do not rush migrations.
Do not implement speculative logic.

The platform wins by being correct, safe, and extensible first.