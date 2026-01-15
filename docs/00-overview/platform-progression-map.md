# Zenthea Platform – Progression Map

## Purpose of This Document
This document provides a high-level progression view of the platform across major phases, intended for internal alignment, reporting, and planning. It serves as a factual record of completed milestones and a sequence for upcoming work.

## How to Read This Map
- Phases are sequential but may overlap in implementation.
- Percentages reflect confidence-weighted completion at the phase level.
- “Complete” means objectives are satisfied and closed, even if some legacy artifacts are not present on the current `main` branch.

## Platform Phase Matrix
| Phase | Name | Primary Objective | Status | % Complete | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| M–U | Foundation & Demo Governance | Establish platform foundations and governance through demo artifacts. | COMPLETE | 100% | Objectives satisfied; focus shifted from demo to product. |
| V | Product Transition | Formalize the shift from demo-centric work to canonical product development. | COMPLETE | 100% | Canonical state defined; repository optimized for incremental delivery. |
| W | Data Integration | Integrate and ground AI capabilities in real clinical and operational data. | COMPLETE | 100% | Objectives satisfied at design, governance, and execution-planning level. Runtime execution remains blocked. |
| X | Identity & Authentication | Implement robust authentication and authorization for real users. | COMPLETE | 100% | Architecture, execution planning, and governance complete. No runtime activation. |
| Y | Execution Pathways | Build and govern pathways for state-changing actions within the platform. | COMPLETE | 100% | Execution skeletons, audit core, domain wiring, and locks complete. Execution blocked by design. |
| Z | Scale & Resilience | Ensure platform performance and security at production scale. | COMPLETE | 100% | Governance frameworks Z-01 through Z-05 locked. No operational enablement. |
| AA–AD | Product Interaction & Proposal Layer | Establish user-facing product surfaces and proposal-based workflows without execution. | COMPLETE | 100% | Read-only, proposal, refinement, and decision-support layers complete and locked. Execution remains explicitly blocked. |

## Current Overall Platform Status
Governance, architecture, execution skeletons, and product interaction layers (through Phase AD) are complete and locked. The platform now has a full, non-operational product surface with proposal, refinement, and decision-support capabilities. Execution remains intentionally and explicitly blocked pending future governance.

## What Comes Next (High-Level)
- **Product Interaction & Proposal Layer**: Establishing human-centered surfaces for proposal interaction and governance.
- **Controlled Validation**: Testing interaction models within locked execution boundaries.
- **Feedback Integration**: Refining product surfaces based on read-only and proposal-based validation.

## Estimation and Planning Notes
- Percentages are directional and reflect high-level phase progress, not contractual deadlines.
- This document supports internal planning and communication rather than binding external commitments.

## Relationship to Other Overview Documents
- `docs/00-overview/zenthea-north-star.md`
- `docs/00-overview/platform-status.md`
