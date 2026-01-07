# Migration Roadmap Birdview (MIG-00+)

This document tracks **product migration slices** for moving the original Zenthea into the monorepo.

Rules:
- This roadmap is separate from **control-plane slices** to avoid numbering collisions.
- Use the `MIG-xx` prefix here (example: `MIG-03`).
- Do not mark a slice **Completed** unless it is sealed (completion doc + evidence).

Legend:
- **Completed**: implemented + verified + sealed (docs + code aligned)
- **In Progress**: actively being implemented
- **Planned**: agreed plan exists but not started
- **Draft (Not Approved)**: placeholder only
- **Unknown**: not documented

---

## Migration Slice Table

| MIG ID | Name | Status | Evidence / Notes |
|------:|------|--------|------------------|
| MIG-00 | Platform Foundation | **Completed** | Platform baseline and consolidation completed; see `docs/11-next-phases/` and baseline tag references. |
| MIG-01 | Website Builder (Public, Non-Clinical) | **Completed** | `docs/12-migration/slice-01/slice-01-complete.md` |
| MIG-02A | Marketing Site (Optional / Parallel) | **Planned** | Not yet specified in this repo as a slice. |
| MIG-02B | Patient Portal (PHI, Controlled) | **Completed** | `docs/12-migration/Slice-02B/slice-02B-complete.md` |
| MIG-03 | Provider Portal (Clinical Workflows) | **Draft (Not Approved)** | `docs/12-migration/mig-03-provider-portal.md` |
| MIG-04 | Clinical Documentation & Write Paths (HITL) | **Planned** | Do not start until governance + operator surfaces are hardened. |
| MIG-05 | Scheduling, Billing & Operations | **Planned** | Depends on write-plane discipline and entitlements. |
| MIG-06 | Automation & Agent Orchestration | **Planned** | Only after safety + auditability are structurally proven. |
| MIG-07 | External Integrations (FHIR, Labs, Payers) | **Planned** | Only after platform is stable and governed. |
| MIG-08 | Compliance, Audits & Enterprise Hardening | **Planned** | Enterprise controls and reporting. |
| MIG-09 | Scale, Performance & Multi-Tenant Optimization | **Planned** | Only after correctness is proven. |
| MIG-10 | Production AI Governance & Continuous Learning | **Planned** | Long-term learning loops and model lifecycle. |

