# Classification

Classify each inventory item into ONE bucket.

## Buckets
- App (UI product)
- Service (domain or agent)
- Package (shared primitive)
- External (stays outside platform)

## Classification Table

| Component | Bucket | Reason |
|----------|--------|--------|
| Marketing site | App | Public-facing UI |
| Website builder UI | App | Non-clinical product UI |
| Patient portal UI | App | Patient-facing product |
| Provider portal UI | App | Clinician-facing product |
| Company settings UI | App | Tenant/admin product |
| Scheduling | Service | Domain capability |
| Clinical AI (advisor, docs) | Service (agent) | Governed AI behavior |
| Patient-facing summaries (AI) | Service (agent) | PHI-aware AI |
| Patient models | Service | Domain ownership |
| Access rules | Service | Authorization logic |
| Query/repository logic | Service | Data access boundary |
| Auth | Package | Shared platform primitive |
| CMS | Package | Shared content system |
| Audit logging | Package | Compliance-critical primitive |
| Clinical templates/forms | Package | Shared structured content |
| External APIs (FHIR, labs, schedulers) | External | Vendor-controlled systems |