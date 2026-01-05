# Slice 04 – Step 04.3: Deterministic Abuse Signal Engine

Status: Completed  
Owner: Platform Architecture  
Phase: Observability & Abuse Controls  
Prerequisite: Slice 04.2 (Metrics & Counters) complete and locked

---

## Purpose

Introduce a **deterministic, non-blocking abuse signal layer** for the Tool Gateway.

This step detects suspicious or abusive patterns and emits **signals only**.
It does NOT enforce, block, or alter system behavior.

This creates visibility and prepares the platform for future automation without risk.

---

## Core Principles

- Deterministic rules only
- Metadata-driven, zero PHI
- Signal ≠ enforcement
- Explicit thresholds
- Fully reversible and isolated

---

## In Scope

- Deterministic rule evaluation
- Abuse signal emission
- Severity classification
- Structured, metadata-only output

---

## Out of Scope

- Automatic blocking
- Feature flag mutation
- Rate-limit changes
- UI changes
- ML-based detection
- Background jobs
- PHI inspection

---

## Input Signals

Rules operate on **recent Tool Gateway outcomes**, derived from:
- Telemetry events (Slice 04.1)
- Metrics counters (Slice 04.2)

No payload inspection allowed.

---

## AbuseSignalEvent

Each triggered rule emits an event with:

- ruleId
- severity (low | medium | high)
- toolName (optional)
- actorType
- windowMs
- observedCount
- threshold
- timestamp

🚫 MUST NOT include:
- actorId
- tenantId
- payloads
- request identifiers

---

## Initial Ruleset (Mandatory)

### Rule A: Excessive Rate Limiting
Trigger when:
- RATE_LIMITED ≥ 10 times
- Within 5 minutes
- Per actorType + toolName

Severity: medium

---

### Rule B: Repeated Forbidden Attempts
Trigger when:
- FORBIDDEN ≥ 5 times
- Within 10 minutes
- Same toolName

Severity: high

---

### Rule C: Writes While Disabled
Trigger when:
- Write tools invoked
- Feature flag disabled
- ≥ 1 occurrence

Severity: high

---

### Rule D: Idempotency Conflicts
Trigger when:
- CONFLICT ≥ 5
- Within 10 minutes
- Same toolName

Severity: low

---

## Evaluation Model

- Synchronous evaluation at gateway boundary OR
- Lightweight in-memory sliding window
- No persistence required
- No cross-process coordination

---

## Emission Rules

- Emit at most one signal per rule per evaluation window
- Signals must never throw
- Signals must not affect control flow

---

## Logging & Observability

- Abuse signals may be logged
- Logs must be metadata-only
- No PHI
- No payloads

---

## Validation Requirements

- pnpm lint passes
- pnpm typecheck passes
- No PHI introduced
- No behavior changes
- Deterministic outcomes verified

---

## Completion Criteria

Step 04.3 is complete when:
- All rules implemented
- AbuseSignalEvent emitted correctly
- Signals observable in logs or dev output
- No enforcement or blocking occurs
- Tool behavior remains unchanged

---

## Notes

This layer is intentionally conservative.
False positives are acceptable.
False negatives are acceptable.
Silent enforcement is not.