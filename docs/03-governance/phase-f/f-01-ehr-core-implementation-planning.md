## Phase F-01: EHR Core Implementation Planning

## Classification and Status
- Phase Identifier: MUST be F-01.
- Status: MUST be DESIGN-ONLY | LOCKED.
- Execution remains BLOCKED: MUST remain true.

## Purpose
- This document MUST define the constraints for implementation planning of the EHR core without authorizing any build activity.
- This document MUST translate Phase F-00 invariants into explicit planning constraints that govern future implementation proposals.
- This document MUST preserve a deny-by-default posture for any capability not explicitly permitted as planning activity.

## Planning Scope
- Planning MUST be limited to conceptual model responsibilities, authority boundaries, and sequencing constraints.
- Planning MUST define boundaries between write models and read models without defining any storage mechanism or persistence strategy.
- Planning MAY define interfaces in conceptual terms only and MUST NOT define executable behaviors.
- Planning MUST remain compatible with Phase E freeze and MUST NOT retrofit Phase E artifacts as an implementation baseline.
- The following remain forbidden under this phase:
  - Any application code: MUST NOT be authored.
  - Any API surface: MUST NOT be defined.
  - Any schema, migration, or storage detail: MUST NOT be defined.
  - Any operational workflow or runtime pathway: MUST NOT be introduced.
  - Any change that implies execution or persistence enablement: MUST NOT be introduced.

## Planned Core Write Models (Conceptual Only)
- The planned core write models MUST be limited to the EHR core entities locked in Phase F-00 and MUST preserve their invariants.
- Patient:
  - MUST represent the subject of care within the EHR core.
  - MUST serve as an authority boundary for patient-scoped clinical record content.
  - MUST NOT imply identity, authentication, or authorization mechanisms.
- Encounter:
  - MUST represent a bounded clinical interaction context that groups clinical documentation.
  - MUST provide the conceptual boundary for encounter-scoped documentation and finalization decisions.
  - MUST NOT imply scheduling, billing, or messaging capabilities.
- Clinical Note:
  - MUST represent clinician-authored documentation within an encounter context.
  - MUST preserve human authority over clinical truth.
  - MUST support draft and finalized states as governed by Phase F-00 lifecycle rules.
- Audit Event:
  - MUST represent attributable provenance for clinically relevant actions and content state transitions.
  - MUST be treated as mandatory for all write-relevant state changes.
  - MUST NOT be optional or best-effort in planning.

## Planned Read Models (Conceptual Only)
- Read models MUST be planned as separate from write models and MUST NOT imply write capability.
- Read models MUST be treated as derived views that do not establish authority over the write domain.
- Read models MUST NOT imply mutability, finalization authority, or state transition capability.
- Any read surface that could be misconstrued as editable MUST be constrained to require write-model validation and explicit human authority.

## Versioning and Finalization Semantics
- Draft vs Finalized:
  - Draft state MUST be mutable only under explicit human clinician authority within the authorship boundary.
  - Finalized state MUST be explicit, sealed, and attributable to a human clinician.
  - Finalized content MUST NOT be overwritten.
- Amendment rules:
  - Amendments MUST be recorded as a new version that references the finalized content.
  - Amendments MUST NOT replace or erase finalized content.
  - Amendments MUST preserve attribution and temporal ordering.
- Non-destructive history guarantees:
  - Clinical content history MUST be non-destructive and MUST preserve prior finalized states.
  - Any future authorization of deletion MUST remain deny-by-default and MUST be separately governed.

## Audit and Provenance Planning
- The following MUST be auditable in any future implementation proposal:
  - Creation and modification of draft clinical notes.
  - Finalization of clinical notes.
  - Amendments to finalized clinical notes.
  - Any clinically relevant state transition within the EHR core boundary.
- Attribution requirements:
  - All write-relevant actions MUST be attributable to a human clinician.
  - Attribution MUST be explicit and MUST NOT be inferred from a client context.
- Temporal ordering guarantees:
  - Audit events MUST support a total ordering of clinically relevant state transitions within an encounter context.
  - Audit records MUST preserve the order of finalization and amendment events without ambiguity.

## AI Integration Planning Boundary
- AI MAY assist with drafting suggestions for clinical notes.
- AI MUST NOT author, finalize, or persist clinical records.
- AI outputs MUST be treated as untrusted suggestions and MUST require explicit human clinician review and intent for any write-relevant action.
- AI involvement MUST NOT weaken or bypass audit, provenance, or finalization requirements.

## UI and Client Planning Boundary
- UI MUST be planned as a consumer of EHR core authority and MUST NOT be treated as an authority source.
- UI-led state change MUST NOT be permitted without core validation and explicit human clinician authority.
- Client behavior MUST NOT be assumed trustworthy for purposes of finalization, attribution, or audit completeness.

## Explicit Non-Goals for Phase F.1
- Phase F.1 MUST NOT define implementation details, runtime pathways, or operational enablement.
- Phase F.1 MUST NOT define any integration beyond the EHR core entities locked in Phase F-00.
- Phase F.1 MUST NOT introduce scheduling, billing, claims, payments, messaging, lab integrations, e-prescribing, or interoperability integrations.
- Phase F.1 MUST NOT define voice capture, transcription handling, or any mechanism that treats such inputs as authoritative records.
- Phase F.1 MUST NOT define any mechanism for autonomous clinical decisioning.
- Phase F.1 MUST NOT define PHI handling procedures beyond the boundary constraints and audit requirements stated herein.

## Exit Criteria
- Proceeding to Phase F.2 MUST require a separate, explicit governance act that authorizes implementation activities.
- The Phase F.2 authorization act MUST affirm all Phase F-00 invariants and MUST reaffirm deny-by-default for any capability not explicitly permitted.
- Phase F.2 authorization MUST require evidence that:
  - Planning artifacts remain design-only and introduce no executable logic.
  - The write vs read separation remains enforced at the conceptual boundary level.
  - Finalization, amendment, and non-destructive history semantics remain non-negotiable.
  - Audit and provenance requirements remain mandatory for all write-relevant actions.
  - AI and UI boundaries remain intact and do not imply authority or persistence.

## Declaration
- This document MUST remain design-only and MUST authorize NOTHING executable.
- Execution MUST remain blocked and MUST NOT be inferred from any statement in this document.
- Any capability not explicitly permitted as planning under this document MUST be treated as forbidden by default.
