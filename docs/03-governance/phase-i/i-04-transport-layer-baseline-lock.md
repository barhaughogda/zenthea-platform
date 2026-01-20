# Phase I.4: Transport Layer Baseline Lock

## 1. Preconditions Verification
- **Branch**: `main` (Verified)
- **Working tree**: Clean (Verified)
- **origin/main alignment**: Aligned/Up-to-date (Verified)

## 2. Scope of Lock
This document formally declares Phase I (Transport Layer) COMPLETE and LOCKED. The architecture, patterns, and invariants established are now immutable.

This lock applies to:
- HTTP transport only
- Fastify as the exclusive framework
- Clinical Note Authoring Transport as the reference implementation

## 3. Locked Architectural Invariants
The following invariants are locked and must be strictly maintained:
- Fastify is the only approved HTTP framework.
- One transport package per service slice.
- Transport layer may ONLY call the Service Layer.
- No imports from `ehr-core`.
- No imports from persistence adapters.
- No business logic in transport.
- No transaction handling.
- No implicit tenant or authority inference.
- Explicit tenantId and AuthorityContext extraction required.
- Fail-closed request handling.
- Deterministic error mapping.

## 4. Locked Error Mapping Contract
The HTTP mapping contract is frozen as follows:
- `ValidationError` → 400 Bad Request
- `AuthorityError` → 403 Forbidden
- `NotFoundError` → 404 Not Found
- `ConflictError` → 409 Conflict
- `InvariantError` → 422 Unprocessable Entity
- `PersistenceError` → 500 Internal Server Error
- Unknown errors → 500 Internal Server Error (generic message, no PHI/PII)

## 5. Security & Safety Guarantees
The following security guarantees are locked:
- No PHI/PII leakage in responses.
- No stack traces or internal details exposed in production.
- Cross-tenant access is impossible by construction.
- Fail-closed behavior on any ambiguity or authorization failure.

## 6. Explicitly Forbidden (Post-Lock)
The following are explicitly FORBIDDEN:
- Additional transport frameworks.
- GraphQL, RPC, WebSockets.
- Background jobs, queues, streaming within the transport layer.
- OpenAPI/Swagger generation (currently out of scope).
- Auth logic beyond context extraction.
- Logging, metrics, tracing in transport (reserved for infrastructure).
- AI/LLM logic.
- Direct database or core access.

## 7. Phase Transition
- Phase I is COMPLETE.
- Transport Layer is a LOCKED DEPENDENCY.
- Any future transport work requires a new Phase I.x governance authorization.
- Phase J (Integration / Deployment / Runtime) may proceed.

## 8. Lock Statement
The Transport Layer baseline is hereby declared locked and immutable. This baseline serves as the foundation for all subsequent integration and runtime development.
