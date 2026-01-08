# MIG-03 – Provider Portal Decomposition (Conceptual Map)

## Status: CONCEPTUAL ONLY
**Authority:** Principal Software Architect  
**Slice Context:** MIG-03 (Provider Portal UI)

---

## 1. Current State Overview

### Legacy Aggregation Surface
The current `/company` route serves as a legacy aggregation point for all clinician-facing operations, including settings, patient management, scheduling, and billing. This monolith-in-a-route structure is a direct port from the legacy architecture.

### Short-Term Acceptability
This aggregation is acceptable in the short term because MIG-03 is a mechanical migration focused on stabilizing the UI shell within the new monorepo. Prioritizing architectural purity during the migration would introduce unacceptable execution risk. By maintaining the `/company` structure "as-is" during MIG-03, we ensure a stable baseline for future extraction without disrupting clinical workflows.

---

## 2. Candidate Future Apps

The following domains are identified as candidates for extraction from the `/company` route into standalone, isolated applications.

### Messaging (`apps/messaging`)
- **Responsibility**: Real-time patient-clinician and internal clinician communication.
- **Rationale**: Messaging requires specialized real-time infrastructure and strict HIPAA-compliant audit logging. Separation allows for independent scaling and high-availability updates without impacting the rest of the portal.

### Appointments (`apps/appointments`)
- **Responsibility**: Scheduling, slot management, and encounter orchestration.
- **Rationale**: Scheduling logic involves complex concurrency and integration with patient-facing booking engines. Isolating this domain prevents scheduling failures from cascading into clinical documentation or billing.

### Billing (`apps/billing`)
- **Responsibility**: Revenue cycle management, claims processing, and payment status.
- **Rationale**: Billing is a high-compliance domain requiring SOC2-level auditability. Separating financial logic from clinical logic ensures that financial auditors have a restricted, clearly defined surface area.

### Reports (`apps/reports`)
- **Responsibility**: Clinical outcomes and operational efficiency analytics.
- **Rationale**: Reporting often involves heavy read-only data processing. Separation ensures that resource-intensive analytics queries do not degrade the performance of transactional clinical tools.

### Clinic Admin (`apps/clinic-admin`)
- **Responsibility**: Organization identity, tenancy settings, and role-based access control.
- **Rationale**: This is the core authority for the clinic's existence. Isolating administrative settings from clinical tools prevents accidental configuration changes by non-admin staff.

---

## 3. Extraction Principles

The future decomposition must adhere to the following principles:
- **UI Shell First**: Each extracted app must boot its own independent Next.js shell.
- **SDK-Driven Integration**: Apps must interact with domain logic exclusively via Agent SDKs; direct backend/DB access is prohibited.
- **No Cross-App Business Logic**: Domain logic must live within the Service/Agent layer, not the Frontend application layer.
- **Consent-First Access**: Every application must verify access permissions via the `Consent Agent` before rendering patient-sensitive data.

---

## 4. Explicit Non-Actions

The following actions are strictly prohibited during the current architectural phase:
- **No Extraction in MIG-03**: Any attempt to move code into new `apps/` or `packages/` outside of the approved `apps/provider-portal` shell is a violation of the MIG-03 scope.
- **No Shared State**: Future apps must not share runtime state (e.g., shared Redux stores or global Contexts). Integration must be at the routing level.
- **No Backend Coupling via UI**: The UI must never serve as the primary bridge between backend services. Coupling must be handled via the API Gateway or Event Bus.

---

## 5. Decision Gate

Decomposition and extraction of these candidate apps are only permitted to start after:
1.  **MIG-03 is Sealed**: All legacy UI is successfully ported and verified in the `apps/provider-portal` shell.
2.  **Core Governance Slices are Complete**:
    - **MIG-04** (Observability & Abuse Controls)
    - **MIG-06** (Agent Governance & Permission Model)
3.  **Agent SDKs are Stabilized**: The corresponding Service/Agent SDKs are published and verified as "Integration Ready."

---

## Final Statement

“This document provides a conceptual trajectory only and does not authorize implementation or changes to the current MIG-03 execution plan.”
