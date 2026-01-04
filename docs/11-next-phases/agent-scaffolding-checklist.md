# Agent Scaffolding Checklist

This checklist defines the **mandatory steps and constraints** for scaffolding any agent service in the Zenthea Platform.

It exists to ensure:
- Consistency across all agents
- Compliance-by-design
- AI safety and auditability
- Zero architectural drift

Use this checklist **every time** a new agent is scaffolded.

---

## Preconditions

Before scaffolding an agent:

- [ ] The agent is listed in `docs/11-next-phases/agent-taxonomy.md`
- [ ] The agent belongs to a defined build wave
- [ ] The agent’s primary users and data sensitivity are understood
- [ ] No business logic is being migrated yet

If the agent is not in the taxonomy, stop and add it there first.

---

## Step 1: Service Creation

Create a new service under `/services/<agent-name>`.

Mandatory files:
- `package.json`
- `tsconfig.json`
- `README.md`

Constraints:
- Service name must be kebab-case
- Package scope must use the platform scope
- No references to legacy systems

---

## Step 2: Canonical Folder Structure

Every agent service must include the following directories:

/api
/orchestration
/domain
/ai
/data
/integrations
/config
/tests

Rules:
- Do not rename these folders
- Do not collapse layers
- Each folder must contain an `index.ts` (or equivalent entry file)

---

## Step 3: API Layer (`/api`)

Purpose:
- Define the public contract of the service

Requirements:
- [ ] Zod schemas for all requests and responses
- [ ] No business logic
- [ ] No orchestration logic
- [ ] Clear separation between input validation and handler wiring

---

## Step 4: Orchestration Layer (`/orchestration`)

Purpose:
- Coordinate workflows and enforce policy

Requirements:
- [ ] Tenant and identity checks
- [ ] Policy and consent checkpoints
- [ ] AI invocation coordination
- [ ] Tool proposal validation
- [ ] No side effects
- [ ] No direct tool execution

---

## Step 5: Domain Layer (`/domain`)

Purpose:
- Deterministic business rules and invariants

Requirements:
- [ ] Pure logic only
- [ ] No AI calls
- [ ] No network calls
- [ ] Explicit domain invariants
- [ ] Structured domain entities

This layer should be testable without mocks.

---

## Step 6: AI Layer (`/ai`)

Purpose:
- Governed AI interaction

Requirements:
- [ ] Uses shared AI runtime only
- [ ] Layered prompts (system, policy, domain, task, memory, input)
- [ ] Structured output schemas (Zod)
- [ ] Draft-only outputs for clinical decisions
- [ ] Tool proposals only (no execution)

Prohibited:
- Direct model SDK usage
- Free-form, unvalidated output

---

## Step 7: Data Layer (`/data`)

Purpose:
- Persistence abstraction

Requirements:
- [ ] Repository interfaces only
- [ ] No concrete database implementation unless explicitly required
- [ ] Typed schemas for stored entities
- [ ] Clear separation between PHI and non-PHI data

---

## Step 8: Integrations Layer (`/integrations`)

Purpose:
- External system boundaries

Requirements:
- [ ] Adapter interfaces
- [ ] No business logic
- [ ] No AI calls
- [ ] No direct execution from AI outputs

Examples:
- Calendar APIs
- EHR backends
- External medical evidence systems

---

## Step 9: Configuration Layer (`/config`)

Purpose:
- Typed service configuration

Requirements:
- [ ] Zod schema for config
- [ ] Environment-variable driven
- [ ] No secrets committed
- [ ] Feature flags allowed

---

## Step 10: Tests (`/tests`)

Minimum requirements:
- [ ] Unit test placeholder
- [ ] AI evaluation placeholder
- [ ] At least one golden test stub

Notes:
- AI evals must be wired into CI
- Safety and compliance failures must hard-fail CI

---

## Step 11: README.md Requirements

Every agent README must include the following sections:

- Overview
- Primary Users
- Responsibilities
- Non-Goals
- API Surface
- AI Capabilities and Limits
- Compliance Notes (HIPAA/GDPR)
- Tool Usage Policy
- Events (if applicable)
- Backup and Recovery

If any section is missing, CI may warn or fail.

---

## Step 12: SDK Generation

After scaffolding the service:

- [ ] Create a typed SDK in `/packages/<agent-name>-sdk`
- [ ] Export API contracts and client
- [ ] Validate all data crossing boundaries
- [ ] No business logic
- [ ] No AI logic

All consumers must use the SDK.

---

## Step 13: Client Composition

Optional at scaffold time:
- [ ] Add placeholder route in `apps/client-demo`
- [ ] Disable UI if not implemented
- [ ] Ensure SDK-only consumption

---

## Final Verification Checklist

Before marking the agent scaffold complete:

- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
- [ ] `pnpm eval:ai` passes (even if minimal)
- [ ] No guardrail violations
- [ ] Agent appears in taxonomy and next-phases plan

---

## Authoritative Reminder

Scaffolding is about **shape**, not behavior.

If you feel tempted to “just implement a little logic”, stop.
The platform remains healthy because discipline is enforced here.