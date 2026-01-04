# Dependency Rules

## Purpose

This document defines the dependency rules that govern how code in this monorepo may depend on other code.

It explains:
- Which dependencies are allowed
- Which dependencies are forbidden
- Why these rules exist
- How these rules protect scalability, safety, and AI-driven development

This document answers the question: **“Who is allowed to depend on whom, and why?”**

---

## Core Dependency Principle

All dependencies in this repository must flow in one direction:

**From higher-level consumers to lower-level primitives.**

Dependencies must never flow “upward” or laterally in ways that introduce tight coupling.

Violations of dependency direction are considered architectural defects.

---

## Top-Level Dependency Graph

At the highest level, the repository follows this dependency graph:

apps ───▶ services ───▶ packages

More precisely:
- Apps depend on service APIs and shared packages
- Services depend on shared packages
- Packages depend only on other packages

No other top-level dependency directions are allowed.

---

## `/apps` Dependency Rules

Frontend applications live in `/apps`.

### Allowed Dependencies

Apps may depend on:
- Shared packages in `/packages`
- Public APIs exposed by services
- Typed SDKs generated from service APIs

Apps may consume services only through explicit interfaces.

---

### Forbidden Dependencies

Apps must not:
- Import service-internal code
- Access service databases directly
- Depend on service deployment details
- Contain business or AI logic that belongs in services

Apps are consumers, not owners.

---

## `/services` Dependency Rules

Backend services live in `/services`.

### Allowed Dependencies

Services may depend on:
- Shared packages in `/packages`
- Their own internal modules
- External libraries through integration layers

Services may expose APIs and events but must not rely on other services’ internals.

---

### Forbidden Dependencies

Services must not:
- Import code from other services
- Access databases owned by other services
- Share mutable state with other services
- Depend on frontend code

Inter-service communication must occur via APIs or events only.

---

## `/packages` Dependency Rules

Shared platform packages live in `/packages`.

### Allowed Dependencies

Packages may depend on:
- Other packages in `/packages`
- External libraries

Packages must be reusable and context-independent.

---

### Forbidden Dependencies

Packages must not:
- Import code from `/services`
- Import code from `/apps`
- Contain domain-specific business logic
- Make assumptions about deployment or runtime context

Packages define *how* things are done, not *what* a service does.

---

## Internal Service Layer Dependencies

Within a service, internal layering rules apply.

Allowed dependency flow:

api
└──▶ orchestration
├──▶ domain
├──▶ ai
├──▶ data
└──▶ integrations

Rules:
- API layer depends only on orchestration
- Orchestration coordinates all lower layers
- Domain layer is isolated and deterministic
- AI layer cannot bypass orchestration
- Data and integration layers are passive

Any shortcut across layers must be explicitly documented and justified.

---

## Cross-Cutting Dependencies

Certain concerns are cross-cutting and implemented through shared packages:

- Authentication and authorization
- Policy enforcement
- Observability
- AI runtime utilities

These concerns:
- Are implemented once
- Are reused everywhere
- Must not embed service-specific logic

Cross-cutting does not mean cross-owned.

---

## Dependency Enforcement

Dependency rules must be enforced, not assumed.

Enforcement mechanisms may include:
- Monorepo tooling constraints
- Static analysis
- Lint rules
- Code review standards
- CI validation

Violations should be detected early and fail fast.

---

## Why These Rules Matter for AI

AI coding agents rely heavily on dependency clarity.

Clear dependency rules:
- Reduce hallucinated imports
- Prevent accidental coupling
- Enable safe code generation
- Make refactoring predictable

Ambiguous dependency graphs significantly degrade AI reliability.

---

## Handling Exceptions

Exceptions to dependency rules are rare.

Rules for exceptions:
- Must be explicitly documented
- Must include justification and scope
- Must be recorded as an ADR
- Must be revisited periodically

Undocumented exceptions are not allowed.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Shared utility folders spanning services
- “Just this once” imports across services
- Implicit dependencies through shared state
- Hidden coupling via environment variables

These patterns undermine the architecture and must be corrected.

---

## Summary

Dependency rules exist to protect:
- Modularity
- Scalability
- AI-driven development
- Long-term maintainability

Apps consume.
Services own.
Packages enable.

All contributors, human or AI, must respect these rules.