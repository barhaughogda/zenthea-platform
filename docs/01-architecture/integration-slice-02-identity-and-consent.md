# Integration Slice 02: Identity, Consent, and Access Boundaries

**Public → Patient → Provider**

---

## 1. Status and Scope

| Field | Value |
|-------|-------|
| Status | Draft |
| Slice Identifier | IS-02 |
| Classification | Design and Integration Artifact |

This document is a design and integration artifact only. It defines conceptual boundaries, ownership models, and access constraints for identity and consent within the Zenthea platform.

Execution is not enabled by this document. No runtime behaviour, system configuration, or operational change is authorised by its contents.

---

## 2. Purpose of This Integration Slice

Identity and consent are foundational to all other integration slices. Without clearly defined identity states and consent boundaries, no downstream slice may safely determine:

- Who is requesting an action
- What access that requester is permitted
- Whether the requester has consent to access specific data
- What audit trail must be maintained

This slice defines boundaries, not implementations. It establishes the conceptual model that all other slices must respect when handling identity, consent, and access control.

This slice does not prescribe how identity or consent shall be implemented. It prescribes what properties must hold, what boundaries must be enforced, and what behaviours are prohibited.

---

## 3. Involved Product Surfaces

### 3.1 Website Builder (Public, Unauthenticated Surface)

The Website Builder represents the public-facing, unauthenticated surface of the platform. Users interacting through this surface are treated as anonymous until identity is established through explicit action.

**Constraints:**
- No access to patient-specific data
- No access to clinical records
- No write access to identity or consent records
- May initiate identity establishment (e.g., registration request)

### 3.2 Patient Portal (Authenticated Patient Surface)

The Patient Portal is the authenticated surface through which verified patients interact with their own health data, appointments, and consent preferences.

**Constraints:**
- Access limited to the authenticated patient's own records
- No cross-patient visibility under any circumstance
- May read and modify own consent grants
- May not modify identity records of other patients
- May not access provider-only data

### 3.3 Provider Portal (Authenticated Clinical Surface)

The Provider Portal is the authenticated surface through which verified clinical providers access patient data for care delivery purposes.

**Constraints:**
- Access requires verified provider identity
- Access to patient data requires explicit consent grant
- Bound by tenant isolation
- May not modify patient consent grants
- May record clinical data within authorised scope

---

## 4. Identity States (Conceptual Model)

The platform recognises the following identity states. Transitions between states require explicit action and are subject to verification requirements.

### 4.1 Anonymous / Public User

A user with no established identity. This is the default state for all users prior to any identification action.

**Permitted:**
- View public content
- Initiate registration or identification flow

**Not Permitted:**
- Access any patient data
- Access any clinical data
- Modify any records

### 4.2 Provisional Identity

A user who has initiated identity establishment but has not completed verification. This state exists during registration, verification, or identity linking processes.

**Permitted:**
- Complete verification steps
- Cancel identity establishment

**Not Permitted:**
- Access patient or clinical data
- Be treated as a verified identity for any access decision

### 4.3 Verified Patient Identity

A user whose identity has been verified and linked to a patient record. This identity state grants access to the Patient Portal.

**Permitted:**
- Access own patient data
- Manage own consent grants
- Interact with authorised services

**Not Permitted:**
- Access other patients' data
- Access provider-only functions
- Modify identity records beyond own profile

### 4.4 Provider Identity

A user whose identity has been verified as a clinical provider with appropriate credentials. This identity state grants access to the Provider Portal.

**Permitted:**
- Access patient data where consent has been granted
- Record clinical data within authorised scope
- Operate within assigned tenant

**Not Permitted:**
- Access patients outside assigned tenant
- Modify patient consent grants
- Access data without explicit consent

---

## 5. Consent Model (Conceptual)

Consent within the platform follows a patient-controlled model with explicit grant requirements. Consent is never inferred.

### 5.1 Patient-Controlled Consent

Patients control consent over their own data. No access to patient data is permitted without an explicit consent grant from the patient or a legally authorised representative.

### 5.2 Provider-Controlled Access

Providers control access to provider-generated clinical data within the bounds of patient consent. Providers may not extend access beyond what the patient has consented to.

### 5.3 Explicit Consent vs Implied Consent

The platform operates exclusively on explicit consent. Implied consent is not recognised for any access decision.

- Explicit consent requires affirmative action by the patient
- Consent must specify scope, duration, and permitted parties
- General or blanket consent is not valid

### 5.4 Revocation Principles

Consent may be revoked by the patient at any time. Revocation takes effect immediately upon confirmation.

- Revocation does not delete historical records
- Revocation prevents future access under the revoked grant
- Clinical records created under valid consent remain accessible for continuity of care where legally required

### 5.5 Consent Is Never Inferred

No system, process, or agent may infer consent from user behaviour, context, or implicit signals. All consent must be explicitly recorded through patient action.

---

## 6. Canonical Identity and Consent Objects

The following canonical objects represent the core data structures for identity and consent. These definitions describe conceptual structure, not implementation.

### 6.1 Identity Record

Represents a verified identity within the platform.

| Attribute | Description |
|-----------|-------------|
| Identity Identifier | Unique, immutable identifier |
| Identity Type | Patient, Provider, or System |
| Verification Status | Verified, Provisional, or Revoked |
| Tenant Association | Tenant to which the identity belongs |
| Creation Timestamp | When the identity was established |

**Ownership:** Platform  
**Write Access:** Identity Service (system-controlled)  
**Read Access:** Services requiring identity verification

### 6.2 Consent Grant

Represents an explicit consent given by a patient for data access.

| Attribute | Description |
|-----------|-------------|
| Grant Identifier | Unique identifier for the grant |
| Patient Identity | The patient granting consent |
| Grantee Identity | The provider or service receiving consent |
| Scope | Specific data or actions covered |
| Valid From | Effective start date |
| Valid Until | Expiration date (if applicable) |
| Revocation Status | Active or Revoked |

**Ownership:** Patient  
**Write Access:** Patient (via Patient Portal)  
**Read Access:** Services evaluating access requests

### 6.3 Authorization Scope

Represents the bounded permissions associated with a consent grant.

| Attribute | Description |
|-----------|-------------|
| Scope Identifier | Unique scope reference |
| Resource Type | Category of data or action |
| Permitted Actions | Read, Write, or specific operations |
| Constraints | Additional limitations |

**Ownership:** Platform (defined by policy)  
**Write Access:** Policy administration  
**Read Access:** Access control evaluation

### 6.4 Access Log

Represents an immutable record of access to patient data.

| Attribute | Description |
|-----------|-------------|
| Log Identifier | Unique log entry identifier |
| Accessor Identity | Who accessed the data |
| Patient Identity | Whose data was accessed |
| Resource Accessed | What was accessed |
| Action Performed | Read, Write, or other |
| Timestamp | When access occurred |
| Consent Grant Reference | Which grant authorised access |

**Ownership:** Platform  
**Write Access:** System (automatic on access)  
**Read Access:** Audit, Compliance, Patient (own records)

---

## 7. Read vs Write Responsibilities

The following table defines which product surface may read or write identity and consent data.

| Data Object | Website Builder | Patient Portal | Provider Portal |
|-------------|-----------------|----------------|-----------------|
| Identity Record (Read) | No | Own Only | Own Only |
| Identity Record (Write) | No | No | No |
| Consent Grant (Read) | No | Own Only | Granted Only |
| Consent Grant (Write) | No | Own Only | No |
| Authorization Scope (Read) | No | Applicable Only | Applicable Only |
| Authorization Scope (Write) | No | No | No |
| Access Log (Read) | No | Own Only | Own Actions Only |
| Access Log (Write) | No | No | No |

**Explicit Prohibition:** Cross-surface mutation of identity or consent data is prohibited. No surface may modify data owned by another surface or another user.

---

## 8. Access Boundary Enforcement

Access boundaries are enforced through the following principles.

### 8.1 Role-Based Access Control

Access decisions are based on verified identity and assigned role. Roles define permitted actions within a surface.

### 8.2 Least-Privilege Principle

Each identity is granted only the minimum access required for its function. Access is not granted by default.

### 8.3 Tenant Isolation

Providers operate within assigned tenants. No provider may access data outside their tenant boundary, regardless of consent.

### 8.4 No Cross-Patient Visibility

Under no circumstance may one patient view, access, or infer the existence of another patient's data. This prohibition has no exceptions.

---

## 9. Human-in-the-Loop Requirements

The following actions require explicit human confirmation and may not be automated or bypassed.

### 9.1 Identity Elevation

Transition from Provisional Identity to Verified Identity requires explicit human confirmation. No system may autonomously elevate identity status.

### 9.2 Consent Changes

Creation, modification, or revocation of consent grants requires explicit human confirmation from the patient. No system may autonomously create or modify consent.

### 9.3 No Autonomous Escalation

No system, agent, or process may escalate access privileges without explicit human authorisation. Escalation requests require human review and approval.

---

## 10. Explicit Non-Goals

The following are explicitly out of scope for this integration slice and are prohibited behaviours within the platform.

### 10.1 No Autonomous Consent

No system may create, infer, or assume consent on behalf of a patient. Consent requires explicit patient action.

### 10.2 No AI-Driven Authorization Decisions

Authorization decisions must not be made by AI systems. All access control decisions follow deterministic rules based on verified identity and explicit consent.

### 10.3 No Cross-Tenant Identity Linking

Identities may not be linked across tenant boundaries. Each tenant maintains isolated identity records.

### 10.4 No Execution Logic

This slice defines boundaries and models only. It contains no execution logic, no runtime behaviour, and no implementation directives.

---

## 11. Relationship to Other Architecture Artifacts

This integration slice operates within the context of the broader platform architecture.

### 11.1 Referenced Artifacts

| Artifact | Location | Relationship |
|----------|----------|--------------|
| Platform Integration Map | `docs/00-overview/platform-integration-map.md` | Defines overall integration topology |
| Integration Slice 01: Booking to Care | `docs/01-architecture/integration-slice-01-booking-to-care.md` | First integration slice; depends on identity model |

### 11.2 Relationship Statement

This slice enables, but does not replace, other integration slices. All slices that involve patient data, clinical workflows, or cross-surface communication must respect the identity and consent boundaries defined herein.

This slice is a prerequisite for any slice involving authenticated access or patient data.

---

## 12. Future Extension Points (Non-Binding)

The following extension points are identified for potential future consideration. These are non-binding and explicitly out of scope for this slice.

### 12.1 Voice Assistants Referencing Identity (Read-Only)

Future voice interfaces may reference verified identity for personalised responses. Such access would be read-only and subject to consent.

**Status:** Non-binding, out of scope

### 12.2 Delegated Access

Future capability for patients to delegate access to caregivers or family members under controlled conditions.

**Status:** Non-binding, out of scope

### 12.3 External Identity Providers

Future integration with external identity providers for federated authentication.

**Status:** Non-binding, out of scope

---

*End of Integration Slice 02*
