# Layered Architecture

## Purpose

This document defines the layered architecture used across the platform.

The goal is to:
- Standardize how services are structured internally
- Enforce clear separation of responsibilities
- Make behavior predictable for humans and AI coding agents
- Prevent tight coupling between UI, domain logic, and AI logic

This document answers the question: **“How is code organized inside services and across the platform?”**

---

## Layer Model

The platform is organized into layers that exist both:
- Within each service
- Across the monorepo as a whole

The core idea is simple:
- Higher layers depend on lower layers
- Lower layers must not depend on higher layers
- Cross-layer shortcuts are forbidden unless explicitly documented

---

## Cross-Repo Layers

At a repository level, the system is structured into three top-level categories:

1. Frontends (`/apps`)
2. Services (`/services`)
3. Shared packages (`/packages`)

Rules:
- Frontends may depend on shared packages and service APIs
- Services may depend on shared packages
- Shared packages may not depend on services or apps

This creates a stable foundation where shared packages act as platform primitives.

---

## Service-Internal Layers

Each service follows a consistent internal layering model.

### Layer 1: API Layer (Transport)

Responsibilities:
- HTTP / RPC transport
- Request parsing and validation
- Authentication context extraction
- Rate limiting and request shaping
- Response formatting (including streaming)

Non-responsibilities:
- Business rules
- AI reasoning
- Direct database logic (beyond calling lower layers)

This layer must be thin.

---

### Layer 2: Orchestration Layer (Use Cases)

Responsibilities:
- Implements service use cases as explicit workflows
- Coordinates domain logic, AI runtime, tools, storage, and events
- Defines transaction boundaries and idempotency rules
- Enforces policy decisions at key checkpoints

Non-responsibilities:
- Data persistence details
- Vendor-specific integrations
- UI assumptions

This is where service behavior is composed.

---

### Layer 3: Domain Layer (Core Logic)

Responsibilities:
- Domain rules and invariants
- Domain models and state transitions
- Validation rules specific to the domain
- Deterministic logic that must remain stable over time

Non-responsibilities:
- Transport concerns
- Vendor APIs
- Model provider specifics
- Prompt assembly details (handled by AI runtime components)

The domain layer should be mostly deterministic and testable without AI.

---

### Layer 4: AI Layer (Intelligence Runtime)

Responsibilities:
- Prompt composition and structured instructions
- Tool planning and tool invocation orchestration
- Memory retrieval and context shaping
- Output parsing, structuring, and post-processing
- AI behavior tracing, scoring, and eval hooks

Non-responsibilities:
- Owning domain truth
- Directly mutating persistent state without orchestration oversight

Important rule:
- AI can propose actions, but state changes must be validated by orchestration and domain layers.

AI is treated as a controlled capability, not an authority.

---

### Layer 5: Data Access Layer (Persistence)

Responsibilities:
- Repository interfaces for reads and writes
- Schema-level constraints and migrations
- Encryption and redaction at storage boundaries
- Query optimization and caching primitives

Non-responsibilities:
- Business logic
- AI reasoning

This layer must be replaceable without rewriting orchestration.

---

### Layer 6: Integration Layer (External Systems)

Responsibilities:
- Communication with external APIs and vendors
- Adapters for AI model providers
- Webhook clients and event publishers
- Retries, backoff, circuit breakers

Non-responsibilities:
- Owning service workflows or domain rules

Integrations must be abstracted behind interfaces to avoid vendor lock-in.

---

## Policy and Compliance as a Cross-Cutting Concern

Policy enforcement is not a separate service layer. It is a cross-cutting concern implemented consistently across layers.

Policy checks must exist at:
- API boundaries (authentication and access checks)
- Orchestration checkpoints (before/after AI calls, before tool calls, before persistence)
- Storage boundaries (encryption, retention, redaction)
- Integration boundaries (vendor rules, BAA constraints, PHI controls)

When in doubt, policy is enforced early and often.

---

## Observability as a Cross-Cutting Concern

Observability is mandatory and spans all layers.

Required signals:
- Structured logs with request IDs and tenant context
- Traces across service boundaries and tool calls
- Metrics for latency, error rates, cost, token usage, tool frequency
- Audit events for sensitive actions

AI behavior must be observable:
- Prompt versions and policy context must be logged
- Tool calls must be captured with inputs and outputs (with redaction as needed)
- Evaluations must be able to replay behavior deterministically when possible

---

## Dependency Rules

The following dependency rules must be enforced:

- API Layer depends on Orchestration only
- Orchestration depends on Domain, AI Layer, Data Access, Integration, and Shared Packages
- Domain depends only on itself and stable shared primitives
- AI Layer depends on shared AI runtime packages and tool interfaces, not on transport
- Data Access depends on database libraries and shared primitives
- Integration depends on external SDKs and shared primitives

Forbidden patterns:
- Domain calling external integrations
- API layer calling database directly
- AI layer bypassing orchestration to mutate state
- Frontends importing service-internal code

These violations create coupling and reduce long-term scalability.

---

## How Frontends Fit Into the Layer Model

Frontends follow a simpler variant of this layering:

- UI components (presentation)
- UI state management (interaction logic)
- SDK/API client layer (service consumption)
- Optional: frontend-only orchestration for UX flows

Frontends must not:
- Implement business rules that belong to services
- Implement AI reasoning logic
- Store secrets required for service operations

Frontends can provide UX-level AI features only when those features are strictly presentation-level.

---

## Summary

This platform uses a layered architecture to guarantee:
- Clear responsibilities
- Predictable execution
- Replaceable components
- Safe AI behavior
- Compliance-ready boundaries

Services own domain truth.
AI adds leverage inside constrained workflows.
Frontends present and compose, but do not govern.

All implementation details in later documents must respect these layer boundaries.