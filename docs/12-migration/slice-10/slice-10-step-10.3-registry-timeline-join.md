# Slice 10 – Step 10.3: Registry + Timeline Join (Read-Only Views)

## Status
Planned

## Purpose
Provide enriched, read-only governance views by joining:
- Governance Timeline events
- Agent Registry metadata

This enables operators to understand **who** generated events and **under which lifecycle context**, without exposing sensitive data or enabling control actions.

---

## Scope
- Read-only joins only
- Metadata-only
- Deterministic
- Derived views, no persistence

---

## Explicit Non-Goals
- No writes
- No approvals
- No lifecycle transitions
- No tenant or actor scoping
- No PHI or PII
- No free-text notes

---

## Join Keys
The join MUST only occur on:
- agentVersion
- policySnapshotHash

No other identifiers are permitted.

---

## Output Model
Each enriched timeline entry MAY include:
- timelineEvent (sanitized)
- agent:
  - agentId
  - agentVersion
  - agentType
  - lifecycleState
  - allowedScopes
- policySnapshotHash
- timestamp

---

## Security Constraints
- MUST NOT include tenantId
- MUST NOT include actorId
- MUST NOT include requestId
- MUST NOT include idempotency keys
- MUST NOT include payloads
- MUST NOT include free-form strings

---

## Determinism
- Ordering MUST be stable
- Missing registry entries MUST degrade gracefully
- Unknown agents MUST be represented as `unknown`

---

## Verification Requirements
- Tests for successful joins
- Tests for missing registry entries
- Tests asserting forbidden fields never appear
- Snapshot hash correlation verified

---

## Outcome
Operators gain a safe, contextual governance timeline without expanding the attack surface or introducing control paths.