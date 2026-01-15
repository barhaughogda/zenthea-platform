# Platform Integration Map

## 1. Title and Purpose
This document provides a high-level, human-readable overview of how the various components and product surfaces of the Zenthea platform integrate and interact. Its purpose is to serve as an orientation and alignment artifact for founders, engineers, and stakeholders, clarifying the boundaries and responsibilities across the platform.

## 2. Scope and Non-Goals
This document is strictly limited to a conceptual integration overview.
- **Non-Goals**: This document does not cover user experience (UX) flows, specific API specifications, low-level implementation details, or project timelines/roadmaps. It is not a build guide.

## 3. Canonical Product Surfaces
The Zenthea platform is experienced through several distinct surfaces, each with specific roles and constraints.

### Patient Portal
- **Primary Responsibility**: Provides patients with access to their own health records, care plans, and communication with their care team.
- **What it is allowed to read**: The patient’s own records, shared care plans, and authorized messages.
- **What it is NOT allowed to do**: Access data for other patients, modify clinical records without provider review, or initiate clinical actions without explicit provider oversight.


### Provider Portal (EHR)
- **Primary Responsibility**: Serves as the primary clinical interface for healthcare providers to manage patient care, document encounters, and coordinate workflows.
- **What it is allowed to read**: Full clinical records for patients under the provider’s care, platform-generated summaries, and AI-assisted drafts.
- **What it is NOT allowed to do**: Bypass platform-level audit logs or modify core platform governance policies.

### Website Builder (Clinic Web Presence & Booking)
- **Primary Responsibility**: Enables clinics to build, customize, and manage their public-facing website, including service information, provider profiles, and patient booking entry points.
- **What it is allowed to read**: Clinic-owned configuration data, branding assets, provider availability metadata, and booking configuration necessary to render public pages.
- **What it is NOT allowed to do**: Access or expose protected health information (PHI), bypass patient consent boundaries, or directly modify clinical records or appointments without routing through governed booking and orchestration layers.

### Operator / Admin Surfaces
- **Primary Responsibility**: Used by administrative and operational staff for system configuration, user management, and platform-level oversight.
- **What it is allowed to read**: System logs, user metadata, and non-clinical operational data.
- **What it is NOT allowed to do**: Access sensitive clinical data (PHI) without specific operational justification and audit logging.

### AI Assistant Surface
- **Primary Responsibility**: Provides conversational assistance and context-aware drafting within the Patient and Provider Portals. It is non-autonomous by default.
- **What it is allowed to read**: Contextually relevant data from the record currently being viewed, following strict least-privilege principles.
- **What it is NOT allowed to do**: Independently change clinical state, commit orders without human verification, or act as an autonomous decision-maker.

## 4. Shared Platform Layers
All product surfaces rely on a set of common, governed layers that ensure consistency and safety.

- **Identity & Authentication**: Manages secure access, role-based permissions, and multi-tenant isolation.
- **Data & Records**: The canonical source of truth for clinical and operational data, providing structured and auditable storage.
- **AI Runtime**: The orchestration layer that executes AI requests, ensuring models are grounded in verified data and operate within safety bounds.
- **Orchestration / Execution Control**: Governs how state-changing actions are proposed, reviewed by humans, and eventually executed.
- **Audit & Observability**: Provides a comprehensive, immutable record of all platform interactions, ensuring traceability and accountability.

## 5. Integration Principles
Surfaces interact according to strict principles to maintain platform integrity.

- **Read vs Write Boundaries**: Surfaces are primarily read-only for clinical data. Any write operation must pass through the Orchestration layer for validation and human approval.
- **Human-in-the-loop Constraints**: No AI-proposed action can be finalized without explicit human review and confirmation.
- **Execution Isolation**: Individual surfaces and AI requests operate in isolated contexts to prevent unauthorized data leakage or privilege escalation.
- **Auditability as a First-Class Requirement**: Every interaction that crosses a surface or layer boundary must be logged with sufficient context to reconstruct the event for regulatory review.

## 6. Relationship to Other Overview Documents
This document should be read in conjunction with:
- `docs/00-overview/zenthea-north-star.md`: For the long-term vision and core principles.
- `docs/00-overview/platform-status.md`: For the current authoritative state of the repository.
- `docs/00-overview/platform-progression-map.md`: For the sequential phases of platform development.

## 7. Stability and Change Rules
This document is a high-level architectural artifact. It should evolve only when there is a significant change in the platform’s surface architecture or integration philosophy. Any changes require explicit review and must be committed to the `main` branch with clear rationale.
