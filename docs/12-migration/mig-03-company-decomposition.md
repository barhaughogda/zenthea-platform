# MIG-03 — Company Route Decomposition (Conceptual)

## Purpose

This document **conceptually decomposes** the legacy “company” route (a single, mixed-responsibility area in the legacy repo) into future platform apps and services.

**This is not a code migration plan.** No code is being moved in MIG-03. The goal is to establish a target decomposition that enables modular delivery, independent evolution, and clearer security/compliance boundaries.

## Context: What “company” contained in the legacy system

In the legacy repo, the “company” route acted as a *catch-all* for:

- Provider/clinician workflows (day-to-day portal UX)
- Messaging (patients, internal team, notifications)
- Appointments (scheduling, calendars, booking operations)
- Billing and accounting (invoicing, payments, reconciliation)
- Reports/analytics (operational and financial reporting)
- Company settings (organization configuration, staff, permissions, templates)

These responsibilities were colocated despite different lifecycles, data sensitivity, scaling characteristics, and stakeholder ownership.

## Why the legacy “company” route is an anti-pattern in a platform architecture

A single route that bundles multiple product domains is an anti-pattern because it:

- **Blurs bounded contexts**: Messaging, scheduling, billing, and reporting are distinct domains with different concepts, invariants, and terminology. Co-location leads to conceptual coupling and ambiguous ownership.
- **Creates release coupling**: A change in one area (e.g., billing) risks regressions in unrelated areas (e.g., appointments) because they share UI, routing, dependencies, and build/deploy pipelines.
- **Amplifies security and compliance risk**: Domain mixing increases the blast radius of vulnerabilities and makes least-privilege access harder (especially relevant in regulated healthcare contexts).
- **Encourages “big ball of mud” growth**: Cross-domain shortcuts (shared state, shared tables/models, shared UI primitives in the wrong layer) accumulate quickly and become difficult to unwind.
- **Blocks independent scaling**: Different workloads scale differently (messaging throughput vs. reporting workloads vs. scheduling contention). A unified surface drives over-provisioning or contention.
- **Complicates operability**: Observability, incident response, and SLOs become unclear when multiple domains share the same route, logs, and failure modes.
- **Reduces product clarity**: Users and internal teams lose a clear mental model of “where” a capability lives, making navigation and governance harder.

In a platform architecture, we prefer **clear app boundaries**, each representing a coherent domain surface, with explicit contracts between them.

## Target decomposition: future apps (conceptual)

The platform target is a **portfolio of focused apps** rather than a single “company” route. These apps may share design system components and platform services, but they should not share domain ownership.

### 1) `provider-portal` (primary shell for clinicians)

- **Purpose**: The primary clinician-facing experience (the “home” for providers) that provides navigation, identity/session context, and a coherent UX for provider workflows.
- **Why it should be its own app**:
  - It is a first-class product surface with unique UX expectations and operational importance.
  - It should evolve independently from domain-heavy applications like billing or reporting.
  - It can act as the **shell** that composes or links to other domain apps without embedding their full responsibilities.
- **MIG-03 scope**: **In scope.** MIG-03 will implement **only** `provider-portal` as the shell (see “MIG-03 scope statement”).

### 2) `messaging` (future app)

- **Purpose**: Patient/provider and internal team messaging, conversation management, inbox/work queues, templates, notifications, and message-related compliance controls.
- **Why it should be its own app**:
  - Messaging is a distinct bounded context with unique rules (deliverability, auditability, retention, consent, escalation).
  - Often requires different scalability patterns (throughput, real-time/near-real-time behavior).
  - Access controls frequently differ from scheduling or billing; separation reduces blast radius.
- **MIG-03 scope**: **Deferred.** Defined here as a target boundary only.

### 3) `appointments` (future app)

- **Purpose**: Scheduling and appointment operations (calendars, availability, booking flows, rescheduling/cancellations, reminders, clinic capacity management).
- **Why it should be its own app**:
  - Scheduling is its own domain with strong invariants (time, availability, conflicts, policies).
  - Operational patterns differ (high read/write contention around calendars, time-based workflows).
  - Clear separation improves correctness and makes future integrations (external calendars, booking channels) easier.
- **MIG-03 scope**: **Deferred.** Defined here as a target boundary only.

### 4) `billing/accounting` (future app)

- **Purpose**: Invoicing, payments, reimbursements, credits/adjustments, reconciliation, financial reporting, and accounting-oriented workflows.
- **Why it should be its own app**:
  - Finance and accounting form a distinct domain with stringent audit requirements and specialized lifecycle.
  - Risk profile is higher (money movement, fraud, compliance), demanding tighter isolation and governance.
  - Allows separate ownership and cadence from clinical workflow features.
- **MIG-03 scope**: **Deferred.** Defined here as a target boundary only.

### 5) `reports/analytics` (future app)

- **Purpose**: Operational dashboards and analytics across domains (utilization, outcomes, throughput, finance summaries), with curated metrics and export capabilities.
- **Why it should be its own app**:
  - Reporting is primarily read-heavy and aggregation-focused; it benefits from different data access patterns and performance strategies.
  - Separating reporting prevents analytical concerns from leaking into transactional UX and data models.
  - Enables clear SLOs and access governance for sensitive reporting views.
- **MIG-03 scope**: **Deferred.** Defined here as a target boundary only.

### 6) `company-settings` (stays inside `provider-portal` for now)

- **Purpose**: Organization configuration (branding, clinic details, staff management, roles/permissions, templates, operational settings).
- **Why it is *not* its own app (yet)**:
  - Settings are typically low-traffic and best experienced as part of the primary portal context.
  - Keeping it inside the `provider-portal` reduces navigation complexity early, while still allowing future extraction if/when settings become large enough to justify it.
  - This boundary can be revisited once other domain apps mature and the platform has stable cross-app navigation patterns.
- **MIG-03 scope**: **In scope as part of `provider-portal`.** It remains embedded in the portal for now.

## MIG-03 scope statement (explicit)

**MIG-03 will ONLY implement `provider-portal` as a shell.**

This means MIG-03 establishes a clinician-facing portal surface with navigation and “home” for provider workflows, and it is the place where `company-settings` lives initially.

All other decomposed apps listed above are **target-state boundaries** documented here, but are **not** implemented in MIG-03.

## What we are NOT doing yet

To avoid accidental scope creep, MIG-03 explicitly does **not**:

- **Migrate legacy code** from the “company” route into new apps
- **Implement domain apps**: `messaging`, `appointments`, `billing/accounting`, `reports/analytics`
- **Rebuild domain workflows** (scheduling flows, inbox/work queues, invoicing, analytics dashboards)
- **Define final service boundaries** (microservices vs. modular monolith decisions) or data storage patterns
- **Create cross-app orchestration** beyond what a shell needs (e.g., deep integrations, unified domain state)
- **Re-platform reporting pipelines** or introduce warehouse/OLAP infrastructure
- **Finalize authorization models** per domain (beyond what is minimally required to conceptualize boundaries)
- **Commit to a single UI composition strategy** for all future apps (embedding vs. linking vs. federation); this remains a later architectural decision once `provider-portal` exists as an anchor

## Notes on intent

This decomposition is designed to enforce:

- **Clear ownership** per domain surface
- **Independent delivery** and risk containment
- **Better security posture** via separation of concerns
- **A platform-aligned evolution path** from legacy co-location to modular, bounded capabilities

