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
| W | Data Integration | Integrate and ground AI capabilities in real clinical and operational data. | NOT STARTED | 0% | Focus on data source connectivity and grounding safety. |
| X | Identity & Authentication | Implement robust authentication and authorization for real users. | NOT STARTED | 0% | Foundational for secure multi-tenant or multi-role access. |
| Y | Execution Pathways | Build and govern pathways for state-changing actions within the platform. | NOT STARTED | 0% | Focus on auditable and human-overridden execution. |
| Z | Scale & Resilience | Ensure platform performance and security at production scale. | NOT STARTED | 0% | Preparing for broader user rollout and operational stability. |

## Current Overall Platform Status
The platform has successfully completed its foundational and demo-focused phases (M through V) and is now positioned for real product development. The repository has been cleaned and optimized for incremental, evidence-based delivery. Current efforts are focused on preparing for Phase W, specifically around data integration and grounding, as the platform transitions from read-only summaries to integrated workflows.

## What Comes Next (High-Level)
- **Data Integration**: Connect the platform to real-world data sources to enable grounded AI assistance.
- **Identity & Authentication**: Establish secure user access and role-based permissions.
- **Execution Pathways**: Develop the mechanisms for auditable, human-in-the-loop state changes.

## Estimation and Planning Notes
- Percentages are directional and reflect high-level phase progress, not contractual deadlines.
- This document supports internal planning and communication rather than binding external commitments.

## Relationship to Other Overview Documents
- `docs/00-overview/zenthea-north-star.md`
- `docs/00-overview/platform-status.md`
