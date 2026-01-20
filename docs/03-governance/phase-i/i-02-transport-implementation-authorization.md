# Phase I.2 Transport Implementation Authorization

**Mode**: EXECUTION-AUTHORIZED (for transport implementation only)
**Purpose**: Authorize implementing a minimal HTTP transport slice that calls ONLY the Service Layer.

## Authorized Scope
Implementation of exactly ONE transport slice:
- **Component**: Clinical Note Authoring Transport
- **Service Mapping**: Maps to the existing `Clinical Note Authoring Service`.
- **Package Location**: `packages/transport-http/`
- **Framework**: Fastify (Locked)

### Authorized Concerns
- DTO parsing and schema validation (Runtime validation required via AJV or similar).
- Explicit `tenantId` and `AuthorityContext` extraction from request headers/claims (fail-closed if missing).
- Calling service-layer methods only.
- Mapping `ServiceError` to transport-safe HTTP responses.
- Versioned route prefix: `/api/v1/...`

## Mandatory Invariants
- **Logic**: Transport contains ZERO business logic.
- **Isolation**: Transport MUST NOT import `ehr-core` or `persistence` packages directly.
- **Transactions**: Transport MUST NOT own or manage database transactions.
- **Tenant Context**: Transport MUST NOT infer `tenantId` implicitly; it must be an explicit input derived from the request.
- **Fail-Closed**: System must fail-closed on:
  - Missing or invalid `tenantId`.
  - Missing or invalid authority/security context.
  - Invalid DTO/payload.
  - Unknown or unhandled errors.
- **Privacy**: Error messages returned to the client must not leak PHI (Protected Health Information) or PII (Personally Identifiable Information).

## Forbidden
- Any additional endpoints beyond the authorized Clinical Note Authoring slice.
- GraphQL, gRPC, or WebSockets.
- Background jobs, retries, or message queues.
- AI/LLM integration or calls.
- Direct Database/SQL/ORM usage.
- Modifying Service Layer, `ehr-core`, or `persistence` packages.
- Observability pipelines (logging, tracing) inside handlers (must be handled via middleware or decorators).

## Error Mapping Table

| ServiceError Type | HTTP Status Code | Safe Response Body |
| :--- | :--- | :--- |
| `ValidationError` | 400 Bad Request | `{ "error": "Invalid input", "details": [...] }` |
| `UnauthorizedError` | 401 Unauthorized | `{ "error": "Authentication required" }` |
| `ForbiddenError` | 403 Forbidden | `{ "error": "Access denied" }` |
| `NotFoundError` | 404 Not Found | `{ "error": "Resource not found" }` |
| `ConflictError` | 409 Conflict | `{ "error": "Resource conflict" }` |
| `InternalError` | 500 Internal Server Error | `{ "error": "An unexpected error occurred" }` |

## Acceptance Checklist
- [ ] Exactly one file created, no other files modified.
- [ ] Authorization scope limited to Clinical Note Authoring Transport.
- [ ] Framework choice explicitly locked to Fastify.
- [ ] Error mapping table defined (ServiceError -> HTTP status code + safe body).
- [ ] Fail-closed rules stated.
