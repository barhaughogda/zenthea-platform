# Phase AB-02: Read-Only Provider Workbench (Product Scaffolding)

## Status: Product Preview (Execution Blocked)
This phase extends the product scaffolding established in [Phase AB-01](./phase-ab-01-read-only-booking-journey.md) by introducing a realistic, provider-facing workbench. It serves as a visual and navigational prototype for clinical users while maintaining a strictly non-operational and read-only state.

## Provider-Facing Workbench

### 1. Booking Proposal Inbox
- **Proposal Visibility**: Providers can view booking intents generated during the patient journey (as defined in AB-01).
- **Detail View**: Selecting a proposal surfaces the intent details, including requested service and proposed time slot.
- **Action Simulation**: "Accept" and "Decline" buttons are visible to maintain interface realism but are functionally disabled or trigger a "Simulation Only" notification.

### 2. Patient Summary Projections
- **Clinical Snapshots**: Read-only views of mock patient records, including demographic data and historical intent summaries.
- **Data Source**: Projections are served via deterministic mock adapters; no live clinical records are accessed or modified.
- **Contextual Awareness**: The UI demonstrates how patient context will be surfaced during the clinical workflow.

### 3. Projected Schedule
- **Agenda View**: A read-only representation of a provider's upcoming day or week.
- **Slot Composition**: The schedule is populated with deterministic mock appointments and blocked time slots.
- **Non-Actionability**: Drag-and-drop, rescheduling, and cancellation interactions are disabled. The schedule serves as a static visual reference.

## Domain Adapters & Projections
The workbench relies on the following read-only projections to simulate system behavior:
- `MockPatientAdapter`: Provides deterministic patient demographic data.
- `MockScheduleAdapter`: Projects a fixed set of upcoming calendar events.
- `MockProposalAdapter`: Surfaces the booking intents captured in the AB-01 scaffolding.

## Execution Guardrails & Fail-Closed Posture
- **Execution Blocked**: This phase does not enable any backend processing, state transitions, or persistence writes.
- **No Side Effects**: No notifications (Push, Email, SMS) are dispatched.
- **Isolated Scaffolding**: All provider interactions are contained within the read-only UI layer.
- **Zero Authority**: The system possesses no autonomous authority to update schedules or clinical records.

## Product Verification
- **User Experience Audit**: The workbench allows for the verification of the provider interface layout and information density.
- **Workflow Validation**: Stakeholders can walkthrough the intended clinical navigation path without risk of system execution.

---
*Reference: See `docs/03-governance/phase-z-execution-governance-lock.md` for the current execution blockage state.*
