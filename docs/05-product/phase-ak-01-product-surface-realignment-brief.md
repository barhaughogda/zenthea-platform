# Phase AK-01: Product Surface Realignment Brief

## 1. Status and Scope
- **Classification**: DESIGN-ONLY
- **Execution Status**: EXECUTION IS NOT ENABLED
- **Phase**: AK-01
- **Authority**: Principal Platform Architect and Product Steward
- **Scope**: This document covers the high-level product intent realignment following the Phase AJ read-only UI exploration. It applies to all future platform development and architectural decisions.

## 2. Purpose of This Document
Phase AK-01 exists to reconcile early read-only UI exploration (Phase AJ) with correct long-term product intent, based on hands-on inspection and critical feedback. This document MUST explicitly clarify that Phase AJ UI artifacts were exploratory, non-representative of final product separation, and were used primarily to surface conceptual mismatches early, not to define final UX.

## 3. Context from Phase AJ
Phase AJ served as a necessary probe into the platform's surface area. The resulting UI artifacts MUST NOT be considered as blueprints or authoritative designs. They were generated to expose areas where the existing architectural model and the proposed user experience were out of sync. All artifacts from Phase AJ are hereby classified as exploratory shells.

## 4. Observed Misalignments
Hands-on inspection of the Phase AJ artifacts has revealed significant divergences from the intended product strategy. These misalignments primarily concern user role boundaries, workflow centrality, and the relative maturity of various platform surfaces. This brief serves to correct these trajectories before any operational execution is authorized.

## 5. Corrected Product Intent: Patient Portal Realignment
The patient portal MUST be strictly patient-facing. Patients MUST be able to see only their own profile, medical history, message threads, and scheduled bookings. The patient portal MUST NOT resemble or share UI paradigms with a provider-facing tool. Any overlap in visual language that suggests provider capabilities within the patient portal is a violation of product intent.

## 6. Corrected Product Intent: Provider View Requirements
Providers MUST have immediate and central access to a patient list. Patient context MUST be the primary anchor for all provider workflows. The absence of robust patient lists in Phase AJ is explicitly identified as a known gap. Future provider-facing surfaces MUST prioritize the patient record as the canonical unit of work.

## 7. Corrected Product Intent: Booking as the Canonical Focus
Booking and scheduling MUST be declared the current canonical vertical slice of the Zenthea platform. All other UI surfaces, including complex clinical views, MUST be treated as placeholders or shells until the booking engine and its associated scheduling workflows are fully grounded and verified.

## 8. Corrected Product Intent: Proposal Model Semantics
The proposal model is currently recognized as opaque at the product level. Proposal semantics MUST be treated as architectural and governance-first rather than UX-driven. UX for proposals MUST NOT be finalized at this stage and MUST be revisited or reframed in later phases after the underlying governance mechanisms are stable.

## 9. Corrected Product Intent: Website Builder Positioning
The existing website builder MUST be recognized as a separate, mature product. The Phase AJ website builder UI MUST be treated as a stub and MUST NOT be used to dictate future product direction. Future integration MUST wrap or federate the existing system, maintaining its integrity as a distinct functional entity.

## 10. Corrected Product Intent: Workbench and Messaging Status
The provider workbench MAY remain a valid target for future development, but assistant integration and advanced workbench UX MUST remain deferred and non-authoritative. Messaging surfaces MUST be considered intentionally incomplete. Messaging functionality MUST ONLY be addressed after booking and scheduling workflows are stabilized.

## 11. Explicit Non-Goals
This document MUST NOT be used to authorize any operational execution or code implementation. It MUST NOT be interpreted as a technical specification or a UI design document. Defining final pixel-perfect layouts or specific API schemas is explicitly outside the scope of this realignment brief.

## 12. Relationship to Phase AJ Lock
This realignment brief MUST supersede any conflicting product assumptions documented in the Phase AJ Lock. While the technical discoveries of Phase AJ remain valid, the product direction defined here MUST take precedence in all future planning.

## 13. Relationship to Future Phases
This document serves as the primary product foundation for Phase AK and all subsequent phases. Any architectural or design work that does not align with the intent specified herein MUST be rejected during governance reviews.

## 14. Change Control Rules and Closing Governance Statement
Any modifications to this product realignment brief MUST be approved by the Principal Platform Architect and Product Steward. This document authorizes NOTHING operational; it is a design-only governance instrument intended to ensure product-market-architecture fit.
