# Zenthea Platform Roadmap

This is the **authoritative source of truth** for platform progress. It integrates high-level strategic phases with tactical execution slices.

- **Execution Standards**: Refer to `docs/01-architecture/execution-standards.md` for rules and definitions.
- **Detailed Specs**: See `docs/12-migration/` for individual slice specifications.

---

## 1. Strategic Timeline (Phases)

| Phase | Description | Status | Target |
| :--- | :--- | :--- | :--- |
| **Phase A** | Complete the Agent Surface (Scaffold Only) | **In Progress** | 100% Scaffolding Coverage |
| **Phase B** | Legacy Repository Analysis | **Planned** | Inventory & Mapping Docs |
| **Phase C** | Migration by Extraction | **Planned** | Domain Parity |
| **Phase D** | Integration & Hardening | **Planned** | Production Readiness |

---

## 2. Integrated Status Board

This table tracks both **Control Plane (CP)** and **Migration (MIG)** slices in order of execution/dependency.

| ID | Category | Name | Status | Evidence / Location |
| :--- | :--- | :--- | :--- | :--- |
| **MIG-00** | Migration | Platform Foundation | **Completed** | `docs/11-next-phases/` |
| **MIG-01** | Migration | Website Builder (Non-Clinical) | **Completed** | `docs/12-migration/slice-01/` |
| **MIG-02B**| Migration | Patient Portal (PHI) | **Completed** | `docs/12-migration/Slice-02B/` |
| **CP-04** | Control | Observability & Abuse Signals | **Completed** | `docs/12-migration/slice-04/` |
| **CP-06** | Control | Agent Governance | **Completed** | `docs/12-migration/slice-06/` |
| **CP-07** | Control | Agent Lifecycle Enforcement | **Completed** | `docs/12-migration/slice-07/` |
| **CP-08** | Control | Approval Signals & Escalation | **Completed** | `docs/12-migration/slice-08/` |
| **CP-09** | Control | Controlled Rollouts & Transitions | **Completed** | `docs/12-migration/slice-09/` |
| **CP-10** | Control | Governance Read Models | **Completed** | `docs/12-migration/slice-10/` |
| **CP-11** | Control | Operator APIs (Read-Only) | **Completed** | `docs/12-migration/slice-11/` |
| **CP-12** | Control | Operator Query Policies | **Completed** | `docs/12-migration/slice-12/` |
| **CP-13** | Control | Operator Audit & Error Taxonomy | **Completed** | `docs/12-migration/slice-13/` |
| **MIG-03** | Migration | Provider Portal (Clinical) | **Draft** | `docs/12-migration/mig-03-provider-portal.md` |
| **CP-14** | Control | Control Plane DTOs & Metadata | **Draft** | `docs/12-migration/slice-14/` |
| **CP-15** | Control | Operator UI Adapter (Headless) | **Draft** | `docs/12-migration/slice-15/` |
| **MIG-04** | Migration | Clinical Documentation (HITL) | **Planned** | — |
| **MIG-05** | Migration | Scheduling & Billing | **Planned** | — |
| **CP-16** | Control | Escalation Paths & Decision Hooks | **Draft** | `docs/12-migration/slice-16/` |
| **CP-17** | Control | Controlled Mutations | **Draft** | `docs/12-migration/slice-17/` |
| **CP-18** | Control | Policy & View Versioning | **Draft** | `docs/12-migration/slice-18/` |
| **CP-19** | Control | Performance & Caching Boundaries | **Draft** | `docs/12-migration/slice-19/` |
| **CP-20** | Control | External Integrations & Interop | **Draft** | `docs/12-migration/slice-20/` |
| **MIG-06** | Migration | Automation & Agent Orchestration | **Planned** | — |

---

## 3. Active Workstream
Currently executing **Phase A (Scaffolding)** and preparing for **MIG-03 (Provider Portal)**.
