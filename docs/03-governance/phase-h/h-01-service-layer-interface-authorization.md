# Phase H.1: Service Layer Interface Authorization

## 1. PURPOSE
This document authorizes the definition of service interfaces and types only. It establishes the formal contract between delivery layers (APIs, Agents, UI) and the underlying `ehr-core` and persistence adapters. 

## 2. AUTHORIZATION SCOPE
- **Authorized**: Creation of TypeScript interfaces, type definitions, and DTOs for service contracts.
- **Forbidden**: Implementation of service logic, database queries, or any executable code is strictly forbidden until Phase H.2.

## 3. ALLOWED ARTIFACTS
- Interface definitions (`interface`).
- Input/Output Data Transfer Objects (`type`).
- Typed error/result unions.
- Service registry type definitions (type-only).
- **Target Location**: `packages/service-layer/` (Note: This package is for organizational intent; no implementation code is authorized).

## 4. REQUIRED INTERFACE SHAPE
Every service defined under this authorization MUST follow these patterns:
- **Granularity**: One service per use-case, not per entity.
- **Execution**: Service methods return `Promise<Result>` but MUST be awaited immediately by callers; no background execution is allowed within the service layer.
- **Data Handling**: Inputs and outputs must be explicit, serializable DTOs. Domain objects from `ehr-core` MUST NOT be exposed directly.
- **Context**: Every method must explicitly accept an `AuthorityContext` and `tenantId`.
- **Return Type**: Methods must return a discriminated union `Result` type:
  ```typescript
  type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
  ```
- **Control Flow**: No throwing exceptions for control flow. Exceptions are reserved for truly unexpected programmer errors or system failures.

## 5. AUTHORITY AND TENANCY RULES
- **Authority**: Services MUST require `AuthorityContext` for any operation that leads to a write.
- **Tenancy**: Services MUST require `tenantId` and MUST pass it through to all downstream persistence calls.
- **Integrity**: Services MUST NOT manufacture `AuthorityContext` or infer `tenantId`.

## 6. TRANSACTION OWNERSHIP
- **Boundaries**: Services own transaction boundaries.
- **Coordination**: Services MUST coordinate multi-repository operations under a single explicit transaction object.
- **Restrictions**: Nested transactions are forbidden. No implicit transaction behavior or "auto-commit" logic is permitted.

## 7. ERROR MODEL REQUIREMENTS
Services must use a standard, auditable error taxonomy:
- `ValidationError`
- `AuthorityError`
- `NotFoundError`
- `ConflictError`
- `InvariantError`
- `PersistenceError`

Error objects must include:
- `code`: A machine-readable string.
- `message`: A human-readable description.
- `details`: Optional safe metadata.
- **Security**: Error messages and details MUST NOT contain Protected Health Information (PHI).

## 8. FORBIDDEN WORK
The following activities are strictly forbidden in Phase H.1:
- Creating executable code in `packages/service-layer/`.
- Implementing service logic or business rules.
- Writing DB queries or SQL strings.
- Creating HTTP handlers, framework integrations, or API routes.
- Implementing background jobs, event emitters, message buses, or queues.
- Adding telemetry, logging, or cron jobs.
- Implementing any AI-related calls or LLM integrations.
- Modifying `packages/ehr-core/` or `packages/persistence-postgres/`.

## 9. ACCEPTANCE CHECKLIST
A Governance reviewer must confirm:
- [ ] Only `docs/03-governance/phase-h/h-01-service-layer-interface-authorization.md` was created/modified.
- [ ] No implementation code was added to the repository.
- [ ] No changes were made to existing packages (ehr-core, persistence, etc.).
- [ ] All defined interfaces follow the `Result<T, E>` and `AuthorityContext` patterns.

## 10. LOCK STATEMENT
This Phase H.1 artifact is **DESIGN-ONLY**. 

Phase H.2 will authorize the implementation of the first service slice. Candidate slices for H.2 include:
- Clinical Document Drafting Service
- Patient Appointment Scheduling Service

No implementation may proceed until H.2 is authored and locked.
