# Phase H.0 Governance: Service Layer Architecture Lock

## 1. PURPOSE
This document locks the architectural rules, structure, and responsibilities of the Service Layer for the Zenthea Platform. Phase H.0 establishes the orchestration boundary before any implementation begins, preventing domain leakage, persistence bypassing, and unsafe orchestration.

## 2. SERVICE LAYER RESPONSIBILITIES
The Service Layer acts as the bridge between delivery layers and the core domain.

### Services MAY:
- Orchestrate `ehr-core` write models.
- Coordinate transactions across multiple persistence adapters.
- Enforce workflow sequencing and invariants.
- Translate domain errors into use-case outcomes.

### Services MUST NOT:
- Contain SQL or database logic.
- Contain business rules already enforced by `ehr-core`.
- Mutate domain entities directly.
- Generate IDs outside `ehr-core`.
- Perform AI inference or decision-making.
- Contain UI, HTTP, or framework-specific concepts.
- Bypass `AuthorityContext` validation.

## 3. STRUCTURAL RULES
- All services must reside under `packages/service-layer/`.
- One service per use-case, NOT per entity.
- All services must define explicit input and output types.
- Execution must be synchronous and fail-closed.
- No background jobs, queues, schedulers, or cron jobs are permitted within the service layer.

## 4. TRANSACTION DISCIPLINE
- Services own the transaction boundaries.
- `ehr-core` remains entirely persistence-agnostic.
- Persistence adapters are invoked ONLY by services.
- Nested or implicit transactions are strictly forbidden.

## 5. FORBIDDEN PATTERNS
The following patterns are explicitly forbidden:
- Fat services containing complex business logic.
- Duplication of domain logic existing in `ehr-core`.
- Direct repository or persistence access outside of services.
- Event sourcing.
- CQRS frameworks.
- Runtime dependency injection containers.

## 6. RELATIONSHIP TO OTHER PHASES
- **Phase F (ehr-core):** Immutable domain logic; the source of truth for all business invariants.
- **Phase G (persistence):** Locked infrastructure; services interact with persistence only through defined adapters.
- **Phase H Services:** Declared as the ONLY legal orchestrators between delivery layers and the domain.

## 7. LOCK DECLARATION
Phase H.0 is a DESIGN-ONLY lock. No service implementation is authorized at this stage. All service code implementation requires Phase H.1 authorization.
