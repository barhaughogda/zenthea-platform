# Monorepo Strategy

## Purpose

This document defines the monorepo strategy used by this platform.

It explains:
- Why a monorepo is used
- What problems the monorepo is intended to solve
- How code is organized and governed
- How the monorepo supports AI-driven development
- How the repository scales without becoming chaotic

This document answers the question: **“Why is everything in one repository, and how do we keep it sane?”**

---

## Why a Monorepo

This platform is built as a single monorepo by design.

The primary reasons are:
- Shared architectural context
- Strong consistency across services
- High leverage for a small team
- Efficient collaboration with AI coding agents
- Safe and repeatable patterns for growth

The monorepo is not chosen for convenience.  
It is chosen to **optimize leverage, clarity, and long-term maintainability**.

---

## Problems the Monorepo Solves

The monorepo directly addresses the following problems:

- Fragmentation of architectural decisions
- Duplication of AI logic, prompts, and tooling
- Inconsistent service structure and behavior
- Loss of context for AI coding agents
- High coordination overhead across repositories

By centralizing code, documentation, and patterns, the monorepo ensures that all contributors operate within the same constraints and assumptions.

---

## What Belongs in the Monorepo

The monorepo contains:

- Backend services (AI agents)
- Frontend applications
- Shared platform packages
- Documentation and prompts
- Infrastructure-related code when appropriate

If a component is:
- Core to how services are built
- Required to understand or extend the system
- Used by more than one service or frontend

It belongs in the monorepo.

---

## What Does Not Belong in the Monorepo

The following should generally be excluded:

- Experimental throwaway prototypes
- One-off scripts with no reuse value
- Vendor-specific generated artifacts
- Data or secrets

The monorepo is not a dumping ground.  
Every addition must justify its presence.

---

## Repository Structure

At a high level, the monorepo is organized into three primary areas:

- `/services`  
  Backend AI services (agents)

- `/apps`  
  Frontend applications and UIs

- `/packages`  
  Shared platform libraries and primitives

Documentation lives alongside code in `/docs` and is treated as a first-class artifact.

---

## Dependency Rules

Strict dependency rules are enforced to preserve clarity.

Allowed dependencies:
- Apps may depend on packages and service APIs
- Services may depend on packages
- Packages may depend on other packages

Forbidden dependencies:
- Packages depending on services or apps
- Services depending on app code
- Cross-service imports
- Apps importing service-internal code

Violations of these rules introduce tight coupling and are not allowed.

---

## Shared Packages as Platform Primitives

Shared packages represent platform-level primitives.

Examples include:
- AI runtime components
- Policy enforcement
- Authentication and authorization
- Observability and logging
- Shared UI components
- Typed SDKs

Shared packages define **how things are done**, not **what a service does**.

Any logic that appears in more than one service should be considered for extraction into a shared package.

---

## Service Independence Within a Monorepo

Although services live in the same repository, they must behave as if they are independently owned.

This means:
- No shared databases
- No direct imports of internal service code
- No assumptions about deployment order
- No implicit coordination

The monorepo provides visibility and reuse, not coupling.

---

## Monorepo and AI Coding Agents

The monorepo is explicitly optimized for AI coding agents.

Benefits include:
- Full-system context in one place
- Consistent patterns that can be learned and reused
- Centralized documentation and prompts
- Reduced ambiguity when generating or modifying code

AI agents are expected to:
- Read documentation before acting
- Follow templates and patterns
- Respect dependency rules

The monorepo enables AI agents to operate safely at scale.

---

## Change Management and Safety

Changes in a monorepo have wide visibility.

To manage this safely:
- Service templates are enforced
- Breaking changes are documented
- Shared packages are versioned intentionally
- Architecture decisions are recorded in ADRs

The monorepo favors deliberate, visible change over hidden divergence.

---

## Scaling the Monorepo

As the system grows:
- The number of services may increase
- The number of frontends may increase
- Shared packages may evolve

The monorepo scales by:
- Enforcing structure
- Centralizing knowledge
- Limiting cross-cutting dependencies
- Using documentation as coordination

If the monorepo becomes hard to reason about, the solution is better structure, not fragmentation.

---

## What This Strategy Explicitly Avoids

The monorepo strategy explicitly avoids:
- Micro-repos per service
- Implicit coupling through shared state
- Undocumented conventions
- Ad-hoc exceptions to dependency rules

These patterns reduce leverage and increase long-term cost.

---

## Summary

The monorepo is a strategic choice.

It exists to:
- Maximize leverage for a small team
- Enable consistent AI-first development
- Centralize architecture, patterns, and documentation
- Support safe scaling of services and products

All repository structure and tooling decisions must align with this strategy.