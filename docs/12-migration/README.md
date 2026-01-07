# Migration Planning

This phase plans the migration of legacy systems into the platform baseline
(tag: platform-baseline-v1.0.0).

Principles:
- Docs before code
- One slice at a time
- Preserve guardrails
- Prefer composition over copying
- No clinical logic first

Important:
- This folder contains both:
  - **Migration planning + execution artifacts** (MIG-xx product migration slices)
  - **Control-plane hardening slices** (governance/operator read model work)
- The birdview boards are:
  - `docs/12-migration/migration-roadmap-birdview.md` (MIG-xx product migration)
  - `docs/12-migration/slices-birdview.md` (control-plane slices)

No additional code may be migrated until the planning documents are complete and the next slice is explicitly started.