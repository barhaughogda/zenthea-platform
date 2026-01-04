# Service Build Guide

## Purpose

This document provides a step-by-step guide for building a new backend service in this monorepo.

It explains:
- When a new service is justified
- How to scaffold a service correctly
- How to implement domain logic safely
- How to integrate AI using the shared runtime
- How to test, document, and ship the service

This document answers the question:  
**“How do I build a new service here without breaking the system?”**

---

## When to Create a New Service

Create a new service only when **all** of the following are true:

- The domain is clearly distinct
- The data ownership boundary is clear
- The service can be deployed independently
- The service provides reusable value

Do **not** create a new service for:
- Minor variations
- Client-specific logic (use configuration or overrides)
- Shared utilities (use packages)

If unsure, do not create a service yet.

---

## Step 1: Name the Service Correctly

Service names must:
- Be kebab-case
- Describe a domain, not an action
- End with `-agent` if AI-driven

Examples:
- `chat-agent`
- `sales-agent`
- `accounting-agent`

Create the folder:

/services/

---

## Step 2: Create the Canonical Folder Structure

Every service **must** start with this structure:

/services/
/api
/orchestration
/domain
/ai
/data
/integrations
/config
/tests
README.md

Do not add or remove folders without justification.

---

## Step 3: Write the Service README First

Before writing code, create `README.md`.

It must include:
- Domain purpose
- What the service owns
- What it explicitly does not own
- Public API overview
- AI capabilities (if any)
- Events emitted
- Compliance considerations
- **Backup and Recovery**: Must define backup scope, frequency, and restore procedures.

If you cannot write this clearly, the service design is not ready.

### Backup and Recovery Requirements

Each service README must include a `## Backup and Recovery` section with:
- **Backup Scope**: List of data categories backed up (Operational, Config, etc.).
- **Backup Frequency**: Baseline frequency (e.g., Daily for Production).
- **Restore Procedure**: Documentation or link to scripts for domain recovery.

**CI Enforcement**:
Missing backup and recovery documentation will trigger a CI warning via `validate:backups`.

---

## Step 4: Define the Domain Model

Start in `/domain`.

Actions:
- Define domain entities and value objects
- Encode invariants and validation rules
- Define allowed state transitions

Rules:
- Domain logic must be deterministic
- No AI calls
- No database access
- No external dependencies

Write unit tests for domain logic immediately.

---

## Step 5: Define Persistence Boundaries

Move to `/data`.

Actions:
- Define data schemas
- Define repository interfaces
- Define migrations (if applicable)

Rules:
- The service owns its data exclusively
- No cross-service data access
- Encryption and retention rules are explicit

Each service must define:
- Its backup scope
- Backup frequency
- Restore procedure

Services without documented backup and restore procedures are considered incomplete.

Do not leak persistence details into domain logic.

---

## Step 6: Design the Public API

Move to `/api`.

Actions:
- Define endpoints and request/response schemas
- Enforce strict input validation
- Extract tenant and auth context
- Define versioning strategy

Rules:
- No business logic
- No AI logic
- No orchestration decisions

APIs are contracts. Treat them as such.

---

## Step 7: Implement Orchestration Logic

Move to `/orchestration`.

Actions:
- Coordinate domain logic
- Invoke AI runtime where applicable
- Call repositories and integrations
- Emit domain and AI events
- Enforce policy checkpoints

Rules:
- This is where workflows live
- All side effects are coordinated here
- No domain rules defined here

If logic spans multiple layers, it belongs here.

---

## Step 8: Integrate AI (If Applicable)

Move to `/ai`.

Actions:
- Define domain-specific prompt layers
- Declare tools available to AI
- Call the shared AI runtime
- Parse and validate AI outputs

Rules:
- Never call models directly
- AI outputs are proposals, not authority
- All outputs must be schema-validated
- No persistence in this layer

AI must never bypass orchestration or policy.

---

## Step 9: Add Integrations

Move to `/integrations`.

Actions:
- Wrap vendor APIs
- Handle retries and failures
- Enforce vendor eligibility
- Expose clean adapters

Rules:
- No vendor SDKs outside this layer
- Integrations must be replaceable
- Integrations must be policy-aware

External systems are liabilities. Isolate them.

---

## Step 10: Add Configuration

Move to `/config`.

Actions:
- Define typed configuration schema
- Add defaults
- Define feature flags
- Define AI config overrides

Rules:
- No secrets
- No environment detection logic
- Invalid config must fail fast

Configuration must be auditable.

---

## Step 11: Emit Events

Define events for:
- Domain state changes
- AI decision completions
- Tool invocation outcomes
- Policy-relevant actions

Rules:
- Events are immutable
- Schemas are versioned
- Emission happens in orchestration

Events enable composition. Do not skip them.

---

## Step 12: Write Tests

Move to `/tests`.

Required tests:
- Domain unit tests
- Orchestration integration tests
- AI evaluation tests (if AI is used)
- API contract tests

Rules:
- Tests must be deterministic
- AI tests use golden inputs
- Flaky tests are defects

If it is not tested, it is not done.

---

## Step 13: Add Observability

Add:
- Structured logs
- Metrics
- Traces
- Audit events where required

Rules:
- All major actions must be observable
- AI behavior must be traceable
- Correlation IDs must propagate

If you cannot debug it, you cannot ship it.

---

## Step 14: Run CI and Fix Everything

Before merge:
- All tests must pass
- Lint and typecheck must pass
- AI evals must pass
- Docs must be updated

No exceptions.

---

## Step 15: Register Decisions (If Needed)

If you:
- Deviated from the template
- Introduced a new pattern
- Made a tradeoff

You must add an ADR in `/docs/10-decisions`.

Undocumented decisions are technical debt.

---

## Common Failure Modes

Avoid these mistakes:
- Putting logic in `/api`
- Letting AI mutate state directly
- Skipping domain modeling
- Copy-pasting another service
- “We’ll add tests later”

These create long-term damage.

---

## Summary

To build a correct service:

- Start with the domain
- Respect the service template
- Integrate AI through the runtime
- Make everything observable
- Test everything
- Document decisions

Follow this guide and your services will scale cleanly.