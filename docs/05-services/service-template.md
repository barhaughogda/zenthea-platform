# Service Template

## Purpose

This document defines the mandatory template for all backend services in the platform.

It specifies:
- What a service is responsible for
- How a service is structured
- How AI is embedded into the service
- How data, tools, events, and policy are handled
- How services are built, tested, and evolved

This document answers the question: **“What does a correct service look like in this system?”**

All backend services must conform to this template unless an explicit exception is documented.

---

## Definition of a Service

In this platform, a service is:

- A domain-specific AI agent
- Independently deployable
- API-first and frontend-agnostic
- Owner of its domain data and logic
- Governed by policy, observability, and compliance

A service is not:
- A thin CRUD wrapper
- A shared utility
- A UI backend
- A collection of unrelated features

Each service represents a clear unit of value.

---

## Mandatory Service Responsibilities

Every service must:

- Own exactly one domain
- Expose a stable, documented API
- Embed AI capabilities using the shared AI runtime
- Enforce policy and security at boundaries
- Emit events for significant domain changes
- Be observable, testable, and auditable
- Support multi-tenancy explicitly

If a responsibility does not clearly belong to the service, it likely belongs elsewhere.

---

## Canonical Service Folder Structure

Every service must follow this exact structure:

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

No folders may be added or removed without justification.

---

## Layer Responsibilities

### `/api` — Transport Layer

Responsibilities:
- HTTP or RPC endpoints
- Request validation
- Authentication context extraction
- Response shaping and streaming

Rules:
- No business logic
- No AI logic
- No database access

---

### `/orchestration` — Use Case Coordination

Responsibilities:
- Define service workflows
- Coordinate domain logic, AI runtime, tools, data, and events
- Enforce policy checkpoints
- Manage transactions and idempotency

Rules:
- This is where service behavior lives
- All side effects are coordinated here

---

### `/domain` — Domain Logic

Responsibilities:
- Domain models
- Invariants and validation
- Deterministic business rules
- State transitions

Rules:
- No AI calls
- No external integrations
- No transport concerns

Domain logic must be testable without AI.

---

### `/ai` — AI Integration

Responsibilities:
- Define domain-specific prompt layers
- Declare available tools
- Invoke the shared AI runtime
- Parse and validate AI outputs

Rules:
- No direct model calls
- No state mutation
- No orchestration logic

AI proposes. It does not decide.

---

### `/data` — Persistence Layer

Responsibilities:
- Data schemas and migrations
- Repository interfaces
- Encryption and redaction at storage boundaries

Rules:
- No business logic
- No AI logic
- No cross-service access

The service owns its data completely.

---

### `/integrations` — External Systems

Responsibilities:
- Vendor adapters
- External API clients
- Webhook handlers

Rules:
- All vendor-specific logic lives here
- Must be abstracted and replaceable
- Must be policy-aware

---

### `/config` — Configuration

Responsibilities:
- Service-level configuration
- Feature flags
- AI configuration defaults

Rules:
- No secrets
- Environment-specific overrides only

---

### `/tests` — Verification

Responsibilities:
- Unit tests
- Integration tests
- AI evaluation tests
- Regression tests

Rules:
- Tests must be deterministic
- AI tests must use controlled inputs

---

## Service README.md Requirements

Each service must include a `README.md` that documents:

- Domain purpose
- API surface
- AI capabilities
- Events emitted
- Data owned
- Compliance considerations
- Known limitations

The README is part of the service contract.

---

## API Design Requirements

Service APIs must:
- Be explicit and versioned
- Be tenant-aware
- Validate all inputs
- Return structured outputs
- Support idempotency where applicable

APIs must not expose internal implementation details.

---

## AI Integration Requirements

Each service must:
- Use the shared AI runtime
- Define domain-specific prompt layers
- Declare tools explicitly
- Enforce policy before and after AI execution
- Validate AI outputs before use

AI behavior must be observable and testable.

---

## Event Emission Requirements

Services must emit events for:
- Significant domain state changes
- AI decision completion
- Tool invocation outcomes
- Policy-relevant actions

Events must follow the eventing model and schema rules.

---

## Multi-Tenancy Requirements

Services must:
- Explicitly scope all data by tenant
- Enforce tenant context at boundaries
- Prevent cross-tenant access by default

Multi-tenancy is mandatory, not optional.

---

## Observability Requirements

Each service must expose:
- Structured logs
- Metrics
- Traces
- Audit events

AI-specific telemetry is required.

Lack of observability is considered a defect.

---

## Security and Compliance Requirements

Each service must:
- Enforce authentication and authorization
- Apply least privilege
- Support HIPAA mode where applicable
- Respect vendor eligibility constraints
- Log security-relevant actions

Compliance constraints override convenience.

---

## Testing and Evaluation Requirements

Each service must include:
- Domain unit tests
- API integration tests
- AI prompt tests
- Regression tests for AI behavior

Untested AI behavior is not allowed.

---

## Service Evolution Rules

When evolving a service:
- Preserve API contracts
- Version breaking changes
- Update documentation
- Run full evaluation suite

Backward compatibility is preferred.

---

## What This Template Explicitly Forbids

The following are not allowed:
- Shared databases across services
- AI logic in APIs or UIs
- Direct model calls
- Hidden side effects
- Undocumented service behavior

Violations must be corrected.

---

## Summary

This service template defines the contract for backend services.

A correct service is:
- Domain-owned
- AI-enabled
- Policy-governed
- Observable
- Testable
- Composable

All backend services in this platform must follow this template.