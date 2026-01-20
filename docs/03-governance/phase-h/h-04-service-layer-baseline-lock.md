# Phase H.4: Service Layer Baseline Lock

## 1. Purpose
The Service Layer is hereby declared **COMPLETE and LOCKED**. This phase establishes the Service Layer as a stable, production-safe dependency for all future development phases.

## 2. Locked Scope
The following governance artifacts and implementation results are explicitly locked:
- **Service Layer Architecture**: Defined in [H.0](./h-00-service-layer-architecture-lock.md).
- **Service Interface Contracts**: Defined in [H.1](./h-01-service-layer-interface-authorization.md).
- **Authorized Service Slices**: Defined in [H.2](./h-02-clinical-note-authoring-service-authorization.md) and [H.2a].
- **Implemented Services**: Services implemented in H.3.

The **Clinical Note Authoring Service** is declared the reference implementation for the Service Layer.

## 3. Architectural Invariants
The following invariants are locked and MUST be maintained:
- **One service per use-case**: Services are organized by use-case, NOT by entity.
- **Transaction Ownership**: The Service Layer owns all transaction boundaries.
- **Explicit Context**: Every service call requires explicit `tenantId` and `AuthorityContext`.
- **Return Types**: All service methods MUST return `Result<T, ServiceError>`.
- **Fail-closed behavior**: Systems must fail-closed on any authorization or logic ambiguity.
- **No Domain Leakage**: Services MUST only expose DTOs; domain objects remain encapsulated.
- **No Persistence Logic**: Persistence-specific concerns (e.g., SQL) are strictly forbidden in services.
- **No Transport Concerns**: Transport protocols (HTTP, GraphQL, RPC) are forbidden in the service layer.
- **No AI/LLM integration**: Services are deterministic logic handlers; no LLM integration permitted.
- **No Background/Async**: Background jobs and async orchestration are forbidden inside services.
- **No Implicit Tenant Inference**: Tenant context MUST be explicitly passed, never inferred from global state.

## 4. Forbidden Changes After Lock
The following modifications are strictly forbidden:
- Modifying existing service interfaces.
- Changing the established error taxonomy.
- Adding new services without a new Phase H.x authorization.
- Introducing orchestration layers, workflows, or sagas inside services.
- Introducing retries, message queues, or background execution.
- Adding logging or observability pipelines directly inside service logic.

## 5. Allowed After Lock
The following activities are permitted:
- Adding new service slices ONLY via subsequent Phase H.x governance authorization.
- Development of the Transport Layer (Phase I) consuming these services as immutable dependencies.
- Implementation of workflow/orchestration layers ABOVE the Service Layer in future phases.
- Infrastructure wiring (Dependency Injection, Composition) that does not modify service logic.

## 6. Compliance Statement
The Service Layer is production-safe by construction. Any violation of this lock, including deviations from architectural invariants or unauthorized service additions, constitutes a governance breach. All future development MUST treat the Service Layer as immutable unless explicitly unlocked through formal governance procedures.

## 7. Lock Statement
Phase H is **COMPLETE and LOCKED**. This lock is final.
