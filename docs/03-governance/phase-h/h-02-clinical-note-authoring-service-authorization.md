# Phase H.2: Clinical Note Authoring Service – Implementation Authorization

## 1. Preconditions Verification
- **Current Branch:** `main` (Verified)
- **Working Tree:** Clean (Verified)
- **Branch Alignment:** Local `main` is aligned with `origin/main` (Verified: Ahead by governance commits only)

## 2. Purpose
- This document authorizes the implementation of exactly one service slice: the **Clinical Note Authoring Service**.
- This service serves as the coordination layer between the `ehr-core` domain logic and the persistence adapters.
- This phase explicitly authorizes the writing of executable code within the defined scope, following the interfaces defined in Phase H.1.

## 3. Authorized Scope
Implementation is authorized strictly for the following functional capabilities:
- **Start Draft Clinical Note:** Initialize a new note in a draft state.
- **Update Draft Content:** Modify the content of an existing draft note.
- **Finalize Clinical Note:** Transition a draft note to a final, immutable state.

The service must coordinate:
- `Clinical Note` domain entities from `ehr-core`.
- `Encounter` validation (ensuring the note is linked to a valid clinical session).
- `Practitioner` authority (ensuring the author has the required permissions).

All service operations **MUST** be synchronous and deterministic.

## 4. Explicitly Authorized Artifacts
- **Directory:** `packages/service-layer/clinical-note-authoring/`
- **Service Interface + Implementation:** Defining and implementing the authoring logic.
- **DTOs and Result Types:** Data transfer objects for input/output and explicit result wrappers.
- **Transaction Coordination:** Management of unit-of-work boundaries.
- **Mapping:** Logic to transform between persistence records and service DTOs.

## 5. Explicitly Forbidden
- **AI/LLM Integration:** No calls to language models or AI services.
- **Background Processes:** No asynchronous background jobs or out-of-band processing.
- **Non-Immediate Async:** No complex async workflows beyond immediate `await` on persistence/core calls.
- **Domain Exposure:** No exposing `ehr-core` internal domain objects directly to callers.
- **Persistence Logic:** No SQL, database queries, or persistence-specific logic inside the service layer.
- **Adapter Modification:** No creating new persistence adapters or modifying `persistence-postgres`.
- **Core Modification:** No modifications to the `ehr-core` package.
- **Transport/UI:** No HTTP handlers, controllers, API routes, or UI components.
- **Observability Pipelines:** No telemetry, logging pipelines, or custom metrics implementation.
- **Tenant Inference:** No cross-tenant inference or implicit resolution; `tenantId` must be explicit.

## 6. Service Interface Requirements
- **Granularity:** One service per use-case slice.
- **Mandatory Parameters:** Every method **MUST** accept:
    - `tenantId: string`
    - `authority: AuthorityContext`
- **Return Type:** Every method **MUST** return a `Result<T, ServiceError>` type.
- **Control Flow:** No usage of exceptions (throwing) for clinical or business logic control flow.
- **Error Handling:** Errors must be explicit, typed, and exhaustive.

## 7. Transaction Ownership
- The Service Layer **OWNS** the transaction boundaries.
- Exactly one transaction per service call is permitted.
- Nested transactions are strictly forbidden.
- All involved persistence adapters must share the same transaction context/unit-of-work provided by the service.

## 8. Error Taxonomy (MANDATORY)
Implementation must use the following error categories:
- `ValidationError`: Input data violates schema or basic business rules.
- `AuthorityError`: The provided `AuthorityContext` is insufficient for the operation.
- `NotFoundError`: A required resource (Note, Encounter, Practitioner) does not exist.
- `ConflictError`: State transition conflict (e.g., updating a finalized note).
- `InvariantError`: Core domain invariants are violated.
- `PersistenceError`: Underlying infrastructure failure.

## 9. Security & Safety
- **Attribution:** All write operations must be attributable to a human clinician via the `AuthorityContext`.
- **Data Privacy:** Error messages **MUST NOT** leak PHI (Protected Health Information) or PII (Personally Identifiable Information).
- **Failure Mode:** Implementation must **FAIL-CLOSED** on any uncertainty, ambiguity, or security violation.

## 10. Acceptance Checklist
- [ ] Only ONE file created (`docs/03-governance/phase-h/h-02-clinical-note-authoring-service-authorization.md`).
- [ ] No executable code has been implemented in this phase.
- [ ] No changes made to `packages/*` or other governance documents.
- [ ] Scope is strictly limited to the Clinical Note Authoring Service.

## 11. Lock Statement
- This document authorizes implementation **ONLY** for the Clinical Note Authoring Service.
- Any additional service requirements require a separate Phase H.x authorization.
- Phase H.3 is designated for the implementation of this specific slice.
- Phase H.4 will serve to lock the service layer baseline.

---

**AUTHORIZATION GRANTED**
