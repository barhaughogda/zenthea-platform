# Pilot UI Wiring Plan: Enforce Mock Consultation Loop

## 1. Purpose of This Document
This document defines how the Zenthea UI enforces the Mock Consultation Loop and Pilot Persistence Adapter rules during the constrained pilot phase. It specifies UI surfaces, allowed states, action-to-persistence mappings, and safety guards. This document exists to eliminate ambiguity and prevent unsafe user actions. It does not introduce new UI features, authorize execution, or define backend implementation.

## 2. Pilot UI Scope and Non-Goals

### Scope
- Enforce the Mock Consultation Loop as defined in `docs/06-beta/beta-mock-consultation-loop.md`.
- Map UI actions to allowed persistence events per `docs/06-beta/pilot-persistence-adapter-design.md`.
- Prevent PHI boundary violations per `docs/06-beta/pilot-phi-boundary-rules.md`.
- Support dry-run validation per `docs/06-beta/pilot-dry-run-checklist.md`.

### Non-Goals
- No new product features or workflows.
- No UI mockups, wireframes, or design assets.
- No backend API, schema, or implementation details.
- No analytics, telemetry, or tracking integrations.
- No roadmap or future-state discussion.

## 3. Core UI Surfaces (Pilot Only)
The pilot UI is limited to the following surfaces:

| Surface | Purpose |
| :--- | :--- |
| **Login Screen** | Authentication entry point. |
| **Provider Dashboard** | Mock patient list and session initiation. |
| **Patient Context View** | Read-only display of mock patient profile and AI-generated context summary. |
| **Session Capture View** | Real-time transcript display during active consultation. |
| **Draft Review View** | Side-by-side display of AI-generated draft and session transcript for editing. |
| **Finalization Confirmation** | Modal or inline confirmation for "Sign and Finalize" action. |
| **Export View** | Download interface for finalized note (Markdown/PDF). |

No other UI surfaces are authorized for the pilot phase.

## 4. Consultation UI States
The UI must enforce the following linear state progression:

| State | Description | Allowed Transitions |
| :--- | :--- | :--- |
| **Idle** | Provider is authenticated but no session is active. | → Patient Selected |
| **Patient Selected** | Mock patient context is displayed. | → Session Active, ← Idle |
| **Session Active** | Recording/transcription in progress. | → Draft Generated |
| **Draft Generated** | AI draft is displayed for review. | → Draft Editing |
| **Draft Editing** | Provider is editing the draft. | → Finalized, → Draft Generated (Reset) |
| **Finalized** | Note is signed and sealed. | → Export Ready, → Idle |
| **Export Ready** | Download button is available. | → Idle |

**Constraints:**
- Backward transitions are only permitted where explicitly listed.
- No state may be skipped.
- The UI must prevent navigation away from "Draft Editing" without explicit discard confirmation.

## 5. UI Action → Persistence Mapping
Every UI action that triggers persistence must map to an allowed event. Actions without a mapping are forbidden.

| UI Action | Persistence Event | Notes |
| :--- | :--- | :--- |
| Click "Start Session" | Event 1: Session Start (Metadata only) | No PHI persisted. |
| Click "End Session" | Event 2: Draft Generation | Draft labeled "AI Suggested." |
| Click "Save Draft" | Event 3: Save Draft | Explicit human trigger required. |
| Click "Sign and Finalize" | Event 4: Sign and Finalize | Requires confirmation step. |
| Click "Download PDF/Markdown" | Event 5: Export/Download | No server-side retention. |
| Click "Reset Draft" | No persistence | Clears in-memory draft; does not delete persisted data. |
| Navigate away from Draft Editing | No persistence | Requires discard confirmation if unsaved changes exist. |

**Forbidden UI Behaviors:**
- Background auto-save.
- Silent writes on navigation or timeout.
- Cross-patient data display or persistence.
- Any persistence not listed above.

## 6. Draft vs Final Visual Enforcement
The UI must provide unambiguous visual distinction between draft and finalized states.

### Draft State Indicators
- **Label**: "DRAFT" badge displayed prominently on the note view.
- **Status Text**: "AI Suggested — Awaiting Provider Review."
- **Color Coding**: Draft content displayed with a muted or warning-tone background (e.g., amber border or background tint).
- **Edit Controls**: All content is editable.

### Finalized State Indicators
- **Label**: "FINALIZED" badge displayed prominently.
- **Status Text**: "Signed by [Provider Name] on [Timestamp]."
- **Color Coding**: Finalized content displayed with a confirmation-tone background (e.g., green border or background tint).
- **Edit Controls**: All content is read-only. No editing permitted post-finalization.

### Transition Enforcement
- The "Sign and Finalize" button must be disabled until the provider has scrolled through or otherwise acknowledged the full draft content.
- A confirmation modal must appear before finalization, stating: "This action will seal the note and cannot be undone."

## 7. AI Attribution and Confidence Signaling
All AI-generated content must be explicitly attributed and editable.

### Attribution Rules
- **AI-Generated Sections**: Display an "AI Suggested" indicator adjacent to all AI-generated content blocks (e.g., SOAP sections, context summary).
- **Human Edits**: Once a provider modifies a section, the indicator updates to "Edited by [Provider Name]."
- **Finalized Attribution**: The finalized note must display the signer's name and timestamp, not the AI.

### Confidence Signaling
- No confidence scores, percentages, or certainty indicators are displayed during the pilot.
- All AI output is presented as a suggestion requiring human review.
- The UI must not imply that AI content is authoritative or final.

## 8. UI-Level Safety Guards and Blocks

### Input Validation
- **PHI Warning**: If the sandbox mode is active and the system detects patterns resembling real PHI (e.g., SSN format), display a warning: "This session uses mock data only. Do not enter real patient information."
- **Empty Session Block**: The "End Session" button is disabled if no transcript content exists.

### Navigation Guards
- **Unsaved Changes Warning**: If the provider attempts to navigate away from Draft Editing with unsaved changes, display a confirmation modal: "You have unsaved changes. Discard and leave?"
- **Session Lock**: While a session is active, the provider cannot select a different patient or start a new session.

### Action Disablement
- "Sign and Finalize" is disabled until the provider has reviewed the draft.
- "Download" is disabled until the note is finalized.
- "Start Session" is disabled if a session is already active.

### Forbidden Action Blocks
- No UI affordance exists for background saves.
- No UI affordance exists for cross-patient data access.
- No UI affordance exists for autonomous AI actions.

## 9. Kill Switch UI Behavior
When the centralized Kill Switch is activated, the UI must immediately enter a degraded state.

### Immediate Effects
- **Session Termination**: All active sessions are halted. Transcript capture stops.
- **Write Inhibition**: All persistence-triggering buttons are disabled: "Save Draft," "Sign and Finalize," "End Session."
- **Banner Display**: A full-width, high-visibility banner appears: "SYSTEM PAUSED — Contact Administrator."

### User Guidance
- The UI must display a message explaining that operations are temporarily suspended.
- The provider may view existing finalized notes (read-only).
- The provider may log out.

### Recovery
- When the Kill Switch is deactivated, the UI must require a full page refresh before persistence actions are re-enabled.
- Any in-flight data at the time of activation is not recoverable from the UI.

## 10. Scope Lock Rule
This document is strictly limited to UI enforcement of the Mock Consultation Loop and Pilot Persistence Adapter rules.

**Forbidden Expansions Without Formal Review:**
- New UI surfaces or navigation paths.
- New persistence events or data types.
- Background jobs, scheduled tasks, or automated actions.
- Analytics, telemetry, or behavioral tracking.
- Integration with external systems (EHR, messaging, billing).
- Display of real patient data outside the Pilot PHI Sandbox.

Any modification to the UI wiring described in this document requires a corresponding update to this plan and alignment with the governing documents listed in Section 2.
