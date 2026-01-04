# Folder Structure

## Purpose

This document defines the canonical folder structure of the monorepo.

It explains:
- What each top-level folder represents
- What belongs in each folder
- What explicitly does not belong
- How this structure supports AI-driven development
- How to extend the structure safely over time

This document answers the question: **“Where does this code live, and why?”**

---

## Top-Level Repository Structure

At the top level, the repository is organized as follows:

/apps
/services
/packages
/docs

Each folder has a distinct role. Mixing responsibilities across these boundaries is not allowed.

---

## `/apps` — Frontend Applications

The `/apps` directory contains frontend applications.

These include:
- Reference UIs for individual services
- Client-specific applications
- Composite applications that integrate multiple services

### Responsibilities

Apps are responsible for:
- User interaction and presentation
- Client-side state management
- Calling service APIs through SDKs
- UX-level orchestration only

Apps are not responsible for:
- Business logic
- AI reasoning
- Direct data persistence
- Security-critical operations

---

### Example Structure

/apps
/chat-ui
/sales-ui
/client-acme
/client-contoso

Each app is self-contained and independently deployable.

---

## `/services` — Backend AI Services

The `/services` directory contains backend services, each representing a domain-specific AI agent.

Each service:
- Owns a single domain
- Encapsulates its AI behavior
- Exposes a stable API
- Owns its data and events

---

### Example Structure

/services
/chat-agent
/sales-agent
/accounting-agent
/project-management-agent

Services must not import code from other services.

---

### Internal Service Structure

Each service follows a consistent internal structure:

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

Each subfolder maps directly to a layer defined in the layered architecture.

---

## `/packages` — Shared Platform Packages

The `/packages` directory contains shared libraries used across services and apps.

Packages represent platform primitives and infrastructure.

---

### Responsibilities

Packages may contain:
- AI runtime components
- Prompt composition utilities
- Tool registries
- Policy enforcement logic
- Authentication primitives
- Observability utilities
- Shared UI components
- Typed SDKs

Packages must not:
- Contain service-specific business logic
- Depend on `/services` or `/apps`

---

### Example Structure

/packages
/ai-core
/policy
/auth
/observability
/events
/sdk
/ui

Packages should be small, focused, and reusable.

---

## `/docs` — Authoritative Documentation

The `/docs` directory contains all authoritative documentation for the platform.

Documentation is treated as executable instruction and is a first-class artifact.

---

### Structure

/docs
/00-overview
/01-architecture
/02-monorepo
/03-ai-platform
/04-security-compliance
/05-services
/06-frontends
/07-devops
/08-build-guides
/09-prompts
/10-decisions
README.md

Each folder has a defined purpose. Documentation should not be duplicated across folders.

---

## Naming Conventions

Naming conventions are enforced for clarity and predictability.

Rules:
- Use lowercase with hyphens for folder names
- Use descriptive, domain-oriented names
- Avoid abbreviations unless universally understood

Examples:
- `chat-agent`
- `project-management-agent`
- `ai-core`

---

## Where New Code Should Go

When adding something new, use the following rules:

- New backend domain logic → `/services`
- New frontend or UI → `/apps`
- Reusable logic across services/apps → `/packages`
- Architectural or operational guidance → `/docs`

If an item does not clearly fit, reconsider whether it belongs in the repository.

---

## Forbidden Patterns

The following are explicitly disallowed:

- Placing backend logic in `/apps`
- Sharing databases or state across services
- Importing service-internal code across services
- Adding undocumented folders or structures
- Introducing “misc” or “utils” dumping grounds

Violations reduce clarity and must be corrected.

---

## Extending the Folder Structure

The structure may evolve, but changes must be deliberate.

Rules for extension:
- Add new top-level folders only when absolutely necessary
- Document all structural changes
- Prefer extending existing patterns over creating new ones
- Record major changes in an ADR

Structure changes affect humans and AI agents and must be treated carefully.

---

## Summary

The folder structure enforces clarity, ownership, and scalability.

Apps present.
Services decide and act.
Packages provide shared infrastructure.
Docs define truth.

All contributors, human or AI, must respect this structure.