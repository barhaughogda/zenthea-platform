## Phase F-02: EHR Core Implementation Authorization – Slice 1 (Patient)

## Classification and Status
- Phase Identifier: MUST be F-02.
- Slice Identifier: MUST be Slice 1 (Patient).
- Status: MUST be IMPLEMENTATION-AUTHORIZATION | LOCKED.
- Execution posture: MUST remain deny-by-default.
- Any execution enablement: MUST NOT be implied by this authorization.

## Purpose
- This authorization MUST authorize the minimum implementation work required to introduce the Patient core entity as a governed write model and read model.
- This authorization MUST preserve all Phase F-00 invariants and Phase F-01 planning constraints.
- This authorization MUST remain compatible with the Phase E freeze and MUST NOT retrofit Phase E artifacts as an implementation baseline.

## Authorized Scope (Allowed Work)
The authorization MUST be limited to:
- Patient write model implementation (authority boundary for patient-scoped record ownership).
- Patient read model implementation (derived, non-authoritative views).
- Boundary enforcement mechanisms that prevent UI or AI from being treated as authority sources for Patient data.
- Audit hooks as planning placeholders ONLY, without implementing full Audit Event entity in this slice.
The authorization MAY allow minimal plumbing strictly required to keep write vs read separation enforceable.

## Explicitly Forbidden Scope (Not Authorized)
The authorization MUST forbid:
- Encounter implementation.
- Clinical Note implementation.
- Audit Event entity implementation.
- Any scheduling, billing, messaging, labs, e-prescribing, interoperability.
- Any transcript handling, voice capture, diarization, or speech pipelines.
- Any AI autonomy or any AI persistence authority.
- Any client-trusted attribution.
- Any background processing, automation, or telemetry.

## Patient Invariants (Non-Negotiable)
The implementation MUST ensure:
- Patient represents the subject of care and establishes a patient-scoped authority boundary.
- Patient MUST NOT imply authentication, authorization, or identity mechanisms.
- Patient data mutation MUST be explicit and governed.
- Patient read surfaces MUST NOT imply write capability.
- Any future association of clinical content MUST remain out of scope in Slice 1.

## Write Model Requirements (Conceptual Constraints for Implementation)
- Patient write operations MUST be explicitly bounded.
- Writes MUST be attributable to a human clinician context without trusting the client as the authority source.
- Writes MUST fail closed when required authority signals are absent.
- Draft/final semantics MUST NOT be introduced in Slice 1 (reserved for Clinical Note).

## Read Model Requirements (Conceptual Constraints for Implementation)
- Read models MUST be derived and MUST NOT be used as a write path.
- Read models MUST be safe-by-default and MUST minimize exposure of sensitive content beyond what is strictly required for patient selection and context.

## Validation and Evidence Requirements
Implementation completion MUST require evidence that:
- Patient write vs read separation exists and is enforced.
- No other entity capabilities were introduced.
- No execution expansion or background behaviors were added.
- Deny-by-default posture remains intact.

## Exit Criteria for Slice 1
Slice 1 MUST be considered complete only when:
- Authorized Patient models exist with enforced boundaries.
- No forbidden scope was implemented.
- The system remains compatible with Phase E freeze (no retrofitting).
- A subsequent governance act is prepared for Slice 2 (Encounter) if desired.

## Declaration
- This authorization MUST be interpreted narrowly.
- Anything not explicitly authorized MUST be treated as forbidden.
- Execution MUST remain blocked by default and MUST NOT be inferred as enabled by this document.
