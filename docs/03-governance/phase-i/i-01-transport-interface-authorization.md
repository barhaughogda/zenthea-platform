# Phase I.1 Transport Interface Authorization

## 1. Purpose
- This document authorizes the definition of transport-layer **INTERFACES ONLY**.
- NO executable code is permitted.
- NO handlers, routing, controllers, middleware, or framework-specific code are authorized at this stage.

## 2. Authorized Scope
- Definition of transport Data Transfer Objects (DTOs) for request and response shapes.
- Definition of transport-layer error contracts and response types.
- Definition of transport interface signatures ONLY.
- Explicit mapping contracts between Transport Layer DTOs and Service Layer types.

## 3. Mandatory Interface Rules
- **Granularity**: One transport interface MUST exist per service slice.
- **Method Signatures**: Every method in a transport interface MUST accept:
  - `tenantId: string`
  - `authority: AuthorityContext`
- **Serialization**: All DTOs MUST be serializable (plain objects only).
- **Type Isolation**:
  - NO domain objects (`ehr-core`) may be exposed directly.
  - NO persistence types or entities may be exposed.
  - NO internal service-layer types may be leaked.

## 4. Error Contract Rules
- Transport errors MUST be mapped directly from `ServiceError` types defined in the Service Layer.
- An explicit mapping table is required for every transport interface:
  - **ServiceError** → **TransportError (e.g., HTTP Status/Code)**
- Errors MUST be deterministic, consistent, and safe (no PHI/PII leakage in error messages).

## 5. Explicitly Forbidden
- HTTP framework-specific code (e.g., Express, Next.js, Fastify, etc.).
- Implementation of controllers, handlers, routers, or middleware.
- Integration of validation libraries (e.g., Zod, Yup, etc.).
- Authentication implementations.
- Authorization logic beyond the verification of the presence of required context.
- Any direct calls to services or adapters.
- Any reference to persistence layers, ORMs, or SQL.
- AI or LLM logic.
- Observability, logging, or tracing implementations.

## 6. Security & Failure Posture
- **Fail-Closed Policy**: The system MUST fail-closed on:
  - Missing or null `tenantId`.
  - Missing, null, or invalid `AuthorityContext`.
  - Invalid DTO structure or unexpected properties.
- **No Inference**: Tenant context MUST NEVER be inferred from the environment, headers, or globals within the transport interface logic.
- **No Elevation**: Authority elevation is strictly prohibited at the transport layer.
- **No Default Behavior**: Interfaces must require explicit values for all security-critical fields.

## 7. Lock Statement
- **Phase I.1 authorizes INTERFACES ONLY.**
- Phase I.2 authorization is REQUIRED before any transport implementation, framework integration, or handler logic may be authored.
