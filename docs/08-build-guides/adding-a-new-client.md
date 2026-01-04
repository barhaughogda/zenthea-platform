# Adding a New Client

## Purpose

This document provides a step-by-step guide for adding a new client to the platform.

It explains:
- How to onboard a new client safely
- How to decide between configuration, overrides, and new frontends
- How to provision tenants, environments, and access
- How to handle client-specific needs without forking the system
- How to remain compliant, observable, and reversible

This document answers the question:  
**“How do we add a new client without creating long-term maintenance debt?”**

---

## Client Onboarding Philosophy

Adding a client is not a copy operation.

It is a **configuration and composition exercise**.

Rules:
- Reuse services wherever possible
- Avoid forks and duplication
- Prefer configuration over customization
- Preserve a single shared codebase

If adding a client requires copying code, the system design is wrong.

---

## Step 1: Classify the Client

Before touching code, classify the client along these dimensions:

- Industry and regulatory requirements
- Required services (chat, sales, accounting, etc.)
- Compliance mode (for example HIPAA)
- Scale expectations
- Custom UX requirements

Document this classification before proceeding.

---

## Step 2: Create the Tenant

Every client maps to a tenant.

Actions:
- Generate a unique tenant ID
- Define tenant metadata
- Assign compliance mode flags
- Define AI budgets and limits
- Define enabled services

Rules:
- Tenant creation is explicit
- Defaults must be safe and restrictive
- Tenant config must be auditable

No shared tenants. Ever.

---

## Step 3: Decide the Frontend Strategy

Choose one of the following:

### Option A: Use Existing Product UIs
- Fastest path
- Minimal customization
- Suitable for internal or early-stage clients

### Option B: Create a Client Frontend
- Required for branded or composite experiences
- Lives at `/apps/client-<client-name>`
- Composes multiple services into one app

Rules:
- Client frontends are preferred for real deployments
- Product UIs remain reference implementations

---

## Step 4: Configure Services for the Client

For each enabled service:
- Enable service access for the tenant
- Apply tenant-specific feature flags
- Configure AI models and limits
- Configure integrations (if approved)

Rules:
- No service forks
- No client-specific logic unless unavoidable
- All config changes must be auditable

---

## Step 5: Handle Client-Specific Backend Needs

If a client has special backend requirements:

### Preferred Options (in order)
1. Configuration
2. Feature flags
3. Policy rules
4. Client-specific domain overrides

Overrides live at:

/services//domain/client-overrides/

Rules:
- Overrides must be minimal
- Overrides must be documented
- Overrides must not break shared behavior

If overrides grow large, reconsider service boundaries.

---

## Step 6: Configure AI Behavior Per Client

AI behavior may vary by client.

Configurable aspects include:
- Model selection
- Prompt versions
- Tool availability
- Cost and rate limits
- Compliance constraints

Rules:
- AI config is tenant-scoped
- AI config is reversible
- AI config must not bypass policy

Never hardcode AI behavior per client.

---

## Step 7: Configure Integrations

If the client requires integrations:
- Verify vendor eligibility
- Confirm compliance requirements
- Enable integrations per tenant
- Configure credentials via secrets manager

Rules:
- No shared credentials across tenants
- No unapproved vendors
- Integration failures must be observable

---

## Step 8: Frontend Customization

Client frontends may customize:
- Branding and theming
- Navigation structure
- Feature visibility
- UX copy and tone

Rules:
- Customization must not affect service behavior
- No domain logic in UI
- No prompt logic in UI

Customization belongs in the client app only.

---

## Step 9: Data Migration and Initialization

If migrating data:
- Validate schemas
- Classify data (PHI, PII, etc.)
- Run migrations per service
- Verify tenant isolation

Rules:
- No cross-tenant data access
- Migrations must be reversible
- Test with non-production data first

---

## Step 10: Observability and Verification

Before go-live:
- Verify logs, metrics, and traces
- Verify AI cost tracking
- Verify tenant isolation
- Verify compliance mode behavior
- Run smoke tests across key workflows

If observability is missing, do not launch.

---

## Step 11: Staging and Rollout

Rollout strategy should include:
- Staging environment validation
- Tenant-scoped rollout
- Feature flag gating
- Monitoring during initial usage

Rules:
- No direct-to-production onboarding
- No silent launches

---

## Step 12: Documentation and Handoff

Update:
- Client configuration documentation
- Enabled services list
- Known overrides
- Support and escalation paths

Undocumented client differences become future incidents.

---

## Common Failure Modes

Avoid these mistakes:
- Forking services per client
- Hardcoding client behavior
- Skipping tenant isolation checks
- Mixing client data
- Over-customizing early

These failures scale badly.

---

## Summary

To add a client correctly:

- Treat clients as tenants, not forks
- Prefer configuration over customization
- Use client frontends for composition
- Keep AI behavior configurable and governed
- Verify observability and compliance before launch
- Document everything

Follow this guide and you can scale clients without scaling complexity.