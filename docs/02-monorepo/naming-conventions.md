# Naming Conventions

## Purpose

This document defines the naming conventions used across the monorepo.

It explains:
- How files, folders, services, packages, and symbols are named
- Why consistency in naming is critical
- How naming supports AI-driven development and maintainability

This document answers the question: **“What should this be called, and why?”**

Naming is treated as an architectural concern, not a cosmetic one.

---

## Core Naming Principles

All naming decisions in this repository follow these principles:

- Names must be descriptive and unambiguous
- Names must reflect ownership and responsibility
- Names must be predictable for humans and AI agents
- Consistency is more important than personal preference

If a name requires explanation, it is probably wrong.

---

## Folder Naming

### General Rules

- Use lowercase letters only
- Use hyphens (`-`) to separate words
- Avoid abbreviations unless universally understood
- Prefer explicit names over short ones

Examples:
- `chat-agent`
- `project-management-agent`
- `ai-core`

---

### Top-Level Folders

Top-level folders use fixed, well-known names:

/apps
/services
/packages
/docs

These names are reserved and must not be repurposed.

---

## Service Naming

### Service Folder Names

Service folders must:
- Represent a single domain
- End with `-agent` for AI-driven domain services
- Core platform services (e.g., `billing`, `auth`) may omit the `-agent` suffix
- Use domain language, not technical language

Examples:
- `chat-agent`
- `sales-agent`
- `billing`
- `project-management-agent`

Avoid:
- `chat-service-v2`
- `core-agent`
- `utils-agent`

Versioning is handled through APIs and deployment, not names.

---

### Service Internal Folders

Service-internal folders use standardized names aligned with architecture layers:

api
orchestration
domain
ai
data
integrations
config
tests

These names are fixed and must not be renamed.

---

## Package Naming

### Package Folder Names

Packages represent shared platform primitives.

Rules:
- Use lowercase with hyphens
- Name packages by responsibility, not by consumer
- Avoid domain-specific terms

Examples:
- `ai-core`
- `policy`
- `auth`
- `observability`
- `events`
- `sdk`
- `ui`

Avoid:
- `chat-utils`
- `service-helpers`
- `shared-stuff`

---

### Package Import Names

Package import names should match folder names and be scoped consistently.

Examples:
- `@platform/ai-core`
- `@platform/policy`
- `@platform/sdk`

The exact scope is less important than consistency.

---

## Application Naming

### App Folder Names

Apps represent frontends and UIs.

Rules:
- Use lowercase with hyphens
- Reflect the purpose or client clearly
- Avoid technical implementation details

Examples:
- `chat-ui`
- `sales-ui`
- `client-acme`
- `client-contoso`

---

## File Naming

### General Rules

- Use lowercase with hyphens for filenames
- Prefer descriptive names over generic ones
- Avoid `index` files unless explicitly justified

Examples:
- `create-conversation.ts`
- `policy-check.ts`
- `audit-log-writer.ts`

Avoid:
- `utils.ts`
- `helpers.ts`
- `misc.ts`

---

### Test Files

Test files should mirror the name of the file they test.

Examples:
- Unit tests: `create-conversation.test.ts`
- AI eval tests: `conversation-quality.eval.test.ts`

Consistency here helps both humans and AI locate related code quickly.

---

## Symbol and Identifier Naming

### Variables and Functions

Rules:
- Use clear, descriptive names
- Avoid single-letter names except in tight scopes
- Prefer domain language

Examples:
- `conversationId`
- `tenantContext`
- `policyDecision`

Avoid:
- `ctx` when meaning is unclear
- `data` as a catch-all
- `result` without context

---

### Types and Interfaces

Rules:
- Use PascalCase
- Name types after what they represent, not how they are used

Examples:
- `Conversation`
- `PolicyDecision`
- `ToolInvocation`

Avoid:
- `IConversation`
- `ConversationType`
- `ConversationData`

---

## Event Naming

Event names follow the convention defined in the eventing model.

Pattern:

Examples:
- `chat.message.created`
- `sales.lead.updated`
- `ai.tool.invoked`

Event names must describe facts, not commands.

---

## AI-Specific Naming

### Prompt Identifiers

Prompts must be named clearly and versioned intentionally.

Rules:
- Include domain and purpose
- Avoid vague names

Examples:
- `chat-response-v1`
- `lead-qualification-v2`

---

### Tool Names

AI tools must:
- Use verb-noun naming
- Reflect a single capability

Examples:
- `createInvoice`
- `fetchCustomerRecord`
- `scheduleMeeting`

Tool names must remain stable once published.

---

## Naming and AI Coding Agents

Consistent naming is critical for AI coding agents.

Benefits include:
- Reduced hallucinated references
- Faster code navigation
- Higher-quality refactors
- Safer automation

Ambiguous naming directly degrades AI output quality.

---

## Renaming Rules

Renaming is a breaking change.

Rules:
- Renames must be deliberate
- Renames must update all references
- Renames must be documented if externally visible

Casual renaming is not allowed.

---

## Summary

Naming conventions enforce clarity and ownership.

Good names:
- Encode intent
- Reduce cognitive load
- Enable safe AI-driven development

All contributors must follow these conventions consistently.