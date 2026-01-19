## Phase F-00: EHR Core Design Lock

## Classification and Lock Status
- Phase Identifier: MUST be F-00.
- Status: MUST be DESIGN-ONLY | LOCKED.
- Execution: MUST remain BLOCKED.

## Purpose
- MUST lock the EHR core design scope as the canonical foundation for any future clinical record capability.
- MUST prevent scope creep, retrofits, and implied execution pathways while the platform remains execution-blocked.
- MUST preserve a deny-by-default posture for all state change and record finalization semantics until a subsequent phase explicitly authorizes implementation planning.

## Scope (EHR Core Entities Only)
- Patient: MUST represent the subject of care within the EHR core.
- Clinician: MUST represent a human author and attestor of clinical content and MUST NOT define or imply an authentication or authorization system.
- Encounter: MUST represent a bounded clinical interaction context that groups clinical documentation.
- Clinical Note (SOAP): MUST represent clinician-authored documentation structured as Subjective, Objective, Assessment, and Plan.
- Audit Event (provenance and accountability): MUST represent attributable provenance for clinically relevant actions and content state transitions.

## EHR Core Invariants (Non-Negotiable)
- MUST preserve human authority over clinical truth.
- Notes MUST be versioned or sealed with provenance.
- Finalization MUST be explicit and attributable to a human clinician.
- All writes MUST be auditable.
- Read model MUST NOT imply write capability.

## Mutability and Lifecycle Rules (Conceptual, No Implementation)
- Draft: MUST be mutable by a human clinician within the authority boundary of authorship.
- Finalized: MUST be a sealed state with attributable provenance and MUST NOT be overwritten.
- Amendment: MUST be recorded as a new version that references the finalized content and MUST NOT replace or erase the finalized content.
- Deletion: MUST be deny-by-default and MUST be auditable if and only if it is ever authorized by a subsequent governance act.

## Boundary Rules
- UI: MUST be a client of the EHR core and MUST NOT be treated as the EHR core.
- AI: MUST be advisory only and MUST NOT be a system of record.
- Voice and transcription: MUST be out of core scope and MUST NOT be treated as EHR core inputs, records, or authorities.

## Out of Scope (Explicitly Forbidden in Phase F.0)
- Scheduling, billing, claims, payments: MUST NOT be introduced.
- Messaging: MUST NOT be introduced.
- Lab integrations: MUST NOT be introduced.
- E-prescribing: MUST NOT be introduced.
- EHR interoperability integrations: MUST NOT be introduced.
- Any autonomous clinical decisioning: MUST NOT be introduced.
- Any PHI handling procedures beyond conceptual boundary statements: MUST NOT be introduced.

## Compatibility with Phase E Demo
- Phase E: MUST remain frozen and separate.
- Phase F: MUST NOT retrofit the Phase E demo as architecture or as an implied implementation baseline.

## Exit Criteria
- Phase F-01 implementation planning: MUST be explicitly authorized as a separate, design-only act.
- EHR core boundaries: MUST be reviewed for consistency with platform-wide execution-blocked posture and deny-by-default governance.
- EHR core invariants: MUST be affirmed as non-negotiable for any subsequent planning or build activity.

## Declaration
- This document MUST remain design-only and MUST authorize NOTHING executable.
- Execution MUST remain blocked and MUST NOT be inferred from any design statement in this document.
- Any capability not explicitly permitted by this document MUST be treated as forbidden by default.
