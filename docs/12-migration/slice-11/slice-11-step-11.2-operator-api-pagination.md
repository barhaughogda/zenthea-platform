# Slice 11 – Step 11.2: Operator API Pagination & Cursors (Read-Only)

## Status
Planned

## Purpose
Introduce deterministic, audit-safe pagination for operator-facing read-only APIs.

This enables safe consumption of large governance datasets without exposing control paths or sensitive identifiers.

---

## Scope
- Cursor-based pagination only
- Deterministic ordering
- Read-only
- Metadata-only

---

## Explicit Non-Goals
- No offset-based pagination
- No writes
- No filtering on sensitive fields
- No free-text search
- No mutation capabilities

---

## Design Principles
- Cursors MUST be opaque
- Cursors MUST be deterministic
- Pagination MUST be stable across calls
- Ordering MUST be explicit and documented

---

## APIs in Scope
- Governance Timeline
- Enriched Timeline (Registry + Timeline)
- Agent Registry (optional pagination if needed)

---

## Cursor Design
- Cursor is derived from:
  - timestamp
  - stable secondary key (if required)
- Cursor MUST NOT encode:
  - tenantId
  - actorId
  - requestId
  - idempotency keys
- Cursor MAY be base64 encoded

---

## Response Contract
Paginated responses MUST include:
- items (current page)
- nextCursor (nullable)
- hasMore (boolean)
- count (items returned)

---

## Security Constraints
- MUST NOT expose tenantId
- MUST NOT expose actorId
- MUST NOT expose requestId
- MUST NOT expose payloads
- MUST NOT expose internal identifiers

---

## Verification Requirements
- Tests for pagination stability
- Tests for cursor correctness
- Tests asserting forbidden fields never appear
- Tests for boundary conditions (start, middle, end)

---

## Outcome
Operator APIs scale safely to large datasets while preserving auditability, determinism, and security.