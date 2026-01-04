# Frontend Template

## Purpose

This document defines the mandatory template for frontend applications in the monorepo.

It specifies:
- What a frontend app is responsible for
- How frontend code is structured
- How frontends integrate with services
- How AI experiences are rendered safely
- How security, compliance, and observability are handled in the UI

This document answers the question: **“What does a correct frontend look like in this platform?”**

All frontends must conform to this template unless an explicit exception is documented.

---

## Definition of a Frontend App

A frontend app is:
- A user-facing product surface
- A consumer of backend services
- Responsible for UX, not business logic
- Deployable independently

A frontend app is not:
- A place for domain rules
- A place for prompt engineering
- A backend proxy with hidden logic

Frontends are thin by design.

This frontend follows a mobile-first design approach.
Core workflows must be usable on small screens without loss of functionality.

---

## Two Frontend Types

This template applies to both:

- Product frontends: `/apps/<service>-ui`
- Client frontends: `/apps/client-<client-name>`

Client frontends may include more composition and branding, but must follow the same principles.

---

## Mandatory Frontend Responsibilities

Every frontend must:
- Authenticate users and handle sessions securely
- Call services through typed SDKs
- Present AI workflows with clear user control
- Support streaming responses where needed
- Apply UI-level compliance constraints (redaction, approval flows)
- Emit client-side telemetry for observability

---

## Canonical Frontend Folder Structure

Each frontend must follow this structure:

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

Exact framework folders may differ, but responsibilities must remain.

---

## Folder Responsibilities

### `/src/app` or `/src/pages`

Responsibilities:
- Routing
- Page layout
- High-level composition only

Rules:
- No business logic
- No direct service calls outside feature modules

---

### `/src/components`

Responsibilities:
- Pure UI components
- Reusable presentation logic
- No domain assumptions

Rules:
- No API calls
- No side effects

---

### `/src/features`

Responsibilities:
- Feature modules that map to user workflows
- Integration with service SDKs
- Local state and UI orchestration

Rules:
- Feature modules call services through the SDK
- Any workflow that spans services lives here

---

### `/src/lib`

Responsibilities:
- App-level utilities and adapters
- SDK initialization
- Auth helpers
- Telemetry helpers

Rules:
- No domain logic
- No service-specific rules that do not belong to the UI

---

### `/src/styles`

Responsibilities:
- Global styles and design tokens
- Theming support

Client branding should be handled here or in a shared theming package.

---

### `/src/types`

Responsibilities:
- UI-only types
- View models
- Narrow types for forms and rendering

Rules:
- Do not duplicate domain types that exist in SDKs
- Prefer SDK types when possible

---

### `/tests`

Responsibilities:
- Frontend unit tests
- Integration tests for key flows
- Snapshot or visual tests where useful

---

## Service Integration Requirements

Frontends must integrate with services via typed SDKs.

Rules:
- No direct calls to service internals
- No embedding of business rules in UI
- No “logic duplication” for validation except basic form shape checks

All authoritative validation occurs in services.

---

## AI Workflow UI Patterns

AI features must be presented with clear control and transparency.

Required UX patterns:
- Show when AI is operating
- Show outputs as drafts or suggestions when applicable
- Provide confirmation steps for high-impact actions
- Display tool approvals where required
- Provide a clear retry and error path

Never imply the AI is infallible.

---

## Streaming UI Patterns

For streaming responses:
- Support partial rendering
- Show progress indicators
- Handle disconnect and retry gracefully
- Persist only finalized results returned by the service

Streaming is an interaction pattern, not a trust shortcut.

---

## Approval and Safety Gates

For workflows with real-world side effects:
- Require explicit confirmation
- Show summary of intended action
- Provide cancel paths
- Record user approval intent when relevant

The UI is part of the safety system, but not the authority.

---

## Multi-Tenant Requirements

Frontends must be tenant-aware.

Rules:
- Tenant context must be explicit
- Tenant switching must be secure and auditable
- No cross-tenant caching of sensitive data

Tenant boundaries must be respected in UI state and routing.

---

## Security Requirements

Frontends must:
- Never store secrets in client code
- Use secure session handling
- Avoid logging sensitive data
- Prevent injection risks by proper encoding and sanitization

Any sensitive operations must occur in services, not in the UI.

---

## Compliance Requirements

In regulated deployments:
- Avoid displaying PHI unless explicitly authorized
- Apply redaction in UI for sensitive fields where required
- Respect role-based visibility
- Avoid storing sensitive data in browser storage unless justified

The frontend must not create a compliance leak.

---

## Observability Requirements

Frontends must emit telemetry such as:
- User actions tied to correlation IDs
- Feature usage events
- Error events
- Performance signals

Correlation IDs must propagate from frontend to service calls.

Frontend observability must align with backend observability.

---

## Frontend README.md Requirements

Each frontend must include a `README.md` that documents:
- Purpose and target users
- Services used and SDK versions
- Local dev instructions
- Deployment notes
- Security and compliance notes
- Known limitations

The README is part of the contract for the app.

---

## Anti-Patterns to Avoid

The following are explicitly disallowed:
- Prompt construction in the UI
- Storing API keys in frontend code
- Copy-pasting feature modules across apps
- Directly calling service databases or internals
- Hiding automation side effects from users

If it reduces transparency or increases coupling, it is wrong.

---

## Summary

This frontend template ensures every UI is:
- Thin and composable
- Service-driven
- Safe for AI workflows
- Secure and tenant-aware
- Observable and maintainable

All frontend apps must conform to this template.