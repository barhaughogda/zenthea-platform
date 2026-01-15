# Integration Slice 01: Booking to Care (Website Builder → Patient Portal → Provider Portal)

## 1. Status and Scope

| Attribute | Value |
|-----------|-------|
| Status | Draft |
| Slice Identifier | IS-01 |
| Author | Platform Architecture Team |
| Last Updated | 2026-01-15 |
| Review Status | Pending Internal Review |

This integration slice defines the conceptual boundaries, data flows, and governance constraints for the booking-to-care journey across three product surfaces: Website Builder, Patient Portal, and Provider Portal.

This document is a design and integration artifact. It does not prescribe implementation details, timelines, or execution logic.

---

## 2. Purpose of This Integration Slice

This slice exists to:

- Define how a patient's journey from public booking to ongoing care is stitched across product surfaces
- Establish clear boundaries for data access, identity, and tenancy
- Ensure that all surfaces consume the same canonical data through governed interfaces
- Document read-only, proposal, and potential future execution paths without enabling autonomous behavior
- Provide a reference artifact for architecture review and regulatory audit

This slice does not enable autonomous execution. All state-changing actions described herein require explicit human confirmation before becoming effective.

---

## 3. Involved Product Surfaces

### Website Builder (Clinic Web Presence and Booking)

The Website Builder is the public-facing surface through which prospective patients discover clinic services, view provider availability, and initiate booking requests.

- **Role in this slice**: Entry point for patient booking intent
- **Data access**: Clinic-owned configuration, branding, provider availability metadata, booking configuration
- **Constraints**: No access to protected health information (PHI); cannot directly modify clinical records or confirmed appointments

### Patient Portal

The Patient Portal provides authenticated patients with access to their own health records, care plans, and communication with their care team.

- **Role in this slice**: Destination for patients to view booking confirmations, upcoming appointments, and care-related information
- **Data access**: The patient's own records, shared care plans, authorized messages, booking proposals and confirmations
- **Constraints**: Cannot access data for other patients; cannot modify clinical records without provider review

### Provider Portal (EHR)

The Provider Portal serves as the primary clinical interface for healthcare providers to manage patient care, document encounters, and coordinate workflows.

- **Role in this slice**: Surface through which providers review, confirm, or modify booking proposals; manage scheduled appointments; and deliver care
- **Data access**: Full clinical records for patients under the provider's care, booking requests, and scheduling data
- **Constraints**: All actions are subject to audit logging; cannot bypass platform-level governance policies

---

## 4. High-Level User Journey (Narrative)

The following narrative describes the conceptual user journey across surfaces. This is not an implementation specification.

1. **Discovery**: A prospective patient visits a clinic's public website, built and hosted via the Website Builder. The patient browses available services and provider profiles.

2. **Booking Intent**: The patient selects a service and preferred time slot. The Website Builder captures this intent and creates a booking proposal. This proposal is a record of intent, not a confirmed appointment.

3. **Identity Establishment**: If the patient is new, a provisional identity record is created pending verification. If the patient is returning, the booking proposal is associated with their existing identity.

4. **Proposal Routing**: The booking proposal is routed to the appropriate governed layer for processing. The proposal enters a pending state awaiting provider-side review or automated confirmation rules (where such rules exist and are explicitly configured by the clinic).

5. **Provider Review (if required)**: Depending on clinic configuration, certain booking types may require explicit provider or staff review before confirmation. This review occurs within the Provider Portal or associated administrative surfaces.

6. **Confirmation and Record Creation**: Once a booking is confirmed (either through automated rules or human review), the appointment record is created in the canonical data layer. This record becomes visible to the patient in the Patient Portal and to the provider in the Provider Portal.

7. **Pre-Appointment Access**: The patient may access their upcoming appointment details, any required intake forms, and preparatory information through the Patient Portal.

8. **Care Delivery**: At the scheduled time, the provider conducts the appointment using the Provider Portal. Clinical documentation, care plans, and follow-up actions are recorded.

9. **Post-Appointment Continuity**: Following the appointment, the patient may access visit summaries, care instructions, and follow-up scheduling through the Patient Portal. The cycle may repeat.

---

## 5. Canonical Data Objects

The following data objects are relevant to this integration slice. All surfaces access these objects through governed interfaces; no surface maintains a separate source of truth.

| Object | Description | Owner | Access Pattern |
|--------|-------------|-------|----------------|
| Booking Proposal | A record of patient booking intent, pending confirmation | Booking Service | Write: Website Builder (via API); Read: Patient Portal, Provider Portal |
| Appointment | A confirmed, scheduled appointment record | Scheduling Service | Write: Provider Portal, Booking Service (on confirmation); Read: Patient Portal, Provider Portal, Website Builder (availability only) |
| Patient Identity | Canonical patient identity and demographic record | Identity Service | Write: Identity Service only; Read: All surfaces (scoped to authorization) |
| Provider Availability | Time slots and capacity metadata for booking | Scheduling Service | Write: Provider Portal, Admin Surfaces; Read: Website Builder, Patient Portal |
| Clinic Configuration | Clinic-level settings, branding, and booking rules | Configuration Service | Write: Admin Surfaces; Read: Website Builder, Patient Portal, Provider Portal |

---

## 6. Identity, Tenancy, and Access Boundaries

### Multi-Tenant Isolation

All data within this slice is tenant-scoped. A tenant represents a single clinic or healthcare organization. Cross-tenant data access is prohibited at the platform level.

### Identity Model

- **Patients**: Authenticated via patient identity credentials. A patient may only access their own records and appointments.
- **Providers**: Authenticated via provider identity credentials. A provider may access records for patients under their care within their tenant.
- **Public Users**: Unauthenticated users interacting with the Website Builder have access only to public clinic information and booking initiation. No PHI is accessible to unauthenticated users.

### Access Control Principles

- Principle of least privilege applies across all surfaces
- Role-based access control (RBAC) governs data visibility
- All access decisions are logged for audit purposes
- Cross-surface data access occurs only through governed APIs

---

## 7. Read vs Write Responsibilities

This section clarifies which surfaces may read or write specific data categories within this slice.

| Data Category | Website Builder | Patient Portal | Provider Portal |
|---------------|-----------------|----------------|-----------------|
| Booking Proposals | Write (create), Read (own proposals) | Read (own proposals) | Read, Write (confirm/reject) |
| Appointments | Read (availability metadata only) | Read (own appointments) | Read, Write (manage) |
| Patient Identity | None (public); Read (provisional, scoped) | Read (own identity) | Read (patients under care) |
| Clinical Records | None | Read (own records, limited) | Read, Write (full access) |
| Provider Availability | Read (public metadata) | Read (public metadata) | Read, Write |
| Clinic Configuration | Read (public-facing config) | Read (patient-facing config) | Read (provider-facing config) |

### Write Constraints

- **Website Builder**: May create booking proposals only. Cannot create or modify appointments, clinical records, or patient identity beyond provisional intake.
- **Patient Portal**: Primarily read-only for clinical and scheduling data. May update patient-controlled profile fields. Cannot modify appointments or clinical records directly.
- **Provider Portal**: May confirm, modify, or cancel appointments. May create and update clinical records. All writes are subject to audit and governance rules.

---

## 8. System-to-System Interfaces (Conceptual)

The following interfaces enable data flow between surfaces and platform services. These are conceptual boundaries, not API specifications.

### Website Builder → Booking Service

- **Purpose**: Submit booking proposals
- **Data**: Patient intent, requested service, requested time, provisional patient information
- **Behavior**: Synchronous request; returns proposal identifier and status

### Booking Service → Scheduling Service

- **Purpose**: Validate availability and create appointments upon confirmation
- **Data**: Proposal details, provider availability queries, appointment creation requests
- **Behavior**: Internal service-to-service communication; may be synchronous or event-driven

### Scheduling Service → Patient Portal

- **Purpose**: Provide appointment visibility to patients
- **Data**: Appointment details scoped to authenticated patient
- **Behavior**: Read-only query interface

### Scheduling Service → Provider Portal

- **Purpose**: Provide appointment management interface to providers
- **Data**: Appointment details, patient context, scheduling operations
- **Behavior**: Full read/write interface with audit logging

### Identity Service → All Surfaces

- **Purpose**: Authenticate users and provide identity context
- **Data**: Authentication tokens, identity attributes, authorization scopes
- **Behavior**: Centralized identity authority; surfaces do not store credentials

---

## 9. Explicit Non-Goals

This integration slice explicitly excludes the following:

- **Autonomous Execution**: No surface or service within this slice may execute state-changing actions without human confirmation. Booking proposals result in records, not automatic appointments, unless explicit clinic-configured rules permit auto-confirmation.
- **AI-Driven Decision Making**: This slice does not define AI-assisted booking optimization, automated scheduling, or predictive availability. AI capabilities, if introduced, would be documented in separate slices with explicit governance constraints.
- **Payment and Billing**: Financial transactions, insurance verification, and billing workflows are outside the scope of this slice.
- **Clinical Documentation Details**: While this slice covers the transition from booking to care delivery, detailed clinical documentation workflows are governed by separate specifications.
- **Cross-Tenant Data Sharing**: This slice assumes single-tenant operation. Multi-tenant data sharing, referral networks, or federated identity are not in scope.
- **Implementation Guidance**: This document does not prescribe technology choices, database schemas, or code-level implementation patterns.

---

## 10. Governance and Safety Posture

### Human-in-the-Loop Requirements

All state-changing operations within this slice require human confirmation at defined checkpoints:

- Booking proposals may be auto-confirmed only where clinic-configured rules explicitly permit, and only for low-risk appointment types
- Provider-side confirmation is required for appointment types designated as requiring clinical review
- Modifications to confirmed appointments require provider or authorized staff action
- Patient cancellations may be self-service within policy-defined windows

### Audit and Traceability

- All booking proposals, confirmations, modifications, and cancellations are logged with full context
- Audit logs include timestamp, actor identity, action type, and affected records
- Logs are immutable and retained per regulatory requirements
- Cross-surface data access is traced via correlation identifiers

### Compliance Alignment

This slice is designed to support compliance with applicable healthcare regulations, including but not limited to:

- Patient privacy and data protection requirements
- Access control and minimum necessary standards
- Audit trail and record retention obligations

Specific regulatory mappings are maintained in separate compliance documentation.

### Failure Modes

- Booking proposal submission failures result in user notification; no partial state is created
- Scheduling conflicts are surfaced to users and providers; conflicting proposals are not auto-resolved
- Service unavailability is handled gracefully with appropriate user messaging
- No silent failures are permitted for state-changing operations

---

## 11. Relationship to Platform Integration Map

This integration slice is a detailed view of a specific user journey within the broader platform architecture. It should be read in conjunction with:

- **Platform Integration Map** (`docs/00-overview/platform-integration-map.md`): Provides the high-level overview of product surfaces, shared platform layers, and integration principles that govern all slices.

This slice adheres to the integration principles defined in the Platform Integration Map, including:

- Read vs write boundaries
- Human-in-the-loop constraints
- Execution isolation
- Auditability as a first-class requirement

This slice does not duplicate content from the Platform Integration Map. Where this slice requires more specific detail, it extends rather than contradicts the parent document.

---

## 12. Future Extension Points (Non-Binding)

The following extension points are identified for potential future development. These are non-binding observations, not commitments or planned features.

### Potential Future Capabilities

- **Automated Availability Optimization**: AI-assisted scheduling suggestions based on provider capacity and patient preferences (would require separate governance specification)
- **Waitlist Management**: Patient waitlist functionality for fully booked time slots
- **Multi-Provider Booking**: Coordinated booking across multiple providers for complex care scenarios
- **Telehealth Integration**: Virtual visit scheduling and video consultation infrastructure
- **Patient Self-Scheduling Expansion**: Broader patient autonomy for appointment modifications within defined policy boundaries
- **Integration with External Scheduling Systems**: Interoperability with third-party calendaring and scheduling platforms

### Extension Governance

Any future extensions to this slice must:

- Be documented in separate, versioned integration slices or amendments
- Undergo architecture review before implementation
- Maintain the governance and safety posture defined in this document
- Preserve human-in-the-loop requirements for state-changing operations
- Be subject to regulatory and compliance review as applicable

---

## Document History

| Version | Date | Author | Change Summary |
|---------|------|--------|----------------|
| 0.1 | 2026-01-15 | Platform Architecture Team | Initial draft |
