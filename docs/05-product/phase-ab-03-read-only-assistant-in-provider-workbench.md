# Phase AB-03: Read-Only Assistant in Provider Workbench (Product Scaffolding)

## Status: Product Preview (Execution Blocked)
This phase introduces the Zenthea Assistant as a visible, contextual companion within the provider-facing workbench established in [Phase AB-02](./phase-ab-02-read-only-provider-workbench.md). The assistant is strictly advisory and read-only, serving to provide informational clarity without possessing any operational authority or execution capability.

## Contextual Assistant Surface
The Zenthea Assistant appears as a non-intrusive side panel or an embedded surface within the clinical workspace. It is contextually bound to the active view, providing immediate, informational support based on the current data projections.

### 1. Booking Intent Summarization
When a provider reviews a **Booking Proposal** (as defined in [Phase AB-01](./phase-ab-01-read-only-booking-journey.md)), the assistant provides a concise summary of the patient's stated intent.
- **Informational Focus**: Highlights the primary reason for the visit and the requested service type.
- **Clarity**: Translates intake data into a structured narrative for quick clinical consumption.
- **Constraint**: The assistant does not evaluate the proposal or suggest an acceptance/rejection decision.

### 2. Patient Contextual Highlights
While viewing **Patient Summary Projections** (as defined in [Phase AB-02](./phase-ab-02-read-only-provider-workbench.md)), the assistant surfaces relevant highlights from the projected clinical data.
- **Data Synthesis**: Summarizes historical intent patterns and demographic context.
- **System Transparency**: Explains what the system currently "knows" about the patient based on the mock data adapters.
- **Constraint**: The assistant does not provide clinical insights, risk assessments, or diagnostic suggestions.

### 3. Schedule Overview Support
Within the **Projected Schedule**, the assistant provides metadata explanations for specific blocks of time or upcoming appointments.
- **Workflow Awareness**: Offers informational descriptions of the day's projected structure.
- **Constraint**: No suggestions for rescheduling, optimization, or gap-filling are provided.

## Operational Constraints & Execution Posture
To maintain a fail-closed execution posture, the following constraints are strictly enforced:

- **Execution Remains BLOCKED**: No backend processing or clinical state changes are triggered by the assistant's presence or interaction.
- **No Persistence Writes**: The assistant does not save notes, update records, or modify any system state.
- **No Tool Execution**: The assistant cannot call external APIs, send notifications, or perform any autonomous actions.
- **Strictly Advisory**: All assistant output is clearly labeled as "Informational" or "System Explanation."
- **No "Next Action" Suggestions**: The assistant is prohibited from recommending specific clinical or administrative actions.

## Clinical Tone & Trust
The Zenthea Assistant is designed to be a calm and trustworthy source of information. It maintains a clear separation between objective system facts and its own synthesized explanations, ensuring the provider remains the sole authority in the clinical workflow.

---
*Reference: See `docs/03-governance/phase-z-execution-governance-lock.md` for the current execution blockage state.*
