# Slice 02B – Step 5.2: Messaging Write Enablement

**Phase:** Migration  
**Slice:** 02B – Patient Portal  
**Step:** 5.2  
**Status:** Planned  
**Prerequisite:** Step 5.1 (Consent Writes) completed, sealed, and merged

---

## Purpose

This step enables **patient-initiated messaging writes** while preserving strict control, safety, and auditability.

The goal is to allow patients to:
- Create conversations
- Send messages

Without introducing:
- Autonomy
- Background behavior
- Clinical actions
- Uncontrolled communication

---

## Core Principle

> **Messaging writes are user-triggered only and enforced exclusively via Tool Gateway.**

No app or agent may write directly.

---

## Allowed Operations

- createConversation
- sendMessage

---

## Explicitly Forbidden

- AI-initiated messages
- Auto replies or follow-ups
- Background jobs or queues
- Provider workflows
- Any EHR writes
- Any clinical decision-making

Medical Advisor remains read-only.

---

## Feature Flags

Introduce a dedicated kill switch:

- USE_CHAT_WRITES

Rules:
- Default: false
- Runtime overridable
- Disabling restores read-only behavior immediately

---

## Tool Gateway Requirements

Messaging write operations must be implemented as Tool Gateway tools and must enforce:

### Identity & Authorization
- Authenticated actor required
- Patient ownership validation
- Consent scope verified

### Validation
- Zod (or equivalent) validation at tool boundary
- Explicit schemas per operation

### Idempotency
- Required idempotency key on every write
- Duplicate requests must not create duplicate messages

### Rate Limiting & Abuse Protection
- Per-user rate limits
- Per-conversation rate limits
- Burst protection
- Hard failure with RATE_LIMITED error

No retries. No background queuing.

### Audit
For every write attempt, the **audit store** must record:
- tenantId
- userId
- patientId
- conversationId (if available)
- action name
- timestamp
- idempotencyKey
- outcome (success or error code)
- **Full request payload** (including message content)

**Storage Rules:**
- **Audit Store:** May contain PHI. Payloads are persisted ONLY here.
- **Application Logs:** MUST NEVER contain payloads or PHI.

### Logging
- Structured logs only.
- **Metadata only:** Logs must include IDs (tenantId, userId, commandId), action name, and outcome.
- **Zero PHI:** MUST NOT include payloads, message content, or patient names.
- Logs at tool boundary only.

---

## Error Contracts (Stable)

Messaging write tools must return one of:

- UNAUTHORIZED
- FORBIDDEN
- CONSENT_REQUIRED
- CONFLICT
- VALIDATION_FAILED
- RATE_LIMITED
- UPSTREAM_UNAVAILABLE

UI logic must react only to these codes.

---

## Patient Portal Integration Rules

- Patient Portal calls Tool Gateway, not chat agent directly
- Existing UI behavior preserved
- Enable existing send actions behind feature flag
- No UI redesigns
- Reads remain unchanged

---

## Completion Criteria

Step 5.2 is complete when:
- Messaging writes flow through Tool Gateway
- Rate limits are enforced
- Audit events recorded for every write
- Feature flag disables writes instantly
- pnpm lint, pnpm typecheck, pnpm build all pass
- Single commit produced for Step 5.2

---

## Next Step

After Step 5.2 completion and review:
- Proceed to Step 5.3: Appointment Request Writes