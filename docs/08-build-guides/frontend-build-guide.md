# Frontend Build Guide

## Purpose

This document provides a step-by-step guide for building a new frontend app in this monorepo.

It explains:
- When to create a new frontend
- How to structure the app correctly
- How to integrate with services through SDKs
- How to render AI workflows safely (including streaming)
- How to handle multi-tenancy, compliance, and observability

This document answers the question:  
**“How do I build a frontend here that stays thin, reusable, and safe?”**

---

## When to Create a New Frontend

Create a new frontend when you need one of these:

- A product UI for a single service
- A client UI that composes multiple services
- A specialized UI experience that cannot be achieved via configuration

Do not create a new frontend for:
- Minor branding differences (use theming)
- Small UX variations (use feature flags)
- Logic that belongs in services

If the UI needs domain rules, you are solving the wrong problem.

---

## Step 1: Decide the Frontend Type

Choose one:

### Product Frontend
- Single service UI
- Lives at: `/apps/<service>-ui`
- Reusable reference implementation

### Client Frontend
- Composite application
- Lives at: `/apps/client-<client-name>`
- Composes multiple services into one product feel

Both follow the same template and constraints.

### Mobile-First Implementation Guidelines

Frontend implementations must:
- Use responsive layouts by default
- Avoid fixed-width assumptions
- Prefer vertical flow over complex horizontal layouts
- Ensure critical actions are reachable on small screens
- Support keyboard and touch input equally

Desktop enhancements are added progressively.

---

## Step 2: Name the App Correctly

Rules:
- kebab-case
- explicit
- no ambiguous names

Examples:
- `chat-ui`
- `sales-ui`
- `client-acme`

Create the folder:

/apps/

---

## Step 3: Create the Canonical Folder Structure

Every frontend must start with:

/apps/
/src
/app (or pages)
/components
/features
/lib
/styles
/types
/tests
README.md

Do not add complexity early.

---

## Step 4: Write the README First

Before writing code, create `README.md`.

It must include:
- Purpose and target users
- Services used (and why)
- Key workflows
- Auth and tenant assumptions
- Dev instructions
- Deployment notes
- Compliance notes (if relevant)

If the README is unclear, the build will drift.

---

## Step 5: Define the Navigation and Layout Shell

Client frontends must define:
- Unified navigation
- Shared layout primitives
- Consistent activity/notification surfaces

Product frontends must define:
- A minimal layout consistent with the platform style
- A clear entry workflow

Rules:
- Layout is UI-only
- No domain rules in layout components

---

## Step 6: Integrate Authentication and Tenant Context

Frontends must:
- Authenticate users
- Maintain secure sessions
- Identify the active tenant explicitly

Rules:
- Never store secrets client-side
- Avoid storing sensitive data in browser storage
- Tenant context must be explicit, not inferred

All service calls must include:
- tenant context
- correlation ID

---

## Step 7: Use SDKs for Service Access

All service calls go through typed SDKs.

Rules:
- No direct calls to service internals
- No ad-hoc fetch wrappers scattered across the app
- SDK initialization belongs in `/src/lib`
Frontend code must assume all entitlement decisions are enforced server-side and treat billing state as informational only.

If a service has no SDK, create one in `/packages/sdk`.

---

## Step 8: Implement Feature Modules

All real UI behavior belongs in `/src/features`.

Feature modules:
- Call SDK methods
- Handle UI state and transitions
- Render domain-oriented workflows

Rules:
- Feature modules can coordinate multiple services
- Feature modules must not embed business rules
- Validation belongs in services, not UI

If the UI is making “domain decisions”, you are leaking backend responsibility.

---

## Step 9: AI Workflow UI Implementation

AI UX must be designed for control and trust.

Required patterns:
- Show AI output as a draft where appropriate
- Require explicit confirmation for actions with side effects
- Provide clear retry paths
- Display tool approvals when applicable
- Provide a transparent “what happened” trail

Rules:
- Prompts are never authored in the UI
- Model keys never exist in frontend code
- AI execution happens in services only

The UI is the cockpit, not the brain.

---

## Step 10: Streaming Responses

If streaming is used:
- Render partial tokens safely
- Show progress indicators
- Handle disconnects and retries
- Persist only finalized results returned by the service

Rules:
- Never stream secrets or sensitive data
- Apply redaction UI-side where required
- Streaming must not bypass policy

Streaming is UX, not a security bypass.

---

## Step 11: Composition Patterns for Client Apps

Client apps may compose services via:
- navigation-based composition
- embedded feature composition
- workflow-oriented composition
- event-driven composition

Rules:
- Composition lives in the client app only
- Services do not know they are composed
- Shared UI packages do not own composition behavior

Keep composition at the edges.

---

## Step 12: Handle Errors and Partial Failures

Multi-service UIs must handle partial failures cleanly.

Rules:
- Show where the failure happened
- Allow retry at the step level
- Avoid cascading UI breakage
- Never hide failures

Failure transparency builds trust.

---

## Step 13: Frontend Observability

Frontends must emit telemetry:

- Feature usage
- User actions
- Client-side errors
- Performance metrics
- Correlation IDs for service calls

Rules:
- Never log sensitive data
- Correlate frontend events with backend traces
- Treat UI observability as mandatory

If you cannot trace a workflow, you cannot operate the system.

---

## Step 14: Testing

Required tests:
- Component unit tests for critical components
- Feature integration tests for key workflows
- Snapshot or visual tests where useful
- Smoke tests for routing and auth flows

Rules:
- Tests must be deterministic
- Avoid brittle tests that break on minor UI changes

Test the workflows that matter.

---

## Step 15: Shipping

Before shipping:
- README must be accurate
- SDK integration must be correct
- Security constraints verified
- Compliance UX verified if relevant
- Observability verified

If observability is missing, do not ship.

---

## Common Failure Modes

Avoid these mistakes:
- Writing business logic in the UI
- Hardcoding prompts in components
- Calling services without SDKs
- Copy-pasting features between apps
- Storing sensitive data in local storage
- Skipping correlation IDs

These errors create architectural drift and security risk.

---

## Summary

To build a correct frontend:

- Choose product UI or client UI explicitly
- Follow the template folder structure
- Use SDKs for all service access
- Compose services only in client apps
- Treat AI as a service capability, not frontend logic
- Make everything observable
- Test workflows, not pixels

Follow this guide and your UI layer will remain thin, reusable, and safe.