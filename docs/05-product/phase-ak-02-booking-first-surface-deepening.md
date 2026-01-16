# Phase AK-02: Booking-First Product Surface Deepening

## 1. Status and Scope
- **Classification:** DESIGN-ONLY
- **Execution Status:** EXECUTION IS NOT ENABLED
- **Phase:** AK-02
- **Authority:** Principal Platform Architect and Product Governance Steward
- **Scope:** This document defines the binding product surface deepening principles for booking-first orientation. It applies exclusively to design-level governance and authorizes no operational activity.

EXECUTION IS NOT ENABLED. This document is a design-only governance artifact. No implementation, deployment, or operational activity is authorized by this document.

## 2. Purpose of This Document
This document exists to deepen and formalize the booking-first product orientation established in Phase AK-01. It MUST serve as the authoritative reference for all design activities concerning patient and provider surfaces within the booking vertical.

Phase AK-02 MUST NOT be interpreted as an execution artifact. Phase AK-02 MUST NOT be used to justify, enable, or prepare execution readiness of any kind. This document is strictly declarative and exists solely to bind future design activities to the correct product orientation.

EXECUTION IS NOT ENABLED.

## 3. Binding Authorities and Dependencies
This document is bound by and MUST maintain strict alignment with:
- Phase AK Product Governance Lock
- Phase AK-01: Product Surface Realignment Brief
- All applicable architecture, execution, and governance locks established through Phase AJ

Any conflict between this document and the above authorities MUST be resolved in favor of the earlier governance instruments. This document MUST NOT supersede, weaken, or reinterpret any existing governance lock.

This document authorizes NOTHING operational.

## 4. Definition of "Booking-First" Product Orientation
"Booking-First" product orientation MUST be understood as follows:
- Booking and scheduling MUST be the sole canonical product vertical at this stage.
- All patient-facing and provider-facing surfaces MUST derive their primary organizing principle from the booking vertical.
- Patient context MUST be accessed through the lens of scheduled bookings, not as an independent navigational entity.
- Provider workflows MUST be anchored to the schedule as the primary interface paradigm.

"Booking-First" MUST NOT be interpreted as a temporary constraint to be relaxed. It MUST be treated as the binding product orientation until a subsequent governance phase explicitly declares otherwise.

EXECUTION IS NOT ENABLED.

## 5. Canonical Booking Vertical Declaration
The booking and scheduling vertical is hereby declared the sole canonical product vertical for the Zenthea platform at this governance stage.

This declaration MUST bind all design activities as follows:
- Design activities MUST prioritize and center the booking vertical.
- Design activities MUST NOT expand scope beyond the booking vertical without explicit governance authorization.
- All surfaces, workflows, and product concepts outside the booking vertical MUST be treated as deferred, exploratory, or explicitly excluded.

This declaration does NOT enable execution. This declaration does NOT prepare execution. This declaration does NOT justify execution readiness. Any future execution requires separate governance phases and explicit enablement acts.

## 6. Patient Surface Deepening Principles (Booking Context Only)
Patient-facing surfaces MUST be limited strictly to booking context. The following principles are binding:

Patient-facing surfaces MAY include:
- Viewing availability for booking purposes
- Viewing existing bookings
- Viewing booking-related confirmations

Patient-facing surfaces MUST NOT include:
- Standalone medical record access divorced from booking context
- Messaging functionality
- General profile management beyond booking-relevant information
- Any surface that operates independently of the booking vertical

Patient context MUST be understood as secondary to booking context. The patient surface exists to serve the booking vertical, not as an independent product domain.

EXECUTION IS NOT ENABLED.

## 7. Provider Surface Deepening Principles (Schedule-Centric)
Provider-facing surfaces MUST be schedule-centric. The following principles are binding:

Provider-facing surfaces MAY include:
- Schedule-first views showing upcoming and past bookings
- Patient context derived exclusively from the schedule
- Booking management and scheduling operations

Provider-facing surfaces MUST NOT include:
- Standalone patient lists divorced from booking context
- General patient record management independent of scheduled encounters
- Workflow surfaces that do not anchor to the schedule
- Any surface that treats patient context as primary over schedule context

There MUST NOT be a standalone patient list divorced from booking context. Providers MUST access patient information through the schedule, not through an independent patient registry interface.

EXECUTION IS NOT ENABLED.

## 8. Assistant Participation Constraints (Booking Context Only)
Assistant participation MUST be strictly constrained to booking context. The following constraints are binding:

The assistant MAY:
- Assist within booking context only
- Support booking-related queries and navigation
- Facilitate schedule-related information retrieval

The assistant MUST NOT:
- Operate as a general assistant
- Propose, infer, rank, or automate decisions
- Extend assistance beyond the booking vertical
- Initiate or suggest actions outside explicit user direction within booking context
- Exercise any form of autonomous behavior

Assistant functionality MUST be treated as subordinate to the booking vertical. Any assistant capability that cannot be directly tied to booking context MUST be excluded from design consideration at this stage.

EXECUTION IS NOT ENABLED.

## 9. Explicitly Excluded Product Surfaces
The following product surfaces are explicitly excluded from Phase AK-02 and MUST NOT be included in any design activity under this governance:

- Messaging systems of any kind
- Medical record management independent of booking context
- Website builder functionality
- Cross-domain workflows
- Execution pathways of any kind
- Clinical documentation surfaces
- Billing and payment processing surfaces
- Analytics and reporting dashboards
- Administrative configuration interfaces beyond booking settings
- Integration surfaces with external systems
- Any surface not directly serving the booking vertical

Excluded surfaces MUST remain excluded until a subsequent governance phase explicitly authorizes their inclusion. Inclusion of excluded surfaces without governance authorization MUST be treated as a governance violation.

## 10. UI Exploration Boundaries
UI exploration under Phase AK-02 MUST be strictly bounded as follows:

UI exploration MAY:
- Deepen understanding of booking-centric patient surfaces
- Deepen understanding of schedule-centric provider surfaces
- Clarify interaction patterns within the booking vertical

UI exploration MUST NOT:
- Produce final UX specifications
- Define pixel-perfect layouts
- Establish binding interaction contracts
- Extend beyond the booking vertical
- Prepare or justify execution readiness

Any UI exploration conducted under Phase AK-02 MUST be treated as design-only and non-authoritative for implementation purposes.

EXECUTION IS NOT ENABLED.

## 11. Prohibited Interpretations and Scope Drift
The following interpretations of Phase AK-02 are explicitly prohibited:

- Phase AK-02 MUST NOT be interpreted as enabling execution.
- Phase AK-02 MUST NOT be interpreted as preparing execution.
- Phase AK-02 MUST NOT be interpreted as justifying execution readiness.
- Phase AK-02 MUST NOT be interpreted as authorizing implementation of any kind.
- Phase AK-02 MUST NOT be interpreted as expanding scope beyond the booking vertical.
- Phase AK-02 MUST NOT be interpreted as relaxing any constraints established in prior governance phases.
- Phase AK-02 MUST NOT be interpreted as granting assistant autonomy.
- Phase AK-02 MUST NOT be interpreted as establishing binding technical specifications.

Scope drift MUST be actively resisted. Any activity that extends beyond the explicit boundaries of this document MUST be rejected during governance review.

## 12. Change Control Rules
Phase AK-02 is subject to the following change control rules:

- This document MUST NOT be modified without explicit governance authorization from the Principal Platform Architect and Product Governance Steward.
- Any proposed changes MUST be documented in a separate governance artifact before modification.
- Changes that expand scope beyond the booking vertical MUST require a new governance phase.
- Changes that enable, prepare, or justify execution MUST be rejected.

This document is intended to be immutable under normal circumstances. Modification indicates a significant governance event requiring full audit trail documentation.

## 13. Relationship to Future Phases
Phase AK-02 establishes the design foundation for subsequent phases. The following relationships are declared:

- Future phases MAY deepen booking-first design within the boundaries established herein.
- Future phases MAY NOT expand beyond the booking vertical without explicit governance authorization.
- Future phases that seek to enable execution MUST proceed through separate governance phases and explicit enablement acts.
- Future phases MUST NOT retroactively reinterpret Phase AK-02 to justify scope expansion.

Phase AK-02 does NOT enable execution. Phase AK-02 does NOT prepare execution. Phase AK-02 does NOT justify execution readiness. Any future execution requires separate governance phases and explicit enablement acts.

## 14. Closing Governance Statement
This document is a DESIGN-ONLY governance artifact. It exists solely to deepen and formalize the booking-first product orientation for the Zenthea platform.

EXECUTION IS NOT ENABLED.

This document authorizes NOTHING operational. No implementation, deployment, runtime activation, persistence activation, or operational activity of any kind is authorized by Phase AK-02.

Any interpretation of this document that suggests execution enablement, execution preparation, or execution readiness justification MUST be rejected as a governance violation.

Phase AK-02 does NOT enable execution.
Phase AK-02 does NOT prepare execution.
Phase AK-02 does NOT justify execution readiness.

EXECUTION REMAINS BLOCKED.
