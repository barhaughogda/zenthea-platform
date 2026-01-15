# Phase AB-01: Read-Only Patient Booking Journey (Product Scaffolding)

## Status: Product Preview (Execution Blocked)
This phase represents a product-facing scaffolding of the patient booking journey. It is designed to demonstrate user flow and interface realism while maintaining a fail-closed execution posture. All actions within this journey are non-functional and strictly read-only.

## Patient-Facing Journey

### 1. Discovery (Website Builder)
- **Service Visibility**: Users can browse clinical services and specialties.
- **Provider Discovery**: Publicly available provider profiles are surfaced via deterministic projections.
- **Context**: Read-only product projection of the service catalog.

### 2. Intake Intent (Patient Portal)
- **Slot Selection**: Patients can view projected availability for selected providers.
- **Proposal Generation**: Selecting a time slot captures a **Booking Intent**.
- **Human Action as Proposal**: The system treats this intent as a proposal for future review, not a confirmed appointment.
- **Execution Guard**: No scheduling logic is triggered. No persistence writes occur.

### 3. Review Simulation (Provider Portal)
- **Inbox Preview**: Providers can view a list of "Pending Proposals" (Mock Data).
- **Review Workflow**: The UI allows for a simulated review of the patient's intent.
- **Completion Semantics**: Reaching the end of the review flow signals the end of the scaffolding walkthrough.

## Domain Adapters & Projections
To maintain realism without execution, the following projections are utilized:
- `MockProviderAdapter`: Returns deterministic provider metadata.
- `MockAvailabilityAdapter`: Returns fixed, non-expiring time slots.
- `MockServiceCatalogAdapter`: Returns a static hierarchy of clinical services.

## Execution Guardrails & Fail-Closed Posture
- **Side Effects**: Disabled. No emails, SMS, or background workers.
- **Persistence**: Read-only. No updates to clinical or administrative records.
- **Hooks/Listeners**: All execution-triggering listeners are explicitly detached or guarded.
- **Human Override**: Not applicable; no execution path exists to override.

## Audit & Evidence
- **Deterministic Trace**: Interactions within this scaffolding generate append-only logs for product audit.
- **Evidence Generation**: Successful walkthroughs of the read-only journey are captured as deterministic proof of UI/UX readiness.

---
*Reference: See `docs/03-governance/phase-z-execution-governance-lock.md` for the current execution blockage state.*
