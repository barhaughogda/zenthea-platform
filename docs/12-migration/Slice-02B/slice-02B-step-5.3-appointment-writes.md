# Slice 02B – Step 5.3: Appointment Request Write Enablement

**Phase:** Migration  
**Slice:** 02B – Patient Portal  
**Step:** 5.3  
**Status:** Planned  
**Prerequisite:** Step 5.1 (Consent Writes) and Step 5.2 (Messaging Writes) completed, sealed, and merged

---

## Purpose

This step enables **patient-initiated appointment request writes** with the smallest possible operational footprint.

The goal is to allow patients to:
- Request an appointment
- Cancel an appointment request

Without introducing:
- Automatic booking
- Provider-side commitments
- Scheduling guarantees
- EHR writes
- Background workflows

This step intentionally models **requests**, not confirmed bookings.

---

## Core Principle

> **Appointment writes represent intent only, not scheduling authority.**

All writes are mediated exclusively through the Tool Gateway.

---

## Allowed Operations

- appointment.requestAppointment
- appointment.cancelAppointment

---

## Explicitly Forbidden

- Reschedule flows
- Provider confirmation or acceptance
- Calendar synchronization
- Auto-booking
- Background jobs or retries
- Any EHR writes
- Any provider-side workflows

---

## Feature Flags

Introduce a dedicated kill switch:

- USE_APPOINTMENT_WRITES

Rules:
- Default: false
- Runtime overridable
- Disabling restores read-only behavior immediately

---

## Tool Gateway Requirements

Appointment write operations must be implemented as Tool Gateway tools and must enforce:

### Identity & Authorization
- Authenticated actor required
- Patient ownership validation
- Consent scope verified

### Validation
- Zod (or equivalent) validation at tool boundary
- Explicit schemas per operation

### Idempotency
- Required idempotency key on every write
- Duplicate requests must not create duplicate appointment requests

### Rate Limiting
- Per-user: max 3 requestAppointment per 10 minutes
- Per-user: max 10 cancelAppointment per 10 minutes
- Return RATE_LIMITED on violation
- No retries or background queues

### Audit
For every write attempt:
- tenantId
- userId
- patientId
- appointmentRequestId (if available)
- action name
- timestamp
- idempotencyKey
- outcome (success or error code)

Audit store may contain PHI.  
Application logs must not.

### Logging
- Structured logs only
- Metadata only
- Zero PHI in application logs

---

## State Model

This step introduces a **request-based model**:

- requestAppointment creates a pending request
- cancelAppointment cancels an existing request
- No confirmation, acceptance, or scheduling occurs here

If the UI does not currently support displaying request state:
- Writes remain API-ready behind the feature flag
- No UI expansion is required in this step

---

## Error Contracts (Stable)

Appointment write tools must return one of:

- UNAUTHORIZED
- FORBIDDEN
- CONSENT_REQUIRED
- CONFLICT
- VALIDATION_FAILED
- RATE_LIMITED
- UPSTREAM_UNAVAILABLE

The UI must react only to these codes.

---

## Patient Portal Integration Rules

- Patient Portal calls Tool Gateway only
- No direct calls to appointment-booking-agent for writes
- Existing UI behavior preserved
- Writes enabled only behind USE_APPOINTMENT_WRITES
- Reads remain unchanged

---

## Completion Criteria

Step 5.3 is complete when:
- Appointment write tools exist in Tool Gateway
- Patient Portal routes writes via Tool Gateway
- Idempotency, audit, and rate limiting enforced
- Feature flag disables writes instantly
- pnpm lint, pnpm typecheck, pnpm build all pass
- Single commit produced for Step 5.3

---

## Post-Step

After Step 5.3 completion:
- Slice 02B write enablement is complete
- Patient Portal migration exits write enablement phase
- Further writes require a new slice