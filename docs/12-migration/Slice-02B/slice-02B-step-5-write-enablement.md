# Slice 02B – Step 5: Controlled Write Enablement

**Phase:** Migration  
**Slice:** 02B – Patient Portal  
**Step:** 5  
**Status:** Planned  
**Prerequisite:** Slice 02B Step 4 completed and consolidated (read-only integrations verified, build green)

---

## Purpose

This step introduces **controlled, auditable, reversible write capabilities** to the Patient Portal.

The objective is to:
- Prove end-to-end write flows
- Preserve compliance (HIPAA/GDPR)
- Minimize blast radius
- Maintain strict architectural control

Writes are introduced **incrementally**, **one domain at a time**, and **only through the Tool Gateway**.

---

## Core Principle

> **No agent writes directly. All writes go through Tool Gateway tools.**

This ensures:
- Centralized policy enforcement
- Unified audit logging
- Consistent error contracts
- Kill-switch control
- Idempotency guarantees

---

## Global Non-Negotiables

- All writes are user-triggered
- No autonomous or background writes
- No EHR writes in this step
- No auth model changes
- No UI redesigns
- Feature-flagged and runtime-configurable
- Fully reversible without redeploy

If any of these are violated, the step must stop.

---

## Write Enablement Order

Writes are enabled in the following strict order:

1. **Consent writes** (Step 5.1)
2. **Messaging writes** (Step 5.2)
3. **Appointment request writes** (Step 5.3)

Medical Advisor Agent remains **read-only / advisory-only**.

---

## Step 5.1 – Consent Writes (This Step)

### Allowed Operations
- createConsent
- revokeConsent
- updateConsentPreferences

### Forbidden
- Any clinical record modification
- Any EHR persistence
- Any cross-patient actions
- Any background or scheduled execution

---

## Tool Gateway Requirements (Writes)

All consent write operations must be implemented as **Tool Gateway tools** and must enforce:

### Identity & Authorization
- Authenticated actor required
- Patient can only act on their own records
- Consent scope validated before execution

### Validation
- Input validation at tool boundary (Zod or equivalent)
- Explicit schema per operation

### Idempotency
- Idempotency key required on every write
- Duplicate requests must not cause duplicate writes

### Audit
For every write attempt (success or failure), record:
- tenantId
- userId
- patientId
- action name
- timestamp
- idempotencyKey
- outcome (success or error code)

Audit data may contain PHI.  
Application logs must not.

### Logging
- Structured logs only
- No PHI in logs
- Logs at tool boundary only

---

## Feature Flags

Each write domain must have an explicit kill switch.

For Step 5.1:
- USE_CONSENT_WRITES

Rules:
- Default: false
- Runtime overridable
- Turning off immediately restores read-only behavior

---

## Error Contracts (Stable)

All write tools must return one of the following error codes:

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

- Patient Portal must call **Tool Gateway**, not agents directly
- Existing UI contracts must remain unchanged
- Existing UI behavior preserved
- Writes enabled only behind feature flag
- No new UI flows unless strictly required

---

## Step 5 Completion Criteria

Step 5.1 is considered complete when:
- Consent writes are enabled through Tool Gateway
- All writes are audited and idempotent
- Feature flag can disable writes instantly
- pnpm lint, pnpm typecheck, pnpm build all pass
- Single commit produced for Step 5.1

---

## Next Steps

After Step 5.1 completion and review:
- Proceed to Step 5.2: Messaging write enablement
- Follow the same Tool Gateway-first, flag-guarded approach