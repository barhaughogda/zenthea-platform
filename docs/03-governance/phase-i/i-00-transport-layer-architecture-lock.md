# Phase I.0 Transport Layer Architecture Lock

## Status: COMPLETE and LOCKED
**Phase**: I.0  
**Scope**: Transport Layer Architecture  
**Mode**: DESIGN-ONLY Architecture Lock  

## 1. Governance Overview
This document locks the architecture of the Transport Layer within the Zenthea Platform. The Transport Layer is the ONLY boundary authorized to expose platform services externally. It sits strictly ABOVE the Service Layer (Phase H), which is treated as an immutable dependency.

## 2. Authorized Transport Role
The Transport Layer is responsible ONLY for:
- **Request Parsing**: Translating external signals into internal DTOs.
- **Verification**: Validating authentication and authority context.
- **DTO Validation**: Ensuring structural integrity of inbound data.
- **Service Invocation**: Calling Service Layer methods with validated inputs.
- **Error Mapping**: Translating internal `ServiceError` types to transport-safe responses.

**Invariant**: The Transport Layer MUST NOT contain business logic.

## 3. Service Boundary Enforcement
- **Isolation**: The Transport Layer MUST call ONLY Service Layer APIs.
- **Restricted Access**: Direct access to `ehr-core` or persistence adapters is STRICTLY FORBIDDEN.
- **Transactionality**: The Service Layer remains the owner of transaction boundaries.

## 4. Authority and Tenancy
Every transport interaction MUST require explicit:
- `tenantId`
- `AuthorityContext`

**Strict Rules**:
- No implicit tenant inference from headers, tokens, or globals within the transport logic.
- No silent authority elevation.
- Fail-closed on missing or invalid authority/tenancy metadata.

## 5. Authorized Transport Technology
- **HTTP/REST**: REST-style APIs over HTTP are AUTHORIZED.
- **Prohibited**: GraphQL, gRPC, WebSockets, and event streams are FORBIDDEN unless explicitly unlocked in a future Phase I.x governance authorization.

## 6. Error Handling and PHI/PII Protection
- **Safe Mapping**: `ServiceError` must be mapped to deterministic transport-safe responses (e.g., HTTP status codes).
- **Leak Prevention**: Transport error messages MUST NOT leak Protected Health Information (PHI) or Personally Identifiable Information (PII).
- **Determinism**: Transport errors must be explicit and consistent.

## 7. Forbidden Concerns
The following are STRICTLY FORBIDDEN inside the Transport Layer:
- Business rules and domain logic.
- Persistence logic or direct database access (SQL/ORM).
- AI/LLM integration or calls.
- Background jobs, queues, or retry logic.
- Workflow orchestration or state machines.
- Cross-service coordination.
- Observability pipelines embedded directly in handlers (must use decorators/middleware).

## 8. Versioning and Security Posture
- **Explicit Versioning**: API versioning MUST be explicit in the transport contract.
- **Security Defaults**: The layer MUST fail-closed on:
  - Missing or invalid authority.
  - Invalid tenant context.
  - Invalid DTO structure.
  - Unknown or unhandled service errors.
- **Intent**: Transport handlers MUST NEVER guess user intent.

## 9. Lock Statement
**Phase I.0 is hereby COMPLETE and LOCKED.**
The Transport Layer architecture is immutable. Any deviation or expansion of this architecture requires formal Phase I.x governance authorization.
