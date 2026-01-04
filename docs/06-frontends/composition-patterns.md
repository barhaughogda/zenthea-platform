# Frontend Composition Patterns

## Purpose

This document defines the composition patterns used to build cohesive client applications from multiple service-driven frontends.

It explains:
- How multiple service UIs are composed into one app
- Where composition logic lives
- Which patterns are allowed and which are forbidden
- How to keep UX cohesive without coupling services
- How AI-driven workflows span services safely

This document answers the question: **“How do we stitch many services into one app without breaking architecture?”**

---

## Composition First Principles

All frontend composition follows these principles:

- Services remain independent
- Composition happens at the UI layer
- Contracts are enforced via SDKs
- UX feels unified even when services are separate
- No service assumes it is the “main” service

Composition must never leak into backend ownership.

---

## Where Composition Lives

Composition lives **only** in client frontends.

Rules:
- Product frontends do not compose other services
- Services do not know about frontend composition
- Shared UI packages do not own composition logic

Composition belongs in:

/apps/client-

---

## Composition Pattern Categories

The platform supports four primary composition patterns.

Each has a clear use case and boundary.

---

## 1. Navigation-Based Composition

### Description

Multiple services are composed via shared navigation.

Each service UI owns its own pages, but the client app:
- Provides a unified layout
- Manages navigation and routing
- Shares identity and context

### Example

- Sidebar with entries:
  - Chat
  - Sales
  - Projects
  - Accounting

Each route mounts a service UI module.

### Rules

- Navigation is owned by the client app
- Service UIs expose pages, not routers
- Shared layout comes from a shared UI package

This is the most common composition pattern.

---

## 2. Embedded Feature Composition

### Description

A feature from one service is embedded inside another service’s UI.

Example:
- Sales insights embedded inside a project view
- Chat embedded inside a sales deal page

### How It Works

- The embedding UI owns layout
- The embedded feature is a self-contained component
- Data access occurs via SDK calls, not shared state

### Rules

- Embedded features must be explicitly designed for embedding
- Embedded features must not assume global layout
- Embedded features must accept context via props

This pattern enables rich cross-service UX without coupling.

---

## 3. Workflow-Oriented Composition

### Description

A single user workflow spans multiple services.

Example:
- Lead created in Marketing
- Qualified in Sales
- Converted into a Project
- Discussed via Chat

### How It Works

- The client app orchestrates the workflow
- Each step calls a different service
- State transitions are explicit and observable

### Rules

- Workflow state lives in the client app
- Each service remains authoritative for its domain
- AI reasoning occurs inside services, not the UI

The UI coordinates. Services decide.

---

## 4. Event-Driven UI Composition

### Description

The UI reacts to events emitted by services.

Examples:
- Notification when a deal closes
- Activity feed updates
- AI task completion indicators

### How It Works

- Services emit domain events
- The client app subscribes via a gateway or stream
- UI updates reactively

### Rules

- Events are informational, not commands
- UI must re-fetch authoritative state when needed
- Events must be correlated with service calls

Events improve responsiveness but do not replace APIs.

---

## Composition Anti-Patterns

The following patterns are explicitly forbidden:

- Shared global frontend state representing multiple services
- One service UI calling another service’s API indirectly
- Copying service UI code into client apps
- Frontend-to-frontend communication bypassing services
- “God pages” that embed everything without structure

These patterns destroy maintainability.

---

## Composition via Shared UI Packages

Shared UI packages support composition by providing:
- Layout primitives
- Navigation shells
- Design tokens
- Common interaction patterns

Shared packages must:
- Be service-agnostic
- Contain no business logic
- Avoid assumptions about service presence

---

## Cross-Service Identity and Context

Client apps are responsible for:
- Authentication
- Tenant selection
- Role context
- Correlation IDs

Context is passed to services via SDK calls.

Service UIs must not manage identity independently.

---

## AI-Specific Composition Patterns

AI workflows often span services.

Best practices:
- Show AI steps explicitly in the UI
- Attribute AI actions to the service that owns them
- Provide progress and explainability across steps
- Handle partial failure gracefully

AI must feel coordinated, not magical.

---

## Error Handling Across Services

Client apps must handle:
- Partial failures
- Service timeouts
- Inconsistent states

Rules:
- Never hide failures
- Show which step failed
- Allow retry per step
- Avoid cascading UI breakage

The UI must be resilient by design.

---

## Observability Across Composed Flows

Composition requires observability.

Requirements:
- Correlation IDs flow through all service calls
- UI logs reflect multi-service workflows
- Errors are traceable end-to-end

If a workflow cannot be traced, it is broken.

---

## Scaling Composition Over Time

As services grow:
- Prefer adding new composed routes
- Avoid deep nesting of embedded features
- Promote repeated compositions into reusable patterns

Composition should simplify, not complicate.

---

## Summary

Frontend composition works because:
- Services stay independent
- SDKs enforce contracts
- The client app owns coordination
- UX remains cohesive
- AI behavior remains controlled and observable

Compose at the edges.  
Own nothing you don’t have to.  
Let services stay services.