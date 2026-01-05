# Legacy Inventory

## Source Repositories
- Repo A: EHR System
- Repo B: Website Builder

Notes:
- Repo A is effectively a multi-product system: patient portal, provider portal, company/settings, and a built-in website builder.

## Inventory Table

| Area | Component | Type | Notes |
|------|-----------|------|-------|
| UI | Patient portal UI | Frontend | PHI exposure, patient-scoped |
| UI | Provider portal UI | Frontend | High risk, clinician workflows |
| UI | Company settings | Frontend | Tenant config, admin-only |
| UI | Website builder | Frontend | Non-clinical, good first slice |
| Domain | Patient models | Domain logic | PHI |
| Domain | Scheduling | Domain logic | Non-clinical |
| Domain | Access rules | Domain logic | Often embedded |
| Data | Query/repository logic | Data access | PHI scoped |
| AI | Clinical prompts | AI | High risk |
| AI | Patient-facing summaries | AI | Medium risk |
| Infra | Auth | Infra | Reusable |
| Infra | CMS | Infra | Candidate for package |
| Infra | Audit logging | Infra | Compliance-critical |
| Integrations | External APIs (FHIR, labs, schedulers) | Integrations | Migration-sensitive |
| Content | Clinical templates/forms | Content | Often under-versioned |

## Exclusions (for now)
- Any write access to the EHR primary datastore
- Any AI behavior that performs autonomous clinical decisions
- Any background jobs that mutate PHI without explicit orchestration