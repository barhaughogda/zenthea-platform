# ADR-008: Monetisation and Billing

## Status

Accepted

---

## Date

2026-01-04

---

## Context

The platform is designed to support:
- Multiple services and domains
- Multiple clients and tenants
- Usage-based and subscription-based pricing
- AI-driven workflows that may incur cost
- US and EU markets with regulatory requirements

Monetisation introduces:
- Financial side effects
- Legal and tax obligations
- Customer trust and audit requirements
- Security and fraud risks

Historically, systems fail when:
- Billing logic is embedded in product services
- Payment providers become the system of record
- AI agents are allowed to influence payments directly
- Entitlements and pricing are scattered across codebases

A clear architectural decision was required to define:
- Where billing logic lives
- How services interact with monetisation
- The role of payment providers (for example Stripe)
- How AI is constrained around financial actions

---

## Decision

We adopt a **centralized billing and monetisation domain** with a strict execution boundary.

This means:
- Billing is implemented as a dedicated domain service
- Product and domain services never charge money directly
- Services report usage; billing decides charges
- Payment providers (for example Stripe) execute payments only
- AI agents never initiate or execute financial actions

Monetisation is enforced centrally, not distributed.

---

## Rationale

### 1. Separation of Concerns

Billing is not a feature. It is a platform capability.

Centralizing billing:
- Prevents duplication of pricing logic
- Avoids inconsistent entitlements
- Makes audits and compliance feasible
- Simplifies future pricing changes

Product services remain focused on their domains.

---

### 2. Safety and Trust

Financial actions are high-risk.

This architecture ensures:
- Explicit control over all charges
- Clear approval paths
- Full auditability
- Reduced blast radius of errors

Trust is preserved by design, not by policy.

---

### 3. Provider Independence

Payment providers evolve and vary by region.

By isolating providers:
- Stripe (or alternatives) can be swapped
- Multiple providers can coexist
- Provider outages are contained

Payment providers are executors, not authorities.

---

### 4. AI Governance

AI systems are powerful but unpredictable.

This decision ensures:
- AI cannot charge customers
- AI cannot change pricing or plans
- AI cannot modify billing data
- AI may only propose monetisation-related actions for human approval

This is a hard safety boundary.

---

### 5. Scalability and Flexibility

The model supports:
- Subscriptions
- Usage-based billing
- Seat-based pricing
- Feature gating
- Enterprise contracts

Without re-architecting the platform.

---

## Billing Domain Responsibilities

The billing domain owns:
- Plans and pricing models
- Entitlements and feature access
- Usage aggregation and metering
- Invoicing and receipts
- Payment execution coordination
- Refunds and credits
- Billing-related audit logs

The billing domain is the source of truth for monetisation.

---

## Service Responsibilities

Domain services:
- Report usage events
- Query entitlements
- Enforce access based on billing decisions
- Remain unaware of pricing details

Services never:
- Calculate charges
- Call payment providers
- Store payment credentials

---

## Payment Provider Role (for example Stripe)

Payment providers:
- Execute payments
- Manage subscriptions and invoices
- Handle taxes where applicable
- Emit webhooks for payment events

Payment providers do NOT:
- Define pricing logic
- Decide entitlements
- Gate feature access
- Replace billing domain authority

Stripe is infrastructure, not architecture.

---

## AI and Monetisation

AI agents:
- May surface cost implications
- May summarize usage or billing data
- May propose monetisation-related actions

AI agents may NEVER:
- Initiate payments
- Modify plans or pricing
- Apply credits or refunds
- Trigger irreversible financial actions

Any monetisation-related AI proposal requires human approval.

---

## Compliance and Regulatory Impact

This decision supports:
- GDPR requirements (data minimization, auditability)
- Tax and invoicing regulations
- Financial audit requirements
- Clear separation of financial data

Billing data is treated as sensitive and protected accordingly.

---

## Alternatives Considered

### Alternative 1: Billing Logic Embedded in Services

**Description**
- Each service handles its own pricing and payments

**Why it was rejected**
- Duplicated logic
- Inconsistent behavior
- High risk of errors
- Impossible to audit cleanly

This approach does not scale.

---

### Alternative 2: Stripe as Source of Truth

**Description**
- Stripe products and plans define system behavior

**Why it was rejected**
- Tight vendor lock-in
- Limited flexibility
- Poor integration with domain logic
- Difficult AI governance

Stripe should not own business logic.

---

### Alternative 3: AI-Driven Billing Decisions

**Description**
- AI dynamically decides pricing or charges

**Why it was rejected**
- Unacceptable financial risk
- Non-compliant
- Non-auditable
- Breaks trust immediately

This is explicitly prohibited.

---

## Consequences

### Positive Consequences

- Clear monetisation boundaries
- Safer financial operations
- Easier audits and compliance
- Flexible pricing evolution
- Strong customer trust

---

### Negative Tradeoffs

- Additional domain to design and maintain
- Slightly more upfront complexity
- Requires disciplined usage reporting

These tradeoffs are intentional and justified.

---

## Implementation Notes

- Billing is implemented as a dedicated service
- Services emit usage events, not charges
- Payment providers are integrated via a gateway
- Webhooks are validated and audited
- Violations of this model are treated as defects

Monetisation logic must remain centralized.

---

## Related Documents

- `/docs/10-decisions/adr-003-ai-runtime-abstraction.md`
- `/docs/10-decisions/adr-007-external-tool-orchestration.md`
- `/docs/05-ai/tool-proposal-model.md`
- `/docs/06-frontends/frontend-strategy.md`
- `/docs/07-devops/external-tool-orchestration.md`

---

## Reviewers

- Øystein B

---

## Notes

This ADR deliberately constrains monetisation to protect trust, safety, and long-term scalability.