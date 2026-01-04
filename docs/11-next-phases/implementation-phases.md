# Implementation Phases

This document defines the **authoritative execution discipline** for building, migrating, and hardening the Zenthea Platform after the agent surface and migration plans are complete.

This is where planning turns into controlled execution.

---

## Guiding Principles

- One phase at a time.
- One domain at a time.
- Deterministic core before AI.
- Safety before automation.
- Migration by extraction, not copy-paste.

Violating these principles introduces long-term instability.

---

## Phase A: Agent Surface Completion (Scaffold Only)

### Objective
Ensure every critical capability defined in the agent taxonomy has a governed, documented home.

### Inputs
- `agent-taxonomy.md`
- `next-phases-plan.md`
- `agent-scaffolding-checklist.md`

### Execution Steps
For each agent in the current wave:

1. Scaffold service using the canonical template
2. Add README with all mandatory sections
3. Add API placeholders with Zod validation
4. Add AI layer wired to the governed runtime
5. Add tool proposal placeholders (no execution)
6. Add AI eval skeleton
7. Generate typed SDK
8. Optionally add disabled route in client-demo

### Exit Criteria
- All agents in the wave exist
- CI passes
- No guardrail violations
- No real business logic implemented

Do not proceed until all agents in the wave are scaffolded.

---

## Phase B: Legacy System Analysis (Read-Only)

### Objective
Understand the legacy system completely before moving any logic.

### Inputs
- `migration-inventory-template.md`

### Execution Steps
1. Complete full inventory in the legacy repo
2. Document domains, data models, workflows, and risks
3. Explicitly identify HIPAA and GDPR assumptions
4. Mark unknowns and high-risk areas

### Exit Criteria
- Inventory completed and reviewed
- No “unknown” domains remain
- Migration feasibility understood

No code migration is allowed in this phase.

---

## Phase C: Legacy-to-Platform Mapping

### Objective
Define how legacy functionality maps to platform agents and packages.

### Inputs
- Completed inventory
- `migration-mapping-template.md`

### Execution Steps
1. Map each legacy domain to a single authoritative agent
2. Identify required refactors and redesigns
3. Decide migration order
4. Identify compliance and audit requirements per domain

### Exit Criteria
- Mapping document complete
- Migration order agreed
- First migration domain selected

Do not start migration without this.

---

## Phase D: Domain Migration (One Domain at a Time)

### Objective
Port proven behavior into the new platform without importing architectural debt.

### Migration Loop (Per Domain)

1. Create or finalize service scaffold
2. Implement deterministic domain logic
3. Define and validate data schemas
4. Integrate observability and backup strategy
5. Add AI capability last
6. Add AI evals and CI gates
7. Generate or extend SDK
8. Integrate UI via SDK

Rules:
- No copy-paste of entire directories
- Use legacy code as reference only
- Rewrite to fit platform guardrails

### Exit Criteria (Per Domain)
- Service passes lint, build, test, eval
- SDK stable
- UI integration functional
- Audit and compliance reviewed

Only then move to the next domain.

---

## Phase E: Tool Execution and Automation

### Objective
Introduce safe, auditable side effects where required.

### Execution Steps
1. Identify workflows requiring execution
2. Define approval requirements
3. Route execution through Tool Execution Gateway
4. Add audit logging and idempotency
5. Add failure handling and rollback logic

Rules:
- AI never executes tools directly
- All executions must be auditable
- Financial and clinical actions require explicit approval

---

## Phase F: Billing, Entitlements, and Monetization

### Objective
Enable revenue while preserving architectural integrity.

### Execution Steps
1. Define plans and entitlements in billing service
2. Connect usage signals from agents
3. Gate features via backend checks
4. Surface capabilities to frontends

Rules:
- No plan logic in frontends
- No AI-driven billing actions
- Billing is authoritative for entitlements

---

## Phase G: Hardening and Production Readiness

### Objective
Prepare the system for real users and regulatory scrutiny.

### Activities
- End-to-end audits
- Penetration testing
- Backup and restore drills
- AI eval coverage expansion
- Performance and cost monitoring
- Compliance documentation review

### Exit Criteria
- All PHI access paths audited
- All AI behavior evaluated
- No bypasses of core guardrails
- System ready for first production client

---

## Authoritative Stop Conditions

Stop and reassess if:
- Guardrails are bypassed “temporarily”
- AI logic is added before deterministic core
- Multiple domains are migrated in parallel
- Frontends begin accumulating business logic

These are early warning signs of architectural decay.

---

## Final Reminder

This platform is built for:
- Longevity
- Trust
- Clinical safety
- AI-human collaboration

Speed comes from discipline, not shortcuts.