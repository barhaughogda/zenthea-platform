# Slice 11 – Operator APIs (Read-Only)

## Status
Planned

## Purpose
Expose governance observability primitives as stable, read-only APIs for operators, auditors, and internal tooling.

This slice introduces **no new control paths** and **no mutation capabilities**.

---

## Scope
The following read-only APIs are exposed:
- Governance Timeline
- Agent Registry
- Registry + Timeline Joined Views

All APIs are:
- Metadata-only
- Deterministic
- Versioned
- Read-only

---

## Explicit Non-Goals
- No writes
- No lifecycle transitions
- No approvals
- No tenant scoping
- No PHI or PII
- No free-text filters
- No bulk export yet

---

## API Design Principles
- Read-only interfaces only
- Explicit versioning
- Strict output allowlists
- Stable ordering
- Predictable pagination (if applicable)

---

## Endpoints (Conceptual)
- GET /operator/governance/timeline
- GET /operator/agents
- GET /operator/governance/timeline/enriched

These endpoints are **internal-only** and not exposed to patients or providers.

---

## Security Constraints
- MUST NOT expose tenantId
- MUST NOT expose actorId
- MUST NOT expose requestId
- MUST NOT expose idempotency keys
- MUST NOT expose payloads
- MUST NOT allow filtering on sensitive fields

---

## Verification Requirements
- Type-safe handlers
- Tests asserting read-only behavior
- Tests asserting forbidden fields never appear
- Versioned response contracts

---

## Outcome
Operators gain safe, structured, and auditable access to governance state without expanding the platform’s attack surface.