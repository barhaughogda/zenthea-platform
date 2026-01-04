# Billing and Monetisation

## Purpose

This document defines the **billing and monetisation domain** of the platform.

It explains:
- What the billing service is responsible for
- How other services interact with billing
- How usage, entitlements, and plans work
- The role of payment providers (for example Stripe)
- How compliance, safety, and AI constraints are enforced

This document answers the question:  
**“How does the platform charge money safely, consistently, and at scale?”**

---

## Core Principles

Billing and monetisation follow these principles:

- Billing is a dedicated domain
- Product services never charge money directly
- Usage is reported, not priced, by services
- Entitlements are checked, not inferred
- Payments are executed externally
- AI never performs financial actions
- Compliance and auditability are first-class

Monetisation is centralized by design.

---

## Billing as a Domain Service

Billing is implemented as a **dedicated service** with clear ownership.

### Billing Domain Responsibilities

The billing service owns:

- Plans and pricing models
- Entitlements and feature access
- Usage aggregation and metering
- Subscription state
- Invoicing and receipts
- Payment coordination
- Refunds and credits
- Billing audit logs

The billing service is the **source of truth** for monetisation.

---

## What Billing Does NOT Own

The billing service does NOT:

- Implement product logic
- Enforce business rules inside other domains
- Decide when actions occur
- Execute user workflows
- Interpret user intent

Billing is authoritative over money, not behavior.

---

## Interaction Model with Other Services

### Usage Reporting

Domain services:
- Emit usage events
- Include tenant and service identifiers
- Do not apply pricing logic
- Do not aggregate costs locally

Usage events are:
- Declarative
- Append-only
- Auditable

Billing decides how usage maps to charges.

---

### Entitlement Checks

Before performing monetized actions, services may:
- Query billing for entitlements
- Enforce allow or deny decisions
- Degrade gracefully when access is denied

Services do not:
- Cache pricing logic
- Infer access from plan names
- Hardcode limits

Entitlements are always checked centrally.

---

## Plans, Pricing, and Entitlements

### Plans

Plans define:
- Which services are available
- Which features are enabled
- Which usage limits apply
- Which billing model is used (subscription, usage-based, hybrid)

Plans are configuration, not code.

---

### Entitlements

Entitlements represent:
- What a tenant is allowed to do
- At what scale or frequency
- Under which constraints

Entitlements are enforced:
- At runtime
- Per request or action
- Independently of UI assumptions

---

## Usage-Based Billing

The platform supports usage-based billing by design.

Examples:
- AI token usage
- API calls
- Tool executions
- Seats or active users
- Domain-specific actions

Usage data must be:
- Accurate
- Idempotent
- Correlatable
- Auditable

Billing aggregates usage and applies pricing rules.

---

## Subscription Billing

Subscriptions are:
- Managed by the billing domain
- Executed via a payment provider
- Reflected in entitlements

Subscription lifecycle events:
- Creation
- Upgrade or downgrade
- Cancellation
- Renewal
- Suspension

Billing remains authoritative even if execution happens externally.

---

## Role of Payment Providers (for example Stripe)

Payment providers:
- Execute payments
- Manage invoices and receipts
- Handle tax calculation where applicable
- Emit payment lifecycle webhooks

Payment providers do NOT:
- Define pricing logic
- Decide entitlements
- Gate feature access
- Replace billing domain authority

Stripe is infrastructure, not business logic.

---

## Webhooks and External Events

Payment provider webhooks:
- Are validated cryptographically
- Are processed idempotently
- Update billing state only
- Never directly modify product services

Billing translates payment events into entitlement changes.

---

## AI and Monetisation Constraints

AI agents:
- May summarize billing data
- May explain pricing or plans
- May propose monetisation-related actions

AI agents may NEVER:
- Initiate payments
- Modify plans or pricing
- Apply credits or refunds
- Change entitlements
- Trigger irreversible financial actions

All monetisation actions require explicit system or human control.

---

## Frontend Responsibilities

Frontends:
- Display pricing and plan information
- Surface billing state to users
- Delegate checkout and payment UX to billing
- Never enforce entitlements locally

All authoritative decisions come from the billing domain.

---

## Compliance and Auditability

Billing must support:
- GDPR requirements (data minimization, access, erasure)
- Tax and invoicing regulations
- Financial audit requirements
- Clear separation of financial data

Billing data is treated as sensitive and protected accordingly.

---

## Failure and Recovery Considerations

Billing failures must:
- Fail safely
- Not block unrelated product functionality unnecessarily
- Be observable and alertable

Backup and recovery of billing data follow the global backup strategy.

---

## Anti-Patterns (Explicitly Disallowed)

The following are prohibited:
- Pricing logic in domain services
- Direct Stripe calls from services
- AI-triggered payments
- Hardcoded limits or plan names
- UI-enforced entitlements
- Silent billing failures

Violations are considered architectural defects.

---

## Summary

The billing and monetisation model ensures:
- Clear financial authority
- Safe and auditable charging
- Flexible pricing evolution
- Strong AI safety boundaries
- Long-term scalability

Services report usage.  
Billing decides charges.  
Payment providers execute payments.

This separation protects trust.