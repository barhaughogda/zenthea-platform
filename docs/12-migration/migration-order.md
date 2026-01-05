# Migration Order

This document defines the approved order for migrating legacy components
into the platform.

## Migration Sequence

1. Website builder UI (non-clinical)
2. Marketing site (public)
3. CMS package
4. Shared UI components (packages/ui)
5. Patient portal UI (read-only)
6. Scheduling proposals
7. Patient-facing AI summaries
8. Clinical documentation (draft-only)
9. Medical advisor (clinical AI)
10. Core patient record ownership (future phase)

## Rationale

- Early steps carry zero or minimal HIPAA risk
- Frontend-first validates composition and SDK usage
- Services are introduced only after UI patterns are stable
- Clinical AI is migrated last to preserve safety and trust