## Phase F-02: EHR Core Implementation Authorization – Slice 2 (Practitioner)

## Classification and Status
- Phase Identifier: MUST be F-02.
- Slice Identifier: MUST be Slice 2 (Practitioner).
- Status: MUST be IMPLEMENTATION-AUTHORIZATION | LOCKED.
- Execution posture: MUST remain deny-by-default.
- Any execution enablement: MUST NOT be implied by this authorization.

## Purpose
- This authorization MUST authorize the minimum implementation work required to introduce the Practitioner (Clinician) core domain as Slice 2 of Phase F.2.
- This authorization MUST preserve all Phase F-00 invariants and Phase F-01 planning constraints.
- This authorization MUST remain compatible with the Phase E freeze and MUST NOT reference or depend on Phase E demo artifacts.

## Authorized Scope (Allowed Work)
The authorization MUST be limited to:
- Practitioner (Clinician) entity write model implementation.
- Practitioner (Clinician) read model implementation (derived, non-authoritative, immutable).
- AuthorityContext enforcement identical in rigor to the Patient slice.
- In-memory repository (stub) only.
- Tenant isolation enforcement.
- Deterministic, synchronous logic only.
- Full unit test coverage for all introduced logic.
- New code MUST live exclusively under `packages/ehr-core`.

## Explicitly Forbidden Scope (Not Authorized)
The authorization MUST strictly forbid:
- Encounter, Visit, or Appointment entities.
- Clinical Notes.
- Orders, Medications, or Diagnoses.
- Scheduling logic or orchestration.
- Authentication or Identity Provider (IdP) integration.
- UI components, API routes, or controllers.
- AWS services, databases, queues, or any external service integrations.
- AI logic, models, or AI-driven behaviors of any kind.
- Background jobs, events, or asynchronous workflows.
- Introduce future-facing abstractions prematurely.
- Reference to or dependence on persistence adapters.

## Authority & Safety Rules
- All write operations MUST require a valid AuthorityContext.
- The implementation MUST exhibit fail-closed behavior when AuthorityContext is missing or invalid.
- Client-forgeable authority objects are STRICTLY FORBIDDEN.
- Reads MUST be non-authoritative and immutable.

## Monorepo Constraints
- No modifications are allowed outside `packages/ehr-core` except `pnpm-lock.yaml`.
- Lockfile changes MUST be minimal and attributable only to the development of `ehr-core`.

## Phase Compatibility
- Must NOT reference or depend on Phase E demo.
- Must NOT reference persistence adapter.
- Must NOT introduce future-facing abstractions prematurely.

## Declaration
- This authorization MUST be interpreted narrowly.
- Anything not explicitly authorized MUST be treated as forbidden.
- Execution MUST remain blocked by default and MUST NOT be inferred as enabled by this document.
