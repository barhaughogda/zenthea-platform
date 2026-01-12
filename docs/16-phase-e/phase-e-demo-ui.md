## Phase E Demo UI (Temporary Reference Surface)

### Status
- **Mode**: PRODUCTION MODE (documentation-only change)
- **Phase**: **Phase E (strictly non-executing)**
- **Sealed slices exercised**: **SL-01**, **SL-03**, **SL-04**, **SL-07**, **SL-08**
- **Governance posture**: unchanged (sealed behavior is treated as immutable)

---

## Purpose

The **Phase E Demo UI** is a **temporary but intentional reference surface** that enables end-to-end demonstration, validation, and regression checking of **sealed Phase E orchestration entrypoints** without modifying sealed slices, without modifying legacy UIs, and without introducing execution semantics.

This UI exists to make governance boundaries **explicit and visible** at the point of interaction (human-in-the-loop, draft-only, pending-only), and to provide a minimal surface to render outputs **verbatim** for evidence capture.

---

## Explicit non-goals (hard)

- **No orchestration logic changes**: no edits to sealed slices or their entrypoints.
- **No new APIs**: do not introduce new backend endpoints, services, queues, or workers.
- **No persistence**: no database, file storage, caches, or durable state stores.
- **No execution**: no booking, no calendar writes, no EHR writes, no signing, no attestation.
- **No authentication complexity**: only mocked or existing dev identity; no auth product work.
- **No business logic**: the UI must not interpret, “correct”, or transform outputs beyond basic rendering and required labeling.
- **No styling polish**: UX is functional and minimal (labels and disclaimers must be clear).

---

## Governance boundaries (must be visible)

The Demo UI must display, on every view:

- **Phase banner**: “Phase E – Non-executing (demo only)”
- **Slice banner**: the specific sealed slice(s) exercised by the view (e.g., “SL-07 – SEALED”)
- **Safety banner**: “Outputs are advisory/pending only. No action is executed.”
- **Rendering rule**: “Outputs are rendered verbatim (no interpretation).”

Additionally:

- Do not show language that implies execution (e.g., “Booked”, “Confirmed”, “Signed”, “Submitted”).
- Do not introduce “helpful” behaviors (auto-accept, auto-fill, auto-routing).

---

## Scope boundaries (implementation guidance)

### What “UI-only layer” means here

The Demo UI is an interaction shell. It may **invoke** sealed entrypoints, but must not:

- embed new domain logic,
- widen semantics (e.g., turning “proposal” into “booking”),
- add intermediate persistence,
- or require backend changes.

### Invocation constraint: “No new APIs”

To satisfy “no new APIs” while still exercising sealed behavior end-to-end:

- The Demo UI should invoke sealed entrypoints **in-process** (e.g., via direct imports executed on the server side of the UI runtime).
- The UI must not introduce new networked API routes or service endpoints for these demos.

If exercising a workflow requires adding an API endpoint, background job, database, or modifying orchestration code, **STOP** (see Stop Conditions).

---

## The Demo UI must include exactly three views

Only the following views are allowed:

1) **Patient Demo View** (SL-07)
2) **Provider Review Demo View** (SL-08)
3) **Clinician Drafting Demo View** (SL-04)

No other pages, flows, or admin panels may be added in Phase E Demo UI scope.

---

## View 1: Patient Demo View (SL-07 Scheduling Proposal)

### User intent
Let a user trigger the sealed **SL-07 Scheduling Proposal** workflow and view the resulting proposal(s) **verbatim**.

### Required behavior
- Provide a minimal form:
  - **intent** (required text)
  - **preferredTime** (optional text)
  - **appointmentType** (optional text)
  - **reason** (optional text)
- On submit, invoke SL-07 and display:
  - the returned `message` verbatim
  - the returned `proposal` object verbatim (pretty-printed JSON)
  - the returned `metadata` verbatim (pretty-printed JSON)
- Display required labels prominently:
  - **“Not confirmed”**
  - **“Pending provider approval”**
- Explicitly do **not** display calendars, availability pickers, or booking confirmation UI.

### Mapping: UI action → sealed entrypoint

- **Action**: “Generate scheduling proposal”
- **Sealed entrypoint**: `executeSchedulingProposal(session, request)`
- **Source**: `services/patient-portal-agent/orchestration/scheduling-proposal-workflow.ts`
- **Slice**: **SL-07**
- **Dependencies exercised** (sealed):
  - **SL-03** (patient session context)
  - **SL-01** (patient scoping & consent gate, invoked inside SL-07)

### Output handling rules
- Render `proposal` exactly as received.
- Do not “translate” `proposal.parameters.status` into an executed state.
- The UI must always show:
  - “Not confirmed”
  - “Pending provider approval”
even if the proposal contains other status fields.

---

## View 2: Provider Review Demo View (SL-08 Provider Review)

### User intent
Let a provider review a scheduling proposal and submit a HITL decision via sealed SL-08.

### Required behavior
- Display scheduling proposals (source is demo-only; see constraints below).
- For each proposal, allow provider decision:
  - **ACCEPT**
  - **REJECT** (**required** reason)
  - **REQUEST_CHANGES**
- When REJECT is selected, the UI must require a structured reason input (e.g., `reasonCode`).
- On decision submit, invoke SL-08 and display:
  - resulting response `status` and `message` verbatim
  - resulting `metadata` verbatim (pretty-printed JSON)
  - “proposal state” as **UI-level state only** (since Phase E is non-persistent)
  - audit metadata surfaced from response metadata (e.g., attempt/correlation identifiers)

### Proposal source constraint (no persistence)
Because persistence is forbidden in Phase E:

- The Demo UI must treat proposals as **transient**.
- It may display proposals from:
  - the immediately prior SL-07 response (in-memory only), or
  - a pasted proposal JSON blob (manual copy/paste), or
  - predefined static fixture JSON in the UI layer (read-only).

If provider review requires a database or backend store to “list proposals”, **STOP** (see Stop Conditions).

### Mapping: UI action → sealed entrypoint

- **Action**: “Submit provider review decision”
- **Sealed entrypoint**: `executeProviderReview(session, provider, request)`
- **Source**: `services/patient-portal-agent/orchestration/provider-review-workflow.ts`
- **Slice**: **SL-08**
- **Dependencies exercised** (sealed):
  - **SL-03** (patient session context)
  - **SL-01** (patient scoping & consent gate, invoked inside SL-08)
  - **SL-07** (upstream proposal generation; dependency acknowledged in SL-08 seal)

### Output handling rules
- Treat SL-08 output as **metadata-only** confirmation of HITL decision.
- Do not interpret SL-08 `SUCCESS` as “booking performed”.
- Do not create calendar events, appointments, or reschedules under any circumstances.

---

## View 3: Clinician Drafting Demo View (SL-04 Clinical Drafting)

### User intent
Let a clinician trigger sealed **SL-04 Clinical Drafting** and view the returned draft text **verbatim**, with mandatory disclaimers.

### Required behavior
- Provide a minimal form:
  - **intent** (required text; e.g. “draft a SOAP note”)
  - optional clinician constraints (tone/structure/required sections), if exposed, must remain purely input shaping (no additional logic).
- On submit, invoke SL-04 and display:
  - returned `draft.text` verbatim
  - returned `draft.labels` verbatim
  - returned `draft.metadata` verbatim (pretty-printed JSON)
  - returned `metadata` verbatim (pretty-printed JSON)
- Display mandatory disclaimers prominently:
  - **“DRAFT ONLY”**
  - **“Not signed”**
  - **“Requires clinician review”**
- Explicitly **no** save, submit, sign, attestation, or “send to EHR” actions.

### Mapping: UI action → sealed entrypoint

- **Action**: “Generate clinical draft”
- **Sealed entrypoint**: `executeClinicalDrafting(sessionOrNull, clinician, request)`
- **Source**: `services/patient-portal-agent/orchestration/clinical-drafting-workflow.ts`
- **Slice**: **SL-04**
- **Dependencies exercised** (sealed):
  - **SL-03** (when patient-scoped drafting is used)
  - **SL-01** (patient scoping & consent gate when patient-scoped drafting is used)

### Output handling rules
- Render draft content verbatim.
- Do not add “helpful” post-processing (summaries, edits, templates, auto-coding).
- The UI must never imply the draft is a legal medical record.

---

## Identity and context (mocked / existing dev identity only)

The sealed SL-07/08/04 entrypoints require governed context inputs (e.g., `PatientSessionContext`, clinician/provider identity objects). The Demo UI may satisfy these by:

- Using **existing dev identity** mechanisms already present in the repo, or
- Using **mocked identities** in the UI layer (hard-coded tenant/patient/clinician IDs) strictly for demo purposes.

The Demo UI must not introduce new authentication flows or authorization logic.

---

## Forbidden actions (non-negotiable)

- **Execution**:
  - booking, rescheduling, canceling, calendar writes
  - EHR writes, signing, attestation, submission to a system-of-record
- **Persistence**:
  - storing proposals, drafts, decisions, or audit trails in any durable store
- **Logic changes**:
  - modifying sealed slice code, widening behavior, or changing governance posture
- **Backend changes**:
  - new APIs, new services, new orchestration routes, new queues/workers
- **Legacy UI changes**:
  - do not modify existing portals or production UI surfaces at this stage

---

## Stop conditions (must NOT be implemented)

Stop and do not proceed if any of the following are required or implied:

- A UI interaction would **execute** a booking, calendar write, EHR write, signing, or attestation.
- “Listing proposals” requires a new backend endpoint or a database table.
- Any sealed slice would need changes to support the demo UI.
- Any work would modify legacy UIs to add these demo capabilities.
- Any flow introduces persistence, background processing, or autonomous decisions.

---

## Later integration guidance (high-level only)

When Phase E is complete and governance permits integration work:

- Treat this Demo UI as the **reference acceptance surface** for sealed behaviors.
- Legacy UI integration should be performed by adding thin adapters that:
  - call the same sealed entrypoints,
  - preserve verbatim rendering expectations,
  - and keep non-execution guarantees visible until execution-authority slices exist.
- Any move from “proposal/draft” to “execution” must be gated by explicit governance, new slices (outside Phase E), and corresponding audit controls.

