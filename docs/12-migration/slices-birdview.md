# Platform Birdview (Control Plane + Migration)

This document is the **birdview status board** for platform progress.

Important:
- The repo contains both **migration slices** (product surfaces) and **control-plane slices** (governance hardening).
- To avoid confusion, migration work is tracked as `MIG-xx` in `docs/12-migration/migration-roadmap-birdview.md`.
- The table below tracks **control-plane slices** only.

Rules:
- This board is **status-only** and must reflect reality.
- Do not mark a slice **Completed** unless the corresponding code + tests are merged.
- Future slices may be scaffolded as **Draft (Not Approved)**, but must not be executed until explicitly started.

Legend:
- **Completed**: implemented + verified + sealed (docs + code aligned)
- **In Progress**: actively being implemented on a branch
- **Planned**: specified but not started
- **Draft (Not Approved)**: scaffolded placeholder only; not authoritative execution guidance yet
- **Unknown**: not documented in this repo; do not assume

---

## Current Status Table

| Slice | Name | Status | Primary Evidence / Location |
|------:|------|--------|-----------------------------|
| 01 | (Reserved: migration slice numbering) | **See MIG roadmap** | `docs/12-migration/migration-roadmap-birdview.md` |
| 02B | (Reserved: migration slice numbering) | **See MIG roadmap** | `docs/12-migration/migration-roadmap-birdview.md` |
| 03 | (Not documented) | **Unknown** | — |
| 04 | Observability & Abuse Signals | **Completed** | `docs/12-migration/slice-04/slice-04-complete.md` |
| 05 | (Not documented) | **Unknown** | — |
| 06 | Agent Governance | **Completed** | `docs/12-migration/slice-06/` (status aligned to implementation) |
| 07 | Agent Lifecycle Enforcement | **Completed** | `docs/12-migration/slice-07/slice-07-complete.md` |
| 08 | Approval Signals & Escalation | **Completed** | `docs/12-migration/slice-08/slice-08-complete.md` |
| 09 | Controlled Rollouts & Lifecycle Transitions | **Completed** | `docs/12-migration/slice-09/slice-09-complete.md` |
| 10 | Governance Read Models | **Completed** | `docs/12-migration/slice-10/slice-10-complete.md` |
| 11 | Operator APIs (Read-Only) | **Completed** | `docs/12-migration/slice-11/` |
| 12 | Operator Query Policies + Saved Views | **Completed** | `docs/12-migration/slice-12/` |
| 13 | Operator Audit Events & Error Taxonomy | **Draft (Not Approved)** | `docs/12-migration/slice-13/` |
| 14 | Control Plane DTOs & View Metadata | **Draft (Not Approved)** | `docs/12-migration/slice-14/` |
| 15 | Operator UI Adapter (Headless) | **Draft (Not Approved)** | `docs/12-migration/slice-15/` |
| 16 | Escalation Paths & Decision Hooks | **Draft (Not Approved)** | `docs/12-migration/slice-16/` |
| 17 | Controlled Mutations | **Draft (Not Approved)** | `docs/12-migration/slice-17/` |
| 18 | Policy & View Versioning | **Draft (Not Approved)** | `docs/12-migration/slice-18/` |
| 19 | Performance & Caching Boundaries | **Draft (Not Approved)** | `docs/12-migration/slice-19/` |
| 20 | External Integrations & Interop | **Draft (Not Approved)** | `docs/12-migration/slice-20/` |

---

## Process Checklist (Do Not Skip)

For any slice moving from **Draft/Planned → In Progress → Completed**:
- Update the slice spec to **Planned** (approved) with acceptance criteria finalized.
- Implement code + tests behind existing governance boundaries.
- Run verification commands.
- Add **Evidence** links to the slice spec (code paths + tests).
- Mark the slice spec as **Completed** and add a closure statement (“sealed”).

