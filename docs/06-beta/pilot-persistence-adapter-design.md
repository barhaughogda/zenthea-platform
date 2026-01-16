# Pilot Persistence Adapter: Conceptual Design

## 1. Purpose of This Document
This document defines the conceptual design and operational boundaries for Zenthea’s Pilot Persistence Adapter. It ensures that all data persistence during the constrained pilot phase is explicit, minimal, auditable, and strictly bounded to the Mock Consultation Loop. This adapter serves as the authoritative gateway for all write operations to the Pilot PHI Sandbox, preventing silent or autonomous data retention.

## 2. Definitions
- **Pilot Persistence Adapter**: The logical component responsible for mediating all write operations to the persistence layer during the pilot phase.
- **Draft**: A non-authoritative, ephemeral version of a clinical note or session artifact, clearly labeled as "AI Suggested."
- **Finalized Artifact**: A clinical note or record that has been reviewed, edited, and signed by a human provider, representing a logical seal.
- **Session Context**: The collection of transcripts, metadata, and ephemeral state associated with a single provider-patient interaction.

## 3. Scope and Non-Goals
- **Scope**: Limited to persistence events triggered within the Mock Consultation Loop (as defined in `docs/06-beta/beta-mock-consultation-loop.md`).
- **Non-Goals**: Does not include long-term archival, multi-session analytics, cross-patient state, or integration with external Electronic Health Records (EHRs). It is not a general-purpose database API.

## 4. Persistence Principles
- **Explicit**: Every write must be the result of a direct, intentional action by a human provider or a clearly defined system lifecycle event.
- **Minimal**: Only the data required to complete the Mock Consultation Loop and satisfy audit requirements is persisted.
- **Human-Gated**: No clinical content is finalized or moved to authoritative storage without explicit human review and approval.
- **Fail-Closed**: If the persistence adapter encounters an error or security violation, it must halt the session and prevent any data writes.

## 5. Allowed Persistence Events (Pilot Only)
The following are the only events permitted to trigger data persistence during the pilot:

### Event 1: Provider-initiated Session Start (Metadata only)
- **Description**: Creation of a session record when a provider clicks "Start Session."
- **Persisted Data**: Session ID, Provider ID, Mock Patient ID, Timestamp.
- **PHI Content**: None.

### Event 2: Provider-initiated Draft Generation
- **Description**: Persistence of the initial AI-generated draft after "End Session."
- **Status**: Labeled as "Draft" and "AI Suggested." Non-authoritative.
- **Trigger**: Human provider clicking "End Session."

### Event 3: Provider-initiated Save Draft
- **Description**: Manual saving of an in-progress edit of the clinical note.
- **Requirement**: Must be explicitly triggered by the provider via a "Save Draft" button. Background auto-saves are forbidden.

### Event 4: Provider-initiated Sign and Finalize
- **Description**: The transition of a draft to a "Finalized Artifact."
- **Requirement**: This is the authoritative boundary. Requires a human "Sign" action.
- **Audit**: Log the signer ID and the exact version of the note at the time of signing.

### Event 5: Provider-initiated Export/Download
- **Description**: Generation of a Markdown or PDF version of the finalized note.
- **Constraint**: No server-side copy of the exported file is retained beyond the immediate download buffer.

## 6. Forbidden Persistence Behaviors
- **Silent Writes**: No data may be written to the database without a corresponding UI-triggered event or audit-logged lifecycle change.
- **Background Saves**: Autonomous auto-save functionality is strictly prohibited to ensure the provider is aware of all persisted state.
- **Cross-Patient State**: Data from one patient session must never influence or be persisted alongside another patient's session.
- **Analytics and Tracking**: No behavioral tracking, performance telemetry, or metadata analytics may be persisted if they contain or are derived from PHI.
- **Autonomous Updates**: The system is forbidden from updating existing patient records or history without human intervention.

## 7. Human Gating and Confirmation Requirements
Every write operation involving clinical content must be preceded by a human confirmation step.
- **Drafts**: Must be accepted by the provider to be persisted as a working version.
- **Finalization**: Requires a multi-step "Review -> Edit -> Sign" workflow.
- **Deletions**: Any manual deletion of a session or note must be confirmed by the provider.

## 8. Retention, Deletion, and Reset Semantics
- **Pilot Duration**: All session data is ephemeral and tied to the pilot window.
- **Explicit Purge**: At the end of the pilot session or upon a "Reset" action, the adapter must ensure the session context is cleared from the active sandbox storage.
- **Retention Limit**: Consistent with `docs/06-beta/pilot-phi-boundary-rules.md`, all PHI-related data must be purged within 30 days of pilot conclusion.

## 9. Audit and Logging Semantics
- **No PHI in Logs**: Audit logs must record *that* a write occurred, *who* did it, and *when*, but MUST NEVER contain the content of the transcript or clinical note.
- **Traceability**: Every persisted artifact must be traceable to a specific Session ID and Human Provider ID.

## 10. Kill Switch Interaction Model
When the centralized Kill Switch is activated:
- **Write Inhibition**: All calls to the Persistence Adapter must return an immediate "Access Denied" or "Service Unavailable" error.
- **Data Isolation**: Any in-flight writes must be aborted.
- **State Lock**: The persistence layer enters a read-only or offline state, preventing any further modifications to the Pilot PHI Sandbox.

## 11. Scope Lock Rule
The Pilot Persistence Adapter is strictly limited to the Mock Consultation Loop. Any expansion to support new data types, background processing, or external integrations is forbidden without a formal update to this design and a corresponding security review.
