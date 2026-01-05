# Slice 02B – Step 4: Controlled Service Integration Plan

Scope: Patient Portal  
Status: Planned  
Owner: Platform Architecture  
Precondition: Step 3 completed and verified  
(UI stabilized, mocks isolated, contracts frozen)

---

## Purpose

Replace isolated frontend mocks with real backend services in a controlled, reversible, auditable manner.

This step proves that:
- The UI is truly decoupled
- Backend contracts are real, not aspirational
- Integration can happen without regressions or scope creep

---

## Core Principle

One service at a time. One direction only. Always reversible.

Breaking this rule means the step has failed.

---

## Integration Rules (Non-Negotiable)

Each integration must:
- Replace exactly one mock
- Touch one service only
- Preserve existing UI behavior
- Introduce zero new frontend logic
- Be fully revertible via feature flag or config
- Be verifiable in isolation

No exceptions.

---

## Explicit Non-Goals

This step does not include:
- Write operations to core datastores (EHR, patient DB)
- Multi-service orchestration
- Background jobs or async workers
- AI-driven behavior
- Cross-domain coupling
- Performance optimization

Correctness first. Speed later.

---

## Allowed Integration Order

Services are integrated in strict dependency order.

Example sequence (illustrative):
1. Identity / Auth Read Adapter
2. Patient Profile Read Service
3. Appointment Read Service
4. Document Metadata Service

Do not proceed until the previous service is fully validated.

---

## Integration Process (Per Service)

### Step 4.x.1 – Contract Verification

- Confirm API schema matches the mock contract exactly
- No new fields
- No removed fields
- No renamed fields
- Optional fields remain optional

If contract drift exists, integration stops.

---

### Step 4.x.2 – Adapter Implementation

- Implement a thin adapter layer
- Adapter translates service response to existing UI contract
- No business logic
- No data enrichment
- No retries, caching, or batching

Adapters exist to protect the UI.

---

### Step 4.x.3 – Controlled Swap

- Replace mock with real service behind a feature flag
- Default state remains mock-enabled
- Enable real service only in controlled environments

Rollback must be instant.

---

### Step 4.x.4 – Verification

Validation checklist:
- UI renders identically
- Error states behave as before
- Empty states behave as before
- No new network calls introduced
- No additional permissions requested

Any deviation is a failure.

---

### Step 4.x.5 – Lock-In

Once validated:
- Feature flag remains but defaults to real service
- Adapter is marked stable
- Contract is versioned and frozen
- Integration is documented

Only now may the next service begin.

---

## Observability Requirements

For each integrated service:
- Structured logs at adapter boundary
- Explicit error classification (network vs contract vs auth)
- Correlation ID propagated from frontend

Minimal observability. No noise.

---

## Rollback Strategy

Rollback must:
- Require no redeploy
- Be config or flag driven
- Restore mock behavior fully
- Leave no partial state

If rollback requires code changes, the integration is invalid.

---

## Definition of Done

This step is complete when:
- All planned read-only services are integrated
- UI behavior is unchanged from Step 3
- Every integration is independently reversible
- No cross-service coupling exists
- No write paths are exposed

The Patient Portal is now wired, not entangled.

---

## What This Unlocks Next

- Controlled introduction of write operations
- Permission hardening
- Performance optimization
- Auditable AI-assisted workflows

Only after this foundation holds.