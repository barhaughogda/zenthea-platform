# Phase AJ-03: Read-Only Navigation and Surface Shells

**Classification:** READ-ONLY IMPLEMENTATION  
**Phase:** AJ-03  
**Document Type:** Implementation Specification  
**Effective Date:** 2026-01-15  
**Version:** 1.0.0

---

## 1. Status and Execution State

**EXECUTION IS NOT ENABLED.**

This document specifies the read-only navigation shell and surface implementations for Phase AJ-03. All code produced under this specification MUST remain non-operational. No backend integration, data persistence, or execution semantics are permitted.

---

## 2. Scope of Phase AJ-03

Phase AJ-03 introduces multi-surface navigation to make the Zenthea scaffold feel like an actual product while maintaining strict governance controls.

### 2.1 Surfaces Implemented

The following surfaces are added, each accessible via client-side routing:

| Surface | Route | Purpose |
|---------|-------|---------|
| Booking | `/booking` | Read-only booking management visualization |
| Patient Portal | `/patient-portal` | Read-only patient information display |
| Provider Workbench | `/provider-workbench` | Read-only provider workflow visualization |
| Website Builder | `/website-builder` | Read-only website content preview |
| Assistant | `/assistant` | Read-only AI assistant interaction preview |

### 2.2 Detail Pages per Surface

Each surface includes at least two detail pages demonstrating:
- Inspect-only views
- Preview proposal views (non-persistent)
- Clear empty states and placeholders

---

## 3. Navigation Shell Specification

### 3.1 Required Elements

- A left sidebar navigation MUST display all five surfaces
- Each surface MUST display a clear banner: "READ-ONLY / NON-OPERATIONAL"
- Navigation MUST use client-side routing only (Next.js Link component)

### 3.2 Prohibited Navigation Behaviors

- Navigation MUST NOT trigger server actions
- Navigation MUST NOT invoke loaders or mutations
- Navigation MUST NOT call backend APIs
- Navigation state MUST NOT persist beyond the browser session

---

## 4. Surface Landing Page Requirements

Each surface landing page MUST include:

1. A short purpose statement
2. A "What you can do here (read-only)" list
3. A "What you CANNOT do here" list
4. Static mock cards/lists using inline mock data only

---

## 5. Definition of "Proposal" and "Preview" in AJ-03

### 5.1 Proposal Semantics

A "proposal" in Phase AJ-03 means:
- An ephemeral, in-memory-only UI representation
- A visualization that is reversible by browser refresh
- A display that does NOT imply confirmation or execution
- A suggestion that carries NO persistence or side effects

### 5.2 Preview Semantics

A "preview" in Phase AJ-03 means:
- A read-only visualization of potential content
- A display that MUST NOT create or store anything
- A view that MUST NOT trigger any backend process
- A temporary rendering that exists only in UI state

### 5.3 Critical Constraints

- Proposals MUST NOT be stored (no localStorage, sessionStorage, cookies, indexedDB)
- Proposals MUST NOT be transmitted (no API calls, no webhooks, no messages)
- Proposals MUST be completely lost upon page refresh
- No proposal interaction MUST imply that execution will occur

---

## 6. Permitted Interaction Types

### 6.1 Allowed Button/CTA Labels

Buttons and CTAs MUST be limited to:
- View
- Inspect
- Preview
- Propose

### 6.2 Allowed User Interactions

- Navigate between surfaces and pages
- Expand and collapse content sections
- View detail pages
- Inspect mock data
- Preview proposals (ephemeral, in-memory only)

---

## 7. Explicit Prohibitions

The following are explicitly prohibited in Phase AJ-03:

### 7.1 Backend Integration

- MUST NOT call any backend APIs
- MUST NOT add server actions, loaders, or mutations
- MUST NOT add RPC calls or GraphQL queries
- MUST NOT fetch data from external sources

### 7.2 Persistence

- MUST NOT write to databases
- MUST NOT use localStorage
- MUST NOT use sessionStorage
- MUST NOT use cookies
- MUST NOT use indexedDB
- MUST NOT use any form of client-side storage

### 7.3 Authentication

- MUST NOT implement real authentication
- MUST NOT check user sessions
- MUST NOT validate tokens
- MAY include placeholder text indicating where auth would be

### 7.4 Analytics and Telemetry

- MUST NOT add analytics scripts
- MUST NOT add telemetry
- MUST NOT add tracking pixels
- MUST NOT add usage metrics collection

### 7.5 Execution Semantics

- MUST NOT include submit/save/confirm/execute semantics
- MUST NOT add background behavior
- MUST NOT add time-based logic (timers, intervals, scheduled actions)
- MUST NOT add feature flags intended to later enable execution

### 7.6 Prohibited Button Labels

The following terms MUST NOT appear as actionable UI elements:
- Execute
- Apply
- Save
- Confirm
- Submit
- Finalize
- Approve
- Authorize
- Complete
- Process

---

## 8. SHADCN Component Usage Policy

### 8.1 Permitted Use

- SHADCN components MAY be used as visual primitives only
- Components MUST be used for layout and presentation
- Components MAY be styled according to design requirements

### 8.2 Prohibited Use

- Components MUST NOT encode workflow semantics
- Components MUST NOT imply execution capability
- Components MUST NOT carry behavioral assumptions
- Form components MUST NOT imply submission will persist data

---

## 9. Governance Compliance

### 9.1 Binding Documents

This specification operates under and does not supersede:
- Phase AJ UI Governance and Interaction Rules
- Phase AJ-02: Read-Only UI Scaffolding
- All Phase AI governance locks
- All Phase Z foundational locks

### 9.2 Change Control

This document is immutable within Phase AJ. Modifications require new governance artifacts.

---

## 10. Verification Checklist

Before Phase AJ-03 implementation is considered complete:

- [ ] All five surfaces are accessible via navigation
- [ ] Each surface displays "READ-ONLY / NON-OPERATIONAL" banner
- [ ] Each surface has a landing page with required elements
- [ ] Each surface has at least 2 detail pages
- [ ] All buttons use only permitted labels (View, Inspect, Preview, Propose)
- [ ] No API calls are present in any component
- [ ] No persistence mechanisms are present
- [ ] No server actions are defined
- [ ] All mock data is inline and static
- [ ] Browser refresh clears all proposals

---

## 11. Closing Governance Statement

**EXECUTION REMAINS BLOCKED.**

All UI work produced under this specification is for visualization and structural proposal only. No provision of this document enables, permits, or authorizes:

- Implementation of execution pathways
- Persistence of any data
- Backend API integration
- Authentication enforcement
- Any operational activity whatsoever

This document is audit-ready and regulator-safe.

---

**Document Control:**

- Author: Principal Frontend Architect
- Classification: READ-ONLY IMPLEMENTATION
- Phase: AJ-03
- Execution Status: BLOCKED
- Parent Document: Phase AJ UI Governance and Interaction Rules
