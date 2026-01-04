# Frontend Strategy

## Purpose

This document defines the frontend strategy for the platform.

It explains:
- How frontends are organized in the monorepo
- How client-specific frontends are built
- How reusable “product frontends” are created per service
- How multiple services are composed into one cohesive user experience
- How security, compliance, and AI constraints apply to frontends

This document answers the question: **“How do we build frontends that are reusable, composable, and safe?”**

---

## Frontend Philosophy

Frontends exist to:
- Present information clearly
- Collect user intent and inputs
- Provide excellent UX for AI-driven workflows
- Compose multiple services into a unified experience

Frontends do not:
- Own business logic
- Own AI reasoning logic
- Bypass security or compliance boundaries
- Store secrets required for service operations

Frontends are consumers of services.

---

## Mobile-First Design Principle

All frontend applications are designed using a mobile-first approach.

This means:
- Core user flows are designed for small screens first
- Layouts scale up progressively for tablets and desktops
- No critical functionality is desktop-only
- Touch interaction is considered a first-class input method

Mobile-first is a UX principle, not a platform constraint.

---

## Two Types of Frontends

The platform supports two frontend types simultaneously.

### 1. Product Frontends (Per-Service Reference UIs)

These are service-specific UIs that can be deployed independently.

Purpose:
- Provide a complete UI for a single backend service
- Serve as a reference implementation
- Be reusable as a base for client implementations

Examples:
- Chat UI
- Sales UI
- Accounting UI
- Project Management UI
- Marketing UI

These live under:
- `/apps/<service>-ui`

---

### 2. Client Frontends (Composite Applications)

These are client-specific apps that integrate multiple services.

Purpose:
- Provide a cohesive experience tailored to a client
- Compose multiple service UIs and workflows
- Implement client branding and specific UX requirements

These live under:
- `/apps/client-<client-name>`

Client frontends are the normal end-state for real deployments.

---

## Why Both Frontend Types Are Smart

This strategy is intentionally designed for reuse and speed.

Benefits:
- You can ship quickly using product UIs
- You can compose multiple services into one client app
- You can clone a client app and adapt it for another client
- You keep UX consistent while allowing customization
- You avoid rewriting the same UI patterns repeatedly

The “product UI” becomes a reusable module, not a one-off project.

---

## Frontend Composition Model

Client apps are composed from:
- Shared UI packages
- Service UI modules (optional)
- Service SDKs for backend communication

Composition is done at the UI layer, not by sharing service internals.

---

## Repository Structure for Frontends

Recommended structure:

/apps
/chat-ui
/sales-ui
/accounting-ui
/project-management-ui
/marketing-ui
/client-acme
/client-contoso

Supporting packages:

/packages
/ui
/sdk
/auth
/observability

This ensures maximal reuse with minimal coupling.

---

## UI Reuse Strategy

Reuse is achieved through:
- Shared component libraries in `/packages/ui`
- Shared layout primitives and patterns
- Shared SDK usage for data access
- Shared workflow components where appropriate

Avoid copying code between apps.

When a UI pattern is reused twice:
- Promote it to a shared package
- Or promote it to a service UI module package

---

## Service SDK Strategy

All frontends communicate with services through typed SDKs.

Rules:
- Frontends must not call service internals
- Frontends must not embed business rules
- SDKs must be versioned and stable

SDKs act as the contract boundary between UI and services.

---

## Billing and Entitlement Boundary

Frontend applications must not:
- Contain pricing logic
- Infer or calculate entitlements
- Gate features based on plan assumptions

Frontends may:
- Display pricing and plan information
- Surface billing state from the billing service
- Delegate checkout and payment UX to the billing domain or payment provider

All entitlement decisions are enforced by backend services via the billing domain.

---

## Frontend AI Strategy

AI logic lives in services, not in the frontend.

Frontends may:
- Trigger AI actions via service APIs
- Render streaming responses
- Provide UX for tool approvals and confirmation flows

Frontends must not:
- Compose prompts directly
- Maintain hidden AI behavior
- Store model keys or provider credentials

Frontends provide UX around AI, not AI itself.

---

## Cohesive UX Across Multiple Services

A client app may integrate multiple services while still feeling like one product.

Key strategies:
- Shared navigation and layout
- Unified identity and authentication
- Cross-service correlation IDs for observability
- Unified notifications and activity feed
- Consistent patterns for approvals and AI actions

The user experiences “one app” even though services are separate.

---

## Client Customization Strategy

Client customizations should be handled via:
- Configuration
- Feature flags
- Theming and branding packages
- Tenant-scoped settings

Avoid branching logic everywhere.

Preferred pattern:
- Put shared logic in packages
- Put client-specific overrides in the client app only

Client-specific logic must not pollute shared packages.

---

## Handling Client-Specific Backend Needs

If a client requires custom backend behavior:
- Prefer configuration first
- If truly unique, create a client-specific module in the relevant service

Recommended pattern:
- `/services/<service>/domain/client-overrides/<client-name>`

Rules:
- Overrides must be minimal
- Overrides must be documented
- Overrides must not break shared behavior

Avoid creating separate services for minor client differences.

---

## Security and Compliance in Frontends

Frontends must:
- Never store secrets
- Enforce secure session handling
- Avoid logging sensitive data
- Respect compliance-mode UX constraints (for example: PHI redaction)

Frontends must treat all data as potentially sensitive.

Frontend applications must support GDPR-required user flows, including:
- Data access requests
- Data export
- Data deletion requests
- Consent acknowledgment where applicable

These are implemented at the application level, backed by service APIs.

---

## Summary

The frontend strategy uses two complementary frontend types:

- Product frontends: reusable service UIs
- Client frontends: composite, customized deployments

Frontends remain thin:
- Services own logic and AI
- SDKs define contracts
- Shared UI packages enable reuse

This strategy maximizes speed, reuse, and long-term scalability without coupling.