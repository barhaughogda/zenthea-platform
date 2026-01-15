# Architecture Baseline Declaration

---

## Status Block

| Field | Value |
|-------|-------|
| Document Type | Architecture Governance Artifact |
| Status | **ARCHITECTURE BASELINE (FROZEN)** |
| Execution | **NOT ENABLED** |
| Classification | Internal Governance Contract |
| Baseline Version | 1.0 |
| Declaration Date | 2026-01-15 |

---

## 1. Purpose of This Declaration

This document formally declares the integration architecture for the Zenthea platform as a frozen baseline. The purpose of this declaration is to establish an unambiguous reference point that governs all future execution and implementation work.

### 1.1 Why an Architecture Baseline Is Required

Before any implementation or execution work may proceed, the platform requires a stable, documented architecture that:

- Defines the canonical boundaries, responsibilities, and constraints for all product surfaces
- Establishes invariant principles that must hold across all implementation phases
- Provides an audit-ready reference for regulators, governance bodies, and internal review
- Prevents architectural drift through implicit or undocumented changes
- Ensures that all parties—engineering, product, clinical governance, and compliance—operate from a shared understanding

Without a declared baseline, implementation work risks diverging from architectural intent, introducing inconsistencies, and creating ungoverned behaviours.

### 1.2 Why Freezing Is Necessary Before Execution Begins

Freezing the architecture baseline serves the following purposes:

- **Stability**: Implementation teams require a stable target. Concurrent architecture changes during implementation create ambiguity and risk.
- **Accountability**: A frozen baseline provides a clear reference against which implementation can be verified. Deviations become identifiable architectural defects.
- **Governance**: Regulatory and compliance review requires stable documentation. A frozen baseline enables meaningful audit and review.
- **Change Control**: All future changes to the architecture must be explicit, documented, and subject to governance. Freezing establishes the point from which change control applies.

This declaration freezes the architecture for the purpose of enabling controlled execution. It does not authorise execution itself.

---

## 2. Scope of the Baseline

### 2.1 What This Baseline Covers

This baseline covers the integration architecture for the Zenthea platform as defined in Integration Slices 01 through 05. Specifically, this baseline governs:

- Product surface boundaries and responsibilities
- Data ownership, read/write access rules, and mutation constraints
- Identity, consent, and access boundary models
- Assistant and AI capability boundaries and prohibitions
- Human-in-the-loop requirements for state-changing actions
- Proposal vs committed record boundaries
- Scheduling and order domain boundaries
- Execution blocking constraints
- Audit and traceability requirements

### 2.2 What This Baseline Does Not Cover

This baseline explicitly excludes:

- Implementation details, code architecture, or technical specifications
- Technology choices, infrastructure decisions, or deployment configurations
- Timelines, milestones, or delivery schedules
- Operational procedures, runbooks, or incident response
- User interface designs, interaction patterns, or visual specifications
- Performance targets, capacity planning, or scaling strategies
- Commercial terms, pricing, or business arrangements
- Execution enablement or runtime behaviour authorisation

Items not covered by this baseline are subject to separate governance and documentation.

---

## 3. Canonical Integration Slices

The following Integration Slices together constitute the canonical architecture baseline for the Zenthea platform. These slices define the minimum required platform contract that all implementation must respect.

### 3.1 Integration Slice 01: Booking to Care

**Location:** `docs/01-architecture/integration-slice-01-booking-to-care.md`

Defines the conceptual boundaries, data flows, and governance constraints for the patient journey from public booking through to care delivery across Website Builder, Patient Portal, and Provider Portal surfaces.

### 3.2 Integration Slice 02: Identity and Consent

**Location:** `docs/01-architecture/integration-slice-02-identity-and-consent.md`

Defines identity states, consent models, and access boundaries that govern all authenticated interactions within the platform. Establishes that consent is never inferred and that identity elevation requires human confirmation.

### 3.3 Integration Slice 03: Assistant and AI Boundaries

**Location:** `docs/01-architecture/integration-slice-03-assistant-and-ai-boundaries.md`

Defines access boundaries, responsibilities, and prohibitions for assistant and AI surfaces. Establishes that assistants operate in proposal mode only and must not execute state-changing actions without explicit human confirmation.

### 3.4 Integration Slice 04: Messaging and Clinical Documentation

**Location:** `docs/01-architecture/integration-slice-04-messaging-and-clinical-documentation.md`

Defines boundaries between draft and committed states for messaging and clinical documentation. Establishes that drafts have no clinical authority and that commitment requires explicit human confirmation.

### 3.5 Integration Slice 05: Scheduling, Orders, and Execution Readiness

**Location:** `docs/01-architecture/integration-slice-05-scheduling-orders-and-execution-readiness.md`

Defines boundaries between scheduling proposals, confirmed schedules, and executable actions. Establishes that execution is not enabled and that the boundary between confirmation and execution is blocked.

### 3.6 Collective Authority

These five Integration Slices together define the complete integration architecture baseline. No single slice may be interpreted in isolation. The slices are interdependent and must be read as a unified specification.

---

## 4. Architectural Invariants

The following invariants are non-negotiable principles that must hold across all implementation. Violation of any invariant constitutes an architectural defect.

### 4.1 Proposal vs Execution Separation

All assistant, automated, and system-generated actions must remain in proposal state until explicitly confirmed by an authorised human. The distinction between proposal and execution must be maintained at all architectural and implementation levels.

### 4.2 Human-in-the-Loop Requirements

All state-changing actions that affect patient data, clinical records, scheduling, orders, messaging, consent, or identity require explicit human confirmation. No system, process, or assistant may bypass this requirement.

### 4.3 Assistant Non-Authority

Assistants and AI surfaces hold no authority to execute actions. Assistants may prepare proposals, summarise information, and support human decision-making. Assistants must not confirm, commit, dispatch, or execute any action.

### 4.4 Explicit Confirmation Boundaries

Confirmation must be explicit, affirmative, specific, informed, logged, and separate from the drafting or preparation step. Silence, timeout, or inaction does not constitute confirmation.

### 4.5 Auditability

All actions, access decisions, and state changes must be logged with full attribution, timestamp, and context. Audit trails must be immutable and retained per regulatory requirements.

### 4.6 Consent Is Never Inferred

No system, process, or assistant may infer, assume, or derive consent. All consent must be explicitly granted through affirmative patient action.

### 4.7 No Silent Action

No system, process, or assistant may perform actions without user visibility. All actions must be visible, logged, and subject to review.

### 4.8 Tenant Isolation

All data is tenant-scoped. Cross-tenant data access is prohibited at the platform level.

### 4.9 No Cross-Patient Visibility

Under no circumstance may one patient view, access, or infer the existence of another patient's data.

### 4.10 No Delegation of Clinical Judgement

Clinical judgement must not be delegated to AI systems. AI may support but must not substitute for human clinical decision-making.

---

## 5. Execution Posture

### 5.1 Execution Is Not Enabled

This baseline declaration does not enable execution. No runtime behaviour, system configuration, or operational deployment is authorised by this document or by the Integration Slices it references.

### 5.2 This Document Authorises No Runtime Behaviour

This document is a design governance artifact. It establishes boundaries and constraints. It does not authorise:

- Deployment of any system component
- Activation of any runtime feature
- Execution of any automated process
- Delivery of any scheduled action or order

### 5.3 No Transition to Execution Is Permitted by This Declaration

Transition from architecture baseline to execution requires separate governance authorisation that is explicitly outside the scope of this declaration. This declaration establishes what must hold; it does not authorise operational effect.

---

## 6. Change Control Rules

### 6.1 How This Baseline May Be Amended

Changes to this baseline require:

- Formal proposal documenting the proposed change and rationale
- Architecture review by designated architectural authority
- Impact assessment across all affected Integration Slices
- Documentation of the change in a versioned amendment
- Explicit approval through governance process
- Update to baseline version number

### 6.2 Versioned Documentation Requirement

All changes to the baseline must be documented in versioned form. The baseline version number must be incremented for each approved change. Historical versions must be retained for audit and reference purposes.

### 6.3 Prohibition of Implicit or Undocumented Changes

Implicit, informal, or undocumented changes to the architecture are prohibited. Any implementation that deviates from the documented baseline without formal amendment constitutes an architectural defect.

---

## 7. Relationship to Product Development

### 7.1 Product Development May Proceed

Product development, design, and planning activities may proceed under this baseline. The architecture provides stable boundaries within which product decisions may be made.

### 7.2 All Implementation Must Conform to This Baseline

All implementation work—code, configuration, integration, and deployment—must conform to the boundaries, constraints, and invariants defined in this baseline. Implementation teams are responsible for ensuring conformance.

### 7.3 Violations Are Architectural Defects

Implementation that violates the baseline constitutes an architectural defect. Architectural defects must be remediated before deployment. Architectural defects are not permitted to proceed to production.

---

## 8. Relationship to Governance and Compliance

### 8.1 Regulatory and Audit Interpretation

Regulators, auditors, and compliance reviewers should interpret this baseline as:

- The canonical definition of architectural boundaries for the platform
- The authoritative reference for what behaviours are permitted and prohibited
- A design governance artifact that does not itself authorise operational deployment
- Evidence of architectural intent and governance discipline

### 8.2 Audit-Ready Documentation

This baseline and the Integration Slices it references are intended to be audit-ready. They document:

- What data access is permitted and by whom
- What human-in-the-loop requirements apply
- What assistant and AI boundaries are enforced
- What execution constraints are in place

### 8.3 Compliance Responsibility

Compliance with applicable regulations remains a separate obligation. This baseline supports compliance by establishing clear boundaries; it does not itself constitute compliance certification.

---

## 9. Explicit Prohibitions

The following behaviours are explicitly prohibited under this baseline.

### 9.1 No Bypassing Slices

No implementation may bypass the boundaries defined in the Integration Slices. All product surfaces and capabilities must operate within the boundaries defined herein.

### 9.2 No Partial Adoption

The Integration Slices must be adopted as a complete set. Selective adoption of individual slices while ignoring others is prohibited.

### 9.3 No Silent Execution

No system, process, or assistant may execute actions without user visibility and explicit human confirmation. Silent or background execution is prohibited.

### 9.4 No Assistant-Led Authority

Assistants must not hold or exercise authority. All authority resides with authenticated humans who explicitly confirm actions.

### 9.5 No Time-Based Execution

No action may be executed based solely on the passage of time. Time-triggered automation that bypasses human confirmation is prohibited.

### 9.6 No Autonomous Execution

No system, process, or assistant may execute state-changing actions autonomously. All execution requires contemporaneous human authorisation.

### 9.7 No Bulk Confirmation

Bulk confirmation of multiple items is prohibited. Each item requiring confirmation must be individually reviewed and confirmed.

### 9.8 No Implicit Authority

Authority must be explicitly granted and verified. Absence of explicit prohibition does not constitute permission.

---

## 10. Transition Statement

### 10.1 Architecture Definition Is Complete for This Phase

This declaration marks the completion of integration architecture definition for the current phase. The Integration Slices referenced herein represent a complete and coherent architectural specification.

### 10.2 The Platform Is Permitted to Enter Execution Planning Phases

With this baseline declared and frozen, the platform is permitted to enter execution planning phases. Execution planning includes:

- Technical design within baseline constraints
- Implementation planning and sequencing
- Resource allocation and team organisation
- Dependency identification and mitigation

Execution planning does not constitute execution. Execution remains blocked.

### 10.3 This Baseline Remains Binding

Throughout execution planning and any subsequent phases, this baseline remains binding. All activities must conform to the boundaries, constraints, and invariants defined herein. Changes require formal amendment per the change control rules.

---

## 11. Closing Architecture Statement

This document constitutes a frozen reference artifact for the Zenthea platform integration architecture.

The Integration Slices referenced herein define the canonical boundaries, responsibilities, and constraints that govern all product surfaces, data flows, and system behaviours within the platform scope.

This baseline is declarative. It establishes what must hold. It does not authorise operational deployment or runtime execution.

**Execution remains blocked unless separately authorised through documented governance processes outside the scope of this declaration.**

This baseline is effective as of the declaration date and remains in force until superseded by a subsequent versioned baseline.

---

*End of Architecture Baseline Declaration*
