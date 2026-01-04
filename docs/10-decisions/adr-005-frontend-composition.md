# ADR-005: Frontend Composition

## Status

Accepted

---

## Date

2026-01-04

---

## Context

The platform serves:
- Multiple backend services (service-per-domain)
- Multiple clients with different needs
- Both product-style UIs and client-specific applications
- AI-driven workflows that span domains

We need a frontend strategy that:
- Enables reuse without duplication
- Allows composition of multiple services into one cohesive UX
- Preserves backend authority and boundaries
- Scales across clients without forking
- Remains safe, observable, and compliant

A decision was required on **how frontends are structured and composed**.

---

## Decision

We adopt a **composed frontend architecture** with two explicit frontend types:

1. **Product Frontends (Per-Service UIs)**
2. **Client Frontends (Composite Applications)**

Composition occurs **only at the frontend layer**.  
Backend services remain independent and unaware of composition.

---

## Rationale

### 1. Preserve Service Boundaries

By composing at the UI layer:
- Services remain single-domain authorities
- No service depends on another service’s internals
- Cross-domain workflows are coordinated externally

This aligns with service-per-domain and prevents backend coupling.

---

### 2. Enable Reuse Without Forking

Product frontends:
- Act as reference implementations
- Provide reusable UI modules and patterns
- Accelerate delivery for new clients

Client frontends:
- Compose product UIs and shared components
- Apply branding, navigation, and workflow customization
- Avoid code duplication and forks

Reuse is achieved by composition, not copying.

---

### 3. Support Client Variability Cleanly

Clients differ in:
- Enabled services
- UX expectations
- Compliance constraints
- Branding and navigation

Client frontends allow:
- Configuration-driven variation
- Feature-flagged behavior
- Tenant-scoped composition

Backend services remain unchanged.

---

### 4. AI Workflow Transparency and Control

AI-driven workflows often span services.

Frontend composition enables:
- Clear UX for multi-step AI workflows
- Explicit user approvals and confirmations
- Transparent progress and explainability
- Consistent error handling across services

AI coordination belongs in the UI, not in backend coupling.

---

### 5. Independent Deployment and Scaling

With composed frontends:
- Each frontend app is independently deployable
- Frontend changes do not require backend redeploys
- Backend changes do not force frontend coupling

This reduces blast radius and improves velocity.

---

## What This Decision Enforces

- Frontends are thin consumers of services
- All backend access goes through typed SDKs
- Business logic remains in services
- AI logic remains in services
- Composition logic lives only in client frontends

Frontends orchestrate UX, not domain behavior.

---

## Alternatives Considered

### Alternative 1: Single Monolithic Frontend

**Description**
- One large frontend handling all services and clients

**Why it was rejected**
- Becomes unmaintainable quickly
- Hard to customize per client
- High risk of accidental coupling
- Slows iteration and deployment

This approach does not scale.

---

### Alternative 2: One Frontend Per Client Only

**Description**
- No reusable product UIs
- Each client frontend built from scratch

**Why it was rejected**
- Massive duplication
- Inconsistent UX
- High maintenance cost
- Slow onboarding of new clients

Reuse must be intentional and structural.

---

### Alternative 3: Backend-Orchestrated Composition

**Description**
- Backend services orchestrate cross-domain workflows
- UI becomes a thin shell

**Why it was rejected**
- Violates service-per-domain
- Creates hidden coupling
- Makes AI behavior harder to explain
- Reduces UX control and transparency

Composition belongs at the edge.

---

## Consequences

### Positive Consequences

- Clean separation of concerns
- High reuse with low duplication
- Scalable client onboarding
- Clear AI workflow UX
- Independent deployment

---

### Negative Tradeoffs

- Requires discipline in frontend boundaries
- Initial setup complexity is higher
- SDKs must be well-designed and maintained

These tradeoffs are intentional and manageable.

---

## Compliance and Security Impact

- Frontends do not hold secrets
- Sensitive logic remains server-side
- Compliance modes are enforced consistently
- UI applies redaction and approval flows where required

Composition does not weaken security posture.

---

## AI and Automation Impact

- AI actions are visible and explainable in the UI
- AI workflows can span services safely
- AI agents do not coordinate services directly

This supports safe, user-centered AI automation.

---

## Implementation Notes

- Product frontends live under `/apps/<service>-ui`
- Client frontends live under `/apps/client-<client-name>`
- Shared UI lives in `/packages/ui`
- Service access is via typed SDKs only
- Composition patterns are documented and enforced

Violations require an ADR.

---

## Related Documents

- `/docs/06-frontends/frontend-strategy.md`
- `/docs/06-frontends/composition-patterns.md`
- `/docs/08-build-guidelines/frontend-build-guide.md`

---

## Reviewers

- Øystein B

---

## Notes

This ADR ensures that frontend flexibility never compromises backend integrity.