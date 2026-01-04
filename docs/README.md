# Documentation Overview

This documentation describes the design, principles, and execution plan for an AI-first, service-oriented platform built as a monorepo.

These documents are not notes or high-level descriptions. They are **authoritative instructions** intended to be read and executed by both humans and AI coding agents. The documentation defines what is being built, why it exists, and how it must be implemented and extended over time.

If something is not documented here, it should be treated as undefined.

---

## What This Repository Is Building

This repository contains an AI-first platform composed of:

- Independent, product-grade backend services (“AI agents”)
- One or more frontends that consume these services
- Shared platform packages for AI runtime, policy enforcement, security, observability, and UI
- Strong defaults for compliance, especially HIPAA-aligned use cases

Each backend service is designed to:
- Be usable as a standalone product
- Be composable into larger applications
- Expose a clear API contract
- Contain AI as a core capability, not an add-on

Frontends are intentionally decoupled. Services must never depend on a specific UI in order to function.

---

## AI-First by Design

“AI-first” in this repository does not mean adding a chatbot to existing software.

It means:
- AI is embedded into the core execution path of services
- AI capabilities are treated as infrastructure, not features
- Prompting, tool use, memory, policy, and evaluation are first-class concerns
- Every service is designed to be executed, tested, and extended by AI agents

This repository is built with the assumption that:
- Humans and AI agents will collaborate on development
- AI agents will read these documents directly
- Consistency, determinism, and clarity matter more than cleverness

---

## Documentation as Executable Instructions

All documentation in this `/docs` folder follows one rule:

> Documentation is executable guidance.

Each document is expected to:
- Define responsibilities and boundaries clearly
- Avoid ambiguity
- Be specific enough that an AI agent can act on it
- Avoid duplication of concepts defined elsewhere

Examples, tutorials, and informal notes are intentionally excluded unless explicitly stated.

---

## Documentation Structure

The `/docs` folder is organized as follows:

- `00-overview`  
  High-level vision, principles, and non-goals

- `01-architecture`  
  System-level architecture, data flow, and scaling model

- `02-monorepo`  
  Monorepo strategy, structure, and dependency rules

- `03-ai-platform`  
  Canonical AI runtime, prompting strategy, tool system, memory, and learning loops

- `04-security-compliance`  
  Security model, HIPAA strategy, data handling, and vendor constraints

- `05-services`  
  Service templates and specifications for each backend AI service

- `06-frontends`  
  Frontend strategy, reference UIs, client-specific frontends, and embedding patterns

- `07-evals-observability`  
  Evaluation strategy, regression testing, metrics, and observability

- `08-build-guides`  
  Step-by-step guides for building, testing, and deploying the system

- `09-prompts`  
  Deterministic prompts intended for use with AI coding tools such as Cursor

- `10-decisions`  
  Architecture Decision Records (ADRs) documenting major technical decisions

---

## Recommended Reading Order

### For Humans

1. `00-overview`
2. `01-architecture`
3. `02-monorepo`
4. `03-ai-platform`
5. `05-services`
6. `08-build-guides`

### For AI Coding Agents

1. This file (`/docs/README.md`)
2. `02-monorepo`
3. `03-ai-platform`
4. `05-services/service-template.md`
5. `09-prompts`

AI agents should treat these documents as constraints, not suggestions.

---

## How to Extend This Documentation

When adding new documentation:

- Do not restate concepts already defined elsewhere
- Reference existing documents instead of duplicating content
- Follow the tone and structure of existing files
- Assume the reader is technical and time-constrained

When adding new services, prompts, or guides, always check whether a template already exists and extend that template rather than creating new patterns.

---

## Source of Truth

This documentation is the source of truth for:
- Architecture
- AI behavior
- Service boundaries
- Security and compliance assumptions

If code and documentation disagree, the documentation is considered correct until explicitly revised.

Changes to these documents should be deliberate and reviewed carefully.