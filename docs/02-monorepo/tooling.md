# Tooling

## Purpose

This document defines the tooling used in the monorepo and the principles governing its use.

It explains:
- Which tools are considered part of the platform
- Why each tool exists
- How tools support AI-driven development
- How tooling choices remain stable as the system scales

This document answers the question: **“What tools are we using, and how do they support leverage rather than complexity?”**

---

## Tooling Philosophy

Tooling choices are guided by the following priorities:

- Leverage over novelty
- Consistency over flexibility
- Automation over manual process
- Predictability for AI coding agents

Tools are selected to reduce cognitive load, not increase it.

Any tool that introduces hidden complexity or fragmented workflows must be reconsidered.

---

## Monorepo Management

### Monorepo Orchestration

The monorepo is managed using a workspace-based orchestration tool (for example, Nx).

Responsibilities:
- Project graph management
- Dependency enforcement
- Incremental builds
- Task orchestration across services and apps

The monorepo tool is responsible for enforcing structure, not business logic.

---

## Package Management

### Package Manager

A single package manager is used consistently across the repository.

Responsibilities:
- Dependency resolution
- Workspace management
- Lockfile consistency

Rules:
- No mixed package managers
- No per-project lockfiles
- Dependencies must be declared explicitly

Consistency here is critical for reproducibility and AI-driven automation.

---

## Language and Runtime Tooling

### Primary Languages

The platform standardizes on a small number of languages:

- TypeScript for services, frontends, and shared packages
- Python only where strongly justified (for example, specialized ML workloads)

Rules:
- TypeScript is the default choice
- Introducing additional languages requires justification and documentation

Reducing language diversity improves AI agent effectiveness and maintainability.

---

## Build and Task Execution

### Task Definitions

Build, test, lint, and run tasks are defined declaratively.

Responsibilities:
- Standard task names across projects
- Predictable behavior for CI and AI agents
- Clear separation between build-time and runtime tasks

Examples of standard tasks:
- build
- test
- lint
- dev
- typecheck

Tasks must behave consistently across services and apps.

---

## Code Quality Tooling

### Linting and Formatting

Code quality is enforced automatically.

Requirements:
- A single linter configuration
- A single formatter configuration
- No local overrides unless explicitly documented

Formatting is not a stylistic choice.  
It is a consistency requirement for collaboration with AI agents.

---

### Type Checking

Type checking is mandatory.

Rules:
- Strict type checking enabled by default
- No unchecked escape hatches without justification
- Shared types are preferred over duplicated definitions

Type systems act as guardrails for both humans and AI.

---

## Testing Tooling

### Test Strategy Support

Tooling must support:
- Unit tests
- Integration tests
- AI evaluation tests
- Regression testing

Tests must be:
- Fast to run
- Deterministic
- Easy to invoke via standard tasks

Testing is part of development, not a separate phase.

---

## AI Development Tooling

### AI Coding Tools

AI coding tools such as Cursor are first-class development tools.

Expectations:
- AI agents read documentation before acting
- AI agents follow templates and prompts
- AI agents respect dependency and layering rules

Prompts used by AI agents are versioned and stored in `/docs/09-prompts`.

---

### AI Runtime Tooling

The AI runtime includes:
- Model provider adapters
- Prompt composition utilities
- Tool registries
- Evaluation hooks

AI tooling must:
- Be observable
- Be testable
- Support multiple providers
- Avoid vendor lock-in

---

## Observability Tooling

Observability is mandatory across the platform.

Tooling must support:
- Structured logging
- Distributed tracing
- Metrics collection
- Audit logging

Observability tools must be configured consistently across services.

Logs and traces must include:
- Request identifiers
- Tenant context
- AI execution metadata

---

## Infrastructure and Deployment Tooling

### Environment Management

Tooling must support:
- Local development
- Staging environments
- Production environments

Configuration must:
- Be explicit
- Be environment-specific
- Avoid hard-coded secrets

Secrets are managed outside the repository.

---

### CI/CD Tooling

CI/CD is treated as part of the platform.

Responsibilities:
- Enforcing build and test gates
- Running AI evaluations
- Preventing regressions
- Automating deployments

Pipelines must be deterministic and repeatable.

---

## Tooling for Documentation

Documentation tooling is intentionally simple.

Rules:
- Markdown only
- No generated documentation artifacts
- Documentation lives alongside code

Documentation must remain readable and editable without specialized tools.

---

## Tooling Governance

Tooling changes are not casual.

Rules:
- New tools require justification
- Tooling changes must be documented
- Major tooling changes require an ADR

Tool sprawl reduces leverage and must be actively resisted.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Per-service custom tooling stacks
- Undocumented scripts
- Local-only workflows
- Tooling that cannot be used by AI agents

If a tool cannot be explained clearly in this document, it does not belong.

---

## Summary

Tooling exists to support structure, automation, and leverage.

A small, consistent toolset:
- Enables AI-driven development
- Reduces cognitive overhead
- Improves reliability
- Scales with minimal coordination

All tooling decisions must align with these goals.